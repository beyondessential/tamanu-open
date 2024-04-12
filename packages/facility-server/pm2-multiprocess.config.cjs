const memory = process.env.TAMANU_MEMORY_ALLOCATION || 8192;

module.exports = {
  apps: [
    {
      name: 'tamanu-api-server',
      cwd: '.', // IMPORTANT: Leave this as-is, for production build
      script: './dist/index.js',
      args: 'startApi',
      interpreter_args: `--max_old_space_size=${memory}`,
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'tamanu-tasks-runner',
      cwd: '.', // IMPORTANT: Leave this as-is, for production build
      script: './dist/index.js',
      args: 'startTasks',
      interpreter_args: `--max_old_space_size=${memory}`,
      instances: 1,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
