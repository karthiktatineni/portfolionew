import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Groq from 'groq-sdk';
import { buildSystemPrompt } from '../data/userInfo';

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = buildSystemPrompt();

const SUGGESTED_QUESTIONS = [
    "Tell me about Karthik",
    "What projects has he built?",
    "What are his skills?",
    "What is his college?",
    "Tell me about his IoT projects",
    "How can I contact Karthik?",
];

// Parse text into segments: plain text | markdown link | bare URL
function renderMessageContent(text) {
    // Combined regex: markdown links first, then bare URLs
    const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s]+)/g;
    const segments = [];
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
        }
        if (match[1] && match[2]) {
            // Markdown link [label](url)
            segments.push({ type: 'link', label: match[1], url: match[2] });
        } else if (match[3]) {
            // Bare URL
            segments.push({ type: 'link', label: match[3], url: match[3] });
        }
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        segments.push({ type: 'text', value: text.slice(lastIndex) });
    }

    return segments.map((seg, i) =>
        seg.type === 'link' ? (
            <a
                key={i}
                href={seg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c9a84c] underline underline-offset-2 hover:text-[#f0d080] transition-colors break-all"
            >
                {seg.label}
            </a>
        ) : (
            <span key={i}>{seg.value}</span>
        )
    );
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hey there! 👋 I'm Karthik's AI assistant. Ask me anything about Karthik — his projects, skills, background, or anything else!",
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingText]);

    // Lock background page scroll when chat is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => inputRef.current?.focus(), 300);
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Prevent wheel/touch scroll from leaking to the page
    const handleMessagesWheel = (e) => {
        e.stopPropagation();
    };

    const sendMessage = async (text) => {
        const userText = (text || input).trim();
        if (!userText || isLoading) return;

        const newMessages = [...messages, { role: 'user', content: userText }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        setStreamingText('');

        try {
            const stream = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...newMessages.map((m) => ({ role: m.role, content: m.content })),
                ],
                model: 'openai/gpt-oss-120b',
                temperature: 0.8,
                max_completion_tokens: 1024,
                top_p: 1,
                stream: true,
                reasoning_effort: 'medium',
                stop: null,
            });

            let fullText = '';
            for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta?.content || '';
                fullText += delta;
                setStreamingText(fullText);
            }

            setMessages((prev) => [...prev, { role: 'assistant', content: fullText }]);
            setStreamingText('');
        } catch (err) {
            console.error('Groq error:', err);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: '⚠️ Sorry, something went wrong. Please check your API key or try again.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                id="chatbot-toggle"
                onClick={() => setIsOpen((o) => !o)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-8 right-8 z-[9998] w-16 h-16 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#f0d080] shadow-[0_0_30px_rgba(201,168,76,0.5)] flex items-center justify-center text-black text-2xl font-bold cursor-pointer border-2 border-[#c9a84c]/40 hover:shadow-[0_0_50px_rgba(201,168,76,0.7)] transition-shadow"
                title="Chat with Karthik's AI"
            >
                <AnimatePresence mode="wait" initial={false}>
                    {isOpen ? (
                        <motion.span
                            key="close"
                            initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* X close icon */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </motion.span>
                    ) : (
                        <motion.span
                            key="open"
                            initial={{ rotate: -20, opacity: 0, scale: 0.7 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 20, opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Chat bubble icon — matches gold/dark theme */}
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.03 2 11c0 2.7 1.22 5.12 3.17 6.83L4 20.5c-.13.37.22.72.59.59l2.67-1.17A10.08 10.08 0 0 0 12 20c5.52 0 10-4.03 10-9S17.52 2 12 2zm-1 13H7v-2h4v2zm6 0h-4v-2h4v2zm0-4H7V9h10v2z" />
                            </svg>
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="chatwindow"
                        id="chatbot-window"
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                        className="fixed bottom-28 right-8 z-[9997] w-[370px] max-h-[600px] flex flex-col rounded-2xl overflow-hidden shadow-[0_8px_60px_rgba(0,0,0,0.6)] border border-white/10"
                        style={{ backdropFilter: 'blur(20px)', background: 'rgba(15,15,15,0.97)' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#111] px-5 py-4 flex items-center gap-3 border-b border-white/10">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#f0d080] flex items-center justify-center text-black font-bold text-sm shadow-lg">
                                    KT
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#111]"></span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm">Karthik's AI Assistant</h3>
                                <p className="text-green-400 text-xs font-medium">● Online · Powered by Groq</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0" style={{ maxHeight: '380px' }} onWheel={handleMessagesWheel} onTouchMove={handleMessagesWheel}>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#f0d080] flex items-center justify-center text-black text-xs font-bold mr-2 mt-1 flex-shrink-0">
                                            K
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-[#c9a84c] to-[#b8942f] text-black font-medium rounded-br-sm'
                                            : 'bg-white/5 text-gray-200 border border-white/8 rounded-bl-sm'
                                            }`}
                                    >
                                        {renderMessageContent(msg.content)}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Streaming message */}
                            {streamingText && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#f0d080] flex items-center justify-center text-black text-xs font-bold mr-2 mt-1 flex-shrink-0">
                                        K
                                    </div>
                                    <div className="max-w-[78%] px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed whitespace-pre-wrap bg-white/5 text-gray-200 border border-white/8">
                                        {renderMessageContent(streamingText)}
                                        <span className="inline-block w-1 h-4 bg-[#c9a84c] ml-1 animate-pulse rounded-sm" />
                                    </div>
                                </motion.div>
                            )}

                            {/* Loading dots */}
                            {isLoading && !streamingText && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#f0d080] flex items-center justify-center text-black text-xs font-bold mr-2 mt-1 flex-shrink-0">
                                        K
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/5 border border-white/8 flex items-center gap-1">
                                        {[0, 1, 2].map((i) => (
                                            <motion.span
                                                key={i}
                                                className="w-2 h-2 bg-[#c9a84c] rounded-full"
                                                animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            <div ref={bottomRef} />
                        </div>

                        {/* Suggested Questions */}
                        {messages.length === 1 && (
                            <div className="px-4 pb-2 flex flex-wrap gap-2">
                                {SUGGESTED_QUESTIONS.map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => sendMessage(q)}
                                        className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:border-[#c9a84c]/50 hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 transition-all duration-200"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="px-4 py-3 border-t border-white/10 flex items-end gap-2">
                            <textarea
                                ref={inputRef}
                                id="chatbot-input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask something about Karthik..."
                                rows={1}
                                disabled={isLoading}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a84c]/50 resize-none leading-5 max-h-28 overflow-y-auto transition-colors"
                                style={{ minHeight: '42px' }}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = Math.min(e.target.scrollHeight, 112) + 'px';
                                }}
                            />
                            <motion.button
                                id="chatbot-send"
                                onClick={() => sendMessage()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={isLoading || !input.trim()}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#b8942f] flex items-center justify-center text-black font-bold shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(201,168,76,0.4)] transition-shadow flex-shrink-0"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            </motion.button>
                        </div>

                        <p className="text-center text-[10px] text-gray-600 pb-2">
                            Only answers questions about Karthik Tatineni
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
