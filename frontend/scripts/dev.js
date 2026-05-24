const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const backendDir = path.resolve(root, '..', 'java-backend');
const srcDir = path.join(root, 'src');
const isWindows = process.platform === 'win32';
const mvn = isWindows ? 'mvn.cmd' : 'mvn';
const VITE_PORT = 3000;
const BACKEND_PORT = 3001;

function killProcessOnPort(port) {
  if (!isWindows) return;
  try {
    const stdout = execSync(`netstat -ano | findstr :${port}`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
    const lines = stdout.split('\n');
    const pids = new Set();
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      // netstat output lines: TCP 0.0.0.0:3001 0.0.0.0:0 LISTENING 18864
      if (parts.length >= 5) {
        const pid = parts[parts.length - 1].trim();
        if (parseInt(pid, 10) > 0) {
          pids.add(pid);
        }
      }
    }
    for (const pid of pids) {
      console.log(`[dev] Terminating process PID ${pid} occupying port ${port}...`);
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
      } catch (e) {
        // ignore errors
      }
    }
  } catch (err) {
    // Port is free or netstat returned 1
  }
}

function runCopyAssets() {
  const scriptPath = path.resolve(__dirname, 'copy-assets.js');
  delete require.cache[scriptPath];
  require('./copy-assets.js');
}

function watchAssets() {
  const dirs = [
    path.join(srcDir, 'templates'),
    path.join(srcDir, 'static'),
  ];
  let timer;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log('\n[dev] Syncing template/static changes to backend...');
      runCopyAssets();
    }, 300);
  };
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    fs.watch(dir, { recursive: true }, schedule);
  }
}

function waitForBackend(maxAttempts = 90) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      const req = http.get(`http://127.0.0.1:${BACKEND_PORT}/`, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        attempts += 1;
        if (attempts >= maxAttempts) {
          reject(new Error(`Backend did not start on port ${BACKEND_PORT}`));
          return;
        }
        setTimeout(check, 1000);
      });
      req.setTimeout(2000, () => req.destroy());
    };
    check();
  });
}

function spawnProcess(command, args, cwd, label) {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: isWindows,
  });
  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`\n${label} stopped (exit ${code}).`);
    }
  });
  return child;
}

console.log('\nStarting Trip Management (React + Vite dev mode)\n');

// Clear ports 3000 and 3001 to resolve any orphaned processes holding locks
killProcessOnPort(VITE_PORT);
killProcessOnPort(BACKEND_PORT);

runCopyAssets();
watchAssets();

const backend = spawnProcess(mvn, ['spring-boot:run'], backendDir, 'Spring Boot');

let vite;
waitForBackend()
  .then(() => {
    const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
    vite = spawn(process.execPath, [viteBin], {
      cwd: root,
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' },
    });
    vite.on('exit', (code) => process.exit(code ?? 0));
  })
  .catch((err) => {
    console.error(err.message);
    if (backend && !backend.killed) backend.kill();
    process.exit(1);
  });

function shutdown() {
  if (vite && !vite.killed) vite.kill();
  if (backend && !backend.killed) backend.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

