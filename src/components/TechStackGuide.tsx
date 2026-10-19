import React from 'react';
import { Layers, Terminal, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function TechStackGuide() {
  const stackCategories = [
    {
      title: 'Frontend Architecture',
      description: 'Modern client runtime optimized for instant rendering and responsiveness.',
      items: [
        { name: 'React 19', desc: 'Latest concurrent features & server-ready functional components' },
        { name: 'Tailwind CSS v4', desc: 'Zero-runtime utility framework with modern CSS theme tokens' },
        { name: 'TypeScript 5', desc: 'Strict compile-time type safety across all props and handlers' },
        { name: 'Vite 8', desc: 'Sub-second dev server and optimized production rollup bundling' }
      ]
    },
    {
      title: 'Backend & Data Persistence',
      description: 'Full-stack capabilities ready for database records, user auth, and API routes.',
      items: [
        { name: 'Express & Node.js', desc: 'Server-side proxy routes (/api/*) keeping credentials secure' },
        { name: 'Google Firestore', desc: 'Real-time document persistence with security rules' },
        { name: 'PostgreSQL / Cloud SQL', desc: 'Relational data modeling with relational schemas' },
        { name: 'Google Workspace APIs', desc: 'Native OAuth integration with Sheets, Docs, and Calendar' }
      ]
    },
    {
      title: 'Design & Accessibility Standards',
      description: 'Strict adherence to design craftsmanship without generic AI templates.',
      items: [
        { name: 'WCAG AA Compliance', desc: 'Contrast ratios >= 4.5:1, visible focus rings, and touch targets' },
        { name: 'Zero-Pill Discipline', desc: 'Clean unboxed typography with semantic separators' },
        { name: 'Tabular Numerals', desc: 'Vertical metric alignment with font-mono and tabular figures' },
        { name: 'Device Ergonomics', desc: 'Single-line control labels with 1440px desktop to 390px mobile coverage' }
      ]
    }
  ];

  return (
    <section id="stack" className="py-20 bg-neutral-950 border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>04. ENGINEERING & TECH STACK</span>
            <span aria-hidden="true">·</span>
            <span>PRODUCTION SPECS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Built on modern, industry-standard engineering foundations.
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Every website created is built with clean, maintainable, modular code that you can inspect, download, customize, and deploy directly to production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stackCategories.map((cat, idx) => (
            <div
              key={cat.title}
              className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-neutral-400">0{idx + 1}. SPECIFICATION</span>
                  <h3 className="text-lg font-bold text-white mt-1">{cat.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{cat.description}</p>
                </div>

                <div className="space-y-3 pt-2">
                  {cat.items.map((item) => (
                    <div key={item.name} className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-neutral-400 shrink-0" />
                        <span className="text-xs font-semibold text-white">{item.name}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 pl-5 leading-normal">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
