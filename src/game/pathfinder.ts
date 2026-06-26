import { Maze, Position } from './types';

export const findShortestPath = (maze: Maze, start: Position, target: Position): Position[] => {
  const size = maze.length;
  const queue: Position[] = [start];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  const parent = new Map<string, string>();

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.x === target.x && current.y === target.y) {
      // Reconstruct path
      const path: Position[] = [];
      let currKey = `${target.x},${target.y}`;
      while (currKey !== `${start.x},${start.y}`) {
        const [x, y] = currKey.split(',').map(Number);
        path.unshift({ x, y });
        currKey = parent.get(currKey)!;
      }
      return path;
    }

    const cell = maze[current.y][current.x];
    const neighbors: Position[] = [];

    if (!cell.walls.top && current.y > 0) neighbors.push({ x: current.x, y: current.y - 1 });
    if (!cell.walls.right && current.x < size - 1) neighbors.push({ x: current.x + 1, y: current.y });
    if (!cell.walls.bottom && current.y < size - 1) neighbors.push({ x: current.x, y: current.y + 1 });
    if (!cell.walls.left && current.x > 0) neighbors.push({ x: current.x - 1, y: current.y });

    for (const neighbor of neighbors) {
      const key = `${neighbor.x},${neighbor.y}`;
      if (!visited.has(key)) {
        visited.add(key);
        parent.set(key, `${current.x},${current.y}`);
        queue.push(neighbor);
      }
    }
  }

  return [];
};
