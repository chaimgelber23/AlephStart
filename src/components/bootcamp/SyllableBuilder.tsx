'use client';

import { motion } from 'framer-motion';
import { AudioButton } from '@/components/ui/AudioButton';
import type { BootcampSyllable } from '@/types';

interface SyllableBuilderProps {
  syllables: BootcampSyllable[];
  onComplete?: () => void;
}

export function SyllableBuilder({ syllables, onComplete }: SyllableBuilderProps) {
  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-gray-500 mb-2">
        Tap each syllable to hear how the letter and vowel combine
      </p>

      <div className="grid grid-cols-3 gap-3">
        {syllables.map((syl, i) => (
          <motion.div
            key={`${syl.letterId}-${syl.vowelId}-${i}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col items-center gap-1.5 hover:shadow-md transition-shadow"
          >
            <span
              dir="rtl"
              className="font-['Noto_Serif_Hebrew',serif] text-3xl text-[#1A1A2E] leading-[2]"
            >
              {syl.hebrew}
            </span>
            <span className="text-xs text-gray-500">{syl.transliteration}</span>
            <AudioButton audioUrl={syl.audioUrl} label={`Hear ${syl.transliteration}`} size="sm" variant="ghost" />
          </motion.div>
        ))}
      </div>

      {onComplete && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={onComplete}
          className="w-full mt-4 bg-[#1B4965] text-white py-3 rounded-xl font-medium hover:bg-[#163d55] active:scale-[0.98] transition-all"
        >
          Continue
        </motion.button>
      )}
    </div>
  );
}
