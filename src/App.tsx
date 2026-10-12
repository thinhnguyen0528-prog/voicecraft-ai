/**
 * VoiceCraft AI — Premium Multilingual Text-to-Speech Web Application
 * @license Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  X,
  Volume2,
  Sparkles,
  Laptop,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  EngineMode,
  SupportedLanguage,
  VoiceStyleId,
  SynthesisResult,
  HistoryItem,
  BrowserVoiceInfo,
} from './types/voice';
import { VOICE_STYLE_PROFILES } from './data/voiceStyles';
import { AI_VOICES } from './data/aiVoices';
import { SAMPLE_SCRIPTS, SampleScript } from './data/sampleTexts';
import { browserSpeechService } from './services/browserSpeechService';
import { aiSpeechService, BackendStatus } from './services/aiSpeechService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TextEditor } from './components/TextEditor';
import { VoiceSelector } from './components/VoiceSelector';
import { VoiceStyleSelector } from './components/VoiceStyleSelector';
import { VoiceControls } from './components/VoiceControls';
import { AudioPlayer } from './components/AudioPlayer';
import { AudioExportCard } from './components/AudioExportCard';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SettingsModal } from './components/SettingsModal';
import { DocsModal } from './components/DocsModal';
import { SampleScriptsModal } from './components/SampleScriptsModal';

export default function App() {
  // Core State
  const [engineMode, setEngineMode] = useState<EngineMode>('ai');
  const [language, setLanguage] = useState<SupportedLanguage>('vi-VN');
  const [text, setText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('voicecraft_draft_text');
      if (saved) return saved;
    } catch {
      // Ignore
    }
    return SAMPLE_SCRIPTS[0].content;
  });

  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('Kore');
  const [selectedStyleId, setSelectedStyleId] = useState<VoiceStyleId>('mc_host');
  const [rate, setRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [highExpressive, setHighExpressive] = useState<boolean>(false);

  // App Theme & Tabs
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const pref = localStorage.getItem('voicecraft_theme');
      if (pref) return pref === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const [currentTab, setCurrentTab] = useState<'studio' | 'history' | 'samples' | 'settings'>('studio');

  // Backend & Hardware Voices
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);
  const [browserVoices, setBrowserVoices] = useState<BrowserVoiceInfo[]>([]);

  // Synthesis & Playback State
  const [synthesisResult, setSynthesisResult] = useState<SynthesisResult | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [isAuditioning, setIsAuditioning] = useState<boolean>(false);

  // Browser TTS real-time speaking state
  const [isBrowserSpeaking, setIsBrowserSpeaking] = useState<boolean>(false);
  const [isBrowserPaused, setIsBrowserPaused] = useState<boolean>(false);
  const [browserElapsedSec, setBrowserElapsedSec] = useState<number>(0);
  const browserTimerRef = useRef<any>(null);

  // Notifications
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // History
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('voicecraft_history');
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return [];
  });

  // Modal Visibility
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isSamplesOpen, setIsSamplesOpen] = useState(false);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('voicecraft_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('voicecraft_theme', 'light');
    }
  }, [darkMode]);

  // Auto-save draft text
  useEffect(() => {
    try {
      localStorage.setItem('voicecraft_draft_text', text);
    } catch {
      // Ignore
    }
  }, [text]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('voicecraft_history', JSON.stringify(history.slice(0, 30)));
    } catch {
      // Ignore
    }
  }, [history]);

  // Load backend status and browser voices on mount
  useEffect(() => {
    aiSpeechService.getEngineStatus().then((status) => {
      setBackendStatus(status);
    });

    browserSpeechService.getVoices().then((voices) => {
      setBrowserVoices(voices);
      // If in browser mode and no voice selected, select first matching voice
      if (voices.length > 0 && engineMode === 'browser') {
        const langPrefix = language.split('-')[0];
        const match = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix)) || voices[0];
        setSelectedVoiceId(match.id);
      }
    });

    return () => {
      if (browserTimerRef.current) clearInterval(browserTimerRef.current);
      browserSpeechService.stop();
    };
  }, []);

  // When switching engine mode or language, adjust default selected voice
  const handleSelectEngineMode = (mode: EngineMode) => {
    setEngineMode(mode);
    setErrorMessage(null);
    if (mode === 'ai') {
      setSelectedVoiceId('Kore');
    } else {
      // Choose first suitable browser voice for current language
      const langPrefix = language.split('-')[0];
      const match = browserVoices.find((v) => v.lang.toLowerCase().startsWith(langPrefix)) || browserVoices[0];
      if (match) setSelectedVoiceId(match.id);
    }
  };

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    if (engineMode === 'browser') {
      const langPrefix = lang.split('-')[0];
      const match = browserVoices.find((v) => v.lang.toLowerCase().startsWith(langPrefix)) || browserVoices[0];
      if (match) setSelectedVoiceId(match.id);
    }
  };

  // Trigger speech synthesis
  const handleSynthesize = async () => {
    if (!text || text.trim().length === 0) {
      setErrorMessage('Vui lòng nhập nội dung văn bản trước khi tạo giọng nói.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    const activeProfile = VOICE_STYLE_PROFILES.find((s) => s.id === selectedStyleId) || VOICE_STYLE_PROFILES[0];

    if (engineMode === 'ai') {
      // Mode 1: AI Neural Synthesis
      setIsSynthesizing(true);
      try {
        const result = await aiSpeechService.synthesize({
          text,
          voice: selectedVoiceId,
          style: activeProfile,
          language,
          rate,
          pitch,
          highExpressive,
        });

        setSynthesisResult(result);
        setSuccessMessage(`Đã tổng hợp thành công tệp âm thanh WAV 24kHz (${result.fileName}).`);

        // Record history
        const newHistoryItem: HistoryItem = {
          id: result.id,
          text,
          timestamp: Date.now(),
          engine: 'ai',
          voiceId: selectedVoiceId,
          voiceName: selectedVoiceId,
          styleId: selectedStyleId,
          styleName: activeProfile.name,
          language,
          rate,
          pitch,
          charCount: text.length,
          wordCount: text.trim().split(/\s+/).length,
          hasAudio: true,
          audioUrl: result.audioUrl,
          audioBase64: result.audioBase64,
        };
        setHistory((prev) => [newHistoryItem, ...prev]);
      } catch (err: any) {
        setErrorMessage(err?.message || 'Tổng hợp âm thanh AI thất bại. Vui lòng thử lại.');
      } finally {
        setIsSynthesizing(false);
      }
    } else {
      // Mode 2: Browser Speech Synthesis
      if (browserTimerRef.current) clearInterval(browserTimerRef.current);
      setBrowserElapsedSec(0);

      const ok = browserSpeechService.speak(
        text,
        selectedVoiceId,
        activeProfile,
        rate,
        pitch,
        volume,
        {
          onStart: () => {
            setIsBrowserSpeaking(true);
            setIsBrowserPaused(false);
            browserTimerRef.current = setInterval(() => {
              setBrowserElapsedSec((prev) => prev + 1);
            }, 1000);
          },
          onEnd: () => {
            setIsBrowserSpeaking(false);
            setIsBrowserPaused(false);
            if (browserTimerRef.current) clearInterval(browserTimerRef.current);
          },
          onPause: () => {
            setIsBrowserSpeaking(false);
            setIsBrowserPaused(true);
          },
          onResume: () => {
            setIsBrowserSpeaking(true);
            setIsBrowserPaused(false);
          },
          onError: (errMsg) => {
            setIsBrowserSpeaking(false);
            setIsBrowserPaused(false);
            if (browserTimerRef.current) clearInterval(browserTimerRef.current);
            setErrorMessage(errMsg);
          },
        }
      );

      if (ok) {
        // Record history
        const browserVoice = browserVoices.find((v) => v.id === selectedVoiceId);
        const newHistoryItem: HistoryItem = {
          id: `hist_${Date.now()}`,
          text,
          timestamp: Date.now(),
          engine: 'browser',
          voiceId: selectedVoiceId,
          voiceName: browserVoice?.name || selectedVoiceId,
          styleId: selectedStyleId,
          styleName: activeProfile.name,
          language,
          rate,
          pitch,
          charCount: text.length,
          wordCount: text.trim().split(/\s+/).length,
          hasAudio: false,
        };
        setHistory((prev) => [newHistoryItem, ...prev]);
      }
    }
  };

  // Audition short test
  const handleAudition = async () => {
    const auditionText =
      language === 'vi-VN'
        ? 'Xin chào quý vị, đây là giọng đọc thử nghiệm từ hệ thống VoiceCraft AI.'
        : 'Hello there, this is an audition sample from VoiceCraft AI Studio.';

    setIsAuditioning(true);
    setErrorMessage(null);
    const activeProfile = VOICE_STYLE_PROFILES.find((s) => s.id === selectedStyleId) || VOICE_STYLE_PROFILES[0];

    if (engineMode === 'ai') {
      try {
        const result = await aiSpeechService.synthesize({
          text: auditionText,
          voice: selectedVoiceId,
          style: activeProfile,
          language,
          rate,
          pitch,
          highExpressive,
        });
        setSynthesisResult(result);
      } catch (err: any) {
        setErrorMessage(err?.message || 'Không thể nghe thử giọng AI lúc này.');
      } finally {
        setIsAuditioning(false);
      }
    } else {
      browserSpeechService.speak(
        auditionText,
        selectedVoiceId,
        activeProfile,
        rate,
        pitch,
        volume,
        {
          onStart: () => setIsAuditioning(true),
          onEnd: () => setIsAuditioning(false),
          onError: (err) => {
            setIsAuditioning(false);
            setErrorMessage(err);
          },
        }
      );
    }
  };

  // Browser controls
  const handleBrowserPause = () => {
    browserSpeechService.pause();
    setIsBrowserSpeaking(false);
    setIsBrowserPaused(true);
  };

  const handleBrowserResume = () => {
    browserSpeechService.resume();
    setIsBrowserSpeaking(true);
    setIsBrowserPaused(false);
  };

  const handleBrowserStop = () => {
    browserSpeechService.stop();
    setIsBrowserSpeaking(false);
    setIsBrowserPaused(false);
    if (browserTimerRef.current) clearInterval(browserTimerRef.current);
    setBrowserElapsedSec(0);
  };

  // Reset controls to defaults
  const handleResetDefaults = () => {
    setRate(1.0);
    setPitch(1.0);
    setVolume(1.0);
    setHighExpressive(false);
  };

  // Load sample script into editor
  const handleLoadSample = (scriptId: string) => {
    const script = SAMPLE_SCRIPTS.find((s) => s.id === scriptId);
    if (!script) return;
    setText(script.content);
    setLanguage(script.language);
    if (script.styleId) setSelectedStyleId(script.styleId as VoiceStyleId);
    if (engineMode === 'ai' && script.voiceId) setSelectedVoiceId(script.voiceId);
    setSuccessMessage(`Đã nạp kịch bản: "${script.title}".`);
  };

  const handleApplyScriptFromModal = (script: SampleScript) => {
    handleLoadSample(script.id);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setText(item.text);
    setLanguage(item.language);
    setRate(item.rate);
    setPitch(item.pitch);
    if (item.styleId) setSelectedStyleId(item.styleId);
    if (item.voiceId) setSelectedVoiceId(item.voiceId);
    setSuccessMessage('Đã nạp lại nội dung từ lịch sử vào trình soạn thảo.');
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử không?')) {
      setHistory([]);
      localStorage.removeItem('voicecraft_history');
    }
  };

  const handleClearCache = () => {
    localStorage.removeItem('voicecraft_draft_text');
    localStorage.removeItem('voicecraft_history');
    setHistory([]);
    setText(SAMPLE_SCRIPTS[0].content);
    setIsSettingsOpen(false);
    setSuccessMessage('Đã làm sạch bộ nhớ đệm và đặt lại văn bản mặc định.');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <Header
        engineMode={engineMode}
        onSelectEngineMode={handleSelectEngineMode}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        backendStatus={backendStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
      />

      {/* Main Workspace Frame */}
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              if (tab === 'samples') setIsSamplesOpen(true);
              else if (tab === 'settings') setIsSettingsOpen(true);
            }}
            engineMode={engineMode}
            historyCount={history.length}
            onLoadSample={handleLoadSample}
            isAiConfigured={backendStatus?.gemini.configured ?? false}
          />
        </div>

        {/* Studio Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Notifications banner */}
          {errorMessage && (
            <div className="mb-4 flex items-start justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                <div>
                  <span className="font-semibold">Thông báo lỗi:</span> {errorMessage}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="ml-3 rounded p-0.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 flex items-start justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{successMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="ml-3 rounded p-0.5 text-emerald-600 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Studio 2-Column Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column: Text Editor & Scripting (7 cols) */}
            <div className="flex flex-col gap-6 lg:col-span-7">
              <TextEditor
                text={text}
                onChangeText={setText}
                engineMode={engineMode}
                onSynthesize={handleSynthesize}
                isSynthesizing={isSynthesizing}
              />

              {/* Audio Player */}
              <AudioPlayer
                engineMode={engineMode}
                synthesisResult={synthesisResult}
                isBrowserSpeaking={isBrowserSpeaking}
                isBrowserPaused={isBrowserPaused}
                onBrowserPause={handleBrowserPause}
                onBrowserResume={handleBrowserResume}
                onBrowserStop={handleBrowserStop}
                browserElapsedSec={browserElapsedSec}
              />

              {/* Real Audio Export Card */}
              <AudioExportCard
                engineMode={engineMode}
                synthesisResult={synthesisResult}
                onSwitchToAi={() => handleSelectEngineMode('ai')}
              />
            </div>

            {/* Right Column: Voice Selection, Styles & Controls (5 cols) */}
            <div className="flex flex-col gap-6 lg:col-span-5">
              {/* Voice Selector */}
              <VoiceSelector
                engineMode={engineMode}
                selectedVoiceId={selectedVoiceId}
                onSelectVoice={setSelectedVoiceId}
                browserVoices={browserVoices}
                language={language}
              />

              {/* Voice Style Selector */}
              <VoiceStyleSelector
                selectedStyleId={selectedStyleId}
                onSelectStyle={setSelectedStyleId}
                engineMode={engineMode}
              />

              {/* Speech Controls */}
              <VoiceControls
                rate={rate}
                onChangeRate={setRate}
                pitch={pitch}
                onChangePitch={setPitch}
                volume={volume}
                onChangeVolume={setVolume}
                highExpressive={highExpressive}
                onToggleHighExpressive={setHighExpressive}
                onResetDefaults={handleResetDefaults}
                onAudition={handleAudition}
                isAuditioning={isAuditioning}
                engineMode={engineMode}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Floating Drawers & Modals */}
      <HistoryDrawer
        isOpen={currentTab === 'history'}
        onClose={() => setCurrentTab('studio')}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      <SampleScriptsModal
        isOpen={isSamplesOpen || currentTab === 'samples'}
        onClose={() => {
          setIsSamplesOpen(false);
          setCurrentTab('studio');
        }}
        onSelectScript={handleApplyScriptFromModal}
        currentLanguage={language}
      />

      <SettingsModal
        isOpen={isSettingsOpen || currentTab === 'settings'}
        onClose={() => {
          setIsSettingsOpen(false);
          setCurrentTab('studio');
        }}
        backendStatus={backendStatus}
        onClearCache={handleClearCache}
      />

      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
}
