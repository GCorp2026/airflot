#!/usr/bin/env node
/**
 * airflot-static.mjs — minimal static file server for the airflot placeholder app.
 *
 * Serves ./public (STATIC_ROOT overridable) verbatim.
 * Any path without a file on disk proxies to the SSR process on PORT+1,
 * so pwa/ssr MUST stay adjacent pairs (3051/3052 dev, 3061/3062 uat).
 */
import { createServer, request as httpRequest } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PORT = Number(process.env.PORT || 3051);
const STATIC_ROOT = process.env.STATIC_ROOT || join(process.cwd(), "public");
const ENV = process.env.AIRFLOT_ENV || "dev";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

async function serveStatic(req, res) {
  const url = new URL(req.url, "http://x");
  let path = decodeURIComponent(url.pathname);
  if (path.endsWith("/")) path += "index.html";
  const full = normalize(join(STATIC_ROOT, path));
  if (!full.startsWith(STATIC_ROOT)) {
    res.writeHead(403).end("forbidden");
    return true;
  }
  try {
    const s = await stat(full);
    if (!s.isFile()) throw new Error("not file");
    const body = await readFile(full);
    res.writeHead(200, {
      "content-type": MIME[extname(full).toLowerCase()] || "application/octet-stream",
      "content-length": body.length,
      "cache-control": "public, max-age=600",
      "x-airflot-env": ENV,
      "x-airflot-served-by": "static",
    });
    res.end(body);
    return true;
  } catch {
    return false;
  }
}

function proxyToSsr(req, res) {
  const r = httpRequest(
    {
      host: "127.0.0.1",
      port: PORT + 1,
      path: req.url,
      method: req.method,
      headers: { ...req.headers, "x-forwarded-by": "airflot-static" },
    },
    (up) => {
      res.writeHead(up.statusCode || 502, up.headers);
      up.pipe(res);
    },
  );
  r.on("error", () => {
    res.writeHead(502, {
      "content-type": "text/plain",
      "x-airflot-env": ENV,
    });
    res.end(`airflot: SSR upstream unavailable (port ${PORT + 1})`);
  });
  if (req.method === "POST" || req.method === "PUT") req.pipe(r);
  else r.end();
}

createServer(async (req, res) => {
  try {
    if (req.url === "/health" || req.url === "/healthz") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: true, env: ENV, role: "pwa", port: PORT, pid: process.pid }));
      return;
    }
    const hit = await serveStatic(req, res);
    if (!hit) proxyToSsr(req, res);
  } catch (e) {
    res.writeHead(500).end("airflot static error: " + e.message);
  }
}).listen(PORT, "127.0.0.1", () => {
  console.log(`[airflot-static] env=${ENV} serving ${STATIC_ROOT} on 127.0.0.1:${PORT} -> ssr :${PORT + 1}`);
});
