'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Wand2, Volume2, Play, Pause } from 'lucide-react';
import { generateAffirmation } from '@/ai/flows/affirmation-generator';
import { textToSpeech } from '@/ai/flows/openai-tts-flow';

type AudioState = 'idle' | 'loading' | 'playing' | 'paused';

export default function AffirmationsPage() {
  const [affirmation, setAffirmation] = useState(
    'Click the button to generate an affirmation and start your journey.'
  );
  const [isGenerating, startGenerationTransition] = useTransition();
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // When a new affirmation is generated, reset the audio state.
  useEffect(() => {
    setAudioState('idle');
    setAudioSrc(null);
    if(audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
  }, [affirmation]);

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

  const handleReadAloud = async () => {
    if (!affirmation || affirmation.includes('Click the button')) return;
    
    if (audioState === 'playing') {
      audioRef.current?.pause();
      setAudioState('paused');
      return;
    }
    
    if (audioState === 'paused' && audioRef.current) {
      audioRef.current.play();
      setAudioState('playing');
      return;
    }
    
    if (audioState === 'idle') {
      setAudioState('loading');
      try {
        const { audioDataUri } = await textToSpeech({ text: affirmation });
        setAudioSrc(audioDataUri);
        // The play action will be triggered by the useEffect below
      } catch (error) {
        console.error('Failed to generate speech:', error);
        setAudioState('idle');
      }
    }
  };

  // Effect to play audio once the source is set
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.play();
      setAudioState('playing');
    }
  }, [audioSrc]);
  
  // Effect to handle when audio finishes playing
  useEffect(() => {
    const audioElement = audioRef.current;
    const onEnded = () => setAudioState('idle');
    audioElement?.addEventListener('ended', onEnded);
    return () => {
      audioElement?.removeEventListener('ended', onEnded);
    };
  }, []);

  const getReadAloudIcon = () => {
    switch (audioState) {
        case 'loading':
            return <Loader2 className="mr-2 h-5 w-5 animate-spin" />;
        case 'playing':
            return <Pause className="mr-2 h-5 w-5" />;
        case 'paused':
            return <Play className="mr-2 h-5 w-5" />;
        default:
            return <Volume2 className="mr-2 h-5 w-5" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center py-12">
      <audio ref={audioRef} />
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

      <div className="flex gap-4">
        <Button size="lg" onClick={handleGenerate} disabled={isGenerating} className="bg-primary-gradient">
            {isGenerating ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
            <Wand2 className="mr-2 h-5 w-5" />
            )}
            Generate New Affirmation
        </Button>
        <Button size="lg" onClick={handleReadAloud} disabled={isGenerating || audioState === 'loading'} variant="outline">
            {getReadAloudIcon()}
            {audioState === 'playing' ? 'Pause' : (audioState === 'paused' ? 'Resume' : 'Read Aloud')}
        </Button>
      </div>
    </div>
  );
}
