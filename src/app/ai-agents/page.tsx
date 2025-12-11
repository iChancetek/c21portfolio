
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { allVentures, ventureIcons } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { CheckCircle, Bot, Zap, Users, ShieldCheck, Workflow, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import ProjectCard from "@/components/ProjectCard";
import FloatingAIAssistant from "@/components/FloatingAIAssistant";
import Image from "next/image";

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

export default function AIAgentsPage() {
    const iSydney = allVentures.find(v => v.id === 'venture-8');
    const iHailey = allVentures.find(v => v.id === 'venture-9');
    const iSkylar = allVentures.find(v => v.id === 'venture-10');
    
    const ISydneyIcon = ventureIcons.find(icon => icon.name === iSydney?.name)?.icon || Bot;
    const IHaileyIcon = ventureIcons.find(icon => icon.name === iHailey?.name)?.icon || Bot;
    const ISkylarIcon = ventureIcons.find(icon => icon.name === iSkylar?.name)?.icon || Bot;

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-24">
       <section className="w-full relative">
         <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
         <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary-gradient">
                  AI for Enterprise, Small Business, & Non-Profits
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  AI that works like your best employee—for enterprise, small business, and non-profits—to create better customer experiences.
                </p>
              </div>
              <p className="max-w-[600px] text-muted-foreground">
                AI Agents help businesses deliver customer experiences that feel more human, more intelligent, and more effortless. Your AI Agent doesn’t just answer questions— it takes action to solve problems, reduce handle time, and dramatically improve self-service resolution.
              </p>
               <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-primary-gradient">
                    <Link href="/projects#contact">Request a Demo</Link>
                </Button>
              </div>
            </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 text-center">
        <div className="container max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-primary-gradient mb-4">The Centerpiece of Modern Business</h2>
            <p className="text-lg text-muted-foreground">
              AI Agents are becoming the centerpiece of modern businesses—more critical than websites, apps, or static digital content. A website can only show information. An AI Agent can guide, recommend, respond, automate, learn, and personalize every experience.
            </p>
            <p className="mt-4 text-lg font-semibold">
              Companies that deploy intelligent AI Agents gain a powerful advantage.
            </p>
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
                    <Card key={feature.title} className="bg-secondary/30 border-border/20 shadow-lg shadow-primary/5 transition-all duration-300 hover:shadow-primary/10 hover:-translate-y-2 hover:scale-105">
                    <CardHeader>
                        <div className="mb-4">{feature.icon}</div>
                        <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
                        <CardContent className="p-0 pt-2">{feature.description}</CardContent>
                    </CardHeader>
                    </Card>
                ))}
            </div>
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {iSydney && (
                    <ProjectCard project={iSydney} Icon={ISydneyIcon} />
                )}
                 {iHailey && (
                    <ProjectCard project={iHailey} Icon={IHaileyIcon} />
                )}
                {iSkylar && (
                    <ProjectCard project={iSkylar} Icon={ISkylarIcon} />
                )}
            </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24">
         <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Instant, Intelligent Action</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-gradient">Connect to Your Systems of Record</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Connect the AI platform to your systems of record—CRM, order management, billing, reservations, and more. Your agent can instantly take action securely and autonomously.
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
                    <p className="text-sm text-muted-foreground">Whether customers need to change an order, manage a subscription, schedule appointments, or navigate multi-step processes, the AI handles it instantly.</p>
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
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-gradient">Building the Future of AI for Business</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Designing next-generation software powered by Generative AI and Agentic AI for organizations of all sizes, across every major industry.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {specializations.map((skill) => {
                    const IconComponent = skill.icon;
                    return (
                        <Card key={skill.name} className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-border/20 bg-secondary/30 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 hover:scale-105">
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
      <FloatingAIAssistant />
    </div>
  );
}
