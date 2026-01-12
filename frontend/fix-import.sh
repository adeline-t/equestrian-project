#!/bin/bash

# Complete Recursive Import Path Validator and Fixer v5.9
# FIXED: Better handling of multiple files with same name

set -e

# Configuration
PROJECT_ROOT="${1:-.}"
REPORT_FILE="import_validation_report.txt"
FAILED_IMPORTS_FILE="failed_imports.txt"
FIXED_IMPORTS_FILE="fixed_imports.txt"
OUTDATED_IMPORTS_FILE="outdated_imports.txt"
DEBUG_LOG_FILE="import_debug.log"
CLEANUP_MODE="${2:-false}"
INTERACTIVE_MODE="${3:-false}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Counters
COUNTER_DIR=$(mktemp -d)
trap "rm -rf $COUNTER_DIR" EXIT

init_counters() {
    echo "0" > "$COUNTER_DIR/total_scanned"
    echo "0" > "$COUNTER_DIR/total_imports"
    echo "0" > "$COUNTER_DIR/valid_imports"
    echo "0" > "$COUNTER_DIR/failed_imports"
    echo "0" > "$COUNTER_DIR/auto_fixed"
    echo "0" > "$COUNTER_DIR/manual_review"
    echo "0" > "$COUNTER_DIR/outdated_imports"
    echo "0" > "$COUNTER_DIR/broken_imports"
}

increment_counter() {
    local counter_name="$1"
    local counter_file="$COUNTER_DIR/$counter_name"
    local current=$(cat "$counter_file" 2>/dev/null || echo "0")
    echo $((current + 1)) > "$counter_file"
}

get_counter() {
    local counter_name="$1"
    local counter_file="$COUNTER_DIR/$counter_name"
    cat "$counter_file" 2>/dev/null || echo "0"
}

init_counters

> "$REPORT_FILE"
> "$FAILED_IMPORTS_FILE"
> "$FIXED_IMPORTS_FILE"
> "$OUTDATED_IMPORTS_FILE"
> "$DEBUG_LOG_FILE"

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$REPORT_FILE"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1" | tee -a "$REPORT_FILE"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1" | tee -a "$REPORT_FILE"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1" | tee -a "$REPORT_FILE"
}

log_debug() {
    if [ "$DEBUG" = "true" ]; then
        echo -e "${CYAN}[DEBUG]${NC} $1"
    fi
}

log_found() {
    echo -e "${MAGENTA}[FOUND]${NC} $1" | tee -a "$REPORT_FILE"
}

log_outdated() {
    echo -e "${YELLOW}[OUTDATED]${NC} $1" | tee -a "$REPORT_FILE"
}

log_to_debug() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$DEBUG_LOG_FILE"
}

export -f log_info log_success log_error log_warning log_debug log_found log_outdated log_to_debug
export -f increment_counter get_counter
export COUNTER_DIR REPORT_FILE FIXED_IMPORTS_FILE OUTDATED_IMPORTS_FILE FAILED_IMPORTS_FILE DEBUG_LOG_FILE
export RED GREEN YELLOW BLUE CYAN MAGENTA NC

# Find all JS/JSX/TS/TSX files RECURSIVELY
find_js_files() {
    find "$PROJECT_ROOT" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) \
        ! -path "*/node_modules/*" \
        ! -path "*/.next/*" \
        ! -path "*/dist/*" \
        ! -path "*/build/*" \
        ! -path "*/.git/*" \
        ! -path "*/coverage/*" \
        ! -path "*/.vscode/*" \
        ! -path "*/out/*" \
        ! -path "*/.turbo/*" \
        ! -path "*/.idea/*" \
        ! -path "*/vendor/*" \
        2>/dev/null | sort
}

# Get relative path between two files
get_relative_path() {
    local from="$1"
    local to="$2"
    
    python3 << 'PYTHON_EOF' 2>/dev/null
import os.path
import sys

from_file = """$from"""
to_file = """$to"""

try:
    from_dir = os.path.dirname(from_file)
    rel_path = os.path.relpath(to_file, from_dir)
    rel_path = os.path.splitext(rel_path)[0]
    rel_path = rel_path.replace('\\', '/')
    
    if not rel_path.startswith('.') and not rel_path.startswith('/'):
        rel_path = './' + rel_path
    
    print(rel_path)
except Exception as e:
    print("", file=sys.stderr)
    sys.exit(1)
PYTHON_EOF
}

export -f get_relative_path

