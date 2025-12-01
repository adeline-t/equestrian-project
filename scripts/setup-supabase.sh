#!/bin/bash

# Simplified Supabase Setup Guide
# This script provides instructions for setting up Supabase

set -e

echo "🗄️  Supabase Setup Guide"
echo "======================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

echo "This guide will help you set up Supabase for your project."
echo ""

print_step "Step 1: Create a Supabase Project"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to: https://supabase.com/dashboard"
echo "2. Sign in or create an account"
echo "3. Click 'New Project'"
echo "4. Fill in the details:"
echo "   - Name: equestrian-dev (or your preferred name)"
echo "   - Database Password: (generate a strong password)"
echo "   - Region: (choose closest to you)"
echo "5. Click 'Create new project'"
echo ""
read -p "Press Enter when you've created your project..."
echo ""

print_step "Step 2: Get Your Project Credentials"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. In your Supabase project dashboard:"
echo "2. Go to: Settings > API"
echo "3. Copy the following values:"
echo ""
echo "   📋 Project URL (looks like: https://xxxxx.supabase.co)"
echo "   📋 anon/public key (starts with: eyJhbG...)"
echo "   📋 service_role key (starts with: eyJhbG...)"
echo ""
read -p "Press Enter when you have these values ready..."
echo ""

print_step "Step 3: Configure Environment Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to update env file
update_env_file() {
    local file=$1
    local url=$2
    local anon_key=$3
    local service_key=$4
    
    if [ -f "$file" ]; then
        # Update existing file
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|SUPABASE_URL=.*|SUPABASE_URL=$url|g" "$file"
            sed -i '' "s|SUPABASE_ANON_KEY=.*|SUPABASE_ANON_KEY=$anon_key|g" "$file"
            if [ -n "$service_key" ]; then
                sed -i '' "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$service_key|g" "$file"
            fi
        else
            # Linux
            sed -i "s|SUPABASE_URL=.*|SUPABASE_URL=$url|g" "$file"
            sed -i "s|SUPABASE_ANON_KEY=.*|SUPABASE_ANON_KEY=$anon_key|g" "$file"
            if [ -n "$service_key" ]; then
                sed -i "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$service_key|g" "$file"
            fi
        fi
        print_success "Updated $file"
    else
        print_info "$file not found (will need manual creation)"
    fi
}

# Get credentials from user
read -p "Enter your Project URL: " PROJECT_URL
read -p "Enter your anon/public key: " ANON_KEY
read -p "Enter your service_role key: " SERVICE_KEY

echo ""
echo "Updating environment files..."
echo ""

# Update frontend files
update_env_file "frontend/.env.dev" "$PROJECT_URL" "$ANON_KEY" ""
update_env_file "frontend/.env.prod" "$PROJECT_URL" "$ANON_KEY" ""

# Update backend files
update_env_file "backend/.env.dev" "$PROJECT_URL" "$ANON_KEY" "$SERVICE_KEY"
update_env_file "backend/.env.prod" "$PROJECT_URL" "$ANON_KEY" "$SERVICE_KEY"

echo ""
print_step "Step 4: Set Up Database Schema"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. In your Supabase project dashboard:"
echo "2. Go to: SQL Editor"
echo "3. Click 'New Query'"
echo "4. Copy and paste the SQL from: docs/database-schema.sql"
echo "5. Click 'Run' to execute the schema"
echo ""
echo "This will create:"
echo "  - riders table"
echo "  - horses table"
echo "  - associations table"
echo "  - Row Level Security policies"
echo ""
read -p "Press Enter when you've run the schema..."
echo ""

print_step "Step 5: Verify Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Testing connection..."
echo ""

# Simple verification
if [ -f "frontend/.env.dev" ] && grep -q "supabase.co" "frontend/.env.dev"; then
    print_success "Frontend configuration looks good"
else
    print_info "Frontend configuration may need manual verification"
fi

if [ -f "backend/.env.dev" ] && grep -q "supabase.co" "backend/.env.dev"; then
    print_success "Backend configuration looks good"
else
    print_info "Backend configuration may need manual verification"
fi

echo ""
print_success "Supabase setup complete!"
echo ""
echo "🎉 Next Steps:"
echo ""
echo "1. Start your development servers:"
echo "   - Frontend: cd frontend && npm run dev"
echo "   - Backend: cd backend && npm run dev"
echo ""
echo "2. Test the connection by creating a rider or horse"
echo ""
echo "3. For production setup:"
echo "   - Create a separate Supabase project for production"
echo "   - Update frontend/.env.prod and backend/.env.prod"
echo "   - Run the same database schema"
echo ""
echo "📚 Documentation: docs/"
echo ""