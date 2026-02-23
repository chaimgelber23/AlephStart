'use client';

import { useState, useRef, useCallback } from 'react';
import type { Pronunciation } from '@/types';

type AudioMode = 'hebrew' | 'transliteration';

/**
 * File-suffix map for each pronunciation style.
 * 'modern' is the default (no suffix). Add new styles here.
 *
 * File convention:  /audio/prayers/{prayerId}/{sectionId}{suffix}.mp3
 *   modern   → modeh-ani-1.mp3
 *   american → modeh-ani-1-american.mp3
 *   (future) → modeh-ani-1-{style}.mp3
 */
const PRONUNCIATION_SUFFIX: Record<Pronunciation, string> = {
  modern: '',
  american: '-american',
};

interface UseAudioOptions {
  speed?: number;
  onEnded?: () => void;
  pronunciation?: Pronunciation;
}

/**
 * Try to play a pre-generated static file first.
 * Returns the URL if it exists, null otherwise.
 */
async function tryStaticFile(
  prayerId: string,
  sectionId: string,
  pronunciation: Pronunciation
): Promise<string | null> {
  const suffix = PRONUNCIATION_SUFFIX[pronunciation] ?? '';
  const url = `/audio/prayers/${prayerId}/${sectionId}${suffix}.mp3`;

  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (res.ok) return url;
  } catch {
    // static file doesn't exist
  }

  // Fall back to default (no-suffix) if the styled variant is missing
  if (suffix) {
    const fallbackUrl = `/audio/prayers/${prayerId}/${sectionId}.mp3`;
    try {
      const res = await fetch(fallbackUrl, { method: 'HEAD' });
      if (res.ok) return fallbackUrl;
    } catch {
      // no fallback either
    }
  }

  return null;
}

export function useAudio(options?: UseAudioOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUrlRef = useRef<string | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  const onEndedRef = useRef(options?.onEnded);
  onEndedRef.current = options?.onEnded;

  const playAudioUrl = useCallback(async (url: string, speed: number, isBlob: boolean) => {
    if (isBlob && currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
    }
    currentUrlRef.current = isBlob ? url : null;

    const audio = new Audio(url);
    audio.playbackRate = speed;
    audioRef.current = audio;

    audio.onended = () => {
      setIsPlaying(false);
      onEndedRef.current?.();
    };
    audio.onerror = () => {
      setIsPlaying(false);
      setError('Playback error');
    };

    await audio.play();
    setIsPlaying(true);
  }, []);

  const setSpeed = useCallback((newSpeed: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  }, []);

  const play = useCallback(async (
    text: string,
    mode: AudioMode = 'hebrew',
    speedOverride?: number,
    prayerId?: string,
    sectionId?: string,
  ) => {
    stop();
    setError(null);
    setIsLoading(true);
    setIsUnavailable(false);

    const speed = speedOverride ?? options?.speed ?? 1.0;
    const pronunciation = options?.pronunciation ?? 'modern';

    try {
      // Try pre-generated static file (uses pronunciation for file lookup)
      if (prayerId && sectionId) {
        const staticUrl = await tryStaticFile(prayerId, sectionId, pronunciation);
        if (staticUrl) {
          await playAudioUrl(staticUrl, speed, false);
          setIsLoading(false);
          return;
        }
      }

      // No static file available
      setIsUnavailable(true);
      setError('Audio not yet available for this section');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audio unavailable');
    } finally {
      setIsLoading(false);
    }
  }, [stop, options?.speed, options?.pronunciation, playAudioUrl]);

  return { play, stop, isPlaying, isLoading, isUnavailable, error, setSpeed };
}
