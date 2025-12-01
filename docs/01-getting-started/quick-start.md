# Quick Start Guide

This guide provides the fastest way to get your equestrian application running in both development and production environments.

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites
```bash
# Install Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Wrangler CLI
npm install -g wrangler

# Authenticate with Cloudflare
wrangler auth login
```

### 2. Setup Supabase (2 minutes)
```bash
# Run the Supabase setup script
./scripts/setup-supabase.sh

# Or manually:
# 1. Create dev project at https://supabase.com/dashboard
# 2. Create prod project at https://supabase.com/dashboard
# 3. Update .env files with your credentials
```

### 3. Setup Cloudflare (2 minutes)
```bash
# Run the Cloudflare setup script
./scripts/setup-cloudflare.sh

# Or manually:
# 1. Add your domain to Cloudflare
# 2. Configure DNS records
# 3. Deploy workers and bind custom domains
```

### 4. Deploy Application (1 minute)

#### Development Environment
```bash
# Deploy to development
./deploy.sh dev

# Access: https://dev.yourdomain.com
```

#### Production Environment
```bash
# Deploy to production
./deploy.sh prod

# Access: https://yourdomain.com
```

## 📋 Environment Files Quick Reference

### Frontend Environment Variables
| Variable | Development | Production |
|----------|-------------|------------|
| `VITE_API_URL` | `https://dev-api.yourdomain.com/api` | `https://api.yourdomain.com/api` |
| `VITE_SUPABASE_URL` | Dev Supabase URL | Prod Supabase URL |
| `VITE_ENVIRONMENT` | `development` | `production` |
| `VITE_LOG_LEVEL` | `debug` | `error` |

### Backend Environment Variables
| Variable | Development | Production |
|----------|-------------|------------|
| `SUPABASE_URL` | Dev Supabase URL | Prod Supabase URL |
| `ENVIRONMENT` | `development` | `production` |
| `LOG_LEVEL` | `debug` | `error` |
| `CORS_ORIGIN` | `*` | `https://yourdomain.com` |

## 🛠️ Development Workflow

### Local Development
```bash
# Start development servers
cd backend && npm run dev &
cd frontend && npm run dev

# Access:
# Frontend: http://localhost:5173
# Backend: http://localhost:8787
```

### Environment Switching
```bash
# Switch to development
cp frontend/.env.dev frontend/.env
cp backend/.env.dev backend/.env

# Switch to production
cp frontend/.env.prod frontend/.env
cp backend/.env.prod backend/.env
```

## 🔧 Common Commands

### Backend Commands
```bash
cd backend

# Development server
npm run dev

# Deploy to development
npx wrangler deploy --env dev

# Deploy to production
npx wrangler deploy --env prod

# View logs (development)
npx wrangler tail --env dev

# View logs (production)
npx wrangler tail --env prod
```

### Frontend Commands
```bash
cd frontend

# Development server
npm run dev

# Build for development
npm run build -- --config vite.config.dev.js

# Build for production
npm run build -- --config vite.config.prod.js

# Preview build
npm run preview
```

## 🌍 URLs After Setup

| Environment | Frontend | Backend API |
|-------------|----------|-------------|
| Development | `https://dev.yourdomain.com` | `https://dev-api.yourdomain.com/api` |
| Production | `https://yourdomain.com` | `https://api.yourdomain.com/api` |
| Local | `http://localhost:5173` | `http://localhost:8787/api` |

## 🚨 Important Security Notes

### Never Commit These Files
- `.env` files
- `.env.local` files
- Any files containing secrets or API keys

### Always Use Secrets in Production
```bash
# Set secrets for production
npx wrangler secret put SUPABASE_URL --env prod
npx wrangler secret put SUPABASE_ANON_KEY --env prod
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env prod
```

### Enable RLS in Production
Make sure Row Level Security is enabled on all Supabase tables in production.

## 🔍 Testing Checklist

### Development Tests
- [ ] Frontend loads at `http://localhost:5173`
- [ ] Backend API responds at `http://localhost:8787/api`
- [ ] Database operations work correctly
- [ ] Authentication flows work

### Production Tests
- [ ] HTTPS redirects work properly
- [ ] Custom domains resolve correctly
- [ ] API endpoints are accessible
- [ ] Database operations work correctly
- [ ] No console errors in production

### Security Tests
- [ ] RLS policies are enforced
- [ ] CORS headers are correct
- [ ] No sensitive data in frontend bundle
- [ ] All secrets are properly configured

## 📞 Troubleshooting

### Common Issues
1. **Build fails**: Check environment variables are correctly set
2. **API not responding**: Check Wrangler deployment logs
3. **Database errors**: Verify Supabase connection and RLS policies
4. **Domain not working**: Check DNS propagation (24-48 hours)

### Get Help
- Check the main guide: `MULTI_ENVIRONMENT_DEPLOYMENT_GUIDE.md`
- View Wrangler logs: `npx wrangler tail --env [dev|prod]`
- Check Cloudflare dashboard for errors
- Review Supabase logs and settings

## 🎯 Next Steps

After completing the quick start:
1. **Customize domains** to your actual domain name
2. **Set up analytics** and monitoring
3. **Configure backup** strategies
4. **Set up CI/CD** pipelines
5. **Add team members** to Cloudflare and Supabase

---

For detailed configuration and advanced setup, see the full `MULTI_ENVIRONMENT_DEPLOYMENT_GUIDE.md`.