
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import WhatIDo from '@/components/WhatIDo';
import Contact from '@/components/Contact';
import Hero from '@/components/Hero';
import ProjectShowcase from '@/components/ProjectShowcase';
import Skills from '@/components/Skills';
import Transcriber from '@/components/Transcriber';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';
import AISearch from '@/components/AISearch';
import type { Venture } from '@/lib/types';
import { ventures } from '@/lib/data';
import { handleSemanticSearch } from '@/app/actions';

const allVentures: Venture[] = ventures.map((v, i) => ({...v, id: `venture-${i}`}));

export default function Home() {
  const [projects, setProjects] = useState<Venture[]>(allVentures);
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  // This effect will run when the page loads with a query parameter.
  useEffect(() => {
    if (query) {
      handleSemanticSearch(query).then(setProjects);
    } else {
      setProjects(allVentures);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="flex flex-col">
      <Hero />
      <WhatIDo />
      <div className="max-w-xl mx-auto my-12 w-full">
         <AISearch onSearch={setProjects} />
      </div>
      <ProjectShowcase projects={projects} searchQuery={query} />
      <Skills />
      <Transcriber />
      <Contact />
      <FloatingAIAssistant />
    </div>
  );
}
