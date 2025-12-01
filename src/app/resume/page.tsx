
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Code, Cloud, Database, Mail, MapPin, Phone, Github, Link as LinkIcon, GraduationCap, Star, BrainCircuit, Zap, ShieldCheck, Workflow, Server } from 'lucide-react';
import Link from 'next/link';

const resumeData = {
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
    { title: '📊 Data Engineering', skills: 'ETL/ELT pipelines, Databricks, PySpark, Airflow, Delta Lakehouse, Kafka, Kinesis, Data Lakes & Warehouses, Tableau, Power BI' },
    { title: '🤖 MLOps Engineering', skills: 'MLflow, Model deployment & monitoring, Docker & Kubernetes ML infra, Drift detection, Automated retraining, Cloud GPUs' },
    { title: '🧠 AI Engineering', skills: 'NLP, LLM, Computer Vision, RAG Systems, Vector DBs, GPT, Claude, Gemini, Llama, DeepSeek, Qwen, Fairness & Bias Mitigation' },
    { title: '💻 Full-Stack Development', skills: 'React, Next.js, TypeScript, Tailwind, ShadCN UI, Python (Flask, FastAPI, Django), Node.js, REST APIs, Stripe, Clerk' },
    { title: '☁️ Cloud Platforms', skills: 'AWS (EC2, S3, Lambda, EKS, SageMaker, CloudFront, ELB/ALB), Azure (AKS, ML, Databricks, CDN, Load Balancer), GCP (GKE, Vertex AI, Cloud CDN, Cloud Load Balancing), Multi-cloud Architecture' },
    { title: '🗄️ Databases', skills: 'MySQL, Neon PostgreSQL, MongoDB, Cosmos DB, Redis, Pinecone, Chroma, S3 Vector' },
    { title: '🛠️ AI Dev Tools', skills: 'Cursor AI, Vibe Coding, Replit, Lovable, Firebase Studio AI, LangChain, LangGraph, CrewAI, Flowise AI, N8N, Manus' }
  ],
  experience: [
    {
      title: 'AI Engineer | Data Engineer | DevOps Engineer',
      company: 'iSynera',
      date: 'April 2022 - Present',
      location: 'Houston, TX (Remote Consultant)',
      description: 'Leading AI/ML engineering initiatives and cloud infrastructure modernization. Building enterprise-grade AI solutions including intelligent chatbots, RAG systems, and AI agents while maintaining scalable data pipelines and DevOps workflows across multi-cloud environments.',
      highlights: [
        'Engineered AI-powered applications using LLMs (GPT, Claude, Gemini, Llama) with RAG architectures and vector databases (Pinecone, Chroma, S3 Vector)',
        'Developed production applications with Azure AI Foundry and AWS Bedrock APIs, integrating Azure OpenAI and OpenAI SDK for intelligent features',
        'Built full-stack AI web applications using React, Next.js, TypeScript, ShadCN UI with Clerk authentication and Stripe payment processing',
        'Leveraged modern AI development platforms including Cursor AI, Vibe Coding, Replit, Firebase Studio AI, and Manus for rapid application development',
        'Implemented MCP (Model Context Protocol) integrations for enhanced AI agent communication and orchestration',
        'Designed and deployed MLOps pipelines with MLflow for model training, versioning, and automated deployment on cloud GPUs',
        'Architected scalable ETL/ELT data pipelines using Databricks, PySpark, Airflow, AWS Glue, and Delta Lakehouse systems',
        'Automated infrastructure provisioning with Terraform and Pulumi across AWS, Azure, and GCP environments',
        'Implemented CI/CD pipelines using GitHub Actions and Azure DevOps for containerized microservices on Kubernetes',
        'Developed backend APIs with Python (FastAPI, Flask, Django) and Node.js for AI model integration',
        'Tested and debugged APIs using Postman and Insomnia for comprehensive validation and documentation',
        'Integrated streaming data solutions with Kafka and Kinesis for real-time analytics dashboards'
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

const Section = ({ title, children, icon: Icon }: { title: string; children: React.ReactNode, icon?: React.ElementType }) => (
  <section className="mb-12">
    <h2 className="text-2xl font-bold tracking-tight text-primary-gradient mb-6 flex items-center gap-3">
        {Icon && <Icon className="w-6 h-6" />}
        {title}
    </h2>
    <div className="space-y-6">{children}</div>
  </section>
);

export default function ResumePage() {
  return (
    <div className="py-12 md:py-24">
      <div className="max-w-4xl mx-auto bg-card/50 rounded-2xl shadow-2xl shadow-primary/10 border border-border/20 backdrop-blur-sm overflow-hidden">
        
        <header className="p-10 text-center bg-primary-gradient/10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/80">{resumeData.name}</h1>
          <div className="mt-4 flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
            <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {resumeData.contact.email}</span>
            <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {resumeData.contact.phone}</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {resumeData.contact.location}</span>
          </div>
           <div className="mt-4 flex justify-center items-center gap-4">
              <Link href={resumeData.contact.github} target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-4 h-4" /> GitHub
              </Link>
              <Link href={resumeData.contact.portfolio} target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <LinkIcon className="w-4 h-4" /> Portfolio
              </Link>
            </div>
        </header>

        <main className="p-8 md:p-12">
          
          <Section title="Professional Summary" icon={Briefcase}>
            <p className="text-foreground/80 leading-relaxed bg-secondary/30 p-6 rounded-lg border border-border/20 italic">
                {resumeData.summary}
            </p>
          </Section>

          <Section title="Core Competencies" icon={Star}>
             <div className="flex flex-wrap gap-3">
                {resumeData.coreCompetencies.map(c => <Badge key={c} variant="secondary" className="text-base py-1 px-4">{c}</Badge>)}
            </div>
          </Section>

          <Section title="Technical Expertise" icon={Code}>
            <div className="grid md:grid-cols-2 gap-6">
                {resumeData.technicalExpertise.map(cat => (
                    <Card key={cat.title} className="bg-secondary/30 border-border/20">
                        <CardHeader>
                            <CardTitle className="text-lg text-primary">{cat.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{cat.skills}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
          </Section>

          <Section title="Professional Experience" icon={Briefcase}>
            <div className="space-y-8">
              {resumeData.experience.map(job => (
                <div key={job.company} className="relative pl-8 before:absolute before:left-3 before:top-2 before:w-px before:h-full before:bg-border last:before:h-0">
                   <div className="absolute left-1.5 top-2 w-3 h-3 rounded-full bg-primary ring-2 ring-background"></div>
                   <div className="flex flex-col md:flex-row justify-between md:items-center mb-1">
                        <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                        <div className="text-sm text-muted-foreground font-mono">{job.date}</div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between md:items-center text-muted-foreground mb-4">
                       <p className="text-primary font-semibold">{job.company}</p>
                       <span>{job.location}</span>
                    </div>
                    <p className="text-foreground/80 mb-4">{job.description}</p>
                     {job.highlights.length > 0 && (
                        <ul className="space-y-2">
                            {job.highlights.map((h, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <span className="text-primary font-bold mt-1">▹</span>
                                    <span>{h}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
              ))}
            </div>
          </Section>
          
          <Section title="Education & Courses" icon={GraduationCap}>
            <div className="space-y-3">
              {resumeData.education.map(edu => (
                 <div key={edu.course} className="p-4 bg-secondary/30 rounded-lg border border-border/20">
                    <p className="font-semibold text-foreground">{edu.course}</p>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                </div>
              ))}
            </div>
          </Section>

           <Section title="Portfolio" icon={LinkIcon}>
                <div className="bg-secondary/30 p-6 rounded-lg border border-border/20 text-center">
                    <p className="text-foreground/80">
                        Explore full projects, skills, AI agents, and interactive demos at: 
                        <Link href={resumeData.portfolioLink} target="_blank" className="font-semibold text-primary hover:underline ml-2">
                           {resumeData.portfolioLink.replace('https://','')}
                        </Link>
                    </p>
                </div>
            </Section>

        </main>
      </div>
    </div>
  );
}
