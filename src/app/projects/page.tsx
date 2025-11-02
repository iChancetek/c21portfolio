
'use client';

import { useState, useEffect, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import WhatIDo from '@/components/WhatIDo';
import Contact from '@/components/Contact';
import ProjectShowcase from '@/components/ProjectShowcase';
import Skills from '@/components/Skills';
import Transcriber from '@/components/Transcriber';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';
import type { Venture } from '@/lib/types';
import { ventures } from '@/lib/data';
import { handleSemanticSearch } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';

const allVentures: Venture[] = ventures.map((v, i) => ({...v, id: `venture-${i}`}));

function ProjectsPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [projects, setProjects] = useState<Venture[]>(allVentures);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    onSearch(initialQuery);
  }, [initialQuery]);

  const onSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
        setProjects(allVentures);
        return;
    }
    startTransition(async () => {
        const searchResults = await handleSemanticSearch(searchQuery);
        setProjects(searchResults);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="flex flex-col">
      <div className="container py-8">
        <form onSubmit={handleSearchSubmit} className="w-full max-w-3xl mx-auto flex gap-2 items-center mb-12">
            <Input
                type="text"
                name="query"
                placeholder="e.g., 'Healthcare automation' or 'list all'"
                className="flex-grow bg-black/20 backdrop-blur-sm border-white/10 h-12 text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isPending}
            />
            <Button type="submit" size="lg" disabled={isPending} className="bg-primary-gradient">
                {isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                <Wand2 className="mr-2 h-5 w-5" />
                )}
                AI Search
            </Button>
        </form>
      </div>

      <WhatIDo />
      <ProjectShowcase projects={projects} searchQuery={query} />
      <Skills />
      <Transcriber />
      <Contact />
      <FloatingAIAssistant />
    </div>
  );
}

export default function ProjectsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProjectsPageContent />
        </Suspense>
    )
}
