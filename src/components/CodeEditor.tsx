import React, { useRef, useState, useMemo } from 'react';
import { CompilerTheme } from '../types/compiler';
import { FileCode, Copy, Check, Type, Palette } from 'lucide-react';

export type EditorFontSize = 'small' | 'medium' | 'large';

const FONT_SIZE_STORAGE_KEY = 'turboc_editor_font_size';

const FONT_SIZE_MAP: Record<EditorFontSize, { textClass: string; lineClass: string; label: string }> = {
  small: { textClass: 'text-xs', lineClass: 'leading-5', label: 'Small' },
  medium: { textClass: 'text-sm', lineClass: 'leading-6', label: 'Medium' },
  large: { textClass: 'text-base', lineClass: 'leading-7', label: 'Large' },
};

interface CodeEditorProps {
  code: string;
  filename: string;
  theme: CompilerTheme;
  onChange: (newCode: string) => void;
  onRun: () => void;
  onSave: () => void;
  onCompile: () => void;
  onFileDrop: (file: File) => void;
  onThemeChange?: (newTheme: CompilerTheme) => void;
}

interface Token {
  type: 'comment' | 'string' | 'preprocessor' | 'keyword' | 'number' | 'text';
  text: string;
}

// Fast tokenizer for C / C++ with special emphasis on faint white / gray comments
function tokenizeCCode(source: string): Token[] {
  if (!source) return [];

  // Match:
  // 1. Comments: /* multi-line */ or // single-line
  // 2. Strings & Character literals: "..." or '...'
  // 3. Preprocessor directives: #include, #define, etc.
  // 4. Keywords and standard Turbo C / C library functions
  // 5. Numeric literals
  const regex = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(^[ \t]*#[^\n]*)|(\b(?:int|char|float|double|void|long|short|signed|unsigned|struct|union|enum|typedef|auto|register|static|extern|const|volatile|return|if|else|switch|case|default|while|do|for|break|continue|goto|sizeof|inline|restrict|bool|true|false|NULL|printf|scanf|clrscr|getch|puts|gets|cin|cout|endl)\b)|(\b\d+(?:\.\d+)?\b|0x[0-9a-fA-F]+\b)/gm;

  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(source)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        text: source.slice(lastIndex, match.index)
      });
    }

    if (match[1]) {
      tokens.push({ type: 'comment', text: match[1] });
    } else if (match[2]) {
      tokens.push({ type: 'string', text: match[2] });
    } else if (match[3]) {
      tokens.push({ type: 'preprocessor', text: match[3] });
    } else if (match[4]) {
      tokens.push({ type: 'keyword', text: match[4] });
    } else if (match[5]) {
      tokens.push({ type: 'number', text: match[5] });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < source.length) {
    tokens.push({
      type: 'text',
      text: source.slice(lastIndex)
    });
  }

  return tokens;
}

