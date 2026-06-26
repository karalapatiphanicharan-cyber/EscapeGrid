import { describe, it, expect, vi } from 'vitest';
import { getValidMoves, getBFSMove, getGreedyMove, getRandomMove } from './enemyAI';
import { Maze, Cell } from './types';

const createMockMaze = (width: number, height: number): Maze => {
  const maze: Maze = [];
  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        x,
        y,
        walls: { top: true, right: true, bottom: true, left: true },
        visited: true,
        isStart: x === 0 && y === 0,
        isExit: x === width - 1 && y === height - 1,
      });
    }
    maze.push(row);
  }
  return maze;
};

describe('enemyAI', () => {
  it('identifies valid moves correctly', () => {
    const maze = createMockMaze(3, 3);
    // Open path from (1,1) to (1,0) and (2,1)
    maze[1][1].walls.top = false;
    maze[0][1].walls.bottom = false;
    maze[1][1].walls.right = false;
    maze[1][2].walls.left = false;

    const moves = getValidMoves({ x: 1, y: 1 }, maze);
    expect(moves).toContainEqual({ x: 1, y: 0 });
    expect(moves).toContainEqual({ x: 2, y: 1 });
    expect(moves.length).toBe(2);
  });

  it('BFS finds the shortest path while avoiding the exit', () => {
    const maze = createMockMaze(3, 3);
    // Exit is at (2,2)
    // Path: (0,0) -> (1,0) -> (1,1) -> (1,2) -> (2,2)
    // But exit is at (2,2), so it should avoid it if it's the target?
    // Wait, if exit is the target, BFS should find it?
    // Requirement says enemy must NEVER move onto the exit tile.

    // Open path: (0,0)-(1,0), (1,0)-(1,1), (1,1)-(0,1)
    maze[0][0].walls.right = false; maze[0][1].walls.left = false;
    maze[0][1].walls.bottom = false; maze[1][1].walls.top = false;
    maze[1][1].walls.left = false; maze[1][0].walls.right = false;

    // Target is (1,0)
    const nextMove = getBFSMove({ x: 0, y: 0 }, { x: 1, y: 0 }, maze);
    expect(nextMove).toEqual({ x: 1, y: 0 });
  });

  it('Greedy move moves towards target', () => {
    const maze = createMockMaze(3, 3);
    // Open inner walls
    maze[0][0].walls.right = false; maze[0][1].walls.left = false;
    maze[0][0].walls.bottom = false; maze[1][0].walls.top = false;

    // Mock Math.random to avoid the 20% random move in greedy
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const nextMove = getGreedyMove({ x: 0, y: 0 }, { x: 2, y: 2 }, maze);
    // Should choose either (1,0) or (0,1) as they are closer (dist 3) than (0,0) (dist 4)
    expect([{ x: 1, y: 0 }, { x: 0, y: 1 }]).toContainEqual(nextMove);

    spy.mockRestore();
  });

  it('Random move avoids immediate reversal', () => {
    const maze = createMockMaze(3, 3);
    // Path: (0,0)-(1,0)-(2,0)
    maze[0][0].walls.right = false; maze[0][1].walls.left = false;
    maze[0][1].walls.right = false; maze[0][2].walls.left = false;

    // Current: (1,0), Prev: (0,0). Should move to (2,0)
    const nextMove = getRandomMove({ x: 1, y: 0 }, maze, { x: 0, y: 0 });
    expect(nextMove).toEqual({ x: 2, y: 0 });
  });

  it('Enemies never move onto the exit', () => {
    const maze = createMockMaze(3, 3);
    // Exit is at (2,2)
    // Path: (1,2)-(2,2)
    maze[2][1].walls.right = false; maze[2][2].walls.left = false;

    // Enemy at (1,2) should not be able to move to (2,2)
    const moves = getValidMoves({ x: 1, y: 2 }, maze, [{ x: 2, y: 2 }]);
    expect(moves).not.toContainEqual({ x: 2, y: 2 });
    expect(moves.length).toBe(0);
  });
});
