import { 
  Play, 
  CheckCircle, 
  Save, 
  FolderOpen, 
  FileCode, 
  BookOpen, 
  HelpCircle, 
  Download, 
  Upload, 
  Monitor,
  Sparkles,
  Printer,
  Home,
  ArrowLeft,
  Edit3,
  FilePlus
} from 'lucide-react';
import { CompilerTheme } from '../types/compiler';

interface CompilerHeaderProps {
  filename: string;
  isModified: boolean;
  savedCount: number;
  theme: CompilerTheme;
  compilerName?: string;
  compilerSubtitle?: string;
  onThemeChange: (theme: CompilerTheme) => void;
  onRun: () => void;
  onCompile: () => void;
  onSave: () => void;
  onNewFile?: () => void;
  onOpenSavedDrawer: () => void;
  onOpenExamples: () => void;
  onOpenPasteModal: () => void;
  onOpenShortcuts: () => void;
  onOpenLabReport: () => void;
  onDownload: () => void;
  onImportClick: () => void;
  onBackToPortal?: () => void;
  onOpenRenameModal?: () => void;
}

export function CompilerHeader({
  filename,
  isModified,
  savedCount,
  theme,
  compilerName = 'Online C & Turbo C++ Compiler',
  compilerSubtitle = 'Designed for DYCET and All Students From other Colleges',
  onThemeChange,
  onRun,
  onCompile,
  onSave,
  onNewFile,
  onOpenSavedDrawer,
  onOpenExamples,
  onOpenPasteModal,
  onOpenShortcuts,
  onOpenLabReport,
  onDownload,
  onImportClick,
  onBackToPortal,
  onOpenRenameModal
}: CompilerHeaderProps) {
  return (
    <header className="border-b border-neutral-800 bg-[#090b10] text-neutral-100 select-none">
      {/* Top Identity Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onBackToPortal && (
            <button
              onClick={onBackToPortal}
              className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Return to Overview & Guides"
            >
              <Home size={14} className="text-blue-400" />
              <span className="hidden sm:inline">Overview & Guides</span>
            </button>
          )}

          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 border border-amber-400/50 flex items-center justify-center text-white font-mono font-black text-xs sm:text-sm shadow-md shadow-orange-950/30 shrink-0">
            CF
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span 
                onClick={onOpenRenameModal}
                className="font-bold text-xs sm:text-base tracking-tight text-white font-sans truncate max-w-[140px] sm:max-w-none cursor-pointer hover:text-blue-300 transition-colors"
                title="Click to rename compiler"
              >
                {compilerName}
              </span>
              <span className="text-[9px] sm:text-[10px] bg-blue-950 text-blue-300 border border-blue-800/80 px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded font-mono font-medium">
                v3.2
              </span>
              {onOpenRenameModal && (
                <button
                  type="button"
                  onClick={onOpenRenameModal}
                  className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                  title="Rename compiler or heading"
                >
                  <Edit3 size={13} className="text-amber-400" />
                </button>
              )}
            </div>
            <div className="hidden sm:flex text-[11px] text-neutral-400 items-center gap-1.5 font-sans">
              <span className="font-medium text-neutral-300">By Maaz Patwekar</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-medium">
                {compilerSubtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Current Active File Info */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono">
          <FileCode size={14} className="text-blue-400" />
          <span className="text-white font-semibold">{filename}</span>
          {isModified && (
            <span className="text-amber-400 text-[10px] bg-amber-950/60 border border-amber-800/50 px-1.5 py-0.2 rounded">
              Unsaved
            </span>
          )}
        </div>

        {/* Action Controls & Modal Triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Theme switcher */}
          <div className="hidden lg:flex items-center gap-1 bg-neutral-900 p-1 border border-neutral-800 rounded-lg text-xs">
            <button
              onClick={() => onThemeChange('retro-dos')}
              title="Classic Borland Turbo C Blue"
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                theme === 'retro-dos' ? 'bg-blue-900 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              DOS Blue
            </button>
            <button
              onClick={() => onThemeChange('modern-dark')}
              title="Modern Dark Studio"
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                theme === 'modern-dark' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Modern
            </button>
            <button
              onClick={() => onThemeChange('amber-crt')}
              title="Retro Amber Phosphor CRT"
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                theme === 'amber-crt' ? 'bg-amber-950 text-amber-300 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              CRT
            </button>
          </div>

          {/* Saved Codes Drawer Button - KEY USER FEATURE */}
          <button
            onClick={onOpenSavedDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            title="Open Saved Codes Library (F3)"
          >
            <FolderOpen size={14} className="text-amber-400" />
            <span>Saved Codes</span>
            <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-mono font-bold">
              {savedCount}
            </span>
          </button>

          {/* Quick Save Button */}
          <button
            onClick={onSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
              isModified
                ? 'bg-amber-600 hover:bg-amber-500 text-neutral-950 border-amber-400 shadow-xs'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
            }`}
            title="Save Current Code to Browser (F2)"
          >
            <Save size={14} />
            <span>Save (F2)</span>
          </button>

          {/* Export Code PDF Button */}
          <button
            onClick={onOpenLabReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            title="Export Student Code Sheet (PDF / Print)"
          >
            <Printer size={14} className="text-amber-400" />
            <span>Export PDF</span>
          </button>

          {/* Compile Button */}
          <button
            onClick={onCompile}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Compile & Syntax Check (Alt+F9)"
          >
            <CheckCircle size={14} className="text-emerald-400" />
            <span>Compile (Alt+F9)</span>
          </button>

          {/* Run Button (Primary) */}
          <button
            onClick={onRun}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md"
            title="Run Code in Emulator (Ctrl+F9)"
          >
            <Play size={14} className="fill-neutral-950" />
            <span>Run (Ctrl+F9)</span>
          </button>
        </div>
      </div>

      {/* Secondary Fast Utility Bar */}
      <div className="bg-neutral-950 border-t border-neutral-800/80 px-4 py-1.5 text-xs text-neutral-400 flex items-center justify-between overflow-x-auto gap-4">
        <div className="flex items-center gap-3 shrink-0">
          {onNewFile && (
            <>
              <button
                onClick={onNewFile}
                className="hover:text-amber-300 text-amber-400 font-medium transition-colors flex items-center gap-1 cursor-pointer"
                title="Create a new file with default Hello World in C"
              >
                <FilePlus size={12} className="text-amber-400" />
                <span>New (main.c)</span>
              </button>
              <span>·</span>
            </>
          )}
          <button
            onClick={onOpenExamples}
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <BookOpen size={12} className="text-blue-400" />
            <span>Syllabus Examples</span>
          </button>
          <span>·</span>
          <button
            onClick={onOpenPasteModal}
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <FileCode size={12} className="text-purple-400" />
            <span>Paste / Insert Code</span>
          </button>
          <span>·</span>
          <button
            onClick={onImportClick}
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Upload size={12} className="text-emerald-400" />
            <span>Import .C / .CPP</span>
          </button>
          <span>·</span>
          <button
            onClick={onDownload}
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Download size={12} className="text-sky-400" />
            <span>Download File</span>
          </button>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenShortcuts}
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer text-neutral-400 font-mono text-[11px]"
          >
            <HelpCircle size={12} />
            <span>Shortcuts & Help</span>
          </button>
        </div>
      </div>
    </header>
  );
}
