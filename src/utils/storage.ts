import { BestTime, Difficulty } from '../game/types';

const BEST_TIMES_KEY = 'escape_grid_best_times';

export const getBestTimes = (): BestTime[] => {
  const stored = localStorage.getItem(BEST_TIMES_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveBestTime = (newBest: BestTime) => {
  const currentBests = getBestTimes();
  const existingIndex = currentBests.findIndex((b) => b.difficulty === newBest.difficulty);

  if (existingIndex > -1) {
    const existing = currentBests[existingIndex];
    // Keep best time
    if (newBest.time < existing.time) {
      existing.time = newBest.time;
      existing.moves = newBest.moves;
      existing.date = newBest.date;
    }
    // Keep high score
    if (newBest.score !== undefined && (existing.score === undefined || newBest.score > existing.score)) {
      existing.score = newBest.score;
    }
    // Keep most coins
    if (newBest.coins !== undefined && (existing.coins === undefined || newBest.coins > existing.coins)) {
      existing.coins = newBest.coins;
    }
    currentBests[existingIndex] = existing;
  } else {
    currentBests.push(newBest);
  }

  localStorage.setItem(BEST_TIMES_KEY, JSON.stringify(currentBests));
};

export const getBestTimeForDifficulty = (difficulty: Difficulty): BestTime | undefined => {
  return getBestTimes().find((b) => b.difficulty === difficulty);
};
