import React, { useState } from 'react';
import { ArrowUpRight, X, Check, Eye } from 'lucide-react';

export function AgencyPrototype() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'arch' | 'industrial' | 'brand'>('all');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryText, setInquiryText] = useState('');

  const projects = [
    {
      id: 'p1',
      title: 'Aether Acoustic Pavilion',
      category: 'arch',
      catName: 'Architecture',
      client: 'Oslo Philharmonic',
      year: '2026',
      metric: '+48% Acoustic Dispersion',
      description: 'A 450-seat timber canopy engineered with algorithmic sound baffles and continuous curved lamination for acoustic perfection.',
      specs: ['Norway', 'Mass Timber', '1,800 sqm']
    },
    {
      id: 'p2',
      title: 'Verve Autonomous Research Vessel',
      category: 'industrial',
      catName: 'Industrial Design',
      client: 'Nordic Oceanographic',
      year: '2025',
      metric: 'Zero Carbon Footprint',
      description: 'Unmanned composite trimaran powered by solar-wind hybrid propulsion for Arctic ice shelf sensor deployment.',
      specs: ['Carbon Fiber', 'Hydrogen Hybrid', '24-knot Range']
    },
    {
      id: 'p3',
      title: 'Kroma Unified Design System',
      category: 'brand',
      catName: 'Brand Systems',
      client: 'Basel Financial Group',
      year: '2026',
      metric: '18 Global Sub-brands',
      description: 'Comprehensive digital identity, custom display typeface, and multi-platform component architecture across European banking divisions.',
      specs: ['Switzerland', 'Typography', 'Full Token System']
    },
    {
      id: 'p4',
      title: 'Solarium Monolith Residence',
      category: 'arch',
      catName: 'Architecture',
      client: 'Private Foundation',
      year: '2025',
      metric: 'Net-Zero Passive Standard',
      description: 'Cast-in-place board-formed concrete pavilion oriented toward the solstice path with geothermal radiant heating.',
      specs: ['Kyoto, Japan', 'Rammed Earth', '720 sqm']
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (inquiryText.trim()) {
      setInquirySubmitted(true);
    }
  };

  return (
    <div className="w-full text-neutral-100 font-sans space-y-12 pb-8">
      {/* Studio Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
        <div>
          <span className="font-bold text-sm tracking-tight text-white uppercase">Vanguard Atelier</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-neutral-400 font-mono">
          <span>PARIS</span>
          <span>·</span>
          <span>ZURICH</span>
          <span>·</span>
          <span>TOKYO</span>
        </div>
      </div>

      {/* Editorial Headline */}
      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center gap-2 text-xs text-rose-400 font-mono">
          <span>SELECTED COMMISSIONED WORKS</span>
          <span aria-hidden="true">·</span>
          <span>2024–2026</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-white leading-tight">
          We shape tactile spatial artifacts and digital architectures for forward institutions.
        </h2>
        <p className="text-sm text-neutral-400 leading-relaxed max-w-xl">
          Operating at the intersection of algorithmic structural engineering, generative typography, and physical materials.
        </p>
      </div>

      {/* Filter Tabs & Gallery */}
      <div className="space-y-6 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-3">
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Works' },
              { id: 'arch', label: 'Architecture' },
              { id: 'industrial', label: 'Industrial Design' },
              { id: 'brand', label: 'Brand Systems' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  activeFilter === tab.id
                    ? 'bg-neutral-100 text-neutral-950 font-semibold'
                    : 'text-neutral-400 hover:text-white bg-neutral-900/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-neutral-500 font-mono tabular-nums">
            Showing {filteredProjects.length} of {projects.length} Works
          </span>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer p-5 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all space-y-4"
            >
              {/* Graphic Placeholder Slate */}
              <div className="aspect-16/9 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 rounded-lg flex items-center justify-center p-6 border border-neutral-800/80 group-hover:border-rose-500/30 transition-colors relative overflow-hidden">
                <div className="text-center space-y-1">
                  <span className="text-rose-400 text-xs font-mono">{project.catName}</span>
                  <div className="text-lg font-bold text-white tracking-tight">{project.title}</div>
                </div>
                <div className="absolute top-3 right-3 p-1.5 bg-neutral-950/80 rounded text-neutral-400 group-hover:text-white transition-colors">
                  <ArrowUpRight size={14} />
                </div>
              </div>

              {/* Card Meta */}
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-sm font-semibold text-white group-hover:text-rose-300 transition-colors">
                    {project.title}
                  </h4>
                  <span className="text-xs text-neutral-400 font-mono">{project.year}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span>{project.client}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-neutral-300 font-medium">{project.metric}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-neutral-900 border border-neutral-700 rounded-xl p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded"
              aria-label="Close project modal"
            >
              <X size={18} />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-mono text-rose-400">{selectedProject.catName} · {selectedProject.year}</span>
              <h3 className="text-2xl font-bold text-white">{selectedProject.title}</h3>
              <div className="text-xs text-neutral-400">Client: {selectedProject.client}</div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed">
              {selectedProject.description}
            </p>

            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Engineering Specs</span>
              <div className="flex flex-wrap gap-2">
                {selectedProject.specs.map((s: string, idx: number) => (
                  <span key={idx} className="text-xs font-mono text-neutral-300 bg-neutral-800/80 px-2 py-1 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-neutral-800">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium"
              >
                Close Case Study
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Discovery Form */}
      <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4">
        <h3 className="text-base font-bold text-white">02. Commission an Architectural or Digital Brief</h3>
        <p className="text-xs text-neutral-400">We accept 4 strategic commissions each quarter. Inquire with your project scope.</p>

        {inquirySubmitted ? (
          <div className="p-4 bg-rose-950/30 border border-rose-800/50 rounded-lg text-xs text-rose-300 flex items-center gap-2">
            <Check size={16} className="text-rose-400 shrink-0" />
            <span>Brief received. Our partner team will respond within 24 business hours.</span>
          </div>
        ) : (
          <form onSubmit={handleInquiry} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              required
              placeholder="Outline project scope (e.g. 500-seat civic auditorium, brand system)"
              value={inquiryText}
              onChange={(e) => setInquiryText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-white hover:bg-neutral-200 text-neutral-950 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
            >
              Submit Commission Brief
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
