/**
 * Error handler middleware for the airflot app.
 * Catches unhandled errors and returns generic pages (no stack traces in prod).
 * Logs errors server-side only via console.error.
 */

const IS_PROD = process.env.NODE_ENV === "production";

interface ErrorHandlerEvent {
  url: URL;
  req: { method: string; headers: Headers };
}

interface ErrorPageOpts {
  status: number;
  title: string;
  message: string;
}

function errorPage({ status, title, message }: ErrorPageOpts): Response {
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

function htmlNotFound(): Response {
  return errorPage({
    status: 404,
    title: "Page Not Found",
    message: "The page you are looking for does not exist.",
  });
}

function htmlForbidden(): Response {
  return errorPage({
    status: 403,
    title: "Forbidden",
    message: "You do not have permission to access this resource.",
  });
}

function htmlTooMany(): Response {
  return errorPage({
    status: 429,
    title: "Too Many Requests",
    message: "You have sent too many requests. Please wait and try again.",
  });
}

function htmlServerError(): Response {
  return errorPage({
    status: 500,
    title: "Internal Server Error",
    message: "Something went wrong. Please try again later.",
  });
}

/**
 * h3 global error handler middleware.
 * Wraps next() in try/catch and logs errors without leaking details.
 */
export default async function errorHandlerMiddleware(
  _event: ErrorHandlerEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  try {
    return await next();
  } catch (err) {
    // Server-side logging only — never expose stack traces or framework info
    console.error("[security/error-handler]", new Date().toISOString(), err);

    if (IS_PROD) {
      return htmlServerError();
    }

    // In dev, include a minimal error message (still no stack trace)
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return errorPage({
      status: 500,
      title: "Internal Server Error",
      message,
    });
  }
}

export { htmlNotFound, htmlForbidden, htmlTooMany, htmlServerError };
