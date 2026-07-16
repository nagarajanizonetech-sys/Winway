/**
 * backendWarmup.ts
 *
 * Silently wakes up the Render backend in the background.
 * The frontend NEVER blocks waiting for this — it fires and forgets.
 *
 * Strategy:
 * 1. On page load: ping /health immediately.
 * 2. If it fails (cold start), retry with increasing delays.
 * 3. Once alive, keep pinging every 14 min so it never sleeps again.
 */

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const HEALTH_URL = `${BACKEND_URL}/health`;

// Keep-alive interval: 14 min (Render sleeps after 15 min of inactivity)
const KEEP_ALIVE_INTERVAL_MS = 14 * 60 * 1000;

let keepAliveTimer: ReturnType<typeof setInterval> | null = null;
let warmupStarted = false;

/**
 * Pings /health once with a timeout.
 */
async function pingOnce(timeoutMs = 8000): Promise<boolean> {
  try {
    const res = await fetch(HEALTH_URL, {
      method: 'GET',
      signal: AbortSignal.timeout(timeoutMs),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Starts the background warmup + keep-alive.
 * Safe to call multiple times — only runs once.
 * DOES NOT block or return a promise you need to wait on.
 */
export function startBackgroundWarmup(): void {
  if (warmupStarted) return;
  warmupStarted = true;

  // Run entirely in the background — no await, no blocking
  runWarmup();
}

async function runWarmup(): Promise<void> {
  // Retry schedule (ms): fast first, then slower
  const retryDelays = [0, 3000, 6000, 10000, 15000];

  for (const delay of retryDelays) {
    if (delay > 0) await sleep(delay);

    const ok = await pingOnce();
    if (ok) {
      // Backend is up — start keep-alive and stop retrying
      startKeepAlive();
      return;
    }
  }

  // Even if all pings failed, still start keep-alive
  // so any future recovery is maintained
  startKeepAlive();
}

/**
 * Pings every 14 minutes to prevent Render from sleeping.
 * Safe to call multiple times — only one interval runs at a time.
 */
function startKeepAlive(): void {
  if (keepAliveTimer) return;
  keepAliveTimer = setInterval(() => {
    pingOnce().catch(() => {/* silent */});
  }, KEEP_ALIVE_INTERVAL_MS);
}

export function stopKeepAlive(): void {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

// Legacy export kept for compatibility — not used anymore
export type WarmupStatus = {
  phase: 'waking' | 'ready' | 'timeout';
  attempt: number;
};

export async function warmupBackend(
  _onStatusChange?: (status: WarmupStatus) => void
): Promise<void> {
  startBackgroundWarmup();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
