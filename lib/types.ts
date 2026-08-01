export type TestPhase = 'idle' | 'ping' | 'download' | 'upload' | 'completed' | 'error';

export interface IspInfo {
  ip: string;
  isp: string;
  org?: string;
  city?: string;
  region?: string;
  country_name?: string;
  country_code?: string;
  latitude?: number;
  longitude?: number;
}

export interface SpeedMetrics {
  ping: number; // in ms
  jitter: number; // in ms
  download: number; // in Mbps
  upload: number; // in Mbps
}

export interface TestServer {
  id: string;
  name: string;
  location: string;
  country: string;
  flag: string;
  pingOffset: number;
  isAuto?: boolean;
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  download: number;
  upload: number;
  ping: number;
  jitter: number;
  isp: string;
  ip: string;
  serverName?: string;
}

export interface QualityAnalysis {
  streaming4k: { status: 'excellent' | 'good' | 'poor'; label: string };
  gaming: { status: 'excellent' | 'good' | 'poor'; label: string };
  videoCalls: { status: 'excellent' | 'good' | 'poor'; label: string };
}
