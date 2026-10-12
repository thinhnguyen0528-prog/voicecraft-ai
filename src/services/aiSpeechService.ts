import { SynthesisResult, VoiceStyleProfile } from '../types/voice';
import { base64ToBlob, createTrackedBlobUrl, generateAudioFilename } from '../utils/audioExport';

export interface BackendStatus {
  status: string;
  gemini: {
    configured: boolean;
    model: string;
    expressiveModel: string;
    supportedVoices: string[];
    outputFormat: string;
    sampleRate: number;
  };
  googleCloudTts: {
    configured: boolean;
    provider: string;
    note: string;
  };
  browserTts: {
    supported: boolean;
    standard: string;
    exportSupported: boolean;
  };
}

export interface SynthesizeOptions {
  text: string;
  voice: string;
  style: VoiceStyleProfile;
  language: string;
  rate?: number;
  pitch?: number;
  highExpressive?: boolean;
}

class AISpeechService {
  public async getEngineStatus(): Promise<BackendStatus> {
    try {
      const response = await fetch('/api/tts/status');
      if (!response.ok) {
        throw new Error(`Status check HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      console.warn('Backend status check failed:', err);
      return {
        status: 'disconnected',
        gemini: {
          configured: false,
          model: 'gemini-3.8-flash-lite-tts',
          expressiveModel: 'gemini-3.8-flash-tts',
          supportedVoices: ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'],
          outputFormat: 'audio/wav',
          sampleRate: 24000,
        },
        googleCloudTts: {
          configured: false,
          provider: 'Google Cloud Text-to-Speech API (v1)',
          note: 'Requires server credentials',
        },
        browserTts: {
          supported: true,
          standard: 'Web Speech API',
          exportSupported: false,
        },
      };
    }
  }

  public async synthesize(options: SynthesizeOptions): Promise<SynthesisResult> {
    const { text, voice, style, language, rate = 1.0, pitch = 1.0, highExpressive = false } = options;

    const response = await fetch('/api/tts/synthesize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice,
        style: style.geminiPromptStyle,
        language,
        rate,
        pitch,
        highExpressive,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const errorMessage = data?.error || `Lỗi tổng hợp âm thanh (HTTP ${response.status})`;
      throw new Error(errorMessage);
    }

    const { audioBase64, mimeType = 'audio/wav', estimatedDuration, fileSizeBytes } = data;
    const blob = base64ToBlob(audioBase64, mimeType);
    const audioUrl = createTrackedBlobUrl(blob);
    const fileName = generateAudioFilename('voicecraft', voice, style.id, 'wav');

    return {
      id: `syn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      audioUrl,
      audioBlob: blob,
      audioBase64,
      format: 'wav',
      sampleRate: 24000,
      duration: estimatedDuration || 3.0,
      createdAt: Date.now(),
      text,
      voiceId: voice,
      voiceName: voice,
      styleId: style.id,
      styleName: style.name,
      engine: 'ai',
      fileName,
      fileSizeBytes: fileSizeBytes || blob.size,
    };
  }
}

export const aiSpeechService = new AISpeechService();
