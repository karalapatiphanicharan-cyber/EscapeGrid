import { describe, it, expect } from 'vitest';
import { spawnPowerUps, validatePowerUpsReachability } from './powerUpLogic';
import { Maze, Position, PowerUp } from './types';

describe('powerUpLogic', () => {
  const mockMaze: Maze = Array(10).fill(null).map((_, y) =>
    Array(10).fill(null).map((_, x) => ({
      x, y, visited: true, isStart: x === 0 && y === 0, isExit: x === 9 && y === 9,
      walls: { top: false, right: false, bottom: false, left: false }
    }))
  );

  it('spawns the correct number of power-ups', () => {
    const powerUps = spawnPowerUps(mockMaze, 'easy', { x: 0, y: 0 }, [], []);
    expect(powerUps.length).toBe(2);
  });

  it('does not spawn power-ups on occupied positions', () => {
    const playerPos = { x: 0, y: 0 };
    const enemyPos = [{ x: 1, y: 1 }];
    const coinPos = [{ x: 2, y: 2 }];
    const powerUps = spawnPowerUps(mockMaze, 'easy', playerPos, enemyPos, coinPos);

    const occupied = new Set(['0,0', '9,9', '1,1', '2,2']);
    powerUps.forEach(pu => {
      expect(occupied.has(`${pu.position.x},${pu.position.y}`)).toBe(false);
    });
  });

  it('validates reachability of power-ups', () => {
    const powerUps: PowerUp[] = [
      { id: '1', type: 'shield', position: { x: 1, y: 1 }, collected: false },
      { id: '2', type: 'freeze', position: { x: 2, y: 2 }, collected: false }
    ];

    expect(validatePowerUpsReachability(mockMaze, { x: 0, y: 0 }, powerUps)).toBe(true);

    // Create a blocked maze
    const blockedMaze = JSON.parse(JSON.stringify(mockMaze));
    blockedMaze[0][0].walls.right = true;
    blockedMaze[0][0].walls.bottom = true;

    expect(validatePowerUpsReachability(blockedMaze, { x: 0, y: 0 }, powerUps)).toBe(false);
  });
});
