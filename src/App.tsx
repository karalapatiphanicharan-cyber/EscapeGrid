import React, { useEffect } from 'react';
import GameHeader from './components/GameHeader';
import Sidebar from './components/Sidebar';
import MazeCanvas from './components/MazeCanvas';
import ControlPanel from './components/ControlPanel';
import StatsPanel from './components/StatsPanel';
import VictoryModal from './components/VictoryModal';
import MobileControls from './components/MobileControls';
import { useGame } from './hooks/useGame';
import { useTimer } from './hooks/useTimer';
import { useKeyboard } from './hooks/useKeyboard';
import { CELL_SIZE } from './game/constants';

const App: React.FC = () => {
  const { gameState, bestTime, startNewGame, restartGame, movePlayer } = useGame('easy');
  const { time, resetTimer } = useTimer(gameState.status === 'playing');

  useKeyboard(movePlayer);

  useEffect(() => {
    if (gameState.status === 'playing' && gameState.moves === 0) {
      resetTimer();
    }
  }, [gameState.status, gameState.moves, resetTimer]);

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-slate-950 text-slate-200 font-mono">
      <GameHeader />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <Sidebar>
          <StatsPanel
            time={time}
            moves={gameState.moves}
            difficulty={gameState.difficulty}
            bestTime={bestTime}
          />
          <ControlPanel
            currentDifficulty={gameState.difficulty}
            onDifficultyChange={startNewGame}
            onRestart={restartGame}
            onNewMaze={() => startNewGame(gameState.difficulty)}
          />
        </Sidebar>

        <section className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-slate-900/20 overflow-auto">
          <div className="relative group">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>

            <MazeCanvas
              maze={gameState.maze}
              playerPosition={gameState.playerPosition}
              cellSize={CELL_SIZE}
            />

            <MobileControls onMove={movePlayer} />

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
          time={gameState.endTime! - gameState.startTime!}
          moves={gameState.moves}
          difficulty={gameState.difficulty}
          onRestart={restartGame}
          onNewMaze={() => startNewGame(gameState.difficulty)}
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
