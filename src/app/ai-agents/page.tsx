
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { allVentures, ventureIcons } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { CheckCircle, Bot, Zap, Users, ShieldCheck, Workflow, BrainCircuit, ExternalLink, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import ProductCard from "@/components/ProductCard";
import FloatingAIAssistant from "@/components/FloatingAIAssistant";
import Image from "next/image";
import { motion } from 'framer-motion';

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
    const [isMuted, setIsMuted] = useState(true);
    const iSydney = allVentures.find(v => v.id === 'venture-8');
    const iHailey = allVentures.find(v => v.id === 'venture-9');
    const iSkylar = allVentures.find(v => v.id === 'venture-10');
    
    const ISydneyIcon = ventureIcons.find(icon => icon.name === iSydney?.name)?.icon || Bot;
    const IHaileyIcon = ventureIcons.find(icon => icon.name === iHailey?.name)?.icon || Bot;
    const ISkylarIcon = ventureIcons.find(icon => icon.name === iSkylar?.name)?.icon || Bot;

  return (
    <div className="flex flex-col w-full items-center justify-center py-12">
      {/* Featured Agentic AI Platform - Cinematic Widescreen Banner */}
      <div className="w-full max-w-7xl px-4 md:px-6 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full rounded-2xl overflow-hidden border border-primary/20 shadow-[0_0_50px_-15px_rgba(var(--primary),0.3)] bg-background/30 backdrop-blur-xl relative flex flex-col lg:flex-row items-center justify-between p-6 md:p-10 lg:p-12 gap-8 lg:gap-12 group animate-glow"
        >
          {/* Soft glowing cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary),0.1),transparent_70%)] pointer-events-none z-0" />

          {/* Left Section: Platform Info & CTA */}
          <div className="relative z-10 flex-1 flex flex-col gap-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-xs font-semibold tracking-wider text-primary uppercase w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              Featured Agentic AI Platform
            </div>
            
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] leading-none">
                ModelIQ
              </h1>
              <p className="text-primary font-semibold text-sm md:text-base tracking-wider uppercase">
                Agentic AI Coding • MLOps • Data Engineering • DevOps • ML
              </p>
            </div>

            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl font-light">
              Experience the future with an Agent-First IDE. Orchestrate a fleet of autonomous agents—Architect, Frontend, Backend, Data Engineering, MLOps, and DevOps—to plan, build, and optimize elite AI applications and petabyte-scale pipelines natively on Google Cloud Platform.
            </p>
            
            {/* CTA Platform Link */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Button asChild className="bg-primary-gradient hover:shadow-[0_0_25px_rgba(var(--primary),0.4)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl px-6 py-5 font-semibold text-white">
                <a href="https://ModelIQ.us" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  Visit ModelIQ <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Right Section: Large Immersive Showcase Video */}
          <div className="relative z-10 w-full lg:w-[500px] xl:w-[640px] shrink-0 aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40 group-hover:border-primary/30 transition-all duration-500 shadow-2xl">
            <video
              src="/modeliq5.mp4"
              className="w-full h-full object-cover"
              autoPlay
              muted={isMuted}
              loop
              playsInline
            />
            {/* Mute/Unmute toggle for listening */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-4 right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 hover:border-primary/50 text-white backdrop-blur-md transition-all duration-300 shadow-lg hover:scale-105"
              title={isMuted ? "Unmute to Listen" : "Mute Video"}
            >
              {isMuted ? <VolumeX className="h-5 w-5 text-red-400" /> : <Volume2 className="h-5 w-5 text-primary animate-pulse" />}
            </button>
          </div>
        </motion.div>
      </div>

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
                    <Link href="/products#contact">Request a Demo</Link>
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
                    <ProductCard product={iSydney} Icon={ISydneyIcon} />
                )}
                 {iHailey && (
                    <ProductCard product={iHailey} Icon={IHaileyIcon} />
                )}
                {iSkylar && (
                    <ProductCard product={iSkylar} Icon={ISkylarIcon} />
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
