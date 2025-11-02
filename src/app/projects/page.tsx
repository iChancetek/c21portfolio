'use client';

import WhatIDo from '@/components/WhatIDo';
import Contact from '@/components/Contact';
import Skills from '@/components/Skills';
import Transcriber from '@/components/Transcriber';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';
import ProjectShowcase from '@/components/ProjectShowcase';
import { ventures } from '@/lib/data';
import type { Venture } from '@/lib/types';
import { Suspense } from 'react';

const allVentures: Venture[] = ventures.map((v, i) => ({...v, id: `venture-${i}`}));

function ProjectsPageContent() {
  return (
    <div className="flex flex-col">
      <WhatIDo />
      <ProjectShowcase projects={allVentures} />
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
