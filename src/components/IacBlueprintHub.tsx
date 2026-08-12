'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Cloud, 
  Code, 
  Copy, 
  Check, 
  Download, 
  Server, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Box, 
  Zap, 
  Terminal 
} from 'lucide-react';
import { cn } from '@/lib/utils';

type CloudProvider = 'gcp' | 'aws' | 'azure';
type IacTool = 'terraform' | 'opentofu' | 'pulumi';

interface Blueprint {
  id: CloudProvider;
  name: string;
  shortDesc: string;
  badge: string;
  color: string;
  borderColor: string;
  textColor: string;
  architectureComponents: string[];
  code: Record<IacTool, string>;
}

const BLUEPRINTS: Blueprint[] = [
  {
    id: 'gcp',
    name: 'Google Cloud Platform (GCP)',
    shortDesc: 'Production Serverless Agentic AI Architecture on GCP Cloud Run & Vertex AI',
    badge: 'GCP Cloud Native',
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-cyan-500/40',
    textColor: 'text-cyan-400',
    architectureComponents: [
      'Google Cloud Run (Auto-Scaling Container Services)',
      'Vertex AI & Gemini 1.5 Pro Agent Endpoints',
      'Cloud SQL PostgreSQL (pgvector Vector Index)',
      'Firebase Authentication & Firestore Long-Term Thread Memory',
      'Cloud Build CI/CD Pipeline & Artifact Registry'
    ],
    code: {
      terraform: `# GCP Agentic AI Cluster — Terraform HCL Spec
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = "us-central1"
}

# Google Cloud Run Agent Microservice
resource "google_cloud_run_v2_service" "isynera_agent" {
  name     = "isynera-agent-supervisor"
  location = "us-central1"
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "us-central1-docker.pkg.dev/\${var.gcp_project_id}/isynera/agent:latest"
      resources {
        limits = {
          cpu    = "2000m"
          memory = "4Gi"
        }
      }
      env {
        name  = "PINECONE_INDEX"
        value = "c21portfolio"
      }
      env {
        name  = "VERTEX_AI_MODEL"
        value = "gemini-1.5-pro"
      }
    }
  }
}

# Cloud SQL PostgreSQL Instance with pgvector
resource "google_sql_database_instance" "vector_db" {
  name             = "isynera-vector-db"
  database_version = "POSTGRES_15"
  region           = "us-central1"

  settings {
    tier = "db-custom-2-7680"
    database_flags {
      name  = "cloudsql.enable_pgvector"
      value = "on"
    }
  }
}`,
      opentofu: `# GCP Agentic AI Cluster — OpenTofu HCL Spec
tofu {
  required_version = ">= 1.6.0"
  required_providers {
    google = {
      source  = "registry.opentofu.org/hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = "us-central1"
}

# OpenTofu Containerized Agent Deployment
resource "google_cloud_run_v2_service" "isynera_agent" {
  name     = "isynera-agent-supervisor"
  location = "us-central1"

  template {
    containers {
      image = "us-central1-docker.pkg.dev/\${var.gcp_project_id}/isynera/agent:latest"
      resources {
        limits = {
          cpu    = "4000m"
          memory = "8Gi"
        }
      }
    }
  }
}

# Managed OpenTofu Vector Store
resource "google_sql_database_instance" "vector_db" {
  name             = "isynera-vector-store"
  database_version = "POSTGRES_15"
  region           = "us-central1"
}`,
      pulumi: `// GCP Agentic AI Cluster — Pulumi TypeScript Spec
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const config = new pulumi.Config();
const projectId = config.require("gcpProject");

// Cloud Run Agent Deployment
export const agentService = new gcp.cloudrunv2.Service("isynera-agent-supervisor", {
    location: "us-central1",
    ingress: "INGRESS_TRAFFIC_ALL",
    template: {
        containers: [{
            image: \`us-central1-docker.pkg.dev/\${projectId}/isynera/agent:latest\`,
            resources: {
                limits: {
                    cpu: "2000m",
                    memory: "4Gi",
                },
            },
            envs: [
                { name: "PINECONE_INDEX", value: "c21portfolio" },
                { name: "VERTEX_AI_MODEL", value: "gemini-1.5-pro" },
            ],
        }],
    },
});

export const serviceUrl = agentService.uri;`
    }
  },
  {
    id: 'aws',
    name: 'Amazon Web Services (AWS)',
    shortDesc: 'Enterprise Multi-Agent Kubernetes & Bedrock RAG Cluster on AWS',
    badge: 'AWS Enterprise',
    color: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-400',
    architectureComponents: [
      'AWS EKS (Elastic Kubernetes Service for Multi-Agent Pods)',
      'Amazon Bedrock (Claude 3.5 Sonnet & Llama 3 Endpoints)',
      'Amazon S3 Vector Bucket & Pinecone Vector Store',
      'AWS Lambda & API Gateway (Real-Time Voice & WebSockets)',
      'AWS IAM Roles for Service Accounts (IRSA) & KMS Secrets'
    ],
    code: {
      terraform: `# AWS Agentic AI Cluster — Terraform HCL Spec
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# AWS EKS Cluster for Agentic Microservices
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "isynera-agentic-cluster"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    agents = {
      min_size     = 2
      max_size     = 10
      desired_size = 3
      instance_types = ["g5.2xlarge"]
    }
  }
}

# AWS Bedrock Access Policy
resource "aws_iam_policy" "bedrock_access" {
  name        = "IsyneraBedrockAccessPolicy"
  description = "Allows EKS Agent Pods to invoke Amazon Bedrock Foundation Models"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}`,
      opentofu: `# AWS Agentic AI Cluster — OpenTofu HCL Spec
tofu {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "registry.opentofu.org/hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_eks_cluster" "isynera" {
  name     = "isynera-opentofu-eks"
  role_arn = aws_iam_role.eks_role.arn

  vpc_config {
    subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]
  }
}`,
      pulumi: `// AWS Agentic AI Cluster — Pulumi TypeScript Spec
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as eks from "@pulumi/eks";

// Create AWS EKS Cluster for Autonomous Agents
const cluster = new eks.Cluster("isynera-agent-cluster", {
    desiredCapacity: 3,
    minSize: 2,
    maxSize: 10,
    instanceType: "g5.2xlarge",
});

export const kubeconfig = cluster.kubeconfig;`
    }
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    shortDesc: 'Enterprise AI Foundry & AKS Databricks Lakehouse Architecture',
    badge: 'Azure Cloud Native',
    color: 'from-purple-500/20 to-indigo-500/20',
    borderColor: 'border-purple-500/40',
    textColor: 'text-purple-400',
    architectureComponents: [
      'Azure AI Foundry (GPT-4o & DeepSeek AI Models)',
      'Azure Kubernetes Service (AKS for Agent Orchestration)',
      'Azure Databricks PySpark & Delta Lake Vector Search',
      'Azure Cosmos DB (Multi-Region Document & Memory Store)',
      'Azure Key Vault & Entra ID SSO Identity'
    ],
    code: {
      terraform: `# Azure Agentic AI Cluster — Terraform HCL Spec
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "isynera" {
  name     = "rg-isynera-ai-prod"
  location = "eastus"
}

# Azure Cognitive Services AI Foundry
resource "azurerm_cognitive_account" "ai_foundry" {
  name                = "cog-isynera-ai-foundry"
  location            = azurerm_resource_group.isynera.location
  resource_group_name = azurerm_resource_group.isynera.name
  kind                = "OpenAI"
  sku_name            = "S0"
}

# Azure Kubernetes Service
resource "azurerm_kubernetes_cluster" "aks" {
  name                = "aks-isynera-cluster"
  location            = azurerm_resource_group.isynera.location
  resource_group_name = azurerm_resource_group.isynera.name
  dns_prefix          = "isynera-aks"

  default_node_pool {
    name       = "agentpool"
    node_count = 3
    vm_size    = "Standard_D8s_v5"
  }

  identity {
    type = "SystemAssigned"
  }
}`,
      opentofu: `# Azure Agentic AI Cluster — OpenTofu HCL Spec
tofu {
  required_version = ">= 1.6.0"
  required_providers {
    azurerm = {
      source  = "registry.opentofu.org/hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_cognitive_account" "ai_foundry" {
  name                = "cog-isynera-opentofu"
  location            = "eastus"
  resource_group_name = "rg-isynera-ai"
  kind                = "OpenAI"
  sku_name            = "S0"
}`,
      pulumi: `// Azure Agentic AI Cluster — Pulumi TypeScript Spec
import * as pulumi from "@pulumi/pulumi";
import * as azureNative from "@pulumi/azure-native";

const resourceGroup = new azureNative.resources.ResourceGroup("rg-isynera-ai");

export const aiFoundry = new azureNative.cognitiveservices.Account("cog-isynera-ai", {
    resourceGroupName: resourceGroup.name,
    kind: "OpenAI",
    sku: { name: "S0" },
    location: resourceGroup.location,
});`
    }
  }
];

