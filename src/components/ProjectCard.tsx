'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, Bot } from 'lucide-react';
import type { Venture } from '@/lib/types';
import CaseStudyModal from './CaseStudyModal';

interface ProjectCardProps {
  project: Venture;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="text-primary-gradient">{project.name}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2">
            {/* Ventures don't have tech stack, we can add this later */}
          </div>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
            <Button className="w-full bg-primary-gradient" onClick={() => setIsModalOpen(true)}>
                <Bot className="mr-2 h-4 w-4" />
                Deep-Dive
            </Button>
            <div className="flex w-full sm:w-auto gap-2">
                <Button variant="outline" asChild className="flex-1">
                    <a href={project.href} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" /> Demo
                    </a>
                </Button>
            </div>
        </CardFooter>
      </Card>
      <CaseStudyModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        projectId={project.id}
        projectTitle={project.name}
      />
    </>
  );
}
