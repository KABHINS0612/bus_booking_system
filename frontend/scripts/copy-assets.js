const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source not found: ${src}`);
    process.exit(1);
  }
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const repoRoot = path.resolve(__dirname, '..');
const frontendDir = path.join(repoRoot);
const backendResources = path.join(repoRoot, '..', 'java-backend', 'src', 'main', 'resources');
const srcDir = path.join(frontendDir, 'src');
const distDir = path.join(frontendDir, 'dist');

const templatesSrc = path.join(srcDir, 'templates');
const staticSrc = path.join(srcDir, 'static');
const templatesDest = path.join(backendResources, 'templates');
const staticDest = path.join(backendResources, 'static');

console.log('Copying Thymeleaf templates:', templatesSrc, '->', templatesDest);
copyDir(templatesSrc, templatesDest);

console.log('Copying static assets:', staticSrc, '->', staticDest);
copyDir(staticSrc, staticDest);

// Optional: merge Vite build output into static/assets without replacing server templates
const distAssets = path.join(distDir, 'assets');
if (fs.existsSync(distAssets)) {
  const viteAssetsDest = path.join(staticDest, 'assets');
  console.log('Merging Vite assets:', distAssets, '->', viteAssetsDest);
  copyDir(distAssets, viteAssetsDest);
}

console.log('Frontend assets synced to backend resources.');
