'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { getAIAssistantResponse } from '@/app/actions';
import { useLocale } from '@/hooks/useLocale';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const { t } = useLocale();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: t('aiAssistantWelcome'),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const assistantResponse = await getAIAssistantResponse(input);
    const assistantMessage: Message = { role: 'assistant', content: assistantResponse };
    
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl shadow-primary/10 md:rounded-xl rounded-t-xl rounded-b-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="text-primary" />
          AI Portfolio Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[40vh] md:h-[300px] w-full pr-4" ref={scrollAreaRef}>
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
                  className={cn('rounded-lg p-3 text-sm max-w-[80%]', {
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
