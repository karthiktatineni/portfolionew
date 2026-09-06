import os
import io
import wave
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
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip() or os.getenv("VITE_GROQ_API_KEY", "").strip()
GROQ_LLM_URL = "https://api.groq.com/openai/v1/chat/completions"

# Lazy-loaded Whisper model instance
_whisper_model = None

# Known Whisper silence hallucination patterns
HALLUCINATIONS = {
    "thank you", "thank you.", "thank you!", "thank you for watching",
    "thank you for watching.", "subtitles by", "subtitles by amara.org",
    "thanks for watching!", "thanks for watching."
}

# Elite Whisper models - ONLY the highest accuracy models available
WHISPER_MODELS_TO_TRY = [
    "large-v3",              # Absolute best accuracy, massive model
    "large-v2",              # Previous gold standard, very high accuracy  
    "medium.en"              # Fallback English-only with good accuracy
]

# Elite transcription parameters for maximum accuracy
WHISPER_ELITE_CONFIG = {
    "beam_size": 10,                    # Maximum beam search for best results
    "best_of": 10,                      # Top 10 candidates to evaluate
    "temperature": 0.0,                 # Zero randomness/deterministic
    "compression_ratio_threshold": 2.4, # Balancer accuracy vs brevity
    "no_speech_threshold": 0.6,         # Threshold for silence detection
    "condition_on_previous_text": True, # Use conversation context
    "initial_prompt": "My name is Karthik Tatineni",  # Prime model with context
    "prefix": "My name is Karthik Tatineni",         # Force name at start
    "suppress_tokens": [],             # Don't suppress any tokens
    "word_timestamps": True,           # Get detailed timing
    " Vad_filter": True,               # Advanced voice activity detection
}

# Enhanced VAD parameters for precise speech detection
VAD_ELITE_CONFIG = {
    "min_silence_duration_ms": 300,    # Shorter silences between phrases
    "speech_pad_ms": 300,              # Capture speech start/end precisely
    "threshold": 0.45,                 # Sensitive but not too aggressive
    "min_speech_duration_ms": 250,     # Minimum speech duration to consider
}

def fix_karthik_phonetics(text: str) -> str:
    if not text:
        return ""
    pattern = r"\b(karki|karkis|karki\'s|karkey|kendi|carthik|carthiks|carthik\'s|carthage|cardiac|car thick|car tick|garlic|car pick|target|targets|target\'s)\b"
    def replacer(match):
        val = match.group(0).lower()
        if val.endswith("\'s") or val in ("targets", "karkis", "carthiks", "target\'s"):
            return "Karthik\'s"
        return "Karthik"
    return re.sub(pattern, replacer, text, flags=re.IGNORECASE)

