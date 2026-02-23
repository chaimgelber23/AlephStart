'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AudioButton } from '@/components/ui/AudioButton';
import type { BootcampCulminatingReading } from '@/types';

interface ReadingDisplayProps {
  reading: BootcampCulminatingReading;
  onComplete: () => void;
}

export function ReadingDisplay({ reading, onComplete }: ReadingDisplayProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  const line = reading.lines[currentLine];
  const isLastLine = currentLine === reading.lines.length - 1;

  return (
    <div className="space-y-6">
      {/* Title and description */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">{reading.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{reading.description}</p>
      </div>

      {/* Line indicator dots */}
      {reading.lines.length > 1 && (
        <div className="flex justify-center gap-2">
          {reading.lines.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentLine ? 'bg-primary' : i < currentLine ? 'bg-success' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      )}

      {/* Reading card */}
      <motion.div
        key={currentLine}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl border-2 border-primary/20 p-8 space-y-4"
      >
        {/* Hebrew text */}
        <div className="text-center">
          <span
            dir="rtl"
            className="font-['Noto_Serif_Hebrew',serif] text-4xl text-[#1A1A2E] leading-[2.5] block"
          >
            {line.hebrew}
          </span>
        </div>

        {/* Audio */}
        <div className="flex justify-center">
          <AudioButton audioUrl={line.audioUrl} label="Hear this line" size="lg" />
        </div>

        {/* Transliteration */}
        {showTransliteration && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-lg text-gray-500 italic"
          >
            {line.transliteration}
          </motion.p>
        )}

        {/* Translation */}
        {showTranslation && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-base text-gray-400"
          >
            {line.translation}
          </motion.p>
        )}
      </motion.div>

      {/* Toggle buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setShowTransliteration(!showTransliteration)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            showTransliteration
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-500 border-gray-200'
          }`}
        >
          Transliteration {showTransliteration ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            showTranslation
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-500 border-gray-200'
          }`}
        >
          Translation {showTranslation ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentLine > 0 && (
          <button
            onClick={() => setCurrentLine((i) => i - 1)}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            Previous Line
          </button>
        )}
        <button
          onClick={() => {
            if (isLastLine) {
              onComplete();
            } else {
              setCurrentLine((i) => i + 1);
            }
          }}
          className="flex-1 py-3 rounded-xl bg-primary text-white font-medium hover:bg-[#163d55] active:scale-[0.98] transition-all"
        >
          {isLastLine ? 'I Read It!' : 'Next Line'}
        </button>
      </div>
    </div>
  );
}
