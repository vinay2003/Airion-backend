#!/bin/bash

# Airion Backend - Render Deployment Verification Script
# This script checks if your backend is ready for deployment to Render

echo "🔍 Airion Backend - Deployment Verification"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check 1: package.json exists
echo "1️⃣  Checking package.json..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json found"
else
    echo -e "${RED}✗${NC} package.json not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 2: Required scripts in package.json
echo "2️⃣  Checking build scripts..."
if grep -q '"backend:build"' package.json; then
    echo -e "${GREEN}✓${NC} backend:build script found"
else
    echo -e "${RED}✗${NC} backend:build script missing"
    ERRORS=$((ERRORS + 1))
fi

if grep -q '"start"' package.json; then
    echo -e "${GREEN}✓${NC} start script found"
else
    echo -e "${RED}✗${NC} start script missing"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 3: TypeScript configuration
echo "3️⃣  Checking TypeScript configuration..."
if [ -f "tsconfig.json" ]; then
    echo -e "${GREEN}✓${NC} tsconfig.json found"
    
    if grep -q '"outDir"' tsconfig.json; then
        echo -e "${GREEN}✓${NC} outDir configured"
    else
        echo -e "${YELLOW}⚠${NC} outDir not found in tsconfig.json"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗${NC} tsconfig.json not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 4: Main entry file
echo "4️⃣  Checking main entry file..."
if [ -f "src/main.ts" ]; then
    echo -e "${GREEN}✓${NC} src/main.ts found"
else
    echo -e "${RED}✗${NC} src/main.ts not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 5: Environment example file
echo "5️⃣  Checking environment configuration..."
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC} .env.example found"
else
    echo -e "${YELLOW}⚠${NC} .env.example not found (recommended)"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠${NC} .env file found (should be in .gitignore)"
    if grep -q ".env" .gitignore 2>/dev/null; then
        echo -e "${GREEN}✓${NC} .env is in .gitignore"
    else
        echo -e "${RED}✗${NC} .env is NOT in .gitignore - SECURITY RISK!"
        ERRORS=$((ERRORS + 1))
    fi
fi
echo ""

# Check 6: .gitignore
echo "6️⃣  Checking .gitignore..."
if [ -f ".gitignore" ]; then
    echo -e "${GREEN}✓${NC} .gitignore found"
    
    if grep -q "node_modules" .gitignore; then
        echo -e "${GREEN}✓${NC} node_modules in .gitignore"
    else
        echo -e "${RED}✗${NC} node_modules NOT in .gitignore"
        ERRORS=$((ERRORS + 1))
    fi
    
    if grep -q "dist" .gitignore; then
        echo -e "${GREEN}✓${NC} dist in .gitignore"
    else
        echo -e "${YELLOW}⚠${NC} dist directory not in .gitignore"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠${NC} .gitignore not found"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check 7: Dependencies
echo "7️⃣  Checking critical dependencies..."
CRITICAL_DEPS=("@nestjs/core" "@nestjs/common" "@nestjs/typeorm" "typeorm" "pg")

for dep in "${CRITICAL_DEPS[@]}"; do
    if grep -q "\"$dep\"" package.json; then
        echo -e "${GREEN}✓${NC} $dep found"
    else
        echo -e "${RED}✗${NC} $dep missing"
        ERRORS=$((ERRORS + 1))
    fi
done
echo ""

# Check 8: Test build locally
echo "8️⃣  Testing local build..."
echo -e "${YELLOW}ℹ${NC} This will attempt to compile TypeScript..."

if command -v npm &> /dev/null; then
    echo "Running: npm run backend:build"
    if npm run backend:build &> /dev/null; then
        echo -e "${GREEN}✓${NC} Build succeeded"
        
        # Check if dist folder was created
        if [ -d "dist" ]; then
            echo -e "${GREEN}✓${NC} dist folder created"
            
            if [ -f "dist/src/main.js" ]; then
                echo -e "${GREEN}✓${NC} dist/src/main.js compiled"
            else
                echo -e "${RED}✗${NC} dist/src/main.js not found"
                ERRORS=$((ERRORS + 1))
            fi
        else
            echo -e "${RED}✗${NC} dist folder not created"
            ERRORS=$((ERRORS + 1))
        fi
    else
        echo -e "${RED}✗${NC} Build failed - check TypeScript errors"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}⚠${NC} npm not found - skipping build test"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check 9: Git status
echo "9️⃣  Checking Git status..."
if command -v git &> /dev/null; then
    if git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Git repository initialized"
        
        # Check if there are uncommitted changes
        if [ -z "$(git status --porcelain)" ]; then
            echo -e "${GREEN}✓${NC} No uncommitted changes"
        else
            echo -e "${YELLOW}⚠${NC} You have uncommitted changes"
            WARNINGS=$((WARNINGS + 1))
        fi
        
        # Check if remote is set
        if git remote -v | grep -q "origin"; then
            echo -e "${GREEN}✓${NC} Git remote configured"
            git remote -v | grep "origin" | head -1
        else
            echo -e "${RED}✗${NC} No Git remote configured"
            ERRORS=$((ERRORS + 1))
        fi
    else
        echo -e "${RED}✗${NC} Not a Git repository"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}⚠${NC} Git not found"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check 10: Render configuration
echo "🔟 Checking Render configuration..."
if [ -f "render.yaml" ]; then
    echo -e "${GREEN}✓${NC} render.yaml found"
else
    echo -e "${YELLOW}⚠${NC} render.yaml not found (optional but recommended)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Summary
echo "=========================================="
echo "📊 Verification Summary"
echo "=========================================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Perfect! Your backend is ready for deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub: git push origin main"
    echo "2. Go to https://dashboard.render.com"
    echo "3. Create a new Web Service"
    echo "4. Connect your GitHub repository"
    echo "5. Follow the deployment guide"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Ready with warnings: $WARNINGS warning(s)${NC}"
    echo ""
    echo "You can deploy, but consider fixing the warnings above."
    exit 0
else
    echo -e "${RED}❌ Not ready for deployment: $ERRORS error(s), $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please fix the errors above before deploying."
    exit 1
fi