def elite_post_processing(text: str) -> str:
    """Advanced post-processing for maximum transcription accuracy"""
    if not text:
        return ""
    
    # Fix common mishearings of "Elmi" and related patterns (improved patterns)
    text = re.sub(r'\belmi\b', 'My name', text, flags=re.IGNORECASE)
    text = re.sub(r'\belmii\b', 'My name', text, flags=re.IGNORECASE)
    text = re.sub(r'\belmy\b', 'My name', text, flags=re.IGNORECASE)
    text = re.sub(r'\belmio\b', 'My name', text, flags=re.IGNORECASE)
    text = re.sub(r'\bellamie\b', 'My name', text, flags=re.IGNORECASE)
    
    # Fix "evo" mishearings - remove "e I" pattern and standalone "am"
    text = re.sub(r'\bmy name i\b', 'My name', text, flags=re.IGNORECASE)
    text = re.sub(r'\bmy name am\b', 'My name', text, flags=re.IGNORECASE)
    text = re.sub(r'\bevo\b', 'is', text, flags=re.IGNORECASE)
    text = re.sub(r'\beva\b', 'is', text, flags=re.IGNORECASE)
    
    # Fix "karnik" -> "Karthik" (expanded patterns)
    text = re.sub(r'\bkarnik\b', 'Karthik', text, flags=re.IGNORECASE)
    text = re.sub(r'\bkarni\b', 'Karthik', text, flags=re.IGNORECASE)
    text = re.sub(r'\bkarnick\b', 'Karthik', text, flags=re.IGNORECASE)
    text = re.sub(r'\bkarnic\b', 'Karthik', text, flags=re.IGNORECASE)
    text = re.sub(r'\bkarnie\b', 'Karthik', text, flags=re.IGNORECASE)
    text = re.sub(r'\bkardick\b', 'Karthik', text, flags=re.IGNORECASE)
    text = re.sub(r'\bkardic\b', 'Karthik', text, flags=re.IGNORECASE)
    
    # Fix "karki" -> "Karthik" (expanded patterns)
    text = re.sub(r'\bkarki\b', 'Karthik', text, flags=re.IGNORECASE)
    text = re.sub(r'\bkarkie\b', 'Karthik', text, flags=re.IGNORECASE)
    text = re.sub(r'\bkarkis\b', 'Karthik', text, flags=re.IGNORECASE)
    
    # Fix "carthik" -> "Karthik" (expanded patterns)
    text = re.sub(r'\bcarthik\b', 'Karthik', text, flags=re.IGNORECASE)
    text = re.sub(r'\bcarthic\b', 'Karthik', text, flags=re.IGNORECASE)
    text = re.sub(r'\bcarthicks\b', 'Karthik', text, flags=re.IGNORECASE)
    
    # Fix "car tick" -> "Karthik" (expanded patterns)
    text = re.sub(r'\bcar tick\b', 'Karthik', text, flags=re.IGNORECASE)
    text = re.sub(r'\bcar\s*tick\b', 'Karthik', text, flags=re.IGNORECASE)
    
    # Fix "car" name patterns -> "Karthik"
    text = re.sub(r'\bcar\s*k\b', 'Karthik', text, flags=re.IGNORECASE)
    text = re.sub(r'\bcar\s*key\b', 'Karthik', text, flags=re.IGNORECASE)
    
    # Fix "tata" -> "Tatineni" (expanded patterns)
    text = re.sub(r'\btata\b', 'Tatineni', text, flags=re.IGNORECASE)
    text = re.sub(r'\btater\b', 'Tatineni', text, flags=re.IGNORECASE)
    text = re.sub(r'\btatter\b', 'Tatineni', text, flags=re.IGNORECASE)
    text = re.sub(r'\btate\b', 'Tatineni', text, flags=re.IGNORECASE)
    text = re.sub(r'\btatenni\b', 'Tatineni', text, flags=re.IGNORECASE)
    
    # Fix "ta ta" -> "Tatineni"
    text = re.sub(r'\bta\s*ta\b', 'Tatineni', text, flags=re.IGNORECASE)
    
    # Fix "tatineni" -> "Tatineni" (capitalization)
    text = re.sub(r'\btatineni\b', 'Tatineni', text, flags=re.IGNORECASE)
    
    # Fix other common phonetic errors
    text = re.sub(r'\beis\b', 'is', text, flags=re.IGNORECASE)
    text = re.sub(r'\bthes\b', 'the', text, flags=re.IGNORECASE)
    text = re.sub(r'\bthats\b', "that's", text, flags=re.IGNORECASE)
    text = re.sub(r'\bwit\b', 'with', text, flags=re.IGNORECASE)
    
    # Clean up extra spaces and punctuation
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'\.\s+\.', '.', text)
    
    return text

def get_whisper_model():
    global _whisper_model
    if _whisper_model is None:
        try:
            from faster_whisper import WhisperModel
            for model_size in WHISPER_MODELS_TO_TRY:
                try:
                    logger.info(f"Loading elite Whisper model: {model_size} for maximum accuracy...")
                    _whisper_model = WhisperModel(
                        model_size, 
                        device="cpu", 
                        compute_type="int8"
                    )
                    logger.info(f"Successfully loaded elite Whisper model: {model_size}")
                    logger.info(f"Configuration: beam_size={WHISPER_ELITE_CONFIG['beam_size']}, best_of={WHISPER_ELITE_CONFIG['best_of']}")
                    break
                except Exception as e:
                    logger.warning(f"Could not load Whisper model {model_size}: {e}")
                    continue
        except Exception as e:
            logger.warning(f"faster-whisper import failed: {e}")
        
        if _whisper_model is None:
            _whisper_model = False
    return _whisper_model

class LLMRequest(BaseModel):
    messages: List[dict]
    system_prompt: Optional[str] = """You are Karthik's AI assistant. Your responses should be:
- NATURAL: Greet users back when they say hello, hi, hey, etc.
- CONVERSATIONAL: Maintain a friendly, engaging tone
- HELPFUL: Answer questions about Karthik when asked
- CONCISE: Keep responses brief and to the point
- APPROPRIATE: Match the user's energy and intent

CRITICAL RULES:
1. If user says "hello", "hi", "hey", etc. -> Greet them warmly and ask how you can help
2. If user asks about Karthik -> Provide information about Karthik
3. If user has questions -> Answer their specific questions directly
4. Never provide unsolicited information about Karthik when not asked

Examples:
User: "Hello" -> Assistant: "Hello! I'm Karthik's AI assistant. How can I help you today?"
User: "Tell me about Karthik" -> Assistant: "Karthik is a full-stack developer with expertise in electronics and communication engineering..."
User: "What projects has he built?" -> Assistant: "Karthik has built several projects including IoT applications and full-stack web applications..."""

