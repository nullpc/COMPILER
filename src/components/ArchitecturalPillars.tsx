import React from 'react';
import { Layout, Database, Shield, Zap, Sparkles, Cpu, GitBranch, Terminal } from 'lucide-react';

export function ArchitecturalPillars() {
  const pillars = [
    {
      index: '01',
      title: 'High-Performance Frontends',
      headline: 'Sub-second hydration & zero layout shifts.',
      description: 'Engineered with React 19, TypeScript, and Tailwind CSS v4. Every interface is tested for fluid 60fps animations, mobile-first touch ergonomics, and WCAG AA contrast compliance.',
      tags: ['React 19', 'Tailwind CSS v4', 'Vite Bundler', 'Strict TypeScript', 'Mobile Ergonomics'],
      span: 'lg:col-span-2'
    },
    {
      index: '02',
      title: 'Full-Stack Data & APIs',
      headline: 'Seamless server endpoints & databases.',
      description: 'Integrated Express/Node.js servers, Firestore, PostgreSQL, REST/WebSocket APIs, and secure server-side proxies without exposing client API keys.',
      tags: ['Express Node.js', 'Firestore / Cloud SQL', 'REST & GraphQL', 'OAuth 2.0 Client'],
      span: 'lg:col-span-1'
    },
    {
      index: '03',
      title: 'Domain-Native Design Systems',
      headline: 'Zero generic templates or AI slop.',
      description: 'Every layout adopts domain-authentic typographic pairings (Plus Jakarta Sans, JetBrains Mono, Playfair), unboxed clean metadata, and disciplined 60-30-10 color allocation.',
      tags: ['Zero-Pill Discipline', 'Curated Typography', 'Tabular Numerals', 'Color Balancing'],
      span: 'lg:col-span-1'
    },
    {
      index: '04',
      title: 'Complex Interactive State',
      headline: 'Live calculators, filters, and engines.',
      description: 'Interactive state machines for e-commerce carts, compound yield calculators, telemetry tables with multi-region filtering, and responsive modal workflows.',
      tags: ['State Machines', 'Live Compounding Math', 'Dynamic Data Filtering', 'Instant UI Feedback'],
      span: 'lg:col-span-2'
    }
  ];

  return (
    <section id="capabilities" className="py-20 border-b border-neutral-800/80 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Section Header */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>02. ARCHITECTURAL CAPABILITIES</span>
            <span aria-hidden="true">·</span>
            <span>END-TO-END ENGINEERING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            What kind of websites can we create?
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Whether you need a sleek product drop, an enterprise SaaS portal, an interactive scientific simulator, or a bespoke e-commerce store, our engineering standards guarantee production-grade execution.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.index}
              className={`p-7 bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl transition-all space-y-5 flex flex-col justify-between ${pillar.span}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400">
                    {pillar.index}. {pillar.title}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-neutral-700" />
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight">
                  {pillar.headline}
                </h3>

                <p className="text-sm text-neutral-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Clean unboxed tags */}
              <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-400">
                {pillar.tags.map((tag, idx) => (
                  <React.Fragment key={tag}>
                    <span>{tag}</span>
                    {idx < pillar.tags.length - 1 && <span aria-hidden="true">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
