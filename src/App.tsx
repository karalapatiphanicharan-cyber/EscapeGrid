import React, { useEffect } from 'react';
import GameHeader from './components/GameHeader';
import Sidebar from './components/Sidebar';
import Background from './components/Background';
import MazeCanvas from './components/MazeCanvas';
import ControlPanel from './components/ControlPanel';
import StatsPanel from './components/StatsPanel';
import VictoryModal from './components/VictoryModal';
import GameOverModal from './components/GameOverModal';
import EnemyStatusCard from './components/EnemyStatusCard';
import MobileControls from './components/MobileControls';
import { useGame } from './hooks/useGame';
import { useTimer } from './hooks/useTimer';
import { useKeyboard } from './hooks/useKeyboard';

const App: React.FC = () => {
  const {
    gameState,
    bestTime,
    enemyEnabled,
    startNewGame,
    restartGame,
    movePlayer,
    toggleEnemySystem
  } = useGame('easy');
  const { time, resetTimer } = useTimer(gameState.status === 'playing');

  useKeyboard(movePlayer);

  useEffect(() => {
    if (gameState.status === 'playing' && gameState.moves === 0) {
      resetTimer();
    }
  }, [gameState.status, gameState.moves, resetTimer]);

  const handleNewMaze = (difficulty = gameState.difficulty) => {
    resetTimer();
    startNewGame(difficulty);
  };

  const handleRestart = () => {
    resetTimer();
    restartGame();
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-slate-950 text-slate-200 font-mono relative">
      <Background />
      <GameHeader />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <Sidebar>
          <StatsPanel
            time={time}
            moves={gameState.moves}
            difficulty={gameState.difficulty}
            bestTime={bestTime}
          />
          <EnemyStatusCard
            enemies={gameState.enemies}
            enabled={enemyEnabled}
            onToggle={toggleEnemySystem}
          />
          <ControlPanel
            currentDifficulty={gameState.difficulty}
            onDifficultyChange={handleNewMaze}
            onRestart={handleRestart}
            onNewMaze={() => handleNewMaze(gameState.difficulty)}
          />
        </Sidebar>

        <section className="flex-1 flex items-center justify-center p-4 lg:p-12 bg-slate-900/5 overflow-hidden">
          <div className="relative group w-full h-full flex flex-col items-center justify-center max-w-[800px] max-h-[800px]">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)] pointer-events-none" />

            <MazeCanvas
              maze={gameState.maze}
              playerPosition={gameState.playerPosition}
              enemies={gameState.enemies}
            />

            <div className="mt-8 w-full max-w-md">
              <MobileControls onMove={movePlayer} />
            </div>

            {gameState.status === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm rounded-xl">
                <button
                  onClick={() => startNewGame()}
                  className="px-8 py-4 bg-cyan-500 text-slate-950 font-bold rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:scale-105 transition-transform"
                >
                  INITIALIZE GRID
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {gameState.status === 'won' && (
        <VictoryModal
          time={time}
          moves={gameState.moves}
          difficulty={gameState.difficulty}
          onRestart={handleRestart}
          onNewMaze={() => handleNewMaze(gameState.difficulty)}
        />
      )}

      {gameState.status === 'lost' && (
        <GameOverModal
          time={time}
          moves={gameState.moves}
          difficulty={gameState.difficulty}
          capturedBy={gameState.capturedBy}
          onRestart={handleRestart}
          onNewMaze={() => handleNewMaze(gameState.difficulty)}
        />
      )}

      {/* Footer / Status Bar */}
      <footer className="h-6 bg-slate-950 border-t border-cyan-500/10 flex items-center px-4 justify-between text-[10px] text-cyan-500/30 uppercase tracking-widest">
        <span>© 2024 ESCAPE_GRID_PROTOCOL</span>
        <div className="flex gap-4">
          <span>LATENCY: 12ms</span>
          <span>MEM: 128MB</span>
          <span className="text-cyan-500/60 animate-pulse">● LIVE_FEED</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
