/**
 * Generate TTS audio for Hebrew letter pronunciations.
 *
 * Usage:
 *   STYLE=modern   npx tsx --tsconfig tsconfig.json scripts/generate-letter-audio.ts
 *   STYLE=american  npx tsx --tsconfig tsconfig.json scripts/generate-letter-audio.ts
 *
 * For each letter, generates a short clip: "Letter name. Sound."
 * e.g. "Shin. Sh." or "Aleph. Silent."
 *
 * Files saved to: public/audio/letters/{id}.mp3 or {id}-american.mp3
 */

import * as fs from 'fs';
import * as path from 'path';

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('Missing ELEVENLABS_API_KEY');
  process.exit(1);
}

const STYLE = process.env.STYLE || 'modern';
const suffix = STYLE === 'american' ? '-american' : '';

// Use a clear English voice for letter names/sounds
const VOICE_ID = process.env.ELEVENLABS_ENGLISH_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

async function loadLetters() {
  const mod = await import('../src/lib/content/letters');
  return mod.LETTERS;
}

async function generateAudio(text: string): Promise<Buffer> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
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
          stability: 0.85,
          similarity_boost: 0.75,
          speed: 0.8, // Slow and clear for learning
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error ${response.status}: ${errorText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  const letters = await loadLetters();
  const audioDir = path.resolve(__dirname, '../public/audio/letters');
  fs.mkdirSync(audioDir, { recursive: true });

  console.log(`\nGenerating ${STYLE} letter audio for ${letters.length} letters...\n`);

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const letter of letters) {
    const fileName = `${letter.id}${suffix}.mp3`;
    const filePath = path.join(audioDir, fileName);

    if (fs.existsSync(filePath)) {
      skipped++;
      continue;
    }

    // Build pronunciation text
    const soundText = letter.sound === '(silent)' ? 'Silent.' : `${letter.sound}.`;
    const text = `${letter.name}. ${soundText}`;

    try {
      console.log(`  🔤 ${letter.name} (${letter.hebrew}) — "${text}"`);
      const audio = await generateAudio(text);
      fs.writeFileSync(filePath, audio);
      generated++;
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`  ✗ Error: ${err instanceof Error ? err.message : err}`);
      errors++;
    }
  }

  console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped}, Errors: ${errors}`);
  console.log(`Files saved to: ${audioDir}`);
}

main().catch(console.error);
