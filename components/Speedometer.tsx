'use client';

import React, { useMemo } from 'react';
import { TestPhase } from '../lib/types';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface SpeedometerProps {
  speed: number;
  downloadValue: number;
  uploadValue: number;
  phase: TestPhase;
}

export const Speedometer: React.FC<SpeedometerProps> = ({
  speed,
  downloadValue,
  uploadValue,
  phase,
}) => {
  // Dribbble NetSpeed tick values: 0, 1, 5, 10, 20, 30, 50, 75, 100
  const maxSpeed = useMemo(() => {
    if (speed <= 100) return 100;
    if (speed <= 300) return 300;
    if (speed <= 500) return 500;
    return 1000;
  }, [speed]);

  const tickValues = useMemo(() => {
    if (maxSpeed === 100) {
      return [0, 1, 5, 10, 20, 30, 50, 75, 100];
    }
    return [0, 20, 50, 100, 200, 300, 500, 750, maxSpeed];
  }, [maxSpeed]);

  const startAngle = -210;
  const endAngle = 30;
  const totalSweep = endAngle - startAngle;

  const currentAngle = useMemo(() => {
    const clamped = Math.min(Math.max(speed, 0), maxSpeed);
    const ratio = clamped / maxSpeed;
    return startAngle + ratio * totalSweep;
  }, [speed, maxSpeed]);

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngleDeg: number, endAngleDeg: number) => {
    const start = polarToCartesian(x, y, radius, endAngleDeg);
    const end = polarToCartesian(x, y, radius, startAngleDeg);
    const largeArcFlag = endAngleDeg - startAngleDeg <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const backgroundArcPath = describeArc(150, 150, 120, startAngle, endAngle);
  const activeArcPath = describeArc(150, 150, 120, startAngle, Math.min(currentAngle, endAngle));

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      {/* SVG Radial Gauge */}
      <svg width="340" height="280" viewBox="0 0 300 280" className="overflow-visible">
        <defs>
          <linearGradient id="dribbbleArcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFC800" />
            <stop offset="70%" stopColor="#FF6600" />
            <stop offset="100%" stopColor="#EE3600" />
          </linearGradient>
          <filter id="dribbbleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circle Accent */}
        <circle cx="150" cy="150" r="136" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />

        {/* Inner Gauge Background Fill Circle */}
        <circle cx="150" cy="150" r="110" fill="rgba(255, 255, 255, 0.02)" />

        {/* Background Track Arc */}
        <path
          d={backgroundArcPath}
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Active Filled Arc */}
        <path
          d={activeArcPath}
          fill="none"
          stroke="url(#dribbbleArcGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          filter="url(#dribbbleGlow)"
        />

        {/* Ticks and Scale Numbers */}
        {tickValues.map((val, idx) => {
          const ratio = idx / (tickValues.length - 1);
          const angle = startAngle + ratio * totalSweep;
          const outerPt = polarToCartesian(150, 150, 110, angle);
          const innerPt = polarToCartesian(150, 150, 102, angle);
          const textPt = polarToCartesian(150, 150, 86, angle);

          return (
            <g key={idx}>
              <line
                x1={innerPt.x}
                y1={innerPt.y}
                x2={outerPt.x}
                y2={outerPt.y}
                stroke="rgba(255, 255, 255, 0.35)"
                strokeWidth="1.5"
              />
              <text
                x={textPt.x}
                y={textPt.y}
                fill="#D8D0F5"
                fontSize="13"
                fontWeight="500"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* White Needle */}
        <g style={{ transform: `rotate(${currentAngle + 90}deg)`, transformOrigin: '150px 150px' }} className="gauge-needle">
          <polygon points="146.5,150 153.5,150 150,38" fill="#FFFFFF" />
          <circle cx="150" cy="150" r="11" fill="#FFFFFF" />
        </g>
      </svg>

      {/* Download & Upload Metric Pills matching Dribbble screenshot */}
      <div className="flex items-center justify-center gap-4 w-full max-w-sm mt-2">
        {/* DOWNLOAD Pill */}
        <div className="flex-1 bg-[#130733] border border-[#2d1a5c] px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-blue-400/50 bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
              <ArrowDown className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-extrabold text-[#9487c4] tracking-widest uppercase">DOWNLOAD</p>
              <p className="text-2xl font-bold text-white font-sans leading-none">
                {downloadValue > 0 ? downloadValue.toFixed(1) : '0.0'}
              </p>
            </div>
          </div>
        </div>

        {/* UPLOAD Pill */}
        <div className="flex-1 bg-[#130733] border border-[#2d1a5c] px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-orange-400/50 bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-extrabold text-[#9487c4] tracking-widest uppercase">UPLOAD</p>
              <p className="text-2xl font-bold text-white font-sans leading-none">
                {uploadValue > 0 ? uploadValue.toFixed(1) : '0.0'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
