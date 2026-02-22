/**
 * Generate TTS audio for Hebrew vowel (nekudot) pronunciations.
 *
 * Mirrors the letter audio system — generates both "name" and "sound" clips
 * in modern and american styles.
 *
 * Usage:
 *   STYLE=modern   npx tsx --tsconfig tsconfig.json scripts/generate-vowel-audio.ts
 *   STYLE=american  npx tsx --tsconfig tsconfig.json scripts/generate-vowel-audio.ts
 *
 * Files produced per vowel:
 *   {id}.mp3              — name (modern, male)
 *   {id}-american.mp3     — name (american, male)
 *   {id}-sound.mp3        — pure sound (modern, male)
 *   {id}-sound-american.mp3 — pure sound (american, male)
 *
 * Female variants (already present) follow the same pattern with -female suffix.
 */

import * as fs from 'fs';
import * as path from 'path';

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('Missing ELEVENLABS_API_KEY');
  process.exit(1);
}

const STYLE = process.env.STYLE || 'modern';
const VOICE_ID = process.env.ELEVENLABS_ENGLISH_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

// "Name" clips — vowel name + description of the sound
const VOWEL_NAME_SCRIPTS: Record<string, string> = {
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

// "Sound" clips — just the pure vowel sound, drawn out
const VOWEL_SOUND_SCRIPTS: Record<string, string> = {
  patach: 'ahhh',
  kamatz: 'ahhh',
  segol: 'ehh',
  tzere: 'ehh',
  chirik: 'eee',
  cholam: 'ohh',
  cholam_vav: 'ohh',
  kubutz: 'ooo',
  shuruk: 'ooo',
  shva: 'uh',
  chataf_patach: 'ah',
  chataf_segol: 'eh',
  chataf_kamatz: 'oh',
};

async function generateAudio(text: string, speed = 0.8): Promise<Buffer> {
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
          speed,
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

  const nameSuffix = STYLE === 'american' ? '-american' : '';
  const soundSuffix = STYLE === 'american' ? '-sound-american' : '-sound';

  const vowelIds = Object.keys(VOWEL_NAME_SCRIPTS);
  console.log(`\nGenerating ${STYLE} vowel audio for ${vowelIds.length} vowels (name + sound)...\n`);

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const id of vowelIds) {
    // --- Name clip ---
    const nameFile = `${id}${nameSuffix}.mp3`;
    const namePath = path.join(audioDir, nameFile);

    if (fs.existsSync(namePath)) {
      console.log(`  - ${nameFile} — exists, skipping`);
      skipped++;
    } else {
      const text = VOWEL_NAME_SCRIPTS[id];
      try {
        console.log(`  + ${nameFile} — "${text}"`);
        const audio = await generateAudio(text, 0.8);
        fs.writeFileSync(namePath, audio);
        generated++;
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.error(`  x Error: ${err instanceof Error ? err.message : err}`);
        errors++;
      }
    }

    // --- Sound clip ---
    const soundFile = `${id}${soundSuffix}.mp3`;
    const soundPath = path.join(audioDir, soundFile);

    if (fs.existsSync(soundPath)) {
      console.log(`  - ${soundFile} — exists, skipping`);
      skipped++;
    } else {
      const text = VOWEL_SOUND_SCRIPTS[id];
      try {
        console.log(`  + ${soundFile} — "${text}"`);
        const audio = await generateAudio(text, 0.7); // Extra slow for isolated sounds
        fs.writeFileSync(soundPath, audio);
        generated++;
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.error(`  x Error: ${err instanceof Error ? err.message : err}`);
        errors++;
      }
    }
  }

  console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped}, Errors: ${errors}`);
  console.log(`Files saved to: ${audioDir}`);
}

main().catch(console.error);
