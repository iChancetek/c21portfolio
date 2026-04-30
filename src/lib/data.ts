
import type { Project, SkillCategory, Venture, VentureIcon, PartnerCompany, ResumeData } from "@/lib/types";
import { Activity, Stethoscope, Code, PanelTop, Server, BrainCircuit, ServerCog, Database, Wind, Bot, Search, GitBranch, ExternalLink, Send, Github, Linkedin, Twitter, HeartPulse, Microscope, FileText, MessagesSquare, Lightbulb, Users, HandHeart, Briefcase, ShoppingCart, Drama, CloudCog, Workflow, MicVocal, CreditCard, Mail, TestTubeDiagonal, Cloud, Puzzle, Filter, Monitor, Sparkles, SlidersHorizontal, Share2, Globe, Building, BarChart, Route, Network, ServerCrash, MessageCircle, FunctionSquare, Binary, GitCommit, ListTree, Sigma, Box, Shield, ShieldCheck, Factory, Layers, Book, CheckCircle, Package, Upload, Instagram, Rabbit, Notebook, GraduationCap, LayoutDashboard } from "lucide-react";
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

export const allVentures: Venture[] = [
    {
        id: 'venture-21',
        name: "WorkSpaceIQ",
        description: "Power your thinking with WorkSpaceIQ. our AI Research & Dictation Partner. Dictate, research, and create. Upload any source, ask anything, and listen to an AI podcast of your own content — all in one place.",
        href: "https://WorkSpaceIQ.us",
        hasDemo: true,
    },
    {
        id: 'venture-20',
        name: "Chancellor",
        description: "Chancellor — ChancellorOS ERP & CRM Platform\n\nA platform built for a new way of working.\n\nUnify your operations, automate your workflows, and scale with intelligence—all in one system.\n\nWhat would you like to manage with Chancellor Work OS?\n\nPowered by ChancellorOS",
        href: "https://chancellor--ichancellor.us-east4.hosted.app/",
        hasDemo: true,
    },
    {
        id: 'venture-18',
        name: "iCareOS Premium",
        description: "Transform Healthcare with Intelligent AI. iCareOS Health revolutionizes medical documentation and workflow management with cutting-edge AI technology. Streamline patient intake, automate SOAP notes, and enhance clinical decision-making with HIPAA-compliant intelligence.",
        href: "https://icareos.us/",
        hasDemo: true,
    },
    {
        id: 'venture-17',
        name: "Evolvable",
        description: "Evolvable is an AI-powered vibe coding platform that enables anyone to design, build, and launch production-ready applications using nothing but natural language prompts.",
        href: "https://eVolvable.us/",
        hasDemo: true,
    },
    {
        id: 'venture-16',
        name: "iCareOS",
        description: "iCareOS by ChanceTEK is an AI-native clinical operating system that automates documentation, analyzes medical images, orchestrates patient intake, optimizes billing, monitors clinical risk, and coordinates care through a network of agentic AI modules—delivering smarter workflows, faster insights, and safer healthcare.",
        href: "https://iCareOS.tech/",
        hasDemo: true,
    },
    {
        id: 'venture-15',
        name: "StrideIQ",
        description: "StrideIQ is a fitness and wellness app designed to help you track your running, walking, biking, hiking, mediation, intermittent fasting and journaling-all in one place.",
        href: "https://StrideIQ.fit/",
        hasDemo: true,
    },
    {
        id: 'venture-13',
        name: "Famio",
        description: "AI Powered Social Media Platform",
        href: "https://Famio.us/",
        hasDemo: true,
    },
    {
        id: 'venture-1',
        name: "Enterprise AI Agents",
        description: "Enterprise AI that works like your best employee for better customer experiences.",
        href: "/ai-agents",
        hasDemo: true,
    },
    {
        id: 'venture-4',
        name: "MediScribe",
        description: "AI medical documentation assistant with live transcription, SOAP notes, and EHR integration.",
        href: "https://mediscribe.us",
        hasDemo: true,
    },
    {
        id: 'venture-5',
        name: "MemoiQ",
        description: "Personal AI memory and journaling assistant with long-term context understanding.",
        href: "https://memoiq.us/",
        hasDemo: true,
    },
    {
        id: 'venture-6',
        name: "ModeliQ",
        description: "AI model training and deployment automation for custom LLM fine-tuning and inference.",
        href: "https://modeliq.us",
        hasDemo: true,
    },
    {
        id: 'venture-7',
        name: "WoundiQ",
        description: "AI wound care management system with image analysis, SOAP generation, and role-based nurse/admin dashboards.",
        href: "https://woundiq.us",
        hasDemo: true,
    },
    {
        id: 'venture-8',
        name: "iSydney",
        description: "Conversational AI voice companion for therapeutic and lifestyle engagement.",
        href: "https://iSydney.us",
        hasDemo: true,
    },
    {
        id: 'venture-9',
        name: "iHailey",
        description: "AI-driven emotional support and mental wellness companion with natural voice interaction.",
        href: "https://iHailey.us",
        hasDemo: true,
    },
    {
        id: 'venture-10',
        name: "iSkylar",
        description: "AI Voice Therapist combining generative empathy models and therapeutic dialogue systems.",
        href: "https://iSkylar.us",
        hasDemo: true,
    },
    {
        id: 'venture-11',
        name: "Nesto Banks",
        description: "Fintech and digital banking platform enhanced with AI-based fraud detection and risk analytics.",
        href: "https://NestoBanks.com",
        hasDemo: true,
    },
    {
      id: 'partner-0',
      name: "Condé Nast",
      description: "Condé Nast is a premier global media company known for producing world-renowned magazines, digital platforms, and branded experiences. The company oversees iconic publications such as Vogue, GQ, Vanity Fair, Wired, Condé Nast Traveler, and The New Yorker. With a large international presence, Condé Nast blends journalism, fashion, culture, technology, and multimedia storytelling. It serves millions of readers worldwide through print, digital, video, and social channels while shaping trends in fashion, luxury, lifestyle, and entertainment.",
      href: "https://www.condenast.com",
      hasDemo: false,
    },
    {
      id: 'partner-1',
      name: "Advance",
      description: "Advance is a diversified global media and technology company and parent organization of Condé Nast. Founded in 1922, it holds investments in media, data analytics, technology, and entertainment companies. Its portfolio includes stakes in Reddit, Discovery, and American City Business Journals. Advance also owns newspapers, digital publications, and various media groups. The company is known for long-term strategic investment and innovation across content, data, and global media industries.",
      href: "https://www.advance.com",
      hasDemo: false,
    },
    {
      id: 'partner-2',
      name: "SIMON",
      description: "Simon Property Group is one of the world’s largest real estate companies and the leading owner and operator of shopping malls in the United States. The company manages premier retail, dining, entertainment, and mixed-use destinations, including iconic malls, lifestyle centers, and outlets. Simon’s properties attract millions of visitors annually, serving as major commercial hubs for retailers, restaurants, and experiential brands. The company is publicly traded and recognized for large-scale real estate development and high-end retail environments.",
      href: "https://www.simon.com",
      hasDemo: false,
    },
    {
      id: 'partner-3',
      name: "Braiva Capital",
      description: "Braiva Capital is a private investment firm focused on strategic financial growth, venture funding, and partnership development. The company invests in emerging technologies, consumer markets, and high-potential business ventures. Braiva Capital is known for its data-driven strategy, portfolio-building approach, and long-term value creation. Through capital deployment and advisory support, the firm helps early-stage and growth-stage companies scale effectively.",
      href: "#",
      hasDemo: false,
    },
    {
      id: 'partner-4',
      name: "Couristan",
      description: "Founded in 1926, Couristan is a leading global manufacturer and importer of high-end area rugs, residential carpeting, and custom floor coverings. The company supplies luxury products to retailers, interior designers, and hospitality clients. Known for craftsmanship, premium materials, and innovative designs, Couristan has built a strong reputation in the textile and flooring industries. It serves commercial and residential markets across the United States and internationally.",
      href: "https://www.couristan.com",
      hasDemo: false,
    },
    {
      id: 'partner-5',
      name: "tBrexa Bio Inc.",
      description: "tBrexa Bio Inc. is a biotechnology company focused on innovative solutions in life sciences, pharmaceuticals, and medical technology. The company specializes in research, development, and commercialization of advanced therapeutic initiatives. Its mission centers on improving global health outcomes through scientific innovation, data-driven drug development, and biotech advancement. tBrexa Bio collaborates with scientific institutions and healthcare partners to accelerate results in biotechnology and medical research.",
      href: "#",
      hasDemo: false,
    },
    {
        id: 'partner-6',
        name: "Nama Harlem",
        description: "(New Amsterdam Musical Association)\\nFounded in 1904, the New Amsterdam Musical Association (NAMA) is the oldest African-American musical organization in the United States. Created during a time when African-American musicians were excluded from the American Federation of Musicians Local 310, NAMA became the first Black music union. The association provided performance opportunities, training, and community support for Black musicians throughout New York City. Located in Harlem, NAMA remains a historic cultural institution dedicated to preserving jazz, blues, and African-American musical heritage.",
        href: "https://www.namaharlem.org",
        hasDemo: false,
    },
    {
      id: 'partner-7',
      name: "WNDR",
      description: "WNDR is a modern cloud-gaming and user-generated content platform founded by Borris Bazelais. The company aims to become a major hub for interactive entertainment, often described as the next major evolution of social gaming. Prior to founding WNDR, Bazelais worked in film, television, and music, bringing creative and technical expertise into the gaming industry. His earlier browser-based flash game achieved over 23 million plays, demonstrating his ability to scale user engagement. WNDR focuses on cloud gaming, creator tools, and next-generation gaming experiences.",
      href: "#",
      hasDemo: false,
    },
    {
      id: 'partner-8',
      name: "Alpharma Pharmaceuticals",
      description: "Alpharma Pharmaceuticals was a global specialty pharmaceutical company known for developing and producing pharmaceutical products across human and animal health sectors. It operated in areas such as antimicrobial drugs, pain management, active pharmaceutical ingredients, and generic medications. Alpharma developed widely used therapies and was recognized for advancing pharmaceutical manufacturing standards. The company was later acquired, integrating its portfolio into a larger global pharmaceutical network.",
      href: "#",

      hasDemo: false,
    },
    {
      id: 'partner-9',
      name: "Novartis Pharmaceuticals",
      description: "Novartis is one of the world’s largest and most respected pharmaceutical companies, known for developing innovative medicines across oncology, cardiovascular health, immunology, neuroscience, and gene therapy. Headquartered in Switzerland, Novartis focuses heavily on research and development, precision medicine, and humanitarian access to treatments worldwide. With a global footprint, a company aims to transform patient outcomes through advanced scientific discovery and medical innovation.",
      href: "https://www.novartis.com",
      hasDemo: false,
    },
    {
      id: 'partner-10',
      name: "Manhattan College",
      description: "Manhattan College is a private Catholic liberal arts college located in Riverdale, New York. Founded in 1853, the school is known for strong academic programs in engineering, business, education, the sciences, and the humanities. The institution emphasizes values-based learning, community engagement, and leadership development. Manhattan College has a long history of producing graduates who contribute significantly to engineering, public service, research, and the arts.",
      href: "https://manhattan.edu",
      hasDemo: false,
    },
    {
      id: 'partner-11',
      name: "Cayenne Pepper Productions",
      description: "Cayenne Pepper Productions is a creative media and production company specializing in film, television, advertising, and branded content. Known for storytelling, visual design, and multimedia production, the company collaborates with brands, networks, and creators to develop engaging media projects. Its work spans digital video, commercial campaigns, music-related content, and film-focused creative development.",
      href: "#",
      hasDemo: false,
    }
];

