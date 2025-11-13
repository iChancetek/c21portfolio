'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Bot, Send, User, Loader2, Play, Volume2, Pause, StopCircle } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { getAIAssistantResponse } from '@/app/actions';
import { useLocale } from '@/hooks/useLocale';
import { textToSpeech } from '@/ai/flows/openai-tts-flow';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type AudioState = 'idle' | 'loading' | 'playing' | 'paused';

export default function AIAssistant() {
  const { t, locale } = useLocale();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: t('aiAssistantWelcome'),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    setAudioState('idle');
    setCurrentlyPlaying(null);
  }, []);

  const handleReadAloud = async (text: string, messageIndex: number) => {
    const messageKey = `${messageIndex}-${text.slice(0, 30)}`;

    if (currentlyPlaying === messageKey && audioState === 'playing') {
        audioRef.current?.pause();
        setAudioState('paused');
        return;
    }

    if (currentlyPlaying === messageKey && audioState === 'paused') {
        audioRef.current?.play();
        setAudioState('playing');
        return;
    }

    stopPlayback(); // Stop any other audio
    setAudioState('loading');
    setCurrentlyPlaying(messageKey);

    try {
        const { audioDataUri } = await textToSpeech({ text, locale });
        setAudioSrc(audioDataUri);
    } catch (error) {
        console.error("Failed to generate speech:", error);
        stopPlayback();
    }
  };

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed:", err);
        stopPlayback();
      });
      setAudioState('playing');
    }
  }, [audioSrc, stopPlayback]);

  useEffect(() => {
    const audioElement = audioRef.current;
    const onEnded = () => {
        setAudioState('idle');
        setCurrentlyPlaying(null);
    };
    audioElement?.addEventListener('ended', onEnded);
    return () => {
      audioElement?.removeEventListener('ended', onEnded);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    stopPlayback();
    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const assistantResponse = await getAIAssistantResponse(input);
    const assistantMessage: Message = { role: 'assistant', content: assistantResponse };
    
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const getAudioIcon = (messageKey: string) => {
    if (currentlyPlaying === messageKey) {
        switch (audioState) {
            case 'loading': return <Loader2 className="h-4 w-4 animate-spin" />;
            case 'playing': return <Pause className="h-4 w-4" />;
            case 'paused': return <Play className="h-4 w-4" />;
            default: return <Volume2 className="h-4 w-4" />;
        }
    }
    return <Volume2 className="h-4 w-4" />;
  };

  return (
    <Card className="w-full max-w-md shadow-2xl shadow-primary/10 md:rounded-xl rounded-t-xl rounded-b-none">
      <audio ref={audioRef} />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="text-primary" />
          AI Portfolio Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[40vh] md:h-[300px] w-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => {
              const messageKey = `${index}-${message.content.slice(0, 30)}`;
              return (
                <div
                  key={index}
                  className={cn('flex items-start gap-3', {
                    'justify-end': message.role === 'user',
                  })}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={20} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className='flex-1'>
                    <div
                      className={cn('rounded-lg p-3 text-sm max-w-[90%] inline-block', {
                        'bg-secondary text-secondary-foreground': message.role === 'assistant',
                        'bg-primary text-primary-foreground': message.role === 'user',
                        'float-right': message.role === 'user',
                      })}
                    >
                      {message.content}
                    </div>
                     {message.role === 'assistant' && (
                      <div className={cn("mt-2 flex gap-2", {'justify-start': message.role === 'assistant'})}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground"
                          onClick={() => handleReadAloud(message.content, index)}
                          disabled={audioState === 'loading' && currentlyPlaying !== messageKey}
                        >
                          {getAudioIcon(messageKey)}
                          <span className="sr-only">Read aloud</span>
                        </Button>
                        {currentlyPlaying === messageKey && audioState !== 'idle' && (
                           <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground"
                            onClick={stopPlayback}
                          >
                            <StopCircle className="h-4 w-4" />
                             <span className="sr-only">Stop</span>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User size={20} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot size={20} />
                    </AvatarFallback>
                </Avatar>
                <div className="bg-secondary text-secondary-foreground rounded-lg p-3 text-sm flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('thinking')}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            id="message"
            placeholder={t('aiAssistantPlaceholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">{t('send')}</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
