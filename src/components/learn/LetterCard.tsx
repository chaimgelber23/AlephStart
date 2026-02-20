'use client';

import { motion } from 'framer-motion';
import { HebrewText } from '@/components/ui/HebrewText';
import { AudioButton } from '@/components/ui/AudioButton';
import type { Letter, Pronunciation } from '@/types';

const PRONUNCIATION_SUFFIX: Record<Pronunciation, string> = {
  modern: '',
  american: '-american',
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
  const suffix = PRONUNCIATION_SUFFIX[pronunciation] ?? '';
  const nameAudioUrl = `/audio/letters/${letter.id}${suffix}.mp3`;
  const soundAudioUrl = `/audio/letters/${letter.id}-sound${suffix}.mp3`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white rounded-2xl shadow-sm border-2 p-8
        flex flex-col items-center gap-4
        transition-all duration-300
        ${isActive ? 'border-[#1B4965] shadow-lg shadow-[#1B4965]/10' : 'border-gray-100'}
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
            <p className="text-lg font-semibold text-[#2D3142]">{letter.name}</p>
            <p className="text-sm text-gray-500">
              Sound: <span className="font-medium text-[#1B4965]">{letter.sound}</span>
            </p>
          </div>

          {/* Audio buttons — Pronounce + Sound */}
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const audio = new Audio(nameAudioUrl);
                audio.play().catch(() => {});
              }}
              className="flex items-center gap-1.5 bg-[#1B4965] text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-[#163d55] active:scale-95 transition-all"
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
                audio.play().catch(() => {});
              }}
              className="flex items-center gap-1.5 border-2 border-[#1B4965] text-[#1B4965] text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-[#1B4965]/5 active:scale-95 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M15.54 8.46a5 5 0 010 7.07" />
              </svg>
              Sound
            </button>
          </div>

          {/* Mnemonic */}
          {showMnemonic && letter.mnemonic && (
            <div className="bg-[#FEFDFB] rounded-xl p-4 w-full">
              <p className="text-sm text-gray-600 text-center italic">
                {letter.mnemonic}
              </p>
            </div>
          )}

          {/* Confusable hint */}
          {letter.confusableHint && (
            <div className="bg-[#FEF3C7] rounded-xl p-3 w-full">
              <p className="text-xs text-amber-700 text-center">
                {letter.confusableHint}
              </p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
