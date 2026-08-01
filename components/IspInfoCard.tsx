import React from 'react';
import { IspInfo } from '../lib/types';
import { Server, Globe, MapPin, Wifi, RefreshCw } from 'lucide-react';

interface IspInfoCardProps {
  ispInfo: IspInfo | null;
  loading: boolean;
  onRefresh: () => void;
}

export const IspInfoCard: React.FC<IspInfoCardProps> = ({ ispInfo, loading, onRefresh }) => {
  return (
    <div className="glass-card p-5 rounded-2xl border border-gray-800 relative">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/60">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
            Network & ISP Info
          </h3>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1.5 rounded-lg glass-card hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
          title="Refresh ISP Info"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-6 flex items-center justify-center gap-3 text-gray-400">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
          <span className="text-xs">Detecting ISP details...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-900/40 border border-gray-800/40">
            <Wifi className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs text-gray-400">ISP Provider</p>
              <p className="text-sm font-semibold text-gray-100 truncate" title={ispInfo?.isp || 'Detecting...'}>
                {ispInfo?.isp || 'Unknown Provider'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-900/40 border border-gray-800/40">
            <Globe className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs text-gray-400">Public IP Address</p>
              <p className="text-sm font-semibold text-gray-100 truncate font-mono">
                {ispInfo?.ip || '0.0.0.0'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-900/40 border border-gray-800/40">
            <MapPin className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs text-gray-400">Location</p>
              <p className="text-sm font-semibold text-gray-100 truncate">
                {ispInfo?.city ? `${ispInfo.city}${ispInfo.country_code ? `, ${ispInfo.country_code}` : ''}` : 'Local Server'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
