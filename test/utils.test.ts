import { segmentText, normalizeText, getStats } from '../src/utils/textSegmentation.js';
import { generateAudioFilename, formatBytes, formatDuration } from '../src/utils/audioExport.js';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log('--- Running VoiceCraft AI Logic Verification Tests ---');

// 1. Text Normalization Test
const rawSample = '  Chào bạn!   \n\n\n\nĐây là VoiceCraft   AI.  ';
const cleaned = normalizeText(rawSample);
assert(cleaned.includes('Chào bạn!'), 'Normalized text must preserve content');
assert(!cleaned.includes('\n\n\n\n'), 'Normalized text must collapse excessive blank lines');
console.log('✓ Text normalization passed');

// 2. Stats calculation
const stats = getStats('Xin chào Việt Nam. Đây là bài kiểm tra độ dài.');
assert(stats.charCount > 20, 'Character count valid');
assert(stats.wordCount >= 9, 'Word count valid');
console.log('✓ Text statistics calculation passed');

// 3. Sentence segmentation
const longText = 'Câu thứ nhất rất quan trọng. Câu thứ hai tiếp nối câu đầu! Câu thứ ba mang tính khẳng định? Câu thứ tư kết thúc đoạn văn.';
const segmented = segmentText(longText, 60);
assert(segmented.segments.length >= 2, 'Long text segmented properly');
assert(segmented.totalChars === longText.length, 'Total character count preserved');
console.log('✓ Sentence segmentation passed');

// 4. Filename generation
const fname = generateAudioFilename('voicecraft', 'Kore', 'mc_host', 'wav');
assert(fname.startsWith('voicecraft_kore_mc_host_'), 'Filename pattern valid');
assert(fname.endsWith('.wav'), 'File extension valid');
console.log('✓ Filename generation passed');

// 5. Format duration & bytes
assert(formatDuration(65) === '01:05', 'Duration formatting 65s == 01:05');
assert(formatDuration(0) === '00:00', 'Duration formatting 0s == 00:00');
assert(formatBytes(1024) === '1 KB', 'Bytes formatting 1024 == 1 KB');
console.log('✓ Duration & byte formatting passed');

console.log('--- All 5 Verification Tests Passed Successfully! ---');
