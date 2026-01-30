const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command, cwd) {
    console.log(`Running: ${command} in ${cwd}`);
    execSync(command, { cwd, stdio: 'inherit' });
}

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

// Clean dist
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// 1. Build User Website (Root)
console.log('--- Building User Website ---');
runCommand('npm run build', path.join(rootDir, 'frontend', 'user-website'));
// Copy to dist root
console.log('Copying User Website to dist root...');
fs.cpSync(path.join(rootDir, 'frontend', 'user-website', 'dist'), distDir, { recursive: true });

// 2. Build Vendor Dashboard
console.log('--- Building Vendor Dashboard ---');
runCommand('npm run build', path.join(rootDir, 'frontend', 'vendor-dashboard'));
// Copy to dist/vendor
const vendorDist = path.join(distDir, 'vendor');
fs.mkdirSync(vendorDist);
console.log('Copying Vendor Dashboard to dist/vendor...');
fs.cpSync(path.join(rootDir, 'frontend', 'vendor-dashboard', 'dist'), vendorDist, { recursive: true });

// 3. Build Admin Panel
console.log('--- Building Admin Panel ---');
runCommand('npm run build', path.join(rootDir, 'frontend', 'admin-panel'));
// Copy to dist/admin
const adminDist = path.join(distDir, 'admin');
fs.mkdirSync(adminDist);
console.log('Copying Admin Panel to dist/admin...');
fs.cpSync(path.join(rootDir, 'frontend', 'admin-panel', 'dist'), adminDist, { recursive: true });

console.log('--- ALL BUILDS COMPLETE ---');
