'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useBootcampStore } from '@/stores/bootcampStore';
import { getBootcampDay, getBootcampLettersThroughDay, getBootcampVowelsThroughDay } from '@/lib/content/bootcampDays';
import type { BootcampDayNumber } from '@/types';

export default function BootcampDayCompletePage() {
  const params = useParams();
  const router = useRouter();
  const dayNumber = parseInt(params.day as string) as BootcampDayNumber;
  const dayData = getBootcampDay(dayNumber);
  const { completeDay, completeBootcamp, progress } = useBootcampStore();
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!completed) {
      completeDay(dayNumber);
      if (dayNumber === 5) {
        completeBootcamp();
      }
      setCompleted(true);

      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1B4965', '#C6973F', '#4A7C59', '#5FA8D3'],
      });
    }
  }, [completed, completeDay, completeBootcamp, dayNumber]);

  if (!dayData) {
    return (
      <div className="min-h-screen bg-[#FEFDFB] flex items-center justify-center">
        <p className="text-gray-500">Day not found</p>
      </div>
    );
  }

  const lettersThroughDay = getBootcampLettersThroughDay(dayNumber);
  const vowelsThroughDay = getBootcampVowelsThroughDay(dayNumber);
  const dayProgress = progress.dayProgress[dayNumber];
  const drillScore = dayProgress?.drillScore || 0;
  const drillTotal = dayProgress?.drillTotal || dayData.practiceWords.length;
  const isLastDay = dayNumber === 5;

  return (
    <div className="min-h-screen bg-[#FEFDFB]">
      <div className="max-w-md mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="text-6xl">{isLastDay ? '🎓' : '🎉'}</div>
          <h1 className="text-2xl font-bold text-[#2D3142]">
            Day {dayNumber} Complete!
          </h1>
          <p className="text-gray-600">
            {dayData.title} — done.
          </p>

          {/* Stats card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Word drill score</span>
              <span className="font-bold text-[#1B4965]">
                {drillScore}/{drillTotal} ({Math.round((drillScore / Math.max(drillTotal, 1)) * 100)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Letters learned so far</span>
              <span className="font-bold text-[#4A7C59]">{lettersThroughDay.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Vowels learned so far</span>
              <span className="font-bold text-[#8B5CF6]">{vowelsThroughDay.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Practice words</span>
              <span className="font-bold text-[#C6973F]">{dayData.practiceWords.length}</span>
            </div>
          </div>

          {/* Encouragement */}
          <div className="bg-[#1B4965]/5 rounded-xl p-4">
            <p className="text-sm text-[#1B4965] italic">
              {dayNumber === 1 && 'You just started reading Hebrew. The journey of a thousand words begins with a single letter.'}
              {dayNumber === 2 && 'You can read the bracha formula — words that Jews have been saying for thousands of years.'}
              {dayNumber === 3 && 'You read the complete bracha opening. Every bracha you hear in shul starts with what you just read.'}
              {dayNumber === 4 && 'You know the entire Aleph-Bet. Every letter, every vowel. You read Modeh Ani — the first prayer of the day.'}
              {dayNumber === 5 && 'You read the Shema. You read Hamotzi. In just 5 sessions, you went from zero to reading Hebrew.'}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3 pt-4">
            {isLastDay ? (
              <button
                onClick={() => router.push('/bootcamp/complete')}
                className="w-full bg-[#C6973F] text-white py-4 rounded-xl text-lg font-medium hover:bg-[#b8892f] active:scale-[0.98] transition-all"
              >
                See Your Graduation
              </button>
            ) : (
              <button
                onClick={() => router.push(`/bootcamp/day/${dayNumber + 1}`)}
                className="w-full bg-[#1B4965] text-white py-4 rounded-xl text-lg font-medium hover:bg-[#163d55] active:scale-[0.98] transition-all"
              >
                Continue to Day {dayNumber + 1}
              </button>
            )}
            <Link href="/bootcamp">
              <button className="w-full border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:border-[#1B4965] hover:text-[#1B4965] transition-colors">
                Back to Bootcamp
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
