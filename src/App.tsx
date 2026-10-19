import React, { useState, useEffect, useRef } from 'react';
import { CompilerHeader } from './components/CompilerHeader';
import { TouchBar } from './components/TouchBar';
import { CodeEditor } from './components/CodeEditor';
import { OutputConsole } from './components/OutputConsole';
import { SavedCodesDrawer } from './components/SavedCodesDrawer';
import { PasteCodeModal } from './components/PasteCodeModal';
import { ExamplesModal } from './components/ExamplesModal';
import { ShortcutsGuideModal } from './components/ShortcutsGuideModal';
import { LabReportModal } from './components/LabReportModal';
import { CompilerPortalPage } from './components/CompilerPortalPage';
import { RenameCompilerModal } from './components/RenameCompilerModal';
import { storageService, DEFAULT_PROGRAM } from './services/storageService';
import { CInterpreter } from './engine/cInterpreter';
import { SavedProgram, CompilerTheme, ExecutionResult, SampleProgram } from './types/compiler';
import { Check, Info, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation view: 'portal' (engaging landing & guide page) or 'compiler' (IDE workspace)
  const [currentView, setCurrentView] = useState<'portal' | 'compiler'>('portal');

  // Configurable Compiler Branding State (CForge Developed by Maaz Patwekar)
  const [compilerName, setCompilerName] = useState<string>(() => {
    const saved = localStorage.getItem('turboc_compiler_name');
    if (!saved || saved === 'Online C & Turbo C++ Compiler' || saved === 'Online Turbo C++ Compiler') {
      return 'CForge';
    }
    return saved;
  });
  const [compilerSubtitle, setCompilerSubtitle] = useState<string>(() => {
    const saved = localStorage.getItem('turboc_compiler_subtitle');
    if (!saved || saved === 'Designed for DYCET and All Students From other Colleges') {
      return 'Developed by Maaz Patwekar';
    }
    return saved;
  });
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  // Load saved files from storage
  const [savedPrograms, setSavedPrograms] = useState<SavedProgram[]>(() => {
    return storageService.getSavedPrograms();
  });

  // Current active code and filename
  const [code, setCode] = useState<string>(() => {
    const draft = storageService.loadDraft();
    return draft ? draft.code : DEFAULT_PROGRAM.code;
  });

  const [filename, setFilename] = useState<string>(() => {
    const draft = storageService.loadDraft();
    return draft ? draft.filename : DEFAULT_PROGRAM.filename;
  });

  const [activeProgramId, setActiveProgramId] = useState<string | null>(DEFAULT_PROGRAM.id);
  const [isModified, setIsModified] = useState(false);
  const [theme, setTheme] = useState<CompilerTheme>('retro-dos');

  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [inputBuffer, setInputBuffer] = useState<string[]>([]);

  // Mobile layout state: toggle between editor view and output console
  const [mobileTab, setMobileTab] = useState<'editor' | 'output'>('editor');

  // Modals state
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isExamplesOpen, setIsExamplesOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isLabReportOpen, setIsLabReportOpen] = useState(false);

  // Toast notification state
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Sync browser document title with compilerName
  useEffect(() => {
    document.title = `${compilerName} | DYPCET`;
  }, [compilerName]);

  const handleSaveCompilerBranding = (newName: string, newSubtitle?: string) => {
    setCompilerName(newName);
    try {
      localStorage.setItem('turboc_compiler_name', newName);
    } catch {}
    if (newSubtitle) {
      setCompilerSubtitle(newSubtitle);
      try {
        localStorage.setItem('turboc_compiler_subtitle', newSubtitle);
      } catch {}
    }
    showToast(`Compiler updated to: ${newName}`, 'success');
  };

  // Auto-save draft on every code change
  useEffect(() => {
    storageService.saveDraft(code, filename);
  }, [code, filename]);

  // Auto-save interval feature: triggers save logic every 30 seconds to prevent data loss in the editor
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      // 1. Always ensure draft is saved to localStorage
      storageService.saveDraft(code, filename);

      // 2. If code has uncommitted modifications, update active program and show status
      if (isModified) {
        if (activeProgramId) {
          storageService.saveProgram({
            id: activeProgramId,
            filename,
            title: filename,
            code
          });
          setSavedPrograms(storageService.getSavedPrograms());
        }
        setIsModified(false);
        showToast(`Auto-saved "${filename}" (30s interval)`, 'info');
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveTimer);
  }, [code, filename, isModified, activeProgramId]);

  // Code change handler
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setIsModified(true);
  };

  // RUN CODE (Ctrl + F9)
  const handleRun = () => {
    setIsRunning(true);
    // On mobile, auto show output screen
    setMobileTab('output');

    setTimeout(() => {
      const res = CInterpreter.run(code, inputBuffer);
      setExecutionResult(res);
      setIsRunning(false);

      if (res.success) {
        showToast('Program compiled and ran successfully!', 'success');
      } else {
        showToast('Compilation encountered errors. Check output.', 'error');
      }
    }, 150);
  };

  // COMPILE ONLY (Alt + F9)
  const handleCompile = () => {
    const errors = CInterpreter.compileCheck(code);
    const fatal = errors.filter(e => e.severity === 'error');

    if (fatal.length === 0) {
      showToast(`Compilation successful! 0 Errors, ${errors.length} Warnings`, 'success');
      setExecutionResult({
        success: true,
        logs: [
          { type: 'system', text: `Compiling ${filename}...`, timestamp: Date.now() },
          { type: 'stdout', text: 'Linking TURBOC.LIB ... done.\nCompilation successful: 0 Errors.', timestamp: Date.now() }
        ],
        graphicsCommands: [],
        errors,
        executionTimeMs: 45,
        hasGraphics: code.includes('initgraph')
      });
    } else {
      showToast(`Compile failed: ${fatal.length} Errors detected`, 'error');
      setMobileTab('output');
      setExecutionResult({
        success: false,
        logs: [
          { type: 'stderr', text: `Compiling ${filename}...`, timestamp: Date.now() },
          ...fatal.map(err => ({
            type: 'stderr' as const,
            text: `Error on line ${err.line}: ${err.message}`,
            timestamp: Date.now()
          }))
        ],
        graphicsCommands: [],
        errors,
        executionTimeMs: 30,
        hasGraphics: false
      });
    }
  };

  // SAVE CODE (F2) - The user's primary requested feature
  const handleSave = () => {
    // If active program exists, update it directly
    if (activeProgramId) {
      const updated = storageService.saveProgram({
        id: activeProgramId,
        filename,
        title: filename,
        code
      });
      setSavedPrograms(storageService.getSavedPrograms());
      setIsModified(false);
      showToast(`Saved "${filename}" (F2)`, 'success');
    } else {
      // Otherwise open the saved codes drawer to name it
      setIsSavedDrawerOpen(true);
    }
  };

  // Save As new program with metadata
  const handleSaveCurrentAs = (newFilename: string, title: string, desc: string, tags: string[]) => {
    const newProg = storageService.saveProgram({
      filename: newFilename,
      title,
      code,
      description: desc,
      tags
    });

    setFilename(newProg.filename);
    setActiveProgramId(newProg.id);
    setSavedPrograms(storageService.getSavedPrograms());
    setIsModified(false);
    showToast(`Saved "${newProg.filename}" to program library`, 'success');
  };

  // Load a program from saved library
  const handleLoadProgram = (program: SavedProgram) => {
    setCode(program.code);
    setFilename(program.filename);
    setActiveProgramId(program.id);
    setIsModified(false);
    setExecutionResult(null);
    setInputBuffer([]);
    setMobileTab('editor');
    showToast(`Loaded "${program.filename}" into editor`, 'info');
  };

  // Delete program
  const handleDeleteProgram = (id: string) => {
    storageService.deleteProgram(id);
    setSavedPrograms(storageService.getSavedPrograms());
    if (activeProgramId === id) {
      setActiveProgramId(null);
    }
    showToast('Program deleted from storage', 'info');
  };

  // Duplicate program
  const handleDuplicateProgram = (id: string) => {
    const copy = storageService.duplicateProgram(id);
    if (copy) {
      setSavedPrograms(storageService.getSavedPrograms());
      showToast(`Created duplicate "${copy.filename}"`, 'success');
    }
  };

  // Download code as .C or .CPP
  const handleDownloadFile = () => {
    storageService.downloadFile(filename, code);
    showToast(`Downloaded ${filename}`, 'success');
  };

  // Download specific program from list
  const handleDownloadProgram = (prog: SavedProgram) => {
    storageService.downloadFile(prog.filename, prog.code);
    showToast(`Downloaded ${prog.filename}`, 'success');
  };

  // Export JSON backup
  const handleExportBackup = () => {
    storageService.exportAllBackup();
    showToast('Exported backup of all saved programs', 'success');
  };

  // Import JSON backup
  const handleImportBackup = (jsonStr: string) => {
    const res = storageService.importBackup(jsonStr);
    if (res.success) {
      setSavedPrograms(storageService.getSavedPrograms());
      showToast(`Restored ${res.count} programs from backup!`, 'success');
    } else {
      showToast(res.error || 'Failed to restore backup', 'error');
    }
  };

  // Insert pasted code
  const handleInsertPastedCode = (pasted: string, targetName: string) => {
    setCode(pasted);
    setFilename(targetName);
    setActiveProgramId(null);
    setIsModified(true);
    setExecutionResult(null);
    showToast(`Inserted code into ${targetName}`, 'success');
  };

  // New File / Reset to Default Hello World in C
  const handleNewFile = () => {
    setCode(DEFAULT_PROGRAM.code);
    setFilename(DEFAULT_PROGRAM.filename);
    setActiveProgramId(null);
    setIsModified(false);
    setExecutionResult(null);
    setInputBuffer([]);
    showToast('Loaded fresh Hello World in C (main.c)', 'info');
  };

  // Select sample program
  const handleSelectSample = (sample: SampleProgram) => {
    setCode(sample.code);
    setFilename(sample.filename);
    setActiveProgramId(null);
    setIsModified(false);
    setExecutionResult(null);
    setInputBuffer([]);
    setMobileTab('editor');
    showToast(`Loaded sample: ${sample.title}`, 'info');
  };

  // Handle uploaded file
  const handleFileImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setCode(text);
        setFilename(file.name.toUpperCase());
        setActiveProgramId(null);
        setIsModified(true);
        setExecutionResult(null);
        showToast(`Imported ${file.name}`, 'success');
      }
    };
    reader.readAsText(file);
  };

  // Clear Screen (clrscr)
  const handleClearScreen = () => {
    setExecutionResult({
      success: true,
      logs: [{ type: 'system', text: '[Screen Cleared - clrscr()]', timestamp: Date.now() }],
      graphicsCommands: [],
      errors: [],
      executionTimeMs: 0,
      hasGraphics: false
    });
    setInputBuffer([]);
    showToast('Cleared console screen (clrscr)', 'info');
  };

  // Interactive user input for scanf / cin
  const handleSendInput = (inputVal: string) => {
    const newBuf = [...inputBuffer, inputVal];
    setInputBuffer(newBuf);

    // Re-run with new input
    const res = CInterpreter.run(code, newBuf);
    setExecutionResult(res);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F9 to Run
      if (e.ctrlKey && e.key === 'F9') {
        e.preventDefault();
        handleRun();
      }
      // Alt+F9 to Compile
      else if (e.altKey && e.key === 'F9') {
        e.preventDefault();
        handleCompile();
      }
      // Alt+F5 to Toggle Output
      else if (e.altKey && e.key === 'F5') {
        e.preventDefault();
        setMobileTab(prev => (prev === 'editor' ? 'output' : 'editor'));
      }
      // F2 to Save
      else if (e.key === 'F2') {
        e.preventDefault();
        handleSave();
      }
      // F3 to Open Saved Drawer
      else if (e.key === 'F3') {
        e.preventDefault();
        setIsSavedDrawerOpen(prev => !prev);
      }
      // Escape to close open modal
      else if (e.key === 'Escape') {
        setIsSavedDrawerOpen(false);
        setIsExamplesOpen(false);
        setIsPasteModalOpen(false);
        setIsShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, filename, activeProgramId, inputBuffer]);

  const hasGraphics = code.includes('initgraph') || code.includes('circle(') || code.includes('line(');

  return (
    <div className="min-h-screen bg-[#07090e] text-neutral-100 flex flex-col font-sans select-none pb-14 md:pb-0">
      {/* Hidden file input for file imports */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".c,.cpp,.h,.txt"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileImport(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Main View Router: Portal Landing Page vs Full Compiler IDE */}
      {currentView === 'portal' ? (
        <CompilerPortalPage
          compilerName={compilerName}
          compilerSubtitle={compilerSubtitle}
          onOpenRenameModal={() => setIsRenameModalOpen(true)}
          onLaunchCompiler={(sample) => {
            if (sample) {
              handleSelectSample(sample);
            }
            setCurrentView('compiler');
          }}
          onOpenLabReport={() => setIsLabReportOpen(true)}
          onOpenSavedCodes={() => setIsSavedDrawerOpen(true)}
        />
      ) : (
        <>
          {/* Top Header */}
          <CompilerHeader
            filename={filename}
            isModified={isModified}
            savedCount={savedPrograms.length}
            theme={theme}
            compilerName={compilerName}
            compilerSubtitle={compilerSubtitle}
            onOpenRenameModal={() => setIsRenameModalOpen(true)}
            onThemeChange={setTheme}
            onRun={handleRun}
            onCompile={handleCompile}
            onSave={handleSave}
            onNewFile={handleNewFile}
            onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
            onOpenExamples={() => setIsExamplesOpen(true)}
            onOpenPasteModal={() => setIsPasteModalOpen(true)}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            onOpenLabReport={() => setIsLabReportOpen(true)}
            onDownload={handleDownloadFile}
            onImportClick={() => fileInputRef.current?.click()}
            onBackToPortal={() => setCurrentView('portal')}
          />

          {/* Mobile Tab Switcher (Visible on small screens) */}
          <div className="md:hidden flex border-b border-neutral-800 bg-neutral-900 text-xs">
            <button
              onClick={() => setMobileTab('editor')}
              className={`flex-1 py-2 text-center font-semibold border-b-2 cursor-pointer transition-colors ${
                mobileTab === 'editor'
                  ? 'border-blue-500 text-white bg-neutral-800/80 shadow-xs'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              💻 Source Editor ({filename})
            </button>
            <button
              onClick={() => setMobileTab('output')}
              className={`flex-1 py-2 text-center font-semibold border-b-2 cursor-pointer transition-colors ${
                mobileTab === 'output'
                  ? 'border-emerald-500 text-white bg-neutral-800/80 shadow-xs'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              📺 Output Screen (Alt+F5)
            </button>
          </div>

          {/* Main Workspace (Split Pane on desktop, Tabbed on mobile) */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 grid grid-cols-1 md:grid-cols-12 gap-3 min-h-[480px] h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]">
            {/* Left Column: Code Editor (7 cols) */}
            <div className={`md:col-span-7 h-full ${mobileTab === 'editor' ? 'block' : 'hidden md:block'}`}>
              <CodeEditor
                code={code}
                filename={filename}
                theme={theme}
                onChange={handleCodeChange}
                onRun={handleRun}
                onSave={handleSave}
                onCompile={handleCompile}
                onFileDrop={handleFileImport}
                onThemeChange={setTheme}
              />
            </div>

            {/* Right Column: Output Console & Graphics Screen (5 cols) */}
            <div className={`md:col-span-5 h-full ${mobileTab === 'output' ? 'block' : 'hidden md:block'}`}>
              <OutputConsole
                result={executionResult}
                isRunning={isRunning}
                theme={theme}
                onClear={handleClearScreen}
                onReRun={handleRun}
                onSendInput={handleSendInput}
              />
            </div>
          </main>

          {/* Mobile & Quick Touch Bar (The signature feature from original site) */}
          <TouchBar
            onRun={handleRun}
            onToggleOutput={() => setMobileTab(prev => (prev === 'editor' ? 'output' : 'editor'))}
            onSave={handleSave}
            onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
            onOpenLabReport={() => setIsLabReportOpen(true)}
            onPasteCode={() => setIsPasteModalOpen(true)}
            onImportClick={() => fileInputRef.current?.click()}
            onClearScreen={handleClearScreen}
            onToggleGraphics={() => setMobileTab('output')}
            hasGraphics={hasGraphics}
            isConsoleActive={mobileTab === 'output'}
          />
        </>
      )}

      {/* Slide-over Saved Codes Drawer (Priority Save Feature) */}
      <SavedCodesDrawer
        isOpen={isSavedDrawerOpen}
        currentCode={code}
        currentFilename={filename}
        savedPrograms={savedPrograms}
        onClose={() => setIsSavedDrawerOpen(false)}
        onSaveCurrentAs={handleSaveCurrentAs}
        onLoadProgram={handleLoadProgram}
        onDeleteProgram={handleDeleteProgram}
        onDuplicateProgram={handleDuplicateProgram}
        onDownloadProgram={handleDownloadProgram}
        onExportAllBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {/* Paste / Insert Code Modal */}
      <PasteCodeModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onInsertCode={handleInsertPastedCode}
      />

      {/* Syllabus Programs / Examples Modal */}
      <ExamplesModal
        isOpen={isExamplesOpen}
        onClose={() => setIsExamplesOpen(false)}
        onSelectProgram={handleSelectSample}
      />

      {/* Keyboard Shortcuts & Help Modal */}
      <ShortcutsGuideModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Lab Practical Report Generator (Print/PDF for DYPCET & Other Colleges) */}
      <LabReportModal
        isOpen={isLabReportOpen}
        onClose={() => setIsLabReportOpen(false)}
        code={code}
        filename={filename}
        outputLogs={executionResult ? executionResult.logs.filter(l => l.type === 'stdout').map(l => l.text) : []}
      />

      {/* Rename Compiler / Custom Branding Modal */}
      <RenameCompilerModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        currentName={compilerName}
        currentSubtitle={compilerSubtitle}
        onSave={handleSaveCompilerBranding}
      />

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed top-14 right-4 z-50 bg-neutral-900 border border-neutral-700 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          {toastMsg.type === 'success' && <Check size={14} className="text-emerald-400" />}
          {toastMsg.type === 'info' && <Info size={14} className="text-blue-400" />}
          {toastMsg.type === 'error' && <AlertCircle size={14} className="text-rose-400" />}
          <span className="font-medium">{toastMsg.text}</span>
        </div>
      )}
    </div>
  );
}
