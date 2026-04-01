// Spotify API helpers — server-side only.
// Uses the Client Credentials flow: no user login required.
// Access tokens are cached in memory for their full lifetime (minus a 60s buffer).

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  external_urls: { spotify: string };
}

// Module-level cache so we reuse the token across requests in a single process.
let tokenCache: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.value;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in environment variables."
    );
  }

  // Basic auth: base64-encode "client_id:client_secret"
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    // Never cache the token request itself — we manage expiry manually.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Spotify token request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  // Spotify tokens last 3600 s. Subtract 60 s to refresh slightly early.
  tokenCache = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return tokenCache.value;
}

// ---------------------------------------------------------------------------
// Audio features
// ---------------------------------------------------------------------------

// Spotify encodes key as a Pitch Class integer (0=C … 11=B) and mode as
// 0 (minor) or 1 (major). These tables convert them to human-readable values.

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

export interface AudioFeatures {
  bpm: number;
  key: string;   // e.g. "A"
  mode: string;  // "Major" | "Minor"
  camelot: string; // e.g. "11B"
}

// Returns null when Spotify has no audio analysis for the track (rare but real).
export async function getAudioFeatures(id: string): Promise<AudioFeatures | null> {
  const token = await getAccessToken();

  const res = await fetch(`${API_BASE}/audio-features/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    // 403 means this app tier doesn't have audio features access.
    // Any other non-ok status is also treated as unavailable rather than a crash.
    console.warn(`[spotify] audio-features unavailable for ${id}: ${res.status} ${res.statusText}`);
    return null;
  }

  const data = await res.json();

  // Spotify returns -1 for key when it couldn't detect one.
  const keyIndex: number = data.key;
  const modeIndex: number = data.mode; // 1=major, 0=minor

  const key = keyIndex === -1 ? "?" : KEY_NAMES[keyIndex];
  const mode = modeIndex === 1 ? "Major" : "Minor";
  const camelot = keyIndex === -1 ? "?" : CAMELOT[keyIndex][modeIndex === 1 ? 0 : 1];

  return {
    bpm: Math.round(data.tempo),
    key,
    mode,
    camelot,
  };
}

// ---------------------------------------------------------------------------
// Track
// ---------------------------------------------------------------------------

// Returns null when Spotify responds with 404 (bad/expired track ID).
// Throws for any other error so the caller can decide how to handle it.
export async function getTrack(id: string): Promise<SpotifyTrack | null> {
  const token = await getAccessToken();

  const res = await fetch(`${API_BASE}/tracks/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`Spotify track fetch failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<SpotifyTrack>;
}

// Spotify capped the search limit at 10 in February 2026.
const SPOTIFY_SEARCH_MAX_LIMIT = 10;

export async function searchTracks(query: string, limit = 8, offset = 0): Promise<SpotifyTrack[]> {
  const token = await getAccessToken();

  const safeLimit = Math.min(SPOTIFY_SEARCH_MAX_LIMIT, Math.max(1, Math.floor(limit)));

  const url = new URL(`${API_BASE}/search`);
  url.searchParams.set("q", query);
  url.searchParams.set("type", "track");
  url.searchParams.set("limit", String(safeLimit));
  if (offset > 0) url.searchParams.set("offset", String(offset));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[spotify] searchTracks FAILED\n  URL: ${url}\n  Status: ${res.status} ${res.statusText}\n  Body: ${body}`);
    throw new Error(`Spotify search failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.tracks.items as SpotifyTrack[];
}
