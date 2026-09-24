#!/usr/bin/env node
/**
 * airflot-ssr.mjs — minimal SSR placeholder for airflot.
 * Renders an env-tagged HTML page for any path the static server can't serve.
 */
import { createServer } from "node:http";

const PORT = Number(process.env.PORT || 3052);
const ENV = process.env.AIRFLOT_ENV || "dev";
const started = Date.now();

function page(req) {
  return `<!DOCTYPE html>
<html lang="ru"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>airflot — ${ENV} placeholder</title>
<style>
 body{margin:0;font-family:system-ui,sans-serif;background:#0b1220;color:#e6edf7;
      display:grid;place-items:center;min-height:100vh}
 .card{max-width:640px;padding:2rem 2.5rem;border:1px solid #22304d;border-radius:16px;
       background:#111a2e;box-shadow:0 10px 40px rgba(0,0,0,.5)}
 h1{margin:0 0 .25rem;font-size:2rem}
 .env{display:inline-block;padding:.15rem .6rem;border-radius:999px;font-size:.8rem;
      background:${ENV === "uat" ? "#3b2f66" : "#1d4032"};color:#cfe8ff;margin-bottom:1rem}
 code{background:#0a1120;padding:.1rem .4rem;border-radius:6px}
 dl{display:grid;grid-template-columns:auto 1fr;gap:.35rem 1rem;margin:1.25rem 0 0;font-size:.9rem}
 dt{color:#8aa0c8}dd{margin:0}
 footer{margin-top:1.25rem;font-size:.75rem;color:#5f7396}
</style></head>
<body><div class="card">
  <span class="env">${ENV.toUpperCase()}</span>
  <h1>airflot</h1>
  <p>Minimal placeholder app — seeded so the ${ENV} pm2 pair has something real to serve.
     Replace this SSR renderer with the real app when it lands.</p>
  <dl>
    <dt>path</dt><dd><code>${req.url}</code></dd>
    <dt>role</dt><dd>ssr (port ${PORT})</dd>
    <dt>pid</dt><dd>${process.pid}</dd>
    <dt>uptime</dt><dd>${Math.round((Date.now() - started) / 1000)}s</dd>
  </dl>
  <footer>airflot placeholder · static on :${PORT - 1} proxies here</footer>
</div></body></html>`;
}

createServer((req, res) => {
  if (req.url === "/health" || req.url === "/healthz") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true, env: ENV, role: "ssr", port: PORT, pid: process.pid }));
    return;
  }
  const body = page(req);
  res.writeHead(200, {
    "content-type": "text/html; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "x-airflot-env": ENV,
    "x-airflot-served-by": "ssr",
  });
  res.end(body);
}).listen(PORT, "127.0.0.1", () => {
  console.log(`[airflot-ssr] env=${ENV} placeholder SSR listening on 127.0.0.1:${PORT}`);
});
