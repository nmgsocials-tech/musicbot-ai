// Recommendation engine — server-side only.
//
// Two-tier candidate pipeline:
//   Tier 1 — curated internal dataset (src/data/tracks.ts)
//             Pre-verified BPM + Camelot. No Soundcharts call needed.
//             Always runs first and produces the strongest results.
//   Tier 2 — live Spotify search (fallback only)
//             Runs when Tier 1 produces fewer than MIN_RESULTS after scoring.
//             Same pipeline as before: search → dedup → Soundcharts enrich → score.
//
// Scoring dimensions (all independent, additive):
//   Camelot match: exact (50) | adjacent ±1 same letter (35) | opposite letter (25) | key-only (10)
//   BPM closeness: ≤2 (30) | ≤5 (20) | ≤8 (10) | ≤12 (4)
//
// Labels (derived from score + Camelot relationship):
//   Perfect Match    — exact Camelot + BPM ≤5 (total ≥ 70)
//   Energy Lift      — adjacent Camelot, ±1 position same letter
//   Safer Transition — same position, opposite letter (relative major/minor)
//   Compatible Key   — everything else that passes

import { searchTracks, type SpotifyTrack } from "@/lib/spotify";
import { getAudioFeaturesBySpotifyId, type AudioFeatures } from "@/lib/soundcharts";
import { parseCamelot } from "@/lib/camelot";
import { CURATED_TRACKS, type CuratedTrack } from "@/data/tracks";

export type RecommendationLabel =
  | "Perfect Match"
  | "Energy Lift"
  | "Safer Transition"
  | "Compatible Key";

export interface Recommendation {
  id: string;
  name: string;
  artist: string;
  albumArt: string | null;
  bpm: number;
  camelot: string;
  label: RecommendationLabel;
}

// A scored candidate ready for the final slice.
interface ScoredEntry {
  id: string;
  name: string;
  artist: string;
  albumArt: string | null;
  bpm: number;
  camelot: string;
  score: number;
  camelotRelationship: "exact" | "adjacent" | "opposite" | "key-only" | "none";
}

const MAX_RESULTS = 10;
const MIN_RESULTS = 5;
const ARTIST_CAP = 2;

// ---------------------------------------------------------------------------
// Variant detection + title normalization (used for search-fallback dedup)
// ---------------------------------------------------------------------------

const VARIANT_TERMS = [
  "live", "remaster", "remastered", "radio edit", "extended mix",
  "extended version", "remix", "acoustic", "instrumental", "sped up",
  "slowed", "deluxe", "mono", "stereo", "explicit", "clean",
  "feat", "featuring",
];

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s*[\([{][^\)\]}]*[\)\]}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function variantScore(title: string): number {
  const lower = title.toLowerCase();
  return VARIANT_TERMS.filter((t) => lower.includes(t)).length;
}

function dedupKey(name: string, artistName: string): string {
  return `${normalizeTitle(name)}|${artistName.toLowerCase()}`;
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

type CamelotRelationship = ScoredEntry["camelotRelationship"];

function getCamelotRelationship(candidateCode: string, sourceCode: string): CamelotRelationship {
  if (candidateCode === sourceCode) return "exact";

  const src = parseCamelot(sourceCode);
  const cnd = parseCamelot(candidateCode);
  if (!src || !cnd) return "none";

  if (cnd.num === src.num && cnd.letter !== src.letter) return "opposite";

  const isAdjacent =
    cnd.letter === src.letter &&
    (cnd.num === (src.num % 12) + 1 || cnd.num === ((src.num - 2 + 12) % 12) + 1);
  if (isAdjacent) return "adjacent";

  return "none";
}

function camelotPoints(rel: CamelotRelationship): number {
  switch (rel) {
    case "exact":    return 50;
    case "adjacent": return 35;
    case "opposite": return 25;
    case "key-only": return 10;
    default:         return 0;
  }
}

function bpmPoints(candidateBpm: number, sourceBpm: number): number {
  const delta = Math.abs(candidateBpm - sourceBpm);
  if (delta <= 2)  return 30;
  if (delta <= 5)  return 20;
  if (delta <= 8)  return 10;
  if (delta <= 12) return 4;
  return 0;
}

function computeScore(
  candidateCamelot: string,
  candidateBpm: number,
  candidateKey: string,
  source: AudioFeatures
): { score: number; relationship: CamelotRelationship } {
  let relationship = getCamelotRelationship(candidateCamelot, source.camelot);

  // Partial credit when no Camelot relationship but same key name.
  if (relationship === "none" && candidateKey === source.key) {
    relationship = "key-only";
  }

  const score = camelotPoints(relationship) + bpmPoints(candidateBpm, source.bpm);
  return { score, relationship };
}

function deriveLabel(
  relationship: CamelotRelationship,
  score: number,
  bpmDelta: number
): RecommendationLabel {
  if (relationship === "exact" && bpmDelta <= 5) return "Perfect Match";
  if (relationship === "adjacent") return "Energy Lift";
  if (relationship === "opposite") return "Safer Transition";
  return "Compatible Key";
}

// ---------------------------------------------------------------------------
// Tier 1 — curated dataset
// ---------------------------------------------------------------------------

function scoreCuratedPool(
  sourceId: string,
  sourceFeatures: AudioFeatures
): ScoredEntry[] {
  const seenArtists = new Map<string, number>();
  const entries: ScoredEntry[] = [];

  for (const t of CURATED_TRACKS) {
    if (t.spotifyId === sourceId) continue;

    const { score, relationship } = computeScore(
      t.camelot, t.bpm, t.key, sourceFeatures
    );
    if (score === 0) continue; // no affinity at all — skip

    entries.push({
      id: t.spotifyId,
      name: t.name,
      artist: t.artist,
      albumArt: null, // fetched lazily in the page if needed; curated tracks link to /song/[id]
      bpm: t.bpm,
      camelot: t.camelot,
      score,
      camelotRelationship: relationship,
    });
  }

  return entries.sort((a, b) => b.score - a.score);
}

// ---------------------------------------------------------------------------
// Tier 2 — Spotify search fallback
// ---------------------------------------------------------------------------

async function buildSearchPool(
  sourceId: string,
  queries: string[]
): Promise<SpotifyTrack[]> {
  const pageRequests = queries.flatMap((q) => [
    searchTracks(q, 10, 0),
    searchTracks(q, 10, 10),
  ]);
  const results = await Promise.allSettled(pageRequests);

  const seenIds = new Set<string>([sourceId]);
  const pool: SpotifyTrack[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const track of result.value) {
      if (seenIds.has(track.id)) continue;
      seenIds.add(track.id);
      pool.push(track);
    }
  }
  return pool;
}

