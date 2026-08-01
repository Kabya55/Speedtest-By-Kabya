import React from 'react';
import { SpeedMetrics } from '../lib/types';
import { Tv, Gamepad2, Video, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface QualityBadgeProps {
  metrics: SpeedMetrics;
  isCompleted: boolean;
}

export const QualityBadge: React.FC<QualityBadgeProps> = ({ metrics, isCompleted }) => {
  if (!isCompleted) return null;

  const { download, upload, ping } = metrics;

  // Evaluate 4K Streaming (Needs > 25 Mbps download)
  const streamingStatus = download >= 25 ? 'excellent' : download >= 10 ? 'good' : 'poor';
  
  // Evaluate Online Gaming (Needs ping < 40ms)
  const gamingStatus = ping > 0 && ping <= 40 ? 'excellent' : ping <= 80 ? 'good' : 'poor';

  // Evaluate Video Calls (Needs download > 5 Mbps, upload > 3 Mbps, ping < 100ms)
  const callsStatus = download >= 5 && upload >= 3 && ping <= 100 ? 'excellent' : download >= 3 ? 'good' : 'poor';

  const renderBadge = (status: 'excellent' | 'good' | 'poor', title: string, icon: React.ReactNode, requirement: string) => {
    const config = {
      excellent: {
        bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        icon: <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />,
        label: 'Great Performance'
      },
      good: {
        bg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
        icon: <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />,
        label: 'Acceptable'
      },
      poor: {
        bg: 'bg-red-500/10 border-red-500/30 text-red-400',
        icon: <XCircle className="w-4 h-4 text-red-400 shrink-0" />,
        label: 'Lag / Buffering'
      }
    }[status];

    return (
      <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${config.bg}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-900/60">
            {icon}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-200">{title}</h4>
            <p className="text-xs text-gray-400">{requirement}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {config.icon}
          <span>{config.label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-3">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
        Wi-Fi Connection Quality Rating
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {renderBadge(streamingStatus, '4K Ultra HD Video', <Tv className="w-4 h-4 text-cyan-400" />, 'Needs 25+ Mbps')}
        {renderBadge(gamingStatus, 'Online Gaming', <Gamepad2 className="w-4 h-4 text-purple-400" />, 'Needs Ping < 40ms')}
        {renderBadge(callsStatus, 'Video Conference', <Video className="w-4 h-4 text-emerald-400" />, 'Needs stable upload')}
      </div>
    </div>
  );
};
