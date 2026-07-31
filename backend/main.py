import os
import io
import base64
import tempfile
import logging
import re
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import requests

# Load environment variables from parent directory .env if present
parent_env = os.path.join(os.path.dirname(__file__), "..", ".env")
if os.path.exists(parent_env):
    load_dotenv(parent_env)
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("voice-backend")

app = FastAPI(title="Voice AI Backend", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "").strip()
NVIDIA_LLM_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
NVIDIA_RIVA_SERVER = "grpc.nvcf.nvidia.com:443"
NVIDIA_RIVA_FUNCTION_ID = "ddacc747-1269-4fab-bfd9-8f593dead106"

# Lazy-loaded Whisper model instance
_whisper_model = None

# Known Whisper silence hallucination patterns
HALLUCINATIONS = {
    "thank you", "thank you.", "thank you!", "thank you for watching",
    "thank you for watching.", "subtitles by", "subtitles by amara.org",
    "thanks for watching!", "thanks for watching."
}

WHISPER_MODELS_TO_TRY = ["large-v3-turbo", "large-v3", "large-v2"]

def fix_karthik_phonetics(text: str) -> str:
    if not text:
        return ""
    pattern = r"\b(karki|karkis|karki's|karkey|kendi|carthik|carthiks|carthik's|carthage|cardiac|car thick|car tick|garlic|car pick|target|targets|target's)\b"
    def replacer(match):
        val = match.group(0).lower()
        if val.endswith("'s") or val in ("targets", "karkis", "carthiks", "target's"):
            return "Karthik's"
        return "Karthik"
    return re.sub(pattern, replacer, text, flags=re.IGNORECASE)

def get_whisper_model():
    global _whisper_model
    if _whisper_model is None:
        try:
            from faster_whisper import WhisperModel
            for model_size in WHISPER_MODELS_TO_TRY:
                try:
                    logger.info(f"Initializing faster-whisper model ({model_size} with VAD)...")
                    _whisper_model = WhisperModel(model_size, device="cpu", compute_type="int8")
                    logger.info(f"Successfully loaded faster-whisper model: {model_size}")
                    break
                except Exception as e:
                    logger.warning(f"Could not load faster-whisper model {model_size}: {e}")
                    continue
        except Exception as e:
            logger.warning(f"faster-whisper import failed: {e}")
        
        if _whisper_model is None:
            _whisper_model = False
    return _whisper_model

class LLMRequest(BaseModel):
    messages: List[dict]
    system_prompt: Optional[str] = "You are Karthik's AI assistant. Keep responses clear, professional, concise, and conversational."

class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "Chatterbox-Multilingual.en-US.Male"
    language_code: Optional[str] = "en-US"

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "nvidia_key_configured": bool(NVIDIA_API_KEY),
        "whisper_available": get_whisper_model() is not False
    }

# ============================================================
# 1. STT - SPEECH TO TEXT (OpenAI Whisper Large-v3)
# ============================================================
@app.post("/api/stt")
async def speech_to_text(file: UploadFile = File(...)):
    """Transcribes uploaded audio file using OpenAI Whisper Large-v3."""
    try:
        audio_bytes = await file.read()
        if not audio_bytes or len(audio_bytes) < 500:
            return {"text": ""}

        ext = os.path.splitext(file.filename or "")[1] or ".webm"
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        transcript = ""
        model = get_whisper_model()

        if model and model is not False:
            segments, _ = model.transcribe(
                tmp_path,
                beam_size=7,
                best_of=5,
                temperature=0.0,
                vad_filter=True,
                vad_parameters=dict(
                    min_silence_duration_ms=500,
                    speech_pad_ms=400,
                    threshold=0.5
                ),
                initial_prompt="Karthik Tatineni",
                language="en",
                condition_on_previous_text=True
            )
            transcript = " ".join([segment.text for segment in segments]).strip()
        else:
            try:
                import whisper
                py_model = whisper.load_model("large-v3")
                result = py_model.transcribe(
                    tmp_path,
                    initial_prompt="Karthik Tatineni",
                    language="en",
                    temperature=0.0,
                    beam_size=5,
                    best_of=5,
                    fp16=False
                )
                transcript = result.get("text", "").strip()
            except Exception as ex:
                logger.error(f"Local Whisper transcription failed: {ex}")
                return {"text": "", "error": "Whisper model unavailable"}

        if os.path.exists(tmp_path):
            os.remove(tmp_path)

        if transcript.lower().strip() in HALLUCINATIONS:
            logger.info(f"Filtered hallucinated silence phrase: '{transcript}'")
            transcript = ""

        transcript = fix_karthik_phonetics(transcript)
        return {"text": transcript}

    except HTTPException as he:
        return {"text": "", "error": str(he.detail)}
    except Exception as e:
        logger.error(f"STT processing error: {e}")
        return {"text": "", "error": str(e)}

