import React, { useState } from 'react';
import { SAMPLE_PROGRAMS } from '../data/samplePrograms';
import { SampleProgram } from '../types/compiler';
import { X, BookOpen, Code2, ArrowRight } from 'lucide-react';

interface ExamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProgram: (program: SampleProgram) => void;
}

export function ExamplesModal({ isOpen, onClose, onSelectProgram }: ExamplesModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Basics', 'Control Flow', 'Arrays & Strings', 'Functions & Pointers', 'Graphics.h', 'C++ OOP'];

  const filtered = selectedCategory === 'All'
    ? SAMPLE_PROGRAMS
    : SAMPLE_PROGRAMS.filter(p => p.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-[#0c0e14] border border-neutral-800 rounded-xl p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-white">College Syllabus C/C++ Programs</h3>
              <p className="text-xs text-neutral-400">Curated standard practicals for DYPCET &amp; all students</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-neutral-800/80">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 pr-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-400">{item.filename}</span>
                  <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded font-mono">
                    {item.category}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    onSelectProgram(item);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-blue-600 hover:text-white text-neutral-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Load Program</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
