import React, { useEffect, useState } from 'react';
import { UserInput } from '../types';
import { audio } from '../audio';
import { Volume2, VolumeX, Pause, Play, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  input: UserInput;
  onComplete: () => void;
}

export function ActiveTimerScreen({ input, onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState(input.duration);
  const [isPaused, setIsPaused] = useState(false);
  const [ambientOn, setAmbientOn] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            audio.playChime();
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isPaused, timeLeft, onComplete]);

  useEffect(() => {
    // Cleanup ambient audio if component unmounts unexpectedly
    return () => {
      audio.stopAmbient();
    };
  }, []);

  const toggleAudio = () => {
    const isPlaying = audio.toggleAmbient(input.soundType);
    setAmbientOn(isPlaying || false);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const progress = ((input.duration - timeLeft) / input.duration) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full mx-auto p-10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-lg rounded-[3rem] shadow-2xl border border-white/50 dark:border-slate-800 text-center relative overflow-hidden"
    >
      <div 
        className="absolute bottom-0 left-0 h-2 bg-rose-300 dark:bg-rose-400/80 transition-all duration-1000 ease-linear"
        style={{ width: `${progress}%` }}
      />
      
      <p className="text-slate-500 dark:text-slate-400 font-medium mb-12 uppercase tracking-widest text-xs h-6 flex items-center justify-center">
        {input.intention || "A Mindful Moment"}
      </p>

      <div className="text-8xl flex justify-center font-serif text-slate-800 dark:text-slate-100 tracking-tighter mb-16 tabular-nums relative">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`${minutes}:${seconds}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            {minutes}:{seconds}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={toggleAudio}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors shadow-sm border ${
            ambientOn ? 'bg-teal-100 dark:bg-teal-400/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-400/30' : 'bg-white dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700/50 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
          aria-label="Toggle ambient audio"
        >
          {ambientOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>

        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="w-20 h-20 rounded-[2rem] bg-slate-800 dark:bg-rose-300 text-white dark:text-slate-900 flex items-center justify-center hover:bg-slate-700 dark:hover:bg-rose-200 transition-colors shadow-md active:scale-95"
          aria-label={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? <Play size={32} className="translate-x-0.5" /> : <Pause size={32} />}
        </button>

        <button 
          onClick={() => {
            audio.playChime();
            onComplete();
          }}
          className="w-14 h-14 rounded-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-400 dark:text-slate-500 flex items-center justify-center hover:text-rose-500 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          aria-label="Finish early"
        >
          <Check size={24} />
        </button>
      </div>
    </motion.div>
  );
}
