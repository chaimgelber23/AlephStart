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
    hour < 12 ? 'Boker Tov' : hour < 18 ? 'Tzohorayim Tovim' : 'Erev Tov';
  const greeting = userName ? `${baseGreeting}, ${userName}` : baseGreeting;
  const greetingHebrew =
    hour < 12 ? 'בּוֹקֶר טוֹב' : hour < 18 ? 'צָהֳרַיִם טוֹבִים' : 'עֶרֶב טוֹב';

  // Rotating encouragement
  const [streakMessage, setStreakMessage] = useState(STREAK_ENCOURAGEMENTS[0]);
  useEffect(() => {
    setStreakMessage(getRandomStreakEncouragement());
  }, []);

  // Daily inspiration quote
  const dailyQuote = useMemo(() => getDailyInspiration(), []);

  // Daily quests
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
        done: false,
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

  const questsDone = quests.filter((q) => q.done).length;

  // Smarter signup prompt
  const showSignup =
    authStatus === 'unauthenticated' &&
    (bootcampCompletedDays >= 2 || Object.keys(skillProgress).length >= 5);

  // Daily goal progress (0-1)
  const dailyGoalProgress = Math.min(1, todayMinutes / profile.dailyGoalMinutes);

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* ── Header ── */}
      <div className="bg-gradient-to-b from-[#1B4965] to-[#1A3F57] text-white px-6 pt-8 pb-14">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          {/* Top row: settings gear */}
          <div className="flex items-center justify-end mb-5">
            {authStatus === 'authenticated' && (
              <Link
                href="/settings"
                className="text-white/30 hover:text-white/70 transition-colors p-1"
                aria-label="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </Link>
            )}
          </div>

          {/* Greeting block — left aligned, compact */}
          <div className="space-y-1">
            <h1 className="text-[28px] font-bold leading-tight tracking-tight">{greeting}</h1>
            <p
              dir="rtl"
              className="font-[var(--font-hebrew-serif)] text-[17px] text-white/50"
            >
              {greetingHebrew}
            </p>
          </div>

          {/* Stats row — streak + daily goal side by side */}
          <div className="flex items-center gap-3 mt-5">
            <div className="flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm rounded-xl px-4 py-2.5 flex-1">
              <span className="text-base">🔥</span>
              <div>
                <p className="text-[13px] font-semibold leading-tight">
                  {profile.streakDays} {profile.streakDays === 1 ? 'day' : 'days'}
                </p>
                <p className="text-[10px] text-white/40 leading-tight">streak</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm rounded-xl px-4 py-2.5 flex-1">
              {/* Circular mini progress */}
              <div className="relative w-8 h-8 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="14" fill="none"
                    stroke={dailyGoalProgress >= 1 ? '#4A7C59' : '#5FA8D3'}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${dailyGoalProgress * 88} 88`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold">
                  {Math.round(todayMinutes)}
                </span>
              </div>
              <div>
                <p className="text-[13px] font-semibold leading-tight">
                  {Math.round(todayMinutes)}/{profile.dailyGoalMinutes} min
                </p>
                <p className="text-[10px] text-white/40 leading-tight">today</p>
              </div>
            </div>
          </div>

          {/* Encouragement or quote — small, ambient */}
          <p className="text-[11px] text-white/30 italic mt-4 leading-relaxed">
            {profile.streakDays > 0 ? (
              <>
                <span dir="rtl" className="font-[var(--font-hebrew-serif)] not-italic">{streakMessage.hebrew}</span>
                {' — '}
                {formatWithName(streakMessage.english, userName)}
              </>
            ) : (
              <>
                &ldquo;{dailyQuote.english}&rdquo; — {dailyQuote.source}
              </>
            )}
          </p>
        </motion.div>
      </div>

      {/* ── Main Content ── overlapping the header */}
      <div className="max-w-md mx-auto px-5 -mt-8 pb-24 space-y-3.5">
        {/* Welcome back banner */}
        {showWelcomeBack && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-[#C6973F]/15 p-4 flex items-center gap-3"
          >
            <span className="text-2xl">👋</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#2D3142]">
                Welcome back{userName ? `, ${userName}` : ''}!
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Your progress is saved. Pick up where you left off.
              </p>
            </div>
            <button
              onClick={() => setShowWelcomeBack(false)}
              className="text-gray-300 hover:text-gray-500 p-1"
              aria-label="Dismiss"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Primary + Secondary CTAs */}
        {bootcampFirst ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <BootcampCard />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/learn">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-4 hover:shadow-md transition-all flex items-center gap-4">
                  <div className="bg-[#1B4965]/8 w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-[#1B4965] font-bold text-lg font-[var(--font-hebrew-serif)]">א</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-[#2D3142]">Individual Lessons</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {masteredLetters === 0
                        ? 'Learn letters one at a time'
                        : `${masteredLetters} of ${totalLetters} letters mastered`}
                    </p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" className="shrink-0">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Link href="/learn">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-5 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-[#1B4965] font-semibold uppercase tracking-widest">
                        Continue Learning
                      </p>
                      <h2 className="text-lg font-bold text-[#2D3142] mt-1.5">
                        Level {profile.currentLevel} — Letters
                      </h2>
                      <p className="text-[13px] text-gray-400 mt-0.5">
                        {masteredLetters} of {totalLetters} letters mastered
                      </p>
                    </div>
                    <div className="bg-[#1B4965] text-white w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#1B4965]/25">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
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
                transition={{ delay: 0.1 }}
              >
                <BootcampCard />
              </motion.div>
            )}
          </>
        )}

        {/* Today's Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
              Today&apos;s Goals
            </p>
            <span className="text-[11px] font-medium text-gray-300">{questsDone}/{quests.length}</span>
          </div>
          <div className="space-y-2">
            {quests.map((q, i) => (
              <div key={i} className="flex items-center gap-3 py-0.5">
                <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  q.done
                    ? 'bg-[#4A7C59] border-[#4A7C59]'
                    : 'border-gray-200'
                }`}>
                  {q.done && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-[13px]">{q.icon}</span>
                <span className={`text-[13px] ${q.done ? 'text-gray-300 line-through' : 'text-[#2D3142] font-medium'}`}>
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
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-2.5"
        >
          {[
            { value: masteredLetters, label: 'Letters', color: '#1B4965' },
            { value: Math.round(todayMinutes), label: 'Min Today', color: '#4A7C59' },
            { value: profile.streakDays, label: 'Day Streak', color: '#C6973F' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100/80 py-4 px-3 text-center">
              <p className="text-[22px] font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Auth Banner */}
        {showSignup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-[#1B4965]/8 rounded-xl flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B4965" strokeWidth="1.5">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#2D3142]">Save your progress</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Sync across devices &amp; never lose your data
              </p>
            </div>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-xl bg-[#1B4965] text-white text-xs font-semibold hover:bg-[#163d55] transition-colors whitespace-nowrap shadow-sm"
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
