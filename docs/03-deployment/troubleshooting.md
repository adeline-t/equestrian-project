# Production Deployment Troubleshooting Guide

## 🔍 **Quick Diagnosis Checklist**

### Before You Start - Verify These First:
1. **Frontend builds successfully locally**: `npm run build`
2. **Backend deploys without errors**: `npm run deploy`
3. **Environment variables are set**: Check Cloudflare Workers dashboard
4. **Database is accessible**: Verify Supabase connection

---

## 🚨 **Common Production Issues & Solutions**

### **Issue 1: API Connection Failures**

**Symptoms:**
- Frontend loads but data doesn't appear
- Console shows network errors (CORS, 404, 500)
- "Impossible de contacter le serveur" messages

**Root Causes & Solutions:**

#### A. Missing/Wrong Environment Variables
```bash
# Check current .env file
cat frontend/.env

# Should contain your production Cloudflare Workers URL:
VITE_API_URL=https://your-worker-name.your-subdomain.workers.dev/api
```

**Fix:**
1. Get your Workers URL from Cloudflare dashboard
2. Update `frontend/.env`:
```env
VITE_API_URL=https://equestrian-api-prod.your-account.workers.dev/api
```

#### B. CORS Configuration Issues
**Problem**: Frontend domain not in CORS allowlist

**Check backend CORS settings** in `backend/src/index.js`:
```javascript
// Currently uses wildcard - should be more restrictive in production
'Access-Control-Allow-Origin': '*'
```

**Production Fix:**
```javascript
// In backend/src/index.js - replace wildcard with your domain
'Access-Control-Allow-Origin': 'https://your-frontend-domain.pages.dev'
```

#### C. Missing Database Credentials
**Check Workers Environment Variables:**
1. Go to Cloudflare Workers dashboard
2. Your Worker → Settings → Environment Variables
3. Verify `SUPABASE_URL` is set
4. Add `SUPABASE_ANON_KEY` if missing

---

### **Issue 2: Build & Asset Serving Problems**

**Symptoms:**
- White screen or 404 errors
- Assets not loading (CSS, JS, images)
- Routing issues on page refresh

**Root Causes & Solutions:**

