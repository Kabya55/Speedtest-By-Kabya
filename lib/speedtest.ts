import { SpeedMetrics, TestPhase, TestServer } from './types';

export interface TestCallbacks {
  onPhaseChange: (phase: TestPhase) => void;
  onProgress: (metrics: Partial<SpeedMetrics>, currentSpeed: number) => void;
  onComplete: (metrics: SpeedMetrics) => void;
  onError: (error: string) => void;
}

export class SpeedTestEngine {
  private callbacks: TestCallbacks;
  private selectedServer?: TestServer;
  private isCancelled: boolean = false;

  constructor(callbacks: TestCallbacks, selectedServer?: TestServer) {
    this.callbacks = callbacks;
    this.selectedServer = selectedServer;
  }

  public cancel() {
    this.isCancelled = true;
  }

  public async start() {
    this.isCancelled = false;
    const finalMetrics: SpeedMetrics = {
      ping: 0,
      jitter: 0,
      download: 0,
      upload: 0,
    };

    try {
      // 1. PING & JITTER PHASE
      if (this.isCancelled) return;
      this.callbacks.onPhaseChange('ping');
      const pingResult = await this.runPingTest(10);
      finalMetrics.ping = pingResult.ping;
      finalMetrics.jitter = pingResult.jitter;
      this.callbacks.onProgress(finalMetrics, 0);

      // 2. DOWNLOAD PHASE
      if (this.isCancelled) return;
      this.callbacks.onPhaseChange('download');
      const downloadSpeed = await this.runDownloadTest(8000, (currentMbps) => {
        this.callbacks.onProgress(finalMetrics, currentMbps);
      });
      finalMetrics.download = downloadSpeed;
      this.callbacks.onProgress(finalMetrics, downloadSpeed);

      // 3. UPLOAD PHASE
      if (this.isCancelled) return;
      this.callbacks.onPhaseChange('upload');
      const uploadSpeed = await this.runUploadTest(8000, (currentMbps) => {
        this.callbacks.onProgress(finalMetrics, currentMbps);
      });
      finalMetrics.upload = uploadSpeed;
      this.callbacks.onProgress(finalMetrics, uploadSpeed);

      // COMPLETE
      if (this.isCancelled) return;
      this.callbacks.onPhaseChange('completed');
      this.callbacks.onComplete(finalMetrics);
    } catch (err: any) {
      if (!this.isCancelled) {
        this.callbacks.onPhaseChange('error');
        this.callbacks.onError(err?.message || 'An error occurred during speed test');
      }
    }
  }

  private async runPingTest(count: number): Promise<{ ping: number; jitter: number }> {
    const latencies: number[] = [];
    const serverParam = this.selectedServer?.id || 'auto';
    const extraOffset = this.selectedServer?.pingOffset || 0;

    for (let i = 0; i < count; i++) {
      if (this.isCancelled) break;
      const start = performance.now();
      try {
        const res = await fetch(`/api/speedtest/ping?server=${serverParam}&cb=${Date.now()}_${i}`, {
          cache: 'no-store',
        });
        await res.text();
        const end = performance.now();
        let latency = (end - start) + extraOffset;

        // Skip warmup (first ping)
        if (i > 0) {
          latencies.push(latency);
        }
      } catch (err) {
        // Skip failed ping
      }
      await new Promise((r) => setTimeout(r, 80));
    }

    if (latencies.length === 0) {
      return { ping: Math.round(15 + extraOffset), jitter: 2 };
    }

    latencies.sort((a, b) => a - b);
    const sum = latencies.reduce((a, b) => a + b, 0);
    const avgPing = Math.round(sum / latencies.length);

    let totalDiff = 0;
    for (let i = 1; i < latencies.length; i++) {
      totalDiff += Math.abs(latencies[i] - latencies[i - 1]);
    }
    const jitter = latencies.length > 1 ? Math.round(totalDiff / (latencies.length - 1)) : 1;

    return { ping: avgPing, jitter };
  }

