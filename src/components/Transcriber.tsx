'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader2, Mic, MicOff, Upload, FileText, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';
import { useLocale } from '@/hooks/useLocale';

export default function Transcriber() {
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();
  const { t } = useLocale();

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
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
        stream.getTracks().forEach(track => track.stop()); // Stop the mic access
      };
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioBlob(null);
      setTranscription('');
      toast({ title: t('listening') });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: t('micDenied'),
        description: 'Could not access the microphone. Please check permissions.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({ title: t('stopRecording') });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      setTranscription('');
      toast({ title: t('fileSelected', { name: file.name }) });
    }
  };

  const blobToDataURI = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleTranscribe = async () => {
    if (!audioBlob) {
      toast({
        title: t('noAudio'),
        description: t('noAudioDescription'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setTranscription('');

    try {
      const audioDataUri = await blobToDataURI(audioBlob);
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
      setTranscription(result.transcription);
      toast({
        title: t('success'),
        description: 'Audio transcribed successfully.',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setAudioBlob(null);
    setTranscription('');
  }

  return (
    <section id="transcribe" className="py-16 md:py-24 lg:py-32 bg-background">
      <div className="flex justify-center">
        <Card className="w-full max-w-xl bg-secondary/30 border-border/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
              <Mic className="w-8 h-8 text-primary" /> {t('transcriberTitle')}
            </CardTitle>
            <CardDescription>{t('transcriberDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleMicClick} variant={isRecording ? 'destructive' : 'outline'} className="w-full">
                {isRecording ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
                {isRecording ? t('stopRecording') : t('startRecording')}
              </Button>
              <Button asChild variant="outline" className="w-full">
                <label htmlFor="audio-upload" className="cursor-pointer">
                  <Upload className="mr-2" /> {t('uploadFile')}
                  <input id="audio-upload" type="file" accept="audio/*" className="sr-only" onChange={handleFileUpload} />
                </label>
              </Button>
            </div>

            {audioBlob && (
              <div className="p-4 bg-background/50 rounded-lg border text-center text-sm text-muted-foreground">
                <p>
                  {audioBlob.type.startsWith('audio') ? t('audioReady', { size: (audioBlob.size / 1024).toFixed(2) }) : t('fileSelected', { name: (audioBlob as File).name })}
                </p>
                <div className="flex justify-center items-center gap-4 mt-4">
                  <Button onClick={handleTranscribe} disabled={isLoading} className="bg-primary-gradient">
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('transcribing')}</>
                    ) : (
                      <><FileText className="mr-2 h-4 w-4" /> {t('transcribe')}</>
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleClear} disabled={isLoading}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {transcription && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">{t('transcription')}</h3>
                <Textarea value={transcription} readOnly className="min-h-[120px] bg-background/50" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
