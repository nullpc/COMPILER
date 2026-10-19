import { 
  Play, 
  Terminal, 
  Save, 
  ClipboardPaste, 
  Upload, 
  Eraser, 
  Shapes, 
  Download,
  FolderOpen,
  Printer
} from 'lucide-react';

interface TouchBarProps {
  onRun: () => void;
  onToggleOutput: () => void;
  onSave: () => void;
  onOpenSavedDrawer: () => void;
  onOpenLabReport: () => void;
  onPasteCode: () => void;
  onImportClick: () => void;
  onClearScreen: () => void;
  onToggleGraphics: () => void;
  hasGraphics: boolean;
  isConsoleActive: boolean;
}

export function TouchBar({
  onRun,
  onToggleOutput,
  onSave,
  onOpenSavedDrawer,
  onOpenLabReport,
  onPasteCode,
  onImportClick,
  onClearScreen,
  onToggleGraphics,
  hasGraphics,
  isConsoleActive
}: TouchBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0f15]/95 backdrop-blur-md border-t border-neutral-800 p-2 sm:px-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
        {/* Run Button */}
        <button
          onClick={onRun}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 active:bg-emerald-700 text-neutral-950 font-bold text-xs rounded-lg whitespace-nowrap shadow-sm cursor-pointer shrink-0"
        >
          <Play size={14} className="fill-neutral-950" />
          <span>RUN</span>
        </button>

        {/* Output Toggle Button */}
        <button
          onClick={onToggleOutput}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 border ${
            isConsoleActive
              ? 'bg-blue-600 text-white border-blue-500'
              : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
          }`}
        >
          <Terminal size={14} />
          <span>OUTPUT (Alt+F5)</span>
        </button>

        {/* Save Button */}
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 active:bg-amber-700 text-neutral-950 font-bold text-xs rounded-lg whitespace-nowrap shadow-sm cursor-pointer shrink-0"
        >
          <Save size={14} />
          <span>SAVE (F2)</span>
        </button>

        {/* Saved Codes Library Button */}
        <button
          onClick={onOpenSavedDrawer}
          className="flex items-center gap-1.5 px-2.5 py-2 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-200 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer shrink-0"
        >
          <FolderOpen size={14} className="text-amber-400" />
          <span className="hidden sm:inline">SAVED CODES</span>
          <span className="sm:hidden">SAVED</span>
        </button>

        {/* Export PDF Button */}
        <button
          onClick={onOpenLabReport}
          className="flex items-center gap-1.5 px-2.5 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer shrink-0"
          title="Export Student Code Sheet (PDF)"
        >
          <Printer size={14} className="text-amber-400" />
          <span>EXPORT PDF</span>
        </button>

        {/* Paste Code Button */}
        <button
          onClick={onPasteCode}
          className="flex items-center gap-1.5 px-2.5 py-2 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-200 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer shrink-0"
        >
          <ClipboardPaste size={14} className="text-purple-400" />
          <span>PASTE</span>
        </button>

        {/* Graphics Screen Toggle if graphics code detected */}
        {hasGraphics && (
          <button
            onClick={onToggleGraphics}
            className="flex items-center gap-1.5 px-2.5 py-2 bg-purple-950 border border-purple-800 text-purple-300 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer shrink-0"
          >
            <Shapes size={14} />
            <span>GRAPHICS</span>
          </button>
        )}

        {/* Clear Console (clrscr) */}
        <button
          onClick={onClearScreen}
          className="flex items-center gap-1.5 px-2.5 py-2 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer shrink-0"
          title="Clear console screen"
        >
          <Eraser size={14} />
          <span className="hidden sm:inline">CLRSCR</span>
        </button>
      </div>
    </div>
  );
}
