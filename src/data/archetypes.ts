import { Archetype } from '../types';

export const ARCHETYPES: Archetype[] = [
  {
    id: 'saas',
    name: 'SaaS & Cloud Platform',
    tagline: 'High-conversion product landing with live metrics & pricing tiers',
    description: 'Designed for enterprise tech, API platforms, and developer tooling with interactive feature demonstrations, real-time metrics, and dynamic billing models.',
    industry: 'Enterprise Software / Developer Tools',
    typicalStack: ['React 19', 'Tailwind CSS v4', 'TypeScript', 'Node.js Express', 'PostgreSQL / Firestore'],
    features: ['Dynamic Billing Toggle', 'Filterable Live Cluster Table', 'Throughput Telemetry', 'Direct Sign-up Flow'],
    colorPalette: {
      name: 'Titanium Obsidian',
      bg: '#090a0f',
      card: '#12141c',
      accent: '#3b82f6'
    }
  },
  {
    id: 'agency',
    name: 'Creative Agency & Studio',
    tagline: 'Editorial portfolio with curated case studies & project filters',
    description: 'Crafted for design practices, architecture studios, and brand agencies emphasizing generous typography, full-bleed imagery, and interactive case studies.',
    industry: 'Brand Architecture / Industrial Design',
    typicalStack: ['React 19', 'Motion', 'Tailwind CSS v4', 'Responsive Grid Engine'],
    features: ['Category Filter Tabs', 'Interactive Project Modal', 'Client Outcomes Proof', 'Discovery Inquiry Form'],
    colorPalette: {
      name: 'Monochrome Editorial',
      bg: '#0c0c0d',
      card: '#161618',
      accent: '#f43f5e'
    }
  },
  {
    id: 'ecommerce',
    name: 'Bespoke Retail Boutique',
    tagline: 'Minimalist high-ticket commerce with live cart & variant selector',
    description: 'Engineered for luxury goods, designer hardware, and artisan lifestyle goods featuring tactile variant picking, responsive cart tally, and frictionless checkout.',
    industry: 'High-End Retail / Direct-to-Consumer',
    typicalStack: ['React 19', 'Stripe Integration Ready', 'Tailwind CSS v4', 'Cart State Machine'],
    features: ['Variant Color & Material Picker', 'Interactive Mini-Cart Drawer', 'Stock Level Precision', 'Currency Converter'],
    colorPalette: {
      name: 'Warm Travertine',
      bg: '#141312',
      card: '#1f1d1a',
      accent: '#d97706'
    }
  },
  {
    id: 'fintech',
    name: 'FinTech & Capital Advisory',
    tagline: 'Institutional precision with live compound yield calculator',
    description: 'Built for wealth management, venture funds, and financial analytics with real-time portfolio forecasting, interactive sliders, and compliance disclosures.',
    industry: 'Financial Technology / Capital Markets',
    typicalStack: ['React 19', 'Tabular Numerals', 'Tailwind CSS v4', 'Compounding Math Engine'],
    features: ['Real-Time ROI Slider', 'Dynamic Compounding Forecast', 'Allocation Visualizer', 'Audited Security Protocols'],
    colorPalette: {
      name: 'Emerald Reserve',
      bg: '#080e0c',
      card: '#0f1a16',
      accent: '#10b981'
    }
  }
];