#### A. Vite Build Configuration
**Check `frontend/vite.config.js`:**
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable for production
    minify: 'terser', // Ensure minification
    target: 'esnext', // Modern browsers
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['axios', 'date-fns']
        }
      }
    }
  },
  // Remove server config for production builds
});
```

#### B. Static File Hosting
**Problem**: Cloudflare Pages not serving static files correctly

**Fix - Add `_redirects` file:**
```bash
# Create frontend/public/_redirects
/*    /index.html   200
```

#### C. Asset Path Issues
**Problem**: Built assets looking for wrong paths

**Fix - Update `frontend/vite.config.js`:**
```javascript
export default defineConfig({
  // ... other config
  base: './', // For relative asset paths
  build: {
    assetsDir: 'assets',
    // ... other build config
  }
});
```

---

### **Issue 3: Database Connection Problems**

**Symptoms:**
- API returns 500 errors
- Data operations fail
- Timeout errors

**Root Causes & Solutions:**

#### A. Supabase Connection Issues
**Check Workers environment:**
```bash
# List Worker environment variables
wrangler secret list

# Should show:
# SUPABASE_URL
# SUPABASE_ANON_KEY (optional but recommended)
```

**Fix - Add missing secrets:**
```bash
# Set Supabase URL
wrangler secret put SUPABASE_URL

# Set Supabase anonymous key (recommended)
wrangler secret put SUPABASE_ANON_KEY
```

#### B. Database Row Level Security (RLS)
**Problem**: RLS policies blocking API access

**Fix - Create API-specific RLS policies:**
```sql
-- Allow authenticated access for API operations
CREATE POLICY "Allow all API operations" ON riders
    FOR ALL USING (true);

CREATE POLICY "Allow all API operations" ON horses
    FOR ALL USING (true);

CREATE POLICY "Allow all API operations" ON rider_horse_associations
    FOR ALL USING (true);
```

---

### **Issue 4: Environment-Specific Configuration**

**Symptoms:**
- Different behavior between local and production
- Missing features in production
- Hardcoded localhost URLs

**Root Causes & Solutions:**

#### A. Hardcoded Localhost URLs
**Problem**: API still pointing to localhost

**Fix - Environment-specific configuration:**
```javascript
// In frontend/src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

// Add production check
const isProduction = import.meta.env.PROD;
console.log('Environment:', isProduction ? 'production' : 'development');
console.log('API Base URL:', API_BASE_URL);
```

#### B. Build Mode Detection
**Fix - Conditional configuration:**
```javascript
// In frontend/src/services/api.js
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: import.meta.env.PROD ? 15000 : 10000, // Longer timeout for production
});

// Remove debug logs in production
if (!import.meta.env.PROD) {
  api.interceptors.request.use((config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  });
}
```

---

## 🛠️ **Step-by-Step Debugging Process**

### **Step 1: Verify Frontend Build**
```bash
cd frontend
npm run build
npm run preview  # Test locally built version
```

### **Step 2: Test Backend Deployment**
```bash
cd backend
npx wrangler deploy
npx wrangler tail  # Monitor logs
```

### **Step 3: Check API Health**
```bash
# Test your production API
curl https://your-worker-name.workers.dev/api/health

# Should return:
# {"status":"ok","message":"API opérationnelle",...}
```

### **Step 4: Verify Database Connection**
```bash
# Test database connectivity
curl https://your-worker-name.workers.dev/api/riders
```

### **Step 5: Check Frontend-Backend Communication**
1. Open browser DevTools
2. Go to Network tab
3. Look for failed API calls
4. Check CORS headers in response

---

## 📋 **Production Configuration Template**

### **Frontend `.env.production`:**
```env
# Production Environment Variables
VITE_API_URL=https://your-worker-name.your-subdomain.workers.dev/api
```

### **Backend `wrangler.toml` (Production):**
```toml
name = "equestrian-api"
main = "src/index.js"
compatibility_date = "2024-01-01"

# Production settings
[env.production]
name = "equestrian-api-prod"
vars = { SUPABASE_URL = "https://your-project.supabase.co" }

# Secrets (set via wrangler secret put)
# SUPABASE_ANON_KEY
```

### **Updated Vite Config for Production:**
```javascript
// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Relative paths for deployment
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production
    minify: 'terser',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['axios', 'date-fns']
        }
      }
    }
  },
  preview: {
    port: 4173,
    host: true
  }
});
```

---

## 🚀 **Pre-Deployment Checklist**

### **Frontend:**
- [ ] `npm run build` completes successfully
- [ ] `npm run preview` works locally
- [ ] Environment variables set correctly
- [ ] Asset paths are relative
- [ ] No console errors in preview

### **Backend:**
- [ ] `wrangler deploy` succeeds
- [ ] All environment secrets set
- [ ] Database connectivity verified
- [ ] CORS configured for production domain
- [ ] API endpoints respond correctly

### **Database:**
- [ ] Connection strings correct
- [ ] RLS policies allow API access
- [ ] Required tables and indexes exist
- [ ] Backup created (if schema changes)

---

## 🆘 **Emergency Quick Fixes**

### **If Nothing Works:**
1. **Temporarily disable CORS restrictions:**
```javascript
// In backend/src/index.js
'Access-Control-Allow-Origin': '*'
```

2. **Enable verbose logging:**
```javascript
// Add to backend handlers
console.log('Request details:', {
  method: request.method,
  url: request.url,
  headers: Object.fromEntries(request.headers)
});
```

3. **Use Workers tail for debugging:**
```bash
wrangler tail
```

4. **Check Cloudflare Workers status:** https://www.cloudflarestatus.com/

---

## 📞 **Getting Help**

### **Useful Resources:**
- **Cloudflare Workers docs**: https://developers.cloudflare.com/workers/
- **Supabase dashboard**: https://app.supabase.com/
- **Vite deployment guide**: https://vitejs.dev/guide/build.html

### **Debug Commands to Remember:**
```bash
# Frontend
npm run build
npm run preview

# Backend
wrangler deploy
wrangler tail
wrangler secret list

# Testing
curl -X GET https://your-worker.workers.dev/api/health
curl -X GET https://your-worker.workers.dev/api/riders
```

---

## ✅ **Success Verification**

Once deployed, verify everything works:

1. **Frontend loads at your domain**
2. **API calls succeed (check Network tab)**
3. **Data operations work (CRUD)**
4. **No console errors**
5. **Mobile responsive**

If all these pass, your production deployment is successful! 🎉