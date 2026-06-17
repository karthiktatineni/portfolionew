import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PhoneCall } from 'lucide-react';
import Turnstile from 'react-turnstile';

export default function RequestCallModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        category: 'Freelance Project',
        message: ''
    });
    const [turnstileToken, setTurnstileToken] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const categories = [
        "Freelance Project",
        "Internship",
        "Collaboration",
        "Technical Consultation",
        "General Inquiry"
    ];

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Client-side phone validation logic
    const validatePhone = (phone) => {
        // Strip out non-digits
        const digits = phone.replace(/\D/g, '');
        // Must be exactly 10 digits for Indian numbers, or 12 if starts with 91
        if (digits.length === 10) {
            return `+91${digits}`;
        }
        if (digits.length === 12 && digits.startsWith('91')) {
            return `+${digits}`;
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        
        if (formData.name.trim().length < 2) {
            setErrorMessage('Name must be at least 2 characters long.');
            return;
        }

        const validPhone = validatePhone(formData.phone);
        if (!validPhone) {
            setErrorMessage('Please enter a valid 10-digit Indian phone number.');
            return;
        }

        if (!turnstileToken) {
            setErrorMessage('Please complete the security check.');
            return;
        }

        setStatus('loading');

        try {
            const response = await fetch('/api/request-call', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    phone: validPhone,
                    turnstileToken
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to request call');
            }

            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                onClose();
                setFormData({ name: '', phone: '', email: '', category: 'Freelance Project', message: '' });
                setTurnstileToken('');
            }, 3000);
            
        } catch (error) {
            setStatus('error');
            setErrorMessage(error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
                    >
                        {/* Close button */}
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3 font-display">
                                <PhoneCall className="text-gold" />
                                Request AI Call
                            </h2>
                            <p className="text-gray-400 text-sm mt-2">
                                Karthik's AI assistant will call you to discuss your inquiry.
                            </p>
                        </div>

                        {status === 'success' ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-12 text-center"
                            >
                                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                                    <PhoneCall size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Call Requested Successfully!</h3>
                                <p className="text-gray-400 text-sm">
                                    Our AI assistant has queued your request and will call you shortly.
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold block mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors text-sm"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold block mb-2">Phone Number *</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-4 bg-white/5 border border-r-0 border-white/10 rounded-l-lg text-gray-400 text-sm">
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-r-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors text-sm"
                                            placeholder="9876543210"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-1">10-digit Indian mobile number</p>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold block mb-2">Email (Optional)</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors text-sm"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold block mb-2">What can I help you with?</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {categories.map(cat => (
                                            <label key={cat} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors text-sm ${formData.category === cat ? 'bg-gold/10 border-gold text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                                                <input 
                                                    type="radio" 
                                                    name="category" 
                                                    value={cat}
                                                    checked={formData.category === cat}
                                                    onChange={handleChange}
                                                    className="hidden"
                                                />
                                                {/* Custom radio circle */}
                                                <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${formData.category === cat ? 'border-gold' : 'border-gray-500'}`}>
                                                    {formData.category === cat && <div className="w-2 h-2 bg-gold rounded-full" />}
                                                </div>
                                                {cat}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold block mb-2">Additional Message (Optional)</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors text-sm resize-none"
                                        placeholder="Any specific details you want to share before the call..."
                                    ></textarea>
                                </div>

                                <div className="pt-2">
                                    <Turnstile
                                        sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'} // dummy key fallback for dev
                                        onVerify={(token) => setTurnstileToken(token)}
                                        theme="dark"
                                    />
                                </div>

                                {errorMessage && (
                                    <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full px-6 py-4 bg-gold text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-all rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {status === 'loading' ? (
                                            <span className="animate-pulse">Queuing Request...</span>
                                        ) : (
                                            <>
                                                Request AI Call
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
