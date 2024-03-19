module.exports = {
  apps: [
    {
      name: 'nft-registry-api',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
      env_production: {
        NODE_ENV: 'test',
        PORT: 3000,
      },
    },
  ],
};
