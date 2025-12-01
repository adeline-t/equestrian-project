#!/bin/bash

# Simplified Cloudflare Setup Guide
# This script provides instructions for setting up Cloudflare Workers

set -e

echo "☁️  Cloudflare Workers Setup Guide"
echo "=================================="
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

echo "This guide will help you deploy your backend to Cloudflare Workers."
echo ""

print_step "Step 1: Install Wrangler CLI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if command -v wrangler &> /dev/null; then
    print_success "Wrangler is already installed ($(wrangler --version))"
else
    echo "Wrangler is not installed. Installing..."
    npm install -g wrangler
    print_success "Wrangler installed"
fi

echo ""
read -p "Press Enter to continue..."
echo ""

print_step "Step 2: Authenticate with Cloudflare"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Run the following command to authenticate:"
echo ""
echo "  wrangler login"
echo ""
echo "This will open a browser window to log in to Cloudflare."
echo ""
read -p "Press Enter when you've completed authentication..."
echo ""

print_step "Step 3: Configure wrangler.toml"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ ! -f "backend/wrangler.toml" ]; then
    print_info "wrangler.toml not found. Creating from template..."
    if [ -f "backend/wrangler.toml.template" ]; then
        cp backend/wrangler.toml.template backend/wrangler.toml
        print_success "Created backend/wrangler.toml"
    else
        print_info "Template not found. You'll need to create wrangler.toml manually."
    fi
else
    print_success "wrangler.toml already exists"
fi

echo ""
echo "Edit backend/wrangler.toml and update:"
echo "  - name: your-worker-name"
echo "  - account_id: your-cloudflare-account-id"
echo ""
echo "To find your account ID:"
echo "  1. Go to: https://dash.cloudflare.com"
echo "  2. Select your account"
echo "  3. Copy the Account ID from the right sidebar"
echo ""
read -p "Press Enter when you've updated wrangler.toml..."
echo ""

print_step "Step 4: Set Environment Secrets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Set your Supabase credentials as secrets:"
echo ""
echo "Run these commands in the backend directory:"
echo ""
echo "  cd backend"
echo "  wrangler secret put SUPABASE_URL"
echo "  wrangler secret put SUPABASE_ANON_KEY"
echo "  wrangler secret put SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "You'll be prompted to enter each value."
echo ""
read -p "Press Enter when you've set the secrets..."
echo ""

print_step "Step 5: Deploy to Cloudflare Workers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Deploy your worker with:"
echo ""
echo "  cd backend"
echo "  npm run deploy"
echo ""
echo "Or for development:"
echo ""
echo "  npm run dev"
echo ""
read -p "Press Enter to see deployment options..."
echo ""

print_step "Step 6: Configure Custom Domain (Optional)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "To use a custom domain:"
echo ""
echo "1. In Cloudflare Dashboard:"
echo "   - Go to Workers & Pages"
echo "   - Select your worker"
echo "   - Go to Settings > Triggers"
echo "   - Add Custom Domain"
echo ""
echo "2. Or use Wrangler CLI:"
echo "   wrangler domains add api.yourdomain.com"
echo ""
read -p "Press Enter to continue..."
echo ""

print_step "Step 7: Update Frontend Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Update your frontend environment files with the Worker URL:"
echo ""
echo "In frontend/.env.prod:"
echo "  VITE_API_URL=https://your-worker.your-subdomain.workers.dev"
echo ""
echo "Or if using custom domain:"
echo "  VITE_API_URL=https://api.yourdomain.com"
echo ""
read -p "Press Enter when you've updated the frontend config..."
echo ""

print_success "Cloudflare Workers setup complete!"
echo ""
echo "🎉 Next Steps:"
echo ""
echo "1. Test your deployment:"
echo "   curl https://your-worker.workers.dev/api/riders"
echo ""
echo "2. Deploy your frontend:"
echo "   cd frontend"
echo "   npm run build"
echo "   npm run deploy"
echo ""
echo "3. Monitor your worker:"
echo "   - Cloudflare Dashboard > Workers & Pages"
echo "   - View logs with: wrangler tail"
echo ""
echo "📚 Documentation:"
echo "  - Cloudflare Workers: https://developers.cloudflare.com/workers"
echo "  - Wrangler CLI: https://developers.cloudflare.com/workers/wrangler"
echo ""