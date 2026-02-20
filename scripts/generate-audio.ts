/**
 * Pre-generate TTS audio for all prayer sections.
 *
 * Usage:
 *   STYLE=modern   npx tsx --tsconfig tsconfig.json scripts/generate-audio.ts
 *   STYLE=american  npx tsx --tsconfig tsconfig.json scripts/generate-audio.ts
 *
 * Environment:
 *   - ELEVENLABS_API_KEY  (required)
 *   - STYLE               pronunciation style: modern (default) | american | <future>
 *
 * File convention:
 *   modern   → {sectionId}.mp3           (Modern Israeli Hebrew)
 *   american → {sectionId}-american.mp3   (American Shul / Yeshivish)
 *   <new>    → {sectionId}-{style}.mp3    (add to STYLE_CONFIG below)
 *
 * To add a new pronunciation style:
 *   1. Add an entry to STYLE_CONFIG below
 *   2. Add the style name to the Pronunciation type in src/types/index.ts
 *   3. Add the suffix to PRONUNCIATION_SUFFIX in src/hooks/useAudio.ts
 *   4. Run:  STYLE=<name> npx tsx --tsconfig tsconfig.json scripts/generate-audio.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('Missing ELEVENLABS_API_KEY in .env.local');
  process.exit(1);
}

// ── Style configuration ───────────────────────────────────────────────
// Each style defines: which text field to send, which voice to use,
// and what file suffix to use. Add new styles here.

interface StyleConfig {
  /** File suffix: '' for default, '-american', '-sephardi', etc. */
  suffix: string;
  /** Which section field to read: 'hebrewText' or 'transliteration' */
  textField: 'hebrewText' | 'transliteration';
  /** ElevenLabs voice ID */
  voiceId: string;
  /** Human-readable label for console output */
  label: string;
}

const STYLE_CONFIG: Record<string, StyleConfig> = {
  modern: {
    suffix: '',
    textField: 'hebrewText',
    voiceId: process.env.ELEVENLABS_HEBREW_VOICE_ID || 'XB0fDUnXU5powFXDhCwa',
    label: 'Modern Israeli Hebrew',
  },
  american: {
    suffix: '-american',
    textField: 'transliteration',
    voiceId: process.env.ELEVENLABS_ENGLISH_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL',
    label: 'American Shul (Yeshivish)',
  },
  // To add more styles, e.g.:
  // sephardi: {
  //   suffix: '-sephardi',
  //   textField: 'hebrewText',
  //   voiceId: 'SOME_VOICE_ID',
  //   label: 'Sephardi',
  // },
};

const STYLE_NAME = process.env.STYLE || 'modern';
const styleConfig = STYLE_CONFIG[STYLE_NAME];
if (!styleConfig) {
  console.error(`Unknown STYLE="${STYLE_NAME}". Available: ${Object.keys(STYLE_CONFIG).join(', ')}`);
  process.exit(1);
}

// ── Helpers ───────────────────────────────────────────────────────────

async function loadPrayers() {
  const prayersModule = await import('../src/lib/content/prayers');
  return prayersModule.PRAYERS;
}

async function generateAudio(text: string, voiceId: string): Promise<Buffer> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY!,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
          speed: 0.9,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error ${response.status}: ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
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
        const audio = await generateAudio(text, styleConfig.voiceId);
        fs.writeFileSync(filePath, audio);
        generated++;

        // Rate limit: ElevenLabs allows ~2-3 requests/sec on free tier
        await new Promise((r) => setTimeout(r, 500));
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
