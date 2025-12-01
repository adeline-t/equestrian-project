# Production Deployment Issues Guide

## 🚨 Common Production Deployment Issues Checklist

### 1. **Environment Variables Missing or Incorrect**
- [ ] `VITE_API_URL` not set to production URL
- [ ] `SUPABASE_URL` not updated to production instance
- [ ] `SUPABASE_KEY` missing or incorrect (service role key needed)
- [ ] Environment variables not properly loaded in Cloudflare Workers

### 2. **CORS Configuration Issues**
- [ ] Frontend domain not whitelisted in Supabase
- [ ] CORS headers not properly configured in Workers
- [ ] Production domain not matching CORS allow origin

### 3. **Build and Asset Issues**
- [ ] Frontend not properly built for production
- [ ] Static assets not correctly referenced
- [ ] Build optimizations causing issues

### 4. **Database Connection Issues**
- [ ] Supabase connection string incorrect
- [ ] Database permissions insufficient
- [ ] Connection pool limits reached

### 5. **Cloudflare Workers Specific Issues**
- [ ] Workers not deployed to correct environment
- [ ] Memory limits exceeded
- [ ] Timeout configurations incorrect

---

## 🔍 Step-by-Step Debugging Approach

### Step 1: Verify Environment Variables

**Check Frontend Environment Variables:**
```bash
# Check if .env.production exists
cat frontend/.env.production

# Should contain:
VITE_API_URL=https://your-production-workers-url.workers.dev/api
```

**Check Backend Environment Variables:**
```bash
# Check wrangler.toml production vars
cat backend/wrangler.toml

# Verify production section exists
[env.production]
name = "equestrian-api-prod"
vars = { SUPABASE_URL = "https://your-production-project.supabase.co" }
```

### Step 2: Test API Health Endpoint

```bash
# Test production API health
curl https://your-production-workers-url.workers.dev/api/health

# Expected response:
{
  "status": "ok",
  "message": "API opérationnelle",
  "timestamp": "2024-XX-XX...",
  "version": "1.0.0"
}
```

### Step 3: Verify Database Connection

```bash
# Test database connection from Workers
# Add this temporary debug endpoint to backend/src/index.js:

if (path === '/api/debug/db') {
  try {
    const db = getDatabase(env);
    const { data, error } = await db.from('riders').select('count').single();
    return jsonResponse({
      database: 'connected',
      count: data?.count || 0,
      error: error?.message
    }, 200, getSecurityHeaders());
  } catch (err) {
    return jsonResponse({
      database: 'error',
      error: err.message
    }, 500, getSecurityHeaders());
  }
}
```

### Step 4: Check CORS Configuration

```bash
# Test CORS preflight
curl -X OPTIONS https://your-production-workers-url.workers.dev/api/riders \
  -H "Origin: https://your-production-domain.pages.dev" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

### Step 5: Verify Frontend Build

```bash
# Build frontend for production
cd frontend
npm run build

# Test production build locally
npm run preview
```

---

## 🛠️ Production Configuration Examples

### Frontend Production Configuration

**Create `frontend/.env.production`:**
```env
# Production API URL - Replace with your actual Workers URL
VITE_API_URL=https://equestrian-api-youraccount.workers.dev/api

# Disable console logs in production
VITE_LOG_LEVEL=error
```

**Update `frontend/vite.config.js`:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production
    minify: 'terser',
    target: 'esnext',
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
  // Define production-specific constants
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
  },
});
```

### Backend Production Configuration

**Update `backend/wrangler.toml`:**
```toml
name = "equestrian-api"
main = "src/index.js"
compatibility_date = "2024-01-01"

# Development environment
[vars]
SUPABASE_URL = "https://your-dev-project.supabase.co"

# Production environment
[env.production]
name = "equestrian-api-prod"
vars = { 
  SUPABASE_URL = "https://your-production-project.supabase.co",
  SUPABASE_KEY = "your-production-service-role-key"
}

# Staging environment
[env.staging]
name = "equestrian-api-staging"
vars = { 
  SUPABASE_URL = "https://your-staging-project.supabase.co",
  SUPABASE_KEY = "your-staging-service-role-key"
}
```

