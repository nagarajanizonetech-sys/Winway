/**
 * backendWarmup.ts
 *
 * Solves Render free-tier cold start delays:
 * 1. Pings /health on app load to wake up the backend immediately.
 * 2. Sets up a keep-alive interval every 14 minutes so the backend
 *    never goes idle while the user is on the site.
 */

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const HEALTH_URL = `${BACKEND_URL}/health`;

// Keep-alive interval: 14 min (Render spins down after 15 min of inactivity)
const KEEP_ALIVE_INTERVAL_MS = 14 * 60 * 1000;

let keepAliveTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Pings the backend /health endpoint.
 * Returns true if the backend responded successfully.
 */
export async function pingBackend(): Promise<boolean> {
  try {
    const res = await fetch(HEALTH_URL, {
      method: 'GET',
      signal: AbortSignal.timeout(30_000), // 30s timeout
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Warms up the backend on page load.
 * Resolves once the backend is ready (or after timeout).
 */
export async function warmupBackend(
  onStatusChange?: (status: WarmupStatus) => void
): Promise<void> {
  onStatusChange?.({ phase: 'waking', attempt: 1 });

  const MAX_ATTEMPTS = 6;
  const RETRY_DELAY_MS = 5_000;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    onStatusChange?.({ phase: 'waking', attempt });
    const ok = await pingBackend();
    if (ok) {
      onStatusChange?.({ phase: 'ready', attempt });
      startKeepAlive();
      return;
    }
    if (attempt < MAX_ATTEMPTS) {
      await sleep(RETRY_DELAY_MS);
    }
  }

  // Give up — app will show normally; requests may still fail briefly
  onStatusChange?.({ phase: 'timeout', attempt: MAX_ATTEMPTS });
  startKeepAlive();
}

/**
 * Starts pinging the backend every 14 minutes to prevent cold starts.
 * Safe to call multiple times — only one interval runs at a time.
 */
export function startKeepAlive(): void {
  if (keepAliveTimer) return;
  keepAliveTimer = setInterval(() => {
    pingBackend().catch(() => {/* silent */});
  }, KEEP_ALIVE_INTERVAL_MS);
}

export function stopKeepAlive(): void {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

export interface WarmupStatus {
  phase: 'waking' | 'ready' | 'timeout';
  attempt: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
