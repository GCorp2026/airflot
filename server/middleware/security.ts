/**
 * Main security middleware for the airflot app.
 * Composes: bot blocking + rate limiting + security headers + error handling.
 * Auto-registered as h3 global middleware (Nitro scans server/middleware/).
 *
 * Stdlib-only — no external dependencies.
 */

import { checkRateLimit } from "./rate-limiter.js";
import { SECURITY_HEADERS } from "./security-headers.js";

/* ------------------------------------------------------------------ */
/*  1. AI bot / scraper blocking                                      */
/* ------------------------------------------------------------------ */

/** User-Agent substrings to block (case-insensitive match). */
const BLOCKED_BOTS = [
  "gptbot",
  "ccbot",
  "claudbot",
  "claudebot",
  "anthropic-ai",
  "perplexitybot",
  "bytespider",
  "amazonbot",
  "facebookbot",
  "meta-externalagent",
  "applebot",
  "youbot",
  "cohere-ai",
  "diffbot",
  "ia_archiver", // Internet Archive — block if undesired
  "omgili",      // AI scraper
  "scrapy",
];

function isBlockedBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const lower = userAgent.toLowerCase();
  return BLOCKED_BOTS.some((bot) => lower.includes(bot));
}

/* ------------------------------------------------------------------ */
/*  2. Error page helpers (inlined to avoid circular dep)             */
/* ------------------------------------------------------------------ */

function genericErrorPage(status: number, title: string, message: string): Response {
  const body = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:system-ui,-apple-system,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#0f172a;color:#e2e8f0}
    .card{text-align:center;padding:3rem;max-width:480px}
    h1{font-size:4rem;font-weight:700;color:#38bdf8;margin-bottom:1rem}
    p{font-size:1.125rem;color:#94a3b8;line-height:1.6}
    a{color:#38bdf8;text-decoration:none;margin-top:1.5rem;display:inline-block}
    a:hover{text-decoration:underline}
  </style>
</head>
<body>
  <div class="card">
    <h1>${status}</h1>
    <p>${message}</p>
    <a href="/">← Back to home</a>
  </div>
</body>
</html>`;
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

/* ------------------------------------------------------------------ */
/*  3. Middleware                                                      */
/* ------------------------------------------------------------------ */

interface SecurityEvent {
  url: URL;
  req: { method: string; headers: Headers };
}

export default async function securityMiddleware(
  event: SecurityEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const userAgent = event.req.headers.get("user-agent");
  const path = event.url.pathname;

  // ── Block AI bots / scrapers ──
  if (isBlockedBot(userAgent)) {
    return new Response("Access denied", { status: 403 });
  }

  // ── Rate limiting (before other processing) ──
  const blocked = checkRateLimit(event);
  if (blocked) return blocked;

  // ── Proceed to next middleware / route handler ──
  try {
    const result = await next();

    if (result instanceof Response) {
      // ── Inject security headers ──
      const headers = new Headers(result.headers);
      for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        if (!headers.has(key)) {
          headers.set(key, value);
        }
      }

      // Add rate-limit headers for API routes
      if (path.startsWith("/api/")) {
        headers.set("X-RateLimit-Limit", "100");
        headers.set(
          "X-RateLimit-Reset",
          String(Math.ceil(Date.now() / 1000) + 60),
        );
      }

      return new Response(result.body, {
        status: result.status,
        statusText: result.statusText,
        headers,
      });
    }

    return result;
  } catch (err) {
    // ── Error handler: log server-side, return generic page ──
    console.error(
      "[security]",
      new Date().toISOString(),
      event.req.method,
      path,
      err instanceof Error ? err.message : String(err),
    );

    // Never expose stack traces or framework details
    return genericErrorPage(
      500,
      "Internal Server Error",
      "Something went wrong. Please try again later.",
    );
  }
}
