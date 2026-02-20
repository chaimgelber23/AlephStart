import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BootcampDayNumber, BootcampDayProgress, BootcampProgress } from '@/types';

interface BootcampState {
  progress: BootcampProgress;

  // Actions
  enrollInBootcamp: () => void;
  startDay: (day: BootcampDayNumber) => void;
  completeTeachPhase: (day: BootcampDayNumber) => void;
  completeDrillPhase: (day: BootcampDayNumber, score: number, total: number) => void;
  completeSyllablePhase: (day: BootcampDayNumber) => void;
  completeWordPhase: (day: BootcampDayNumber) => void;
  completeReadingPhase: (day: BootcampDayNumber) => void;
  completeDay: (day: BootcampDayNumber) => void;
  completeBootcamp: () => void;

  // Queries
  isDayAvailable: (day: BootcampDayNumber) => boolean;
  isDayComplete: (day: BootcampDayNumber) => boolean;
  isBootcampComplete: () => boolean;
  getCurrentDay: () => BootcampDayNumber;
}

const DEFAULT_DAY_PROGRESS = (day: BootcampDayNumber, status: BootcampDayProgress['status'] = 'locked'): BootcampDayProgress => ({
  day,
  status,
  teachPhaseComplete: false,
  syllablesComplete: false,
  wordsComplete: false,
  readingComplete: false,
});

const DEFAULT_PROGRESS: BootcampProgress = {
  enrolled: false,
  currentDay: 1,
  dayProgress: {
    1: DEFAULT_DAY_PROGRESS(1, 'available'),
    2: DEFAULT_DAY_PROGRESS(2),
    3: DEFAULT_DAY_PROGRESS(3),
    4: DEFAULT_DAY_PROGRESS(4),
    5: DEFAULT_DAY_PROGRESS(5),
  },
};

export const useBootcampStore = create<BootcampState>()(
  persist(
    (set, get) => ({
      progress: DEFAULT_PROGRESS,

      enrollInBootcamp: () =>
        set((state) => ({
          progress: {
            ...state.progress,
            enrolled: true,
            enrolledAt: new Date().toISOString(),
            dayProgress: {
              ...state.progress.dayProgress,
              1: { ...state.progress.dayProgress[1], status: 'available' },
            },
          },
        })),

      startDay: (day) =>
        set((state) => {
          const dayProg = state.progress.dayProgress[day];
          if (!dayProg || dayProg.status === 'completed') return state;
          return {
            progress: {
              ...state.progress,
              currentDay: day,
              dayProgress: {
                ...state.progress.dayProgress,
                [day]: { ...dayProg, status: 'in_progress' },
              },
            },
          };
        }),

      completeTeachPhase: (day) =>
        set((state) => ({
          progress: {
            ...state.progress,
            dayProgress: {
              ...state.progress.dayProgress,
              [day]: { ...state.progress.dayProgress[day], teachPhaseComplete: true },
            },
          },
        })),

      completeDrillPhase: (day, score, total) =>
        set((state) => ({
          progress: {
            ...state.progress,
            dayProgress: {
              ...state.progress.dayProgress,
              [day]: { ...state.progress.dayProgress[day], drillScore: score, drillTotal: total },
            },
          },
        })),

      completeSyllablePhase: (day) =>
        set((state) => ({
          progress: {
            ...state.progress,
            dayProgress: {
              ...state.progress.dayProgress,
              [day]: { ...state.progress.dayProgress[day], syllablesComplete: true },
            },
          },
        })),

      completeWordPhase: (day) =>
        set((state) => ({
          progress: {
            ...state.progress,
            dayProgress: {
              ...state.progress.dayProgress,
              [day]: { ...state.progress.dayProgress[day], wordsComplete: true },
            },
          },
        })),

      completeReadingPhase: (day) =>
        set((state) => ({
          progress: {
            ...state.progress,
            dayProgress: {
              ...state.progress.dayProgress,
              [day]: { ...state.progress.dayProgress[day], readingComplete: true },
            },
          },
        })),

      completeDay: (day) =>
        set((state) => {
          const nextDay = (day < 5 ? day + 1 : day) as BootcampDayNumber;
          const updatedDayProgress = {
            ...state.progress.dayProgress,
            [day]: {
              ...state.progress.dayProgress[day],
              status: 'completed' as const,
              completedAt: new Date().toISOString(),
            },
          };

          // Unlock next day
          if (day < 5) {
            updatedDayProgress[nextDay] = {
              ...updatedDayProgress[nextDay],
              status: 'available' as const,
            };
          }

          return {
            progress: {
              ...state.progress,
              currentDay: day < 5 ? nextDay : day,
              dayProgress: updatedDayProgress,
            },
          };
        }),

      completeBootcamp: () =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedAt: new Date().toISOString(),
          },
        })),

      // Queries
      isDayAvailable: (day) => {
        const dayProg = get().progress.dayProgress[day];
        return dayProg?.status === 'available' || dayProg?.status === 'in_progress';
      },

      isDayComplete: (day) => {
        return get().progress.dayProgress[day]?.status === 'completed';
      },

      isBootcampComplete: () => {
        return !!get().progress.completedAt;
      },

      getCurrentDay: () => {
        return get().progress.currentDay;
      },
    }),
    {
      name: 'alephstart-bootcamp',
    }
  )
);
