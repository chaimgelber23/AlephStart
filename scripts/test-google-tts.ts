/**
 * Compare Google Cloud TTS (Hebrew) vs ElevenLabs Rabbi Shafier (transliteration).
 * Also fixes ה׳ → אֲדֹנָי for proper pronunciation.
 *
 * Usage: npx tsx scripts/test-google-tts.ts
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

const googleApiKey = process.env.GOOGLE_TTS_API_KEY;
const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;

const googleClient = googleApiKey ? new TextToSpeechClient({ apiKey: googleApiKey }) : null;

// Replace ה׳ with אֲדֹנָי so TTS says "Adonai" instead of "heh"
function fixHashemForTTS(text: string): string {
  return text.replace(/ה[׳']/g, 'אֲדֹנָי');
}

const TESTS = [
  {
    id: 'bracha',
    hebrew: 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם בּוֹרֵא פְּרִי הַגָּפֶן',
    transliteration: 'Baruch Atah Adonai, Elokeinu Melech ha\'olam, borei pri hagafen',
    desc: 'Bracha over wine',
  },
  {
    id: 'modeh-ani',
    hebrew: 'מוֹדֶה אֲנִי לְפָנֶיךָ מֶלֶךְ חַי וְקַיָּם שֶׁהֶחֱזַרְתָּ בִּי נִשְׁמָתִי בְּחֶמְלָה רַבָּה אֱמוּנָתֶךָ',
    transliteration: 'Modeh ani l\'fanecha, Melech chai v\'kayam, she\'hechezarta bi nishmati, b\'chemla raba emunatecha',
    desc: 'Modeh Ani',
  },
  {
    id: 'shema',
    hebrew: 'שְׁמַע יִשְׂרָאֵל ה׳ אֱלֹקֵינוּ ה׳ אֶחָד',
    transliteration: 'Shma Yisrael, Adonai Elokeinu, Adonai Echad',
    desc: 'Shema',
  },
];

const outDir = path.resolve(__dirname, '../test-audio');
fs.mkdirSync(outDir, { recursive: true });

async function generateGoogle(text: string, fileName: string, speed: number, pitch: number) {
  if (!googleClient) {
    console.log(`  ⊘ Skipping Google (no API key): ${fileName}`);
    return;
  }
  const fixed = fixHashemForTTS(text);
  const [response] = await googleClient.synthesizeSpeech({
    input: { text: fixed },
    voice: { languageCode: 'he-IL', name: 'he-IL-Wavenet-D' },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: speed,
      pitch,
      effectsProfileId: ['headphone-class-device'],
    },
  });
  if (!response.audioContent) throw new Error('Empty');
  const buffer = typeof response.audioContent === 'string'
    ? Buffer.from(response.audioContent, 'base64')
    : Buffer.from(response.audioContent);
  fs.writeFileSync(path.join(outDir, fileName), buffer);
  console.log(`  ✓ ${fileName} (${buffer.length} bytes)`);
}

async function generateElevenLabs(text: string, fileName: string, voiceId: string, voiceName: string) {
  if (!elevenLabsApiKey) {
    console.log(`  ⊘ Skipping ElevenLabs (no API key): ${fileName}`);
    return;
  }
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_v3',
        voice_settings: { stability: 0.5, similarity_boost: 0.82, speed: 0.85 },
        apply_text_normalization: 'on',
        language_code: 'en',
      }),
    }
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs ${response.status}: ${err}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(path.join(outDir, fileName), buffer);
  console.log(`  ✓ ${fileName} — ${voiceName} (${buffer.length} bytes)`);
}

async function main() {
  console.log('\n=== Voice Comparison: Google Hebrew vs Rabbi Shafier ===\n');

  for (const test of TESTS) {
    console.log(`\n📖 ${test.desc}:`);

    // Google Cloud TTS — Hebrew with Adonai fix
    try {
      await generateGoogle(test.hebrew, `${test.id}_google-hebrew.mp3`, 0.85, -1);
    } catch (err) {
      console.error(`  ✗ Google: ${err instanceof Error ? err.message : err}`);
    }

    await new Promise(r => setTimeout(r, 300));

    // ElevenLabs — Rabbi Shafier reading transliteration
    try {
      await generateElevenLabs(
        test.transliteration,
        `${test.id}_rabbi-shafier.mp3`,
        'W1EJxHy9vl73xgPIKgpn', // Rabbi Shafier voice
        'Rabbi Shafier'
      );
    } catch (err) {
      console.error(`  ✗ Rabbi Shafier: ${err instanceof Error ? err.message : err}`);
    }

    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Files saved to: ${outDir}`);
  console.log(`\nCompare for each prayer:`);
  console.log(`  *_google-hebrew.mp3   — Google reading Hebrew text (Israeli accent)`);
  console.log(`  *_rabbi-shafier.mp3   — Rabbi Shafier reading transliteration (Young Israel feel)`);
  console.log(`${'='.repeat(50)}\n`);
}

main().catch(console.error);