function deduplicateSearchPool(pool: SpotifyTrack[], sourceKey: string): SpotifyTrack[] {
  const groups = new Map<string, SpotifyTrack[]>();
  for (const track of pool) {
    const key = dedupKey(track.name, track.artists[0]?.name ?? "");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(track);
  }

  const survivors: SpotifyTrack[] = [];
  for (const [key, group] of groups) {
    if (key === sourceKey) continue;
    const best = group.slice().sort((a, b) => {
      const diff = variantScore(a.name) - variantScore(b.name);
      return diff !== 0 ? diff : a.name.length - b.name.length;
    })[0];
    survivors.push(best);
  }
  return survivors;
}

async function scoreSearchPool(
  pool: SpotifyTrack[],
  sourceFeatures: AudioFeatures
): Promise<ScoredEntry[]> {
  const enriched = await Promise.all(
    pool.map(async (track): Promise<ScoredEntry | null> => {
      try {
        const features = await getAudioFeaturesBySpotifyId(track.id);
        if (!features) return null;

        const { score, relationship } = computeScore(
          features.camelot, features.bpm, features.key, sourceFeatures
        );
        if (score === 0) return null;

        const img = track.album.images.find((i) => i.width <= 300) ?? track.album.images[0];
        return {
          id: track.id,
          name: track.name,
          artist: track.artists.map((a) => a.name).join(", "),
          albumArt: img?.url ?? null,
          bpm: features.bpm,
          camelot: features.camelot,
          score,
          camelotRelationship: relationship,
        };
      } catch {
        return null;
      }
    })
  );

  return enriched
    .filter((e): e is ScoredEntry => e !== null)
    .sort((a, b) => b.score - a.score);
}

// ---------------------------------------------------------------------------
// Final slice with artist cap + label assignment
// ---------------------------------------------------------------------------

function applyCapAndLabel(
  entries: ScoredEntry[],
  sourceFeatures: AudioFeatures,
  existingIds: Set<string>,
  cap: number,
  limit: number
): Recommendation[] {
  const artistCount = new Map<string, number>();
  const results: Recommendation[] = [];

  for (const entry of entries) {
    if (results.length >= limit) break;
    if (existingIds.has(entry.id)) continue;

    const count = artistCount.get(entry.artist) ?? 0;
    if (count >= cap) continue;

    const bpmDelta = Math.abs(entry.bpm - sourceFeatures.bpm);
    const label = deriveLabel(entry.camelotRelationship, entry.score, bpmDelta);

    artistCount.set(entry.artist, count + 1);
    existingIds.add(entry.id);
    results.push({
      id: entry.id,
      name: entry.name,
      artist: entry.artist,
      albumArt: entry.albumArt,
      bpm: entry.bpm,
      camelot: entry.camelot,
      label,
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getRecommendations(
  sourceTrack: SpotifyTrack,
  sourceFeatures: AudioFeatures
): Promise<Recommendation[]> {
  const existingIds = new Set<string>([sourceTrack.id]);

  // Tier 1: curated dataset — fast, no API calls, best quality.
  const curatedScored = scoreCuratedPool(sourceTrack.id, sourceFeatures);
  const results = applyCapAndLabel(curatedScored, sourceFeatures, existingIds, ARTIST_CAP, MAX_RESULTS);

  if (results.length >= MIN_RESULTS) return results;

  // Tier 2: Spotify search fallback — only if curated pool is insufficient.
  const artistName = sourceTrack.artists[0]?.name ?? "";
  const trackName = sourceTrack.name;
  const bpmBand = Math.round(sourceFeatures.bpm / 10) * 10;
  const keyName = sourceFeatures.key;

  const queries = [
    artistName,
    trackName,
    `${artistName} ${trackName}`.trim(),
    `${keyName} ${bpmBand} bpm`,
    `${bpmBand} bpm`,
    `${keyName} minor`,
    `${keyName} major`,
  ].filter(Boolean);

  const sourceKey = dedupKey(sourceTrack.name, sourceTrack.artists[0]?.name ?? "");
  const rawPool = await buildSearchPool(sourceTrack.id, queries);
  const pool = deduplicateSearchPool(rawPool, sourceKey);

  if (pool.length > 0) {
    const searchScored = await scoreSearchPool(pool, sourceFeatures);
    const fallbackResults = applyCapAndLabel(
      searchScored, sourceFeatures, existingIds, ARTIST_CAP, MAX_RESULTS - results.length
    );
    results.push(...fallbackResults);
  }

  return results;
}
