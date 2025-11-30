#!/bin/bash

# Cloudflare Setup Script
# This script helps set up Cloudflare configuration for dev and prod environments

set -e

echo "☁️  Cloudflare Setup Script"
echo "This script will guide you through setting up Cloudflare configuration"
echo ""

# Function to setup custom domains
setup_custom_domains() {
    echo ""
    echo "🌐 Setting up Custom Domains"
    echo ""
    echo "Please follow these steps:"
    echo "1. Log in to Cloudflare Dashboard: https://dash.cloudflare.com"
    echo "2. Add your domain: yourdomain.com"
    echo "3. Update your nameservers to Cloudflare's nameservers"
    echo ""
    echo "4. Create these DNS records:"
    echo ""
    echo "Development Environment:"
    echo "  Type: A"
    echo "  Name: dev"
    echo "  Content: 192.0.2.1"
    echo "  TTL: Auto"
    echo "  Proxy: Proxied (orange cloud)"
    echo ""
    echo "Production Environment:"
    echo "  Type: A"
    echo "  Name: app (or @ for root)"
    echo "  Content: 192.0.2.1"
    echo "  TTL: Auto"
    echo "  Proxy: Proxied (orange cloud)"
    echo ""
    echo "  Type: CNAME"
    echo "  Name: api"
    echo "  Content: your-workers-subdomain.workers.dev"
    echo "  TTL: Auto"
    echo "  Proxy: Proxied (orange cloud)"
    echo ""
}

# Function to setup Workers
setup_workers() {
    echo ""
    echo "⚙️  Setting up Cloudflare Workers"
    echo ""
    echo "1. Make sure you're authenticated with Wrangler:"
    echo "   wrangler auth login"
    echo ""
    echo "2. Deploy development worker:"
    echo "   cd backend"
    echo "   npx wrangler deploy --env dev"
    echo ""
    echo "3. Deploy production worker:"
    echo "   npx wrangler deploy --env prod"
    echo ""
    echo "4. Bind custom domains:"
    echo "   npx wrangler custom-domains add dev-api.yourdomain.com --env dev"
    echo "   npx wrangler custom-domains add api.yourdomain.com --env prod"
    echo ""
}

# Function to setup security settings
setup_security_settings() {
    echo ""
    echo "🔒 Setting up Security Settings"
    echo ""
    echo "Development Environment Settings (dev.yourdomain.com):"
    echo "  SSL/TLS: Flexible"
    echo "  Security Level: Medium"
    echo "  Cache Level: No Query String"
    echo "  Browser Cache TTL: 4 hours"
    echo "  Development Mode: Enabled"
    echo ""
    echo "Production Environment Settings (yourdomain.com):"
    echo "  SSL/TLS: Full (Strict)"
    echo "  Security Level: High"
    echo "  Cache Level: Standard"
    echo "  Browser Cache TTL: 1 day"
    echo "  Development Mode: Disabled"
    echo "  Always Online: Enabled"
    echo "  Automatic HTTPS Rewrites: Enabled"
    echo ""
}

# Function to create Page Rules
create_page_rules() {
    echo ""
    echo "📋 Creating Page Rules"
    echo ""
    echo "Development Page Rules:"
    echo "  URL: dev.yourdomain.com/*"
    echo "  Settings:"
    echo "    - Cache Level: Bypass"
    echo "    - Security Level: Off"
    echo "    - Browser Cache TTL: 30 minutes"
    echo ""
    echo "Production Page Rules:"
    echo "  URL 1: yourdomain.com/api/*"
    echo "  Settings:"
    echo "    - Cache Level: Bypass (for API endpoints)"
    echo ""
    echo "  URL 2: yourdomain.com/*"
    echo "  Settings:"
    echo "    - Cache Level: Standard"
    echo "    - Security Level: High"
    echo ""
}

# Function to setup environment variables
setup_worker_secrets() {
    echo ""
    echo "🔐 Setting up Worker Secrets"
    echo ""
    echo "Development Environment:"
    echo "  cd backend"
    echo "  npx wrangler secret put SUPABASE_URL --env dev"
    echo "  npx wrangler secret put SUPABASE_ANON_KEY --env dev"
    echo "  npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env dev"
    echo ""
    echo "Production Environment:"
    echo "  cd backend"
    echo "  npx wrangler secret put SUPABASE_URL --env prod"
    echo "  npx wrangler secret put SUPABASE_ANON_KEY --env prod"
    echo "  npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env prod"
    echo ""
    echo "Note: You'll be prompted to enter each secret value"
}

# Function to create Cloudflare configuration file
create_cloudflare_config() {
    echo ""
    echo "📄 Creating Cloudflare Configuration Files"
    echo ""
    
    # Create Cloudflare.toml for project configuration
    cat > cloudflare.toml << 'EOF'
# Cloudflare Configuration
# This file contains Cloudflare-specific settings

[environments]

[environments.dev]
domain = "dev.yourdomain.com"
worker_domain = "dev-api.yourdomain.com"

[environments.prod]
domain = "yourdomain.com"
worker_domain = "api.yourdomain.com"

[security]

[security.dev]
ssl_mode = "flexible"
security_level = "medium"
cache_level = "no_query_string"
browser_cache_ttl = "4h"
development_mode = true

[security.prod]
ssl_mode = "full_strict"
security_level = "high"
cache_level = "standard"
browser_cache_ttl = "1d"
development_mode = false

[page_rules]

[page_rules.dev]
url = "dev.yourdomain.com/*"
cache_level = "bypass"
security_level = "off"
browser_cache_ttl = "30m"

[page_rules.prod_api]
url = "yourdomain.com/api/*"
cache_level = "bypass"

[page_rules.prod_site]
url = "yourdomain.com/*"
cache_level = "standard"
security_level = "high"
EOF
    
    echo "✅ Created cloudflare.toml configuration file"
}

# Function to test setup
test_setup() {
    echo ""
    echo "🧪 Testing Setup"
    echo ""
    echo "After completing the setup, test with these commands:"
    echo ""
    echo "1. Test Workers:"
    echo "   curl https://dev-api.yourdomain.com/api/riders"
    echo "   curl https://api.yourdomain.com/api/riders"
    echo ""
    echo "2. Test Frontend:"
    echo "   curl https://dev.yourdomain.com"
    echo "   curl https://yourdomain.com"
    echo ""
    echo "3. Check Worker logs:"
    echo "   npx wrangler tail --env dev"
    echo "   npx wrangler tail --env prod"
    echo ""
}

# Main setup function
main() {
    echo "This script will guide you through Cloudflare setup for both environments"
    echo ""
    
    setup_custom_domains
    setup_workers
    setup_security_settings
    create_page_rules
    setup_worker_secrets
    create_cloudflare_config
    test_setup
    
    echo ""
    echo "🎉 Cloudflare setup guide completed!"
    echo ""
    echo "📋 Important Notes:"
    echo "1. DNS changes may take 24-48 hours to propagate"
    echo "2. SSL certificates may take time to issue"
    echo "3. Test thoroughly in development before production"
    echo "4. Monitor Cloudflare Analytics for performance"
    echo ""
    echo "📚 Additional Resources:"
    echo "  - Cloudflare Docs: https://developers.cloudflare.com"
    echo "  - Wrangler CLI: https://developers.cloudflare.com/workers/wrangler"
    echo "  - Custom Domains: https://developers.cloudflare.com/workers/platform/custom-domains"
    echo ""
}

# Run the setup
main