export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const voiceServerUrl = process.env.VOICE_SERVER_URL || 'http://localhost:3001';
        
        // Ping the voice server
        const response = await fetch(`${voiceServerUrl}/health`);
        const data = await response.json();

        return res.status(200).json({ 
            status: 'ok', 
            voiceServer: data.status,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Ping error:', error);
        return res.status(500).json({ error: 'Failed to ping voice server' });
    }
}
