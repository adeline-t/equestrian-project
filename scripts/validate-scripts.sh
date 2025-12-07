#!/bin/bash

# Script Validation Tool
# Validates script integrity, dependencies, and common issues
# Usage: ./scripts/validate-scripts.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

print_header() {
    echo ""
    echo -e "${BLUE}============================================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}============================================================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
    ((PASSED_CHECKS++))
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
    ((WARNINGS++))
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    ((FAILED_CHECKS++))
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Main validation
print_header "🔍 Script Validation Tool"

# Check 1: Script Executability
print_info "Checking script executability..."
((TOTAL_CHECKS++))

SCRIPTS_TO_CHECK=(
    "start.sh"
    "launch-local.sh"
    "deploy.sh"
    "scripts/add-model.js"
    "scripts/modify-model.js"
    "scripts/setup-project.sh"
    "scripts/setup-supabase.sh"
    "scripts/setup-cloudflare.sh"
    "scripts/install.sh"
    "scripts/quick-start.sh"
    "scripts/cleanup.sh"
    "scripts/test.js"
    "scripts/validate-scripts.sh"
)

EXECUTABLE_ERRORS=0
for script in "${SCRIPTS_TO_CHECK[@]}"; do
    if [ -f "$PROJECT_ROOT/$script" ]; then
        if [ -x "$PROJECT_ROOT/$script" ]; then
            : # Script is executable, no action needed
        else
            print_error "Not executable: $script"
            ((EXECUTABLE_ERRORS++))
        fi
    else
        print_warning "Script not found: $script"
    fi
done

if [ $EXECUTABLE_ERRORS -eq 0 ]; then
    print_success "All scripts are executable"
else
    print_error "Found $EXECUTABLE_ERRORS non-executable scripts"
fi

# Check 2: Shebang Lines
print_info "Validating shebang lines..."
((TOTAL_CHECKS++))

SHEBANG_ERRORS=0
for script in "${SCRIPTS_TO_CHECK[@]}"; do
    if [ -f "$PROJECT_ROOT/$script" ]; then
        FIRST_LINE=$(head -n 1 "$PROJECT_ROOT/$script")
        
        # Check based on file extension
        if [[ "$script" == *.sh ]]; then
            if [[ "$FIRST_LINE" != "#!/bin/bash"* ]] && [[ "$FIRST_LINE" != "#!/usr/bin/env bash"* ]]; then
                print_error "Invalid shebang in $script: $FIRST_LINE"
                ((SHEBANG_ERRORS++))
            fi
        elif [[ "$script" == *.js ]]; then
            if [[ "$FIRST_LINE" != "#!/usr/bin/env node"* ]] && [[ "$FIRST_LINE" != "#!/bin/node"* ]]; then
                # JavaScript files might not have shebang if not meant to be executed directly
                if [ -x "$PROJECT_ROOT/$script" ]; then
                    print_warning "Executable JS file without shebang: $script"
                fi
            fi
        fi
    fi
done

if [ $SHEBANG_ERRORS -eq 0 ]; then
    print_success "All shebang lines are valid"
else
    print_error "Found $SHEBANG_ERRORS invalid shebang lines"
fi

# Check 3: System Dependencies
print_info "Checking system dependencies..."
((TOTAL_CHECKS++))

REQUIRED_DEPS=("node" "npm" "git")
OPTIONAL_DEPS=("wrangler" "jq" "lsof")

MISSING_REQUIRED=0
for dep in "${REQUIRED_DEPS[@]}"; do
    if ! command -v "$dep" &> /dev/null; then
        print_error "Required dependency missing: $dep"
        ((MISSING_REQUIRED++))
    fi
done

MISSING_OPTIONAL=0
for dep in "${OPTIONAL_DEPS[@]}"; do
    if ! command -v "$dep" &> /dev/null; then
        print_warning "Optional dependency missing: $dep"
        ((MISSING_OPTIONAL++))
    fi
done

if [ $MISSING_REQUIRED -eq 0 ]; then
    print_success "All required dependencies found"
else
    print_error "Missing $MISSING_REQUIRED required dependencies"
fi

# Check 4: Node.js Version
print_info "Checking Node.js version..."
((TOTAL_CHECKS++))

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | sed 's/v//')
    MAJOR_VERSION=$(echo "$NODE_VERSION" | cut -d. -f1)
    
    if [ "$MAJOR_VERSION" -ge 18 ]; then
        print_success "Node.js version $NODE_VERSION (>= 18.0.0)"
    else
        print_error "Node.js version $NODE_VERSION is too old (need >= 18.0.0)"
    fi
else
    print_error "Node.js not found"
fi

