/**
 * In-memory sliding-window rate limiter for the airflot app.
 * Stdlib-only — no external dependencies.
 *
 * Limits:
 *   - API routes:   100 requests/minute/IP
 *   - Auth routes:  30 requests/minute/IP
 *   - Other:        200 requests/minute/IP (generous default)
 *
 * Returns 429 with Retry-After header when exceeded.
 */

interface WindowEntry {
  count: number;
  windowStart: number;
}

interface RateLimiterEvent {
  url: URL;
  req: { method: string; headers: Headers };
}

/** Per-IP request windows. Evicted lazily on access. */
const windows = new Map<string, WindowEntry>();

const WINDOW_MS = 60_000; // 1 minute
const LIMIT_API = 100;
const LIMIT_AUTH = 30;
const LIMIT_DEFAULT = 200;

/** Paths that count against the stricter auth limit. */
const AUTH_PREFIXES = ["/login", "/auth", "/register", "/api/auth"];

/** Paths that count against the API limit. */
const API_PREFIXES = ["/api/"];

function getLimit(path: string): number {
  for (const prefix of AUTH_PREFIXES) {
    if (path.startsWith(prefix)) return LIMIT_AUTH;
  }
  for (const prefix of API_PREFIXES) {
    if (path.startsWith(prefix)) return LIMIT_API;
  }
  return LIMIT_DEFAULT;
}

function clientIp(event: RateLimiterEvent): string {
  return (
    event.req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    event.req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * Check rate limit for the current request. Returns null if allowed,
 * or a Response with 429 + Retry-After if exceeded.
 */
export function checkRateLimit(
  event: RateLimiterEvent,
): Response | null {
  const ip = clientIp(event);
  const path = event.url.pathname;
  const limit = getLimit(path);
  const now = Date.now();

  // Evict stale windows older than 2× the window
  for (const [key, entry] of windows) {
    if (now - entry.windowStart > WINDOW_MS * 2) {
      windows.delete(key);
    }
  }

  const key = `${ip}:${path}`;
  const entry = windows.get(key);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    // Start a new window
    windows.set(key, { count: 1, windowStart: now });
    return null;
  }

  entry.count++;

  if (entry.count > limit) {
    const retryAfter = Math.ceil(
      (entry.windowStart + WINDOW_MS - now) / 1000,
    );
    return new Response(
      JSON.stringify({
        error: "Too Many Requests",
        message: `Rate limit of ${limit} requests per minute exceeded.`,
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(
            Math.ceil((entry.windowStart + WINDOW_MS) / 1000),
          ),
        },
      },
    );
  }

  return null; // Allowed
}

/**
 * h3 global middleware that enforces rate limits on every request.
 */
export default async function rateLimiterMiddleware(
  event: RateLimiterEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const blocked = checkRateLimit(event);
  if (blocked) return blocked;

  return next();
}
