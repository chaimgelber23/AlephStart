# AlephStart — Research, Architecture & Build Report

## Table of Contents
1. [What Was Built (Build Report)](#what-was-built)
2. [Research & Pedagogy](#research--pedagogy)
3. [Data Model & Types](#data-model--types)
4. [Content Architecture](#content-architecture)
5. [State Management](#state-management)
6. [Coaching System](#coaching-system)
7. [Audio Strategy](#audio-strategy)
8. [Design System](#design-system)
9. [Tech Stack](#tech-stack)

---

## What Was Built

### Phase 1: Core App (Individual Lessons)

The app started as a Hebrew reading tutor for adult kiruv learners. The original build included:

**Learn Page (`/learn`)**
- 31 Hebrew letters taught in lessons of 3
- Two phases per lesson: **Teach** (letter card with audio, mnemonic, sound) then **Drill** (multiple choice "which letter is this?")
- Letters taught in research-backed order: visually distinct letters first, confusable pairs later, final forms last
- Session resume: if you leave mid-lesson, the app offers to continue where you left off
- Milestone toasts on first letter, half aleph-bet, full aleph-bet

**Siddur Page (`/siddur`)**
- Prayer reading mode with Hebrew (with nekudot), transliteration, and translation
- Audio playback per section with speed control
- Pronunciation setting: Modern Israeli vs American Shul
- Coaching overlay (7-phase guided learning: context → listen → follow along → say together → try yourself → complete → feedback)
- Adaptive coaching preferences based on user feedback

**Prayers Content**
- 27 prayers implemented across Tefillah and Brachot categories
- Each prayer broken into sections with Hebrew text, transliteration, translation
- Includes context: when said, why said, spiritual inspiration
- Progressive unlock system (level-gated)

**Settings Page (`/settings`)**
- Nusach: Ashkenaz / Sefard / Edot
- Pronunciation: Modern Israeli / American Shul
- Voice gender: Male / Female
- Daily goal: 3, 5, 10, or 15 minutes
- Transliteration mode: Full / Faded / Tap to Show / Off
- Audio speed slider (0.5x–2x)
- Account management (name, email, password, delete)

**Auth System**
- Supabase authentication (signup, login, password reset)
- Smart signup prompt: only shown after 2+ bootcamp days or 5+ skills learned (not immediately)
- Auth callback handling

**Dashboard (`/`)**
- Personalized greeting (Boker Tov / Tzohorayim Tovim / Erev Tov) with Hebrew
- Streak tracking with Shabbat grace period + weekly freeze shields
- Daily goal progress (circular indicator)
- Continue Learning card with letter progress
- Learn Prayers card linking to siddur
- Today's Goals checklist
- Quick stats (letters mastered, minutes today, streak)
- Rotating Torah-based encouragements from Pirkei Avot
- Welcome-back banner for lapsed users (3+ days away)

**Onboarding**
- Learning goal selection (daven, learn, explore, all)
- Hebrew level assessment (none, some letters, read slow, read & improve)
- Nusach selection
- Daily goal setting

**Streak System**
- Shabbat grace: missing Saturday doesn't break your streak
- Freeze shields: 1 free freeze granted weekly (max 2 stored)
- Auto-use: miss 1 day and a freeze activates automatically
- Gentle reset: broken streak goes to 1, never shamed

**Spaced Repetition**
- FSRS algorithm (Free Spaced Repetition Scheduler) via ts-fsrs
- 20–30% fewer reviews needed vs SM-2 (Anki's algorithm)
- Tracks difficulty, stability, due dates per skill
- Client-side for offline capability

---

### Phase 2: 5-Day Bootcamp

The bootcamp was added as an intensive "learn to read Hebrew in 5 sessions" track. It became the primary onboarding path for new users.

**Bootcamp Structure (`/bootcamp`)**
- 5 days, ~18–20 minutes each
- Each day has phases: Review (day 2+) → Teach Letters → Teach Vowels → Drill → Syllable Building → Word Practice → Culminating Reading
- Days unlock sequentially (complete day 1 to unlock day 2)

**Day-by-Day Curriculum**

| Day | Title | Letters | Vowels | Goal |
|-----|-------|---------|--------|------|
| 1 | First Sounds | Shin, Lamed, Mem, Aleph, Tav | Kamatz, Patach (AH) | Read 5+ real words |
| 2 | Building Blocks | Bet/Vet twins, Yud, Vav, Samech, Nun | Segol, Tzere (EH), Chirik (EE) | Read bracha formula |
| 3 | Unlocking Words | Kaf/Chaf twins, Gimel, Kuf, Dalet, Resh | Cholam, Cholam Vav (OH), Kubutz, Shuruk (OO) | Complete bracha |
| 4 | Shaping Language | Pei/Fei twins, Hei, Chet, Tet, Tzadi, Zayin, Sin | Shva (silent/uh) | Read prayer words |
| 5 | Reading Mastery | 5 final forms (sofit) + review all | Chataf vowels | Read Modeh Ani |

**Twin Letters Pedagogy**
- Bet/Vet: dot = B (strong), no dot = V (soft)
- Kaf/Chaf: dot = K, no dot = CH
- Pei/Fei: dot = P, no dot = F
- Teaching: "Same shape, different strength"

**Cultural Mnemonics** (Jewish meaning per letter)
- Shin: "Letter on every mezuzah & tefillin. Stands for G-d's Name 'Shaddai.'"
- Lamed: "Tallest letter. Stands for 'lev' (heart) & 'limud' (learning)."
- Aleph: "First letter, yet silent. Humility comes first."

**50+ Vocabulary Words** across categories:
- Greetings: Shalom, Todah, Boker Tov, Mazel Tov
- Brachot: Baruch, Hamotzi, Amen
- Shabbat: Shabbat, Ner, Shalom Bayit
- Prayer: Tefillah, Amidah, Ashrei
- Each word has cultural notes and difficulty rating

**Culminating Readings** (end of each day)
- Day 1: First bracha words ("Atah")
- Day 2: "Baruch Atah" formula
- Day 3: Full bracha formula
- Day 4: Prayer phrases
- Day 5: Full Modeh Ani prayer

**Dashboard Integration**
- BootcampCard component on dashboard (not enrolled / in progress / complete states)
- Bootcamp takes priority over individual lessons for new users (< 10 letters mastered)
- Milestone toasts for each day + bootcamp completion

---

### Phase 3: Audio Generation & Pronunciation System

**Prayer Audio (214 files)**
- 107 modern Israeli Hebrew MP3s (read from hebrewText)
- 107 American Shul MP3s (read from transliteration)
- Generated via ElevenLabs API (eleven_multilingual_v2 model)
- Files: `public/audio/prayers/{prayerId}/{sectionId}.mp3` and `{sectionId}-american.mp3`

**Letter Audio (124 files)**
- 31 letter name pronunciations, modern ("Shin. SH.")
- 31 letter name pronunciations, american
- 31 phonetic sounds, modern ("shh" for Shin, "buh" for Bet)
- 31 phonetic sounds, american
- Files: `public/audio/letters/{id}.mp3`, `{id}-american.mp3`, `{id}-sound.mp3`, `{id}-sound-american.mp3`

**Pronunciation Setting System**
- User chooses Modern Israeli vs American Shul in settings
- `PRONUNCIATION_SUFFIX` map: modern = '' (no suffix), american = '-american'
- Extensible: add new style by adding to STYLE_CONFIG + type + suffix map
- Fallback: if styled file missing, falls back to default (modern)

**Voice Gender System**
- User chooses Male vs Female voice in settings
- `VoiceGender` type: 'male' | 'female'
- AudioButton applies `-female` suffix before file extension
- Fallback: if gendered file missing, falls back to default (male)

**LetterCard Audio UI**
- Two buttons per letter: "Pronounce" (letter name) and "Sound" (phonetic sound)
- Both respect pronunciation setting and voice gender
- Used in Learn page and Bootcamp day pages

**Audio Generation Scripts** (`/scripts/`)
- `generate-audio.ts` — Prayer section audio with STYLE_CONFIG system
- `generate-letter-audio.ts` — Letter name pronunciation
- `generate-letter-sounds.ts` — Pure phonetic sounds
- `generate-all-audio.ts` — Master script for all categories
- All scripts are idempotent (skip existing files)

---

### Phase 4: Dashboard Redesign

The dashboard went through several iterations:

**Current Layout (top to bottom)**
1. Header (dark teal gradient): settings gear → greeting (English + Hebrew, same size) → streak pill + daily goal pill (no emojis) → encouragement quote
2. Continue Learning card (or Bootcamp card if new user)
3. Bootcamp card (if not complete and not primary)
4. Learn Prayers card → links to /siddur
5. Today's Goals checklist (3 items)
6. Quick Stats row (Letters / Min Today / Streak)
7. Auth banner (only shown after meaningful engagement)

**Key Design Decisions**
- Cards sit below header (no overlap)
- No emojis in stat pills or goals
- English and Hebrew greetings same size
- Warm background (#F8F7F4)
- Consistent card styling (shadow-sm, rounded-2xl, border-gray-100/80)

---

## Research & Pedagogy

### Teaching Methodology

**Systematic Synthetic Phonics** (Israeli schools standard)
- Hebrew is perfectly phonetic with nekudot (vowel points)
- Each letter + vowel = exactly one sound
- Progression: letter → vowel → syllable → word → sentence → prayer

**Multi-Sensory Approach** (Orton-Gillingham adapted for Hebrew)
Every item taught via three channels:
- Visual: Large, clear Hebrew text (28–36px minimum)
- Auditory: Native-speaker audio pronunciation
- Kinesthetic: Tap, trace, interact

Research: Multi-sensory engagement = 3x stronger memory traces.

**FSRS Spaced Repetition**
- Free Spaced Repetition Scheduler (better than Anki's SM-2)
- 20–30% fewer reviews for same retention
- Adapts to individual item difficulty
- Shows items at 80% recall threshold

**Progressive Fluency** (5 stages)
1. Pre-alphabetic — can't recognize Hebrew letters
2. Partial alphabetic — some letters + vowels known
3. Full alphabetic — decode letter-by-letter slowly
4. Consolidated — recognize common syllable patterns automatically
5. Automatic — read prayers at conversational pace

Most programs stop at stage 3. AlephStart pushes to stage 5.

### Letter Teaching Order Rationale

**Phase 1: Visually Distinct** (11 letters, 5 batches)
Build confidence with hard-to-confuse letters first. Research shows beginners learn better with visually unique shapes before similar-looking pairs.

**Phase 2: Confusable Pairs** (11 letters, 6 pairs)
Taught together with explicit "spot the difference" drills + alliterative mnemonics:
- Bet vs Kaf: "Bet = Boxy corner. Kaf = curved."
- Dalet vs Resh: "Dalet = Diving-board edge. Resh = Rounded."
- Hei vs Chet: "Hei = Has a gap. Chet = Clamped shut."

Adapted from Orton-Gillingham: confusable pairs studied side-by-side = explicit error correction.

**Phase 3: Final Forms** (5 sofit letters)
Taught after base letters are secure. "At the end of a word, these letters stretch out."

### Vowel Teaching Order Rationale

Grouped by SOUND, not visual appearance:
1. AH (Patach, Kamatz) — most common in Hebrew
2. EH (Segol, Tzere) — second most common
3. EE (Chirik) — single dot, simple
4. OH (Cholam, Cholam Vav) — introduces dot-above
5. OO (Kubutz, Shuruk) — completes vowel set
6. Shva — most complex, teach last
7. Chataf vowels — advanced compound vowels

Color-coded by sound group: AH=Blue, EH=Green, EE=Amber, OH=Purple, OO=Red, Shva=Gray.

### Target User Profile

- Adults 25–60+ exploring Judaism or becoming more observant
- Often accomplished professionals embarrassed they can't read Hebrew
- Emotional pain points: shame, intimidation, overwhelm, fear of failure
- Motivated by: spiritual connection, belonging, independence, family

### Five Foundational Pillars

1. **Easy First, Always** — Never overwhelm; end sessions on wins
2. **Meaning Before Mechanics** — Explain WHY before HOW
3. **Audio First, Text Second** — Hear before read
4. **Daily Micro-Wins** — 3–7 minute sessions for 83% completion rate
5. **Warm, Not Preachy** — Supportive chavrusa tone, never shame

---

## Data Model & Types

### Letter
```typescript
interface Letter {
  id: string;           // 'shin', 'bet', 'chaf_sofit'
  hebrew: string;       // 'שׁ'
  name: string;         // 'Shin'
  sound: string;        // 'SH'
  transliteration: string;
  mnemonic: string;
  confusableWith?: string;
  confusableHint?: string;
  audioUrl: string;     // '/audio/letters/shin.mp3'
  isFinalForm: boolean;
  baseLetterOf?: string;
  hasDagesh?: boolean;
  dageshSound?: string;
}
```

### Vowel
```typescript
interface Vowel {
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
```

### Prayer
```typescript
interface Prayer {
  id: string;
  slug: string;
  nameHebrew: string;
  nameEnglish: string;
  category: string;     // 'tefillah' | 'brachot'
  sortOrder: number;
  whenSaid: string;
  whySaid: string;
  inspirationText: string;
  requiredLevel: number;
  estimatedReadSeconds: number;
  sections: PrayerSection[];
}

interface PrayerSection {
  id: string;
  sortOrder: number;
  hebrewText: string;       // with nekudot
  transliteration: string;
  translation: string;
  audioUrl?: string;
  wordTimings?: WordTiming[];
}
```

### User Profile
```typescript
interface UserProfile {
  currentLevel: number;
  nusach: 'ashkenaz' | 'sefard' | 'edot';
  pronunciation: 'modern' | 'american';
  dailyGoalMinutes: number;
  transliterationMode: 'full' | 'faded' | 'tap' | 'off';
  audioSpeed: number;
  streakDays: number;
  longestStreak: number;
  totalStudyMinutes: number;
  totalWordsMastered: number;
  learningGoal: 'daven' | 'learn' | 'explore' | 'all';
  hebrewLevel: 'none' | 'some_letters' | 'read_slow' | 'read_improve';
  voiceGender: 'male' | 'female';
  onboardingComplete: boolean;
  streakFreezes: number;
}
```

### Bootcamp Day
```typescript
interface BootcampDay {
  day: 1 | 2 | 3 | 4 | 5;
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
}
```

### Coaching
```typescript
type CoachingPhase = 'context' | 'listen' | 'follow_along' | 'say_together'
                   | 'try_yourself' | 'section_complete' | 'feedback';

interface CoachingPreferences {
  listenCount: number;       // default 3
  followAlongCount: number;  // default 2
  sayTogetherCount: number;  // default 2
  initialSpeed: number;      // default 0.75
  showTranslationDuringPractice: boolean;
  skipContextCard: boolean;
}
```

---

## Content Architecture

### File Structure
```
src/lib/content/
  letters.ts          — 31 Hebrew letters with teaching order
  vowels.ts           — All vowels grouped by sound
  prayers.ts          — 27 prayers (Tefillah + Brachot)
  bootcampDays.ts     — 5-day bootcamp curriculum
  bootcampVocab.ts    — 50+ vocabulary words
  encouragements.ts   — 15 streak messages + 20+ daily quotes
```

### Audio File Structure
```
public/audio/
  letters/            — 124 files (31 letters × 4 variants)
    {id}.mp3                    (modern, male, name)
    {id}-american.mp3           (american, male, name)
    {id}-sound.mp3              (modern, male, sound)
    {id}-sound-american.mp3     (american, male, sound)
  prayers/            — 214 files (107 sections × 2 styles)
    {prayerId}/
      {sectionId}.mp3           (modern)
      {sectionId}-american.mp3  (american)
```

---

## State Management

### Zustand Stores

**userStore** (`alephstart-user` in localStorage)
- Profile, skill progress, lesson/prayer progress
- Daily sessions, streaks, milestones
- Coaching preferences and section progress
- Learn session resume state

**bootcampStore** (`alephstart-bootcamp` in localStorage)
- Enrollment status, current day
- Per-day progress (teach/drill/syllable/word/reading phases)
- Day unlocking logic

**authStore**
- Supabase auth state (authenticated/unauthenticated/loading)
- Sign up, login, logout, password reset

---

## Coaching System

### Seven Phases

1. **Context** — Prayer meaning, when/why said
2. **Listen** — Audio plays repeatedly (default 3×, 0.75x speed)
3. **Follow Along** — Word-by-word highlighting while audio plays
4. **Say Together** — User reads aloud in unison with audio
5. **Try Yourself** — Independent reading with tap-for-help
6. **Section Complete** — Celebration + progress
7. **Feedback** — User rates pace, listen count, helpful aspects

### Adaptive Learning
- "Too slow" → speed +0.1
- "Too fast" → speed -0.1
- "Fewer listens" → listen count -1
- "More listens" → listen count +1
- Translation preference auto-adjusts

---

## Audio Strategy

### ElevenLabs Configuration
- Model: eleven_multilingual_v2 (prayers), eleven_v3 (bootcamp/letters)
- Voice IDs configured per gender and language
- Male Hebrew: George (warm storyteller)
- Male English: Rabbi Shafier
- Female Hebrew: Lily (velvety, warm)
- Female English: Bella (bright educator)

### Generation Scripts
```bash
# Prayer audio
STYLE=modern  npx tsx scripts/generate-audio.ts
STYLE=american npx tsx scripts/generate-audio.ts

# Letter name pronunciation
STYLE=modern  npx tsx scripts/generate-letter-audio.ts
STYLE=american npx tsx scripts/generate-letter-audio.ts

# Letter phonetic sounds
STYLE=modern  npx tsx scripts/generate-letter-sounds.ts
STYLE=american npx tsx scripts/generate-letter-sounds.ts

# All categories at once
GENDER=male npx tsx scripts/generate-all-audio.ts
```

### Adding a New Pronunciation Style
1. Add entry to `STYLE_CONFIG` in generate scripts
2. Add style name to `Pronunciation` type in `src/types/index.ts`
3. Add suffix to `PRONUNCIATION_SUFFIX` in `src/hooks/useAudio.ts`
4. Run generation scripts with the new style

---

## Design System

### Colors
```
Primary:        #1B4965  (deep blue)
Primary Light:  #5FA8D3  (interactive blue)
Success:        #4A7C59  (forest green)
Error:          #C17767  (muted terracotta)
Accent Gold:    #C6973F  (celebrations)
Text Primary:   #2D3142  (near-black)
Background:     #F8F7F4  (warm off-white)
Hebrew Text:    #1A1A2E  (deep navy)
```

### Typography
- Hebrew learning: 'Noto Serif Hebrew', 28–36px, line-height 2.0
- Hebrew reading: 'Noto Serif Hebrew', 22–26px, line-height 1.8
- English UI: 'Inter', system-ui, 16px

### Component Patterns
- Cards: `bg-white rounded-2xl shadow-sm border border-gray-100/80`
- Primary buttons: `bg-[#1B4965] text-white rounded-xl`
- Progress bars: Custom ProgressBar component with color prop
- Animations: Framer Motion (fade in, slide up)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Audio TTS | ElevenLabs API |
| Spaced Repetition | ts-fsrs |
| State | Zustand (persist middleware) |
| Deployment | Vercel |
| Analytics | Vercel Analytics |

### Key Dependencies
- next, react, typescript
- @supabase/supabase-js
- zustand (v5)
- framer-motion (v11)
- ts-fsrs (v4)
- @vercel/analytics
- canvas-confetti

---

## App Routes

| Route | Purpose |
|-------|---------|
| `/` | Dashboard (home) |
| `/learn` | Individual letter lessons |
| `/bootcamp` | Bootcamp overview |
| `/bootcamp/day/[day]` | Bootcamp day pages (1–5) |
| `/bootcamp/day/[day]/complete` | Day completion screen |
| `/bootcamp/complete` | Bootcamp graduation |
| `/siddur` | Prayer reading + coaching |
| `/practice` | Review drills |
| `/settings` | User preferences |
| `/login` | Login |
| `/signup` | Sign up |
| `/reset-password` | Password reset |
| `/api/tts` | Fallback TTS endpoint |
| `/api/delete-account` | Account deletion |

---

## Research Sources

- **NJOP (Aish HaTorah)**: 3-day Hebrew reading crash course methodology
- **Orton-Gillingham**: Multi-sensory reading instruction adapted for Hebrew
- **FSRS**: Free Spaced Repetition Scheduler (open-source, better than SM-2)
- **Knowles' Andragogy**: Adult learning theory (self-directed, meaning-oriented)
- **LaBerge & Samuels**: Automaticity in reading (5-stage fluency model)
- **PMC studies**: Confusable Hebrew letter pairs research
