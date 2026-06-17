import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ArrowLeft, User, Phone, Mail, Clock, FileText, Activity, PhoneCall } from 'lucide-react';

export default function LeadDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [callLoading, setCallLoading] = useState(false);

    useEffect(() => {
        const fetchLead = async () => {
            if (!db) {
                setError("Firebase not configured");
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, 'leads', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setLead({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError('Lead not found');
                }
            } catch (err) {
                console.error("Error fetching lead:", err);
                setError('Error fetching lead details');
            } finally {
                setLoading(false);
            }
        };

        fetchLead();
    }, [id]);

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

    const handleCancelLead = async () => {
        if (!window.confirm("Are you sure you want to cancel this AI call request?")) return;
        
        try {
            await updateDoc(doc(db, 'leads', id), {
                status: 'cancelled'
            });
            setLead(prev => ({ ...prev, status: 'cancelled' }));
        } catch (err) {
            console.error("Error cancelling lead:", err);
            alert("Failed to cancel lead");
        }
    };

    const handleStartCall = async () => {
        if (!window.confirm(`Start AI call to ${lead.name} at ${lead.phone}?`)) return;
        setCallLoading(true);
        try {
            const res = await fetch('/api/start-call', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId: id }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to start call');
            setLead(prev => ({ ...prev, status: 'calling', callSid: data.callSid }));
            alert('Call initiated successfully!');
        } catch (err) {
            console.error("Error starting call:", err);
            alert(`Failed: ${err.message}`);
        } finally {
            setCallLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20 text-gold animate-pulse">Loading Lead...</div>;
    if (error) return <div className="text-red-400 text-center py-20">{error}</div>;
    if (!lead) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link to="/admin/leads" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm uppercase tracking-widest transition-colors">
                    <ArrowLeft size={16} /> Back to Leads
                </Link>
                
                {['pending', 'queued'].includes(lead.status) && (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleStartCall}
                            disabled={callLoading}
                            className="text-xs text-green-400 hover:text-green-300 uppercase tracking-widest font-bold border border-green-400/20 px-4 py-2 rounded-lg hover:bg-green-400/10 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <PhoneCall size={14} />
                            {callLoading ? 'Initiating...' : 'Start AI Call'}
                        </button>
                        <button 
                            onClick={handleCancelLead}
                            className="text-xs text-red-400 hover:text-red-300 uppercase tracking-widest font-bold border border-red-400/20 px-4 py-2 rounded-lg hover:bg-red-400/10 transition-colors"
                        >
                            Cancel Call
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Contact Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white font-display">Lead Info</h3>
                            <span className={`px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-full border ${getStatusColor(lead.status)}`}>
                                {lead.status || 'pending'}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <InfoRow icon={<User size={16}/>} label="Name" value={lead.name} />
                            <InfoRow icon={<Phone size={16}/>} label="Phone" value={lead.phone} isMono />
                            <InfoRow icon={<Mail size={16}/>} label="Email" value={lead.email || 'N/A'} />
                            <InfoRow 
                                icon={<Clock size={16}/>} 
                                label="Requested" 
                                value={lead.createdAt?.toDate ? new Date(lead.createdAt.toDate()).toLocaleString() : 'N/A'} 
                            />
                        </div>
                    </div>

                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white font-display mb-4">Request Details</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Category</div>
                                <div className="text-gold font-medium">{lead.category}</div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Message</div>
                                <div className="text-gray-300 text-sm whitespace-pre-wrap bg-white/5 p-3 rounded-lg border border-white/10 min-h-[80px]">
                                    {lead.message || <span className="text-gray-600 italic">No message provided</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Call Data */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white font-display mb-6 flex items-center gap-3">
                            <Activity className="text-gold" />
                            Call Metadata
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <MetaBox label="Call SID" value={lead.callSid || '—'} />
                            <MetaBox label="Duration (s)" value={lead.callDuration || 0} />
                            <MetaBox label="Lead Score" value={lead.leadScore || 0} color={lead.leadScore > 70 ? 'text-green-400' : 'text-white'} />
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <FileText size={16} className="text-gold" /> Summary
                                </h4>
                                <div className="text-gray-300 text-sm leading-relaxed bg-white/5 p-5 rounded-xl border border-white/10 min-h-[100px]">
                                    {lead.summary ? lead.summary : <span className="text-gray-600 italic">Summary will appear here after the call completes...</span>}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <FileText size={16} className="text-gold" /> Transcript
                                </h4>
                                <div className="text-gray-300 text-sm leading-relaxed bg-black/40 p-5 rounded-xl border border-white/5 font-mono whitespace-pre-wrap h-[300px] overflow-y-auto">
                                    {lead.transcript ? lead.transcript : <span className="text-gray-600 italic">Transcript will be streamed/saved here...</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value, isMono }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 text-gray-500">{icon}</div>
            <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500">{label}</div>
                <div className={`text-sm text-gray-200 ${isMono ? 'font-mono' : ''}`}>{value}</div>
            </div>
        </div>
    );
}

function MetaBox({ label, value, color = "text-white" }) {
    return (
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{label}</div>
            <div className={`font-mono text-sm ${color} truncate px-2`} title={value}>{value}</div>
        </div>
    );
}
