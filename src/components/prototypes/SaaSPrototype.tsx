import React, { useState } from 'react';
import { Check, ArrowRight, ShieldCheck, Zap, Globe, Server, Activity, Search } from 'lucide-react';

interface SaaSPrototypeProps {
  theme?: string;
}

export function SaaSPrototype({ theme = 'obsidian' }: SaaSPrototypeProps) {
  const [annualBilling, setAnnualBilling] = useState(true);
  const [regionFilter, setRegionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedWaitlist, setJoinedWaitlist] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const clusters = [
    { id: 'iad-01', region: 'us-east', name: 'US East (N. Virginia)', status: 'Optimal', latency: '12ms', uptime: '100%' },
    { id: 'fra-01', region: 'eu-west', name: 'Europe (Frankfurt)', status: 'Optimal', latency: '18ms', uptime: '99.99%' },
    { id: 'sin-01', region: 'ap-east', name: 'Asia Pacific (Singapore)', status: 'Optimal', latency: '24ms', uptime: '100%' },
    { id: 'syd-01', region: 'ap-east', name: 'Australia (Sydney)', status: 'Optimal', latency: '32ms', uptime: '99.98%' },
    { id: 'lon-01', region: 'eu-west', name: 'UK (London St. Pauls)', status: 'Optimal', latency: '15ms', uptime: '100%' },
  ];

  const filteredClusters = clusters.filter(c => {
    const matchesRegion = regionFilter === 'all' || c.region === regionFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setJoinedWaitlist(true);
    }
  };

  return (
    <div className="w-full text-neutral-100 font-sans space-y-12 pb-8">
      {/* Mini Mock Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">A</div>
          <span className="font-bold text-sm tracking-tight text-white">Aether Cloud</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-neutral-400">
          <span className="hover:text-white transition-colors cursor-pointer hidden sm:inline">Network</span>
          <span className="hover:text-white transition-colors cursor-pointer hidden sm:inline">Benchmarking</span>
          <span className="hover:text-white transition-colors cursor-pointer">Documentation</span>
          <button className="px-3 py-1 bg-white text-neutral-950 rounded text-xs font-semibold hover:bg-neutral-200 transition-colors">
            Deploy Now
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center gap-2 text-xs text-blue-400 font-mono">
          <span>EDGE RUNTIME V2.4</span>
          <span aria-hidden="true">·</span>
          <span>SUB-5MS COLD START</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white text-balance leading-tight">
          Next-generation distributed runtime for mission-critical software.
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
          Spin up isolated sandboxes globally in 80 milliseconds. Native TypeScript support, automated TLS termination, and verifiable zero-trust isolation.
        </p>

        {/* Lead Capture */}
        <form onSubmit={handleWaitlist} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md">
          {joinedWaitlist ? (
            <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-lg text-xs text-blue-300 flex items-center gap-2">
              <Check size={16} className="text-blue-400" />
              <span>Workspace provisioned! Check your inbox for the developer token.</span>
            </div>
          ) : (
            <>
              <input
                type="email"
                required
                placeholder="developer@company.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
              >
                Request Access
              </button>
            </>
          )}
        </form>
      </div>

      {/* Interactive Pricing Toggle & Tier Display */}
      <div className="space-y-6 pt-4 border-t border-neutral-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Transparent Computation Pricing</h3>
            <p className="text-xs text-neutral-400">Scale dynamically with exact per-millisecond billing.</p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-neutral-900 border border-neutral-800 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                !annualBilling ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                annualBilling ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Annual (-20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Developer Tier */}
          <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4">
            <div>
              <div className="text-xs font-mono text-neutral-400">STARTER</div>
              <h4 className="text-base font-bold text-white mt-1">Developer Node</h4>
              <p className="text-xs text-neutral-400 mt-1">For independent engineers and rapid prototypes.</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                ${annualBilling ? '29' : '36'}
              </span>
              <span className="text-xs text-neutral-500">/mo</span>
            </div>
            <ul className="text-xs space-y-2 text-neutral-300">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-blue-400 shrink-0" />
                <span>10 Global Edge Locations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-blue-400 shrink-0" />
                <span>100k Monthly Executions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-blue-400 shrink-0" />
                <span>Community SLA</span>
              </li>
            </ul>
            <button className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium transition-colors">
              Deploy Free Tier
            </button>
          </div>

          {/* Scale Tier (Featured) */}
          <div className="p-5 bg-blue-950/20 border-2 border-blue-600/60 rounded-xl space-y-4 relative">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-mono text-blue-400">MOST POPULAR</div>
                <h4 className="text-base font-bold text-white mt-1">Production Cluster</h4>
                <p className="text-xs text-neutral-300 mt-1">For scale-ups and high-volume workloads.</p>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                ${annualBilling ? '119' : '149'}
              </span>
              <span className="text-xs text-neutral-400">/mo</span>
            </div>
            <ul className="text-xs space-y-2 text-neutral-200">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-blue-400 shrink-0" />
                <span>All 42 Global Regions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-blue-400 shrink-0" />
                <span>Unlimited Sandboxes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-blue-400 shrink-0" />
                <span>99.99% Guaranteed SLA</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-blue-400 shrink-0" />
                <span>Private VPC Peering</span>
              </li>
            </ul>
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors">
              Launch Production
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4">
            <div>
              <div className="text-xs font-mono text-neutral-400">ENTERPRISE</div>
              <h4 className="text-base font-bold text-white mt-1">Dedicated Bare-Metal</h4>
              <p className="text-xs text-neutral-400 mt-1">Custom isolated silicon and SOC2 compliance.</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                ${annualBilling ? '499' : '599'}
              </span>
              <span className="text-xs text-neutral-500">/mo</span>
            </div>
            <ul className="text-xs space-y-2 text-neutral-300">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-blue-400 shrink-0" />
                <span>Dedicated Hardware Enclaves</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-blue-400 shrink-0" />
                <span>Custom BGP Routing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-blue-400 shrink-0" />
                <span>24/7 Priority Solution Architect</span>
              </li>
            </ul>
            <button className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium transition-colors">
              Contact Enterprise
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Global Mesh Table */}
      <div className="space-y-4 pt-4 border-t border-neutral-800/80">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Live Edge Fleet Telemetry</h3>
            <p className="text-xs text-neutral-400">Live health and latency verification across active POPs.</p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Filter regions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 w-full sm:w-40 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
              {['all', 'us-east', 'eu-west', 'ap-east'].map((region) => (
                <button
                  key={region}
                  onClick={() => setRegionFilter(region)}
                  className={`px-2 py-0.5 text-xs rounded transition-colors ${
                    regionFilter === region ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {region === 'all' ? 'All' : region.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-neutral-800 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900/80 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-2 px-3 font-semibold">Cluster ID</th>
                <th className="py-2 px-3 font-semibold">Location</th>
                <th className="py-2 px-3 font-semibold">Status</th>
                <th className="py-2 px-3 font-semibold">P99 Latency</th>
                <th className="py-2 px-3 font-semibold">30d Uptime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono text-neutral-300">
              {filteredClusters.length > 0 ? (
                filteredClusters.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-2.5 px-3 text-white font-medium">{c.id}</td>
                    <td className="py-2.5 px-3 font-sans text-neutral-300">{c.name}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-emerald-400 font-sans text-xs">{c.status}</span>
                    </td>
                    <td className="py-2.5 px-3 tabular-nums">{c.latency}</td>
                    <td className="py-2.5 px-3 tabular-nums text-neutral-400">{c.uptime}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-neutral-500 font-sans">
                    No matching clusters found for "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
