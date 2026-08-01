import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sizeMB = Math.min(Math.max(parseInt(searchParams.get('size') || '5', 10), 1), 25);
  const totalBytes = sizeMB * 1024 * 1024;
  const chunkSize = 64 * 1024; // 64KB chunks

  const randomChunk = new Uint8Array(chunkSize);
  for (let i = 0; i < chunkSize; i++) {
    randomChunk[i] = Math.floor(Math.random() * 256);
  }

  let bytesSent = 0;

  const stream = new ReadableStream({
    pull(controller) {
      if (bytesSent >= totalBytes) {
        controller.close();
        return;
      }
      const remaining = totalBytes - bytesSent;
      const toSend = Math.min(remaining, chunkSize);

      if (toSend === chunkSize) {
        controller.enqueue(randomChunk);
      } else {
        controller.enqueue(randomChunk.subarray(0, toSend));
      }
      bytesSent += toSend;
    },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': totalBytes.toString(),
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
