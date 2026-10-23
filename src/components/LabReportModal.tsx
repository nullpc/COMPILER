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
  // Direct export trigger: executes immediately without any popup dialog appearing over the PDF
  const handleTriggerExport = (mode: 'download-pdf' | 'browser-print' | 'download-html') => {
    if (mode === 'download-pdf') {
      generateAndDownloadPdf(template);
    } else if (mode === 'browser-print') {
      executeBrowserPrint(template);
    } else if (mode === 'download-html') {
      downloadHtmlReport(template);
    }
  };

  // Perform clean, mobile-optimized direct PDF download via html2canvas and jsPDF
  const generateAndDownloadPdf = async (chosenTemplate: CollegeTemplate) => {
    handleSelectTemplate(chosenTemplate);
    setIsGeneratingPdf(true);
    setPdfStatusMessage('Rendering clean A4 student code sheet...');

    try {
      // Small pause to allow state updates to reflect in DOM
      await new Promise(resolve => setTimeout(resolve, 200));

      const sheet = document.getElementById('lab-report-sheet');
      if (!sheet) {
        throw new Error('Code sheet element not found');
      }

      setPdfStatusMessage('Capturing high-resolution desktop layout...');

      // Render at fixed 794px width (standard A4 at 96 DPI) with windowWidth: 1024 so mobile browsers render full desktop layout
      const canvas = await html2canvas(sheet, {
        scale: 1.5, // 1.5x gives ~150 DPI print sharpness without crashing mobile browser RAM
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024,
        onclone: (clonedDoc) => {
          const clonedSheet = clonedDoc.getElementById('lab-report-sheet');
          if (clonedSheet) {
            clonedSheet.style.width = '794px';
            clonedSheet.style.minWidth = '794px';
            clonedSheet.style.maxWidth = '794px';
            clonedSheet.style.boxSizing = 'border-box';
            clonedSheet.style.padding = '32px 36px';
            clonedSheet.style.backgroundColor = '#ffffff';
            clonedSheet.style.color = '#000000';
            clonedSheet.style.height = 'auto';
            clonedSheet.style.minHeight = '0px';
            clonedSheet.style.maxHeight = 'none';
            clonedSheet.style.overflow = 'visible';
            clonedSheet.style.margin = '0 auto';
          }
          if (clonedDoc.body) {
            clonedDoc.body.style.width = '1024px';
            clonedDoc.body.style.minWidth = '1024px';
            clonedDoc.body.style.backgroundColor = '#ffffff';
            clonedDoc.body.style.overflow = 'visible';
          }
          let parent = clonedSheet?.parentElement;
          while (parent) {
            parent.style.width = '1024px';
            parent.style.minWidth = '1024px';
            parent.style.height = 'auto';
            parent.style.maxHeight = 'none';
            parent.style.overflow = 'visible';
            parent = parent.parentElement;
          }
        }
      });

      setPdfStatusMessage('Assembling crisp PDF document...');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfPageWidth = 210;
      const pdfPageHeight = 297;
      const totalWidth = canvas.width;
      const totalHeight = canvas.height;

      // In canvas pixels, 1 full A4 page height is:
      const pageHeightInPx = Math.floor(totalWidth * (pdfPageHeight / pdfPageWidth));

      // Single-page check: if entire sheet fits inside 1 A4 page (with 20px tolerance)
      if (totalHeight <= pageHeightInPx + 20) {
        const pageImgData = canvas.toDataURL('image/jpeg', 0.92);
        const renderedHeightMm = Math.min(pdfPageHeight, (totalHeight * pdfPageWidth) / totalWidth);
        pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfPageWidth, renderedHeightMm, undefined, 'FAST');
      } else {
        // Multi-page slicing for longer programs
        let currentY = 0;
        let pageNum = 0;
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = totalWidth;
        pageCanvas.height = pageHeightInPx;
        const pageCtx = pageCanvas.getContext('2d');

        while (currentY < totalHeight) {
          const remainingHeight = totalHeight - currentY;
          // Avoid creating an empty trailing page for minor whitespace
          if (pageNum > 0 && remainingHeight <= 40) {
            break;
          }

          const sliceHeight = Math.min(pageHeightInPx, remainingHeight);

          if (pageCtx) {
            pageCtx.fillStyle = '#ffffff';
            pageCtx.fillRect(0, 0, totalWidth, pageHeightInPx);
            pageCtx.drawImage(
              canvas,
              0, currentY, totalWidth, sliceHeight,
              0, 0, totalWidth, sliceHeight
            );
          }

          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.90);

          if (pageNum > 0) {
            pdf.addPage();
          }

          pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfPageWidth, pdfPageHeight, undefined, 'FAST');
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

      const blob = pdf.output('blob');
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // On mobile devices, attempt Web Share API for native viewing/saving if supported
      let sharedSuccessfully = false;
      if (isMobile && typeof navigator.share === 'function') {
        try {
          const pdfFile = new File([blob], finalFileName, { type: 'application/pdf' });
          if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
            await navigator.share({
              files: [pdfFile],
              title: finalFileName
            });
            sharedSuccessfully = true;
          }
        } catch (shareErr) {
          console.log('Mobile share dismissed, using download link:', shareErr);
        }
      }

      if (!sharedSuccessfully) {
        // Direct reliable Blob download link
        const blobUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = finalFileName;
        downloadLink.rel = 'noopener';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        setTimeout(() => {
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(blobUrl);
        }, 15000);
      }
    } catch (err: any) {
      console.error('Direct PDF error, falling back to print:', err);
      setPdfStatusMessage('Opening print dialog...');
      setTimeout(() => {
        window.print();
        setIsGeneratingPdf(false);
      }, 500);
      return;
    } finally {
      setIsGeneratingPdf(false);
      setPdfStatusMessage('');
    }
  };

  // Download self-contained HTML file
  const downloadHtmlReport = (chosenTemplate: CollegeTemplate) => {
    handleSelectTemplate(chosenTemplate);

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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs overflow-y-auto p-2 sm:p-6 print-modal-container">
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

      {/* Main Modal Dialog (Natural document flow - No nested flex-col shrinking or docking) */}
      <div className="max-w-5xl w-full mx-auto my-3 sm:my-8 bg-[#0c0e14] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden print-modal-content">
        
        {/* Top Header Bar (Clean title & close button - no export buttons above the preview) */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900 text-neutral-100 no-print select-none shrink-0">
          <div className="flex items-center gap-2.5">
            <FileCheck className="text-amber-400" size={18} />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Export Student Code (Print / PDF)
              </h2>
              <p className="text-xs text-neutral-400">
                Configure details below and preview your document before exporting
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close export dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Configuration Toolbar (College Selector & Student Meta) - Hidden on print */}
        <div className="bg-neutral-950 border-b border-neutral-800 p-4 sm:p-5 space-y-4 no-print text-xs text-neutral-300 shrink-0">
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

        {/* Live A4 Document Preview Container (Positioned clearly BELOW configuration) */}
        <div className="w-full p-4 sm:p-8 pb-12 bg-[#07090e] flex flex-col items-center justify-start border-b border-neutral-800/80 min-h-[500px] overflow-x-auto">
          {/* Preview Section Header */}
          <div className="w-full max-w-[210mm] mb-4 flex items-center justify-between text-xs text-neutral-400 select-none px-1">
            <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
              <FileCheck size={14} className="text-amber-400" />
              <span>Live PDF Document Preview (A4 Sheet Below)</span>
            </span>
            <span className="text-[11px] font-mono text-neutral-500">
              A4 Portrait · 210 × 297 mm
            </span>
          </div>

          <div 
            id="lab-report-sheet" 
            style={{ backgroundColor: '#ffffff', color: '#000000' }}
            className="bg-white text-black w-full max-w-[210mm] p-6 sm:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.6)] border border-neutral-300 print-sheet font-sans text-xs leading-normal rounded-xs mb-8"
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

        {/* Modal Bottom Actions (Positioned strictly BELOW the PDF preview in natural block flow) */}
        <div className="w-full p-4 sm:p-6 bg-[#0a0c10] border-t-2 border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-300 no-print">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-200 font-medium select-none">
              <input
                type="checkbox"
                checked={includeOutput}
                onChange={(e) => setIncludeOutput(e.target.checked)}
                className="accent-amber-400 rounded w-4 h-4 cursor-pointer"
              />
              <span>Include Execution Output</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-neutral-300 rounded-lg text-xs font-medium cursor-pointer transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => handleTriggerExport('download-html')}
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-neutral-200 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Download standalone HTML code sheet"
            >
              <FileCode size={14} className="text-purple-400" />
              <span>HTML</span>
            </button>
            <button
              type="button"
              onClick={() => handleTriggerExport('browser-print')}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-neutral-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Open browser print dialog"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={() => handleTriggerExport('download-pdf')}
              disabled={isGeneratingPdf}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40 transition-colors"
              title="Generate and download crisp A4 PDF file"
            >
              <Download size={15} />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF (.pdf)'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
