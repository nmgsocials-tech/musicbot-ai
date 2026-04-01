import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrack } from "@/lib/spotify";
import { getAudioFeaturesBySpotifyId } from "@/lib/soundcharts";
import { getRecommendations, type Recommendation } from "@/lib/recommendations";

interface SongPageProps {
  params: Promise<{ id: string }>;
}

interface StatCardProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

function StatCard({ label, value, highlight = false }: StatCardProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl p-5 ${
        highlight
          ? "bg-violet-600/20 border border-violet-500/30"
          : "bg-zinc-900 border border-zinc-800"
      }`}
    >
      <span className="text-zinc-400 text-xs font-medium uppercase tracking-widest mb-1">
        {label}
      </span>
      <span
        className={`text-3xl font-extrabold ${
          highlight ? "text-violet-400" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default async function SongPage({ params }: SongPageProps) {
  const { id } = await params;

  // Track metadata is required — 404 renders Next.js not-found page.
  const track = await getTrack(id);
  if (!track) notFound();

  // Audio features come from Soundcharts via the Spotify track ID.
  // Any failure is caught and treated as unavailable — page always renders.
  let features = null;
  try {
    features = await getAudioFeaturesBySpotifyId(id);
  } catch {
    // Leave features as null — the page renders with "—" placeholders below.
  }

  // Recommendations require audio features — skip if unavailable.
  let recommendations: Recommendation[] = [];
  if (features) {
    try {
      recommendations = await getRecommendations(track, features);
    } catch {
      // Non-critical — page renders fine without them.
    }
  }

  const albumArt = track.album.images[0]?.url ?? null;
  const artists = track.artists.map((a) => a.name).join(", ");
  const featuresAvailable = features !== null;

  const bpm = features?.bpm ?? "—";
  const key = features?.key ?? "—";
  const mode = features?.mode ?? "—";
  const camelot = features?.camelot ?? "—";

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      {/* Back link */}
      <div className="w-full max-w-lg mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to search
        </Link>
      </div>

      {/* Song header */}
      <div className="w-full max-w-lg flex items-center gap-5 mb-10">
        {/* Album art */}
        <div className="w-24 h-24 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden">
          {albumArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={albumArt} alt={track.album.name} className="w-full h-full object-cover" />
          ) : (
            <svg
              className="w-10 h-10 text-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
              />
            </svg>
          )}
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-white truncate">{track.name}</h1>
          <p className="text-zinc-400 text-sm mt-0.5 truncate">{artists}</p>
          <p className="text-zinc-600 text-xs mt-0.5 truncate">{track.album.name}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="w-full max-w-lg grid grid-cols-2 gap-3">
        <StatCard label="BPM" value={bpm} />
        <StatCard label="Key" value={featuresAvailable ? `${key} ${mode}` : "—"} />
        <StatCard label="Mode" value={mode} />
        <StatCard label="Camelot" value={camelot} highlight />
      </div>

      {!featuresAvailable && (
        <p className="mt-4 text-zinc-600 text-xs text-center max-w-lg">
          Audio features (BPM, key, mode, Camelot) are not available for this track.
        </p>
      )}

      {/* Spotify link */}
      <a
        href={track.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
        Open on Spotify
      </a>

      {/* Recommendations */}
      {featuresAvailable && (
        <div className="w-full max-w-lg mt-12">
          <h2 className="text-white font-semibold text-base mb-1">Songs that mix with this</h2>
          <p className="text-zinc-500 text-xs mb-4">
            Compatible Camelot key · closest BPM match
          </p>

          {recommendations.length > 0 ? (
            <ul className="divide-y divide-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden">
              {recommendations.map((rec) => (
                <li key={rec.id}>
                  <Link
                    href={`/song/${rec.id}`}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-900 transition-colors"
                  >
                    {/* Album art */}
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 shrink-0 overflow-hidden flex items-center justify-center">
                      {rec.albumArt ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={rec.albumArt} alt={rec.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                        </svg>
                      )}
                    </div>

                    {/* Name + artist */}
                    <div className="min-w-0 flex-1">
                      <p className="text-zinc-500 text-xs mb-0.5">{rec.label}</p>
                      <p className="text-white text-sm font-medium truncate">{rec.name}</p>
                      <p className="text-zinc-400 text-xs truncate">{rec.artist}</p>
                    </div>

                    {/* BPM + Camelot badges */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-zinc-400 text-xs tabular-nums">{rec.bpm} BPM</span>
                      <span className="bg-violet-600/20 border border-violet-500/30 text-violet-400 text-xs font-bold px-2 py-0.5 rounded-lg">
                        {rec.camelot}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-600 text-sm">
              No matching tracks found for this BPM and key combination.
            </p>
          )}
        </div>
      )}
    </main>
  );
}
