import { Position, Maze, EnemyMode } from './types';

export const getValidMoves = (pos: Position, maze: Maze): Position[] => {
  const moves: Position[] = [];
  const cell = maze[pos.y][pos.x];

  if (!cell.walls.top) moves.push({ x: pos.x, y: pos.y - 1 });
  if (!cell.walls.right) moves.push({ x: pos.x + 1, y: pos.y });
  if (!cell.walls.bottom) moves.push({ x: pos.x, y: pos.y + 1 });
  if (!cell.walls.left) moves.push({ x: pos.x - 1, y: pos.y });

  return moves;
};

export const getRandomMove = (pos: Position, maze: Maze): Position => {
  const moves = getValidMoves(pos, maze);
  return moves[Math.floor(Math.random() * moves.length)] || pos;
};

export const getGreedyMove = (current: Position, target: Position, maze: Maze): Position => {
  const moves = getValidMoves(current, maze);
  if (moves.length === 0) return current;

  // Sometimes take a random move to be "semi-intelligent" (Medium)
  if (Math.random() < 0.2) return moves[Math.floor(Math.random() * moves.length)];

  return moves.reduce((best, move) => {
    const dist = Math.abs(move.x - target.x) + Math.abs(move.y - target.y);
    const bestDist = Math.abs(best.x - target.x) + Math.abs(best.y - target.y);
    return dist < bestDist ? move : best;
  }, moves[0]);
};

export const getBFSMove = (start: Position, target: Position, maze: Maze): Position => {
  const queue: { pos: Position; path: Position[] }[] = [{ pos: start, path: [] }];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;

    if (pos.x === target.x && pos.y === target.y) {
      return path[0] || start;
    }

    const moves = getValidMoves(pos, maze);
    for (const move of moves) {
      const key = `${move.x},${move.y}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ pos: move, path: [...path, move] });
      }
    }
  }

  return start;
};

export const getNextEnemyPosition = (
  enemyPos: Position,
  playerPos: Position,
  maze: Maze,
  mode: EnemyMode
): Position => {
  switch (mode) {
    case 'random':
      return getRandomMove(enemyPos, maze);
    case 'tracking':
      return getGreedyMove(enemyPos, playerPos, maze);
    case 'bfs-hunter':
      return getBFSMove(enemyPos, playerPos, maze);
    default:
      return enemyPos;
  }
};
