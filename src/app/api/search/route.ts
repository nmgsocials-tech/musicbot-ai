import { NextRequest, NextResponse } from "next/server";
import { searchTracks } from "@/lib/spotify";

// GET /api/search?q=<query>
// Returns { tracks: SpotifyTrack[] } or { error: string }.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ error: "Missing query parameter: q" }, { status: 400 });
  }

  try {
    const tracks = await searchTracks(q);
    return NextResponse.json({ tracks });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search failed";
    console.error("[/api/search]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
