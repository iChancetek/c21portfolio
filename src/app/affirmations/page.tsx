'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Wand2, Volume2, Play, Pause, Bot, Globe } from 'lucide-react';
import { generateAffirmation } from '@/ai/flows/affirmation-generator';
import { textToSpeech } from '@/ai/flows/openai-tts-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocale } from '@/hooks/useLocale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/firebase';

type AudioState = 'idle' | 'loading' | 'playing' | 'paused';
type ViewState = 'affirmation' | 'deepDive';

export default function AffirmationsPage() {
  const { t, locale, setLocale, locales } = useLocale();
  const { user } = useUser();
  const [greeting, setGreeting] = useState('');
  const [affirmation, setAffirmation] = useState('');
  const [deepDiveContent, setDeepDiveContent] = useState('');
  const [viewState, setViewState] = useState<ViewState>('affirmation');
  const [isGenerating, startGenerationTransition] = useTransition();
  const [isDeeperDiveLoading, startDeeperDiveTransition] = useTransition();
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        let timeOfDay;
        if (hour >= 5 && hour < 12) {
            timeOfDay = 'morning';
        } else if (hour >= 12 && hour < 18) {
            timeOfDay = 'afternoon';
        } else {
            timeOfDay = 'evening';
        }

        const userName = user?.displayName?.split(' ')[0] || t('myFriend');
        const greetingText = t(`greeting_${timeOfDay}`, { name: userName });
        const fullGreeting = `${greetingText} ${t('affirmationPrompt')}`;
        
        setGreeting(fullGreeting);
        
        // Speak the greeting
        handleSpeak(fullGreeting);
    };

    // We only want to run this once on mount, or when the user/locale changes.
    // The user object might take a moment to load.
    getGreeting();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, locale, t]);


  const handleSpeak = async (text: string) => {
    if (!text || text === t('affirmationsInitialText')) return;
    
    setAudioState('loading');
    try {
        const { audioDataUri } = await textToSpeech({ text, locale });
        setAudioSrc(audioDataUri);
    } catch (error) {
        console.error('Failed to generate speech:', error);
        setAudioState('idle');
    }
  };


  // When a new affirmation is generated, reset the audio and deep dive state.
  useEffect(() => {
    setAudioState('idle');
    setAudioSrc(null);
    setDeepDiveContent('');
    setViewState('affirmation');
    if(audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
  }, [affirmation]);
  
  // When locale changes, regenerate initial text
  useEffect(() => {
    setAffirmation(t('affirmationsInitialText'));
  }, [locale, t]);

  const handleGenerate = () => {
    startGenerationTransition(async () => {
      try {
        const result = await generateAffirmation({ locale });
        setAffirmation(result.affirmation);
      } catch (error) {
        console.error('Failed to generate affirmation:', error);
        setAffirmation(t('affirmationError'));
      }
    });
  };

  const handleDeeperDive = () => {
    if (viewState === 'deepDive') {
      setViewState('affirmation');
      return;
    }

    startDeeperDiveTransition(async () => {
        const result = await generateAffirmation({ affirmation, isDeeperDive: true, locale });
        setDeepDiveContent(result.affirmation);
        setViewState('deepDive');
    });
  };

  const handleReadAloud = async () => {
    const textToRead = viewState === 'deepDive' ? deepDiveContent : affirmation;
    if (!textToRead || textToRead.includes('Click the button')) return;

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
            // Get current date and time
            const now = new Date();
            const dateTimeString = now.toLocaleString(locale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            });

            // Extract only the text content from the affirmation/deep dive (which might contain HTML)
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = textToRead;
            const textContent = tempDiv.textContent || tempDiv.innerText || "";
            
            // Prepend the date and time to the text that will be spoken
            const textForSpeech = `${dateTimeString}. ${textContent}`;

            const { audioDataUri } = await textToSpeech({ text: textForSpeech, locale });
            setAudioSrc(audioDataUri);
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
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed, user interaction might be required.", err);
        setAudioState('idle');
      });
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

  const anyLoading = isGenerating || isDeeperDiveLoading;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center py-12">
      <audio ref={audioRef} />
      <Sparkles className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4 text-primary-gradient">
        {t('affirmationsTitle')}
      </h1>
      <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-4">
        {t('affirmationsDescription')}
      </p>

       {greeting && (
        <p className="max-w-2xl mx-auto text-md text-muted-foreground mb-10 italic">
          &ldquo;{greeting}&rdquo;
        </p>
      )}

      <Card className="w-full max-w-2xl min-h-[250px] flex flex-col p-8 bg-black/20 backdrop-blur-sm border-white/10">
        <CardContent className="p-0 flex-grow flex items-center justify-center">
          {isGenerating ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : viewState === 'affirmation' && affirmation ? (
            <p className="text-2xl font-medium text-center">
              &ldquo;{affirmation}&rdquo;
            </p>
          ) : isDeeperDiveLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : deepDiveContent ? (
             <ScrollArea className="h-[200px] sm:h-[300px] w-full pr-4 text-left">
                <div
                    className="prose prose-sm sm:prose-base max-w-none prose-invert"
                    dangerouslySetInnerHTML={{ __html: deepDiveContent }}
                />
              </ScrollArea>
          ) : (
             <p className="text-2xl font-medium text-center">
                &ldquo;{t('affirmationsInitialText')}&rdquo;
            </p>
          )}
        </CardContent>
      </Card>
      
       <div className="mt-6 flex items-center gap-2">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <Select value={locale} onValueChange={(value) => setLocale(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-72">
                {Object.entries(locales).map(([code, name]) => (
                  <SelectItem key={code} value={code}>{name}</SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Button size="lg" onClick={handleGenerate} disabled={anyLoading} className="bg-primary-gradient">
            {isGenerating ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
            <Wand2 className="mr-2 h-5 w-5" />
            )}
            {t('newAffirmation')}
        </Button>
        <Button size="lg" onClick={handleReadAloud} disabled={anyLoading || audioState === 'loading'} variant="outline">
            {getReadAloudIcon()}
            {audioState === 'playing' ? t('pause') : (audioState === 'paused' ? t('resume') : t('readAloud'))}
        </Button>
         <Button size="lg" onClick={handleDeeperDive} disabled={anyLoading} variant="outline">
            {isDeeperDiveLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Bot className="mr-2 h-5 w-5" />}
            {viewState === 'deepDive' ? t('showAffirmation') : t('deeperDive')}
        </Button>
      </div>
    </div>
  );
}
