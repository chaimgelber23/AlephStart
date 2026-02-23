/**
 * Test Chatterbox Multilingual voice cloning with SiddurAudio recordings.
 * Clones Rabbi Zimmerman's voice and generates Hebrew test samples via Replicate API.
 *
 * Usage: npx tsx scripts/test-chatterbox.ts
 */

import * as fs from 'fs';
import * as path from 'path';

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

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
if (!REPLICATE_API_TOKEN) {
  console.error('Missing REPLICATE_API_TOKEN. Set it in .env.local or as env var.');
  process.exit(1);
}

// Reference audio — Rabbi Zimmerman from SiddurAudio
const REFERENCE_AUDIO = path.resolve(
  'C:/Users/chaim/AlephDavening/public/audio/prayers',
  'birchos-hashachar', 'birchos-hashachar-sidduraudio.mp3'
);

if (!fs.existsSync(REFERENCE_AUDIO)) {
  console.error(`Reference audio not found: ${REFERENCE_AUDIO}`);
  process.exit(1);
}

// Test texts — Hebrew with nekudot
const TESTS = [
  { id: 'bracha', text: 'בָּרוּךְ אַתָּה אֲדֹנָי אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם בּוֹרֵא פְּרִי הַגָּפֶן' },
  { id: 'modeh-ani', text: 'מוֹדֶה אֲנִי לְפָנֶיךָ מֶלֶךְ חַי וְקַיָּם שֶׁהֶחֱזַרְתָּ בִּי נִשְׁמָתִי בְּחֶמְלָה רַבָּה אֱמוּנָתֶךָ' },
  { id: 'shema', text: 'שְׁמַע יִשְׂרָאֵל אֲדֹנָי אֱלֹקֵינוּ אֲדֹנָי אֶחָד' },
  { id: 'aleph', text: 'אָלֶף' },
  { id: 'shin', text: 'שִׁין' },
];

const outDir = path.resolve(__dirname, '../test-audio');
fs.mkdirSync(outDir, { recursive: true });

// Convert file to base64 data URI for Replicate
function fileToDataURI(filePath: string, mimeType: string): string {
  const data = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${data.toString('base64')}`;
}

// Call Replicate API to create a prediction and wait for result
async function runReplicate(text: string, audioPromptURI: string): Promise<string> {
  // Create prediction using the models endpoint (no version hash needed)
  const createResp = await fetch('https://api.replicate.com/v1/models/resemble-ai/chatterbox-multilingual/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Prefer': 'wait',
    },
    body: JSON.stringify({
      input: {
        text,
        language: 'he',
        audio_prompt: audioPromptURI,
        exaggeration: 0.3,
        temperature: 0.6,
      },
    }),
  });

  if (!createResp.ok) {
    const err = await createResp.text();
    throw new Error(`Replicate create failed (${createResp.status}): ${err}`);
  }

  let prediction = await createResp.json() as { id: string; status: string; output: string | null; error: string | null; urls: { get: string } };

  // Poll for completion
  while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && prediction.status !== 'canceled') {
    await new Promise(r => setTimeout(r, 2000));

    const pollResp = await fetch(prediction.urls.get, {
      headers: { 'Authorization': `Bearer ${REPLICATE_API_TOKEN}` },
    });
    if (!pollResp.ok) {
      throw new Error(`Replicate poll failed (${pollResp.status})`);
    }
    prediction = await pollResp.json() as typeof prediction;
    process.stdout.write('.');
  }

  if (prediction.status === 'failed') {
    throw new Error(`Replicate prediction failed: ${prediction.error}`);
  }

  if (!prediction.output) {
    throw new Error('Replicate returned no output');
  }

  return prediction.output;
}

async function main() {
  console.log('\n=== Chatterbox Voice Cloning Test ===');
  console.log(`Reference: ${path.basename(REFERENCE_AUDIO)}`);
  console.log(`Output: ${outDir}\n`);

  // Encode reference audio as data URI (Replicate accepts this)
  console.log('Encoding reference audio...');
  const audioDataURI = fileToDataURI(REFERENCE_AUDIO, 'audio/mpeg');
  console.log(`Reference audio encoded (${(audioDataURI.length / 1024).toFixed(0)} KB base64)\n`);

  for (let i = 0; i < TESTS.length; i++) {
    const test = TESTS[i];
    const outPath = path.join(outDir, `${test.id}_chatterbox.wav`);
    process.stdout.write(`  [${test.id}] ${test.text} `);

    // Rate limit: wait between requests
    if (i > 0) await new Promise(r => setTimeout(r, 12000));

    try {
      const outputUrl = await runReplicate(test.text, audioDataURI);

      // Download the generated audio
      const audioResp = await fetch(outputUrl);
      if (!audioResp.ok) throw new Error(`Download failed: ${audioResp.status}`);
      const buffer = Buffer.from(await audioResp.arrayBuffer());
      fs.writeFileSync(outPath, buffer);
      console.log(`\n  -> Saved: ${outPath} (${buffer.length} bytes)`);
    } catch (err) {
      console.log(`\n  -> Error: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`\nDone! Listen to the files in: ${outDir}`);
  console.log('Files ending in _chatterbox.wav are the cloned voice samples.\n');
}

main().catch(console.error);
