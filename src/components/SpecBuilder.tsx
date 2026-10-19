import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  Database, 
  ShieldCheck, 
  FileCode, 
  ArrowRight,
  Send
} from 'lucide-react';

interface SpecBuilderProps {
  initialArchetype?: string;
}

export function SpecBuilder({ initialArchetype }: SpecBuilderProps) {
  const [projectType, setProjectType] = useState(
    initialArchetype === 'saas' 
      ? 'SaaS Platform' 
      : initialArchetype === 'agency' 
      ? 'Agency / Portfolio' 
      : initialArchetype === 'ecommerce' 
      ? 'E-Commerce Store' 
      : initialArchetype === 'fintech' 
      ? 'FinTech / Advisory' 
      : 'SaaS Platform'
  );

  const [industry, setIndustry] = useState('Artificial Intelligence & Tech');
  const [aesthetic, setAesthetic] = useState('Titanium Obsidian Dark');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Responsive Mobile Layout',
    'Interactive Data Visualizations',
    'Clean Lead Capture'
  ]);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  
  const [submitted, setSubmitted] = useState(false);
  const [copiedSpec, setCopiedSpec] = useState(false);

  const projectTypes = [
    'SaaS Platform',
    'High-Conversion Landing Page',
    'Agency / Portfolio',
    'E-Commerce Store',
    'FinTech / Advisory',
    'Analytics Dashboard'
  ];

  const industries = [
    'Artificial Intelligence & Tech',
    'Architecture & Industrial Design',
    'Finance & Capital Markets',
    'Bespoke Retail & Fashion',
    'Healthcare & BioTech',
    'Developer Tools & APIs'
  ];

  const aesthetics = [
    'Titanium Obsidian Dark',
    'Clean Swiss Minimalist (Light)',
    'Warm Architectural Travertine',
    'High-Contrast Monolith'
  ];

  const availableFeatures = [
    'Responsive Mobile Layout',
    'Interactive Data Visualizations',
    'Clean Lead Capture',
    'Dynamic Pricing / ROI Calculator',
    'Multi-Currency & Checkout Flow',
    'Real-Time Filterable Data Tables',
    'Zero-Pill Typographic Hierarchy',
    'WCAG AA Contrast Guarantee'
  ];

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const generatedPrompt = `Build a complete, production-grade website for "${clientName || 'My Next Venture'}" in ${industry}.

Category: ${projectType}
Aesthetic Direction: ${aesthetic}
Key Features Required:
${selectedFeatures.map(f => `- ${f}`).join('\n')}
${projectNotes ? `Specific Requirements: ${projectNotes}\n` : ''}
Engineering Requirements:
- Strictly React 19, TypeScript, and Tailwind CSS v4.
- Follow the universal frontend design constitution: 3-zone top bar contract, zero-pill metadata, no fake comment slashes, and no dead clicks.
- Include working interactive states and robust device responsiveness.`;

  const handleCopySpec = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientEmail.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section id="inquiry" className="py-20 bg-neutral-950 border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Section Header */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>03. CUSTOM WEB SPEC GENERATOR</span>
            <span aria-hidden="true">·</span>
            <span>SPECIFY & LAUNCH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            What website would you like me to build?
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Select your industry, requirements, and design preferences. You will immediately receive a complete architectural specification and ready-to-use prompt that you can ask me to build right now in this chat.
          </p>
        </div>

        {/* 2-Column Split: Form + Live Dynamic Blueprint */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Interactive Spec Form (7 Cols) */}
          <div className="lg:col-span-7 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white">Project Parameters</h3>

            <div className="space-y-4">
              {/* Project Type */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-300">Website Archetype</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {projectTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setProjectType(type)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors cursor-pointer ${
                        projectType === type
                          ? 'bg-neutral-800 border-neutral-600 text-white shadow-xs'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-300">Domain & Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-neutral-600"
                >
                  {industries.map(ind => (
                    <option key={ind} value={ind} className="bg-neutral-900 text-white">
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Aesthetic Style */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-300">Visual Aesthetic Direction</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {aesthetics.map(aes => (
                    <button
                      key={aes}
                      type="button"
                      onClick={() => setAesthetic(aes)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors cursor-pointer ${
                        aesthetic === aes
                          ? 'bg-neutral-800 border-neutral-600 text-white shadow-xs'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {aes}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-300">Architectural Features</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableFeatures.map(feat => {
                    const isChecked = selectedFeatures.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => toggleFeature(feat)}
                        className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg border transition-colors text-left cursor-pointer ${
                          isChecked
                            ? 'bg-neutral-800/80 border-blue-500/50 text-white'
                            : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                          isChecked ? 'bg-blue-600 border-blue-500 text-white' : 'border-neutral-700'
                        }`}>
                          {isChecked && <Check size={10} />}
                        </div>
                        <span className="truncate">{feat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submission Details */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-neutral-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-400">Project / Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Autonomous"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-400">Contact Email</label>
                    <input
                      type="email"
                      required
                      placeholder="founder@company.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Custom Scope Notes (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Describe specific workflow, target conversion goal, or third-party integrations..."
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
                  />
                </div>

                {submitted ? (
                  <div className="p-4 bg-emerald-950/30 border border-emerald-800/60 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                      <ShieldCheck size={16} />
                      <span>Blueprint registered for {clientEmail}!</span>
                    </div>
                    <p className="text-xs text-neutral-300">
                      Your technical specification is ready. You can copy the generated prompt from the right column and instruct me to build this exact system right now.
                    </p>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3 bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
                  >
                    <Send size={14} />
                    <span>Generate & Register Web Architecture Blueprint</span>
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Column 2: Live Generated Architecture Blueprint (5 Cols) */}
          <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-mono text-neutral-400">ARCHITECTURAL SPECIFICATION</span>
                <h4 className="text-base font-bold text-white">Live System Blueprint</h4>
              </div>
              <button
                onClick={handleCopySpec}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                {copiedSpec ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedSpec ? 'Copied' : 'Copy Prompt'}</span>
              </button>
            </div>

            {/* Structured Spec Breakdown */}
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80 space-y-1">
                <span className="text-neutral-500 font-mono text-[11px]">TARGET ARCHITECTURE</span>
                <div className="font-semibold text-white">{projectType} · {industry}</div>
                <div className="text-neutral-400 text-[11px]">Design: {aesthetic}</div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80 space-y-2">
                <span className="text-neutral-500 font-mono text-[11px]">PROJECTED COMPONENT MANIFEST</span>
                <ul className="space-y-1 text-neutral-300 font-mono text-[11px]">
                  <li>├── src/components/Header.tsx (3-Zone Top Bar)</li>
                  <li>├── src/components/Hero.tsx (Value Prop & CTAs)</li>
                  <li>├── src/components/FeatureBento.tsx (Pillars)</li>
                  {selectedFeatures.includes('Dynamic Pricing / ROI Calculator') && (
                    <li>├── src/components/Calculator.tsx (Compounding Math)</li>
                  )}
                  {selectedFeatures.includes('Multi-Currency & Checkout Flow') && (
                    <li>├── src/components/CartDrawer.tsx (State Machine)</li>
                  )}
                  {selectedFeatures.includes('Real-Time Filterable Data Tables') && (
                    <li>├── src/components/DataTable.tsx (Multi-Filter)</li>
                  )}
                  <li>├── src/components/LeadCapture.tsx (Validated Form)</li>
                  <li>└── src/components/Footer.tsx (Quiet Legal & Mirror)</li>
                </ul>
              </div>

              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/80 space-y-1">
                <span className="text-neutral-500 font-mono text-[11px]">READY-TO-USE BUILD PROMPT</span>
                <pre className="text-neutral-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {generatedPrompt}
                </pre>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
              <span>Ready for immediate execution</span>
              <button
                onClick={handleCopySpec}
                className="text-white hover:underline font-semibold cursor-pointer"
              >
                Copy Prompt & Tell Me to Build It →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
