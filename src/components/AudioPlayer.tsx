import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Laptop,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { EngineMode, SynthesisResult } from '../types/voice';
import { formatDuration } from '../utils/audioExport';

interface AudioPlayerProps {
  engineMode: EngineMode;
  synthesisResult: SynthesisResult | null;
  // Browser TTS state
  isBrowserSpeaking: boolean;
  isBrowserPaused: boolean;
  onBrowserPause: () => void;
  onBrowserResume: () => void;
  onBrowserStop: () => void;
  browserElapsedSec: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  engineMode,
  synthesisResult,
  isBrowserSpeaking,
  isBrowserPaused,
  onBrowserPause,
  onBrowserResume,
  onBrowserStop,
  browserElapsedSec,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // AI Audio element state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);

  // When synthesisResult changes, load audio into audioRef
  useEffect(() => {
    if (engineMode === 'ai' && synthesisResult?.audioUrl && audioRef.current) {
      const audio = audioRef.current;
      audio.src = synthesisResult.audioUrl;
      audio.load();
      audio.play().then(() => setIsPlaying(true)).catch((e) => {
        // Autoplay may be restricted
        console.warn('Autoplay prevented:', e);
        setIsPlaying(false);
      });
    }
  }, [synthesisResult, engineMode]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || synthesisResult?.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleReplay = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
  };

  const handleChangePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleToggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  const handleChangeVolume = (val: number) => {
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) setIsMuted(true);
      else if (isMuted) setIsMuted(false);
    }
  };

  // If in Browser TTS mode: render dedicated browser playback controller
  if (engineMode === 'browser') {
    const isInteracting = isBrowserSpeaking || isBrowserPaused;

    return (
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Laptop className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Trình phát âm thanh trình duyệt (Web Speech API)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isBrowserSpeaking && (
              <span className="flex items-center gap-1.5 font-mono text-xs text-indigo-600 dark:text-indigo-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
                Đang phát trực tiếp ({formatDuration(browserElapsedSec)})
              </span>
            )}
            {isBrowserPaused && (
              <span className="font-mono text-xs text-amber-600 dark:text-amber-400">
                Đang tạm dừng
              </span>
            )}
            {!isInteracting && (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Sẵn sàng phát
              </span>
            )}
          </div>
        </div>

        {/* Browser Speech Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {isBrowserSpeaking ? (
              <button
                type="button"
                onClick={onBrowserPause}
                aria-label="Tạm dừng đọc"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
              >
                <Pause className="h-5 w-5" />
              </button>
            ) : isBrowserPaused ? (
              <button
                type="button"
                onClick={onBrowserResume}
                aria-label="Tiếp tục đọc"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
              >
                <Play className="ml-0.5 h-5 w-5" />
              </button>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Play className="ml-0.5 h-5 w-5" />
              </div>
            )}

            <button
              type="button"
              onClick={onBrowserStop}
              disabled={!isInteracting}
              aria-label="Dừng đọc"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Square className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 text-xs text-slate-500 dark:text-slate-400">
            Web Speech API đọc âm thanh qua bộ điều hướng phần cứng của máy tính/điện thoại.
          </div>
        </div>
      </div>
    );
  }

  // AI TTS Audio Player Mode
  const effectiveDuration = duration || synthesisResult?.duration || 0;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="hidden"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Trình phát Studio AI (Waveform & Scrubbing)
          </span>
          {synthesisResult && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              · {synthesisResult.voiceName} ({synthesisResult.styleName})
            </span>
          )}
        </div>

        {synthesisResult ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Âm thanh 24kHz Studio RIFF WAV</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Chưa có tệp âm thanh được tạo
          </span>
        )}
      </div>

      {synthesisResult ? (
        <div className="mt-4 space-y-3">
          {/* Progress Scrubber Bar */}
          <div className="space-y-1">
            <div className="relative">
              <input
                type="range"
                min={0}
                max={effectiveDuration || 1}
                step={0.01}
                value={currentTime}
                onChange={handleSeek}
                aria-label="Thanh tiến trình âm thanh"
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600 dark:bg-slate-700 dark:accent-indigo-500"
              />
            </div>

            <div className="flex justify-between font-mono text-[11px] tabular-nums text-slate-400 dark:text-slate-500">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(effectiveDuration)}</span>
            </div>
          </div>

          {/* Player Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            {/* Play/Pause/Replay/Stop */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlayPause}
                aria-label={isPlaying ? 'Tạm dừng' : 'Phát âm thanh'}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm transition-transform hover:scale-105 hover:bg-indigo-700 focus:outline-none dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
              </button>

              <button
                type="button"
                onClick={handleStop}
                aria-label="Dừng hẳn"
                title="Dừng hẳn và về đầu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <Square className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleReplay}
                aria-label="Phát lại từ đầu"
                title="Phát lại từ đầu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              {/* Waveform graphic indicator when playing */}
              {isPlaying && (
                <div className="ml-3 flex items-center gap-0.5">
                  {[0.4, 0.9, 0.6, 1.0, 0.7, 0.3, 0.8, 0.5].map((scale, i) => (
                    <span
                      key={i}
                      className="h-4 w-1 animate-pulse rounded-full bg-indigo-600 dark:bg-indigo-400"
                      style={{
                        animationDuration: `${0.4 + (i % 4) * 0.2}s`,
                        transform: `scaleY(${scale})`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Playback speed selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Tốc độ:</span>
              <div className="flex items-center rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
                {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handleChangePlaybackRate(rate)}
                    className={`rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums transition-colors ${
                      playbackRate === rate
                        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    {rate}×
                  </button>
                ))}
              </div>

              {/* Volume & Mute */}
              <div className="flex items-center gap-1.5 pl-2">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  aria-label={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
                  className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleChangeVolume(parseFloat(e.target.value))}
                  aria-label="Âm lượng phát"
                  className="h-1.5 w-16 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600 dark:bg-slate-700 dark:accent-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
          Nhập văn bản và bấm <strong>Tạo giọng nói ngay</strong> để nghe thử file âm thanh tại đây.
        </div>
      )}
    </div>
  );
};
