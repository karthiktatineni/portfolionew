import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const cookies = parse(req.headers.cookie || '');
    const token = cookies.admin_token;

    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_dev_only');
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
