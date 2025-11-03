

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, ExternalLink, Bot, Sparkles } from 'lucide-react';
import { handleSearch } from '@/app/actions';
import type { Venture } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { ventureIcons, navLinks } from '@/lib/data';
import { Users } from 'lucide-react';
import CaseStudyModal from '@/components/CaseStudyModal';
import { ventures } from '@/lib/data';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const allVentures: Venture[] = ventures.map((v, i) => ({...v, id: `venture-${i}`}));

// New component dedicated to displaying search results on the landing page
function SearchResults({ projects, searchQuery }: { projects: Venture[]; searchQuery: string; }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Venture | null>(null);

    const openModal = (project: Venture) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    if (searchQuery && projects.length === 0) {
        return (
            <div className="text-center col-span-full mt-8 text-muted-foreground">
                <p>No projects found for "{searchQuery}". Try a different search.</p>
            </div>
        );
    }
    
    if (projects.length === 0 && !searchQuery) { // Don't show anything if no search has been made
        return null;
    }
    
    if (projects.length === 0 && searchQuery) {
        return (
             <div className="text-center col-span-full mt-8 text-muted-foreground">
                <p>No projects found for "{searchQuery}". Try a different search.</p>
            </div>
        )
    }


  return (
    <>
        <div id="results" className="w-full relative z-10 mt-12">
             <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-gradient">Search Results</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Showing results for: <span className="text-foreground font-semibold">"{searchQuery}"</span>
                </p>
            </div>

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
                            <div className="flex w-full flex-col sm:flex-row gap-2">
                                <Button className="w-full" onClick={() => openModal(project)}>
                                    <Bot className="mr-2 h-4 w-4" />
                                    AI Deep-Dive
                                </Button>
                                <Button variant="outline" asChild className="w-full">
                                    <a href={project.href} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4" /> Demo
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </Card>
                );
            })}
            </div>
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
    return (
        <section className="w-full py-16 md:py-24">
            <Separator className="my-8 bg-border/20" />
            <div className="container max-w-4xl mx-auto text-center bg-secondary/30 backdrop-blur-sm border border-border/20 rounded-xl p-8 md:p-12">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-primary-gradient">
                    Unlock Your Healthier Future
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                   Sign up for an account to access Healthy Living — your gateway to guided meditation sessions, personalized wellness support with iChancellor – your AI wellness assistant, and exclusive access to the Tech Insight Generator for innovative perspectives on technology and well-being.
                </p>
                <Button size="lg" asChild className="bg-primary-gradient">
                    <Link href="/signup">Sign Up Now</Link>
                </Button>
            </div>
        </section>
    )
}


export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Venture[]>([]);
  const [isSearching, startSearchTransition] = useTransition();
  const [aiSuggestion, setAiSuggestion] = useState("what projects are on ChancellorMinus.com");
  const router = useRouter();
  
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentQuery = query.trim();
    if (!currentQuery) {
        setProjects(allVentures);
        setSearchQuery('');
        return;
    }
    
    setSearchQuery(currentQuery);
    
    startSearchTransition(async () => {
      const result = await handleSearch(currentQuery);
      if (result.navPath) {
          router.push(result.navPath);
      } else {
          setProjects(result.projects);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4">
          <span className="text-primary-gradient">The Future of Development — Today</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-10">
          Chancellor Minus | AI Engineer & Full-Stack Developer Portfolio
        </p>

        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 mb-4">
          <Input
            type="text"
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={aiSuggestion}
            className="bg-black/20 backdrop-blur-sm border-white/10 h-12 text-base"
          />
          <Button type="submit" size="lg" className="bg-primary-gradient h-12" disabled={isSearching}>
            {isSearching ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
            AI Search
          </Button>
        </form>
      </motion.div>
      <div className="w-full mt-16">
        <SearchResults projects={projects} searchQuery={searchQuery} />
      </div>
      <SignUpCta />
    </div>
  );
}
