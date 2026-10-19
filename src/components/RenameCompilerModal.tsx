import React, { useState } from 'react';
import { X, Check, RotateCcw, Edit3, Terminal, Sparkles } from 'lucide-react';

interface RenameCompilerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentSubtitle?: string;
  onSave: (newName: string, newSubtitle?: string) => void;
}

const PRESET_NAMES = [
  { name: 'CForge', desc: 'Developed by Maaz Patwekar · Modern C & Turbo C++ IDE' },
  { name: 'Online C & Turbo C++ Compiler', desc: 'Full-featured dual C and Turbo C++ IDE' },
  { name: 'Online C Compiler', desc: 'Minimal clean C programming environment' },
  { name: 'DYCET C & C++ Online Compiler', desc: 'Official DYCET engineering lab edition' },
  { name: 'DYPCET Turbo C++ Lab Assistant', desc: 'Autonomous DYPCET computer engineering edition' },
  { name: 'Turbo C++ 3.2 DOS Emulator', desc: 'Classic retro Borland 16-bit DOS IDE' },
  { name: 'Universal C & C++ Lab Compiler', desc: 'Standard compiler for all universities & colleges' }
];

export function RenameCompilerModal({
  isOpen,
  onClose,
  currentName,
  currentSubtitle,
  onSave
}: RenameCompilerModalProps) {
  const [name, setName] = useState(currentName);
  const [subtitle, setSubtitle] = useState(
    currentSubtitle || 'Developed by Maaz Patwekar'
  );

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), subtitle.trim());
      onClose();
    }
  };

  const handleSelectPreset = (presetName: string) => {
    setName(presetName);
  };

  const handleReset = () => {
    setName('CForge');
    setSubtitle('Developed by Maaz Patwekar');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-[#0e1117] border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Edit3 size={16} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Change Compiler Name & Heading
              </h2>
              <p className="text-xs text-neutral-400">
                Customize the compiler branding for your college or preference
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs sm:text-sm">
          {/* Main Compiler Name Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-300">
              Compiler Main Title:
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Online C & Turbo C++ Compiler"
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
              <Terminal size={15} className="absolute left-3 top-3 text-neutral-500" />
            </div>
          </div>

          {/* Subheading / College Dedication Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-300">
              Subheading / College Dedication:
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Designed for DYCET and All Students From other Colleges"
              className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* One-click Popular Presets */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-400" />
                Quick Preset Names:
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-neutral-400 hover:text-neutral-200 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={11} />
                Reset default
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_NAMES.map((p, idx) => {
                const isSelected = name === p.name;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(p.name)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950/60 border-blue-500 text-blue-200 shadow-sm'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="font-semibold text-xs truncate flex items-center justify-between">
                      <span>{p.name}</span>
                      {isSelected && <Check size={12} className="text-blue-400 shrink-0 ml-1" />}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                      {p.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-medium cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-900/30 transition-all"
            >
              <Check size={14} />
              Save Compiler Name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
