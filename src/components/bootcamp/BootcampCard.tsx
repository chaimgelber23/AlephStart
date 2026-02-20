'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
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
          className="bg-[#4A7C59]/5 border-2 border-[#4A7C59]/20 rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow"
        >
          <div className="w-10 h-10 bg-[#4A7C59] rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-[#4A7C59] text-sm">Hebrew Reading Bootcamp Complete</p>
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
          className="bg-gradient-to-br from-[#C6973F]/10 to-[#C6973F]/5 border-2 border-[#C6973F]/30 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-[#C6973F] rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="font-['Noto_Serif_Hebrew',serif] text-white text-xl">א</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#2D3142]">Hebrew Reading Bootcamp</p>
              <p className="text-sm text-gray-600 mt-1">
                Read Hebrew in 5 sessions. Learn every letter and vowel — then read real prayers.
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-[#C6973F] text-white text-sm font-medium px-4 py-2 rounded-xl">
                Start Now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
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
        className="bg-white border-2 border-[#1B4965]/20 rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C6973F] rounded-lg flex items-center justify-center">
              <span className="font-['Noto_Serif_Hebrew',serif] text-white text-sm">א</span>
            </div>
            <p className="font-semibold text-[#2D3142]">Hebrew Reading Bootcamp</p>
          </div>
          <span className="text-xs bg-[#1B4965] text-white px-2 py-0.5 rounded-full">
            Day {progress.currentDay}/5
          </span>
        </div>
        <ProgressBar value={overallProgress} size="sm" color="#C6973F" />
        <p className="text-xs text-gray-500 mt-2">{completedDays} of 5 days completed</p>
      </motion.div>
    </Link>
  );
}
