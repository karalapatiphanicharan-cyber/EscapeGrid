import { Cell, Maze, Position } from './types';

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

  return maze;
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
