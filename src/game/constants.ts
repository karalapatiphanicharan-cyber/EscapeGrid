import { Difficulty } from './types';

export const DIFFICULTIES: Record<Difficulty, { size: number; label: string }> = {
  easy: {
    size: 10,
    label: 'Easy',
  },
  medium: {
    size: 20,
    label: 'Medium',
  },
  hard: {
    size: 35,
    label: 'Hard',
  },
};

export const CELL_SIZE = 20;
export const WALL_THICKNESS = 2;

export const COLORS = {
  background: '#0a0a0c',
  wall: '#1e293b',
  path: '#0f172a',
  player: '#22d3ee', // Cyan-400
  exit: '#a855f7', // Purple-500
  accent: '#22d3ee',
  secondary: '#a855f7',
};