# Check 5: Script Metadata
print_info "Validating script metadata..."
((TOTAL_CHECKS++))

if [ -f "$PROJECT_ROOT/scripts/.scripts-index.json" ]; then
    if command -v jq &> /dev/null; then
        if jq empty "$PROJECT_ROOT/scripts/.scripts-index.json" 2>/dev/null; then
            print_success "Script metadata is valid JSON"
        else
            print_error "Script metadata has invalid JSON"
        fi
    else
        print_warning "jq not available, skipping JSON validation"
    fi
else
    print_warning "Script metadata file not found: scripts/.scripts-index.json"
fi

# Check 6: Documentation Consistency
print_info "Checking documentation consistency..."
((TOTAL_CHECKS++))

DOC_ERRORS=0
if [ ! -f "$PROJECT_ROOT/scripts/SCRIPTS_CATALOG.md" ]; then
    print_error "Missing: scripts/SCRIPTS_CATALOG.md"
    ((DOC_ERRORS++))
fi

if [ ! -f "$PROJECT_ROOT/docs/09-scripts/README.md" ]; then
    print_error "Missing: docs/09-scripts/README.md"
    ((DOC_ERRORS++))
fi

if [ ! -f "$PROJECT_ROOT/docs/09-scripts/script-reference.md" ]; then
    print_error "Missing: docs/09-scripts/script-reference.md"
    ((DOC_ERRORS++))
fi

if [ $DOC_ERRORS -eq 0 ]; then
    print_success "All documentation files present"
else
    print_error "Missing $DOC_ERRORS documentation files"
fi

# Check 7: Environment Files
print_info "Checking environment file templates..."
((TOTAL_CHECKS++))

ENV_WARNINGS=0
if [ ! -f "$PROJECT_ROOT/frontend/.env" ] && [ ! -f "$PROJECT_ROOT/frontend/.env.dev" ]; then
    print_warning "No frontend environment file found"
    ((ENV_WARNINGS++))
fi

if [ ! -f "$PROJECT_ROOT/backend/.env" ] && [ ! -f "$PROJECT_ROOT/backend/.dev.vars" ]; then
    print_warning "No backend environment file found"
    ((ENV_WARNINGS++))
fi

if [ $ENV_WARNINGS -eq 0 ]; then
    print_success "Environment files configured"
else
    print_warning "$ENV_WARNINGS environment files missing (expected for first-time setup)"
fi

# Check 8: Port Availability
print_info "Checking port availability..."
((TOTAL_CHECKS++))

PORT_ISSUES=0
if command -v lsof &> /dev/null; then
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port 5173 (frontend) is in use"
        ((PORT_ISSUES++))
    fi
    
    if lsof -Pi :8787 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port 8787 (backend) is in use"
        ((PORT_ISSUES++))
    fi
    
    if [ $PORT_ISSUES -eq 0 ]; then
        print_success "Required ports are available"
    fi
else
    print_warning "lsof not available, skipping port check"
fi

# Check 9: Git Repository
print_info "Checking git repository..."
((TOTAL_CHECKS++))

if [ -d "$PROJECT_ROOT/.git" ]; then
    print_success "Git repository initialized"
else
    print_warning "Not a git repository"
fi

# Check 10: Node Modules
print_info "Checking node_modules..."
((TOTAL_CHECKS++))

MODULES_MISSING=0
if [ ! -d "$PROJECT_ROOT/frontend/node_modules" ]; then
    print_warning "Frontend dependencies not installed"
    ((MODULES_MISSING++))
fi

if [ ! -d "$PROJECT_ROOT/backend/node_modules" ]; then
    print_warning "Backend dependencies not installed"
    ((MODULES_MISSING++))
fi

if [ $MODULES_MISSING -eq 0 ]; then
    print_success "Dependencies installed"
else
    print_warning "$MODULES_MISSING dependency directories missing"
fi

# Summary
echo ""
print_header "📊 Validation Summary"

echo "Total Checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $PASSED_CHECKS${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo -e "${RED}Failed: $FAILED_CHECKS${NC}"
echo ""

if [ $FAILED_CHECKS -eq 0 ]; then
    print_success "All critical validations passed!"
    echo ""
    if [ $WARNINGS -gt 0 ]; then
        print_info "Note: $WARNINGS warnings found (non-critical)"
    fi
    exit 0
else
    print_error "Validation failed with $FAILED_CHECKS errors"
    echo ""
    echo "To fix issues:"
    echo "  1. Make scripts executable: chmod +x scripts/*.sh *.sh"
    echo "  2. Install dependencies: ./scripts/install.sh"
    echo "  3. Configure environment: ./scripts/setup-project.sh"
    echo ""
    exit 1
fi