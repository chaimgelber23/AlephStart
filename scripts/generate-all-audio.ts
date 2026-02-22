/**
 * Generate ALL TTS audio for AlephStart — letters, vowels, bootcamp, and prayers.
 *
 * QUALITY SETTINGS:
 *   - Model: eleven_v3 (ElevenLabs' most natural, expressive model — 70+ languages)
 *   - Language codes: 'he' for Hebrew, 'en' for English
 *   - Text normalization: ON for consistent pronunciation
 *   - Per-content voice tuning (prayers are warm/flowing, letters are clear/educational)
 *   - Speaker boost: ON for clarity
 *
 * Usage:
 *   # Generate female audio for everything:
 *   GENDER=female npx tsx --tsconfig tsconfig.json scripts/generate-all-audio.ts
 *
 *   # Generate male audio for everything:
 *   GENDER=male npx tsx --tsconfig tsconfig.json scripts/generate-all-audio.ts
 *
 *   # Generate only a specific category:
 *   GENDER=female CATEGORY=letters npx tsx --tsconfig tsconfig.json scripts/generate-all-audio.ts
 *   GENDER=female CATEGORY=prayers npx tsx --tsconfig tsconfig.json scripts/generate-all-audio.ts
 *
 *   # Generate both styles (modern + american) for a gender:
 *   GENDER=female STYLE=modern  npx tsx --tsconfig tsconfig.json scripts/generate-all-audio.ts
 *   GENDER=female STYLE=american npx tsx --tsconfig tsconfig.json scripts/generate-all-audio.ts
 *
 *   # Force regenerate existing files:
 *   GENDER=female FORCE=true npx tsx --tsconfig tsconfig.json scripts/generate-all-audio.ts
 *
 * Environment:
 *   ELEVENLABS_API_KEY  (required)
 *   GENDER              male | female (required)
 *   STYLE               modern | american | both (default: both)
 *   CATEGORY            letters | vowels | bootcamp | prayers | all (default: all)
 *   FORCE               true to overwrite existing files (default: false)
 *
 * File convention:
 *   Male modern:    {id}.mp3
 *   Male american:  {id}-american.mp3
 *   Female modern:  {id}-female.mp3
 *   Female american:{id}-american-female.mp3
 */

import * as fs from 'fs';
import * as path from 'path';

// Load .env.local manually (no dotenv dependency needed)
function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}
loadEnvFile(path.resolve(__dirname, '../.env.local'));
loadEnvFile(path.resolve(__dirname, '../.env'));

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('Missing ELEVENLABS_API_KEY. Set it in .env.local');
  process.exit(1);
}

const GENDER = process.env.GENDER as 'male' | 'female';
if (!GENDER || !['male', 'female'].includes(GENDER)) {
  console.error('GENDER is required. Set GENDER=male or GENDER=female');
  process.exit(1);
}

const STYLE = process.env.STYLE || 'both';
const CATEGORY = process.env.CATEGORY || 'all';
const FORCE = process.env.FORCE === 'true';

// ── Voice IDs ─────────────────────────────────────────────────────────

const VOICE_IDS = {
  male: {
    hebrew: process.env.ELEVENLABS_HEBREW_MALE_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb',   // George — warm, captivating storyteller (great for prayer)
    english: process.env.ELEVENLABS_ENGLISH_MALE_VOICE_ID || 'W1EJxHy9vl73xgPIKgpn',  // Rabbi Shafier — actual rabbi, strong & inviting
  },
  female: {
    hebrew: process.env.ELEVENLABS_HEBREW_FEMALE_VOICE_ID || 'pFZP5JQG7iQjIQuC4Bku',   // Lily — velvety, warm (beautiful for prayer)
    english: process.env.ELEVENLABS_ENGLISH_FEMALE_VOICE_ID || 'hpp4J3VqNfWAUOO0d1Us', // Bella — professional, bright, warm educator
  },
} as const;

// ── Model & Quality ──────────────────────────────────────────────────
// eleven_v3 = ElevenLabs' newest, most natural model (70+ languages incl. Hebrew)
// Falls back to eleven_multilingual_v2 if v3 fails
const PRIMARY_MODEL = 'eleven_v3';
const FALLBACK_MODEL = 'eleven_multilingual_v2';

// ── File suffix helpers ───────────────────────────────────────────────

