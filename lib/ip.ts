import { IspInfo } from './types';

export async function fetchIspInfo(): Promise<IspInfo> {
  // 1. Fetch from internal server-side API (bypasses browser AdBlockers & CORS)
  try {
    const res = await fetch('/api/speedtest/ip', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.ip && data.ip !== 'Unknown IP') {
        return {
          ip: data.ip,
          isp: data.isp || 'Unknown ISP',
          org: data.org || '',
          city: data.city || '',
          region: data.region || '',
          country_name: data.country_name || '',
          country_code: data.country_code || '',
        };
      }
    }
  } catch (err) {
    console.warn('Internal IP API failed, attempting client-side fallback', err);
  }

  // 2. Client-side fallback using ipwho.is
  try {
    const res = await fetch('https://ipwho.is/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        return {
          ip: data.ip || 'Unknown IP',
          isp: data.connection?.isp || data.connection?.org || 'Wi-Fi / Mobile Network',
          city: data.city || '',
          region: data.region || '',
          country_name: data.country || '',
          country_code: data.country_code || '',
        };
      }
    }
  } catch (err) {
    console.error('Client-side IP fallback failed', err);
  }

  return {
    ip: 'Unknown IP',
    isp: 'Wi-Fi / Mobile Network',
    city: 'Local Network',
  };
}
