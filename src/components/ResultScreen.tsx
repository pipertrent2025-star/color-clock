import React, { useState } from 'react';
import { UserInput, SavedSession } from '../types';
import { Sparkles, ArrowRight, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { audio } from '../audio';

interface Props {
  input: UserInput;
  onReset: () => void;
}

export function ResultScreen({ input, onReset }: Props) {
  const [reflection, setReflection] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const getSuggestion = () => {
    if (input.energyLevel === 'Low') {
      return "You started out with low energy. Consider keeping your final colored piece somewhere visible as a soft reminder of this quiet moment. Maybe make a warm cup of tea before you get back to your day.";
    } else if (input.energyLevel === 'High') {
      return "You came into this with high energy. Notice how your breathing might have relaxed over the session. Transition back softly, perhaps with a gentle stretch of your arms.";
    }
    return "Take a moment to admire the colors you've chosen. Let the sense of completion ground you before stepping back into your routine.";
  };

  const handleSave = () => {
    if (isSaved) return;
    
    const newSession: SavedSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: input.duration,
      intention: input.intention,
      reflection: reflection.trim()
    };

    try {
      const existing = localStorage.getItem('mindful_coloring_sessions');
      const sessions = existing ? JSON.parse(existing) : [];
      sessions.push(newSession);
      localStorage.setItem('mindful_coloring_sessions', JSON.stringify(sessions));
      setIsSaved(true);
    } catch(e) {}
  };

  const handleReset = () => {
    audio.stopAmbient();
    onReset();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto p-10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 dark:border-slate-800 text-center relative overflow-hidden"
    >
      <div className="w-20 h-20 bg-teal-50 dark:bg-teal-400/10 text-teal-600 dark:text-teal-300 border border-teal-200 dark:border-teal-400/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
        <Sparkles size={32} />
      </div>
      
      <h2 className="text-3xl font-serif text-slate-800 dark:text-slate-100 mb-6 leading-tight">
        Take a deep breath. <br />
        <span className="text-slate-500 dark:text-slate-400 text-xl font-sans mt-3 block font-normal leading-relaxed">
          How did your mind shift during these {input.duration / 60} minutes?
        </span>
      </h2>

      <div className="bg-white/60 dark:bg-slate-800/40 p-6 rounded-2xl mb-6 border border-white/80 dark:border-slate-700/50 shadow-sm text-left">
        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mb-3 uppercase tracking-wider">Mindful Pause</p>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="E.g., I noticed my shoulders relaxing, my thoughts slowed down a bit..."
          className="w-full h-24 px-4 py-3 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 focus:outline-none focus:ring-1 focus:ring-teal-300 dark:focus:ring-teal-400/50 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none mb-4 shadow-sm"
          disabled={isSaved}
        />
        
        <div className="h-px w-full bg-slate-200 dark:bg-slate-700/50 mb-4" />
        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mb-2 uppercase tracking-wider">Gentle Suggestion</p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
          {getSuggestion()}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {!isSaved ? (
          <button 
            onClick={handleSave}
            className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-teal-50 dark:bg-teal-400/20 text-teal-700 dark:text-teal-300 font-medium hover:bg-teal-100 dark:hover:bg-teal-400/30 transition-colors shadow-sm border border-teal-200 dark:border-teal-400/30"
          >
            Log this Session <Save size={18} />
          </button>
        ) : (
          <div className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800/50 text-teal-600 dark:text-teal-400 font-medium border border-slate-200 dark:border-teal-400/20 shadow-sm">
            Session Saved ✨
          </div>
        )}
        
        <button 
          onClick={handleReset}
          className="w-full py-4 rounded-xl flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-800 text-white dark:text-slate-300 font-medium hover:bg-slate-700 dark:hover:bg-slate-700 transition-colors shadow-md"
        >
          Prepare Next Session <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}
