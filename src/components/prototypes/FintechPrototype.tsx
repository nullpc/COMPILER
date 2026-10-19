import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, Lock, Landmark, Info, ArrowUpRight } from 'lucide-react';

export function FintechPrototype() {
  const [capital, setCapital] = useState(250000);
  const [horizonYears, setHorizonYears] = useState(3);
  const [strategy, setStrategy] = useState<'conservative' | 'balanced' | 'growth'>('balanced');
  const [requestedProspectus, setRequestedProspectus] = useState(false);

  const rates = {
    conservative: { apy: 0.058, label: 'Capital Preservation Note', risk: 'Low Volatility' },
    balanced: { apy: 0.084, label: 'Global Arbitrage & Real Yield', risk: 'Target Market Neutral' },
    growth: { apy: 0.122, label: 'Strategic Tech Opportunities', risk: 'Direct Equity Allocation' }
  };

  const currentRate = rates[strategy].apy;
  // Compound interest calculation: A = P * (1 + r)^t
  const futureValue = Math.round(capital * Math.pow(1 + currentRate, horizonYears));
  const totalReturn = futureValue - capital;
  const annualCashflow = Math.round(capital * currentRate);

  return (
    <div className="w-full text-neutral-100 font-sans space-y-10 pb-8">
      {/* FinTech Mini Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2">
          <Landmark size={18} className="text-emerald-400" />
          <span className="font-bold text-sm tracking-tight text-white">Vanguard Capital Advisory</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <Lock size={12} />
            <span>SEC REGISTERED RIA</span>
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">CUSTODIAL PARTNER: BNY MELLON</span>
        </div>
      </div>

      {/* Main Yield Simulation Engine */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="text-xs font-mono text-emerald-400">INTERACTIVE CAPITAL MODELER</div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Compound Yield & Portfolio Projection</h3>
          </div>
          <div className="text-xs text-neutral-400 font-mono">
            Model audited as of Q4 2026
          </div>
        </div>

        {/* Strategy Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['conservative', 'balanced', 'growth'] as const).map((stratKey) => {
            const strat = rates[stratKey];
            const isSelected = strategy === stratKey;
            return (
              <button
                key={stratKey}
                onClick={() => setStrategy(stratKey)}
                className={`p-3.5 text-left rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/20 text-white shadow-sm'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">{strat.label}</span>
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">
                    {(strat.apy * 100).toFixed(1)}% APY
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">{strat.risk}</div>
              </button>
            );
          })}
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-neutral-900/60 border border-neutral-800 rounded-xl">
          {/* Capital Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-400">Committed Portfolio Principal</span>
              <span className="font-mono font-bold text-base text-white tabular-nums">
                ${capital.toLocaleString()} USD
              </span>
            </div>
            <input
              type="range"
              min="25000"
              max="1000000"
              step="25000"
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-neutral-800 rounded h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-neutral-500">
              <span>$25k (Min)</span>
              <span>$500k</span>
              <span>$1.0M+</span>
            </div>
          </div>

          {/* Horizon Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-400">Investment Horizon</span>
              <span className="font-mono font-bold text-base text-white tabular-nums">
                {horizonYears} {horizonYears === 1 ? 'Year' : 'Years'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={horizonYears}
              onChange={(e) => setHorizonYears(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-neutral-800 rounded h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-neutral-500">
              <span>1 Year</span>
              <span>5 Years</span>
              <span>10 Years</span>
            </div>
          </div>
        </div>

        {/* Results Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-1">
            <span className="text-xs text-neutral-400">Total Projected Capital</span>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              ${futureValue.toLocaleString()}
            </div>
            <p className="text-[11px] text-neutral-500">Principal + {horizonYears}y reinvestment</p>
          </div>

          <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-1">
            <span className="text-xs text-emerald-400">Cumulative Net Profit</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              +${totalReturn.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-500/80">
              +{( (totalReturn / capital) * 100 ).toFixed(1)}% cumulative gain
            </p>
          </div>

          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-1">
            <span className="text-xs text-neutral-400">Est. Year 1 Yield</span>
            <div className="text-2xl font-bold font-mono text-neutral-200 tabular-nums">
              ${annualCashflow.toLocaleString()}
            </div>
            <p className="text-[11px] text-neutral-500">Distributed quarterly or compounded</p>
          </div>
        </div>

        {/* Institutional Action Form */}
        <div className="p-5 bg-neutral-900/80 border border-neutral-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-semibold text-white">Receive Private Placement Memorandum & Audit Data</h4>
            <p className="text-xs text-neutral-400">Detailed historical attribution, fee waterfalls, and risk parameters.</p>
          </div>

          {requestedProspectus ? (
            <div className="text-xs font-medium text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 px-3 py-2 rounded-lg border border-emerald-800/40">
              <ShieldCheck size={16} />
              <span>Offering prospectus dispatched to institutional registry.</span>
            </div>
          ) : (
            <button
              onClick={() => setRequestedProspectus(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold text-xs rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Request Institutional Memorandum</span>
              <ArrowUpRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
