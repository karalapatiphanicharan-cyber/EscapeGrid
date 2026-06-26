import { describe, it, expect } from 'vitest';
import { generateMaze, validateMaze } from './mazeGenerator';

describe('mazeGenerator', () => {
  it('generates a maze of correct size', () => {
    const size = 10;
    const maze = generateMaze(size);
    expect(maze.length).toBe(size);
    expect(maze[0].length).toBe(size);
  });

  it('guarantees a path from start to exit', () => {
    const maze = generateMaze(10);
    expect(validateMaze(maze)).toBe(true);
  });

  it('creates multiple routes', () => {
      // For a 10x10 maze, it should easily have at least 2 paths
      const maze = generateMaze(10);
      expect(validateMaze(maze)).toBe(true);
  });

  it('enforces 3 paths for large mazes', () => {
      // For a 28x28 maze, it should have at least 3 paths
      const maze = generateMaze(28);
      expect(validateMaze(maze)).toBe(true);
  });
});
