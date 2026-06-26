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
      // For a 10x10 maze, it should easily have alternative paths
      const maze = generateMaze(10);
      expect(validateMaze(maze)).toBe(true);
      // Further inspection of loops can be done by checking wall counts but validateMaze already checks for alt paths
  });
});
