import { BrowserVoiceInfo, VoiceStyleProfile } from '../types/voice';

export type SpeechStatus = 'idle' | 'speaking' | 'paused' | 'error';

export interface SpeechCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onError?: (error: string) => void;
  onBoundary?: (charIndex: number, charLength?: number) => void;
}

class BrowserSpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private keepAliveTimer: any = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
    }
  }

  public checkSupport(): boolean {
    return this.isSupported;
  }

  public getVoices(): Promise<BrowserVoiceInfo[]> {
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve([]);
        return;
      }

      const load = () => {
        const rawVoices = this.synth!.getVoices();
        if (rawVoices.length > 0) {
          this.voices = rawVoices;
          const mapped: BrowserVoiceInfo[] = rawVoices.map((v) => ({
            id: v.voiceURI || `${v.name}_${v.lang}`,
            name: v.name,
            lang: v.lang,
            isDefault: v.default,
            isLocalService: v.localService,
            rawVoice: v,
          }));
          resolve(mapped);
        }
      };

      const existing = this.synth.getVoices();
      if (existing.length > 0) {
        this.voices = existing;
        load();
      } else {
        this.synth.onvoiceschanged = () => {
          load();
        };
        // Fallback timeout in case voiceschanged never fires
        setTimeout(() => load(), 500);
      }
    });
  }

  public speak(
    text: string,
    voiceId: string,
    style: VoiceStyleProfile,
    baseRate: number = 1.0,
    basePitch: number = 1.0,
    volume: number = 1.0,
    callbacks: SpeechCallbacks = {}
  ): boolean {
    if (!this.synth || !this.isSupported) {
      callbacks.onError?.('Trình duyệt của bạn không hỗ trợ Web Speech API.');
      return false;
    }

    // Cancel any ongoing speech first
    this.stop();

    if (!text || text.trim().length === 0) {
      callbacks.onError?.('Văn bản đọc không được để trống.');
      return false;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Find selected voice
      const targetVoice = this.voices.find(
        (v) => (v.voiceURI && v.voiceURI === voiceId) || v.name === voiceId || `${v.name}_${v.lang}` === voiceId
      );
      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      // Calculate effective rate & pitch modulated by the style profile
      const rateMultiplier = style.browserSettings?.rateMultiplier ?? 1.0;
      const pitchOffset = style.browserSettings?.pitchOffset ?? 1.0;

      // Web Speech API rate range: typically 0.1 to 10 (safe 0.5 to 2.0)
      const finalRate = Math.min(2.0, Math.max(0.5, baseRate * rateMultiplier));
      // Web Speech API pitch range: 0 to 2 (safe 0.5 to 1.5)
      const finalPitch = Math.min(1.5, Math.max(0.5, basePitch * pitchOffset));

      utterance.rate = finalRate;
      utterance.pitch = finalPitch;
      utterance.volume = Math.min(1.0, Math.max(0.0, volume));

      utterance.onstart = () => {
        this.startKeepAlive();
        callbacks.onStart?.();
      };

      utterance.onend = () => {
        this.stopKeepAlive();
        this.currentUtterance = null;
        callbacks.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.stopKeepAlive();
        this.currentUtterance = null;
        // Interrupted is not a fatal error (happens when user clicks stop/pause)
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          callbacks.onError?.(`Lỗi phát âm thanh trình duyệt: ${e.error || 'Unknown'}`);
        } else {
          callbacks.onEnd?.();
        }
      };

      utterance.onpause = () => {
        callbacks.onPause?.();
      };

      utterance.onresume = () => {
        callbacks.onResume?.();
      };

      utterance.onboundary = (e) => {
        callbacks.onBoundary?.(e.charIndex, e.charLength);
      };

      this.synth.speak(utterance);
      return true;
    } catch (err: any) {
      this.stopKeepAlive();
      callbacks.onError?.(`Khởi tạo đọc văn bản thất bại: ${err?.message || err}`);
      return false;
    }
  }

  public pause(): void {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop(): void {
    this.stopKeepAlive();
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // Ignore
      }
    }
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    return Boolean(this.synth && this.synth.speaking);
  }

  public isPaused(): boolean {
    return Boolean(this.synth && this.synth.paused);
  }

  /**
   * Chromium bug workaround: speech synthesis can silently pause after ~14 seconds
   * We pulse pause/resume every 10 seconds to keep speech synthesis alive.
   */
  private startKeepAlive(): void {
    this.stopKeepAlive();
    this.keepAliveTimer = setInterval(() => {
      if (this.synth && this.synth.speaking && !this.synth.paused) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 10000);
  }

  private stopKeepAlive(): void {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }
}

export const browserSpeechService = new BrowserSpeechService();
