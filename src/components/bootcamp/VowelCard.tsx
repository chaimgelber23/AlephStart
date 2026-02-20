'use client';

import { motion } from 'framer-motion';
import { AudioButton } from '@/components/ui/AudioButton';
import type { Vowel } from '@/types';

interface VowelCardProps {
  vowel: Vowel;
  exampleLetter?: string; // e.g. 'ב' to show the vowel under a letter
  isActive?: boolean;
}

export function VowelCard({ vowel, exampleLetter = 'ב', isActive = false }: VowelCardProps) {
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
        <p className="text-lg font-semibold text-[#2D3142]">{vowel.name}</p>
        <p className="text-sm text-gray-500">
          Sound: <span className="font-medium" style={{ color: vowel.color }}>{vowel.sound}</span>
        </p>
      </div>

      {/* Audio */}
      <AudioButton audioUrl={vowel.audioUrl} label={`Hear ${vowel.name}`} size="md" />

      {/* Description */}
      <div className="bg-[#FEFDFB] rounded-xl p-3 w-full">
        <p className="text-sm text-gray-600 text-center">{vowel.description}</p>
      </div>
    </motion.div>
  );
}
