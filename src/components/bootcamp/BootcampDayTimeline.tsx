'use client';

import { motion } from 'framer-motion';
import { BOOTCAMP_DAYS } from '@/lib/content/bootcampDays';
import type { BootcampProgress } from '@/types';

interface BootcampDayTimelineProps {
  progress: BootcampProgress;
  onSelectDay: (day: number) => void;
}

export function BootcampDayTimeline({ progress, onSelectDay }: BootcampDayTimelineProps) {
  return (
    <div className="space-y-3">
      {BOOTCAMP_DAYS.map((day, index) => {
        const dayProgress = progress.dayProgress[day.day];
        const status = dayProgress?.status || 'locked';
        const isAvailable = status === 'available' || status === 'in_progress';
        const isComplete = status === 'completed';
        const isLocked = status === 'locked';

        return (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => isAvailable && onSelectDay(day.day)}
              disabled={isLocked}
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left
                ${isComplete ? 'bg-[#4A7C59]/5 border-[#4A7C59]/30' : ''}
                ${isAvailable ? 'bg-white border-[#1B4965] shadow-sm hover:shadow-md cursor-pointer active:scale-[0.99]' : ''}
                ${isLocked ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed' : ''}
              `}
            >
              {/* Day number circle */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                  text-lg font-bold
                  ${isComplete ? 'bg-[#4A7C59] text-white' : ''}
                  ${isAvailable ? 'bg-[#1B4965] text-white' : ''}
                  ${isLocked ? 'bg-gray-200 text-gray-400' : ''}
                `}
              >
                {isComplete ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  day.day
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-semibold ${isLocked ? 'text-gray-400' : 'text-[#2D3142]'}`}>
                    Day {day.day}: {day.title}
                  </p>
                  {isAvailable && !isComplete && (
                    <span className="text-xs bg-[#1B4965] text-white px-2 py-0.5 rounded-full">
                      {status === 'in_progress' ? 'Continue' : 'Start'}
                    </span>
                  )}
                </div>
                <p className={`text-sm truncate ${isLocked ? 'text-gray-300' : 'text-gray-500'}`}>
                  {day.subtitle}
                </p>
                <p className={`text-xs mt-0.5 ${isLocked ? 'text-gray-300' : 'text-gray-400'}`}>
                  ~{day.estimatedMinutes} min
                </p>
              </div>

              {/* Lock icon for locked days */}
              {isLocked && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 flex-shrink-0">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
