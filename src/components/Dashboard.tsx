'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BottomNav } from '@/components/ui/BottomNav';
import { BootcampCard } from '@/components/bootcamp/BootcampCard';
import { LETTERS } from '@/lib/content/letters';
import { CORE_VOWELS } from '@/lib/content/vowels';
import { PRAYERS } from '@/lib/content/prayers';
import {
  STREAK_ENCOURAGEMENTS,
  getRandomStreakEncouragement,
  getDailyInspiration,
  formatWithName,
} from '@/lib/content/encouragements';

export function Dashboard() {
  const profile = useUserStore((s) => s.profile);
  const skillProgress = useUserStore((s) => s.skillProgress);
  const milestones = useUserStore((s) => s.milestones);
  const authStatus = useAuthStore((s) => s.status);

  // Calculate overall progress
  const totalLetters = LETTERS.length;
  const masteredLetters = Object.values(skillProgress).filter(
    (p) => p.masteryLevel >= 0.8
  ).length;
  const letterProgress = masteredLetters / totalLetters;

  const totalVowels = CORE_VOWELS.length;
  const masteredVowels = 0; // TODO: track vowel progress separately
  const vowelProgress = masteredVowels / totalVowels;

  // Personalized greeting based on time of day
  const userName = profile.displayName?.trim() || '';
  const hour = new Date().getHours();
  const baseGreeting =
    hour < 12 ? 'Boker Tov' : hour < 18 ? 'Tzohorayim Tovim' : "Erev Tov";
  const greeting = userName ? `${baseGreeting}, ${userName}` : baseGreeting;
  const greetingHebrew =
    hour < 12 ? 'בּוֹקֶר טוֹב' : hour < 18 ? 'צָהֳרַיִם טוֹבִים' : 'עֶרֶב טוֹב';

  // Rotating encouragement for streak banner (random per page load)
  const [streakMessage, setStreakMessage] = useState(STREAK_ENCOURAGEMENTS[0]);
  useEffect(() => {
    setStreakMessage(getRandomStreakEncouragement());
  }, []);

  // Daily inspiration quote (consistent throughout the day)
  const dailyQuote = useMemo(() => getDailyInspiration(), []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#1B4965] text-white px-6 py-8 rounded-b-3xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="flex items-center justify-between">
            <p className="text-[#5FA8D3] text-sm font-medium">{greeting}</p>
            {authStatus === 'authenticated' && (
              <Link
                href="/settings"
                className="text-[#5FA8D3] hover:text-white transition-colors"
                aria-label="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </Link>
            )}
          </div>
          <h1
            dir="rtl"
            className="font-[var(--font-hebrew-serif)] text-3xl mt-1"
          >
            {greetingHebrew}
          </h1>

          {/* Streak */}
          {profile.streakDays > 0 && (
            <div className="flex items-center gap-2 mt-4 bg-white/10 rounded-xl px-4 py-3">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-sm font-medium">{profile.streakDays} Day Streak</p>
                <p className="text-xs text-white/70">
                  <span dir="rtl" className="font-[var(--font-hebrew-serif)]">{streakMessage.hebrew}</span>
                  {' — '}
                  {formatWithName(streakMessage.english, userName)}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6 -mt-4 space-y-6">
        {/* Auth Banner for unsigned users */}
        {authStatus === 'unauthenticated' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#5FA8D3]/30 p-4 flex items-center gap-4"
          >
            <div className="text-2xl">☁️</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#2D3142]">Save your progress</p>
              <p className="text-xs text-gray-500">Sync across devices with a free account</p>
            </div>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-xl bg-[#1B4965] text-white text-xs font-medium hover:bg-[#163d55] transition-colors whitespace-nowrap"
            >
              Sign Up
            </Link>
          </motion.div>
        )}

        {/* Continue Learning Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/learn">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#1B4965] font-medium uppercase tracking-wider">
                    Continue Learning
                  </p>
                  <h2 className="text-xl font-bold text-[#2D3142] mt-1">
                    {masteredLetters === 0
                      ? 'Start Your First Lesson'
                      : `Level ${profile.currentLevel} — Letters`}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {masteredLetters === 0
                      ? "Let's learn your first Hebrew letters"
                      : `${masteredLetters} of ${totalLetters} letters mastered`}
                  </p>
                </div>
                <div className="bg-[#1B4965] text-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl">
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

        {/* Bootcamp Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <BootcampCard />
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-[#1B4965]">{masteredLetters}</p>
            <p className="text-xs text-gray-500 mt-1">Letters</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-[#4A7C59]">{masteredVowels}</p>
            <p className="text-xs text-gray-500 mt-1">Vowels</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <p className="text-2xl font-bold text-[#C6973F]">{milestones.length}</p>
            <p className="text-xs text-gray-500 mt-1">Milestones</p>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
        >
          <h3 className="text-lg font-bold text-[#2D3142]">Your Progress</h3>
          <ProgressBar
            value={letterProgress}
            label="Letters"
            showPercentage
            color="#1B4965"
          />
          <ProgressBar
            value={vowelProgress}
            label="Vowels"
            showPercentage
            color="#4A7C59"
          />
          <ProgressBar
            value={0}
            label="Prayers"
            showPercentage
            color="#C6973F"
          />
        </motion.div>

        {/* Prayer Path Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/siddur">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#2D3142]">Daven Path</h3>
                <span className="text-sm text-[#1B4965] font-medium">View All →</span>
              </div>
              <div className="space-y-3">
                {PRAYERS.slice(0, 3).map((prayer) => (
                  <div key={prayer.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                      {prayer.sortOrder === 1 ? '🔓' : '🔒'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2D3142]">
                        {prayer.nameEnglish}
                      </p>
                      <p
                        dir="rtl"
                        className="text-sm text-gray-400 font-[var(--font-hebrew-serif)]"
                      >
                        {prayer.nameHebrew}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Daily Inspiration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1B4965]/5 rounded-2xl p-6 text-center"
        >
          <p
            dir="rtl"
            className="font-[var(--font-hebrew-serif)] text-xl text-[#1B4965] leading-relaxed"
          >
            {dailyQuote.hebrew}
          </p>
          <p className="text-sm text-gray-600 mt-2 italic">
            &ldquo;{dailyQuote.english}&rdquo;
          </p>
          <p className="text-xs text-gray-400 mt-1">— {dailyQuote.source}</p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
