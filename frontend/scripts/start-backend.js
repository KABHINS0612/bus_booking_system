const { spawn, execSync } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = 3001;
const backendDir = path.resolve(__dirname, '..', '..', 'java-backend');
const isWindows = process.platform === 'win32';
const mvn = isWindows ? 'mvn.cmd' : 'mvn';

function killProcessOnPort(port) {
  if (!isWindows) return;
  try {
    const stdout = execSync(`netstat -ano | findstr :${port}`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
    const lines = stdout.split('\n');
    const pids = new Set();
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5) {
        const pid = parts[parts.length - 1].trim();
        if (parseInt(pid, 10) > 0) {
          pids.add(pid);
        }
      }
    }
    for (const pid of pids) {
      console.log(`[backend] Terminating process PID ${pid} occupying port ${port}...`);
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
      } catch (e) {}
    }
  } catch (err) {}
}

console.log('\n========================================');
console.log('  Trip Management — backend only');
console.log(`  Website: http://localhost:${PORT}`);
console.log('  For Vite dev use: npm run dev  ->  http://localhost:3000');
console.log('========================================\n');

killProcessOnPort(PORT);

const child = spawn(mvn, ['spring-boot:run'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: isWindows,
});

child.on('exit', (code) => process.exit(code ?? 0));

process.on('SIGINT', () => {
  if (!child.killed) child.kill();
});

