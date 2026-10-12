export interface SegmentationResult {
  segments: string[];
  totalChars: number;
  totalWords: number;
  estimatedDurationSec: number;
}

/**
 * Splits text into segments suitable for TTS synthesis
 * Respects sentence boundaries, punctuation, quotes, and avoids mid-word breaks.
 */
export function segmentText(text: string, maxChunkLength: number = 600): SegmentationResult {
  const clean = normalizeText(text);
  if (!clean) {
    return { segments: [], totalChars: 0, totalWords: 0, estimatedDurationSec: 0 };
  }

  const totalChars = clean.length;
  const words = clean.split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  // Average reading speed: ~140 words per minute (2.3 words/sec in Vietnamese/English)
  const estimatedDurationSec = Math.max(1, Math.round(totalWords / 2.3));

  if (clean.length <= maxChunkLength) {
    return {
      segments: [clean],
      totalChars,
      totalWords,
      estimatedDurationSec,
    };
  }

  // Regex to split on major punctuation followed by space or newline
  const sentenceDelimiters = /([.?!;…\n]+["'”’]?\s+)/;
  const rawParts = clean.split(sentenceDelimiters);

  const segments: string[] = [];
  let currentSegment = '';

  for (let i = 0; i < rawParts.length; i += 2) {
    const sentence = rawParts[i];
    const delimiter = rawParts[i + 1] || '';
    const fullSentence = (sentence + delimiter).trim();

    if (!fullSentence) continue;

    if (currentSegment.length + fullSentence.length + 1 <= maxChunkLength) {
      currentSegment = currentSegment ? `${currentSegment} ${fullSentence}` : fullSentence;
    } else {
      if (currentSegment) {
        segments.push(currentSegment);
      }

      // If a single sentence is longer than maxChunkLength, split by comma or clause
      if (fullSentence.length > maxChunkLength) {
        const subClauses = splitLongClause(fullSentence, maxChunkLength);
        for (let j = 0; j < subClauses.length - 1; j++) {
          segments.push(subClauses[j]);
        }
        currentSegment = subClauses[subClauses.length - 1] || '';
      } else {
        currentSegment = fullSentence;
      }
    }
  }

  if (currentSegment) {
    segments.push(currentSegment);
  }

  return {
    segments: segments.length > 0 ? segments : [clean],
    totalChars,
    totalWords,
    estimatedDurationSec,
  };
}

function splitLongClause(clause: string, maxLen: number): string[] {
  const parts: string[] = [];
  const words = clause.split(/\s+/);
  let current = '';

  for (const word of words) {
    if (current.length + word.length + 1 <= maxLen) {
      current = current ? `${current} ${word}` : word;
    } else {
      if (current) parts.push(current);
      current = word;
    }
  }
  if (current) parts.push(current);
  return parts;
}

/**
 * Normalizes user text safely:
 * - Keeps Vietnamese diacritics, letters, numbers, punctuation
 * - Collapses excessive whitespace (> 2 blank lines)
 * - Trims edges
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Counts characters and words in real time
 */
export function getStats(text: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    return { charCount: 0, wordCount: 0, paragraphCount: 0 };
  }
  const charCount = text.length;
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  const paragraphCount = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  return { charCount, wordCount, paragraphCount: Math.max(1, paragraphCount) };
}