  private async runDownloadTest(
    durationMs: number,
    onProgress: (mbps: number) => void
  ): Promise<number> {
    const startTime = performance.now();
    let totalBytes = 0;
    const concurrentStreams = 4;
    let activeStreams = 0;
    let smoothMbps = 0;

    const streamPromises: Promise<void>[] = [];
    const serverParam = this.selectedServer?.id || 'auto';

    const fetchStream = async (sizeMB: number) => {
      if (this.isCancelled) return;
      activeStreams++;
      try {
        const res = await fetch(`/api/speedtest/download?server=${serverParam}&size=${sizeMB}&cb=${Math.random()}`, {
          cache: 'no-store',
        });
        if (!res.body) return;

        const reader = res.body.getReader();
        while (!this.isCancelled) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            totalBytes += value.length;
            const elapsedSec = (performance.now() - startTime) / 1000;
            if (elapsedSec > 0.2) {
              const currentMbps = (totalBytes * 8) / (elapsedSec * 1_000_000);
              smoothMbps = smoothMbps === 0 ? currentMbps : smoothMbps * 0.7 + currentMbps * 0.3;
              onProgress(Math.round(smoothMbps * 10) / 10);
            }
          }
          if (performance.now() - startTime >= durationMs) {
            reader.cancel();
            break;
          }
        }
      } catch (e) {
        // Stream end or error
      } finally {
        activeStreams--;
      }
    };

    for (let i = 0; i < concurrentStreams; i++) {
      streamPromises.push(fetchStream(15));
    }

    while (performance.now() - startTime < durationMs && !this.isCancelled) {
      await new Promise((r) => setTimeout(r, 200));
      if (activeStreams < concurrentStreams && performance.now() - startTime < durationMs - 1000) {
        streamPromises.push(fetchStream(15));
      }
    }

    await Promise.allSettled(streamPromises);

    const totalElapsedSec = (performance.now() - startTime) / 1000;
    const finalMbps = totalElapsedSec > 0 ? (totalBytes * 8) / (totalElapsedSec * 1_000_000) : 0;
    return Math.round(finalMbps * 10) / 10;
  }

  private async runUploadTest(
    durationMs: number,
    onProgress: (mbps: number) => void
  ): Promise<number> {
    const startTime = performance.now();
    let totalUploadedBytes = 0;
    let smoothMbps = 0;

    const chunkSize = 2 * 1024 * 1024;
    const dummyBuffer = new Uint8Array(chunkSize);
    for (let i = 0; i < chunkSize; i++) {
      dummyBuffer[i] = Math.floor(Math.random() * 256);
    }
    const blob = new Blob([dummyBuffer], { type: 'application/octet-stream' });
    const serverParam = this.selectedServer?.id || 'auto';

    const uploadSingle = (): Promise<void> => {
      return new Promise((resolve) => {
        if (this.isCancelled) return resolve();

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `/api/speedtest/upload?server=${serverParam}&cb=${Math.random()}`, true);

        let prevLoaded = 0;
        xhr.upload.onprogress = (event) => {
          if (this.isCancelled) {
            xhr.abort();
            return resolve();
          }
          if (event.lengthComputable) {
            const diff = event.loaded - prevLoaded;
            prevLoaded = event.loaded;
            totalUploadedBytes += diff;

            const elapsedSec = (performance.now() - startTime) / 1000;
            if (elapsedSec > 0.2) {
              const currentMbps = (totalUploadedBytes * 8) / (elapsedSec * 1_000_000);
              smoothMbps = smoothMbps === 0 ? currentMbps : smoothMbps * 0.7 + currentMbps * 0.3;
              onProgress(Math.round(smoothMbps * 10) / 10);
            }
          }
        };

        xhr.onload = () => resolve();
        xhr.onerror = () => resolve();
        xhr.onabort = () => resolve();

        xhr.send(blob);
      });
    };

    const uploadPromises: Promise<void>[] = [];
    const maxConcurrent = 3;

    for (let i = 0; i < maxConcurrent; i++) {
      uploadPromises.push(uploadSingle());
    }

    while (performance.now() - startTime < durationMs && !this.isCancelled) {
      await new Promise((r) => setTimeout(r, 250));
      if (performance.now() - startTime < durationMs - 500) {
        uploadPromises.push(uploadSingle());
      }
    }

    await Promise.allSettled(uploadPromises);

    const totalElapsedSec = (performance.now() - startTime) / 1000;
    const finalMbps = totalElapsedSec > 0 ? (totalUploadedBytes * 8) / (totalElapsedSec * 1_000_000) : 0;
    return Math.round(finalMbps * 10) / 10;
  }
}
