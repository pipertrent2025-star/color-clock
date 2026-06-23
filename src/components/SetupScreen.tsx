import React, { useState, useEffect } from 'react';
import { UserInput, SoundType, CustomPreset } from '../types';
import { Palette, Clock, Heart, Headphones, Plus, X, List } from 'lucide-react';
import { motion } from 'motion/react';

const STORAGE_KEY = 'mindful_coloring_presets';

interface Props {
  onStart: (input: UserInput) => void;
  onViewHistory: () => void;
}

export function SetupScreen({ onStart, onViewHistory }: Props) {
  const [duration, setDuration] = useState<number>(15 * 60);
  const [intention, setIntention] = useState<string>('');
  const [energyLevel, setEnergyLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [soundType, setSoundType] = useState<SoundType>('Lo-fi');

  const [customPresets, setCustomPresets] = useState<CustomPreset[]>([]);
  const [isAddingPreset, setIsAddingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetMins, setNewPresetMins] = useState('');
  const [newPresetSecs, setNewPresetSecs] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCustomPresets(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveCustomPreset = () => {
    const m = parseInt(newPresetMins) || 0;
    const s = parseInt(newPresetSecs) || 0;
    const totalSecs = m * 60 + s;
    if (totalSecs > 0 && newPresetName.trim()) {
      const updated = [
        ...customPresets,
        {
          id: Date.now().toString(),
          name: newPresetName.trim(),
          duration: totalSecs,
        }
      ];
      setCustomPresets(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setIsAddingPreset(false);
      setNewPresetName('');
      setNewPresetMins('');
      setNewPresetSecs('');
      setDuration(totalSecs);
    }
  };

  const removePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customPresets.filter(p => p.id !== id);
    setCustomPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-md w-full mx-auto p-8 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 dark:border-slate-800 relative"
    >
      <button 
        onClick={onViewHistory}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 sm:p-2 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors shadow-sm"
        title="View Session Log"
      >
        <List size={20} />
      </button>

      <div className="text-center mb-8 mt-2">
        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-400/10 border border-rose-200 dark:border-rose-400/20 text-rose-500 dark:text-rose-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Palette size={32} />
        </div>
        <h1 className="text-2xl font-serif text-slate-800 dark:text-slate-100">Color Clock</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
          Set up a calm countdown for your next coloring session.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Clock size={16} className="text-slate-400 dark:text-slate-500" /> Session Duration
            </label>
            {!isAddingPreset && (
              <button 
                onClick={() => setIsAddingPreset(true)}
                className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-300 dark:hover:text-rose-200 flex items-center gap-1 transition-colors"
                title="Create a new timer preset"
              >
                <Plus size={14} /> Custom
              </button>
            )}
          </div>

          {isAddingPreset && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-white/50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 mb-4 space-y-3 overflow-hidden shadow-inner"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">New Custom Preset</span>
                <button onClick={() => setIsAddingPreset(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <input 
                type="text" 
                placeholder="Name (e.g. Deep Dive)"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 focus:outline-none focus:ring-1 focus:ring-rose-300 dark:focus:ring-rose-400/50 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
              />
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input 
                    type="number" 
                    placeholder="Min"
                    min="0"
                    value={newPresetMins}
                    onChange={(e) => setNewPresetMins(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 focus:outline-none focus:ring-1 focus:ring-rose-300 dark:focus:ring-rose-400/50 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 tabular-nums shadow-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 pointer-events-none">m</span>
                </div>
                <div className="flex-1 relative">
                  <input 
                    type="number" 
                    placeholder="Sec"
                    min="0"
                    max="59"
                    value={newPresetSecs}
                    onChange={(e) => setNewPresetSecs(e.target.value)}
                     className="w-full pl-3 pr-8 py-2 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 focus:outline-none focus:ring-1 focus:ring-rose-300 dark:focus:ring-rose-400/50 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 tabular-nums shadow-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 pointer-events-none">s</span>
                </div>
              </div>
              <button 
                onClick={saveCustomPreset}
                disabled={!newPresetName.trim() || (!newPresetMins && !newPresetSecs)}
                className="w-full py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium text-white dark:text-slate-200 rounded-lg transition-colors"
              >
                Save & Select
              </button>
            </motion.div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {[15, 20, 30].map(mins => (
              <button
                key={`default-${mins}`}
                onClick={() => setDuration(mins * 60)}
                className={`py-3 rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm font-medium transition-colors border shadow-sm ${
                  duration === mins * 60 
                    ? 'bg-rose-100 dark:bg-rose-400/20 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-400/30' 
                    : 'bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{mins} min</span>
              </button>
            ))}
            
            {customPresets.map(preset => (
              <div key={preset.id} className="relative group">
                <button
                  onClick={() => setDuration(preset.duration)}
                  className={`w-full h-full py-2.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors border shadow-sm ${
                    duration === preset.duration
                      ? 'bg-rose-100 dark:bg-rose-400/20 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-400/30' 
                      : 'bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-[13px] font-medium px-2 truncate w-full text-center">{preset.name}</span>
                  <span className="text-[11px] opacity-70 tabular-nums">
                    {Math.floor(preset.duration / 60)}:{(preset.duration % 60).toString().padStart(2, '0')}
                  </span>
                </button>
                <button
                  onClick={(e) => removePreset(preset.id, e)}
                  className="absolute -top-2 -right-2 bg-slate-200 hover:bg-rose-500 dark:bg-slate-700 dark:hover:bg-rose-500 hover:text-white dark:text-slate-300 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                  aria-label="Remove preset"
                  title="Remove preset"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
           <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <Heart size={16} className="text-slate-400 dark:text-slate-500" /> Your Intention (Optional)
          </label>
          <input 
            type="text" 
            placeholder="e.g. To relax my mind, just focus on colors..."
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-400/50 transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Current Energy Level</label>
          <div className="grid grid-cols-3 gap-3">
            {(['Low', 'Medium', 'High'] as const).map(level => (
              <button
                key={level}
                onClick={() => setEnergyLevel(level)}
                className={`py-3 rounded-xl text-sm font-medium transition-colors border shadow-sm ${
                  energyLevel === level 
                    ? 'bg-teal-100 dark:bg-teal-400/20 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-400/30' 
                    : 'bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <Headphones size={16} className="text-slate-400 dark:text-slate-500" /> Ambient Sound
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['Lo-fi', 'Rain', 'Forest'] as const).map(sound => (
              <button
                key={sound}
                onClick={() => setSoundType(sound)}
                className={`py-3 rounded-xl text-sm font-medium transition-colors border shadow-sm ${
                  soundType === sound 
                    ? 'bg-indigo-100 dark:bg-indigo-400/20 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-400/30' 
                    : 'bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {sound}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          onClick={() => onStart({ duration, intention, energyLevel, soundType })}
          className="w-full mt-4 py-4 rounded-xl bg-slate-800 dark:bg-rose-300 text-white dark:text-slate-900 font-medium hover:bg-slate-700 dark:hover:bg-rose-200 transition-colors shadow-md active:scale-[0.98]"
        >
          Begin Session
        </button>
      </div>
    </motion.div>
  );
}
