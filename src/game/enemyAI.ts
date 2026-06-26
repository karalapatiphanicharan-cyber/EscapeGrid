import { Position, Maze, EnemyMode } from './types';

/**
 * Returns valid adjacent positions while respecting walls.
 * Optionally excludes specific positions (e.g., the exit tile or other enemies).
 */
export const getValidMoves = (pos: Position, maze: Maze, exclude: Position[] = []): Position[] => {
  const cell = maze[pos.y][pos.x];

  const candidates: Position[] = [];
  if (!cell.walls.top) candidates.push({ x: pos.x, y: pos.y - 1 });
  if (!cell.walls.right) candidates.push({ x: pos.x + 1, y: pos.y });
  if (!cell.walls.bottom) candidates.push({ x: pos.x, y: pos.y + 1 });
  if (!cell.walls.left) candidates.push({ x: pos.x - 1, y: pos.y });

  return candidates.filter(cand =>
    !exclude.some(ex => ex.x === cand.x && ex.y === cand.y)
  );
};

/**
 * Returns the exit position in the maze.
 */
const getExitPosition = (maze: Maze): Position | null => {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x].isExit) return { x, y };
    }
  }
  return null;
};

/**
 * Random movement with improved behavior:
 * 1. Never enters the exit tile.
 * 2. Avoids immediate reversal (backtracking) unless trapped.
 */
export const getRandomMove = (pos: Position, maze: Maze, exclude: Position[], prevPos?: Position): Position => {
  const allMoves = getValidMoves(pos, maze, exclude);
  if (allMoves.length === 0) return pos;

  // Filter out the previous position to prevent oscillating behavior
  const forwardMoves = prevPos
    ? allMoves.filter(m => m.x !== prevPos.x || m.y !== prevPos.y)
    : allMoves;

  const targetMoves = forwardMoves.length > 0 ? forwardMoves : allMoves;
  return targetMoves[Math.floor(Math.random() * targetMoves.length)];
};

/**
 * Greedy movement that prioritizes distance to player but respects forbidden tiles.
 */
export const getGreedyMove = (current: Position, target: Position, maze: Maze, exclude: Position[]): Position => {
  const moves = getValidMoves(current, maze, exclude);
  if (moves.length === 0) return current;

  // Sometimes take a random move to be "semi-intelligent" (Medium)
  if (Math.random() < 0.2) return moves[Math.floor(Math.random() * moves.length)];

  return moves.reduce((best, move) => {
    const dist = Math.abs(move.x - target.x) + Math.abs(move.y - target.y);
    const bestDist = Math.abs(best.x - target.x) + Math.abs(best.y - target.y);
    return dist < bestDist ? move : best;
  }, moves[0]);
};

/**
 * BFS movement that finds the shortest path while respecting walls and forbidden tiles.
 */
export const getBFSMove = (start: Position, target: Position, maze: Maze, exclude: Position[]): Position => {
  // BFS queue stores current position and the first move taken to get there
  const queue: { pos: Position; firstMove: Position | null }[] = [{ pos: start, firstMove: null }];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const { pos, firstMove } = queue.shift()!;

    if (pos.x === target.x && pos.y === target.y) {
      return firstMove || start;
    }

    const moves = getValidMoves(pos, maze, exclude);
    for (const move of moves) {
      const key = `${move.x},${move.y}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({
          pos: move,
          firstMove: firstMove === null ? move : firstMove
        });
      }
    }
  }

  return start;
};

export const getNextEnemyPosition = (
  enemyPos: Position,
  prevEnemyPos: Position | undefined,
  otherEnemyPositions: Position[],
  playerPos: Position,
  maze: Maze,
  mode: EnemyMode
): Position => {
  const exitPos = getExitPosition(maze);
  const forbidden = exitPos ? [exitPos, ...otherEnemyPositions] : otherEnemyPositions;

  switch (mode) {
    case 'random':
      return getRandomMove(enemyPos, maze, forbidden, prevEnemyPos);
    case 'tracking':
      return getGreedyMove(enemyPos, playerPos, maze, forbidden);
    case 'bfs-hunter':
      return getBFSMove(enemyPos, playerPos, maze, forbidden);
    default:
      return enemyPos;
  }
};
