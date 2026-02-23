'use client';

import type { CoachingPhase } from '@/types';

const STEPS: { phase: CoachingPhase; label: string; shortLabel: string }[] = [
  { phase: 'context', label: 'Context', shortLabel: 'Info' },
  { phase: 'listen', label: 'Read', shortLabel: 'Read' },
  { phase: 'follow_along', label: 'Practice', shortLabel: 'Practice' },
  { phase: 'say_together', label: 'Say Aloud', shortLabel: 'Say' },
  { phase: 'try_yourself', label: 'Solo', shortLabel: 'Solo' },
  { phase: 'section_complete', label: 'Done', shortLabel: 'Done' },
];

const PHASE_ORDER: CoachingPhase[] = STEPS.map((s) => s.phase);

interface CoachingStepNavProps {
  currentPhase: CoachingPhase;
  completedPhases: Set<CoachingPhase>;
  onJumpTo: (phase: CoachingPhase) => void;
  showContext: boolean;
}

export function CoachingStepNav({
  currentPhase,
  completedPhases,
  onJumpTo,
  showContext,
}: CoachingStepNavProps) {
  const visibleSteps = showContext
    ? STEPS
    : STEPS.filter((s) => s.phase !== 'context');

  // Don't show nav during feedback
  if (currentPhase === 'feedback') return null;

  return (
    <div className="flex items-center gap-1.5 px-2 py-2 overflow-x-auto">
      {visibleSteps.map((step) => {
        const isCurrent = step.phase === currentPhase;
        const isCompleted = completedPhases.has(step.phase);
        const currentIdx = PHASE_ORDER.indexOf(currentPhase);
        const stepIdx = PHASE_ORDER.indexOf(step.phase);

        return (
          <button
            key={step.phase}
            onClick={() => onJumpTo(step.phase)}
            className={`
              flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium
              whitespace-nowrap transition-all
              ${
                isCurrent
                  ? 'bg-primary text-white'
                  : isCompleted
                  ? 'bg-success/10 text-success'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500'
              }
            `}
          >
            {isCompleted && !isCurrent && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {step.shortLabel}
          </button>
        );
      })}
    </div>
  );
}

export { PHASE_ORDER };
