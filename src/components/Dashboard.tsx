'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { useBootcampStore } from '@/stores/bootcampStore';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BottomNav } from '@/components/ui/BottomNav';
import { BootcampCard } from '@/components/bootcamp/BootcampCard';
import { LETTERS } from '@/lib/content/letters';
import {
  STREAK_ENCOURAGEMENTS,
  getRandomStreakEncouragement,
  getDailyInspiration,
  formatWithName,
} from '@/lib/content/encouragements';

export function Dashboard() {
  const profile = useUserStore((s) => s.profile);
  const skillProgress = useUserStore((s) => s.skillProgress);
  const todaySession = useUserStore((s) => s.todaySession);
  const authStatus = useAuthStore((s) => s.status);
  const bootcampProgress = useBootcampStore((s) => s.progress);
  const isBootcampComplete = useBootcampStore((s) => s.isBootcampComplete);

  // Letter progress
  const totalLetters = LETTERS.length;
  const masteredLetters = Object.values(skillProgress).filter(
    (p) => p.masteryLevel >= 0.8
  ).length;
  const letterProgress = masteredLetters / totalLetters;

  // Today's study data
  const today = new Date().toISOString().split('T')[0];
  const todayMinutes =
    todaySession.date === today ? todaySession.minutesStudied : 0;
  const todayItems =
    todaySession.date === today ? todaySession.itemsReviewed : 0;

  // Bootcamp state — determines card ordering
  const bootcampDone = isBootcampComplete();
  const bootcampEnrolled = bootcampProgress.enrolled;
  const bootcampCompletedDays = Object.values(bootcampProgress.dayProgress).filter(
    (d) => d.status === 'completed'
  ).length;
  // New users or mid-bootcamp → Bootcamp is the primary CTA
  const bootcampFirst = !bootcampDone && masteredLetters < 10;

  // Lapsed user detection (3+ days since last practice)
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  useEffect(() => {
    if (profile.lastPracticeDate) {
      const last = new Date(profile.lastPracticeDate + 'T00:00:00');
      const now = new Date();
      const daysSince = Math.floor((now.getTime() - last.getTime()) / 86400000);
      if (daysSince >= 3) setShowWelcomeBack(true);
    }
  }, [profile.lastPracticeDate]);

  // Personalized greeting
  const userName = profile.displayName?.trim() || '';
  const hour = new Date().getHours();
  const baseGreeting =
    hour < 12 ? 'Boker Tov' : hour < 18 ? 'Tzohorayim Tovim' : "Erev Tov";
  const greeting = userName ? `${baseGreeting}, ${userName}` : baseGreeting;
  const greetingHebrew =
    hour < 12 ? 'בּוֹקֶר טוֹב' : hour < 18 ? 'צָהֳרַיִם טוֹבִים' : 'עֶרֶב טוֹב';

  // Rotating encouragement (random per page load, hydration-safe)
  const [streakMessage, setStreakMessage] = useState(STREAK_ENCOURAGEMENTS[0]);
  useEffect(() => {
    setStreakMessage(getRandomStreakEncouragement());
  }, []);

  // Daily inspiration quote (same all day, date-seeded)
  const dailyQuote = useMemo(() => getDailyInspiration(), []);

  // Daily quests — 3 micro-goals
  const quests = useMemo(() => {
    const q: { label: string; done: boolean; icon: string }[] = [];
    q.push({
      label: `Study ${profile.dailyGoalMinutes} min`,
      done: todayMinutes >= profile.dailyGoalMinutes,
      icon: '⏱',
    });
    q.push({
      label: 'Practice 5 items',
      done: todayItems >= 5,
      icon: '✏️',
    });
    if (!bootcampDone && bootcampEnrolled) {
      q.push({
        label: 'Bootcamp session',
        done: false, // can't easily detect same-day completion
        icon: '🏕️',
      });
    } else {
      q.push({
        label: 'Review in Practice',
        done: todayItems >= 10,
        icon: '🧠',
      });
    }
    return q;
  }, [todayMinutes, todayItems, profile.dailyGoalMinutes, bootcampDone, bootcampEnrolled]);

  // Smarter signup prompt — only show after some engagement
  const showSignup =
    authStatus === 'unauthenticated' &&
    (bootcampCompletedDays >= 2 || Object.keys(skillProgress).length >= 5);

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="bg-[#1B4965] text-white px-6 pt-6 pb-8 rounded-b-3xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          {/* Daily quote — small, ambient */}
          <div className="flex items-start justify-between gap-4">
            <p className="text-[11px] text-white/50 italic leading-snug flex-1">
              &ldquo;{dailyQuote.english}&rdquo; — {dailyQuote.source}
            </p>
            {authStatus === 'authenticated' && (
              <Link
                href="/settings"
                className="text-white/40 hover:text-white transition-colors shrink-0 mt-0.5"
                aria-label="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </Link>
            )}
          </div>

          {/* Greeting */}
          <h1 className="text-2xl font-bold mt-4">{greeting}</h1>
          <p
            dir="rtl"
            className="font-[var(--font-hebrew-serif)] text-lg text-white/70 mt-0.5"
          >
            {greetingHebrew}
          </p>

          {/* Streak + Daily goal pills */}
          <div className="flex items-center gap-2 mt-4">
            {profile.streakDays > 0 && (
              <div className="bg-white/10 rounded-full px-3.5 py-2 flex items-center gap-1.5">
                <span className="text-sm">🔥</span>
                <span className="text-xs font-semibold">{profile.streakDays} day streak</span>
              </div>
            )}
            <div className="bg-white/10 rounded-full px-3.5 py-2 flex items-center gap-1.5">
              <span className="text-sm">⏱</span>
              <span className="text-xs font-semibold">
                {Math.round(todayMinutes)}/{profile.dailyGoalMinutes} min today
              </span>
            </div>
          </div>

          {/* Encouragement — shown when streak exists */}
          {profile.streakDays > 0 && (
            <p className="text-[11px] text-white/40 mt-2.5">
              <span dir="rtl" className="font-[var(--font-hebrew-serif)]">{streakMessage.hebrew}</span>
              {' — '}
              {formatWithName(streakMessage.english, userName)}
            </p>
          )}
        </motion.div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-md mx-auto px-6 -mt-4 space-y-4">
        {/* Welcome back banner for lapsed users */}
        {showWelcomeBack && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#C6973F]/10 to-[#C6973F]/5 border border-[#C6973F]/20 rounded-2xl p-4 flex items-center gap-3"
          >
            <span className="text-2xl">👋</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#2D3142]">
                Welcome back{userName ? `, ${userName}` : ''}!
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Your progress is saved. Pick up right where you left off.
              </p>
            </div>
            <button
              onClick={() => setShowWelcomeBack(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Dismiss"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Primary CTA — Bootcamp first for new users, Learn first for advanced */}
        {bootcampFirst ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <BootcampCard />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Link href="/learn">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow flex items-center gap-4">
                  <div className="bg-[#1B4965]/10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-[#1B4965] font-bold">א</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#2D3142]">Individual Lessons</p>
                    <p className="text-xs text-gray-500">
                      {masteredLetters === 0
                        ? 'Learn letters one at a time'
                        : `${masteredLetters} of ${totalLetters} letters mastered`}
                    </p>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              </Link>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/learn">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#1B4965] font-semibold uppercase tracking-wider">
                        Continue Learning
                      </p>
                      <h2 className="text-lg font-bold text-[#2D3142] mt-1">
                        Level {profile.currentLevel} — Letters
                      </h2>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {masteredLetters} of {totalLetters} letters mastered
                      </p>
                    </div>
                    <div className="bg-[#1B4965] text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0">
                      →
                    </div>
                  </div>
                  <ProgressBar
                    value={letterProgress}
                    color="#1B4965"
                    size="sm"
                    className="mt-4"
                  />
                </div>
              </Link>
            </motion.div>
            {!bootcampDone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <BootcampCard />
              </motion.div>
            )}
          </>
        )}

        {/* Daily Quests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-4"
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Today&apos;s Goals
          </p>
          <div className="space-y-2.5">
            {quests.map((q, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  q.done
                    ? 'bg-[#4A7C59] border-[#4A7C59]'
                    : 'border-gray-300'
                }`}>
                  {q.done && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-sm">{q.icon}</span>
                <span className={`text-sm ${q.done ? 'text-gray-400 line-through' : 'text-[#2D3142]'}`}>
                  {q.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-[#1B4965]">{masteredLetters}</p>
            <p className="text-xs text-gray-500 mt-1">Letters</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-[#4A7C59]">{Math.round(todayMinutes)}</p>
            <p className="text-xs text-gray-500 mt-1">Min Today</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-[#C6973F]">{profile.streakDays}</p>
            <p className="text-xs text-gray-500 mt-1">Day Streak</p>
          </div>
        </motion.div>

        {/* Auth Banner — only after meaningful engagement */}
        {showSignup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-200/60 p-4 flex items-center gap-4"
          >
            <div className="text-2xl">☁️</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#2D3142]">Save your progress</p>
              <p className="text-xs text-gray-500">
                You&apos;ve made great progress — sync it across devices
              </p>
            </div>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-xl bg-[#1B4965] text-white text-xs font-medium hover:bg-[#163d55] transition-colors whitespace-nowrap"
            >
              Sign Up
            </Link>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
