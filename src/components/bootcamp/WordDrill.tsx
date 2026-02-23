'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioButton } from '@/components/ui/AudioButton';
import type { BootcampPracticeWord } from '@/types';

interface WordDrillProps {
  words: BootcampPracticeWord[];
  onComplete: (score: number, total: number) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function WordDrill({ words, onComplete }: WordDrillProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [options, setOptions] = useState<BootcampPracticeWord[]>([]);

  const currentWord = words[currentIndex];
  const isCorrect = selectedAnswer === currentWord?.transliteration;
  const total = words.length;

  // Generate options for current question
  const generateOptions = useCallback(() => {
    if (!currentWord) return;
    const distractors = words
      .filter((w) => w.transliteration !== currentWord.transliteration)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setOptions(shuffleArray([currentWord, ...distractors]));
  }, [currentWord, words]);

  useEffect(() => {
    generateOptions();
  }, [generateOptions]);

  const handleSelect = (transliteration: string) => {
    if (selectedAnswer) return; // Already answered
    setSelectedAnswer(transliteration);

    const correct = transliteration === currentWord.transliteration;
    if (correct) setScore((s) => s + 1);

    // Auto-advance after delay
    setTimeout(() => {
      if (currentIndex + 1 >= total) {
        onComplete(score + (correct ? 1 : 0), total);
      } else {
        setCurrentIndex((i) => i + 1);
        setSelectedAnswer(null);
      }
    }, 1200);
  };

  if (!currentWord) return null;

  return (
    <div className="space-y-6">
      {/* Progress counter */}
      <div className="text-center">
        <span className="text-sm text-gray-500">
          Word {currentIndex + 1} of {total}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {/* Hebrew word display */}
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 flex flex-col items-center gap-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Which word is this?</p>
            <span
              dir="rtl"
              className="font-['Noto_Serif_Hebrew',serif] text-5xl text-[#1A1A2E] leading-[2]"
            >
              {currentWord.hebrew}
            </span>
            <AudioButton audioUrl={currentWord.audioUrl} label="Hear the word" size="md" variant="outline" />
          </div>

          {/* Answer options (2x2) */}
          <div className="grid grid-cols-2 gap-3">
            {options.map((opt) => {
              const isSelected = selectedAnswer === opt.transliteration;
              const isCorrectAnswer = opt.transliteration === currentWord.transliteration;
              let bgColor = 'bg-white border-gray-200 hover:border-primary-light';

              if (selectedAnswer) {
                if (isCorrectAnswer) {
                  bgColor = 'bg-success/10 border-success';
                } else if (isSelected) {
                  bgColor = 'bg-error/10 border-error';
                } else {
                  bgColor = 'bg-white border-gray-100 opacity-50';
                }
              }

              return (
                <button
                  key={opt.transliteration}
                  onClick={() => handleSelect(opt.transliteration)}
                  disabled={!!selectedAnswer}
                  className={`
                    ${bgColor}
                    border-2 rounded-xl p-4 text-center transition-all
                    ${!selectedAnswer ? 'active:scale-[0.97]' : ''}
                  `}
                >
                  <p className="font-medium text-foreground">{opt.transliteration}</p>
                  {selectedAnswer && (
                    <p className="text-xs text-gray-500 mt-1">{opt.translation}</p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {selectedAnswer && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center font-medium ${isCorrect ? 'text-success' : 'text-error'}`}
            >
              {isCorrect ? '✓ Correct!' : `✗ That was "${currentWord.transliteration}" — ${currentWord.translation}`}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
