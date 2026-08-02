export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Use VOICE_SERVER_URL for server-side ping, fallback to frontend env var, then localhost
        const voiceServerUrl = process.env.VITE_VOICE_BACKEND_URL;

        // Ping the voice server (STT backend)
        const response = await fetch(`${voiceServerUrl}/docs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        return res.status(200).json({
            status: 'ok',
            backendStatus: data.status || 'unknown',
            timestamp: new Date().toISOString(),
            serverUrl: voiceServerUrl,
            message: 'Backend server kept alive'
        });
    } catch (error) {
        console.error('Ping error:', error);
        // Don't fail the ping, just return error status - this keeps the frontend functional
        return res.status(200).json({
            status: 'error',
            error: 'Backend server not reachable',
            timestamp: new Date().toISOString(),
            message: 'Backend server offline or unreachable'
        });
    }
}
