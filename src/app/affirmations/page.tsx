'use client';

import { useState, useTransition, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Wand2, Volume2, PlayCircle } from 'lucide-react';
import { generateAffirmation } from '@/ai/flows/affirmation-generator';
import { textToSpeech } from '@/ai/flows/speech-flow';

export default function AffirmationsPage() {
  const [affirmation, setAffirmation] = useState(
    'Click the button to generate an affirmation and start your journey.'
  );
  const [isGenerating, startGenerationTransition] = useTransition();
  const [isReading, startReadingTransition] = useTransition();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = () => {
    startGenerationTransition(async () => {
      setAudioUrl(null);
      try {
        const result = await generateAffirmation();
        setAffirmation(result.affirmation);
      } catch (error) {
        console.error('Failed to generate affirmation:', error);
        setAffirmation('There was an error generating an affirmation. Please try again.');
      }
    });
  };

  const handleReadAloud = () => {
    if (!affirmation || affirmation.startsWith('Click')) return;
    
    startReadingTransition(async () => {
        try {
            const result = await textToSpeech({ text: affirmation });
            setAudioUrl(result.audioDataUri);
            setTimeout(() => audioRef.current?.play(), 100);
        } catch (error) {
            console.error('Failed to generate speech:', error);
        }
    });
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center py-12">
      {audioUrl && <audio ref={audioRef} src={audioUrl} />}
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
         { !isGenerating && affirmation && !affirmation.startsWith('Click') && (
            <div className="mt-6">
                <Button variant="outline" onClick={handleReadAloud} disabled={isReading}>
                    {isReading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Volume2 className="mr-2 h-5 w-5" />}
                    Read Aloud
                </Button>
            </div>
         )}
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
