# AlephStart - Complete App Specification
## Hebrew Reading & Davening App for Kiruv

> **Mission:** Make it so easy, motivating, and rewarding that someone who has never seen a Hebrew letter can go from zero to davening — and never want to quit along the way.

---

## Table of Contents
1. [The Problem We're Solving](#the-problem)
2. [Target User & Emotional Journey](#target-user)
3. [Core Philosophy](#core-philosophy)
4. [Learning Methodology](#learning-methodology)
5. [Curriculum & Progression](#curriculum)
6. [Feature Specification](#features)
7. [Motivation & Retention System](#motivation)
8. [UI/UX Design System](#design)
9. [Data Model](#data-model)
10. [Technical Architecture](#tech-architecture)
11. [API Routes](#api-routes)
12. [Content Seed Data](#content)
13. [MVP Scope](#mvp)
14. [V2+ Roadmap](#roadmap)

---

## 1. The Problem We're Solving <a name="the-problem"></a>

### The Gap in the Market
There is **no app** that:
- Teaches Hebrew reading from scratch (aleph-bet up)
- Uses **prayer/liturgical text** as the primary content (not "where is the bus station?")
- Provides a structured path from "I know nothing" to "I can daven Shacharis"
- Is designed for **adults** with adult-level UX (not childish cartoon Hebrew school)
- Addresses the **emotional journey** (shame, intimidation, pride, spiritual connection)
- Connects reading to **meaning** (not just decoding but understanding WHY you're saying this)

**Duolingo** teaches Modern Hebrew ("Where is the bus station?") — useless for davening.
**Aleph Champ** is designed for kids.
**Siddur apps** assume you already know Hebrew.
**Reading crash courses** are in-person only with no daily reinforcement.

### AlephStart fills this gap:
**Duolingo-level UX** meets **Aish-level kiruv warmth** meets **siddur functionality**.

---

## 2. Target User & Emotional Journey <a name="target-user"></a>

### Who They Are
- Adults (25-60+) exploring Judaism or becoming more observant
- May be baalei teshuva, Jews-by-choice, or culturally Jewish adults reconnecting
- Accomplished professionals who feel embarrassed they can't read what a 7-year-old can
- People who sit silently in shul while everyone else reads along
- Parents who want to teach their children, or not be embarrassed in front of them

### Their Emotional Reality (Critical for UX)

| Emotion | What They Feel | How We Address It |
|---------|---------------|-------------------|
| **Shame** | "I should know this already" | Private learning — no one sees your mistakes |
| **Intimidation** | "The alphabet looks impossible" | Break it into tiny wins — learn 2 letters at a time |
| **Overwhelm** | "The siddur is hundreds of pages" | Show only what's next — hide the mountain |
| **Fear of failure** | "What if I mispronounce in shul?" | Safe practice space with instant audio feedback |
| **Imposter syndrome** | "I don't belong in that shul" | Normalize being a beginner with warm messaging |
| **Past trauma** | "Hebrew school was awful" | Adult-first design — respectful, dignified, beautiful |

### Their Motivations (What Keeps Them Going)

| Motivation | How We Feed It |
|-----------|----------------|
| **Spiritual connection** | Explain the meaning of each prayer — what you're saying to Hashem |
| **Belonging** | "Soon you'll be reading along with the whole shul" |
| **Independence** | Track the path from transliteration → Hebrew reading |
| **Pride** | Celebrate every milestone with genuine excitement |
| **Family** | "Imagine leading Kiddush at your Shabbos table" |

---

## 3. Core Philosophy <a name="core-philosophy"></a>

### The Five Pillars

1. **Easy First, Always**
   - Never show more than 2-3 new things at once
   - Every session ends with success, never frustration
   - If something is hard, slow down automatically — don't punish, help
   - The difficulty should feel like a gentle slope, never a wall

2. **Meaning Before Mechanics**
   - Before teaching a prayer, explain WHY Jews say it
   - Every lesson connects to real davening/Torah context
   - "You're not learning random symbols — you're unlocking a 3,000-year conversation with Hashem"

3. **Audio First, Text Second**
   - EVERY letter, vowel, word, and prayer has native-speaker audio
   - Hear it before you read it — the sound comes first
   - Hebrew is phonetic — once you hear the pattern, reading clicks

4. **Daily Micro-Wins**
   - 3-7 minute sessions (research shows 83% completion vs 20% for longer)
   - Every session teaches something real and usable
   - "You just learned to read Modeh Ani — you can say it tomorrow morning"

5. **Warm, Not Preachy**
   - Tone of a supportive chavrusa, not a lecturing teacher
   - Celebrate effort, not just achievement
   - "Every great Torah scholar started with Aleph"
   - Never guilt-trip — never shame — never compare to children

---

## 4. Learning Methodology <a name="learning-methodology"></a>

### Based on Proven Research

#### Systematic Synthetic Phonics (Primary Method)
Hebrew is perfectly phonetic with nekudot — each letter + vowel combination makes exactly one sound. We teach these systematically:
1. Learn the letter shape → hear its sound
2. Learn a vowel → hear its sound
3. Combine them → hear the syllable
4. Build words from syllables → hear the word
5. Build sentences from words → read the prayer

#### Multi-Sensory Approach (Orton-Gillingham Adapted for Hebrew)
Every item is taught through THREE channels simultaneously:
- **Visual**: See the letter/word in large, clear Hebrew font
- **Auditory**: Hear it pronounced by a native speaker
- **Kinesthetic**: Tap, trace, or record yourself saying it

Research shows multi-sensory engagement creates 3x stronger memory traces by activating frontal lobe, temporal lobe, and angular gyrus simultaneously.

#### FSRS Spaced Repetition (State of the Art)
Not the old SM-2 algorithm — we use FSRS (Free Spaced Repetition Scheduler):
- **20-30% fewer reviews** needed for the same retention
- Adapts to YOUR learning speed per individual item
- Items you struggle with appear more often; mastered items fade away
- Handles breaks gracefully — if you miss a week, it recalibrates

#### The 80% Rule
Show a review item when the learner has ~80% chance of remembering it:
- Not when they've forgotten (too late, frustrating)
- Not when they still know it perfectly (wasted time)
- Right at the sweet spot where retrieval strengthens memory

#### Progressive Fluency Building
Research shows reading goes through 5 stages:
1. **Pre-alphabetic** → Can't recognize any Hebrew letters
2. **Partial alphabetic** → Knows some letters and vowels
3. **Full alphabetic** → Can decode letter-by-letter (slowly)
4. **Consolidated** → Recognizes common syllable patterns automatically
5. **Automatic** → Reads prayer text at conversational pace

Most Hebrew reading programs STOP at stage 3. AlephStart pushes to stage 5 through:
- Timed reading challenges
- Speed-building exercises
- Real prayer text practice at increasing pace
- Words-per-minute tracking

---

## 5. Curriculum & Progression <a name="curriculum"></a>

### The 10-Level System (Inspired by Aleph Champ + Research)

Each level has a meaningful Hebrew name and a color — giving clear visual progression.

| Level | Name | Color | What You Master | Real-World Milestone |
|-------|------|-------|----------------|---------------------|
| **1** | אלף (Aleph) | White | First 11 visually-distinct letters + Kamatz/Patach ("ah") | Read your first syllables |
| **2** | בית (Beis) | Red | Remaining letters + confusable pairs (ב/כ, ד/ר, ה/ח) | Read simple words |
| **3** | גימל (Gimel) | Orange | Final forms (sofit) + Segol/Tzere ("eh") + Chirik ("ee") | Read Modeh Ani |
| **4** | דלת (Dalet) | Yellow | Cholam/Shuruk/Kubutz ("oh"/"oo") + all nekudot combined | Read basic brachot |
| **5** | הא (Hei) | Green | Shva rules + Dagesh + BeGeD KePHeT | Read any pointed Hebrew text |
| **6** | ואו (Vav) | Blue | Common prayer vocabulary (100 most frequent words) | Follow Shema with understanding |
| **7** | זין (Zayin) | Purple | Fluency building — speed drills, phrase reading | Read at "shul pace" |
| **8** | חית (Chet) | Brown | Core prayers: Shema, Amidah selections, Ashrei | Daven basic Shacharis |
| **9** | טית (Tet) | Silver | Full service navigation, Shabbos additions | Participate fully in shul |
| **10** | יוד (Yud) | Gold | Torah reading fluency, advanced prayers, Rashi script intro | Independent learner |

### Letter Teaching Order (Research-Backed)

**Phase 1: Visually Distinct Letters** (Level 1)
Teach the most visually unique letters first — this builds confidence fast because they're hard to confuse:

```
Batch 1: שׁ (Shin) ל (Lamed) א (Aleph) — most distinctive shapes
Batch 2: מ (Mem) ע (Ayin) ת (Tav) — distinctive, common
Batch 3: י (Yud) ו (Vav) ס (Samech) — simple shapes
Batch 4: נ (Nun) ג (Gimel) — introduce first similar pair gently
Batch 5: ק (Kuf) — stands alone, distinctive
```

**Phase 2: Confusable Pairs** (Level 2)
Teach look-alikes TOGETHER with explicit "spot the difference" drills:

```
Pair 1: ב (Bet) vs כ (Kaf) — "Bet has a Boxy bottom-right corner"
Pair 2: ד (Dalet) vs ר (Resh) — "Dalet has a Diving-board corner"
Pair 3: ה (Hei) vs ח (Chet) — "Chet is Clamped shut at top"
Pair 4: ט (Tet) vs מ (Mem-sofit) — different openings
Pair 5: פ (Pei) vs צ (Tzadi) — teach together with clear distinction
Pair 6: ז (Zayin) — compare to Vav (already known)
```

**Phase 3: Final Forms** (Level 3)
```
ך (Kaf sofit) ם (Mem sofit) ן (Nun sofit) ף (Pei sofit) ץ (Tzadi sofit)
```
Teach each after the base letter is secure. "At the end of a word, these letters stretch out."

### Vowel Teaching Order

| Phase | Vowels | Sound | Why This Order |
|-------|--------|-------|----------------|
| **1** | ַ Patach, ָ Kamatz | "AH" | Most common vowel in Hebrew — appears everywhere |
| **2** | ֶ Segol, ֵ Tzere | "EH" | Second most common — combined with known letters = real words |
| **3** | ִ Chirik | "EE" | Simple (one dot), easy to remember |
| **4** | ֹ Cholam, וֹ Cholam-Vav | "OH" | Introduces dot-above concept |
| **5** | ֻ Kubutz, וּ Shuruk | "OO" | Completes the vowel set |
| **6** | ְ Shva (silent first, then na) | "uh"/silent | Most complex — teach last |
| **7** | ֲ ֳ ֱ Chataf vowels | reduced | Advanced compound vowels |

**Critical Rule**: Each vowel is immediately combined with previously-learned consonants. Students are reading REAL SYLLABLES from Lesson 1.

### Prayer Progression (The "Daven Path")

This is what makes AlephStart unique — everything leads to real davening:

**Stage 1: Immediate Wins (Levels 1-3)**
1. **מוֹדֶה אֲנִי** (Modeh Ani) — 12 words, said every morning upon waking
2. **Basic Brachot** — Hamotzi, Mezonot, Ha'eitz, Ha'adamah, Shehakol
3. **שְׁמַע יִשְׂרָאֵל** (Shema — first line only) — 6 words, most fundamental prayer

**Stage 2: Daily Essentials (Levels 4-5)**
4. **נְטִילַת יָדַיִם** (Netilat Yadayim blessing)
5. **אֲשֶׁר יָצַר** (Asher Yatzar) — said after bathroom
6. **בִּרְכּוֹת הַתּוֹרָה** (Birchot HaTorah)
7. **Full שְׁמַע** (V'ahavta paragraph)
8. **בִּרְכּוֹת הַשַּׁחַר** (Morning blessings series)

**Stage 3: Core Davening (Levels 6-7)**
9. **אַשְׁרֵי** (Ashrei / Psalm 145) — said 3x daily
10. **עָלֵינוּ** (Aleinu) — end of every service
11. **שְׁמוֹנֶה עֶשְׂרֵה** (Amidah) — selected brachot, building up

**Stage 4: Full Service (Levels 8-9)**
12. Full **שַׁחֲרִית** (Shacharis)
13. **מִנְחָה** (Mincha) and **מַעֲרִיב** (Maariv)
14. **קַבָּלַת שַׁבָּת** (Kabbalat Shabbat) + **קִדּוּשׁ** (Kiddush)
15. **בִּרְכַּת הַמָּזוֹן** (Birkat Hamazon)

**Stage 5: Advanced (Level 10)**
16. Holiday prayers (Hallel, Selichot)
17. Torah blessings
18. Rashi script introduction

---

## 6. Feature Specification <a name="features"></a>

### 6.1 Onboarding Flow (60 seconds to first lesson)

**Screen 1: Welcome**
```
"Welcome to AlephStart"
"Learn to read Hebrew. Learn to daven. At your own pace."
[Get Started →]
```

**Screen 2: Why are you here?** (sets the emotional tone)
```
"What brings you to Hebrew?"
○ I want to daven (pray) on my own
○ I want to follow along in shul
○ I want to learn Torah
○ I'm exploring Judaism
○ All of the above
```

**Screen 3: Where are you starting from?**
```
"What's your Hebrew level?"
○ Complete beginner — I don't know any letters
○ I know some letters but not all
○ I can read slowly but want to improve
○ I can read but want to daven fluently
```
→ If not "complete beginner": offer a 2-minute placement quiz

**Screen 4: Your community** (determines nusach/pronunciation)
```
"What community are you connected to?" (helps us customize pronunciation)
○ Ashkenazi (European tradition)
○ Sephardi / Mizrachi
○ Chabad
○ I'm not sure yet → [defaults to Modern Israeli pronunciation]
```

**Screen 5: Daily commitment**
```
"How much time can you give each day?"
○ 3 minutes (one quick drill)
○ 5 minutes (perfect daily habit)
○ 10 minutes (serious progress)
○ 15+ minutes (fast track)
```

**Screen 6: IMMEDIATELY START FIRST LESSON**
No account creation. No email. No credit card. They are LEARNING within 60 seconds of opening the app.

Account creation prompt comes AFTER they complete their first lesson and feel the win.

### 6.2 Learn Path (Interactive Aleph-Bet Course)

Each lesson follows this structure (research-backed):

**TEACH (2-3 minutes)**
- Introduce 2-3 new letters or 1 new vowel
- For each: show the letter BIG → play the sound → show a mnemonic image
- Example: "This is ב (Bet). It sounds like 'B'. Notice the square corner at the bottom right — that's what makes it different from Kaf."
- User taps the letter to hear it again (unlimited replays)

**DRILL (3-5 minutes, 10-20 interactions)**
Mix of exercise types, adapting difficulty in real-time:

| Exercise Type | Description | Difficulty |
|--------------|-------------|------------|
| **Tap to Hear** | Tap a letter → hear its sound | Easiest |
| **Choose the Sound** | Hear a sound → pick the right letter from 4 options | Easy |
| **Choose the Letter** | See a letter → pick the right sound from 4 audio options | Medium |
| **Spot the Difference** | "Which one is Bet? Which is Kaf?" side by side | Medium |
| **Build a Syllable** | Drag a consonant + vowel together → hear the result | Medium |
| **Read the Syllable** | See a consonant+vowel → pick the correct sound | Medium-Hard |
| **Read the Word** | See a full word → pick the correct pronunciation | Hard |
| **Type What You Hear** | Hear a sound → select the Hebrew letter(s) | Hard |
| **Read Aloud** | See text → record yourself → compare to reference | Hardest |

**REVIEW (1-2 minutes)**
- 5 items from previous lessons (spaced repetition queue)
- Quick, confidence-building — these should mostly be items the user knows well

**CELEBRATE**
- Clear win message: "You just learned 3 new letters!"
- Show progress: "You now know 14 out of 22 letters"
- Connect to the goal: "2 more lessons and you'll read your first prayer"

### 6.3 Confusable Letters Training (Unique Feature)

Dedicated drills specifically for the pairs that trip everyone up:

```
┌─────────────────────────────────────┐
│  Which one is  בּ (Bet)?             │
│                                     │
│    ┌─────┐          ┌─────┐        │
│    │     │          │     │        │
│    │  בּ  │          │  כ  │        │
│    │     │          │     │        │
│    └─────┘          └─────┘        │
│                                     │
│  💡 Bet has a Boxy corner           │
│     at the bottom right             │
└─────────────────────────────────────┘
```

Each confusable pair has:
- A memorable mnemonic (alliterative: "Boxy Bet", "Diving-board Dalet", "Rounded Resh", "Clamped Chet")
- Side-by-side comparison with the distinguishing feature highlighted
- Timed drills that intermix the confusable pair rapidly
- A "mastery gate" — must get 10 in a row correct before moving on

### 6.4 Nekudot (Vowels) Engine

Vowels are taught with a unique "vowel + letter combine" animation:

```
Step 1: Show the consonant:  בּ
Step 2: Animate the vowel sliding underneath:  בּ + ַ → בַּ
Step 3: Play the combined sound: "BAH"
Step 4: User taps to replay
Step 5: User tries with different consonants they know
```

**Vowel Color Coding** (consistent throughout the app):
- AH vowels (Patach/Kamatz): Blue
- EH vowels (Segol/Tzere): Green
- EE vowel (Chirik): Orange
- OH vowels (Cholam): Purple
- OO vowels (Kubutz/Shuruk): Red
- Shva: Gray

This color system helps beginners visually group vowels by sound even before they've memorized the shapes.

### 6.5 Siddur Mode (The "Daven Path")

This is the killer feature — an interactive siddur that TEACHES you to read it:

**Prayer Selection Screen:**
```
┌─────────────────────────────┐
│  Your Daven Path             │
│                              │
│  ✅ Modeh Ani      (mastered)│
│  ✅ Shema Line 1   (mastered)│
│  🔵 Hamotzi        (learning)│
│  🔒 V'ahavta       (locked)  │
│  🔒 Ashrei         (locked)  │
│  🔒 Amidah         (locked)  │
│  ...                         │
└─────────────────────────────┘
```

**Prayer Learning Mode** (3 sub-modes):

**Mode 1: LISTEN**
- Full audio plays with word-by-word highlighting ("karaoke mode")
- Hebrew text large and clear with nekudot
- Transliteration shown below (toggle on/off)
- Translation shown on tap or in sidebar
- Speed control: 0.5x / 0.75x / 1x / 1.25x

**Mode 2: ECHO**
- Audio plays ONE PHRASE at a time
- Pause — user repeats the phrase aloud
- Audio plays again for comparison
- User can re-record until satisfied
- Phrase-by-phrase through the entire prayer

**Mode 3: READ**
- User reads the full prayer independently
- Word-by-word highlighting tracks position (tap to advance)
- Tap any word to hear it pronounced
- Optional: record full reading for self-review
- Timer shows reading speed (WPM)

**Prayer Context Card** (shown before starting each prayer):
```
┌─────────────────────────────────────┐
│  מוֹדֶה אֲנִי  · Modeh Ani          │
│                                     │
│  When: First thing upon waking      │
│  Why: Thanking Hashem for returning  │
│       your soul — for another day   │
│       of life                       │
│  Time: ~10 seconds                  │
│                                     │
│  "Every morning is a gift. This     │
│   prayer is your first 'thank you'  │
│   of the day."                      │
│                                     │
│  [Start Learning →]                 │
└─────────────────────────────────────┘
```

### 6.6 Daily Practice Loop

Every day, the app generates a personalized session:

```
Today's Session (5 min)
├── 1 new concept (from current level)
├── 5 review items (from spaced repetition queue)
├── 3 prayer phrase reviews (from current prayer)
└── 1 reading speed challenge (from mastered content)
```

The daily session adapts:
- If accuracy is high → introduce harder material
- If accuracy is low → add more review, slow down
- If a specific item keeps failing → trigger a targeted mini-lesson
- Always end on something the user KNOWS → finish on a high

### 6.7 Reading Speed Trainer

A dedicated mode for building fluency (critical — most apps ignore this):

```
┌─────────────────────────────────────┐
│  Speed Reading Challenge             │
│                                     │
│  בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ      │
│  ▲ (highlighted word scrolls)       │
│                                     │
│  Speed: ████████░░ 45 WPM           │
│  Target: 60 WPM                     │
│  Best: 52 WPM                       │
│                                     │
│  [Start →]                          │
└─────────────────────────────────────┘
```

- Text scrolls/highlights at a set pace
- User reads along — tries to keep up
- Pace gradually increases as user improves
- Uses only MASTERED content so the challenge is speed, not decoding
- Tracks WPM over time with a growth chart

### 6.8 Transliteration Bridge System

Transliteration is handled thoughtfully as a bridge, not a crutch:

**Phase 1 (Beginner):** Full transliteration shown below Hebrew
```
בָּרוּךְ אַתָּה
Baruch Atah
```

**Phase 2 (Developing):** Transliteration fades (smaller, lighter color)
```
בָּרוּךְ אַתָּה
ᴮᵃʳᵘᶜʰ ᴬᵗᵃʰ
```

**Phase 3 (Confident):** Transliteration hidden, tap to reveal
```
בָּרוּךְ אַתָּה
[tap any word for help]
```

**Phase 4 (Fluent):** No transliteration, tap for audio only
```
בָּרוּךְ אַתָּה
```

The transition happens automatically based on user performance, but can be overridden manually. Never shame someone for keeping transliteration on.

### 6.9 AI Chavrusa (Study Partner) — CORE FEATURE

This is the feature that makes AlephStart feel like having a personal kiruv mentor in your pocket — available 24/7, infinitely patient, never judgmental.

**What It Is:**
An AI-powered conversational tutor built directly into the app. It knows:
- Where the user is in their learning journey
- What letters/vowels they've mastered and what they struggle with
- Which prayers they're working on
- The emotional context of being a beginner in kiruv

**What It Can Do:**

| User Says | AI Chavrusa Responds |
|-----------|---------------------|
| "What does Modeh Ani mean?" | Warm, inspiring explanation of the prayer's meaning and context — not a dry translation |
| "I keep mixing up Bet and Kaf" | "Great question! Here's the trick: Bet has a **B**oxy corner at the bottom right. Let me give you a quick drill..." → launches targeted mini-exercise |
| "I'm in shul and they're doing the Amidah" | "The Amidah is the silent standing prayer. Here's the first bracha so you can follow along..." → shows highlighted text |
| "Quiz me on what I learned" | Generates a conversational quiz based on their recent lessons and weak spots |
| "Why do we say Shema?" | Beautiful explanation of the Shema's significance — the declaration of God's unity, said morning and evening, the last words a Jew says |
| "I feel like I'll never learn this" | "כל התחלות קשות — All beginnings are hard. You've already learned [X] letters and can read [Y] words. That's real progress. Every Torah scholar started exactly where you are." |
| "What bracha do I say on an apple?" | "Ha'eitz! בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם בּוֹרֵא פְּרִי הָעֵץ — Tap to hear it" |
| "Teach me something new" | Suggests the next lesson in their path, or a related piece of Torah wisdom |
| "What's the difference between Kamatz and Patach?" | Clear explanation with visual examples, noting that they sound the same but look different |

**Technical Implementation:**
- Powered by Claude API or similar LLM with a carefully crafted system prompt
- System prompt includes: user's current level, mastered skills, current prayer, learning history
- Grounded in a curated knowledge base of:
  - Hebrew reading rules and explanations
  - Prayer meanings and context (sourced from reliable Torah sources)
  - Common beginner questions and struggles
  - Motivational Torah quotes and kiruv-appropriate encouragement
- Can trigger in-app actions (launch a drill, show a prayer, play audio)
- Chat history persists so the AI remembers previous conversations

**Personality Guidelines:**
- Tone: Warm, encouraging, knowledgeable — like a good Chabad shliach or Aish rabbi
- NEVER condescending or overly simplistic
- Uses humor gently when appropriate
- Shares Torah insights and stories naturally
- Admits when a question is beyond scope: "That's a great question for a rabbi — I can help with reading and basic meaning, but for deeper halacha questions, I'd recommend asking your local rabbi or mentor"
- Respects all backgrounds and levels of observance
- NEVER pressures toward specific religious outcomes

**UI Integration:**
```
┌─────────────────────────────────────┐
│  💬 Ask Your Chavrusa               │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🤖 Shalom! I see you just   │   │
│  │    learned Patach and Kamatz.│   │
│  │    Want to practice or do    │   │
│  │    you have any questions?   │   │
│  └─────────────────────────────┘   │
│                                     │
│  Quick questions:                   │
│  [What does this prayer mean?]     │
│  [Quiz me on what I learned]       │
│  [I'm confused about something]    │
│                                     │
│  ┌─────────────────────────┐       │
│  │ Type your question...    │ [→]  │
│  └─────────────────────────┘       │
└─────────────────────────────────────┘
```

The AI Chavrusa is accessible from:
- A dedicated chat tab in the bottom navigation
- A floating "Ask" button on any lesson or prayer screen
- Quick-access suggested questions after every lesson
- A "confused?" help button during practice drills

### 6.10 "Shul Mode" (Bonus Feature)

Shows the current prayer for the time of day with the user's progress highlighted:

```
┌─────────────────────────────────────┐
│  🕐 Shacharis · Morning Service      │
│                                     │
│  ✅ Modeh Ani                        │
│  ✅ Birchot HaShachar                │
│  🔵 Pesukei D'Zimrah (learning)     │
│  ⬜ Shema & Brachot                  │
│  ⬜ Amidah                           │
│  ✅ Aleinu                           │
│                                     │
│  You can follow 45% of Shacharis!   │
│  [Practice Next Section →]          │
└─────────────────────────────────────┘
```

---

## 7. Motivation & Retention System <a name="motivation"></a>

### Principles (Research-Backed)
- Celebrate COMPETENCE, not just activity
- Connect gamification to REAL-WORLD milestones, not meaningless points
- NEVER guilt-trip, shame, or use anxiety-based motivation
- Frame everything in Jewish values and warmth

### Streak System (With Grace)

```
🔥 12 Day Streak!
"כל התחלות קשות — All beginnings are hard.
 But look at you — 12 days and counting!"
```

- Track daily practice streaks
- **Rest days**: Shabbat/Yom Tov automatically pauses streak (no penalty)
- **Streak shield**: Miss a day? One free shield per week — streak preserved
- **Missed streak messaging**: "Welcome back! Your streak paused, but your knowledge didn't. Let's pick up where you left off." (NEVER: "You broke your streak!")

### Milestone System (Tied to Real Achievement)

| Milestone | When | Celebration |
|-----------|------|-------------|
| "First Aleph" | Complete first lesson | Gentle confetti + encouraging message |
| "Half the Aleph-Bet" | Know 11+ letters | "You're halfway to reading Hebrew!" |
| "Aleph-Bet Graduate" | Know all 22 letters | Badge + "You can now decode any Hebrew letter!" |
| "First Word" | Read first complete word | "בָּרוּךְ — your first Hebrew word!" |
| "First Prayer" | Complete Modeh Ani | Major celebration — "Tomorrow morning, say this when you wake up" |
| "Shema Reader" | Read full first paragraph of Shema | "You just read the most important prayer in Judaism" |
| "Bracha Master" | Learn all food brachot | "Next time you eat, try saying the bracha in Hebrew" |
| "Shul Ready" | Can follow 50% of a service | "You can now walk into any shul and follow along" |
| "Independent Davener" | Complete full Shacharis | Gold badge — "You can daven on your own" |

### Jewish Wisdom Integration

Instead of generic motivational quotes, use Torah-sourced wisdom:

- "לֹא עָלֶיךָ הַמְּלָאכָה לִגְמֹר — You don't have to finish the work, but you're not free to stop trying" (Pirkei Avot 2:16)
- "אֵיזֶהוּ גִבּוֹר — Who is strong? One who conquers their inclination" (Pirkei Avot 4:1) — shown when user completes a hard lesson
- "הַיּוֹם קָצָר וְהַמְּלָאכָה מְרֻבָּה — The day is short and the work is much" (Pirkei Avot 2:15) — shown with daily reminder

### Weekly & Monthly Reports

```
┌─────────────────────────────────────┐
│  This Week's Growth                  │
│                                     │
│  📚 New letters learned: 6          │
│  📖 Words mastered: 23              │
│  🕐 Time invested: 34 minutes      │
│  🎯 Accuracy: 87%                   │
│  🔥 Streak: 7 days!                 │
│                                     │
│  "In 7 days you went from knowing   │
│   8 letters to reading full words.  │
│   Imagine where you'll be in a      │
│   month!"                           │
└─────────────────────────────────────┘
```

### Push Notification Strategy

- One daily notification at user's chosen time: "Time for your Hebrew practice ✨"
- Milestone alerts: "You're one lesson away from reading your first prayer!"
- **NO notifications on Shabbat/Yom Tov** (based on user's zmanim/location)
- **NO guilt-based messaging** — ever
- User controls frequency (daily, every other day, or off)

---

## 8. UI/UX Design System <a name="design"></a>

### Design Principles
- **Calm, reverent, encouraging** — not gamified-kiddie, not sterile-academic
- **High contrast** — nekudot must be clearly visible
- **Minimal clutter** — one action per screen
- **Large Hebrew** — 28-36px minimum for learning, 24px for reading
- **Mobile-first** — designed for one-handed phone use

### Color Palette

```
Background:       #FEFDFB  (warm off-white — not harsh pure white)
Surface:          #FFFFFF  (cards, modals)
Primary:          #1B4965  (deep blue — trust, wisdom, depth)
Primary Light:    #5FA8D3  (light blue — interactive elements)
Success:          #4A7C59  (forest green — mastery, growth)
Error:            #C17767  (muted terracotta — never harsh red)
Warning:          #D4A373  (warm amber)
Text Primary:     #2D3142  (near-black)
Text Secondary:   #6B7280  (gray)
Text Hebrew:      #1A1A2E  (deep navy — optimized for Hebrew readability)
Accent Gold:      #C6973F  (milestone celebrations, premium feel)

Vowel Colors (for color-coded nekudot):
  AH: #3B82F6  (blue)
  EH: #10B981  (green)
  EE: #F59E0B  (amber)
  OH: #8B5CF6  (purple)
  OO: #EF4444  (red)
  Shva: #9CA3AF (gray)
```

### Typography

```
Hebrew (learning/large):  'Noto Serif Hebrew', serif — 28-36px, line-height: 2.0
Hebrew (reading/siddur):  'Noto Serif Hebrew', serif — 22-26px, line-height: 1.8
Hebrew (UI labels):       'Noto Sans Hebrew', sans-serif — 16-18px
English (UI):             'Inter', system-ui, sans-serif
English (body):           'Inter', 16px, line-height: 1.6
```

### Key UI Components

**Letter Card (Teaching Mode):**
```
┌───────────────────────┐
│                       │
│         בּ             │  ← 72px Hebrew, centered
│                       │
│      "Bet" · "B"      │  ← Name + sound
│                       │
│   🔊 [Tap to hear]    │  ← Audio button
│                       │
│   "Boxy corner at     │  ← Mnemonic hint
│    bottom right"      │
│                       │
└───────────────────────┘
```

**Practice Card (Drill Mode):**
```
┌───────────────────────┐
│  Which sound does      │
│  this letter make?     │
│                       │
│         דּ             │  ← 64px Hebrew
│                       │
│  ┌─────┐  ┌─────┐    │
│  │ 🔊 D │  │ 🔊 R │    │  ← Audio choice buttons
│  └─────┘  └─────┘    │
│  ┌─────┐  ┌─────┐    │
│  │ 🔊 B │  │ 🔊 G │    │
│  └─────┘  └─────┘    │
│                       │
│  ━━━━━━━━━━░░ 7/10    │  ← Progress bar
└───────────────────────┘
```

**Siddur Player (Karaoke Mode):**
```
┌───────────────────────────────────┐
│  Modeh Ani                         │
│  0.75x  [▶ Play]  1x  1.25x      │
│                                   │
│  מוֹדֶה אֲנִי לְפָנֶיךָ           │
│  ^^^^^ (highlighted = current)    │
│  מֶלֶךְ חַי וְקַיָּם              │
│  שֶׁהֶחֱזַרְתָּ בִּי נִשְׁמָתִי    │
│  בְּחֶמְלָה רַבָּה אֱמוּנָתֶךָ     │
│                                   │
│  "I give thanks before You..."    │  ← Translation
│                                   │
│  [🔊 Tap word for audio]          │
│  [📝 Show transliteration]        │
└───────────────────────────────────┘
```

### Motion & Animation
- **Success pulse**: Gentle green glow on correct answers (200ms)
- **Error shake**: Subtle horizontal shake on wrong answers (not aggressive)
- **Level up**: Confetti burst (canvas-confetti) + expanding badge
- **Word highlight**: Smooth background color transition for karaoke mode
- **Progress fill**: Animated progress bar fills as you advance
- **Card flip**: Smooth 3D flip for flashcard-style exercises

### Responsive Design
- **Mobile (primary)**: Single column, bottom navigation, large touch targets (48px minimum)
- **Tablet**: Two-column layout for siddur mode (Hebrew + translation side by side)
- **Desktop**: Centered content area (max 640px), keyboard shortcuts for power users

---

## 9. Data Model <a name="data-model"></a>

### Supabase Schema

```sql
-- ==========================================
-- USERS & PROFILES
-- ==========================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  current_level INT DEFAULT 1,
  nusach TEXT DEFAULT 'ashkenaz', -- ashkenaz, sefard, edot
  daily_goal_minutes INT DEFAULT 5,
  transliteration_mode TEXT DEFAULT 'full', -- full, faded, tap, off
  audio_speed FLOAT DEFAULT 1.0,
  streak_days INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_practice_date DATE,
  total_study_minutes INT DEFAULT 0,
  total_words_mastered INT DEFAULT 0,
  placement_level INT, -- null = not assessed
  onboarding_complete BOOLEAN DEFAULT false
);

-- ==========================================
-- CURRICULUM CONTENT
-- ==========================================

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- letter, vowel, rule, word, prayer
  level INT NOT NULL, -- 1-10
  sort_order INT NOT NULL,
  hebrew TEXT NOT NULL,
  hebrew_with_nikud TEXT,
  name_english TEXT NOT NULL,
  sound TEXT, -- phonetic representation
  mnemonic TEXT, -- memory aid
  confusable_with UUID REFERENCES skills(id), -- for confusable pairs
  audio_url TEXT,
  image_url TEXT, -- for mnemonic images
  description TEXT,
  teaching_notes TEXT -- what to tell the learner
);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level INT NOT NULL,
  sort_order INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  skill_ids UUID[] NOT NULL, -- skills taught in this lesson
  estimated_minutes INT DEFAULT 5,
  prerequisite_lesson_id UUID REFERENCES lessons(id)
);

CREATE TABLE practice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID REFERENCES skills(id),
  lesson_id UUID REFERENCES lessons(id),
  type TEXT NOT NULL, -- tap_to_hear, choose_sound, choose_letter, build_syllable, read_word, read_line
  prompt_hebrew TEXT NOT NULL,
  prompt_hebrew_nikud TEXT,
  prompt_audio_url TEXT,
  correct_answer TEXT NOT NULL,
  distractors TEXT[], -- wrong answers for multiple choice
  difficulty INT DEFAULT 1, -- 1-5
  tags TEXT[] -- confusable, nekudah, syllable, prayer, etc.
);

-- ==========================================
-- PRAYERS / SIDDUR CONTENT
-- ==========================================

CREATE TABLE prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_hebrew TEXT NOT NULL,
  name_english TEXT NOT NULL,
  category TEXT NOT NULL, -- morning, shema, amidah, brachot, shabbat, etc.
  sort_order INT NOT NULL,
  when_said TEXT, -- "First thing upon waking"
  why_said TEXT, -- Spiritual context
  inspiration_text TEXT, -- The warm motivational blurb
  required_level INT DEFAULT 1,
  nusach_variant TEXT DEFAULT 'universal', -- universal, ashkenaz, sefard, edot
  estimated_read_seconds INT
);

CREATE TABLE prayer_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_id UUID REFERENCES prayers(id) ON DELETE CASCADE,
  sort_order INT NOT NULL,
  hebrew_text TEXT NOT NULL, -- with nekudot
  transliteration TEXT,
  translation TEXT,
  audio_url TEXT,
  slow_audio_url TEXT,
  word_timings JSONB, -- [{word: "בָּרוּךְ", start_ms: 0, end_ms: 450}, ...]
  notes TEXT -- teaching notes for this section
);

-- ==========================================
-- USER PROGRESS & SPACED REPETITION
-- ==========================================

CREATE TABLE user_skill_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id),
  mastery_level FLOAT DEFAULT 0, -- 0.0 to 1.0
  times_practiced INT DEFAULT 0,
  times_correct INT DEFAULT 0,
  last_practiced TIMESTAMPTZ,
  UNIQUE(user_id, skill_id)
);

CREATE TABLE card_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  practice_item_id UUID REFERENCES practice_items(id),
  -- FSRS fields
  difficulty FLOAT DEFAULT 0,
  stability FLOAT DEFAULT 0,
  due_date TIMESTAMPTZ DEFAULT now(),
  last_review TIMESTAMPTZ,
  reps INT DEFAULT 0,
  lapses INT DEFAULT 0,
  state TEXT DEFAULT 'new', -- new, learning, review, relearning
  UNIQUE(user_id, practice_item_id)
);

CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  practice_item_id UUID REFERENCES practice_items(id),
  result TEXT NOT NULL, -- correct, incorrect, skipped
  response_time_ms INT,
  user_answer TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id),
  status TEXT DEFAULT 'locked', -- locked, available, in_progress, completed
  score FLOAT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE user_prayer_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prayer_id UUID REFERENCES prayers(id),
  status TEXT DEFAULT 'locked', -- locked, available, learning, mastered
  listen_complete BOOLEAN DEFAULT false,
  echo_complete BOOLEAN DEFAULT false,
  read_complete BOOLEAN DEFAULT false,
  best_wpm FLOAT,
  last_practiced TIMESTAMPTZ,
  UNIQUE(user_id, prayer_id)
);

-- ==========================================
-- DAILY TRACKING & STREAKS
-- ==========================================

CREATE TABLE daily_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  minutes_studied INT DEFAULT 0,
  items_reviewed INT DEFAULT 0,
  items_correct INT DEFAULT 0,
  new_skills_learned INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL, -- first_letter, half_alephbet, first_word, first_prayer, etc.
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, milestone_type)
);

-- ==========================================
-- AUDIO RECORDINGS (for read-aloud feature)
-- ==========================================

CREATE TABLE recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prayer_section_id UUID REFERENCES prayer_sections(id),
  practice_item_id UUID REFERENCES practice_items(id),
  audio_url TEXT NOT NULL,
  duration_seconds FLOAT,
  accuracy_score FLOAT, -- from speech recognition comparison
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 10. Technical Architecture <a name="tech-architecture"></a>

### Stack

```
┌──────────────────────────────┐
│   Next.js 16 (App Router)    │  ← Web app (mobile-first responsive)
│   TypeScript + Tailwind CSS  │
│   Framer Motion animations   │
└──────────┬───────────────────┘
           │
    ┌──────┴──────┐
    │             │
    v             v
┌────────┐  ┌──────────┐
│Supabase│  │ External │
│- Auth  │  │ APIs:    │
│- DB    │  │- Google  │
│- Store │  │  STT     │
│- Edge  │  │- Eleven  │
│  Funcs │  │  Labs TTS│
└────────┘  └──────────┘
    │
    v
┌────────────┐
│ ts-fsrs    │  ← Spaced repetition engine (client-side)
│ FSRS algo  │
└────────────┘
```

### Key Dependencies

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "@supabase/supabase-js": "^2.x",
    "ts-fsrs": "^4.x",
    "framer-motion": "^11.x",
    "canvas-confetti": "^1.x",
    "@tailwindcss/typography": "^0.5.x",
    "zustand": "^5.x",
    "next-pwa": "^5.x"
  }
}
```

### Audio Strategy

**Text-to-Speech (Reference Audio):**
- Pre-generate all audio using ElevenLabs API with word-level timestamps
- Store in Supabase Storage as MP3 files
- Cache aggressively on client (Service Worker for web, AsyncStorage for native)
- Generate slow (0.75x) and normal (1x) versions

**Speech Recognition (Read-Aloud Feature):**
- Use Web Speech API as baseline (free, works in Chrome)
- Upgrade path: Google Cloud Speech-to-Text for better Hebrew accuracy
- Compare recognized text against expected text for scoring
- Store recordings in Supabase Storage for user playback

**Hebrew Fonts:**
- Bundle Noto Serif Hebrew (WOFF2) — best nekudot rendering
- Fallback chain: 'Noto Serif Hebrew', 'Frank Ruehl', 'David', serif
- Minimum 28px for learning mode, 22px for reading mode
- Line-height 2.0 to prevent nekudot overlap

### Offline Capability (PWA)
- Service Worker caches: current lesson + next 2 lessons + all their audio
- IndexedDB stores: user progress, spaced repetition schedule, daily session data
- Background sync: queues progress updates when offline, syncs when reconnected
- Spaced repetition engine runs entirely client-side (ts-fsrs)

---

## 11. API Routes <a name="api-routes"></a>

```
# Auth
POST   /api/auth/anonymous          — Create anonymous session
POST   /api/auth/register           — Convert to full account
POST   /api/auth/login              — Login

# Curriculum
GET    /api/skills                  — All skills (letters, vowels, rules)
GET    /api/skills/:id              — Single skill detail
GET    /api/lessons                 — All lessons with user progress
GET    /api/lessons/:id             — Single lesson with practice items

# Practice & Spaced Repetition
GET    /api/practice/queue          — Next items to review (FSRS-calculated)
POST   /api/practice/attempt        — Record an attempt result
POST   /api/practice/review         — Update FSRS card after review

# Prayers / Siddur
GET    /api/prayers                 — All prayers with user progress
GET    /api/prayers/:slug           — Single prayer with sections + audio
POST   /api/prayers/:slug/progress  — Update prayer learning progress

# Progress
GET    /api/progress                — User's complete progress overview
GET    /api/progress/daily          — Today's session stats
GET    /api/progress/streak         — Streak info
POST   /api/progress/milestone      — Record milestone achievement

# Audio
POST   /api/audio/recording         — Upload user recording
POST   /api/audio/evaluate          — Send recording for STT evaluation
GET    /api/audio/tts/:text         — Generate TTS for custom text (cached)

# Admin
POST   /api/admin/content/skill     — Add/edit skill
POST   /api/admin/content/lesson    — Add/edit lesson
POST   /api/admin/content/prayer    — Add/edit prayer
POST   /api/admin/audio/generate    — Batch-generate TTS audio
```

---

## 12. Content Seed Data <a name="content"></a>

### Letters (All 27 forms)

```
Standard (22):
א Aleph (silent) | בּ Bet (B) | ב Vet (V) | ג Gimel (G) | ד Dalet (D)
ה Hei (H) | ו Vav (V) | ז Zayin (Z) | ח Chet (CH) | ט Tet (T)
י Yud (Y) | כּ Kaf (K) | כ Chaf (CH) | ל Lamed (L) | מ Mem (M)
נ Nun (N) | ס Samech (S) | ע Ayin (silent/guttural) | פּ Pei (P)
פ Fei (F) | צ Tzadi (TZ) | ק Kuf (K) | ר Resh (R)
שׁ Shin (SH) | שׂ Sin (S) | ת Tav (T)

Final Forms (5):
ך Chaf Sofit | ם Mem Sofit | ן Nun Sofit | ף Fei Sofit | ץ Tzadi Sofit
```

### Nekudot (Vowels)

```
ַ  Patach    "AH"   (horizontal line under letter)
ָ  Kamatz    "AH"   (T-shape under letter)
ֶ  Segol     "EH"   (three dots in triangle under letter)
ֵ  Tzere     "EH"   (two dots under letter)
ִ  Chirik    "EE"   (single dot under letter)
ֹ  Cholam    "OH"   (dot above-left of letter)
וֹ Cholam Vav "OH"  (vav with dot above)
ֻ  Kubutz    "OO"   (three diagonal dots under letter)
וּ Shuruk    "OO"   (vav with dot inside)
ְ  Shva      silent or "uh"  (two vertical dots under letter)
ֲ  Chataf Patach  "AH" (reduced)
ֳ  Chataf Kamatz  "OH" (reduced)
ֱ  Chataf Segol   "EH" (reduced)
```

### First 100 Prayer Words (By Frequency)

```
Core Words (Top 30):
אַתָּה (Atah - You) | ה׳ (Hashem - God) | בָּרוּךְ (Baruch - Blessed)
אֱלֹקֵינוּ (Elokeinu - Our God) | מֶלֶךְ (Melech - King)
הָעוֹלָם (HaOlam - The World) | אֲשֶׁר (Asher - Who/That)
כִּי (Ki - Because) | כָּל (Kol - All) | אֶת (Et - [object marker])
עַל (Al - Upon) | לְ (L' - To/For) | בְּ (B' - In)
וְ (V' - And) | שֶׁ (She - That) | לֹא (Lo - No/Not)
אֲנִי (Ani - I) | אָמֵן (Amen) | שָׁלוֹם (Shalom - Peace)
יִשְׂרָאֵל (Yisrael - Israel) | שְׁמַע (Shma - Hear)
אֶחָד (Echad - One) | אָהַבְתָּ (Ahavta - You loved)
לֵב (Lev - Heart) | נֶפֶשׁ (Nefesh - Soul) | מְאֹד (Me'od - Very)
הַיּוֹם (HaYom - Today) | שָׁמַיִם (Shamayim - Heaven)
אֶרֶץ (Eretz - Land) | קָדוֹשׁ (Kadosh - Holy)
```

### Confusable Pairs (With Mnemonics)

```
1. בּ (Bet) vs כ (Kaf)
   Mnemonic: "Bet has a Boxy corner at bottom-right"
   Visual: Highlight the sharp corner vs rounded corner

2. ד (Dalet) vs ר (Resh)
   Mnemonic: "Dalet has a Diving-board edge poking out top-right"
   Visual: Highlight the serif/extension vs smooth curve

3. ה (Hei) vs ח (Chet)
   Mnemonic: "Chet is Clamped shut — no gap at top-left"
   Visual: Highlight the gap in Hei vs closed top in Chet

4. ו (Vav) vs ז (Zayin)
   Mnemonic: "Zayin has a Zigzag crown on top"
   Visual: Highlight the flat top of Vav vs crowned Zayin

5. ט (Tet) vs מ (open Mem)
   Mnemonic: "Tet's tail curls inward, Mem opens up"
   Visual: Highlight the curl direction

6. ע (Ayin) vs צ (Tzadi)
   Mnemonic: "Tzadi has a Tail on the right reaching up"
   Visual: Highlight the right extension

7. כ (Kaf) vs ב (Vet — no dagesh)
   Mnemonic: "Same shapes, different contexts — check for the dot!"
   Visual: Show with and without dagesh
```

### First Prayers (Complete Text)

**Modeh Ani:**
```hebrew
מוֹדֶה אֲנִי לְפָנֶיךָ מֶלֶךְ חַי וְקַיָּם
שֶׁהֶחֱזַרְתָּ בִּי נִשְׁמָתִי בְּחֶמְלָה
רַבָּה אֱמוּנָתֶךָ
```
Translation: "I give thanks before You, living and eternal King, for You have returned my soul within me with compassion — great is Your faithfulness."

**Shema (First Paragraph):**
```hebrew
שְׁמַע יִשְׂרָאֵל ה׳ אֱלֹקֵינוּ ה׳ אֶחָד

וְאָהַבְתָּ אֵת ה׳ אֱלֹקֶיךָ
בְּכָל לְבָבְךָ וּבְכָל נַפְשְׁךָ וּבְכָל מְאֹדֶךָ
וְהָיוּ הַדְּבָרִים הָאֵלֶּה
אֲשֶׁר אָנֹכִי מְצַוְּךָ הַיּוֹם עַל לְבָבֶךָ
וְשִׁנַּנְתָּם לְבָנֶיךָ
וְדִבַּרְתָּ בָּם
בְּשִׁבְתְּךָ בְּבֵיתֶךָ
וּבְלֶכְתְּךָ בַדֶּרֶךְ
וּבְשָׁכְבְּךָ וּבְקוּמֶךָ
```

---

## 13. MVP Scope (V1 Release) <a name="mvp"></a>

### What's IN the MVP

| Feature | Details |
|---------|---------|
| **Onboarding** | 5-screen flow → immediate first lesson |
| **Full Aleph-Bet course** | All 27 letter forms in research-backed order |
| **Core nekudot** | All vowels including shva (basic rules) |
| **6 exercise types** | tap-to-hear, choose-sound, choose-letter, build-syllable, read-word, confusable-drill |
| **Confusable pairs training** | All 7 pairs with mnemonics |
| **Syllable builder** | CV and CVC combinations |
| **Siddur Mode** | Modeh Ani + Shema (1st paragraph) + Hamotzi + 3 food brachot |
| **Karaoke mode** | Word-by-word highlighting with audio |
| **3 audio speeds** | 0.75x, 1x, 1.25x for all prayer audio |
| **Transliteration toggle** | Full / faded / tap / off |
| **FSRS spaced repetition** | Personalized daily review queue |
| **Daily practice loop** | Generated daily session with new + review |
| **Progress dashboard** | Mastery bars, streak, milestones |
| **Streaks with Shabbat grace** | Auto-pause on Shabbat/YT |
| **5 milestones** | First letter, half aleph-bet, full aleph-bet, first word, first prayer |
| **Responsive design** | Mobile-first, works on tablet + desktop |

### What's NOT in MVP (V2+)

- Audio recording / read-aloud with scoring
- Reading speed trainer (WPM)
- Shul Mode (time-based prayer display)
- Nusach variants (MVP defaults to Ashkenaz)
- Social features / study buddies
- Advanced prayers beyond Shema/brachot
- Rashi script
- Native mobile app (React Native)
- Offline mode (full PWA)
- AI-powered pronunciation feedback

---

## 14. V2+ Roadmap <a name="roadmap"></a>

### V2: Fluency & Audio
- Read-aloud recording with speech recognition scoring
- Reading speed trainer with WPM tracking
- 10 more prayers (Birchot HaShachar, Ashrei, Aleinu, Amidah selections)
- Nusach selection (Ashkenaz / Sefard / Edot)
- Full offline support (PWA with Service Worker)
- Audio recording storage and playback

### V3: Full Davening
- Complete Shacharis, Mincha, Maariv
- Shul Mode (current prayer for time of day)
- Shabbat-specific prayers (Kabbalat Shabbat, Kiddush, Birkat Hamazon)
- Weekly report emails
- Push notifications

### V4: Community & Beyond
- Study buddy matching (partner with Partners in Torah?)
- Community challenges ("Together we read 10,000 words this week")
- Rabbi/mentor dashboard (track student progress)
- Holiday prayer packs (High Holidays, Pesach, etc.)
- Torah reading mode (with trope/cantillation intro)
- Rashi script course

### V5: Native Mobile
- React Native / Expo app for iOS + Android
- Native speech recognition (better than web)
- Background audio / learning
- App Store / Google Play distribution
- Widget for daily practice reminder

---

## Appendix A: 30-Day Curriculum Map

### Week 1: Letters Part 1 + First Vowels
| Day | New Content | Review | Prayer Context |
|-----|------------|--------|----------------|
| 1 | Letters: שׁ ל א + Patach (AH) | — | Preview: Modeh Ani |
| 2 | Letters: מ ע ת + Kamatz (AH) | Day 1 letters | — |
| 3 | Letters: י ו ס + Practice AH vowels | Day 1-2 letters | — |
| 4 | Letters: נ ג ק + Segol (EH) | Day 1-3 + AH vowels | — |
| 5 | Review all 11 letters + Tzere (EH) | Full review | Read: מוֹדֶה (Modeh) |
| 6 | Confusable intro: ו vs ז | Spaced review | — |
| 7 | REST (Shabbat) — optional light review | — | — |

### Week 2: Letters Part 2 + More Vowels
| Day | New Content | Review | Prayer Context |
|-----|------------|--------|----------------|
| 8 | Confusable pair: בּ vs כ + Chirik (EE) | Week 1 | — |
| 9 | Confusable pair: ד vs ר | Weak items | Read: אֲנִי (Ani) |
| 10 | Confusable pair: ה vs ח + Cholam (OH) | Weak items | — |
| 11 | Letters: ט פּ צ + Kubutz/Shuruk (OO) | Mix | Read: מֶלֶךְ (Melech) |
| 12 | All vowels combined practice | Full vowel review | Syllable building |
| 13 | Final forms: ך ם ן ף ץ | Letters + vowels | Read full words |
| 14 | REST — optional review | — | — |

### Week 3: Syllables + First Prayer
| Day | New Content | Review | Prayer Context |
|-----|------------|--------|----------------|
| 15 | CV syllable building (all combos) | Weak items | — |
| 16 | CVC syllable building | Syllables | — |
| 17 | Shva (silent) introduction | Syllables + vowels | — |
| 18 | Shva (na) basics | Shva rules | Read: שְׁמַע (Shma) |
| 19 | **Modeh Ani** — Listen + Echo mode | Full review | PRAYER MILESTONE |
| 20 | Modeh Ani — Read mode practice | Prayer words | — |
| 21 | REST — try saying Modeh Ani in the morning! | — | — |

### Week 4: Brachot + Shema
| Day | New Content | Review | Prayer Context |
|-----|------------|--------|----------------|
| 22 | Common prayer words (בָּרוּךְ אַתָּה ה׳) | Modeh Ani | Bracha formula |
| 23 | Hamotzi + food brachot intro | Prayer words | — |
| 24 | Dagesh + BeGeD KePHeT basics | Brachot | — |
| 25 | Shema line 1 — Listen + Echo | Mix | — |
| 26 | Shema V'ahavta — Listen mode | Shema line 1 | — |
| 27 | V'ahavta — Echo + Read practice | Full review | — |
| 28 | REST | — | — |
| 29 | Full review + speed challenge | Everything | — |
| 30 | **Assessment** — placement for next month | — | CELEBRATE! |

---

## Appendix B: Research Sources

### Hebrew Reading Pedagogy
- NJOP Hebrew Reading Crash Course (njop.org)
- Orton-Gillingham adapted for Hebrew (hebrewscouts.com)
- SAPIR Journal: "The Trouble with Reading Hebrew"
- Aleph Champ 10-level system (alephchamp.com)
- PMC: Hebrew Letter Shape Confusability Study
- Reading Rockets: Automaticity Theory (LaBerge & Samuels)

### Learning App Best Practices
- Duolingo Birdbrain AI system
- FSRS algorithm (open-spaced-repetition)
- Microlearning: 83% completion for 10-min sessions
- Pimsleur's Graduated-Interval Recall
- Adult Learning Theory (Knowles' Andragogy)

### Kiruv & Prayer Education
- Aish HaTorah Hebrew Reading methodology
- Chabad transliteration bridge approach
- Partners in Torah personalized learning model
- Prayer progression: Modeh Ani → Brachot → Shema → Amidah

### Technology
- ElevenLabs TTS with word-level timestamps
- Google Cloud Speech-to-Text for Hebrew
- ivrit.ai: fine-tuned Whisper models for Hebrew
- ts-fsrs: TypeScript FSRS implementation
- Noto Serif Hebrew: best nekudot rendering
- PWA limitations on iOS (audio recording broken in standalone)

---

*This specification is the product of extensive research into Hebrew reading pedagogy, modern learning app design, kiruv education methods, adult learning theory, and current technology capabilities. It represents the state of the art in 2026 for teaching Hebrew reading to adult beginners in a kiruv context.*
