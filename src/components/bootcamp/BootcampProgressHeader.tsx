'use client';

import Link from 'next/link';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface BootcampProgressHeaderProps {
  dayNumber: number;
  phaseName: string;
  phaseIndex: number;  // 0-based index of current phase step
  phaseTotal: number;  // total steps in current phase
  overallProgress: number; // 0-1 overall day progress
}

export function BootcampProgressHeader({
  dayNumber,
  phaseName,
  phaseIndex,
  phaseTotal,
  overallProgress,
}: BootcampProgressHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <Link
          href="/bootcamp"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <span className="text-sm font-semibold text-foreground">
          Day {dayNumber} of 5
        </span>
        <span className="text-xs text-gray-500">
          {phaseName} {phaseIndex + 1}/{phaseTotal}
        </span>
      </div>
      <ProgressBar value={overallProgress} size="sm" color='var(--primary)' />
    </div>
  );
}
