import React from 'react';
import { motion } from 'framer-motion';
import TiltCard from './TiltCard';

const certifications = [
    {
        title: "MySQL & Database Management: Create, Manage & Query Databases",
        issuer: "Udemy",
        url: "https://www.udemy.com/certificate/UC-0e5326e8-9e6b-4f48-90d7-28302959799e/"
    },
    {
        title: "GenAI For Image & Video Creation",
        issuer: "Udemy",
        url: "https://www.udemy.com/certificate/UC-24549cd5-a03a-4702-8296-ff6c18b4a290/"
    },
    {
        title: "HTML & CSS: The Complete Web Development Guide",
        issuer: "Udemy",
        url: "https://www.udemy.com/certificate/UC-63fd98e5-921f-4c84-a8fd-e6ec7d72f3be/"
    },
    {
        title: "Data Science basics using python(Field Project)",
        issuer: "NSIC",
        url: "https://www.tatinenikarthik.online/nsiccert.jpeg"
    },
    {
        title: "Claude 101",
        issuer: "Anthropic",
        url: "https://verify.skilljar.com/c/px7xd4erd3j5"
    },
    {
        title: "Claude Code Certification",
        issuer: "Anthropic",
        subCerts: [
            {
                title: "Claude Code 101",
                url: "https://verify.skilljar.com/c/3jbrx9vwaxrd"
            },
            {
                title: "Claude Code in Action",
                url: "https://verify.skilljar.com/c/x394gy9h2gvu"
            }
        ]
    }
];

export default function Certifications() {
    return (
        <section id="certifications" className="py-32 border-t border-[#262626] relative z-20 bg-[#0a0a0a]">
            <div className="container mx-auto px-6 max-w-[1400px]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1 }}
                    className="mb-16"
                >
                    <span className="text-gold font-display text-xs tracking-[0.3em] uppercase block mb-4">Achievements</span>
                    <h2 className="text-5xl md:text-6xl font-bold font-display text-white">
                        Publications & Certifications
                    </h2>
                </motion.div>

                {/* Publications Subtopic */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <h3 className="text-2xl font-bold text-white border-b border-[#262626] pb-4">Publications</h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <TiltCard className="h-full">
                            <div className="p-8 bg-[#141414] border border-[#262626] hover:border-gold/40 rounded-sm transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(201,168,76,0.15)] h-full flex flex-col justify-between">
                                <div>
                                    <div className="text-gold text-xs uppercase tracking-widest font-bold mb-4">
                                        Research Paper
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">
                                        Helmet and Triple-Ride Detection Using YOLO and CNN
                                    </h3>
                                    <p className="text-[#a3a3a3] text-sm mb-2">
                                        <span className="text-white">Authors:</span> Tatineni Karthik Sai
                                    </p>
                                    <p className="text-gold text-sm font-bold mb-6">
                                        ICMCER 2026 (Scopus Indexed)
                                    </p>
                                </div>
                                <a
                                    href="https://www.tatinenikarthik.online/Cert.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-6 py-3 bg-[#171717] border border-[#262626] text-white text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-black transition-colors rounded-sm text-center"
                                >
                                    View Certificate
                                </a>
                            </div>
                        </TiltCard>
                    </motion.div>
                </div>

                {/* Certifications Subtopic */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <h3 className="text-2xl font-bold text-white border-b border-[#262626] pb-4">Certifications</h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certifications.map((cert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full"
                        >
                            <TiltCard className="h-full">
                                <div className="p-8 bg-[#141414] border border-[#262626] hover:border-gold/40 rounded-sm transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(201,168,76,0.15)] h-full flex flex-col justify-between">
                                    <div>
                                        <div className="text-gold text-xs uppercase tracking-widest font-bold mb-4">
                                            {cert.issuer}
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-8 leading-snug">
                                            {cert.title}
                                        </h3>
                                        {cert.subCerts && (
                                            <div className="flex flex-col gap-3 mb-6">
                                                {cert.subCerts.map((sub, i) => (
                                                    <a
                                                        key={i}
                                                        href={sub.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between group"
                                                    >
                                                        <span className="text-[#a3a3a3] text-sm group-hover:text-gold transition-colors">{sub.title}</span>
                                                        <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {!cert.subCerts && (
                                        <a
                                            href={cert.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block px-6 py-3 bg-[#171717] border border-[#262626] text-white text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-black transition-colors rounded-sm text-center"
                                        >
                                            View Certificate
                                        </a>
                                    )}
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
