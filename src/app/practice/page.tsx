'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-[#FEFDFB]">
      {/* Header */}
      <div className="bg-[#1B4965] text-white px-6 py-8 rounded-b-3xl">
        <div className="max-w-md mx-auto">
          <Link href="/" className="text-[#5FA8D3] text-sm hover:text-white">
            ← Home
          </Link>
          <h1 className="text-2xl font-bold mt-2">Daily Practice</h1>
          <p className="text-[#5FA8D3] text-sm mt-1">
            Review what you&apos;ve learned
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-4"
        >
          <div className="text-5xl">📝</div>
          <h2 className="text-xl font-bold text-[#2D3142]">
            Practice Coming Soon
          </h2>
          <p className="text-gray-500">
            Complete a few lessons first, then your personalized daily practice
            will appear here based on what you&apos;ve learned.
          </p>
          <Link href="/learn">
            <button className="bg-[#1B4965] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#163d55] transition-colors mt-4">
              Start a Lesson →
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-md mx-auto flex justify-around">
          <Link href="/" className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400">
            <span className="text-xl">🏠</span>
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link href="/learn" className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400">
            <span className="text-xl">📚</span>
            <span className="text-xs font-medium">Learn</span>
          </Link>
          <Link href="/practice" className="flex flex-col items-center gap-1 px-4 py-1 text-[#1B4965]">
            <span className="text-xl">✏️</span>
            <span className="text-xs font-medium">Practice</span>
          </Link>
          <Link href="/siddur" className="flex flex-col items-center gap-1 px-4 py-1 text-gray-400">
            <span className="text-xl">📖</span>
            <span className="text-xs font-medium">Siddur</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
