#!/bin/bash

# ============================================================================
# Equestrian Project - Local Launch Script
# ============================================================================
# This script launches the complete application stack locally:
# - Frontend (React + Vite) on port 5173
# - Backend (Cloudflare Workers) on port 8787
# ============================================================================

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Emoji support
CHECK="✓"
CROSS="✗"
INFO="ℹ"
ROCKET="🚀"
PACKAGE="📦"
GEAR="⚙️"
GLOBE="🌐"
DATABASE="🗄️"
WARNING="⚠️"

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR"

# Log functions
print_header() {
    echo ""
    echo -e "${MAGENTA}============================================================================${NC}"
    echo -e "${MAGENTA}  $1${NC}"
    echo -e "${MAGENTA}============================================================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}${CHECK} $1${NC}"
}

print_info() {
    echo -e "${BLUE}${INFO} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}${WARNING} $1${NC}"
}

print_error() {
    echo -e "${RED}${CROSS} $1${NC}"
}

print_step() {
    echo ""
    echo -e "${CYAN}${GEAR} $1${NC}"
    echo ""
}

# Cleanup function
cleanup() {
    echo ""
    print_warning "Shutting down services..."
    
    # Kill all child processes
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        print_info "Backend stopped"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_info "Frontend stopped"
    fi
    
    # Kill any remaining node processes on our ports
    lsof -ti:8787 | xargs kill -9 2>/dev/null || true
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
    
    echo ""
    print_success "All services stopped"
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM EXIT

# ============================================================================
# STEP 1: Prerequisites Check
# ============================================================================
print_header "${ROCKET} Equestrian Project - Local Launch"

print_step "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node --version)
print_success "Node.js $NODE_VERSION detected"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
NPM_VERSION=$(npm --version)
print_success "npm $NPM_VERSION detected"

# Check if ports are available
if lsof -Pi :8787 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port 8787 is already in use (Backend)"
    read -p "Kill the process and continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -ti:8787 | xargs kill -9 2>/dev/null || true
        print_success "Port 8787 freed"
    else
        print_error "Cannot continue with port 8787 in use"
        exit 1
    fi
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port 5173 is already in use (Frontend)"
    read -p "Kill the process and continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -ti:5173 | xargs kill -9 2>/dev/null || true
        print_success "Port 5173 freed"
    else
        print_error "Cannot continue with port 5173 in use"
        exit 1
    fi
fi

# ============================================================================
# STEP 2: Check Project Structure
# ============================================================================
print_step "Verifying project structure..."

if [ ! -d "$PROJECT_ROOT/frontend" ]; then
    print_error "Frontend directory not found"
    exit 1
fi
print_success "Frontend directory found"

if [ ! -d "$PROJECT_ROOT/backend" ]; then
    print_error "Backend directory not found"
    exit 1
fi
print_success "Backend directory found"

# ============================================================================
# STEP 3: Install Dependencies
# ============================================================================
print_step "${PACKAGE} Installing dependencies..."

# Frontend dependencies
if [ ! -d "$PROJECT_ROOT/frontend/node_modules" ]; then
    print_info "Installing frontend dependencies..."
    cd "$PROJECT_ROOT/frontend"
    npm install --silent
    print_success "Frontend dependencies installed"
else
    print_success "Frontend dependencies already installed"
fi

# Backend dependencies
if [ ! -d "$PROJECT_ROOT/backend/node_modules" ]; then
    print_info "Installing backend dependencies..."
    cd "$PROJECT_ROOT/backend"
    npm install --silent
    print_success "Backend dependencies installed"
else
    print_success "Backend dependencies already installed"
fi

cd "$PROJECT_ROOT"

# ============================================================================
# STEP 4: Environment Configuration Check
# ============================================================================
print_step "${GEAR} Checking environment configuration..."

ENV_ISSUES=0

# Check frontend environment
if [ ! -f "$PROJECT_ROOT/frontend/.env" ] && [ ! -f "$PROJECT_ROOT/frontend/.env.dev" ] && [ ! -f "$PROJECT_ROOT/frontend/.env.local" ]; then
    print_warning "No frontend environment file found (.env, .env.dev, or .env.local)"
    ENV_ISSUES=$((ENV_ISSUES + 1))
else
    print_success "Frontend environment file found"
fi

# Check backend environment
if [ ! -f "$PROJECT_ROOT/backend/.env" ] && [ ! -f "$PROJECT_ROOT/backend/.env.dev" ] && [ ! -f "$PROJECT_ROOT/backend/.dev.vars" ]; then
    print_warning "No backend environment file found (.env, .env.dev, or .dev.vars)"
    ENV_ISSUES=$((ENV_ISSUES + 1))
else
    print_success "Backend environment file found"
fi

# Check wrangler.toml
if [ ! -f "$PROJECT_ROOT/backend/wrangler.toml" ]; then
    if [ -f "$PROJECT_ROOT/backend/wrangler.toml.example" ]; then
        print_warning "wrangler.toml not found, but example exists"
        print_info "Creating wrangler.toml from example..."
        cp "$PROJECT_ROOT/backend/wrangler.toml.example" "$PROJECT_ROOT/backend/wrangler.toml"
        print_success "wrangler.toml created"
    else
        print_warning "wrangler.toml not found"
        ENV_ISSUES=$((ENV_ISSUES + 1))
    fi
else
    print_success "wrangler.toml found"
fi

if [ $ENV_ISSUES -gt 0 ]; then
    echo ""
    print_warning "Environment configuration issues detected!"
    echo ""
    echo "The application may not work correctly without proper configuration."
    echo ""
    echo "To fix this:"
    echo "  1. Run: ./scripts/setup-project.sh"
    echo "  2. Or manually create environment files from examples"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Launch cancelled"
        exit 1
    fi
fi

# ============================================================================
# STEP 5: Launch Services
# ============================================================================
print_step "${ROCKET} Launching services..."

# Create log directory
mkdir -p "$PROJECT_ROOT/logs"

# Launch Backend
print_info "Starting backend on port 8787..."
cd "$PROJECT_ROOT/backend"
npm run dev > "$PROJECT_ROOT/logs/backend.log" 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    print_error "Backend failed to start"
    echo "Check logs at: $PROJECT_ROOT/logs/backend.log"
    cat "$PROJECT_ROOT/logs/backend.log"
    exit 1
fi

print_success "Backend started (PID: $BACKEND_PID)"

# Launch Frontend
print_info "Starting frontend on port 5173..."
cd "$PROJECT_ROOT/frontend"
npm run dev > "$PROJECT_ROOT/logs/frontend.log" 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

# Check if frontend is running
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    print_error "Frontend failed to start"
    echo "Check logs at: $PROJECT_ROOT/logs/frontend.log"
    cat "$PROJECT_ROOT/logs/frontend.log"
    exit 1
fi

print_success "Frontend started (PID: $FRONTEND_PID)"

# ============================================================================
# STEP 6: Display Status
# ============================================================================
echo ""
print_header "${CHECK} Application is running!"

echo -e "${CYAN}Services:${NC}"
echo -e "  ${GLOBE} Frontend:  ${GREEN}http://localhost:5173${NC}"
echo -e "  ${DATABASE} Backend:   ${GREEN}http://localhost:8787${NC}"
echo ""

echo -e "${CYAN}Process IDs:${NC}"
echo -e "  Frontend: ${FRONTEND_PID}"
echo -e "  Backend:  ${BACKEND_PID}"
echo ""

echo -e "${CYAN}Logs:${NC}"
echo -e "  Frontend: ${PROJECT_ROOT}/logs/frontend.log"
echo -e "  Backend:  ${PROJECT_ROOT}/logs/backend.log"
echo ""

echo -e "${CYAN}Useful Commands:${NC}"
echo -e "  View frontend logs: tail -f ${PROJECT_ROOT}/logs/frontend.log"
echo -e "  View backend logs:  tail -f ${PROJECT_ROOT}/logs/backend.log"
echo ""

echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# ============================================================================
# STEP 7: Monitor Services
# ============================================================================

# Function to check if a process is still running
check_process() {
    if ! kill -0 $1 2>/dev/null; then
        return 1
    fi
    return 0
}

# Monitor loop
while true; do
    sleep 5
    
    # Check backend
    if ! check_process $BACKEND_PID; then
        print_error "Backend process died unexpectedly!"
        echo "Check logs at: $PROJECT_ROOT/logs/backend.log"
        tail -n 50 "$PROJECT_ROOT/logs/backend.log"
        exit 1
    fi
    
    # Check frontend
    if ! check_process $FRONTEND_PID; then
        print_error "Frontend process died unexpectedly!"
        echo "Check logs at: $PROJECT_ROOT/logs/frontend.log"
        tail -n 50 "$PROJECT_ROOT/logs/frontend.log"
        exit 1
    fi
done