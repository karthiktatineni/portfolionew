import sys
import uvicorn

if __name__ == "__main__":
    print("Starting NVIDIA Voice AI Backend (Whisper STT + NVIDIA LLM + Riva TTS)...")
    print("Listening on http://127.0.0.1:8000")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
