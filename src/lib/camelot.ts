// Camelot wheel compatibility logic.
// The wheel has 12 positions (1–12) and two tracks:
//   A = minor, B = major
//
// Compatible keys for mixing (by DJ convention):
//   - Same code (perfect match)
//   - ±1 position, same letter (energy shift)
//   - Same position, opposite letter (relative major/minor)

export interface CamelotCode {
  num: number;   // 1–12
  letter: "A" | "B";
}

// Returns null for invalid or unknown codes (e.g. "?").
export function parseCamelot(code: string): CamelotCode | null {
  const match = code.match(/^(\d{1,2})([AB])$/i);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  if (num < 1 || num > 12) return null;
  return { num, letter: match[2].toUpperCase() as "A" | "B" };
}

function formatCamelot({ num, letter }: CamelotCode): string {
  return `${num}${letter}`;
}

// Wraps position within the 1–12 range.
function wrap(n: number): number {
  if (n < 1) return n + 12;
  if (n > 12) return n - 12;
  return n;
}

// Returns all Camelot codes that are harmonically compatible with the input.
// Returns an empty array for invalid input.
export function getCompatibleCamelotCodes(code: string): string[] {
  const parsed = parseCamelot(code);
  if (!parsed) return [];

  const { num, letter } = parsed;
  const opposite: "A" | "B" = letter === "A" ? "B" : "A";

  return [
    formatCamelot({ num, letter }),               // same key
    formatCamelot({ num: wrap(num - 1), letter }), // -1, same letter
    formatCamelot({ num: wrap(num + 1), letter }), // +1, same letter
    formatCamelot({ num, letter: opposite }),       // same number, opposite letter
  ];
}
