'use client';

import { motion } from 'framer-motion';
import { AudioButton } from '@/components/ui/AudioButton';
import type { Letter } from '@/types';

interface TwinPairCardProps {
  letterWithDagesh: Letter;
  letterWithout: Letter;
  hint: string;
}

export function TwinPairCard({ letterWithDagesh, letterWithout, hint }: TwinPairCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border-2 border-[#1B4965] p-6"
    >
      <p className="text-xs font-semibold text-[#C6973F] uppercase tracking-wider text-center mb-4">
        Twin Letters
      </p>

      <div className="flex items-center justify-center gap-6">
        {/* Letter with dagesh */}
        <div className="flex flex-col items-center gap-2">
          <span
            dir="rtl"
            className="font-['Noto_Serif_Hebrew',serif] text-6xl text-[#1A1A2E] leading-[2]"
          >
            {letterWithDagesh.hebrew}
          </span>
          <p className="text-base font-semibold text-[#2D3142]">{letterWithDagesh.name}</p>
          <p className="text-sm text-[#1B4965] font-medium">{letterWithDagesh.sound}</p>
          <AudioButton audioUrl={letterWithDagesh.audioUrl} label={`Hear ${letterWithDagesh.name}`} size="sm" />
        </div>

        {/* VS divider */}
        <div className="flex flex-col items-center">
          <div className="w-px h-12 bg-gray-200" />
          <span className="text-xs font-bold text-gray-400 my-2">VS</span>
          <div className="w-px h-12 bg-gray-200" />
        </div>

        {/* Letter without dagesh */}
        <div className="flex flex-col items-center gap-2">
          <span
            dir="rtl"
            className="font-['Noto_Serif_Hebrew',serif] text-6xl text-[#1A1A2E] leading-[2]"
          >
            {letterWithout.hebrew}
          </span>
          <p className="text-base font-semibold text-[#2D3142]">{letterWithout.name}</p>
          <p className="text-sm text-[#1B4965] font-medium">{letterWithout.sound}</p>
          <AudioButton audioUrl={letterWithout.audioUrl} label={`Hear ${letterWithout.name}`} size="sm" />
        </div>
      </div>

      {/* Hint */}
      <div className="bg-[#FEF3C7] rounded-xl p-3 mt-4">
        <p className="text-sm text-amber-700 text-center">
          💡 {hint}
        </p>
      </div>
    </motion.div>
  );
}
