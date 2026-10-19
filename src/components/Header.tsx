import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onStartBuilding: () => void;
}

export function Header({ onStartBuilding }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Live Prototypes', href: '#prototypes' },
    { label: 'Architectures', href: '#architectures' },
    { label: 'Tech Stack', href: '#stack' },
    { label: 'Build Inquiry', href: '#inquiry' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="/" 
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-neutral-200 transition-colors"
        >
          WebCraft Studio
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-400">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={onStartBuilding}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white rounded-lg hover:bg-neutral-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            Start Building Now
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-neutral-950 px-6 py-4 space-y-3">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-neutral-300 hover:text-white py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartBuilding();
              }}
              className="w-full py-2.5 text-xs font-semibold text-neutral-950 bg-white rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer text-center"
            >
              Start Building Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
