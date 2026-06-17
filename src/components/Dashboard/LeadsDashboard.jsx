import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Users, Phone, Clock, XCircle, CheckCircle, Activity } from 'lucide-react';

export default function LeadsDashboard() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const leadsData = [];
            querySnapshot.forEach((doc) => {
                leadsData.push({ id: doc.id, ...doc.data() });
            });
            setLeads(leadsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching leads: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const stats = {
        total: leads.length,
        queued: leads.filter(l => l.status === 'queued').length,
        calling: leads.filter(l => l.status === 'calling').length,
        completed: leads.filter(l => l.status === 'completed').length,
        failed: leads.filter(l => ['failed', 'cancelled'].includes(l.status)).length
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'queued': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'calling': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'failed':
            case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20 text-gold animate-pulse">Loading Leads...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold font-display text-white mb-2">AI Call Requests</h2>
                <p className="text-gray-400 text-sm">Monitor and manage leads coming from the portfolio AI call request.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard icon={<Users />} label="Total Requests" value={stats.total} />
                <StatCard icon={<Clock />} label="Queued" value={stats.queued} color="text-yellow-400" />
                <StatCard icon={<Activity />} label="Calling" value={stats.calling} color="text-blue-400" />
                <StatCard icon={<CheckCircle />} label="Completed" value={stats.completed} color="text-green-400" />
                <StatCard icon={<XCircle />} label="Failed/Cancelled" value={stats.failed} color="text-red-400" />
            </div>

            {/* Leads Table */}
            <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="text-xs text-gray-500 uppercase bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Requested</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No call requests found yet.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
                                        <td className="px-6 py-4 font-mono text-xs">{lead.phone}</td>
                                        <td className="px-6 py-4">{lead.category}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded border ${getStatusColor(lead.status)}`}>
                                                {lead.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {lead.createdAt?.toDate ? new Date(lead.createdAt.toDate()).toLocaleString() : 'Just now'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link 
                                                to={`/admin/leads/${lead.id}`}
                                                className="text-gold hover:text-white transition-colors text-xs uppercase tracking-wider font-bold"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color = "text-white" }) {
    return (
        <div className="bg-[#111] border border-white/10 p-5 rounded-2xl flex flex-col items-center text-center">
            <div className={`mb-2 ${color}`}>{React.cloneElement(icon, { size: 24 })}</div>
            <div className={`text-2xl font-bold font-display ${color} mb-1`}>{value}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500">{label}</div>
        </div>
    );
}
