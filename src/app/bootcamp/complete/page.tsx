'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useBootcampStore } from '@/stores/bootcampStore';
import { useUserStore } from '@/stores/userStore';
import { track } from '@/lib/analytics';

export default function BootcampGraduationPage() {
  const { isBootcampComplete } = useBootcampStore();
  const { earnMilestone, hasMilestone, updateProfile } = useUserStore();

  useEffect(() => {
    // Cross-track unlocking: bump user level and mark milestones
    if (isBootcampComplete()) {
      updateProfile({
        hebrewLevel: 'read_slow',
        currentLevel: 3,
      });

      if (!hasMilestone('bootcamp_complete')) {
        earnMilestone('bootcamp_complete');
      }
      if (!hasMilestone('full_alephbet')) {
        earnMilestone('full_alephbet');
      }
      track('bootcamp_complete');
    }

    // Grand confetti
    const duration = 3000;
    const end = Date.now() + duration;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      confetti({
        particleCount: 50,
        angle: 60 + Math.random() * 60,
        spread: 60,
        origin: { x: Math.random(), y: 0.6 },
        colors: ['var(--primary)', 'var(--gold)', 'var(--success)', 'var(--primary-light)', '#8B5CF6'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isBootcampComplete, earnMilestone, hasMilestone, updateProfile]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <div className="text-7xl">🎓</div>

          <div>
            <h1 className="text-3xl font-bold text-foreground">
              You Can Read Hebrew
            </h1>
            <p className="text-gray-600 mt-3 text-lg">
              In just 5 sessions, you went from zero to reading prayers.
            </p>
          </div>

          {/* Achievement summary */}
          <div className="bg-white rounded-2xl border-2 border-gold/30 p-6 space-y-4">
            <h2 className="font-semibold text-gold">What You Accomplished</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-primary">22+</p>
                <p className="text-xs text-gray-500 mt-1">Letters mastered</p>
              </div>
              <div className="bg-[#8B5CF6]/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-[#8B5CF6]">14</p>
                <p className="text-xs text-gray-500 mt-1">Vowels learned</p>
              </div>
              <div className="bg-gold/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gold">50+</p>
                <p className="text-xs text-gray-500 mt-1">Words read</p>
              </div>
              <div className="bg-success/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-success">3</p>
                <p className="text-xs text-gray-500 mt-1">Prayers read</p>
              </div>
            </div>
          </div>

          {/* Inspirational message */}
          <div className="bg-primary/5 rounded-xl p-6">
            <p className="text-base text-primary italic leading-relaxed">
              &ldquo;You have joined a 3,000-year tradition of Jews who read these same letters,
              these same words, these same prayers. Every generation passes the torch —
              and now you carry it too.&rdquo;
            </p>
          </div>

          {/* What's next */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">What&apos;s Next?</h3>
            <p className="text-sm text-gray-500">
              Your bootcamp progress unlocked the Siddur and advanced lessons. Keep practicing to build fluency.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3 pt-2">
            <Link href="/siddur">
              <button className="w-full bg-primary text-white py-4 rounded-xl text-lg font-medium hover:bg-[#163d55] active:scale-[0.98] transition-all">
                Open the Siddur
              </button>
            </Link>
            <Link href="/learn">
              <button className="w-full border-2 border-primary text-primary py-3 rounded-xl font-medium hover:bg-primary/5 transition-colors">
                Continue Main Lessons
              </button>
            </Link>
            <Link href="/">
              <button className="w-full text-gray-500 py-3 rounded-xl font-medium hover:text-primary transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
