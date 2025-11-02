'use client';

import { useEffect, useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2, Wand2, BrainCircuit, PlayCircle, Volume2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { techTopics } from '@/lib/data';
import { generateTechInsight } from '@/app/actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateGreeting } from '@/ai/flows/tts-flow';
import { textToSpeech } from '@/ai/flows/speech-flow';

type Topic = (typeof techTopics)[number];

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<Topic | ''>('');
  const [insight, setInsight] = useState('');
  const [isGenerating, startTransition] = useTransition();
  const [greetingAudio, setGreetingAudio] = useState<string | null>(null);
  const [isGreetingLoading, setIsGreetingLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const greetingPlayed = useRef(false);
  const [isReading, startReadingTransition] = useTransition();
  const [insightAudio, setInsightAudio] = useState<string | null>(null);
  const insightAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (user?.displayName && !greetingPlayed.current) {
      setIsGreetingLoading(true);
      generateGreeting({ name: user.displayName })
        .then((result) => {
          setGreetingAudio(result.audioDataUri);
        })
        .catch((e) => {
            console.error("Failed to generate greeting:", e);
            setGreetingAudio(null);
        })
        .finally(() => {
          setIsGreetingLoading(false);
          greetingPlayed.current = true;
        });
    }
  }, [user]);

  useEffect(() => {
    if (greetingAudio && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [greetingAudio]);
  
  useEffect(() => {
    if (insightAudio && insightAudioRef.current) {
        insightAudioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [insightAudio]);


  const handleGenerateInsight = () => {
    if (!selectedTopic) return;

    startTransition(async () => {
      setInsight('');
      setInsightAudio(null);
      const result = await generateTechInsight(selectedTopic as Topic);
      setInsight(result);
    });
  };

  const handleReadInsight = () => {
      if (!insight) return;
      startReadingTransition(async () => {
          setInsightAudio(null);
          const plainText = new DOMParser().parseFromString(insight, 'text/html').body.textContent || '';
          const result = await textToSpeech({ text: plainText });
          setInsightAudio(result.audioDataUri);
      });
  }

  if (isUserLoading || !user) {
    return (
      <div className="container flex items-center justify-center py-24">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-24">
      {greetingAudio && <audio ref={audioRef} src={greetingAudio} />}
      {insightAudio && <audio ref={insightAudioRef} src={insightAudio} />}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4 text-primary-gradient">
          GenAI Dashboard
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          Welcome, {user.displayName || user.email}! Select a topic to get the latest AI-powered insights.
        </p>
      </div>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="text-primary" />
            Tech Insight Generator
          </CardTitle>
          <CardDescription>
            Choose a topic and let the AI analyst provide you with a summary and tips.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select onValueChange={(value) => setSelectedTopic(value as Topic)} value={selectedTopic}>
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue placeholder="Select a topic..." />
              </SelectTrigger>
              <SelectContent>
                {techTopics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleGenerateInsight} disabled={isGenerating || !selectedTopic} className="w-full sm:w-auto bg-primary-gradient">
              {isGenerating ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-5 w-5" />
              )}
              Generate Insight
            </Button>
          </div>

          <div className="min-h-[300px] bg-secondary rounded-lg p-4 border relative">
             {insight && !isGenerating && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReadInsight}
                    disabled={isReading}
                    className="absolute top-4 right-4 z-10"
                >
                    {isReading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Volume2 className="h-5 w-5 text-primary" />
                    )}
                    <span className="sr-only">Read insight aloud</span>
                </Button>
            )}
            {isGenerating ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-4" />
                Generating your insight on {selectedTopic}...
              </div>
            ) : insight ? (
              <ScrollArea className="h-[40vh] pr-4">
                <div
                    className="prose prose-sm sm:prose-base max-w-none prose-invert"
                    dangerouslySetInnerHTML={{ __html: insight }}
                />
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Your AI-generated insight will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
