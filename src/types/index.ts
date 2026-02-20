// ==========================================
// CORE TYPES FOR ALEPHSTART
// ==========================================

// --- Skill Types ---
export type SkillType = 'letter' | 'vowel' | 'rule' | 'word' | 'prayer';

export interface Skill {
  id: string;
  type: SkillType;
  level: number;
  sortOrder: number;
  hebrew: string;
  hebrewWithNikud?: string;
  nameEnglish: string;
  sound?: string;
  mnemonic?: string;
  confusableWith?: string; // ID of confusable letter
  audioUrl?: string;
  imageUrl?: string;
  description?: string;
  teachingNotes?: string;
}

// --- Letter & Vowel Data ---
export interface Letter {
  id: string;
  hebrew: string;
  name: string;
  sound: string;
  transliteration: string;
  mnemonic: string;
  confusableWith?: string;
  confusableHint?: string;
  audioUrl: string;
  isFinalForm: boolean;
  baseLetterOf?: string; // for sofit letters
  hasDagesh?: boolean;
  dageshSound?: string;
}

export interface Vowel {
  id: string;
  hebrew: string;
  name: string;
  sound: string;
  soundGroup: 'ah' | 'eh' | 'ee' | 'oh' | 'oo' | 'shva' | 'chataf';
  color: string;
  transliteration: string;
  audioUrl: string;
  description: string;
}

// --- Lesson Types ---
export interface Lesson {
  id: string;
  level: number;
  sortOrder: number;
  title: string;
  description: string;
  skillIds: string[];
  estimatedMinutes: number;
  prerequisiteLessonId?: string;
}

// --- Practice Types ---
export type PracticeType =
  | 'tap_to_hear'
  | 'choose_sound'
  | 'choose_letter'
  | 'spot_difference'
  | 'build_syllable'
  | 'read_word'
  | 'read_line';

export interface PracticeItem {
  id: string;
  skillId: string;
  lessonId: string;
  type: PracticeType;
  promptHebrew: string;
  promptHebrewNikud?: string;
  promptAudioUrl?: string;
  correctAnswer: string;
  distractors: string[];
  difficulty: number;
  tags: string[];
}

export type AttemptResult = 'correct' | 'incorrect' | 'skipped';

export interface Attempt {
  id: string;
  practiceItemId: string;
  result: AttemptResult;
  responseTimeMs: number;
  userAnswer?: string;
  createdAt: Date;
}

// --- Prayer / Siddur Types ---
export interface Prayer {
  id: string;
  slug: string;
  nameHebrew: string;
  nameEnglish: string;
  category: string;
  sortOrder: number;
  whenSaid: string;
  whySaid: string;
  inspirationText: string;
  requiredLevel: number;
  estimatedReadSeconds: number;
  sections: PrayerSection[];
}

export interface PrayerSection {
  id: string;
  sortOrder: number;
  hebrewText: string; // with nekudot
  transliteration: string;
  translation: string;
  audioUrl?: string;
  slowAudioUrl?: string;
  wordTimings?: WordTiming[];
  notes?: string;
}

export interface WordTiming {
  word: string;
  startMs: number;
  endMs: number;
}

// --- User & Progress Types ---
export type Nusach = 'ashkenaz' | 'sefard' | 'edot';
export type Pronunciation = 'modern' | 'american';
export type TransliterationMode = 'full' | 'faded' | 'tap' | 'off';
export type LearningGoal = 'daven' | 'learn' | 'explore' | 'all';
export type HebrewLevel = 'none' | 'some_letters' | 'read_slow' | 'read_improve';

export interface UserProfile {
  id?: string;
  displayName?: string;
  email?: string;
  currentLevel: number;
  nusach: Nusach;
  pronunciation: Pronunciation;
  dailyGoalMinutes: number;
  transliterationMode: TransliterationMode;
  audioSpeed: number;
  streakDays: number;
  longestStreak: number;
  lastPracticeDate?: string;
  totalStudyMinutes: number;
  totalWordsMastered: number;
  learningGoal: LearningGoal;
  hebrewLevel: HebrewLevel;
  onboardingComplete: boolean;
  // Streak freeze
  streakFreezes: number; // available freezes (max 2)
  lastStreakFreezeWeek?: string; // ISO week string for weekly freeze grant
}

