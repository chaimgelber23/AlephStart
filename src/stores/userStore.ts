import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  UserProfile,
  SkillProgress,
  LessonProgress,
  PrayerProgress,
  DailySession,
  Milestone,
  MilestoneType,
  LearningGoal,
  HebrewLevel,
  Nusach,
} from '@/types';

interface UserState {
  // Profile
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Skill progress
  skillProgress: Record<string, SkillProgress>;
  updateSkillProgress: (skillId: string, correct: boolean) => void;
  getSkillMastery: (skillId: string) => number;

  // Lesson progress
  lessonProgress: Record<string, LessonProgress>;
  completeLesson: (lessonId: string, score: number) => void;
  unlockLesson: (lessonId: string) => void;

  // Prayer progress
  prayerProgress: Record<string, PrayerProgress>;
  updatePrayerProgress: (prayerId: string, updates: Partial<PrayerProgress>) => void;

  // Daily sessions
  todaySession: DailySession;
  recordPractice: (correct: boolean, isNewSkill?: boolean) => void;

  // Streaks
  checkAndUpdateStreak: () => void;

  // Milestones
  milestones: Milestone[];
  earnMilestone: (type: MilestoneType) => void;
  hasMilestone: (type: MilestoneType) => boolean;

  // Onboarding
  completeOnboarding: (goal: LearningGoal, level: HebrewLevel, nusach: Nusach, dailyMinutes: number) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  currentLevel: 1,
  nusach: 'ashkenaz',
  dailyGoalMinutes: 5,
  transliterationMode: 'full',
  audioSpeed: 1.0,
  streakDays: 0,
  longestStreak: 0,
  totalStudyMinutes: 0,
  totalWordsMastered: 0,
  learningGoal: 'daven',
  hebrewLevel: 'none',
  onboardingComplete: false,
};

const getTodayString = () => new Date().toISOString().split('T')[0];

const DEFAULT_SESSION: DailySession = {
  date: getTodayString(),
  minutesStudied: 0,
  itemsReviewed: 0,
  itemsCorrect: 0,
  newSkillsLearned: 0,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,

      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),

      // Skill progress
      skillProgress: {},

      updateSkillProgress: (skillId, correct) =>
        set((state) => {
          const existing = state.skillProgress[skillId] || {
            skillId,
            masteryLevel: 0,
            timesPracticed: 0,
            timesCorrect: 0,
          };

          const newCorrect = existing.timesCorrect + (correct ? 1 : 0);
          const newPracticed = existing.timesPracticed + 1;
          const mastery = Math.min(1, newCorrect / Math.max(newPracticed, 1));

          return {
            skillProgress: {
              ...state.skillProgress,
              [skillId]: {
                ...existing,
                timesPracticed: newPracticed,
                timesCorrect: newCorrect,
                masteryLevel: mastery,
                lastPracticed: new Date(),
              },
            },
          };
        }),

      getSkillMastery: (skillId) => {
        const progress = get().skillProgress[skillId];
        return progress?.masteryLevel || 0;
      },

      // Lesson progress
      lessonProgress: {},

      completeLesson: (lessonId, score) =>
        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: {
              lessonId,
              status: 'completed',
              score,
              completedAt: new Date(),
            },
          },
        })),

      unlockLesson: (lessonId) =>
        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: {
              lessonId,
              status: 'available',
            },
          },
        })),

      // Prayer progress
      prayerProgress: {},

      updatePrayerProgress: (prayerId, updates) =>
        set((state) => ({
          prayerProgress: {
            ...state.prayerProgress,
            [prayerId]: {
              ...state.prayerProgress[prayerId],
              prayerId,
              ...updates,
              lastPracticed: new Date(),
            } as PrayerProgress,
          },
        })),

      // Daily sessions
      todaySession: DEFAULT_SESSION,

      recordPractice: (correct, isNewSkill = false) =>
        set((state) => {
          const today = getTodayString();
          const session =
            state.todaySession.date === today
              ? state.todaySession
              : { ...DEFAULT_SESSION, date: today };

          return {
            todaySession: {
              ...session,
              itemsReviewed: session.itemsReviewed + 1,
              itemsCorrect: session.itemsCorrect + (correct ? 1 : 0),
              newSkillsLearned: session.newSkillsLearned + (isNewSkill ? 1 : 0),
            },
          };
        }),

      // Streaks
      checkAndUpdateStreak: () =>
        set((state) => {
          const today = getTodayString();
          const lastPractice = state.profile.lastPracticeDate;

          if (lastPractice === today) return state; // Already practiced today

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          let newStreak = state.profile.streakDays;

          if (lastPractice === yesterdayStr) {
            // Practiced yesterday — continue streak
            newStreak += 1;
          } else if (!lastPractice) {
            // First time ever
            newStreak = 1;
          } else {
            // Missed a day (or more) — reset streak
            // TODO: Check for Shabbat/YT grace period
            newStreak = 1;
          }

          return {
            profile: {
              ...state.profile,
              streakDays: newStreak,
              longestStreak: Math.max(newStreak, state.profile.longestStreak),
              lastPracticeDate: today,
            },
          };
        }),

      // Milestones
      milestones: [],

      earnMilestone: (type) =>
        set((state) => {
          if (state.milestones.some((m) => m.type === type)) return state;
          return {
            milestones: [...state.milestones, { type, earnedAt: new Date() }],
          };
        }),

      hasMilestone: (type) => {
        return get().milestones.some((m) => m.type === type);
      },

      // Onboarding
      completeOnboarding: (goal, level, nusach, dailyMinutes) =>
        set((state) => ({
          profile: {
            ...state.profile,
            learningGoal: goal,
            hebrewLevel: level,
            nusach,
            dailyGoalMinutes: dailyMinutes,
            onboardingComplete: true,
          },
        })),
    }),
    {
      name: 'alephstart-user',
    }
  )
);
