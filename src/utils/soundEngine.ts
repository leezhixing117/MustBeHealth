// Web Audio API procedural sound engine for Intellect app soundscapes and breathing guides

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentSourceNodes: { [key: string]: any } = {};
  private activeSoundId: string | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isUnlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        if (!this.isUnlocked) {
          this.initContext();
          this.isUnlocked = true;
        }
      };
      window.addEventListener('click', unlock, { once: false, passive: true });
      window.addEventListener('touchstart', unlock, { once: false, passive: true });
    }
  }

  public initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playChime(freq = 528, duration = 1.8) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain || this.isMuted) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  public playBreathCue(phase: 'inhale' | 'hold' | 'exhale') {
    if (phase === 'inhale') {
      this.playChime(432, 2.5);
    } else if (phase === 'hold') {
      this.playChime(528, 1.5);
    } else {
      this.playChime(396, 3.0);
    }
  }

  public playSoundscape(type: 'rain' | 'ocean' | 'singingBowl' | 'forestBreeze' | 'lofiChime', soundId: string) {
    this.stopSoundscape();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.activeSoundId = soundId;

    if (type === 'rain') {
      this.startRain();
    } else if (type === 'ocean') {
      this.startOcean();
    } else if (type === 'singingBowl') {
      this.startSingingBowl();
    } else if (type === 'forestBreeze') {
      this.startForestBreeze();
    } else if (type === 'lofiChime') {
      this.startLoFiChime();
    }
  }

  public stopSoundscape() {
    this.activeSoundId = null;
    try {
      Object.keys(this.currentSourceNodes).forEach((k) => {
        const node = this.currentSourceNodes[k];
        if (node.stop) {
          try { node.stop(); } catch (_) {}
        }
        if (node.disconnect) {
          try { node.disconnect(); } catch (_) {}
        }
        if (node.interval) {
          clearInterval(node.interval);
        }
      });
    } catch (e) {
      // ignore
    }
    this.currentSourceNodes = {};
  }

  public getActiveSoundId(): string | null {
    return this.activeSoundId;
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  private startRain() {
    if (!this.ctx || !this.masterGain) return;
    // Generate pink/brown noise
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.35, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    whiteNoise.start();
    this.currentSourceNodes['rain_src'] = whiteNoise;
    this.currentSourceNodes['rain_gain'] = gainNode;
  }

  private startOcean() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.08;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    // LFO to swell wave volume & filter
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8 sec wave cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(220, this.ctx.currentTime);

    lfo.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    lfo.start();

    this.currentSourceNodes['ocean_noise'] = noise;
    this.currentSourceNodes['ocean_lfo'] = lfo;
  }

  private startSingingBowl() {
    if (!this.ctx || !this.masterGain) return;
    const playBowlStrike = () => {
      if (!this.ctx || !this.masterGain) return;
      const fundamental = 261.63; // C4
      const harmonics = [1, 2.76, 5.4, 8.9];
      const gains = [0.25, 0.12, 0.06, 0.03];

      harmonics.forEach((h, idx) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * h, this.ctx!.currentTime);
        
        g.gain.setValueAtTime(0, this.ctx!.currentTime);
        g.gain.linearRampToValueAtTime(gains[idx], this.ctx!.currentTime + 0.1);
        g.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + 6.0);

        osc.connect(g);
        g.connect(this.masterGain!);

        osc.start();
        osc.stop(this.ctx!.currentTime + 6.2);
      });
    };

    playBowlStrike();
    const interval = setInterval(playBowlStrike, 7000);
    this.currentSourceNodes['bowl_interval'] = { interval };
  }

  private startForestBreeze() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.currentSourceNodes['forest_noise'] = noise;
  }

  private startLoFiChime() {
    if (!this.ctx || !this.masterGain) return;
    const notes = [440, 523.25, 659.25, 783.99, 880];
    const playNote = () => {
      if (!this.ctx || !this.masterGain) return;
      const note = notes[Math.floor(Math.random() * notes.length)];
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);
      g.gain.setValueAtTime(0, this.ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.0);

      osc.connect(g);
      g.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 3.1);
    };

    playNote();
    const interval = setInterval(playNote, 3200);
    this.currentSourceNodes['lofi_interval'] = { interval };
  }
}

export const soundEngine = new SoundEngine();
