import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, ArrowLeft, X, ExternalLink, Github, Terminal, Send } from 'lucide-react';
import * as THREE from 'three';
import { projects } from '../data/projects.js';
import Groq from 'groq-sdk';
import { buildSystemPrompt } from '../data/userInfo.js';

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});
const SYSTEM_PROMPT = buildSystemPrompt();

// ============================================================
// CONSTANTS
// ============================================================
const GOLD = '#c9a84c';
const GOLD_LIGHT = '#e8d48b';
const GOLD_DARK = '#a07c2a';

const NODE_COLORS = {
    tech: { base: GOLD, glow: 'rgba(201, 168, 76, 0.42)', dim: 'rgba(201, 168, 76, 0.14)' },
    category: { base: GOLD_LIGHT, glow: 'rgba(232, 212, 139, 0.46)', dim: 'rgba(232, 212, 139, 0.16)' },
    project: { base: GOLD_DARK, glow: 'rgba(160, 124, 42, 0.42)', dim: 'rgba(160, 124, 42, 0.14)' },
};
const EDGE_HIGHLIGHT = 'rgba(201, 168, 76, 0.48)';
const EDGE_DIM = 'rgba(201, 168, 76, 0.05)';
const PULSE_COLOR = 'rgba(232, 212, 139, 0.9)';
const VOICE_SYSTEM_PROMPT = `${SYSTEM_PROMPT}

CRITICAL INSTRUCTION: You are operating as JARVIS, a voice-activated holographic terminal in Karthik's portfolio.
Your responses will be spoken aloud. Keep responses extremely concise, ideally under two short sentences.
Avoid lists, code blocks, markdown, emoji, and formatting symbols. Answer directly and conversationally.`;

