'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ExternalLink, GitBranch, Bot } from 'lucide-react';
import type { Venture } from '@/lib/types';
import CaseStudyModal from './CaseStudyModal';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface ProjectCardProps {
  project: Venture;
}

const getPlaceholderImage = (id: string) => {
    // A simple hash function to get a somewhat unique image per venture
    const imageId = `proj-${(id.charCodeAt(0) % 6) + 1}`;
    const image = PlaceHolderImages.find(p => p.id === imageId);
    if (!image) {
        return { src: 'https://picsum.photos/seed/placeholder/600/400', alt: 'Placeholder', hint: 'placeholder' };
    }
    return { src: image.imageUrl, alt: image.description, hint: image.imageHint };
}


export default function ProjectCard({ project }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const image = getPlaceholderImage(project.id);

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
        <CardHeader>
          <div className="aspect-[3/2] relative overflow-hidden rounded-t-lg -mt-6 -mx-6 mb-4">
             <Image 
                src={image.src} 
                alt={image.alt}
                data-ai-hint={image.hint}
                fill
                className="object-cover" 
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <CardTitle className="text-primary-gradient">{project.name}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2">
            {/* Ventures don't have tech stack, we can add this later */}
          </div>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
            <Button className="w-full bg-primary-gradient" onClick={() => setIsModalOpen(true)} disabled>
                <Bot className="mr-2 h-4 w-4" />
                Deep-Dive
            </Button>
            <div className="flex w-full sm:w-auto gap-2">
                <Button variant="outline" asChild className="flex-1" disabled>
                    <a href={"#"} target="_blank" rel="noopener noreferrer">
                        <GitBranch className="mr-2 h-4 w-4" /> GitHub
                    </a>
                </Button>
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
