import React, { useRef, useEffect } from 'react';
import { Maze, Position } from '../game/types';
import { COLORS, WALL_THICKNESS } from '../game/constants';

interface MazeCanvasProps {
  maze: Maze;
  playerPosition: Position;
  cellSize: number;
}

const MazeCanvas: React.FC<MazeCanvasProps> = ({ maze, playerPosition, cellSize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = maze.length;
    canvas.width = size * cellSize;
    canvas.height = size * cellSize;

    // Clear canvas
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw maze
    ctx.strokeStyle = COLORS.wall;
    ctx.lineWidth = WALL_THICKNESS;
    ctx.lineCap = 'round';

    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        const px = x * cellSize;
        const py = y * cellSize;

        if (cell.walls.top) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + cellSize, py);
          ctx.stroke();
        }
        if (cell.walls.right) {
          ctx.beginPath();
          ctx.moveTo(px + cellSize, py);
          ctx.lineTo(px + cellSize, py + cellSize);
          ctx.stroke();
        }
        if (cell.walls.bottom) {
          ctx.beginPath();
          ctx.moveTo(px, py + cellSize);
          ctx.lineTo(px + cellSize, py + cellSize);
          ctx.stroke();
        }
        if (cell.walls.left) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px, py + cellSize);
          ctx.stroke();
        }

        // Draw exit
        if (cell.isExit) {
          ctx.fillStyle = COLORS.exit;
          ctx.shadowBlur = 10;
          ctx.shadowColor = COLORS.exit;
          ctx.fillRect(px + 4, py + 4, cellSize - 8, cellSize - 8);
          ctx.shadowBlur = 0;
        }
      });
    });

    // Draw player
    const px = playerPosition.x * cellSize;
    const py = playerPosition.y * cellSize;
    ctx.fillStyle = COLORS.player;
    ctx.shadowBlur = 15;
    ctx.shadowColor = COLORS.player;

    // Smooth circle player
    ctx.beginPath();
    ctx.arc(px + cellSize / 2, py + cellSize / 2, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [maze, playerPosition, cellSize]);

  return (
    <div className="relative p-4 bg-slate-900/50 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)] overflow-auto max-w-full max-h-[80vh] flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="block"
        style={{
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
};

export default MazeCanvas;
