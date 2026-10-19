export interface SavedProgram {
  id: string;
  filename: string;
  title: string;
  code: string;
  language: 'c' | 'cpp';
  createdAt: number;
  updatedAt: number;
  description?: string;
  tags?: string[];
}

export type CompilerTheme = 'retro-dos' | 'modern-dark' | 'amber-crt';

export interface ExecutionLog {
  type: 'stdout' | 'stderr' | 'system' | 'input';
  text: string;
  timestamp: number;
  color?: string;
}

export interface GraphicsCommand {
  type: 'init' | 'circle' | 'line' | 'rectangle' | 'ellipse' | 'bar' | 'text' | 'clear' | 'color' | 'bkcolor';
  params: any;
}

export interface ExecutionResult {
  success: boolean;
  logs: ExecutionLog[];
  graphicsCommands: GraphicsCommand[];
  errors: CompilerError[];
  executionTimeMs: number;
  hasGraphics: boolean;
  pendingInputPrompt?: string;
}

export interface CompilerError {
  line: number;
  message: string;
  severity: 'error' | 'warning';
  codeSnippet?: string;
}

export interface SampleProgram {
  id: string;
  title: string;
  filename: string;
  category: 'Basics' | 'Control Flow' | 'Arrays & Strings' | 'Functions & Pointers' | 'Graphics.h' | 'C++ OOP';
  description: string;
  code: string;
}
