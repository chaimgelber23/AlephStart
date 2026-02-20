import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Default Hebrew voice — "Rachel" is a good female Hebrew voice
// You can change this to any ElevenLabs voice ID
const HEBREW_VOICE_ID = process.env.ELEVENLABS_HEBREW_VOICE_ID || 'XB0fDUnXU5powFXDhCwa'; // Charlotte — multilingual
const ENGLISH_VOICE_ID = process.env.ELEVENLABS_ENGLISH_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // Sarah — warm English

// In-memory cache to avoid re-generating same audio
const audioCache = new Map<string, { data: ArrayBuffer; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

function cleanCache() {
  const now = Date.now();
  for (const [key, entry] of audioCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      audioCache.delete(key);
    }
  }
}

export async function POST(req: NextRequest) {
  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { error: 'ElevenLabs API key not configured. Add ELEVENLABS_API_KEY to .env.local' },
      { status: 500 }
    );
  }

  const { text, mode, speed } = await req.json() as {
    text: string;
    mode: 'hebrew' | 'transliteration';
    speed?: number;
  };

  if (!text || text.length > 5000) {
    return NextResponse.json({ error: 'Text required (max 5000 chars)' }, { status: 400 });
  }

  // Build cache key
  const cacheKey = `${mode}:${speed || 1}:${text}`;
  cleanCache();

  const cached = audioCache.get(cacheKey);
  if (cached) {
    return new NextResponse(cached.data, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  // Choose voice based on mode
  const voiceId = mode === 'hebrew' ? HEBREW_VOICE_ID : ENGLISH_VOICE_ID;

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
            speed: speed || 1.0,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[TTS] ElevenLabs error:', response.status, errorText);
      return NextResponse.json(
        { error: 'TTS generation failed' },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    // Cache it
    audioCache.set(cacheKey, { data: audioBuffer, timestamp: Date.now() });

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('[TTS] Error:', error);
    return NextResponse.json({ error: 'TTS service unavailable' }, { status: 503 });
  }
}
