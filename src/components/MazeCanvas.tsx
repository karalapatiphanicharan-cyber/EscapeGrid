import React, { useRef, useEffect, useState } from 'react';
import { Maze, Position } from '../game/types';
import { COLORS, WALL_THICKNESS } from '../game/constants';

interface MazeCanvasProps {
  maze: Maze;
  playerPosition: Position;
  cellSize: number;
}

const MazeCanvas: React.FC<MazeCanvasProps> = ({ maze, playerPosition, cellSize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    let frameId: number;
    const animate = () => {
      setAnimationFrame(prev => (prev + 1) % 360);
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

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

    // Draw maze walls
    ctx.strokeStyle = COLORS.wall;
    ctx.lineWidth = WALL_THICKNESS;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 0;

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

        // Draw exit portal
        if (cell.isExit) {
          const pulse = Math.sin(animationFrame * 0.1) * 3 + 7;
          ctx.save();
          ctx.translate(px + cellSize / 2, py + cellSize / 2);

          // Glow
          ctx.shadowBlur = pulse * 2;
          ctx.shadowColor = COLORS.exit;

          // Outer circle
          ctx.strokeStyle = COLORS.exit;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, cellSize / 3, 0, Math.PI * 2);
          ctx.stroke();

          // Inner pulsing core
          ctx.fillStyle = COLORS.exit;
          ctx.beginPath();
          ctx.arc(0, 0, cellSize / 5 + Math.sin(animationFrame * 0.15) * 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      });
    });

    // Draw player
    const px = playerPosition.x * cellSize;
    const py = playerPosition.y * cellSize;
    const playerPulse = Math.sin(animationFrame * 0.1) * 2 + 15;

    ctx.save();
    ctx.translate(px + cellSize / 2, py + cellSize / 2);

    // Player Glow
    ctx.shadowBlur = playerPulse;
    ctx.shadowColor = COLORS.player;
    ctx.fillStyle = COLORS.player;

    // Inner core
    ctx.beginPath();
    ctx.arc(0, 0, cellSize / 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Outer ring
    ctx.strokeStyle = COLORS.player;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, cellSize / 2.5 + Math.sin(animationFrame * 0.2) * 1.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

  }, [maze, playerPosition, cellSize, animationFrame]);

  return (
    <div className="relative p-1 bg-slate-900 rounded-xl border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.2)] overflow-auto max-w-full max-h-[80vh] flex items-center justify-center">
      <div className="p-4 bg-slate-950 rounded-lg">
        <canvas
          ref={canvasRef}
          className="block"
          style={{
            imageRendering: 'pixelated',
          }}
        />
      </div>
    </div>
  );
};

export default MazeCanvas;
