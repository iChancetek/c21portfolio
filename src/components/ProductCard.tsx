
'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, Bot, type LucideIcon } from 'lucide-react';
import type { Venture } from '@/lib/types';
import CaseStudyModal from './CaseStudyModal';
import { cn } from '@/lib/utils';
import SocialEngagement from './SocialEngagement';

interface ProductCardProps {
  product: Venture;
  Icon: LucideIcon;
}

export default function ProductCard({ product, Icon }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-white/10 bg-background/60 backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
        <div className="flex-grow p-5">
          <div className="mb-3 p-2.5 bg-primary/10 w-fit rounded-xl border border-primary/20 group-hover:scale-105 transition-transform duration-300">
            <Icon className="w-6 h-6 text-primary transition-all duration-300 group-hover:text-accent" />
          </div>
          <h3 className="text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary-gradient">{product.name}</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">{product.description}</p>
        </div>
        <div className="p-5 pt-0 mt-auto">
            <div className={cn("flex w-full gap-2", product.hasDemo ? "flex-col sm:flex-row" : "flex-col")}>
                <Button size="sm" className="w-full text-xs h-9 rounded-xl font-semibold" onClick={() => setIsModalOpen(true)}>
                    <Bot className="mr-1.5 h-3.5 w-3.5" />
                    AI Deep-Dive
                </Button>
                {product.hasDemo && (
                    <Button size="sm" variant="outline" asChild className="w-full text-xs h-9 rounded-xl font-semibold">
                        <a href={product.href} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Demo
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
            productId={product.id}
            productTitle={product.name}
        />
      )}
    </>
  );
}
