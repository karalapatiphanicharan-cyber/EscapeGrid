import { describe, it, expect } from 'vitest';
import { findShortestPath } from './pathfinder';
import { Maze, Position } from './types';

describe('pathfinder', () => {
  const mockMaze: Maze = Array(5).fill(null).map((_, y) =>
    Array(5).fill(null).map((_, x) => ({
      x, y, visited: true, isStart: x === 0 && y === 0, isExit: x === 4 && y === 4,
      walls: { top: false, right: false, bottom: false, left: false }
    }))
  );

  it('finds the shortest path in an open maze', () => {
    const start = { x: 0, y: 0 };
    const target = { x: 2, y: 0 };
    const path = findShortestPath(mockMaze, start, target);

    expect(path).toHaveLength(2);
    expect(path[0]).toEqual({ x: 1, y: 0 });
    expect(path[1]).toEqual({ x: 2, y: 0 });
  });

  it('respects walls', () => {
    const mazeWithWalls = JSON.parse(JSON.stringify(mockMaze));
    // Block (0,0) -> (1,0)
    mazeWithWalls[0][0].walls.right = true;
    mazeWithWalls[0][1].walls.left = true;

    const start = { x: 0, y: 0 };
    const target = { x: 1, y: 0 };
    const path = findShortestPath(mazeWithWalls, start, target);

    // Should go around: (0,0) -> (0,1) -> (1,1) -> (1,0)
    expect(path).toHaveLength(3);
    expect(path[0]).toEqual({ x: 0, y: 1 });
    expect(path[1]).toEqual({ x: 1, y: 1 });
    expect(path[2]).toEqual({ x: 1, y: 0 });
  });

  it('returns empty array if no path exists', () => {
    const blockedMaze = JSON.parse(JSON.stringify(mockMaze));
    blockedMaze[0][0].walls.right = true;
    blockedMaze[0][0].walls.bottom = true;

    const start = { x: 0, y: 0 };
    const target = { x: 4, y: 4 };
    const path = findShortestPath(blockedMaze, start, target);

    expect(path).toHaveLength(0);
  });
});
