/**
 * Audio Export & Blob Management Utility
 */

const createdObjectUrls = new Set<string>();

/**
 * Converts a base64 encoded string to a Blob
 */
export function base64ToBlob(base64: string, mimeType: string = 'audio/wav'): Blob {
  const cleanBase64 = base64.replace(/^data:audio\/\w+;base64,/, '');
  const byteCharacters = atob(cleanBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Creates an Object URL and tracks it for future cleanup
 */
export function createTrackedBlobUrl(blob: Blob): string {
  const url = URL.createObjectURL(blob);
  createdObjectUrls.add(url);
  return url;
}

/**
 * Revokes a tracked Object URL
 */
export function revokeTrackedBlobUrl(url: string | undefined): void {
  if (!url) return;
  if (createdObjectUrls.has(url)) {
    URL.revokeObjectURL(url);
    createdObjectUrls.delete(url);
  }
}

/**
 * Revokes all tracked Object URLs (useful on unmount or cleanup)
 */
export function cleanupAllBlobUrls(): void {
  createdObjectUrls.forEach((url) => {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignore
    }
  });
  createdObjectUrls.clear();
}

/**
 * Generates a clean, safe filename for audio download
 */
export function generateAudioFilename(prefix: string = 'voicecraft', voice: string, style: string, ext: string = 'wav'): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const safeVoice = voice.toLowerCase().replace(/[^a-z0-9]/g, '');
  const safeStyle = style.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20);
  return `${prefix}_${safeVoice}_${safeStyle}_${dateStr}.${ext}`;
}

/**
 * Triggers native browser download for a Blob or Blob URL
 */
export function downloadAudioFile(blobOrUrl: Blob | string, filename: string): void {
  const isUrl = typeof blobOrUrl === 'string';
  const url = isUrl ? blobOrUrl : URL.createObjectURL(blobOrUrl);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  if (!isUrl) {
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}

/**
 * Formats byte size into human readable string (KB, MB)
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Formats seconds into MM:SS display
 */
export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
