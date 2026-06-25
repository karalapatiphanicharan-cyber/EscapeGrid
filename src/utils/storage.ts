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
    if (newBest.time < currentBests[existingIndex].time) {
      currentBests[existingIndex] = newBest;
    }
  } else {
    currentBests.push(newBest);
  }

  localStorage.setItem(BEST_TIMES_KEY, JSON.stringify(currentBests));
};

export const getBestTimeForDifficulty = (difficulty: Difficulty): BestTime | undefined => {
  return getBestTimes().find((b) => b.difficulty === difficulty);
};
