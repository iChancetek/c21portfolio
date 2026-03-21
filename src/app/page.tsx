
'use client';

import { useState, useTransition, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, ExternalLink, Bot, Sparkles, RefreshCw, Volume2, Play, Pause, StopCircle, Activity, Stethoscope, Users } from 'lucide-react';
import { handleSearch } from '@/app/actions';
import type { Venture } from '@/lib/types';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ventureIcons, navLinks, allVentures } from '@/lib/data';
import CaseStudyModal from '@/components/CaseStudyModal';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useLocale } from '@/hooks/useLocale';
import Ticker from '@/components/Ticker';
import { textToSpeech } from '@/ai/flows/openai-tts-flow';
import { cn } from '@/lib/utils';
import Hero from '@/components/Hero';


type AudioState = 'idle' | 'loading' | 'playing' | 'paused';

function SearchResults({ projects, searchQuery, isSearching, answer }: { projects: Venture[]; searchQuery: string; isSearching: boolean; answer?: string; }) {
    const { t, locale } = useLocale();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Venture | null>(null);

    const [audioState, setAudioState] = useState<AudioState>('idle');
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const openModal = (project: Venture) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const stopPlayback = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setAudioState('idle');
        setAudioSrc(null);
    }, []);

    const handleReadAloud = async () => {
        if (!answer) return;

        if (audioState === 'playing') {
            audioRef.current?.pause();
            setAudioState('paused');
            return;
        }

        if (audioState === 'paused') {
            audioRef.current?.play();
            setAudioState('playing');
            return;
        }

        if (audioState === 'idle') {
            stopPlayback();
            setAudioState('loading');
            try {
                const { audioDataUri } = await textToSpeech({ text: answer, locale });
                setAudioSrc(audioDataUri);
            } catch (error) {
                console.error("Failed to generate speech:", error);
                stopPlayback();
            }
        }
    };
    
    // Effect to play audio once source is set
    useEffect(() => {
        if (audioSrc && audioRef.current) {
            audioRef.current.src = audioSrc;
            audioRef.current.play().catch(err => {
                console.error("Audio playback failed:", err);
                stopPlayback();
            });
            setAudioState('playing');
        }
    }, [audioSrc, stopPlayback]);
    
    // Effect to reset audio state when answer changes
    useEffect(() => {
        stopPlayback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answer]);

    // Cleanup audio on component unmount
    useEffect(() => {
        const audioElement = audioRef.current;
        const onEnded = () => {
            setAudioState('idle');
            setAudioSrc(null);
        };
        audioElement?.addEventListener('ended', onEnded);
        return () => {
            stopPlayback();
            audioElement?.removeEventListener('ended', onEnded);
        };
    }, [stopPlayback]);


    const getAudioIcon = () => {
        switch (audioState) {
            case 'loading': return <Loader2 className="h-4 w-4 animate-spin" />;
            case 'playing': return <Pause className="h-4 w-4" />;
            case 'paused': return <Play className="h-4 w-4" />;
            default: return <Volume2 className="h-4 w-4" />;
        }
    };

    if (isSearching) {
        // Don't show "no results" while actively searching
        return null;
    }

    if (searchQuery && projects.length === 0 && !answer) {
        return (
            <div className="text-center col-span-full mt-8 text-muted-foreground">
                <p>{t('noProjectsFound', { searchQuery })}</p>
            </div>
        );
    }
    
    if (projects.length === 0 && !searchQuery && !answer) { // Don't show anything if no search has been made
        return null;
    }


  return (
    <>
        <audio ref={audioRef} />
        <div id="results" className="w-full relative z-10 mt-12 pointer-events-auto">
             <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-gradient">{t('searchResults')}</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {t('showingResultsFor', { searchQuery })}
                </p>
            </div>

            {answer && (
                 <Card className="mb-8 bg-secondary/30">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between gap-2">
                           <div className="flex items-center gap-2">
                             <Bot className="text-primary"/> AI Assistant's Answer
                           </div>
                           <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground"
                                    onClick={handleReadAloud}
                                    disabled={audioState === 'loading'}
                                >
                                    {getAudioIcon()}
                                    <span className="sr-only">Read aloud</span>
                                </Button>
                                {audioState !== 'idle' && (
                                   <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground"
                                    onClick={stopPlayback}
                                  >
                                    <StopCircle className="h-4 w-4" />
                                     <span className="sr-only">Stop</span>
                                  </Button>
                                )}
                           </div>
                        </CardTitle>
                        <CardDescription className="pt-2 text-base text-foreground/80">{answer}</CardDescription>
                    </CardHeader>
                </Card>
            )}

            {projects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => {
                    const iconData = ventureIcons.find(icon => icon.name === project.name);
                    const Icon = iconData ? iconData.icon : Users;
                    return (
                        <Card key={project.id} className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                            <div className="flex-grow p-6">
                                <div className="mb-4">
                                    <Icon className="w-10 h-10 text-primary transition-all duration-300 group-hover:text-accent" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-50 transition-colors duration-300 group-hover:text-primary-gradient">{project.name}</h3>
                                <p className="mt-2 text-sm text-slate-400">{project.description}</p>
                            </div>
                            <div className="p-6 pt-0 mt-auto">
                                <div className={cn("flex w-full gap-2", project.hasDemo ? "flex-col sm:flex-row" : "flex-col")}>
                                    <Button className="w-full" onClick={() => openModal(project)}>
                                        <Bot className="mr-2 h-4 w-4" />
                                        {t('aiDeepDive')}
                                    </Button>
                                    {project.hasDemo && (
                                        <Button variant="outline" asChild className="w-full">
                                            <a href={project.href} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="mr-2 h-4 w-4" /> {t('demo')}
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
                </div>
            )}
        </div>
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

function SignUpCta() {
    const { t } = useLocale();
    return (
        <motion.section 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full py-16 md:py-24 pointer-events-auto"
        >
            <Separator className="my-8 bg-border/20" />
            <div className="container relative max-w-4xl mx-auto text-center bg-secondary/30 backdrop-blur-sm border border-border/20 rounded-2xl p-8 md:p-12 overflow-hidden shadow-[0_0_50px_-15px_rgba(var(--primary),0.3)]">
                {/* Glowing ambient background inside CTA */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="relative z-10">
                    <motion.div 
                        initial={{ rotate: -15, scale: 0.8 }}
                        whileInView={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                        className="inline-block"
                    >
                        <Sparkles className="w-12 h-12 text-primary mx-auto mb-6 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-primary-gradient">
                        {t('ctaTitle')}
                    </h2>
                    <p className="text-xl text-muted-foreground/90 max-w-3xl mx-auto mb-10 font-light">
                       {t('ctaDescription')}
                    </p>
                    <Button size="lg" asChild className="bg-primary-gradient text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:shadow-[0_0_40px_rgba(var(--primary),0.6)] hover:-translate-y-1 transition-all duration-300">
                        <Link href="/signup">{t('signUpNow')}</Link>
                    </Button>
                </div>
            </div>
        </motion.section>
    )
}

function FeaturedPlatforms() {
    return (
       <section className="relative w-full xl:w-[120%] 2xl:w-[140%] max-w-[1400px] py-24 md:py-32 mt-12 overflow-hidden pointer-events-auto">
           {/* Abstract Background Elements */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50 mix-blend-screen" />
           <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/20 blur-[150px] rounded-full pointer-events-none opacity-40 mix-blend-screen" />
           
           <div className="container relative z-10 px-4 md:px-6 mx-auto">
               <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, margin: "-100px" }}
                   transition={{ duration: 0.8, ease: "easeOut" }}
                   className="flex flex-col items-center justify-center space-y-6 text-center mb-16"
               >
                   <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4 backdrop-blur-sm shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                       <Sparkles className="mr-2 h-4 w-4" />
                       Next-Generation AI Platforms
                   </div>
                   <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-primary-gradient">
                       Featured Platforms
                   </h2>
                   <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed font-light">
                       Explore our flagship AI-native applications redefining healthcare, fitness, vibe coding, and social media with cutting-edge intelligence.
                   </p>
               </motion.div>

               <div className="mx-auto grid max-w-6xl items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
                   
                   <motion.div
                       initial={{ opacity: 0, x: -30 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.6, delay: 0.1 }}
                   >
                       <Card className="relative flex flex-col h-full overflow-hidden bg-background/60 border-border/50 hover:border-primary/50 transition-all duration-500 group rounded-2xl shadow-lg hover:shadow-[0_0_40px_-10px_rgba(var(--primary),0.3)] backdrop-blur-xl">
                           {/* Hover Gradient Effect */}
                           <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                           
                           <CardHeader className="relative z-10 pb-4">
                               <div className="p-3 bg-primary/10 w-fit rounded-xl border border-primary/20 mb-4 shadow-[0_0_20px_rgba(var(--primary),0.2)] group-hover:scale-110 transition-transform duration-500">
                                   <Activity className="w-8 h-8 text-primary" />
                               </div>
                               <CardTitle className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">StrideIQ</CardTitle>
                               <CardDescription className="text-base text-muted-foreground leading-relaxed mt-3">
                                   A fitness and wellness app designed to help you track your running, walking, biking, hiking, mediation, intermittent fasting and journaling—all in one place.
                               </CardDescription>
                           </CardHeader>
                           <div className="p-6 pt-auto mt-auto relative z-10">
                               <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-xl h-12 text-md font-semibold">
                                    <a href="https://StrideIQ.fit/" target="_blank" rel="noopener noreferrer">
                                        Visit StrideIQ <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100" />
                                    </a>
                               </Button>
                           </div>
                       </Card>
                   </motion.div>

                    <motion.div
                       initial={{ opacity: 0, x: 30 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.6, delay: 0.2 }}
                   >
                       <Card className="relative flex flex-col h-full overflow-hidden bg-background/60 border-border/50 hover:border-primary/50 transition-all duration-500 group rounded-2xl shadow-lg hover:shadow-[0_0_40px_-10px_rgba(var(--primary),0.3)] backdrop-blur-xl">
                           <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                           
                           <CardHeader className="relative z-10 pb-4">
                               <div className="p-3 bg-primary/10 w-fit rounded-xl border border-primary/20 mb-4 shadow-[0_0_20px_rgba(var(--primary),0.2)] group-hover:scale-110 transition-transform duration-500">
                                   <Stethoscope className="w-8 h-8 text-primary" />
                               </div>
                               <CardTitle className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">iCareOS</CardTitle>
                               <CardDescription className="text-base text-muted-foreground leading-relaxed mt-3">
                                   An AI-native clinical operating system that automates documentation, analyzes medical images, orchestrates patient intake, and optimizes billing.
                               </CardDescription>
                           </CardHeader>
                           <div className="p-6 pt-auto mt-auto relative z-10">
                               <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-xl h-12 text-md font-semibold">
                                    <a href="https://iCareOS.tech/" target="_blank" rel="noopener noreferrer">
                                        Visit iCareOS <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100" />
                                    </a>
                               </Button>
                           </div>
                       </Card>
                   </motion.div>

                   <motion.div
                        initial={{ opacity: 0, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)", y: 40 }}
                        whileInView={{ opacity: 1, clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)", y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                   >
                       <Card className="relative flex flex-col h-full overflow-hidden bg-background/60 border-border/50 hover:border-primary/50 transition-all duration-500 group rounded-2xl shadow-lg hover:shadow-[0_0_40px_-10px_rgba(var(--primary),0.3)] backdrop-blur-xl">
                           <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                           
                           <CardHeader className="relative z-10 pb-4">
                               <div className="p-3 bg-primary/10 w-fit rounded-xl border border-primary/20 mb-4 shadow-[0_0_20px_rgba(var(--primary),0.2)] group-hover:scale-110 transition-transform duration-500">
                                   <Users className="w-8 h-8 text-primary" />
                               </div>
                               <CardTitle className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">Famio</CardTitle>
                               <CardDescription className="text-base text-muted-foreground leading-relaxed mt-3">
                                   An AI-powered social media platform designed for meaningful connections and intelligent content discovery.
                               </CardDescription>
                           </CardHeader>
                           <div className="p-6 pt-auto mt-auto relative z-10">
                               <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-xl h-12 text-md font-semibold">
                                    <a href="https://Famio.us/" target="_blank" rel="noopener noreferrer">
                                        Visit Famio <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100" />
                                    </a>
                               </Button>
                           </div>
                       </Card>
                   </motion.div>

                   <motion.div
                        initial={{ opacity: 0, clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)", y: 40 }}
                        whileInView={{ opacity: 1, clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)", y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                   >
                       <Card className="relative flex flex-col h-full overflow-hidden bg-background/60 border-border/50 hover:border-primary/50 transition-all duration-500 group rounded-2xl shadow-lg hover:shadow-[0_0_40px_-10px_rgba(var(--primary),0.3)] backdrop-blur-xl">
                           <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                           
                           <CardHeader className="relative z-10 pb-4">
                               <div className="p-3 bg-primary/10 w-fit rounded-xl border border-primary/20 mb-4 shadow-[0_0_20px_rgba(var(--primary),0.2)] group-hover:scale-110 transition-transform duration-500">
                                   <Sparkles className="w-8 h-8 text-primary" />
                               </div>
                               <CardTitle className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">Evolvable</CardTitle>
                               <CardDescription className="text-base text-muted-foreground leading-relaxed mt-3">
                                   An AI-powered vibe coding platform that enables anyone to design, build, and launch production-ready applications using nothing but natural language prompts.
                               </CardDescription>
                           </CardHeader>
                           <div className="p-6 pt-auto mt-auto relative z-10">
                               <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-xl h-12 text-md font-semibold">
                                    <a href="https://eVolvable.us/" target="_blank" rel="noopener noreferrer">
                                        Visit Evolvable <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100" />
                                    </a>
                               </Button>
                           </div>
                       </Card>
                   </motion.div>

               </div>
           </div>
       </section>
    )
}


export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Venture[]>([]);
  const [answer, setAnswer] = useState<string | undefined>('');
  const [isSearching, startSearchTransition] = useTransition();
  const router = useRouter();
  const { t } = useLocale();
  const aiSuggestion = t('landingSearchPlaceholder');
  
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentQuery = query.trim();
    if (!currentQuery) {
        setProjects(allVentures);
        setSearchQuery('');
        setAnswer(undefined);
        return;
    }
    
    setSearchQuery(currentQuery);
    
    startSearchTransition(async () => {
      const result = await handleSearch(currentQuery);
      if (result.navPath) {
          router.push(result.navPath);
      } else {
          setProjects(result.projects);
          setAnswer(result.answer);
      }
    });
  };

  const handleResetSearch = () => {
    setQuery('');
    setSearchQuery('');
    setProjects([]);
    setAnswer(undefined);
  };

  return (
    <>
      <Hero />
      <div className="flex flex-col items-center justify-center -mt-24 text-center pb-12 relative z-30 pointer-events-none">
        
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="w-full max-w-4xl pointer-events-auto"
        >
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          onSubmit={handleSearchSubmit} 
          className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 mb-4 relative"
        >
          {/* Subtle glow behind the search bar */}
          <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full pointer-events-none -z-10" />
          
          <Input
            type="text"
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={aiSuggestion}
            className="bg-background/60 text-foreground backdrop-blur-xl border-primary/20 focus-visible:border-primary/50 h-14 text-lg rounded-xl shadow-[0_0_15px_rgba(var(--primary),0.05)] transition-all"
          />
          <Button type="submit" size="lg" className="bg-primary-gradient h-14 px-8 rounded-xl shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all" disabled={isSearching}>
            {isSearching ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
            {t('aiSearch')}
          </Button>
           <Button type="button" size="icon" variant="outline" className="h-14 w-14 rounded-xl border-primary/20 hover:border-primary/50 hover:bg-primary/10 transition-all shadow-[0_0_15px_rgba(var(--primary),0.05)]" onClick={handleResetSearch} disabled={isSearching}>
            <RefreshCw className="h-5 w-5" />
            <span className="sr-only">Refresh Search</span>
          </Button>
        </motion.form>
      </motion.div>
      <div className="w-full mt-16">
        <SearchResults projects={projects} searchQuery={searchQuery} isSearching={isSearching} answer={answer} />
      </div>

      {/* Showcase Video Section */}
      <motion.section 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full xl:w-[120%] 2xl:w-[140%] max-w-[1400px] mx-auto px-4 py-16 pointer-events-auto"
      >
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-primary/20 shadow-[0_0_50px_-15px_rgba(var(--primary),0.3)] bg-background/30 backdrop-blur-xl group">
              {/* Glowing ambient background inside video container */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10 pointer-events-none z-10" />
              
              <video 
                  src="/AgenticChance.mp4" 
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  autoPlay
                  muted
                  loop
                  playsInline
              />

              {/* Content Overlay - Shows for 5 seconds and fades out */}
              <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: [0, 1, 1, 0] }}
                  viewport={{ once: true }}
                  transition={{ 
                      times: [0, 0.05, 0.95, 1], 
                      duration: 5, 
                      ease: "easeInOut" 
                  }}
                  className="absolute inset-0 bg-black/50 z-20 flex flex-col items-center justify-center text-center px-4"
              >
                  <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                      Witness the Agentic Future
                  </h3>
                  <p className="text-white/90 text-lg md:text-xl max-w-xl font-light drop-shadow-[0_1px_5px_rgba(0,0,0,0.8)] leading-relaxed">
                      Our AI-native platforms collaborate, solve problems, and deliver results in real-time.
                  </p>
              </motion.div>
          </div>
      </motion.section>

      <FeaturedPlatforms />
      <Ticker />
      <SignUpCta />
      </div>
    </>
  );
}
