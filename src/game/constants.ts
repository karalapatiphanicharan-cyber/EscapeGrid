import { Difficulty, EnemyType } from './types';

export const DIFFICULTIES: Record<Difficulty, { size: number; label: string; enemyCount: number; coinCount: number; powerUpCount: number }> = {
  easy: {
    size: 10,
    label: 'Easy',
    enemyCount: 1,
    coinCount: 5,
    powerUpCount: 2,
  },
  medium: {
    size: 20,
    label: 'Medium',
    enemyCount: 2,
    coinCount: 8,
    powerUpCount: 3,
  },
  hard: {
    size: 28,
    label: 'Hard',
    enemyCount: 3,
    coinCount: 12,
    powerUpCount: 4,
  },
};

export const SCORING = {
  COIN_VALUE: 10,
  EXIT_VALUE: 100,
  PERFECT_BONUS: 50,
};

export const WALL_THICKNESS = 2;

export const COLORS = {
  background: '#0a0a0c',
  wall: '#1e293b',
  path: '#0f172a',
  player: '#22d3ee', // Cyan-400
  exit: '#a855f7', // Purple-500
  coin: '#fbbf24', // Amber-400
  accent: '#22d3ee',
  secondary: '#a855f7',
  enemyScout: '#f97316', // Orange-500
  enemyHunter: '#ef4444', // Red-500
  enemySentinel: '#d946ef', // Fuchsia-500
  powerUpShield: '#3b82f6', // Blue-500
  powerUpFreeze: '#06b6d4', // Cyan-500
  powerUpSpeed: '#facc15', // Yellow-400
};

import { PowerUpType } from './types';

export const POWER_UP_CONFIG: Record<PowerUpType, { duration: number; color: string; label: string }> = {
  shield: {
    duration: 0, // Instant/until consumed
    color: COLORS.powerUpShield,
    label: 'Shield',
  },
  freeze: {
    duration: 3000,
    color: COLORS.powerUpFreeze,
    label: 'Freeze Drones',
  },
  speed: {
    duration: 5000,
    color: COLORS.powerUpSpeed,
    label: 'Speed Boost',
  },
};

export const ENEMY_CONFIG: Record<EnemyType, { speed: number; color: string }> = {
  scout: {
    speed: 800, // Slow for Easy
    color: COLORS.enemyScout,
  },
  hunter: {
    speed: 400, // Fast for Hard
    color: COLORS.enemyHunter,
  },
  sentinel: {
    speed: 600, // Medium for Medium
    color: COLORS.enemySentinel,
  },
};

export const MIN_SPAWN_DISTANCE = 5;

export const AI_ASSIST_CONFIG = {
  HINT_DURATION: 2000,
  FULL_PATH_DURATION: 4000,
  HINT_LENGTH: 5,
};
