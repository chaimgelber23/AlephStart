'use client';

import { motion } from 'framer-motion';
import type { Prayer } from '@/types';

interface ContextPhaseProps {
  prayer: Prayer;
  onAdvance: () => void;
}

export function ContextPhase({ prayer, onAdvance }: ContextPhaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-5"
    >
      {/* Prayer name */}
      <div className="text-center">
        <p
          dir="rtl"
          className="font-[var(--font-hebrew-serif)] text-4xl text-primary leading-relaxed"
        >
          {prayer.nameHebrew}
        </p>
        <h2 className="text-xl font-bold text-foreground mt-1">
          {prayer.nameEnglish}
        </h2>
      </div>

      {/* When it's said */}
      <div className="bg-primary/5 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">&#x1F559;</span>
          <div>
            <p className="text-sm font-medium text-primary">When</p>
            <p className="text-sm text-gray-600 mt-0.5">{prayer.whenSaid}</p>
          </div>
        </div>
      </div>

      {/* Why / deeper meaning */}
      <div className="bg-gold/5 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">&#x1F4A1;</span>
          <div>
            <p className="text-sm font-medium text-gold">Deeper Meaning</p>
            <p className="text-sm text-gray-600 mt-1">{prayer.inspirationText}</p>
            {prayer.whySaid && (
              <p className="text-sm text-gray-500 mt-2 italic">{prayer.whySaid}</p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onAdvance}
        className="w-full bg-primary text-white py-4 rounded-xl text-base font-medium hover:bg-[#163d55] active:scale-[0.98] transition-all"
      >
        Let&apos;s Learn It
      </button>
    </motion.div>
  );
}