export function CodeEditor({
  code,
  filename,
  theme,
  onChange,
  onRun,
  onSave,
  onCompile,
  onFileDrop,
  onThemeChange
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);

  // Font size setting (small, medium, large) persisted to localStorage
  const [fontSize, setFontSize] = useState<EditorFontSize>(() => {
    try {
      const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
      if (saved === 'small' || saved === 'medium' || saved === 'large') {
        return saved;
      }
    } catch {}
    return 'medium';
  });

  const handleSetFontSize = (size: EditorFontSize) => {
    setFontSize(size);
    try {
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, size);
    } catch {}
  };

  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Sync scroll between textarea, line numbers, and highlight backdrop
  const handleScroll = () => {
    if (textareaRef.current) {
      const { scrollTop, scrollLeft } = textareaRef.current;
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = scrollTop;
      }
      if (highlightRef.current) {
        highlightRef.current.scrollTop = scrollTop;
        highlightRef.current.scrollLeft = scrollLeft;
      }
    }
  };

  // Cursor position tracking
  const updateCursorPos = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const textBefore = code.substring(0, pos);
    const lines = textBefore.split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1
    });
  };

  // Handle Tab key and shortcuts inside editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'F2') {
      e.preventDefault();
      onSave();
      return;
    }

    if (e.ctrlKey && e.key === 'F9') {
      e.preventDefault();
      onRun();
      return;
    }

    if (e.altKey && e.key === 'F9') {
      e.preventDefault();
      onCompile();
      return;
    }

    // Tab key indent handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const tabStr = '    '; // 4 spaces

      const updated = code.substring(0, start) + tabStr + code.substring(end);
      onChange(updated);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + tabStr.length;
          updateCursorPos();
        }
      }, 0);
    }
  };

  // Copy code helper
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Drag and drop file handling
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileDrop(e.dataTransfer.files[0]);
    }
  };

  const lines = code.split('\n');

  // Tokenize code for syntax highlighting
  const tokens = useMemo(() => tokenizeCCode(code), [code]);

  // Theme-specific styles
  const themeStyles = {
    'retro-dos': {
      container: 'bg-[#0000a8] text-[#ffff55] border-[#00aaaa]',
      header: 'bg-[#00aaaa] text-[#000000] font-bold',
      lineNums: 'bg-[#000088] text-[#00aaaa] border-[#00aaaa]',
      footer: 'bg-[#00aaaa] text-[#000000]',
      caret: '#ffffff',
      commentColor: '#cbd5e1', // Faint slate white / gray
      preprocessorColor: '#38bdf8', // Bright cyan/sky blue
      keywordColor: '#ffff55', // Classic Turbo C yellow
      stringColor: '#4ade80', // Crisp emerald green
      numberColor: '#fcd34d', // Warm amber
      textColor: '#ffffff' // Crisp white
    },
    'modern-dark': {
      container: 'bg-[#0d1117] text-neutral-100 border-neutral-800',
      header: 'bg-[#161b22] text-neutral-300 font-semibold',
      lineNums: 'bg-[#090d13] text-neutral-600 border-neutral-800',
      footer: 'bg-[#161b22] text-neutral-400',
      caret: '#38bdf8',
      commentColor: '#94a3b8', // Faint muted slate gray
      preprocessorColor: '#f472b6', // Coral pink
      keywordColor: '#60a5fa', // Vibrant blue
      stringColor: '#86efac', // Light mint green
      numberColor: '#fb923c', // Soft orange
      textColor: '#f1f5f9' // Light slate white
    },
    'amber-crt': {
      container: 'bg-[#120a02] text-[#ffb000] border-[#ffb000]/40',
      header: 'bg-[#291702] text-[#ffb000] font-bold',
      lineNums: 'bg-[#1a0f03] text-[#ffb000]/50 border-[#ffb000]/30',
      footer: 'bg-[#291702] text-[#ffb000]',
      caret: '#ffb000',
      commentColor: 'rgba(255, 230, 190, 0.65)', // Faint warm grayish-white
      preprocessorColor: '#ffc83b',
      keywordColor: '#ffd055',
      stringColor: '#ffe066',
      numberColor: '#ffb000',
      textColor: '#ffb000'
    }
  }[theme];

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col h-full rounded-xl border overflow-hidden shadow-xl ${themeStyles.container}`}
    >
      {/* Editor Top Bar */}
      <div className={`px-4 py-2 flex items-center justify-between text-xs select-none border-b border-inherit ${themeStyles.header}`}>
        <div className="flex items-center gap-2">
          <FileCode size={14} />
          <span className="font-mono tracking-wider uppercase font-bold">{filename}</span>
          <span className="text-[10px] opacity-75 font-mono">[{lines.length} lines]</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Theme Color Switcher */}
          {onThemeChange && (
            <div className="flex items-center gap-1 bg-black/25 px-1.5 py-0.5 rounded-lg border border-inherit/40 text-[11px]">
              <Palette size={12} className="opacity-80 ml-0.5" />
              <button
                type="button"
                onClick={() => onThemeChange('retro-dos')}
                title="DOS Blue Theme (Turbo C)"
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  theme === 'retro-dos' ? 'bg-blue-600 text-white font-black' : 'opacity-70 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                DOS
              </button>
              <button
                type="button"
                onClick={() => onThemeChange('modern-dark')}
                title="Modern Dark Theme"
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  theme === 'modern-dark' ? 'bg-neutral-800 text-white font-black' : 'opacity-70 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => onThemeChange('amber-crt')}
                title="Amber CRT Theme"
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  theme === 'amber-crt' ? 'bg-amber-600 text-neutral-950 font-black' : 'opacity-70 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                Amber
              </button>
            </div>
          )}

          {/* Font Size Selector (Small, Medium, Large) */}
          <div className="flex items-center gap-1 bg-black/25 px-1.5 py-0.5 rounded-lg border border-inherit/40 text-[11px]">
            <Type size={12} className="opacity-80 ml-0.5" />
            <span className="hidden sm:inline text-[10px] opacity-75 font-mono mr-0.5">Size:</span>
            {(['small', 'medium', 'large'] as EditorFontSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSetFontSize(size)}
                title={`Font Size: ${FONT_SIZE_MAP[size].label}`}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  fontSize === size
                    ? 'bg-amber-400 text-black shadow-xs font-black'
                    : 'opacity-70 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                {size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyCode}
            className="p-1 rounded hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1 text-[11px]"
            title="Copy all code"
          >
            {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Line Numbers (Child 1) */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className={`w-12 py-3 px-2 text-right select-none overflow-hidden font-mono border-r shrink-0 ${FONT_SIZE_MAP[fontSize].textClass} ${FONT_SIZE_MAP[fontSize].lineClass} ${themeStyles.lineNums}`}
        >
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea (Child 2 - Target of CSS selector) */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          onClick={updateCursorPos}
          onKeyUp={updateCursorPos}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className={`flex-1 p-3 resize-none border-none outline-none font-mono overflow-auto whitespace-pre z-10 bg-transparent text-transparent caret-white selection:bg-blue-500/40 selection:text-transparent ${FONT_SIZE_MAP[fontSize].textClass} ${FONT_SIZE_MAP[fontSize].lineClass}`}
          placeholder="/* Enter your C or C++ source code here */"
          style={{
            caretColor: themeStyles.caret,
            tabSize: 4,
            MozTabSize: 4,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
          }}
        />

        {/* Syntax Highlighted Backdrop (Child 3 - Displays faint white/gray comments and color-coded C syntax) */}
        <pre
          ref={highlightRef}
          aria-hidden="true"
          className={`absolute top-0 right-0 bottom-0 pointer-events-none select-none font-mono whitespace-pre overflow-hidden z-0 p-3 m-0 border-none ${FONT_SIZE_MAP[fontSize].textClass} ${FONT_SIZE_MAP[fontSize].lineClass}`}
          style={{
            left: '48px', // matches w-12 (48px) line numbers column
            tabSize: 4,
            MozTabSize: 4,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
          }}
        >
          {tokens.map((token, idx) => {
            switch (token.type) {
              case 'comment':
                // Faint white / gray comment styling so user can easily differentiate comments from code
                return (
                  <span
                    key={idx}
                    className="italic font-mono"
                    style={{
                      color: themeStyles.commentColor,
                      opacity: 0.82
                    }}
                  >
                    {token.text}
                  </span>
                );
              case 'preprocessor':
                return (
                  <span
                    key={idx}
                    className="font-bold font-mono"
                    style={{ color: themeStyles.preprocessorColor }}
                  >
                    {token.text}
                  </span>
                );
              case 'keyword':
                return (
                  <span
                    key={idx}
                    className="font-bold font-mono"
                    style={{ color: themeStyles.keywordColor }}
                  >
                    {token.text}
                  </span>
                );
              case 'string':
                return (
                  <span
                    key={idx}
                    className="font-mono"
                    style={{ color: themeStyles.stringColor }}
                  >
                    {token.text}
                  </span>
                );
              case 'number':
                return (
                  <span
                    key={idx}
                    className="font-mono"
                    style={{ color: themeStyles.numberColor }}
                  >
                    {token.text}
                  </span>
                );
              default:
                return (
                  <span
                    key={idx}
                    className="font-mono"
                    style={{ color: themeStyles.textColor }}
                  >
                    {token.text}
                  </span>
                );
            }
          })}
          {code.endsWith('\n') ? ' ' : ''}
        </pre>

        {/* Drag and Drop Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-30 bg-blue-950/90 border-2 border-dashed border-blue-400 flex flex-col items-center justify-center text-white backdrop-blur-xs">
            <FileCode size={36} className="text-blue-300 animate-bounce mb-2" />
            <p className="font-bold text-sm">Drop your .C or .CPP file here to import</p>
            <p className="text-xs text-blue-300 mt-1">File will load immediately into CForge</p>
          </div>
        )}
      </div>

      {/* Editor Status Bar */}
      <div className={`px-4 py-1.5 flex items-center justify-between text-[11px] font-mono select-none border-t border-inherit ${themeStyles.footer}`}>
        <div className="flex items-center gap-3">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span>·</span>
          <span>Tab: 4 Spaces</span>
          <span>·</span>
          <span>Font: {FONT_SIZE_MAP[fontSize].label}</span>
          <span>·</span>
          <span className="opacity-80">Comments: Faint Gray</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span>Ctrl+F9: Run</span>
          <span>·</span>
          <span>F2: Save</span>
          <span>·</span>
          <span>Alt+F9: Compile</span>
        </div>
      </div>
    </div>
  );
}
