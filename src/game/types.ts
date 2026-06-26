export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  x: number;
  y: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
  isStart: boolean;
  isExit: boolean;
}

export type Maze = Cell[][];

export type EnemyType = 'scout' | 'hunter' | 'sentinel';
export type EnemyMode = 'random' | 'tracking' | 'bfs-hunter';
export type EnemyState = 'searching' | 'tracking' | 'pursuing';

export interface Enemy {
  id: string;
  type: EnemyType;
  position: Position;
  prevPosition?: Position;
  mode: EnemyMode;
  state: EnemyState;
  speed: number;
  color: string;
}

export interface GameState {
  maze: Maze;
  playerPosition: Position;
  difficulty: Difficulty;
  moves: number;
  status: 'playing' | 'won' | 'lost' | 'idle';
  startTime: number | null;
  endTime: number | null;
  enemies: Enemy[];
  enemyEnabled: boolean;
  capturedBy?: EnemyType;
}

export interface BestTime {
  difficulty: Difficulty;
  time: number;
  moves: number;
  date: string;
}
