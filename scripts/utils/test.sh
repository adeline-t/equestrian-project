#!/bin/bash

# test.sh - Comprehensive Script Testing Utility
# Tests script functionality, templates, permissions, and dependencies
# Usage: ./scripts/test.sh [test-name]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m'

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Print functions
print_color() {
    local color=$1
    shift
    echo -e "${color}$@${NC}"
}

print_header() {
    echo ""
    print_color "$CYAN" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    print_color "$CYAN" "$1"
    print_color "$CYAN" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

# Test result functions
test_pass() {
    TESTS_PASSED=$((TESTS_PASSED + 1))
    print_color "$GREEN" "  ✓ $1"
}

test_fail() {
    TESTS_FAILED=$((TESTS_FAILED + 1))
    print_color "$RED" "  ✗ $1"
    if [ -n "$2" ]; then
        print_color "$GRAY" "    $2"
    fi
}

test_start() {
    TESTS_RUN=$((TESTS_RUN + 1))
    print_color "$BLUE" "  → Testing: $1"
}

# Test: Script Executability
test_executability() {
    print_header "🔧 Testing Script Executability"
    
    local scripts=(
        "add-model.sh"
        "cleanup.sh"
        "install.sh"
        "quick-start.sh"
        "setup-cloudflare.sh"
        "setup-project.sh"
        "setup-supabase.sh"
        "validate-scripts.sh"
        "test.sh"
    )
    
    for script in "${scripts[@]}"; do
        test_start "$script"
        if [ -f "$SCRIPT_DIR/$script" ]; then
            if [ -x "$SCRIPT_DIR/$script" ]; then
                test_pass "$script is executable"
            else
                test_fail "$script is not executable" "Run: chmod +x scripts/$script"
            fi
        else
            test_fail "$script not found"
        fi
    done
}

# Test: Shebang Lines
test_shebangs() {
    print_header "📝 Testing Shebang Lines"
    
    local bash_scripts=(
        "add-model.sh"
        "cleanup.sh"
        "install.sh"
        "quick-start.sh"
        "setup-cloudflare.sh"
        "setup-project.sh"
        "setup-supabase.sh"
        "validate-scripts.sh"
        "test.sh"
    )
    
    for script in "${bash_scripts[@]}"; do
        test_start "$script"
        if [ -f "$SCRIPT_DIR/$script" ]; then
            local shebang=$(head -n 1 "$SCRIPT_DIR/$script")
            if [[ $shebang == "#!/bin/bash"* ]] || [[ $shebang == "#!/usr/bin/env bash"* ]]; then
                test_pass "$script has correct bash shebang"
            else
                test_fail "$script has incorrect shebang: $shebang"
            fi
        fi
    done
}

# Test: Script Syntax
test_syntax() {
    print_header "🔍 Testing Script Syntax"
    
    local bash_scripts=(
        "add-model.sh"
        "cleanup.sh"
        "install.sh"
        "quick-start.sh"
        "setup-cloudflare.sh"
        "setup-project.sh"
        "setup-supabase.sh"
        "validate-scripts.sh"
        "test.sh"
    )
    
    for script in "${bash_scripts[@]}"; do
        test_start "$script"
        if [ -f "$SCRIPT_DIR/$script" ]; then
            if bash -n "$SCRIPT_DIR/$script" 2>/dev/null; then
                test_pass "$script syntax is valid"
            else
                test_fail "$script has syntax errors"
            fi
        fi
    done
}

# Test: Dependencies
test_dependencies() {
    print_header "📦 Testing Dependencies"
    
    local deps=(
        "bash:Bash shell"
        "sed:Stream editor"
        "awk:Text processing"
        "grep:Pattern matching"
        "date:Date utilities"
        "git:Version control"
    )
    
    for dep in "${deps[@]}"; do
        IFS=':' read -ra PARTS <<< "$dep"
        local cmd="${PARTS[0]}"
        local name="${PARTS[1]}"
        
        test_start "$name"
        if command -v "$cmd" &> /dev/null; then
            test_pass "$name is installed"
        else
            test_fail "$name is not installed"
        fi
    done
}

# Test: Configuration Files
test_config_files() {
    print_header "⚙️  Testing Configuration Files"
    
    test_start "model-schema.json"
    if [ -f "$SCRIPT_DIR/config/model-schema.json" ]; then
        if command -v jq &> /dev/null; then
            if jq empty "$SCRIPT_DIR/config/model-schema.json" 2>/dev/null; then
                test_pass "model-schema.json is valid JSON"
            else
                test_fail "model-schema.json has invalid JSON"
            fi
        else
            test_pass "model-schema.json exists (jq not available for validation)"
        fi
    else
        test_fail "model-schema.json not found"
    fi
    
    test_start ".scripts-index.json"
    if [ -f "$SCRIPT_DIR/.scripts-index.json" ]; then
        if command -v jq &> /dev/null; then
            if jq empty "$SCRIPT_DIR/.scripts-index.json" 2>/dev/null; then
                test_pass ".scripts-index.json is valid JSON"
            else
                test_fail ".scripts-index.json has invalid JSON"
            fi
        else
            test_pass ".scripts-index.json exists (jq not available for validation)"
        fi
    else
        test_fail ".scripts-index.json not found"
    fi
}

# Test: Template Files
test_templates() {
    print_header "📄 Testing Template Files"
    
    local template_dirs=(
        "templates/backend"
        "templates/frontend"
        "templates/database"
    )
    
    for dir in "${template_dirs[@]}"; do
        test_start "$dir"
        if [ -d "$SCRIPT_DIR/$dir" ]; then
            local file_count=$(find "$SCRIPT_DIR/$dir" -type f | wc -l)
            if [ "$file_count" -gt 0 ]; then
                test_pass "$dir exists with $file_count file(s)"
            else
                test_fail "$dir is empty"
            fi
        else
            test_fail "$dir not found"
        fi
    done
}

# Test: Documentation
test_documentation() {
    print_header "📚 Testing Documentation"
    
    local docs=(
        "SCRIPTS_CATALOG.md"
        "README.md"
        ".scripts-index.json"
    )
    
    for doc in "${docs[@]}"; do
        test_start "$doc"
        if [ -f "$SCRIPT_DIR/$doc" ]; then
            local size=$(wc -c < "$SCRIPT_DIR/$doc")
            if [ "$size" -gt 100 ]; then
                test_pass "$doc exists and has content ($size bytes)"
            else
                test_fail "$doc is too small ($size bytes)"
            fi
        else
            test_fail "$doc not found"
        fi
    done
}

# Test: Project Structure
test_project_structure() {
    print_header "🏗️  Testing Project Structure"
    
    local required_dirs=(
        "backend/src/handlers"
        "frontend/src/components"
        "frontend/src/services"
        "database/migrations"
    )
    
    for dir in "${required_dirs[@]}"; do
        test_start "$dir"
        if [ -d "$PROJECT_ROOT/$dir" ]; then
            test_pass "$dir exists"
        else
            test_fail "$dir not found"
        fi
    done
}

# Test: add-model.sh Functionality
test_add_model_script() {
    print_header "🐴 Testing add-model.sh Functionality"
    
    test_start "add-model.sh exists"
    if [ -f "$SCRIPT_DIR/add-model.sh" ]; then
        test_pass "add-model.sh exists"
    else
        test_fail "add-model.sh not found"
        return
    fi
    
    test_start "add-model.sh has required functions"
    local required_functions=(
        "gather_model_info"
        "gather_fields"
        "generate_backend_handler"
        "generate_database_migration"
        "generate_frontend_list"
        "generate_frontend_form"
        "generate_styles"
    )
    
    local missing_functions=()
    for func in "${required_functions[@]}"; do
        if ! grep -q "^${func}()" "$SCRIPT_DIR/add-model.sh"; then
            missing_functions+=("$func")
        fi
    done
    
    if [ ${#missing_functions[@]} -eq 0 ]; then
        test_pass "All required functions present"
    else
        test_fail "Missing functions: ${missing_functions[*]}"
    fi
    
    test_start "add-model.sh has validation functions"
    if grep -q "validate_pascal_case" "$SCRIPT_DIR/add-model.sh" && \
       grep -q "validate_snake_case" "$SCRIPT_DIR/add-model.sh"; then
        test_pass "Validation functions present"
    else
        test_fail "Missing validation functions"
    fi
}

# Test: Deprecated Scripts
test_deprecated_scripts() {
    print_header "⚠️  Testing Deprecated Scripts"
    
    test_start "add-model.js marked as deprecated"
    if [ -f "$SCRIPT_DIR/add-model.js" ]; then
        if grep -q "deprecated\|DEPRECATED" "$SCRIPT_DIR/SCRIPTS_CATALOG.md" 2>/dev/null; then
            test_pass "add-model.js is documented as deprecated"
        else
            test_fail "add-model.js not marked as deprecated in documentation"
        fi
    fi
    
    test_start "modify-model.js status"
    if [ -f "$SCRIPT_DIR/modify-model.js" ]; then
        test_pass "modify-model.js exists (status: needs evaluation)"
    fi
}

# Test: Git Integration
test_git_integration() {
    print_header "🔀 Testing Git Integration"
    
    test_start "Git repository"
    if [ -d "$PROJECT_ROOT/.git" ]; then
        test_pass "Git repository initialized"
    else
        test_fail "Not a git repository"
        return
    fi
    
    test_start "Git ignore"
    if [ -f "$PROJECT_ROOT/.gitignore" ]; then
        test_pass ".gitignore exists"
    else
        test_fail ".gitignore not found"
    fi
}

# Test: Script Catalog Consistency
test_catalog_consistency() {
    print_header "📋 Testing Catalog Consistency"
    
    test_start "Scripts in catalog match actual scripts"
    
    # Get scripts from filesystem
    local actual_scripts=($(ls "$SCRIPT_DIR"/*.sh 2>/dev/null | xargs -n1 basename))
    
    # Check if catalog exists
    if [ ! -f "$SCRIPT_DIR/SCRIPTS_CATALOG.md" ]; then
        test_fail "SCRIPTS_CATALOG.md not found"
        return
    fi
    
    local missing_from_catalog=()
    for script in "${actual_scripts[@]}"; do
        if ! grep -q "$script" "$SCRIPT_DIR/SCRIPTS_CATALOG.md"; then
            missing_from_catalog+=("$script")
        fi
    done
    
    if [ ${#missing_from_catalog[@]} -eq 0 ]; then
        test_pass "All scripts documented in catalog"
    else
        test_fail "Scripts missing from catalog: ${missing_from_catalog[*]}"
    fi
}

# Summary
print_summary() {
    print_header "📊 Test Summary"
    
    echo ""
    print_color "$BLUE" "Tests Run:    $TESTS_RUN"
    print_color "$GREEN" "Tests Passed: $TESTS_PASSED"
    print_color "$RED" "Tests Failed: $TESTS_FAILED"
    echo ""
    
    local pass_rate=0
    if [ $TESTS_RUN -gt 0 ]; then
        pass_rate=$((TESTS_PASSED * 100 / TESTS_RUN))
    fi
    
    if [ $TESTS_FAILED -eq 0 ]; then
        print_color "$GREEN" "✅ All tests passed! ($pass_rate%)"
        echo ""
        print_color "$CYAN" "🎉 Scripts are in excellent condition!"
        return 0
    else
        print_color "$YELLOW" "⚠️  Some tests failed ($pass_rate% pass rate)"
        echo ""
        print_color "$YELLOW" "Please review the failures above and fix the issues."
        return 1
    fi
}

# Main execution
main() {
    print_header "🧪 Script Testing Suite"
    print_color "$GRAY" "Testing all scripts for functionality, syntax, and consistency"
    echo ""
    
    # Check if specific test requested
    if [ -n "$1" ]; then
        case "$1" in
            executability) test_executability ;;
            shebangs) test_shebangs ;;
            syntax) test_syntax ;;
            dependencies) test_dependencies ;;
            config) test_config_files ;;
            templates) test_templates ;;
            documentation) test_documentation ;;
            structure) test_project_structure ;;
            add-model) test_add_model_script ;;
            deprecated) test_deprecated_scripts ;;
            git) test_git_integration ;;
            catalog) test_catalog_consistency ;;
            *)
                print_color "$RED" "Unknown test: $1"
                echo ""
                print_color "$CYAN" "Available tests:"
                print_color "$GRAY" "  executability  - Test script permissions"
                print_color "$GRAY" "  shebangs       - Test shebang lines"
                print_color "$GRAY" "  syntax         - Test script syntax"
                print_color "$GRAY" "  dependencies   - Test system dependencies"
                print_color "$GRAY" "  config         - Test configuration files"
                print_color "$GRAY" "  templates      - Test template files"
                print_color "$GRAY" "  documentation  - Test documentation"
                print_color "$GRAY" "  structure      - Test project structure"
                print_color "$GRAY" "  add-model      - Test add-model.sh"
                print_color "$GRAY" "  deprecated     - Test deprecated scripts"
                print_color "$GRAY" "  git            - Test git integration"
                print_color "$GRAY" "  catalog        - Test catalog consistency"
                exit 1
                ;;
        esac
    else
        # Run all tests
        test_executability
        test_shebangs
        test_syntax
        test_dependencies
        test_config_files
        test_templates
        test_documentation
        test_project_structure
        test_add_model_script
        test_deprecated_scripts
        test_git_integration
        test_catalog_consistency
    fi
    
    # Print summary
    print_summary
}

# Run main
main "$@"