export default function IacBlueprintHub() {
  const [selectedCloud, setSelectedCloud] = useState<CloudProvider>('gcp');
  const [selectedTool, setSelectedTool] = useState<IacTool>('terraform');
  const [copied, setCopied] = useState(false);

  const blueprint = BLUEPRINTS.find(b => b.id === selectedCloud) || BLUEPRINTS[0];
  const currentCode = blueprint.code[selectedTool];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = selectedTool === 'pulumi' ? 'ts' : 'tf';
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `isynera-${selectedCloud}-${selectedTool}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="iac-blueprint-hub" className="relative w-full xl:w-[120%] 2xl:w-[140%] max-w-[1400px] mx-auto px-4 py-20 pointer-events-auto z-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold text-cyan-400 backdrop-blur-md">
            <Cloud className="w-4 h-4 text-cyan-400" />
            Cloud Architecture & Infrastructure as Code (IaC)
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary-gradient tracking-tight">
            Multi-Cloud IaC Blueprint Hub
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base font-light">
            Deployable, production-ready Infrastructure as Code reference blueprints across GCP, AWS, and Azure using Terraform, OpenTofu, and Pulumi.
          </p>
        </div>

        {/* Cloud Provider Tabs */}
        <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto">
          {BLUEPRINTS.map((b) => {
            const isActive = selectedCloud === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedCloud(b.id)}
                className={cn(
                  'p-4 rounded-2xl border text-center transition-all duration-300 backdrop-blur-md relative overflow-hidden',
                  isActive
                    ? `bg-black/60 ${b.borderColor} shadow-[0_0_30px_-5px_rgba(var(--primary),0.3)]`
                    : 'bg-black/20 border-white/10 hover:border-white/20 text-slate-400'
                )}
              >
                <div className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-1">
                  {b.badge}
                </div>
                <div className={cn('text-sm font-bold truncate', isActive ? b.textColor : 'text-white')}>
                  {b.name.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content Showcase */}
        <Card className="bg-slate-950/80 border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Architecture Specs */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold tracking-wider text-primary uppercase">
                <Box className="w-3.5 h-3.5 text-primary" />
                {blueprint.badge}
              </div>

              <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                {blueprint.name}
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed font-light">
                {blueprint.shortDesc}
              </p>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Target Infrastructure Stack
                </div>
                {blueprint.architectureComponents.map((comp, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs md:text-sm text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Code Viewer */}
            <div className="lg:col-span-7 flex flex-col gap-4 bg-black/80 rounded-2xl p-5 border border-white/10 shadow-2xl">
              {/* IaC Tool Selector & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                {/* Tool selector buttons */}
                <div className="flex items-center gap-2">
                  {(['terraform', 'opentofu', 'pulumi'] as IacTool[]).map((tool) => (
                    <button
                      key={tool}
                      onClick={() => setSelectedTool(tool)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all',
                        selectedTool === tool
                          ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_-3px_rgba(34,211,238,0.4)]'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                      )}
                    >
                      {tool}
                    </button>
                  ))}
                </div>

                {/* Actions: Copy & Download */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="h-8 border-white/10 hover:border-white/20 text-xs gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="h-8 border-white/10 hover:border-white/20 text-xs gap-1.5 text-cyan-400"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Code Pre Block */}
              <div className="relative">
                <pre className="font-mono text-[11px] md:text-xs text-cyan-300 bg-slate-950 p-4 rounded-xl overflow-x-auto leading-relaxed max-h-[380px] border border-white/5">
                  {currentCode}
                </pre>
              </div>
            </div>

          </div>
        </Card>
      </div>
    </section>
  );
}