const cleanForSpeech = (text) => (
    text
        .replace(/[#*`_[\]()>]/g, '')
        .replace(/https?:\/\/[^\s]+/g, 'link')
        .replace(/\s+/g, ' ')
        .trim()
);

const splitCompleteSentences = (text) => {
    const sentences = [];
    let buffer = text;
    let match = buffer.match(/^([\s\S]*?[.!?])(?=\s|$)/);

    while (match) {
        const sentence = match[1].trim();
        if (sentence) sentences.push(sentence);
        buffer = buffer.slice(match[1].length).trimStart();
        match = buffer.match(/^([\s\S]*?[.!?])(?=\s|$)/);
    }

    return { sentences, remainder: buffer };
};

const RATE_LIMIT_KEY = 'jarvis_terminal_rate_limit_v1';
const RATE_LIMIT = {
    cooldownMs: 8000,
    windowMs: 10 * 60 * 1000,
    maxWindowRequests: 8,
    maxDailyRequests: 40,
};

const getDayKey = (time) => new Date(time).toISOString().slice(0, 10);

const formatWait = (ms) => {
    const seconds = Math.ceil(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.ceil(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    return `${Math.ceil(minutes / 60)}h`;
};

const readRateLimitStore = () => {
    if (typeof window === 'undefined') return null;
    try {
        return JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
    } catch {
        return {};
    }
};

const writeRateLimitStore = (store) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(store));
};

const checkRateLimit = () => {
    if (typeof window === 'undefined') return { allowed: true };

    const now = Date.now();
    const dayKey = getDayKey(now);
    const store = readRateLimitStore() || {};
    const timestamps = Array.isArray(store.timestamps)
        ? store.timestamps.filter((time) => now - time < RATE_LIMIT.windowMs)
        : [];
    const dailyCount = store.dayKey === dayKey ? Number(store.dailyCount || 0) : 0;
    const lastRequestAt = Number(store.lastRequestAt || 0);

    const cooldownRemaining = lastRequestAt + RATE_LIMIT.cooldownMs - now;
    if (cooldownRemaining > 0) {
        writeRateLimitStore({ ...store, timestamps, dayKey, dailyCount });
        return {
            allowed: false,
            message: `Rate limit active. Try again in ${formatWait(cooldownRemaining)}.`,
        };
    }

    if (timestamps.length >= RATE_LIMIT.maxWindowRequests) {
        const waitMs = RATE_LIMIT.windowMs - (now - timestamps[0]);
        writeRateLimitStore({ ...store, timestamps, dayKey, dailyCount });
        return {
            allowed: false,
            message: `Too many JARVIS requests. Try again in ${formatWait(waitMs)}.`,
        };
    }

    if (dailyCount >= RATE_LIMIT.maxDailyRequests) {
        const tomorrow = new Date(now);
        tomorrow.setUTCHours(24, 0, 0, 0);
        return {
            allowed: false,
            message: `Daily JARVIS limit reached. Try again in ${formatWait(tomorrow.getTime() - now)}.`,
        };
    }

    writeRateLimitStore({ ...store, timestamps, dayKey, dailyCount });
    return { allowed: true };
};

const recordRateLimitHit = () => {
    if (typeof window === 'undefined') return;

    const now = Date.now();
    const dayKey = getDayKey(now);
    const store = readRateLimitStore() || {};
    const timestamps = Array.isArray(store.timestamps)
        ? store.timestamps.filter((time) => now - time < RATE_LIMIT.windowMs)
        : [];
    const dailyCount = store.dayKey === dayKey ? Number(store.dailyCount || 0) : 0;

    writeRateLimitStore({
        timestamps: [...timestamps, now],
        dayKey,
        dailyCount: dailyCount + 1,
        lastRequestAt: now,
    });
};

// ============================================================
// DATA PROCESSING — builds graph nodes + edges from real data
// ============================================================
function buildGraphData(canvasW, canvasH) {
    // 1. Count tech frequency across all projects
    const techFreq = {};
    projects.forEach(p => p.technologies.forEach(t => {
        techFreq[t] = (techFreq[t] || 0) + 1;
    }));
    const topTechs = Object.entries(techFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(e => e[0]);

    // 2. Extract unique categories from projects
    const catSet = new Set();
    projects.forEach(p => p.category.split(',').map(c => c.trim()).filter(Boolean).forEach(c => catSet.add(c)));
    const categories = [...catSet];

    // 3. Build nodes with positions
    const nodes = [];
    const nodesMap = {};

    const layerX = { tech: canvasW * 0.11, category: canvasW * 0.50, project: canvasW * 0.89 };

    // Tech nodes (left)
    topTechs.forEach((t, i) => {
        const spacing = canvasH / (topTechs.length + 1);
        const node = { id: `tech-${t}`, label: t, type: 'tech', x: layerX.tech, y: spacing * (i + 1), radius: 7 };
        nodes.push(node);
        nodesMap[node.id] = node;
    });

    // Category nodes (middle)
    categories.forEach((c, i) => {
        const spacing = canvasH / (categories.length + 1);
        const node = { id: `cat-${c}`, label: c, type: 'category', x: layerX.category, y: spacing * (i + 1), radius: 14 };
        nodes.push(node);
        nodesMap[node.id] = node;
    });

    // Project nodes (right)
    projects.forEach((p, i) => {
        const spacing = canvasH / (projects.length + 1);
        const shortTitle = p.title.split('—')[0].split(' — ')[0].split(':')[0].trim();
        const label = shortTitle.length > 22 ? shortTitle.slice(0, 20) + '…' : shortTitle;
        const node = {
            id: `proj-${p.id}`, label, fullTitle: p.title, type: 'project',
            x: layerX.project, y: spacing * (i + 1), radius: 6,
            data: p,
        };
        nodes.push(node);
        nodesMap[node.id] = node;
    });

    // 4. Build edges (deduplicated)
    const edgeSet = new Set();
    const edges = [];
    const addEdge = (fromId, toId) => {
        const key = `${fromId}||${toId}`;
        if (edgeSet.has(key)) return;
        edgeSet.add(key);
        edges.push({ from: fromId, to: toId });
    };

    projects.forEach(p => {
        const cats = p.category.split(',').map(c => c.trim()).filter(Boolean);
        // tech → category edges
        p.technologies.forEach(t => {
            if (!topTechs.includes(t)) return;
            cats.forEach(cat => {
                if (nodesMap[`cat-${cat}`]) addEdge(`tech-${t}`, `cat-${cat}`);
            });
        });
        // category → project edges
        cats.forEach(cat => {
            if (nodesMap[`cat-${cat}`]) addEdge(`cat-${cat}`, `proj-${p.id}`);
        });
    });

    return { nodes, nodesMap, edges, topTechs, categories };
}

// ============================================================
// HIGHLIGHT COMPUTATION
// ============================================================
function computeHighlights(node, graphData) {
    const hNodes = new Set([node.id]);
    const hEdges = new Set();

    if (node.type === 'tech') {
        graphData.edges.forEach(e => {
            if (e.from === node.id) {
                hEdges.add(`${e.from}||${e.to}`);
                hNodes.add(e.to);
                const techName = node.label;
                graphData.edges.forEach(e2 => {
                    if (e2.from === e.to && e2.to.startsWith('proj-')) {
                        const projNode = graphData.nodesMap[e2.to];
                        if (projNode?.data?.technologies?.includes(techName)) {
                            hEdges.add(`${e2.from}||${e2.to}`);
                            hNodes.add(e2.to);
                        }
                    }
                });
            }
        });
    } else if (node.type === 'category') {
        graphData.edges.forEach(e => {
            if (e.from === node.id || e.to === node.id) {
                hEdges.add(`${e.from}||${e.to}`);
                hNodes.add(e.from);
                hNodes.add(e.to);
            }
        });
    } else if (node.type === 'project') {
        graphData.edges.forEach(e => {
            if (e.to === node.id) {
                hEdges.add(`${e.from}||${e.to}`);
                hNodes.add(e.from);
                const catId = e.from;
                const projData = node.data;
                if (projData) {
                    graphData.edges.forEach(e2 => {
                        if (e2.to === catId && e2.from.startsWith('tech-')) {
                            const techName = graphData.nodesMap[e2.from]?.label;
                            if (projData.technologies?.includes(techName)) {
                                hEdges.add(`${e2.from}||${e2.to}`);
                                hNodes.add(e2.from);
                            }
                        }
                    });
                }
            }
        });
    }
    return { hNodes, hEdges };
}

// ============================================================
// BEZIER HELPERS
// ============================================================
const bezier = (t, p0, p1, p2, p3) => {
    const mt = 1 - t;
    return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function CreativeDemo() {
    // -- Refs --
    const graphCanvasRef = useRef(null);
    const bgCanvasRef = useRef(null);
    const animFrameRef = useRef(null);
    const hoveredNodeRef = useRef(null);
    const highlightedNodesRef = useRef(new Set());
    const highlightedEdgesRef = useRef(new Set());
    const graphDataRef = useRef(null);
    const recognitionRef = useRef(null);
    const selectedNodeRef = useRef(null);
    const speechQueueRef = useRef(Promise.resolve());
    const activeRequestRef = useRef(0);
    const finalTranscriptRef = useRef('');
    const liveTranscriptRef = useRef('');
    const recognitionSubmittedRef = useRef(false);

    // -- State --
    const [selectedNode, setSelectedNode] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [jarvisStatus, setJarvisStatus] = useState('idle'); // idle | listening | processing | speaking
    const [transcript, setTranscript] = useState('');
    const [jarvisResponse, setJarvisResponse] = useState('Ask me anything about Karthik. I am fully integrated with the LLM.');
    const [graphDimensions, setGraphDimensions] = useState({ w: 1200, h: 900 });
    const [messages, setMessages] = useState([]);
    const [typedCommand, setTypedCommand] = useState('');
    const [rateLimitMessage, setRateLimitMessage] = useState('');

    // -- Check speech support --
    const isSpeechSupported = typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    // ============================================================
    // GRAPH DATA (recalculated when dimensions change)
    // ============================================================
    const graphData = useMemo(() => {
        const data = buildGraphData(graphDimensions.w, graphDimensions.h);
        graphDataRef.current = data;
        return data;
    }, [graphDimensions]);

    // ============================================================
    // VOICE ENGINE & LLM
    // ============================================================
    const speak = useCallback((text) => {
        const cleanText = cleanForSpeech(text);
        if (!cleanText || typeof window === 'undefined' || !window.speechSynthesis) {
            return Promise.resolve();
        }

        speechQueueRef.current = speechQueueRef.current
            .catch(() => { })
            .then(() => new Promise((resolve) => {
                const utterance = new SpeechSynthesisUtterance(cleanText);
                utterance.rate = 1.02;
                utterance.pitch = 0.95;
                utterance.volume = 0.9;

                const voices = window.speechSynthesis.getVoices();
                const preferred = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'))
                    || voices.find(v => v.lang.startsWith('en-'))
                    || voices.find(v => v.lang.startsWith('en'));
                if (preferred) utterance.voice = preferred;

                utterance.onstart = () => setJarvisStatus('speaking');
                utterance.onend = resolve;
                utterance.onerror = resolve;
                window.speechSynthesis.speak(utterance);
            }));

        return speechQueueRef.current;
    }, []);

    const handleVoiceCommand = useCallback(async (spokenText) => {
        const userText = spokenText.trim();
        if (!userText) return;

        const limit = checkRateLimit();
        if (!limit.allowed) {
            setRateLimitMessage(limit.message);
            setJarvisStatus('idle');
            setJarvisResponse(limit.message);
            setTimeout(() => setRateLimitMessage(''), RATE_LIMIT.cooldownMs);
            return;
        }
        recordRateLimitHit();
        setRateLimitMessage('');

        const requestId = activeRequestRef.current + 1;
        activeRequestRef.current = requestId;

        window.speechSynthesis?.cancel();
        speechQueueRef.current = Promise.resolve();
        setTranscript(userText);
        setJarvisStatus('processing');
        setJarvisResponse('');

        try {
            const newMessages = [...messages, { role: 'user', content: userText }];
            setMessages(newMessages);

            const stream = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: VOICE_SYSTEM_PROMPT },
                    ...newMessages.map((m) => ({ role: m.role, content: m.content })),
                ],
                model: 'openai/gpt-oss-120b',
                temperature: 0.7,
                max_completion_tokens: 256,
                top_p: 1,
                stream: true,
            });

            let fullResponse = '';
            let sentenceBuffer = '';
            for await (const chunk of stream) {
                if (requestId !== activeRequestRef.current) return;
                const delta = chunk.choices[0]?.delta?.content || '';
                fullResponse += delta;
                sentenceBuffer += delta;
                setJarvisResponse(fullResponse);

                const { sentences, remainder } = splitCompleteSentences(sentenceBuffer);
                sentenceBuffer = remainder;
                sentences.forEach((sentence) => speak(sentence));
            }

            if (requestId !== activeRequestRef.current) return;
            if (sentenceBuffer.trim()) speak(sentenceBuffer);

            setMessages((prev) => [...prev, { role: 'assistant', content: fullResponse }]);
            await speechQueueRef.current;
            if (requestId === activeRequestRef.current) setJarvisStatus('idle');

        } catch (error) {
            console.error('Groq error:', error);
            if (requestId !== activeRequestRef.current) return;
            const errRes = "I'm sorry, I'm having trouble connecting to my neural network right now.";
            setJarvisResponse(errRes);
            await speak(errRes);
            if (requestId === activeRequestRef.current) setJarvisStatus('idle');
        }
    }, [messages, speak]);

    const submitTypedCommand = useCallback(() => {
        const command = typedCommand.trim();
        if (!command || jarvisStatus === 'processing') return;
        setTypedCommand('');
        handleVoiceCommand(command);
    }, [typedCommand, jarvisStatus, handleVoiceCommand]);

    const startListening = useCallback(() => {
        if (!isSpeechSupported) {
            setJarvisResponse('Speech recognition is not supported in this browser. Use the typed command below.');
            return;
        }
        if (jarvisStatus === 'processing') return;

        activeRequestRef.current += 1;
        recognitionRef.current?.abort?.();
        window.speechSynthesis?.cancel();
        speechQueueRef.current = Promise.resolve();
        finalTranscriptRef.current = '';
        liveTranscriptRef.current = '';
        recognitionSubmittedRef.current = false;
        setTranscript('');
        setJarvisStatus('listening');
        setJarvisResponse('Listening...');

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        const submitRecognizedText = (text) => {
            const cleanText = text.trim();
            if (!cleanText || recognitionSubmittedRef.current) return;
            recognitionSubmittedRef.current = true;
            recognitionRef.current = null;
            handleVoiceCommand(cleanText);
            try {
                recognition.stop();
            } catch {
                // The browser may already be ending the session.
            }
        };

        recognition.onresult = (event) => {
            let interimText = '';
            let finalText = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const text = event.results[i]?.[0]?.transcript || '';
                if (event.results[i].isFinal) {
                    finalText += text;
                } else {
                    interimText += text;
                }
            }

            if (finalText.trim()) {
                finalTranscriptRef.current = `${finalTranscriptRef.current} ${finalText}`.trim();
            }

            const visibleText = `${finalTranscriptRef.current} ${interimText}`.trim();
            liveTranscriptRef.current = visibleText;
            if (visibleText) setTranscript(visibleText);

            if (finalTranscriptRef.current) {
                submitRecognizedText(finalTranscriptRef.current);
            }
        };

        recognition.onerror = (event) => {
            if (event.error === 'aborted') return;
            const capturedText = finalTranscriptRef.current.trim() || liveTranscriptRef.current.trim();
            recognitionRef.current = null;
            if (capturedText && !recognitionSubmittedRef.current) {
                recognitionSubmittedRef.current = true;
                handleVoiceCommand(capturedText);
                return;
            }
            setJarvisStatus('idle');
            if (event.error === 'not-allowed') {
                setJarvisResponse('Microphone access is blocked. Enable mic permission or use the typed command below.');
            } else if (event.error === 'no-speech') {
                setJarvisResponse('I did not hear anything. Try again or use the typed command below.');
            } else {
                setJarvisResponse(`Speech recognition stopped (${event.error}). Brave may block Web Speech; use the typed command below.`);
            }
        };

        recognition.onend = () => {
            recognitionRef.current = null;
            if (!recognitionSubmittedRef.current && liveTranscriptRef.current.trim()) {
                submitRecognizedText(liveTranscriptRef.current);
                return;
            }
            setJarvisStatus(prev => prev === 'listening' ? 'idle' : prev);
        };

        try {
            recognitionRef.current = recognition;
            recognition.start();
        } catch (error) {
            console.error('Speech recognition error:', error);
            recognitionRef.current = null;
            setJarvisStatus('idle');
            setJarvisResponse('I could not start speech recognition. Use the typed command below.');
        }
    }, [isSpeechSupported, jarvisStatus, handleVoiceCommand]);

    const stopListening = useCallback(() => {
        activeRequestRef.current += 1;
        const text = finalTranscriptRef.current.trim() || liveTranscriptRef.current.trim();
        recognitionSubmittedRef.current = true;
        if (recognitionRef.current) {
            recognitionRef.current.stop?.();
            recognitionRef.current = null;
        }
        window.speechSynthesis?.cancel();
        speechQueueRef.current = Promise.resolve();
        if (text) {
            handleVoiceCommand(text);
        } else {
            setJarvisStatus('idle');
        }
    }, [handleVoiceCommand]);

    // ============================================================
    // CANVAS SIZE CALCULATION
    // ============================================================
    useEffect(() => {
        const updateSize = () => {
            const container = graphCanvasRef.current?.parentElement;
            if (!container) return;
            const w = container.clientWidth;
            const h = Math.max(window.innerHeight * 0.65, projects.length * 24 + 60);
            setGraphDimensions({ w, h });
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // ============================================================
    // GRAPH CANVAS — RENDERING LOOP
    // ============================================================
    useEffect(() => {
        const canvas = graphCanvasRef.current;
        if (!canvas || !graphData) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = graphDimensions.w * dpr;
        canvas.height = graphDimensions.h * dpr;
        canvas.style.width = graphDimensions.w + 'px';
        canvas.style.height = graphDimensions.h + 'px';
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        let startTime = Date.now();

        const render = () => {
            const time = (Date.now() - startTime) * 0.001;
            ctx.clearRect(0, 0, graphDimensions.w, graphDimensions.h);

            const hEdges = highlightedEdgesRef.current;
            const hNodes = highlightedNodesRef.current;
            const anyHighlight = hNodes.size > 0;

            // -- Draw edges --
            graphData.edges.forEach((edge, idx) => {
                const fromNode = graphData.nodesMap[edge.from];
                const toNode = graphData.nodesMap[edge.to];
                if (!fromNode || !toNode) return;

                const key = `${edge.from}||${edge.to}`;
                const highlighted = hEdges.has(key);

                const cpx1 = fromNode.x + (toNode.x - fromNode.x) * 0.4;
                const cpx2 = fromNode.x + (toNode.x - fromNode.x) * 0.6;

                ctx.beginPath();
                ctx.moveTo(fromNode.x, fromNode.y);
                ctx.bezierCurveTo(cpx1, fromNode.y, cpx2, toNode.y, toNode.x, toNode.y);

                if (highlighted) {
                    ctx.strokeStyle = EDGE_HIGHLIGHT;
                    ctx.lineWidth = 1.8;
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = 'rgba(201, 168, 76, 0.4)';
                } else {
                    ctx.strokeStyle = anyHighlight ? 'rgba(255,255,255,0.015)' : EDGE_DIM;
                    ctx.lineWidth = 0.5;
                    ctx.shadowBlur = 0;
                }
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Signal pulse on highlighted edges
                if (highlighted) {
                    const pulseT = (time * 0.4 + idx * 0.07) % 1;
                    const px = bezier(pulseT, fromNode.x, cpx1, cpx2, toNode.x);
                    const py = bezier(pulseT, fromNode.y, fromNode.y, toNode.y, toNode.y);

                    ctx.beginPath();
                    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = PULSE_COLOR;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = 'rgba(232, 212, 139, 0.6)';
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            });

            // -- Draw nodes --
            graphData.nodes.forEach(node => {
                const isHighlighted = hNodes.has(node.id);
                const isHovered = hoveredNodeRef.current?.id === node.id;
                const colors = NODE_COLORS[node.type];
                const dimmed = anyHighlight && !isHighlighted;

                // Glow ring
                if (isHighlighted || isHovered) {
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
                    ctx.fillStyle = colors.glow;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = colors.base;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }

                // Main circle
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = dimmed ? colors.dim : colors.base;
                if (!dimmed) {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = colors.base;
                }
                ctx.fill();
                ctx.shadowBlur = 0;

                // Label
                ctx.font = node.type === 'category' ? 'bold 12px Inter, sans-serif' : '10px Inter, sans-serif';
                ctx.fillStyle = dimmed ? 'rgba(255,255,255,0.12)' : (isHighlighted ? '#ffffff' : 'rgba(255,255,255,0.55)');

                if (node.type === 'tech') {
                    ctx.textAlign = 'right';
                    ctx.fillText(node.label, node.x - node.radius - 8, node.y + 1);
                } else if (node.type === 'category') {
                    ctx.textAlign = 'center';
                    ctx.fillText(node.label, node.x, node.y + node.radius + 16);
                } else {
                    ctx.textAlign = 'left';
                    ctx.fillText(node.label, node.x + node.radius + 8, node.y + 1);
                }
            });

            // -- Layer labels --
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(201, 168, 76, 0.32)';
            ctx.fillText('TECHNOLOGIES', graphDimensions.w * 0.11, 20);
            ctx.fillText('DOMAINS', graphDimensions.w * 0.50, 20);
            ctx.fillText('PROJECTS', graphDimensions.w * 0.89, 20);

            // Thin vertical guide lines
            [0.11, 0.50, 0.89].forEach(xFrac => {
                ctx.beginPath();
                ctx.moveTo(graphDimensions.w * xFrac, 30);
                ctx.lineTo(graphDimensions.w * xFrac, graphDimensions.h - 10);
                ctx.strokeStyle = 'rgba(201, 168, 76, 0.035)';
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            animFrameRef.current = requestAnimationFrame(render);
        };

        render();
        return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
    }, [graphData, graphDimensions]);

    // ============================================================
    // GRAPH CANVAS — MOUSE INTERACTION
    // ============================================================
    useEffect(() => {
        const canvas = graphCanvasRef.current;
        if (!canvas || !graphData) return;

        const getNodeAt = (mx, my) => {
            for (const node of graphData.nodes) {
                const dx = mx - node.x;
                const dy = my - node.y;
                const hitRadius = node.radius + 6;
                if (dx * dx + dy * dy < hitRadius * hitRadius) return node;
            }
            return null;
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            const node = getNodeAt(mx, my);

            if (node) {
                canvas.style.cursor = 'pointer';
                hoveredNodeRef.current = node;
                const { hNodes, hEdges } = computeHighlights(node, graphData);
                highlightedNodesRef.current = hNodes;
                highlightedEdgesRef.current = hEdges;
            } else {
                canvas.style.cursor = 'default';
                hoveredNodeRef.current = null;
                if (selectedNodeRef.current) {
                    const { hNodes, hEdges } = computeHighlights(selectedNodeRef.current, graphData);
                    highlightedNodesRef.current = hNodes;
                    highlightedEdgesRef.current = hEdges;
                } else {
                    highlightedNodesRef.current = new Set();
                    highlightedEdgesRef.current = new Set();
                }
            }
        };

        const handleClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            const node = getNodeAt(mx, my);

            if (node) {
                setSelectedNode(node);
                selectedNodeRef.current = node;
                setTooltipPos({ x: e.clientX, y: e.clientY });
                const { hNodes, hEdges } = computeHighlights(node, graphData);
                highlightedNodesRef.current = hNodes;
                highlightedEdgesRef.current = hEdges;
            } else {
                setSelectedNode(null);
                selectedNodeRef.current = null;
                highlightedNodesRef.current = new Set();
                highlightedEdgesRef.current = new Set();
            }
        };

        const handleMouseLeave = () => {
            hoveredNodeRef.current = null;
            if (selectedNodeRef.current) {
                const { hNodes, hEdges } = computeHighlights(selectedNodeRef.current, graphData);
                highlightedNodesRef.current = hNodes;
                highlightedEdgesRef.current = hEdges;
            } else {
                highlightedNodesRef.current = new Set();
                highlightedEdgesRef.current = new Set();
            }
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('click', handleClick);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('click', handleClick);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [graphData]);

    // ============================================================
    // THREE.JS HOLOGRAPHIC GLOBE BACKGROUND
    // ============================================================
    useEffect(() => {
        const canvas = bgCanvasRef.current;
        if (!canvas) return;

        const getCanvasSize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            return {
                width: Math.max(rect?.width || window.innerWidth, 320),
                height: Math.max(rect?.height || 360, 260),
            };
        };

        const { width, height } = getCanvasSize();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
        camera.position.z = 7.8;
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height, false);

        // Holographic Globe Group
        const group = new THREE.Group();
        scene.add(group);

        // 1. Core Sphere (inner glow)
        const coreGeo = new THREE.SphereGeometry(1.25, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0xc9a84c,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending,
            wireframe: true
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);

        // 2. Holographic Concentric Rings
        const ringResources = [];
        for (let i = 0; i < 5; i++) {
            const ringGeo = new THREE.TorusGeometry(1.8 + i * 0.32, 0.008, 64, 100);
            const ringMat = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0xe8d48b : 0xc9a84c,
                transparent: true,
                opacity: 0.25 - i * 0.04,
                blending: THREE.AdditiveBlending
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            group.add(ring);
            ringResources.push({ ringGeo, ringMat });
        }

        // 3. Orbiting Data Particles
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 32; pCanvas.height = 32;
        const pCtx = pCanvas.getContext('2d');
        const g = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        pCtx.fillStyle = g;
        pCtx.fillRect(0, 0, 32, 32);

        const count = 1200;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const u = Math.random(), v = Math.random();
            const theta = u * 2 * Math.PI;
            const phi = Math.acos(2 * v - 1);
            // Distribute on surface of a sphere
            const r = 2.6 + (Math.random() - 0.5) * 0.55;
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const pMat = new THREE.PointsMaterial({
            size: 0.06,
            color: 0xc9a84c,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            map: new THREE.CanvasTexture(pCanvas)
        });
        const pts = new THREE.Points(pGeo, pMat);
        group.add(pts);

        const clock = new THREE.Clock();
        let frameId;
        const tick = () => {
            const t = clock.getElapsedTime();

            // Complex globe rotation
            group.rotation.y = t * 0.1;
            group.rotation.x = t * 0.05;
            core.rotation.y = t * -0.2;

            // Rotate individual rings
            group.children.forEach((child, idx) => {
                if (child.type === 'Mesh' && child !== core) {
                    child.rotation.x += 0.002 * (idx % 2 === 0 ? 1 : -1);
                    child.rotation.y += 0.003;
                }
            });

            renderer.render(scene, camera);
            frameId = requestAnimationFrame(tick);
        };
        tick();

        const onResize = () => {
            const { width: nextWidth, height: nextHeight } = getCanvasSize();
            camera.aspect = nextWidth / nextHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(nextWidth, nextHeight, false);
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', onResize);
            coreGeo.dispose(); coreMat.dispose();
            ringResources.forEach(({ ringGeo, ringMat }) => {
                ringGeo.dispose();
                ringMat.dispose();
            });
            pGeo.dispose(); pMat.dispose();
            pMat.map?.dispose();
            renderer.dispose();
        };
    }, []);

    // ============================================================
    // CLEANUP VOICE ON UNMOUNT
    // ============================================================
    useEffect(() => {
        return () => {
            recognitionRef.current?.stop();
            window.speechSynthesis?.cancel();
        };
    }, []);

    // ============================================================
    // JSX
    // ============================================================
    const statusColor = {
        idle: 'text-gray-500', listening: 'text-gold-light', processing: 'text-gold', speaking: 'text-gold-light',
    }[jarvisStatus];
    const statusText = {
        idle: 'STANDBY', listening: 'LISTENING...', processing: 'PROCESSING...', speaking: 'SPEAKING...',
    }[jarvisStatus];

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white relative overflow-x-hidden selection:bg-gold selection:text-black">

            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 py-4 px-6 md:px-10 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent border-b border-gold/10">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <a href="/" className="flex items-center gap-2 text-gray-500 hover:text-gold transition-colors text-xs uppercase tracking-widest group">
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Portfolio
                    </a>
                    <div className="flex items-center gap-4">
                        <span className={`text-[10px] uppercase tracking-[0.25em] font-mono ${statusColor} transition-colors`}>
                            {statusText}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${jarvisStatus === 'idle' ? 'bg-gray-600' : jarvisStatus === 'listening' ? 'bg-gold-light animate-pulse' : jarvisStatus === 'speaking' ? 'bg-gold-light animate-pulse' : 'bg-gold animate-pulse'}`} />
                    </div>
                    <span className="text-[10px] tracking-[0.3em] font-mono text-white/20 uppercase hidden md:block">
                        JARVIS // Holographic Terminal v3.0
                    </span>
                </div>
            </header>

            {/* Main Content */}
            <div className="relative z-10 pt-20 pb-16">

                {/* JARVIS Title */}
                <div className="max-w-[1600px] mx-auto px-6 md:px-10 mb-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-display font-light tracking-tight"
                    >
                        JARVIS <span className="font-serif italic text-gold">AI Engineer</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gold/60 text-xs md:text-sm mt-2 tracking-wide"
                    >
                        Voice-enabled portfolio intelligence - STT input - LLM reasoning - TTS output
                    </motion.p>
                </div>

                {/* JARVIS Terminal */}
                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6 }}
                    className="max-w-[1600px] mx-auto px-6 md:px-10 mb-8"
                >
                    <div className="relative overflow-hidden rounded-lg border border-gold/25 bg-black/85 shadow-[0_0_44px_rgba(201,168,76,0.12)] font-mono">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.08),rgba(10,10,10,0.88)_58%,rgba(10,10,10,0.98)_100%)] pointer-events-none" />

                        <div className="relative p-5 md:p-6">
                            <div className="flex items-center gap-2 border-b border-gold/20 pb-3">
                                <Terminal className="w-4 h-4 text-gold" />
                                <span className="text-gold text-xs uppercase tracking-widest">JARVIS AI Engineer</span>
                                <span className="ml-auto text-gold-light text-[10px] uppercase tracking-[0.2em]">{statusText}</span>
                            </div>

                            <div className="grid min-h-[320px] grid-cols-1 items-stretch gap-4 py-5 lg:grid-cols-[minmax(0,1fr)_320px_minmax(0,1fr)]">
                                <div className="rounded-sm border border-gold/10 bg-black/60 p-4">
                                    <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-gold/50">STT Transcript</div>
                                    <p className="min-h-40 text-sm leading-relaxed text-gray-300">
                                        {transcript || 'Awaiting microphone input...'}
                                    </p>
                                </div>

                                <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-sm border border-gold/20 bg-black/35">
                                    <canvas ref={bgCanvasRef} className="absolute inset-0 h-full w-full pointer-events-none opacity-70" />
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.1)_42%,rgba(0,0,0,0.72)_78%)] pointer-events-none" />
                                    <div className="absolute h-56 w-56 rounded-full border border-gold/15 shadow-[0_0_70px_rgba(201,168,76,0.18)]" />
                                    <div className="absolute h-36 w-36 rounded-full border border-gold/10" />
                                    {jarvisStatus === 'listening' && (
                                        <>
                                            <div className="absolute h-28 w-28 rounded-full border-2 border-gold-light/40 animate-ping" />
                                            <div className="absolute h-44 w-44 rounded-full border border-gold/20 animate-ping" style={{ animationDelay: '0.3s' }} />
                                        </>
                                    )}
                                    {jarvisStatus === 'speaking' && (
                                        <div className="absolute h-40 w-40 rounded-full border-2 border-gold-light/35 animate-ping" />
                                    )}

                                    <button
                                        onClick={jarvisStatus === 'listening' ? stopListening : startListening}
                                        disabled={!isSpeechSupported || !!rateLimitMessage || jarvisStatus === 'processing'}
                                        className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300
                                            ${jarvisStatus === 'listening' || jarvisStatus === 'speaking'
                                                ? 'border-2 border-gold-light bg-gold/15 shadow-[0_0_32px_rgba(201,168,76,0.28)]'
                                                : 'border border-gold/40 bg-black/60 hover:border-gold hover:bg-gold/10'
                                            }
                                            ${!isSpeechSupported || rateLimitMessage || jarvisStatus === 'processing' ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
                                        `}
                                        title={!isSpeechSupported ? 'Speech recognition is not supported in this browser' : 'Click to speak'}
                                    >
                                        {jarvisStatus === 'listening' ? (
                                            <MicOff className="h-7 w-7 text-gold-light" />
                                        ) : (
                                            <Mic className={`h-7 w-7 ${jarvisStatus === 'speaking' ? 'text-gold-light' : 'text-gold'}`} />
                                        )}
                                    </button>
                                </div>

                                <div className="rounded-sm border border-gold/20 bg-black/70 p-4 shadow-[inset_0_0_24px_rgba(201,168,76,0.05)]">
                                    <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-gold/50">TTS Transcript</div>
                                    <p className={`min-h-40 text-sm leading-relaxed text-gold-light ${jarvisStatus === 'processing' ? 'animate-pulse' : ''}`}>
                                        {jarvisResponse}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 border-t border-gold/10 pt-4 md:flex-row">
                                <input
                                    value={typedCommand}
                                    onChange={(event) => setTypedCommand(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault();
                                            submitTypedCommand();
                                        }
                                    }}
                                    disabled={jarvisStatus === 'processing' || !!rateLimitMessage}
                                    placeholder="fallback: type your command here..."
                                    className="min-h-11 flex-1 rounded-sm border border-gold/15 bg-black/70 px-3 text-sm text-gold-light placeholder:text-gold/30 outline-none transition-colors focus:border-gold/50 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={submitTypedCommand}
                                    disabled={!typedCommand.trim() || jarvisStatus === 'processing' || !!rateLimitMessage}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-gold/30 bg-gold/10 px-4 text-xs font-bold uppercase tracking-[0.18em] text-gold transition-colors hover:border-gold hover:bg-gold hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Send className="h-4 w-4" />
                                    Send
                                </button>
                            </div>

                            <p className="mt-3 text-center text-[9px] uppercase tracking-[0.22em] text-gold/45">
                                {rateLimitMessage || (isSpeechSupported ? 'Click the core mic to speak. Use the fallback input if STT stops.' : 'Speech not supported. Use the fallback input.')}
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Project Neural Map Title */}
                <div className="max-w-[1600px] mx-auto px-6 md:px-10 mb-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl md:text-4xl font-display font-light tracking-tight"
                    >
                        Project <span className="font-serif italic text-gold">Neural Map</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-gold/60 text-xs md:text-sm mt-2 tracking-wide"
                    >
                        {projects.length} projects - {graphData.topTechs.length} technologies - {graphData.categories.length} domains - hover nodes to trace connections
                    </motion.p>
                </div>

                {/* Neural Network Graph Canvas */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="max-w-[1600px] mx-auto px-2 md:px-6"
                >
                    <div className="relative bg-black/40 border border-gold/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                        {/* Corner brackets decoration */}
                        <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-gold/30 rounded-tl-sm pointer-events-none" />
                        <div className="absolute top-2 right-2 w-6 h-6 border-t border-r border-gold/30 rounded-tr-sm pointer-events-none" />
                        <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l border-gold/30 rounded-bl-sm pointer-events-none" />
                        <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-gold/30 rounded-br-sm pointer-events-none" />

                        <canvas ref={graphCanvasRef} className="w-full" />
                    </div>
                </motion.div>
            </div>



            {/* ========= NODE DETAIL TOOLTIP (on click) ========= */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border border-gold/20 rounded-2xl shadow-[0_10px_40px_rgba(201,168,76,0.15)] max-w-sm w-[90vw]"
                        style={{
                            left: Math.min(tooltipPos.x, window.innerWidth - 380),
                            top: Math.min(tooltipPos.y - 20, window.innerHeight - 300),
                        }}
                    >
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${selectedNode.type === 'tech' ? 'bg-gold' : selectedNode.type === 'category' ? 'bg-gold-light' : 'bg-gold-dark'}`} />
                                    <span className="text-[10px] uppercase tracking-widest text-gold/70">{selectedNode.type}</span>
                                </div>
                                <button onClick={() => {
                                    setSelectedNode(null);
                                    selectedNodeRef.current = null;
                                    highlightedNodesRef.current = new Set();
                                    highlightedEdgesRef.current = new Set();
                                }} className="text-gold/50 hover:text-gold transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <h3 className="text-white font-display font-semibold text-lg mb-2">
                                {selectedNode.fullTitle || selectedNode.label}
                            </h3>

                            {selectedNode.type === 'project' && selectedNode.data && (
                                <>
                                    <p className="text-gray-400 text-xs leading-relaxed mb-3">
                                        {selectedNode.data.shortDescription}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {selectedNode.data.technologies.slice(0, 8).map(t => (
                                            <span key={t} className="text-[9px] px-2 py-0.5 bg-gold/10 border border-gold/20 rounded-full text-gold-light">{t}</span>
                                        ))}
                                        {selectedNode.data.technologies.length > 8 && (
                                            <span className="text-[9px] px-2 py-0.5 text-gray-600">+{selectedNode.data.technologies.length - 8}</span>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        {selectedNode.data.githubUrl && (
                                            <a href={selectedNode.data.githubUrl} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-xs text-gold/70 hover:text-gold transition-colors">
                                                <Github className="w-3.5 h-3.5" /> GitHub
                                            </a>
                                        )}
                                        {selectedNode.data.websiteUrl && (
                                            <a href={selectedNode.data.websiteUrl} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-xs text-gold/70 hover:text-gold transition-colors">
                                                <ExternalLink className="w-3.5 h-3.5" /> Live Site
                                            </a>
                                        )}
                                    </div>
                                </>
                            )}

                            {selectedNode.type === 'tech' && (
                                <div className="text-gray-400 text-xs mt-2">
                                    <p className="mb-2 text-gold/70 uppercase tracking-widest text-[10px]">Used in:</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        {projects.filter(p => p.technologies.includes(selectedNode.label)).map(p => (
                                            <li key={p.id} className="text-gold-light">{p.title.split('—')[0].split(' — ')[0].trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {selectedNode.type === 'category' && (
                                <div className="text-gray-400 text-xs mt-2">
                                    <p className="mb-2 text-gold/70 uppercase tracking-widest text-[10px]">Projects in domain:</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        {projects.filter(p => p.category.includes(selectedNode.label)).map(p => (
                                            <li key={p.id} className="text-gold-light">{p.title.split('—')[0].split(' — ')[0].trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
