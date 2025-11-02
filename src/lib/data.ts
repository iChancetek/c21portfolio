
import { Project, SkillCategory, Venture } from "@/lib/types";
import { Code, PanelTop, Server, BrainCircuit, ServerCog, Database, Wind, Bot, Search, GitBranch, ExternalLink, Send, Github, Linkedin, Twitter, HeartPulse, Microscope, FileText, MessagesSquare, Lightbulb, Users, HandHeart, Briefcase, ShoppingCart, Drama, CloudCog, Workflow, MicVocal, CreditCard, Mail, TestTubeDiagonal, Cloud, Puzzle, Filter, Monitor, Sparkles, SlidersHorizontal, Share2, Globe, Building, Architecture, BarChart, TestTube } from "lucide-react";
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
    liveUrl: "https://ichancetek.com",
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
        name: "iChanceTEK",
        href: "https://iChanceTEK.com",
        description: "AI systems and digital transformation consultancy specializing in intelligent automation and enterprise cloud integrations."
    },
    {
        name: "ChanceTEK Health",
        href: "https://chancetekhealth.us",
        description: "Healthcare automation platform focusing on smart referrals, patient intake, and digital consent capture."
    },
    {
        name: "iQMarketing",
        href: "https://iQMarketing.us",
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
      { name: "ShadCN UI", icon: SlidersHorizontal },
      { name: "Tailwind CSS", icon: Wind },
    ],
  },
  {
    title: "Backend & APIs",
    skills: [
      { name: "Node.js", icon: Server },
      { name: "Python (Flask, FastAPI, Django)", icon: Code },
      { name: "APIs / REST APIs", icon: Puzzle },
      { name: "Firebase", icon: Code },
      { name: "Supabase", icon: Database },
      { name: "MySQL / PostgreSQL", icon: Database },
      { name: "Stripe", icon: CreditCard },
      { name: "Resend / SendGrid", icon: Mail },
    ],
  },
  {
    title: "AI Platforms & Models",
    skills: [
      { name: "GCP Vertex AI", icon: BrainCircuit },
      { name: "AWS Bedrock / SageMaker", icon: BrainCircuit },
      { name: "Azure Machine Learning", icon: BrainCircuit },
      { name: "Gemini, GPT, Claude", icon: Bot },
      { name: "Hugging Face Models", icon: Bot },
    ],
  },
  {
    title: "AI Agent Engineering",
    skills: [
      { name: "Prompt Engineering", icon: Lightbulb },
      { name: "Agentic Workflows", icon: Bot },
      { name: "RAG / AI Chatbots", icon: MessagesSquare },
      { name: "Fine-tuning", icon: SlidersHorizontal },
      { name: "A/B Testing", icon: TestTubeDiagonal },
      { name: "Voice AI Agents", icon: MicVocal },
    ],
  },
   {
    title: "Data Engineering",
    skills: [
      { name: "ETL / ELT", icon: Filter },
      { name: "AWS Glue / Kinesis", icon: Workflow },
      { name: "AWS Redshift", icon: Database },
      { name: "Azure DataBricks / Spark", icon: Sparkles },
      { name: "Azure Data Factory / Synapse / DataLake", icon: CloudCog },
    ],
  },
  {
    title: "Data Science & ML",
    skills: [
        { name: "Pandas & Numpy", icon: Database },
        { name: "Seaborn & Matplotlib", icon: BarChart },
        { name: "Scikit-learn", icon: TestTubeDiagonal },
    ]
  },
  {
    title: "Cloud & DevOps",
    skills: [
        { name: "AWS, GCP, Azure", icon: CloudCog },
        { name: "System Design", icon: Architecture },
        { name: "Docker / Docker Hub", icon: ServerCog },
        { name: "GitHub Actions / GitLab", icon: GitBranch },
        { name: "Jenkins / Azure DevOps", icon: ServerCog },
        { name: "Vercel", icon: Cloud },
        { name: "MLOps / DevOps", icon: ServerCog },
    ],
  },
  {
    title: "AI Dev Tools",
    skills: [
      { name: "Firebase Studio AI", icon: Code },
      { name: "Vibe Coding", icon: Code },
      { name: "Cursor AI / Replit", icon: Monitor },
      { name: "Genkit / CrewAI", icon: Users },
      { name: "LangChain / LangGraph", icon: GitBranch },
      { name: "Postman / Insomnia", icon: TestTubeDiagonal },
      { name: "Loveable", icon: HeartPulse },
    ],
  },
  {
    title: "Microsoft Enterprise",
    skills: [
      { name: "Microsoft 365", icon: Globe },
      { name: "Teams / SharePoint / Exchange", icon: Share2 },
      { name: "AutoPilot / InTune", icon: Building },
      { name: "Workflow Automation (Power Automate)", icon: Workflow },
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

    

    




    




    

    

    


