'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LETTERS } from '@/lib/content/letters';
import { CORE_VOWELS } from '@/lib/content/vowels';
import { PRAYERS } from '@/lib/content/prayers';

export function Dashboard() {
  const profile = useUserStore((s) => s.profile);
  const skillProgress = useUserStore((s) => s.skillProgress);
  const milestones = useUserStore((s) => s.milestones);

  // Calculate overall progress
  const totalLetters = LETTERS.length;
  const masteredLetters = Object.values(skillProgress).filter(
    (p) => p.masteryLevel >= 0.8
  ).length;
  const letterProgress = masteredLetters / totalLetters;

  const totalVowels = CORE_VOWELS.length;
  const masteredVowels = 0; // TODO: track vowel progress separately
  const vowelProgress = masteredVowels / totalVowels;

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Boker Tov' : hour < 18 ? 'Tzohorayim Tovim' : "Erev Tov";
  const greetingHebrew =
    hour < 12 ? 'בּוֹקֶר טוֹב' : hour < 18 ? 'צָהֳרַיִם טוֹבִים' : 'עֶרֶב טוֹב';

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#1B4965] text-white px-6 py-8 rounded-b-3xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <p className="text-[#5FA8D3] text-sm font-medium">{greeting}</p>
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
                  כָּל הַתְחָלוֹת קָשׁוֹת — All beginnings are hard
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6 -mt-4 space-y-6">
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
            לֹא עָלֶיךָ הַמְּלָאכָה לִגְמֹר
          </p>
          <p className="text-sm text-gray-600 mt-2 italic">
            &ldquo;You are not required to finish the work, but neither are you free to stop trying.&rdquo;
          </p>
          <p className="text-xs text-gray-400 mt-1">— Pirkei Avot 2:16</p>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-md mx-auto flex justify-around">
          <NavItem href="/" icon="🏠" label="Home" active />
          <NavItem href="/learn" icon="📚" label="Learn" />
          <NavItem href="/practice" icon="✏️" label="Practice" />
          <NavItem href="/siddur" icon="📖" label="Siddur" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        flex flex-col items-center gap-1 px-4 py-1
        ${active ? 'text-[#1B4965]' : 'text-gray-400'}
      `}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}
