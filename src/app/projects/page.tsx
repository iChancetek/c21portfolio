
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
