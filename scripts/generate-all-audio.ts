/**
 * Generate ALL TTS audio for AlephStart — letters, vowels, bootcamp, and prayers.
 *
 * AUDIO ENGINES:
 *   - Hebrew content → Google Cloud TTS (WaveNet he-IL voices — proper pronunciation)
 *   - English content → Google Cloud TTS (WaveNet en-US voices for transliteration)
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
 *   GOOGLE_APPLICATION_CREDENTIALS (required — path to service account JSON)
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
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

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

const HAS_GOOGLE_CREDS = !!(process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_TTS_API_KEY);

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

let _googleClient: TextToSpeechClient | null = null;

function getGoogleClient(): TextToSpeechClient {
  if (!_googleClient) {
    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (apiKey) {
      _googleClient = new TextToSpeechClient({ apiKey });
    } else {
      _googleClient = new TextToSpeechClient();
    }
  }
  return _googleClient;
}

interface GoogleTTSOptions {
  speed?: number;
  pitch?: number;
}

// Fix ה׳ → אֲדֹנָי so TTS says "Adonai" instead of "heh"
function fixHashemForTTS(text: string): string {
  return text.replace(/ה[׳']/g, 'אֲדֹנָי');
}

async function generateHebrewAudio(text: string, opts: GoogleTTSOptions = {}): Promise<Buffer> {
  const client = getGoogleClient();
  const voiceName = GOOGLE_HEBREW_VOICES[GENDER];
  const processedText = fixHashemForTTS(text);

  const [response] = await client.synthesizeSpeech({
    input: { text: processedText },
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

// ── Google Cloud TTS (English) ────────────────────────────────────

const GOOGLE_ENGLISH_VOICES = {
  male: 'en-US-Wavenet-D',
  female: 'en-US-Wavenet-F',
} as const;

async function generateEnglishAudio(text: string, opts: GoogleTTSOptions = {}): Promise<Buffer> {
  const client = getGoogleClient();
  const voiceName = GOOGLE_ENGLISH_VOICES[GENDER];

  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: 'en-US',
      name: voiceName,
    },
    audioConfig: {
      audioEncoding: 'MP3' as const,
      speakingRate: opts.speed || 0.9,
      pitch: opts.pitch || 0,
      effectsProfileId: ['headphone-class-device'],
    },
  });

  if (!response.audioContent) {
    throw new Error('Google Cloud TTS returned empty audio (English)');
  }

  if (typeof response.audioContent === 'string') {
    return Buffer.from(response.audioContent, 'base64');
  }
  return Buffer.from(response.audioContent);
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

// Google Cloud TTS speed presets for English content
const ENGLISH_PRESETS = {
  letterName:  { speed: 0.85, pitch: 0 },
  letterSound: { speed: 0.75, pitch: 0 },
  letterSilent:{ speed: 0.85, pitch: 0 },
  vowel:       { speed: 0.85, pitch: 0 },
  syllable:    { speed: 0.80, pitch: 0 },
  word:        { speed: 0.90, pitch: 0 },
  reading:     { speed: 0.90, pitch: 0 },
  vocab:       { speed: 0.90, pitch: 0 },
  prayer:      { speed: 0.90, pitch: 0 },
} as const;

// ── Unified generate-and-save ────────────────────────────────────────

async function generateAndSave(
  filePath: string,
  text: string,
  lang: 'he' | 'en',
  label: string,
  presetKey: keyof typeof GOOGLE_PRESETS
) {
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
        audio = await generateEnglishAudio(text, ENGLISH_PRESETS[presetKey as keyof typeof ENGLISH_PRESETS]);
      }

      writeAudio(filePath, audio);
      totalGenerated++;

      // Rate limit — Google allows higher QPS but be polite
      await delay(200);
      return;
    } catch (err) {
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
        // Hebrew vowel sound — use aleph as carrier so TTS pronounces the vowel
        // Bare nikud marks (like ַ) produce silence; אַ produces "ah"
        const vowelText = `א${vowel.hebrew}`;
        await generateAndSave(filePath, vowelText, 'he', `${vowel.name} (${vowelText}) — Hebrew`, 'vowel');
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
  console.log(`  English:  Google Cloud TTS (WaveNet ${GOOGLE_ENGLISH_VOICES[GENDER]})`);
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
  console.log(`${'='.repeat(60)}\n`);
}

main().catch(console.error);
