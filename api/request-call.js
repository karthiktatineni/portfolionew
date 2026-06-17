import { db, FieldValue, Timestamp } from './lib/firebase-admin.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, phone, email, category, message, turnstileToken } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    if (!name || !phone || !turnstileToken) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Verify Turnstile
    const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA'; // Dummy fallback
    try {
        const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: TURNSTILE_SECRET,
                response: turnstileToken
            })
        });
        const verifyData = await verifyRes.json();
        
        if (process.env.NODE_ENV === 'production') {
            if (!verifyData.success) {
                return res.status(403).json({ error: 'CAPTCHA verification failed' });
            }
            
            // Hostname verification (prevent token reuse across domains)
            const expectedHostname = process.env.EXPECTED_HOSTNAME || 'localhost';
            if (expectedHostname !== 'localhost' && verifyData.hostname !== expectedHostname) {
                return res.status(403).json({ error: 'Invalid hostname for CAPTCHA' });
            }

            // Challenge timestamp verification (prevent old tokens)
            if (verifyData.challenge_ts) {
                const challengeTime = new Date(verifyData.challenge_ts).getTime();
                if (Date.now() - challengeTime > 5 * 60 * 1000) { // 5 minutes
                    return res.status(403).json({ error: 'CAPTCHA challenge expired' });
                }
            }
        }
    } catch (error) {
        console.error("Turnstile error:", error);
        return res.status(500).json({ error: 'Error verifying CAPTCHA' });
    }

    // 2. Validate Phone Format (+91 strictly)
    if (!/^\+91\d{10}$/.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone format. Must be +91 followed by 10 digits.' });
    }

    try {
        
        // 3. Rate Limiting (max 3 requests per phone per day)
        // Check requests from this phone number in the last 24 hours
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const snapshot = await db.collection('leads')
            .where('phone', '==', phone)
            .get();

        const recentPhoneLeads = snapshot.docs.filter(doc => {
            const data = doc.data();
            return data.createdAt && data.createdAt.toDate() >= oneDayAgo;
        });

        if (recentPhoneLeads.length >= 3) {
            return res.status(429).json({ error: 'Rate limit exceeded. Maximum 3 requests per day.' });
        }

        // IP-based Rate Limiting (max 3 requests per IP per day)
        if (ip !== 'unknown') {
            const ipSnapshot = await db.collection('leads')
                .where('ip', '==', ip)
                .get();

            const recentIpLeads = ipSnapshot.docs.filter(doc => {
                const data = doc.data();
                return data.createdAt && data.createdAt.toDate() >= oneDayAgo;
            });

            if (recentIpLeads.length >= 3) {
                return res.status(429).json({ error: 'Rate limit exceeded for your IP address.' });
            }
        }

        // 4. Create Lead
        const newLead = {
            name,
            phone,
            email: email || '',
            category: category || 'General Inquiry',
            message: message || '',
            status: 'queued',
            ip,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            callRequestedAt: FieldValue.serverTimestamp(),
            source: 'portfolio',
            assignedTo: 'Karthik',
            callSid: '',
            callDuration: 0,
            summary: '',
            transcript: '',
            leadScore: 0
        };

        const docRef = await db.collection('leads').add(newLead);

        // Success response
        return res.status(200).json({ 
            success: true, 
            message: 'Call requested successfully',
            leadId: docRef.id 
        });

    } catch (error) {
        console.error("Error creating lead:", error);
        return res.status(500).json({ error: 'Internal server error processing your request.' });
    }
}
