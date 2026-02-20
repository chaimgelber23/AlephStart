'use client';

import { motion } from 'framer-motion';
import { HebrewText } from '@/components/ui/HebrewText';
import { AudioButton } from '@/components/ui/AudioButton';
import type { Letter } from '@/types';

interface LetterCardProps {
  letter: Letter;
  showDetails?: boolean;
  showMnemonic?: boolean;
  isActive?: boolean;
  onTap?: () => void;
}

export function LetterCard({
  letter,
  showDetails = true,
  showMnemonic = true,
  isActive = false,
  onTap,
}: LetterCardProps) {
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

          {/* Audio button */}
          <AudioButton
            audioUrl={letter.audioUrl}
            label={`Hear ${letter.name}`}
            size="lg"
          />

          {/* Mnemonic */}
          {showMnemonic && letter.mnemonic && (
            <div className="bg-[#FEFDFB] rounded-xl p-4 w-full">
              <p className="text-sm text-gray-600 text-center italic">
                💡 {letter.mnemonic}
              </p>
            </div>
          )}

          {/* Confusable hint */}
          {letter.confusableHint && (
            <div className="bg-[#FEF3C7] rounded-xl p-3 w-full">
              <p className="text-xs text-amber-700 text-center">
                ⚠️ {letter.confusableHint}
              </p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
