/**
 * Audio synthesis engine & Speech API for Gitas Academy
 * Provides zero-external-dependency sound effects, chimes, melodies, and phonics pronunciation.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play a single synthesized musical tone
  public playTone(freq: number, duration: number = 0.2, type: OscillatorType = 'sine', gainVal: number = 0.15) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy catch
    }
  }

  // Built-in synthesized sound effects
  public playSound(sound: 'success' | 'pop' | 'alert' | 'pod_switch' | 'hand_raise' | 'click' | 'correct' | 'wrong') {
    const ctx = this.getContext();
    if (!ctx) return;

    switch (sound) {
      case 'pop': {
        this.playTone(480, 0.08, 'triangle', 0.2);
        break;
      }
      case 'click': {
        this.playTone(800, 0.03, 'sine', 0.08);
        break;
      }
      case 'pod_switch': {
        // Upward chord
        const now = ctx.currentTime;
        [440, 554.37, 659.25, 880].forEach((freq, i) => {
          setTimeout(() => this.playTone(freq, 0.25, 'sine', 0.12), i * 60);
        });
        break;
      }
      case 'hand_raise': {
        this.playTone(587.33, 0.15, 'sine', 0.15);
        setTimeout(() => this.playTone(880, 0.25, 'sine', 0.18), 120);
        break;
      }
      case 'alert': {
        this.playTone(659.25, 0.15, 'triangle', 0.15);
        setTimeout(() => this.playTone(523.25, 0.2, 'triangle', 0.15), 100);
        break;
      }
      case 'correct':
      case 'success': {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          setTimeout(() => this.playTone(freq, 0.3, 'triangle', 0.15), idx * 80);
        });
        break;
      }
      case 'wrong': {
        this.playTone(330, 0.2, 'sawtooth', 0.1);
        setTimeout(() => this.playTone(260, 0.35, 'sawtooth', 0.1), 150);
        break;
      }
    }
  }

  // Speak words or letters aloud using Web Speech API with gentle pacing
  public speak(text: string, rate: number = 0.9, pitch: number = 1.1) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = 'en-US';

      // Pick a clean English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
      );
      if (preferred) {
        utterance.voice = preferred;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis error fallback
    }
  }

  // Play full nursery melody note sequence with callback on active note
  public playMelody(
    notes: Array<{ note: string; duration: number }>,
    bpm: number = 110,
    onNoteProgress?: (index: number) => void
  ): () => void {
    const ctx = this.getContext();
    if (!ctx) return () => {};

    const noteFrequencies: Record<string, number> = {
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
      REST: 0
    };

    const beatDuration = 60 / bpm;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let cumulativeTime = 0;

    notes.forEach((item, index) => {
      const noteTime = cumulativeTime;
      const t = setTimeout(() => {
        if (onNoteProgress) onNoteProgress(index);
        const freq = noteFrequencies[item.note] || 0;
        if (freq > 0) {
          const toneDuration = item.duration * beatDuration * 0.9;
          this.playTone(freq, toneDuration, 'sine', 0.18);
        }
      }, noteTime * 1000);

      timeouts.push(t);
      cumulativeTime += item.duration * beatDuration;
    });

    // Return cancellation handle
    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }
}

export const sound = new AudioEngine();
