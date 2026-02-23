'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import type { Vowel, Pronunciation, VoiceGender } from '@/types';

const PRONUNCIATION_SUFFIX: Record<Pronunciation, string> = {
  modern: '',
  american: '-american',
};

const GENDER_SUFFIX: Record<VoiceGender, string> = {
  male: '',
  female: '-female',
};

interface VowelCardProps {
  vowel: Vowel;
  exampleLetter?: string; // e.g. 'ב' to show the vowel under a letter
  isActive?: boolean;
  pronunciation?: Pronunciation;
}

export function VowelCard({ vowel, exampleLetter = 'ב', isActive = false, pronunciation = 'modern' }: VowelCardProps) {
  const voiceGender = useUserStore((s) => s.profile.voiceGender) || 'male';
  const suffix = PRONUNCIATION_SUFFIX[pronunciation] ?? '';
  const gSuffix = GENDER_SUFFIX[voiceGender] ?? '';
  const nameAudioUrl = `/audio/vowels/${vowel.id}${suffix}${gSuffix}.mp3`;
  const soundAudioUrl = `/audio/vowels/${vowel.id}-sound${suffix}${gSuffix}.mp3`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white rounded-2xl shadow-sm border-2 p-6
        flex flex-col items-center gap-3
        transition-all duration-300
        ${isActive ? 'shadow-lg' : 'border-gray-100'}
      `}
      style={isActive ? { borderColor: vowel.color, boxShadow: `0 4px 20px ${vowel.color}20` } : undefined}
    >
      {/* Color dot indicator */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vowel.color }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: vowel.color }}>
          {vowel.soundGroup === 'chataf' ? 'Chataf' : vowel.soundGroup.toUpperCase()} vowel
        </span>
      </div>

      {/* Vowel mark shown under an example letter */}
      <div className="flex flex-col items-center">
        <span
          dir="rtl"
          className="font-['Noto_Serif_Hebrew',serif] text-6xl text-[#1A1A2E] leading-[2]"
        >
          {exampleLetter}{vowel.hebrew}
        </span>
      </div>

      {/* Vowel name and sound */}
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground">{vowel.name}</p>
        <p className="text-sm text-gray-500">
          Sound: <span className="font-medium" style={{ color: vowel.color }}>{vowel.sound}</span>
        </p>
      </div>

      {/* Audio buttons — Pronounce + Sound (mirrors LetterCard) */}
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const audio = new Audio(nameAudioUrl);
            audio.onerror = () => {
              // Fallback: try without gender suffix, then without pronunciation suffix
              if (gSuffix) {
                const fb = new Audio(`/audio/vowels/${vowel.id}${suffix}.mp3`);
                fb.onerror = () => {
                  if (suffix) new Audio(`/audio/vowels/${vowel.id}.mp3`).play().catch(() => {});
                };
                fb.play().catch(() => {});
              } else if (suffix) {
                new Audio(`/audio/vowels/${vowel.id}.mp3`).play().catch(() => {});
              }
            };
            audio.play().catch(() => {});
          }}
          className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all"
          style={{ backgroundColor: vowel.color }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
          Pronounce
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const audio = new Audio(soundAudioUrl);
            audio.onerror = () => {
              if (gSuffix) {
                const fb = new Audio(`/audio/vowels/${vowel.id}-sound${suffix}.mp3`);
                fb.onerror = () => {
                  if (suffix) new Audio(`/audio/vowels/${vowel.id}-sound.mp3`).play().catch(() => {});
                };
                fb.play().catch(() => {});
              } else if (suffix) {
                new Audio(`/audio/vowels/${vowel.id}-sound.mp3`).play().catch(() => {});
              }
            };
            audio.play().catch(() => {});
          }}
          className="flex items-center gap-1.5 border-2 text-sm font-medium px-4 py-2.5 rounded-xl hover:opacity-80 active:scale-95 transition-all"
          style={{ borderColor: vowel.color, color: vowel.color }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 010 7.07" />
          </svg>
          Sound
        </button>
      </div>

      {/* Description */}
      <div className="bg-background rounded-xl p-3 w-full">
        <p className="text-sm text-gray-600 text-center">{vowel.description}</p>
      </div>
    </motion.div>
  );
}
