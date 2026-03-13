// ─────────────────────────────────────────────────────────────────────────────
// CatFu Dojo — Battle Generator
// Pure functions: no side effects, fully testable, easy to extend.
// ─────────────────────────────────────────────────────────────────────────────

import {
  ARENAS,
  SERIOUS_TITLES,
  CHAOTIC_TITLES,
  SERIOUS_OPENING_MOVES,
  CHAOTIC_OPENING_MOVES,
  SERIOUS_FINISHING_MOVES,
  CHAOTIC_FINISHING_MOVES,
  SERIOUS_ENDINGS,
  CHAOTIC_ENDINGS,
  SERIOUS_VERDICTS,
  CHAOTIC_VERDICTS,
  RARE_EVENTS,
  SENSEI_NAMES,
  SERIOUS_SENSEI_COMMENTS,
  CHAOTIC_SENSEI_COMMENTS,
  type RareEvent,
} from "./battleData";

import type { DojoMode } from "@/components/ModeToggle";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type BattleResult = {
  arena: string;
  fighter1Title: string;
  fighter2Title: string;
  /** Name of the winner (fighter1 or fighter2's raw name) */
  winner: string;
  loser: string;
  winnerTitle: string;
  openingMove1: string;
  openingMove2: string;
  finishingMove: string;
  endingLine: string;
  verdict: string;
  senseiName: string;
  senseiComment: string;
  rareEvent: RareEvent | null;
  mode: DojoMode;
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Pick a random element from any readonly or mutable array. */
export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Return true with probability `chance` (0–1). */
export function rollChance(chance: number): boolean {
  return Math.random() < chance;
}

/** Pick two DIFFERENT elements from the same array. */
export function pickTwo<T>(arr: readonly T[]): [T, T] {
  const first = pick(arr);
  let second = pick(arr);
  // Retry once to avoid identical picks (not guaranteed, but good enough for content)
  if (second === first && arr.length > 1) second = pick(arr);
  return [first, second];
}

// ─────────────────────────────────────────────────────────────────────────────
// Core generator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a complete battle result for two named fighters.
 * All randomness lives here — swap in a seeded RNG later if you need replays.
 */
export function generateBattle(
  fighter1Name: string,
  fighter2Name: string,
  mode: DojoMode
): BattleResult {
  const isSerious = mode === "serious";

  // Pool selectors based on mode
  const titles        = isSerious ? SERIOUS_TITLES        : CHAOTIC_TITLES;
  const openingMoves  = isSerious ? SERIOUS_OPENING_MOVES : CHAOTIC_OPENING_MOVES;
  const finishMoves   = isSerious ? SERIOUS_FINISHING_MOVES: CHAOTIC_FINISHING_MOVES;
  const endings       = isSerious ? SERIOUS_ENDINGS       : CHAOTIC_ENDINGS;

  // Titles (ensure different titles if possible)
  const [title1, title2] = pickTwo(titles);

  // Arena
  const arena = pick(ARENAS);

  // Opening moves (independent picks, can be same — chaos is authentic)
  const openingMove1 = pick(openingMoves);
  const openingMove2 = pick(openingMoves);

  // Finishing move (belongs to the winner)
  const finishingMove = pick(finishMoves);

  // Winner — 50/50 coin flip
  const fighter1Wins = rollChance(0.5);
  const winner       = fighter1Wins ? fighter1Name : fighter2Name;
  const loser        = fighter1Wins ? fighter2Name : fighter1Name;
  const winnerTitle  = fighter1Wins ? title1 : title2;

  // Ending line
  const endingLine = pick(endings)(winner);

  // Verdict badge
  const verdicts = isSerious ? SERIOUS_VERDICTS : CHAOTIC_VERDICTS;
  const verdict  = pick(verdicts);

  // Sensei comment — reacts to the actual winner/loser
  const senseiComments = isSerious ? SERIOUS_SENSEI_COMMENTS : CHAOTIC_SENSEI_COMMENTS;
  const senseiComment  = pick(senseiComments)(winner, loser);
  const senseiName     = pick(SENSEI_NAMES);

  // Rare event — 15% chance in serious, 30% in chaotic
  const rareEventChance = isSerious ? 0.15 : 0.30;
  const rareEvent = rollChance(rareEventChance) ? pick(RARE_EVENTS) : null;

  return {
    arena,
    fighter1Title: title1,
    fighter2Title: title2,
    winner,
    loser,
    winnerTitle,
    openingMove1,
    openingMove2,
    finishingMove,
    endingLine,
    verdict,
    senseiName,
    senseiComment,
    rareEvent,
    mode,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Narrative formatter
// Converts a BattleResult into the display string shown in ResultCard.
// Keep formatting logic here — ResultCard stays presentational.
// ─────────────────────────────────────────────────────────────────────────────

export function formatBattleNarrative(
  result: BattleResult,
  fighter1Name: string,
  fighter2Name: string
): string {
  const {
    arena,
    fighter1Title,
    fighter2Title,
    winner,
    winnerTitle,
    openingMove1,
    openingMove2,
    finishingMove,
    endingLine,
    rareEvent,
  } = result;

  const f1 = `${fighter1Title} ${fighter1Name}`;
  const f2 = `${fighter2Title} ${fighter2Name}`;

  const lines: string[] = [
    `The dojo fell silent as ${f1} squared off against ${f2} in ${arena}.`,
    "",
    `${fighter1Name} ${openingMove1}, while ${fighter2Name} ${openingMove2}.`,
    "",
    `After a clash that shook the very foundations of the ancient dojo, `
      + `${winnerTitle} ${winner} delivered the decisive blow — `
      + `the legendary ${finishingMove}.`,
    "",
    endingLine,
  ];

  // Note: rareEvent description is rendered directly in ResultCard — not needed in narrative string

  return lines.join("\n");
}
