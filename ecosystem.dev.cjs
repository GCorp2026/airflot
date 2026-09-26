// airflot dev — port 3051 (TanStack Start dev server)
module.exports = {
  apps: [
    { name: 'airflot-dev', cwd: '/mnt/HC_Volume_105866131/.openclaw/workspace/repos/airflot',
      script: 'node_modules/.bin/vite',
      args: 'dev --host 0.0.0.0 --port 3051',
      env: { PORT: '3051', HOST: '0.0.0.0', AIRFLOT_ENV: 'dev', NODE_ENV: 'development' },
      log_file: '/var/log/caddy/airflot-dev.log',
      out_file: '/var/log/caddy/airflot-dev.out',
      merge_logs: true, autorestart: true, max_restarts: 10,
      exp_backoff_restart_delay: 1000 },
  ],
};
