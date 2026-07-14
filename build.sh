#!/bin/bash
set -e  # Exit immediately on any error

echo "========================================="
echo "  AIRION FULL BUILD SCRIPT"
echo "========================================="

# Clean all previous build artifacts to ensure fresh build
echo ""
echo ">>> Cleaning previous build artifacts..."
rm -rf dist
rm -rf apps/user-website/dist
rm -rf apps/vendor-dashboard/dist
rm -rf apps/admin-panel/dist
echo ">>> Clean DONE"

# Build user-website
echo ""
echo ">>> [1/3] Building user-website..."
cd apps/user-website
npm run build
cd ../..
echo ">>> [1/3] user-website DONE"

# Build vendor-dashboard
echo ""
echo ">>> [2/3] Building vendor-dashboard..."
cd apps/vendor-dashboard
npm run build
cd ../..
echo ">>> [2/3] vendor-dashboard DONE"

# Build admin-panel
echo ""
echo ">>> [3/3] Building admin-panel..."
cd apps/admin-panel
npm run build
cd ../..
echo ">>> [3/3] admin-panel DONE"

# Assemble final dist folder
echo ""
echo ">>> Assembling final dist folder..."
rm -rf dist
mkdir -p dist/vendor dist/admin

cp -r apps/user-website/dist/. dist/
cp -r apps/vendor-dashboard/dist/. dist/vendor/
cp -r apps/admin-panel/dist/. dist/admin/

echo ""
echo ">>> Final dist structure:"
ls -la dist/
echo ""
echo ">>> dist/vendor:"
ls dist/vendor/ | head -5
echo ""
echo ">>> dist/admin:"
ls dist/admin/ | head -5

echo ""
echo "========================================="
echo "  BUILD COMPLETE!"
echo "========================================="
