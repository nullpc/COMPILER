import { SavedProgram } from '../types/compiler';

const STORAGE_KEY = 'turboc_saved_programs_v3';
const DRAFT_KEY = 'turboc_current_draft_v3';
const FILENAME_KEY = 'turboc_current_filename_v3';

export const DEFAULT_PROGRAM: SavedProgram = {
  id: 'default-hello',
  filename: 'main.c',
  title: 'Hello World in C',
  language: 'c',
  createdAt: Date.now() - 86400000,
  updatedAt: Date.now() - 86400000,
  description: 'Standard Hello World program in C to compile and run online.',
  tags: ['Basics', 'C', 'Hello World'],
  code: `// Online C compiler to run C program online
#include <stdio.h>

int main() {
    // Write C code here
    printf("Hello, World!\\n");

    return 0;
}
`
};

export const INITIAL_SAVED_PROGRAMS: SavedProgram[] = [
  DEFAULT_PROGRAM,
  {
    id: 'sample-calc',
    filename: 'SUM.C',
    title: 'Addition of Two Numbers with scanf',
    language: 'c',
    createdAt: Date.now() - 72000000,
    updatedAt: Date.now() - 72000000,
    description: 'Demonstrates user input with scanf and formatted output with printf.',
    tags: ['Math', 'BCA Sem 1'],
    code: `#include <stdio.h>
#include <conio.h>

void main() {
    int a, b, sum;
    clrscr();
    
    printf("--- SUM CALCULATOR ---\\n");
    printf("Enter first number: ");
    scanf("%d", &a);
    
    printf("Enter second number: ");
    scanf("%d", &b);
    
    sum = a + b;
    printf("\\nResult: %d + %d = %d\\n", a, b, sum);
    
    printf("\\nCalculation complete. Press key to exit.");
    getch();
}
`
  },
  {
    id: 'sample-graphics',
    filename: 'CIRCLES.C',
    title: 'Concentric Circles with graphics.h',
    language: 'c',
    createdAt: Date.now() - 36000000,
    updatedAt: Date.now() - 36000000,
    description: 'Renders multiple concentric colored circles using graphics.h and initgraph.',
    tags: ['Graphics.h', 'BCA Sem 2'],
    code: `#include <graphics.h>
#include <conio.h>
#include <stdio.h>

void main() {
    int gd = DETECT, gm;
    int x, y, radius;
    
    initgraph(&gd, &gm, "C:\\\\TURBOC3\\\\BGI");
    
    outtextxy(140, 30, "TURBO C++ GRAPHICS.H DEMONSTRATION");
    
    x = 320;
    y = 220;
    
    /* Draw concentric circles */
    for (radius = 25; radius <= 160; radius += 25) {
        setcolor(radius / 20);
        circle(x, y, radius);
    }
    
    rectangle(80, 70, 560, 370);
    
    outtextxy(180, 400, "Press any key to close graphics window...");
    getch();
    closegraph();
}
`
  }
];

export const storageService = {
  getSavedPrograms(): SavedProgram[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAVED_PROGRAMS));
        return INITIAL_SAVED_PROGRAMS;
      }
      return JSON.parse(data);
    } catch (err) {
      console.warn('Failed to load saved programs from localStorage', err);
      return INITIAL_SAVED_PROGRAMS;
    }
  },

  saveProgram(program: Omit<SavedProgram, 'id' | 'createdAt' | 'updatedAt' | 'language'> & { id?: string; language?: 'c' | 'cpp' }): SavedProgram {
    const programs = this.getSavedPrograms();
    const now = Date.now();
    const resolvedLang = program.language || (program.filename.toLowerCase().endsWith('.cpp') ? 'cpp' : 'c');
    
    if (program.id) {
      // Update existing
      const existingIdx = programs.findIndex(p => p.id === program.id);
      if (existingIdx !== -1) {
        const updated: SavedProgram = {
          ...programs[existingIdx],
          ...program,
          language: resolvedLang,
          updatedAt: now
        };
        programs[existingIdx] = updated;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
        return updated;
      }
    }

    // Create new
    const newId = 'prog-' + Math.random().toString(36).substr(2, 9);
    const newProgram: SavedProgram = {
      id: newId,
      filename: program.filename.trim() || 'NONAME00.C',
      title: program.title.trim() || program.filename.trim() || 'Untitled Program',
      code: program.code,
      language: program.filename.toLowerCase().endsWith('.cpp') ? 'cpp' : 'c',
      createdAt: now,
      updatedAt: now,
      description: program.description || 'Saved in Turbo C++ Online',
      tags: program.tags || ['Saved']
    };

    programs.unshift(newProgram);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
    return newProgram;
  },

  deleteProgram(id: string): boolean {
    try {
      const programs = this.getSavedPrograms();
      const filtered = programs.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (err) {
      console.error('Failed to delete program', err);
      return false;
    }
  },

  duplicateProgram(id: string): SavedProgram | null {
    const programs = this.getSavedPrograms();
    const source = programs.find(p => p.id === id);
    if (!source) return null;

    const baseName = source.filename.replace(/\.(c|cpp)$/i, '');
    const ext = source.language === 'cpp' ? '.CPP' : '.C';
    const newFilename = `${baseName}_COPY${ext}`;

    return this.saveProgram({
      filename: newFilename,
      title: `${source.title} (Copy)`,
      code: source.code,
      language: source.language,
      description: source.description,
      tags: [...(source.tags || []), 'Copy']
    });
  },

  saveDraft(code: string, filename: string): void {
    try {
      localStorage.setItem(DRAFT_KEY, code);
      localStorage.setItem(FILENAME_KEY, filename);
    } catch (e) {
      // Ignore quota error for draft
    }
  },

  loadDraft(): { code: string; filename: string } | null {
    try {
      const code = localStorage.getItem(DRAFT_KEY);
      const filename = localStorage.getItem(FILENAME_KEY) || 'main.c';
      if (code) {
        return { code, filename };
      }
      return null;
    } catch {
      return null;
    }
  },

  downloadFile(filename: string, code: string): void {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'PROGRAM.C';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  exportAllBackup(): void {
    const programs = this.getSavedPrograms();
    const payload = {
      exportDate: new Date().toISOString(),
      generator: 'Online Turbo C++ Compiler By Maaz Patwekar - DYPCET',
      programs
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TurboC_SavedCodes_Backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  importBackup(jsonText: string): { success: boolean; count: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonText);
      const incoming: SavedProgram[] = Array.isArray(parsed) 
        ? parsed 
        : Array.isArray(parsed.programs) 
        ? parsed.programs 
        : [];

      if (!incoming.length) {
        return { success: false, count: 0, error: 'No valid programs found in JSON' };
      }

      const existing = this.getSavedPrograms();
      const existingIds = new Set(existing.map(p => p.id));
      let added = 0;

      for (const item of incoming) {
        if (item.filename && item.code) {
          const validItem: SavedProgram = {
            id: existingIds.has(item.id) ? 'prog-' + Math.random().toString(36).substr(2, 9) : item.id,
            filename: item.filename,
            title: item.title || item.filename,
            code: item.code,
            language: item.filename.toLowerCase().endsWith('.cpp') ? 'cpp' : 'c',
            createdAt: item.createdAt || Date.now(),
            updatedAt: item.updatedAt || Date.now(),
            description: item.description,
            tags: item.tags || ['Imported']
          };
          existing.unshift(validItem);
          added++;
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      return { success: true, count: added };
    } catch (err: any) {
      return { success: false, count: 0, error: err?.message || 'Invalid JSON format' };
    }
  }
};
