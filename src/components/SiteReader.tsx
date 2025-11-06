'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Play, Pause, StopCircle, Loader2 } from 'lucide-react';
import { textToSpeech } from '@/ai/flows/openai-tts-flow';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/hooks/useLocale';
import { AnimatePresence, motion } from 'framer-motion';

type AudioState = 'idle' | 'loading' | 'playing' | 'paused';

export default function SiteReader() {
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { t, locale } = useLocale();

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioState('idle');
    setAudioSrc(null);
  }, []);
  
  const handlePlay = async () => {
     if (audioState === 'paused' && audioRef.current) {
      audioRef.current.play();
      setAudioState('playing');
      return;
    }

    if (audioState === 'idle') {
      const mainContent = document.getElementById('main-content');
      if (!mainContent) {
        toast({ title: "Could not find main content to read.", variant: 'destructive'});
        return;
      }

      // Exclude interactive elements and scripts from being read
      const contentClone = mainContent.cloneNode(true) as HTMLElement;
      contentClone.querySelectorAll('button, a, input, script, style, noscript, [aria-hidden="true"]').forEach(el => el.remove());
      
      const textToRead = contentClone.textContent?.trim().replace(/\s+/g, ' ');

      if (!textToRead) {
        toast({ title: "No readable content found on the page.", variant: 'destructive'});
        return;
      }

      setAudioState('loading');
      try {
        const { audioDataUri } = await textToSpeech({ text: textToRead, locale });
        setAudioSrc(audioDataUri);
      } catch (error) {
        toast({ title: t('audioFailed'), variant: 'destructive' });
        setAudioState('idle');
      }
    }
  };

  const handlePause = () => {
    if (audioState === 'playing' && audioRef.current) {
      audioRef.current.pause();
      setAudioState('paused');
    }
  };

  // Effect to play audio when source is ready
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.play().then(() => {
        setAudioState('playing');
      }).catch(err => {
        console.error("Audio playback failed:", err);
        // This can happen if user hasn't interacted with the page yet.
        // We can toast a message to inform them.
        toast({
          title: "Playback Error",
          description: "Could not play audio automatically. Please click play again.",
          variant: "destructive"
        });
        stopPlayback();
      });
    }
  }, [audioSrc, stopPlayback, toast]);
  
  // Effect to handle audio finishing
  useEffect(() => {
    const audioElement = audioRef.current;
    const onEnded = () => setAudioState('idle');
    audioElement?.addEventListener('ended', onEnded);
    return () => {
      audioElement?.removeEventListener('ended', onEnded);
    };
  }, []);

  const renderButton = () => {
    switch (audioState) {
      case 'loading':
        return <Loader2 className="h-6 w-6 animate-spin" />;
      case 'playing':
        return <Pause className="h-6 w-6" onClick={handlePause} />;
      case 'paused':
      case 'idle':
      default:
        return <Play className="h-6 w-6" onClick={handlePlay} />;
    }
  };

  return (
     <>
      <audio ref={audioRef} />
      <AnimatePresence>
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-2"
        >
          <Button
            size="icon"
            className="rounded-full w-14 h-14 bg-primary-gradient shadow-2xl shadow-primary/30"
            disabled={audioState === 'loading'}
          >
            {renderButton()}
            <span className="sr-only">Read page content</span>
          </Button>
          {audioState !== 'idle' && (
             <Button
                size="icon"
                variant="destructive"
                className="rounded-full w-14 h-14"
                onClick={stopPlayback}
             >
                <StopCircle className="h-6 w-6" />
                <span className="sr-only">Stop reading</span>
            </Button>
          )}
        </motion.div>
       </AnimatePresence>
     </>
  );
}
