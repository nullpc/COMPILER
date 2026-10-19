import React, { useState } from 'react';
import { 
  Play, 
  FileText, 
  BookOpen, 
  Code2, 
  Terminal, 
  Smartphone, 
  Download, 
  Save, 
  CheckCircle2, 
  ChevronRight, 
  GraduationCap, 
  Building2, 
  ExternalLink,
  Laptop,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Layers,
  Copy,
  Check,
  Edit3
} from 'lucide-react';
import { SAMPLE_PROGRAMS } from '../data/samplePrograms';
import { SampleProgram } from '../types/compiler';

interface CompilerPortalPageProps {
  onLaunchCompiler: (initialSample?: SampleProgram) => void;
  onOpenLabReport: () => void;
  onOpenSavedCodes: () => void;
  compilerName?: string;
  compilerSubtitle?: string;
  onOpenRenameModal?: () => void;
}

export function CompilerPortalPage({
  onLaunchCompiler,
  onOpenLabReport,
  onOpenSavedCodes,
  compilerName = 'Online C & Turbo C++ Compiler',
  compilerSubtitle = 'Designed for DYCET and All Students From other Colleges',
  onOpenRenameModal
}: CompilerPortalPageProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'features' | 'practicals' | 'guide' | 'viva'>('features');

  // Mini live demo state
  const [demoCode, setDemoCode] = useState<string>(
`// Online C compiler to run C program online
#include <stdio.h>

int main() {
    // Write C code here
    printf("Hello, World!\\n");

    return 0;
}`
  );
  const [demoOutput, setDemoOutput] = useState<string | null>(null);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  const handleRunDemo = () => {
    setIsDemoRunning(true);
    setTimeout(() => {
      setDemoOutput(
        "Hello, World!\n\n" +
        "[Process finished in 15ms with exit code 0]"
      );
      setIsDemoRunning(false);
    }, 200);
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-neutral-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Banner - College & Creator Tribute */}
      <div className="bg-gradient-to-r from-blue-950 via-neutral-900 to-indigo-950 border-b border-blue-900/40 text-xs py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 text-neutral-300">
          <div 
            onClick={onOpenRenameModal}
            className="font-semibold text-white flex items-center gap-1.5 cursor-pointer hover:text-blue-300 transition-colors"
            title="Click to rename compiler"
          >
            <span>{compilerName}</span>
            {onOpenRenameModal && <Edit3 size={12} className="text-amber-400" />}
          </div>
          <span className="text-neutral-500">•</span>
          <span>Developed by <strong className="text-amber-400">Maaz Patwekar</strong></span>
          <span className="text-neutral-500">•</span>
          <span className="text-blue-300 font-medium">
            {compilerSubtitle}
          </span>
          <span className="hidden sm:inline bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-mono ml-1">
            CForge v3.2
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#090b10]/95 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 border border-amber-400/50 flex items-center justify-center text-white font-mono font-black text-base shadow-lg shadow-orange-950/40 tracking-wider">
              CF
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg text-white tracking-tight flex items-center gap-2">
                <span 
                  onClick={onOpenRenameModal}
                  className="cursor-pointer hover:text-amber-300 transition-colors"
                  title="Click to rename compiler"
                >
                  {compilerName}
                </span>
                {onOpenRenameModal && (
                  <button
                    onClick={onOpenRenameModal}
                    className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                    title="Change Compiler Name"
                  >
                    <Edit3 size={13} className="text-amber-400" />
                  </button>
                )}
              </div>
              <div className="text-[11px] text-neutral-400 truncate max-w-[240px] sm:max-w-none">
                {compilerSubtitle}
              </div>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/80 p-1 border border-neutral-800 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('features')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'features' ? 'bg-blue-600 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Key Features
            </button>
            <button
              onClick={() => setActiveTab('practicals')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'practicals' ? 'bg-blue-600 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Lab Practicals
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'guide' ? 'bg-blue-600 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Turbo C vs Modern C
            </button>
            <button
              onClick={() => setActiveTab('viva')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'viva' ? 'bg-blue-600 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Viva Q&A
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLabReport}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
              title="Export Student Code Sheet (PDF)"
            >
              <FileText size={15} className="text-amber-400" />
              <span>Export PDF</span>
            </button>

            <button
              onClick={() => onLaunchCompiler()}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 rounded-xl text-xs font-bold transition-all transform active:scale-95 cursor-pointer shadow-lg shadow-emerald-950/40"
            >
              <Play size={15} fill="currentColor" />
              <span>Launch Compiler (F9)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-20 border-b border-neutral-800/80 overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Value Proposition & Intro */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs font-mono">
                <Sparkles size={13} className="text-amber-400" />
                <span>CForge C &amp; C++ Compiler Engine · conio.h &amp; BGI</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
                Write, Compile & Run <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                  {compilerName}
                </span>
              </h1>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                No DOSBox installation. No mounting C:\TURBOC3. No missing linker errors. 
                Full support for authentic 16-bit engineering lab functions like <code className="text-amber-300 bg-neutral-900 px-1 py-0.5 rounded font-mono text-xs">clrscr()</code>, <code className="text-amber-300 bg-neutral-900 px-1 py-0.5 rounded font-mono text-xs">getch()</code>, 
                2D Arrays, and BGI Turbo Graphics.
              </p>

              {/* Tribute Card */}
              <div className="p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-xl flex items-center justify-between gap-3.5 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold shrink-0">
                    <GraduationCap size={20} />
                  </div>
                  <div className="text-xs">
                    <div className="text-neutral-400">Created by <strong className="text-white">Maaz Patwekar</strong></div>
                    <div className="text-amber-400 font-semibold mt-0.5">
                      {compilerSubtitle}
                    </div>
                  </div>
                </div>
                {onOpenRenameModal && (
                  <button
                    onClick={onOpenRenameModal}
                    className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    title="Change compiler branding"
                  >
                    <Edit3 size={13} className="text-amber-400" />
                    <span>Change Name</span>
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onLaunchCompiler()}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-sm rounded-xl flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  <Play size={16} fill="currentColor" />
                  <span>Start Coding (Launch Compiler)</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={onOpenLabReport}
                  className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/40 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <FileText size={16} className="text-amber-400" />
                  <span>Generate Lab Report (PDF)</span>
                </button>

                <button
                  onClick={onOpenSavedCodes}
                  className="px-4 py-3 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-xl text-sm font-medium flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save size={15} className="text-blue-400" />
                  <span>Saved Codes</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>100% Free & No Setup</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Instant PDF Downloads</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Mobile Touch Controls</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Auto-Save Enabled</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Demo Preview Window */}
            <div className="lg:col-span-5">
              <div className="bg-[#0b101e] border-2 border-blue-900/70 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
                {/* Simulated Turbo C Window Header */}
                <div className="bg-blue-950 px-4 py-2 border-b border-blue-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span className="text-blue-200 font-bold ml-2">DEMO.C (Interactive Preview)</span>
                  </div>
                  <span className="text-[10px] text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded">
                    16-Bit DOS
                  </span>
                </div>

                {/* Simulated Code Body */}
                <div className="p-4 bg-[#050b1a] text-blue-100 font-mono text-[11px] leading-relaxed overflow-x-auto min-h-[200px]">
                  <pre className="whitespace-pre">
                    {demoCode}
                  </pre>
                </div>

                {/* Interactive Demo Action Bar */}
                <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between gap-2">
                  <button
                    onClick={handleRunDemo}
                    disabled={isDemoRunning}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play size={13} fill="currentColor" />
                    <span>{isDemoRunning ? 'Executing...' : 'Run Quick Demo'}</span>
                  </button>

                  <button
                    onClick={() => onLaunchCompiler({
                      id: 'demo-sample',
                      filename: 'main.c',
                      title: 'Hello World in C',
                      description: 'Standard Hello World program in C to compile and run online',
                      code: demoCode,
                      category: 'Basics'
                    })}
                    className="px-3 py-1.5 bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700/60 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Open in Full IDE</span>
                    <ExternalLink size={12} />
                  </button>
                </div>

                {/* Simulated Output Terminal Area */}
                {demoOutput && (
                  <div className="p-3.5 bg-black text-emerald-400 font-mono text-[11px] border-t border-neutral-800 leading-normal animate-in fade-in">
                    <div className="text-[10px] text-neutral-500 mb-1 font-sans">
                      SIMULATED DOS SCREEN OUTPUT:
                    </div>
                    <pre className="whitespace-pre-wrap">{demoOutput}</pre>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Tabs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-12">
        
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-neutral-800 overflow-x-auto gap-4 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'features' ? 'border-blue-500 text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles size={16} className="text-amber-400" />
            <span>Platform Features</span>
          </button>

          <button
            onClick={() => setActiveTab('practicals')}
            className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'practicals' ? 'border-blue-500 text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BookOpen size={16} className="text-blue-400" />
            <span>Engineering Lab Practicals</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'guide' ? 'border-blue-500 text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Code2 size={16} className="text-emerald-400" />
            <span>Turbo C++ vs Modern C Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('viva')}
            className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'viva' ? 'border-blue-500 text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <HelpCircle size={16} className="text-purple-400" />
            <span>Viva Voce Exam Questions</span>
          </button>
        </div>

        {/* TAB 1: FEATURES */}
        {activeTab === 'features' && (
          <div className="space-y-10 animate-in fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Engineered for Engineering & Polytechnic Students
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm">
                Every feature was built to make practical lab submissions effortless, whether you are at DYPCET or any college.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-3 hover:border-neutral-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Terminal size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Real conio.h & clrscr() / getch()</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Borland Turbo C++ uses conio.h for screen buffers. Our custom runtime natively processes clrscr(), getch(), getche(), and kbhit() without errors.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-3 hover:border-neutral-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <FileText size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Lab Practical Report Generator (PDF)</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Generate official A4 practical writeups with aim, theory, code, and output. Supports DYPCET Autonomous letterhead or clean customizable templates for any college.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-3 hover:border-neutral-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Smartphone size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Mobile Thumb-Friendly TouchBar</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Typing semicolons, curly braces, and brackets on smartphones is frustrating. Our mobile touchbar gives you 1-tap buttons for rapid coding on mobile phones.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-3 hover:border-neutral-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Layers size={20} />
                </div>
                <h3 className="text-base font-bold text-white">BGI Turbo Graphics Canvas</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Run graphics practicals with initgraph, circle, line, rectangle, and setcolor on a simulated 640x480 EGA/VGA graphic screen.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-3 hover:border-neutral-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <Save size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Automatic Drafts & Save Feature (F2)</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Never lose your practical assignments. All files are automatically cached in browser storage with single-click import and export backups.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-3 hover:border-neutral-700 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                  <Laptop size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Keyboard Shortcuts (Ctrl+F9 / Alt+F9)</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  True to Borland nostalgia: Ctrl+F9 to Run, Alt+F9 to Compile, F2 to Save, F3 to Load saved files, and Alt+F5 to view User Screen.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ENGINEERING PRACTICALS */}
        {activeTab === 'practicals' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Curated Engineering Lab Practicals</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Ready-to-run lab assignment programs covering First Year (FE) and Second Year (SE) syllabus.
                </p>
              </div>
              <button
                onClick={() => onLaunchCompiler()}
                className="self-start sm:self-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Play size={14} fill="currentColor" />
                <span>Open Blank Compiler</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAMPLE_PROGRAMS.map((prog, idx) => (
                <div 
                  key={prog.id}
                  className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl hover:border-blue-700/60 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                        <h3 className="font-bold text-white text-sm">{prog.title}</h3>
                      </div>
                      <span className="font-mono text-[11px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">
                        {prog.filename}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {prog.description}
                    </p>

                    {/* Code Snippet Box */}
                    <div className="relative mt-2 p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-36">
                      <pre>{prog.code.slice(0, 220)}...</pre>
                      <button
                        onClick={() => handleCopyCode(prog.code, idx)}
                        className="absolute top-2 right-2 p-1.5 bg-neutral-800/80 hover:bg-neutral-700 rounded text-neutral-300 hover:text-white cursor-pointer"
                        title="Copy Code"
                      >
                        {copiedIndex === idx ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                    <span className="text-[11px] text-neutral-500 font-mono capitalize">
                      Category: {prog.category}
                    </span>
                    <button
                      onClick={() => onLaunchCompiler(prog)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Play size={12} fill="currentColor" />
                      <span>Open in Compiler</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GUIDE & TURBO C BASICS */}
        {activeTab === 'guide' && (
          <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Turbo C++ vs Modern C Guide</h2>
              <p className="text-xs text-neutral-400">
                Understanding the key differences and why engineering universities (DYPCET, SPPU, SUK, MU) still teach Turbo C++.
              </p>
            </div>

            <div className="space-y-6 text-xs text-neutral-300 leading-relaxed">
              <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-2">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <Terminal size={16} />
                  <span>Why clrscr() and getch() are used in Turbo C++</span>
                </h3>
                <p>
                  In the 16-bit DOS environment, the console screen persists output from previous runs. 
                  Calling <code className="text-white bg-neutral-800 px-1 py-0.5 rounded font-mono">clrscr();</code> clears the console buffer at the start of your program.
                </p>
                <p>
                  Calling <code className="text-white bg-neutral-800 px-1 py-0.5 rounded font-mono">getch();</code> halts program execution until the user presses a keystroke. 
                  Without getch(), the DOS console closes immediately before you can view the output!
                </p>
              </div>

              <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-2">
                <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                  <Code2 size={16} />
                  <span>void main() vs int main()</span>
                </h3>
                <p>
                  In modern C99/C11 standards (GCC/Clang), <code className="text-white font-mono">int main()</code> returning 0 is mandatory.
                  However, in Borland Turbo C++ 3.0, <code className="text-white font-mono">void main()</code> without a return statement is standard and expected by examiners.
                  Our compiler supports both seamlessly!
                </p>
              </div>

              <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <BookOpen size={16} />
                  <span>Common Header Files in Engineering Labs</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                    <span className="font-mono text-white font-semibold">&lt;stdio.h&gt;</span>
                    <p className="text-[11px] text-neutral-400 mt-1">Standard I/O functions: printf, scanf, getchar, putchar.</p>
                  </div>
                  <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                    <span className="font-mono text-white font-semibold">&lt;conio.h&gt;</span>
                    <p className="text-[11px] text-neutral-400 mt-1">Console I/O functions: clrscr, getch, getche, gotoxy, kbhit.</p>
                  </div>
                  <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                    <span className="font-mono text-white font-semibold">&lt;string.h&gt;</span>
                    <p className="text-[11px] text-neutral-400 mt-1">String manipulation: strlen, strcpy, strcmp, strcat.</p>
                  </div>
                  <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                    <span className="font-mono text-white font-semibold">&lt;graphics.h&gt;</span>
                    <p className="text-[11px] text-neutral-400 mt-1">BGI graphics functions: initgraph, circle, line, rectangle.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VIVA QUESTIONS */}
        {activeTab === 'viva' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Engineering Practical Viva Voce Q&A</h2>
              <p className="text-xs text-neutral-400">
                Top questions external examiners ask during C programming practical exams.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "What is the difference between getch(), getche(), and getchar()?",
                  a: "getch() reads a character directly without echoing to the screen; getche() reads and echoes the character immediately; getchar() reads from the standard input buffer only after Enter is pressed."
                },
                {
                  q: "Why do we use '&' in scanf() for variables, but not for character arrays/strings?",
                  a: "scanf() requires memory addresses. For basic variables like int or float, '&' provides the memory address. An array name already decays to a pointer to its first element, so '&' is not required."
                },
                {
                  q: "What is an uninitialized or garbage value in C?",
                  a: "When a local (automatic) variable is declared without an explicit value in C, it occupies whatever random binary bits were previously present at that memory location, known as garbage."
                },
                {
                  q: "What is the size of an integer in Turbo C++ vs Modern GCC?",
                  a: "In 16-bit Turbo C++, an int is 2 bytes (16 bits, range -32,768 to +32,767). In modern 32/64-bit GCC compilers, an int is 4 bytes (32 bits, range -2,147,483,648 to +2,147,483,647)."
                },
                {
                  q: "What is the purpose of initgraph() in Turbo C++?",
                  a: "initgraph initializes the Borland Graphics Interface (BGI) system by loading a graphic driver from disk and putting the system into graphics mode (typically 640x480 resolution)."
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-1.5">
                  <div className="font-semibold text-white text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] shrink-0 font-mono">
                      Q{idx + 1}
                    </span>
                    <span>{item.q}</span>
                  </div>
                  <p className="text-xs text-neutral-300 pl-7 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>

      {/* Lab Practical PDF Highlight Banner */}
      <section className="bg-gradient-to-r from-amber-950/40 via-neutral-900 to-amber-950/40 border-y border-amber-500/30 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Academic Lab Submission Tool
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Instant Lab Practical Report Generator
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
              Write code, run output, and download a publication-ready PDF lab report with student details, Aim, Theory, Source Code, and Console Output. 
              Features the official DYPCET Autonomous letterhead or universal format for any college.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={onOpenLabReport}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-950/50"
            >
              <FileText size={16} />
              <span>Open Report Generator</span>
            </button>
            <button
              onClick={() => onLaunchCompiler()}
              className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Play size={14} fill="currentColor" />
              <span>Start Coding First</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-[#06080d] text-neutral-400 py-10 px-4 sm:px-6 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <div className="font-bold text-white text-sm">
              Online Turbo C++ Compiler & Lab Assistant
            </div>
            <div className="text-neutral-400">
              Developed by <strong className="text-white">Maaz Patwekar</strong> · Designed for <span className="text-amber-400 font-medium">DYPCET and All Students From other Colleges</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-neutral-400">
            <button onClick={() => onLaunchCompiler()} className="hover:text-white cursor-pointer">Online Compiler</button>
            <span>•</span>
            <button onClick={onOpenLabReport} className="hover:text-white cursor-pointer">Lab Report PDF</button>
            <span>•</span>
            <button onClick={onOpenSavedCodes} className="hover:text-white cursor-pointer">Saved Codes Library</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
