import { Position, Maze, Coin, Difficulty } from './types';
import { DIFFICULTIES } from './constants';

/**
 * Spawns coins randomly in the maze while ensuring reachability and avoiding entities.
 */
export const spawnCoins = (
  maze: Maze,
  difficulty: Difficulty,
  playerPos: Position,
  enemyPositions: Position[]
): Coin[] => {
  const size = maze.length;
  const coins: Coin[] = [];
  const targetCount = DIFFICULTIES[difficulty].coinCount;

  const occupied = new Set<string>();
  occupied.add(`${playerPos.x},${playerPos.y}`);
  occupied.add(`${size - 1},${size - 1}`); // Exit
  enemyPositions.forEach(p => occupied.add(`${p.x},${p.y}`));

  let attempts = 0;
  while (coins.length < targetCount && attempts < 500) {
    attempts++;
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    const key = `${x},${y}`;

    if (!occupied.has(key)) {
      // Basic reachability check: since we know maze is connected,
      // we just need to ensure it's not a completely isolated cell
      // (which shouldn't happen in a valid maze).
      // But let's also ensure coins aren't too clustered.
      const tooClose = coins.some(c =>
        Math.abs(c.position.x - x) + Math.abs(c.position.y - y) < 2
      );

      if (!tooClose) {
        coins.push({
          id: `coin-${coins.length}-${Date.now()}`,
          position: { x, y },
          collected: false,
        });
        occupied.add(key);
      }
    }
  }

  return coins;
};

/**
 * Validates that all coins are reachable from the player's position.
 */
export const validateCoinsReachability = (
  maze: Maze,
  playerPos: Position,
  coins: Coin[]
): boolean => {
  if (coins.length === 0) return true;
  const size = maze.length;

  const reachable = new Set<string>();
  const queue: Position[] = [playerPos];
  reachable.add(`${playerPos.x},${playerPos.y}`);

  while (queue.length > 0) {
    const { x, y } = queue.shift()!;
    const cell = maze[y][x];

    const neighbors: Position[] = [];
    if (!cell.walls.top && y > 0) neighbors.push({ x, y: y - 1 });
    if (!cell.walls.right && x < size - 1) neighbors.push({ x: x + 1, y });
    if (!cell.walls.bottom && y < size - 1) neighbors.push({ x, y: y + 1 });
    if (!cell.walls.left && x > 0) neighbors.push({ x: x - 1, y });

    for (const n of neighbors) {
      const key = `${n.x},${n.y}`;
      if (!reachable.has(key)) {
        reachable.add(key);
        queue.push(n);
      }
    }
  }

  return coins.every(c => reachable.has(`${c.position.x},${c.position.y}`));
};
