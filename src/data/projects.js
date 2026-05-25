export const projects = [
    // ========================================
    // SOFTWARE PROJECTS (Web, AI/ML, App, Cloud, DevOps) — TOP
    // ========================================

    // #1 — Arova Interiors CMS (NEW)
    {
        id: 'arova-interiors-cms',
        title: 'Arova Interiors — Full-Stack CMS Platform',
        shortDescription: 'Enterprise interior design platform with Sanity CMS, AI chat, 3D visualization, cost estimator, and Supabase auth.',
        fullDescription: [
            "Arova Interiors is a full-stack, enterprise-grade interior design platform built with Next.js 16, Sanity CMS, and Supabase authentication — designed for a real-world interior design business.",
            "Features a headless CMS architecture powered by Sanity Studio, enabling non-technical clients to manage projects, services, architects, testimonials, and homepage content in real-time without any code changes.",
            "Includes an AI-powered chat widget integrated with OpenAI for instant client consultation, a dynamic cost estimator tool, and an interactive 3D apartment visualization built with React Three Fiber and Three.js.",
            "The platform ships with full SEO optimization, Vercel Analytics, Speed Insights, structured JSON-LD data, server-side rendering, and a responsive luxury design system using Tailwind CSS and Framer Motion."
        ],
        technologies: ['Next.js', 'Sanity CMS', 'Supabase', 'OpenAI', 'React Three Fiber', 'Three.js', 'Framer Motion', 'Tailwind CSS', 'Vercel'],
        category: 'Web',
        videos: ['/videos/Arova.mp4'],
        githubUrl: 'https://github.com/karthiktatineni/arova-with-cms',
        websiteUrl: 'https://arova-with-cms.vercel.app'
    },

    // #2 — Klvora Fashion
    {
        id: 'klvora-fashion',
        title: 'Klvora - Fashion Website',
        shortDescription: 'Modern fashion website built with React, Neon DBMS, featuring dynamic products and automated email workflows.',
        fullDescription: [
            "Klvora is a modern fashion e-commerce website built with React and powered by Neon DBMS for dynamic product management.",
            "The website features automated email workflows for customer engagement, a sleek responsive design, and seamless user experience."
        ],
        technologies: ['React', 'Neon DBMS', 'Node.js', 'Email Automation', 'Tailwind CSS'],
        category: 'Web',
        videos: ['/videos/klvora.mp4'],
        githubUrl: 'https://github.com/karthiktatineni/Klvora-site',
        websiteUrl: 'https://klvora.in'
    },

    // #3 — IARE Consortium
    {
        id: 'iare-consortium',
        title: 'IARE Consortium',
        shortDescription: 'College event management platform with admin panel for handling consortium activities.',
        fullDescription: [
            "A comprehensive web platform built for IARE's technical consortium to streamline event management.",
            "Features a robust admin panel for organizing events, tracking registrations, and managing content dynamically."
        ],
        technologies: ['React', 'Vite', 'Firebase', 'Vercel', 'Tailwind CSS', 'Domain management'],
        category: 'Web',
        videos: ['/videos/iare-const.mp4'],
        githubUrl: 'https://github.com/karthiktatineni/iareconsortium25',
        websiteUrl: 'https://consortium25.com'
    },

    // #4 — IARE MUN
    {
        id: 'iare-mun',
        title: 'IARE MUN',
        shortDescription: 'Official Model United Nations platform with admin dashboard for delegate registration.',
        fullDescription: [
            "The official website for IARE Model United Nations, designed to handle large-scale delegate registrations.",
            "Includes a secure admin dashboard for the secretariat to manage applications and allocate countries."
        ],
        technologies: ['React', 'Vite', 'Firebase', 'Vercel', 'Tailwind CSS', 'Domain management'],
        category: 'Web',
        videos: ['/videos/iaremun.mp4'],
        githubUrl: 'https://github.com/karthiktatineni/munfirebase',
        websiteUrl: 'https://iaremun.in'
    },

    // #5 — College Farewell 2026
    {
        id: 'college-farewell-2026',
        title: 'College Farewell Project - Batch of 2026',
        shortDescription: 'Digital memory archives and farewell platform for the IARE Class of 2026.',
        fullDescription: [
            "This project is a dedicated digital 'memory box' built for the IARE Batch of 2026, providing a lasting space for students to revisit their college journey.",
            "The platform features a secure authentication system, allowing students to log in and access restricted sections like the testimonial archives and student-only galleries.",
            "Built with a focus on community and nostalgia, it includes a large-scale student directory, a gallery of shared memories, and personalized student profiles.",
            "The project successfully handles high traffic during the farewell season, ensuring a smooth and emotional experience for the graduating class."
        ],
        technologies: ['React', 'Firebase', 'Tailwind CSS', 'Vercel', 'Authentication'],
        category: 'Web',
        images: ['/videos/farewell-home.png', '/videos/farewell-gallery.png', '/videos/farewell-footer.png'],
        githubUrl: 'https://github.com/karthiktatineni/batchof2026',
        websiteUrl: 'https://iareeceb.in'
    },

    // #6 — Autonomous AI Agentic Team
    {
        id: 'ai-agent-team',
        title: ' Autonomous AI Agentic Team',
        shortDescription: 'Multi-agent developer pipeline using MCP and Claude Code for end-to-end software builds.',
        fullDescription: [
            "A fully autonomous, multi-agent development pipeline designed to transform high-level ideas into production-ready software systems with minimal human intervention.",
            "Leverages the Model Context Protocol (MCP) to facilitate seamless communication and shared memory between a specialized team of 10+ AI agents, including Researchers, Architects, Coders, and Security Auditors.",
            "Features a real-time web-based dashboard that monitors agent thought processes, live logs, project memory mapping, and phase-by-phase progression from Research to Deployment.",
            "Implements sophisticated failover logic and a Coder-Reviewer feedback loop, ensuring code quality through automated testing and iterative refinement."
        ],
        technologies: ['Claude Code', 'MCP Protocol', 'Node.js', 'React', 'Ollama', 'Docker', 'WebSockets'],
        category: 'AI/ML',
        images: ['/images/ai-team/dashboard.png', '/images/ai-team/terminal.png'],
        githubUrl: 'https://github.com/karthiktatineni/claude-code-agentic-team'
    },

    // #7 — Personal AI Bot
    {
        id: 'personal-ai-bot',
        title: 'Personal AI Bot',
        shortDescription: 'Custom-trained bot deployed on web using Botpress to answer questions based on personal data.',
        fullDescription: [
            "This project is a personalized AI bot trained on my resume and portfolio details, built using Botpress and OpenAI.",
            "The bot is hosted online and trained with FAQs, resume content, and personalized replies using knowledge base integration."
        ],
        technologies: ['Botpress', 'OpenAI GPT', 'Knowledge Base', 'Web Embedding'],
        category: 'AI/ML',
        images: ['/videos/bot.png', '/videos/bot2.png'],
    },

    // #8 — Helmet Detection
    {
        id: 'helmet-detection',
        title: 'Helmet & Triple-Ride Detection',
        shortDescription: 'YOLO and CNN-based system to detect helmet use and triple riding using real-time camera feed.',
        fullDescription: [
            "This project uses deep learning (YOLOv5 + CNN) to detect motorcyclists violating traffic rules—specifically those not wearing helmets or riding with more than two passengers.",
            "The detection model is optimized for accuracy and real-time performance using OpenCV and PyTorch."
        ],
        technologies: ['YOLOv5', 'CNN', 'OpenCV', 'PyTorch', 'Python'],
        category: 'AI/ML',
        videos: ['/videos/helmet.mp4'],
        githubUrl: 'https://github.com/karthiktatineni/Helmet-tripleride-Detection'
    },

    // #9 — AI-Powered Fitness Tracker (Flutter App)
    {
        id: 'gymapp-flutter',
        title: '🏋️ AI-Powered Fitness Tracker',
        shortDescription: 'Premium AI workout planner and fitness tracker built with Flutter and Google Gemini AI.',
        fullDescription: [
            "A premium, AI-driven fitness application built with Flutter that provides personalized workout plans tailored to user goals.",
            "Integrates Google Gemini AI to dynamically generate exercise routines based on fitness levels and equipment availability.",
            "Features secure Firebase authentication, comprehensive progress tracking, and a cross-platform experience across Android, iOS, and Web.",
            "Follows production-grade security practices including build-time environment configuration and code obfuscation."
        ],
        technologies: ['Flutter', 'Firebase', 'Google Gemini AI', 'Dart', 'Provider'],
        category: 'AI/ML, App',
        videos: ['/videos/Gymapp.mp4', '/videos/Gymapp2.mp4'],
        githubUrl: 'https://github.com/karthiktatineni/GYMapp-flutter'
    },

    // #10 — Nextcloud Home Cloud Server
    {
        id: 'nextcloud-home-server',
        title: 'Nextcloud Home Cloud Server',
        shortDescription: 'Self-hosted Nextcloud cloud server on a personal PC with Cloudflare Tunnel for worldwide access.',
        fullDescription: [
            "Self-hosted Nextcloud home server on a personal PC using Docker, with external hard disk for persistent storage.",
            "Cloudflare Tunnel is used to securely expose the server to the internet without port forwarding."
        ],
        technologies: ['Nextcloud', 'Docker', 'PostgreSQL', 'Cloudflare Tunnel', 'Self-Hosting', 'Networking'],
        category: 'Cloud',
        images: ['/videos/server1.jpeg', '/videos/server2.jpeg', '/videos/server3.jpeg'],
        githubUrl: 'https://github.com/karthiktatineni/localcloud'
    },

    // #11 — Personal Home Server & Private Cloud
    {
        id: 'personal-home-server',
        title: 'Personal Home Server & Private Cloud',
        shortDescription: 'High-performance self-hosted infrastructure featuring Nextcloud, Plex, n8n, and a custom DC monitor.',
        fullDescription: [
            "A high-performance, self-hosted infrastructure designed for seamless cloud storage, media orchestration, workflow automation, and real-time system monitoring.",
            "Built on a modular, containerized architecture using Docker Compose, ensuring high availability and security through Cloudflare Tunnels for encrypted, port-less public access.",
            "Features a custom-built 'Datacenter Monitor' with real-time WebSocket metrics for tracking CPU, Memory, Disk, and container health with bulk management capabilities.",
            "Includes fully integrated services: Nextcloud for enterprise-grade file sync, Plex for media streaming, n8n for workflow automation, and a Dockerized Minecraft server."
        ],
        technologies: ['Docker', 'Cloudflare Tunnel', 'Nginx', 'Nextcloud', 'Plex', 'n8n', 'Node.js', 'PostgreSQL', 'WebSockets'],
        category: 'Cloud,DevOps',
        images: ['/videos/server-main.png', '/videos/api.png', '/videos/server-monitor.png', '/videos/server-cloud.png'],
        githubUrl: 'https://github.com/karthiktatineni/homeserver'
    },

    // #12 — IARE MUN DevOps / Microservices
    {
        id: 'iare-mun-devops',
        title: 'IARE MUN - Microservices Architecture',
        shortDescription: 'Enterprise-grade MUN platform with Load Balancers, API Gateways, and Dockerized microservices.',
        fullDescription: [
            "High-availability infrastructure transformation for the IARE MUN platform with advanced DevOps components.",
            "Layer 7 Load Balancers, API Gateway, Dockerized microservices, and sophisticated caching layers."
        ],
        technologies: ['Load Balancers', 'API Gateway', 'Docker', 'Redis Caching', 'Nginx', 'Firebase', 'Cloudflare', 'React'],
        category: 'DevOps',
        videos: ['/videos/iaremun.mp4'],
        images: ['/videos/backend1.png', '/videos/architecture-diagram.svg', '/videos/docker-system.png'],
        githubUrl: 'https://github.com/karthiktatineni/munproduction',
        githubUrl2: 'https://github.com/karthiktatineni/productionbackend'
    },

    // ========================================
    // ELECTRONICS / HARDWARE PROJECTS (IoT, Electronics, VLSI) — BOTTOM
    // ========================================

    // #13 — AI-Integrated Smart Home
    {
        id: 'ai-integrated-smart-home',
        title: '🔌 AI-Integrated Smart Home Automation System',
        shortDescription: 'Alexa + Siri + Web Dashboard + ESP32 + Firebase',
        fullDescription: [
            "This project is a fully functional cloud-connected smart home automation system that enables real-time control of electrical appliances through multiple interfaces: Amazon Alexa, Apple Siri, and a custom web dashboard.",
            "Built around an ESP32 microcontroller integrated with Firebase Realtime Database, creating a scalable, low-latency IoT architecture.",
            "Allows users to control devices such as lights, fans, and power outlets using voice commands or remote web access, while also supporting physical wall switches for manual control.",
            "The system ensures two-way synchronization between physical switches and cloud commands, maintaining consistent device states across all control interfaces."
        ],
        technologies: ['ESP32', 'Firebase', 'Next.js', 'Alexa', 'Siri', 'Node.js', 'C++'],
        category: 'Cloud, IoT',
        images: ['/videos/homeweb.png', '/videos/homearch.png', '/videos/homefire.png', '/videos/alexahome.png']
    },

    // #14 — AI-Powered ESP32
    {
        id: 'ai-powered-esp32',
        title: 'AI-Powered ESP32',
        shortDescription: 'ESP32-AI system integrated with Gemini AI to respond to questions asked.',
        fullDescription: [
            "This project demonstrates the integration of the ESP32 with Google Gemini AI to create an interactive AI-powered assistant.",
            "The system combines AI conversation with real-time audio output, allowing users to experience voice-based interaction without needing a computer or cloud-heavy setup.",
            "Potential applications include smart home voice assistants, accessibility tools, educational companions, and IoT devices that respond with speech."
        ],
        technologies: ['ESP32', 'Google Gemini AI', 'Text-to-Speech', 'Arduino IDE', 'Wi-Fi'],
        category: 'AI/ML',
        videos: ['/videos/ESP32-AI1.mp4', '/videos/ESP32-AI2.mp4'],
        githubUrl: 'https://github.com/karthiktatineni/Gemini-integrated-ESP32'
    },

    // #15 — OLLAMA Local AI
    {
        id: 'ollama-local-ai',
        title: 'OLLAMA Based Local AI',
        shortDescription: 'Local AI on ESP32 using OLLAMA on PC, forwarded to ESP32 via ngrok.',
        fullDescription: [
            "This project showcases a powerful integration between the ESP32 and Ollama — a local LLM engine running on a computer.",
            "This allows the ESP32 to communicate with advanced language models like LLaMA, Phi, Mistral, and Gemma without relying on cloud services.",
            "The system works completely over local hardware, making it fast, private, and ideal for embedded AI applications."
        ],
        technologies: ['ESP32', 'Ollama', 'LLaMA/Phi/Mistral', 'Ngrok', 'HTTP API'],
        category: 'AI/ML',
        images: ['/videos/OLLAMA.jpeg', '/videos/OUTPUT.jpeg', '/videos/NGROK.jpeg'],
        githubUrl: 'https://github.com/karthiktatineni/Ollama_on_ESP32'
    },

    // #16 — Smart Anti-Theft Bag
    {
        id: 'smart-anti-theft-bag',
        title: 'Smart Anti-Theft Bag',
        shortDescription: 'ESP8266-based bag with RFID access and Telegram alerts for real-time theft detection.',
        fullDescription: [
            "The Smart Anti-Theft Bag is a compact, IoT-powered backpack that improves personal security using RFID authentication and real-time Telegram alerts. Built using an ESP8266 microcontroller, the system ensures that only authorized users can access the bag's contents.",
            "When the bag's zipper is opened, a 5-second timer starts. If no valid RFID card is scanned during this time, a buzzer sounds and a Telegram alert is sent.",
            "This project uses an MFRC522 RFID reader, a piezo buzzer, a physical switch for zipper detection, and Wi-Fi-enabled cloud messaging via Telegram's Bot API."
        ],
        technologies: ['ESP8266', 'RFID MFRC522', 'Telegram Bot API', 'Arduino IDE', 'Piezo Buzzer'],
        category: 'IoT',
        videos: ['/videos/BEGV7712.MP4'],
        githubUrl: 'https://github.com/karthiktatineni/Smart-Bag'
    },

    // #17 — Smart Home Automation
    {
        id: 'smart-home-automation',
        title: 'Smart Home Automation',
        shortDescription: 'Control appliances via Alexa and Cadio App using ESP8266 and custom firmware.',
        fullDescription: [
            "This smart home automation system uses ESP8266 to wirelessly control appliances like lights and fans.",
            "The system is integrated with Alexa using Sinric Pro, enabling voice-controlled operation for daily convenience.",
            "Key features include support for multiple devices, real-time feedback on device status, and integration with existing home switches."
        ],
        technologies: ['ESP8266', 'Alexa', 'Sinric Pro', 'Relay Modules', 'Arduino IDE'],
        category: 'IoT',
        videos: ['/videos/room.mp4'],
        githubUrl: 'https://github.com/karthiktatineni/Home-automation'
    },

    // #18 — Environmental Monitoring
    {
        id: 'environmental-monitoring',
        title: 'Environmental Monitoring',
        shortDescription: 'Real-time web dashboard showing temperature, humidity, and air quality.',
        fullDescription: [
            "This project features a smart environmental monitoring system powered by ESP8266 and DHT11 sensor.",
            "The data is auto-refreshed every few seconds and color-coded based on safe or unsafe ranges."
        ],
        technologies: ['ESP8266', 'DHT11', 'HTML/CSS/JS', 'REST API', 'Arduino IDE'],
        category: 'IoT',
        images: ['/videos/moni1.jpg', '/videos/moni2.jpg', '/videos/moni3.jpg'],
        githubUrl: 'https://github.com/karthiktatineni/weather_monitoring_System'
    },

    // #19 — Smart Calling Bell
    {
        id: 'smart-calling-bell',
        title: 'Smart Calling Bell System',
        shortDescription: 'ESP32-based calling bell with buzzer, Blynk Application, and visitor presence notification.',
        fullDescription: [
            "The Smart Calling Bell System uses an ESP32 and Blynk app to notify home occupants when a visitor presses the bell.",
            "Compact and suitable for smart homes, offices, and accessible homes."
        ],
        technologies: ['ESP32', 'Blynk', 'Piezo Buzzer', 'Arduino IDE', 'OTA Updates'],
        category: 'IoT',
        images: ['/videos/door.png']
    },

    // #20 — Ambient Light
    {
        id: 'ambient-light-esp',
        title: 'Ambient Light Using ESP',
        shortDescription: 'ESP8266-controlled WLED setup that syncs WS2812 LEDs with screen visuals using SignalRGB.',
        fullDescription: [
            "An immersive ambient lighting system using ESP8266 and WLED firmware to control WS2812 LED strips.",
            "Syncs with screen content through SignalRGB for a dynamic visual experience."
        ],
        technologies: ['ESP8266', 'WLED', 'WS2812', 'SignalRGB', 'LED Programming'],
        category: 'IoT',
        videos: ['/videos/amb.mp4']
    },

    // #21 — ESP Joke Generator
    {
        id: 'esp-joke-generator',
        title: 'ESP Joke Generator',
        shortDescription: 'ESP-based system that fetches jokes and displays them on a 16x2 LCD with a button for the punchline.',
        fullDescription: [
            "A fun IoT project using ESP to fetch jokes from an online API and display them on a 16x2 LCD screen.",
            "Features an interactive button to reveal the punchline."
        ],
        technologies: ['ESP8266', 'LCD 16x2', 'API Integration', 'Arduino IDE', 'C++'],
        category: 'IoT',
        videos: ['/videos/joke-teller-demo.mp4'],
        githubUrl: 'https://github.com/karthiktatineni/ESP32-based-joke-generator'
    },

    // #22 — ESP32 Desk Mochi
    {
        id: 'esp32-desk-mochi',
        title: 'ESP32 Desk Mochi',
        shortDescription: 'ESP32-powered desk companion with time, weather display, and dynamic facial expressions.',
        fullDescription: [
            "An adorable ESP32-powered desk companion that displays time and weather on an OLED screen.",
            "Features dynamic facial expressions that change based on conditions."
        ],
        technologies: ['ESP32', 'OLED Display', 'Weather API', 'Animation', 'C++'],
        category: 'IoT',
        videos: ['/videos/mochi.mp4'],
        images: ['/videos/mochii.png'],
        githubUrl: 'https://github.com/karthiktatineni/Desk_mochi'
    },

    // #23 — Audio Spectrum Analyzer
    {
        id: 'audio-spectrum-analyzer',
        title: 'Analog Audio Spectrum Analyzer',
        shortDescription: 'Visualizes audio signals using capacitors, zener diodes, and rectifier diodes without a microcontroller.',
        fullDescription: [
            "A pure analog electronics project that visualizes audio frequency spectrum without any microcontroller.",
            "Uses carefully designed circuits with capacitors, zener diodes, and rectifier diodes to create a visual audio display."
        ],
        technologies: ['Analog Electronics', 'Capacitors', 'Zener Diodes', 'Rectifier Diodes', 'PCB Design'],
        category: 'Electronics',
        videos: ['/videos/sepctrum.mp4']
    },

    // #24 — Verilog Logic Gates
    {
        id: 'verilog-logic-gates-project',
        title: 'Logic Gates Using Verilog',
        shortDescription: 'Implementing basic combinational logic gates using Verilog HDL with testbench and waveform verification.',
        fullDescription: [
            "This project implements basic combinational logic gates—AND, OR, NOT, NAND, NOR, XOR, and XNOR—using Verilog HDL.",
            "VCD waveform files are generated for visualization and verification of gate operations."
        ],
        technologies: ['EDAplayground', 'Verilog', 'Logic Gates', 'RTL modeling'],
        category: 'VLSI',
        images: ['/videos/gates.png', '/videos/gatestable.png', '/videos/gateswave.png']
    },

    // #25 — Verilog Half Adder & Subtractor
    {
        id: 'verilog-Half-Adder-Subtractor',
        title: 'Half Adder & Subtractor (Verilog)',
        shortDescription: 'Combined Half Adder and Half Subtractor with testbench and waveform output.',
        fullDescription: [
            "This project implements a combined Half Adder and Half Subtractor using Verilog HDL.",
            "VCD waveform files are generated for visualization and verification."
        ],
        technologies: ['EDAplayground', 'Verilog', 'Adder', 'Subtractor', 'RTL modeling'],
        category: 'VLSI',
        images: ['/videos/has.png', '/videos/haswave.png']
    },
];

export const categories = ['All', 'Web', 'AI/ML', 'App', 'Cloud', 'DevOps', 'IoT', 'Electronics', 'VLSI'];
