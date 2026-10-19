import React from 'react';
import { X, Keyboard, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';

interface ShortcutsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsGuideModal({ isOpen, onClose }: ShortcutsGuideModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + F9', action: 'Compile, Link & Run current program' },
    { key: 'Alt + F9', action: 'Compile only (Check for syntax & linker errors)' },
    { key: 'Alt + F5', action: 'Toggle User Screen (View program console output)' },
    { key: 'F2', action: 'Save current code into browser database' },
    { key: 'F3', action: 'Open Saved Programs library' },
    { key: 'Shift + Insert', action: 'Paste code from external clipboard' },
    { key: 'Ctrl + Insert', action: 'Copy selected text in DOS mode' },
    { key: 'Tab', action: 'Insert 4 spaces indentation' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-[#0c0e14] border border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Keyboard size={18} className="text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">Keyboard Shortcuts & Turbo C Reference</h3>
              <p className="text-xs text-neutral-400">Created by Maaz Patwekar for DYPCET and all students</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-neutral-300">
          {/* Shortcuts Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-neutral-400">
              Essential Keyboard Shortcuts
            </h4>
            <div className="border border-neutral-800 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-800 text-[11px]">
                  <tr>
                    <th className="py-2 px-3">Shortcut Key</th>
                    <th className="py-2 px-3">Operation in Turbo C++</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80 font-mono">
                  {shortcuts.map((sc) => (
                    <tr key={sc.key} className="hover:bg-neutral-900/40">
                      <td className="py-2 px-3 text-amber-400 font-bold whitespace-nowrap">{sc.key}</td>
                      <td className="py-2 px-3 font-sans text-neutral-300">{sc.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* conio.h and graphics.h Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg space-y-1.5">
              <h5 className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>&lt;conio.h&gt; Functions</span>
              </h5>
              <ul className="text-[11px] space-y-1 text-neutral-400">
                <li><code className="text-blue-300">clrscr();</code> - Clears the DOS output screen before new text prints.</li>
                <li><code className="text-blue-300">getch();</code> - Holds the user screen until any key is pressed.</li>
              </ul>
            </div>

            <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg space-y-1.5">
              <h5 className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>&lt;graphics.h&gt; Functions</span>
              </h5>
              <ul className="text-[11px] space-y-1 text-neutral-400">
                <li><code className="text-purple-300">initgraph(&gd, &gm, path);</code> - Switches to 640x480 VGA mode.</li>
                <li><code className="text-purple-300">circle(x, y, r);</code> - Draws circles on the graphics canvas.</li>
              </ul>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="p-3 bg-blue-950/20 border border-blue-800/40 rounded-lg space-y-1 text-[11px] text-blue-200">
            <div className="flex items-center gap-1.5 font-bold text-blue-300">
              <AlertCircle size={14} />
              <span>Troubleshooting Tip</span>
            </div>
            <p>
              If your program gets stuck in a loop or the console output screen doesn't show your expected output, click the <strong>CLRSCR</strong> or <strong>Re-run</strong> button on the toolbar. All your code is automatically auto-saved in your browser!
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Got it, Back to Code
          </button>
        </div>
      </div>
    </div>
  );
}
