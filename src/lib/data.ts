import { Project, SkillCategory, Venture } from "@/lib/types";
import { Code, PanelTop, Server, BrainCircuit, ServerCog, Database, Wind, Bot, Search, GitBranch, ExternalLink, Send, Github, Linkedin, Twitter } from "lucide-react";
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
    liveUrl: "https://isynerahealth.com",
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

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: Code },
      { name: "Next.js", icon: Code },
      { name: "TypeScript", icon: Code },
      { name: "Tailwind CSS", icon: Wind },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: Server },
      { name: "Python", icon: Code },
      { name: "Go", icon: Code },
      { name: "PostgreSQL", icon: Database },
      { name: "Firebase", icon: Code },
    ],
  },
  {
    title: "AI/ML",
    skills: [
      { name: "Genkit", icon: Bot },
      { name: "TensorFlow", icon: BrainCircuit },
      { name: "PyTorch", icon: BrainCircuit },
      { name: "LangChain", icon: Code },
    ],
  },
  {
    title: "DevOps",
    skills: [
      { name: "Docker", icon: ServerCog },
      { name: "Kubernetes", icon: ServerCog },
      { name: "GitHub Actions", icon: GitBranch },
      { name: "AWS", icon: ServerCog },
    ],
  },
];

export const navLinks = [
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Ventures", href: "#ventures" },
    { name: "Contact", href: "#contact" },
];

export const socialLinks = [
    { name: "GitHub", href: "#", icon: Github },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Twitter", href: "#", icon: Twitter },
]

export const ventures: Venture[] = [
    { 
        name: 'iSynera', 
        href: 'https://isynera.com',
        description: 'AI systems and digital transformation consultancy specializing in intelligent automation and enterprise cloud integrations.'
    },
    { 
        name: 'iSynera Health', 
        href: 'https://isynerahealth.com',
        description: 'Healthcare automation platform focusing on smart referrals, patient intake, and digital consent capture.'
    },
    { 
        name: 'iSynera Marketing', 
        href: 'https://isyneramarking.us',
        description: 'AI-driven marketing analytics and personalized campaign management suite.'
    },
    { 
        name: 'MediScribe', 
        href: 'https://mediscribe.us',
        description: 'AI medical documentation assistant with live transcription, SOAP notes, and EHR integration.'
    },
    { 
        name: 'MemoiQ', 
        href: 'https://memoiq.us',
        description: 'Personal AI memory and journaling assistant with long-term context understanding.'
    },
    { 
        name: 'ModeliQ', 
        href: 'https://modeliq.us',
        description: 'AI model training and deployment automation for custom LLM fine-tuning and inference.'
    },
    { 
        name: 'WoundiQ', 
        href: 'https://woundiq.us',
        description: 'AI wound care management system with image analysis, SOAP generation, and role-based nurse/admin dashboards.'
    },
    { 
        name: 'iSydney', 
        href: 'https://isydney.us',
        description: 'Conversational AI voice companion for therapeutic and lifestyle engagement.'
    },
    { 
        name: 'iHailey', 
        href: 'https://ihailey.us',
        description: 'AI-driven emotional support and mental wellness companion with natural voice interaction.'
    },
    { 
        name: 'iSkylar', 
        href: 'https://iskylar.us',
        description: 'AI Voice Therapist combining generative empathy models and therapeutic dialogue systems.'
    },
    { 
        name: 'Nesto Banks', 
        href: 'https://nestobanks.com',
        description: 'Fintech and digital banking platform enhanced with AI-based fraud detection and risk analytics.'
    },
    { 
        name: 'The Potluxe', 
        href: 'https://thepotluxe.com',
        description: 'AI-powered luxury product marketplace and social commerce platform.'
    },
];