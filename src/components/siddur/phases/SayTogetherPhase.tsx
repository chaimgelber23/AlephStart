'use client';

import { motion } from 'framer-motion';
import type { PrayerSection } from '@/types';

interface SayTogetherPhaseProps {
  section: PrayerSection;
  onAdvance: () => void;
}

export function SayTogetherPhase({
  section,
  onAdvance,
}: SayTogetherPhaseProps) {
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
          Say the entire section out loud using the transliteration below the
          Hebrew. Try to read a little faster this time.
        </p>
      </div>

      {/* Text display — transliteration more prominent */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        {/* Hebrew */}
        <div dir="rtl" className="text-center">
          <p className="font-[var(--font-hebrew-serif)] text-3xl text-[#1A1A2E] leading-[2]">
            {section.hebrewText}
          </p>
        </div>

        {/* Transliteration — larger, bolder for reading along */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-primary/40 font-semibold mb-0.5">How to say it</p>
          <p className="text-lg font-medium text-primary italic">
            {section.transliteration}
          </p>
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
