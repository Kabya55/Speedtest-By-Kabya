import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function cleanIspName(isp?: string, org?: string, asStr?: string): string {
  const genericWords = ['corporate office', 'corporate', 'customer', 'broadband', 'internet', 'network', 'unknown', 'datacenter'];

  let cleanOrg = (org || '').replace(/^AS\d+\s+/i, '').trim();
  let cleanAs = (asStr || '').replace(/^AS\d+\s+/i, '').trim();
  let cleanIsp = (isp || '').trim();

  // If ISP name is generic ("Corporate Office"), use org or AS name if available
  if (genericWords.includes(cleanIsp.toLowerCase())) {
    if (cleanOrg && !genericWords.includes(cleanOrg.toLowerCase())) return cleanOrg;
    if (cleanAs && !genericWords.includes(cleanAs.toLowerCase())) return cleanAs;
  }

  if (cleanIsp && !genericWords.includes(cleanIsp.toLowerCase())) {
    return cleanIsp;
  }

  if (cleanOrg && !genericWords.includes(cleanOrg.toLowerCase())) {
    return cleanOrg;
  }

  if (cleanAs && !genericWords.includes(cleanAs.toLowerCase())) {
    return cleanAs;
  }

  return cleanIsp || cleanOrg || cleanAs || 'Wi-Fi / Mobile Network';
}

export async function GET(req: NextRequest) {
  // Extract client IP from proxy headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  let clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '';

  const isPrivate = !clientIp || clientIp === '127.0.0.1' || clientIp === '::1' || clientIp.startsWith('192.168.') || clientIp.startsWith('10.');
  const queryIp = isPrivate ? '' : clientIp;

  // 1. Try ipwho.is (Provides exact commercial ISP brand names e.g., "Race Online Ltd", "Amber IT", "Link3")
  try {
    const targetUrl = queryIp ? `https://ipwho.is/${queryIp}` : `https://ipwho.is/`;
    const res = await fetch(targetUrl, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        const ispName = cleanIspName(data.connection?.isp, data.connection?.org, data.connection?.domain);
        return NextResponse.json({
          ip: data.ip || clientIp || 'Unknown IP',
          isp: ispName,
          org: data.connection?.org || '',
          city: data.city || '',
          region: data.region || '',
          country_name: data.country || '',
          country_code: data.country_code || '',
        });
      }
    }
  } catch (err) {
    console.warn('ipwho.is failed, trying fallback:', err);
  }

  // 2. Fallback: ip-api.com with smart ISP cleaning
  try {
    const apiUrl = queryIp 
      ? `http://ip-api.com/json/${queryIp}?fields=status,country,countryCode,regionName,city,isp,org,as,query`
      : `http://ip-api.com/json/?fields=status,country,countryCode,regionName,city,isp,org,as,query`;

    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'success') {
        const ispName = cleanIspName(data.isp, data.org, data.as);
        return NextResponse.json({
          ip: data.query || clientIp || 'Unknown IP',
          isp: ispName,
          org: data.org || data.as || '',
          city: data.city || '',
          region: data.regionName || '',
          country_name: data.country || '',
          country_code: data.countryCode || '',
        });
      }
    }
  } catch (err) {
    console.error('ip-api.com failed:', err);
  }

  return NextResponse.json({
    ip: clientIp || 'Unknown IP',
    isp: 'Wi-Fi / Mobile Network',
    city: 'Local Network',
  });
}
