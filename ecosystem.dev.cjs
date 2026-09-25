// airflot dev pair — 3051/3052 (TanStack Start preview server)
module.exports = {
  apps: [
    { name: 'airflot-dev-pwa', cwd: '/mnt/HC_Volume_105866131/workspace/repos/airflot',
      script: 'node_modules/.bin/vite',
      args: 'preview --port 3051 --host 127.0.0.1',
      env: { PORT: '3051', HOST: '127.0.0.1', AIRFLOT_ENV: 'dev', NODE_ENV: 'production' },
      log_file: '/var/log/caddy/airflot-dev-pwa.log',
      out_file: '/var/log/caddy/airflot-dev-pwa.out',
      merge_logs: true, autorestart: true, max_restarts: 10,
      exp_backoff_restart_delay: 1000 },
  ],
};
