/**
 * Audio-Text Verification Audit Script
 *
 * Transcribes each prayer section's MP3 audio using Google Cloud Speech-to-Text,
 * then compares the transcription against the expected Hebrew text to find mismatches.
 *
 * Usage:
 *   npx tsx scripts/audit-audio.ts
 *
 *   # Only audit a specific prayer:
 *   PRAYER=modeh-ani npx tsx scripts/audit-audio.ts
 *
 *   # Skip transcription, just check which audio files exist:
 *   CHECK_ONLY=true npx tsx scripts/audit-audio.ts
 *
 * Environment:
 *   GOOGLE_APPLICATION_CREDENTIALS  (path to service account JSON)
 *     OR GOOGLE_TTS_API_KEY         (simpler API key auth)
 *   PRAYER                          (optional — filter to one prayer ID)
 *   CHECK_ONLY                      (true to skip transcription, just check file existence)
 */

import * as fs from 'fs';
import * as path from 'path';
import speech from '@google-cloud/speech';

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

const CHECK_ONLY = process.env.CHECK_ONLY === 'true';
const PRAYER_FILTER = process.env.PRAYER || '';

// ── Strip nekudot (vowel points) for comparison ─────────────────────────

function stripNekudot(text: string): string {
  // Remove Hebrew vowel points (U+0591–U+05C7), cantillation marks, and maqaf
  return text.replace(/[\u0591-\u05C7]/g, '').trim();
}

