'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { generateAffirmation } from '@/ai/flows/affirmation-generator';

export default function AffirmationsPage() {
  const [affirmation, setAffirmation] = useState(
    'Click the button to generate an affirmation and start your journey.'
  );
  const [isGenerating, startGenerationTransition] = useTransition();

  const handleGenerate = () => {
    startGenerationTransition(async () => {
      try {
        const result = await generateAffirmation();
        setAffirmation(result.affirmation);
      } catch (error) {
        console.error('Failed to generate affirmation:', error);
        setAffirmation('There was an error generating an affirmation. Please try again.');
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center py-12">
      <Sparkles className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4 text-primary-gradient">
        Become Your Best Self
      </h1>
      <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10">
        Generate a positive affirmation to inspire and motivate you on your journey of personal growth.
      </p>

      <Card className="w-full max-w-2xl min-h-[150px] flex flex-col items-center justify-center p-8 mb-8 bg-black/20 backdrop-blur-sm border-white/10">
        <CardContent className="p-0 flex-grow flex items-center justify-center">
          {isGenerating ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <p className="text-2xl font-medium text-center">
              &ldquo;{affirmation}&rdquo;
            </p>
          )}
        </CardContent>
      </Card>

      <Button size="lg" onClick={handleGenerate} disabled={isGenerating} className="bg-primary-gradient">
        {isGenerating ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-5 w-5" />
        )}
        Generate New Affirmation
      </Button>
    </div>
  );
}
