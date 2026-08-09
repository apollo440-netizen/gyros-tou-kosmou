/**
 * Σύστημα βαθμολόγησης — καθαρές συναρτήσεις, ανεξάρτητες από το UI,
 * ώστε οι κανόνες να αλλάζουν εύκολα στο μέλλον.
 */

export const BASE_POINTS = 100;
export const STREAK_BONUS_PER_STEP = 10;
export const MAX_STREAK_BONUS_STEPS = 10;
export const MAX_TIME_BONUS = 50;
/** Μέσα σε πόσο χρόνο (ms) δίνεται το πλήρες μπόνους ταχύτητας */
export const TIME_BONUS_WINDOW_MS = 10_000;

export interface ScoreBreakdown {
  base: number;
  streakBonus: number;
  timeBonus: number;
  total: number;
}

/**
 * @param streakBefore το σερί ΠΡΙΝ από αυτή την απάντηση
 * @param timeMs χρόνος απάντησης σε ms
 */
export function scoreCorrectAnswer(streakBefore: number, timeMs: number): ScoreBreakdown {
  const base = BASE_POINTS;
  const streakSteps = Math.min(streakBefore, MAX_STREAK_BONUS_STEPS);
  const streakBonus = streakSteps * STREAK_BONUS_PER_STEP;
  const remaining = Math.max(0, TIME_BONUS_WINDOW_MS - Math.max(0, timeMs));
  const timeBonus = Math.round((remaining / TIME_BONUS_WINDOW_MS) * MAX_TIME_BONUS);
  return { base, streakBonus, timeBonus, total: base + streakBonus + timeBonus };
}

export function scoreWrongAnswer(): ScoreBreakdown {
  return { base: 0, streakBonus: 0, timeBonus: 0, total: 0 };
}

/** Μορφοποίηση πόντων με ελληνικό διαχωριστικό χιλιάδων: 1.450 */
export function formatScore(points: number): string {
  return points.toLocaleString('el-GR');
}
