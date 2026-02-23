/**
 * Single test of Chatterbox Multilingual voice cloning via Replicate API.
 * Usage: npx tsx scripts/test-chatterbox-single.ts
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
  console.error('Missing REPLICATE_API_TOKEN');
  process.exit(1);
}

const REFERENCE_AUDIO = path.resolve(
  'C:/Users/chaim/AlephDavening/public/audio/prayers',
  'birchos-hashachar', 'birchos-hashachar-sidduraudio.mp3'
);

if (!fs.existsSync(REFERENCE_AUDIO)) {
  console.error(`Reference audio not found: ${REFERENCE_AUDIO}`);
  process.exit(1);
}

const outDir = path.resolve(__dirname, '../test-audio');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const text = 'שְׁמַע יִשְׂרָאֵל אֲדֹנָי אֱלֹקֵינוּ אֲדֹנָי אֶחָד';
  const outPath = path.join(outDir, 'shema_chatterbox.wav');

  console.log('\n=== Single Chatterbox Test ===');
  console.log(`Text: ${text}`);
  console.log('Encoding reference audio...');

  const audioData = fs.readFileSync(REFERENCE_AUDIO);
  const audioDataURI = `data:audio/mpeg;base64,${audioData.toString('base64')}`;
  console.log(`Encoded (${(audioDataURI.length / 1024).toFixed(0)} KB)`);

  console.log('\nSending to Replicate API...');
  const CHATTERBOX_VERSION = '9cfba4c265e685f840612be835424f8c33bdee685d7466ece7684b0d9d4c0b1c';
  const createResp = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: CHATTERBOX_VERSION,
      input: {
        text,
        language: 'he',
        reference_audio: audioDataURI,
        exaggeration: 0.5,
        temperature: 0.8,
        cfg_weight: 0.5,
      },
    }),
  });

  if (!createResp.ok) {
    const err = await createResp.text();
    console.error(`Create failed (${createResp.status}): ${err}`);
    process.exit(1);
  }

  let prediction = await createResp.json() as {
    id: string; status: string; output: string | null;
    error: string | null; urls: { get: string };
  };

  console.log(`Prediction created: ${prediction.id} (status: ${prediction.status})`);

  // Poll for completion
  while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && prediction.status !== 'canceled') {
    await new Promise(r => setTimeout(r, 3000));
    const pollResp = await fetch(prediction.urls.get, {
      headers: { 'Authorization': `Bearer ${REPLICATE_API_TOKEN}` },
    });
    prediction = await pollResp.json() as typeof prediction;
    process.stdout.write(`.${prediction.status}`);
  }

  console.log(`\nFinal status: ${prediction.status}`);

  if (prediction.status === 'failed') {
    console.error(`Error: ${prediction.error}`);
    process.exit(1);
  }

  if (!prediction.output) {
    console.error('No output returned');
    process.exit(1);
  }

  console.log(`Output URL: ${prediction.output}`);

  // Download
  const audioResp = await fetch(prediction.output);
  if (!audioResp.ok) {
    console.error(`Download failed: ${audioResp.status}`);
    process.exit(1);
  }
  const buffer = Buffer.from(await audioResp.arrayBuffer());
  fs.writeFileSync(outPath, buffer);
  console.log(`Saved: ${outPath} (${buffer.length} bytes)`);
  console.log('\nDone! Listen to the file to evaluate the voice cloning quality.\n');
}

main().catch(console.error);
