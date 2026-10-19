import React, { useState } from 'react';
import { ShoppingBag, Check, ShieldCheck, Truck, RotateCcw, Plus, Minus } from 'lucide-react';

export function EcommercePrototype() {
  const [selectedFinish, setSelectedFinish] = useState('Obsidian Brass');
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [showAddedNotice, setShowAddedNotice] = useState(false);

  const basePriceUSD = 480;
  const rates = { USD: 1, EUR: 0.92, GBP: 0.79 };
  const currencySymbols = { USD: '$', EUR: '€', GBP: '£' };

  const currentPrice = Math.round(basePriceUSD * rates[currency]);
  const subtotal = currentPrice * cartCount;

  const finishes = [
    { name: 'Obsidian Brass', color: '#1f1d18', border: '#78716c' },
    { name: 'Brushed Titanium', color: '#71717a', border: '#a1a1aa' },
    { name: 'Smoked Travertine', color: '#3f3f46', border: '#52525b' }
  ];

  const handleAddToCart = () => {
    setCartCount(prev => prev + quantity);
    setShowAddedNotice(true);
    setTimeout(() => setShowAddedNotice(false), 2400);
  };

  return (
    <div className="w-full text-neutral-100 font-sans space-y-10 pb-8">
      {/* Boutique Mini Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2">
          <span className="font-serif tracking-widest text-sm font-semibold uppercase text-amber-100">ATELIER KRONOS</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded px-1.5 py-0.5">
            {(['USD', 'EUR', 'GBP'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-1.5 py-0.5 text-xs rounded ${
                  currency === curr ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-500 hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <div className="relative flex items-center gap-1.5 text-neutral-300 font-medium cursor-pointer">
            <ShoppingBag size={15} />
            <span className="font-mono tabular-nums text-xs">Bag ({cartCount})</span>
          </div>
        </div>
      </div>

      {/* Main Product Showcase Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Product Visual Container */}
        <div className="aspect-square bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 rounded-2xl border border-neutral-800/80 p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-center text-xs text-neutral-400 font-mono">
            <span>EDITION 04 / 500</span>
            <span>HAND-FINISHED</span>
          </div>

          {/* Minimalist Ceramic / Sculptural Graphic representation */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-40 h-40 rounded-full border-4 border-amber-600/30 flex items-center justify-center relative shadow-2xl">
              <div 
                className="w-28 h-28 rounded-full transition-colors duration-300 flex items-center justify-center text-xs font-mono text-neutral-400"
                style={{ backgroundColor: finishes.find(f => f.name === selectedFinish)?.color }}
              >
                <div className="w-12 h-12 rounded-full border border-neutral-700/50" />
              </div>
            </div>
            <span className="mt-4 text-xs font-mono text-neutral-400 uppercase tracking-widest">
              {selectedFinish}
            </span>
          </div>

          <div className="text-center text-xs text-neutral-500">
            Solid monolithic base · Machined precision rotary dimmer · 2700K warm LED
          </div>
        </div>

        {/* Product Selection & Purchase Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono text-amber-500 uppercase tracking-wider">
              LIMITED PRODUCTION N° 04
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-normal text-white">
              The Monolith Acoustic Desk Luminaire
            </h3>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl font-bold font-mono tabular-nums text-white">
                {currencySymbols[currency]}{currentPrice}
              </span>
              <span className="text-xs text-neutral-500 font-mono">{currency}</span>
              <span className="text-xs text-emerald-400 ml-2">In Stock · Ships within 48h</span>
            </div>
          </div>

          {/* Finish Selector */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Material Finish</span>
              <span className="text-white font-medium">{selectedFinish}</span>
            </div>
            <div className="flex gap-2">
              {finishes.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setSelectedFinish(f.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs border transition-all ${
                    selectedFinish === f.name
                      ? 'border-amber-500 bg-neutral-900 text-white'
                      : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: f.color, borderColor: f.border }}
                  />
                  <span>{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-neutral-800 rounded-lg bg-neutral-900 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-neutral-400 hover:text-white rounded"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="px-3 text-xs font-mono font-medium text-white tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 bg-white text-neutral-950 hover:bg-neutral-200 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <ShoppingBag size={14} />
                <span>Add to Shopping Bag · {currencySymbols[currency]}{(currentPrice * quantity)}</span>
              </button>
            </div>

            {/* Notification alert */}
            {showAddedNotice && (
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-400" />
                  <span>Added {quantity}x {selectedFinish} to your bag.</span>
                </span>
                <span className="font-mono font-semibold">Subtotal: {currencySymbols[currency]}{subtotal}</span>
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Truck size={14} className="text-neutral-500 shrink-0" />
              <span>Complimentary Global Express</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-neutral-500 shrink-0" />
              <span>10-Year Monolith Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw size={14} className="text-neutral-500 shrink-0" />
              <span>30-Day Curated Return Window</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
