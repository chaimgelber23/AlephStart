/**
 * Fix Audio — Regenerate all mismatched prayer audio files.
 *
 * Reads the audit-report.json and regenerates any file with similarity < 85%
 * using Google Cloud TTS with the correct Hebrew text from prayer data.
 *
 * Usage:
 *   npx tsx scripts/fix-audio.ts
 *
 *   # Dry run (just show what would be regenerated):
 *   DRY_RUN=true npx tsx scripts/fix-audio.ts
 *
 *   # Only fix a specific prayer:
 *   PRAYER=modeh-ani npx tsx scripts/fix-audio.ts
 *
 *   # Set threshold (default 85):
 *   THRESHOLD=50 npx tsx scripts/fix-audio.ts
 *
 * Environment:
 *   GOOGLE_APPLICATION_CREDENTIALS  (path to service account JSON)
 *     OR GOOGLE_TTS_API_KEY         (simpler API key auth)
 */

import * as fs from 'fs';
import * as path from 'path';
import textToSpeech from '@google-cloud/text-to-speech';

// ── Load env ────────────────────────────────────────────────────────────

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

const DRY_RUN = process.env.DRY_RUN === 'true';
const PRAYER_FILTER = process.env.PRAYER || '';
const THRESHOLD = parseInt(process.env.THRESHOLD || '85', 10);

// ── Google Cloud TTS ────────────────────────────────────────────────────

const VOICE_NAME = 'he-IL-Wavenet-B'; // Male modern Hebrew

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

async function generateHebrewAudio(text: string): Promise<Buffer> {
  const client = getGoogleClient();

  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: 'he-IL',
      name: VOICE_NAME,
    },
    audioConfig: {
      audioEncoding: 'MP3' as const,
      speakingRate: 0.90,
      pitch: 0,
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

// ── Main ────────────────────────────────────────────────────────────────

interface AuditResult {
  prayerId: string;
  sectionId: string;
  status: string;
  similarity?: number;
}

async function main() {
  const hasCreds = !!(process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_TTS_API_KEY);
  if (!hasCreds && !DRY_RUN) {
    console.error('ERROR: Google Cloud credentials required.');
    console.error('Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_TTS_API_KEY in .env.local');
    process.exit(1);
  }

  // Load audit report
  const reportPath = path.resolve(__dirname, '../audit-report.json');
  if (!fs.existsSync(reportPath)) {
    console.error('ERROR: audit-report.json not found. Run audit-audio.ts first.');
    process.exit(1);
  }
  const report: AuditResult[] = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

  // Load prayer data
  const { PRAYERS } = await import('../src/lib/content/prayers');
  const audioBase = path.resolve(__dirname, '../public/audio/prayers');

  // Build lookup for Hebrew text
  const textLookup = new Map<string, string>();
  for (const prayer of PRAYERS) {
    for (const section of prayer.sections) {
      textLookup.set(`${prayer.id}/${section.id}`, section.hebrewText);
    }
  }

  // Find files needing regeneration
  let toFix = report.filter((r) => {
    if (r.status === 'NO_AUDIO') return false;
    const sim = r.similarity ?? 0;
    return sim < THRESHOLD;
  });

  if (PRAYER_FILTER) {
    toFix = toFix.filter((r) => r.prayerId === PRAYER_FILTER);
  }

  console.log('='.repeat(60));
  console.log('  AUDIO FIX — Regenerate Mismatched Files');
  console.log('='.repeat(60));
  console.log(`  Mode: ${DRY_RUN ? 'DRY RUN (no files will be changed)' : 'LIVE — regenerating files'}`);
  console.log(`  Threshold: ${THRESHOLD}% (regenerating files below this)`);
  console.log(`  Files to fix: ${toFix.length}`);
  if (PRAYER_FILTER) console.log(`  Filter: ${PRAYER_FILTER}`);
  console.log('');

  let regenerated = 0;
  let errors = 0;

  for (const entry of toFix) {
    const key = `${entry.prayerId}/${entry.sectionId}`;
    const hebrewText = textLookup.get(key);

    if (!hebrewText) {
      console.log(`  [SKIP] ${key} — no Hebrew text found in prayer data`);
      continue;
    }

    const audioPath = path.join(audioBase, entry.prayerId, `${entry.sectionId}.mp3`);
    const sim = entry.similarity ?? 0;

    if (DRY_RUN) {
      console.log(`  [WOULD FIX] ${key} (${sim}%) — "${hebrewText.slice(0, 50)}..."`);
      regenerated++;
      continue;
    }

    try {
      console.log(`  [FIX] ${key} (${sim}%) — regenerating...`);
      const audio = await generateHebrewAudio(hebrewText);

      // Back up original
      const backupPath = audioPath + '.bak';
      if (fs.existsSync(audioPath)) {
        fs.copyFileSync(audioPath, backupPath);
      }

      // Write new audio
      fs.mkdirSync(path.dirname(audioPath), { recursive: true });
      fs.writeFileSync(audioPath, audio);
      regenerated++;

      // Rate limit
      await new Promise((r) => setTimeout(r, 250));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`  [ERROR] ${key} — ${msg}`);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('  RESULTS');
  console.log('='.repeat(60));
  console.log(`  ${DRY_RUN ? 'Would regenerate' : 'Regenerated'}: ${regenerated}`);
  console.log(`  Errors: ${errors}`);
  if (!DRY_RUN && regenerated > 0) {
    console.log(`\n  Backups saved as .bak files next to originals.`);
    console.log(`  Run audit-audio.ts again to verify the fixes.`);
  }
  console.log('');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
