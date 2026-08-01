'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { Speedometer } from '../components/Speedometer';
import { MetricCard } from '../components/MetricCard';
import { IspInfoCard } from '../components/IspInfoCard';
import { QualityBadge } from '../components/QualityBadge';
import { HistoryTable } from '../components/HistoryTable';
import { ServerSelector } from '../components/ServerSelector';
import { SpeedTestEngine } from '../lib/speedtest';
import { fetchIspInfo } from '../lib/ip';
import { SERVERS, discoverFastestServer } from '../lib/servers';
import { TestPhase, SpeedMetrics, IspInfo, HistoryRecord, TestServer } from '../lib/types';
import { Play, Square, AlertCircle, Share2, Check, RefreshCw } from 'lucide-react';

export default function Home() {
  const [phase, setPhase] = useState<TestPhase>('idle');
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [selectedServer, setSelectedServer] = useState<TestServer>(SERVERS[1]); // Default Spark IT Khulna
  const [isDiscovering, setIsDiscovering] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<SpeedMetrics>({
    ping: 0,
    jitter: 0,
    download: 0,
    upload: 0,
  });
  const [ispInfo, setIspInfo] = useState<IspInfo | null>(null);
  const [loadingIsp, setLoadingIsp] = useState<boolean>(true);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const engineRef = useRef<SpeedTestEngine | null>(null);

  const loadIspDetails = async () => {
    setLoadingIsp(true);
    try {
      const info = await fetchIspInfo();
      setIspInfo(info);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingIsp(false);
    }
  };

  // Ookla-Style Automatic Server Discovery on page load
  const autoDiscoverServer = async () => {
    setIsDiscovering(true);
    try {
      const fastest = await discoverFastestServer();
      setSelectedServer(fastest);
    } catch (e) {
      console.error('Server discovery error:', e);
    } finally {
      setIsDiscovering(false);
    }
  };

  useEffect(() => {
    loadIspDetails();
    autoDiscoverServer();

    try {
      const savedHistory = localStorage.getItem('speedtest_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  const saveToHistory = (newMetrics: SpeedMetrics) => {
    const record: HistoryRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
      download: newMetrics.download,
      upload: newMetrics.upload,
      ping: newMetrics.ping,
      jitter: newMetrics.jitter,
      isp: ispInfo?.isp || 'Unknown ISP',
      ip: ispInfo?.ip || '0.0.0.0',
      serverName: selectedServer.name,
    };

    const updated = [record, ...history].slice(0, 10);
    setHistory(updated);
    try {
      localStorage.setItem('speedtest_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  const handleStartTest = () => {
    setErrorMessage(null);
    setCurrentSpeed(0);
    setMetrics({ ping: 0, jitter: 0, download: 0, upload: 0 });

    const engine = new SpeedTestEngine({
      onPhaseChange: (newPhase) => {
        setPhase(newPhase);
      },
      onProgress: (partialMetrics, liveSpeed) => {
        setMetrics((prev) => ({ ...prev, ...partialMetrics }));
        setCurrentSpeed(liveSpeed);
      },
      onComplete: (finalMetrics) => {
        setMetrics(finalMetrics);
        setCurrentSpeed(0);
        saveToHistory(finalMetrics);
      },
      onError: (err) => {
        setErrorMessage(err);
        setCurrentSpeed(0);
      },
    }, selectedServer);

    engineRef.current = engine;
    engine.start();
  };

  const handleCancelTest = () => {
    if (engineRef.current) {
      engineRef.current.cancel();
      setPhase('idle');
      setCurrentSpeed(0);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('speedtest_history');
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyResult = () => {
    const text = `🚀 NETSPEED Results:
🌐 ISP: ${ispInfo?.isp || 'Wi-Fi'}
📍 Server: ${selectedServer.name} (${selectedServer.location})
⬇️ Download: ${metrics.download.toFixed(1)} Mbps
⬆️ Upload: ${metrics.upload.toFixed(1)} Mbps
⚡ Ping: ${metrics.ping} ms (Jitter: ${metrics.jitter} ms)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isTesting = phase === 'ping' || phase === 'download' || phase === 'upload';

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top White Header Bar */}
      <Header onStartClick={!isTesting ? handleStartTest : handleCancelTest} />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-8 flex-1">
        {/* Error Alert */}
        {errorMessage && (
          <div className="glass-card p-4 rounded-2xl border border-red-500/40 bg-red-500/10 flex items-center justify-between text-red-300">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-xs underline hover:text-white">
              Dismiss
            </button>
          </div>
        )}

        {/* HERO SECTION MATCHING DRIBBBLE & OOKLA STYLE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8">
          {/* Left Column: SLOW INTERNET? Headline + Orange START NOW Button */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              <p className="text-[#a394cf] text-base tracking-[0.25em] font-semibold uppercase mb-3">
                SLOW INTERNET?
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                Check Your Net Speed
              </h1>
            </div>

            {/* Big Dribbble Orange START NOW CTA Button */}
            <div>
              {!isTesting ? (
                <button
                  onClick={handleStartTest}
                  className="dribbble-orange-btn w-60 h-14 rounded-lg font-black text-lg text-white uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>START NOW</span>
                </button>
              ) : (
                <button
                  onClick={handleCancelTest}
                  className="w-60 h-14 rounded-lg font-bold text-base bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-3 shadow-xl transition-all"
                >
                  <Square className="w-5 h-5 fill-current" />
                  <span>CANCEL TEST</span>
                </button>
              )}
            </div>

            {/* Disclaimer text matching Dribbble shot */}
            <p className="text-[11px] text-[#7b6f9e] leading-relaxed max-w-md pt-1">
              By clicking on the button above you agree to install this extension and have read and agreed to the EULA, Privacy Policy and Endorsement Disclaimer & DMCA Policy.
            </p>

            {/* Speedtest.net Style Server Selector Component */}
            <div className="pt-3 relative">
              {isDiscovering && (
                <div className="flex items-center gap-2 text-xs text-orange-400 font-medium mb-1 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Auto-detecting optimal server...</span>
                </div>
              )}
              <ServerSelector
                selectedServer={selectedServer}
                onSelectServer={setSelectedServer}
                disabled={isTesting}
              />
            </div>
          </div>

          {/* Right Column: Speedometer Gauge & Download/Upload Pills */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <Speedometer
              speed={currentSpeed}
              downloadValue={metrics.download}
              uploadValue={metrics.upload}
              phase={phase}
            />

            {phase === 'completed' && (
              <button
                onClick={handleCopyResult}
                className="mt-4 glass-card px-5 py-2.5 rounded-xl text-xs font-semibold text-orange-400 hover:text-white flex items-center gap-2 border border-orange-500/30 hover:border-orange-500/60 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Copied Results!' : 'Share Test Results'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Download Speed" value={metrics.download} unit="Mbps" type="download" currentPhase={phase} />
          <MetricCard title="Upload Speed" value={metrics.upload} unit="Mbps" type="upload" currentPhase={phase} />
          <MetricCard title="Ping Latency" value={metrics.ping} unit="ms" type="ping" currentPhase={phase} />
          <MetricCard title="Jitter Variance" value={metrics.jitter} unit="ms" type="jitter" currentPhase={phase} />
        </div>

        {/* Network & ISP Info Section */}
        <IspInfoCard ispInfo={ispInfo} loading={loadingIsp} onRefresh={loadIspDetails} />

        {/* Quality Rating Section */}
        <QualityBadge metrics={metrics} isCompleted={phase === 'completed'} />

        {/* Local History Section */}
        <HistoryTable history={history} onClearHistory={handleClearHistory} />

        {/* Vercel Deployment Helper Card */}
        <div className="glass-card p-6 rounded-2xl border border-orange-500/20 bg-orange-950/10 text-xs text-gray-300 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-orange-300">
              🚀 Ready for Vercel Deployment
            </h4>
            <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 font-mono text-[10px]">
              Vercel Zero-Config
            </span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Deploy this NETSPEED application instantly to Vercel. All serverless endpoints for download, upload, and regional latency testing run automatically.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <code className="px-3 py-1.5 rounded-lg bg-gray-900/80 font-mono text-orange-300 text-[11px] border border-gray-800">
              npx vercel
            </code>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#09021a] border-t border-[#1d0e45] py-6 text-center text-xs text-[#7b6f9e]">
        <p>© {new Date().getFullYear()} NETSPEED. Fast & Free Wi-Fi / ISP Internet Speed Tests.</p>
      </footer>
    </div>
  );
}
