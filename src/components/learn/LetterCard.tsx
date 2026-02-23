'use client';

import { motion } from 'framer-motion';
import { HebrewText } from '@/components/ui/HebrewText';
import { AudioButton } from '@/components/ui/AudioButton';
import { useUserStore } from '@/stores/userStore';
import type { Letter, Pronunciation, VoiceGender } from '@/types';

const PRONUNCIATION_SUFFIX: Record<Pronunciation, string> = {
  modern: '',
  american: '-american',
};

const GENDER_SUFFIX: Record<VoiceGender, string> = {
  male: '',
  female: '-female',
};

interface LetterCardProps {
  letter: Letter;
  showDetails?: boolean;
  showMnemonic?: boolean;
  isActive?: boolean;
  pronunciation?: Pronunciation;
  onTap?: () => void;
}

export function LetterCard({
  letter,
  showDetails = true,
  showMnemonic = true,
  isActive = false,
  pronunciation = 'modern',
  onTap,
}: LetterCardProps) {
  const voiceGender = useUserStore((s) => s.profile.voiceGender) || 'male';
  const suffix = PRONUNCIATION_SUFFIX[pronunciation] ?? '';
  const gSuffix = GENDER_SUFFIX[voiceGender] ?? '';
  const nameAudioUrl = `/audio/letters/${letter.id}${suffix}${gSuffix}.mp3`;
  const soundAudioUrl = `/audio/letters/${letter.id}-sound${suffix}${gSuffix}.mp3`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white rounded-2xl shadow-sm border-2 p-8
        flex flex-col items-center gap-4
        transition-all duration-300
        ${isActive ? 'border-primary shadow-lg shadow-primary/10' : 'border-gray-100'}
        ${onTap ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : ''}
      `}
      onClick={onTap}
    >
      {/* Large Hebrew Letter */}
      <HebrewText size="2xl">
        {letter.hebrew}
      </HebrewText>

      {showDetails && (
        <>
          {/* Letter name and sound */}
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">{letter.name}</p>
            <p className="text-sm text-gray-500">
              Sound: <span className="font-medium text-primary">{letter.sound}</span>
            </p>
          </div>

          {/* Audio buttons — Pronounce + Sound */}
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const audio = new Audio(nameAudioUrl);
                audio.onerror = () => {
                  if (gSuffix) new Audio(`/audio/letters/${letter.id}${suffix}.mp3`).play().catch(() => {});
                };
                audio.play().catch(() => {});
              }}
              className="flex items-center gap-1.5 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-[#163d55] active:scale-95 transition-all"
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
                  if (gSuffix) new Audio(`/audio/letters/${letter.id}-sound${suffix}.mp3`).play().catch(() => {});
                };
                audio.play().catch(() => {});
              }}
              className="flex items-center gap-1.5 border-2 border-primary text-primary text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-primary/5 active:scale-95 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M15.54 8.46a5 5 0 010 7.07" />
              </svg>
              Sound
            </button>
          </div>

          {/* Mnemonic — only when actively teaching */}
          {showMnemonic && isActive && letter.mnemonic && (
            <p className="text-xs text-gray-400 text-center italic">{letter.mnemonic}</p>
          )}

          {/* Confusable hint — only when actively teaching */}
          {isActive && letter.confusableHint && (
            <p className="text-xs text-amber-600 text-center">{letter.confusableHint}</p>
          )}
        </>
      )}
    </motion.div>
  );
}
