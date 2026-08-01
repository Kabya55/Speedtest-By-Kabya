'use client';

import React from 'react';
import { TestServer } from '../lib/types';
import { Server } from 'lucide-react';

interface ServerCardProps {
  selectedServer: TestServer;
  onChangeServerClick: () => void;
  disabled?: boolean;
}

export const ServerCard: React.FC<ServerCardProps> = ({
  selectedServer,
  onChangeServerClick,
  disabled = false,
}) => {
  // Extract Sponsor Name and City Name cleanly
  const sponsorName = selectedServer.isAuto ? 'Auto-Detect' : selectedServer.name;
  const cityName = selectedServer.isAuto ? 'Closest Server' : selectedServer.location.split(',')[0].trim();

  return (
    <div className="flex items-center gap-3.5 select-none">
      {/* Circular Server Icon Badge */}
      <div className="w-12 h-12 rounded-full border border-gray-600/50 bg-[#160a38] flex items-center justify-center text-gray-300 shadow-md shrink-0">
        <Server className="w-6 h-6 stroke-[1.75]" />
      </div>

      {/* Server Info Details */}
      <div className="text-left leading-tight overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-[#f1f0f7] font-bold text-lg sm:text-xl truncate tracking-tight">
            {sponsorName}
          </span>
          <span className="text-base shrink-0">{selectedServer.flag}</span>
        </div>
        <p className="text-sm text-[#a296cb] font-medium truncate mt-0.5">
          {cityName}
        </p>

        {/* Change Server Blue Link matching Speedtest.net */}
        <button
          type="button"
          disabled={disabled}
          onClick={onChangeServerClick}
          className="text-[#00a2ff] hover:text-[#33b5ff] font-semibold text-xs transition-colors hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-1 block"
        >
          Change Server
        </button>
      </div>
    </div>
  );
};
