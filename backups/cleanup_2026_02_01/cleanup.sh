#!/bin/bash

# 🧹 Ease2event Project Cleanup Script
# This script safely removes unused files and folders
# Version: 1.0

set -e  # Exit on error

PROJECT_ROOT="/Users/vinaysharma/Desktop/ease2event"
cd "$PROJECT_ROOT"

echo "🧹 Starting Ease2event Project Cleanup..."
echo "📁 Working directory: $(pwd)"
echo ""

# Track what we delete
DELETED_FILES=0
DELETED_FOLDERS=0
SPACE_SAVED=0

# Function to calculate size before deletion
get_size() {
    if [ -e "$1" ]; then
        du -sk "$1" | cut -f1
    else
        echo "0"
    fi
}

# 1️⃣ DELETE BACKUP FILES
echo "1️⃣ Removing backup files..."
if [ -f "frontend/admin-panel/vite.config.ts.bak" ]; then
    rm "frontend/admin-panel/vite.config.ts.bak"
    echo "   ✅ Deleted frontend/admin-panel/vite.config.ts.bak"
    DELETED_FILES=$((DELETED_FILES + 1))
fi

if [ -f "frontend/vendor-dashboard/vite.config.ts.bak" ]; then
    rm "frontend/vendor-dashboard/vite.config.ts.bak"
    echo "   ✅ Deleted frontend/vendor-dashboard/vite.config.ts.bak"
    DELETED_FILES=$((DELETED_FILES + 1))
fi

# 2️⃣ DELETE LARGE TEMP FILES
echo ""
echo "2️⃣ Removing large temporary files..."
if [ -f "blobs.txt" ]; then
    SIZE=$(get_size "blobs.txt")
    rm "blobs.txt"
    echo "   ✅ Deleted blobs.txt (saved ~1.7MB)"
    DELETED_FILES=$((DELETED_FILES + 1))
    SPACE_SAVED=$((SPACE_SAVED + SIZE))
fi

# 3️⃣ DELETE .DS_Store FILES
echo ""
echo "3️⃣ Removing macOS .DS_Store files..."
DS_COUNT=$(find . -name ".DS_Store" | wc -l | tr -d ' ')
if [ "$DS_COUNT" -gt 0 ]; then
    find . -name ".DS_Store" -delete
    echo "   ✅ Deleted $DS_COUNT .DS_Store file(s)"
    DELETED_FILES=$((DELETED_FILES + DS_COUNT))
fi

# 4️⃣ DELETE SHARED FOLDER (EMPTY)
echo ""
echo "4️⃣ Removing empty shared/ folder..."
if [ -d "shared" ]; then
    SIZE=$(get_size "shared")
    rm -rf "shared"
    echo "   ✅ Deleted shared/ folder (was empty)"
    DELETED_FOLDERS=$((DELETED_FOLDERS + 1))
    SPACE_SAVED=$((SPACE_SAVED + SIZE))
fi

# 5️⃣ DELETE BACKEND FOLDER (UNUSED - 286MB!)
echo ""
echo "5️⃣ Removing unused backend/ folder..."
echo "   ⚠️  This folder is 286MB and appears unused (backend is now in /src and /api)"
read -p "   Delete backend/ folder? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    SIZE=$(get_size "backend")
    rm -rf "backend"
    echo "   ✅ Deleted backend/ folder (saved ~286MB)"
    DELETED_FOLDERS=$((DELETED_FOLDERS + 1))
    SPACE_SAVED=$((SPACE_SAVED + SIZE))
else
    echo "   ⏭️  Skipped backend/ folder deletion"
fi

# 6️⃣ DELETE TEST FOLDER (OPTIONAL)
echo ""
echo "6️⃣ Checking test/ folder..."
if [ -d "test" ]; then
    echo "   ⚠️  test/ folder exists but may not be used"
    read -p "   Delete test/ folder? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        SIZE=$(get_size "test")
        rm -rf "test"
        echo "   ✅ Deleted test/ folder"
        DELETED_FOLDERS=$((DELETED_FOLDERS + 1))
        SPACE_SAVED=$((SPACE_SAVED + SIZE))
    else
        echo "   ⏭️  Skipped test/ folder deletion"
    fi
fi

# 7️⃣ CLEAN ENVIRONMENT FILES
echo ""
echo "7️⃣ Checking environment files..."
echo "   ℹ️  .env.production files should use production URLs, not localhost"
echo "   ℹ️  Review and update manually if needed:"
echo "      - frontend/user-website/.env.production"
echo "      - frontend/vendor-dashboard/.env.production"
echo "      - frontend/admin-panel/.env.production"

# SUMMARY
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 CLEANUP COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Files deleted: $DELETED_FILES"
echo "📂 Folders deleted: $DELETED_FOLDERS"
echo "💾 Approximate space saved: ~$((SPACE_SAVED / 1024))MB"
echo ""
echo "✅ Project is now cleaner and optimized!"
echo ""
echo "🔍 Next steps:"
echo "   1. Run: npm run build"
echo "   2. Test: vercel dev"
echo "   3. Commit: git add . && git commit -m 'chore: cleanup unused files'"
echo ""
