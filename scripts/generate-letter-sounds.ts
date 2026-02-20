/**
 * Generate TTS audio for Hebrew letter SOUNDS (phonetic only).
 *
 * This generates the pure sound each letter makes (e.g., "shh" for Shin, "buh" for Bet).
 * Separate from the letter name audio.
 *
 * Files: public/audio/letters/{id}-sound.mp3, {id}-sound-american.mp3
 */

import * as fs from 'fs';
import * as path from 'path';

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('Missing ELEVENLABS_API_KEY');
  process.exit(1);
}

const STYLE = process.env.STYLE || 'modern';
const suffix = STYLE === 'american' ? '-sound-american' : '-sound';
const VOICE_ID = process.env.ELEVENLABS_ENGLISH_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

// Phonetic sounds — how each letter actually sounds when spoken
const LETTER_SOUNDS: Record<string, string> = {
  shin: 'shh',
  lamed: 'lll',
  aleph: '...', // silent — we'll use a description
  mem: 'mmm',
  ayin: '...', // silent/guttural
  tav: 'tuh',
  yud: 'yuh',
  vav: 'vvv',
  samech: 'sss',
  nun: 'nnn',
  gimel: 'guh',
  kuf: 'kuh',
  bet: 'buh',
  vet: 'vvv',
  kaf: 'kuh',
  chaf: 'chhh',
  dalet: 'duh',
  resh: 'rrr',
  hei: 'hah',
  chet: 'chhh',
  tet: 'tuh',
  pei: 'puh',
  fei: 'fff',
  tzadi: 'tsss',
  zayin: 'zzz',
  sin: 'sss',
  chaf_sofit: 'chhh',
  mem_sofit: 'mmm',
  nun_sofit: 'nnn',
  fei_sofit: 'fff',
  tzadi_sofit: 'tsss',
};

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
          stability: 0.9,
          similarity_boost: 0.8,
          speed: 0.7, // Extra slow for isolated sounds
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

  console.log(`\nGenerating ${STYLE} letter sounds for ${letters.length} letters...\n`);

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

    const sound = LETTER_SOUNDS[letter.id];
    if (!sound || sound === '...') {
      // Silent letters — generate "This letter is silent"
      const text = `${letter.name} is silent. It carries the vowel sound.`;
      try {
        console.log(`  🔇 ${letter.name} — silent`);
        const audio = await generateAudio(text);
        fs.writeFileSync(filePath, audio);
        generated++;
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.error(`  ✗ Error: ${err instanceof Error ? err.message : err}`);
        errors++;
      }
      continue;
    }

    // For non-silent letters, say the sound drawn out
    const text = `${sound}`;
    try {
      console.log(`  🔊 ${letter.name} — "${sound}"`);
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
}

main().catch(console.error);
