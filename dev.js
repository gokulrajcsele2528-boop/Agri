const { spawn } = require('child_process');

console.log('\x1b[36m%s\x1b[0m', '🚀 Starting AgriRoute NE Development Servers...\n');

const backend = spawn('npm', ['run', 'dev:backend'], {
  stdio: 'inherit',
  shell: true
});

const frontend = spawn('npm', ['run', 'dev:frontend'], {
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\nStopping servers...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
