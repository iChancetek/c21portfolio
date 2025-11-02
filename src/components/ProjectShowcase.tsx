'use client';

import { useState, useTransition } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, Search, Wand2 } from 'lucide-react';
import type { Venture } from '@/lib/types';
import ProjectCard from './ProjectCard';
import { ventures, ventureIcons } from '@/lib/data';
import { handleSemanticSearch } from '@/app/actions';

const allVentures: Venture[] = ventures.map((v, i) => ({...v, id: `venture-${i}`}));

export default function ProjectShowcase() {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedProjects, setDisplayedProjects] = useState<Venture[]>(allVentures);
  const [isSearching, setIsSearching] = useState(false);
  
  const onSearch = (formData: FormData) => {
    const query = formData.get('query') as string;
    setSearchQuery(query);

    if (!query) {
      setDisplayedProjects(allVentures);
      return;
    }

    startTransition(async () => {
      setIsSearching(true);
      const searchResults = await handleSemanticSearch(query);
      setDisplayedProjects(searchResults);
      setIsSearching(false);
    });
  };

  return (
    <section id="projects" className="py-16 md:py-24 lg:py-32 relative bg-background overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary to-transparent"></div>
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-gradient">Ventures & Innovations</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            A showcase of AI-driven companies and products I've built. Use the semantic search below to find projects based on your interests.
          </p>
        </div>
        
        <form action={onSearch} className="max-w-xl mx-auto mb-12 flex gap-2">
          <Input 
            type="text" 
            name="query"
            placeholder="e.g., 'Healthcare automation' or 'Fintech'" 
            className="flex-grow bg-black/20 backdrop-blur-sm border-white/10"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
          <Button type="submit" disabled={isPending || isSearching}>
            {isPending || isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            AI Search
          </Button>
        </form>

        {(isPending || isSearching) && (
            <div className="flex justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )}

        {!(isPending || isSearching) && (
            <>
                {displayedProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedProjects.map((project, index) => {
                        const iconData = ventureIcons.find(icon => icon.name === project.name);
                        const Icon = iconData ? iconData.icon : Users;
                        return <ProjectCard key={project.id} project={project} Icon={Icon} />
                    })}
                    </div>
                ) : (
                    <div className="text-center col-span-full mt-8 text-muted-foreground">
                        <p>No projects found for "{searchQuery}". Try a different search.</p>
                    </div>
                )}
            </>
        )}
      </div>
    </section>
  );
}
