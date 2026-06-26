import { describe, it, expect } from 'vitest';
import { spawnCoins, validateCoinsReachability } from './coinLogic';
import { Maze, Cell } from './types';

const createMockMaze = (size: number): Maze => {
  const maze: Maze = [];
  for (let y = 0; y < size; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < size; x++) {
      row.push({
        x,
        y,
        walls: { top: false, right: false, bottom: false, left: false },
        visited: true,
        isStart: x === 0 && y === 0,
        isExit: x === size - 1 && y === size - 1,
      });
    }
    maze.push(row);
  }
  return maze;
};

describe('coinLogic', () => {
  it('spawns the correct number of coins', () => {
    const maze = createMockMaze(10);
    const coins = spawnCoins(maze, 'easy', { x: 0, y: 0 }, []);
    expect(coins.length).toBe(5);
  });

  it('validates coin reachability', () => {
    const maze = createMockMaze(10);
    const coins = spawnCoins(maze, 'easy', { x: 0, y: 0 }, []);
    expect(validateCoinsReachability(maze, { x: 0, y: 0 }, coins)).toBe(true);
  });

  it('fails validation if coins are unreachable', () => {
    const maze = createMockMaze(5);
    // Block off (4,4)
    maze[4][4].walls = { top: true, right: true, bottom: true, left: true };
    maze[3][4].walls.bottom = true;
    maze[4][3].walls.right = true;

    const coins = [{ id: '1', position: { x: 4, y: 4 }, collected: false }];
    expect(validateCoinsReachability(maze, { x: 0, y: 0 }, coins)).toBe(false);
  });
});
