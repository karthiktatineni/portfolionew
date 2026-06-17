/**
 * POST /api/start-call
 * 
 * Called from the Dashboard to trigger an AI call.
 * Forwards the request to the Voice Agent Server (Render).
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { leadId } = req.body;

    if (!leadId) {
        return res.status(400).json({ error: 'leadId is required' });
    }

    // The voice agent server URL (Render deployment)
    const VOICE_SERVER_URL = process.env.VOICE_SERVER_URL || 'http://localhost:3001';
    const API_SECRET = process.env.VOICE_SERVER_API_SECRET || '';

    try {
        const response = await fetch(`${VOICE_SERVER_URL}/api/start-call`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_SECRET,
            },
            body: JSON.stringify({ leadId }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Failed to reach voice server:', error);
        return res.status(502).json({ error: 'Voice server unreachable' });
    }
}
