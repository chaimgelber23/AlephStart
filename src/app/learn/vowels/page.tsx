'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';
import { VOWELS } from '@/lib/content/vowels';
import { VowelCard } from '@/components/bootcamp/VowelCard';
import { AudioButton } from '@/components/ui/AudioButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { MilestoneToast } from '@/components/ui/MilestoneToast';
import { track } from '@/lib/analytics';
import type { Vowel, MilestoneType, Pronunciation, VoiceGender } from '@/types';

const PRONUNCIATION_SUFFIX: Record<Pronunciation, string> = {
  modern: '',
  american: '-american',
};

const GENDER_SUFFIX: Record<VoiceGender, string> = {
  male: '',
  female: '-female',
};

// Group vowels by sound family (matches vowels.ts order)
const VOWEL_LESSONS: { label: string; vowelIds: string[] }[] = [
  { label: 'AH Vowels', vowelIds: ['patach', 'kamatz'] },
  { label: 'EH Vowels', vowelIds: ['segol', 'tzere'] },
  { label: 'EE Vowel', vowelIds: ['chirik'] },
  { label: 'OH Vowels', vowelIds: ['cholam', 'cholam_vav'] },
  { label: 'OO Vowels', vowelIds: ['kubutz', 'shuruk'] },
  { label: 'Shva', vowelIds: ['shva'] },
  { label: 'Chataf Vowels', vowelIds: ['chataf_patach', 'chataf_segol', 'chataf_kamatz'] },
];

const totalLessons = VOWEL_LESSONS.length;

function getLessonVowels(lessonIndex: number): Vowel[] {
  const lesson = VOWEL_LESSONS[lessonIndex];
  if (!lesson) return [];
  return lesson.vowelIds
    .map((id) => VOWELS.find((v) => v.id === id))
    .filter((v): v is Vowel => v !== undefined);
}

type Phase = 'teach' | 'drill' | 'complete';

