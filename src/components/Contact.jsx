import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useUnicornStudio } from '../hooks/useUnicornStudio';
import { Github, Linkedin, Mail, Phone, MapPin, ExternalLink, Twitter, Instagram } from 'lucide-react';

export default function Contact() {
    // Initialize UnicornStudio background
    useUnicornStudio({
        projectId: "your-unicorn-project-id",
        elementId: "contact-bg"
    });

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        if (!db) {
            setTimeout(() => {
                setStatus('error');
                setErrorMessage('Firebase not configured. Please set up your .env file with API keys.');
            }, 1000);
            return;
        }

        try {
            await addDoc(collection(db, "contacts"), {
                ...formData,
                timestamp: serverTimestamp()
            });

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error("Error adding document: ", error);
            setStatus('error');
            setErrorMessage('Failed to send message. Please try again later.');
        }
    };

    return (
        <section id="contact" className="relative min-h-screen py-32 flex items-center justify-center overflow-hidden text-white">

            {/* Background Container for UnicornStudio */}
            <div id="contact-bg" className="absolute inset-0 z-0 opacity-20"></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent z-10 pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-20 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* LEFT SIDE: CONTACT INFO */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-gold font-display text-xs tracking-[0.3em] uppercase block mb-4">Connect</span>
                        <h2 className="text-5xl md:text-7xl font-bold font-display text-white mb-8">
                            Let's <span className="text-transparent stroke-text-gold">Talk</span>
                        </h2>

                        <p className="text-gray-400 mb-12 max-w-md leading-relaxed">
                            Looking to build something extraordinary? I'm available for freelance opportunities and full-time collaborations.
                        </p>

                        <div className="space-y-8 mb-16">
                            <ContactItem
                                icon={<Mail className="w-5 h-5 text-gold" />}
                                label="Email"
                                value="karthiktatineni34@gmail.com"
                                link="mailto:karthiktatineni34@gmail.com"
                            />
                            <ContactItem
                                icon={<Phone className="w-5 h-5 text-gold" />}
                                label="Phone"
                                value="+91 7995466261"
                                link="tel:+917995466261"
                            />
                            <ContactItem
                                icon={<MapPin className="w-5 h-5 text-gold" />}
                                label="Location"
                                value="Hyderabad, India"
                            />
                        </div>

                        {/* SOCIALS */}
                        <div>
                            <span className="text-xs uppercase tracking-[0.2em] text-[#525252] block mb-6">Social Networks</span>
                            <div className="flex gap-6">
                                <SocialLink icon={<Github className="w-6 h-6" />} href="https://github.com/karthiktatineni" label="GitHub" />
                                <SocialLink icon={<Linkedin className="w-6 h-6" />} href="https://linkedin.com/in/karthik-tatineni" label="LinkedIn" />
                                <SocialLink icon={<Instagram className="w-6 h-6" />} href="https://www.instagram.com/_karthik._.14/" label="Instagram" />
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT SIDE: FORM */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label htmlFor="name" className="text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-transparent border-b border-[#262626] py-3 text-white focus:outline-none focus:border-gold transition-colors placeholder:text-[#262626]"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-transparent border-b border-[#262626] py-3 text-white focus:outline-none focus:border-gold transition-colors placeholder:text-[#262626]"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="message" className="text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full bg-transparent border-b border-[#262626] py-3 text-white focus:outline-none focus:border-gold transition-colors resize-none placeholder:text-[#262626]"
                                    placeholder="Tell me about your vision..."
                                ></textarea>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="group relative w-full px-10 py-5 bg-gold text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-all rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(201,168,76,0.2)] disabled:opacity-50"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        {status === 'loading' ? 'Encrypting & Sending...' : 'Initiate Conversation'}
                                        <ExternalLink className="w-4 h-4" />
                                    </span>
                                </button>

                                {status === 'success' && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold text-xs text-center mt-6 tracking-widest">
                                        COMMUNICATION ESTABLISHED
                                    </motion.p>
                                )}
                                {status === 'error' && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs text-center mt-6">
                                        {errorMessage || 'CONNECTION FAILED'}
                                    </motion.p>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function ContactItem({ icon, label, value, link }) {
    const content = (
        <div className="flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors border border-white/5">
                {icon}
            </div>
            <div>
                <span className="text-[10px] uppercase tracking-widest text-[#525252] block mb-1 font-bold">{label}</span>
                <span className="text-white text-sm group-hover:text-gold transition-colors">{value}</span>
            </div>
        </div>
    );

    return link ? <a href={link} target="_blank" rel="noopener noreferrer">{content}</a> : <div>{content}</div>;
}

function SocialLink({ icon, href, label }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#525252] hover:text-white hover:border-gold transition-all duration-300 relative group overflow-hidden"
        >
            <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 group-hover:text-black">
                {icon}
            </span>
        </a>
    );
}
