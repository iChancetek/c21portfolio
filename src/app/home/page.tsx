
'use client';

import { useState } from 'react';
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

const allVentures: Venture[] = ventures.map((v, i) => ({...v, id: `venture-${i}`}));

export default function Home() {
  const [projects, setProjects] = useState<Venture[]>(allVentures);
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

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
