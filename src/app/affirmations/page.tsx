'use client';

import { useState, useTransition, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Wand2, Volume2, Play, Pause, Bot, Globe, ThumbsUp, ThumbsDown, Star, LogIn } from 'lucide-react';
import { generateAffirmation } from '@/ai/flows/affirmation-generator';
import type { UserAffirmationInteraction } from '@/lib/types';
import { textToSpeech } from '@/ai/flows/openai-tts-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocale } from '@/hooks/useLocale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp, query, where, deleteDoc, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


type AudioState = 'idle' | 'loading' | 'playing' | 'paused';
type ViewState = 'affirmation' | 'deepDive';
type InteractionType = 'liked' | 'disliked' | 'favorite';

interface Affirmation {
  id: string; // A unique ID for the affirmation instance
  text: string;
}

export default function AffirmationsPage() {
  const { t, locale, setLocale, locales } = useLocale();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [greeting, setGreeting] = useState('');
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [deepDiveContent, setDeepDiveContent] = useState('');
  const [viewState, setViewState] = useState<ViewState>('affirmation');
  const [isGenerating, startGenerationTransition] = useTransition();
  const [isDeeperDiveLoading, startDeeperDiveTransition] = useTransition();
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [interactionLoading, setInteractionLoading] = useState<InteractionType | null>(null);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  // Fetch user's past interactions
  const interactionsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'userInteractions'), where('userId', '==', user.uid));
  }, [firestore, user]);
  const { data: pastInteractions } = useCollection<UserAffirmationInteraction & { id: string; timestamp: Timestamp }>(interactionsQuery);

  const isFavorite = (affirmationText: string) => {
    return !!pastInteractions?.some(i => i.affirmation === affirmationText && i.interaction === 'favorite');
  };
  
  const isLiked = (affirmationText: string) => {
      return !!pastInteractions?.some(i => i.affirmation === affirmationText && i.interaction === 'liked');
  };

  useEffect(() => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        let timeOfDay;
        if (hour >= 5 && hour < 12) {
            timeOfDay = 'morning';
        } else if (hour >= 12 && hour < 18) {
            timeOfDay = 'evening';
        } else {
            timeOfDay = 'evening';
        }

        const userName = user?.displayName?.split(' ')[0] || t('myFriend');
        const greetingText = t(`greeting_${timeOfDay}`, { name: userName });
        const fullGreeting = `${greetingText} ${t('affirmationPrompt')}`;
        
        setGreeting(fullGreeting);
        
        // Speak the greeting
        handleSpeak(fullGreeting, true);
    };

    if(user) {
       getGreeting();
    } else {
       setGreeting(t('affirmationsDescription'));
       setAffirmation(t('affirmationsInitialText'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, locale, t]);


  const handleSpeak = useCallback(async (text: string, isGreeting = false) => {
    if (!text || text === t('affirmationsInitialText')) return;
    
    // Don't auto-play greeting speech unless it's the first visit.
    const hasVisited = sessionStorage.getItem('hasVisitedAffirmations');
    if (isGreeting && hasVisited) return;
    if (isGreeting) sessionStorage.setItem('hasVisitedAffirmations', 'true');

    setAudioState('loading');
    try {
        const { audioDataUri } = await textToSpeech({ text, locale });
        setAudioSrc(audioDataUri);
    } catch (error) {
        console.error('Failed to generate speech:', error);
        setAudioState('idle');
    }
  }, [locale, t]);

  const setAffirmation = useCallback((text: string) => {
      setCurrentAffirmation({ id: new Date().toISOString(), text });
  }, []);

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
  }, [currentAffirmation]);
  
  // When locale changes, regenerate initial text
  useEffect(() => {
    setAffirmation(t('affirmationsInitialText'));
  }, [locale, t, setAffirmation]);

  const handleGenerate = () => {
    startGenerationTransition(async () => {
      try {
        const history = pastInteractions?.map(i => ({ 
            affirmation: i.affirmation, 
            interaction: i.interaction, 
            timestamp: i.timestamp.toDate().toISOString() 
        })) || [];
        const result = await generateAffirmation({ locale, history });
        setAffirmation(result.affirmation);
      } catch (error) {
        console.error('Failed to generate affirmation:', error);
        setAffirmation(t('affirmationError'));
      }
    });
  };

  const handleDeeperDive = () => {
    if (!currentAffirmation || !currentAffirmation.text) return;

    if (viewState === 'deepDive') {
      setViewState('affirmation');
      return;
    }

    startDeeperDiveTransition(async () => {
        const result = await generateAffirmation({ affirmation: currentAffirmation.text, isDeeperDive: true, locale });
        setDeepDiveContent(result.affirmation);
        setViewState('deepDive');
    });
  };

  const handleReadAloud = async () => {
    const textToRead = viewState === 'deepDive' ? deepDiveContent : currentAffirmation?.text;
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
            const now = new Date();
            const dateTimeString = now.toLocaleString(locale, {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: 'numeric', minute: 'numeric'
            });

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = textToRead;
            const textContent = tempDiv.textContent || tempDiv.innerText || "";
            
            const textForSpeech = `${dateTimeString}. ${textContent}`;

            const { audioDataUri } = await textToSpeech({ text: textForSpeech, locale });
            setAudioSrc(audioDataUri);
        } catch (error) {
            console.error('Failed to generate speech:', error);
            setAudioState('idle');
        }
    }
  };

  const handleInteraction = async (type: InteractionType) => {
    if (!user && type === 'favorite') {
        setIsLoginPromptOpen(true);
        return;
    }

    if (!user || !firestore || !currentAffirmation) {
        // For anonymous users, we can just show feedback visually without persisting.
        if (type === 'liked') toast({ title: "You liked this affirmation!" });
        if (type === 'disliked') toast({ title: "Thanks for the feedback." });
        return;
    }

    setInteractionLoading(type);
  
    try {
      if (type === 'favorite') {
        const existingFav = pastInteractions?.find(i => i.affirmation === currentAffirmation.text && i.interaction === 'favorite');
        if (existingFav) {
          await deleteDoc(doc(firestore, 'userInteractions', existingFav.id));
          toast({ title: t('removedFromFavorites') });
        } else {
          const interactionData: Omit<UserAffirmationInteraction, 'timestamp'> & { timestamp: any } = {
            userId: user.uid,
            affirmation: currentAffirmation.text,
            interaction: 'favorite',
            timestamp: serverTimestamp(),
          };
          await setDoc(doc(collection(firestore, 'userInteractions')), interactionData);
          toast({ title: "Added to Favorites" });
        }
      } else if (type === 'liked') {
        const existingLike = pastInteractions?.find(i => i.affirmation === currentAffirmation.text && i.interaction === 'liked');
        if (existingLike) {
          await deleteDoc(doc(firestore, 'userInteractions', existingLike.id));
        } else {
          const interactionData: Omit<UserAffirmationInteraction, 'timestamp'> & { timestamp: any } = {
            userId: user.uid,
            affirmation: currentAffirmation.text,
            interaction: 'liked',
            timestamp: serverTimestamp(),
          };
          await setDoc(doc(collection(firestore, 'userInteractions')), interactionData);
        }
      } else { // For 'dislike'
        const interactionData: Omit<UserAffirmationInteraction, 'timestamp'> & { timestamp: any } = {
          userId: user.uid,
          affirmation: currentAffirmation.text,
          interaction: type,
          timestamp: serverTimestamp(),
        };
        await setDoc(doc(collection(firestore, 'userInteractions')), interactionData);
      }
    } catch (err) {
      toast({ variant: 'destructive', title: "Interaction failed", description: "Could not save your feedback." });
    } finally {
      setInteractionLoading(null);
    }
  };

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
        case 'loading': return <Loader2 className="mr-2 h-5 w-5 animate-spin" />;
        case 'playing': return <Pause className="mr-2 h-5 w-5" />;
        case 'paused': return <Play className="mr-2 h-5 w-5" />;
        default: return <Volume2 className="mr-2 h-5 w-5" />;
    }
  };

  const anyLoading = isGenerating || isDeeperDiveLoading;
  const showInteractionButtons = currentAffirmation && !currentAffirmation.text.includes('Click the button');

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center py-12">
      <audio ref={audioRef} />
      <Sparkles className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4 text-primary-gradient">
        {t('affirmationsTitle')}
      </h1>
       {greeting && (
        <p className="max-w-2xl mx-auto text-md text-muted-foreground mb-10 italic">
          &ldquo;{greeting}&rdquo;
        </p>
      )}

      <Card className="w-full max-w-2xl min-h-[250px] flex flex-col p-8 bg-black/20 backdrop-blur-sm border-white/10">
        <CardContent className="p-0 flex-grow flex items-center justify-center">
          {isGenerating ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : viewState === 'affirmation' && currentAffirmation?.text ? (
            <p className="text-2xl font-medium text-center">
              &ldquo;{currentAffirmation.text}&rdquo;
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

      {showInteractionButtons && (
        <div className="mt-6 flex items-center justify-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleInteraction('liked')} disabled={!!interactionLoading}>
                {interactionLoading === 'liked' ? <Loader2 className="h-6 w-6 animate-spin"/> : <ThumbsUp className={cn("h-6 w-6 text-green-500", user && isLiked(currentAffirmation.text) && "fill-green-500")}/>}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleInteraction('disliked')} disabled={!!interactionLoading}>
                {interactionLoading === 'disliked' ? <Loader2 className="h-6 w-6 animate-spin"/> : <ThumbsDown className="h-6 w-6 text-red-500"/>}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleInteraction('favorite')} disabled={!!interactionLoading}>
                {interactionLoading === 'favorite' ? <Loader2 className="h-6 w-6 animate-spin"/> : <Star className={cn("h-6 w-6 text-yellow-500", user && isFavorite(currentAffirmation.text) && "fill-yellow-500")}/>}
            </Button>
        </div>
      )}
      
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
         <Button size="lg" onClick={handleDeeperDive} disabled={anyLoading || !currentAffirmation || currentAffirmation.text === t('affirmationsInitialText')} variant="outline">
            {isDeeperDiveLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Bot className="mr-2 h-5 w-5" />}
            {viewState === 'deepDive' ? t('showAffirmation') : t('deeperDive')}
        </Button>
      </div>

       <AlertDialog open={isLoginPromptOpen} onOpenChange={setIsLoginPromptOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{"Create an Account to Save Favorites"}</AlertDialogTitle>
            <AlertDialogDescription>
              {"Saving your favorite affirmations requires an account. Sign up or log in to continue."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{"Cancel"}</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/login')}>
              <LogIn className="mr-2 h-4 w-4" />
              {"Login or Sign Up"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
