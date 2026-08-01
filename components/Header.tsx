'use client';

import React from 'react';

interface HeaderProps {
  onStartClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartClick }) => {
  return (
    <header className="w-full bg-white border-b border-gray-200/80 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-1 cursor-pointer select-none"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="text-xl sm:text-2xl font-black tracking-widest text-[#1e1735]">
            NETSPEED
          </span>
        </div>

        {/* Action Right */}
        <div className="flex items-center gap-5">
          <span className="hidden sm:inline-block text-xs font-semibold text-gray-500 tracking-wide">
            For Fast & Free Speed Tests
          </span>
          <button
            onClick={onStartClick}
            className="px-5 py-2.5 rounded-lg font-black text-[11px] text-white bg-gradient-to-r from-[#ff5500] to-[#ee3600] hover:from-[#ff6611] hover:to-[#f04411] shadow-md shadow-orange-500/30 active:scale-95 transition-all uppercase tracking-wider"
          >
            START NOW
          </button>
        </div>
      </div>
    </header>
  );
};
