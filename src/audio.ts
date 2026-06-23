import { SoundType } from './types';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private nodes: AudioNode[] = [];
  private intervals: NodeJS.Timeout[] = [];
  public isPlayingAmbient = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChime() {
    this.init();
    if (!this.ctx) return;
    
    // Soothing chime: A major 7th chord (A3, C#4, E4, G#4) softly rolled
    const freqs = [220.00, 277.18, 329.63, 415.30];
    const now = this.ctx.currentTime;

    freqs.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      // Use lowpass filter for extra warmth
      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = now + i * 0.15; // slow roll
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 6);
      
      osc.start(startTime);
      osc.stop(startTime + 6.1);
    });
  }

  toggleAmbient(type: SoundType = 'Lo-fi') {
    this.init();
    if (!this.ctx) return false;

    if (this.isPlayingAmbient) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient(type);
      return true;
    }
  }

  private startAmbient(type: SoundType) {
    if (!this.ctx) return;
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.connect(this.ctx.destination);
    this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 3);

    this.nodes = [];

    if (type === 'Lo-fi') {
      // 1. Vinyl static / hiss
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noiseSrc = this.ctx.createBufferSource();
      noiseSrc.buffer = buffer;
      noiseSrc.loop = true;
      
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 800; // Muffled hiss
      
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.value = 0.05;

      noiseSrc.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ambientGain);
      noiseSrc.start();
      
      this.nodes.push(noiseSrc, noiseFilter, noiseGain);

      // 2. Generative pleasant warm chords
      // Electric piano-like sound: Sine + Triangle with slow envelope
      const playNote = (freq: number, delay: number) => {
        if (!this.ctx || !this.ambientGain) return;
        const offsetTime = this.ctx.currentTime + delay;

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.value = freq;
        osc2.frequency.value = freq;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400; // Warm, muffled

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0, offsetTime);
        gainNode.gain.linearRampToValueAtTime(0.3, offsetTime + 0.1); // Soft attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, offsetTime + 3); // Slow decay

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ambientGain);

        osc1.start(offsetTime);
        osc2.start(offsetTime);
        osc1.stop(offsetTime + 3.1);
        osc2.stop(offsetTime + 3.1);
        
        this.nodes.push(osc1, osc2, filter, gainNode);
      };

      // Pentatonic scale starting at C3
      const scale = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00];

      const playChord = () => {
        const rootIdx = Math.floor(Math.random() * 5); // 0-4
        playNote(scale[rootIdx], 0.1);
        playNote(scale[rootIdx + 2], 0.15); // Third
        if (Math.random() > 0.5) playNote(scale[rootIdx + 4], 0.2); // Fifth
        
        // Occasional high note melody
        if (Math.random() > 0.4) {
          playNote(scale[Math.floor(Math.random() * 5) + 5], Math.random() * 1.5 + 0.5);
        }
      };

      playChord();
      this.intervals.push(setInterval(() => {
        if (this.isPlayingAmbient) {
          playChord();
        }
      }, 4000));

    } else if (type === 'Rain') {
      // Pink/Brown noise approximation for rain
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02; // basic low-pass / brown noise
        lastOut = output[i];
        output[i] *= 3.5; // compensate volume
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
      
      noise.connect(filter);
      filter.connect(this.ambientGain);
      
      noise.start();
      this.nodes = [noise, filter];
    } else if (type === 'Forest') {
      // Simple wind (filtered noise) and high pitched bird-like chirps
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 400; // Wind freq

      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1; // slow wind sweep
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 300;
      
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      noise.connect(filter);
      filter.connect(this.ambientGain);

      noise.start();
      lfo.start();

      // Drone to ground it
      const drone = this.ctx.createOscillator();
      drone.type = 'triangle';
      drone.frequency.value = 110;
      const droneGain = this.ctx.createGain();
      droneGain.gain.value = 0.3;
      drone.connect(droneGain);
      droneGain.connect(this.ambientGain);
      drone.start();

      this.nodes = [noise, filter, lfo, lfoGain, drone, droneGain];
    }

    this.isPlayingAmbient = true;
  }

  stopAmbient() {
    if (!this.ctx || !this.ambientGain) return;
    
    this.intervals.forEach(clearInterval);
    this.intervals = [];

    this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2);
    setTimeout(() => {
      this.nodes.forEach(node => {
        try {
          if (node instanceof AudioScheduledSourceNode) {
            node.stop();
          }
          node.disconnect();
        } catch(e) {}
      });
      this.nodes = [];
      this.ambientGain?.disconnect();
      this.ambientGain = null;
    }, 2100);
    this.isPlayingAmbient = false;
  }
}

export const audio = new AudioEngine();
