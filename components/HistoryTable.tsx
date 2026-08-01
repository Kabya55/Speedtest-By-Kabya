import React from 'react';
import { HistoryRecord } from '../lib/types';
import { History, Trash2, Calendar, ArrowDown, ArrowUp, Activity } from 'lucide-react';

interface HistoryTableProps {
  history: HistoryRecord[];
  onClearHistory: () => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ history, onClearHistory }) => {
  if (history.length === 0) return null;

  return (
    <div className="glass-card p-5 rounded-2xl border border-gray-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
            Test History Log
          </h3>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Logs</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-gray-400 border-b border-gray-800">
              <th className="pb-3 font-semibold">Date & Time</th>
              <th className="pb-3 font-semibold">ISP</th>
              <th className="pb-3 font-semibold">Download</th>
              <th className="pb-3 font-semibold">Upload</th>
              <th className="pb-3 font-semibold">Ping</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-gray-300">
            {history.map((record) => (
              <tr key={record.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="py-3 flex items-center gap-1.5 text-gray-400 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  {record.timestamp}
                </td>
                <td className="py-3 font-medium text-gray-200 max-w-[150px] truncate">
                  {record.isp}
                </td>
                <td className="py-3 font-semibold text-cyan-400">
                  <span className="flex items-center gap-1">
                    <ArrowDown className="w-3 h-3 text-cyan-400" />
                    {record.download.toFixed(1)} Mbps
                  </span>
                </td>
                <td className="py-3 font-semibold text-purple-400">
                  <span className="flex items-center gap-1">
                    <ArrowUp className="w-3 h-3 text-purple-400" />
                    {record.upload.toFixed(1)} Mbps
                  </span>
                </td>
                <td className="py-3 font-semibold text-yellow-400">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-yellow-400" />
                    {record.ping} ms
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
