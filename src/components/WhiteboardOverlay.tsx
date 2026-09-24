import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, Pen, Highlighter, RotateCcw, Download, Undo, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface WhiteboardOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  broadcasterName: string;
}

export const WhiteboardOverlay: React.FC<WhiteboardOverlayProps> = ({
  isOpen,
  onClose,
  broadcasterName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#6366f1');
  const [lineWidth, setLineWidth] = useState<number>(4);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  const colors = [
    '#ffffff', // White
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#38bdf8', // Cyan
  ];

  // Initialize canvas with dark background
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines for graph paper feel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Save initial state
    saveState();
  }, [isOpen]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), imageData]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextHistory = [...history];
    nextHistory.pop(); // Remove current
    const previous = nextHistory[nextHistory.length - 1];
    if (previous) {
      ctx.putImageData(previous, 0, 0);
      setHistory(nextHistory);
      sound.playSound('click');
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = lineWidth * 4;
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = color + '44'; // Semi transparent
      ctx.lineWidth = lineWidth * 3;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
    sound.playSound('pop');
  };

  const downloadBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `whiteboard-gitas-academy-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    sound.playSound('success');
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/95 z-30 flex flex-col p-3 sm:p-5 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-slate-200 uppercase tracking-wider">
            Interactive Whiteboard & Presentation
          </span>
          <span className="hidden sm:inline text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded text-[11px]">
            Broadcasted by {broadcasterName}
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center space-x-2">
          {/* Tools */}
          <div className="flex bg-slate-900 border border-slate-700/60 rounded-xl p-1 space-x-1">
            <button
              onClick={() => {
                setTool('pen');
                sound.playSound('click');
              }}
              className={`p-1.5 rounded-lg transition ${
                tool === 'pen' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Pen"
            >
              <Pen size={15} />
            </button>
            <button
              onClick={() => {
                setTool('highlighter');
                sound.playSound('click');
              }}
              className={`p-1.5 rounded-lg transition ${
                tool === 'highlighter' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Highlighter"
            >
              <Highlighter size={15} />
            </button>
            <button
              onClick={() => {
                setTool('eraser');
                sound.playSound('click');
              }}
              className={`p-1.5 rounded-lg transition ${
                tool === 'eraser' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Eraser"
            >
              <Eraser size={15} />
            </button>
          </div>

          {/* Color palette */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-700/60 rounded-xl p-1.5 space-x-1.5">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  if (tool === 'eraser') setTool('pen');
                  sound.playSound('click');
                }}
                className={`w-5 h-5 rounded-full border transition transform ${
                  color === c && tool !== 'eraser' ? 'scale-125 border-white shadow-sm' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Stroke Width */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-1">
            <span className="text-[10px] text-slate-400">Size:</span>
            <input
              type="range"
              min="2"
              max="16"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-16 accent-indigo-500 cursor-pointer h-1"
            />
          </div>

          {/* Actions */}
          <button
            onClick={handleUndo}
            disabled={history.length <= 1}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 rounded-xl border border-slate-700 transition"
            title="Undo"
          >
            <Undo size={15} />
          </button>
          <button
            onClick={clearCanvas}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-xl border border-slate-700 transition"
            title="Clear Board"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={downloadBoard}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl border border-slate-700 transition"
            title="Save Snapshot"
          >
            <Download size={15} />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl transition"
            title="Close Whiteboard"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 w-full relative mt-3 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair touch-none"
        />
        <div className="absolute bottom-3 left-4 pointer-events-none text-[11px] text-slate-500 select-none">
          Click and drag to draw formulas, diagrams, or annotations.
        </div>
      </div>
    </div>
  );
};
