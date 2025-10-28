import { Project, SkillCategory, Venture } from "@/lib/types";
import { Code, PanelTop, Server, BrainCircuit, ServerCog, Database, Wind, Bot, Search, GitBranch, ExternalLink, Send, Github, Linkedin, Twitter, HeartPulse, Microscope, FileText, MessagesSquare, Lightbulb, Users, HandHeart, Briefcase, ShoppingCart, Drama, TestTube, CloudCog, Workflow, MicVocal } from "lucide-react";
import { PlaceHolderImages } from "./placeholder-images";

const getPlaceholderImage = (id: string) => {
    const image = PlaceHolderImages.find(p => p.id === id);
    if (!image) {
        return { src: 'https://picsum.photos/seed/placeholder/600/400', alt: 'Placeholder', hint: 'placeholder' };
    }
    return { src: image.imageUrl, alt: image.description, hint: image.imageHint };
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "Project Alpha",
    oneLiner: "An AI-powered data analysis platform.",
    image: getPlaceholderImage('proj-1'),
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase", "Genkit"],
    githubUrl: "https://github.com",
    liveUrl: "https://isynera.com",
  },
  {
    id: "project-2",
    title: "Project Beta",
    oneLiner: "A real-time collaborative code editor.",
    image: getPlaceholderImage('proj-2'),
    techStack: ["React", "Node.js", "WebSocket", "PostgreSQL"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "project-3",
    title: "Project Gamma",
    oneLiner: "A serverless image processing pipeline.",
    image: getPlaceholderImage('proj-3'),
    techStack: ["AWS Lambda", "S3", "API Gateway", "Python"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "project-4",
    title: "Project Delta",
    oneLiner: "A generative art installation using AI.",
    image: getPlaceholderImage('proj-4'),
    techStack: ["p5.js", "TensorFlow.js", "Genkit"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
    {
    id: "project-5",
    title: "Project Epsilon",
    oneLiner: "A decentralized social media application.",
    image: getPlaceholderImage('proj-5'),
    techStack: ["Next.js", "Solidity", "IPFS", "GraphQL"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "project-6",
    title: "Project Zeta",
    oneLiner: "A DevOps automation and monitoring dashboard.",
    image: getPlaceholderImage('proj-6'),
    techStack: ["Go", "Prometheus", "Grafana", "Kubernetes"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
];

export const ventures: Omit<Venture, 'id'>[] = [
    {
        name: "iSynera",
        href: "https://iSynera.com",
        description: "AI systems and digital transformation consultancy specializing in intelligent automation and enterprise cloud integrations."
    },
    {
        name: "iSynera Health",
        href: "https://iSynerahealth.com",
        description: "Healthcare automation platform focusing on smart referrals, patient intake, and digital consent capture."
    },
    {
        name: "iSynera Marketing",
        href: "https://isyneramarking.us",
        description: "AI-driven marketing analytics and personalized campaign management suite."
    },
    {
        name: "MediScribe",
        href: "https://MediScribe.us",
        description: "AI medical documentation assistant with live transcription, SOAP notes, and EHR integration."
    },
    {
        name: "MemoiQ",
        href: "https://MemoiQ.us",
        description: "Personal AI memory and journaling assistant with long-term context understanding."
    },
    {
        name: "ModeliQ",
        href: "https://ModeliQ.us",
        description: "AI model training and deployment automation for custom LLM fine-tuning and inference."
    },
    {
        name: "WoundiQ",
        href: "https://WoundiQ.us",
        description: "AI wound care management system with image analysis, SOAP generation, and role-based nurse/admin dashboards."
    },
    {
        name: "iSydney",
        href: "https://iSydney.us",
        description: "Conversational AI voice companion for therapeutic and lifestyle engagement."
    },
    {
        name: "iHailey",
        href: "https://iHailey.us",
        description: "AI-driven emotional support and mental wellness companion with natural voice interaction."
    },
    {
        name: "iSkylar",
        href: "https://iSkylar.us",
        description: "AI Voice Therapist combining generative empathy models and therapeutic dialogue systems."
    },
    {
        name: "Nesto Banks",
        href: "https://Nestobanks.com",
        description: "Fintech and digital banking platform enhanced with AI-based fraud detection and risk analytics."
    },
    {
        name: "The Potluxe",
        href: "https://ThePotluxe.com",
        description: "AI-powered luxury product marketplace and social commerce platform."
    }
];

export const ventureIcons = [Briefcase, HeartPulse, Search, FileText, Lightbulb, BrainCircuit, Microscope, MessagesSquare, HandHeart, Drama, Users, ShoppingCart];


export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: Code },
      { name: "Next.js", icon: Code },
      { name: "TypeScript", icon: Code },
      { name: "ShadCN UI", icon: Code },
      { name: "Tailwind CSS", icon: Wind },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: Server },
      { name: "Python", icon: Code },
      { name: "Drizzle", icon: Database },
      { name: "Neon PostgreSQL", icon: Database },
      { name: "Firebase", icon: Code },
      { name: "Supabase", icon: Database },
      { name: "Clerk", icon: Code },
    ],
  },
  {
    title: "AI Platforms & Models",
    skills: [
      { name: "GCP Vertex AI", icon: BrainCircuit },
      { name: "AWS Bedrock", icon: BrainCircuit },
      { name: "Azure AI Foundry", icon: BrainCircuit },
      { name: "Gemini, GPT, Claude", icon: Bot },
      { name: "Meta LLaMA", icon: Bot },
      { name: "DeepSeek", icon: Bot },
    ],
  },
  {
    title: "AI Agent Engineering",
    skills: [
      { name: "AI Agentic Agents", icon: Bot },
      { name: "Voice AI Agents", icon: MicVocal },
      { name: "RAG AI Chatbots", icon: MessagesSquare },
      { name: "RAG AI Assistants", icon: MessagesSquare },
      { name: "Embedding Strategies", icon: Code },
      { name: "Fine-tuning", icon: BrainCircuit },
      { name: "A/B testing", icon: TestTube },
    ],
  },
    {
    title: "Cloud & DevOps",
    skills: [
      { name: "AWS Cloud Engineer", icon: CloudCog },
      { name: "Azure Cloud Engineering", icon: CloudCog },
      { name: "GCP Cloud Engineer", icon: CloudCog },
      { name: "DevOps", icon: ServerCog },
      { name: "MLOps", icon: ServerCog },
      { name: "Kubernetes", icon: ServerCog },
      { name: "Terraform", icon: ServerCog },
      { name: "Docker", icon: ServerCog },
    ],
  },
  {
    title: "AI Dev Tools",
    skills: [
      { name: "Firebase Studio AI", icon: Code },
      { name: "Cursor AI", icon: Code },
      { name: "Replit", icon: Code },
      { name: "Hugging Face", icon: BrainCircuit },
      { name: "Genkit", icon: Bot },
      { name: "CrewAI", icon: Users },
    ],
  },
  {
    title: "AI Tools & Platforms",
    skills: [
      { name: "LangChain", icon: GitBranch },
      { name: "LangGraph", icon: GitBranch },
      { name: "LangSmith", icon: GitBranch },
      { name: "Langflow", icon: GitBranch },
      { name: "Pinecone", icon: Database },
      { name: "ChromaDB", icon: Database },
      { name: "OpenAI Agents SDK", icon: Bot },
      { name: "ElevenLabs", icon: MicVocal },
      { name: "Twilio", icon: MessagesSquare },
      { name: "Retell AI", icon: Bot },
      { name: "VAPI", icon: MicVocal },
    ],
  },
  {
    title: "Workflow Automation",
    skills: [
        { name: "Workflow Automation", icon: Workflow },
        { name: "Zapier", icon: Workflow },
        { name: "Make.com", icon: Workflow },
        { name: "N8N", icon: Workflow },
        { name: "Airtable", icon: Database },
        { name: "Flowise AI", icon: Workflow },
    ]
  }
];

export const navLinks = [
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
];

export const socialLinks = [
    { name: "GitHub", href: "#", icon: Github },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Twitter", href: "#", icon: Twitter },
]
