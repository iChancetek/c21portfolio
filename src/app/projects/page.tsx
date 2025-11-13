
'use client';

import Contact from '@/components/Contact';
import Skills from '@/components/Skills';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';
import ProjectShowcase from '@/components/ProjectShowcase';
import { allVentures } from '@/lib/data';
import { Suspense } from 'react';

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

    