# Resolve import path to actual file
resolve_import_path() {
    local import_path="$1"
    local current_file="$2"
    local current_dir=$(dirname "$current_file")
    
    if [[ "$import_path" == /* ]]; then
        for ext in "" ".js" ".jsx" ".ts" ".tsx" "/index.js" "/index.jsx" "/index.ts" "/index.tsx"; do
            if [ -f "$PROJECT_ROOT${import_path}${ext}" ]; then
                echo "$PROJECT_ROOT${import_path}${ext}"
                return 0
            fi
        done
        return 1
    fi
    
    local resolved_path="$current_dir/$import_path"
    
    for ext in "" ".js" ".jsx" ".ts" ".tsx" "/index.js" "/index.jsx" "/index.ts" "/index.tsx"; do
        if [ -f "${resolved_path}${ext}" ]; then
            echo "${resolved_path}${ext}"
            return 0
        fi
    done
    
    return 1
}

export -f resolve_import_path
export PROJECT_ROOT

# Extract all imports from a file
extract_imports() {
    local file="$1"
    grep -nE "^import\s+.*from\s+['\"]([^'\"]+)['\"]" "$file" 2>/dev/null || true
}

export -f extract_imports

# Parse import statement - IMPROVED
parse_import() {
    local line="$1"
    
    local line_num=$(echo "$line" | cut -d: -f1)
    local import_stmt=$(echo "$line" | cut -d: -f2-)
    
    # Extract imported names - everything between 'import' and 'from'
    local imported_names=$(echo "$import_stmt" | sed -E 's/^import\s+//; s/\s+from.*//')
    
    # Extract path
    local import_path=$(echo "$import_stmt" | grep -oE "['\"]([^'\"]+)['\"]" | tr -d "\"'")
    
    echo "$line_num|$imported_names|$import_path|$import_stmt"
}

export -f parse_import

# Extract function/variable names from import statement
extract_names_from_import() {
    local import_names="$1"
    
    # Remove curly braces and split by comma
    echo "$import_names" | sed 's/{//g' | sed 's/}//g' | sed 's/\*//g' | sed 's/as.*//g' | tr ',' '\n' | sed 's/^\s*//;s/\s*$//' | grep -v '^$'
}

export -f extract_names_from_import

# Find files by exact filename match
find_files_by_exact_name() {
    local search_name="$1"
    local exclude_file="$2"
    
    local base_name=$(basename "$search_name" | sed 's/\.[^.]*$//')
    
    find_js_files | while read -r file; do
        [ "$file" = "$exclude_file" ] && continue
        
        local file_base=$(basename "$file" | sed 's/\.[^.]*$//')
        
        if [ "$file_base" = "$base_name" ]; then
            echo "$file"
        fi
    done
}

export -f find_files_by_exact_name

# Check if a file exports a specific name
file_exports_name() {
    local file="$1"
    local name="$2"
    
    # Clean up name
    name=$(echo "$name" | sed 's/\s*as\s.*//' | xargs)
    
    # Check if file exports this name
    grep -qE "(export\s+(default\s+)?(const|let|var|function|class|interface|type)\s+${name}\b|export\s+\{[^}]*\b${name}\b)" "$file" 2>/dev/null
}

export -f file_exports_name

# Find all files that contain a name definition
find_all_name_occurrences() {
    local name="$1"
    local exclude_file="$2"
    
    name=$(echo "$name" | sed 's/\s*as\s.*//' | xargs)
    
    find_js_files | while read -r file; do
        [ "$file" = "$exclude_file" ] && continue
        
        if grep -qE "(export\s+(default\s+)?(const|let|var|function|class|interface|type)\s+${name}\b|^${name}\s*=|^const\s+${name}\s*=|^let\s+${name}\s*=|^var\s+${name}\s*=|^\s*${name}\s*:|function\s+${name}\s*\(|class\s+${name}\s*(\{|extends)|^\s*${name}\s*:|${name}\s*:\s*(function|async|=>))" "$file" 2>/dev/null; then
            echo "$file"
        fi
    done
}

export -f find_all_name_occurrences

# Check if import path is valid
is_valid_import() {
    local import_path="$1"
    local current_file="$2"
    
    log_to_debug "Checking if valid: $import_path"
    
    if [[ "$import_path" =~ ^\./\$ ]]; then
        log_to_debug "  -> Broken path detected (contains variable)"
        return 1
    fi
    
    if [[ "$import_path" == @* ]] || [[ "$import_path" == react* ]] || [[ "$import_path" == next* ]] || [[ "$import_path" == lodash* ]] || [[ "$import_path" == prop-types* ]]; then
        log_to_debug "  -> Skipped (node_modules)"
        return 0
    fi
    
    if [[ "$import_path" != ./* ]] && [[ "$import_path" != ../* ]] && [[ "$import_path" != /* ]]; then
        log_to_debug "  -> Skipped (not relative)"
        return 0
    fi
    
    if resolve_import_path "$import_path" "$current_file" > /dev/null 2>&1; then
        log_to_debug "  -> Valid (path resolves)"
        return 0
    fi
    
    log_to_debug "  -> Invalid (path does not resolve)"
    return 1
}

export -f is_valid_import

# Find the correct path for an import
find_correct_path() {
    local import_path="$1"
    local current_file="$2"
    local imported_names="$3"
    
    log_to_debug "=== FINDING CORRECT PATH ==="
    log_to_debug "Import path: $import_path"
    log_to_debug "Current file: $current_file"
    log_to_debug "Imported names: $imported_names"
    
    local import_filename=$(basename "$import_path" | sed 's/\.[^.]*$//')
    
    log_to_debug "Looking for filename: $import_filename"
    
    # First, try to find a file with the same name
    local found_files=$(find_files_by_exact_name "$import_path" "$current_file")
    
    log_to_debug "Files found by name: $(echo "$found_files" | wc -l)"
    if [ -n "$found_files" ]; then
        log_to_debug "Found files:"
        echo "$found_files" | while read -r f; do
            log_to_debug "  - $f"
        done
    fi
    
    if [ -n "$found_files" ]; then
        local match_count=$(echo "$found_files" | wc -l)
        
        if [ "$match_count" -eq 1 ]; then
            # Single match found
            local correct_file=$(echo "$found_files" | head -1)
            local new_path=$(get_relative_path "$current_file" "$correct_file")
            
            log_to_debug "Single match found!"
            log_to_debug "Correct file: $correct_file"
            log_to_debug "New path: $new_path"
            
            echo "$correct_file|$new_path"
            return 0
        else
            # Multiple matches - find which one exports the imported names
            log_to_debug "Multiple matches found, checking which exports the imported names..."
            
            # Extract all names from the import statement
            local names_array=$(extract_names_from_import "$imported_names")
            
            log_to_debug "Names to search for:"
            echo "$names_array" | while read -r name; do
                log_to_debug "  - $name"
            done
            
            # For each file, check if it exports any of the imported names
            while IFS= read -r candidate_file; do
                log_to_debug "Checking file: $candidate_file"
                
                # Check if this file exports any of the imported names
                while IFS= read -r name; do
                    if [ -n "$name" ] && file_exports_name "$candidate_file" "$name"; then
                        log_to_debug "  ✓ Found export: $name"
                        local new_path=$(get_relative_path "$current_file" "$candidate_file")
                        log_to_debug "  New path: $new_path"
                        echo "$candidate_file|$new_path"
                        return 0
                    fi
                done <<< "$names_array"
            done <<< "$found_files"
            
            log_to_debug "No matching exports found in any file"
        fi
    fi
    
    # If no file found by name, search for the name definition
    local primary_name=$(echo "$imported_names" | sed 's/{//g' | sed 's/}//g' | cut -d',' -f1 | sed 's/\s*as\s.*//' | xargs)
    
    log_to_debug "Searching for name definition: $primary_name"
    
    if [ -z "$primary_name" ]; then
        log_to_debug "No primary name found"
        return 1
    fi
    
    local found_defs=$(find_all_name_occurrences "$primary_name" "$current_file")
    
    log_to_debug "Definitions found: $(echo "$found_defs" | wc -l)"
    if [ -n "$found_defs" ]; then
        log_to_debug "Found definitions:"
        echo "$found_defs" | while read -r f; do
            log_to_debug "  - $f"
        done
    fi
    
    if [ -z "$found_defs" ]; then
        log_to_debug "No definitions found"
        return 1
    fi
    
    local match_count=$(echo "$found_defs" | wc -l)
    
    if [ "$match_count" -eq 1 ]; then
        local correct_file=$(echo "$found_defs" | head -1)
        local new_path=$(get_relative_path "$current_file" "$correct_file")
        
        log_to_debug "Single definition found!"
        log_to_debug "Correct file: $correct_file"
        log_to_debug "New path: $new_path"
        
        echo "$correct_file|$new_path"
        return 0
    fi
    
    log_to_debug "Multiple definitions found - cannot auto-fix"
    
    echo "$found_defs"
    return 1
}

export -f find_correct_path

# ============================================================================
# AUTO-FIX FUNCTIONS
# ============================================================================

apply_import_fix() {
    local file="$1"
    local line_num="$2"
    local old_import="$3"
    local new_path="$4"
    local name="$5"
    
    log_to_debug "=== APPLYING FIX ==="
    log_to_debug "File: $file"
    log_to_debug "Line: $line_num"
    log_to_debug "Old import: $old_import"
    log_to_debug "New path: $new_path"
    
    cp "$file" "${file}.bak"
    
    local temp_py=$(mktemp)
    cat > "$temp_py" << 'PYTHON_SCRIPT'
import sys
import re

def fix_import(file_path, line_num, new_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        if line_num > len(lines):
            print("Error: Line number out of range", file=sys.stderr)
            return False
        
        old_line = lines[line_num - 1]
        
        new_line = re.sub(
            r"from\s+['\"][^'\"]*['\"]",
            f"from '{new_path}'",
            old_line
        )
        
        if new_line == old_line:
            print("Error: Could not replace import", file=sys.stderr)
            return False
        
        lines[line_num - 1] = new_line
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        
        return True
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: script.py <file> <line_num> <new_path>", file=sys.stderr)
        sys.exit(1)
    
    file_path = sys.argv[1]
    line_num = int(sys.argv[2])
    new_path = sys.argv[3]
    
    if fix_import(file_path, line_num, new_path):
        print("SUCCESS")
        sys.exit(0)
    else:
        sys.exit(1)
PYTHON_SCRIPT
    
    local output
    output=$(python3 "$temp_py" "$file" "$line_num" "$new_path" 2>&1)
    local result=$?
    
    rm -f "$temp_py"
    
    if [ $result -eq 0 ] && [ "$output" = "SUCCESS" ]; then
        log_to_debug "✓ Fix applied successfully!"
        log_success "Fixed import in $file (line $line_num)"
        log_success "  Changed: $old_import"
        log_success "  To: import { ... } from '$new_path'"
        echo "$file|$line_num|$name|$old_import|from '$new_path'" >> "$FIXED_IMPORTS_FILE"
        increment_counter "auto_fixed"
        
        rm -f "${file}.bak"
        return 0
    else
        log_to_debug "✗ Fix failed! Output: $output"
        mv "${file}.bak" "$file"
        log_error "Failed to apply fix to $file"
        return 1
    fi
}

export -f apply_import_fix

# ============================================================================
# VALIDATION FUNCTIONS
# ============================================================================

validate_imports() {
    local file="$1"
    increment_counter "total_scanned"
    
    log_to_debug ""
    log_to_debug "=========================================="
    log_to_debug "VALIDATING FILE: $file"
    log_to_debug "=========================================="
    
    while IFS= read -r import_line; do
        [ -z "$import_line" ] && continue
        
        increment_counter "total_imports"
        
        local parsed=$(parse_import "$import_line" "$file")
        IFS='|' read -r line_num imported_names import_path import_stmt <<< "$parsed"
        
        log_to_debug ""
        log_to_debug "--- IMPORT FOUND ---"
        log_to_debug "Line: $line_num"
        log_to_debug "Statement: $import_stmt"
        log_to_debug "Path: $import_path"
        log_to_debug "Names: $imported_names"
        
        if [[ "$import_path" =~ ^\./\$ ]]; then
            increment_counter "broken_imports"
            log_error "Broken import in: $file (line $line_num)"
            log_error "  Import: $import_stmt"
            log_error "  Path contains variable: $import_path"
            echo "$file|$line_num|$imported_names|$import_path" >> "$FAILED_IMPORTS_FILE"
            continue
        fi
        
        if is_valid_import "$import_path" "$file"; then
            increment_counter "valid_imports"
            log_to_debug "Status: VALID"
            continue
        fi
        
        log_to_debug "Status: INVALID - Searching for correct path..."
        
        local result=$(find_correct_path "$import_path" "$file" "$imported_names")
        
        if [ -n "$result" ]; then
            increment_counter "outdated_imports"
            
            log_outdated "Outdated import in: $file (line $line_num)"
            log_outdated "  Import: $import_stmt"
            log_outdated "  Current path: $import_path"
            
            log_to_debug "Result: $result"
            
            local line_count=$(echo "$result" | wc -l)
            
            if [ "$line_count" -eq 1 ] && [[ "$result" == *"|"* ]]; then
                IFS='|' read -r correct_file new_path <<< "$result"
                
                log_to_debug "Single match - attempting auto-fix"
                log_to_debug "Correct file: $correct_file"
                log_to_debug "New path: $new_path"
                
                if apply_import_fix "$file" "$line_num" "$import_stmt" "$new_path" "$(echo "$imported_names" | sed 's/{//g' | sed 's/}//g' | cut -d',' -f1 | xargs)"; then
                    log_to_debug "✓ Auto-fix successful"
                    continue
                else
                    log_to_debug "✗ Auto-fix failed"
                fi
            else
                log_found "Possible locations for '$(echo "$imported_names" | sed 's/{//g' | sed 's/}//g' | cut -d',' -f1 | xargs)':"
                echo "$result" | while read -r found_file; do
                    log_found "  - $found_file"
                    log_to_debug "  - $found_file"
                done
            fi
            
            increment_counter "manual_review"
            echo "$file|$line_num|$imported_names|$import_path" >> "$OUTDATED_IMPORTS_FILE"
        else
            increment_counter "failed_imports"
            
            log_error "Failed import in: $file (line $line_num)"
            log_error "  Import: $import_stmt"
            log_error "  Path: $import_path"
            
            log_to_debug "Status: FAILED - No correct path found"
            
            increment_counter "manual_review"
            echo "$file|$line_num|$imported_names|$import_path" >> "$FAILED_IMPORTS_FILE"
        fi
        
    done < <(extract_imports "$file")
}

export -f validate_imports

# ============================================================================
# MAIN EXECUTION
# ============================================================================

main() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   Recursive Import Path Validator & Fixer v5.9     ║${NC}"
    echo -e "${BLUE}║   FIXED: Better multi-file handling                ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    log_info "Project root: $PROJECT_ROOT"
    log_info "Debug log: $DEBUG_LOG_FILE"
    echo ""
    
    log_info "Scanning all files recursively..."
    echo ""
    
    local file_count=$(find_js_files | wc -l)
    log_info "Found $file_count JavaScript files to scan in all subfolders"
    echo ""
    
    local processed=0
    find_js_files | while read -r file; do
        ((processed++))
        echo -ne "\rProcessing file $processed/$file_count: $(basename "$file")                    "
        validate_imports "$file"
    done
    echo ""
    echo ""
    
    local total_scanned=$(get_counter "total_scanned")
    local total_imports=$(get_counter "total_imports")
    local valid_imports=$(get_counter "valid_imports")
    local failed_imports=$(get_counter "failed_imports")
    local auto_fixed=$(get_counter "auto_fixed")
    local manual_review=$(get_counter "manual_review")
    local outdated_imports=$(get_counter "outdated_imports")
    local broken_imports=$(get_counter "broken_imports")
    
    echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║            VALIDATION SUMMARY REPORT                ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Total files scanned:        $total_scanned"
    echo "Total imports found:        $total_imports"
    echo -e "${GREEN}Valid imports:              $valid_imports${NC}"
    echo -e "${YELLOW}Outdated imports:           $outdated_imports${NC}"
    echo -e "${RED}Failed imports:             $failed_imports${NC}"
    echo -e "${RED}Broken imports:             $broken_imports${NC}"
    echo -e "${GREEN}Auto-fixed imports:        $auto_fixed${NC}"
    echo -e "${YELLOW}Manual review required:     $manual_review${NC}"
    echo ""
    
    if [ "$auto_fixed" -gt 0 ]; then
        echo -e "${GREEN}✓ Fixed imports saved to: $FIXED_IMPORTS_FILE${NC}"
    fi
    
    if [ "$outdated_imports" -gt 0 ]; then
        echo -e "${YELLOW}⚠ Outdated imports: $OUTDATED_IMPORTS_FILE${NC}"
    fi
    
    if [ "$failed_imports" -gt 0 ] || [ "$broken_imports" -gt 0 ]; then
        echo -e "${RED}✗ Failed imports: $FAILED_IMPORTS_FILE${NC}"
    fi
    
    echo -e "${CYAN}📋 Debug log: $DEBUG_LOG_FILE${NC}"
    echo -e "Full report: $REPORT_FILE"
    echo ""
    
    {
        echo ""
        echo "╔════════════════════════════════════════════════════╗"
        echo "║            VALIDATION SUMMARY REPORT                ║"
        echo "╚════════════════════════════════════════════════════╝"
        echo ""
        echo "Total files scanned:        $total_scanned"
        echo "Total imports found:        $total_imports"
        echo "Valid imports:              $valid_imports"
        echo "Outdated imports:           $outdated_imports"
        echo "Failed imports:             $failed_imports"
        echo "Broken imports:             $broken_imports"
        echo "Auto-fixed imports:        $auto_fixed"
        echo "Manual review required:     $manual_review"
        echo ""
    } >> "$REPORT_FILE"
}

main