export const ventureIcons: VentureIcon[] = [
    { name: "WorkSpaceIQ", icon: Sparkles },
    { name: "Chancellor", icon: LayoutDashboard },
    { name: "iChanceTEK", icon: Sparkles },
    { name: "iCareOS Premium", icon: Sparkles },
    { name: "Evolvable", icon: Sparkles },
    { name: "iCareOS", icon: Stethoscope },
    { name: "StrideIQ", icon: Activity },
    { name: "Famio", icon: Users },
    { name: "Enterprise AI Agents", icon: Briefcase },
    { name: "MediScribe", icon: FileText },
    { name: "MemoiQ", icon: Lightbulb },
    { name: "ModeliQ", icon: BrainCircuit },
    { name: "WoundiQ", icon: Microscope },
    { name: "iSydney", icon: MessagesSquare },
    { name: "iHailey", icon: HandHeart },
    { name: "iSkylar", icon: Drama },
    { name: "Nesto Banks", icon: Users },
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
      { name: "Apache Kafka", icon: Layers },
      { name: "RabbitMQ", icon: MessageCircle },
      { name: "IBM AS/400 (IBM i)", icon: Server },
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
    title: "AI Engineering",
    skills: [
      { name: "AI Engineering", icon: Bot },
      { name: "Context Engineering", icon: Book },
      { name: "Prompt Engineering", icon: Lightbulb },
      { name: "Agentic Workflows", icon: Bot },
      { name: "AI Agents", icon: Bot },
      { name: "Vector Databases", icon: Database },
      { name: "NLP, LLM, Computer Vision", icon: Microscope },
      { name: "RAG", icon: MessagesSquare },
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
      { name: "Pinecone", icon: Database },
      { name: "Chroma", icon: Database },
      { name: "AWS S3 Vector", icon: Database },
    ],
  },
   {
    title: "Data Engineering",
    skills: [
      { name: "ETL / ELT", icon: Filter },
      { name: "Data Pipelines", icon: Workflow },
      { name: "Dataframe", icon: Database },
      { name: "Microsoft Fabric", icon: Building },
      { name: "AWS Glue / Kinesis", icon: Workflow },
      { name: "AWS Redshift", icon: Database },
      { name: "Azure DataBricks", icon: Sparkles },
      { name: "Apache Spark", icon: Sparkles },
      { name: "Google PySpark", icon: Sparkles },
      { name: "Apache Airflow", icon: Workflow },
      { name: "Tableau", icon: BarChart },
      { name: "Power BI", icon: BarChart },
      { name: "SQL", icon: Database },
      { name: "Python (NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn)", icon: Code },
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
        { name: "Jupyter Notebook", icon: Notebook },
        { name: "Google Colab", icon: Notebook },
        { name: "Anaconda", icon: Package },
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
        { name: "System Design", icon: Network },
        { name: "Docker", icon: Box },
        { name: "Docker Hub", icon: Box },
        { name: "Docker Desktop", icon: Monitor },
        { name: "Kubernetes (EKS, AKS, GKE)", icon: ServerCog },
        { name: "Helm", icon: Package },
        { name: "Serverless (Lambda, Functions, Cloud Run)", icon: CloudCog },
        { name: "Terraform", icon: Code },
        { name: "Pulumi", icon: Code },
        { name: "Istio", icon: Puzzle },
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
      { name: "GitHub Copilot", icon: Github },
      { name: "Code Rabbit", icon: Rabbit },
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
    title: "Microsoft 365",
    skills: [
      { name: "Microsoft 365", icon: Globe },
      { name: "Teams / SharePoint / Exchange", icon: Share2 },
      { name: "AutoPilot / InTune", icon: Building },
      { name: "Power Automate", icon: Workflow },
    ]
  }
];

