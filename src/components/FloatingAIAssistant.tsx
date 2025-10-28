'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Bot, X } from 'lucide-react';
import AIAssistant from './AIAssistant';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className={cn(
            "fixed z-50 flex flex-col",
            isOpen 
              ? "inset-0 bg-black/60 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:inset-auto md:bottom-6 md:right-6 md:items-end"
              : "bottom-6 right-6 items-end"
          )}
      >
        <div className="w-full h-full flex flex-col justify-end md:max-w-md">
            <AnimatePresence>
                {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="mb-4 md:mb-4 w-full px-4 md:px-0"
                >
                    <AIAssistant />
                </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3, ease: 'easeOut' }}
                className="self-end mr-4 mb-4 md:mr-0 md:mb-0"
            >
                <Button
                size="lg"
                className="rounded-full w-16 h-16 bg-primary-gradient shadow-2xl shadow-primary/30"
                onClick={() => setIsOpen(!isOpen)}
                >
                {isOpen ? <X className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
                <span className="sr-only">Toggle AI Assistant</span>
                </Button>
            </motion.div>
        </div>
      </div>
    </>
  );
}
