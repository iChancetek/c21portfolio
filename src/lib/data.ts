import { Project, SkillCategory } from "@/lib/types";
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

export const ventures = [
    { name: 'iSynera.com', href: 'https://isynera.com' },
    { name: 'iSynerahealth.com', href: 'https://isynerahealth.com' },
    { name: 'isyneramarking.us', href: 'https://isyneramarking.us' },
    { name: 'MediScribe.us', href: 'https://mediscribe.us' },
    { name: 'MemoiQ.us', href: 'https://memoiq.us' },
    { name: 'ModeliQ.us', href: 'https://modeliq.us' },
    { name: 'WoundiQ.us', href: 'https://woundiq.us' },
    { name: 'iSydney.us', href: 'https://isydney.us' },
    { name: 'iHailey.us', href: 'https://ihailey.us' },
    { name: 'iSkylar.us', href: 'https://iskylar.us' },
    { name: 'Nestobanks.com', href: 'https://nestobanks.com' },
    { name: 'ThePotluxe.com', href: 'https://thepotluxe.com' },
];
