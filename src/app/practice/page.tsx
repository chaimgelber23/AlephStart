'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';
import { BottomNav } from '@/components/ui/BottomNav';
import { LETTERS } from '@/lib/content/letters';
import { newCard, rateCard, getDueCards, Rating, type Card, type Grade } from '@/lib/fsrs';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── FSRS card store (persisted separately) ──

interface PracticeStore {
  cards: Record<string, Card>;
  ensureCards: (skillIds: string[]) => void;
  rateSkillCard: (skillId: string, rating: Grade) => void;
}

const usePracticeStore = create<PracticeStore>()(
  persist(
    (set, get) => ({
      cards: {},

      ensureCards: (skillIds) => {
        const existing = get().cards;
        const additions: Record<string, Card> = {};
        let changed = false;
        for (const id of skillIds) {
          if (!existing[id]) {
            additions[id] = newCard();
            changed = true;
          }
        }
        if (changed) {
          set({ cards: { ...existing, ...additions } });
        }
      },

      rateSkillCard: (skillId, rating) => {
        const card = get().cards[skillId];
        if (!card) return;
        const updated = rateCard(card, rating);
        set({ cards: { ...get().cards, [skillId]: updated } });
      },
    }),
    { name: 'alephstart-practice' }
  )
);

// ── Helpers ──

function getLetterById(id: string) {
  return LETTERS.find((l) => l.id === id);
}