function genderSuffix(): string {
  return GENDER === 'female' ? '-female' : '';
}

function styleSuffix(style: 'modern' | 'american'): string {
  return style === 'american' ? '-american' : '';
}

function buildFileName(id: string, style: 'modern' | 'american', extra = ''): string {
  return `${id}${extra}${styleSuffix(style)}${genderSuffix()}.mp3`;
}

// ── ElevenLabs TTS ────────────────────────────────────────────────────

interface TTSOptions {
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
  speed?: number;
  language_code?: string;
}

let quotaExhausted = false;
let usingFallbackModel = false;

// eleven_v3 only accepts stability: 0.0 (Creative), 0.5 (Natural), 1.0 (Robust)
function snapStabilityForV3(value: number): number {
  if (value <= 0.25) return 0.0;
  if (value <= 0.75) return 0.5;
  return 1.0;
}

async function generateAudio(
  text: string,
  voiceId: string,
  opts: TTSOptions = {}
): Promise<Buffer> {
  const modelId = usingFallbackModel ? FALLBACK_MODEL : PRIMARY_MODEL;
  const isV3 = modelId === PRIMARY_MODEL && !usingFallbackModel;

  const rawStability = opts.stability ?? 0.65;
  const stability = isV3 ? snapStabilityForV3(rawStability) : rawStability;

  const voiceSettings: Record<string, unknown> = {
    stability,
    similarity_boost: opts.similarity_boost ?? 0.80,
    speed: opts.speed ?? 0.85,
  };

  // style and use_speaker_boost — include for v2, skip for v3 to avoid errors
  if (!isV3) {
    voiceSettings.style = opts.style ?? 0.15;
    voiceSettings.use_speaker_boost = opts.use_speaker_boost ?? true;
  }

  const body: Record<string, unknown> = {
    text,
    model_id: modelId,
    voice_settings: voiceSettings,
    apply_text_normalization: 'on',
  };

  // Set language code for better pronunciation
  if (opts.language_code) {
    body.language_code = opts.language_code;
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY!,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    // If model not available, try fallback
    if (!usingFallbackModel && (errorText.includes('model') || response.status === 422)) {
      console.log(`  ⚠ eleven_v3 not available, falling back to eleven_multilingual_v2`);
      usingFallbackModel = true;
      return generateAudio(text, voiceId, opts);
    }

    // Detect quota exhaustion → stop wasting time
    if (errorText.includes('quota_exceeded')) {
      quotaExhausted = true;
    }

    throw new Error(`ElevenLabs API error ${response.status}: ${errorText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

function writeAudio(filePath: string, audio: Buffer) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, audio);
}

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Track totals
let totalGenerated = 0;
let totalSkipped = 0;
let totalErrors = 0;

async function generateAndSave(
  filePath: string,
  text: string,
  voiceId: string,
  label: string,
  opts: TTSOptions = {}
) {
  if (quotaExhausted) {
    totalErrors++;
    return;
  }

  if (!FORCE && fs.existsSync(filePath)) {
    totalSkipped++;
    return;
  }

  // Retry once on transient failures
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      console.log(`  🔊 ${label}`);
      const audio = await generateAudio(text, voiceId, opts);
      writeAudio(filePath, audio);
      totalGenerated++;
      await delay(500); // Rate limit
      return;
    } catch (err) {
      if (quotaExhausted) {
        console.error(`  ✗ Quota exhausted — stopping generation.`);
        totalErrors++;
        return;
      }
      if (attempt === 0) {
        console.log(`  ⟳ Retrying...`);
        await delay(1000);
        continue;
      }
      console.error(`  ✗ Error: ${err instanceof Error ? err.message : err}`);
      totalErrors++;
    }
  }
}

// ── Content loaders ───────────────────────────────────────────────────

async function loadLetters() {
  const mod = await import('../src/lib/content/letters');
  return mod.LETTERS;
}

async function loadVowels() {
  const mod = await import('../src/lib/content/vowels');
  return mod.VOWELS;
}

async function loadBootcampDays() {
  const mod = await import('../src/lib/content/bootcampDays');
  return mod.BOOTCAMP_DAYS;
}

async function loadPrayers() {
  const mod = await import('../src/lib/content/prayers');
  return mod.PRAYERS;
}

async function loadBootcampVocab() {
  const mod = await import('../src/lib/content/bootcampVocab');
  return mod.BOOTCAMP_VOCAB;
}

// ── Phonetic sounds for letter-sound files ────────────────────────────

const LETTER_SOUNDS: Record<string, string> = {
  shin: 'shh', lamed: 'lll', aleph: '...', mem: 'mmm', ayin: '...',
  tav: 'tuh', yud: 'yuh', vav: 'vvv', samech: 'sss', nun: 'nnn',
  gimel: 'guh', kuf: 'kuh', bet: 'buh', vet: 'vvv', kaf: 'kuh',
  chaf: 'chhh', dalet: 'duh', resh: 'rrr', hei: 'hah', chet: 'chhh',
  tet: 'tuh', pei: 'puh', fei: 'fff', tzadi: 'tsss', zayin: 'zzz',
  sin: 'sss', chaf_sofit: 'chhh', mem_sofit: 'mmm', nun_sofit: 'nnn',
  fei_sofit: 'fff', tzadi_sofit: 'tsss',
};

// ── Quality presets per content type ──────────────────────────────────
// Tuned for the most natural, realistic output per use case.

// Stability for eleven_v3: 0.0 = Creative, 0.5 = Natural, 1.0 = Robust
// For v2 fallback, the raw values still work (continuous 0-1)
const PRESETS = {
  // Letter names: clear, educational, slightly slow → Robust
  letterName: (lang: string): TTSOptions => ({
    stability: 1.0,
    similarity_boost: 0.82,
    style: 0.10,
    use_speaker_boost: true,
    speed: 0.78,
    language_code: lang,
  }),

  // Letter pure sounds: very stable, slow, precise → Robust
  letterSound: (lang: string): TTSOptions => ({
    stability: 1.0,
    similarity_boost: 0.85,
    style: 0.05,
    use_speaker_boost: true,
    speed: 0.65,
    language_code: lang,
  }),

  // Silent letter descriptions → Robust
  letterSilent: (lang: string): TTSOptions => ({
    stability: 1.0,
    similarity_boost: 0.80,
    style: 0.10,
    use_speaker_boost: true,
    speed: 0.72,
    language_code: lang,
  }),

  // Vowel names + sounds: clear and educational → Robust
  vowel: (lang: string): TTSOptions => ({
    stability: 1.0,
    similarity_boost: 0.82,
    style: 0.10,
    use_speaker_boost: true,
    speed: 0.78,
    language_code: lang,
  }),

  // Bootcamp syllables: very clear, isolated pronunciation → Robust
  syllable: (lang: string): TTSOptions => ({
    stability: 1.0,
    similarity_boost: 0.82,
    style: 0.05,
    use_speaker_boost: true,
    speed: 0.70,
    language_code: lang,
  }),

  // Bootcamp words: clear but natural → Natural
  word: (lang: string): TTSOptions => ({
    stability: 0.5,
    similarity_boost: 0.82,
    style: 0.12,
    use_speaker_boost: true,
    speed: 0.78,
    language_code: lang,
  }),

  // Bootcamp readings: flowing, natural cadence → Natural
  reading: (lang: string): TTSOptions => ({
    stability: 0.5,
    similarity_boost: 0.82,
    style: 0.20,
    use_speaker_boost: true,
    speed: 0.82,
    language_code: lang,
  }),

  // Vocabulary: clear pronunciation → Natural
  vocab: (lang: string): TTSOptions => ({
    stability: 0.5,
    similarity_boost: 0.82,
    style: 0.10,
    use_speaker_boost: true,
    speed: 0.78,
    language_code: lang,
  }),

  // Prayer sections: warm, reverent, natural flowing Hebrew → Natural
  prayer: (lang: string): TTSOptions => ({
    stability: 0.5,
    similarity_boost: 0.82,
    style: 0.25,
    use_speaker_boost: true,
    speed: 0.85,
    language_code: lang,
  }),
} as const;

// ── Category generators ───────────────────────────────────────────────

async function generateLetters(styles: ('modern' | 'american')[]) {
  const letters = await loadLetters();
  const audioDir = path.resolve(__dirname, '../public/audio/letters');
  const voices = VOICE_IDS[GENDER];

  console.log(`\n📝 Letters (${letters.length} letters, ${GENDER} voice)\n`);

  for (const style of styles) {
    if (quotaExhausted) break;
    console.log(`  Style: ${style}`);
    const voiceId = voices.english;

    for (const letter of letters) {
      if (quotaExhausted) break;

      // 1. Letter name + sound file
      const nameFile = buildFileName(letter.id, style);
      const namePath = path.join(audioDir, nameFile);
      const soundText = letter.sound === '(silent)' ? 'Silent.' : `${letter.sound}.`;
      const nameText = `${letter.name}. ${soundText}`;

      await generateAndSave(namePath, nameText, voiceId, `${letter.name} (${letter.hebrew}) — name`,
        PRESETS.letterName('en'));

      // 2. Pure sound file
      const soundFile = buildFileName(letter.id, style, '-sound');
      const soundPath = path.join(audioDir, soundFile);
      const sound = LETTER_SOUNDS[letter.id];

      if (!sound || sound === '...') {
        const silentText = `${letter.name} is silent. It carries the vowel sound.`;
        await generateAndSave(soundPath, silentText, voiceId, `${letter.name} — silent`,
          PRESETS.letterSilent('en'));
      } else {
        await generateAndSave(soundPath, sound, voiceId, `${letter.name} — "${sound}"`,
          PRESETS.letterSound('en'));
      }
    }
  }
}

async function generateVowels(styles: ('modern' | 'american')[]) {
  const vowels = await loadVowels();
  const audioDir = path.resolve(__dirname, '../public/audio/vowels');
  const voices = VOICE_IDS[GENDER];

  console.log(`\n🔵 Vowels (${vowels.length} vowels, ${GENDER} voice)\n`);

  for (const style of styles) {
    if (quotaExhausted) break;
    console.log(`  Style: ${style}`);
    const voiceId = voices.english;

    for (const vowel of vowels) {
      if (quotaExhausted) break;
      const fileName = buildFileName(vowel.id, style);
      const filePath = path.join(audioDir, fileName);
      const text = `${vowel.name}. ${vowel.sound}.`;

      await generateAndSave(filePath, text, voiceId, `${vowel.name} (${vowel.hebrew}) — "${vowel.sound}"`,
        PRESETS.vowel('en'));
    }
  }
}

async function generateBootcamp(styles: ('modern' | 'american')[]) {
  const days = await loadBootcampDays();
  const voices = VOICE_IDS[GENDER];

  console.log(`\n🏕️ Bootcamp (${days.length} days, ${GENDER} voice)\n`);

  for (const style of styles) {
    if (quotaExhausted) break;
    console.log(`  Style: ${style}`);
    const lang = style === 'american' ? 'en' : 'he';

    for (const day of days) {
      if (quotaExhausted) break;
      console.log(`\n  Day ${day.day}: ${day.title}`);

      // Syllables
      const syllableDir = path.resolve(__dirname, '../public/audio/bootcamp/syllables');
      for (const syl of day.syllables) {
        if (quotaExhausted) break;
        const baseId = path.basename(syl.audioUrl, '.mp3');
        const fileName = buildFileName(baseId, style);
        const filePath = path.join(syllableDir, fileName);

        const text = style === 'american' ? syl.transliteration : syl.hebrew;
        const voiceId = style === 'american' ? voices.english : voices.hebrew;

        await generateAndSave(filePath, text, voiceId, `Syllable: ${syl.transliteration} (${syl.hebrew})`,
          PRESETS.syllable(lang));
      }

      // Practice words
      const wordsDir = path.resolve(__dirname, '../public/audio/bootcamp/words');
      for (const word of day.practiceWords) {
        if (quotaExhausted) break;
        const baseId = path.basename(word.audioUrl, '.mp3');
        const fileName = buildFileName(baseId, style);
        const filePath = path.join(wordsDir, fileName);

        const text = style === 'american' ? word.transliteration : word.hebrew;
        const voiceId = style === 'american' ? voices.english : voices.hebrew;

        await generateAndSave(filePath, text, voiceId, `Word: ${word.transliteration} (${word.hebrew})`,
          PRESETS.word(lang));
      }

      // Culminating reading
      if (day.culminatingReading?.lines) {
        const readingsDir = path.resolve(__dirname, '../public/audio/bootcamp/readings');
        for (const line of day.culminatingReading.lines) {
          if (quotaExhausted) break;
          const baseId = path.basename(line.audioUrl, '.mp3');
          const fileName = buildFileName(baseId, style);
          const filePath = path.join(readingsDir, fileName);

          const text = style === 'american' ? line.transliteration : line.hebrew;
          const voiceId = style === 'american' ? voices.english : voices.hebrew;

          await generateAndSave(filePath, text, voiceId, `Reading: ${line.transliteration}`,
            PRESETS.reading(lang));
        }
      }
    }
  }

  // Bootcamp vocabulary words
  if (!quotaExhausted) {
    const vocab = await loadBootcampVocab();
    console.log(`\n  📚 Bootcamp Vocabulary (${vocab.length} words)\n`);

    for (const style of styles) {
      if (quotaExhausted) break;
      const lang = style === 'american' ? 'en' : 'he';
      const wordsDir = path.resolve(__dirname, '../public/audio/bootcamp/words');

      for (const word of vocab) {
        if (quotaExhausted) break;
        const baseId = path.basename(word.audioUrl, '.mp3');
        const fileName = buildFileName(baseId, style);
        const filePath = path.join(wordsDir, fileName);

        const text = style === 'american' ? word.transliteration : word.hebrew;
        const voiceId = style === 'american' ? voices.english : voices.hebrew;

        await generateAndSave(filePath, text, voiceId, `Vocab: ${word.transliteration} (${word.hebrew})`,
          PRESETS.vocab(lang));
      }
    }
  }
}

async function generatePrayers(styles: ('modern' | 'american')[]) {
  const prayers = await loadPrayers();
  const audioDir = path.resolve(__dirname, '../public/audio/prayers');
  const voices = VOICE_IDS[GENDER];

  console.log(`\n🕍 Prayers (${prayers.length} prayers, ${GENDER} voice)\n`);

  for (const style of styles) {
    if (quotaExhausted) break;
    console.log(`  Style: ${style}`);
    const lang = style === 'american' ? 'en' : 'he';

    for (const prayer of prayers) {
      if (quotaExhausted) break;
      const prayerDir = path.join(audioDir, prayer.id);

      for (const section of prayer.sections) {
        if (quotaExhausted) break;
        const fileName = buildFileName(section.id, style);
        const filePath = path.join(prayerDir, fileName);

        const text = style === 'american'
          ? section.transliteration
          : section.hebrewText;
        const voiceId = style === 'american' ? voices.english : voices.hebrew;

        if (!text) {
          totalSkipped++;
          continue;
        }

        await generateAndSave(filePath, text, voiceId, `${prayer.nameEnglish} > ${section.id}`,
          PRESETS.prayer(lang));
      }
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  const styles: ('modern' | 'american')[] =
    STYLE === 'both' ? ['modern', 'american'] :
    STYLE === 'modern' ? ['modern'] :
    STYLE === 'american' ? ['american'] :
    ['modern', 'american'];

  const modelLabel = usingFallbackModel ? FALLBACK_MODEL : PRIMARY_MODEL;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  AlephStart Audio Generator`);
  console.log(`  Model:    ${PRIMARY_MODEL} (fallback: ${FALLBACK_MODEL})`);
  console.log(`  Gender:   ${GENDER}`);
  console.log(`  Styles:   ${styles.join(', ')}`);
  console.log(`  Category: ${CATEGORY}`);
  console.log(`  Force:    ${FORCE}`);
  console.log(`${'='.repeat(60)}`);

  if (CATEGORY === 'all' || CATEGORY === 'letters') {
    await generateLetters(styles);
  }
  if (CATEGORY === 'all' || CATEGORY === 'vowels') {
    await generateVowels(styles);
  }
  if (CATEGORY === 'all' || CATEGORY === 'bootcamp') {
    await generateBootcamp(styles);
  }
  if (CATEGORY === 'all' || CATEGORY === 'prayers') {
    await generatePrayers(styles);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  DONE!`);
  console.log(`  Model used: ${usingFallbackModel ? FALLBACK_MODEL : PRIMARY_MODEL}`);
  console.log(`  Generated:  ${totalGenerated}`);
  console.log(`  Skipped:    ${totalSkipped} (already exist)`);
  console.log(`  Errors:     ${totalErrors}`);
  if (quotaExhausted) {
    console.log(`  ⚠ QUOTA EXHAUSTED — re-run after credits refresh`);
  }
  console.log(`${'='.repeat(60)}\n`);
}

main().catch(console.error);
