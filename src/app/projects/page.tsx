'use client';

import Contact from '@/components/Contact';
import Skills from '@/components/Skills';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';
import ProjectShowcase from '@/components/ProjectShowcase';
import { ventures } from '@/lib/data';
import type { Venture } from '@/lib/types';
import { Suspense } from 'react';

const allVentures: Venture[] = ventures.map((v, i) => ({...v, id: `venture-${i}`}));

function ProjectsPageContent() {
  return (
    <div className="flex flex-col">
      <ProjectShowcase projects={allVentures} />
      <Skills />
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
