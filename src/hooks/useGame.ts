import { useState, useCallback, useEffect } from 'react';
import { Difficulty, GameState, Position, Maze } from '../game/types';
import { generateMaze } from '../game/mazeGenerator';
import { DIFFICULTIES } from '../game/constants';
import { saveBestTime, getBestTimeForDifficulty } from '../utils/storage';

export const useGame = (initialDifficulty: Difficulty = 'easy') => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const size = DIFFICULTIES[initialDifficulty].size;
    return {
      maze: generateMaze(size),
      playerPosition: { x: 0, y: 0 },
      difficulty: initialDifficulty,
      moves: 0,
      status: 'idle',
      startTime: null,
      endTime: null,
    };
  });

  const [bestTime, setBestTime] = useState(getBestTimeForDifficulty(initialDifficulty));

  const startNewGame = useCallback((difficulty: Difficulty = gameState.difficulty) => {
    const size = DIFFICULTIES[difficulty].size;
    setGameState({
      maze: generateMaze(size),
      playerPosition: { x: 0, y: 0 },
      difficulty,
      moves: 0,
      status: 'playing',
      startTime: Date.now(),
      endTime: null,
    });
    setBestTime(getBestTimeForDifficulty(difficulty));
  }, [gameState.difficulty]);

  const restartGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      playerPosition: { x: 0, y: 0 },
      moves: 0,
      status: 'playing',
      startTime: Date.now(),
      endTime: null,
    }));
  }, []);

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

  return {
    gameState,
    bestTime,
    startNewGame,
    restartGame,
    movePlayer,
  };
};