function normalizeHebrew(text: string): string {
  return stripNekudot(text)
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    // Remove common punctuation that STT might omit
    .replace(/[׃:.,;!?()״"']/g, '')
    .trim();
}

// ── Similarity scoring ──────────────────────────────────────────────────

function wordOverlap(expected: string, actual: string): number {
  const expWords = expected.split(/\s+/).filter(Boolean);
  const actWords = actual.split(/\s+/).filter(Boolean);

  if (expWords.length === 0 && actWords.length === 0) return 1;
  if (expWords.length === 0 || actWords.length === 0) return 0;

  let matches = 0;
  const used = new Set<number>();

  for (const ew of expWords) {
    for (let j = 0; j < actWords.length; j++) {
      if (!used.has(j) && actWords[j] === ew) {
        matches++;
        used.add(j);
        break;
      }
    }
  }

  // Score based on the longer text (penalize both missing and extra words)
  return matches / Math.max(expWords.length, actWords.length);
}

// ── Google Cloud Speech-to-Text ─────────────────────────────────────────

let _speechClient: speech.SpeechClient | null = null;

function getSpeechClient(): speech.SpeechClient {
  if (!_speechClient) {
    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (apiKey) {
      _speechClient = new speech.SpeechClient({ apiKey });
    } else {
      _speechClient = new speech.SpeechClient();
    }
  }
  return _speechClient;
}

async function transcribeAudio(filePath: string): Promise<string> {
  const client = getSpeechClient();
  const audioBytes = fs.readFileSync(filePath);
  const audio = { content: audioBytes.toString('base64') };

  const config: speech.protos.google.cloud.speech.v1.IRecognitionConfig = {
    encoding: 'MP3' as const,
    sampleRateHertz: 24000,
    languageCode: 'he-IL',
    enableAutomaticPunctuation: false,
    model: 'default',
  };

  const [response] = await client.recognize({ audio, config });
  const transcription = response.results
    ?.map((r) => r.alternatives?.[0]?.transcript || '')
    .join(' ')
    .trim();

  return transcription || '';
}

// ── Main ────────────────────────────────────────────────────────────────

interface AuditResult {
  prayerId: string;
  sectionId: string;
  status: 'MATCH' | 'PARTIAL' | 'MISMATCH' | 'NO_AUDIO' | 'ERROR';
  similarity?: number;
  expectedPreview?: string;
  transcribedPreview?: string;
  error?: string;
}

async function main() {
  // Dynamically import prayer data (uses relative path since scripts/ is excluded from tsconfig)
  const { PRAYERS } = await import('../src/lib/content/prayers');
  const audioBase = path.resolve(__dirname, '../public/audio/prayers');

  console.log('='.repeat(70));
  console.log('  AUDIO-TEXT VERIFICATION AUDIT');
  console.log('='.repeat(70));
  console.log(`  Mode: ${CHECK_ONLY ? 'File check only' : 'Full transcription comparison'}`);
  if (PRAYER_FILTER) console.log(`  Filter: ${PRAYER_FILTER}`);
  console.log('');

  if (!CHECK_ONLY) {
    const hasCreds = !!(process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_TTS_API_KEY);
    if (!hasCreds) {
      console.error('ERROR: Google Cloud credentials required for transcription.');
      console.error('Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_TTS_API_KEY in .env.local');
      console.error('Or run with CHECK_ONLY=true to just check file existence.');
      process.exit(1);
    }
  }

  const results: AuditResult[] = [];
  let totalSections = 0;
  let audioFound = 0;
  let audioMissing = 0;

  const prayers = PRAYER_FILTER
    ? PRAYERS.filter((p: { id: string }) => p.id === PRAYER_FILTER)
    : PRAYERS;

  if (prayers.length === 0) {
    console.error(`No prayers found${PRAYER_FILTER ? ` matching "${PRAYER_FILTER}"` : ''}`);
    process.exit(1);
  }

  for (const prayer of prayers) {
    console.log(`\n--- ${prayer.nameEnglish} (${prayer.id}) ---`);

    for (const section of prayer.sections) {
      totalSections++;
      const audioPath = path.join(audioBase, prayer.id, `${section.id}.mp3`);
      const hasAudio = fs.existsSync(audioPath);

      if (!hasAudio) {
        audioMissing++;
        results.push({
          prayerId: prayer.id,
          sectionId: section.id,
          status: 'NO_AUDIO',
        });
        console.log(`  [NO_AUDIO] ${section.id}`);
        continue;
      }

      audioFound++;

      if (CHECK_ONLY) {
        console.log(`  [EXISTS]   ${section.id}`);
        continue;
      }

      // Transcribe and compare
      try {
        const transcription = await transcribeAudio(audioPath);
        const normalizedExpected = normalizeHebrew(section.hebrewText);
        const normalizedActual = normalizeHebrew(transcription);

        const similarity = wordOverlap(normalizedExpected, normalizedActual);

        let status: AuditResult['status'];
        if (similarity >= 0.85) {
          status = 'MATCH';
        } else if (similarity >= 0.5) {
          status = 'PARTIAL';
        } else {
          status = 'MISMATCH';
        }

        const result: AuditResult = {
          prayerId: prayer.id,
          sectionId: section.id,
          status,
          similarity: Math.round(similarity * 100),
          expectedPreview: normalizedExpected.slice(0, 60),
          transcribedPreview: normalizedActual.slice(0, 60),
        };
        results.push(result);

        const icon = status === 'MATCH' ? 'OK' : status === 'PARTIAL' ? '~~' : 'XX';
        console.log(`  [${icon} ${result.similarity}%] ${section.id}`);

        if (status !== 'MATCH') {
          console.log(`    Expected:    ${result.expectedPreview}...`);
          console.log(`    Transcribed: ${result.transcribedPreview || '(empty)'}...`);
        }

        // Rate limit
        await new Promise((r) => setTimeout(r, 300));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push({
          prayerId: prayer.id,
          sectionId: section.id,
          status: 'ERROR',
          error: msg,
        });
        console.log(`  [ERROR]    ${section.id} — ${msg}`);
      }
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(70));
  console.log('  SUMMARY');
  console.log('='.repeat(70));
  console.log(`  Total sections:  ${totalSections}`);
  console.log(`  Audio found:     ${audioFound}`);
  console.log(`  Audio missing:   ${audioMissing}`);

  if (!CHECK_ONLY) {
    const matches = results.filter((r) => r.status === 'MATCH').length;
    const partials = results.filter((r) => r.status === 'PARTIAL').length;
    const mismatches = results.filter((r) => r.status === 'MISMATCH').length;
    const errors = results.filter((r) => r.status === 'ERROR').length;

    console.log(`  Matches:         ${matches}`);
    console.log(`  Partial:         ${partials}`);
    console.log(`  Mismatches:      ${mismatches}`);
    console.log(`  Errors:          ${errors}`);

    if (mismatches > 0 || partials > 0) {
      console.log('\n  SECTIONS NEEDING ATTENTION:');
      for (const r of results) {
        if (r.status === 'MISMATCH' || r.status === 'PARTIAL') {
          console.log(`    ${r.status.padEnd(8)} ${r.prayerId}/${r.sectionId} (${r.similarity}%)`);
          if (r.expectedPreview) console.log(`             Expected:    ${r.expectedPreview}`);
          if (r.transcribedPreview) console.log(`             Transcribed: ${r.transcribedPreview}`);
        }
      }
    }
  }

  // ── Write JSON report ─────────────────────────────────────────────────
  const reportPath = path.resolve(__dirname, '../audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n  Full report saved to: ${reportPath}`);
  console.log('');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
