import React from 'react';

export function Footer() {
  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-800/80 text-neutral-400 py-12">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <span className="text-base font-bold text-white tracking-tight">WebCraft Studio</span>
            <p className="text-xs text-neutral-500">
              High-performance web architecture, interactive prototypes, and production software engineering.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400">
            <a href="#prototypes" className="hover:text-white transition-colors">Prototypes</a>
            <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#architectures" className="hover:text-white transition-colors">Architectures</a>
            <a href="#stack" className="hover:text-white transition-colors">Tech Stack</a>
            <a href="#inquiry" className="hover:text-white transition-colors">Build Inquiry</a>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} WebCraft Studio. Built with React 19, TypeScript, and Tailwind CSS.
          </div>
          <div className="flex items-center gap-3">
            <span>WCAG AA Accessible</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Pill Typography</span>
            <span aria-hidden="true">·</span>
            <span>Clean Code Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
