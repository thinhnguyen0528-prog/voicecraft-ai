import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '10mb' }));

// Helper to initialize Gemini Client with server telemetry header
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Endpoint: Check Engine Status
app.get('/api/tts/status', (_req: Request, res: Response) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  
  res.json({
    status: 'ok',
    gemini: {
      configured: hasGeminiKey,
      model: 'gemini-3.8-flash-lite-tts',
      expressiveModel: 'gemini-3.8-flash-tts',
      supportedVoices: ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'],
      outputFormat: 'audio/wav',
      sampleRate: 24000,
    },
    googleCloudTts: {
      configured: Boolean(process.env.GOOGLE_CLOUD_API_KEY || process.env.GOOGLE_APPLICATION_CREDENTIALS),
      provider: 'Google Cloud Text-to-Speech API (v1)',
      note: 'Configurable via GOOGLE_CLOUD_API_KEY in server environment',
    },
    browserTts: {
      supported: true,
      standard: 'Web Speech API (speechSynthesis)',
      exportSupported: false,
    },
  });
});

// 2. Endpoint: Synthesize Speech using Gemini 3.8 Flash Lite TTS
app.post('/api/tts/synthesize', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      text,
      voice = 'Kore',
      style = 'Clear, professional and natural articulation',
      language = 'vi-VN',
      rate = 1.0,
      pitch = 1.0,
      highExpressive = false,
    } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      res.status(400).json({ error: 'Nội dung văn bản (text) không được để trống.' });
      return;
    }

    const trimmedText = text.trim();
    if (trimmedText.length > 3000) {
      res.status(400).json({
        error: 'Đoạn văn bản quá dài cho một lượt xử lý (tối đa 3000 ký tự). Vui lòng sử dụng tính năng phân đoạn tự động.',
      });
      return;
    }

    const gemini = getGeminiClient();
    if (!gemini) {
      res.status(503).json({
        error: 'GEMINI_API_KEY chưa được cấu hình trên server. Bạn có thể sử dụng chế độ Browser TTS (Web Speech API) trực tiếp trên thiết bị, hoặc cấu hình GEMINI_API_KEY trong tab Settings > Secrets.',
        code: 'MISSING_API_KEY',
      });
      return;
    }

    // Allowed prebuilt voice names in Gemini 3.8 TTS
    const allowedVoices = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];
    const selectedVoice = allowedVoices.includes(voice) ? voice : 'Kore';

    // Model selection: flash-lite-tts for fast and reliable general TTS, flash-tts for custom expressive bursts
    const modelName = highExpressive ? 'gemini-3.8-flash-tts' : 'gemini-3.8-flash-lite-tts';

    // Build style description prompt tailored to the language & style
    let effectiveStyle = style;
    if (language.startsWith('vi')) {
      effectiveStyle = `${style}. Phát âm tiếng Việt chuẩn, rõ chữ, thanh điệu chính xác, ngắt nghỉ tự nhiên.`;
    } else {
      effectiveStyle = `${style}. American English pronunciation, natural phrasing, clear diction.`;
    }

    if (rate && (rate < 0.9 || rate > 1.1)) {
      if (rate < 0.9) effectiveStyle += ' Đọc với nhịp điệu chậm rãi, từ tốn.';
      else if (rate > 1.2) effectiveStyle += ' Đọc với nhịp điệu nhanh, dứt khoát, năng động.';
    }

    // Call Gemini 3.8 TTS via official @google/genai SDK
    const response = await gemini.models.generateContent({
      model: modelName,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: trimmedText,
              speechMetadata: {
                style: effectiveStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find((part: any) => part.inlineData?.data);

    if (!audioPart || !audioPart.inlineData?.data) {
      console.error('Gemini TTS response missing audio inlineData:', JSON.stringify(response, null, 2));
      res.status(502).json({
        error: 'Engine AI không trả về dữ liệu âm thanh hợp lệ cho văn bản này. Vui lòng thử lại với giọng đọc hoặc câu khác.',
      });
      return;
    }

    const base64Audio = audioPart.inlineData.data;
    const mimeType = audioPart.inlineData.mimeType || 'audio/wav';

    // Calculate approximate duration based on standard 24kHz 16-bit mono PCM (48000 bytes/sec)
    const audioBuffer = Buffer.from(base64Audio, 'base64');
    const estimatedDuration = Math.max(0.5, Number(((audioBuffer.length - 44) / 48000).toFixed(2)));

    res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType,
      format: 'wav',
      sampleRate: 24000,
      channels: 1,
      bitDepth: 16,
      fileSizeBytes: audioBuffer.length,
      estimatedDuration,
      voice: selectedVoice,
      style: effectiveStyle,
      language,
      modelUsed: modelName,
    });
  } catch (error: any) {
    console.error('Error during AI TTS synthesis:', error);
    const message = error?.message || 'Lỗi không xác định khi tổng hợp âm thanh AI.';
    res.status(500).json({
      error: `Quá trình tổng hợp giọng nói thất bại: ${message}`,
      details: error?.status || 'INTERNAL_ERROR',
    });
  }
});

// Vite middleware for dev / static serve for prod
async function setupServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VoiceCraft AI server listening on port ${PORT} [${isProduction ? 'production' : 'development'}]`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
