'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { useBootcampStore } from '@/stores/bootcampStore';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function BootcampCard() {
  const { progress, isBootcampComplete } = useBootcampStore();

  const completedDays = Object.values(progress.dayProgress).filter(
    (d) => d.status === 'completed'
  ).length;
  const overallProgress = completedDays / 5;
  const complete = isBootcampComplete();

  // Completed state — compact
  if (complete) {
    return (
      <Link href="/bootcamp">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-success/5 border-2 border-success/20 rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow"
        >
          <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
          <div>
            <p className="font-serif font-semibold text-success text-sm">Hebrew Reading Bootcamp Complete</p>
            <p className="text-xs text-gray-500">5/5 days finished</p>
          </div>
        </motion.div>
      </Link>
    );
  }

  // Not enrolled state
  if (!progress.enrolled) {
    return (
      <Link href="/bootcamp">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gold/8 to-gold/3 border border-gold/15 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="font-['Noto_Serif_Hebrew',serif] text-white text-xl">א</span>
            </div>
            <div className="flex-1">
              <p className="font-serif font-bold text-foreground">Hebrew Reading Bootcamp</p>
              <p className="text-sm text-gray-600 mt-1">
                Read Hebrew in 5 sessions. Learn every letter and vowel — then read real prayers.
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-gold text-white text-sm font-medium px-4 py-2 rounded-xl">
                Start Now
                <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  // In progress state
  return (
    <Link href="/bootcamp">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-2 border-primary/20 rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
              <span className="font-[var(--font-hebrew-serif)] text-white text-sm">א</span>
            </div>
            <p className="font-serif font-semibold text-foreground">Hebrew Reading Bootcamp</p>
          </div>
          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
            Day {progress.currentDay}/5
          </span>
        </div>
        <ProgressBar value={overallProgress} size="sm" color="var(--gold)" />
        <p className="text-xs text-gray-500 mt-2">{completedDays} of 5 days completed</p>
      </motion.div>
    </Link>
  );
}
