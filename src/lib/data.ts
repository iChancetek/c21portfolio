
import { Project, SkillCategory, Venture, VentureIcon } from "@/lib/types";
import { Code, PanelTop, Server, BrainCircuit, ServerCog, Database, Wind, Bot, Search, GitBranch, ExternalLink, Send, Github, Linkedin, Twitter, HeartPulse, Microscope, FileText, MessagesSquare, Lightbulb, Users, HandHeart, Briefcase, ShoppingCart, Drama, CloudCog, Workflow, MicVocal, CreditCard, Mail, TestTubeDiagonal, Cloud, Puzzle, Filter, Monitor, Sparkles, SlidersHorizontal, Share2, Globe, Building, Architecture, BarChart, Route, Network, ServerCrash, MessageCircle, FunctionSquare, Binary, GitCommit, ListTree, Sigma, Box, Shield, ShieldCheck, Factory, Layers, Book, CheckCircle, Package, Upload, Instagram } from "lucide-react";
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

export const ventureIcons: VentureIcon[] = [
    { name: "iChanceTEK", icon: Briefcase },
    { name: "ChanceTEK Health", icon: HeartPulse },
    { name: "iQMarketing", icon: Search },
    { name: "MediScribe", icon: FileText },
    { name: "MemoiQ", icon: Lightbulb },
    { name: "ModeliQ", icon: BrainCircuit },
    { name: "WoundiQ", icon: Microscope },
    { name: "iSydney", icon: MessagesSquare },
    { name: "iHailey", icon: HandHeart },
    { name: "iSkylar", icon: Drama },
    { name: "Nesto Banks", icon: Users },
    { name: "The Potluxe", icon: ShoppingCart }
];

export const partnerCompanies = [
  { name: "Condé Nast" },
  { name: "Advance" },
  { name: "SIMON" },
  { name: "Braiva Capital" },
  { name: "Couristan" },
  { name: "Brexa Bio Inc." },
  { name: "Nama Harlem" },
  { name: "WNDR" },
  { name: "Alpharma Pharmaceuticals" },
  { name: "Novartis Pharmaceuticals" },
];


