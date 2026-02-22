/**
 * Generate TTS audio for Hebrew vowel (nekudot) pronunciations.
 *
 * Usage:
 *   npx tsx --tsconfig tsconfig.json scripts/generate-vowel-audio.ts
 *
 * For each vowel, generates a clip: "Vowel name. Sound description."
 * e.g. "Patach. AH, like father."
 *
 * Files saved to: public/audio/vowels/{id}.mp3
 */

import * as fs from 'fs';
import * as path from 'path';

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('Missing ELEVENLABS_API_KEY');
  process.exit(1);
}

const VOICE_ID = process.env.ELEVENLABS_ENGLISH_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

// What to say for each vowel
const VOWEL_SCRIPTS: Record<string, string> = {
  patach: 'Patach. AH, like father.',
  kamatz: 'Kamatz. AH, like father.',
  segol: 'Segol. EH, like bed.',
  tzere: 'Tzere. EH, like they.',
  chirik: 'Chirik. EE, like see.',
  cholam: 'Cholam. OH, like go.',
  cholam_vav: 'Cholam Vav. OH, like go.',
  kubutz: 'Kubutz. OO, like blue.',
  shuruk: 'Shuruk. OO, like blue.',
  shva: 'Shva. Usually silent, sometimes a quick uh.',
  chataf_patach: 'Chataf Patach. A quick AH.',
  chataf_segol: 'Chataf Segol. A quick EH.',
  chataf_kamatz: 'Chataf Kamatz. A quick OH.',
};

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
          speed: 0.8,
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
  const audioDir = path.resolve(__dirname, '../public/audio/vowels');
  fs.mkdirSync(audioDir, { recursive: true });

  const vowelIds = Object.keys(VOWEL_SCRIPTS);
  console.log(`\nGenerating vowel audio for ${vowelIds.length} vowels...\n`);

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const id of vowelIds) {
    const fileName = `${id}.mp3`;
    const filePath = path.join(audioDir, fileName);

    if (fs.existsSync(filePath)) {
      console.log(`  - ${id} — already exists, skipping`);
      skipped++;
      continue;
    }

    const text = VOWEL_SCRIPTS[id];
    try {
      console.log(`  + ${id} — "${text}"`);
      const audio = await generateAudio(text);
      fs.writeFileSync(filePath, audio);
      generated++;
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`  x Error for ${id}: ${err instanceof Error ? err.message : err}`);
      errors++;
    }
  }

  console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped}, Errors: ${errors}`);
  console.log(`Files saved to: ${audioDir}`);
}

main().catch(console.error);
