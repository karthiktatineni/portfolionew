import { db } from '../../lib/firebase-admin.js';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verify authentication
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.admin_token;

    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_dev_only');
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    try {
        const snapshot = await db.collection('leads')
            .orderBy('createdAt', 'desc')
            .get();

        const leads = [];
        snapshot.forEach(doc => {
            leads.push({ id: doc.id, ...doc.data() });
        });

        // Convert Firestore Timestamps to ISO strings for JSON serialization
        const serializedLeads = leads.map(lead => ({
            ...lead,
            createdAt: lead.createdAt?.toDate ? lead.createdAt.toDate().toISOString() : null,
            updatedAt: lead.updatedAt?.toDate ? lead.updatedAt.toDate().toISOString() : null,
            callRequestedAt: lead.callRequestedAt?.toDate ? lead.callRequestedAt.toDate().toISOString() : null,
        }));

        return res.status(200).json({ leads: serializedLeads });
    } catch (error) {
        console.error("Error fetching leads:", error);
        return res.status(500).json({ error: 'Failed to fetch leads' });
    }
}
