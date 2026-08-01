import { TestServer } from './types';

export interface ExtendedTestServer extends TestServer {
  pingUrl?: string;
  downloadUrl?: string;
  uploadUrl?: string;
}

export const SERVERS: ExtendedTestServer[] = [
  {
    id: 'auto',
    name: 'Auto-Detect (Closest Server)',
    location: 'Optimal Edge Node',
    country: 'Bangladesh / Local',
    flag: '⚡',
    pingOffset: 0,
    isAuto: true,
  },

  // LOCAL BANGLADESH ISP NODES
  {
    id: 'spark-it-khulna',
    name: 'Spark IT',
    location: 'Khulna, Bangladesh',
    country: 'Bangladesh',
    flag: '🇧🇩',
    pingOffset: 2,
    pingUrl: '/api/speedtest/ping?node=spark-it-khulna',
    downloadUrl: '/api/speedtest/download?node=spark-it-khulna',
    uploadUrl: '/api/speedtest/upload?node=spark-it-khulna',
  },
  {
    id: 'race-online-dhaka',
    name: 'Race Online Ltd',
    location: 'Dhaka, Bangladesh',
    country: 'Bangladesh',
    flag: '🇧🇩',
    pingOffset: 4,
    pingUrl: '/api/speedtest/ping?node=race-online-dhaka',
    downloadUrl: '/api/speedtest/download?node=race-online-dhaka',
    uploadUrl: '/api/speedtest/upload?node=race-online-dhaka',
  },
  {
    id: 'amber-it-dhaka',
    name: 'Amber IT',
    location: 'Dhaka, Bangladesh',
    country: 'Bangladesh',
    flag: '🇧🇩',
    pingOffset: 5,
    pingUrl: '/api/speedtest/ping?node=amber-it-dhaka',
    downloadUrl: '/api/speedtest/download?node=amber-it-dhaka',
    uploadUrl: '/api/speedtest/upload?node=amber-it-dhaka',
  },
  {
    id: 'link3-chattogram',
    name: 'Link3 Technologies',
    location: 'Chattogram, Bangladesh',
    country: 'Bangladesh',
    flag: '🇧🇩',
    pingOffset: 8,
    pingUrl: '/api/speedtest/ping?node=link3-chattogram',
    downloadUrl: '/api/speedtest/download?node=link3-chattogram',
    uploadUrl: '/api/speedtest/upload?node=link3-chattogram',
  },
  {
    id: 'carnival-barishal',
    name: 'Carnival Internet',
    location: 'Barishal, Bangladesh',
    country: 'Bangladesh',
    flag: '🇧🇩',
    pingOffset: 6,
    pingUrl: '/api/speedtest/ping?node=carnival-barishal',
    downloadUrl: '/api/speedtest/download?node=carnival-barishal',
    uploadUrl: '/api/speedtest/upload?node=carnival-barishal',
  },
  {
    id: 'bdcom-sylhet',
    name: 'BDCOM Online',
    location: 'Sylhet, Bangladesh',
    country: 'Bangladesh',
    flag: '🇧🇩',
    pingOffset: 9,
  },
  {
    id: 'dotlines-rajshahi',
    name: 'Dotlines Networks',
    location: 'Rajshahi, Bangladesh',
    country: 'Bangladesh',
    flag: '🇧🇩',
    pingOffset: 7,
  },

  // ASIA-PACIFIC NODES
  {
    id: 'singtel-singapore',
    name: 'Singtel Edge',
    location: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    pingOffset: 42,
    pingUrl: 'https://speed.cloudflare.com/__down?bytes=100',
    downloadUrl: 'https://speed.cloudflare.com/__down?bytes=25000000',
    uploadUrl: '/api/speedtest/upload?node=singapore',
  },
  {
    id: 'kddi-tokyo',
    name: 'KDDI Telecom',
    location: 'Tokyo, Japan',
    country: 'Japan',
    flag: '🇯🇵',
    pingOffset: 88,
    pingUrl: '/api/speedtest/ping?node=tokyo',
    downloadUrl: '/api/speedtest/download?node=tokyo',
    uploadUrl: '/api/speedtest/upload?node=tokyo',
  },
  {
    id: 'tata-mumbai',
    name: 'Tata Communications',
    location: 'Mumbai, India',
    country: 'India',
    flag: '🇮🇳',
    pingOffset: 48,
    pingUrl: '/api/speedtest/ping?node=mumbai',
    downloadUrl: '/api/speedtest/download?node=mumbai',
    uploadUrl: '/api/speedtest/upload?node=mumbai',
  },
  {
    id: 'tencent-hongkong',
    name: 'Tencent Cloud',
    location: 'Hong Kong',
    country: 'Hong Kong',
    flag: '🇭🇰',
    pingOffset: 65,
  },
  {
    id: 'telstra-sydney',
    name: 'Telstra Broadband',
    location: 'Sydney, Australia',
    country: 'Australia',
    flag: '🇦🇺',
    pingOffset: 125,
  },

  // EUROPE NODES
  {
    id: 'hetzner-frankfurt',
    name: 'Hetzner Online',
    location: 'Frankfurt, Germany',
    country: 'Germany',
    flag: '🇩🇪',
    pingOffset: 135,
    pingUrl: '/api/speedtest/ping?node=frankfurt',
    downloadUrl: '/api/speedtest/download?node=frankfurt',
    uploadUrl: '/api/speedtest/upload?node=frankfurt',
  },
  {
    id: 'vultr-london',
    name: 'British Telecom / Vultr',
    location: 'London, UK',
    country: 'United Kingdom',
    flag: '🇬🇧',
    pingOffset: 148,
  },
  {
    id: 'ovh-paris',
    name: 'Linode / OVH',
    location: 'Paris, France',
    country: 'France',
    flag: '🇫🇷',
    pingOffset: 152,
  },

  // AMERICAS NODES
  {
    id: 'aws-us-east',
    name: 'Verizon / AWS',
    location: 'N. Virginia, USA',
    country: 'United States',
    flag: '🇺🇸',
    pingOffset: 215,
    pingUrl: '/api/speedtest/ping?node=us-east',
    downloadUrl: '/api/speedtest/download?node=us-east',
    uploadUrl: '/api/speedtest/upload?node=us-east',
  },
  {
    id: 'equinix-silicon-valley',
    name: 'Equinix Node',
    location: 'Silicon Valley, USA',
    country: 'United States',
    flag: '🇺🇸',
    pingOffset: 235,
  },
  {
    id: 'sao-paulo-node',
    name: 'Claro / AWS',
    location: 'Sao Paulo, Brazil',
    country: 'Brazil',
    flag: '🇧🇷',
    pingOffset: 290,
  },
];

/**
 * Ookla-Style Automatic Server Discovery:
 * Pings candidate local & regional servers in parallel and selects the node with the lowest latency.
 */
export async function discoverFastestServer(): Promise<ExtendedTestServer> {
  const candidateServers = SERVERS.filter((s) => !s.isAuto);

  const pingPromises = candidateServers.map(async (server) => {
    const start = performance.now();
    try {
      const pingEndpoint = server.pingUrl || `/api/speedtest/ping?node=${server.id}`;
      const res = await fetch(`${pingEndpoint}${pingEndpoint.includes('?') ? '&' : '?'}cb=${Date.now()}`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(2500),
      });
      await res.text();
      const latency = performance.now() - start + (server.pingOffset || 0);
      return { server, latency };
    } catch {
      return { server, latency: 9999 };
    }
  });

  const results = await Promise.allSettled(pingPromises);

  let bestServer = candidateServers[0]; // Default fallback (Spark IT Khulna / Race Online)
  let lowestLatency = Infinity;

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.latency < lowestLatency) {
      lowestLatency = result.value.latency;
      bestServer = result.value.server;
    }
  }

  return bestServer;
}
