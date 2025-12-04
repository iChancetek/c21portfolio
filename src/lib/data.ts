
import type { Project, SkillCategory, Venture, VentureIcon, PartnerCompany, ResumeData } from "@/lib/types";
import { Code, PanelTop, Server, BrainCircuit, ServerCog, Database, Wind, Bot, Search, GitBranch, ExternalLink, Send, Github, Linkedin, Twitter, HeartPulse, Microscope, FileText, MessagesSquare, Lightbulb, Users, HandHeart, Briefcase, ShoppingCart, Drama, CloudCog, Workflow, MicVocal, CreditCard, Mail, TestTubeDiagonal, Cloud, Puzzle, Filter, Monitor, Sparkles, SlidersHorizontal, Share2, Globe, Building, BarChart, Route, Network, ServerCrash, MessageCircle, FunctionSquare, Binary, GitCommit, ListTree, Sigma, Box, Shield, ShieldCheck, Factory, Layers, Book, CheckCircle, Package, Upload, Instagram, Rabbit, Notebook } from "lucide-react";
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
        id: 'venture-1',
        name: "Enterprise AI Agents",
        description: "Enterprise AI that works like your best employee for better customer experiences.",
        href: "/ai-agent",
        hasDemo: true,
    },
    {
        id: 'venture-2',
        name: "ChanceTEK Health",
        description: "Healthcare automation platform focusing on smart referrals, patient intake, and digital consent capture.",
        href: "https://chancetekhealth.us/",
        hasDemo: true,
    },
    {
        id: 'venture-3',
        name: "iQMarketing",
        description: "AI-driven marketing analytics and personalized campaign management suite.",
        href: "https://iqmarketing.us/",
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
        id: 'venture-12',
        name: "The Potluxe",
        description: "AI-powered luxury product marketplace and social commerce platform.",
        href: "https://ThePotluxe.com",
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
        description: "(New Amsterdam Musical Association)\nFounded in 1904, the New Amsterdam Musical Association (NAMA) is the oldest African-American musical organization in the United States. Created during a time when African-American musicians were excluded from the American Federation of Musicians Local 310, NAMA became the first Black music union. The association provided performance opportunities, training, and community support for Black musicians throughout New York City. Located in Harlem, NAMA remains a historic cultural institution dedicated to preserving jazz, blues, and African-American musical heritage.",
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
      description: "Novartis is one of the world’s largest and most respected pharmaceutical companies, known for developing innovative medicines across oncology, cardiovascular health, immunology, neuroscience, and gene therapy. Headquartered in Switzerland, Novartis focuses heavily on research and development, precision medicine, and humanitarian access to treatments worldwide. With a global footprint, the company aims to transform patient outcomes through advanced scientific discovery and medical innovation.",
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
    { name: "Enterprise AI Agents", icon: Briefcase },
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
      { name: "Context Engineering", icon: Book },
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
      { name: "Python (NumPy, Pandas)", icon: Code },
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
    title: "Microsoft Enterprise",
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
    phone: '917-295-2351',
    location: 'New York, NY 10013',
    github: 'https://github.com/iChancetek',
    portfolio: 'https://chancellorminus.com',
  },
  summary: 'Innovative Business Technology Engineer with strong expertise across DevOps, Data Engineering, MLOps, AI/ML Engineering, and Full-Stack AI Web Development. Skilled in building automated systems, intelligent data pipelines, and scalable cloud infrastructure using cutting-edge AI development platforms. Experienced in delivering enterprise-grade AI solutions, modernizing software workflows, engineering AI agents, and deploying full-stack applications across multi-cloud environments.',
  coreCompetencies: [
    'DevOps', 'MLOps', 'Data Engineering', 'AI Engineering', 'AI Agents',
    'Full-Stack Development', 'Cloud Architecture', 'CI/CD', 'Infrastructure as Code',
    'Vector Databases', 'RAG Systems', 'Fine-tuning', 'System Design'
  ],
  technicalExpertise: [
    { title: '🚀 DevOps Engineering', skills: 'CI/CD pipelines (Jenkins, GitHub Actions, GitLab, Azure DevOps), Infrastructure as Code (Terraform, Ansible, Pulumi), Kubernetes (EKS, AKS, GKE), Docker, Prometheus, Grafana, ELK' },
    { title: '📊 Data Engineering', skills: 'ETL/ELT pipelines, Databricks, PySpark, Airflow, Delta Lakehouse, Kafka, Kinesis, Data Lakes & Warehouses, Tableau, Power BI, Microsoft Fabric, Python (NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn), SQL' },
    { title: '🤖 MLOps Engineering', skills: 'Amazon SageMaker, Azure Machine Learning, Google Vertex AI, MLflow, and Apache Airflow for model training, versioning, and automated deployment on cloud GPUs' },
    { title: '🧠 AI Engineering', skills: 'NLP, LLM, Computer Vision, RAG Systems, Vector DBs, GPT, Claude, Gemini, Llama, DeepSeek, Qwen, Fairness & Bias Mitigation' },
    { title: '💻 Full-Stack Development', skills: 'React, Next.js, TypeScript, Tailwind, ShadCN UI, Python (Flask, FastAPI, Django), Node.js, REST APIs, Stripe, Clerk' },
    { title: '☁️ Cloud Platforms', skills: 'Multi-cloud Architecture | AWS: Networking: VPC (Virtual Private Cloud): Isolated network environments. Subnets: Segmentation of VPCs for public/private resources. Route Tables & Internet Gateways: Control traffic flow. Security Groups & NACLs: Instance-level and subnet-level traffic control. Direct Connect / VPN: Private and secure connectivity options. Compute: EC2 (Elastic Compute Cloud): Scalable virtual servers in the cloud. Governance: IAM (Identity and Access Management): Users, roles, policies. Organizations & SCPs (Service Control Policies): Centralized account governance. AWS Config & CloudTrail: Monitoring, auditing, and compliance. AWS Control Tower: Automated account setup and governance. | Azure: Networking: Virtual Network (VNet): Isolated network space. Subnets & Network Security Groups (NSGs): Segmentation and traffic control. Azure Firewall & Application Gateway: Network security and traffic routing. ExpressRoute & VPN Gateway: Private connectivity. Compute: Virtual Machines (VMs): On-demand scalable virtual servers. Governance: Azure Active Directory (AAD): Identity and access management. Management Groups & Role-Based Access Control (RBAC): Hierarchical access control. Azure Policy & Blueprints: Compliance enforcement and environment standardization. Azure Monitor & Activity Logs: Monitoring and auditing resources. | GCP (Google Cloud Platform): Networking: VPC (Virtual Private Cloud): Global, scalable networks. Subnets & Firewalls: Traffic segmentation and rules. Cloud Load Balancing & Cloud NAT: Traffic management and NAT services. VPN & Interconnect: Secure connectivity options. Compute: Compute Engine: Scalable virtual machines (VMs) on demand. Governance: Cloud IAM: Users, roles, permissions management. Organization & Folders: Hierarchical resource organization. Org Policies & Resource Manager: Enforce governance rules and compliance. Cloud Audit Logs & Security Command Center: Monitoring, auditing, and threat detection.' },
    { title: '🗄️ Databases', skills: 'MySQL, Neon PostgreSQL, MongoDB, Cosmos DB, Redis, Pinecone, Chroma, S3 Vector' },
    { title: '🛠️ AI Dev Tools', skills: 'Cursor AI, Vibe Coding, Replit, Lovable, Firebase Studio AI, LangChain, LangGraph, CrewAI, Flowise AI, N8N, Manus' },
    { title: '🏢 Microsoft Enterprise', skills: 'Microsoft 365, Teams, SharePoint, Exchange Online, AutoPilot, InTune' }
  ],
  experience: [
    {
      title: 'AI Engineer | Data Engineer | DevOps Engineer',
      company: 'iSynera',
      date: 'April 2022 - Present',
      location: 'Houston, TX (Remote Consultant)',
      description: 'Leading AI/ML engineering initiatives and cloud infrastructure modernization. Building enterprise-grade AI solutions including intelligent chatbots, RAG systems, and AI agents while maintaining scalable data pipelines and DevOps workflows across multi-cloud environments.',
      highlights: [
        'Proficient in implementing governance frameworks, designing networking architectures, and managing cloud databases on AWS, Azure, and GCP.',
        'Engineered AI-powered applications using LLMs (GPT, Claude, Gemini, Llama) with RAG architectures and vector databases (Pinecone, Chroma, S3 Vector)',
        'Developed production applications with Azure AI Foundry and AWS Bedrock APIs, integrating Azure OpenAI and OpenAI SDK for intelligent features',
        'Built full-stack AI web applications using React, Next.js, TypeScript, ShadCN UI with Clerk authentication and Stripe payment processing',
        'Leveraged modern AI development platforms including Cursor AI, Vibe Coding, Replit, Firebase Studio AI, and Manus for rapid application development',
        'Implemented MCP (Model Context Protocol) integrations for enhanced AI agent communication and orchestration',
        'Designed and deployed MLOps pipelines using Amazon SageMaker, Azure Machine Learning, Google Vertex AI, MLflow, and Apache Airflow for model training, versioning, and automated deployment on cloud GPUs',
        'Architected scalable ETL/ELT data pipelines using Databricks, PySpark, Airflow, AWS Glue, and Delta Lakehouse systems',
        'Automated infrastructure provisioning with Terraform and Pulumi across AWS, Azure, and GCP environments',
        'Orchestrated enterprise-level Microsoft 365 environments, managing Teams, SharePoint, and Exchange Online while automating business processes with Power Automate and streamlining device management with AutoPilot and InTune.',
        'Skilled in Microsoft Fabric for designing and managing scalable data infrastructures to collect, process, and analyze large datasets.',
        'Implemented CI/CD pipelines using GitHub Actions and Azure DevOps for containerized microservices on Kubernetes',
        'Developed backend APIs with Python (FastAPI, Flask, Django) and Node.js for AI model integration',
        'Tested and debugged APIs using Postman and Insomnia for comprehensive validation and documentation',
        'Integrated streaming data solutions with Kafka and Kinesis for real-time analytics dashboards',
        'Experienced in using Python libraries such as NumPy, Pandas, Matplotlib, Seaborn, and Scikit-learn for data manipulation, analysis, visualization, and machine learning'
      ]
    },
    {
      title: 'DevOps | DevSecOps Engineer',
      company: 'Pubbly/WNDR',
      date: 'June 2018 - April 2022',
      location: 'New York, NY',
      description: 'Highly motivated and results-oriented DevOps Engineer with expert knowledge of cloud concepts and AWS services. Proven ability to design, implement, and manage secure and scalable cloud infrastructure across AWS, Azure, and GCP.',
      highlights: [
          'Designed and implemented secure CI/CD pipelines using Jenkins, Azure DevOps, GitLab, and GitHub Actions for microservices deployments across Kubernetes clusters (AKS, EKS, GKE)',
          'Automated infrastructure provisioning using Terraform and Ansible for multi-tier environments across AWS, Azure, and GCP',
          'Implemented Helm charts and Argo CD for GitOps-based deployments, ensuring configuration consistency across all environments',
          'Integrated security scanning with Trivy and secret management using Azure Key Vault, AWS Secrets Manager, and HashiCorp Vault',
          'Developed automated testing pipelines with Pytest and Selenium for comprehensive application validation',
          'Implemented service meshes (Istio) and monitoring solutions (Prometheus, Grafana) for enhanced observability',
          'Architected data integration pipelines using Azure Data Factory, Databricks, and Synapse Analytics for big data processing',
          'Managed container registries (ACR, ECR, GCR) with strict access controls and versioning policies'
      ]
    },
    {
      title: 'Microsoft 365 Engineer | Azure Administrator | Cloud Solutions Architect',
      company: 'Condé Nast | Advance Local',
      date: 'May 2017 - June 2018',
      location: 'New York, NY (Consultant)',
      description: 'Developed and managed Azure, Microsoft 365 cloud, AWS, and On-Premises environments. Performed DevOps tasks including plugin management, automation server configuration, CI/CD pipeline development, and continuous monitoring.',
      highlights: []
    },
     {
      title: 'Sr. Systems Engineer Manager',
      company: 'Bravia Capital Partners | Cayenne Pepper Productions',
      date: 'February 2016 - May 2017',
      location: 'New York, NY',
      description: 'Managed Bravia\'s Virtual Private Network and Hybrid Cloud infrastructure supporting 250 users across New York, Hong Kong, and Japan. Led migration of On-Premises Exchange, SQL, and SharePoint servers to Microsoft 365 and Azure.',
      highlights: []
    },
     {
      title: 'IT Manager',
      company: 'NAMA Organization (Non-Profit)',
      date: 'July 2013 - February 2016',
      location: 'New York, NY',
      description: 'Responsible for developing and supporting on-premise and cloud infrastructure for 125 users across three remote sites. Managed Windows Server, Exchange, SQL Server, SharePoint, Office 365, and network infrastructure.',
      highlights: []
    },
     {
      title: 'IT Manager',
      company: 'Couristan, Inc.',
      date: 'January 2002 - June 2013',
      location: 'Fort Lee, NJ',
      description: 'Built and supported corporate VPN, WLAN, AS400, ERP systems, and VOIP network for 500 users across twelve remote offices. Managed all aspects of IT infrastructure reporting to CEO and CFO.',
      highlights: []
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
    

    























    