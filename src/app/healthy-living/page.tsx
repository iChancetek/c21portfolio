'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, User, Loader2, BrainCircuit, Mic, Pause, Play, Settings, Timer, Volume2, VolumeX } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { iChancellor } from '@/ai/flows/ichancellor-flow';
import { transcribeAudio } from '@/ai/flows/whisper-flow';
import { textToSpeech } from '@/ai/flows/openai-tts-flow';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocale } from '@/hooks/useLocale';
import SettingsDialog from '@/components/SettingsDialog';


interface Message {
  role: 'user' | 'assistant';
  content: string;
  isUser?: boolean;
}

type Mode = 'chat' | 'meditation';

export default function HealthyLivingPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { locale, t } = useLocale();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isResponding, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  // Settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Meditation state
  const [mode, setMode] = useState<Mode>('chat');
  const [meditationDuration, setMeditationDuration] = useState(10 * 60); // 10 minutes in seconds
  const [timer, setTimer] = useState(meditationDuration);
  const [isMeditating, setIsMeditating] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  // Redirect if not logged in
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  // Set initial welcome message and speak it when the locale changes
  useEffect(() => {
    const welcomeMessage = t('iChancellorWelcome');
    const hasMessages = messages.length > 0;

    if (mode === 'chat' && (!hasMessages || (hasMessages && messages[0].content !== welcomeMessage))) {
        setMessages([{ role: 'assistant', content: welcomeMessage }]);
        if(mode === 'chat') {
            speak(welcomeMessage);
        }
    }
  }, [t, locale, mode]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  
  // Timer logic for meditation
  useEffect(() => {
    if (isMeditating) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsMeditating(false);
            playEndSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
        if(timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
    };
  }, [isMeditating]);

  const playEndSound = () => {
    // Simple browser-based sound to signify end of session
    const audioContext = new window.AudioContext();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    oscillator.connect(audioContext.destination);
    oscillator.start();
    setTimeout(() => oscillator.stop(), 500);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartMeditation = () => {
    setTimer(meditationDuration);
    setIsMeditating(true);
  };
  
  const stopMeditation = () => {
    setIsMeditating(false);
    setTimer(meditationDuration);
    stopPlayback();
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        stream.getTracks().forEach(track => track.stop());
        
        startTransition(async () => {
          try {
              const reader = new FileReader();
              reader.readAsDataURL(audioBlob);
              reader.onloadend = async () => {
                const base64Audio = reader.result as string;
                const { transcription } = await transcribeAudio({ audioDataUri: base64Audio });
                if (transcription) {
                  setInput(transcription);
                  await handleInteraction(transcription);
                }
              };
          } catch(e) {
             toast({ title: 'Transcription failed', variant: 'destructive' });
          }
        });
      };
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({ title: 'Listening...' });
    } catch (error) {
      toast({ title: 'Microphone access denied', variant: 'destructive' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({ title: 'Processing...' });
    }
  };

  const speak = async (text: string) => {
    if (isMuted || isSpeaking) return;
    stopPlayback(); // Stop any currently playing speech
    setIsSpeaking(true);
    try {
      const { audioDataUri } = await textToSpeech({ text, voice: 'alloy' });
      setAudioSrc(audioDataUri);
    } catch (error) {
      toast({ title: 'Could not generate audio.', variant: 'destructive' });
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (audioSrc && audioRef.current) {
        if (isMuted) {
          stopPlayback();
          return;
        }
        audioRef.current.src = audioSrc;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.error("AI speech playback failed:", err);
                setIsSpeaking(false);
            })
        }
        audioRef.current.onended = () => {
            setIsSpeaking(false);
            setAudioSrc(null); // Clear src after playing
        };
    }
  }, [audioSrc, isMuted]);
  
  const stopPlayback = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset audio
    }
    setIsSpeaking(false);
  };

  const handleInteraction = async (query: string) => {
    const trimmedQuery = query.trim().toLowerCase();
    
    if (!trimmedQuery) return;
    
    if (trimmedQuery === 'stop' || trimmedQuery === 'stop.') {
        stopPlayback();
        if (isMeditating) {
          stopMeditation();
        }
        const stopMessage: Message = { role: 'user', content: query, isUser: true };
        const confirmationMessage: Message = { role: 'assistant', content: t('stopCommandConfirmation') };
        setMessages((prev) => [...prev, stopMessage, confirmationMessage]);
        setInput('');
        speak(confirmationMessage.content); // Speak the confirmation
        return;
    }
    
    if (isResponding) return;

    const userMessage: Message = { role: 'user', content: query, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
        try {
            const history = messages.map(msg => ({ content: msg.content, role: msg.role, isUser: msg.role === 'user' }));
            const response = await iChancellor({ query, history, locale });
            const assistantMessage: Message = { role: 'assistant', content: response.answer };
            setMessages((prev) => [...prev, assistantMessage]);
            await speak(response.answer);
        } catch (error: any) {
            const errorMessageContent = `Error: ${error.message || "I'm having trouble connecting right now. Please try again."}`;
            const errorMessage: Message = { role: 'assistant', content: errorMessageContent };
            setMessages((prev) => [...prev, errorMessage]);
        }
    });
  };
  
  useEffect(() => {
    if (isMuted) {
      stopPlayback();
    }
  }, [isMuted]);

  if (isUserLoading || !user) {
    return <div className="container flex items-center justify-center py-24"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }
  
  const anyLoading = isResponding || isRecording;

  const MeditationSettingsContent = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="duration" className="w-24 text-right">
          {t('duration')}
        </Label>
        <Select
          value={String(meditationDuration / 60)}
          onValueChange={(val) => setMeditationDuration(Number(val) * 60)}
          disabled={isMeditating}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('selectDuration')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 minutes</SelectItem>
            <SelectItem value="10">10 minutes</SelectItem>
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="20">20 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] py-12">
        <audio ref={audioRef} />
        <Card className="w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl shadow-primary/10">
            <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3">
                      <BrainCircuit className="text-primary" />
                      {t('healthyLivingTitle')}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button variant={mode === 'chat' ? 'secondary' : 'ghost'} size="sm" onClick={() => setMode('chat')}>{t('chat')}</Button>
                    <Button variant={mode === 'meditation' ? 'secondary' : 'ghost'} size="sm" onClick={() => { setMode('meditation'); stopPlayback(); }}>{t('meditation')}</Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsMuted(m => !m)}>
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      <span className="sr-only">Mute</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">{t('settings')}</span>
                    </Button>
                  </div>
                </div>
                <CardDescription>{t('healthyLivingDescription')}</CardDescription>
            </CardHeader>
            
            {mode === 'chat' ? (
              <>
                <CardContent className="flex-grow min-h-0">
                    <ScrollArea className="h-full w-full pr-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                        <div key={index} className={cn('flex items-start gap-3', {'justify-end': message.role === 'user'})}>
                            {message.role === 'assistant' && <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback></Avatar>}
                            <div className={cn('rounded-lg p-3 text-sm max-w-[85%]', {'bg-secondary text-secondary-foreground': message.role === 'assistant', 'bg-primary text-primary-foreground': message.role === 'user'})}>{message.content}</div>
                            {message.role === 'user' && <Avatar className="h-8 w-8"><AvatarFallback><User size={20} /></AvatarFallback></Avatar>}
                        </div>
                        ))}
                        {isResponding && (
                        <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback></Avatar>
                            <div className="bg-secondary text-secondary-foreground rounded-lg p-3 text-sm flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('thinking')}</div>
                        </div>
                        )}
                    </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter>
                    <form onSubmit={(e) => { e.preventDefault(); handleInteraction(input); }} className="flex w-full items-center space-x-2">
                        <Button type="button" size="icon" variant={isRecording ? 'destructive' : 'outline'} onClick={handleMicClick} disabled={isResponding}>
                            <Mic className="h-4 w-4" />
                        </Button>
                        <Input id="message" placeholder={t('askForGuidance')} value={input} onChange={(e) => setInput(e.target.value)} disabled={anyLoading} autoComplete="off" />
                        <Button type="submit" size="icon" disabled={anyLoading || !input.trim()}>
                            {isResponding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </form>
                </CardFooter>
              </>
            ) : (
              <CardContent className="flex-grow flex flex-col items-center justify-center gap-6 text-center">
                  <div className="relative">
                    <p className="text-8xl font-bold font-mono text-primary-gradient">{formatTime(timer)}</p>
                    <p className="text-muted-foreground">{t('meditationSession')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                      {isMeditating ? (
                          <Button size="lg" variant="destructive" onClick={stopMeditation}>
                            <Pause className="mr-2 h-5 w-5"/> {t('endSession')}
                          </Button>
                      ) : (
                          <Button size="lg" className="bg-primary-gradient" onClick={handleStartMeditation}>
                            <Play className="mr-2 h-5 w-5"/> {t('startSession')}
                          </Button>
                      )}
                  </div>
                   <div className="space-y-4 p-4 border rounded-lg w-full max-w-sm">
                    <h4 className="font-medium text-center">{t('meditationSettings')}</h4>
                    <MeditationSettingsContent />
                  </div>
              </CardContent>
            )}
        </Card>
    </div>
    {user && <SettingsDialog isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />}
    </>
  );
}
