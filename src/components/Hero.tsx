import React from 'react';
import { ArrowRight, Code2, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onExplorePrototypes: () => void;
  onOpenSpecBuilder: () => void;
}

export function Hero({ onExplorePrototypes, onOpenSpecBuilder }: HeroProps) {
  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-neutral-800/60">
      {/* Background ambient lighting */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl space-y-6">
          {/* Quiet Unboxed Metadata Kicker */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-400">
            <span>Web Engineering & Architecture</span>
            <span aria-hidden="true">·</span>
            <span>React 19 & TypeScript</span>
            <span aria-hidden="true">·</span>
            <span>Tailwind CSS</span>
            <span aria-hidden="true">·</span>
            <span>Production Deployed</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.12]">
            Yes. We engineer distinctive, production-grade web systems.
          </h1>

          {/* Concrete Value Proposition */}
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl text-pretty">
            From high-conversion SaaS landing pages and interactive operational dashboards to 
            bespoke e-commerce boutiques and full-stack React architectures. 
            Test drive live interactive prototypes below, inspect real component code, or generate a tailored architecture for your vision.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExplorePrototypes}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-neutral-950 bg-white rounded-lg hover:bg-neutral-200 transition-colors shadow-sm cursor-pointer"
            >
              <span>Explore Live Prototypes</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onOpenSpecBuilder}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-neutral-200 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
            >
              <Code2 size={16} />
              <span>Configure Your Website Spec</span>
            </button>
          </div>
        </div>

        {/* Claim-to-Proof Quantitative Adjacency: 4-Column Metric Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-neutral-800/80">
          <div className="space-y-1">
            <span className="text-xs text-neutral-400 font-medium">Architecture</span>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">React 19 + Vite</div>
            <p className="text-xs text-neutral-500">Modern modular client hydration with Tailwind v4</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-neutral-400 font-medium">Core Web Vitals</span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono tabular-nums">&lt; 0.8s FCP</div>
            <p className="text-xs text-neutral-500">Zero layout shift, optimized fonts and asset budgets</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-neutral-400 font-medium">Accessibility</span>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">WCAG AA</div>
            <p className="text-xs text-neutral-500">High-contrast legibility, focus rings & keyboard navigation</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-neutral-400 font-medium">Backend & Storage</span>
            <div className="text-xl sm:text-2xl font-bold text-blue-400 font-mono tabular-nums">Full-Stack</div>
            <p className="text-xs text-neutral-500">Express Node endpoints, REST APIs & database persistence</p>
          </div>
        </div>
      </div>
    </section>
  );
}
