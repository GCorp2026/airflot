// airflot dev pair — 3051/3052 (seeded placeholder, 2026-09-24)
module.exports = {
  apps: [
    { name: 'airflot-dev-pwa', cwd: '/mnt/HC_Volume_105866131/workspace/repos/airflot',
      script: 'airflot-static.mjs',
      env: { PORT: '3051', HOST: '127.0.0.1', AIRFLOT_ENV: 'dev',
             STATIC_ROOT: '/mnt/HC_Volume_105866131/workspace/repos/airflot/public' },
      log_file: '/var/log/caddy/airflot-dev-pwa.log',
      out_file: '/var/log/caddy/airflot-dev-pwa.out',
      merge_logs: true, autorestart: true, max_restarts: 10,
      exp_backoff_restart_delay: 1000 },
    { name: 'airflot-dev-ssr', cwd: '/mnt/HC_Volume_105866131/workspace/repos/airflot',
      script: 'airflot-ssr.mjs',
      env: { PORT: '3052', HOST: '127.0.0.1', AIRFLOT_ENV: 'dev' },
      log_file: '/var/log/caddy/airflot-dev-ssr.log',
      out_file: '/var/log/caddy/airflot-dev-ssr.out',
      merge_logs: true, autorestart: true, max_restarts: 10,
      exp_backoff_restart_delay: 1000 },
  ],
};
