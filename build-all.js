const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command, cwd) {
    console.log(`\n📦 Running: ${command}\n   in: ${cwd}`);
    try {
        execSync(command, { cwd, stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error(`❌ Command failed: ${command}`);
        return false;
    }
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function getDirectorySize(dirPath) {
    if (!fs.existsSync(dirPath)) return 0;

    let totalSize = 0;
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            totalSize += getDirectorySize(filePath);
        } else {
            totalSize += stats.size;
        }
    });

    return totalSize;
}

function createEnvFile(directory, content) {
    const envPath = path.join(directory, '.env');
    fs.writeFileSync(envPath, content, 'utf8');
    console.log(`✅ Created .env file in ${path.basename(directory)}`);
}

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');
const backendDir = path.join(rootDir, 'backend');

console.log('='.repeat(60));
console.log('🚀 AIRION PRODUCTION BUILD - MONOREPO');
console.log('='.repeat(60));

// Step 1: Clean dist
console.log('\n📂 Step 1: Cleaning dist directory...');
if (fs.existsSync(distDir)) {
    const oldSize = getDirectorySize(distDir);
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log(`   Removed old dist: ${formatBytes(oldSize)}`);
}
fs.mkdirSync(distDir);
console.log('✅ Dist directory cleaned');

// Step 2: Sync VITE_API_URL for Production
console.log('\n🔧 Step 2: Syncing VITE_API_URL to production backend...');
const PRODUCTION_API_URL = process.env.VITE_API_URL || 'https://airion-backend.onrender.com';
const envContent = `VITE_API_URL=${PRODUCTION_API_URL}\n`;

const frontendApps = [
    { path: path.join(rootDir, 'frontend', 'user-website'), name: 'User Website' },
    { path: path.join(rootDir, 'frontend', 'vendor-dashboard'), name: 'Vendor Dashboard' },
    { path: path.join(rootDir, 'frontend', 'admin-panel'), name: 'Admin Panel' },
];

frontendApps.forEach(app => {
    createEnvFile(app.path, envContent);
});

console.log(`✅ All frontends configured with: ${PRODUCTION_API_URL}`);

// Step 3: Build User Website (Root)
console.log('\n🏗️  Step 3: Building User Website...');
const userWebsitePath = path.join(rootDir, 'frontend', 'user-website');
if (!runCommand('npm run build', userWebsitePath)) {
    console.error('❌ User Website build failed');
    process.exit(1);
}

console.log('📤 Copying User Website to dist root...');
const userDist = path.join(userWebsitePath, 'dist');
fs.cpSync(userDist, distDir, { recursive: true });
const userSize = getDirectorySize(userDist);
console.log(`✅ User Website built: ${formatBytes(userSize)}`);

// Step 4: Build Vendor Dashboard
console.log('\n🏗️  Step 4: Building Vendor Dashboard...');
const vendorDashboardPath = path.join(rootDir, 'frontend', 'vendor-dashboard');
if (!runCommand('npm run build', vendorDashboardPath)) {
    console.error('❌ Vendor Dashboard build failed');
    process.exit(1);
}

const vendorDist = path.join(distDir, 'vendor');
fs.mkdirSync(vendorDist);
console.log('📤 Copying Vendor Dashboard to dist/vendor...');
const vendorSourceDist = path.join(vendorDashboardPath, 'dist');
fs.cpSync(vendorSourceDist, vendorDist, { recursive: true });
const vendorSize = getDirectorySize(vendorSourceDist);
console.log(`✅ Vendor Dashboard built: ${formatBytes(vendorSize)}`);

// Step 5: Build Admin Panel
console.log('\n🏗️  Step 5: Building Admin Panel...');
const adminPanelPath = path.join(rootDir, 'frontend', 'admin-panel');
if (!runCommand('npm run build', adminPanelPath)) {
    console.error('❌ Admin Panel build failed');
    process.exit(1);
}

const adminDist = path.join(distDir, 'admin');
fs.mkdirSync(adminDist);
console.log('📤 Copying Admin Panel to dist/admin...');
const adminSourceDist = path.join(adminPanelPath, 'dist');
fs.cpSync(adminSourceDist, adminDist, { recursive: true });
const adminSize = getDirectorySize(adminSourceDist);
console.log(`✅ Admin Panel built: ${formatBytes(adminSize)}`);

// Step 6: Cleanup redundant backend folder (if exists)
console.log('\n🧹 Step 6: Cleaning up redundant backend folder...');
if (fs.existsSync(backendDir)) {
    const backendSize = getDirectorySize(backendDir);
    fs.rmSync(backendDir, { recursive: true, force: true });
    console.log(`✅ Removed backend/ folder: ${formatBytes(backendSize)} saved`);
} else {
    console.log('   No backend/ folder found - skipping');
}

// Final Summary
console.log('\n' + '='.repeat(60));
console.log('✅ ALL BUILDS COMPLETE');
console.log('='.repeat(60));

const finalDistSize = getDirectorySize(distDir);
console.log(`\n📊 Build Summary:`);
console.log(`   User Website:     ${formatBytes(userSize)}`);
console.log(`   Vendor Dashboard: ${formatBytes(vendorSize)}`);
console.log(`   Admin Panel:      ${formatBytes(adminSize)}`);
console.log(`   ` + '-'.repeat(40));
console.log(`   Total dist size:  ${formatBytes(finalDistSize)}`);
console.log(`\n🎯 API Endpoint: ${PRODUCTION_API_URL}`);
console.log(`📁 Output directory: ${distDir}\n`);
