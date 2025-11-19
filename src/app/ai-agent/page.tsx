
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { allVentures, ventureIcons } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CheckCircle, Bot, Zap, Users, ShieldCheck, Workflow, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: 'Custom AI Agents',
    description:
      'Bespoke agents that understand your business logic and execute complex, multi-step tasks autonomously.',
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: 'Intelligent Automation',
    description:
      'Streamline operations, from customer support to internal workflows, with AI that acts and decides.',
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: 'Enterprise-Grade RAG',
    description:
      'Build powerful Retrieval-Augmented Generation pipelines that provide accurate, context-aware answers from your knowledge base.',
  },
];

const specializations = [
    { name: "Custom AI Agents", icon: Bot },
    { name: "AI-driven Web Applications", icon: Workflow },
    { name: "Intelligent Automation Systems", icon: Zap },
    { name: "Enterprise SaaS Platforms", icon: BrainCircuit },
    { name: "Multi-Agent GenAI Workflows", icon: Users },
    { name: "RAG, LLM Fine-Tuning & Computer Vision Pipelines", icon: ShieldCheck }
]

export default function AIAgentPage() {
    const iSydney = allVentures.find(v => v.id === 'venture-8');
    const iHailey = allVentures.find(v => v.id === 'venture-9');
    
    const iSydneyIcon = ventureIcons.find(icon => icon.name === iSydney?.name)?.icon || Bot;
    const iHaileyIcon = ventureIcons.find(icon => icon.name === iHailey?.name)?.icon || Bot;

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-24">
       <section className="w-full relative">
         <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
         <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary-gradient">
                  Chancellor Minus ✨ iChanceTEK
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Enterprise AI That Works Like Your Best Employee. Better Customer Experiences. Built on iChanceTEK.
                </p>
              </div>
              <p className="max-w-[600px] text-muted-foreground">
                iChanceTEK helps businesses deliver customer experiences that feel more human, more intelligent, and more effortless. Your iChanceTEK AI Agent doesn’t just answer questions— it takes action to solve problems, reduce handle time, and dramatically improve self-service resolution.
              </p>
               <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-primary-gradient">
                    <Link href="/projects#contact">Request a Demo</Link>
                </Button>
              </div>
            </div>
             <Image
              alt="AI Agent Robotics"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              height="550"
              src="https://images.unsplash.com/photo-1527430253228-e93688616381?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              width="550"
              data-ai-hint="robotics AI"
            />
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
           <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary-gradient">Your Expertise, Amplified</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Equip your agent with your business knowledge—policies, workflows, guidelines, and brand voice—so it thinks, communicates, and acts exactly the way your organization needs.
                </p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature) => (
                    <Card key={feature.title} className="bg-card border-none shadow-lg shadow-primary/5 transition-all duration-300 hover:shadow-primary/10 hover:-translate-y-1">
                    <CardHeader>
                        <div className="mb-4">{feature.icon}</div>
                        <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
                        <CardContent className="p-0 pt-2">{feature.description}</CardContent>
                    </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-secondary/20">
         <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Instant, Intelligent Action</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-gradient">Connect to Your Systems of Record</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Connect iChanceTEK to your systems of record—CRM, order management, billing, reservations, and more. Your agent can instantly take action securely and autonomously.
                </p>
                 <ul className="grid gap-4">
                    <li className="flex items-start gap-3">
                        <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                        <span><span className="font-semibold">Process Exchanges:</span> Update orders and manage returns without human intervention.</span>
                    </li>
                     <li className="flex items-start gap-3">
                        <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                        <span><span className="font-semibold">Update Subscriptions:</span> Handle upgrades, downgrades, and cancellations automatically.</span>
                    </li>
                     <li className="flex items-start gap-3">
                        <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                        <span><span className="font-semibold">Modify Reservations:</span> Change dates, times, and details for bookings in real-time.</span>
                    </li>
                     <li className="flex items-start gap-3">
                        <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                        <span><span className="font-semibold">Execute Workflows:</span> Complete complex, multi-step processes across different systems.</span>
                    </li>
                </ul>
            </div>
             <div className="flex flex-col gap-4">
                {iSydney && (
                    <Card className="w-full">
                        <CardHeader className="flex flex-row items-center gap-4">
                             <iSydneyIcon className="w-10 h-10 text-primary" />
                             <div>
                                <CardTitle>{iSydney.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{iSydney.description}</p>
                             </div>
                        </CardHeader>
                    </Card>
                )}
                 {iHailey && (
                    <Card className="w-full">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <iHaileyIcon className="w-10 h-10 text-primary" />
                             <div>
                                <CardTitle>{iHailey.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{iHailey.description}</p>
                             </div>
                        </CardHeader>
                    </Card>
                )}
            </div>
         </div>
      </section>

      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-gradient">🚀 Transform Every Customer Interaction</h2>
                 <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    Give customers the ability to get answers, solve problems, and take action whenever they need—without waiting, without friction.
                 </p>
            </div>

            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 mt-12">
                <div className="grid gap-1 text-center">
                    <h3 className="text-lg font-bold">Engage & Delight</h3>
                    <p className="text-sm text-muted-foreground">Deploy an AI agent that is always available and always on-brand—empathetic, accurate, and aligned with your voice.</p>
                </div>
                <div className="grid gap-1 text-center">
                    <h3 className="text-lg font-bold">Real-Time Complex Support</h3>
                    <p className="text-sm text-muted-foreground">Whether customers need to change an order, manage a subscription, or schedule appointments, iChanceTEK handles it instantly.</p>
                </div>
                 <div className="grid gap-1 text-center">
                    <h3 className="text-lg font-bold">Adapts. Learns. Improves. Fast.</h3>
                    <p className="text-sm text-muted-foreground">With built-in analytics, your AI agent continuously improves, uncovering insights that elevate customer experience.</p>
                </div>
            </div>
        </div>
      </section>
      
       <section id="skills" className="w-full py-16 md:py-24 bg-secondary/20">
         <div className="container">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-gradient">🏢 ChanceTEK — Building the Future of Enterprise AI</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    ChanceTEK designs next-generation enterprise software powered by Generative AI and Agentic AI for organizations across every major industry. Our technology integrates the best of the GenAI ecosystem: Google Gemini, OpenAI, Anthropic, Llama, DeepSeek, Hugging Face, and leading open-source models.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {specializations.map((skill) => {
                    const IconComponent = skill.icon;
                    return (
                        <Card key={skill.name} className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm p-6">
                           <div className="flex items-center gap-4">
                             <IconComponent className="w-8 h-8 text-primary" />
                             <h3 className="text-lg font-semibold">{skill.name}</h3>
                           </div>
                        </Card>
                    )
                })}
            </div>
        </div>
      </section>

    </div>
  );
}
