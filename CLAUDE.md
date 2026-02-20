# AlephStart - CLAUDE.md

## Project Overview
AlephStart is a Hebrew reading & davening app for kiruv. It teaches absolute beginners to decode Hebrew letters and vowels (nekudot), build reading fluency, and read prayers — all through interactive drills, audio, and guided siddur practice.

**Full specification:** See `ALEPHSTART_SPEC.md` for complete feature spec, curriculum, data model, and design system.

## Tech Stack
- **Framework:** Next.js 16 with App Router (TypeScript)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion + canvas-confetti
- **Database:** Supabase (Auth, PostgreSQL, Storage, Edge Functions)
- **Spaced Repetition:** ts-fsrs (FSRS algorithm)
- **State Management:** Zustand
- **Deployment:** Vercel

## Design System

### Colors
```
Background:       #FEFDFB  (warm off-white)
Surface:          #FFFFFF  (cards, modals)
Primary:          #1B4965  (deep blue — trust, wisdom)
Primary Light:    #5FA8D3  (light blue — interactive)
Success:          #4A7C59  (forest green — mastery)
Error:            #C17767  (muted terracotta — gentle)
Warning:          #D4A373  (warm amber)
Text Primary:     #2D3142  (near-black)
Text Secondary:   #6B7280  (gray)
Text Hebrew:      #1A1A2E  (deep navy)
Accent Gold:      #C6973F  (milestones, celebrations)

Vowel Colors (color-coded nekudot):
  AH: #3B82F6 (blue)    — Patach, Kamatz
  EH: #10B981 (green)   — Segol, Tzere
  EE: #F59E0B (amber)   — Chirik
  OH: #8B5CF6 (purple)  — Cholam
  OO: #EF4444 (red)     — Kubutz, Shuruk
  Shva: #9CA3AF (gray)
```

### Typography
```
Hebrew (learning/large):  'Noto Serif Hebrew', serif — 28-36px, line-height: 2.0
Hebrew (reading/siddur):  'Noto Serif Hebrew', serif — 22-26px, line-height: 1.8
Hebrew (UI labels):       'Noto Sans Hebrew', sans-serif — 16-18px
English (UI):             'Inter', system-ui, sans-serif — 16px, line-height: 1.6
```

### UI Patterns
- **Hebrew text**: ALWAYS render with nekudot (vowel points) using Noto Serif Hebrew
- **Direction**: Hebrew text is RTL — use `dir="rtl"` on Hebrew containers
- **Touch targets**: Minimum 48px for all interactive elements (mobile-first)
- **Animations**: Subtle and purposeful — success pulse, card transitions, progress fills
- **Tone**: Calm, reverent, encouraging — NOT gamified-kiddie, NOT sterile-academic

### Component Patterns
```tsx
// Primary Button
className="bg-[#1B4965] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#163d55] transition-colors"

// Success Button
className="bg-[#4A7C59] text-white px-6 py-3 rounded-xl font-medium"

// Card
className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"

// Hebrew Display (Learning)
className="font-['Noto_Serif_Hebrew'] text-4xl text-[#1A1A2E] leading-[2] text-right"
style={{ direction: 'rtl' }}

// Form Input
className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1B4965] focus:ring-2 focus:ring-[#1B4965]/20 outline-none text-base"
```

## Project Structure
```
alephstart/                    # Next.js app
├── src/
│   ├── app/                   # App Router pages
│   │   ├── page.tsx           # Home / dashboard
│   │   ├── onboarding/        # Onboarding flow
│   │   ├── learn/             # Learn path (lessons)
│   │   ├── practice/          # Practice drills
│   │   ├── siddur/            # Siddur / prayer mode
│   │   ├── progress/          # Progress dashboard
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/                # Shared UI components
│   │   ├── learn/             # Lesson/teaching components
│   │   ├── practice/          # Drill/exercise components
│   │   ├── siddur/            # Prayer reader components
│   │   ├── audio/             # Audio player/recorder
│   │   └── progress/          # Progress visualization
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client
│   │   ├── fsrs.ts            # Spaced repetition engine
│   │   ├── audio.ts           # Audio utilities
│   │   └── content/           # Curriculum data (letters, vowels, prayers)
│   ├── stores/                # Zustand stores
│   │   ├── userStore.ts       # User profile & preferences
│   │   ├── progressStore.ts   # Learning progress
│   │   └── practiceStore.ts   # Current practice session
│   └── types/                 # TypeScript types
├── public/
│   ├── audio/                 # Pre-recorded audio files
│   │   ├── letters/           # Individual letter sounds
│   │   ├── vowels/            # Vowel sounds
│   │   ├── words/             # Word pronunciations
│   │   └── prayers/           # Prayer audio (with word timings)
│   └── fonts/                 # Bundled Hebrew fonts
└── supabase/
    └── migrations/            # Database migrations
```

## Key Principles
1. **Audio-first**: Every letter, vowel, word, and prayer MUST have audio. No silent learning.
2. **Hebrew with nekudot**: ALWAYS show nekudot (vowel points) on Hebrew text. Never show unpointed text to beginners.
3. **RTL handling**: Hebrew text containers must have `dir="rtl"` and proper font-family.
4. **3-7 minute sessions**: Keep lessons short. One concept per session.
5. **End on a win**: Every session must end with something the user gets RIGHT.
6. **No shame, ever**: Error states are gentle. Missed streaks are forgiving. Tone is warm.
7. **Connect to meaning**: Before teaching a prayer, explain WHY Jews say it.

## Curriculum Data
- Letters are taught in a research-backed order (visually distinct first, then confusable pairs)
- Vowels are taught by sound group (AH → EH → EE → OH → OO → Shva)
- Prayers follow the davening progression (Modeh Ani → Brachot → Shema → Amidah)
- See ALEPHSTART_SPEC.md Sections 5, 12, and Appendix A for full curriculum details

## Common Patterns

### Playing Audio
```tsx
const playAudio = (audioUrl: string) => {
  const audio = new Audio(audioUrl);
  audio.play();
};
```

### Hebrew Text Component
Always use the HebrewText component for displaying Hebrew — never raw text:
```tsx
<HebrewText size="lg" withNikud>{hebrewContent}</HebrewText>
```

### Spaced Repetition
Use ts-fsrs for scheduling reviews:
```tsx
import { createEmptyCard, fsrs, Rating } from 'ts-fsrs';
const f = fsrs();
// After user reviews: f.repeat(card, new Date())[Rating.Good]
```
