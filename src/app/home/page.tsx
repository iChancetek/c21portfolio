
'use client';

import { useState, useEffect, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import WhatIDo from '@/components/WhatIDo';
import Contact from '@/components/Contact';
import Hero from '@/components/Hero';
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

function HomePageContent() {
  const [projects, setProjects] = useState<Venture[]>(allVentures);
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [currentQuery, setCurrentQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  const onSearch = (query: string) => {
    startTransition(async () => {
        const searchResults = await handleSemanticSearch(query);
        setProjects(searchResults);
    });
  }
  
  useEffect(() => {
    if (initialQuery) {
      onSearch(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  return (
    <div className="flex flex-col">
      <Hero />
      <WhatIDo />
      <div className="max-w-xl mx-auto my-12 w-full">
         <form 
            onSubmit={(e) => {
              e.preventDefault();
              onSearch(currentQuery);
            }} 
            className="w-full flex gap-2 items-center"
          >
            <Input
              type="text"
              name="query"
              placeholder="e.g., 'Healthcare automation' or 'list all'"
              className="flex-grow bg-black/20 backdrop-blur-sm border-white/10 h-12 text-base"
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
            />
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-5 w-5" />
              )}
              AI Search
            </Button>
          </form>
      </div>
      <ProjectShowcase projects={projects} searchQuery={currentQuery} />
      <Skills />
      <Transcriber />
      <Contact />
      <FloatingAIAssistant />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  )
}
