import React, { useState, useEffect } from 'react';
import { SavedSession } from '../types';
import { motion } from 'motion/react';
import { Clock, Calendar, ArrowLeft, BookHeart } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export function HistoryScreen({ onBack }: Props) {
  const [sessions, setSessions] = useState<SavedSession[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('mindful_coloring_sessions');
    if (stored) {
      try {
        setSessions(JSON.parse(stored).sort((a: SavedSession, b: SavedSession) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      } catch(e) {}
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl w-full mx-auto p-8 py-10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-white/50 dark:border-slate-800"
    >
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-serif text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <BookHeart size={20} className="text-rose-500 dark:text-rose-400" />
          Session Log
        </h2>
        <div className="w-10" />
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {sessions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p>No sessions logged yet.</p>
            <p className="text-sm mt-2">Complete a mindful coloring session to see it here.</p>
          </div>
        ) : (
          sessions.map(session => {
            const d = new Date(session.date);
            return (
              <motion.div 
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 p-5 rounded-2xl shadow-sm"
              >
                <div className="flex items-center justify-between mb-3 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{Math.floor(session.duration / 60)} min</span>
                  </div>
                </div>
                {session.intention && (
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Intention</span>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">{session.intention}</p>
                  </div>
                )}
                {session.reflection && (
                  <div className="mt-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/30">
                    <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider block mb-1">Reflection</span>
                    <p className="text-slate-800 dark:text-slate-200 text-sm italic">"{session.reflection}"</p>
                  </div>
                )}
              </motion.div>
            )
          })
        )}
      </div>
    </motion.div>
  );
}
