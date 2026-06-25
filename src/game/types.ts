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

export interface GameState {
  maze: Maze;
  playerPosition: Position;
  difficulty: Difficulty;
  moves: number;
  status: 'playing' | 'won' | 'idle';
  startTime: number | null;
  endTime: number | null;
}

export interface BestTime {
  difficulty: Difficulty;
  time: number;
  moves: number;
  date: string;
}
