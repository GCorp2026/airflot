/**
 * Security headers middleware for the airflot app.
 * Applied globally via h3 middleware auto-registration (server/middleware/).
 *
 * All headers are stdlib-only, no external dependencies.
 */

/** Strict-Transport-Security: max-age=31536000; includeSubDomains */
const HSTS = "max-age=31536000; includeSubDomains";
const X_CONTENT_TYPE_OPTIONS = "nosniff";
const X_FRAME_OPTIONS = "DENY";
const REFERRER_POLICY = "strict-origin-when-cross-origin";
const PERMISSIONS_POLICY =
  "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=()";
const CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' data:; frame-ancestors 'none'";
const X_XSS_PROTECTION = "1; mode=block";

export const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": HSTS,
  "X-Content-Type-Options": X_CONTENT_TYPE_OPTIONS,
  "X-Frame-Options": X_FRAME_OPTIONS,
  "Referrer-Policy": REFERRER_POLICY,
  "Permissions-Policy": PERMISSIONS_POLICY,
  "Content-Security-Policy": CSP,
  "X-XSS-Protection": X_XSS_PROTECTION,
};

interface SecurityHeadersEvent {
  url: URL;
  req: { method: string; headers: Headers };
}

/**
 * h3 global middleware that injects security headers on every response.
 * Wraps the next() call and adds headers to the returned Response.
 */
export default async function securityHeadersMiddleware(
  event: SecurityHeadersEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const result = await next();

  if (result instanceof Response) {
    const headers = new Headers(result.headers);
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      if (!headers.has(key)) {
        headers.set(key, value);
      }
    }
    return new Response(result.body, {
      status: result.status,
      statusText: result.statusText,
      headers,
    });
  }

  return result;
}
