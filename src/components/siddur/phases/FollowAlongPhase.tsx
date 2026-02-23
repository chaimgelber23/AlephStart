'use client';

import { motion } from 'framer-motion';
import type { PrayerSection } from '@/types';

interface FollowAlongPhaseProps {
  section: PrayerSection;
  onAdvance: () => void;
}

export function FollowAlongPhase({
  section,
  onAdvance,
}: FollowAlongPhaseProps) {
  const hebrewWords = section.hebrewText.split(' ');
  const translitWords = section.transliteration.split(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-5"
    >
      {/* Instruction */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Point to each Hebrew word from right to left and say the
          transliteration below it out loud. Take your time — there&apos;s no rush.
        </p>
      </div>

      {/* Text display with word-by-word layout */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        {/* Hebrew words */}
        <div dir="rtl" className="text-center">
          <div className="flex flex-wrap justify-center gap-2 leading-[2.5]">
            {hebrewWords.map((word, i) => (
              <span
                key={i}
                className="font-[var(--font-hebrew-serif)] text-3xl px-1 py-0.5 rounded text-[#1A1A2E]"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Transliteration words */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-primary/40 font-semibold mb-1">How to say it</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {translitWords.map((word, i) => (
              <span
                key={i}
                className="text-base italic text-gray-400"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Translation */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-primary/40 font-semibold mb-0.5">What it means</p>
          <p className="text-sm text-gray-400">
            {section.translation}
          </p>
        </div>
      </div>

      {/* Continue button */}
      <button
        onClick={onAdvance}
        className="w-full py-3.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-[#163d55] active:scale-[0.98] transition-all"
      >
        Continue
      </button>
    </motion.div>
  );
}
