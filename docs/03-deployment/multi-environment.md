# Multi-Environment Deployment Setup Guide

This guide provides comprehensive instructions for setting up and managing "dev" (development) and "prod" (production) environments for your equestrian web application.

## Table of Contents

1. [File Structure & Configuration Files](#1-file-structure--configuration-files)
2. [Supabase Configuration](#2-supabase-configuration)
3. [Cloudflare Configuration](#3-cloudflare-configuration)
4. [Cloudflare Workers Configuration](#4-cloudflare-workers-configuration)
5. [Deployment Commands](#5-deployment-commands)

---

## 1. File Structure & Configuration Files

### 1.1 Environment-Specific File Structure

```
equestrian-project/
├── frontend/
│   ├── .env.dev                 # Development environment variables
│   ├── .env.prod                # Production environment variables
│   ├── .env.example             # Example template
│   ├── vite.config.dev.js       # Dev-specific Vite config
│   ├── vite.config.prod.js      # Prod-specific Vite config
│   └── package.json
├── backend/
│   ├── wrangler.toml            # Enhanced with env support
│   ├── .env.dev                 # Backend dev variables
│   ├── .env.prod                # Backend prod variables
│   └── package.json
└── docs/
    └── deployment/              # This documentation
```

### 1.2 Frontend Configuration Files

#### Development Environment (.env.dev)

```bash
# Development Environment Configuration
VITE_API_URL=https://dev-api.yourdomain.com/api
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=dev_anon_key_here
VITE_ENVIRONMENT=development
VITE_LOG_LEVEL=debug
```

#### Production Environment (.env.prod)

```bash
# Production Environment Configuration
VITE_API_URL=https://api.yourdomain.com/api
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod_anon_key_here
VITE_ENVIRONMENT=production
VITE_LOG_LEVEL=error
```

### 1.3 Backend Configuration Files

#### Enhanced wrangler.toml

```toml
name = "equestrian-api"
main = "src/index.js"
compatibility_date = "2024-01-01"

# Environment variables (loaded from .env files)
[vars]
ENVIRONMENT = "development"

# Development Environment
[env.dev]
name = "equestrian-api-dev"
vars = { ENVIRONMENT = "development" }

# Production Environment
[env.prod]
name = "equestrian-api-prod"
vars = { ENVIRONMENT = "production" }

# KV Namespaces (if needed)
[[kv_namespaces]]
binding = "CACHE_KV"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-id"
```

### 1.4 Environment-Specific Vite Configurations

#### Development Vite Config (vite.config.dev.js)

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist-dev',
    sourcemap: true,
    minify: false,
  },
});
```

#### Production Vite Config (vite.config.prod.js)

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['axios', 'date-fns'],
        },
      },
    },
  },
});
```

---

## 2. Supabase Configuration

### 2.1 Setting Up Separate Supabase Projects

#### Step 1: Create Development Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in or create an account
4. Click "New Project"
5. **Development Project Settings:**
   - **Organization**: Your organization name
   - **Project Name**: `equestrian-dev`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest region
   - **Pricing Plan**: Free tier (for development)

#### Step 2: Create Production Supabase Project

1. Repeat the above process with:
   - **Project Name**: `equestrian-prod`
   - **Database Password**: Generate a different strong password
   - **Pricing Plan**: Pro tier (recommended for production)

### 2.2 Supabase Environment Variables

#### Development Environment Variables

```bash
# Supabase Development
SUPABASE_DEV_URL=https://[project-ref].supabase.co
SUPABASE_DEV_ANON_KEY=your_dev_anon_key
SUPABASE_DEV_SERVICE_ROLE_KEY=your_dev_service_role_key
SUPABASE_DEV_DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

#### Production Environment Variables

```bash
# Supabase Production
SUPABASE_PROD_URL=https://[project-ref].supabase.co
SUPABASE_PROD_ANON_KEY=your_prod_anon_key
SUPABASE_PROD_SERVICE_ROLE_KEY=your_prod_service_role_key
SUPABASE_PROD_DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### 2.3 Database Configuration Differences

#### Development Database

- **Row Level Security (RLS)**: Enabled but less restrictive
- **Backup Frequency**: Daily (included in free tier)
- **Connection Pooling**: 10 connections
- **API Rate Limits**: Standard limits

#### Production Database

- **Row Level Security (RLS)**: Enabled with strict policies
- **Backup Frequency**: Point-in-time recovery enabled
- **Connection Pooling**: 20+ connections
- **API Rate Limits**: Higher limits with Pro plan
- **Additional Features**:
  - Database replicas for read operations
  - Advanced monitoring and alerts
  - Custom domains for API

### 2.4 Security Settings

#### Development Security

```sql
-- Enable RLS but with permissive policies
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pairings ENABLE ROW LEVEL SECURITY;

-- Development policies (allow all operations)
CREATE POLICY "Dev - All operations on riders" ON riders
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Dev - All operations on horses" ON horses
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Dev - All operations on pairings" ON pairings
    FOR ALL USING (true) WITH CHECK (true);
```

#### Production Security

```sql
-- Strict RLS policies for production
CREATE POLICY "Users can read riders" ON riders
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert riders" ON riders
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own riders" ON riders
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own riders" ON riders
    FOR DELETE USING (auth.uid() = created_by);
```

---

## 3. Cloudflare Configuration

### 3.1 Domain and Subdomain Setup

#### Step 1: Configure Custom Domains

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Add your domain: `yourdomain.com`
3. Update your nameservers to Cloudflare's nameservers

#### Step 2: Create Subdomains

- **Development**: `dev.yourdomain.com`
- **Production**: `app.yourdomain.com` (or `yourdomain.com`)

### 3.2 DNS Configuration

#### Development DNS Records

```
Type: A
Name: dev
Content: 192.0.2.1  (Cloudflare Workers IP)
TTL: Auto
Proxy status: Proxied (orange cloud)
```

#### Production DNS Records

```
Type: A
Name: app (or @ for root)
Content: 192.0.2.1  (Cloudflare Workers IP)
TTL: Auto
Proxy status: Proxied (orange cloud)

Type: CNAME
Name: api
Content: your-workers-subdomain.workers.dev
TTL: Auto
Proxy status: Proxied (orange cloud)
```

### 3.3 Cloudflare-Specific Settings

#### Development Environment Settings

- **SSL/TLS**: Flexible (easier setup)
- **Security Level**: Medium
- **Cache Level**: No Query String
- **Browser Cache TTL**: 4 hours
- **Development Mode**: Enabled (bypass cache)

#### Production Environment Settings

- **SSL/TLS**: Full (Strict)
- **Security Level**: High
- **Cache Level**: Standard
- **Browser Cache TTL**: 1 day
- **Development Mode**: Disabled
- **Always Online**: Enabled
- **Automatic HTTPS Rewrites**: Enabled

### 3.4 Page Rules for Environment Management

#### Development Page Rules

```
dev.yourdomain.com/*:
- Cache Level: Bypass
- Security Level: Off
- Browser Cache TTL: 30 minutes
```

#### Production Page Rules

```
yourdomain.com/api/*:
- Cache Level: Bypass (for API endpoints)

yourdomain.com/*:
- Cache Level: Standard
- Security Level: High
```

---

## 4. Cloudflare Workers Configuration

### 4.1 Creating Separate Workers

#### Step 1: Create Development Worker

```bash
# Create and configure development worker
npx wrangler env list
npx wrangler secret put SUPABASE_URL --env dev
npx wrangler secret put SUPABASE_ANON_KEY --env dev
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env dev
```

#### Step 2: Create Production Worker

```bash
# Create and configure production worker
npx wrangler env list
npx wrangler secret put SUPABASE_URL --env prod
npx wrangler secret put SUPABASE_ANON_KEY --env prod
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env prod
```

### 4.2 Environment Variables and Secrets Management

#### Backend Environment Variables (.env files)

**backend/.env.dev**

```bash
# Development Environment
SUPABASE_URL=https://dev-project.supabase.co
SUPABASE_ANON_KEY=dev_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=dev_service_key_here
ENVIRONMENT=development
LOG_LEVEL=debug
```

**backend/.env.prod**

```bash
# Production Environment
SUPABASE_URL=https://prod-project.supabase.co
SUPABASE_ANON_KEY=prod_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=prod_service_key_here
ENVIRONMENT=production
LOG_LEVEL=error
```

### 4.3 Routing and Binding Configuration

#### Custom Domain Routing

```bash
# Bind development worker to subdomain
npx wrangler custom-devices list
npx wrangler tail --env dev

# Bind production worker to custom domain
npx wrangler custom-domains list api.yourdomain.com --env prod
```

### 4.4 Environment-Specific Worker Settings

#### Development Worker Configuration

```javascript
// src/index.js - Development settings
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Enable debugging
console.log('Worker initialized in development mode');
```

#### Production Worker Configuration

```javascript
// src/index.js - Production settings
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yourdomain.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Production logging
if (ENVIRONMENT === 'production') {
  console.log('Worker initialized in production mode');
}
```

---

## 5. Deployment Commands

### 5.1 Prerequisite Installations

#### Global Dependencies

```bash
# Install Node.js (v18+ recommended)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Wrangler CLI
npm install -g wrangler

# Install Cloudflare CLI (optional)
npm install -g cloudflare

# Verify installations
node --version
npm --version
wrangler --version
```

#### Authentication Setup

```bash
# Authenticate with Cloudflare
wrangler auth login

# Verify authentication
wrangler whoami
```

### 5.2 Development Environment Deployment

#### Step-by-Step Development Deployment

**1. Prepare Development Environment**

```bash
# Navigate to project directory
cd equestrian-project

# Install dependencies
npm install --prefix frontend
npm install --prefix backend

# Load development environment variables
cp frontend/.env.dev frontend/.env
cp backend/.env.dev backend/.env
```

**2. Start Development Servers**

```bash
# Start backend development server (in terminal 1)
cd backend
npm run dev

# Start frontend development server (in terminal 2)
cd frontend
npm run dev
```

**3. Deploy Development Backend**

```bash
# Deploy to development environment
cd backend
npx wrangler deploy --env dev

# Verify deployment
npx wrangler tail --env dev
```

**4. Deploy Development Frontend**

```bash
# Build development frontend
cd frontend
npm run build

# Deploy to development (using Pages or Workers)
npx wrangler pages deploy dist --project-name equestrian-dev
```

**5. Development URL Access**

- Frontend: `https://dev.yourdomain.com`
- Backend API: `https://dev-api.yourdomain.com/api`

### 5.3 Production Environment Deployment

#### Step-by-Step Production Deployment

**1. Prepare Production Environment**

```bash
# Navigate to project directory
cd equestrian-project

# Load production environment variables
cp frontend/.env.prod frontend/.env
cp backend/.env.prod backend/.env

# Verify environment variables
cat frontend/.env
cat backend/.env
```

**2. Production Build**

```bash
# Build production frontend
cd frontend
npm run build

# Verify build output
ls -la dist/
```

**3. Deploy Production Backend**

```bash
# Deploy to production environment
cd backend
npx wrangler deploy --env prod

# Verify production deployment
npx wrangler tail --env prod
```

**4. Deploy Production Frontend**

```bash
# Deploy production frontend
cd frontend
npx wrangler pages deploy dist --project-name equestrian-prod

# Or if using custom domains
npx wrangler pages deploy dist --project-name equestrian-prod --compatibility-date 2024-01-01
```

**5. Production URL Access**

- Frontend: `https://app.yourdomain.com` or `https://yourdomain.com`
- Backend API: `https://api.yourdomain.com/api`

### 5.4 Environment Switching Commands

#### Switch to Development Environment

```bash
# Load dev environment
cp frontend/.env.dev frontend/.env
cp backend/.env.dev backend/.env

# Start dev servers
cd backend && npm run dev &
cd frontend && npm run dev
```

#### Switch to Production Environment

```bash
# Load prod environment
cp frontend/.env.prod frontend/.env
cp backend/.env.prod backend/.env

# Deploy to production
cd backend && npx wrangler deploy --env prod
cd frontend && npm run build && npx wrangler pages deploy dist --project-name equestrian-prod
```

#### Environment Management Script

```bash
# Create deployment script: deploy.sh
#!/bin/bash

ENVIRONMENT=${1:-dev}
echo "Deploying to $ENVIRONMENT environment..."

case $ENVIRONMENT in
  "dev")
    echo "🚀 Deploying to Development..."
    cp frontend/.env.dev frontend/.env
    cp backend/.env.dev backend/.env
    cd backend && npx wrangler deploy --env dev
    cd ../frontend && npm run build && npx wrangler pages deploy dist --project-name equestrian-dev
    echo "✅ Development deployment complete: https://dev.yourdomain.com"
    ;;
  "prod")
    echo "🚀 Deploying to Production..."
    cp frontend/.env.prod frontend/.env
    cp backend/.env.prod backend/.env
    cd backend && npx wrangler deploy --env prod
    cd ../frontend && npm run build && npx wrangler pages deploy dist --project-name equestrian-prod
    echo "✅ Production deployment complete: https://yourdomain.com"
    ;;
  *)
    echo "❌ Invalid environment. Use 'dev' or 'prod'"
    exit 1
    ;;
esac
```

**Usage:**

```bash
chmod +x deploy.sh
./deploy.sh dev    # Deploy to development
./deploy.sh prod   # Deploy to production
```

---

## 🚨 Important Notes and Warnings

### Security Considerations

- **Never commit** `.env` files to version control
- **Always use** secrets for sensitive data in production
- **Enable RLS** on all Supabase tables in production
- **Use HTTPS** for all production endpoints

### Best Practices

- **Test thoroughly** in development before production deployment
- **Use Git branches** for environment-specific changes
- **Monitor logs** and performance in production
- **Keep backups** of database and configurations

### Troubleshooting

- If deployment fails, check Cloudflare Workers logs: `npx wrangler tail --env [env]`
- Verify environment variables are correctly loaded
- Check CORS settings for API access
- Ensure SSL certificates are properly configured

---

This comprehensive guide provides everything you need to set up and manage multi-environment deployments for your equestrian web application. Follow each step carefully and test thoroughly before moving to production.
