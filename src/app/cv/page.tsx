'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Code, Mail, MapPin, Phone, Github, Link as LinkIcon, GraduationCap, Star, Printer, Download, Bot, Users, BrainCircuit, Workflow, ShieldCheck, Volume2, Play, Pause, Loader2, StopCircle } from 'lucide-react';
import Link from 'next/link';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';
import { resumeData, allVentures, ventureIcons } from '@/lib/data';
import CaseStudyModal from '@/components/CaseStudyModal';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { Venture } from '@/lib/types';
import ProjectCard from '@/components/ProjectCard';
import { textToSpeech } from '@/ai/flows/openai-tts-flow';

type AudioState = 'idle' | 'loading' | 'playing' | 'paused';

const Section = ({ title, icon: Icon, children, className = '' }: { title: string; icon: React.ElementType; children: React.ReactNode; className?: string }) => (
  <section className={`mb-16 ${className}`}>
    <div className="flex items-center gap-4 mb-8">
      <Icon className="w-8 h-8 text-primary" />
      <h2 className="text-3xl font-bold tracking-tight text-primary-gradient">
        {title}
      </h2>
    </div>
    <div className="space-y-6">{children}</div>
  </section>
);

const SkillCard = ({ title, skills, icon: Icon }: { title: string, skills: string[], icon: React.ElementType }) => (
    <Card className="bg-secondary/30 border-border/20 h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-primary/15 hover:shadow-lg">
        <CardHeader>
            <div className="flex items-center gap-3 mb-2">
                <Icon className="w-6 h-6 text-accent" />
                <CardTitle className="text-xl">{title}</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-sm">{skill}</Badge>
                ))}
            </div>
        </CardContent>
    </Card>
);