### Environment Variables Setup Script

**Create `scripts/setup-production.sh`:**
```bash
#!/bin/bash

# Production Environment Setup Script
echo "🚀 Setting up production environment..."

# Frontend Environment
echo "Setting up frontend environment..."
cat > frontend/.env.production << EOF
VITE_API_URL=https://$1.workers.dev/api
VITE_LOG_LEVEL=error
EOF

# Backend Environment Variables
echo "Setting up backend environment..."
# Set Supabase URL
wrangler secret put SUPABASE_URL --env production << EOF
https://your-production-project.supabase.co
EOF

# Set Supabase Service Role Key
wrangler secret put SUPABASE_KEY --env production << EOF
your-production-service-role-key
EOF

echo "✅ Production environment configured!"
echo "🌐 Frontend will use: https://$1.workers.dev/api"
```

---

## 🔧 Specific Fixes for Common Issues

### Issue 1: API Calls Failing with CORS Error

**Fix:** Update CORS configuration in `backend/src/index.js`:

```javascript
// Replace the existing CORS configuration
const getAllowedOrigin = (request) => {
  const origin = request.headers.get('Origin');
  const allowedOrigins = [
    'http://localhost:5173',
    'https://your-production-domain.pages.dev',
    'https://your-staging-domain.pages.dev'
  ];
  
  return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
};

// Update CORS preflight
if (method === 'OPTIONS') {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': getAllowedOrigin(request),
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...getSecurityHeaders()
    }
  });
}
```

### Issue 2: Environment Variables Not Loading

**Fix:** Update frontend API service:

```javascript
// In frontend/src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

// Add environment validation
const validateEnvironment = () => {
  if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
    console.error('❌ VITE_API_URL not set in production');
    return false;
  }
  return true;
};

// Add validation at module level
if (!validateEnvironment()) {
  throw new Error('Environment configuration error');
}
```

### Issue 3: Database Connection Failing

**Fix:** Update database connection with retry logic:

```javascript
// In backend/src/db.js
export function getDatabase(env) {
  return createClient(
    env.SUPABASE_URL,
    env.SUPABASE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'User-Agent': 'equestrian-api/1.0.0'
        }
      }
    }
  );
}
```

---

## 📋 Pre-Deployment Checklist

### Before Deploying to Production:

- [ ] All environment variables configured
- [ ] Database migrations run on production
- [ ] CORS settings updated for production domain
- [ ] Frontend built with production optimizations
- [ ] API health endpoint responding correctly
- [ ] Error logging configured
- [ ] Rate limiting implemented
- [ ] Security headers verified

### Testing in Production:

- [ ] Create test rider via API
- [ ] Create test horse via API
- [ ] Create test association via API
- [ ] Test frontend forms submit correctly
- [ ] Verify data persists in database
- [ ] Test error handling displays properly

---

## 🚨 Emergency Rollback Procedures

### If Production Deployment Fails:

1. **Frontend Rollback:**
```bash
# Revert to previous build
git checkout previous-commit-hash
npm run build
# Redeploy static files
```

2. **Backend Rollback:**
```bash
# Deploy previous version
wrangler deploy --env production --compatibility-date 2024-01-01
```

3. **Database Rollback:**
```bash
# Use Supabase dashboard to revert changes
# Or run migration rollback scripts
```

---

## 📞 Support & Troubleshooting

### Useful Commands:
```bash
# Check Workers logs
wrangler tail --env production

# Check deployment status
wrangler deployments list --env production

# Test API endpoints
curl -X GET https://your-workers-url.workers.dev/api/health

# Check Supabase connection
wrangler secret list --env production
```

### Common Error Messages:
- `1009: DNS resolution failed` → Check Workers URL
- `403: Forbidden` → Check API keys and permissions
- `CORS error` → Update CORS configuration
- `500: Internal Server Error` → Check Workers logs