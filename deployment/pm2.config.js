module.exports = {
  apps: [
    {
      name: 'premium-ludo-backend',
      script: 'backend/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: { NODE_ENV: 'production' },
    },
  ],
};
