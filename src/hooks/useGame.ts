import { useState, useCallback, useEffect, useRef } from 'react';
import { Difficulty, GameState, Position, Maze, Enemy, EnemyType, EnemyMode, EnemyState, Coin, PowerUp, ActivePowerUp } from '../game/types';
import { generateMaze, validateMaze } from '../game/mazeGenerator';
import { DIFFICULTIES, ENEMY_CONFIG, SCORING, POWER_UP_CONFIG, AI_ASSIST_CONFIG } from '../game/constants';
import { spawnCoins, validateCoinsReachability } from '../game/coinLogic';
import { spawnPowerUps, validatePowerUpsReachability } from '../game/powerUpLogic';
import { findShortestPath } from '../game/pathfinder';
import { saveBestTime, getBestTimeForDifficulty } from '../utils/storage';
import { getNextEnemyPosition } from '../game/enemyAI';

const ENEMY_ENABLED_KEY = 'escape_grid_enemy_enabled';
const COINS_ENABLED_KEY = 'escape_grid_coins_enabled';
const POWERUPS_ENABLED_KEY = 'escape_grid_powerups_enabled';
const AI_ASSIST_ENABLED_KEY = 'escape_grid_ai_assist_enabled';
const SAFE_SPAWN_DISTANCE = 6;

