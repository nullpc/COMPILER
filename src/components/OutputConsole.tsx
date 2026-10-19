import React, { useRef, useEffect, useState } from 'react';
import { ExecutionResult, GraphicsCommand, CompilerTheme } from '../types/compiler';
import { 
  Terminal, 
  Shapes, 
  AlertTriangle, 
  Eraser, 
  Copy, 
  Check, 
  RefreshCw,
  Send,
  Maximize2
} from 'lucide-react';

interface OutputConsoleProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  theme: CompilerTheme;
  onClear: () => void;
  onReRun: () => void;
  onSendInput: (input: string) => void;
}

export function OutputConsole({
  result,
  isRunning,
  theme,
  onClear,
  onReRun,
  onSendInput
}: OutputConsoleProps) {
  const [activeTab, setActiveTab] = useState<'console' | 'graphics' | 'diagnostics'>('console');
  const [consoleInput, setConsoleInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  // Auto switch to graphics tab if graphics output is detected
  useEffect(() => {
    if (result?.hasGraphics && result.graphicsCommands.length > 0) {
      setActiveTab('graphics');
    } else if (result && result.errors.length > 0 && !result.success) {
      setActiveTab('diagnostics');
    }
  }, [result]);

  // Auto scroll console to bottom
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [result?.logs, isRunning]);

  // Render graphics commands onto canvas
  useEffect(() => {
    if (activeTab !== 'graphics' || !canvasRef.current || !result) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset canvas to black (DOS BGI default)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let strokeColor = '#FFFFFF';
    let fillColor = '#000000';

    result.graphicsCommands.forEach(cmd => {
      switch (cmd.type) {
        case 'clear':
          ctx.fillStyle = cmd.params.bkColor || '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          break;
        case 'color':
          strokeColor = cmd.params.color || '#FFFFFF';
          break;
        case 'bkcolor':
          fillColor = cmd.params.color || '#000000';
          break;
        case 'circle':
          ctx.beginPath();
          ctx.strokeStyle = cmd.params.color || strokeColor;
          ctx.lineWidth = 2;
          ctx.arc(cmd.params.x, cmd.params.y, cmd.params.r, 0, 2 * Math.PI);
          ctx.stroke();
          break;
        case 'line':
          ctx.beginPath();
          ctx.strokeStyle = cmd.params.color || strokeColor;
          ctx.lineWidth = 2;
          ctx.moveTo(cmd.params.x1, cmd.params.y1);
          ctx.lineTo(cmd.params.x2, cmd.params.y2);
          ctx.stroke();
          break;
        case 'rectangle':
          ctx.beginPath();
          ctx.strokeStyle = cmd.params.color || strokeColor;
          ctx.lineWidth = 2;
          ctx.strokeRect(cmd.params.x1, cmd.params.y1, cmd.params.x2 - cmd.params.x1, cmd.params.y2 - cmd.params.y1);
          break;
        case 'bar':
          ctx.fillStyle = cmd.params.color || strokeColor;
          ctx.fillRect(cmd.params.x1, cmd.params.y1, cmd.params.x2 - cmd.params.x1, cmd.params.y2 - cmd.params.y1);
          break;
        case 'ellipse':
          ctx.beginPath();
          ctx.strokeStyle = cmd.params.color || strokeColor;
          ctx.lineWidth = 2;
          ctx.ellipse(cmd.params.x, cmd.params.y, cmd.params.xr, cmd.params.yr, 0, (cmd.params.st * Math.PI) / 180, (cmd.params.end * Math.PI) / 180);
          ctx.stroke();
          break;
        case 'text':
          ctx.font = '16px "JetBrains Mono", monospace';
          ctx.fillStyle = cmd.params.color || strokeColor;
          ctx.fillText(cmd.params.text, cmd.params.x, cmd.params.y);
          break;
      }
    });
  }, [result?.graphicsCommands, activeTab]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (consoleInput.trim() || consoleInput === '0') {
      onSendInput(consoleInput);
      setConsoleInput('');
    }
  };

  const handleCopyLogs = () => {
    if (!result) return;
    const allText = result.logs.map(l => l.text).join('\n');
    navigator.clipboard.writeText(allText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const errorCount = result?.errors.filter(e => e.severity === 'error').length || 0;
  const warningCount = result?.errors.filter(e => e.severity === 'warning').length || 0;

  return (
    <div className="flex flex-col h-full bg-[#050608] rounded-xl border border-neutral-800 overflow-hidden shadow-xl text-neutral-100">
      {/* Console Tabs & Actions */}
      <div className="bg-neutral-900/90 border-b border-neutral-800 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs select-none">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'console'
                ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Terminal size={14} className="text-emerald-400" />
            <span>Output Screen (Alt+F5)</span>
          </button>

          <button
            onClick={() => setActiveTab('graphics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'graphics'
                ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Shapes size={14} className="text-purple-400" />
            <span>Graphics.h Canvas</span>
            {result?.hasGraphics && (
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'diagnostics'
                ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <AlertTriangle size={14} className={errorCount > 0 ? 'text-rose-400' : 'text-neutral-400'} />
            <span>Diagnostics</span>
            {(errorCount > 0 || warningCount > 0) && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300">
                {errorCount}E · {warningCount}W
              </span>
            )}
          </button>
        </div>

        {/* Console Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyLogs}
            className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition-colors cursor-pointer"
            title="Copy Output"
          >
            {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          </button>

          <button
            onClick={onClear}
            className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition-colors cursor-pointer"
            title="Clear Console (clrscr)"
          >
            <Eraser size={13} />
          </button>

          <button
            onClick={onReRun}
            className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition-colors cursor-pointer"
            title="Re-run (Ctrl+F9)"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Main Screen Body */}
      <div className="relative flex-1 overflow-hidden bg-black flex flex-col">
        {/* Tab 1: Authentic DOS Console Screen */}
        {activeTab === 'console' && (
          <div 
            ref={terminalScrollRef}
            className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed text-[#55ff55] selection:bg-[#00aa00] selection:text-black space-y-1"
          >
            {/* If empty state */}
            {!result && !isRunning && (
              <div className="text-neutral-500 space-y-2 py-4">
                <p>Turbo C++ 3.2 DOS Emulator initialized.</p>
                <p>Ready to compile and run.</p>
                <p className="text-neutral-600">Press <span className="text-neutral-400">Ctrl + F9</span> or click <span className="text-emerald-400">RUN</span> above.</p>
              </div>
            )}

            {/* Running Spinner indicator */}
            {isRunning && (
              <div className="text-amber-400 flex items-center gap-2 py-2">
                <span className="animate-spin">◴</span>
                <span>Compiling, linking, and running in DOS sandbox...</span>
              </div>
            )}

            {/* Logs display */}
            {result?.logs.map((log, idx) => (
              <div
                key={idx}
                className={`whitespace-pre-wrap ${
                  log.type === 'stderr'
                    ? 'text-rose-400 font-bold'
                    : log.type === 'system'
                    ? 'text-cyan-400'
                    : 'text-[#e5e5e5]'
                }`}
              >
                {log.text}
              </div>
            ))}

            {/* Pending scanf input prompt */}
            {result?.pendingInputPrompt && (
              <div className="pt-2 text-amber-300 font-bold flex items-center gap-2">
                <span>► {result.pendingInputPrompt}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: HTML5 Canvas for <graphics.h> */}
        {activeTab === 'graphics' && (
          <div className="flex-1 bg-black flex flex-col items-center justify-center p-3 overflow-auto">
            <div className="relative border border-neutral-800 rounded shadow-2xl bg-black">
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="max-w-full h-auto block aspect-4/3"
              />
              <div className="absolute top-2 right-2 text-[10px] font-mono text-neutral-500 bg-black/70 px-2 py-0.5 rounded">
                640 x 480 BGI VGA
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-2 font-mono">
              Rendered via standard Borland BGI routines (circle, line, rectangle, setcolor)
            </p>
          </div>
        )}

        {/* Tab 3: Diagnostics & Compiler Errors */}
        {activeTab === 'diagnostics' && (
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Compilation & Linker Diagnostics</span>
              <span className="text-neutral-400 text-xs">
                (Runtime Execution: {result?.executionTimeMs || 0} ms)
              </span>
            </div>

            {result?.errors && result.errors.length > 0 ? (
              <div className="space-y-2">
                {result.errors.map((err, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border ${
                      err.severity === 'error'
                        ? 'bg-rose-950/30 border-rose-800/60 text-rose-300'
                        : 'bg-amber-950/30 border-amber-800/60 text-amber-300'
                    }`}
                  >
                    <div className="flex justify-between font-bold">
                      <span>Line {err.line}: {err.severity.toUpperCase()}</span>
                    </div>
                    <p className="mt-1 font-sans text-xs text-neutral-200">{err.message}</p>
                    {err.codeSnippet && (
                      <pre className="mt-1.5 p-1.5 bg-black/60 rounded text-[11px] text-neutral-400">
                        {err.codeSnippet}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-lg text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-400" />
                  <span>Success: 0 Errors, 0 Warnings</span>
                </div>
                <p className="text-xs text-neutral-400 font-sans">
                  The C program compiled cleanly and linked against standard runtime libraries.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Interactive scanf / cin User Input Bar */}
        <form
          onSubmit={handleInputSubmit}
          className="bg-neutral-900 border-t border-neutral-800 px-3 py-2 flex items-center gap-2 text-xs"
        >
          <span className="font-mono text-emerald-400 font-bold shrink-0">stdin &gt;</span>
          <input
            type="text"
            placeholder="Type input for scanf() or cin and press Enter..."
            value={consoleInput}
            onChange={(e) => setConsoleInput(e.target.value)}
            className="flex-1 bg-neutral-950 border border-neutral-700/80 rounded px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Send</span>
            <Send size={11} />
          </button>
        </form>
      </div>

      {/* Console Bottom Status */}
      <div className="bg-neutral-950 border-t border-neutral-800 px-3 py-1 flex items-center justify-between text-[11px] font-mono text-neutral-400 select-none">
        <div className="flex items-center gap-2">
          <span>Target: DOS Protected Mode (DPMI)</span>
          <span>·</span>
          <span>Libraries: stdio.h, conio.h, graphics.h</span>
        </div>
        <div>
          <span>Execution: {result?.executionTimeMs || 0}ms</span>
        </div>
      </div>
    </div>
  );
}
