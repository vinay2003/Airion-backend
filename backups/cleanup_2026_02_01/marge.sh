#!/bin/bash

# marge.sh - Merge all auth-related code into a single file for debugging
# Usage: ./marge.sh
# Output: merged_code.txt

OUTPUT_FILE="merged_code.txt"
FRONTEND_DIR="frontend/vendor-dashboard"

echo "=====================================" > $OUTPUT_FILE
echo "AIRION AUTH CODE - COMPLETE MERGE" >> $OUTPUT_FILE
echo "Generated: $(date)" >> $OUTPUT_FILE
echo "=====================================" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Function to add a file with header
add_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo "" >> $OUTPUT_FILE
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> $OUTPUT_FILE
        echo "FILE: $file" >> $OUTPUT_FILE
        echo "DESCRIPTION: $description" >> $OUTPUT_FILE
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> $OUTPUT_FILE
        echo "" >> $OUTPUT_FILE
        cat "$file" >> $OUTPUT_FILE
        echo "" >> $OUTPUT_FILE
        echo "✓ Added: $file"
    else
        echo "⚠ Skipped (not found): $file"
    fi
}

echo "Merging auth-related code..."
echo ""

# 1. ROUTING CONFIGURATION
echo "📁 Section 1: ROUTING CONFIGURATION"
add_file "$FRONTEND_DIR/src/App.tsx" "Main application with Router setup and basename configuration"
add_file "$FRONTEND_DIR/vite.config.ts" "Vite configuration including proxy settings"

# 2. AUTHENTICATION CONTEXT
echo ""
echo "📁 Section 2: AUTHENTICATION CONTEXT"
add_file "$FRONTEND_DIR/src/context/AuthContext.tsx" "Auth state management and checkAuth logic"

# 3. ROUTE PROTECTION
echo ""
echo "📁 Section 3: ROUTE PROTECTION"
add_file "$FRONTEND_DIR/src/components/ProtectedRoute.tsx" "Protected route wrapper with redirect logic"

# 4. AUTH PAGES
echo ""
echo "📁 Section 4: AUTH PAGES"
add_file "$FRONTEND_DIR/src/pages/VendorLogin.tsx" "Login page component"
add_file "$FRONTEND_DIR/src/pages/VendorSignup.tsx" "Signup page component"

# 5. API CONFIGURATION
echo ""
echo "📁 Section 5: API CONFIGURATION"
add_file "$FRONTEND_DIR/src/lib/api.ts" "Axios configuration and interceptors"

# 6. LAYOUT
echo ""
echo "📁 Section 6: LAYOUT"
add_file "$FRONTEND_DIR/src/components/Layout.tsx" "Main layout wrapper"
add_file "$FRONTEND_DIR/src/components/ErrorBoundary.tsx" "Error boundary component"

# 7. BACKEND AUTH
echo ""
echo "📁 Section 7: BACKEND AUTH"
add_file "src/auth/auth.controller.ts" "Backend auth controller"
add_file "src/auth/auth.service.ts" "Backend auth service"
add_file "src/auth/auth.module.ts" "Backend auth module"
add_file "src/auth/jwt.strategy.ts" "JWT authentication strategy"

# 8. BACKEND GUARDS
echo ""
echo "📁 Section 8: BACKEND GUARDS"
add_file "src/common/guards/jwt.guard.ts" "JWT guard"
add_file "src/common/guards/roles.guard.ts" "Roles guard"

# 9. BACKEND CONFIG
echo ""
echo "📁 Section 9: BACKEND CONFIGURATION"
add_file "src/main.ts" "Backend entry point with environment validation"
add_file "src/app.controller.ts" "Backend app controller with health check"
add_file "src/config/database.config.ts" "Database configuration"

# 10. ENVIRONMENT FILES
echo ""
echo "📁 Section 10: ENVIRONMENT CONFIGURATION"
add_file ".env" "Environment variables (SENSITIVE - Review before sharing!)"
add_file ".env.example" "Environment variables template"

# 11. PACKAGE.JSON
echo ""
echo "📁 Section 11: DEPENDENCIES"
add_file "$FRONTEND_DIR/package.json" "Frontend dependencies"
add_file "package.json" "Backend dependencies"

# Summary
echo "" >> $OUTPUT_FILE
echo "=====================================" >> $OUTPUT_FILE
echo "END OF MERGED CODE" >> $OUTPUT_FILE
echo "=====================================" >> $OUTPUT_FILE

echo ""
echo "✅ Merge complete!"
echo "📄 Output file: $OUTPUT_FILE"
echo ""
echo "To view the merged code:"
echo "  cat $OUTPUT_FILE"
echo ""
echo "To search for specific issues:"
echo "  grep -n 'Navigate' $OUTPUT_FILE"
echo "  grep -n 'navigate(' $OUTPUT_FILE"
echo "  grep -n 'basename' $OUTPUT_FILE"
echo ""
