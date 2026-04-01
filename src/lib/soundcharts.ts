// Soundcharts API helpers — server-side only.
// Docs: https://developers.soundcharts.com
//
// Flow for audio features:
//   1. Resolve a Spotify track ID to a Soundcharts song UUID.
//   2. Fetch the song object, which contains tempo, key, and mode.

const API_BASE = "https://customer.api.soundcharts.com";

export interface AudioFeatures {
  bpm: number;
  key: string;    // e.g. "A"
  mode: string;   // "Major" | "Minor"
  camelot: string; // e.g. "11B"
}

// ---------------------------------------------------------------------------
// Mapping tables
// ---------------------------------------------------------------------------

// Soundcharts (like Spotify) encodes key as a Pitch Class integer (0=C … 11=B)
// and mode as 0 (minor) or 1 (major).

const KEY_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Camelot wheel: [major, minor] indexed by pitch class 0–11.
const CAMELOT: [string, string][] = [
  ["8B", "5A"],   // C
  ["3B", "12A"],  // C#
  ["10B", "7A"],  // D
  ["5B", "2A"],   // D#
  ["12B", "9A"],  // E
  ["7B", "4A"],   // F
  ["2B", "11A"],  // F#
  ["9B", "6A"],   // G
  ["4B", "1A"],   // G#
  ["11B", "8A"],  // A
  ["6B", "3A"],   // A#
  ["1B", "10A"],  // B
];

// ---------------------------------------------------------------------------
// Auth headers
// ---------------------------------------------------------------------------

function authHeaders(): HeadersInit {
  const appId = process.env.SOUNDCHARTS_APP_ID;
  const apiKey = process.env.SOUNDCHARTS_API_KEY;

  if (!appId || !apiKey) {
    throw new Error(
      "Missing SOUNDCHARTS_APP_ID or SOUNDCHARTS_API_KEY in environment variables."
    );
  }

  return {
    "x-app-id": appId,
    "x-api-key": apiKey,
  };
}

// ---------------------------------------------------------------------------
// Step 1: resolve Spotify track ID → Soundcharts UUID
// ---------------------------------------------------------------------------

async function resolveSpotifyId(spotifyId: string): Promise<string | null> {
  const url = `${API_BASE}/api/v2.25/song/by-platform/spotify/${encodeURIComponent(spotifyId)}`;
  const res = await fetch(url, { headers: authHeaders(), cache: "no-store" });

  if (!res.ok) {
    console.warn(`[soundcharts] could not resolve Spotify ID ${spotifyId}: ${res.status} ${res.statusText}`);
    return null;
  }

  const data = await res.json();
  const uuid: string | undefined = data?.object?.uuid;
  if (!uuid) {
    console.warn(`[soundcharts] no uuid in response for Spotify ID ${spotifyId}`);
    return null;
  }

  return uuid;
}

// ---------------------------------------------------------------------------
// Step 2: fetch song metadata by Soundcharts UUID
// ---------------------------------------------------------------------------

async function fetchSongMetadata(uuid: string): Promise<AudioFeatures | null> {
  const url = `${API_BASE}/api/v2.25/song/${encodeURIComponent(uuid)}`;
  const res = await fetch(url, { headers: authHeaders(), cache: "no-store" });

  if (!res.ok) {
    console.warn(`[soundcharts] could not fetch metadata for uuid ${uuid}: ${res.status} ${res.statusText}`);
    return null;
  }

  const data = await res.json();
  const audio = data?.object?.audio;

  const rawKey: number = audio?.key;
  const rawMode: number = audio?.mode;
  const rawTempo: number = audio?.tempo;

  if (!audio || rawTempo == null || rawKey == null || rawMode == null) {
    console.warn(`[soundcharts] incomplete audio features for uuid ${uuid}: tempo=${rawTempo}, key=${rawKey}, mode=${rawMode}`);
    return null;
  }

  // -1 means key detection failed.
  const key = rawKey === -1 ? "?" : KEY_NAMES[rawKey] ?? "?";
  const mode = rawMode === 1 ? "Major" : "Minor";
  const camelot = rawKey === -1 ? "?" : CAMELOT[rawKey]?.[rawMode === 1 ? 0 : 1] ?? "?";

  return { bpm: Math.round(rawTempo), key, mode, camelot };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

// Resolves a Spotify track ID to audio features via Soundcharts.
// Returns null if either step fails — never throws.
export async function getAudioFeaturesBySpotifyId(
  spotifyId: string
): Promise<AudioFeatures | null> {
  const uuid = await resolveSpotifyId(spotifyId);
  if (!uuid) return null;

  return fetchSongMetadata(uuid);
}
