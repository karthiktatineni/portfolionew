import { db, FieldValue } from '../../lib/firebase-admin.js';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

export default async function handler(req, res) {
    // Note: In Vercel, dynamic routes in API folder are like /api/dashboard/leads/[id].js
    const { id } = req.query;

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
        const docRef = db.collection('leads').doc(id);
        
        if (req.method === 'GET') {
            const docSnap = await docRef.get();
            if (!docSnap.exists) {
                return res.status(404).json({ error: 'Lead not found' });
            }
            const lead = { id: docSnap.id, ...docSnap.data() };
            
            // Serialize dates
            lead.createdAt = lead.createdAt?.toDate ? lead.createdAt.toDate().toISOString() : null;
            lead.updatedAt = lead.updatedAt?.toDate ? lead.updatedAt.toDate().toISOString() : null;
            lead.callRequestedAt = lead.callRequestedAt?.toDate ? lead.callRequestedAt.toDate().toISOString() : null;

            return res.status(200).json({ lead });
            
        } else if (req.method === 'PATCH') {
            const updates = req.body;
            // Prevent dangerous updates here
            delete updates.id; // Don't update ID
            
            updates.updatedAt = FieldValue.serverTimestamp();
            
            await docRef.update(updates);
            return res.status(200).json({ success: true });
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error("Error managing lead:", error);
        return res.status(500).json({ error: 'Failed to process request' });
    }
}
