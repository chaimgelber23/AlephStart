/**
 * Generate ALL TTS audio for AlephStart — letters, vowels, bootcamp, and prayers.
 *
 * AUDIO ENGINES:
 *   - Hebrew content → Google Cloud TTS (WaveNet he-IL voices — proper pronunciation)
 *   - English content → ElevenLabs (natural English voices for transliteration)
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
 *   ELEVENLABS_API_KEY            (required for English/transliteration audio)
 *   GOOGLE_APPLICATION_CREDENTIALS (required for Hebrew audio — path to service account JSON)
 *     OR GOOGLE_TTS_API_KEY       (simpler API key auth for Google Cloud TTS)
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
import textToSpeech from '@google-cloud/text-to-speech';

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

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const HAS_GOOGLE_CREDS = !!(process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_TTS_API_KEY);

if (!ELEVENLABS_API_KEY) {
  console.warn('WARNING: Missing ELEVENLABS_API_KEY — English/transliteration audio will be skipped.');
}
if (!HAS_GOOGLE_CREDS) {
  console.error('Missing Google Cloud credentials. Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_TTS_API_KEY in .env.local');
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

// ── Google Cloud TTS ─────────────────────────────────────────────────

const GOOGLE_HEBREW_VOICES = {
  male: 'he-IL-Wavenet-B',
  female: 'he-IL-Wavenet-A',
} as const;

let _googleClient: textToSpeech.TextToSpeechClient | null = null;

function getGoogleClient(): textToSpeech.TextToSpeechClient {
  if (!_googleClient) {
    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (apiKey) {
      _googleClient = new textToSpeech.TextToSpeechClient({ apiKey });
    } else {
      _googleClient = new textToSpeech.TextToSpeechClient();
    }
  }
  return _googleClient;
}

interface GoogleTTSOptions {
  speed?: number;
  pitch?: number;
}

async function generateHebrewAudio(text: string, opts: GoogleTTSOptions = {}): Promise<Buffer> {
  const client = getGoogleClient();
  const voiceName = GOOGLE_HEBREW_VOICES[GENDER];

  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: 'he-IL',
      name: voiceName,
    },
    audioConfig: {
      audioEncoding: 'MP3' as const,
      speakingRate: opts.speed || 1.0,
      pitch: opts.pitch || 0,
      effectsProfileId: ['headphone-class-device'],
    },
  });

  if (!response.audioContent) {
    throw new Error('Google Cloud TTS returned empty audio');
  }

  if (typeof response.audioContent === 'string') {
    return Buffer.from(response.audioContent, 'base64');
  }
  return Buffer.from(response.audioContent);
}

// ── ElevenLabs TTS (English only) ────────────────────────────────────

const ELEVENLABS_VOICE_IDS = {
  male: {
    english: process.env.ELEVENLABS_ENGLISH_MALE_VOICE_ID || 'W1EJxHy9vl73xgPIKgpn',  // Rabbi Shafier
  },
  female: {
    english: process.env.ELEVENLABS_ENGLISH_FEMALE_VOICE_ID || 'hpp4J3VqNfWAUOO0d1Us', // Bella
  },
} as const;

const PRIMARY_MODEL = 'eleven_v3';
const FALLBACK_MODEL = 'eleven_multilingual_v2';
let usingFallbackModel = false;

interface ElevenLabsOptions {
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
  speed?: number;
}

function snapStabilityForV3(value: number): number {
  if (value <= 0.25) return 0.0;
  if (value <= 0.75) return 0.5;
  return 1.0;
}

async function generateEnglishAudio(text: string, opts: ElevenLabsOptions = {}): Promise<Buffer> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key not configured');
  }

  const voiceId = ELEVENLABS_VOICE_IDS[GENDER].english;
  const modelId = usingFallbackModel ? FALLBACK_MODEL : PRIMARY_MODEL;
  const isV3 = !usingFallbackModel;

  const rawStability = opts.stability ?? 0.65;
  const stability = isV3 ? snapStabilityForV3(rawStability) : rawStability;

  const voiceSettings: Record<string, unknown> = {
    stability,
    similarity_boost: opts.similarity_boost ?? 0.80,
    speed: opts.speed ?? 0.85,
  };

  if (!isV3) {
    voiceSettings.style = opts.style ?? 0.15;
    voiceSettings.use_speaker_boost = opts.use_speaker_boost ?? true;
  }

  const body: Record<string, unknown> = {
    text,
    model_id: modelId,
    voice_settings: voiceSettings,
    apply_text_normalization: 'on',
    language_code: 'en',
  };

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    if (!usingFallbackModel && (errorText.includes('model') || response.status === 422)) {
      console.log(`  ⚠ eleven_v3 not available, falling back to eleven_multilingual_v2`);
      usingFallbackModel = true;
      return generateEnglishAudio(text, opts);
    }
    if (errorText.includes('quota_exceeded')) {
      quotaExhausted = true;
    }
    throw new Error(`ElevenLabs API error ${response.status}: ${errorText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

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

// ── Shared helpers ───────────────────────────────────────────────────

function writeAudio(filePath: string, audio: Buffer) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, audio);
}

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

let totalGenerated = 0;
let totalSkipped = 0;
let totalErrors = 0;
let quotaExhausted = false;

// ── Quality presets ──────────────────────────────────────────────────

// Google Cloud TTS speed presets for Hebrew content
const GOOGLE_PRESETS = {
  letterName:  { speed: 0.85, pitch: 0 },
  letterSound: { speed: 0.75, pitch: 0 },
  vowel:       { speed: 0.85, pitch: 0 },
  syllable:    { speed: 0.80, pitch: 0 },
  word:        { speed: 0.90, pitch: 0 },
  reading:     { speed: 0.90, pitch: 0 },
  vocab:       { speed: 0.90, pitch: 0 },
  prayer:      { speed: 0.90, pitch: 0 },
} as const;

// ElevenLabs presets for English content
const ELEVEN_PRESETS = {
  letterName: { stability: 1.0, similarity_boost: 0.82, speed: 0.78 },
  letterSound: { stability: 1.0, similarity_boost: 0.85, speed: 0.65 },
  letterSilent: { stability: 1.0, similarity_boost: 0.80, speed: 0.72 },
  vowel: { stability: 1.0, similarity_boost: 0.82, speed: 0.78 },
  syllable: { stability: 1.0, similarity_boost: 0.82, speed: 0.70 },
  word: { stability: 0.5, similarity_boost: 0.82, speed: 0.78 },
  reading: { stability: 0.5, similarity_boost: 0.82, speed: 0.82 },
  vocab: { stability: 0.5, similarity_boost: 0.82, speed: 0.78 },
  prayer: { stability: 0.5, similarity_boost: 0.82, speed: 0.85 },
} as const;

// ── Unified generate-and-save ────────────────────────────────────────

async function generateAndSave(
  filePath: string,
  text: string,
  lang: 'he' | 'en',
  label: string,
  presetKey: keyof typeof GOOGLE_PRESETS
) {
  if (quotaExhausted && lang === 'en') {
    totalErrors++;
    return;
  }

  if (!FORCE && fs.existsSync(filePath)) {
    totalSkipped++;
    return;
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      console.log(`  🔊 ${label}`);

      let audio: Buffer;
      if (lang === 'he') {
        audio = await generateHebrewAudio(text, GOOGLE_PRESETS[presetKey]);
      } else {
        audio = await generateEnglishAudio(text, ELEVEN_PRESETS[presetKey]);
      }

      writeAudio(filePath, audio);
      totalGenerated++;

      // Rate limit — Google allows higher QPS but be polite
      await delay(lang === 'he' ? 200 : 500);
      return;
    } catch (err) {
      if (quotaExhausted) {
        console.error(`  ✗ Quota exhausted — stopping English generation.`);
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

// ── Category generators ───────────────────────────────────────────────

async function generateLetters(styles: ('modern' | 'american')[]) {
  const letters = await loadLetters();
  const audioDir = path.resolve(__dirname, '../public/audio/letters');

  console.log(`\n📝 Letters (${letters.length} letters, ${GENDER} voice)\n`);

  for (const style of styles) {
    console.log(`  Style: ${style}`);

    for (const letter of letters) {
      if (style === 'modern') {
        // Hebrew letter name — use Google Cloud TTS
        const nameFile = buildFileName(letter.id, style);
        const namePath = path.join(audioDir, nameFile);
        // Send the Hebrew character + name for best pronunciation
        await generateAndSave(namePath, letter.hebrew, 'he', `${letter.name} (${letter.hebrew}) — Hebrew name`, 'letterName');

        // Pure sound file — Hebrew pronunciation
        const soundFile = buildFileName(letter.id, style, '-sound');
        const soundPath = path.join(audioDir, soundFile);
        const sound = LETTER_SOUNDS[letter.id];

        if (!sound || sound === '...') {
          // Silent letters — explain in English
          const silentText = `${letter.name} is silent. It carries the vowel sound.`;
          await generateAndSave(soundPath, silentText, 'en', `${letter.name} — silent`, 'letterSilent');
        } else {
          // Generate the sound in Hebrew context
          await generateAndSave(soundPath, sound, 'he', `${letter.name} — "${sound}"`, 'letterSound');
        }
      } else {
        // American style — English pronunciation of letter names
        const nameFile = buildFileName(letter.id, style);
        const namePath = path.join(audioDir, nameFile);
        const soundText = letter.sound === '(silent)' ? 'Silent.' : `${letter.sound}.`;
        const nameText = `${letter.name}. ${soundText}`;
        await generateAndSave(namePath, nameText, 'en', `${letter.name} — English name`, 'letterName');

        const soundFile = buildFileName(letter.id, style, '-sound');
        const soundPath = path.join(audioDir, soundFile);
        const sound = LETTER_SOUNDS[letter.id];

        if (!sound || sound === '...') {
          const silentText = `${letter.name} is silent. It carries the vowel sound.`;
          await generateAndSave(soundPath, silentText, 'en', `${letter.name} — silent`, 'letterSilent');
        } else {
          await generateAndSave(soundPath, sound, 'en', `${letter.name} — "${sound}"`, 'letterSound');
        }
      }
    }
  }
}

async function generateVowels(styles: ('modern' | 'american')[]) {
  const vowels = await loadVowels();
  const audioDir = path.resolve(__dirname, '../public/audio/vowels');

  console.log(`\n🔵 Vowels (${vowels.length} vowels, ${GENDER} voice)\n`);

  for (const style of styles) {
    console.log(`  Style: ${style}`);

    for (const vowel of vowels) {
      const fileName = buildFileName(vowel.id, style);
      const filePath = path.join(audioDir, fileName);

      if (style === 'modern') {
        // Hebrew vowel sound — use Google Cloud TTS
        await generateAndSave(filePath, vowel.hebrew, 'he', `${vowel.name} (${vowel.hebrew}) — Hebrew`, 'vowel');
      } else {
        // English pronunciation
        const text = `${vowel.name}. ${vowel.sound}.`;
        await generateAndSave(filePath, text, 'en', `${vowel.name} — English`, 'vowel');
      }
    }
  }
}

async function generateBootcamp(styles: ('modern' | 'american')[]) {
  const days = await loadBootcampDays();

  console.log(`\n🏕️ Bootcamp (${days.length} days, ${GENDER} voice)\n`);

  for (const style of styles) {
    console.log(`  Style: ${style}`);
    const isHebrew = style === 'modern';

    for (const day of days) {
      console.log(`\n  Day ${day.day}: ${day.title}`);

      // Syllables
      const syllableDir = path.resolve(__dirname, '../public/audio/bootcamp/syllables');
      for (const syl of day.syllables) {
        const baseId = path.basename(syl.audioUrl, '.mp3');
        const fileName = buildFileName(baseId, style);
        const filePath = path.join(syllableDir, fileName);
        const text = isHebrew ? syl.hebrew : syl.transliteration;

        await generateAndSave(filePath, text, isHebrew ? 'he' : 'en',
          `Syllable: ${syl.transliteration} (${syl.hebrew})`, 'syllable');
      }

      // Practice words
      const wordsDir = path.resolve(__dirname, '../public/audio/bootcamp/words');
      for (const word of day.practiceWords) {
        const baseId = path.basename(word.audioUrl, '.mp3');
        const fileName = buildFileName(baseId, style);
        const filePath = path.join(wordsDir, fileName);
        const text = isHebrew ? word.hebrew : word.transliteration;

        await generateAndSave(filePath, text, isHebrew ? 'he' : 'en',
          `Word: ${word.transliteration} (${word.hebrew})`, 'word');
      }

      // Culminating reading
      if (day.culminatingReading?.lines) {
        const readingsDir = path.resolve(__dirname, '../public/audio/bootcamp/readings');
        for (const line of day.culminatingReading.lines) {
          const baseId = path.basename(line.audioUrl, '.mp3');
          const fileName = buildFileName(baseId, style);
          const filePath = path.join(readingsDir, fileName);
          const text = isHebrew ? line.hebrew : line.transliteration;

          await generateAndSave(filePath, text, isHebrew ? 'he' : 'en',
            `Reading: ${line.transliteration}`, 'reading');
        }
      }
    }
  }

  // Bootcamp vocabulary words
  const vocab = await loadBootcampVocab();
  console.log(`\n  📚 Bootcamp Vocabulary (${vocab.length} words)\n`);

  for (const style of styles) {
    const isHebrew = style === 'modern';
    const wordsDir = path.resolve(__dirname, '../public/audio/bootcamp/words');

    for (const word of vocab) {
      const baseId = path.basename(word.audioUrl, '.mp3');
      const fileName = buildFileName(baseId, style);
      const filePath = path.join(wordsDir, fileName);
      const text = isHebrew ? word.hebrew : word.transliteration;

      await generateAndSave(filePath, text, isHebrew ? 'he' : 'en',
        `Vocab: ${word.transliteration} (${word.hebrew})`, 'vocab');
    }
  }
}

async function generatePrayers(styles: ('modern' | 'american')[]) {
  const prayers = await loadPrayers();
  const audioDir = path.resolve(__dirname, '../public/audio/prayers');

  console.log(`\n🕍 Prayers (${prayers.length} prayers, ${GENDER} voice)\n`);

  for (const style of styles) {
    console.log(`  Style: ${style}`);
    const isHebrew = style === 'modern';

    for (const prayer of prayers) {
      const prayerDir = path.join(audioDir, prayer.id);

      for (const section of prayer.sections) {
        const fileName = buildFileName(section.id, style);
        const filePath = path.join(prayerDir, fileName);
        const text = isHebrew ? section.hebrewText : section.transliteration;

        if (!text) {
          totalSkipped++;
          continue;
        }

        await generateAndSave(filePath, text, isHebrew ? 'he' : 'en',
          `${prayer.nameEnglish} > ${section.id}`, 'prayer');
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

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  AlephStart Audio Generator`);
  console.log(`  Hebrew:   Google Cloud TTS (WaveNet ${GOOGLE_HEBREW_VOICES[GENDER]})`);
  console.log(`  English:  ElevenLabs (${PRIMARY_MODEL})`);
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
  console.log(`  Generated:  ${totalGenerated}`);
  console.log(`  Skipped:    ${totalSkipped} (already exist)`);
  console.log(`  Errors:     ${totalErrors}`);
  if (quotaExhausted) {
    console.log(`  ⚠ ElevenLabs QUOTA EXHAUSTED — English audio may be incomplete`);
  }
  console.log(`${'='.repeat(60)}\n`);
}

main().catch(console.error);
