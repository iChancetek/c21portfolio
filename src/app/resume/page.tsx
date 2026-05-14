'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Code, Mail, MapPin, Phone, Github, Link as LinkIcon, GraduationCap, Star, BookOpen, Download, Volume2, Play, Pause, Loader2, StopCircle, Building } from 'lucide-react';
import Link from 'next/link';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';
import { resumeData } from '@/lib/data';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useRef, useCallback, useEffect } from 'react';
import { textToSpeech } from '@/ai/flows/openai-tts-flow';
import PrintResume from '@/components/PrintResume';
import { useLocale } from '@/hooks/useLocale';
import CourseGallery from '@/components/CourseGallery';

type AudioState = 'idle' | 'loading' | 'playing' | 'paused';

export default function ResumePage() {
  const { locale, voice } = useLocale();
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePrint = () => {
    window.print();
  };

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
  }, [currentAudioIndex, audioQueue, stopPlayback]);

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
      const mainContent = document.getElementById('resume-container');
      if (!mainContent) {
        console.error("Resume container not found");
        return;
      }

      const contentClone = mainContent.cloneNode(true) as HTMLElement;
      contentClone.querySelectorAll('button, a, [data-no-read="true"], .print\\:hidden').forEach(el => el.remove());
      
      const textToRead = contentClone.innerText.replace(/Download PDF/g, '').trim();

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

  return (
    <>
      <div className="py-12 md:py-24 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Action Bar */}
            <div className="flex flex-wrap justify-end gap-3 mb-6" data-no-read="true">
                <Button onClick={handlePrint} variant="outline" className="group shadow-sm hover:shadow-md transition-all">
                    <Download className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 text-primary" />
                    Download PDF
                </Button>
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

            {/* Main Resume Container */}
            <div id="resume-container" className="bg-card rounded-2xl shadow-2xl shadow-primary/10 border border-border/20 backdrop-blur-sm overflow-hidden relative grid grid-cols-1 lg:grid-cols-[1fr_2.5fr]">
                
                {/* LEFT COLUMN - ACCENT BACKGROUND */}
                <div className="bg-secondary/20 p-8 md:p-10 lg:border-r border-border/40 relative">
                    <div className="absolute inset-0 -z-10 bg-primary-gradient/5 opacity-50 blur-3xl"></div>
                    
                    {/* Contact Section */}
                    <div className="mb-10">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-5 border-b border-border/50 pb-2">Contact</h2>
                        <div className="space-y-4 text-sm text-foreground/90">
                            <a href={`mailto:${resumeData.contact.email}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                                <Mail className="w-4 h-4 text-primary" /> <span>{resumeData.contact.email}</span>
                            </a>
                            <a href={`tel:${resumeData.contact.phone.replace(/-/g, '')}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                                <Phone className="w-4 h-4 text-primary" /> <span>{resumeData.contact.phone}</span>
                            </a>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-primary" /> <span>{resumeData.contact.location}</span>
                            </div>
                            <Link href={resumeData.contact.portfolio} target="_blank" className="flex items-center gap-3 hover:text-primary transition-colors">
                                <LinkIcon className="w-4 h-4 text-primary" /> <span>{resumeData.contact.portfolio.replace('https://', '')}</span>
                            </Link>
                            <Link href={resumeData.contact.github} target="_blank" className="flex items-center gap-3 hover:text-primary transition-colors">
                                <Github className="w-4 h-4 text-primary" /> <span>{resumeData.contact.github.replace('https://', '')}</span>
                            </Link>
                        </div>
                    </div>

                    {/* Core Competencies */}
                    <div className="mb-10">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-5 border-b border-border/50 pb-2">Core Skills</h2>
                        <div className="flex flex-wrap gap-2">
                        {resumeData.coreCompetencies.map((skill) => (
                            <Badge key={skill} variant="secondary" className="bg-background/50 hover:bg-primary/20 hover:border-primary/50 transition-all text-xs font-medium py-1 px-3">
                                {skill}
                            </Badge>
                        ))}
                        </div>
                    </div>

                    {/* Technical Expertise */}
                    <div className="mb-10">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-5 border-b border-border/50 pb-2">Tech Stack</h2>
                        <div className="space-y-6">
                        {resumeData.technicalExpertise.map((cat) => {
                             const maxLength = 80;
                             const isLongContent = cat.skills.length > maxLength;
                             const truncatedSkills = isLongContent ? cat.skills.substring(0, maxLength) + '...' : cat.skills;
                             return (
                            <div key={cat.title}>
                                <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                                    <Code className="w-3.5 h-3.5 text-primary" /> {cat.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {truncatedSkills.replace(/\\n/g, ' • ')}
                                </p>
                                {isLongContent && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="link" className="p-0 h-auto text-primary text-xs mt-1">Read more</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-xl">
                                            <DialogHeader>
                                                <DialogTitle>{cat.title} Expertise</DialogTitle>
                                                <DialogDescription>Detailed overview of my capabilities</DialogDescription>
                                            </DialogHeader>
                                            <ScrollArea className="max-h-[60vh] pr-4 mt-4">
                                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{cat.skills}</p>
                                            </ScrollArea>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        )})}
                        </div>
                    </div>

                    {/* Education */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-5 border-b border-border/50 pb-2">Education</h2>
                        <div className="space-y-4">
                        {resumeData.education.slice(0, 4).map((edu) => (
                            <div key={edu.course} className="group">
                                <p className="text-sm font-bold text-foreground leading-tight">{edu.course}</p>
                                <p className="text-sm text-muted-foreground leading-tight mt-1">{edu.institution}</p>
                                {edu.certificateUrl && (
                                    <Link 
                                        href={edu.certificateUrl} 
                                        target="_blank" 
                                        className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <LinkIcon className="w-3 h-3" /> Completion Certificate
                                    </Link>
                                )}
                            </div>
                        ))}
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN - MAIN CONTENT */}
                <div className="p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                    
                    {/* Header */}
                    <div className="mb-12">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70 tracking-tighter mb-2 uppercase"
                        >
                            {resumeData.name}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mb-4"
                        >
                            <Link href={resumeData.contact.portfolio} target="_blank" className="text-sm md:text-base font-medium text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
                                Portfolio — ChancellorMinus.com (Products & AI Agents)
                            </Link>
                        </motion.div>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-primary font-semibold uppercase tracking-widest"
                        >
                            AI Engineer & Cloud Architect
                        </motion.p>
                    </div>

                    {/* Professional Summary */}
                    <div className="mb-12">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 border-b border-border/50 pb-2 flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black shadow-sm">1</span>
                            Professional Summary
                        </h2>
                        <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-wrap p-6 bg-background/50 rounded-xl border border-border/30 italic shadow-inner">
                            {resumeData.summary}
                        </p>
                    </div>

                    {/* Professional Experience */}
                    <div className="mb-12">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8 border-b border-border/50 pb-2 flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black shadow-sm">2</span>
                            Professional Experience
                        </h2>
                        <div className="space-y-10">
                        {resumeData.experience.filter(job => !job.cvOnly).map((job, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                className="relative group"
                            >
                                <div className="absolute -left-4 top-2 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors duration-300 hidden sm:block"></div>
                                <div className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-2">
                                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                                    <span className="text-sm text-muted-foreground font-mono font-semibold bg-secondary/50 px-3 py-1 rounded-md mt-2 sm:mt-0 whitespace-nowrap">{job.date}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-4">
                                    <p className="text-base font-bold text-primary flex items-center gap-2"><Building className="w-4 h-4"/> {job.company}</p>
                                    <span className="text-sm text-muted-foreground">{job.location}</span>
                                </div>
                                {job.description && (
                                    <p className="text-sm text-foreground/80 mb-4 leading-relaxed">{job.description}</p>
                                )}
                                {job.highlights && job.highlights.length > 0 && (
                                    <ul className="space-y-2 mt-2">
                                    {job.highlights.map((highlight, i) => (
                                        <li key={i} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-3">
                                            <span className="text-primary font-bold mt-0.5">▹</span>
                                            <span>{highlight}</span>
                                        </li>
                                    ))}
                                    </ul>
                                )}
                            </motion.div>
                        ))}
                        </div>
                    </div>

                    {/* Portfolio Links */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 border-b border-border/50 pb-2 flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black shadow-sm">3</span>
                            Portfolio
                        </h2>
                        <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 text-center">
                            <p className="text-foreground/80 mb-6">Explore full products, skills, AI agents, and interactive demos at <Link href="https://chancellorminus.com" target="_blank" className="font-semibold text-primary hover:underline">Chancellor</Link></p>
                            <div className="flex flex-wrap justify-center gap-8">
                                <div>
                                    <h3 className="text-lg font-bold text-primary-gradient"><Link href="https://iChanceTEK.com" target="_blank" className="hover:underline">iChanceTEK</Link></h3>
                                    <p className="text-muted-foreground text-xs uppercase tracking-wider mt-1">AI Solutions Partner</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-primary-gradient"><Link href="https://WorkSpaceIQ.us" target="_blank" className="hover:underline">WorkSpaceIQ</Link></h3>
                                    <p className="text-muted-foreground text-xs uppercase tracking-wider mt-1">AI Dictation</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <CourseGallery />
                </div>
            </div>
        </div>
      </div>
      <FloatingAIAssistant />
      <PrintResume />
    </>
  );
}
