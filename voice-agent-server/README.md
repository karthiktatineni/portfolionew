# Voice Agent Server

AI-powered voice agent for Karthik Tatineni's portfolio. Handles outbound calls via Twilio, live transcription via Deepgram, AI responses via Groq, and text-to-speech via ElevenLabs.

## Architecture

```
Portfolio Website (Vercel)
    → Firestore Lead Created
    → Voice Agent Server (Render)
        → Twilio Voice (outbound call)
        → Deepgram STT (speech-to-text)
        → Groq LLM (AI responses)
        → Deepgram Aura TTS (text-to-speech)
        → Twilio Audio Response
    → Firestore Updates
    → Portfolio Dashboard
```

## Quick Start

```bash
cd voice-agent-server
npm install
cp .env.example .env   # Fill in your API keys
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| POST | `/api/start-call` | Trigger outbound call to a lead |
| POST | `/api/twilio/voice` | Twilio voice webhook (returns TwiML) |
| POST | `/api/twilio/status` | Twilio call status webhook |
| POST | `/api/reload-knowledge` | Reload portfolio knowledge base |

## Environment Variables

See `.env.example` for the full list. Required:

- `GROQ_API_KEY` — Groq LLM API key
- `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_PHONE_NUMBER`
- `DEEPGRAM_API_KEY` — Speech-to-text and Text-to-speech (Aura)
- `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY`
- `SERVER_BASE_URL` — Public URL of this server (Render URL)

## Deployment (Render)

1. Create a new **Web Service** on Render.
2. Set **Root Directory** to `voice-agent-server`.
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add all environment variables from `.env.example`.
6. Set `SERVER_BASE_URL` to your Render URL (e.g., `https://voice-agent.onrender.com`).

## Knowledge Sync

The server imports portfolio data directly from `../src/data/userInfo.js`.

For Render deployment (where parent files don't exist), generate a snapshot:

```bash
node src/services/knowledge.js --generate
```

This creates `knowledge.json` which the server uses as fallback.
