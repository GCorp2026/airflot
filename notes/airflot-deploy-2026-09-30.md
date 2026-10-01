# airflot deploy verified — 2026-09-30

Live at https://dev-airflot.dzenfoto.com/ (HTTP 200).
Verified via sales-deploy-provision-verify (ok=True, all 6 core checks green).
Recovery was: pm2 start vite with explicit --name/--cwd/--interpreter=none + caddy reload
after disk mtime > caddy process start. See oracle_epics epic-strikeball-batch-2026-09-30.