export interface DailyQuest {
  id: string;
  label: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface LearnSession {
  currentLesson: number;
  phase: 'teach' | 'drill' | 'complete';
  teachIndex: number;
  drillIndex: number;
  drillScore: number;
  savedAt: string;
}

export interface SkillProgress {
  skillId: string;
  masteryLevel: number; // 0.0 to 1.0
  timesPracticed: number;
  timesCorrect: number;
  lastPracticed?: Date;
}

export interface LessonProgress {
  lessonId: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  score?: number;
  completedAt?: Date;
}

export interface PrayerProgress {
  prayerId: string;
  status: 'locked' | 'available' | 'learning' | 'mastered';
  listenComplete: boolean;
  echoComplete: boolean;
  readComplete: boolean;
  bestWpm?: number;
  lastPracticed?: Date;
}

export interface DailySession {
  date: string;
  minutesStudied: number;
  itemsReviewed: number;
  itemsCorrect: number;
  newSkillsLearned: number;
}

export type MilestoneType =
  | 'first_letter'
  | 'half_alephbet'
  | 'full_alephbet'
  | 'first_word'
  | 'first_prayer'
  | 'shema_reader'
  | 'bracha_master'
  | 'shul_ready'
  | 'independent_davener'
  // Bootcamp milestones
  | 'bootcamp_day1'
  | 'bootcamp_day2'
  | 'bootcamp_day3'
  | 'bootcamp_day4'
  | 'bootcamp_day5'
  | 'bootcamp_complete'
  | 'bootcamp_first_word'
  | 'bootcamp_50_words';

export interface Milestone {
  type: MilestoneType;
  earnedAt: Date;
}

// --- Practice Session State ---
export interface PracticeSession {
  items: PracticeItem[];
  currentIndex: number;
  attempts: Attempt[];
  startedAt: Date;
  isComplete: boolean;
}

// --- Coaching Types ---
export type CoachingPhase =
  | 'context'
  | 'listen'
  | 'follow_along'
  | 'say_together'
  | 'try_yourself'
  | 'section_complete'
  | 'feedback';

export interface CoachingPreferences {
  listenCount: number;         // default 3, range 1-5
  followAlongCount: number;    // default 2, range 1-3
  sayTogetherCount: number;    // default 2, range 1-3
  initialSpeed: number;        // default 0.75
  showTranslationDuringPractice: boolean;
  skipContextCard: boolean;
}

export interface SectionCoachingProgress {
  coachingComplete: boolean;
  currentStep: CoachingPhase;
  listenCount: number;
  lastPracticed: string;
}

export interface CoachingFeedback {
  paceRating: 'too_slow' | 'just_right' | 'too_fast';
  listenCountRating: 'fewer' | 'perfect' | 'more';
  helpfulAspects: ('hearing' | 'transliteration' | 'translation' | 'all')[];
}

// --- FSRS Card State ---
export interface CardReview {
  practiceItemId: string;
  difficulty: number;
  stability: number;
  dueDate: Date;
  lastReview?: Date;
  reps: number;
  lapses: number;
  state: 'new' | 'learning' | 'review' | 'relearning';
}

// ==========================================
// BOOTCAMP TYPES
// ==========================================

export type BootcampDayNumber = 1 | 2 | 3 | 4 | 5;

export type BootcampVocabCategory =
  | 'greetings'
  | 'brachot'
  | 'shabbat'
  | 'holidays'
  | 'prayer'
  | 'torah'
  | 'lifecycle'
  | 'daily_life';

export interface BootcampVocabWord {
  id: string;
  hebrew: string;
  transliteration: string;
  translation: string;
  category: BootcampVocabCategory;
  audioUrl: string;
  letterIds: string[];
  vowelIds: string[];
  dayIntroduced: BootcampDayNumber;
  difficulty: number; // 1-5
  culturalNote?: string;
}

export interface BootcampLetterGroup {
  letterIds: string[];
  twinPair?: { withDagesh: string; withoutDagesh: string; hint: string };
  culturalMnemonics: Record<string, string>; // letterId -> mnemonic
}

export interface BootcampVowelGroup {
  vowelIds: string[];
  soundLabel: string;
  color: string;
  teachingNote: string;
}

export interface BootcampSyllable {
  hebrew: string;
  transliteration: string;
  letterId: string;
  vowelId: string;
  audioUrl: string;
}

export interface BootcampPracticeWord {
  hebrew: string;
  transliteration: string;
  translation: string;
  audioUrl: string;
  source?: string; // e.g. 'Modeh Ani', 'Shema'
}

export interface BootcampCulminatingReading {
  title: string;
  description: string;
  lines: {
    hebrew: string;
    transliteration: string;
    translation: string;
    audioUrl: string;
  }[];
}

export interface BootcampDay {
  day: BootcampDayNumber;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  letterGroups: BootcampLetterGroup[];
  vowelGroups: BootcampVowelGroup[];
  syllables: BootcampSyllable[];
  vocabWordIds: string[];
  practiceWords: BootcampPracticeWord[];
  culminatingReading: BootcampCulminatingReading;
  reviewLetterIds?: string[];
  reviewVowelIds?: string[];
}

export interface BootcampDayProgress {
  day: BootcampDayNumber;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  teachPhaseComplete: boolean;
  drillScore?: number;
  drillTotal?: number;
  syllablesComplete: boolean;
  wordsComplete: boolean;
  readingComplete: boolean;
  completedAt?: string;
}

export interface BootcampProgress {
  enrolled: boolean;
  enrolledAt?: string;
  currentDay: BootcampDayNumber;
  dayProgress: Record<number, BootcampDayProgress>;
  completedAt?: string;
}
