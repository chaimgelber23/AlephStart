/**
 * Test Google Cloud TTS for bootcamp content: letters, vowels, syllables, words.
 * Usage: npx tsx scripts/test-bootcamp-tts.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Load .env.local
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

const apiKey = process.env.GOOGLE_TTS_API_KEY;
if (!apiKey) {
  console.error('Missing GOOGLE_TTS_API_KEY');
  process.exit(1);
}

const client = new TextToSpeechClient({ apiKey });

const outDir = path.resolve(__dirname, '../test-audio/bootcamp');
fs.mkdirSync(outDir, { recursive: true });

// Replace ה׳ with אֲדֹנָי so TTS says "Adonai" not "heh"
function fixHashemForTTS(text: string): string {
  return text.replace(/ה[׳']/g, 'אֲדֹנָי');
}

async function generate(text: string, fileName: string, speed: number = 0.85) {
  const fixed = fixHashemForTTS(text);
  const [response] = await client.synthesizeSpeech({
    input: { text: fixed },
    voice: { languageCode: 'he-IL', name: 'he-IL-Wavenet-B' },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: speed,
      pitch: -1,
      effectsProfileId: ['headphone-class-device'],
    },
  });
  if (!response.audioContent) throw new Error('Empty response');
  const buffer = typeof response.audioContent === 'string'
    ? Buffer.from(response.audioContent, 'base64')
    : Buffer.from(response.audioContent);
  fs.writeFileSync(path.join(outDir, fileName), buffer);
  console.log(`  -> ${fileName} (${buffer.length} bytes)`);
}

const TESTS = [
  // Letter names
  { text: 'אָלֶף', file: 'letter-aleph.mp3', label: 'Letter: Aleph' },
  { text: 'שִׁין', file: 'letter-shin.mp3', label: 'Letter: Shin' },
  { text: 'בֵּית', file: 'letter-bet.mp3', label: 'Letter: Bet' },
  { text: 'לָמֶד', file: 'letter-lamed.mp3', label: 'Letter: Lamed' },
  { text: 'מֵם', file: 'letter-mem.mp3', label: 'Letter: Mem' },

  // Letter sounds (short)
  { text: 'בּ', file: 'sound-bet.mp3', label: 'Sound: B (bet)' },
  { text: 'שׁ', file: 'sound-shin.mp3', label: 'Sound: SH (shin)' },
  { text: 'ל', file: 'sound-lamed.mp3', label: 'Sound: L (lamed)' },

  // Vowels with aleph as carrier
  { text: 'אַ', file: 'vowel-patach.mp3', label: 'Vowel: Patach (AH)' },
  { text: 'אָ', file: 'vowel-kamatz.mp3', label: 'Vowel: Kamatz (AH)' },
  { text: 'אֶ', file: 'vowel-segol.mp3', label: 'Vowel: Segol (EH)' },
  { text: 'אֵ', file: 'vowel-tzere.mp3', label: 'Vowel: Tzere (EH)' },
  { text: 'אִ', file: 'vowel-chirik.mp3', label: 'Vowel: Chirik (EE)' },
  { text: 'אֹ', file: 'vowel-cholam.mp3', label: 'Vowel: Cholam (OH)' },
  { text: 'אוּ', file: 'vowel-shuruk.mp3', label: 'Vowel: Shuruk (OO)' },
  { text: 'אֻ', file: 'vowel-kubutz.mp3', label: 'Vowel: Kubutz (OO)' },

  // Syllables
  { text: 'בַּ', file: 'syllable-ba.mp3', label: 'Syllable: BA' },
  { text: 'שָׁ', file: 'syllable-sha.mp3', label: 'Syllable: SHA' },
  { text: 'מֶ', file: 'syllable-me.mp3', label: 'Syllable: ME' },
  { text: 'לוֹ', file: 'syllable-lo.mp3', label: 'Syllable: LO' },
  { text: 'רוּ', file: 'syllable-ru.mp3', label: 'Syllable: RU' },

  // Words
  { text: 'שָׁלוֹם', file: 'word-shalom.mp3', label: 'Word: Shalom' },
  { text: 'בָּרוּךְ', file: 'word-baruch.mp3', label: 'Word: Baruch' },
  { text: 'אָמֵן', file: 'word-amen.mp3', label: 'Word: Amen' },
  { text: 'שַׁבָּת', file: 'word-shabbat.mp3', label: 'Word: Shabbat' },
  { text: 'תּוֹרָה', file: 'word-torah.mp3', label: 'Word: Torah' },
  { text: 'מִצְוָה', file: 'word-mitzvah.mp3', label: 'Word: Mitzvah' },
  { text: 'חֶסֶד', file: 'word-chesed.mp3', label: 'Word: Chesed' },

  // Short phrases (bootcamp culminating readings)
  { text: 'בָּרוּךְ אַתָּה', file: 'phrase-baruch-atah.mp3', label: 'Phrase: Baruch Atah' },
  { text: 'שְׁמַע יִשְׂרָאֵל', file: 'phrase-shema-yisrael.mp3', label: 'Phrase: Shema Yisrael' },
];

async function main() {
  console.log('\n=== Bootcamp TTS Test (Google Cloud he-IL-Wavenet-B) ===\n');

  for (const test of TESTS) {
    console.log(`${test.label}: ${test.text}`);
    try {
      await generate(test.text, test.file);
    } catch (err) {
      console.error(`  -> Error: ${err instanceof Error ? err.message : err}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nDone! ${TESTS.length} files saved to: ${outDir}\n`);
}

main().catch(console.error);
