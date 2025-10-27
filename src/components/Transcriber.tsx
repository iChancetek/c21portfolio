'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, Mic, FileAudio } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Transcriber() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select an audio file first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setText('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (event) => {
        const audioDataUri = event.target?.result as string;

        const response = await fetch('/api/transcribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audioDataUri }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Transcription failed');
        }

        const result = await response.json();
        setText(result.text);
        toast({
          title: 'Success',
          description: 'Audio transcribed successfully.',
        });
      };
      reader.onerror = (error) => {
        throw new Error('Failed to read the file.');
      }
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
      <div className="container flex justify-center">
        <Card className="w-full max-w-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
              <Mic className="w-8 h-8 text-primary" /> Audio Transcriber
            </CardTitle>
            <CardDescription>Upload an audio file and get the transcription using Whisper.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Input
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                disabled={isLoading}
                />
                 {file && <p className="text-sm text-muted-foreground pt-2">Selected file: {file.name}</p>}
            </div>
            
            <Button onClick={handleTranscribe} disabled={isLoading || !file} className="w-full bg-primary-gradient">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transcribing...
                </>
              ) : (
                <>
                  <FileAudio className="mr-2 h-4 w-4" />
                  Transcribe Audio
                </>
              )}
            </Button>
            
            {text && (
              <div className="mt-6 p-4 bg-secondary rounded-lg border">
                <h3 className="font-semibold mb-2">Transcription Result:</h3>
                <p className="text-muted-foreground">{text}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
