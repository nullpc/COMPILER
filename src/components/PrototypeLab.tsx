import React, { useState } from 'react';
import { ARCHETYPES, SAMPLE_CODE_SNIPPETS } from '../data/archetypes';
import { ArchetypeId, DeviceViewport } from '../types';
import { SaaSPrototype } from './prototypes/SaaSPrototype';
import { AgencyPrototype } from './prototypes/AgencyPrototype';
import { EcommercePrototype } from './prototypes/EcommercePrototype';
import { FintechPrototype } from './prototypes/FintechPrototype';
import { 
  Laptop, 
  Tablet, 
  Smartphone, 
  Code2, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  Layers,
  Palette
} from 'lucide-react';

interface PrototypeLabProps {
  onCustomizeWithAi: (archetype: string) => void;
}

export function PrototypeLab({ onCustomizeWithAi }: PrototypeLabProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId>('saas');
  const [viewport, setViewport] = useState<DeviceViewport>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'prompt'>('preview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const currentArchetype = ARCHETYPES.find(a => a.id === selectedArchetype) || ARCHETYPES[0];

  const handleCopyCode = () => {
    const code = SAMPLE_CODE_SNIPPETS[selectedArchetype] || '';
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getAiPromptForArchetype = (archetypeId: ArchetypeId) => {
    switch (archetypeId) {
      case 'saas':
        return `Build a production-grade SaaS landing page and telemetry dashboard in React 19 and Tailwind CSS v4.
Include:
- High-impact editorial hero with distributed cloud value proposition and clear CTA
- Interactive monthly vs annual pricing toggle recalculating 3 tiers with feature comparisons
- Filterable real-time cluster health and latency table with search and region filters
- Direct developer token access form with validated email state
- WCAG AA contrast, tabular numerals for all metrics, and responsive desktop/mobile layouts.`;
      case 'agency':
        return `Build a minimalist creative studio portfolio and architectural showcase in React 19 and Tailwind CSS.
Include:
- Clean editorial typography pairing with generous whitespace and 3-zone top bar
- Filterable case studies grid (Architecture, Industrial Design, Brand Systems)
- Interactive project detail modal showcasing client outcomes, photos, and engineering specifications
- Commission inquiry drawer for prospective enterprise clients
- Anti-slop zero-pill design with quiet unboxed metadata.`;
      case 'ecommerce':
        return `Build a luxury bespoke retail storefront in React 19 and Tailwind CSS.
Include:
- Editorial product hero with tactile finish/material variant picker
- Interactive quantity adjustment with live Add to Bag action and dynamic cart subtotal
- Real-time multi-currency converter (USD, EUR, GBP)
- Trust guarantees for insured global shipping and 10-year warranty
- Responsive layout with zero broken image states.`;
      case 'fintech':
        return `Build an institutional wealth management and FinTech capital platform in React 19 and Tailwind CSS.
Include:
- Real-time interactive compound yield simulator with principal ($25k–$1M) and horizon sliders
- Three distinct investment strategy tiers with live APY calculation and risk metrics
- Cumulative gain visualizer with tabular numerals and clean financial typography
- Request flow for private placement memorandums and regulatory compliance badges.`;
    }
  };

  const handleCopyPrompt = () => {
    const prompt = getAiPromptForArchetype(selectedArchetype);
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <section id="prototypes" className="py-20 border-b border-neutral-800/80 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span>01. LIVE INTERACTIVE LAB</span>
              <span aria-hidden="true">·</span>
              <span>4 PRODUCTION ARCHETYPES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Test drive real website archetypes right now.
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Every website below is completely functional in the browser: switch between archetypes, test responsive viewports, inspect the production TypeScript code, and grab the AI blueprint.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onCustomizeWithAi(selectedArchetype)}
              className="px-4 py-2.5 bg-white text-neutral-950 font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer shadow-sm flex items-center gap-2 whitespace-nowrap"
            >
              <Sparkles size={14} />
              <span>Customize This In Your Spec</span>
            </button>
          </div>
        </div>

        {/* Archetype Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-xl">
          {ARCHETYPES.map((arch) => (
            <button
              key={arch.id}
              onClick={() => setSelectedArchetype(arch.id)}
              className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap text-center ${
                selectedArchetype === arch.id
                  ? 'bg-neutral-800 text-white shadow-xs font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {arch.name}
            </button>
          ))}
        </div>

        {/* Studio Viewport & Mode Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-2 border-b border-neutral-800/80">
          {/* Main Views (Preview / Code / Prompt) */}
          <div className="flex items-center gap-2 p-1 bg-neutral-900/80 border border-neutral-800 rounded-lg self-start">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'preview' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Live Interactive Website
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'code' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Code2 size={13} />
              <span>Inspect Code</span>
            </button>
            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'prompt' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles size={13} />
              <span>AI Build Prompt</span>
            </button>
          </div>

          {/* Viewport Width Controls (Only active in preview tab) */}
          {activeTab === 'preview' && (
            <div className="flex items-center gap-1 bg-neutral-900/80 border border-neutral-800 rounded-lg p-1 self-end sm:self-auto">
              <button
                onClick={() => setViewport('desktop')}
                title="Desktop 1440px baseline"
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewport === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Laptop size={16} />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                title="Tablet 768px viewport"
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewport === 'tablet' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Tablet size={16} />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                title="Mobile 390px viewport"
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewport === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Workspace Display Area */}
        <div className="min-h-[560px] bg-neutral-950/60 rounded-2xl border border-neutral-800 overflow-hidden flex flex-col items-center">
          {/* Simulated Browser Chrome Top Bar */}
          <div className="w-full bg-neutral-900/90 border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between text-xs text-neutral-400 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 inline-block" />
            </div>

            <div className="bg-neutral-950 border border-neutral-800/80 rounded-md px-4 py-1 text-[11px] font-mono text-neutral-400 max-w-sm truncate text-center">
              https://preview.webcraft.io/{selectedArchetype}
            </div>

            <div className="text-[11px] font-mono text-neutral-500 uppercase">
              {viewport}
            </div>
          </div>

          {/* Active Tab Content */}
          <div className="w-full p-4 sm:p-6 flex justify-center overflow-x-auto">
            {activeTab === 'preview' && (
              <div 
                className={`transition-all duration-300 w-full bg-neutral-950 rounded-xl p-4 sm:p-6 border border-neutral-800/60 ${
                  viewport === 'mobile' 
                    ? 'max-w-[400px] shadow-2xl border-neutral-700' 
                    : viewport === 'tablet' 
                    ? 'max-w-[768px] shadow-xl' 
                    : 'max-w-5xl'
                }`}
              >
                {selectedArchetype === 'saas' && <SaaSPrototype />}
                {selectedArchetype === 'agency' && <AgencyPrototype />}
                {selectedArchetype === 'ecommerce' && <EcommercePrototype />}
                {selectedArchetype === 'fintech' && <FintechPrototype />}
              </div>
            )}

            {activeTab === 'code' && (
              <div className="w-full max-w-4xl space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-neutral-400">src/components/{selectedArchetype.toUpperCase()}Showcase.tsx</span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md text-xs font-medium transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedCode ? 'Copied to Clipboard' : 'Copy Component Code'}</span>
                  </button>
                </div>
                <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-xl overflow-x-auto font-mono text-xs leading-relaxed text-neutral-300">
                  <pre>{SAMPLE_CODE_SNIPPETS[selectedArchetype]}</pre>
                </div>
              </div>
            )}

            {activeTab === 'prompt' && (
              <div className="w-full max-w-3xl space-y-4 py-4">
                <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white">AI Builder Prompt Formula</h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Copy this prompt directly into AI Studio to create a bespoke version of this archetype for your exact company.
                      </p>
                    </div>
                    <button
                      onClick={handleCopyPrompt}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-neutral-950 hover:bg-neutral-200 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                    >
                      {copiedPrompt ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
                    </button>
                  </div>

                  <div className="p-4 bg-neutral-950 border border-neutral-800/80 rounded-lg font-mono text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed">
                    {getAiPromptForArchetype(selectedArchetype)}
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs text-neutral-500">
                    <span>Follows zero-pill typography and WCAG AA accessibility constitution.</span>
                    <button
                      onClick={() => onCustomizeWithAi(selectedArchetype)}
                      className="text-blue-400 hover:underline font-medium cursor-pointer"
                    >
                      Open in Interactive Spec Generator →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
