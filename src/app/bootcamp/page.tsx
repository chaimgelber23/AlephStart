'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useBootcampStore } from '@/stores/bootcampStore';
import { BootcampDayTimeline } from '@/components/bootcamp/BootcampDayTimeline';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function BootcampPage() {
  const router = useRouter();
  const { progress, enrollInBootcamp, isBootcampComplete } = useBootcampStore();

  const completedDays = Object.values(progress.dayProgress).filter(
    (d) => d.status === 'completed'
  ).length;
  const overallProgress = completedDays / 5;
  const complete = isBootcampComplete();

  const handleSelectDay = (day: number) => {
    if (!progress.enrolled) {
      enrollInBootcamp();
    }
    router.push(`/bootcamp/day/${day}`);
  };

  const handleEnroll = () => {
    enrollInBootcamp();
  };

  return (
    <div className="min-h-screen bg-[#FEFDFB]">
      {/* Header */}
      <div className="bg-[#1B4965] text-white px-6 py-8">
        <div className="max-w-md mx-auto">
          <Link href="/" className="text-white/70 text-sm hover:text-white mb-4 inline-flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold mt-2">Hebrew Reading Bootcamp</h1>
            <p className="text-white/80 mt-2">
              {complete
                ? 'You did it! You can read Hebrew.'
                : 'Read Hebrew in 5 sessions. Every letter, every vowel — then real prayers.'}
            </p>
          </motion.div>

          {/* Overall progress */}
          {progress.enrolled && (
            <div className="mt-4">
              <ProgressBar value={overallProgress} size="sm" color="#C6973F" showPercentage />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Enroll card (if not enrolled) */}
        {!progress.enrolled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold text-[#2D3142]">What you&apos;ll learn</h2>
            <div className="space-y-3">
              {[
                { label: '22+ letters', desc: 'The complete Hebrew alphabet', icon: 'א' },
                { label: '14 vowels', desc: 'Every nekuda (vowel mark)', icon: 'ַ' },
                { label: '50+ words', desc: 'Essential Jewish vocabulary', icon: '📖' },
                { label: 'Real prayers', desc: 'Modeh Ani, Shema, Hamotzi', icon: '🙏' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1B4965]/5 rounded-lg flex items-center justify-center text-lg">
                    <span className="font-['Noto_Serif_Hebrew',serif]">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2D3142]">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center">
              ~15-20 minutes per session
            </p>
            <button
              onClick={handleEnroll}
              className="w-full bg-[#C6973F] text-white py-4 rounded-xl text-lg font-medium hover:bg-[#b8892f] active:scale-[0.98] transition-all"
            >
              Start the Bootcamp
            </button>
          </motion.div>
        )}

        {/* Graduation banner */}
        {complete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#4A7C59]/5 border-2 border-[#4A7C59]/20 rounded-2xl p-6 text-center"
          >
            <p className="text-4xl mb-3">🎓</p>
            <h2 className="text-xl font-bold text-[#4A7C59]">Bootcamp Complete!</h2>
            <p className="text-sm text-gray-600 mt-2">
              You can now read Hebrew. Continue to the main curriculum or the Siddur to keep practicing.
            </p>
            <div className="flex gap-3 mt-4">
              <Link href="/learn" className="flex-1">
                <button className="w-full py-3 rounded-xl border-2 border-[#1B4965] text-[#1B4965] font-medium hover:bg-[#1B4965]/5 transition-colors">
                  Main Lessons
                </button>
              </Link>
              <Link href="/siddur" className="flex-1">
                <button className="w-full py-3 rounded-xl bg-[#1B4965] text-white font-medium hover:bg-[#163d55] transition-colors">
                  Siddur
                </button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Day timeline */}
        <div>
          <h2 className="text-lg font-semibold text-[#2D3142] mb-3">
            {progress.enrolled ? 'Your Progress' : '5-Day Roadmap'}
          </h2>
          <BootcampDayTimeline progress={progress} onSelectDay={handleSelectDay} />
        </div>
      </div>
    </div>
  );
}
