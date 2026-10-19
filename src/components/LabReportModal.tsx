import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Building2, 
  User, 
  GraduationCap, 
  Download, 
  Loader2, 
  FileCode,
  Terminal,
  FileCheck
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

interface LabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  filename: string;
  outputLogs: string[];
}

export type CollegeTemplate = 'dypcet' | 'other' | 'none';

// Exactly the branches available at DYPCET as specified by the user
export const DYPCET_UG_BRANCHES = [
  'Computer Science & Engineering (CSE)',
  'Artificial Intelligence & Machine Learning (AI & ML)',
  'Data Science',
  'Electronics & Telecommunication Engineering (E&TC)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Architecture (B.Arch)'
] as const;

export const DYPCET_PG_BRANCHES = [
  'Computer Science and Engineering (CSE)',
  'Electronics and Telecommunication Engineering (E&TC)'
] as const;

export const DYPCET_BRANCHES = [
  ...DYPCET_UG_BRANCHES,
  ...DYPCET_PG_BRANCHES
] as const;

export function LabReportModal({
  isOpen,
  onClose,
  code,
  filename,
  outputLogs
}: LabReportModalProps) {
  // College Template Selector: 'dypcet' | 'other' | 'none', persisted in localStorage
  const [template, setTemplate] = useState<CollegeTemplate>(() => {
    try {
      const saved = localStorage.getItem('turboc_lab_template');
      if (saved === 'other' || saved === 'dypcet' || saved === 'none') return saved as CollegeTemplate;
    } catch {}
    return 'dypcet';
  });

  // Export Confirmation Dialog Prompt state
  const [showExportPrompt, setShowExportPrompt] = useState(false);
  const [exportMode, setExportMode] = useState<'download-pdf' | 'browser-print' | 'download-html'>('download-pdf');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfStatusMessage, setPdfStatusMessage] = useState('');

  // Outside DYPCET College Name (displays College Name + Approved by AICTE)
  const [otherCollegeName, setOtherCollegeName] = useState(() => {
    return localStorage.getItem('turboc_other_college_name') || 'Government College of Engineering';
  });

  // Student academic details
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('turboc_student_name') || 'Maaz Patwekar';
  });
  const [rollNo, setRollNo] = useState(() => {
    return localStorage.getItem('turboc_student_roll') || '23CSE101';
  });
  const [department, setDepartment] = useState(() => {
    const saved = localStorage.getItem('turboc_student_dept');
    if (saved && (DYPCET_BRANCHES as readonly string[]).includes(saved)) {
      return saved;
    }
    return 'Computer Science & Engineering (CSE)';
  });
  const [yearClass, setYearClass] = useState(() => {
    return localStorage.getItem('turboc_student_class') || 'S.Y. B.Tech';
  });
  const [academicYear, setAcademicYear] = useState(() => {
    return localStorage.getItem('turboc_academic_year') || '2025 - 2026';
  });

  // Toggle for including execution output in the export
  const [includeOutput, setIncludeOutput] = useState(true);

  const handleSelectTemplate = (selected: CollegeTemplate) => {
    setTemplate(selected);
    try {
      localStorage.setItem('turboc_lab_template', selected);
    } catch {}
  };

  const handleSaveOtherCollegeMeta = (name: string) => {
    setOtherCollegeName(name);
    try {
      localStorage.setItem('turboc_other_college_name', name);
    } catch {}
  };

  const handleSaveStudentMeta = (sName: string, rNo: string, dept: string, yClass?: string, acadYear?: string) => {
    setStudentName(sName);
    setRollNo(rNo);
    setDepartment(dept);
    if (yClass !== undefined) setYearClass(yClass);
    if (acadYear !== undefined) setAcademicYear(acadYear);
    try {
      localStorage.setItem('turboc_student_name', sName);
      localStorage.setItem('turboc_student_roll', rNo);
      localStorage.setItem('turboc_student_dept', dept);
      if (yClass !== undefined) localStorage.setItem('turboc_student_class', yClass);
      if (acadYear !== undefined) localStorage.setItem('turboc_academic_year', acadYear);
    } catch {}
  };

  // Trigger export flow prompt
  const handleTriggerExport = (mode: 'download-pdf' | 'browser-print' | 'download-html') => {
    setExportMode(mode);
    setShowExportPrompt(true);
  };

  // Perform direct PDF download via html2canvas and jsPDF with clean single/multi-page calculation
  const generateAndDownloadPdf = async (chosenTemplate: CollegeTemplate) => {
    handleSelectTemplate(chosenTemplate);
    setShowExportPrompt(false);
    setIsGeneratingPdf(true);
    setPdfStatusMessage('Rendering clean student code sheet...');

    try {
      // Small pause to allow state updates to reflect in DOM
      await new Promise(resolve => setTimeout(resolve, 250));

      const sheet = document.getElementById('lab-report-sheet');
      if (!sheet) {
        throw new Error('Code sheet element not found');
      }

      setPdfStatusMessage('Generating high-resolution canvas...');
      const scrollHeight = sheet.scrollHeight;

      const canvas = await html2canvas(sheet, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        height: scrollHeight,
        scrollY: 0,
        scrollX: 0,
        onclone: (clonedDoc) => {
          const clonedSheet = clonedDoc.getElementById('lab-report-sheet');
          if (clonedSheet) {
            clonedSheet.style.backgroundColor = '#ffffff';
            clonedSheet.style.color = '#000000';
            clonedSheet.style.height = 'auto';
            clonedSheet.style.minHeight = '0px';
            clonedSheet.style.maxHeight = 'none';
            clonedSheet.style.overflow = 'visible';
            clonedSheet.style.padding = '32px';
          }
          let parent = clonedSheet?.parentElement;
          while (parent) {
            parent.style.height = 'auto';
            parent.style.maxHeight = 'none';
            parent.style.overflow = 'visible';
            parent = parent.parentElement;
          }
        }
      });

      setPdfStatusMessage('Compiling crisp A4 PDF...');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfPageWidth = 210;
      const pdfPageHeight = 297;

      const totalWidth = canvas.width;
      const totalHeight = canvas.height;

      // In canvas pixels, 1 full A4 page height is:
      const pageHeightInPx = Math.floor(totalWidth * (pdfPageHeight / pdfPageWidth));

      // Single-page check: if entire sheet fits inside 1 A4 page (with 15px buffer)
      if (totalHeight <= pageHeightInPx + 15) {
        const pageImgData = canvas.toDataURL('image/jpeg', 0.98);
        const renderedHeightMm = Math.min(pdfPageHeight, (totalHeight * pdfPageWidth) / totalWidth);
        pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfPageWidth, renderedHeightMm);
      } else {
        // Multi-page slicing for longer code:
        let currentY = 0;
        let pageNum = 0;

        while (currentY < totalHeight) {
          const remainingHeight = totalHeight - currentY;
          // Avoid creating a trailing blank page for small whitespace padding
          if (pageNum > 0 && remainingHeight <= 50) {
            break;
          }

          const sliceHeight = Math.min(pageHeightInPx, remainingHeight);

          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = totalWidth;
          pageCanvas.height = pageHeightInPx;
          const pageCtx = pageCanvas.getContext('2d');

          if (pageCtx) {
            pageCtx.fillStyle = '#ffffff';
            pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            pageCtx.drawImage(
              canvas,
              0, currentY, totalWidth, sliceHeight, // source rect
              0, 0, totalWidth, sliceHeight         // destination rect
            );
          }

          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);

          if (pageNum > 0) {
            pdf.addPage();
          }

          pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfPageWidth, pdfPageHeight);

          currentY += pageHeightInPx;
          pageNum++;
        }
      }

      const collegePrefix = chosenTemplate === 'dypcet' 
        ? 'DYPCET' 
        : chosenTemplate === 'other'
          ? (otherCollegeName || 'COLLEGE').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 15)
          : 'CForge';
      const studentSlug = (studentName || 'Student').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
      const fileBase = filename.replace(/\.[^/.]+$/, '');
      const finalFileName = `${collegePrefix}_${fileBase}_${studentSlug}.pdf`;

      setPdfStatusMessage('Downloading PDF...');
      pdf.save(finalFileName);
    } catch (err: any) {
      console.error('Direct PDF error, falling back to print:', err);
      setPdfStatusMessage('Starting print/save dialog...');
      setTimeout(() => {
        window.print();
        setIsGeneratingPdf(false);
      }, 800);
      return;
    } finally {
      setIsGeneratingPdf(false);
      setPdfStatusMessage('');
    }
  };

  // Download self-contained HTML file
  const downloadHtmlReport = (chosenTemplate: CollegeTemplate) => {
    handleSelectTemplate(chosenTemplate);
    setShowExportPrompt(false);

    const sheet = document.getElementById('lab-report-sheet');
    if (!sheet) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${studentName} - ${filename} Code Submission | CForge</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f0f0f0; margin: 0; padding: 20px; display: flex; justify-content: center; }
    .sheet { background: white; max-width: 210mm; min-height: 297mm; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); box-sizing: border-box; }
    @media print { body { background: white; padding: 0; } .sheet { box-shadow: none; max-width: 100%; width: 100%; min-height: auto; padding: 20px; } }
    pre { font-family: monospace; font-size: 11px; line-height: 1.4; background: #fafafa; padding: 12px; border: 1px solid #ddd; white-space: pre-wrap; word-break: break-all; }
  </style>
</head>
<body>
  <div class="sheet">
    ${sheet.innerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CForge_${chosenTemplate === 'dypcet' ? 'DYPCET' : 'Student'}_${filename.replace(/\.[^/.]+$/, '')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const executeBrowserPrint = (chosenTemplate: CollegeTemplate) => {
    handleSelectTemplate(chosenTemplate);
    setShowExportPrompt(false);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleExecuteExport = (chosenTemplate: CollegeTemplate) => {
    if (exportMode === 'download-pdf') {
      generateAndDownloadPdf(chosenTemplate);
    } else if (exportMode === 'download-html') {
      downloadHtmlReport(chosenTemplate);
    } else {
      executeBrowserPrint(chosenTemplate);
    }
  };

  if (!isOpen) return null;

  const outputText = outputLogs.length > 0 
    ? outputLogs.join('\n') 
    : 'CForge Runtime Engine\nProcess completed with Exit Code: 0 (Normal Termination)';

  const linesOfCode = code.split('\n');

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print-modal-container overflow-y-auto">
      {/* Generating PDF Loading Overlay */}
      {isGeneratingPdf && (
        <div className="fixed inset-0 z-70 bg-black/85 flex flex-col items-center justify-center p-6 no-print animate-in fade-in">
          <div className="p-6 bg-neutral-900 border border-neutral-700 rounded-2xl flex flex-col items-center gap-4 text-center max-w-sm shadow-2xl">
            <Loader2 size={36} className="text-amber-400 animate-spin" />
            <div>
              <div className="font-bold text-white text-sm">Generating Clean PDF</div>
              <p className="text-xs text-neutral-400 mt-1">{pdfStatusMessage || 'Rendering student code sheet...'}</p>
            </div>
            <div className="text-[11px] text-neutral-500 font-mono">
              Saving directly to your Downloads folder
            </div>
          </div>
        </div>
      )}

      {/* Export Confirmation Dialog Prompt */}
      {showExportPrompt && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print animate-in fade-in overflow-y-auto">
          <div className="max-w-xl w-full bg-[#11141d] border border-neutral-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">Student Code Submission Details</h3>
                  <p className="text-xs text-neutral-400">Confirm student details and college option before exporting</p>
                </div>
              </div>
              <button 
                onClick={() => setShowExportPrompt(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* College Option Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Building2 size={13} className="text-amber-400" />
                <span>Select College Option:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* 1. DYPCET */}
                <button
                  type="button"
                  onClick={() => handleSelectTemplate('dypcet')}
                  className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    template === 'dypcet'
                      ? 'border-amber-400 bg-amber-950/30 text-white shadow-sm ring-1 ring-amber-400/40'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-bold text-xs text-white">DYPCET Kolhapur</div>
                  <div className="text-[10px] text-neutral-400 mt-1">D. Y. Patil Autonomous Institute header</div>
                </button>

                {/* 2. Outside DYPCET */}
                <button
                  type="button"
                  onClick={() => handleSelectTemplate('other')}
                  className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    template === 'other'
                      ? 'border-blue-400 bg-blue-950/30 text-white shadow-sm ring-1 ring-blue-400/40'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-bold text-xs text-white">Outside of DYPCET</div>
                  <div className="text-[10px] text-neutral-400 mt-1">College Name + Approved by AICTE</div>
                </button>

                {/* 3. Without College Name */}
                <button
                  type="button"
                  onClick={() => handleSelectTemplate('none')}
                  className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    template === 'none'
                      ? 'border-emerald-400 bg-emerald-950/30 text-white shadow-sm ring-1 ring-emerald-400/40'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-bold text-xs text-white">Without College Name</div>
                  <div className="text-[10px] text-neutral-400 mt-1">Only Student Name (No college banner)</div>
                </button>
              </div>

              {/* If Outside DYPCET: Only College Name input */}
              {template === 'other' && (
                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1.5 text-xs animate-in fade-in">
                  <label className="text-[11px] font-semibold text-neutral-300">
                    College / Institute Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={otherCollegeName}
                    placeholder="Enter your college / institute name"
                    onChange={(e) => handleSaveOtherCollegeMeta(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium focus:outline-none focus:border-blue-400"
                  />
                  <p className="text-[10px] text-neutral-400 font-mono">
                    * Displays: <strong className="text-neutral-200">{otherCollegeName || 'College Name'}</strong> with <span className="text-amber-400 font-semibold">Approved by AICTE</span>
                  </p>
                </div>
              )}
            </div>

            {/* Student Academic Info Form */}
            <div className="space-y-3 bg-neutral-950/60 border border-neutral-800/80 p-3.5 rounded-xl">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap size={14} />
                <span>{template === 'none' ? 'Student Information' : 'Student Academic Details'}</span>
              </div>

              {template === 'none' ? (
                /* Without College Name: ONLY Student Name input as requested */
                <div className="space-y-1 text-xs">
                  <label className="text-[11px] font-semibold text-neutral-300">
                    Student Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    placeholder="Enter student full name"
                    onChange={(e) => handleSaveStudentMeta(e.target.value, rollNo, department, yearClass, academicYear)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-neutral-400">
                    * For &ldquo;Without College Name&rdquo;, Branch, Roll Number, and Academic Year are excluded; only the student name is printed.
                  </p>
                </div>
              ) : (
                /* DYPCET & Outside DYPCET: Full Academic Info */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Student Full Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-300">
                      Student Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      placeholder="Enter student full name"
                      onChange={(e) => handleSaveStudentMeta(e.target.value, rollNo, department, yearClass, academicYear)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Roll Number / PRN */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-300">
                      Roll No. / PRN <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={rollNo}
                      placeholder="e.g. 23CSE101"
                      onChange={(e) => handleSaveStudentMeta(studentName, e.target.value, department, yearClass, academicYear)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono font-medium focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Class / Year */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-300">
                      Class / Year <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={yearClass}
                      placeholder="e.g. S.Y. B.Tech / Final Year"
                      onChange={(e) => handleSaveStudentMeta(studentName, rollNo, department, e.target.value, academicYear)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Academic Year */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-neutral-300">
                      Academic Year <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={academicYear}
                      placeholder="e.g. 2025 - 2026"
                      onChange={(e) => handleSaveStudentMeta(studentName, rollNo, department, yearClass, e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Branch / Department - EXACTLY the institute branches specified by user */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-semibold text-neutral-300">
                      Branch / Program <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={department}
                      onChange={(e) => handleSaveStudentMeta(studentName, rollNo, e.target.value, yearClass, academicYear)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium focus:outline-none focus:border-amber-400"
                    >
                      <optgroup label="Undergraduate Programs (B.Tech & B.Arch)">
                        {DYPCET_UG_BRANCHES.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Postgraduate Programs (M.Tech)">
                        {DYPCET_PG_BRANCHES.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Export Method Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-neutral-400">Export Method:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setExportMode('download-pdf')}
                  className={`p-2 rounded-lg text-xs font-semibold border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    exportMode === 'download-pdf'
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Download size={14} />
                  <span>Download .PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExportMode('browser-print')}
                  className={`p-2 rounded-lg text-xs font-semibold border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    exportMode === 'browser-print'
                      ? 'border-blue-500 bg-blue-950/40 text-blue-300'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Printer size={14} />
                  <span>Browser Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExportMode('download-html')}
                  className={`p-2 rounded-lg text-xs font-semibold border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    exportMode === 'download-html'
                      ? 'border-purple-500 bg-purple-950/40 text-purple-300'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  <FileCode size={14} />
                  <span>Offline .HTML</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowExportPrompt(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleExecuteExport(template)}
                disabled={!studentName.trim() || (template !== 'none' && !rollNo.trim())}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50 transition-all transform active:scale-95"
              >
                {exportMode === 'download-pdf' ? (
                  <>
                    <Download size={15} />
                    <span>Download PDF (.pdf)</span>
                  </>
                ) : exportMode === 'browser-print' ? (
                  <>
                    <Printer size={15} />
                    <span>Start Browser Print</span>
                  </>
                ) : (
                  <>
                    <FileCode size={15} />
                    <span>Download HTML File</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Modal Dialog */}
      <div className="max-w-4xl w-full bg-[#0c0e14] border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] print-modal-content overflow-hidden">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="p-4 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 bg-neutral-900/90 text-neutral-100 no-print select-none">
          <div className="flex items-center gap-2.5">
            <FileCheck className="text-amber-400" size={18} />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Export Student Code (Print / PDF)
              </h2>
              <p className="text-xs text-neutral-400">
                Simple student code sheet with academic details and source code
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTriggerExport('download-pdf')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Download size={14} />
              <span>Download PDF (.pdf)</span>
            </button>

            <button
              onClick={() => handleTriggerExport('browser-print')}
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close export dialog"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Configuration Toolbar (College Selector & Student Meta) - Hidden on print */}
        <div className="bg-neutral-950 border-b border-neutral-800 p-4 space-y-3.5 no-print text-xs text-neutral-300 overflow-y-auto max-h-56">
          {/* Template Selection Radio */}
          <div className="space-y-1.5">
            <label className="font-semibold text-white flex items-center gap-2">
              <Building2 size={14} className="text-amber-400" />
              <span>College Option:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5">
              <label 
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                  template === 'dypcet'
                    ? 'border-amber-400 bg-amber-950/20 text-white shadow-sm'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <input
                  type="radio"
                  name="collegeTemplate"
                  checked={template === 'dypcet'}
                  onChange={() => handleSelectTemplate('dypcet')}
                  className="mt-0.5 accent-amber-400"
                />
                <div>
                  <div className="font-bold text-white text-xs">DYPCET Student</div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    D. Y. Patil College of Engineering & Technology (Autonomous)
                  </p>
                </div>
              </label>

              <label 
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                  template === 'other'
                    ? 'border-blue-400 bg-blue-950/20 text-white shadow-sm'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <input
                  type="radio"
                  name="collegeTemplate"
                  checked={template === 'other'}
                  onChange={() => handleSelectTemplate('other')}
                  className="mt-0.5 accent-blue-400"
                />
                <div>
                  <div className="font-bold text-white text-xs">Outside of DYPCET</div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    College Name + Approved by AICTE
                  </p>
                </div>
              </label>

              <label 
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                  template === 'none'
                    ? 'border-emerald-400 bg-emerald-950/20 text-white shadow-sm'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <input
                  type="radio"
                  name="collegeTemplate"
                  checked={template === 'none'}
                  onChange={() => handleSelectTemplate('none')}
                  className="mt-0.5 accent-emerald-400"
                />
                <div>
                  <div className="font-bold text-white text-xs">Without College Name</div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    Only Student Name (No college banner)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Conditional Outside DYPCET College Field: ONLY College Name as requested */}
          {template === 'other' && (
            <div className="p-2.5 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
              <label className="text-[11px] text-neutral-300 font-semibold">
                College / Institute Name (comes with &ldquo;Approved by AICTE&rdquo;)
              </label>
              <input
                type="text"
                value={otherCollegeName}
                placeholder="Enter college name"
                onChange={(e) => handleSaveOtherCollegeMeta(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-white font-medium focus:outline-none focus:border-blue-400 text-xs"
              />
            </div>
          )}

          {/* Student Details in Configuration Toolbar */}
          {template === 'none' ? (
            /* Without College Name: ONLY Student Name */
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-400 font-semibold">
                Student Full Name <span className="text-neutral-500 font-normal">(Only name will be printed on the code sheet)</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => handleSaveStudentMeta(e.target.value, rollNo, department, yearClass, academicYear)}
                className="w-full sm:w-1/2 px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium"
              />
            </div>
          ) : (
            /* DYPCET & Outside DYPCET: Full Academic Info */
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Student Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => handleSaveStudentMeta(e.target.value, rollNo, department, yearClass, academicYear)}
                  className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Roll No. / PRN</label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => handleSaveStudentMeta(studentName, e.target.value, department, yearClass, academicYear)}
                  className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Class / Year</label>
                <input
                  type="text"
                  value={yearClass}
                  onChange={(e) => handleSaveStudentMeta(studentName, rollNo, department, e.target.value, academicYear)}
                  className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Academic Year</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => handleSaveStudentMeta(studentName, rollNo, department, yearClass, e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium"
                />
              </div>
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <label className="text-[11px] text-neutral-400">Branch</label>
                <select
                  value={department}
                  onChange={(e) => handleSaveStudentMeta(studentName, rollNo, e.target.value, yearClass, academicYear)}
                  className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-medium text-[11px]"
                >
                  <optgroup label="Undergraduate (B.Tech & B.Arch)">
                    {DYPCET_UG_BRANCHES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Postgraduate (M.Tech)">
                    {DYPCET_PG_BRANCHES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Live A4 Document Preview Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-900/50 flex justify-center">
          <div 
            id="lab-report-sheet" 
            style={{ backgroundColor: '#ffffff', color: '#000000' }}
            className="bg-white text-black w-full max-w-[210mm] p-6 sm:p-9 shadow-2xl print-sheet font-sans text-xs leading-normal rounded-xs"
          >
            
            {/* Header 1: DYPCET (D. Y. PATIL COLLEGE OF ENGINEERING & TECHNOLOGY) */}
            {template === 'dypcet' ? (
              <div className="border-b-2 border-black pb-3 space-y-2 select-none">
                <div className="flex items-center justify-between gap-4">
                  {/* Left NAAC/NBA Accreditation Badge */}
                  <div className="text-right text-[10px] font-bold leading-tight border-r-2 border-black pr-3 shrink-0">
                    <div>Accredited by NAAC</div>
                    <div>NBA Accredited Programs</div>
                  </div>

                  {/* Center Brand: DYP Crest + D Y PATIL Typography */}
                  <div className="flex items-center gap-3.5 flex-1 justify-center sm:justify-start pl-2">
                    {/* Vector DYP Shield Crest */}
                    <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-black" fill="currentColor">
                        <path d="M50 4 C75 4 88 16 88 38 C88 64 68 86 50 96 C32 86 12 64 12 38 C12 16 25 4 50 4 Z" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path d="M50 8 C72 8 84 18 84 38 C84 61 66 82 50 91 C34 82 16 61 16 38 C16 18 28 8 50 8 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
                        <text x="50" y="44" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="16" textAnchor="middle" fill="currentColor" letterSpacing="0.5">
                          DYP
                        </text>
                      </svg>
                    </div>

                    {/* D Y PATIL Header Text */}
                    <div className="space-y-0.5 text-left">
                      <div className="text-xl sm:text-2xl font-black tracking-wider text-black font-sans leading-none">
                        D Y PATIL
                      </div>
                      <div className="text-xs sm:text-sm font-semibold tracking-wide text-neutral-800">
                        <span className="font-sans font-bold">COLLEGE </span>
                        <span className="font-serif italic font-normal">Of </span>
                        <span className="font-sans font-bold">ENGINEERING &amp; TECHNOLOGY</span>
                      </div>
                      <div className="text-[10px] font-bold tracking-tight text-neutral-700">
                        (AN EMPOWERED AUTONOMOUS INSTITUTE) · KASABA BAWADA, KOLHAPUR
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[9px] text-center text-neutral-800 space-y-0.5 pt-1">
                  <div>
                    Approved by AICTE, New Delhi, Recognized by Govt. of Maharashtra &amp; Affiliated to Shivaji University Kolhapur.
                  </div>
                </div>
              </div>
            ) : template === 'other' ? (
              /* Header 2: OUTSIDE OF DYPCET (College Name + Approved by AICTE) */
              <div className="border-b-2 border-black pb-3 space-y-1 text-center select-none">
                <div className="text-xl sm:text-2xl font-black uppercase tracking-wider text-black">
                  {otherCollegeName || 'COLLEGE OF ENGINEERING'}
                </div>
                <div className="text-xs font-bold text-neutral-800 tracking-wide uppercase">
                  Approved by AICTE
                </div>
              </div>
            ) : (
              /* Header 3: WITHOUT COLLEGE NAME */
              <div className="border-b-2 border-black pb-2 text-center select-none">
                <div className="text-base sm:text-lg font-black uppercase tracking-widest text-black">
                  STUDENT CODE SUBMISSION RECORD
                </div>
                <div className="text-[10px] text-neutral-600 font-mono font-medium mt-0.5">
                  CForge Developed by Maaz Patwekar
                </div>
              </div>
            )}

            {/* Student Information Box */}
            {template === 'none' ? (
              /* In Without College Name: Erased Branch name, roll number, and Academic year — ONLY keep student name */
              <div className="border border-black p-2.5 rounded-xs my-3 text-[11px] leading-relaxed bg-neutral-50/50 flex items-center justify-between">
                <div>
                  <span className="font-bold">Student Name: </span>
                  <span className="font-semibold underline uppercase text-xs">{studentName}</span>
                </div>
                <div className="text-[10px] font-mono text-neutral-500">
                  Code Record
                </div>
              </div>
            ) : (
              /* In DYPCET & Outside DYPCET: Full Academic Details */
              <div className="border border-black p-3 rounded-xs my-3 text-[11px] leading-relaxed bg-neutral-50/50">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                  <div>
                    <span className="font-bold">Student Name: </span>
                    <span className="font-semibold underline uppercase">{studentName}</span>
                  </div>
                  <div>
                    <span className="font-bold">Roll No. / PRN: </span>
                    <span className="font-mono font-bold">{rollNo}</span>
                  </div>
                  <div>
                    <span className="font-bold">Class / Year: </span>
                    <span>{yearClass}</span>
                  </div>
                  <div>
                    <span className="font-bold">Academic Year: </span>
                    <span>{academicYear}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-bold">Branch: </span>
                    <span className="font-semibold">{department}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Source Code Section Header */}
            <div className="mb-3 space-y-1">
              <div className="flex justify-between items-baseline border-b border-black pb-1">
                <span className="font-bold text-xs uppercase tracking-wider">
                  SOURCE CODE: <span className="font-mono underline">{filename}</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-600">
                  {linesOfCode.length} lines · {filename.endsWith('.cpp') ? 'C++' : 'C'}
                </span>
              </div>

              {/* Code display with line numbers */}
              <div className="border border-neutral-400 bg-white p-3 rounded-xs overflow-visible">
                <pre className="font-mono text-[10.5px] leading-relaxed text-black whitespace-pre-wrap break-all">
                  {linesOfCode.map((line, idx) => (
                    <div key={idx} className="flex">
                      <span className="w-8 text-neutral-400 select-none text-right pr-3 font-mono shrink-0">
                        {idx + 1}
                      </span>
                      <span className="flex-1 font-mono">{line || ' '}</span>
                    </div>
                  ))}
                </pre>
              </div>
            </div>

            {/* Program Execution Output Section (Clean & Optional) */}
            {includeOutput && (
              <div className="mb-3 space-y-1">
                <div className="flex items-center gap-1.5 border-b border-black pb-1 font-bold text-xs uppercase tracking-wider">
                  <Terminal size={13} />
                  <span>PROGRAM EXECUTION OUTPUT:</span>
                </div>
                <div className="border border-black bg-black text-[#55ff55] p-3 rounded-xs font-mono text-[10.5px] leading-relaxed shadow-inner">
                  <pre className="whitespace-pre-wrap break-all">{outputText}</pre>
                </div>
              </div>
            )}

            {/* Academic Footer - Printed on PDF for all 3 options */}
            <div className="mt-6 pt-2 border-t border-neutral-300 flex justify-between items-center text-[9px] text-neutral-600 font-mono">
              <div className="font-semibold text-black">
                CForge Developed by Maaz Patwekar
              </div>
              <div>
                {template === 'dypcet' 
                  ? 'D. Y. Patil College of Engineering & Technology, Kolhapur' 
                  : template === 'other'
                    ? `${otherCollegeName} (Approved by AICTE)`
                    : 'CForge Code Submission'}
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Actions (Hidden on print) */}
        <div className="p-3.5 bg-neutral-950 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400 no-print">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-neutral-300">
              <input
                type="checkbox"
                checked={includeOutput}
                onChange={(e) => setIncludeOutput(e.target.checked)}
                className="accent-amber-400 rounded"
              />
              <span>Include Execution Output</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-medium cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => handleTriggerExport('download-html')}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              title="Download standalone HTML code sheet"
            >
              <FileCode size={14} className="text-purple-400" />
              <span>HTML</span>
            </button>
            <button
              onClick={() => handleTriggerExport('browser-print')}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Open browser print dialog"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>
            <button
              onClick={() => handleTriggerExport('download-pdf')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Generate and download actual .pdf file"
            >
              <Download size={15} />
              <span>Download PDF (.pdf)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
