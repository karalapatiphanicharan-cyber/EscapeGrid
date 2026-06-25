import { describe, it, expect } from 'vitest';
import { generateMaze } from './mazeGenerator';

describe('mazeGenerator', () => {
  it('should generate a maze of the correct size', () => {
    const size = 10;
    const maze = generateMaze(size);
    expect(maze.length).toBe(size);
    expect(maze[0].length).toBe(size);
  });

  it('should have a start and an exit', () => {
    const size = 10;
    const maze = generateMaze(size);
    expect(maze[0][0].isStart).toBe(true);
    expect(maze[size - 1][size - 1].isExit).toBe(true);
  });

  it('should visit all cells (meaning it connected them)', () => {
    const size = 5;
    const maze = generateMaze(size);
    const allVisited = maze.every(row => row.every(cell => cell.visited));
    expect(allVisited).toBe(true);
  });
});
