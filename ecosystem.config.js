// Configuración para correr pm2 en el VPS
module.exports = {
  apps: [
    {
      name: 'esde',
      script: 'bun',
      args: 'bin/www',
      cwd: '/home/vlad/elsilenciodondeescucho/',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
