// Scene detection — pure data, no API calls.
//
// Used by the recommendation engine to bias Spotify search queries toward
// artists in the same stylistic scene as the source track's primary artist.
//
// To extend: add entries to SCENE_MAP and RELATED_ARTISTS below.

export type Scene = "bass" | "house" | "techno" | "trap" | "unknown";

// ---------------------------------------------------------------------------
// Artist → scene
// All keys are lowercased for case-insensitive lookup.
// ---------------------------------------------------------------------------

const SCENE_MAP: Record<string, Scene> = {
  // Bass / dubstep / riddim
  "wooli":              "bass",
  "excision":           "bass",
  "subtronics":         "bass",
  "space laces":        "bass",
  "zeds dead":          "bass",
  "barely alive":       "bass",
  "liquid stranger":    "bass",
  "nghtmre":            "bass",
  "svdden death":       "bass",
  "griz":               "bass",
  "rezz":               "bass",
  "badklaat":           "bass",
  "trampa":             "bass",
  "kompany":            "bass",
  "eliminate":          "bass",
  "hydraulix":          "bass",

  // House
  "fisher":             "house",
  "chris lake":         "house",
  "dom dolla":          "house",
  "john summit":        "house",
  "claptone":           "house",
  "vintage culture":    "house",
  "meduza":             "house",
  "black coffee":       "house",
  "peggy gou":          "house",
  "disclosure":         "house",
  "joy anonymous":      "house",

  // Techno
  "adam beyer":         "techno",
  "charlotte de witte": "techno",
  "amelie lens":        "techno",
  "joseph capriati":    "techno",
  "rebekah":            "techno",
  "jamie jones":        "techno",
  "len faki":           "techno",

  // Trap (electronic / festival)
  "flosstradamus":      "trap",
  "ookay":              "trap",
  "baauer":             "trap",
  "carnage":            "trap",
  "valentino khan":     "trap",
  "jauz":               "trap",
};

// ---------------------------------------------------------------------------
// Artist → related artists in same scene
// Used as primary Spotify search seeds before falling back to generic queries.
// ---------------------------------------------------------------------------

const RELATED_ARTISTS: Record<string, string[]> = {
  "wooli":           ["Excision", "Subtronics", "Space Laces", "Zeds Dead", "Barely Alive", "NGHTMRE"],
  "excision":        ["Wooli", "Space Laces", "Subtronics", "Liquid Stranger", "Zeds Dead"],
  "subtronics":      ["Wooli", "Excision", "Svdden Death", "Space Laces", "Rezz"],
  "space laces":     ["Excision", "Wooli", "Subtronics", "Barely Alive"],
  "zeds dead":       ["Wooli", "GRiZ", "Liquid Stranger", "NGHTMRE"],
  "rezz":            ["Subtronics", "Wooli", "Space Laces", "Liquid Stranger"],
  "nghtmre":         ["Wooli", "Zeds Dead", "Jauz", "GRiZ"],
  "griz":            ["Zeds Dead", "NGHTMRE", "Liquid Stranger", "GRiZ"],

  "fisher":          ["Chris Lake", "Dom Dolla", "John Summit", "Vintage Culture"],
  "chris lake":      ["Fisher", "Dom Dolla", "John Summit", "Claptone"],
  "dom dolla":       ["Fisher", "Chris Lake", "John Summit", "Vintage Culture"],
  "john summit":     ["Fisher", "Chris Lake", "Dom Dolla", "Meduza"],

  "adam beyer":      ["Charlotte de Witte", "Amelie Lens", "Joseph Capriati", "Len Faki"],
  "charlotte de witte": ["Adam Beyer", "Amelie Lens", "Rebekah", "Joseph Capriati"],
  "amelie lens":     ["Charlotte de Witte", "Adam Beyer", "Rebekah"],
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function detectScene(artistName: string): Scene {
  return SCENE_MAP[artistName.toLowerCase()] ?? "unknown";
}

// Returns a list of related artist names to use as search seeds.
// Returns an empty array if no mapping exists.
export function getRelatedArtists(artistName: string): string[] {
  return RELATED_ARTISTS[artistName.toLowerCase()] ?? [];
}
