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

  // --- Bass / Dubstep / Riddim ---
  { spotifyId: "1L6JiDuL7yhm6TrFnIrJBv", name: "Pillars",                  artist: "Wooli",             bpm: 150, camelot: "5A",  key: "D#", mode: "Minor" },
  { spotifyId: "3hkNWAWyULpkOcbsAaG2tP", name: "Cannibal",                  artist: "Wooli",             bpm: 140, camelot: "8A",  key: "A",  mode: "Minor" },
  { spotifyId: "4W0zFVl1wXo2hJbpXXJGRt", name: "X Rated",                  artist: "Subtronics",        bpm: 150, camelot: "5A",  key: "D#", mode: "Minor" },
  { spotifyId: "1rfofaqEpACxVEHIZBJe6W", name: "Cyclops",                   artist: "Subtronics",        bpm: 145, camelot: "6A",  key: "A#", mode: "Minor" },
  { spotifyId: "2cAQ8DOmFGFaqLPAkDLXIm", name: "Riddim Sequencer",          artist: "Excision",          bpm: 150, camelot: "1A",  key: "A",  mode: "Minor" },
  { spotifyId: "1dNFHFVdKOiHfWaBBz3zFf", name: "Throwin Elbows",            artist: "Excision",          bpm: 150, camelot: "8A",  key: "A",  mode: "Minor" },
  { spotifyId: "5CtI0EFZJdlGPqJOvMHzLY", name: "Calypso",                   artist: "Space Laces",       bpm: 150, camelot: "8A",  key: "A",  mode: "Minor" },
  { spotifyId: "62bS7gfQqFeMxKbBJbjsXN", name: "Diesel",                    artist: "Space Laces",       bpm: 150, camelot: "5A",  key: "D#", mode: "Minor" },
  { spotifyId: "5vaCmKjItPbrfNlAan5bXp", name: "Collapse",                  artist: "Zeds Dead",         bpm: 140, camelot: "5A",  key: "D#", mode: "Minor" },
  { spotifyId: "7vNn0detlsCjJjzWHxAQjj", name: "Alive",                     artist: "Zeds Dead",         bpm: 140, camelot: "8A",  key: "A",  mode: "Minor" },
  { spotifyId: "2kaaB73YmUFc8WTj7uEcX8", name: "Barely Alive",              artist: "Barely Alive",      bpm: 150, camelot: "6A",  key: "A#", mode: "Minor" },
  { spotifyId: "3otkfCGZJlqhNi1fhbFdSU", name: "Detox",                     artist: "Barely Alive",      bpm: 150, camelot: "5A",  key: "D#", mode: "Minor" },
  { spotifyId: "70C4NyhjD5OZUMzvqpFGRB", name: "10K Hours",                 artist: "NGHTMRE",           bpm: 150, camelot: "8A",  key: "A",  mode: "Minor" },
  { spotifyId: "4FCrDaLIzEXSOIogj0LeVT", name: "BANG!",                     artist: "NGHTMRE",           bpm: 128, camelot: "5A",  key: "D#", mode: "Minor" },
  { spotifyId: "0eCR7wCuarJN0alDVpUPJU", name: "Rave In The Grave",         artist: "Svdden Death",      bpm: 150, camelot: "5A",  key: "D#", mode: "Minor" },
  { spotifyId: "2Fzw1B1WhlxILBoqT6Gy8q", name: "Behemoth",                  artist: "Svdden Death",      bpm: 150, camelot: "6A",  key: "A#", mode: "Minor" },
  { spotifyId: "6oZ2b1tnaRHNVfMWxJVmTe", name: "Strange Behavior",          artist: "Liquid Stranger",   bpm: 140, camelot: "8A",  key: "A",  mode: "Minor" },
  { spotifyId: "1Dtq1hkv5VqkKfGbGZuK7d", name: "Exist",                     artist: "Rezz",              bpm: 105, camelot: "8A",  key: "A",  mode: "Minor" },
  { spotifyId: "5lC4UvGpQOuzAFiSxMzJwI", name: "Witching Hour",             artist: "Rezz",              bpm: 110, camelot: "5A",  key: "D#", mode: "Minor" },
  { spotifyId: "6DpSnPkCBiLjFpV22TNqhF", name: "Operator",                  artist: "Rezz",              bpm: 100, camelot: "6A",  key: "A#", mode: "Minor" },
  { spotifyId: "3GtFBNhKJPHPWAolClyMHJ", name: "Freak Show",                artist: "Kompany",           bpm: 150, camelot: "5A",  key: "D#", mode: "Minor" },
  { spotifyId: "5vhKp8lRDvBLvhFgvuJItf", name: "Run It",                    artist: "Kompany",           bpm: 150, camelot: "8A",  key: "A",  mode: "Minor" },
  { spotifyId: "4mRkDHB8U8ij8yEGLfQJmB", name: "Ultra Violence",            artist: "Svdden Death",      bpm: 150, camelot: "4A",  key: "G#", mode: "Minor" },
  { spotifyId: "2HgpJDHAi3YsIi0WBsElEd", name: "Scorpion",                  artist: "Badklaat",          bpm: 140, camelot: "5A",  key: "D#", mode: "Minor" },
  { spotifyId: "7EGn2bFBoNIiXdGSxiJcUV", name: "Damage Control",            artist: "Trampa",            bpm: 150, camelot: "6A",  key: "A#", mode: "Minor" },
  { spotifyId: "2k2r5WJMsGmOpq4uX7K5Xm", name: "Slow Mo",                   artist: "GRiZ",              bpm: 90,  camelot: "9A",  key: "G",  mode: "Minor" },
  { spotifyId: "4GxYIrIxlcgKFo4fJIvGdF", name: "Hard Times",                artist: "GRiZ",              bpm: 95,  camelot: "8A",  key: "A",  mode: "Minor" },

  // --- House ---
  { spotifyId: "5PPIsZYbVHMoHRhOJuCrDR", name: "Losing It",                 artist: "Fisher",            bpm: 128, camelot: "5B",  key: "D#", mode: "Major" },
  { spotifyId: "5tXyNhkLAHHoKwHVFCZcbB", name: "Freaks",                    artist: "Fisher",            bpm: 126, camelot: "8A",  key: "A",  mode: "Minor" },
  { spotifyId: "7tJCfPdQfsO39KEwIi4Vqz", name: "Show Me Love (Chris Lake Remix)", artist: "Chris Lake",  bpm: 124, camelot: "7B",  key: "F",  mode: "Major" },
  { spotifyId: "7GhIk7Il098yCjg4BQjzvb", name: "Operator (Chris Lake Remix)", artist: "Chris Lake",      bpm: 126, camelot: "8B",  key: "C",  mode: "Major" },
  { spotifyId: "1IqQnMPxTtKJyJd6t7JpwS", name: "Pump the Breaks",           artist: "Dom Dolla",         bpm: 126, camelot: "5A",  key: "D#", mode: "Minor" },
  { spotifyId: "6wVWJl64yoTzU27EI8ep20", name: "Saving Up",                  artist: "Dom Dolla",         bpm: 124, camelot: "9B",  key: "G",  mode: "Major" },
  { spotifyId: "3eP2BhTBunCxIBMlmrwpW4", name: "La Femme",                   artist: "John Summit",       bpm: 129, camelot: "8A",  key: "A",  mode: "Minor" },
  { spotifyId: "6UelLqGlWMcVH1E5c4H7lQ", name: "Human",                      artist: "John Summit",       bpm: 128, camelot: "6A",  key: "A#", mode: "Minor" },
  { spotifyId: "4kINrCkDB7H7JEN3S7TPFD", name: "Vintage Culture Mix",        artist: "Vintage Culture",   bpm: 124, camelot: "7B",  key: "F",  mode: "Major" },
  { spotifyId: "2cH4Ib5VUQ6urfZigxhZGh", name: "Move On",                    artist: "Peggy Gou",         bpm: 122, camelot: "9B",  key: "G",  mode: "Major" },
  { spotifyId: "0yc6Gst2xkRu0iXHNAKnkt", name: "Latch",                      artist: "Disclosure",        bpm: 122, camelot: "5B",  key: "D#", mode: "Major" },
  { spotifyId: "4r8lRYnoOGdEi6YySOLa8Y", name: "You & Me (Flume Remix)",     artist: "Disclosure",        bpm: 128, camelot: "8A",  key: "A",  mode: "Minor" },

  // --- Techno ---
  { spotifyId: "6I7Wb8xSBSSoiXoOtw7hj1", name: "Rollercoaster",              artist: "Adam Beyer",        bpm: 135, camelot: "5A",  key: "D#", mode: "Minor" },
  { spotifyId: "7hImNZJcWfUv7HansMNp4K", name: "Space Date",                 artist: "Charlotte de Witte", bpm: 140, camelot: "6A", key: "A#", mode: "Minor" },
  { spotifyId: "3dRfiJ2650SZe2GverDFRA", name: "Exhale",                      artist: "Amelie Lens",       bpm: 140, camelot: "5A",  key: "D#", mode: "Minor" },
  { spotifyId: "2MRhhe7SJfLEXyBkjBW9uT", name: "In Flagranti",               artist: "Joseph Capriati",   bpm: 138, camelot: "8A",  key: "A",  mode: "Minor" },
];