export const useGame = (initialDifficulty: Difficulty = 'easy') => {
  const [enemyEnabled, setEnemyEnabled] = useState(() => {
    const saved = localStorage.getItem(ENEMY_ENABLED_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [coinsEnabled, setCoinsEnabled] = useState(() => {
    const saved = localStorage.getItem(COINS_ENABLED_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [powerUpsEnabled, setPowerUpsEnabled] = useState(() => {
    const saved = localStorage.getItem(POWERUPS_ENABLED_KEY);
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [aiAssistEnabled, setAiAssistEnabled] = useState(() => {
    const saved = localStorage.getItem(AI_ASSIST_ENABLED_KEY);
    return saved !== null ? JSON.parse(saved) : false;
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
      powerUps: [],
      activePowerUps: [],
      assistantPath: [],
      assistantType: null,
      assistantEndTime: null,
      score: 0,
      enemyEnabled,
      coinsEnabled,
      powerUpsEnabled,
      aiAssistEnabled,
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
    let powerUps: PowerUp[] = [];
    let attempts = 0;
    let valid = false;

    while (!valid && attempts < 20) {
      attempts++;
      maze = generateMaze(size);
      if (!validateMaze(maze)) continue;

      enemies = spawnEnemies(maze, difficulty, playerPos);
      if (enemyEnabled && !validateGameSetup(maze, playerPos, enemies)) continue;

      if (coinsEnabled) {
        coins = spawnCoins(maze, difficulty, playerPos, enemies.map(e => e.position));
        if (!validateCoinsReachability(maze, playerPos, coins)) continue;
      }

      if (powerUpsEnabled) {
        powerUps = spawnPowerUps(maze, difficulty, playerPos, enemies.map(e => e.position), coins.map(c => c.position));
        if (!validatePowerUpsReachability(maze, playerPos, powerUps)) continue;
      }

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
        powerUps,
        activePowerUps: [],
        assistantPath: [],
        assistantType: null,
        assistantEndTime: null,
        score: 0,
        enemyEnabled,
        coinsEnabled,
        powerUpsEnabled,
        aiAssistEnabled,
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
      let newCoins: Coin[] = [];
      if (coinsEnabled) {
        newCoins = spawnCoins(prev.maze, prev.difficulty, { x: 0, y: 0 }, enemies.map(e => e.position));
      }

      // Reset powerups for restart
      let newPowerUps: PowerUp[] = [];
      if (powerUpsEnabled) {
        newPowerUps = spawnPowerUps(prev.maze, prev.difficulty, { x: 0, y: 0 }, enemies.map(e => e.position), newCoins.map(c => c.position));
      }

      return {
        ...prev,
        playerPosition: { x: 0, y: 0 },
        moves: 0,
        status: 'playing',
        startTime: Date.now(),
        endTime: null,
        enemies,
        coins: newCoins,
        powerUps: newPowerUps,
        activePowerUps: [],
        assistantPath: [],
        assistantType: null,
        assistantEndTime: null,
        score: 0,
        gameId: Math.random().toString(36).substring(7),
      };
    });
  }, [spawnEnemies, enemyEnabled, validateGameSetup]);

  const toggleCoinSystem = useCallback(() => {
    const newVal = !coinsEnabled;
    setCoinsEnabled(newVal);
    localStorage.setItem(COINS_ENABLED_KEY, JSON.stringify(newVal));
    setGameState(prev => ({
        ...prev,
        coinsEnabled: newVal,
        coins: newVal ? spawnCoins(prev.maze, prev.difficulty, prev.playerPosition, prev.enemies.map(e => e.position)) : [],
        score: newVal ? prev.score : 0,
    }));
  }, [coinsEnabled]);

  const togglePowerUpSystem = useCallback(() => {
    const newVal = !powerUpsEnabled;
    setPowerUpsEnabled(newVal);
    localStorage.setItem(POWERUPS_ENABLED_KEY, JSON.stringify(newVal));
    setGameState(prev => ({
        ...prev,
        powerUpsEnabled: newVal,
        powerUps: newVal ? spawnPowerUps(prev.maze, prev.difficulty, prev.playerPosition, prev.enemies.map(e => e.position), prev.coins.map(c => c.position)) : [],
        activePowerUps: [],
    }));
  }, [powerUpsEnabled]);

  const toggleAIAssist = useCallback(() => {
    const newVal = !aiAssistEnabled;
    setAiAssistEnabled(newVal);
    localStorage.setItem(AI_ASSIST_ENABLED_KEY, JSON.stringify(newVal));
    setGameState(prev => ({
        ...prev,
        aiAssistEnabled: newVal,
        assistantPath: [],
        assistantType: null,
        assistantEndTime: null,
    }));
  }, [aiAssistEnabled]);

  const requestHint = useCallback(() => {
    if (!aiAssistEnabled || gameState.status !== 'playing') return;

    const exitPos = { x: gameState.maze.length - 1, y: gameState.maze.length - 1 };
    const fullPath = findShortestPath(gameState.maze, gameState.playerPosition, exitPos);
    const hintPath = fullPath.slice(0, AI_ASSIST_CONFIG.HINT_LENGTH);

    setGameState(prev => ({
        ...prev,
        assistantPath: hintPath,
        assistantType: 'hint',
        assistantEndTime: Date.now() + AI_ASSIST_CONFIG.HINT_DURATION
    }));
  }, [aiAssistEnabled, gameState.status, gameState.maze, gameState.playerPosition]);

  const requestFullPath = useCallback(() => {
    if (!aiAssistEnabled || gameState.status !== 'playing') return;

    const exitPos = { x: gameState.maze.length - 1, y: gameState.maze.length - 1 };
    const fullPath = findShortestPath(gameState.maze, gameState.playerPosition, exitPos);

    setGameState(prev => ({
        ...prev,
        assistantPath: fullPath,
        assistantType: 'full',
        assistantEndTime: Date.now() + AI_ASSIST_CONFIG.FULL_PATH_DURATION
    }));
  }, [aiAssistEnabled, gameState.status, gameState.maze, gameState.playerPosition]);

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
          const hasShield = prev.activePowerUps.some(ap => ap.type === 'shield');
          if (hasShield) {
              return {
                  ...prev,
                  playerPosition: newPosition,
                  moves: prev.moves + 1,
                  activePowerUps: prev.activePowerUps.filter(ap => ap.type !== 'shield'),
              };
          }

          return {
              ...prev,
              playerPosition: newPosition,
              moves: prev.moves + 1,
              status: 'lost',
              endTime: Date.now(),
              capturedBy: collision.type
          };
      }

      // Check for power-up collection
      let newActivePowerUps = [...prev.activePowerUps];
      let updatedPowerUps = prev.powerUps;

      if (powerUpsEnabled) {
        updatedPowerUps = prev.powerUps.map(pu => {
            if (!pu.collected && pu.position.x === newX && pu.position.y === newY) {
                const config = POWER_UP_CONFIG[pu.type];
                if (pu.type === 'shield') {
                    if (!newActivePowerUps.some(ap => ap.type === 'shield')) {
                        newActivePowerUps.push({ type: 'shield', endTime: Infinity });
                    }
                } else {
                    const existing = newActivePowerUps.find(ap => ap.type === pu.type);
                    if (existing) {
                        existing.endTime = Date.now() + config.duration;
                    } else {
                        newActivePowerUps.push({ type: pu.type, endTime: Date.now() + config.duration });
                    }
                }
                return { ...pu, collected: true };
            }
            return pu;
        });
      }

      // Check for coin collection
      let newScore = prev.score;
      let updatedCoins = prev.coins;

      if (coinsEnabled) {
        updatedCoins = prev.coins.map(coin => {
            if (!coin.collected && coin.position.x === newX && coin.position.y === newY) {
                newScore += SCORING.COIN_VALUE;
                return { ...coin, collected: true };
            }
            return coin;
        });
      }

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
        powerUps: updatedPowerUps,
        activePowerUps: newActivePowerUps,
        score: newScore,
      };
    });
  }, [gameState.status]);

  // Expiration logic for power-ups and AI assistant
  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const interval = setInterval(() => {
        setGameState(prev => {
            const now = Date.now();
            let changed = false;

            const filteredPowerUps = prev.activePowerUps.filter(ap => ap.endTime > now);
            if (filteredPowerUps.length !== prev.activePowerUps.length) changed = true;

            let newAssistantPath = prev.assistantPath;
            let newAssistantType = prev.assistantType;
            let newAssistantEndTime = prev.assistantEndTime;

            if (prev.assistantEndTime && now > prev.assistantEndTime) {
                newAssistantPath = [];
                newAssistantType = null;
                newAssistantEndTime = null;
                changed = true;
            }

            if (!changed) return prev;

            return {
                ...prev,
                activePowerUps: filteredPowerUps,
                assistantPath: newAssistantPath,
                assistantType: newAssistantType,
                assistantEndTime: newAssistantEndTime
            };
        });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.status]);

  // Enemy movement logic
  useEffect(() => {
    if (gameState.status !== 'playing' || !enemyEnabled || gameState.enemies.length === 0) return;

    const intervals = gameState.enemies.map(enemy => {
        return setInterval(() => {
            setGameState(prev => {
                if (prev.status !== 'playing') return prev;

                // Pause movement if frozen
                if (prev.activePowerUps.some(ap => ap.type === 'freeze')) return prev;

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
                    const hasShield = prev.activePowerUps.some(ap => ap.type === 'shield');
                    if (hasShield) {
                        return {
                            ...prev,
                            enemies: updatedEnemies,
                            activePowerUps: prev.activePowerUps.filter(ap => ap.type !== 'shield'),
                        };
                    }

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

  const lastMoveRef = useRef<number>(0);
  const throttledMovePlayer = useCallback((direction: string) => {
      const now = Date.now();
      const hasSpeed = gameState.activePowerUps.some(ap => ap.type === 'speed');
      const delay = hasSpeed ? 75 : 150;

      if (now - lastMoveRef.current < delay) return;
      lastMoveRef.current = now;
      movePlayer(direction);
  }, [movePlayer, gameState.activePowerUps]);

  return {
    gameState,
    bestTime,
    enemyEnabled,
    coinsEnabled,
    powerUpsEnabled,
    aiAssistEnabled,
    startNewGame,
    restartGame,
    movePlayer: throttledMovePlayer,
    toggleEnemySystem,
    toggleCoinSystem,
    togglePowerUpSystem,
    toggleAIAssist,
    requestHint,
    requestFullPath,
  };
};
