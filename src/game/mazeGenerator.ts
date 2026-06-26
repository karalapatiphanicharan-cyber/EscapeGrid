import { Cell, Maze, Position } from './types';

/**
 * Generates a randomized maze using recursive backtracking.
 * Guarantees a path exists from start to exit.
 * Adds loops to ensure multiple routes.
 */
export const generateMaze = (size: number): Maze => {
  // Initialize maze with all walls
  const maze: Maze = Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => ({
      x,
      y,
      walls: { top: true, right: true, bottom: true, left: true },
      visited: false,
      isStart: x === 0 && y === 0,
      isExit: x === size - 1 && y === size - 1,
    }))
  );

  const stack: Position[] = [];
  const startPos: Position = { x: 0, y: 0 };
  maze[0][0].visited = true;
  stack.push(startPos);

  // Core generation using recursive backtracking
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(current, maze, size);

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      removeWalls(current, next, maze);
      maze[next.y][next.x].visited = true;
      stack.push(next);
    } else {
      stack.pop();
    }
  }

  // Post-processing: Add loops to ensure multiple routes
  // For Hard mode (size >= 28), we want significantly more loops to ensure 3 paths
  const loopCount = size >= 28 ? Math.floor(size * 1.5) : Math.floor(size / 2);
  addLoops(maze, loopCount);

  return maze;
};

/**
 * Adds loops by removing random walls.
 */
const addLoops = (maze: Maze, count: number) => {
  const size = maze.length;
  let added = 0;
  let attempts = 0;

  while (added < count && attempts < count * 10) {
    attempts++;
    const x = Math.floor(Math.random() * (size - 2)) + 1;
    const y = Math.floor(Math.random() * (size - 2)) + 1;
    const cell = maze[y][x];

    // Choose a wall to remove
    const walls = Object.entries(cell.walls).filter(([_, hasWall]) => hasWall);
    if (walls.length > 0) {
      const [wall] = walls[Math.floor(Math.random() * walls.length)];

      let nx = x, ny = y;
      if (wall === 'top') ny--;
      else if (wall === 'bottom') ny++;
      else if (wall === 'left') nx--;
      else if (wall === 'right') nx++;

      if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
        removeWalls({ x, y }, { x: nx, y: ny }, maze);
        added++;
      }
    }
  }
};

/**
 * Validates the maze satisfies all critical requirements.
 */
export const validateMaze = (maze: Maze): boolean => {
  const size = maze.length;
  const start = { x: 0, y: 0 };
  const exit = { x: size - 1, y: size - 1 };

  // 1. Player and Exit occupy different cells
  if (start.x === exit.x && start.y === exit.y) return false;

  // 2. Player can move immediately
  const startMoves = getValidMoves(start, maze);
  if (startMoves.length === 0) return false;

  // 3. Exit is reachable
  const path = findPath(start, exit, maze);
  if (!path) return false;

  // 4. Required alternate paths based on difficulty/size
  // Easy (size 10) -> 2 paths
  // Medium (size 20) -> 3 paths
  // Hard (size 28) -> 4 paths
  let requiredPaths = 2;
  if (size >= 20) requiredPaths = 3;
  if (size >= 28) requiredPaths = 4;

  let foundPaths = 1;
  const blockedEdges: { a: Position; b: Position }[] = [];
  let currentPath = path;

  while (foundPaths < requiredPaths) {
    let alternativeFound = false;

    // Try blocking each edge of the current path to find an alternative
    for (let i = 0; i < currentPath.length - 1; i++) {
      const edgeStart = currentPath[i];
      const edgeEnd = currentPath[i + 1];

      // Temporarily block this edge
      const originalWallsStart = { ...maze[edgeStart.y][edgeStart.x].walls };
      const originalWallsEnd = { ...maze[edgeEnd.y][edgeEnd.x].walls };
      blockEdge(edgeStart, edgeEnd, maze);

      // Also block all previously confirmed "essential" edges for other paths
      // to ensure this new path is truly independent.
      // Note: We don't need full independence, just 3 distinct routes.
      // But blocking the previous path's edges is a good way to find a truly different route.

      const altPath = findPath(start, exit, maze);

      // Restore walls
      maze[edgeStart.y][edgeStart.x].walls = originalWallsStart;
      maze[edgeEnd.y][edgeEnd.x].walls = originalWallsEnd;

      if (altPath) {
        foundPaths++;
        currentPath = altPath;
        alternativeFound = true;

        // Block one edge of this path permanently (for this validation) to find the NEXT one
        blockEdge(edgeStart, edgeEnd, maze);
        blockedEdges.push({ a: edgeStart, b: edgeEnd });
        break;
      }
    }

    if (!alternativeFound) break;
  }

  // Restore all blocked edges
  blockedEdges.forEach(({ a, b }) => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      if (dx === 1) { maze[a.y][a.x].walls.left = false; maze[b.y][b.x].walls.right = false; }
      else if (dx === -1) { maze[a.y][a.x].walls.right = false; maze[b.y][b.x].walls.left = false; }
      if (dy === 1) { maze[a.y][a.x].walls.top = false; maze[b.y][b.x].walls.bottom = false; }
      else if (dy === -1) { maze[a.y][a.x].walls.bottom = false; maze[b.y][b.x].walls.top = false; }
  });

  return foundPaths >= requiredPaths;
};

