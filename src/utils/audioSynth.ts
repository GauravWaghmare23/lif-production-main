// High-fidelity procedural Web Audio API Sound Engine for LOST IN FRAME

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private droneGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private isDronePlaying: boolean = false;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.init();
      this.startDrone();
    } else {
      this.stopDrone();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Atmospheric Cinematic Sub-Bass Drone with subtle warmth & modulation
  public startDrone() {
    if (this.isMuted || !this.ctx || this.isDronePlaying) return;

    try {
      const now = this.ctx.currentTime;
      
      // Master Drone Gain
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.0001, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.08, now + 3);

      // Lowpass filter with slight resonance
      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(110, now);
      this.droneFilter.Q.setValueAtTime(4, now);

      // Sub fundamental (48Hz - Low G)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(48, now);

      // Detuned harmonic oscillator (48.4Hz for binaural beating)
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(48.4, now);

      // Modulating LFO for slow breathing filter
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, now);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(30, now);
      lfo.connect(lfoGain);
      lfoGain.connect(this.droneFilter.frequency);
      lfo.start();

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.isDronePlaying = true;
    } catch (e) {
      console.warn("Audio drone error:", e);
    }
  }

  public stopDrone() {
    if (!this.ctx || !this.droneGain || !this.isDronePlaying) return;
    try {
      const now = this.ctx.currentTime;
      this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      setTimeout(() => {
        try {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
        } catch {
          // ignore
        }
        this.isDronePlaying = false;
      }, 1300);
    } catch (e) {
      console.warn("Audio stop error:", e);
    }
  }

  // Camera mechanical shutter release sound
  public playShutter() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    try {
      const now = this.ctx.currentTime;

      // 1. Initial mechanical mirror slap click
      const clickBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.04, this.ctx.sampleRate);
      const output = clickBuffer.getChannelData(0);
      for (let i = 0; i < clickBuffer.length; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.006));
      }
      const clickSrc = this.ctx.createBufferSource();
      clickSrc.buffer = clickBuffer;

      const clickFilter = this.ctx.createBiquadFilter();
      clickFilter.type = 'bandpass';
      clickFilter.frequency.setValueAtTime(1400, now);
      clickFilter.Q.setValueAtTime(3, now);

      const clickGain = this.ctx.createGain();
      clickGain.gain.setValueAtTime(0.35, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      clickSrc.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickSrc.start(now);

      // 2. Heavy mechanical thud (Arri / Red camera mirror shutter)
      const thudOsc = this.ctx.createOscillator();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(160, now + 0.02);
      thudOsc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

      const thudGain = this.ctx.createGain();
      thudGain.gain.setValueAtTime(0.4, now + 0.02);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      thudOsc.connect(thudGain);
      thudGain.connect(this.ctx.destination);
      thudOsc.start(now + 0.02);
      thudOsc.stop(now + 0.15);
    } catch {
      // ignore
    }
  }

  // Optical lens focus ring click / subtle hover tick
  public playLensTick(pitch = 1) {
    if (this.isMuted || !this.ctx) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(800 * pitch, now + 0.025);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // ignore
    }
  }

  // Atmospheric Cinematic Transition Whoosh
  public playWhoosh() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const duration = 0.6;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + duration * 0.5);
      filter.frequency.exponentialRampToValueAtTime(120, now + duration);
      filter.Q.setValueAtTime(4, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + duration * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch {
      // ignore
    }
  }

  // Deep Sub Bass Hit (for modal openings or dramatic milestones)
  public playSubImpact() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.8);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.95);
    } catch {
      // ignore
    }
  }
}

export const soundEngine = new AudioEngine();