export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "HTML", icon: Code },
      { name: "CSS", icon: Code },
      { name: "JavaScript", icon: Code },
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
      { name: "C#", icon: Code },
      { name: "R", icon: Code },
      { name: "APIs / REST APIs", icon: Puzzle },
      { name: "API Gateway", icon: Puzzle },
      { name: "Firebase Authentication", icon: Shield },
      { name: "Firebase Database", icon: Database },
      { name: "Firebase Functions", icon: CloudCog },
      { name: "Firebase Hosting", icon: Globe },
      { name: "Firebase Storage", icon: ServerCog },
      { name: "Clerk", icon: ShieldCheck },
      { name: "Supabase", icon: Database },
      { name: "MySQL / PostgreSQL", icon: Database },
      { name: "Stripe", icon: CreditCard },
      { name: "Resend / SendGrid", icon: Mail },
      { name: "MongoDB", icon: Database },
      { name: "MongoDB Atlas", icon: Cloud },
      { name: "Snowflake", icon: Database },
      { name: "Cosmos DB", icon: Database },
      { name: "Kafka", icon: Layers },
      { name: "RabbitMQ", icon: MessageCircle },
    ],
  },
  {
    title: "AI Platforms & Models",
    skills: [
      { name: "GCP Vertex AI", icon: BrainCircuit },
      { name: "AWS Bedrock / SageMaker AI", icon: BrainCircuit },
      { name: "Azure Machine Learning", icon: BrainCircuit },
      { name: "Azure Foundry", icon: Factory },
      { name: "Gemini, GPT, Claude", icon: Bot },
      { name: "Claude Code", icon: Code },
      { name: "Meta Llama", icon: Bot },
      { name: "DeepSeek", icon: Bot },
      { name: "Qwen", icon: Bot },
      { name: "Hugging Face Models", icon: Bot },
    ],
  },
  {
    title: "AI Agent Engineering",
    skills: [
      { name: "AI Engineering", icon: Bot },
      { name: "Prompt Engineering", icon: Lightbulb },
      { name: "Agentic Workflows", icon: Bot },
      { name: "AI Agents", icon: Bot },
      { name: "RAG / AI Chatbots", icon: MessagesSquare },
      { name: "Fine-tuning", icon: SlidersHorizontal },
      { name: "A/B Testing", icon: TestTubeDiagonal },
      { name: "Voice AI Agents", icon: MicVocal },
      { name: "Document Loader", icon: Upload },
      { name: "RecursiveCharacterTextSplitter", icon: Puzzle },
      { name: "Data Chunking", icon: Puzzle },
      { name: "OpenAI Embedding", icon: Binary },
      { name: "Hugging Face Embedding", icon: Binary },
      { name: "Document Embedding", icon: Binary },
      { name: "Retriever", icon: Search },
      { name: "Vector Databases", icon: Database },
      { name: "Pinecone", icon: Database },
      { name: "Chroma", icon: Database },
      { name: "AWS S3 Vector", icon: Database },
    ],
  },
   {
    title: "Data Engineering",
    skills: [
      { name: "ETL / ELT", icon: Filter },
      { name: "Dataframe", icon: Database },
      { name: "Microsoft Fabric", icon: Building },
      { name: "AWS Glue / Kinesis", icon: Workflow },
      { name: "AWS Redshift", icon: Database },
      { name: "Azure DataBricks", icon: Sparkles },
      { name: "Apache Spark", icon: Sparkles },
      { name: "Tableau", icon: BarChart },
      { name: "Power BI", icon: BarChart },
    ],
  },
  {
    title: "Data Science & ML",
    skills: [
        { name: "Pandas & Numpy", icon: Database },
        { name: "Seaborn & Matplotlib", icon: BarChart },
        { name: "Scikit-learn", icon: TestTubeDiagonal },
        { name: "PyTorch", icon: BrainCircuit },
        { name: "TensorFlow", icon: BrainCircuit },
        { name: "Data Structures", icon: GitCommit },
        { name: "Linear Regression", icon: FunctionSquare },
        { name: "Logistic Regression", icon: FunctionSquare },
        { name: "Decision Trees", icon: GitCommit },
        { name: "Naive Bayes", icon: Binary },
        { name: "Random Forest", icon: ListTree },
        { name: "Support Vector Machines (SVM)", icon: Sigma },
        { name: "K-Means", icon: Sigma },
        { name: "K-Nearest Neighbors (KNN)", icon: Sigma },
    ]
  },
  {
    title: "Cloud & DevOps",
    skills: [
        { name: "System Design", icon: Architecture },
        { name: "Docker", icon: Box },
        { name: "Docker Hub", icon: Box },
        { name: "Docker Desktop", icon: Monitor },
        { name: "Kubernetes (EKS, AKS, GKE)", icon: ServerCog },
        { name: "Helm", icon: Package },
        { name: "Serverless (Lambda, Functions, Cloud Run)", icon: CloudCog },
        { name: "Terraform", icon: Code },
        { name: "Powershell", icon: Code },
        { name: "AWS (EC2, Beanstalk, App Runner)", icon: Cloud },
        { name: "Azure (VMs, App Service, Container Apps)", icon: Cloud },
        { name: "GCP (Compute & App Engine)", icon: Cloud },
        { name: "Vercel", icon: Cloud },
        { name: "CI/CD (GitHub Actions, GitLab, Jenkins, Azure DevOps)", icon: GitBranch },
        { name: "MLOps / DevOps", icon: ServerCog },
        { name: "MLflow", icon: ServerCog },
        { name: "Amazon Route 53", icon: Route },
        { name: "Azure DNS", icon: Network },
        { name: "Azure Front Door", icon: Network },
        { name: "Application Load Balancer", icon: ServerCog },
        { name: "Nginx / Apache", icon: Server },
        { name: "Ansible", icon: Code },
        { name: "Prometheus / Grafana", icon: BarChart },
        { name: "ELK Stack", icon: Database },
        { name: "Istio / Pulumi", icon: Puzzle },
        { name: "Hashicorp Vault", icon: Shield },
        { name: "ArgoCD", icon: CheckCircle },
        { name: "VirtualBox / Vagrant", icon: Box },
        { name: "Minikube", icon: Box },
        { name: "Monday.com", icon: Package },
        { name: "Trello", icon: Package },
        { name: "UV (Python Package Manager)", icon: Package },
        { name: "Semgrep", icon: ShieldCheck },
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
      { name: "LangSmith", icon: TestTubeDiagonal },
      { name: "Flowise AI", icon: Workflow },
      { name: "Postman / Insomnia", icon: TestTubeDiagonal },
      { name: "Make.com", icon: Workflow },
      { name: "Zapier", icon: Workflow },
      { name: "N8N", icon: Workflow },
      { name: "Loveable", icon: HeartPulse },
      { name: "MCP - Model Context Protocol", icon: Code },
      { name: "OpenAI Agent SDK", icon: Code },
    ],
  },
  {
    title: "Microsoft Enterprise",
    skills: [
      { name: "Microsoft 365", icon: Globe },
      { name: "Teams / SharePoint / Exchange", icon: Share2 },
      { name: "AutoPilot / InTune", icon: Building },
      { name: "Power Automate", icon: Workflow },
    ]
  }
];

export const techTopics = [
  'GenAI',
  'Data Science',
  'Data Engineering',
  'DevOps',
  'MLOps',
  'BioTech',
  'Neural Networks',
  'Deep Learning',
  'LLMs',
  'OpenAI',
  'Claude',
  'Meta Llama',
  'Deepseek',
  'Hugging Face',
  'AWS',
  'Azure',
  'GCP',
  'Machine Learning',
] as const;

export const navLinks = [
    { name: "AI Assistant", href: "/ai-assistant", keywords: ['ai', 'assistant', 'ai assistant'] },
    { name: "Skills", href: "/projects#skills", keywords: ['skills', 'expertise'] },
    { name: "Contact", href: "/projects#contact", keywords: ['contact', 'get in touch', 'email'] },
    { name: "Affirmations", href: "/affirmations", keywords: ['affirmations', 'affirmation', 'inspiration'] },
];

export const socialLinks = [
    { name: "GitHub", href: "https://github.com/iChancetek", icon: Github },
    { name: "Instagram", href: "https://www.instagram.com/chancetek/", icon: Instagram },
    { name: "Twitter", href: "#", icon: Twitter },
]

    

    

    

    