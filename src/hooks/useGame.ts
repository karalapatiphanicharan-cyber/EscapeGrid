import { useState, useCallback, useEffect, useRef } from 'react';
import { Difficulty, GameState, Position, Maze, Enemy, EnemyType, EnemyMode, EnemyState } from '../game/types';
import { generateMaze } from '../game/mazeGenerator';
import { DIFFICULTIES, ENEMY_CONFIG, MIN_SPAWN_DISTANCE } from '../game/constants';
import { saveBestTime, getBestTimeForDifficulty } from '../utils/storage';
import { getNextEnemyPosition } from '../game/enemyAI';

const ENEMY_ENABLED_KEY = 'escape_grid_enemy_enabled';

export const useGame = (initialDifficulty: Difficulty = 'easy') => {
  const [enemyEnabled, setEnemyEnabled] = useState(() => {
    const saved = localStorage.getItem(ENEMY_ENABLED_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const size = DIFFICULTIES[initialDifficulty].size;
    const maze = generateMaze(size);
    return {
      maze,
      playerPosition: { x: 0, y: 0 },
      difficulty: initialDifficulty,
      moves: 0,
      status: 'idle',
      startTime: null,
      endTime: null,
      enemies: [],
      enemyEnabled,
    };
  });

  const [bestTime, setBestTime] = useState(getBestTimeForDifficulty(initialDifficulty));

  const spawnEnemies = useCallback((maze: Maze, difficulty: Difficulty, playerPos: Position): Enemy[] => {
    if (!enemyEnabled) return [];

    const size = maze.length;
    const enemies: Enemy[] = [];
    const count = DIFFICULTIES[difficulty].enemyCount;
    const occupied = new Set<string>();
    occupied.add(`${playerPos.x},${playerPos.y}`);
    occupied.add(`${size - 1},${size - 1}`);

    const types: EnemyType[] = ['scout', 'hunter', 'sentinel'];

    for (let i = 0; i < count; i++) {
      let x, y;
      let attempts = 0;
      do {
        x = Math.floor(Math.random() * size);
        y = Math.floor(Math.random() * size);
        attempts++;
      } while (
        (occupied.has(`${x},${y}`) ||
         Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y) < MIN_SPAWN_DISTANCE) &&
        attempts < 100
      );

      occupied.add(`${x},${y}`);

      const type = difficulty === 'easy' ? 'scout' : types[i % types.length];
      let mode: EnemyMode = 'random';
      if (difficulty === 'medium') mode = 'tracking';
      if (difficulty === 'hard') {
          if (type === 'hunter') mode = 'bfs-hunter';
          else if (type === 'sentinel') mode = 'tracking';
          else mode = 'random';
      }

      enemies.push({
        id: `enemy-${i}-${Date.now()}`,
        type,
        position: { x, y },
        mode,
        state: 'searching',
        speed: ENEMY_CONFIG[type].speed,
        color: ENEMY_CONFIG[type].color,
      });
    }

    return enemies;
  }, [enemyEnabled]);

  const startNewGame = useCallback((difficulty: Difficulty = gameState.difficulty) => {
    const size = DIFFICULTIES[difficulty].size;
    const maze = generateMaze(size);
    const playerPos = { x: 0, y: 0 };
    setGameState({
      maze,
      playerPosition: playerPos,
      difficulty,
      moves: 0,
      status: 'playing',
      startTime: Date.now(),
      endTime: null,
      enemies: spawnEnemies(maze, difficulty, playerPos),
      enemyEnabled,
    });
    setBestTime(getBestTimeForDifficulty(difficulty));
  }, [gameState.difficulty, enemyEnabled, spawnEnemies]);

  const restartGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      playerPosition: { x: 0, y: 0 },
      moves: 0,
      status: 'playing',
      startTime: Date.now(),
      endTime: null,
      enemies: spawnEnemies(prev.maze, prev.difficulty, { x: 0, y: 0 }),
    }));
  }, [spawnEnemies]);

  const toggleEnemySystem = useCallback(() => {
    const newVal = !enemyEnabled;
    setEnemyEnabled(newVal);
    localStorage.setItem(ENEMY_ENABLED_KEY, JSON.stringify(newVal));
    setGameState(prev => ({
        ...prev,
        enemyEnabled: newVal,
        enemies: newVal ? spawnEnemies(prev.maze, prev.difficulty, prev.playerPosition) : []
    }));
  }, [enemyEnabled, spawnEnemies]);

  const movePlayer = useCallback((direction: string) => {
    if (gameState.status !== 'playing') return;

    setGameState((prev) => {
      const { x, y } = prev.playerPosition;
      const cell = prev.maze[y][x];
      let newX = x;
      let newY = y;

      if ((direction === 'arrowup' || direction === 'w') && !cell.walls.top) newY--;
      else if ((direction === 'arrowdown' || direction === 's') && !cell.walls.bottom) newY++;
      else if ((direction === 'arrowleft' || direction === 'a') && !cell.walls.left) newX--;
      else if ((direction === 'arrowright' || direction === 'd') && !cell.walls.right) newX++;

      if (newX === x && newY === y) return prev;

      const newPosition = { x: newX, y: newY };

      // Check collision BEFORE moving (if enemy is already there)
      const collision = prev.enemies.find(e => e.position.x === newX && e.position.y === newY);
      if (collision) {
          return {
              ...prev,
              playerPosition: newPosition,
              moves: prev.moves + 1,
              status: 'lost',
              endTime: Date.now(),
              capturedBy: collision.type
          };
      }

      const isWon = prev.maze[newY][newX].isExit;

      if (isWon) {
        const endTime = Date.now();
        const duration = endTime - (prev.startTime || endTime);
        const bestTimeData = {
          difficulty: prev.difficulty,
          time: duration,
          moves: prev.moves + 1,
          date: new Date().toISOString(),
        };
        saveBestTime(bestTimeData);
        setBestTime(getBestTimeForDifficulty(prev.difficulty));

        return {
          ...prev,
          playerPosition: newPosition,
          moves: prev.moves + 1,
          status: 'won',
          endTime,
        };
      }

      return {
        ...prev,
        playerPosition: newPosition,
        moves: prev.moves + 1,
      };
    });
  }, [gameState.status]);

  // Enemy movement logic
  useEffect(() => {
    if (gameState.status !== 'playing' || !enemyEnabled || gameState.enemies.length === 0) return;

    const intervals = gameState.enemies.map(enemy => {
        return setInterval(() => {
            setGameState(prev => {
                if (prev.status !== 'playing') return prev;

                const newPos = getNextEnemyPosition(
                    enemy.position,
                    prev.playerPosition,
                    prev.maze,
                    enemy.mode
                );

                // Update state of enemy based on distance
                const dist = Math.abs(newPos.x - prev.playerPosition.x) + Math.abs(newPos.y - prev.playerPosition.y);
                let newState: EnemyState = 'searching';
                if (dist < 10) newState = 'tracking';
                if (dist < 5) newState = 'pursuing';

                const updatedEnemies = prev.enemies.map(e =>
                    e.id === enemy.id ? { ...e, position: newPos, state: newState } : e
                );

                // Check collision
                if (newPos.x === prev.playerPosition.x && newPos.y === prev.playerPosition.y) {
                    return {
                        ...prev,
                        enemies: updatedEnemies,
                        status: 'lost',
                        endTime: Date.now(),
                        capturedBy: enemy.type
                    };
                }

                return { ...prev, enemies: updatedEnemies };
            });
        }, enemy.speed);
    });

    return () => intervals.forEach(clearInterval);
  }, [gameState.status, enemyEnabled, gameState.enemies.length]);

  return {
    gameState,
    bestTime,
    enemyEnabled,
    startNewGame,
    restartGame,
    movePlayer,
    toggleEnemySystem,
  };
};
