// Comprehensive personal information for AI Chatbot system prompt
export const userInfo = {
    name: "Karthik Tatineni",
    title: "Student | Electronics & Communication Engineer | Full-Stack Developer | IoT & AI Enthusiast",
    college: "Institute of Aeronautical Engineering (IARE), Hyderabad",
    branch: "Electronics and Communication Engineering (ECE)",
    github: "https://github.com/karthiktatineni",

    bio: `I'm Karthik Tatineni, an Electronics and Communication Engineering student at IARE, Hyderabad.
I have a strong passion for IoT, VLSI, AI technologies, automation, and embedded systems.
I enjoy building small, functional projects using Arduino and ESP boards — transforming creative ideas into functional prototypes.
Beyond academics, I enjoy gaming, which helps sharpen my reflexes and decision-making skills.
My strengths include problem-solving, hands-on experimentation, and a solid grasp of both hardware and software integration.
I aim to build a future where I can contribute to impactful tech solutions that improve everyday life.`,

    stats: {
        projectsBuilt: "20+",
        techDomains: "8+",
        technologies: "15+",
        deployedApps: "5+",
    },

    skills: [
        "React", "Next.js", "Node.js", "Vite", "Firebase", "Docker", "Nginx",
        "ESP32", "ESP8266", "Arduino", "C++", "Verilog", "VLSI",
        "Python", "AI/ML", "YOLOv5", "CNN",
        "Google Gemini AI", "ChatGPT", "Antigravity", "Claude AI", "Claude Code CLI", "Perplexity AI", "Groq",
        "Ollama (Local LLMs)", "Whisk", "Flow", "LLM Integration", "Bolt.new",
        "Cursor AI", "GitHub Copilot", "Copilot CLI", "Code Agents", "MCP Server",
        "AI Skills", "Autonomous Agents", "Botpress",
        "Cloudflare Tunnel", "PostgreSQL", "WebSockets", "REST APIs",
        "Tailwind CSS", "Framer Motion", "Git", "Vercel",
        "Self-Hosting", "DevOps", "Microservices", "IoT"
    ],

    projects: [
        {
            id: "ai-integrated-smart-home",
            title: "AI-Integrated Smart Home Automation System",
            category: "Cloud, IoT",
            description: "A fully functional cloud-connected smart home automation system that enables real-time control of electrical appliances through Amazon Alexa, Apple Siri, and a custom web dashboard. Built around ESP32 microcontroller with Firebase Realtime Database. Controls lights, fans, and power outlets using voice commands or remote web access. Ensures two-way synchronization between physical switches and cloud commands.",
            tech: ["ESP32", "Firebase", "Next.js", "Alexa", "Siri", "Node.js", "C++"]
        },
        {
            id: "smart-anti-theft-bag",
            title: "Smart Anti-Theft Bag",
            category: "IoT",
            description: "A compact IoT-powered backpack that improves personal security using RFID authentication and real-time Telegram alerts. Built with ESP8266. If no valid RFID card is scanned within 5 seconds of zipper opening, a buzzer sounds and a Telegram alert is sent. Uses MFRC522 RFID reader, piezo buzzer, physical switch for zipper detection, and Wi-Fi cloud messaging.",
            tech: ["ESP8266", "RFID MFRC522", "Telegram Bot API", "Arduino IDE", "Piezo Buzzer"],
            github: "https://github.com/karthiktatineni/Smart-Bag"
        },
        {
            id: "ai-powered-esp32",
            title: "AI-Powered ESP32",
            category: "AI/ML",
            description: "Integration of ESP32 with Google Gemini AI to create an interactive AI-powered assistant with audio output — enabling voice-based interaction without a computer or heavy cloud setup. Applications include smart home voice assistants, accessibility tools, educational companions, and IoT devices.",
            tech: ["ESP32", "Google Gemini AI", "Text-to-Speech", "Arduino IDE", "Wi-Fi"],
            github: "https://github.com/karthiktatineni/Gemini-integrated-ESP32"
        },
        {
            id: "ollama-local-ai",
            title: "OLLAMA Based Local AI",
            category: "AI/ML",
            description: "Integration between ESP32 and Ollama — a local LLM engine running on a PC — allowing the ESP32 to communicate with advanced language models like LLaMA, Phi, Mistral, and Gemma without cloud services. Uses ngrok for secure tunneling. Works completely over local hardware.",
            tech: ["ESP32", "Ollama", "LLaMA", "Phi", "Mistral", "Ngrok", "HTTP API"],
            github: "https://github.com/karthiktatineni/Ollama_on_ESP32"
        },
        {
            id: "klvora-fashion",
            title: "Klvora - Fashion Website",
            category: "Web",
            description: "A modern fashion e-commerce website built with React and Neon DBMS for dynamic product management. Features automated email workflows for customer engagement, sleek responsive design, and seamless user experience.",
            tech: ["React", "Neon DBMS", "Node.js", "Email Automation", "Tailwind CSS"],
            github: "https://github.com/karthiktatineni/luxethreads-studio"
        },
        {
            id: "personal-ai-bot",
            title: "Personal AI Bot",
            category: "AI/ML",
            description: "A personalized AI bot trained on resume and portfolio details, built using Botpress and OpenAI. Hosted online and trained with FAQs, resume content, and personalized replies using knowledge base integration.",
            tech: ["Botpress", "OpenAI GPT", "Knowledge Base", "Web Embedding"]
        },
        {
            id: "helmet-detection",
            title: "Helmet & Triple-Ride Detection",
            category: "AI/ML",
            description: "Deep learning system using YOLOv5 + CNN to detect motorcyclists violating traffic rules — specifically those not wearing helmets or riding with more than two passengers. Optimized for accuracy and real-time performance using OpenCV and PyTorch.",
            tech: ["YOLOv5", "CNN", "OpenCV", "PyTorch", "Python"],
            github: "https://github.com/karthiktatineni/Helmet-tripleride-Detection"
        },
        {
            id: "smart-home-automation",
            title: "Smart Home Automation (Sinric Pro + Alexa)",
            category: "IoT",
            description: "Smart home automation system using ESP8266 to wirelessly control appliances like lights and fans. Integrated with Alexa using Sinric Pro and the Cadio App for voice-controlled operation.",
            tech: ["ESP8266", "Alexa", "Sinric Pro", "Relay Modules", "Arduino IDE"],
            github: "https://github.com/karthiktatineni/Home-automation"
        },
        {
            id: "environmental-monitoring",
            title: "Environmental Monitoring System",
            category: "IoT",
            description: "Smart environmental monitoring system powered by ESP8266 and DHT11 sensor. Shows real-time temperature, humidity, and air quality on a web dashboard, auto-refreshed every few seconds with color-coded safe/unsafe ranges.",
            tech: ["ESP8266", "DHT11", "HTML/CSS/JS", "REST API", "Arduino IDE"],
            github: "https://github.com/karthiktatineni/weather_monitoring_System"
        },
        {
            id: "smart-calling-bell",
            title: "Smart Calling Bell System",
            category: "IoT",
            description: "ESP32-based calling bell system that notifies home occupants via Blynk app when a visitor presses the bell. Compact and suitable for smart homes, offices, and accessible homes.",
            tech: ["ESP32", "Blynk", "Piezo Buzzer", "Arduino IDE", "OTA Updates"]
        },
        {
            id: "audio-spectrum-analyzer",
            title: "Analog Audio Spectrum Analyzer",
            category: "Electronics",
            description: "A pure analog electronics project that visualizes audio frequency spectrum without any microcontroller. Uses carefully designed circuits with capacitors, zener diodes, and rectifier diodes.",
            tech: ["Analog Electronics", "Capacitors", "Zener Diodes", "Rectifier Diodes", "PCB Design"]
        },
        {
            id: "ambient-light-esp",
            title: "Ambient Light Using ESP",
            category: "IoT",
            description: "An immersive ambient lighting system using ESP8266 and WLED firmware to control WS2812 LED strips. Syncs with screen content through SignalRGB for a dynamic visual experience.",
            tech: ["ESP8266", "WLED", "WS2812", "SignalRGB", "LED Programming"]
        },
        {
            id: "esp-joke-generator",
            title: "ESP Joke Generator",
            category: "IoT",
            description: "Fun IoT project using ESP to fetch jokes from an online API and display them on a 16x2 LCD screen, with an interactive button to reveal the punchline.",
            tech: ["ESP8266", "LCD 16x2", "API Integration", "Arduino IDE", "C++"],
            github: "https://github.com/karthiktatineni/ESP32-based-joke-generator"
        },
        {
            id: "esp32-desk-mochi",
            title: "ESP32 Desk Mochi",
            category: "IoT",
            description: "An adorable ESP32-powered desk companion that displays time and weather on an OLED screen, featuring dynamic facial expressions that change based on conditions.",
            tech: ["ESP32", "OLED Display", "Weather API", "Animation", "C++"],
            github: "https://github.com/karthiktatineni/Desk_mochi"
        },
        {
            id: "verilog-logic-gates",
            title: "Logic Gates Using Verilog",
            category: "VLSI",
            description: "Implements basic combinational logic gates — AND, OR, NOT, NAND, NOR, XOR, and XNOR — using Verilog HDL. VCD waveform files generated for visualization and verification.",
            tech: ["EDAplayground", "Verilog", "Logic Gates", "RTL modeling"]
        },
        {
            id: "verilog-half-adder-subtractor",
            title: "Half Adder & Subtractor (Verilog)",
            category: "VLSI",
            description: "Combined Half Adder and Half Subtractor implemented using Verilog HDL with testbench and VCD waveform output.",
            tech: ["EDAplayground", "Verilog", "Adder", "Subtractor", "RTL modeling"]
        },
        {
            id: "iare-consortium",
            title: "IARE Consortium Platform",
            category: "Web",
            description: "A comprehensive web platform built for IARE's technical consortium to streamline event management. Features a robust admin panel for organizing events, tracking registrations, and managing content dynamically.",
            tech: ["React", "Vite", "Firebase", "Vercel", "Tailwind CSS", "Domain management"],
            github: "https://github.com/karthiktatineni/iareconsortium25"
        },
        {
            id: "iare-mun",
            title: "IARE MUN Website",
            category: "Web",
            description: "Official website for IARE Model United Nations, designed for large-scale delegate registrations. Includes a secure admin dashboard for the secretariat to manage applications and allocate countries.",
            tech: ["React", "Vite", "Firebase", "Vercel", "Tailwind CSS"],
            github: "https://github.com/karthiktatineni/munfirebase"
        },
        {
            id: "nextcloud-home-server",
            title: "Nextcloud Home Cloud Server",
            category: "Cloud",
            description: "Self-hosted Nextcloud home server on a personal PC with Docker and external hard disk for persistent storage. Cloudflare Tunnel used to securely expose the server worldwide without port forwarding.",
            tech: ["Nextcloud", "Docker", "PostgreSQL", "Cloudflare Tunnel", "Self-Hosting", "Networking"],
            github: "https://github.com/karthiktatineni/localcloud"
        },
        {
            id: "iare-mun-devops",
            title: "IARE MUN - Full DevOps Architecture",
            category: "DevOps",
            description: "Enterprise-grade MUN platform with high-availability infrastructure: Layer 7 Load Balancers, API Gateway, Dockerized microservices, and sophisticated Redis caching layers.",
            tech: ["Load Balancers", "API Gateway", "Docker", "Redis Caching", "Nginx", "Firebase", "Cloudflare", "React"],
            github: "https://github.com/karthiktatineni/munproduction"
        },
        {
            id: "personal-home-server",
            title: "Personal Home Server & Private Cloud",
            category: "Cloud, DevOps",
            description: "A high-performance, self-hosted infrastructure using Docker Compose featuring: Nextcloud for cloud storage, Plex for media streaming, n8n for workflow automation, custom Datacenter Monitor with real-time WebSocket metrics, and a Dockerized Minecraft server. Secured via Cloudflare Tunnels.",
            tech: ["Docker", "Cloudflare Tunnel", "Nginx", "Nextcloud", "Plex", "n8n", "Node.js", "PostgreSQL", "WebSockets"],
            github: "https://github.com/karthiktatineni/homeserver"
        },
        {
            id: "ai-agent-team",
            title: "Autonomous AI Agentic Team",
            category: "AI/ML",
            description: "A fully autonomous, multi-agent development pipeline designed to transform high-level ideas into production-ready software systems. Uses MCP Protocol to coordinate a team of 10+ AI agents (Researcher, Architect, Coder, etc.) through a central orchestrator and real-time dashboard.",
            tech: ["Claude Code", "MCP Protocol", "Node.js", "React", "Ollama", "WebSockets"],
            github: "https://github.com/karthiktatineni/claude-code-agentic-team"
        }
    ],

    interests: ["IoT", "AI/ML", "VLSI", "Embedded Systems", "Self-Hosting", "Gaming", "Web Development", "DevOps", "Cloud Computing"],

    contact: {
        github: "https://github.com/karthiktatineni",
        linkedin: "https://linkedin.com/in/karthik-tatineni",
        instagram: "https://instagram.com/_karthik._.14",
        ContactNumber: "+91 7995466261",
    }
};