export const meditationSounds = [
  { name: 'Gentle Rain', value: 'rain', url: 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_b2538051b8.mp3' },
  { name: 'Ocean Waves', value: 'ocean', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_2d81a9f147.mp3' },
  { name: 'Flowing Water', value: 'water', url: 'https://cdn.pixabay.com/download/audio/2022/05/23/audio_75f410757d.mp3' },
  { name: 'Ambient Tones', value: 'ambient', url: 'https://cdn.pixabay.com/download/audio/2022/08/04/audio_354c46c24c.mp3' },
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

export const resumeData: ResumeData = {
  name: 'CHANCELLOR MINUS',
  contact: {
    email: 'cm@chancellorminus.com',
    phone: '646 867 3318',
    location: 'New York, NY 10013',
    github: 'https://github.com/iChancetek',
    portfolio: 'https://chancellorminus.com',
  },
  summary: 'AI Engineer and Cloud Architect specializing in production-grade AI-native systems across healthcare, enterprise, productivity, and digital platforms.\n\nI design and build end-to-end AI systems combining:\nAgentic AI workflows (LangChain, LangGraph, OpenAI Agents SDK, CrewAI)\nRAG (Retrieval-Augmented Generation) systems\nNLP, Computer Vision, and multimodal AI systems\nVoice AI pipelines (OpenAI Whisper, STT, TTS)\nMLOps and data engineering pipelines\nDevOps and cloud infrastructure automation\n\nExperienced across full lifecycle engineering: architecture, development, deployment, monitoring, and scaling of cloud-native AI systems across Google Cloud, AWS, Azure, and Microsoft 365 ecosystems.',
  coreCompetencies: [
    'AI Systems', 'Agentic AI', 'RAG Architectures', 'LLM Engineering',
    'NLP', 'Computer Vision', 'Multimodal AI', 'Voice AI (Whisper, TTS, STT)',
    'Vector Databases', 'Cloud Architecture', 'DevOps', 'Data Engineering', 'Full-Stack Development'
  ],
  technicalExpertise: [
    { title: 'AI Systems', skills: 'Agentic AI (LangChain, LangGraph, OpenAI Agents SDK, CrewAI)\nRAG architectures, LLM engineering\nNLP, Computer Vision, Multimodal AI\nOpenAI Whisper, TTS, STT pipelines\nVector databases & embeddings' },
    { title: 'Cloud', skills: 'Google Cloud (Cloud Run, Cloud Build, Cloud SQL)\nAWS, Azure multi-cloud architecture\nFirebase (Auth, Firestore, Storage, Hosting)\nGoogle AI Studio, Google AntiGravity' },
    { title: 'LLMs', skills: 'GPT, Claude, Gemini, Llama, DeepSeek' },
    { title: 'Full-Stack AI Development', skills: 'Python (FastAPI, Flask, Django)\nReact, Next.js, TypeScript\nAI API integration & backend orchestration' },
    { title: 'Data Science & ML Libraries', skills: 'NumPy, Pandas\nScikit-learn\nMatplotlib, Seaborn\nTensorFlow, PyTorch' },
    { title: 'AI Development Tools', skills: 'Cursor AI\nGoogle AI Studio\nGoogle AntiGravity\nReplit AI workflows' },
    { title: 'Data & MLOps', skills: 'ETL/ELT pipelines, Data Lakehouse\nDatabricks, PySpark, Airflow\nSageMaker, Azure ML, Vertex AI, MLflow' },
    { title: 'DevOps', skills: 'Kubernetes, Docker\nTerraform, Pulumi\nCI/CD (GitHub Actions, Azure DevOps)' }
  ],
  experience: [
    {
      title: 'AI Engineer | Cloud Architect | Data Engineer',
      company: 'iSynera',
      date: 'Apr 2022 - Present',
      location: 'Houston, TX (Remote Consultant)',
      description: 'Lead design and delivery of production AI systems and cloud-native platforms across enterprise environments.',
      highlights: [
        'AI Systems Engineering: Built agentic AI systems using LangChain, LangGraph, OpenAI Agents SDK, CrewAI. Designed RAG-based knowledge systems using embeddings and vector databases (Pinecone, Chroma, S3 Vector). Developed production LLM systems (GPT, Claude, Gemini, Llama, DeepSeek). Built voice AI systems using OpenAI Whisper, TTS, STT pipelines. Implemented NLP and Computer Vision systems for automation and intelligence extraction. Built AI applications using Google AI Studio, Google AntiGravity, Cursor AI. Delivered production AI systems using OpenAI, Azure AI Foundry, AWS Bedrock.',
        'Full-Stack AI Application Development: Built full-stack AI applications using Python (FastAPI, Flask, Django) for backend AI services. Developed frontend systems using React, Next.js, TypeScript. Built scalable AI APIs for inference, orchestration, and automation workflows. Integrated AI models into production cloud systems and real-time applications.',
        'Data Engineering, ML & Analytics Stack: Applied Python for data science and machine learning development. Built ML pipelines using NumPy, Pandas, Scikit-learn, Matplotlib, Seaborn. Developed deep learning systems using TensorFlow, PyTorch. Designed data processing and feature engineering workflows for AI systems. Integrated ML models into production environments via APIs and cloud services.',
        'Cloud Architecture & Data Systems: Architected multi-cloud systems across Google Cloud, AWS, Azure. Built serverless systems using Cloud Run, Firebase, Cloud SQL. Designed ETL/ELT pipelines using Databricks, PySpark, AWS Glue, Delta Lake. Built streaming systems using Kafka and AWS Kinesis. Implemented MLOps pipelines using SageMaker, Azure ML, Vertex AI, MLflow.',
        'DevOps & Platform Engineering: Built CI/CD pipelines (GitHub Actions, Azure DevOps) for Kubernetes microservices. Automated infrastructure using Terraform and Pulumi. Containerized deployments using Docker and Kubernetes. Implemented secure systems with secrets management and observability tooling.',
        'Enterprise Systems: Managed Microsoft 365 environments (Teams, SharePoint, Exchange, Intune). Automated workflows using Power Automate. Integrated Microsoft 365 with cloud and AI systems.'
      ]
    },
    {
      title: 'DevOps | DevSecOps Engineer',
      company: 'Pubbly / WNDR',
      date: 'Jun 2018 - Apr 2022',
      location: 'New York, NY',
      description: '',
      highlights: [
        'CI/CD pipelines (Jenkins, GitHub Actions, Azure DevOps, GitLab)',
        'Kubernetes (AKS, EKS, GKE)',
        'Infrastructure as Code (Terraform, Ansible)',
        'GitOps (ArgoCD, Helm)',
        'Security (Vault, Key Vault, Secrets Manager, Trivy)',
        'Observability (Prometheus, Grafana, Istio)',
        'Data pipelines (Databricks, Data Factory, Synapse)'
      ]
    },
    {
      title: 'Microsoft 365 Engineer | Azure Architect',
      company: 'Condé Nast | Advance Local',
      date: 'May 2017 - Jun 2018',
      location: 'New York, NY (Consultant)',
      description: '',
      highlights: []
    },
    {
      title: 'Sr. Systems Engineer Manager',
      company: 'Bravia Capital Partners',
      date: 'Feb 2016 - May 2017',
      location: 'New York, NY',
      description: '',
      highlights: []
    },
    {
      title: 'IT Manager',
      company: 'NAMA Organization',
      date: 'Jul 2013 - Feb 2016',
      location: 'New York, NY',
      description: '',
      highlights: []
    },
    {
      title: 'IT Manager',
      company: 'Couristan, Inc.',
      date: 'Jan 2002 - Jun 2013',
      location: 'Fort Lee, NJ',
      description: '',
      highlights: []
    },
    {
      title: 'Network Manager/Windows Manager (Consultant)',
      company: 'Alpharma',
      date: '2001 - 2002',
      location: '',
      description: '',
      highlights: [],
      cvOnly: true
    },
    {
      title: 'Network Manager/Windows Manager (Consultant)',
      company: 'Novartis',
      date: '2000 - 2001',
      location: '',
      description: '',
      highlights: [],
      cvOnly: true
    },
    {
      title: 'Divisional IT Manager',
      company: 'Simon Property Group',
      date: '1997 - 2000',
      location: '',
      description: '',
      highlights: [],
      cvOnly: true
    }
  ],
  education: [
    { course: 'Computer Science', institution: 'Pace University, New York, NY' },
    { course: 'AWS Certified Solutions Architect Courses', institution: 'AWS Loft, New York, NY' },
    { course: 'Azure Courses', institution: 'A Cloud Guru: AZ-900, AZ-104, AZ-500, AZ-300, AZ-301 | Udemy: AZ-303/304, AZ-204' },
    { course: 'DevOps & Infrastructure', institution: 'Udemy: Azure DevOps, Terraform, Pulumi, Ansible, GCP' },
    { course: 'Data & Machine Learning', institution: 'Udemy: Azure Databricks, Data Factory, Synapse Analytics, Python for ML & Data Science' },
    { course: 'AI Engineering & MLOps', institution: 'Udemy: AI Engineer MLOps Track: Deploy Gen AI & Agentic AI at Scale | AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents | Azure Machine Learning & MLOps: Beginner to Advance' },
    { course: 'AI Agents & Automation', institution: 'Udemy: Complete Agentic AI Bootcamp With LangGraph and Langchain | AI-Agents: Automation & Business with LangChain & LLM Apps | Database AI Agents: Complete Guide' },
    { course: 'AI Development Tools', institution: 'Udemy: Cursor AI Beginner to Pro: Build Production Web Apps with AI' },
    { course: 'Computer Vision', institution: 'Udemy: Complete Computer Vision Bootcamp With PyTorch & Tensorflow' },
    { course: 'Data Engineering & AI', institution: 'Udemy: Introduction to Data Engineering using Generative AI | Generative AI for Data Engineering and Data Professionals' },
    { course: 'Statistics & Analytics', institution: 'Udemy: Probability and Statistics: Complete Course 2025 | Statistics for Data Science and Business Analysis' },
    { course: 'Blockchain Development', institution: 'LinkedIn Learning: Ethereum (Solidity, Web3) | Udemy: Internet Computer (Motoko)' },
    { course: 'Microsoft & Network', institution: 'Computer Education Services (MCSE) | GEO Training Corporation (CCNA)' }
  ],
  portfolioLink: 'https://chancellorminus.com'
};
    

    























    


    













    


    







