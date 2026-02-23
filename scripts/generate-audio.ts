/**
 * Pre-generate TTS audio for all prayer sections.
 *
 * Usage:
 *   STYLE=modern   npx tsx --tsconfig tsconfig.json scripts/generate-audio.ts
 *   STYLE=american  npx tsx --tsconfig tsconfig.json scripts/generate-audio.ts
 *
 * Environment:
 *   - GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_TTS_API_KEY (required for modern/Hebrew)
 *   - ELEVENLABS_API_KEY  (required for american/transliteration)
 *   - STYLE               pronunciation style: modern (default) | american
 *
 * File convention:
 *   modern   → {sectionId}.mp3           (Modern Israeli Hebrew — Google Cloud TTS)
 *   american → {sectionId}-american.mp3   (American Shul / Yeshivish — ElevenLabs)
 */

import * as fs from 'fs';
import * as path from 'path';
import textToSpeech from '@google-cloud/text-to-speech';

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
loadEnvFile(path.resolve(__dirname, '../.env'));

const STYLE_NAME = process.env.STYLE || 'modern';

// ── Style configuration ───────────────────────────────────────────────

interface StyleConfig {
  suffix: string;
  textField: 'hebrewText' | 'transliteration';
  engine: 'google' | 'elevenlabs';
  label: string;
}

const STYLE_CONFIG: Record<string, StyleConfig> = {
  modern: {
    suffix: '',
    textField: 'hebrewText',
    engine: 'google',
    label: 'Modern Israeli Hebrew (Google Cloud TTS)',
  },
  american: {
    suffix: '-american',
    textField: 'transliteration',
    engine: 'elevenlabs',
    label: 'American Shul / Yeshivish (ElevenLabs)',
  },
};

const styleConfig = STYLE_CONFIG[STYLE_NAME];
if (!styleConfig) {
  console.error(`Unknown STYLE="${STYLE_NAME}". Available: ${Object.keys(STYLE_CONFIG).join(', ')}`);
  process.exit(1);
}

// ── Google Cloud TTS ─────────────────────────────────────────────────

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

async function generateGoogleAudio(text: string): Promise<Buffer> {
  const client = getGoogleClient();
  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: 'he-IL',
      name: 'he-IL-Wavenet-B', // male
    },
    audioConfig: {
      audioEncoding: 'MP3' as const,
      speakingRate: 0.9,
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

// ── ElevenLabs TTS ───────────────────────────────────────────────────

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

async function generateElevenLabsAudio(text: string): Promise<Buffer> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('Missing ELEVENLABS_API_KEY');
  }
  const voiceId = process.env.ELEVENLABS_ENGLISH_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_v3',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.82,
          speed: 0.85,
        },
        apply_text_normalization: 'on',
        language_code: 'en',
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error ${response.status}: ${errorText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

// ── Unified generate ─────────────────────────────────────────────────

async function generateAudio(text: string): Promise<Buffer> {
  if (styleConfig.engine === 'google') {
    return generateGoogleAudio(text);
  }
  return generateElevenLabsAudio(text);
}

// ── Helpers ───────────────────────────────────────────────────────────

async function loadPrayers() {
  const prayersModule = await import('../src/lib/content/prayers');
  return prayersModule.PRAYERS;
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  // Validate required credentials
  if (styleConfig.engine === 'google') {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_TTS_API_KEY) {
      console.error('Missing Google Cloud credentials. Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_TTS_API_KEY');
      process.exit(1);
    }
  } else {
    if (!ELEVENLABS_API_KEY) {
      console.error('Missing ELEVENLABS_API_KEY in .env.local');
      process.exit(1);
    }
  }

  const prayers = await loadPrayers();
  const audioDir = path.resolve(__dirname, '../public/audio/prayers');

  console.log(`\nGenerating "${styleConfig.label}" audio (STYLE=${STYLE_NAME}) for ${prayers.length} prayers...\n`);

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const prayer of prayers) {
    const prayerDir = path.join(audioDir, prayer.id);
    fs.mkdirSync(prayerDir, { recursive: true });

    for (const section of prayer.sections) {
      const fileName = `${section.id}${styleConfig.suffix}.mp3`;
      const filePath = path.join(prayerDir, fileName);

      // Skip if already exists
      if (fs.existsSync(filePath)) {
        skipped++;
        continue;
      }

      const text = (section as Record<string, string>)[styleConfig.textField];

      if (!text) {
        console.log(`  ⚠ Skipping ${section.id} — no ${styleConfig.textField}`);
        skipped++;
        continue;
      }

      try {
        console.log(`  🔊 ${prayer.nameEnglish} > ${section.id}`);
        const audio = await generateAudio(text);
        fs.writeFileSync(filePath, audio);
        generated++;

        // Rate limit
        await new Promise((r) => setTimeout(r, styleConfig.engine === 'google' ? 200 : 500));
      } catch (err) {
        console.error(`  ✗ Error: ${err instanceof Error ? err.message : err}`);
        errors++;
      }
    }
  }

  console.log(`\nDone!`);
  console.log(`  Generated: ${generated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors: ${errors}`);
  console.log(`\nAudio files saved to: ${audioDir}`);
}

main().catch(console.error);
