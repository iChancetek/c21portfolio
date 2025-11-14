
'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, Bot, type LucideIcon } from 'lucide-react';
import type { Venture } from '@/lib/types';
import CaseStudyModal from './CaseStudyModal';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Venture;
  Icon: LucideIcon;
}

export default function ProjectCard({ project, Icon }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
        <div className="flex-grow p-6">
          <div className="mb-4">
            <Icon className="w-10 h-10 text-primary transition-all duration-300 group-hover:text-accent" />
          </div>
          <h3 className="text-xl font-bold text-slate-50 transition-colors duration-300 group-hover:text-primary-gradient">{project.name}</h3>
          <p className="mt-2 text-sm text-slate-400">{project.description}</p>
        </div>
        <div className="p-6 pt-0 mt-auto">
            <div className={cn("flex w-full gap-2", project.hasDemo ? "flex-col sm:flex-row" : "flex-col")}>
                <Button className="w-full" onClick={() => setIsModalOpen(true)}>
                    <Bot className="mr-2 h-4 w-4" />
                    AI Deep-Dive
                </Button>
                {project.hasDemo && (
                    <Button variant="outline" asChild className="w-full">
                        <a href={project.href} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" /> Demo
                        </a>
                    </Button>
                )}
            </div>
        </div>
      </Card>
      {isModalOpen && (
        <CaseStudyModal 
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            projectId={project.id}
            projectTitle={project.name}
        />
      )}
    </>
  );
}
