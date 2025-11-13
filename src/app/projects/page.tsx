
'use client';

import Contact from '@/components/Contact';
import Skills from '@/components/Skills';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';
import ProjectShowcase from '@/components/ProjectShowcase';
import { allVentures } from '@/lib/data';

export default function ProjectsPage() {
  return (
    <div className="flex flex-col">
      <ProjectShowcase projects={allVentures} />
      <Skills />
      <Contact />
      <FloatingAIAssistant />
    </div>
  );
}
