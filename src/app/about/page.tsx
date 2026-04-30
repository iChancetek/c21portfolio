'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BrainCircuit, 
  Cloud, 
  Database, 
  Workflow, 
  Mic, 
  Eye, 
  Building2, 
  Activity, 
  Zap, 
  Cpu, 
  ShoppingCart, 
  Layers, 
  LineChart, 
  ShieldCheck, 
  Server, 
  Code,
  Globe,
  Bot
} from 'lucide-react';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';
import Link from 'next/link';
import { useState, useRef, useCallback, useEffect } from 'react';
import { textToSpeech } from '@/ai/flows/openai-tts-flow';
import { useLocale } from '@/hooks/useLocale';
import { Volume2, Play, Pause, Loader2, StopCircle } from 'lucide-react';

type AudioState = 'idle' | 'loading' | 'playing' | 'paused';

export default function AboutPage() {
  const { locale, voice } = useLocale();
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioState('idle');
    setAudioQueue([]);
    setCurrentAudioIndex(0);
  }, []);

  const playNextChunk = useCallback(async () => {
    if (currentAudioIndex >= audioQueue.length) {
      stopPlayback();
      return;
    }
    setAudioState('loading');
    try {
      const { audioDataUri } = await textToSpeech({ text: audioQueue[currentAudioIndex], locale, voice });
      if (audioRef.current) {
        audioRef.current.src = audioDataUri;
        audioRef.current.play().catch((e) => {
            console.error("Audio playback failed:", e);
            stopPlayback();
        });
        setAudioState('playing');
      }
    } catch (error) {
      console.error('Failed to generate speech for chunk:', error);
      stopPlayback();
    }
  }, [currentAudioIndex, audioQueue, stopPlayback, locale, voice]);

  useEffect(() => {
    if (audioQueue.length > 0 && currentAudioIndex < audioQueue.length && audioState !== 'playing' && audioState !== 'paused') {
        playNextChunk();
    }
  }, [audioQueue, currentAudioIndex, playNextChunk, audioState]);
  
  useEffect(() => {
    audioRef.current = new Audio();
    const audioElement = audioRef.current;
    
    const onEnded = () => {
        setCurrentAudioIndex(prev => prev + 1);
    };
    audioElement.addEventListener('ended', onEnded);

    return () => {
      audioElement?.removeEventListener('ended', onEnded);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleReadAloud = async () => {
    if (audioState === 'playing') {
      audioRef.current?.pause();
      setAudioState('paused');
      return;
    }

    if (audioState === 'paused' && audioRef.current) {
      audioRef.current.play();
      setAudioState('playing');
      return;
    }

    if (audioState === 'idle') {
      const mainContent = document.getElementById('about-container');
      if (!mainContent) {
        console.error("About container not found");
        return;
      }

      const contentClone = mainContent.cloneNode(true) as HTMLElement;
      contentClone.querySelectorAll('button, a, [data-no-read="true"], .print\\:hidden').forEach(el => el.remove());
      
      const textToRead = contentClone.innerText.trim();

      const chunkText = (text: string, maxLength = 4000): string[] => {
          const chunks: string[] = [];
          let currentChunk = '';
          const sentences = text.split(/(?<=[.?!])\s+/);

          for (const sentence of sentences) {
              if ((currentChunk + sentence).length > maxLength) {
                  chunks.push(currentChunk);
                  currentChunk = sentence;
              } else {
                  currentChunk += (currentChunk ? ' ' : '') + sentence;
              }
          }
          if (currentChunk) {
              chunks.push(currentChunk);
          }
          return chunks;
      };

      const chunks = chunkText(textToRead);
      setAudioQueue(chunks);
      setCurrentAudioIndex(0);
    }
  };
  
  const getReadAloudIcon = () => {
    switch (audioState) {
        case 'loading': return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
        case 'playing': return <Pause className="mr-2 h-4 w-4" />;
        case 'paused': return <Play className="mr-2 h-4 w-4" />;
        default: return <Volume2 className="mr-2 h-4 w-4" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <div className="py-16 md:py-24 relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end gap-3 mb-6" data-no-read="true">
              <Button onClick={handleReadAloud} variant="outline" className="group shadow-sm hover:shadow-md transition-all" disabled={audioState === 'loading'}>
                  {getReadAloudIcon()}
                  {audioState === 'playing' ? 'Pause' : 'Read Aloud'}
              </Button>
              {audioState !== 'idle' && (
                  <Button onClick={stopPlayback} variant="outline" className="group">
                      <StopCircle className="mr-2 h-4 w-4 text-destructive" /> Stop
                  </Button>
              )}
          </div>
          
          <div id="about-container">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-16"
          >
            
            {/* HERO SECTION */}
            <motion.section variants={itemVariants} className="text-center space-y-6">
              <Badge variant="outline" className="px-4 py-1.5 text-sm font-semibold text-primary border-primary/30 bg-primary/5 uppercase tracking-widest mb-4">
                AI Systems Engineer • Cloud Architect • Founder
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70 tracking-tighter">
                Chancellor Minus
              </h1>
              <p className="text-xl text-foreground/80 leading-relaxed max-w-3xl mx-auto font-light">
                I am an AI Systems Engineer and Cloud Architect building intelligent software systems that power real-world applications across healthcare, enterprise, productivity, and digital platforms.
              </p>
            </motion.section>

            {/* WHAT I COMBINE */}
            <motion.section variants={itemVariants} className="pt-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-border flex-1"></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-primary" /> Core Systems
                </h2>
                <div className="h-px bg-border flex-1"></div>
              </div>
              <p className="text-center text-lg text-foreground/90 mb-8 font-medium">
                I design and develop production-grade AI systems that combine:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: Workflow, text: "Agentic AI workflows" },
                  { icon: Database, text: "RAG (Retrieval-Augmented Generation) systems" },
                  { icon: Server, text: "Data engineering pipelines" },
                  { icon: Cpu, text: "MLOps infrastructure" },
                  { icon: Mic, text: "Voice AI (STT and TTS systems)" },
                  { icon: Eye, text: "Multimodal AI systems (language, vision, automation)" },
                ].map((item, i) => (
                  <Card key={i} className="bg-background/50 border-border/20 shadow-sm hover:border-primary/30 hover:shadow-primary/5 transition-all">
                    <CardContent className="p-4 flex flex-col items-center text-center gap-3 h-full justify-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-foreground/90">{item.text}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.section>

            {/* WHAT I BUILD */}
            <motion.section variants={itemVariants} className="pt-8">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px bg-border flex-1"></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> What I Build
                </h2>
                <div className="h-px bg-border flex-1"></div>
              </div>
              
              <p className="text-center text-lg text-foreground/90 mb-8 font-medium">
                I specialize in building AI-native, cloud-scale platforms including:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Building2, title: "Enterprise Systems", desc: "AI-powered ERP and CRM systems" },
                  { icon: Activity, title: "Healthcare AI", desc: "Healthcare and medical AI agent applications" },
                  { icon: Zap, title: "Automation Tools", desc: "Productivity and workflow automation tools" },
                  { icon: Bot, title: "Enterprise Assistants", desc: "Enterprise AI assistants and internal automation systems", iconComponent: BrainCircuit },
                  { icon: ShoppingCart, title: "Digital Marketplaces", desc: "Digital marketplaces for content, media, and services" },
                  { icon: Globe, title: "Intelligent SaaS", desc: "Scalable SaaS platforms with intelligent agents" },
                  { icon: LineChart, title: "Data Pipelines", desc: "Data engineering systems and analytics pipelines" },
                  { icon: ShieldCheck, title: "MLOps", desc: "MLOps pipelines for deploying and scaling AI models" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 border border-border/30 hover:bg-secondary/40 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-background flex-shrink-0 flex items-center justify-center shadow-sm border border-border/40 text-primary">
                      {item.iconComponent ? <item.iconComponent className="w-5 h-5" /> : <item.icon className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ENGINEERING APPROACH */}
            <motion.section variants={itemVariants} className="pt-8">
               <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-border flex-1"></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-primary" /> Engineering Approach
                </h2>
                <div className="h-px bg-border flex-1"></div>
              </div>

              <Card className="bg-gradient-to-br from-background via-background to-secondary/30 border-border/40 overflow-hidden relative shadow-lg">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
                <CardContent className="p-8 md:p-10 space-y-8">
                  <p className="text-lg text-foreground/90 font-medium">
                    I build systems using modern cloud and AI infrastructure across:
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Google Cloud, AWS, and Azure",
                      "Serverless architectures and distributed systems",
                      "CI/CD automation and infrastructure-as-code",
                      "AI-assisted development workflows to accelerate engineering while maintaining full control over architecture, security, and deployment"
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Code className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground/80 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-primary/10 border border-primary/20 p-5 rounded-lg">
                    <p className="font-bold text-primary italic text-center">
                      "I focus on designing systems that are scalable, reliable, and production-ready from day one."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* PHILOSOPHY & COMPANY */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 pt-8">
              
              {/* Philosophy */}
              <div className="flex flex-col justify-center h-full space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  Philosophy
                </h2>
                <div className="border-l-4 border-primary pl-6 py-2 space-y-4">
                  <p className="text-2xl font-bold text-foreground leading-snug">
                    Software should not just assist humans — it should intelligently automate real work.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    I build systems that turn complex workflows into intelligent, self-operating AI-driven platforms.
                  </p>
                </div>
              </div>

              {/* Company */}
              <div className="flex flex-col justify-center">
                 <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-6">
                  Company
                </h2>
                <Card className="bg-card border-border/40 hover:border-primary/50 transition-colors group cursor-pointer h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary-gradient opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  <CardContent className="p-8 flex flex-col items-center text-center justify-center h-full">
                    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 shadow-inner border border-border/50">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-2">ChanceTEK LLC</h3>
                    <Link href="https://iChanceTEK.com" target="_blank" className="text-primary font-semibold hover:underline mb-4 inline-flex items-center gap-1">
                      iChanceTEK.com
                    </Link>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Building AI-native systems across enterprise, healthcare, productivity, and digital ecosystems.
                    </p>
                  </CardContent>
                </Card>
              </div>

            </motion.div>

          </motion.div>
          </div>
        </div>
      </div>
      <FloatingAIAssistant />
    </>
  );
}
