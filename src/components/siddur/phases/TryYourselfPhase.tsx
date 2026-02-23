'use client';

import { motion } from 'framer-motion';
import type { PrayerSection } from '@/types';

interface TryYourselfPhaseProps {
  section: PrayerSection;
  showTranslation: boolean;
  onAdvance: () => void;
}

export function TryYourselfPhase({
  section,
  showTranslation,
  onAdvance,
}: TryYourselfPhaseProps) {
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
          Try reading the Hebrew on your own. The transliteration is there if
          you need it. When you&apos;ve said it, tap Done.
        </p>
      </div>

      {/* Text display */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        {/* Hebrew */}
        <div dir="rtl" className="text-center">
          <p className="font-[var(--font-hebrew-serif)] text-3xl text-[#1A1A2E] leading-[2]">
            {section.hebrewText}
          </p>
        </div>

        {/* Transliteration */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-primary/40 font-semibold mb-0.5">How to say it</p>
          <p className="text-lg font-medium text-primary italic">
            {section.transliteration}
          </p>
        </div>

        {/* Translation — faded if preference says so */}
        {showTranslation && (
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-primary/40 font-semibold mb-0.5">What it means</p>
            <p className="text-sm text-gray-300">
              {section.translation}
            </p>
          </div>
        )}
      </div>

      {/* Done button */}
      <button
        onClick={onAdvance}
        className="w-full py-3.5 rounded-xl text-sm font-medium bg-success text-white hover:bg-[#3d6a4a] active:scale-[0.98] transition-all"
      >
        Done
      </button>
    </motion.div>
  );
}
