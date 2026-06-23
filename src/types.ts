export type ScreenState = 'setup' | 'active' | 'result' | 'history';

export type SoundType = 'Rain' | 'Forest' | 'Lo-fi';

export interface CustomPreset {
  id: string;
  name: string;
  duration: number; // in seconds
}

export interface SavedSession {
  id: string;
  date: string; // ISO string
  duration: number; // seconds
  intention: string;
  reflection: string;
}

export interface UserInput {
  duration: number; // in seconds
  intention: string;
  energyLevel: 'Low' | 'Medium' | 'High';
  soundType: SoundType;
}
