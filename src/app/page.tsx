"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import type { SpotifyTrack } from "@/lib/spotify";

type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; tracks: SpotifyTrack[] };

function AlbumThumb({ track }: { track: SpotifyTrack }) {
  const img = track.album.images.find((i) => i.width <= 300) ?? track.album.images[0];

  if (!img) {
    return (
      <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={img.url}
      alt={track.album.name}
      width={48}
      height={48}
      className="w-12 h-12 rounded-lg object-cover shrink-0"
    />
  );
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState<SearchState>({ status: "idle" });

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearch({ status: "loading" });

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok) {
        setSearch({ status: "error", message: data.error ?? "Search failed" });
        return;
      }

      setSearch({ status: "done", tracks: data.tracks });
    } catch {
      setSearch({ status: "error", message: "Network error — is the dev server running?" });
    }
  }

  const hasResults = search.status === "done" && search.tracks.length > 0;
  const noResults = search.status === "done" && search.tracks.length === 0;

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-20">
      {/* Logo / wordmark */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white">
          music<span className="text-violet-500">bot</span>.ai
        </h1>
        <p className="mt-3 text-zinc-400 text-lg">
          Discover the BPM, key, and Camelot code for any song.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="w-full max-w-xl">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 focus-within:border-violet-500 transition-colors">
          <svg
            className="w-5 h-5 text-zinc-500 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.75 6.75a7.5 7.5 0 0 0 10.9 10.9z" />
          </svg>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a song or artist..."
            className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-base"
            autoFocus
          />

          <button
            type="submit"
            disabled={!query.trim() || search.status === "loading"}
            className="shrink-0 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-1.5 rounded-xl transition-colors"
          >
            {search.status === "loading" ? "Searching…" : "Search"}
          </button>
        </div>
      </form>

      {/* Results */}
      {hasResults && (
        <ul className="mt-4 w-full max-w-xl divide-y divide-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden">
          {(search as { status: "done"; tracks: SpotifyTrack[] }).tracks.map((track) => (
            <li key={track.id}>
              <Link
                href={`/song/${track.id}`}
                className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-900 transition-colors"
              >
                <AlbumThumb track={track} />
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{track.name}</p>
                  <p className="text-zinc-400 text-sm truncate">
                    {track.artists.map((a) => a.name).join(", ")}
                  </p>
                </div>
                <svg className="w-4 h-4 text-zinc-600 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {noResults && (
        <p className="mt-6 text-zinc-500 text-sm">No results found for &quot;{query}&quot;</p>
      )}

      {search.status === "error" && (
        <p className="mt-6 text-red-400 text-sm">{search.message}</p>
      )}

      {search.status === "idle" && (
        <p className="mt-6 text-zinc-600 text-sm">
          Try &quot;Blinding Lights&quot; or &quot;Bohemian Rhapsody&quot;
        </p>
      )}
    </main>
  );
}
