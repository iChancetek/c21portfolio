'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader2, Wand2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';

export default function Transcriber() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEnhance = async () => {
    if (!inputText.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text to enhance.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setOutputText('');

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Enhancement failed');
      }

      const result = await response.json();
      setOutputText(result.enhancedText);
      toast({
        title: 'Success',
        description: 'Text enhanced successfully.',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="transcribe" className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="flex justify-center">
        <Card className="w-full max-w-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
              <Wand2 className="w-8 h-8 text-primary" /> Text Enhancer
            </CardTitle>
            <CardDescription>Enter some text below and let AI improve it.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                id="text-input"
                placeholder="Enter text to enhance..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                className="min-h-[120px]"
              />
            </div>
            
            <Button onClick={handleEnhance} disabled={isLoading || !inputText.trim()} className="w-full bg-primary-gradient">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Enhance Text
                </>
              )}
            </Button>
            
            {outputText && (
              <div className="mt-6 p-4 bg-secondary rounded-lg border">
                <h3 className="font-semibold mb-2">Enhanced Text:</h3>
                <p className="text-muted-foreground">{outputText}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
