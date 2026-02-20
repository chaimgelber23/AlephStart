'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useBootcampStore } from '@/stores/bootcampStore';
import { useUserStore } from '@/stores/userStore';
import { getBootcampDay } from '@/lib/content/bootcampDays';
import { getLetterById } from '@/lib/content/letters';
import { getVowelById } from '@/lib/content/vowels';
import { LetterCard } from '@/components/learn/LetterCard';
import { VowelCard } from '@/components/bootcamp/VowelCard';
import { TwinPairCard } from '@/components/bootcamp/TwinPairCard';
import { SyllableBuilder } from '@/components/bootcamp/SyllableBuilder';
import { WordDrill } from '@/components/bootcamp/WordDrill';
import { ReadingDisplay } from '@/components/bootcamp/ReadingDisplay';
import { BootcampProgressHeader } from '@/components/bootcamp/BootcampProgressHeader';
import { MilestoneToast } from '@/components/ui/MilestoneToast';
import type { BootcampDayNumber, MilestoneType, Letter, Vowel } from '@/types';

type Phase = 'review' | 'teach_letters' | 'teach_vowels' | 'drill' | 'reading';

export default function BootcampDayPage() {
  const params = useParams();
  const router = useRouter();
  const dayNumber = parseInt(params.day as string) as BootcampDayNumber;
  const dayData = getBootcampDay(dayNumber);

  const {
    startDay,
    completeTeachPhase,
    completeSyllablePhase,
    completeWordPhase,
    completeReadingPhase,
    isDayAvailable,
  } = useBootcampStore();
  const { updateSkillProgress, recordPractice, checkAndUpdateStreak, earnMilestone, hasMilestone } = useUserStore();
  const pronunciation = useUserStore((s) => s.profile.pronunciation);

  // Determine starting phase
  const hasReview = dayNumber > 1;
  const hasLetters = dayData ? dayData.letterGroups.length > 0 : false;
  const getInitialPhase = (): Phase => {
    if (hasReview) return 'review';
    return 'teach_letters';
  };

  const [phase, setPhase] = useState<Phase>(getInitialPhase);
  const [teachLetterGroupIdx, setTeachLetterGroupIdx] = useState(0);
  const [teachLetterIdx, setTeachLetterIdx] = useState(0);
  const [teachVowelGroupIdx, setTeachVowelGroupIdx] = useState(0);
  const [teachVowelIdx, setTeachVowelIdx] = useState(0);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewAnswer, setReviewAnswer] = useState<string | null>(null);
  const [milestone, setMilestone] = useState<MilestoneType | null>(null);

  // Start day on mount
  useState(() => {
    if (dayData && isDayAvailable(dayNumber)) {
      startDay(dayNumber);
    }
  });

  if (!dayData) {
    return (
      <div className="min-h-screen bg-[#FEFDFB] flex items-center justify-center">
        <p className="text-gray-500">Day not found</p>
      </div>
    );
  }

  // Collect all letters/vowels for this day
  const allLetterIds = dayData.letterGroups.flatMap((g) => g.letterIds);
  const allLetters = allLetterIds.map(getLetterById).filter(Boolean) as Letter[];
  const allVowelIds = dayData.vowelGroups.flatMap((g) => g.vowelIds);
  const allVowels = allVowelIds.map(getVowelById).filter(Boolean) as Vowel[];

  // Review letters from previous days
  const reviewLetterIds = dayData.reviewLetterIds || [];
  const reviewLetters = reviewLetterIds.map(getLetterById).filter(Boolean) as Letter[];
  const reviewQuestions = reviewLetters.slice(0, 6); // Max 6 review questions

  // Current teach state
  const currentLetterGroup = dayData.letterGroups[teachLetterGroupIdx];
  const currentVowelGroup = dayData.vowelGroups[teachVowelGroupIdx];

  // Count total teach steps for progress
  const totalLetterSteps = allLetters.length + dayData.letterGroups.filter((g) => g.twinPair).length;
  const totalVowelSteps = allVowels.length;
  const letterStepsSoFar = useMemo(() => {
    let count = 0;
    for (let gi = 0; gi < teachLetterGroupIdx; gi++) {
      count += dayData.letterGroups[gi].letterIds.length;
      if (dayData.letterGroups[gi].twinPair) count++;
    }
    count += teachLetterIdx;
    return count;
  }, [teachLetterGroupIdx, teachLetterIdx, dayData.letterGroups]);

  // Phase progress calculation
  const getOverallProgress = (): number => {
    const phases = [
      hasReview ? 'review' : null,
      hasLetters ? 'teach_letters' : null,
      'teach_vowels',
      'drill',
      'reading',
    ].filter(Boolean) as Phase[];
    const idx = phases.indexOf(phase);
    return idx / phases.length;
  };

  const getPhaseName = (): string => {
    switch (phase) {
      case 'review': return 'Review';
      case 'teach_letters': return 'Letters';
      case 'teach_vowels': return 'Vowels';
      case 'drill': return 'Practice';
      case 'reading': return 'Reading';
    }
  };

  const getPhaseStep = (): [number, number] => {
    switch (phase) {
      case 'review': return [reviewIdx, reviewQuestions.length];
      case 'teach_letters': return [letterStepsSoFar, totalLetterSteps];
      case 'teach_vowels': return [teachVowelIdx, totalVowelSteps];
      case 'drill': return [0, dayData.practiceWords.length];
      case 'reading': return [0, dayData.culminatingReading.lines.length];
    }
  };

  // Phase transitions
  const goToNextPhaseAfterReview = () => {
    if (hasLetters) {
      setPhase('teach_letters');
    } else {
      setPhase('teach_vowels');
    }
  };

  const goToNextPhaseAfterLetters = () => {
    completeTeachPhase(dayNumber);
    if (dayData.vowelGroups.length > 0) {
      setPhase('teach_vowels');
    } else {
      setPhase('drill');
    }
  };

  const goToNextPhaseAfterVowels = () => {
    completeSyllablePhase(dayNumber);
    setPhase('drill');
  };

  // Handle review drill
  const handleReviewAnswer = (letterId: string) => {
    if (reviewAnswer) return;
    setReviewAnswer(letterId);
    const correct = reviewQuestions[reviewIdx];
    const isCorrect = letterId === correct.id;
    updateSkillProgress(correct.id, isCorrect);
    recordPractice(isCorrect);

    setTimeout(() => {
      setReviewAnswer(null);
      if (reviewIdx + 1 >= reviewQuestions.length) {
        goToNextPhaseAfterReview();
      } else {
        setReviewIdx(reviewIdx + 1);
      }
    }, 1000);
  };

  // Handle letter teach advance
  const handleNextLetter = () => {
    if (!currentLetterGroup) {
      goToNextPhaseAfterLetters();
      return;
    }

    const lettersInGroup = currentLetterGroup.letterIds;
    if (teachLetterIdx + 1 < lettersInGroup.length) {
      setTeachLetterIdx(teachLetterIdx + 1);
    } else if (teachLetterGroupIdx + 1 < dayData.letterGroups.length) {
      setTeachLetterGroupIdx(teachLetterGroupIdx + 1);
      setTeachLetterIdx(0);
    } else {
      goToNextPhaseAfterLetters();
    }
  };

  // Handle vowel teach advance
  const handleNextVowel = () => {
    if (!currentVowelGroup) {
      goToNextPhaseAfterVowels();
      return;
    }

    const vowelsInGroup = currentVowelGroup.vowelIds;
    if (teachVowelIdx + 1 < vowelsInGroup.length) {
      setTeachVowelIdx(teachVowelIdx + 1);
    } else if (teachVowelGroupIdx + 1 < dayData.vowelGroups.length) {
      setTeachVowelGroupIdx(teachVowelGroupIdx + 1);
      setTeachVowelIdx(0);
    } else {
      goToNextPhaseAfterVowels();
    }
  };

  // Word drill complete
  const handleDrillComplete = (score: number, total: number) => {
    completeWordPhase(dayNumber);
    checkAndUpdateStreak();

    // Bootcamp milestones
    if (!hasMilestone('bootcamp_first_word') && score > 0) {
      earnMilestone('bootcamp_first_word');
      setMilestone('bootcamp_first_word');
    }

    setPhase('reading');
  };

  // Reading complete
  const handleReadingComplete = () => {
    completeReadingPhase(dayNumber);

    const milestoneKey = `bootcamp_day${dayNumber}` as MilestoneType;
    if (!hasMilestone(milestoneKey)) {
      earnMilestone(milestoneKey);
      setMilestone(milestoneKey);
    }

    router.push(`/bootcamp/day/${dayNumber}/complete`);
  };

  // Get current letter for teach phase
  const getCurrentTeachLetter = (): Letter | null => {
    if (!currentLetterGroup) return null;
    const id = currentLetterGroup.letterIds[teachLetterIdx];
    return getLetterById(id) || null;
  };

  // Get current vowel for teach phase
  const getCurrentTeachVowel = (): Vowel | null => {
    if (!currentVowelGroup) return null;
    const id = currentVowelGroup.vowelIds[teachVowelIdx];
    return getVowelById(id) || null;
  };

  const [phaseStep, phaseTotal] = getPhaseStep();

  return (
    <div className="min-h-screen bg-[#FEFDFB]">
      <BootcampProgressHeader
        dayNumber={dayNumber}
        phaseName={getPhaseName()}
        phaseIndex={phaseStep}
        phaseTotal={phaseTotal}
        overallProgress={getOverallProgress()}
      />

      <div className="max-w-md mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {/* ====== REVIEW PHASE ====== */}
          {phase === 'review' && reviewQuestions.length > 0 && (
            <motion.div
              key={`review-${reviewIdx}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <div className="text-center">
                <p className="text-xs text-[#C6973F] font-semibold uppercase tracking-wider">Quick Review</p>
                <h2 className="text-lg font-bold text-[#2D3142] mt-1">
                  Which letter is this?
                </h2>
              </div>

              <div className="flex justify-center">
                <div className="bg-white rounded-2xl border-2 border-gray-100 w-36 h-36 flex items-center justify-center">
                  <span dir="rtl" className="font-['Noto_Serif_Hebrew',serif] text-6xl text-[#1A1A2E]">
                    {reviewQuestions[reviewIdx].hebrew}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(() => {
                  const correct = reviewQuestions[reviewIdx];
                  const others = reviewLetters
                    .filter((l) => l.id !== correct.id)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3);
                  const opts = [...others, correct].sort(() => Math.random() - 0.5);
                  return opts.map((letter) => {
                    const isSelected = reviewAnswer === letter.id;
                    const isCorrect = letter.id === correct.id;
                    let bgClass = 'bg-white border-gray-200';
                    if (reviewAnswer) {
                      if (isCorrect) bgClass = 'bg-[#4A7C59]/10 border-[#4A7C59]';
                      else if (isSelected) bgClass = 'bg-[#C17767]/10 border-[#C17767]';
                      else bgClass = 'bg-white border-gray-100 opacity-50';
                    }
                    return (
                      <button
                        key={letter.id}
                        onClick={() => handleReviewAnswer(letter.id)}
                        disabled={!!reviewAnswer}
                        className={`${bgClass} border-2 rounded-xl p-3 text-center transition-all`}
                      >
                        <p className="font-medium text-[#2D3142]">{letter.name}</p>
                        <p className="text-xs text-gray-500">{letter.sound}</p>
                      </button>
                    );
                  });
                })()}
              </div>
            </motion.div>
          )}

          {/* ====== TEACH LETTERS PHASE ====== */}
          {phase === 'teach_letters' && (() => {
            const currentLetter = getCurrentTeachLetter();
            if (!currentLetter || !currentLetterGroup) return null;

            // Check if this is a twin pair and we're at the first letter
            const twinPair = currentLetterGroup.twinPair;
            const culturalMnemonic = currentLetterGroup.culturalMnemonics[currentLetter.id];

            // If twin pair, show TwinPairCard first
            if (twinPair && teachLetterIdx === 0) {
              const withDagesh = getLetterById(twinPair.withDagesh);
              const without = getLetterById(twinPair.withoutDagesh);
              if (withDagesh && without) {
                return (
                  <motion.div
                    key={`twin-${twinPair.withDagesh}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <p className="text-xs text-[#1B4965] font-semibold uppercase tracking-wider">Meet the Twins</p>
                      <h2 className="text-lg font-bold text-[#2D3142] mt-1">
                        {withDagesh.name} & {without.name}
                      </h2>
                    </div>

                    <TwinPairCard
                      letterWithDagesh={withDagesh}
                      letterWithout={without}
                      hint={twinPair.hint}
                    />

                    {/* Cultural mnemonic for the pair */}
                    {culturalMnemonic && (
                      <div className="bg-[#1B4965]/5 rounded-xl p-4">
                        <p className="text-sm text-[#1B4965] text-center italic">
                          ✡ {culturalMnemonic}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handleNextLetter}
                      className="w-full bg-[#1B4965] text-white py-4 rounded-xl text-lg font-medium hover:bg-[#163d55] active:scale-[0.98] transition-all"
                    >
                      Continue
                    </button>
                  </motion.div>
                );
              }
            }

            return (
              <motion.div
                key={`letter-${currentLetter.id}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <p className="text-xs text-[#1B4965] font-semibold uppercase tracking-wider">
                    New Letter
                  </p>
                  <h2 className="text-lg font-bold text-[#2D3142] mt-1">
                    Meet {currentLetter.name}
                  </h2>
                </div>

                <LetterCard letter={currentLetter} isActive pronunciation={pronunciation} />

                {/* Cultural mnemonic */}
                {culturalMnemonic && (
                  <div className="bg-[#1B4965]/5 rounded-xl p-4">
                    <p className="text-sm text-[#1B4965] text-center italic">
                      ✡ {culturalMnemonic}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleNextLetter}
                  className="w-full bg-[#1B4965] text-white py-4 rounded-xl text-lg font-medium hover:bg-[#163d55] active:scale-[0.98] transition-all"
                >
                  {(teachLetterIdx + 1 < currentLetterGroup.letterIds.length) ||
                   (teachLetterGroupIdx + 1 < dayData.letterGroups.length)
                    ? 'Next Letter'
                    : 'On to Vowels'}
                </button>
              </motion.div>
            );
          })()}

          {/* ====== TEACH VOWELS PHASE ====== */}
          {phase === 'teach_vowels' && (() => {
            const currentVowel = getCurrentTeachVowel();
            if (!currentVowel) {
              // If no vowels (Day 5 has no new vowels but has chataf)
              // Show syllable builder then move on
              return (
                <motion.div
                  key="syllables"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <p className="text-xs text-[#1B4965] font-semibold uppercase tracking-wider">Build Syllables</p>
                    <h2 className="text-lg font-bold text-[#2D3142] mt-1">
                      Combine Letters + Vowels
                    </h2>
                  </div>
                  <SyllableBuilder syllables={dayData.syllables} onComplete={goToNextPhaseAfterVowels} />
                </motion.div>
              );
            }

            // Show vowel group teaching note if first vowel in group
            const showGroupNote = currentVowelGroup && teachVowelIdx === 0;

            return (
              <motion.div
                key={`vowel-${currentVowel.id}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: currentVowel.color }}>
                    New Vowel
                  </p>
                  <h2 className="text-lg font-bold text-[#2D3142] mt-1">
                    Meet {currentVowel.name}
                  </h2>
                </div>

                {/* Group teaching note */}
                {showGroupNote && currentVowelGroup && (
                  <div className="bg-[#1B4965]/5 rounded-xl p-4 mb-2">
                    <p className="text-sm text-[#1B4965] text-center">
                      {currentVowelGroup.teachingNote}
                    </p>
                  </div>
                )}

                <VowelCard vowel={currentVowel} isActive />

                <button
                  onClick={handleNextVowel}
                  className="w-full bg-[#1B4965] text-white py-4 rounded-xl text-lg font-medium hover:bg-[#163d55] active:scale-[0.98] transition-all"
                >
                  {(teachVowelIdx + 1 < (currentVowelGroup?.vowelIds.length || 0)) ||
                   (teachVowelGroupIdx + 1 < dayData.vowelGroups.length)
                    ? 'Next Vowel'
                    : 'Build Syllables'}
                </button>
              </motion.div>
            );
          })()}

          {/* ====== DRILL PHASE ====== */}
          {phase === 'drill' && (
            <motion.div
              key="drill"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <p className="text-xs text-[#1B4965] font-semibold uppercase tracking-wider">Word Practice</p>
                <h2 className="text-lg font-bold text-[#2D3142] mt-1">
                  Read the Hebrew Word
                </h2>
              </div>

              <WordDrill words={dayData.practiceWords} onComplete={handleDrillComplete} />
            </motion.div>
          )}

          {/* ====== READING PHASE ====== */}
          {phase === 'reading' && (
            <motion.div
              key="reading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <p className="text-xs text-[#C6973F] font-semibold uppercase tracking-wider">Culminating Reading</p>
              </div>

              <ReadingDisplay reading={dayData.culminatingReading} onComplete={handleReadingComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MilestoneToast milestone={milestone} onClose={() => setMilestone(null)} />
    </div>
  );
}