function pickDistractors(correctId: string, pool: string[], count: number): string[] {
  return pool
    .filter((id) => id !== correctId)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

// ── Page ──

export default function PracticePage() {
  const skillProgress = useUserStore((s) => s.skillProgress);
  const updateSkillProgress = useUserStore((s) => s.updateSkillProgress);
  const recordPractice = useUserStore((s) => s.recordPractice);
  const checkAndUpdateStreak = useUserStore((s) => s.checkAndUpdateStreak);

  const cards = usePracticeStore((s) => s.cards);
  const ensureCards = usePracticeStore((s) => s.ensureCards);
  const rateSkillCard = usePracticeStore((s) => s.rateSkillCard);

  // Letter IDs the user has practiced at least once
  const learnedIds = useMemo(() => {
    return Object.keys(skillProgress).filter((id) =>
      LETTERS.some((l) => l.id === id)
    );
  }, [skillProgress]);

  // Initialize FSRS cards for learned skills
  useEffect(() => {
    if (learnedIds.length > 0) ensureCards(learnedIds);
  }, [learnedIds, ensureCards]);

  // Cards due for review
  const dueIds = useMemo(() => {
    if (learnedIds.length === 0) return [];
    return getDueCards(cards).filter((id) => learnedIds.includes(id));
  }, [cards, learnedIds]);

  // Session state
  const [queue, setQueue] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  const startSession = useCallback(() => {
    let q = [...dueIds].slice(0, 10);
    if (q.length < 5 && learnedIds.length >= 5) {
      const extras = learnedIds
        .filter((id) => !q.includes(id))
        .sort(() => Math.random() - 0.5)
        .slice(0, 5 - q.length);
      q = [...q, ...extras];
    } else if (q.length === 0) {
      q = learnedIds.sort(() => Math.random() - 0.5).slice(0, 10);
    }
    setQueue(q);
    setIdx(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setTotal(0);
    setStarted(true);
    setDone(false);
  }, [dueIds, learnedIds]);

  const skillId = queue[idx];
  const letter = skillId ? getLetterById(skillId) : null;

  // Build answer options (memoized per question)
  const options = useMemo(() => {
    if (!skillId) return [];
    const optionPool = learnedIds.length > 3 ? learnedIds : LETTERS.map((l) => l.id);
    const distractorIds = pickDistractors(skillId, optionPool, 3);
    return [skillId, ...distractorIds]
      .map((id) => getLetterById(id))
      .filter(Boolean)
      .sort(() => Math.random() - 0.5);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillId]);

  const handleAnswer = (answerId: string) => {
    if (revealed) return;
    setSelected(answerId);
    setRevealed(true);

    const correct = answerId === skillId;
    setTotal((t) => t + 1);
    if (correct) setScore((s) => s + 1);

    rateSkillCard(skillId, correct ? Rating.Good : Rating.Again);
    updateSkillProgress(skillId, correct);
    recordPractice(correct);

    setTimeout(() => {
      if (idx + 1 >= queue.length) {
        checkAndUpdateStreak();
        setDone(true);
      } else {
        setIdx((i) => i + 1);
        setSelected(null);
        setRevealed(false);
      }
    }, 1200);
  };

  // ── Empty state: nothing learned yet ──
  if (learnedIds.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-primary text-white px-6 py-8 rounded-b-3xl">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold">Daily Practice</h1>
            <p className="text-primary-light text-sm mt-1">Review what you&apos;ve learned</p>
          </div>
        </div>
        <div className="max-w-md mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-4"
          >
            <p className="text-4xl">📚</p>
            <h2 className="text-xl font-bold text-foreground">Learn some letters first</h2>
            <p className="text-gray-500 text-sm">
              Complete a lesson or bootcamp day, then come back here to practice
              with spaced repetition.
            </p>
            <Link href="/learn">
              <button className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-[#163d55] transition-colors mt-4">
                Start Learning →
              </button>
            </Link>
          </motion.div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── Session complete ──
  if (done) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-primary text-white px-6 py-8 rounded-b-3xl">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold">Practice Complete</h1>
          </div>
        </div>
        <div className="max-w-md mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-4"
          >
            <p className="text-5xl">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</p>
            <h2 className="text-2xl font-bold text-foreground">{pct}% Correct</h2>
            <p className="text-gray-500">
              {score} of {total}{dueIds.length > 0
                ? ` — ${dueIds.length} more cards due`
                : ' — all caught up!'}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={startSession}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:bg-[#163d55] transition-colors"
              >
                Practice Again
              </button>
              <Link href="/" className="flex-1">
                <button className="w-full border-2 border-gray-200 text-foreground py-3 rounded-xl font-medium hover:border-primary transition-colors">
                  Home
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── Pre-session: ready to start ──
  if (!started) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-primary text-white px-6 py-8 rounded-b-3xl">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold">Daily Practice</h1>
            <p className="text-primary-light text-sm mt-1">
              {dueIds.length > 0
                ? `${dueIds.length} cards due for review`
                : `${learnedIds.length} letters to practice`}
            </p>
          </div>
        </div>
        <div className="max-w-md mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-4"
          >
            <p className="text-4xl">🧠</p>
            <h2 className="text-xl font-bold text-foreground">Ready to review?</h2>
            <p className="text-gray-500 text-sm">
              Spaced repetition shows you letters right before you forget them —
              the most efficient way to build lasting memory.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center">
                <p className="text-xl font-bold text-primary">{learnedIds.length}</p>
                <p className="text-xs text-gray-500">Learned</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gold">{dueIds.length}</p>
                <p className="text-xs text-gray-500">Due</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-success">
                  {Object.values(skillProgress).filter((p) => p.masteryLevel >= 0.8).length}
                </p>
                <p className="text-xs text-gray-500">Mastered</p>
              </div>
            </div>
            <button
              onClick={startSession}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-medium hover:bg-[#163d55] transition-colors mt-2"
            >
              Start Practice
            </button>
          </motion.div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── Active drill ──
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary px-6 pt-6 pb-8 rounded-b-3xl">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-white/60 text-sm mb-3">
            <span>{idx + 1} of {queue.length}</span>
            <span>{score} correct</span>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-light rounded-full"
              animate={{ width: `${((idx + 1) / queue.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {letter && (
            <motion.div
              key={skillId}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">What sound does this letter make?</p>
                <p className="text-7xl font-[var(--font-hebrew-serif)]" dir="rtl">
                  {letter.hebrew}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {options.map((opt) => {
                  if (!opt) return null;
                  const isSel = selected === opt.id;
                  const isRight = opt.id === skillId;
                  let cls = 'bg-white border-gray-200 hover:border-primary-light';
                  if (revealed && isRight) cls = 'bg-success/10 border-success';
                  else if (revealed && isSel && !isRight) cls = 'bg-error/10 border-error';

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswer(opt.id)}
                      disabled={revealed}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${cls}`}
                    >
                      <span className="text-lg font-bold text-foreground block">{opt.sound}</span>
                      <span className="text-xs text-gray-500">{opt.name}</span>
                    </button>
                  );
                })}
              </div>

              {revealed && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-center text-sm font-medium ${
                    selected === skillId ? 'text-success' : 'text-error'
                  }`}
                >
                  {selected === skillId
                    ? 'Correct!'
                    : `That was ${letter.name} — "${letter.sound}"`}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
