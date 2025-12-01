#!/bin/bash

# Quick Start Script
# Simplified script to get the project running quickly

set -e

echo "🚀 Quick Start - Equestrian Project"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

print_success "Node.js $(node --version) detected"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

print_success "npm $(npm --version) detected"

echo ""
print_info "Installing dependencies..."
echo ""

# Install frontend dependencies
if [ -d "frontend" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install --silent
    cd ..
    print_success "Frontend dependencies installed"
else
    print_error "Frontend directory not found"
    exit 1
fi

# Install backend dependencies
if [ -d "backend" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install --silent
    cd ..
    print_success "Backend dependencies installed"
else
    print_error "Backend directory not found"
    exit 1
fi

echo ""
print_info "Checking environment configuration..."
echo ""

# Check for environment files
ENV_CONFIGURED=true

if [ ! -f "frontend/.env.dev" ]; then
    print_warning "frontend/.env.dev not found"
    ENV_CONFIGURED=false
fi

if [ ! -f "backend/.env.dev" ]; then
    print_warning "backend/.env.dev not found"
    ENV_CONFIGURED=false
fi

if [ "$ENV_CONFIGURED" = false ]; then
    echo ""
    print_warning "Environment files not configured!"
    echo ""
    echo "To configure your environment:"
    echo "  1. Run: ./scripts/setup-project.sh"
    echo "  2. Edit the .env files with your Supabase credentials"
    echo ""
    read -p "Do you want to run setup-project.sh now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ./scripts/setup-project.sh
    else
        print_info "Skipping environment setup"
    fi
fi

echo ""
print_success "Quick start complete!"
echo ""
echo "🎯 To start development:"
echo ""
echo "  Frontend (in one terminal):"
echo "    cd frontend && npm run dev"
echo ""
echo "  Backend (in another terminal):"
echo "    cd backend && npm run dev"
echo ""
echo "📚 For more information:"
echo "  - Documentation: docs/"
echo "  - Full setup: ./scripts/setup-project.sh"
echo ""