export const SAMPLE_CODE_SNIPPETS: Record<string, string> = {
  saas: `// Modern Production SaaS Hero & Pricing Component
import React, { useState } from 'react';
import { Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export function CloudSaaSView() {
  const [annual, setAnnual] = useState(true);
  const [filter, setFilter] = useState<'all' | 'edge' | 'db'>('all');

  return (
    <div className="w-full bg-[#090a0f] text-neutral-100 p-8 rounded-xl border border-neutral-800">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Editorial Value Prop */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Distributed Edge Cloud</span>
            <span aria-hidden="true">·</span>
            <span>99.999% SLA</span>
            <span aria-hidden="true">·</span>
            <span>Zero Cold Starts</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            High-throughput infrastructure for mission-critical software.
          </h2>
          <p className="text-neutral-400 max-w-2xl text-sm leading-relaxed">
            Deploy full-stack services across 42 global regions with automated SSL, 
            zero-configuration failover, and millisecond cold starts.
          </p>
        </div>

        {/* Dynamic Billing Toggle */}
        <div className="flex items-center gap-3 p-1.5 bg-neutral-900 border border-neutral-800 rounded-lg w-fit">
          <button 
            onClick={() => setAnnual(false)}
            className={\`px-3 py-1.5 text-xs font-medium rounded-md transition-colors \${
              !annual ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }\`}
          >
            Monthly Billing
          </button>
          <button 
            onClick={() => setAnnual(true)}
            className={\`px-3 py-1.5 text-xs font-medium rounded-md transition-colors \${
              annual ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }\`}
          >
            Annual (Save 20%)
          </button>
        </div>
      </div>
    </div>
  );
}`,
  agency: `// Architectural Studio Portfolio Showcase
import React, { useState } from 'react';
import { ArrowUpRight, Grid, Layers } from 'lucide-react';

export function StudioPortfolioView() {
  const [activeCategory, setActiveCategory] = useState('all');

  const projects = [
    { id: '1', title: 'Aether Acoustic Pavilion', client: 'Oslo Philharmonic', year: '2026', cat: 'arch' },
    { id: '2', title: 'Verve Autonomous Vessel', client: 'Nordic Marine', year: '2025', cat: 'industrial' },
    { id: '3', title: 'Kroma Brand Identity', client: 'Basel Fintech Group', year: '2026', cat: 'brand' },
  ];

  return (
    <section className="bg-[#0c0c0d] text-neutral-100 p-8 rounded-xl border border-neutral-800">
      <div className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-neutral-800 pb-4">
          <h2 className="text-2xl font-bold tracking-tight">01. Selected Works</h2>
          <span className="text-xs text-neutral-400 font-mono">14 Completed Projects / 2024–2026</span>
        </div>
        {/* Interactive Filter Controls */}
        <div className="flex gap-2">
          {['all', 'arch', 'industrial', 'brand'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={\`px-3 py-1 text-xs font-medium rounded capitalize \${
                activeCategory === cat ? 'bg-neutral-100 text-neutral-900' : 'bg-neutral-900 text-neutral-400'
              }\`}
            >
              {cat === 'all' ? 'All Works' : cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}`,
  ecommerce: `// Minimalist Luxury Commerce Component
import React, { useState } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export function LuxuryBoutiqueView() {
  const [selectedFinish, setSelectedFinish] = useState('Obsidian Brass');
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="bg-[#141312] text-neutral-100 p-8 rounded-xl border border-neutral-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="aspect-square bg-neutral-900 rounded-lg flex items-center justify-center p-6 border border-neutral-800">
          <div className="text-center space-y-2">
            <span className="text-amber-500 font-mono text-xs">COLLECTION N° 04</span>
            <h4 className="text-lg font-medium text-white">Atelier Monolith Desk Light</h4>
          </div>
        </div>
        <div className="space-y-4">
          <div className="text-2xl font-semibold font-mono tabular-nums text-white">$480.00 USD</div>
          <button 
            onClick={() => setCartCount(c => c + 1)}
            className="w-full py-3 bg-white text-neutral-950 font-medium text-sm rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Add to Bag ({cartCount} Items)
          </button>
        </div>
      </div>
    </div>
  );
}`,
  fintech: `// Capital Allocation & Yield Forecast
import React, { useState } from 'react';
import { TrendingUp, ShieldCheck } from 'lucide-react';

export function CapitalYieldForecast() {
  const [capital, setCapital] = useState(250000);
  const apy = 0.084;
  const projectedReturn = Math.round(capital * apy);

  return (
    <div className="bg-[#080e0c] text-neutral-100 p-8 rounded-xl border border-neutral-800">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">01. Yield Simulation Engine</h3>
          <span className="text-emerald-400 font-mono text-xs tabular-nums">8.4% Net Target APY</span>
        </div>
        <input 
          type="range" 
          min="50000" 
          max="1000000" 
          step="25000" 
          value={capital}
          onChange={(e) => setCapital(Number(e.target.value))}
          className="w-full accent-emerald-500 bg-neutral-800 rounded h-2 cursor-pointer"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-neutral-900/80 rounded-lg border border-neutral-800">
            <span className="text-xs text-neutral-400">Committed Capital</span>
            <div className="text-xl font-bold font-mono tabular-nums text-white mt-1">
              \${capital.toLocaleString()} USD
            </div>
          </div>
          <div className="p-4 bg-emerald-950/30 rounded-lg border border-emerald-900/40">
            <span className="text-xs text-emerald-400">12-Month Projected Yield</span>
            <div className="text-xl font-bold font-mono tabular-nums text-emerald-300 mt-1">
              +\${projectedReturn.toLocaleString()} USD
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`
};
