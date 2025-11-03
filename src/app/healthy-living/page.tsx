'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Send, User, Loader2, BrainCircuit } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { iChancellor } from '@/ai/flows/ichancellor-flow';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function HealthyLivingPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello, I'm iChancellor. I'm here to support you on your path to wellness. How can I help you today? We can discuss mindfulness, healthy habits, or begin a guided meditation.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isResponding, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isResponding) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
        try {
            const response = await iChancellor({ query: input, history: messages });
            const assistantMessage: Message = { role: 'assistant', content: response.answer };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("iChancellor flow failed:", error);
            const errorMessage: Message = { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." };
            setMessages((prev) => [...prev, errorMessage]);
        }
    });
  };

  if (isUserLoading || !user) {
    return (
      <div className="container flex items-center justify-center py-24">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] py-12">
        <Card className="w-full max-w-2xl h-[70vh] flex flex-col shadow-2xl shadow-primary/10">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
            <BrainCircuit className="text-primary" />
            iChancellor - AI Wellness Guide
            </CardTitle>
            <CardDescription>Your partner in mindfulness, health, and personal growth.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow min-h-0">
            <ScrollArea className="h-full w-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
                {messages.map((message, index) => (
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
                    <div
                    className={cn('rounded-lg p-3 text-sm max-w-[85%]', {
                        'bg-secondary text-secondary-foreground': message.role === 'assistant',
                        'bg-primary text-primary-foreground': message.role === 'user',
                    })}
                    >
                    {message.content}
                    </div>
                    {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>
                        <User size={20} />
                        </AvatarFallback>
                    </Avatar>
                    )}
                </div>
                ))}
                {isResponding && (
                <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={20} />
                        </AvatarFallback>
                    </Avatar>
                    <div className="bg-secondary text-secondary-foreground rounded-lg p-3 text-sm flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Thinking...
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
                placeholder="Ask for guidance or start a meditation..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isResponding}
                autoComplete="off"
            />
            <Button type="submit" size="icon" disabled={isResponding || !input.trim()}>
                {isResponding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send</span>
            </Button>
            </form>
        </CardFooter>
        </Card>
    </div>
  );
}
