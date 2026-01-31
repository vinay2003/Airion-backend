#!/bin/bash

# Script to merge all codebase files into a single file with comments
# Usage: ./merge-codebase.sh [output_file] [source_directory]

# Configuration
OUTPUT_FILE="${1:-merged-codebase.txt}"
SOURCE_DIR="${2:-.}"
SEPARATOR="=================================================================================="

# File extensions to include
EXTENSIONS=(
    "*.ts" "*.tsx" "*.js" "*.jsx"
    "*.json" "*.html" "*.css" "*.scss"
    "*.sh" "*.md" "*.env*" "*.yaml" "*.yml"
    "*.sql" "*.prisma"
)

# Directories to exclude
EXCLUDE_DIRS=(
    "node_modules"
    "dist"
    "build"
    ".git"
    ".next"
    "coverage"
    ".vscode"
    ".idea"
    "*.log"
    ".DS_Store"
)

# Create exclude pattern for find command
EXCLUDE_PATTERN=""
for dir in "${EXCLUDE_DIRS[@]}"; do
    EXCLUDE_PATTERN="$EXCLUDE_PATTERN -not -path '*/$dir/*'"
done

# Build find command for extensions
FIND_PATTERN=""
for ext in "${EXTENSIONS[@]}"; do
    if [ -z "$FIND_PATTERN" ]; then
        FIND_PATTERN="-name '$ext'"
    else
        FIND_PATTERN="$FIND_PATTERN -o -name '$ext'"
    fi
done

echo "Merging codebase from: $SOURCE_DIR"
echo "Output file: $OUTPUT_FILE"
echo ""

# Clear/create output file
cat /dev/null > "$OUTPUT_FILE"

# Add header
cat >> "$OUTPUT_FILE" << EOF
$SEPARATOR
MERGED CODEBASE - Generated on $(date)
Source Directory: $(cd "$SOURCE_DIR" && pwd)
$SEPARATOR

EOF

# Counter for files processed
file_count=0

# Find and process files
eval "find '$SOURCE_DIR' -type f \( $FIND_PATTERN \) $EXCLUDE_PATTERN" | sort | while read -r file; do
    # Get relative path
    rel_path="${file#$SOURCE_DIR/}"
    
    # Skip the output file itself
    if [[ "$file" == *"$OUTPUT_FILE"* ]]; then
        continue
    fi
    
    # Add file header
    echo "" >> "$OUTPUT_FILE"
    echo "$SEPARATOR" >> "$OUTPUT_FILE"
    echo "FILE: $rel_path" >> "$OUTPUT_FILE"
    echo "$SEPARATOR" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    # Append file content
    cat "$file" >> "$OUTPUT_FILE"
    
    # Add file footer
    echo "" >> "$OUTPUT_FILE"
    echo "// END OF FILE: $rel_path" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    ((file_count++))
    echo "Processed: $rel_path"
done

# Add footer
cat >> "$OUTPUT_FILE" << EOF

$SEPARATOR
MERGE COMPLETE
Total files merged: $file_count
Generated: $(date)
$SEPARATOR
EOF

echo ""
echo "✓ Merge complete!"
echo "✓ Total files processed: $file_count"
echo "✓ Output saved to: $OUTPUT_FILE"
echo ""
echo "You can now review the merged file:"
echo "  cat $OUTPUT_FILE"
echo "  less $OUTPUT_FILE"
echo "  code $OUTPUT_FILE"
