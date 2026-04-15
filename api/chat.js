// Vercel Serverless Function: /api/chat
// The GROQ_API_KEY lives ONLY here — never sent to the browser.
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages, systemPrompt } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    try {
        // Set headers for streaming (Server-Sent Events)
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');

        const stream = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages,
            ],
            model: 'openai/gpt-oss-120b',
            temperature: 0.8,
            max_completion_tokens: 1024,
            top_p: 1,
            stream: true,
            reasoning_effort: 'medium',
            stop: null,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                // Stream each token as an SSE event
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }

        res.write('data: [DONE]\n\n');
        res.end();
    } catch (err) {
        console.error('Groq API error:', err);
        res.status(500).json({ error: 'AI request failed', details: err.message });
    }
}
