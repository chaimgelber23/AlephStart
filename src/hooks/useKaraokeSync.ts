'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { WordTiming } from '@/types';

interface UseKaraokeSyncOptions {
  words: string[];
  wordTimings?: WordTiming[];
  isPlaying: boolean;
  duration?: number;
  speed?: number;
  onWordChange?: (index: number) => void;
}

interface UseKaraokeSyncReturn {
  currentWordIndex: number;
  progress: number;
  reset: () => void;
}

export function useKaraokeSync({
  words,
  wordTimings,
  isPlaying,
  duration,
  speed,
  onWordChange,
}: UseKaraokeSyncOptions): UseKaraokeSyncReturn {
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [progress, setProgress] = useState<number>(0);

  const animationFrameRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevWordIndexRef = useRef<number>(-1);
  const onWordChangeRef = useRef(onWordChange);

  // Refs for speed-aware cumulative tracking (precise mode)
  const audioPositionRef = useRef<number>(0);
  const lastTickTimeRef = useRef<number>(0);
  const speedRef = useRef(speed || 1);

  // Keep refs up to date
  useEffect(() => {
    onWordChangeRef.current = onWordChange;
  }, [onWordChange]);

  useEffect(() => {
    speedRef.current = speed || 1;
  }, [speed]);

  // Fire onWordChange whenever currentWordIndex changes
  useEffect(() => {
    if (currentWordIndex !== prevWordIndexRef.current) {
      prevWordIndexRef.current = currentWordIndex;
      onWordChangeRef.current?.(currentWordIndex);
    }
  }, [currentWordIndex]);

  const reset = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    audioPositionRef.current = 0;
    lastTickTimeRef.current = 0;
    setCurrentWordIndex(-1);
    setProgress(0);
  }, []);

  // --- Precise mode (wordTimings provided) ---
  useEffect(() => {
    if (!wordTimings || wordTimings.length === 0) return;
    if (words.length === 0) return;

    if (!isPlaying) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      audioPositionRef.current = 0;
      lastTickTimeRef.current = 0;
      setCurrentWordIndex(-1);
      setProgress(0);
      return;
    }

    // Start playing: reset cumulative tracking
    audioPositionRef.current = 0;
    lastTickTimeRef.current = performance.now();
    setCurrentWordIndex(0);

    const totalDuration = wordTimings[wordTimings.length - 1].endMs;

    const tick = () => {
      const now = performance.now();
      const wallDelta = now - lastTickTimeRef.current;
      lastTickTimeRef.current = now;

      // Accumulate audio position scaled by current speed
      audioPositionRef.current += wallDelta * speedRef.current;
      const elapsed = audioPositionRef.current;

      // If we've exceeded the total duration, finish
      if (elapsed >= totalDuration) {
        setCurrentWordIndex(words.length - 1);
        setProgress(1);
        animationFrameRef.current = null;
        return;
      }

      // Find the word whose timing window contains the current elapsed time
      let foundIndex = -1;
      for (let i = 0; i < wordTimings.length; i++) {
        if (elapsed >= wordTimings[i].startMs && elapsed < wordTimings[i].endMs) {
          foundIndex = i;
          break;
        }
        if (
          elapsed >= wordTimings[i].endMs &&
          (i + 1 >= wordTimings.length || elapsed < wordTimings[i + 1].startMs)
        ) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex >= 0) {
        setCurrentWordIndex(foundIndex);
      }

      setProgress(Math.min(elapsed / totalDuration, 1));
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying, wordTimings, words.length]);

  // --- Even-split fallback (no wordTimings) ---
  useEffect(() => {
    if (wordTimings && wordTimings.length > 0) return;
    if (words.length === 0) return;

    if (!isPlaying) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentWordIndex(-1);
      setProgress(0);
      return;
    }

    // Estimate duration, scaled by speed
    const currentSpeed = speedRef.current;
    const estimatedDuration = words.length * 400;
    const baseDuration = duration || estimatedDuration;
    const adjustedDuration = baseDuration / currentSpeed;
    const msPerWord = adjustedDuration / words.length;

    let wordIdx = 0;
    setCurrentWordIndex(0);
    setProgress(0);

    intervalRef.current = setInterval(() => {
      wordIdx += 1;

      if (wordIdx >= words.length) {
        setCurrentWordIndex(words.length - 1);
        setProgress(1);
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      setCurrentWordIndex(wordIdx);
      setProgress(wordIdx / (words.length - 1));
    }, msPerWord);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, wordTimings, words.length, duration, speed]);

  // Clean up everything on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    currentWordIndex,
    progress,
    reset,
  };
}