# ============================================================
# 2. LLM - NVIDIA FAST RESPONSE MODEL
# ============================================================
@app.post("/api/llm")
async def llm_answer(req: LLMRequest):
    """Generates an answer using NVIDIA fast response LLM models."""
    if not NVIDIA_API_KEY:
        raise HTTPException(status_code=500, detail="NVIDIA_API_KEY is not configured in .env.")

    formatted_messages = []
    if req.system_prompt:
        formatted_messages.append({"role": "system", "content": req.system_prompt})
    formatted_messages.extend(req.messages)

    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json"
    }

    # Model priority list (fast response models)
    models_to_try = [
        "meta/llama-3.1-8b-instruct",
        "nvidia/llama-3.1-nemotron-70b-instruct",
        "meta/llama-3.3-70b-instruct"
    ]

    last_error = ""
    for model_name in models_to_try:
        try:
            payload = {
                "model": model_name,
                "messages": formatted_messages,
                "temperature": 0.7,
                "max_tokens": 256,
                "top_p": 1.0
            }
            resp = requests.post(NVIDIA_LLM_URL, headers=headers, json=payload, timeout=15)
            if resp.status_code == 200:
                data = resp.json()
                content = data["choices"][0]["message"]["content"]
                return {"response": content, "model_used": model_name}
            else:
                last_error = f"Model {model_name} returned status {resp.status_code}: {resp.text}"
                logger.warning(last_error)
        except Exception as err:
            last_error = str(err)
            logger.warning(f"Error invoking NVIDIA model {model_name}: {err}")

    raise HTTPException(status_code=500, detail=f"Failed to get response from NVIDIA API: {last_error}")

# ============================================================
# 3. TTS - NVIDIA RIVA TEXT TO SPEECH (gRPC)
# ============================================================
@app.post("/api/tts")
async def text_to_speech(req: TTSRequest):
    """Synthesizes text to audio WAV format using NVIDIA Riva gRPC TTS service."""
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    if not NVIDIA_API_KEY:
        raise HTTPException(status_code=500, detail="NVIDIA_API_KEY is not configured in .env.")

    try:
        import riva.client

        auth = riva.client.Auth(
            custom_metadata=[
                ("function-id", NVIDIA_RIVA_FUNCTION_ID),
                ("authorization", f"Bearer {NVIDIA_API_KEY}")
            ],
            use_ssl=True,
            uri=NVIDIA_RIVA_SERVER
        )

        service = riva.client.SpeechSynthesisService(auth)
        resp = service.synthesize(
            text=req.text,
            voice_name=req.voice or "Chatterbox-Multilingual.en-US.Male",
            language_code=req.language_code or "en-US",
            sample_rate_hz=22050
        )

        wav_bytes = resp.audio
        return Response(content=wav_bytes, media_type="audio/wav")

    except ImportError:
        logger.error("nvidia-riva-client Python package not installed.")
        raise HTTPException(
            status_code=500,
            detail="nvidia-riva-client package is required for NVIDIA Riva TTS. Run `pip install nvidia-riva-client`."
        )
    except Exception as e:
        logger.error(f"NVIDIA Riva TTS gRPC error: {e}")
        raise HTTPException(status_code=500, detail=f"Riva TTS error: {str(e)}")

# ============================================================
# 4. FULL VOICE PIPELINE (STT -> LLM -> TTS)
# ============================================================
@app.post("/api/voice-pipeline")
async def voice_pipeline(file: UploadFile = File(...)):
    """Full pipeline: Audio input -> Whisper STT -> NVIDIA LLM answer -> NVIDIA Riva TTS audio output."""
    # Step 1: STT
    try:
        stt_res = await speech_to_text(file)
        transcript = stt_res.get("text", "").strip()
    except Exception as err:
        logger.error(f"Voice pipeline STT error: {err}")
        return {
            "transcript": "",
            "response": "Audio processing failed. Please try browser WebSpeech STT or typed commands.",
            "audio_base64": "",
            "has_audio": False
        }

    if not transcript:
        return {
            "transcript": "",
            "response": "Could not recognize any speech in the audio recording.",
            "audio_base64": "",
            "has_audio": False
        }

    # Step 2: LLM
    llm_req = LLMRequest(messages=[{"role": "user", "content": transcript}])
    llm_res = await llm_answer(llm_req)
    answer_text = llm_res.get("response", "")

    # Step 3: TTS
    audio_b64 = ""
    try:
        tts_req = TTSRequest(text=answer_text)
        tts_res = await text_to_speech(tts_req)
        wav_data = tts_res.body
        audio_b64 = base64.b64encode(wav_data).decode("utf-8")
    except Exception as ex:
        logger.warning(f"Voice pipeline TTS generation failed: {ex}")

    return {
        "transcript": transcript,
        "response": answer_text,
        "audio_base64": audio_b64,
        "has_audio": bool(audio_b64)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
