'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  Square, 
  Mic, 
  Volume2, 
  Radio, 
  Sparkles, 
  ShieldCheck, 
  Activity 
} from 'lucide-react';
import { textToSpeech } from '@/ai/flows/openai-tts-flow';
import { cn } from '@/lib/utils';

const EDITORIAL_SUMMARY = `Forward Deployed Engineering for the Agentic AI Era. Chancellor works directly with enterprise organizations from business problem discovery to architecture, working prototypes, production engineering, deployment, and continuous optimization. Chancellor does not simply tell organizations what AI could become. Chancellor helps build it.`;

export default function FdeVoiceExperience() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStartNarration = async () => {
    if (audioRef.current && isPaused) {
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    setIsLoadingAudio(true);
    setSpokenText(EDITORIAL_SUMMARY);

    try {
      const res = await textToSpeech({ text: EDITORIAL_SUMMARY, locale: 'en', voice: 'nova' });
      if (res.audioDataUri) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(res.audioDataUri);
        audioRef.current = audio;

        audio.onended = () => {
          setIsPlaying(false);
          setIsPaused(false);
        };

        await audio.play();
        setIsPlaying(true);
        setIsPaused(false);
      }
    } catch (err) {
      console.error('Audio playback error:', err);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handlePauseNarration = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStopNarration = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  return (
    <Card className="bg-slate-950/80 border-fuchsia-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_0_50px_-10px_rgba(217,70,239,0.15)] relative overflow-hidden text-left">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Left Column: Title & Description */}
        <div className="space-y-3 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-xs font-semibold text-fuchsia-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            OpenAI Voice Experience — Nova Voice Engine
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white">
            Listen to the FDE Briefing
          </h3>
          <p className="text-slate-300 text-xs md:text-sm font-light leading-relaxed max-w-xl">
            Experience a premium audio narration of the Forward Deployed Engineering model powered by OpenAI Neural Speech Synthesis.
          </p>
        </div>

        {/* Right Column: Audio Controls & Visualizer */}
        <div className="flex flex-col items-center lg:items-end gap-4 shrink-0 w-full lg:w-auto">
          {/* Active Audio Wave Visualizer */}
          <div className="flex items-center gap-1.5 h-8 px-4 bg-black/60 rounded-xl border border-white/10">
            {[40, 75, 55, 90, 60, 80, 45, 70, 50, 85].map((height, i) => (
              <div
                key={i}
                className={cn(
                  'w-1 rounded-full transition-all duration-300',
                  isPlaying ? 'bg-fuchsia-400 animate-pulse' : 'bg-slate-700'
                )}
                style={{ height: isPlaying ? `${height}%` : '20%' }}
              />
            ))}
            <span className="text-[11px] font-mono text-fuchsia-400 ml-2 font-bold">
              {isLoadingAudio ? 'Generating Voice...' : isPlaying ? 'Playing Audio' : isPaused ? 'Paused' : 'Ready'}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <Button
                onClick={handleStartNarration}
                disabled={isLoadingAudio}
                className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold text-xs gap-2 px-5 rounded-xl shadow-[0_0_20px_-3px_rgba(217,70,239,0.4)]"
              >
                <Play className="w-4 h-4 fill-current" />
                {isPaused ? 'Resume' : 'Start Audio'}
              </Button>
            ) : (
              <Button
                onClick={handlePauseNarration}
                variant="outline"
                className="border-fuchsia-500/40 text-fuchsia-300 font-bold text-xs gap-2 px-5 rounded-xl"
              >
                <Pause className="w-4 h-4 fill-current" />
                Pause
              </Button>
            )}

            <Button
              onClick={handleStopNarration}
              disabled={!isPlaying && !isPaused}
              variant="outline"
              className="border-white/10 text-slate-400 hover:text-white font-bold text-xs gap-2 px-4 rounded-xl"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Stop
            </Button>
          </div>
        </div>

      </div>

      {/* Transcript Preview */}
      {spokenText && (
        <div className="mt-4 pt-4 border-t border-white/10 text-xs font-mono text-fuchsia-300/90 leading-relaxed bg-black/40 p-3 rounded-xl border border-fuchsia-500/20">
          <span className="text-slate-500 uppercase tracking-widest font-bold block mb-1">Narration Transcript:</span>
          "{spokenText}"
        </div>
      )}
    </Card>
  );
}
