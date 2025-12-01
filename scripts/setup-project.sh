#!/bin/bash

# Simplified Project Setup Script
# This script helps you set up the equestrian management project

set -e

echo "🐴 Equestrian Project Setup"
echo "============================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

echo "📋 This script will help you set up:"
echo "  1. Environment files from templates"
echo "  2. Install dependencies"
echo "  3. Verify configuration"
echo ""

# Step 1: Create environment files
echo "Step 1: Creating environment files..."
echo ""

# Frontend environment files
if [ ! -f "frontend/.env.dev" ]; then
    if [ -f "frontend/.env.dev.template" ]; then
        cp frontend/.env.dev.template frontend/.env.dev
        print_success "Created frontend/.env.dev"
    else
        print_warning "Template frontend/.env.dev.template not found"
    fi
else
    print_warning "frontend/.env.dev already exists (skipping)"
fi

if [ ! -f "frontend/.env.prod" ]; then
    if [ -f "frontend/.env.prod.template" ]; then
        cp frontend/.env.prod.template frontend/.env.prod
        print_success "Created frontend/.env.prod"
    else
        print_warning "Template frontend/.env.prod.template not found"
    fi
else
    print_warning "frontend/.env.prod already exists (skipping)"
fi

# Backend environment files
if [ ! -f "backend/.env.dev" ]; then
    if [ -f "backend/.env.dev.template" ]; then
        cp backend/.env.dev.template backend/.env.dev
        print_success "Created backend/.env.dev"
    else
        print_warning "Template backend/.env.dev.template not found"
    fi
else
    print_warning "backend/.env.dev already exists (skipping)"
fi

if [ ! -f "backend/.env.prod" ]; then
    if [ -f "backend/.env.prod.template" ]; then
        cp backend/.env.prod.template backend/.env.prod
        print_success "Created backend/.env.prod"
    else
        print_warning "Template backend/.env.prod.template not found"
    fi
else
    print_warning "backend/.env.prod already exists (skipping)"
fi

echo ""

# Step 2: Install dependencies
echo "Step 2: Installing dependencies..."
echo ""

# Install frontend dependencies
if [ -d "frontend" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    print_success "Frontend dependencies installed"
else
    print_warning "Frontend directory not found"
fi

# Install backend dependencies
if [ -d "backend" ]; then
    echo "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    print_success "Backend dependencies installed"
else
    print_warning "Backend directory not found"
fi

# Install scripts dependencies
if [ -d "scripts" ] && [ -f "scripts/package.json" ]; then
    echo "Installing scripts dependencies..."
    cd scripts
    npm install
    cd ..
    print_success "Scripts dependencies installed"
else
    print_warning "Scripts directory or package.json not found"
fi

echo ""

# Step 3: Verify configuration
echo "Step 3: Verifying configuration..."
echo ""

# Check for required files
MISSING_FILES=0

if [ ! -f "frontend/.env.dev" ]; then
    print_error "Missing: frontend/.env.dev"
    MISSING_FILES=$((MISSING_FILES + 1))
fi

if [ ! -f "backend/.env.dev" ]; then
    print_error "Missing: backend/.env.dev"
    MISSING_FILES=$((MISSING_FILES + 1))
fi

if [ ! -f "backend/wrangler.toml" ]; then
    print_warning "Missing: backend/wrangler.toml (optional for local dev)"
fi

if [ $MISSING_FILES -eq 0 ]; then
    print_success "All required configuration files present"
else
    print_warning "$MISSING_FILES required configuration file(s) missing"
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Configure your environment files:"
echo "   - Edit frontend/.env.dev with your Supabase credentials"
echo "   - Edit backend/.env.dev with your Supabase credentials"
echo ""
echo "2. Set up your Supabase project:"
echo "   - Go to https://supabase.com/dashboard"
echo "   - Create a new project"
echo "   - Run the SQL schema from docs/database-schema.sql"
echo "   - Copy your project URL and keys to the .env files"
echo ""
echo "3. Start development:"
echo "   - Frontend: cd frontend && npm run dev"
echo "   - Backend: cd backend && npm run dev"
echo ""
echo "4. For production deployment:"
echo "   - Configure backend/wrangler.toml"
echo "   - Set up Cloudflare Workers"
echo "   - Deploy with: npm run deploy"
echo ""
echo "📚 For more information, see the documentation in the docs/ directory"
echo ""