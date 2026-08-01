import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wi-Fi & ISP Speed Tester | Real-time Bandwidth Measurement',
  description: 'High precision Wi-Fi and ISP internet speed test tool for download speed, upload speed, ping, jitter, and network info. Ready for Vercel deployment.',
  keywords: ['Speed Test', 'Wi-Fi Speed', 'ISP Speed', 'Internet Speed Tester', 'Vercel Speedtest', 'Bandwidth Checker'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased text-gray-100 flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