export default function CVPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Venture | null>(null);

  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const openModal = (project: Venture) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };
  
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
      const { audioDataUri } = await textToSpeech({ text: audioQueue[currentAudioIndex], voice: 'nova' });
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
      const mainContent = document.getElementById('cv-container');
      if (!mainContent) {
        console.error("CV container not found");
        return;
      }

      const contentClone = mainContent.cloneNode(true) as HTMLElement;
      contentClone.querySelectorAll('button, a, [data-no-read="true"], .print\\:hidden').forEach(el => el.remove());
      
      const textToRead = contentClone.innerText.replace(/Download PDF/g, '').trim();

      const chunkText = (text: string, maxLength = 4000): string[] => {
          const chunks: string[] = [];
          while (text.length > 0) {
              if (text.length <= maxLength) {
                  chunks.push(text);
                  break;
              }
              let chunk = text.substring(0, maxLength);
              const lastSpace = chunk.lastIndexOf(' ');
              if (lastSpace !== -1) {
                  chunk = chunk.substring(0, lastSpace);
              }
              chunks.push(chunk);
              text = text.substring(chunk.length).trim();
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

  const featuredProjects = allVentures.filter(v => ['venture-1', 'venture-2', 'venture-8'].includes(v.id));

  return (
    <>
      <div className="py-16 md:py-24 relative">
        <div id="cv-container" className="max-w-5xl mx-auto">
            
          {/* Header */}
          <header
            className="text-center mb-20 relative"
          >
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-primary-gradient">
              {resumeData.name}
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-muted-foreground font-light">AI Engineer & Full-Stack Developer</p>
            <div className="mt-6 flex justify-center items-center flex-wrap gap-x-6 gap-y-3 text-muted-foreground">
                <a href={`mailto:${resumeData.contact.email}`} className="flex items-center gap-2 hover:text-primary transition-colors"><Mail className="w-4 h-4" /> {resumeData.contact.email}</a>
                <a href={resumeData.contact.github} target="_blank" className="flex items-center gap-2 hover:text-primary transition-colors"><Github className="w-4 h-4" /> GitHub</a>
                <Link href={resumeData.contact.portfolio} target="_blank" className="flex items-center gap-2 hover:text-primary transition-colors"><LinkIcon className="w-4 h-4" /> Portfolio</Link>
            </div>
            <div className="mt-8 print:hidden flex justify-center gap-2" data-no-read="true">
                <Button onClick={handlePrint} variant="outline" className="group">
                    <Download className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                    Download PDF
                </Button>
                <Button onClick={handleReadAloud} variant="outline" className="group" disabled={audioState === 'loading'}>
                    {getReadAloudIcon()}
                    {audioState === 'playing' ? 'Pause' : 'Read Aloud'}
                </Button>
                {audioState !== 'idle' && (
                    <Button onClick={stopPlayback} variant="outline" className="group">
                        <StopCircle className="mr-2 h-4 w-4" /> Stop
                    </Button>
                )}
            </div>
          </header>

          <main>
            <Section title="Professional Summary" icon={Briefcase}>
              <p className="text-lg text-foreground/80 leading-relaxed bg-secondary/20 p-8 rounded-xl border border-border/20 shadow-inner">
                  {resumeData.summary}
              </p>
            </Section>

            <Section title="Core Competencies" icon={Star}>
               <div className="flex flex-wrap gap-3">
                  {resumeData.coreCompetencies.map((c) => (
                    <Badge key={c} variant="secondary" className="text-base py-2 px-5 cursor-default border border-transparent hover:border-primary/50 hover:bg-primary/10 transition-all duration-200">{c}</Badge>
                  ))}
              </div>
            </Section>

            <Section title="Professional Experience" icon={Briefcase}>
              <div className="space-y-12">
                {resumeData.experience.map((job, index) => (
                  <div
                    key={index} 
                    className="relative pl-8 border-l-2 border-primary/20"
                  >
                    <div className="absolute -left-[10px] top-1 w-5 h-5 bg-background border-2 border-primary rounded-full"></div>
                     <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
                          <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                          <div className="text-sm text-muted-foreground font-mono mt-1 sm:mt-0">{job.date}</div>
                      </div>
                      <p className="text-primary font-semibold mb-3">{job.company}</p>
                      <p className="text-foreground/80 mb-4">{job.description}</p>
                       {job.highlights.length > 0 && (
                          <ul className="space-y-2">
                              {job.highlights.map((h, i) => (
                                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                      <span className="text-primary font-bold mt-1">▪</span>
                                      <span>{h}</span>
                                  </li>
                              ))}
                          </ul>
                      )}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Featured Projects" icon={Code}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {featuredProjects.map((project) => {
                        const iconData = ventureIcons.find(icon => icon.name === project.name);
                        const Icon = iconData ? iconData.icon : Users;
                        return <ProjectCard key={project.id} project={project} Icon={Icon} />
                    })}
                </div>
                <div className="text-center mt-8">
                    <Button asChild variant="outline">
                        <Link href="/projects">View All Projects & Ventures</Link>
                    </Button>
                </div>
            </Section>


            <Section title="Technical Expertise" icon={Code}>
              <div className="grid md:grid-cols-2 gap-6">
                  <SkillCard title="AI & MLOps" icon={BrainCircuit} skills={['GenAI', 'RAG', 'Fine-Tuning', 'Agentic Workflows', 'Vector DBs', 'MLOps', 'SageMaker', 'Vertex AI', 'LangChain']} />
                  <SkillCard title="Data & Backend" icon={Briefcase} skills={['Data Engineering', 'ETL/ELT', 'Python', 'Node.js', 'SQL/NoSQL', 'Databricks', 'Airflow', 'Kafka']} />
                  <SkillCard title="Cloud & DevOps" icon={ShieldCheck} skills={['Multi-Cloud', 'AWS', 'Azure', 'GCP', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Serverless']} />
                  <SkillCard title="Frontend" icon={Workflow} skills={['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'ShadCN UI', 'Framer Motion']} />
              </div>
            </Section>
            
            <Section title="Education" icon={GraduationCap}>
              <div className="space-y-4">
                {resumeData.education.slice(0, 3).map(edu => ( // Show first 3
                  <div key={edu.course} className="p-4 bg-secondary/30 rounded-lg border border-border/20">
                      <p className="font-semibold text-foreground">{edu.course}</p>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  </div>
                ))}
                <div className="text-center">
                    <Button asChild variant="link">
                        <Link href="/resume">View all certifications & courses</Link>
                    </Button>
                </div>
              </div>
            </Section>

          </main>
        </div>
      </div>
      <FloatingAIAssistant />
      {selectedProject && isModalOpen && (
            <CaseStudyModal 
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                projectId={selectedProject.id}
                projectTitle={selectedProject.name}
            />
        )}
    </>
  );
}
