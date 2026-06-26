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

export type PowerUpType = 'shield' | 'freeze' | 'speed';

export interface PowerUp {
  id: string;
  type: PowerUpType;
  position: Position;
  collected: boolean;
}

export interface ActivePowerUp {
  type: PowerUpType;
  endTime: number;
}

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

export interface Coin {
  id: string;
  position: Position;
  collected: boolean;
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
  coins: Coin[];
  powerUps: PowerUp[];
  activePowerUps: ActivePowerUp[];
  assistantPath: Position[];
  assistantType: 'hint' | 'full' | null;
  assistantEndTime: number | null;
  exploredCells: Set<string>;
  score: number;
  enemyEnabled: boolean;
  coinsEnabled: boolean;
  powerUpsEnabled: boolean;
  aiAssistEnabled: boolean;
  fogOfWarEnabled: boolean;
  gameId: string;
  capturedBy?: EnemyType;
}

export interface BestTime {
  difficulty: Difficulty;
  time: number;
  moves: number;
  score?: number;
  coins?: number;
  date: string;
}
