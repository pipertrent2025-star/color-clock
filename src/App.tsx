import React, { useState, useEffect } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { ActiveTimerScreen } from './components/ActiveTimerScreen';
import { ResultScreen } from './components/ResultScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { ScreenState, UserInput } from './types';
import { Sun, Moon } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('setup');
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('mindful_coloring_theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mindful_coloring_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const getBackgroundColor = () => {
    switch (screen) {
      case 'setup': return 'bg-amber-50/50 dark:bg-slate-950';
      case 'active': return 'bg-rose-50/70 dark:bg-[#0f172a]';
      case 'result': return 'bg-teal-50/60 dark:bg-slate-950';
      case 'history': return 'bg-slate-50 dark:bg-slate-950';
      default: return 'bg-slate-50 dark:bg-slate-950';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-[2000ms] ease-in-out ${getBackgroundColor()} flex flex-col items-center justify-center p-4 font-sans relative`}>
      <button
        onClick={toggleTheme}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 p-2.5 sm:p-2 rounded-full bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors shadow-sm z-50 backdrop-blur-sm"
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="flex-1 flex items-center w-full justify-center">
        {screen === 'setup' && (
          <SetupScreen 
            onStart={(input) => {
              setUserInput(input);
              setScreen('active');
            }}
            onViewHistory={() => setScreen('history')}
          />
        )}
        
        {screen === 'active' && userInput && (
          <ActiveTimerScreen 
            input={userInput} 
            onComplete={() => setScreen('result')} 
          />
        )}

        {screen === 'result' && userInput && (
          <ResultScreen 
            input={userInput} 
            onReset={() => {
              setUserInput(null);
              setScreen('setup');
            }} 
          />
        )}

        {screen === 'history' && (
          <HistoryScreen 
            onBack={() => setScreen('setup')} 
          />
        )}
      </div>

      <footer className="mt-8 text-xs text-slate-500/70 dark:text-slate-500">
        &copy; {new Date().getFullYear()} Color Clock. All rights reserved.
      </footer>
    </div>
  );
}
