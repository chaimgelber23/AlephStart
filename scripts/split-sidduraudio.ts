/**
 * Split SiddurAudio prayer recordings into per-section audio files.
 *
 * Uses Google Cloud Speech-to-Text to get word timestamps, then matches
 * against section boundaries from prayers.ts, and splits with ffmpeg.
 *
 * Usage:
 *   npx tsx scripts/split-sidduraudio.ts                    # all prayers
 *   npx tsx scripts/split-sidduraudio.ts modeh-ani          # one prayer
 *   npx tsx scripts/split-sidduraudio.ts modeh-ani --dry-run # just show timestamps
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { PRAYERS } from '../src/lib/content/prayers';

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

const GOOGLE_API_KEY = process.env.GOOGLE_TTS_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error('Missing GOOGLE_TTS_API_KEY in .env.local');
  process.exit(1);
}

const FFMPEG = 'C:/Users/chaim/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.0.1-full_build/bin/ffmpeg.exe';
const PRAYER_AUDIO_DIR = 'C:/Users/chaim/AlephDavening/public/audio/prayers';
const OUTPUT_DIR = path.resolve(__dirname, '../public/audio/prayers');

// Audio source priority: Chabad recordings are clean prayer-only audio (no English narration).
// SiddurAudio files have English narration interspersed, so they can't be auto-split.
function findAudioSource(prayerSlug: string): string | null {
  // Prefer Chabad (clean Hebrew only)
  const chabadPath = path.join(PRAYER_AUDIO_DIR, prayerSlug, `${prayerSlug}-chabad.mp3`);
  if (fs.existsSync(chabadPath)) return chabadPath;

  // Fallback to SiddurAudio (has English narration — less reliable for splitting)
  const siddurPath = path.join(PRAYER_AUDIO_DIR, prayerSlug, `${prayerSlug}-sidduraudio.mp3`);
  if (fs.existsSync(siddurPath)) return siddurPath;

  return null;
}

// Strip nikud (vowel marks) for fuzzy matching
function stripNikud(text: string): string {
  // Remove Hebrew diacritics (nikud range U+0591-U+05C7)
  return text.replace(/[\u0591-\u05C7]/g, '').replace(/\s+/g, ' ').trim();
}

// Get word timestamps from Google Cloud Speech-to-Text
async function transcribeWithTimestamps(audioPath: string): Promise<{
  words: { word: string; startTime: number; endTime: number }[];
  transcript: string;
}> {
  // Convert MP3 to FLAC for better recognition
  const flacPath = audioPath.replace(/\.mp3$/, '.flac');
  try {
    execSync(`"${FFMPEG}" -y -i "${audioPath}" -ar 16000 -ac 1 "${flacPath}"`, { stdio: 'pipe' });
  } catch (e: any) {
    throw new Error(`Failed to convert ${audioPath} to FLAC: ${e.stderr?.toString() || e.message}`);
  }

  const audioBytes = fs.readFileSync(flacPath);
  const audioContent = audioBytes.toString('base64');

  // Clean up temp FLAC
  fs.unlinkSync(flacPath);

  // Check if audio is too large for sync API (> 10MB base64)
  const isLong = audioBytes.length > 5 * 1024 * 1024; // 5MB FLAC ~ several minutes

  const requestBody = {
    config: {
      encoding: 'FLAC',
      sampleRateHertz: 16000,
      languageCode: 'he-IL',
      enableWordTimeOffsets: true,
      model: 'default',
    },
    audio: {
      content: audioContent,
    },
  };

  let endpoint: string;
  if (isLong) {
    endpoint = `https://speech.googleapis.com/v1/speech:longrunningrecognize?key=${GOOGLE_API_KEY}`;
  } else {
    endpoint = `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Speech API error (${response.status}): ${err}`);
  }

  let result = await response.json() as any;

  // If long running, poll for completion
  if (isLong && result.name) {
    const opName = result.name;
    while (!result.done) {
      await new Promise(r => setTimeout(r, 3000));
      const pollResp = await fetch(
        `https://speech.googleapis.com/v1/operations/${opName}?key=${GOOGLE_API_KEY}`
      );
      result = await pollResp.json() as any;
    }
    if (result.error) {
      throw new Error(`Speech API operation failed: ${JSON.stringify(result.error)}`);
    }
    result = result.response;
  }

  const words: { word: string; startTime: number; endTime: number }[] = [];
  let transcript = '';

  if (result.results) {
    for (const res of result.results) {
      if (res.alternatives && res.alternatives[0]) {
        const alt = res.alternatives[0];
        transcript += (transcript ? ' ' : '') + (alt.transcript || '');
        if (alt.words) {
          for (const w of alt.words) {
            const startSecs = parseFloat(w.startTime?.replace('s', '') || '0');
            const endSecs = parseFloat(w.endTime?.replace('s', '') || '0');
            words.push({
              word: w.word || '',
              startTime: startSecs,
              endTime: endSecs,
            });
          }
        }
      }
    }
  }

  return { words, transcript };
}

// Find section boundaries by matching section text against transcribed words
function findSectionBoundaries(
  words: { word: string; startTime: number; endTime: number }[],
  sections: { id: string; hebrew: string; sortOrder: number }[]
): { id: string; startTime: number; endTime: number }[] {
  const sortedSections = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);
  const boundaries: { id: string; startTime: number; endTime: number }[] = [];

  // Build stripped word list for matching
  const strippedWords = words.map(w => stripNikud(w.word));

  let searchStart = 0;

  for (let si = 0; si < sortedSections.length; si++) {
    const section = sortedSections[si];
    const sectionWords = stripNikud(section.hebrew).split(/\s+/).filter(Boolean);

    if (sectionWords.length === 0) continue;

    // Find the first word of this section in the transcript
    const firstWord = sectionWords[0];
    let bestMatch = -1;
    let bestScore = 0;

    // Look for a match starting from searchStart
    for (let wi = searchStart; wi < strippedWords.length; wi++) {
      // Try matching the first 2-3 words of the section
      let matchCount = 0;
      for (let k = 0; k < Math.min(3, sectionWords.length); k++) {
        if (wi + k < strippedWords.length && strippedWords[wi + k] === sectionWords[k]) {
          matchCount++;
        }
      }
      if (matchCount > bestScore) {
        bestScore = matchCount;
        bestMatch = wi;
        if (matchCount >= 2) break; // Good enough match
      }
    }

    if (bestMatch >= 0) {
      const startTime = words[bestMatch].startTime;
      boundaries.push({ id: section.id, startTime, endTime: 0 });
      searchStart = bestMatch + 1;
    } else {
      console.warn(`  ! Could not find section "${section.id}" in transcript`);
      // Estimate based on position
      if (boundaries.length > 0) {
        boundaries.push({ id: section.id, startTime: -1, endTime: 0 });
      }
    }
  }

  // Set end times — each section ends where the next begins
  for (let i = 0; i < boundaries.length; i++) {
    if (i < boundaries.length - 1) {
      boundaries[i].endTime = boundaries[i + 1].startTime;
    } else {
      // Last section — end at the last word + some padding
      boundaries[i].endTime = words.length > 0
        ? words[words.length - 1].endTime + 0.5
        : 0;
    }
  }

  return boundaries;
}

// Split audio file using ffmpeg
function splitAudio(
  inputPath: string,
  outputDir: string,
  boundaries: { id: string; startTime: number; endTime: number }[]
) {
  fs.mkdirSync(outputDir, { recursive: true });

  for (const seg of boundaries) {
    if (seg.startTime < 0) {
      console.log(`    Skipping ${seg.id} (no timestamp found)`);
      continue;
    }

    const outPath = path.join(outputDir, `${seg.id}.mp3`);
    // Add small padding before start (0.1s) for natural sound
    const start = Math.max(0, seg.startTime - 0.1);
    const duration = seg.endTime - start + 0.2; // small padding after end too

    try {
      execSync(
        `"${FFMPEG}" -y -i "${inputPath}" -ss ${start.toFixed(3)} -t ${duration.toFixed(3)} -c:a libmp3lame -q:a 2 "${outPath}"`,
        { stdio: 'pipe' }
      );
      const size = fs.statSync(outPath).size;
      console.log(`    ${seg.id}.mp3 (${(size / 1024).toFixed(0)} KB) [${start.toFixed(1)}s - ${(start + duration).toFixed(1)}s]`);
    } catch (err) {
      console.error(`    Error splitting ${seg.id}: ${err}`);
    }
  }
}

async function processPrayer(prayerSlug: string, dryRun: boolean) {
  const prayer = PRAYERS.find(p => p.slug === prayerSlug);
  if (!prayer) {
    console.error(`Prayer "${prayerSlug}" not found in prayers.ts`);
    return;
  }

  // Find audio source (Chabad preferred, then SiddurAudio)
  const audioPath = findAudioSource(prayerSlug);
  if (!audioPath) {
    console.log(`  No audio source for ${prayerSlug}, skipping`);
    return;
  }

  console.log(`\n=== ${prayer.nameEnglish} (${prayer.nameHebrew}) ===`);
  console.log(`  Source: ${path.basename(audioPath)}`);
  console.log(`  Sections: ${prayer.sections.length}`);

  // Step 1: Transcribe with word timestamps
  console.log('  Transcribing...');
  const { words, transcript } = await transcribeWithTimestamps(audioPath);
  console.log(`  Transcript: ${transcript.substring(0, 100)}...`);
  console.log(`  Words found: ${words.length}`);

  // Step 2: Find section boundaries
  const sections = prayer.sections.map(s => ({
    id: s.id,
    hebrew: s.hebrewText,
    sortOrder: s.sortOrder,
  }));
  const boundaries = findSectionBoundaries(words, sections);

  console.log('\n  Section boundaries:');
  for (const b of boundaries) {
    const timeStr = b.startTime >= 0
      ? `${b.startTime.toFixed(1)}s - ${b.endTime.toFixed(1)}s`
      : 'NOT FOUND';
    console.log(`    ${b.id}: ${timeStr}`);
  }

  // Step 3: Split
  if (!dryRun) {
    const outDir = path.join(OUTPUT_DIR, prayerSlug);
    console.log(`\n  Splitting to: ${outDir}`);
    splitAudio(audioPath, outDir, boundaries);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const specificPrayer = args.find(a => !a.startsWith('--'));

  console.log('=== SiddurAudio Splitter ===');
  if (dryRun) console.log('(DRY RUN — no files will be created)\n');

  if (specificPrayer) {
    await processPrayer(specificPrayer, dryRun);
  } else {
    // Process all prayers that have audio sources
    for (const prayer of PRAYERS) {
      if (findAudioSource(prayer.slug)) {
        await processPrayer(prayer.slug, dryRun);
        await new Promise(r => setTimeout(r, 1000)); // rate limit
      }
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