// Build the system prompt for the AI
export function buildSystemPrompt() {
    const projectList = userInfo.projects
        .map(p => `  - ${p.title} (${p.category}): ${p.description} | Tech: ${p.tech.join(", ")}${p.github ? ` | GitHub: ${p.github}` : ""}`)
        .join("\n");

    return `You are an AI assistant embedded in the personal portfolio of ${userInfo.name}.
Your ONLY job is to answer questions about ${userInfo.name}. Do NOT answer anything unrelated to ${userInfo.name}.
If a question is not about ${userInfo.name}, politely decline and say you can only answer questions about Karthik.

Here is everything you know about ${userInfo.name}:

NAME: ${userInfo.name}
TITLE: ${userInfo.title}
COLLEGE: ${userInfo.college}
BRANCH: ${userInfo.branch}
GITHUB: ${userInfo.github}

BIO:
${userInfo.bio}

STATS:
- Projects Built: ${userInfo.stats.projectsBuilt}
- Tech Domains: ${userInfo.stats.techDomains}
- Technologies Known: ${userInfo.stats.technologies}
- Deployed Apps: ${userInfo.stats.deployedApps}

SKILLS: ${userInfo.skills.join(", ")}

INTERESTS: ${userInfo.interests.join(", ")}

PROJECTS (${userInfo.projects.length} total):
${projectList}

CONTACT:
- GitHub: ${userInfo.contact.github}
- LinkedIn: ${userInfo.contact.linkedin}
- Instagram: ${userInfo.contact.instagram}

IMPORTANT RULES:
- Always speak as the assistant for ${userInfo.name}'s portfolio, referring to him in third person or as "Karthik".
- Be helpful, friendly, and concise. Be precise with technical details.
- If asked about something not covered above, say you don't have that specific info but the user can contact Karthik directly on GitHub.
- NEVER answer questions unrelated to Karthik Tatineni.
- Keep answers clear and well-structured. Use bullet points or bold text when helpful.`;
}