const getUnvisitedNeighbors = (pos: Position, maze: Maze, size: number): Position[] => {
  const neighbors: Position[] = [];
  const { x, y } = pos;

  if (y > 0 && !maze[y - 1][x].visited) neighbors.push({ x, y: y - 1 });
  if (x < size - 1 && !maze[y][x + 1].visited) neighbors.push({ x: x + 1, y });
  if (y < size - 1 && !maze[y + 1][x].visited) neighbors.push({ x, y: y + 1 });
  if (x > 0 && !maze[y][x - 1].visited) neighbors.push({ x: x - 1, y });

  return neighbors;
};

// Re-implementing correctly to fix potential bugs found during inspection
const getValidMoves = (pos: Position, maze: Maze): Position[] => {
  const moves: Position[] = [];
  const cell = maze[pos.y][pos.x];
  if (!cell.walls.top) moves.push({ x: pos.x, y: pos.y - 1 });
  if (!cell.walls.right) moves.push({ x: pos.x + 1, y: pos.y });
  if (!cell.walls.bottom) moves.push({ x: pos.x, y: pos.y + 1 });
  if (!cell.walls.left) moves.push({ x: pos.x - 1, y: pos.y });
  return moves;
};

const findPath = (start: Position, target: Position, maze: Maze): Position[] | null => {
  const queue: { pos: Position; path: Position[] }[] = [{ pos: start, path: [start] }];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;
    if (pos.x === target.x && pos.y === target.y) return path;

    for (const move of getValidMoves(pos, maze)) {
      const key = `${move.x},${move.y}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ pos: move, path: [...path, move] });
      }
    }
  }
  return null;
};

const blockEdge = (a: Position, b: Position, maze: Maze) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  if (dx === 1) { maze[a.y][a.x].walls.left = true; maze[b.y][b.x].walls.right = true; }
  else if (dx === -1) { maze[a.y][a.x].walls.right = true; maze[b.y][b.x].walls.left = true; }
  if (dy === 1) { maze[a.y][a.x].walls.top = true; maze[b.y][b.x].walls.bottom = true; }
  else if (dy === -1) { maze[a.y][a.x].walls.bottom = true; maze[b.y][b.x].walls.top = true; }
};

const removeWalls = (a: Position, b: Position, maze: Maze) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  if (dx === 1) {
    maze[a.y][a.x].walls.left = false;
    maze[b.y][b.x].walls.right = false;
  } else if (dx === -1) {
    maze[a.y][a.x].walls.right = false;
    maze[b.y][b.x].walls.left = false;
  }

  if (dy === 1) {
    maze[a.y][a.x].walls.top = false;
    maze[b.y][b.x].walls.bottom = false;
  } else if (dy === -1) {
    maze[a.y][a.x].walls.bottom = false;
    maze[b.y][b.x].walls.top = false;
  }
};
