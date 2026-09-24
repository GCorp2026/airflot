// airflot uat pair — 3061/3062 (seeded placeholder, 2026-09-24)
module.exports = {
  apps: [
    { name: 'airflot-uat-pwa', cwd: '/mnt/HC_Volume_105866131/workspace/repos/airflot',
      script: 'airflot-static.mjs',
      env: { PORT: '3061', HOST: '127.0.0.1', AIRFLOT_ENV: 'uat',
             STATIC_ROOT: '/mnt/HC_Volume_105866131/workspace/repos/airflot/public' },
      log_file: '/var/log/caddy/airflot-uat-pwa.log',
      out_file: '/var/log/caddy/airflot-uat-pwa.out',
      merge_logs: true, autorestart: true, max_restarts: 10,
      exp_backoff_restart_delay: 1000 },
    { name: 'airflot-uat-ssr', cwd: '/mnt/HC_Volume_105866131/workspace/repos/airflot',
      script: 'airflot-ssr.mjs',
      env: { PORT: '3062', HOST: '127.0.0.1', AIRFLOT_ENV: 'uat' },
      log_file: '/var/log/caddy/airflot-uat-ssr.log',
      out_file: '/var/log/caddy/airflot-uat-ssr.out',
      merge_logs: true, autorestart: true, max_restarts: 10,
      exp_backoff_restart_delay: 1000 },
  ],
};
