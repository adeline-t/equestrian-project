#!/bin/bash

OUTPUT_FILE="${1:-files_export.md}"

# Create or clear the output file
> "$OUTPUT_FILE"

# Add header
echo "# 📁 Project Files Export" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "Generated on: $(date)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Find all .js, .jsx, .css files recursively
find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.css" \) | sort | while read file; do
    # Get filename and relative path
    filename=$(basename "$file")
    filepath="${file#./}"
    
    echo "## 📄 $filename" >> "$OUTPUT_FILE"
    echo "**Path:** \`$filepath\`" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "\`\`\`" >> "$OUTPUT_FILE"
    cat "$file" >> "$OUTPUT_FILE"
    echo "\`\`\`" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
done

echo "✅ Export completed: $OUTPUT_FILE"