class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "Chatterbox-Multilingual.en-US.Male"
    language_code: Optional[str] = "en-US"

@app.api_route("/health", methods=["GET", "HEAD"])
@app.api_route("/api/health", methods=["GET", "HEAD"])
def health_check():
    return {
        "status": "online",
        "nvidia_key_configured": bool(NVIDIA_API_KEY),
        "groq_key_configured": bool(GROQ_API_KEY),
        "whisper_available": _whisper_model is not None and _whisper_model is not False
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
            # Elite transcription with maximum accuracy configuration
            segments, _ = model.transcribe(
                tmp_path,
                beam_size=WHISPER_ELITE_CONFIG["beam_size"],           # Maximum beam search
                best_of=WHISPER_ELITE_CONFIG["best_of"],               # Top candidates evaluation
                temperature=WHISPER_ELITE_CONFIG["temperature"],       # Deterministic results
                vad_filter=True,
                vad_parameters=(
                    VAD_ELITE_CONFIG["min_silence_duration_ms"],
                    VAD_ELITE_CONFIG["speech_pad_ms"], 
                    VAD_ELITE_CONFIG["threshold"]
                ),
                initial_prompt=WHISPER_ELITE_CONFIG["initial_prompt"],  # Force context awareness
                language="en",
                condition_on_previous_text=WHISPER_ELITE_CONFIG["condition_on_previous_text"],
                word_timestamps=WHISPER_ELITE_CONFIG["word_timestamps"],
                no_speech_threshold=WHISPER_ELITE_CONFIG["no_speech_threshold"]
            )
            # Extract and verify transcript segments
            segments_list = list(segments)
            transcript = " ".join([segment.text for segment in segments_list]).strip()
            
            # Additional accuracy check - if empty but should have content
            if not transcript and len(audio_bytes) > 1000:
                logger.warning("Empty transcript with valid audio, retrying with relaxed settings")
                segments_fallback, _ = model.transcribe(
                    tmp_path,
                    beam_size=5,
                    best_of=3,
                    temperature=0.3,  # Slight randomness for retry
                    initial_prompt=WHISPER_ELITE_CONFIG["initial_prompt"],
                    language="en"
                )
                transcript = " ".join([segment.text for segment in segments_fallback]).strip()
        else:
            try:
                import whisper
                # Elite fallback configuration
                py_model = whisper.load_model("large-v3")
                result = py_model.transcribe(
                    tmp_path,
                    initial_prompt=WHISPER_ELITE_CONFIG["initial_prompt"],
                    language="en",
                    temperature=WHISPER_ELITE_CONFIG["temperature"],
                    beam_size=8,          # High beam for fallback
                    best_of=8,            # High best_of for fallback
                    fp16=False,
                    word_timestamps=True,
                    condition_on_previous_text=True
                )
                transcript = result.get("text", "").strip()
                logger.info("Elite fallback transcription completed")
            except Exception as ex:
                logger.error(f"Elite fallback transcription failed: {ex}")
                return {"text": "", "error": "Whisper model unavailable"}

        if os.path.exists(tmp_path):
            os.remove(tmp_path)

        if transcript.lower().strip() in HALLUCINATIONS:
            logger.info(f"Filtered hallucinated silence phrase: '{transcript}'")
            transcript = ""

        # Apply elite name correction and post-processing
        transcript = fix_karthik_phonetics(transcript)
        transcript = elite_post_processing(transcript)
        
        return {"text": transcript}

    except HTTPException as he:
        return {"text": "", "error": str(he.detail)}
    except Exception as e:
        logger.error(f"STT processing error: {e}")
        return {"text": "", "error": str(e)}

# ============================================================
# 2. LLM - NVIDIA FAST RESPONSE MODEL (WITH GROQ FALLBACK)
# ============================================================
@app.post("/api/llm")
async def llm_answer(req: LLMRequest):
    """Generates an answer using NVIDIA fast response LLM models with Groq fallback."""
    if not NVIDIA_API_KEY and not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Neither NVIDIA_API_KEY nor GROQ_API_KEY is configured.")

    formatted_messages = []
    if req.system_prompt:
        formatted_messages.append({"role": "system", "content": req.system_prompt})
    formatted_messages.extend(req.messages)

    last_error = ""

    # 1. Try NVIDIA AI Cloud Models (verified active models)
    if NVIDIA_API_KEY:
        headers = {
            "Authorization": f"Bearer {NVIDIA_API_KEY}",
            "Content-Type": "application/json"
        }
        nvidia_models = [
            "meta/llama-3.2-11b-vision-instruct",
            "openai/gpt-oss-20b",
            "meta/llama-3.2-90b-vision-instruct"
        ]

        for model_name in nvidia_models:
            try:
                payload = {
                    "model": model_name,
                    "messages": formatted_messages,
                    "temperature": 0.7,
                    "max_tokens": 256,
                    "top_p": 0.9
                }
                resp = requests.post(NVIDIA_LLM_URL, headers=headers, json=payload, timeout=12)
                if resp.status_code == 200:
                    data = resp.json()
                    content = data["choices"][0]["message"]["content"]
                    return {"response": content, "model_used": model_name}
                else:
                    last_error = f"NVIDIA Model {model_name} returned status {resp.status_code}: {resp.text}"
                    logger.warning(last_error)
            except Exception as err:
                last_error = str(err)
                logger.warning(f"Error invoking NVIDIA model {model_name}: {err}")

    # 2. Fallback to Groq API if NVIDIA models are unavailable
    if GROQ_API_KEY:
        logger.info("Falling back to Groq API for LLM response...")
        groq_headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        groq_models = [
            "openai/gpt-oss-120b",
            "openai/gpt-oss-20b",
            "qwen/qwen3.8-27b"
        ]
        for model_name in groq_models:
            try:
                payload = {
                    "model": model_name,
                    "messages": formatted_messages,
                    "temperature": 0.7,
                    "max_tokens": 256
                }
                resp = requests.post(GROQ_LLM_URL, headers=groq_headers, json=payload, timeout=10)
                if resp.status_code == 200:
                    data = resp.json()
                    content = data["choices"][0]["message"]["content"]
                    if content:
                        return {"response": content, "model_used": f"groq:{model_name}"}
                else:
                    last_error = f"Groq Model {model_name} returned status {resp.status_code}: {resp.text}"
                    logger.warning(last_error)
            except Exception as err:
                last_error = str(err)
                logger.warning(f"Error invoking Groq model {model_name}: {err}")

    raise HTTPException(status_code=500, detail=f"Failed to get response from AI APIs: {last_error}")

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

        metadata = [
            ("function-id", NVIDIA_RIVA_FUNCTION_ID),
            ("authorization", f"Bearer {NVIDIA_API_KEY}")
        ]

        # Use metadata_args for nvidia-riva-client >= 2.14, with fallback for custom_metadata
        try:
            auth = riva.client.Auth(
                metadata_args=metadata,
                use_ssl=True,
                uri=NVIDIA_RIVA_SERVER
            )
        except TypeError:
            auth = riva.client.Auth(
                custom_metadata=metadata,
                use_ssl=True,
                uri=NVIDIA_RIVA_SERVER
            )

        service = riva.client.SpeechSynthesisService(auth)

        # Attempt synthesis with requested voice, fallback to server default voice
        try:
            resp = service.synthesize(
                text=req.text,
                voice_name=req.voice or "Chatterbox-Multilingual.en-US.Male",
                language_code=req.language_code or "en-US",
                sample_rate_hz=22050
            )
        except Exception as voice_err:
            logger.warning(f"TTS synthesis with voice '{req.voice}' failed ({voice_err}), trying default voice...")
            resp = service.synthesize(
                text=req.text,
                voice_name=None,
                language_code=req.language_code or "en-US",
                sample_rate_hz=22050
            )

        pcm_data = resp.audio
        # Ensure output has a standard WAV RIFF header for reliable browser playback
        if not pcm_data.startswith(b"RIFF"):
            wav_io = io.BytesIO()
            with wave.open(wav_io, "wb") as wav_file:
                wav_file.setnchannels(1)
                wav_file.setsampwidth(2)  # 16-bit PCM = 2 bytes
                wav_file.setframerate(22050)
                wav_file.writeframes(pcm_data)
            wav_bytes = wav_io.getvalue()
        else:
            wav_bytes = pcm_data

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

    # Enhanced greeting detection and immediate response for greetings
    greeting_patterns = ['hello', 'hi', 'hey', 'hi there', 'hello there', 'good morning', 'good afternoon', 'good evening']
    lower_transcript = transcript.lower().strip()
    
    # Check for greetings and provide immediate warm response
    is_greeting = any(pattern in lower_transcript for pattern in greeting_patterns)
    
    if is_greeting:
        # Immediate warm response for greetings
        answer_text = "Hello! I'm Karthik's AI assistant. How can I help you today?"
        logger.info(f"Detected greeting: '{transcript}' -> responding with greeting")
    else:
        # Step 2: LLM for non-greeting inputs
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
