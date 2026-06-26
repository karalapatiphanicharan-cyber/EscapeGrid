import { Maze, Position, PowerUp, PowerUpType, Difficulty } from './types';
import { DIFFICULTIES } from './constants';

export const spawnPowerUps = (
  maze: Maze,
  difficulty: Difficulty,
  playerPos: Position,
  enemyPositions: Position[],
  coins: Position[]
): PowerUp[] => {
  const size = maze.length;
  const powerUps: PowerUp[] = [];
  const count = DIFFICULTIES[difficulty].powerUpCount;
  const exitPos = { x: size - 1, y: size - 1 };

  const occupied = new Set<string>();
  occupied.add(`${playerPos.x},${playerPos.y}`);
  occupied.add(`${exitPos.x},${exitPos.y}`);
  enemyPositions.forEach(p => occupied.add(`${p.x},${p.y}`));
  coins.forEach(p => occupied.add(`${p.x},${p.y}`));

  const types: PowerUpType[] = ['shield', 'freeze', 'speed'];

  for (let i = 0; i < count; i++) {
    let x, y;
    let attempts = 0;
    let found = false;

    while (attempts < 200) {
      attempts++;
      x = Math.floor(Math.random() * size);
      y = Math.floor(Math.random() * size);

      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        found = true;
        break;
      }
    }

    if (found) {
      occupied.add(`${x!},${y!}`);
      powerUps.push({
        id: `powerup-${i}-${Date.now()}`,
        type: types[i % types.length],
        position: { x: x!, y: y! },
        collected: false,
      });
    }
  }

  return powerUps;
};

export const validatePowerUpsReachability = (maze: Maze, startPos: Position, powerUps: PowerUp[]): boolean => {
  const size = maze.length;
  const powerUpPositions = powerUps.map(p => p.position);
  if (powerUpPositions.length === 0) return true;

  const queue: Position[] = [startPos];
  const visited = new Set<string>();
  visited.add(`${startPos.x},${startPos.y}`);

  const reached = new Set<string>();

  while (queue.length > 0) {
    const pos = queue.shift()!;

    if (powerUpPositions.some(p => p.x === pos.x && p.y === pos.y)) {
      reached.add(`${pos.x},${pos.y}`);
    }

    if (reached.size === powerUpPositions.length) return true;

    const cell = maze[pos.y][pos.x];
    const neighbors: Position[] = [];
    if (!cell.walls.top && pos.y > 0) neighbors.push({ x: pos.x, y: pos.y - 1 });
    if (!cell.walls.right && pos.x < size - 1) neighbors.push({ x: pos.x + 1, y: pos.y });
    if (!cell.walls.bottom && pos.y < size - 1) neighbors.push({ x: pos.x, y: pos.y + 1 });
    if (!cell.walls.left && pos.x > 0) neighbors.push({ x: pos.x - 1, y: pos.y });

    for (const next of neighbors) {
      const key = `${next.x},${next.y}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push(next);
      }
    }
  }

  return reached.size === powerUpPositions.length;
};
