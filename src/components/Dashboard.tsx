'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Settings, Play, Check, ChevronRight, X, Sparkles, RefreshCw } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { useBootcampStore } from '@/stores/bootcampStore';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BottomNav } from '@/components/ui/BottomNav';
import { BootcampCard } from '@/components/bootcamp/BootcampCard';
import { LETTERS } from '@/lib/content/letters';
import { VOWELS } from '@/lib/content/vowels';
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

  // Vowel progress
  const totalVowels = VOWELS.length;
  const learnedVowels = VOWELS.filter(
    (v) => skillProgress[v.id]?.timesPracticed > 0
  ).length;

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
    const q: { label: string; done: boolean }[] = [];
    q.push({
      label: `Study ${profile.dailyGoalMinutes} min`,
      done: todayMinutes >= profile.dailyGoalMinutes,
    });
    q.push({
      label: 'Practice 5 items',
      done: todayItems >= 5,
    });
    if (!bootcampDone && bootcampEnrolled) {
      q.push({
        label: 'Bootcamp session',
        done: false,
      });
    } else {
      q.push({
        label: 'Review in Practice',
        done: todayItems >= 10,
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
      <div className="bg-gradient-to-b from-primary to-[#1A3F57] text-white px-6 pt-8 pb-6">
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
                <Settings className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Greeting block — left aligned, compact */}
          <div className="space-y-1">
            <h1 className="text-2xl font-serif font-bold leading-tight tracking-tight">{greeting}</h1>
            <p
              dir="rtl"
              className="font-[var(--font-hebrew-serif)] text-2xl text-white/50"
            >
              {greetingHebrew}
            </p>
          </div>

          {/* Stats row — streak + daily goal side by side */}
          <div className="flex items-center gap-3 mt-5">
            <div className="flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm rounded-xl px-4 py-2.5 flex-1">
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
                    stroke={dailyGoalProgress >= 1 ? 'var(--success)' : 'var(--primary-light)'}
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

      {/* ── Main Content ── */}
      <div className="max-w-md mx-auto px-5 pt-4 pb-24 space-y-3.5">
        {/* Welcome back banner */}
        {showWelcomeBack && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gold/15 p-4 flex items-center gap-3"
          >
            <Sparkles className="w-6 h-6 text-gold flex-shrink-0" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
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
              <X className="w-4 h-4" />
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
                  <div className="bg-primary/8 w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-lg font-[var(--font-hebrew-serif)]">א</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-foreground">Individual Lessons</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {masteredLetters === 0
                        ? 'Learn letters one at a time'
                        : `${masteredLetters} of ${totalLetters} letters mastered`}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" strokeWidth={2} />
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
                      <p className="text-[11px] text-primary font-semibold uppercase tracking-widest">
                        Continue Learning
                      </p>
                      <h2 className="text-lg font-serif font-bold text-foreground mt-1.5">
                        Level {profile.currentLevel} — Letters
                      </h2>
                      <p className="text-[13px] text-gray-400 mt-0.5">
                        {masteredLetters} of {totalLetters} letters mastered
                      </p>
                    </div>
                    <div className="bg-primary text-white w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/25">
                      <Play className="w-5 h-5" strokeWidth={2.5} fill="currentColor" />
                    </div>
                  </div>
                  <ProgressBar
                    value={letterProgress}
                    color='var(--primary)'
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

        {/* Learn Vowels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <Link href="/learn/vowels">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-4 hover:shadow-md transition-all flex items-center gap-4">
              <div className="bg-[#8B5CF6]/8 w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-[#8B5CF6] font-bold text-lg font-[var(--font-hebrew-serif)]">ַ</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-foreground">Learn Vowels</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {learnedVowels === 0
                    ? 'Master nekudot to read Hebrew'
                    : `${learnedVowels} of ${totalVowels} learned`}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" strokeWidth={2} />
            </div>
          </Link>
        </motion.div>

        {/* Learn Prayers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
        >
          <Link href="/siddur">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-4 hover:shadow-md transition-all flex items-center gap-4">
              <div className="bg-gold/8 w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-gold font-bold text-lg font-[var(--font-hebrew-serif)]">ש</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-foreground">Learn Prayers</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Practice davening with audio and transliteration
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" strokeWidth={2} />
            </div>
          </Link>
        </motion.div>

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
                <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${q.done
                    ? 'bg-success border-success'
                    : 'border-gray-200'
                  }`}>
                  {q.done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <span className={`text-[13px] ${q.done ? 'text-gray-300 line-through' : 'text-foreground font-medium'}`}>
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
            { value: masteredLetters, label: 'Letters', color: 'var(--primary)' },
            { value: Math.round(todayMinutes), label: 'Min Today', color: 'var(--success)' },
            { value: profile.streakDays, label: 'Day Streak', color: 'var(--gold)' },
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
            <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Save your progress</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Sync across devices &amp; never lose your data
              </p>
            </div>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap shadow-sm"
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
