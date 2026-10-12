export type EngineMode = 'ai' | 'browser';

export type SupportedLanguage = 'vi-VN' | 'en-US' | 'en-GB';

export type VoiceStyleId =
  | 'mc_host'
  | 'presentation'
  | 'news_anchor'
  | 'corporate_narration'
  | 'inspirational'
  | 'storytelling'
  | 'audiobook'
  | 'warm_emotional'
  | 'dramatic'
  | 'natural_conversation'
  | 'friendly_assistant'
  | 'language_learning'
  | 'slow_clear'
  | 'short_form';

export type StyleCategory = 'broadcast' | 'creative' | 'everyday';

export interface VoiceStyleProfile {
  id: VoiceStyleId;
  name: string;
  vietnameseName: string;
  category: StyleCategory;
  description: string;
  iconName: string;
  supportedLanguages: SupportedLanguage[];
  compatibleEngines: EngineMode[];
  geminiPromptStyle: string;
  browserSettings: {
    rateMultiplier: number;
    pitchOffset: number;
    pauseRatio?: number;
  };
  supportedControls: {
    rate: boolean;
    pitch: boolean;
    volume: boolean;
  };
  availability: 'available' | 'simulated_browser' | 'requires_api' | 'unsupported_by_engine';
  limitations: string;
}

export interface AIVoice {
  id: string;
  name: string;
  gender: 'female' | 'male' | 'neutral';
  tone: string;
  description: string;
  recommendedStyles: VoiceStyleId[];
  supportedLanguages: SupportedLanguage[];
  provider: 'gemini' | 'gcp';
}

export interface BrowserVoiceInfo {
  id: string;
  name: string;
  lang: string;
  isDefault: boolean;
  isLocalService: boolean;
  rawVoice?: SpeechSynthesisVoice;
}

export interface SynthesisResult {
  id: string;
  audioUrl: string;
  audioBlob: Blob;
  audioBase64?: string;
  format: 'wav';
  sampleRate: number;
  duration: number;
  createdAt: number;
  text: string;
  voiceId: string;
  voiceName: string;
  styleId: VoiceStyleId;
  styleName: string;
  engine: EngineMode;
  fileName: string;
  fileSizeBytes: number;
}

export interface HistoryItem {
  id: string;
  text: string;
  timestamp: number;
  engine: EngineMode;
  voiceId: string;
  voiceName: string;
  styleId: VoiceStyleId;
  styleName: string;
  language: SupportedLanguage;
  rate: number;
  pitch: number;
  charCount: number;
  wordCount: number;
  hasAudio: boolean;
  audioUrl?: string;
  audioBase64?: string;
}

export interface TextSegment {
  index: number;
  text: string;
  charCount: number;
  wordCount: number;
  status: 'pending' | 'synthesizing' | 'completed' | 'error';
  audioBlob?: Blob;
  error?: string;
}
