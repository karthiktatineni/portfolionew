import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { password } = req.body;
    const correctPassword = process.env.DASHBOARD_PASSWORD || 'admin123';

    if (password === correctPassword) {
        // Create token
        const token = jwt.sign(
            { role: 'admin' }, 
            process.env.JWT_SECRET || 'fallback_secret_for_dev_only', 
            { expiresIn: '8h' }
        );

        // Set secure HTTP-only cookie
        const cookie = serialize('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60, // 8 hours
            path: '/'
        });

        res.setHeader('Set-Cookie', cookie);
        return res.status(200).json({ success: true });
    }

    return res.status(401).json({ error: 'Invalid password' });
}
