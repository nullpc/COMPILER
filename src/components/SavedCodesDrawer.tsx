import React, { useState } from 'react';
import { SavedProgram } from '../types/compiler';
import { 
  X, 
  FolderOpen, 
  Save, 
  Trash2, 
  Copy, 
  Download, 
  FileCode, 
  Search, 
  Check, 
  Calendar,
  Layers,
  Upload,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface SavedCodesDrawerProps {
  isOpen: boolean;
  currentCode: string;
  currentFilename: string;
  savedPrograms: SavedProgram[];
  onClose: () => void;
  onSaveCurrentAs: (filename: string, title: string, description: string, tags: string[]) => void;
  onLoadProgram: (program: SavedProgram) => void;
  onDeleteProgram: (id: string) => void;
  onDuplicateProgram: (id: string) => void;
  onDownloadProgram: (program: SavedProgram) => void;
  onExportAllBackup: () => void;
  onImportBackup: (jsonStr: string) => void;
}

export function SavedCodesDrawer({
  isOpen,
  currentCode,
  currentFilename,
  savedPrograms,
  onClose,
  onSaveCurrentAs,
  onLoadProgram,
  onDeleteProgram,
  onDuplicateProgram,
  onDownloadProgram,
  onExportAllBackup,
  onImportBackup
}: SavedCodesDrawerProps) {
  const [saveTab, setSaveTab] = useState<'list' | 'save-new'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLang, setFilterLang] = useState<'all' | 'c' | 'cpp'>('all');

  // Form states for saving new program
  const [newFilename, setNewFilename] = useState(currentFilename || 'MYPROG.C');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('College Lab');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilename.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onSaveCurrentAs(
      newFilename.trim(),
      newTitle.trim() || newFilename.trim(),
      newDesc.trim(),
      tagsArray
    );

    setSaveSuccessMsg(`Saved "${newFilename}" successfully!`);
    setTimeout(() => {
      setSaveSuccessMsg('');
      setSaveTab('list');
    }, 1200);
  };

  const handleBackupFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportBackup(content);
      }
    };
    reader.readAsText(file);
  };

  // Filter saved programs
  const filtered = savedPrograms.filter(prog => {
    const matchesSearch = 
      prog.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prog.tags && prog.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesLang = filterLang === 'all' || prog.language === filterLang;
    return matchesSearch && matchesLang;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-[#0c0e14] border-l border-neutral-800 text-neutral-100 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-2.5">
            <FolderOpen className="text-amber-400" size={18} />
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Saved Programs Library</h2>
              <p className="text-xs text-neutral-400">Manage and export your C/C++ coursework files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close saved drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switch: Saved List vs Save Active Code */}
        <div className="flex border-b border-neutral-800 bg-neutral-950 px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setSaveTab('list')}
            className={`pb-2.5 font-medium transition-colors border-b-2 cursor-pointer ${
              saveTab === 'list'
                ? 'border-amber-400 text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            My Saved Files ({savedPrograms.length})
          </button>
          <button
            onClick={() => {
              setNewFilename(currentFilename || 'NONAME00.C');
              setSaveTab('save-new');
            }}
            className={`pb-2.5 font-medium transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              saveTab === 'save-new'
                ? 'border-amber-400 text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Save size={13} className="text-amber-400" />
            <span>Save Current Buffer As...</span>
          </button>
        </div>

        {/* Tab 1: Saved Files List */}
        {saveTab === 'list' && (
          <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-3">
            {/* Search and Filters */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search programs by name, code or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-sans"
                />
              </div>

              <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 text-xs">
                {(['all', 'c', 'cpp'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setFilterLang(l)}
                    className={`px-2 py-1 rounded text-[11px] font-mono uppercase ${
                      filterLang === l ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* List container */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                            {item.filename}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 uppercase">
                            {item.language}
                          </span>
                        </div>
                        <h4 className="text-xs text-neutral-300 font-medium">{item.title}</h4>
                      </div>

                      {/* Primary Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            onLoadProgram(item);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded transition-colors cursor-pointer"
                          title="Open this file in editor"
                        >
                          Open
                        </button>
                      </div>
                    </div>

                    {/* Metadata & Date */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-neutral-400">
                      <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span className="font-mono">{item.code.split('\n').length} lines</span>
                      {item.tags && item.tags.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-neutral-300">{item.tags.join(', ')}</span>
                        </>
                      )}
                    </div>

                    {/* Utility actions: Download, Duplicate, Delete */}
                    <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onDownloadProgram(item)}
                          className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                          title="Download as .C or .CPP file"
                        >
                          <Download size={12} />
                          <span>Export File</span>
                        </button>
                        <span>·</span>
                        <button
                          onClick={() => onDuplicateProgram(item.id)}
                          className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                          title="Make a copy"
                        >
                          <Copy size={12} />
                          <span>Duplicate</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Delete "${item.filename}" from saved library?`)) {
                            onDeleteProgram(item.id);
                          }
                        }}
                        className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                        title="Delete program"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-neutral-500 space-y-2">
                  <FileCode size={32} className="mx-auto text-neutral-600 mb-2" />
                  <p className="text-xs">No saved programs matched "{searchQuery}".</p>
                </div>
              )}
            </div>

            {/* Bottom Backup Utilities */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <button
                onClick={onExportAllBackup}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                title="Backup all saved programs into one JSON file"
              >
                <Download size={13} className="text-amber-400" />
                <span>Backup All (JSON)</span>
              </button>

              <label className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <Upload size={13} className="text-emerald-400" />
                <span>Restore Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleBackupFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* Tab 2: Save Current Buffer As... */}
        {saveTab === 'save-new' && (
          <form onSubmit={handleSaveSubmit} className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Save Active Code into Storage</h3>
              <p className="text-neutral-400 text-xs">
                Saves directly into your local browser database so your assignments persist across refreshes.
              </p>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-lg text-emerald-300 flex items-center gap-2">
                <Check size={16} className="text-emerald-400" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-neutral-300 font-semibold">File Name (8.3 DOS standard)</label>
              <input
                type="text"
                required
                placeholder="e.g. FACTORIAL.C or STUDENT.CPP"
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
              <span className="text-[11px] text-neutral-500">Must end in .C or .CPP</span>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300 font-semibold">Program Title / Description</label>
              <input
                type="text"
                placeholder="e.g. Recursive Factorial Calculation"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300 font-semibold">Subject / Tag</label>
              <input
                type="text"
                placeholder="e.g. BCA Sem 1, Data Structures, Graphics Lab"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300 font-semibold">Notes / Assignment Objective (Optional)</label>
              <textarea
                rows={3}
                placeholder="Notes for practical exams or viva..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <Save size={14} />
                <span>Save Program to Library</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
