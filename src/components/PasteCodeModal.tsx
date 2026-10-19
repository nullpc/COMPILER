import React, { useState } from 'react';
import { X, ClipboardPaste, ArrowRight } from 'lucide-react';

interface PasteCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertCode: (code: string, filename: string) => void;
}

export function PasteCodeModal({ isOpen, onClose, onInsertCode }: PasteCodeModalProps) {
  const [pastedCode, setPastedCode] = useState('');
  const [targetFilename, setTargetFilename] = useState('PASTED.C');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedCode.trim()) return;

    onInsertCode(pastedCode, targetFilename || 'PASTED.C');
    setPastedCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-[#0c0e14] border border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <ClipboardPaste size={18} className="text-purple-400" />
            <h3 className="text-base font-bold text-white">Paste External Code into Turbo C++</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">
          Standard DOS environments do not always support Ctrl+V. Paste your C or C++ program below, specify a target filename, and it will be inserted directly into the editor buffer.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-neutral-300 font-semibold">Target Filename</label>
            <input
              type="text"
              required
              placeholder="e.g. ASSIGNMENT.C or TEST.CPP"
              value={targetFilename}
              onChange={(e) => setTargetFilename(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-300 font-semibold">Source Code</label>
            <textarea
              rows={10}
              required
              placeholder="#include <stdio.h>&#10;#include <conio.h>&#10;&#10;void main() {&#10;    clrscr();&#10;    printf(&quot;Hello!&quot;);&#10;    getch();&#10;}"
              value={pastedCode}
              onChange={(e) => setPastedCode(e.target.value)}
              className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded-lg font-mono text-xs text-neutral-200 focus:outline-none focus:border-purple-400 leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Insert into Turbo C++</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
