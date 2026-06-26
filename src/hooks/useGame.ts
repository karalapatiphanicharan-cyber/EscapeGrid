import { useState, useCallback, useEffect, useRef } from 'react';
import { Difficulty, GameState, Position, Maze, Enemy, EnemyType, EnemyMode, EnemyState, Coin } from '../game/types';
import { generateMaze, validateMaze } from '../game/mazeGenerator';
import { DIFFICULTIES, ENEMY_CONFIG, SCORING } from '../game/constants';
import { spawnCoins, validateCoinsReachability } from '../game/coinLogic';
import { saveBestTime, getBestTimeForDifficulty } from '../utils/storage';
import { getNextEnemyPosition } from '../game/enemyAI';

const ENEMY_ENABLED_KEY = 'escape_grid_enemy_enabled';
const SAFE_SPAWN_DISTANCE = 6;

export const useGame = (initialDifficulty: Difficulty = 'easy') => {
  const [enemyEnabled, setEnemyEnabled] = useState(() => {
    const saved = localStorage.getItem(ENEMY_ENABLED_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const spawnEnemies = useCallback((maze: Maze, difficulty: Difficulty, playerPos: Position): Enemy[] => {
    if (!enemyEnabled) return [];

    const size = maze.length;
    const enemies: Enemy[] = [];
    const count = DIFFICULTIES[difficulty].enemyCount;
    const exitPos = { x: size - 1, y: size - 1 };

    const occupied = new Set<string>();
    occupied.add(`${playerPos.x},${playerPos.y}`);
    occupied.add(`${exitPos.x},${exitPos.y}`);

    const types: EnemyType[] = ['scout', 'hunter', 'sentinel'];

    for (let i = 0; i < count; i++) {
      let x, y;
      let attempts = 0;
      let found = false;

      while (attempts < 200) {
        attempts++;
        x = Math.floor(Math.random() * size);
        y = Math.floor(Math.random() * size);

        const distToPlayer = Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y);
        const isExitAdjacent = Math.abs(x - exitPos.x) <= 1 && Math.abs(y - exitPos.y) <= 1;
        const isPlayerAdjacent = Math.abs(x - playerPos.x) <= 1 && Math.abs(y - playerPos.y) <= 1;

        if (!occupied.has(`${x},${y}`) &&
            distToPlayer >= SAFE_SPAWN_DISTANCE &&
            !isExitAdjacent &&
            !isPlayerAdjacent) {
          found = true;
          break;
        }
      }

      if (found) {
        occupied.add(`${x!},${y!}`);
        const type = difficulty === 'easy' ? 'scout' : types[i % types.length];
        let mode: EnemyMode = 'random';
        if (difficulty === 'medium') {
            mode = i === 0 ? 'tracking' : 'random';
        }
        if (difficulty === 'hard') {
            if (type === 'hunter') mode = 'bfs-hunter';
            else if (type === 'sentinel') mode = 'tracking';
            else mode = 'random';
        }

        enemies.push({
          id: `enemy-${i}-${Date.now()}`,
          type,
          position: { x: x!, y: y! },
          prevPosition: undefined,
          mode,
          state: 'searching',
          speed: ENEMY_CONFIG[type].speed,
          color: ENEMY_CONFIG[type].color,
        });
      }
    }

    return enemies;
  }, [enemyEnabled]);

  const [gameState, setGameState] = useState<GameState>(() => {
    let maze = generateMaze(DIFFICULTIES[initialDifficulty].size);
    while(!validateMaze(maze)) {
        maze = generateMaze(DIFFICULTIES[initialDifficulty].size);
    }

    const playerPos = { x: 0, y: 0 };
    return {
      maze,
      playerPosition: playerPos,
      difficulty: initialDifficulty,
      moves: 0,
      status: 'idle',
      startTime: null,
      endTime: null,
      enemies: [],
      coins: [],
      score: 0,
      enemyEnabled,
      gameId: Math.random().toString(36).substring(7),
    };
  });

  const [bestTime, setBestTime] = useState(getBestTimeForDifficulty(initialDifficulty));

  const validateGameSetup = useCallback((maze: Maze, playerPos: Position, enemies: Enemy[]): boolean => {
    const exitPos = { x: maze.length - 1, y: maze.length - 1 };

    // We already know maze is valid (has 3 paths if hard)
    // Now we must ensure at least one path is not "blocked" by enemies at their start positions.
    // We treat enemy positions as walls for this check.
    const enemyPositions = new Set(enemies.map(e => `${e.position.x},${e.position.y}`));

    const queue: Position[] = [playerPos];
    const visited = new Set<string>();
    visited.add(`${playerPos.x},${playerPos.y}`);

    while (queue.length > 0) {
      const pos = queue.shift()!;
      if (pos.x === exitPos.x && pos.y === exitPos.y) return true;

      const cell = maze[pos.y][pos.x];
      const neighbors: Position[] = [];
      if (!cell.walls.top) neighbors.push({ x: pos.x, y: pos.y - 1 });
      if (!cell.walls.right) neighbors.push({ x: pos.x + 1, y: pos.y });
      if (!cell.walls.bottom) neighbors.push({ x: pos.x, y: pos.y + 1 });
      if (!cell.walls.left) neighbors.push({ x: pos.x - 1, y: pos.y });

      for (const next of neighbors) {
        const key = `${next.x},${next.y}`;
        if (!visited.has(key) && !enemyPositions.has(key)) {
          visited.add(key);
          queue.push(next);
        }
      }
    }

    return false;
  }, []);

  const startNewGame = useCallback((difficulty: Difficulty = gameState.difficulty) => {
    const size = DIFFICULTIES[difficulty].size;
    let maze: Maze;
    let playerPos: Position = { x: 0, y: 0 };
    let enemies: Enemy[] = [];
    let coins: Coin[] = [];
    let attempts = 0;
    let valid = false;

    while (!valid && attempts < 20) {
      attempts++;
      maze = generateMaze(size);
      if (!validateMaze(maze)) continue;

      enemies = spawnEnemies(maze, difficulty, playerPos);
      if (enemyEnabled && !validateGameSetup(maze, playerPos, enemies)) continue;

      coins = spawnCoins(maze, difficulty, playerPos, enemies.map(e => e.position));
      if (!validateCoinsReachability(maze, playerPos, coins)) continue;

      valid = true;
      setGameState({
        maze,
        playerPosition: playerPos,
        difficulty,
        moves: 0,
        status: 'playing',
        startTime: Date.now(),
        endTime: null,
        enemies,
        coins,
        score: 0,
        enemyEnabled,
        gameId: Math.random().toString(36).substring(7),
      });
    }

    setBestTime(getBestTimeForDifficulty(difficulty));
  }, [gameState.difficulty, enemyEnabled, spawnEnemies, validateGameSetup]);

  const restartGame = useCallback(() => {
    setGameState((prev) => {
      let enemies = spawnEnemies(prev.maze, prev.difficulty, { x: 0, y: 0 });
      let attempts = 0;
      while (enemyEnabled && !validateGameSetup(prev.maze, { x: 0, y: 0 }, enemies) && attempts < 10) {
        enemies = spawnEnemies(prev.maze, prev.difficulty, { x: 0, y: 0 });
        attempts++;
      }

      // Reset coins for restart
      const newCoins = spawnCoins(prev.maze, prev.difficulty, { x: 0, y: 0 }, enemies.map(e => e.position));

      return {
        ...prev,
        playerPosition: { x: 0, y: 0 },
        moves: 0,
        status: 'playing',
        startTime: Date.now(),
        endTime: null,
        enemies,
        coins: newCoins,
        score: 0,
        gameId: Math.random().toString(36).substring(7),
      };
    });
  }, [spawnEnemies, enemyEnabled, validateGameSetup]);

  const toggleEnemySystem = useCallback(() => {
    const newVal = !enemyEnabled;
    setEnemyEnabled(newVal);
    localStorage.setItem(ENEMY_ENABLED_KEY, JSON.stringify(newVal));
    setGameState(prev => {
        let enemies: Enemy[] = [];
        if (newVal) {
            enemies = spawnEnemies(prev.maze, prev.difficulty, prev.playerPosition);
            let attempts = 0;
            while (!validateGameSetup(prev.maze, prev.playerPosition, enemies) && attempts < 10) {
                enemies = spawnEnemies(prev.maze, prev.difficulty, prev.playerPosition);
                attempts++;
            }
        }

        return {
            ...prev,
            enemyEnabled: newVal,
            enemies: enemies
        };
    });
  }, [enemyEnabled, spawnEnemies, validateGameSetup]);

  const movePlayer = useCallback((direction: string) => {
    if (gameState.status !== 'playing') return;

    setGameState((prev) => {
      const { x, y } = prev.playerPosition;
      const cell = prev.maze[y][x];
      let newX = x;
      let newY = y;

      const dir = direction.toLowerCase();
      if ((dir === 'arrowup' || dir === 'w') && !cell.walls.top) newY--;
      else if ((dir === 'arrowdown' || dir === 's') && !cell.walls.bottom) newY++;
      else if ((dir === 'arrowleft' || dir === 'a') && !cell.walls.left) newX--;
      else if ((dir === 'arrowright' || dir === 'd') && !cell.walls.right) newX++;

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

      // Check for coin collection
      let newScore = prev.score;
      const updatedCoins = prev.coins.map(coin => {
          if (!coin.collected && coin.position.x === newX && coin.position.y === newY) {
              newScore += SCORING.COIN_VALUE;
              return { ...coin, collected: true };
          }
          return coin;
      });

      const isWon = prev.maze[newY][newX].isExit;

      if (isWon) {
        const endTime = Date.now();
        const duration = endTime - (prev.startTime || endTime);

        let finalScore = newScore + SCORING.EXIT_VALUE;
        const totalCoins = prev.coins.length;
        const collectedCoins = updatedCoins.filter(c => c.collected).length;
        if (collectedCoins === totalCoins) {
            finalScore += SCORING.PERFECT_BONUS;
        }

        const bestTimeData = {
          difficulty: prev.difficulty,
          time: duration,
          moves: prev.moves + 1,
          score: finalScore,
          coins: collectedCoins,
          date: new Date().toISOString(),
        };
        saveBestTime(bestTimeData);
        setBestTime(getBestTimeForDifficulty(prev.difficulty));

        return {
          ...prev,
          playerPosition: newPosition,
          moves: prev.moves + 1,
          coins: updatedCoins,
          score: finalScore,
          status: 'won',
          endTime,
        };
      }

      return {
        ...prev,
        playerPosition: newPosition,
        moves: prev.moves + 1,
        coins: updatedCoins,
        score: newScore,
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

                // Find the latest version of this enemy in the current state
                const currentEnemy = prev.enemies.find(e => e.id === enemy.id);
                if (!currentEnemy) return prev;

                const otherEnemyPositions = prev.enemies
                    .filter(e => e.id !== enemy.id)
                    .map(e => e.position);

                const newPos = getNextEnemyPosition(
                    currentEnemy.position,
                    currentEnemy.prevPosition,
                    otherEnemyPositions,
                    prev.playerPosition,
                    prev.maze,
                    currentEnemy.mode
                );

                // Update state of enemy based on distance
                const dist = Math.abs(newPos.x - prev.playerPosition.x) + Math.abs(newPos.y - prev.playerPosition.y);
                let newState: EnemyState = 'searching';
                if (dist < 10) newState = 'tracking';
                if (dist < 5) newState = 'pursuing';

                const updatedEnemies = prev.enemies.map(e =>
                    e.id === enemy.id ? {
                        ...e,
                        position: newPos,
                        prevPosition: currentEnemy.position,
                        state: newState
                    } : e
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
  }, [gameState.gameId, gameState.status, enemyEnabled, gameState.enemies.length]);

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
