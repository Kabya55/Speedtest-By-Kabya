import React from 'react';
import { Download, Upload, Activity, Zap } from 'lucide-react';
import { TestPhase } from '../lib/types';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  type: 'download' | 'upload' | 'ping' | 'jitter';
  currentPhase: TestPhase;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, type, currentPhase }) => {
  const isTesting = currentPhase === type || (type === 'jitter' && currentPhase === 'ping');

  const getIconAndColor = () => {
    switch (type) {
      case 'download':
        return {
          icon: <Download className="w-5 h-5 text-cyan-400" />,
          accentColor: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400',
          gradient: 'from-cyan-500 to-blue-500',
          textClass: 'neon-text-blue'
        };
      case 'upload':
        return {
          icon: <Upload className="w-5 h-5 text-purple-400" />,
          accentColor: 'border-purple-500/50 bg-purple-500/10 text-purple-400',
          gradient: 'from-purple-500 to-indigo-500',
          textClass: 'neon-text-purple'
        };
      case 'ping':
        return {
          icon: <Activity className="w-5 h-5 text-yellow-400" />,
          accentColor: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
          gradient: 'from-yellow-500 to-amber-500',
          textClass: 'text-yellow-400'
        };
      case 'jitter':
        return {
          icon: <Zap className="w-5 h-5 text-emerald-400" />,
          accentColor: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
          gradient: 'from-emerald-500 to-teal-500',
          textClass: 'neon-text-green'
        };
    }
  };

  const { icon, accentColor, textClass } = getIconAndColor();

  return (
    <div
      className={`glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden transition-all duration-300 ${
        isTesting ? `border-2 ${accentColor} pulse-active` : 'border border-gray-800'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl ${accentColor}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className={`text-3xl font-extrabold tracking-tight ${value > 0 ? textClass : 'text-gray-500'}`}>
          {value > 0 ? (type === 'download' || type === 'upload' ? value.toFixed(2) : value.toFixed(0)) : '--'}
        </span>
        <span className="text-xs font-medium text-gray-400">{unit}</span>
      </div>

      {isTesting && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 animate-pulse" />
      )}
    </div>
  );
};
