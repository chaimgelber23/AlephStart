'use client';

import { useState, useRef, useCallback } from 'react';
import type { AudioSource, Pronunciation } from '@/types';

type AudioMode = 'hebrew' | 'transliteration';

// ── Hadar rabbi recording map ────────────────────────────────────────

type RabbiId = 'diamond' | 'richman' | 'weiss';

interface FullPrayerMapping {
  type: 'full-prayer';
  hadarDir: string;
  rabbis: RabbiId[];
}

interface PerSectionMapping {
  type: 'per-section';
  sectionMap: Record<string, { hadarDir: string; rabbis: RabbiId[] }>;
}

/**
 * Maps AlephStart prayerIds → Hadar recording directories.
 * 'full-prayer' = one recording covers all sections of that prayer.
 * 'per-section' = individual section recordings exist.
 */
const HADAR_PRAYER_MAP: Record<string, FullPrayerMapping | PerSectionMapping> = {
  'shema': {
    type: 'full-prayer',
    hadarDir: 'shema',
    rabbis: ['diamond', 'richman', 'weiss'],
  },
  'ahavah-rabbah': {
    type: 'full-prayer',
    hadarDir: 'ahavah-rabbah',
    rabbis: ['diamond', 'richman', 'weiss'],
  },
  'emet-vyatziv': {
    type: 'full-prayer',
    hadarDir: 'emet-vyatziv',
    rabbis: ['diamond', 'richman', 'weiss'],
  },
  'yotzer-or': {
    type: 'full-prayer',
    hadarDir: 'yotzer-or',
    rabbis: ['diamond', 'richman', 'weiss'],
  },
  'shemoneh-esrei': {
    type: 'per-section',
    sectionMap: {
      'se-01-avot': { hadarDir: 'shemoneh-esrei-avot', rabbis: ['diamond', 'richman', 'weiss'] },
      'se-02-gevurot': { hadarDir: 'shemoneh-esrei-gevurot', rabbis: ['diamond', 'richman', 'weiss'] },
      'se-03-kedushah': { hadarDir: 'shemoneh-esrei-kedusha', rabbis: ['diamond', 'richman', 'weiss'] },
    },
  },
};

function resolveRabbiAudio(
  prayerId: string,
  sectionId: string,
  rabbiId: RabbiId,
): { url: string; isFullPrayer: boolean } | null {
  const mapping = HADAR_PRAYER_MAP[prayerId];
  if (!mapping) return null;

  if (mapping.type === 'full-prayer') {
    if (!mapping.rabbis.includes(rabbiId)) return null;
    return {
      url: `/audio/sources/hadar/${mapping.hadarDir}/${rabbiId}.mp3`,
      isFullPrayer: true,
    };
  }

  const sectionMapping = mapping.sectionMap[sectionId];
  if (!sectionMapping || !sectionMapping.rabbis.includes(rabbiId)) return null;
  return {
    url: `/audio/sources/hadar/${sectionMapping.hadarDir}/${rabbiId}.mp3`,
    isFullPrayer: false,
  };
}

// ── TTS static file resolution ───────────────────────────────────────

const PRONUNCIATION_SUFFIX: Record<Pronunciation, string> = {
  modern: '',
  american: '-american',
};

async function tryStaticFile(
  prayerId: string,
  sectionId: string,
  pronunciation: Pronunciation,
): Promise<string | null> {
  const suffix = PRONUNCIATION_SUFFIX[pronunciation] ?? '';
  const base = `/audio/prayers/${prayerId}/${sectionId}`;

  const candidates: string[] = [];
  if (suffix) candidates.push(`${base}${suffix}.mp3`);
  candidates.push(`${base}.mp3`);

  for (const url of candidates) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) return url;
    } catch {
      // try next
    }
  }
  return null;
}

// ── Hook ─────────────────────────────────────────────────────────────

interface UseAudioOptions {
  speed?: number;
  onEnded?: () => void;
  audioSource?: AudioSource;
}

export function useAudio(options?: UseAudioOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [isFullPrayerAudio, setIsFullPrayerAudio] = useState(false);
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
    setIsFullPrayerAudio(false);

    const speed = speedOverride ?? options?.speed ?? 1.0;
    const audioSource = options?.audioSource ?? 'tts-modern';

    try {
      if (prayerId && sectionId) {
        // Rabbi source — try rabbi file first, fall back to TTS
        if (audioSource.startsWith('rabbi-')) {
          const rabbiId = audioSource.replace('rabbi-', '') as RabbiId;
          const result = resolveRabbiAudio(prayerId, sectionId, rabbiId);
          if (result) {
            setIsFullPrayerAudio(result.isFullPrayer);
            await playAudioUrl(result.url, speed, false);
            setIsLoading(false);
            return;
          }
          // No rabbi recording → fall back to TTS modern
          const fallbackUrl = await tryStaticFile(prayerId, sectionId, 'modern');
          if (fallbackUrl) {
            await playAudioUrl(fallbackUrl, speed, false);
            setIsLoading(false);
            return;
          }
        } else {
          // TTS source
          const pronunciation: Pronunciation =
            audioSource === 'tts-american' ? 'american' : 'modern';
          const staticUrl = await tryStaticFile(prayerId, sectionId, pronunciation);
          if (staticUrl) {
            await playAudioUrl(staticUrl, speed, false);
            setIsLoading(false);
            return;
          }
        }
      }

      setIsUnavailable(true);
      setError('Audio not yet available for this section');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audio unavailable');
    } finally {
      setIsLoading(false);
    }
  }, [stop, options?.speed, options?.audioSource, playAudioUrl]);

  return { play, stop, isPlaying, isLoading, isUnavailable, isFullPrayerAudio, error, setSpeed };
}
