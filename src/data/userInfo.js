// Comprehensive personal information for AI Chatbot system prompt
import { projects } from './projects.js';
import { skillCategories } from './skills.js';

// Flatten the skills from categories
const allSkills = Array.from(new Set(skillCategories.flatMap(cat => cat.skills)));

export const userInfo = {
    name: "Karthik Tatineni",
    title: "Student | Electronics & Communication Engineer | Machine Learning & GenAI Developer | Full-Stack Engineer",
    college: "Institute of Aeronautical Engineering (IARE), Hyderabad",
    branch: "Electronics and Communication Engineering (ECE)",
    github: "https://github.com/karthiktatineni",

    bio: `I'm Karthik Tatineni, an Independent Software & AI Developer and Electronics & Communication Engineering student at IARE, Hyderabad.
I specialize in engineering end-to-end Machine Learning pipelines, Generative AI & agentic platforms, and high-performance full-stack web applications.
My technical work centers on production ML systems and intelligent architectures: from causal feature engineering, entity graphs, and Optuna-tuned XGBoost risk scoring engines operating in sub-15ms, to local-first Generative AI assistants powered by open-source LLMs (Mistral, Qwen) with RAG and vector storage (ChromaDB, pgvector). I also build real-time computer vision pipelines with YOLO and CNNs for multi-class object detection.
With a solid foundation in modern web frameworks (FastAPI, Next.js) and cloud infrastructure (AWS, Azure, Docker, Redis), I bridge the gap between advanced predictive models and robust, user-facing production software.
I aim to architect scalable machine learning systems and intelligent platforms that transform complex data into reliable, real-time decisions.`,

    stats: {
        projectsBuilt: `${projects.length}+`,
        techDomains: "6+",
        technologies: `${allSkills.length}+`,
        deployedApps: "10+",
    },

    skills: allSkills,

    projects: projects.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.shortDescription,
        tech: p.technologies,
        github: p.githubUrl || null
    })),

    certifications: [
        { title: "Microsoft Certified(AI-901): Azure AI Fundamentals", issuer: "Microsoft AI Learning Path" },
        { title: "Microsoft Certified(AI-103): Azure AI Apps and Agents Developer Associate", issuer: "Microsoft AI Learning Path" },
        { title: "Microsoft Certified(DP-700): Fabric Data Engineer Associate", issuer: "Microsoft", url: "https://learn.microsoft.com/en-us/users/karthiktatineni-3461/credentials/4efa66e7a9114e16" },
        { title: "Introduction to Large Language Models", issuer: "Google" },
        { title: "MySQL & Database Management: Create, Manage & Query Databases", issuer: "Udemy" },
        { title: "GenAI For Image & Video Creation", issuer: "Udemy" },
        { title: "HTML & CSS: The Complete Web Development Guide", issuer: "Udemy" },
        { title: "Data Science basics using python -(Field Project)", issuer: "NSIC" },
        { title: "Claude 101", issuer: "Anthropic" },
        { title: "Claude AI Certification Path (Claude Code 101 & Claude Code in Action)", issuer: "Anthropic" }
    ],

    interests: ["Machine Learning", "Generative AI", "Agentic Systems", "Cloud Computing", "Full-Stack Development", "Computer Vision", "MLOps", "Distributed Systems", "IoT"],

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

    const certificationList = userInfo.certifications
        .map(c => `  - ${c.title} (Issued by: ${c.issuer})`)
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

CERTIFICATIONS:
${certificationList}

CONTACT:
- GitHub: ${userInfo.contact.github}
- LinkedIn: ${userInfo.contact.linkedin}
- Instagram: ${userInfo.contact.instagram}

IMPORTANT RULES:
- Always speak as the assistant for ${userInfo.name}'s portfolio, referring to him in third person or as "Karthik".
- Be helpful, friendly, and concise. Be precise with technical details.
- If asked about something not covered above, say you don't have that specific info but the user can contact Karthik directly on GitHub.
- NEVER answer questions unrelated to Karthik Tatineni.
- Keep answers clear and conversational.
- CRITICAL: DO NOT use any markdown formatting like bold (**text**), italics (*text*), or headers.
- CRITICAL: DO NOT use asterisks (*) for bullet points. Use simple dashes (-) or plain paragraphs.
- Provide links as bare URLs (e.g., https://github.com/karthiktatineni) so the system can handle them.
- Respond in a natural, clean chatbot style without any special formatting characters.`;
}
