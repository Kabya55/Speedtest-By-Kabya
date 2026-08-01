'use client';

import React, { useState, useMemo } from 'react';
import { SERVERS } from '../lib/servers';
import { TestServer } from '../lib/types';
import { Search, X, Check, Globe, MapPin, Zap } from 'lucide-react';

interface ServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServer: TestServer;
  onSelectServer: (server: TestServer) => void;
}

export const ServerModal: React.FC<ServerModalProps> = ({
  isOpen,
  onClose,
  selectedServer,
  onSelectServer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'bd' | 'asia' | 'west'>('all');

  const filteredServers = useMemo(() => {
    return SERVERS.filter((server) => {
      // Search filter
      const matchesSearch =
        searchQuery.trim() === '' ||
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.country.toLowerCase().includes(searchQuery.toLowerCase());

      // Category tab filter
      let matchesTab = true;
      if (activeTab === 'bd') {
        matchesTab = server.country.includes('Bangladesh') || server.isAuto === true;
      } else if (activeTab === 'asia') {
        matchesTab = ['Singapore', 'Japan', 'India', 'Hong Kong', 'Australia'].some(c => server.country.includes(c));
      } else if (activeTab === 'west') {
        matchesTab = ['Germany', 'United Kingdom', 'France', 'United States', 'Brazil'].some(c => server.country.includes(c));
      }

      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-2xl bg-[#130733] border border-[#321c6b] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#2d1a5c] flex items-center justify-between bg-[#190a42]">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">Select Speedtest Server</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800/60 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#2d1a5c] bg-[#11052d]">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by sponsor or city name..."
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-[#1c0c47] border border-[#39217a] text-white text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-[#1c0c47] text-gray-400 hover:text-white border border-[#2d1a5c]'
              }`}
            >
              All Servers ({SERVERS.length})
            </button>
            <button
              onClick={() => setActiveTab('bd')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'bd'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-[#1c0c47] text-gray-400 hover:text-white border border-[#2d1a5c]'
              }`}
            >
              <span>🇧🇩 Bangladesh</span>
            </button>
            <button
              onClick={() => setActiveTab('asia')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'asia'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-[#1c0c47] text-gray-400 hover:text-white border border-[#2d1a5c]'
              }`}
            >
              <span>🌏 Asia-Pacific</span>
            </button>
            <button
              onClick={() => setActiveTab('west')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'west'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-[#1c0c47] text-gray-400 hover:text-white border border-[#2d1a5c]'
              }`}
            >
              <span>🌍 Europe & US</span>
            </button>
          </div>
        </div>

        {/* Server Items List */}
        <div className="p-3 overflow-y-auto flex-1 divide-y divide-[#221247]">
          {filteredServers.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-2">
              <MapPin className="w-8 h-8 text-gray-500 mx-auto" />
              <p className="text-sm font-medium">No servers match "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-orange-400 hover:underline"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            filteredServers.map((server) => {
              const isSelected = server.id === selectedServer.id;
              return (
                <div
                  key={server.id}
                  onClick={() => {
                    onSelectServer(server);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-orange-500/20 border border-orange-500/50'
                      : 'hover:bg-[#1f0e4d] text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <span className="text-2xl shrink-0">{server.flag}</span>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white truncate">{server.name}</p>
                        {server.isAuto && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold border border-cyan-500/30">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#a094c7] truncate">{server.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      {server.pingOffset > 0 ? `+${server.pingOffset}ms` : 'Lowest Latency'}
                    </span>
                    {isSelected ? (
                      <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : (
                      <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2d1a5c] hover:bg-orange-500 text-gray-200 hover:text-white transition-colors">
                        Select
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