export default function VowelLearnPage() {
  const pronunciation = useUserStore((s) => s.profile.pronunciation);
  const voiceGender = useUserStore((s) => s.profile.voiceGender) || 'male';
  const vowelLearnSession = useUserStore((s) => s.vowelLearnSession);
  const saveVowelLearnSession = useUserStore((s) => s.saveVowelLearnSession);
  const clearVowelLearnSession = useUserStore((s) => s.clearVowelLearnSession);

  const [currentLesson, setCurrentLesson] = useState(0);
  const [phase, setPhase] = useState<Phase>('teach');
  const [teachIndex, setTeachIndex] = useState(0);
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillScore, setDrillScore] = useState(0);
  const [drillTotal, setDrillTotal] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [milestone, setMilestone] = useState<MilestoneType | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  // Check for saved session on mount
  useEffect(() => {
    if (vowelLearnSession && vowelLearnSession.phase !== 'complete') {
      setShowResumePrompt(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resumeSession = () => {
    if (vowelLearnSession) {
      setCurrentLesson(vowelLearnSession.currentLesson);
      setPhase(vowelLearnSession.phase === 'complete' ? 'teach' : vowelLearnSession.phase);
      setTeachIndex(vowelLearnSession.teachIndex);
      setDrillIndex(vowelLearnSession.drillIndex);
      setDrillScore(vowelLearnSession.drillScore);
      track('vowel_lesson_resumed', { lesson: vowelLearnSession.currentLesson });
    }
    setShowResumePrompt(false);
  };

  const startFresh = () => {
    clearVowelLearnSession();
    setShowResumePrompt(false);
  };

  // Save session state on meaningful changes
  useEffect(() => {
    if (phase !== 'complete' && !showResumePrompt) {
      saveVowelLearnSession({
        currentLesson,
        phase,
        teachIndex,
        drillIndex,
        drillScore,
        savedAt: new Date().toISOString(),
      });
    }
  }, [currentLesson, phase, teachIndex, drillIndex, drillScore, showResumePrompt, saveVowelLearnSession]);

  const updateSkillProgress = useUserStore((s) => s.updateSkillProgress);
  const recordPractice = useUserStore((s) => s.recordPractice);
  const checkAndUpdateStreak = useUserStore((s) => s.checkAndUpdateStreak);
  const earnMilestone = useUserStore((s) => s.earnMilestone);

  const lessonVowels = getLessonVowels(currentLesson);
  const currentTeachVowel = lessonVowels[teachIndex];
  const drillsPerLesson = Math.max(6, lessonVowels.length * 3); // at least 6, or 3 per vowel

  // Generate drill question — show a vowel mark, pick from 4 name options
  const generateDrillOptions = useCallback(() => {
    const correct = lessonVowels[drillIndex % lessonVowels.length];
    // Get 3 wrong answers from all vowels (not in current drill)
    const others = VOWELS.filter((v) => v.id !== correct.id);
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...shuffled, correct].sort(() => Math.random() - 0.5);
    return { correct, options };
  }, [lessonVowels, drillIndex]);

  const { correct: drillCorrectVowel, options: drillOptions } = generateDrillOptions();

  // Handle teaching phase
  const handleTeachNext = () => {
    if (teachIndex < lessonVowels.length - 1) {
      setTeachIndex(teachIndex + 1);
    } else {
      setPhase('drill');
      setDrillIndex(0);
      setDrillScore(0);
      setDrillTotal(0);
    }
  };

  // Handle drill answer
  const handleDrillAnswer = (vowelId: string) => {
    if (showResult) return;
    setSelectedAnswer(vowelId);
    setShowResult(true);

    const isCorrect = vowelId === drillCorrectVowel.id;
    setDrillTotal(drillTotal + 1);
    if (isCorrect) setDrillScore(drillScore + 1);

    updateSkillProgress(drillCorrectVowel.id, isCorrect);
    recordPractice(isCorrect, drillTotal === 0);

    // Auto-advance after showing result
    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);

      if (drillIndex < drillsPerLesson - 1) {
        setDrillIndex(drillIndex + 1);
      } else {
        checkAndUpdateStreak();
        track('vowel_lesson_complete', {
          lesson: currentLesson,
          score: drillScore,
          total: drillTotal + 1,
        });
        clearVowelLearnSession();
        setPhase('complete');
      }
    }, 1200);
  };

  // Handle lesson complete — advance to next
  const handleNextLesson = () => {
    if (currentLesson < totalLessons - 1) {
      setCurrentLesson(currentLesson + 1);
      setPhase('teach');
      setTeachIndex(0);
      setDrillIndex(0);
    }
  };

  // Resume prompt overlay
  if (showResumePrompt && vowelLearnSession) {
    const resumeVowels = getLessonVowels(vowelLearnSession.currentLesson);
    const resumeLabel = VOWEL_LESSONS[vowelLearnSession.currentLesson]?.label ?? '';
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 max-w-sm w-full text-center space-y-4"
        >
          <p className="text-4xl">&#x05B7;</p>
          <h2 className="text-xl font-bold text-foreground">Welcome back!</h2>
          <p className="text-sm text-gray-500">
            You were on Lesson {vowelLearnSession.currentLesson + 1} — {resumeLabel} ({resumeVowels.map((v) => v.name).join(', ')})
          </p>
          <div className="space-y-2 pt-2">
            <button
              onClick={resumeSession}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-medium hover:bg-[#163d55] transition-colors"
            >
              Continue Where I Left Off
            </button>
            <button
              onClick={startFresh}
              className="w-full border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:border-primary transition-colors"
            >
              Start from Beginning
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-gray-600">
            ← Back
          </Link>
          <span className="text-sm font-medium text-gray-600">
            Lesson {currentLesson + 1} of {totalLessons} — {VOWEL_LESSONS[currentLesson]?.label}
          </span>
          <span className="text-sm text-primary">
            {phase === 'teach' && `${teachIndex + 1}/${lessonVowels.length}`}
            {phase === 'drill' && `Drill ${drillIndex + 1}/${drillsPerLesson}`}
            {phase === 'complete' && 'Done!'}
          </span>
        </div>
        <ProgressBar
          value={
            phase === 'teach'
              ? (teachIndex / lessonVowels.length) * 0.3
              : phase === 'drill'
              ? 0.3 + (drillIndex / drillsPerLesson) * 0.7
              : 1
          }
          size="sm"
          className="max-w-md mx-auto mt-2"
        />
      </div>

      <div className="max-w-md mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* TEACH PHASE */}
          {phase === 'teach' && currentTeachVowel && (
            <motion.div
              key={`teach-${teachIndex}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              <div className="text-center">
                <p className="text-sm font-medium uppercase tracking-wider" style={{ color: currentTeachVowel.color }}>
                  New Vowel
                </p>
                <h2 className="text-xl font-bold text-foreground mt-1">
                  Meet {currentTeachVowel.name}
                </h2>
              </div>

              <VowelCard vowel={currentTeachVowel} isActive pronunciation={pronunciation} />

              <button
                onClick={handleTeachNext}
                className="w-full bg-primary text-white py-4 rounded-xl text-lg font-medium hover:bg-[#163d55] transition-colors"
              >
                {teachIndex < lessonVowels.length - 1 ? 'Next Vowel →' : "Let's Practice! →"}
              </button>
            </motion.div>
          )}

          {/* DRILL PHASE */}
          {phase === 'drill' && (
            <motion.div
              key={`drill-${drillIndex}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-8"
            >
              <div className="text-center">
                <p className="text-sm text-primary font-medium uppercase tracking-wider">
                  What sound does this vowel make?
                </p>
              </div>

              {/* Big vowel display — show under an example letter */}
              <div className="flex justify-center">
                <div
                  className="bg-white rounded-2xl shadow-sm border-2 w-40 h-40 flex items-center justify-center"
                  style={{ borderColor: drillCorrectVowel.color + '40' }}
                >
                  <span
                    dir="rtl"
                    className="font-['Noto_Serif_Hebrew',serif] text-7xl text-[#1A1A2E] leading-[2]"
                  >
                    ב{drillCorrectVowel.hebrew}
                  </span>
                </div>
              </div>

              {/* Audio hint */}
              <div className="flex justify-center">
                <AudioButton
                  audioUrl={`/audio/vowels/${drillCorrectVowel.id}-sound${PRONUNCIATION_SUFFIX[pronunciation]}${GENDER_SUFFIX[voiceGender]}.mp3`}
                  label="Hear the sound"
                  size="sm"
                  variant="outline"
                />
              </div>

              {/* Answer options */}
              <div className="grid grid-cols-2 gap-3">
                {drillOptions.map((vowel) => {
                  const isSelected = selectedAnswer === vowel.id;
                  const isCorrect = vowel.id === drillCorrectVowel.id;

                  let bgClass = 'bg-white border-gray-200 hover:border-primary-light';
                  if (showResult && isSelected && isCorrect) {
                    bgClass = 'bg-success/10 border-success';
                  } else if (showResult && isSelected && !isCorrect) {
                    bgClass = 'bg-error/10 border-error';
                  } else if (showResult && isCorrect) {
                    bgClass = 'bg-success/5 border-success/50';
                  }

                  return (
                    <button
                      key={vowel.id}
                      onClick={() => handleDrillAnswer(vowel.id)}
                      disabled={showResult}
                      className={`
                        p-4 rounded-xl border-2 text-center transition-all duration-200
                        ${bgClass}
                        ${!showResult ? 'active:scale-95' : ''}
                      `}
                    >
                      <p className="text-lg font-semibold text-foreground">{vowel.name}</p>
                      <p className="text-sm text-gray-500">{vowel.sound}</p>
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-center py-3 rounded-xl ${
                    selectedAnswer === drillCorrectVowel.id
                      ? 'bg-success/10 text-success'
                      : 'bg-error/10 text-error'
                  }`}
                >
                  {selectedAnswer === drillCorrectVowel.id
                    ? '✓ Correct!'
                    : `✗ That was ${drillCorrectVowel.name} (${drillCorrectVowel.sound})`}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* COMPLETE PHASE */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-8"
            >
              <div className="text-6xl">&#x2728;</div>
              <h2 className="text-2xl font-bold text-foreground">Lesson Complete!</h2>
              <p className="text-gray-600">
                You learned: {lessonVowels.map((v) => v.name).join(', ')}
              </p>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Score</span>
                  <span className="font-bold text-primary">
                    {drillScore}/{drillTotal} ({Math.round((drillScore / Math.max(drillTotal, 1)) * 100)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Vowels learned</span>
                  <span className="font-bold" style={{ color: lessonVowels[0]?.color ?? 'var(--primary)' }}>
                    {lessonVowels.map((v) => v.name).join(', ')}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {currentLesson < totalLessons - 1 && (
                  <button
                    onClick={handleNextLesson}
                    className="w-full bg-primary text-white py-4 rounded-xl text-lg font-medium hover:bg-[#163d55] transition-colors"
                  >
                    Next Lesson →
                  </button>
                )}
                <Link href="/">
                  <button className="w-full border-2 border-gray-200 text-gray-600 py-4 rounded-xl text-lg font-medium hover:border-primary hover:text-primary transition-colors">
                    Back to Home
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Milestone Toast */}
      <MilestoneToast milestone={milestone} onClose={() => setMilestone(null)} />
    </div>
  );
}
