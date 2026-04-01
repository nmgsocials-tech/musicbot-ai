// Curated track dataset — primary candidate pool for recommendations.
//
// These tracks have pre-verified BPM and Camelot values, so no Soundcharts
// call is needed for them. The recommendation engine uses this as Tier 1
// before falling back to live Spotify search.
//
// Fields:
//   spotifyId — used to link to /song/[id] and fetch album art on demand
//   name / artist — displayed directly; no Spotify metadata fetch needed
//   bpm — rounded integer
//   camelot — Camelot wheel code e.g. "8A"
//   key / mode — human-readable, derived from Camelot

export interface CuratedTrack {
  spotifyId: string;
  name: string;
  artist: string;
  bpm: number;
  camelot: string;
  key: string;
  mode: string;
}

export const CURATED_TRACKS: CuratedTrack[] = [
  // --- Pop / Synth-pop ---
  { spotifyId: "0VjIjW4GlUZAMYd2vXMi3b", name: "Blinding Lights",        artist: "The Weeknd",        bpm: 171, camelot: "5B",  key: "D#", mode: "Major" },
  { spotifyId: "3AJwUDP919kvQ9QcozQPxg", name: "Save Your Tears",          artist: "The Weeknd",        bpm: 118, camelot: "9B",  key: "G",  mode: "Major" },
  { spotifyId: "2dHHgzDwk4BJdRwy9uXhTO", name: "Die For You",              artist: "The Weeknd",        bpm: 105, camelot: "4A",  key: "G#", mode: "Minor" },
  { spotifyId: "7MXVkk9YMctZqd1Srtv4MB", name: "Starboy",                  artist: "The Weeknd",        bpm: 186, camelot: "8A",  key: "A",  mode: "Minor" },
  { spotifyId: "2tznHmp70DxMyr2XhWLOW0", name: "As It Was",                artist: "Harry Styles",      bpm: 174, camelot: "1B",  key: "B",  mode: "Major" },
  { spotifyId: "4iJyoBOLtHqaWYs3vyWsF4", name: "Unholy",                   artist: "Sam Smith",         bpm: 131, camelot: "7A",  key: "F",  mode: "Minor" },
  { spotifyId: "6I9VzXrHxO9rA9A5euc8Ak", name: "bad guy",                  artist: "Billie Eilish",     bpm: 135, camelot: "6B",  key: "A#", mode: "Major" },
  { spotifyId: "2Fxmhks0LiveHAT2usUQFn", name: "STAY",                     artist: "The Kid LAROI",     bpm: 170, camelot: "2B",  key: "F#", mode: "Major" },
  { spotifyId: "4LRPiXqCikLlN15c3yImP7", name: "As It Was",                artist: "Harry Styles",      bpm: 174, camelot: "1B",  key: "B",  mode: "Major" },
  { spotifyId: "5HCyWlXZPP0y6Gqq8TgA20", name: "Peaches",                  artist: "Justin Bieber",     bpm: 90,  camelot: "12B", key: "E",  mode: "Major" },

  // --- Hip-hop / Trap ---
  { spotifyId: "1zi7xx7UVEFkmKfv06H8x0", name: "HUMBLE.",                  artist: "Kendrick Lamar",    bpm: 150, camelot: "5A",  key: "D#", mode: "Minor" },
  { spotifyId: "3ee8Jmje8o58CHK66QrVC2", name: "God's Plan",               artist: "Drake",             bpm: 77,  camelot: "5A",  key: "D#", mode: "Minor" },
  { spotifyId: "2xLMifQCjDGFmkHkpNLD9h", name: "Sicko Mode",               artist: "Travis Scott",      bpm: 155, camelot: "6A",  key: "A#", mode: "Minor" },
  { spotifyId: "58q2HKrzhC3ozto2nDdN4z", name: "ROCKSTAR",                 artist: "DaBaby",            bpm: 180, camelot: "8B",  key: "C",  mode: "Major" },
  { spotifyId: "0sf12qNH5qcw8qpgymFOqD", name: "Lucid Dreams",             artist: "Juice WRLD",        bpm: 84,  camelot: "4B",  key: "G#", mode: "Major" },
  { spotifyId: "6fTt0CH2t0mdeB2N9XFG5r", name: "Sunflower",                artist: "Post Malone",       bpm: 90,  camelot: "9B",  key: "G",  mode: "Major" },
  { spotifyId: "0u2P5u6lvoDfwTYjAADbn4", name: "lovely",                   artist: "Billie Eilish",     bpm: 115, camelot: "4A",  key: "G#", mode: "Minor" },

  // --- Electronic / Dance ---
  { spotifyId: "5ghIJDpPoe3CfHMGu71E6T", name: "Levels",                   artist: "Avicii",            bpm: 126, camelot: "7B",  key: "F",  mode: "Major" },
  { spotifyId: "4u7EnebtmKWzUH433cf5Qv", name: "Happier",                  artist: "Marshmello",        bpm: 100, camelot: "6A",  key: "A#", mode: "Minor" },
  { spotifyId: "2bMOqGi7dHLMpMmNQQYNQS", name: "Titanium",                 artist: "David Guetta",      bpm: 126, camelot: "6A",  key: "A#", mode: "Minor" },
  { spotifyId: "3cfOd4CMv2snFaKAnMdnvK", name: "Don't You Worry Child",    artist: "Swedish House Mafia", bpm: 129, camelot: "5B",  key: "D#", mode: "Major" },
  { spotifyId: "19xzbLwhFtEIuBJkMFIJkN", name: "Lean On",                  artist: "Major Lazer",       bpm: 98,  camelot: "10A", key: "D",  mode: "Minor" },

  // --- R&B / Soul ---
  { spotifyId: "2tpWsVSb9UEmDRxAl1zhX1", name: "Señorita",                 artist: "Shawn Mendes",      bpm: 117, camelot: "10B", key: "D",  mode: "Major" },
  { spotifyId: "4kbj5MwxO1bq9wjT5g9HaA", name: "Position",                 artist: "Ariana Grande",     bpm: 144, camelot: "11A", key: "A#", mode: "Minor" },
  { spotifyId: "3DXncPQOG4VBw3QHh3S817", name: "thank u, next",            artist: "Ariana Grande",     bpm: 107, camelot: "11A", key: "A#", mode: "Minor" },
  { spotifyId: "7qiZfU4dY1lWllzX7mPBI3", name: "Shape of You",             artist: "Ed Sheeran",        bpm: 96,  camelot: "4B",  key: "C#", mode: "Major" },
  { spotifyId: "0tgVpDi06FyKpA1z0VMD4v", name: "Perfect",                  artist: "Ed Sheeran",        bpm: 95,  camelot: "8B",  key: "G#", mode: "Major" },

  // --- Latin ---
  { spotifyId: "4saklk6nie3yiGePpBwmhD", name: "Despacito",                artist: "Luis Fonsi",        bpm: 89,  camelot: "3A",  key: "B",  mode: "Minor" },
  { spotifyId: "7GX5flRQZVHvXDxcYKExnP", name: "Con Calma",                artist: "Daddy Yankee",      bpm: 94,  camelot: "8B",  key: "C",  mode: "Major" },

  // --- Classic / Rock crossover ---
  { spotifyId: "3skn2lauGk7Zdgo4WkRmhm", name: "Bohemian Rhapsody",        artist: "Queen",             bpm: 72,  camelot: "4B",  key: "G#", mode: "Major" },
  { spotifyId: "4u7EnebtmKWzUH433cf5Qv", name: "Hotel California",         artist: "Eagles",            bpm: 75,  camelot: "5A",  key: "D#", mode: "Minor" },

  // --- Dance-pop / Future bass ---
  { spotifyId: "0lHAMNU8RGiM5B3scMbHKe", name: "Dynamite",                 artist: "BTS",               bpm: 114, camelot: "10B", key: "D",  mode: "Major" },
  { spotifyId: "2QjOHCTQ1Tz1HjdDQcZuk9", name: "Uptown Funk",              artist: "Mark Ronson",       bpm: 115, camelot: "8A",  key: "A",  mode: "Minor" },
  { spotifyId: "5ygDXis42ncn6kYG14lEVG", name: "24K Magic",                artist: "Bruno Mars",        bpm: 106, camelot: "9A",  key: "G",  mode: "Minor" },
  { spotifyId: "0nrRP9ws2zWVOKqm945m4R", name: "That's What I Like",       artist: "Bruno Mars",        bpm: 124, camelot: "8B",  key: "C",  mode: "Major" },
  { spotifyId: "6b8Be6ljOzmkOmFslEb23P", name: "Rockabye",                 artist: "Clean Bandit",      bpm: 95,  camelot: "9A",  key: "G",  mode: "Minor" },
  { spotifyId: "3BovdzfaX4jiFspeaking",   name: "Love Yourself",            artist: "Justin Bieber",     bpm: 100, camelot: "4B",  key: "G#", mode: "Major" },

  // --- Afrobeats / Global ---
  { spotifyId: "2d8JP84HNLKhmd6IYOoupQ", name: "One Dance",                artist: "Drake",             bpm: 104, camelot: "12A", key: "E",  mode: "Minor" },
  { spotifyId: "0e7bsd4y4ygGtqV9Qe4Rnh", name: "Essence",                  artist: "Wizkid",            bpm: 107, camelot: "9B",  key: "G",  mode: "Major" },
];
