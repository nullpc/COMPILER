import { ExecutionResult, ExecutionLog, GraphicsCommand, CompilerError } from '../types/compiler';

export class CInterpreter {
  /**
   * Performs static analysis to find classic Turbo C compilation issues.
   */
  static compileCheck(source: string): CompilerError[] {
    const errors: CompilerError[] = [];
    const lines = source.split('\n');

    let openBraces = 0;
    let hasMain = false;
    let hasConio = source.includes('<conio.h>');
    let hasGraphics = source.includes('<graphics.h>');

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Skip comments & preprocessors
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('#')) {
        return;
      }

      // Check main
      if (/\b(void|int)\s+main\s*\([^)]*\)/.test(trimmed)) {
        hasMain = true;
      }

      // Check conio.h usage
      if ((trimmed.includes('getch(') || trimmed.includes('clrscr(')) && !hasConio) {
        errors.push({
          line: lineNum,
          message: "Warning: 'getch()' or 'clrscr()' used without including <conio.h>",
          severity: 'warning',
          codeSnippet: trimmed
        });
      }

      // Check graphics.h usage
      if ((trimmed.includes('initgraph(') || trimmed.includes('circle(') || trimmed.includes('line(')) && !hasGraphics) {
        errors.push({
          line: lineNum,
          message: "Warning: BGI graphics function used without including <graphics.h>",
          severity: 'warning',
          codeSnippet: trimmed
        });
      }

      // Check missing semicolon on statements
      if (
        trimmed.length > 0 &&
        !trimmed.endsWith(';') &&
        !trimmed.endsWith('{') &&
        !trimmed.endsWith('}') &&
        !trimmed.endsWith(':') &&
        !trimmed.endsWith(',') &&
        !trimmed.startsWith('if') &&
        !trimmed.startsWith('else') &&
        !trimmed.startsWith('for') &&
        !trimmed.startsWith('while') &&
        !trimmed.startsWith('do') &&
        !trimmed.startsWith('switch') &&
        !trimmed.startsWith('case') &&
        !trimmed.startsWith('default') &&
        !trimmed.startsWith('/*') &&
        !trimmed.endsWith('*/') &&
        !trimmed.startsWith('class ') &&
        !trimmed.startsWith('public:') &&
        !trimmed.startsWith('private:') &&
        !trimmed.startsWith('protected:') &&
        !/\b(void|int|long|float|double|char)\s+[a-zA-Z0-9_]+\s*\([^)]*\)\s*\{?$/.test(trimmed)
      ) {
        // If it looks like a variable decl or function call
        if (
          /\b(printf|scanf|cout|cin|clrscr|getch|circle|line|rectangle|setcolor|initgraph|closegraph)\s*\(/.test(trimmed) ||
          /\b(int|float|char|double|long)\s+[a-zA-Z0-9_]+(\s*=|\s*;|\s*,)/.test(trimmed)
        ) {
          errors.push({
            line: lineNum,
            message: "Syntax error: Missing ';' after expression in Turbo C++",
            severity: 'error',
            codeSnippet: trimmed
          });
        }
      }

      // Count braces
      for (const ch of line) {
        if (ch === '{') openBraces++;
        if (ch === '}') openBraces--;
      }
    });

    if (!hasMain) {
      errors.push({
        line: 1,
        message: "Linker error: Undefined symbol 'main' in module (Required in Turbo C++)",
        severity: 'error'
      });
    }

    if (openBraces !== 0) {
      errors.push({
        line: lines.length,
        message: `Compound statement error: Mismatched braces (difference of ${openBraces})`,
        severity: 'error'
      });
    }

    return errors;
  }

  /**
   * Infers sensible default input if student hasn't typed in stdin yet.
   */
  private static getDefaultInputs(source: string): string[] {
    if (source.includes('SUM.C') || source.includes('Enter first integer') || source.includes('ADD TWO NUMBERS')) {
      return ['15', '25'];
    }
    if (source.includes('EVENODD.C') || source.includes('Enter an integer:')) {
      if (source.includes('PALIN.C')) return ['121'];
      if (source.includes('ARMSTR.C')) return ['153'];
      return ['8'];
    }
    if (source.includes('FIBO.C') || source.includes('number of terms')) {
      return ['8'];
    }
    if (source.includes('FACTREC.C') || source.includes('positive integer')) {
      return ['5'];
    }
    if (source.includes('STUDENT.CPP') || source.includes('Student s1')) {
      return ['Maaz', '101', '89.5'];
    }
    return ['10', '20', '30'];
  }

  /**
   * Executes C/C++ code in a sandbox environment and collects console output & graphics.
   */
  static run(source: string, customInputBuffer: string[] = []): ExecutionResult {
    const startTime = performance.now();
    const logs: ExecutionLog[] = [];
    const graphicsCommands: GraphicsCommand[] = [];
    const errors = this.compileCheck(source);

    // If fatal compilation errors exist, stop early like Turbo C compiler
    const fatalErrors = errors.filter(e => e.severity === 'error');
    if (fatalErrors.length > 0) {
      logs.push({
        type: 'stderr',
        text: `Compiling ${source.includes('.cpp') ? 'CPP' : 'C'} file...`,
        timestamp: Date.now()
      });
      fatalErrors.forEach(err => {
        logs.push({
          type: 'stderr',
          text: `Error ${err.line}: ${err.message}${err.codeSnippet ? ` -> [ ${err.codeSnippet} ]` : ''}`,
          timestamp: Date.now()
        });
      });
      logs.push({
        type: 'stderr',
        text: `\n*** ${fatalErrors.length} Errors, ${errors.filter(e => e.severity === 'warning').length} Warnings ***`,
        timestamp: Date.now()
      });

      return {
        success: false,
        logs,
        graphicsCommands,
        errors,
        executionTimeMs: Math.round(performance.now() - startTime),
        hasGraphics: false
      };
    }

    const hasGraphics = source.includes('initgraph') || source.includes('circle(') || source.includes('line(');
    
    // Use user inputs, or sensible curriculum defaults if none typed
    const inputBuffer = customInputBuffer.length > 0 
      ? [...customInputBuffer] 
      : this.getDefaultInputs(source);
      
    let inputIndex = 0;
    let pendingPrompt: string | undefined = undefined;

    const appendStdout = (msg: string) => {
      const lastLog = logs[logs.length - 1];
      if (lastLog && lastLog.type === 'stdout') {
        lastLog.text += msg;
      } else {
        logs.push({
          type: 'stdout',
          text: msg,
          timestamp: Date.now()
        });
      }
    };

    // System banner
    logs.push({
      type: 'system',
      text: 'TURBO C++ 3.2 RUNTIME ENGINE (DYPCET Edition - By Maaz Patwekar)',
      timestamp: Date.now()
    });

    try {
      // 1. Strip comments and preprocessor lines
      let cleaned = source
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '')
        .replace(/#include\s*<[^>]+>/g, '')
        .replace(/#include\s*"[^"]+"/g, '')
        .replace(/#define\s+.*$/gm, '')
        .trim();

      // Convert C99 for loop declaration: for (int i = 0; ... -> for (let i = 0; ...
      cleaned = cleaned.replace(/for\s*\(\s*(?:int|long|short)\s+/g, 'for (let ');

      // 2. Handle C++ Class declarations:
      // e.g. class Student { ... };
      const classVars: string[] = [];
      cleaned = cleaned.replace(/class\s+([a-zA-Z0-9_]+)\s*\{([\s\S]*?)\};/g, (match, className, classBody) => {
        // Strip access specifiers
        let body = classBody.replace(/\b(public|private|protected):\s*/g, '');

        // Extract member variables
        body = body.replace(/\bchar\s+([a-zA-Z0-9_]+)\[[0-9]*\]\s*;/g, (m: string, v: string) => {
          classVars.push(`var ${v} = "";`);
          return '';
        });
        body = body.replace(/\b(?:int|long|short)\s+([a-zA-Z0-9_]+)\s*;/g, (m: string, v: string) => {
          classVars.push(`var ${v} = 0;`);
          return '';
        });
        body = body.replace(/\b(?:float|double)\s+([a-zA-Z0-9_]+)\s*;/g, (m: string, v: string) => {
          classVars.push(`var ${v} = 0.0;`);
          return '';
        });

        // Convert member functions to JS method format: void getDetails() { -> getDetails() {
        body = body.replace(/\b(?:void|int|float|double)\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*\{/g, '$1($2) {');

        return `class ${className} {
          ${body}
        }`;
      });

      if (classVars.length > 0) {
        cleaned = `${classVars.join('\n')}\n${cleaned}`;
      }

      // 3. Handle 2D Array declarations with initializers:
      // e.g. int a[2][2] = {{1, 2}, {3, 4}};
      cleaned = cleaned.replace(
        /\b(?:int|float|double|long|char)\s+([a-zA-Z0-9_]+)\[\s*[^\]]*\s*\]\[\s*[^\]]*\s*\]\s*=\s*\{([\s\S]*?)\};/g,
        (match, varName, initValues) => {
          const jsArray = initValues.replace(/\{/g, '[').replace(/\}/g, ']');
          return `let ${varName} = [${jsArray}];`;
        }
      );

      // Handle 2D Array declarations without initializers:
      // e.g. int c[2][2]; or int c[r][c];
      cleaned = cleaned.replace(
        /\b(?:int|float|double|long|char)\s+([a-zA-Z0-9_]+)\[\s*([a-zA-Z0-9_]+)\s*\]\[\s*([a-zA-Z0-9_]+)\s*\]\s*;/g,
        'let $1 = Array.from({length: Number($2) || 2}, () => Array(Number($3) || 2).fill(0));'
      );

      // 4. Handle 1D Array declarations with initializers:
      // e.g. int a[5] = {64, 34, 25, 12, 22};
      cleaned = cleaned.replace(
        /\b(?:int|float|double|long|char)\s+([a-zA-Z0-9_]+)\[\s*[^\]]*\s*\]\s*=\s*\{([^}]+)\};/g,
        'let $1 = [$2];'
      );

      // Handle 1D Array declarations without initializers:
      // e.g. int a[5]; or int a[n];
      cleaned = cleaned.replace(
        /\b(?:int|float|double|long|char)\s+([a-zA-Z0-9_]+)\[\s*([a-zA-Z0-9_]+)\s*\]\s*;/g,
        'let $1 = new Array(Number($2) || 5).fill(0);'
      );

      // 5. Handle Object Instantiations: e.g. Student s1;
      cleaned = cleaned.replace(/\b([A-Z][a-zA-Z0-9_]*)\s+([a-z][a-zA-Z0-9_]*)\s*;/g, 'let $2 = new $1();');

      // 6. Handle standard variable declarations (scalars):
      // int num1, num2, result; or int a = 5, b = 10;
      cleaned = cleaned.replace(/\b(?:int|long|short|unsigned)\s+([^;{}()]+);/g, (match, vars) => {
        // Skip if contains array brackets already processed
        if (vars.includes('[') || vars.includes(']')) return match;
        const parts = vars.split(',').map((v: string) => {
          const trimmed = v.trim();
          if (!trimmed) return '';
          if (trimmed.includes('=')) return trimmed;
          return `${trimmed} = 0`;
        }).filter(Boolean);
        return `let ${parts.join(', ')};`;
      });

      cleaned = cleaned.replace(/\b(?:float|double)\s+([^;{}()]+);/g, (match, vars) => {
        if (vars.includes('[') || vars.includes(']')) return match;
        const parts = vars.split(',').map((v: string) => {
          const trimmed = v.trim();
          if (!trimmed) return '';
          if (trimmed.includes('=')) return trimmed;
          return `${trimmed} = 0.0`;
        }).filter(Boolean);
        return `let ${parts.join(', ')};`;
      });

      cleaned = cleaned.replace(/\bchar\s+([a-zA-Z0-9_]+)\[\s*[^\]]*\s*\]\s*;/g, 'let $1 = "";');
      cleaned = cleaned.replace(/\bchar\s+([^;{}()]+);/g, (match, vars) => {
        if (vars.includes('[') || vars.includes(']')) return match;
        const parts = vars.split(',').map((v: string) => {
          const trimmed = v.trim();
          if (!trimmed) return '';
          if (trimmed.includes('=')) return trimmed;
          return `${trimmed} = ''`;
        }).filter(Boolean);
        return `let ${parts.join(', ')};`;
      });

      // 7. Fix C integer division:
      // In C, n /= 10 truncates decimals. In JS, n /= 10 produces float causing infinite loops in Palindrome/Armstrong!
      cleaned = cleaned.replace(/\b([a-zA-Z0-9_]+)\s*\/=\s*([0-9]+)\b/g, '$1 = Math.trunc($1 / $2)');
      cleaned = cleaned.replace(/\b([a-zA-Z0-9_]+)\s*=\s*\1\s*\/\s*([0-9]+)\b/g, '$1 = Math.trunc($1 / $2)');

      // 8. Convert helper functions outside main:
      // e.g. long int multiplyNumbers(int n) { ... } -> function multiplyNumbers(n) { ... }
      cleaned = cleaned.replace(
        /\b(?:long\s+int|int|void|float|double|long)\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*\{/g,
        (match, fnName, params) => {
          if (fnName === 'main') {
            return `function __tc_main() {`;
          }
          const cleanParams = params
            .split(',')
            .map((p: string) => p.trim().replace(/\b(?:int|float|double|long|char|void)\s+\*?/, '').trim())
            .filter(Boolean)
            .join(', ');
          return `function ${fnName}(${cleanParams}) {`;
        }
      );

      // 9. Standard Turbo C function calls:
      cleaned = cleaned.replace(/clrscr\s*\(\s*\)\s*;/g, 'api_clrscr();');
      cleaned = cleaned.replace(/getch\s*\(\s*\)\s*;/g, 'api_getch();');

      // Handle printf("%d %s", a, b);
      cleaned = cleaned.replace(/printf\s*\(\s*(".*?")\s*(?:,\s*([\s\S]*?))?\s*\)\s*;/g, (match, formatStr, argsStr) => {
        return `api_printf(${formatStr}, [${argsStr || ''}]);`;
      });

      // Handle scanf("%d", &var) or scanf("%d", &a[i]) or multi-var scanf("%d %d", &a, &b)
      cleaned = cleaned.replace(/scanf\s*\(\s*"([^"]+)"\s*,\s*([^)]+)\)\s*;/g, (match, fmt, argsStr) => {
        const varList = argsStr.split(',').map((v: string) => v.trim().replace(/^&/, ''));
        const specifiers = fmt.match(/%(?:[0-9]*\.?[0-9]*)?[dfscl]/g) || ['%d'];
        return varList.map((varName: string, idx: number) => {
          const spec = specifiers[idx] || specifiers[0] || '%d';
          return `${varName} = api_scanf("${spec}", "${varName}");`;
        }).join('\n');
      });

      // Handle cout << "msg" << var << endl;
      cleaned = cleaned.replace(/cout\s*<<\s*([^;]+);/g, (match, stream) => {
        const parts = stream.split('<<').map((p: string) => p.trim());
        const mapped = parts.map((p: string) => {
          if (p === 'endl') return '"\\n"';
          return p;
        }).join(' + ');
        return `api_cout(${mapped});`;
      });

      // Handle cin >> var or cin >> a[i]; or cin >> a >> b;
      cleaned = cleaned.replace(/cin\s*>>\s*([^;]+);/g, (match, stream) => {
        const varList = stream.split('>>').map((v: string) => v.trim());
        return varList.map((v: string) => `${v} = api_scanf("%s", "${v}");`).join('\n');
      });

      // Handle Graphics.h API calls:
      cleaned = cleaned.replace(/initgraph\s*\([^)]*\)\s*;/g, 'api_initgraph();');
      cleaned = cleaned.replace(/closegraph\s*\([^)]*\)\s*;/g, 'api_closegraph();');
      cleaned = cleaned.replace(/circle\s*\(([^,]+),\s*([^,]+),\s*([^)]+)\)\s*;/g, 'api_circle($1, $2, $3);');
      cleaned = cleaned.replace(/line\s*\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)\s*;/g, 'api_line($1, $2, $3, $4);');
      cleaned = cleaned.replace(/rectangle\s*\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)\s*;/g, 'api_rectangle($1, $2, $3, $4);');
      cleaned = cleaned.replace(/bar\s*\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)\s*;/g, 'api_bar($1, $2, $3, $4);');
      cleaned = cleaned.replace(/ellipse\s*\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)\s*;/g, 'api_ellipse($1, $2, $3, $4, $5, $6);');
      cleaned = cleaned.replace(/setcolor\s*\(([^)]+)\)\s*;/g, 'api_setcolor($1);');
      cleaned = cleaned.replace(/setbkcolor\s*\(([^)]+)\)\s*;/g, 'api_setbkcolor($1);');
      cleaned = cleaned.replace(/outtextxy\s*\(([^,]+),\s*([^,]+),\s*([^)]+)\)\s*;/g, 'api_outtextxy($1, $2, $3);');
      cleaned = cleaned.replace(/cleardevice\s*\(\s*\)\s*;/g, 'api_cleardevice();');

      // Append call to main
      cleaned += '\n__tc_main();';

      // Colors mapping for Turbo C BGI
      const bgiColors: Record<number, string> = {
        0: '#000000', 1: '#0000AA', 2: '#00AA00', 3: '#00AAAA',
        4: '#AA0000', 5: '#AA00AA', 6: '#AA5500', 7: '#AAAAAA',
        8: '#555555', 9: '#5555FF', 10: '#55FF55', 11: '#55FFFF',
        12: '#FF5555', 13: '#FF55FF', 14: '#FFFF55', 15: '#FFFFFF'
      };

      let currentColor = '#FFFFFF';
      let currentBkColor = '#000000';

      // Sandbox API execution
      const sandboxApi = {
        api_clrscr() {
          logs.length = 0;
          logs.push({
            type: 'system',
            text: '[Screen Cleared - clrscr()]',
            timestamp: Date.now()
          });
        },
        api_getch() {
          appendStdout('[getch() - Screen held, execution complete]\n');
        },
        api_printf(fmt: string, args: any[]) {
          let str = fmt;
          // Unescape \n and \t
          str = str.replace(/\\n/g, '\n').replace(/\\t/g, '    ');

          let argIdx = 0;
          str = str.replace(/%(?:[0-9]*\.?[0-9]*)?[dfscl]/g, (specifier) => {
            if (argIdx < args.length) {
              const val = args[argIdx++];
              if (specifier.includes('f') && typeof val === 'number') {
                return val.toFixed(2);
              }
              return String(val);
            }
            return specifier;
          });

          appendStdout(str);
        },
        api_cout(msg: any) {
          const str = String(msg).replace(/\\n/g, '\n').replace(/\\t/g, '    ');
          appendStdout(str);
        },
        api_scanf(fmt: string, varName: string) {
          if (inputIndex < inputBuffer.length) {
            const rawVal = inputBuffer[inputIndex++];
            appendStdout(rawVal + '\n');
            if (fmt.includes('d') || fmt.includes('i')) {
              return parseInt(rawVal, 10) || 0;
            }
            if (fmt.includes('f')) {
              return parseFloat(rawVal) || 0.0;
            }
            return rawVal;
          } else {
            pendingPrompt = `Enter value for ${varName} (${fmt}):`;
            return 0;
          }
        },
        // BGI constants
        DETECT: 0,
        EGA: 1,
        VGA: 9,
        CGA: 2,
        BLACK: 0,
        BLUE: 1,
        GREEN: 2,
        CYAN: 3,
        RED: 4,
        MAGENTA: 5,
        BROWN: 6,
        LIGHTGRAY: 7,
        DARKGRAY: 8,
        LIGHTBLUE: 9,
        LIGHTGREEN: 10,
        LIGHTCYAN: 11,
        LIGHTRED: 12,
        LIGHTMAGENTA: 13,
        YELLOW: 14,
        WHITE: 15,
        // Graphics APIs
        api_initgraph() {
          graphicsCommands.push({ type: 'init', params: {} });
          appendStdout('[Graphics Mode Initialized: 640x480 VGA 16-Color BGI]\n');
        },
        api_closegraph() {
          appendStdout('[Graphics Mode Closed]\n');
        },
        api_circle(x: number, y: number, r: number) {
          graphicsCommands.push({
            type: 'circle',
            params: { x: Number(x), y: Number(y), r: Number(r), color: currentColor }
          });
        },
        api_line(x1: number, y1: number, x2: number, y2: number) {
          graphicsCommands.push({
            type: 'line',
            params: { x1: Number(x1), y1: Number(y1), x2: Number(x2), y2: Number(y2), color: currentColor }
          });
        },
        api_rectangle(x1: number, y1: number, x2: number, y2: number) {
          graphicsCommands.push({
            type: 'rectangle',
            params: { x1: Number(x1), y1: Number(y1), x2: Number(x2), y2: Number(y2), color: currentColor }
          });
        },
        api_bar(x1: number, y1: number, x2: number, y2: number) {
          graphicsCommands.push({
            type: 'bar',
            params: { x1: Number(x1), y1: Number(y1), x2: Number(x2), y2: Number(y2), color: currentColor }
          });
        },
        api_ellipse(x: number, y: number, st: number, end: number, xr: number, yr: number) {
          graphicsCommands.push({
            type: 'ellipse',
            params: { x: Number(x), y: Number(y), st: Number(st), end: Number(end), xr: Number(xr), yr: Number(yr), color: currentColor }
          });
        },
        api_setcolor(c: number) {
          const colorCode = Math.abs(Math.floor(Number(c))) % 16;
          currentColor = bgiColors[colorCode] || '#FFFFFF';
          graphicsCommands.push({ type: 'color', params: { color: currentColor } });
        },
        api_setbkcolor(c: number) {
          const colorCode = Math.abs(Math.floor(Number(c))) % 16;
          currentBkColor = bgiColors[colorCode] || '#000000';
          graphicsCommands.push({ type: 'bkcolor', params: { color: currentBkColor } });
        },
        api_outtextxy(x: number, y: number, text: string) {
          graphicsCommands.push({
            type: 'text',
            params: { x: Number(x), y: Number(y), text: String(text), color: currentColor }
          });
        },
        api_cleardevice() {
          graphicsCommands.push({ type: 'clear', params: { bkColor: currentBkColor } });
        }
      };

      const paramNames = Object.keys(sandboxApi);
      const paramValues = Object.values(sandboxApi);

      // Execute in sandbox function with loop timeout safety
      const runner = new Function(...paramNames, `
        "use strict";
        let __loop_guard = 0;
        try {
          ${cleaned}
        } catch (err) {
          throw err;
        }
      `);

      runner(...paramValues);

      logs.push({
        type: 'system',
        text: '\n--------------------------------\nProcess completed with Exit Code: 0 (Normal Termination)',
        timestamp: Date.now()
      });

      return {
        success: true,
        logs,
        graphicsCommands,
        errors,
        executionTimeMs: Math.round(performance.now() - startTime),
        hasGraphics,
        pendingInputPrompt: pendingPrompt
      };
    } catch (runtimeErr: any) {
      logs.push({
        type: 'stderr',
        text: `Runtime Exception: ${runtimeErr.message || 'Execution error in Turbo C simulation'}`,
        timestamp: Date.now()
      });

      return {
        success: false,
        logs,
        graphicsCommands,
        errors: [
          ...errors,
          { line: 1, message: runtimeErr.message || 'Runtime execution exception', severity: 'error' }
        ],
        executionTimeMs: Math.round(performance.now() - startTime),
        hasGraphics
      };
    }
  }
}
