# Deployment Guide

This section contains comprehensive guides for deploying the Equestrian Management System to production.

## 📚 Documentation in This Section

- **[Deployment Guide](./deployment-guide.md)** - Complete deployment instructions
- **[Multi-Environment Setup](./multi-environment.md)** - Managing dev/staging/prod environments
- **[Troubleshooting](./troubleshooting.md)** - Common deployment issues and solutions
- **[Rollback Procedures](./rollback.md)** - How to rollback failed deployments
- **[Custom Domains](./custom-domains.md)** - Setting up custom domains

## 🎯 Quick Deployment

### Prerequisites
- Cloudflare account
- Supabase account (production project)
- Wrangler CLI installed
- Environment files configured

### Deploy to Production
```bash
./deploy.sh prod
```

That's it! The script handles:
- ✅ Environment validation
- ✅ Dependency installation
- ✅ Frontend build
- ✅ Backend deployment
- ✅ Frontend deployment
- ✅ Post-deployment checks

## 🏗️ Deployment Architecture

### Infrastructure
```
┌─────────────────────────────────────────┐
│         Cloudflare Network              │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │   Frontend   │  │   Backend    │   │
│  │  (Pages)     │  │  (Workers)   │   │
│  └──────────────┘  └──────────────┘   │
│         │                  │            │
└─────────┼──────────────────┼────────────┘
          │                  │
          └──────────┬───────┘
                     │
              ┌──────▼──────┐
              │  Supabase   │
              │ PostgreSQL  │
              └─────────────┘
```

### Components
- **Frontend:** Cloudflare Pages (static hosting)
- **Backend:** Cloudflare Workers (serverless API)
- **Database:** Supabase PostgreSQL (managed database)
- **CDN:** Cloudflare global network

## 🚀 Deployment Options

### Option 1: Automated Script (Recommended)
```bash
# Deploy to development
./deploy.sh dev

# Deploy to production
./deploy.sh prod
```

**Pros:**
- ✅ Automated process
- ✅ Error handling
- ✅ Validation checks
- ✅ Consistent deployments

### Option 2: Manual Deployment
```bash
# Backend
cd backend
wrangler deploy --env prod

# Frontend
cd ../frontend
npm run build
wrangler pages deploy dist --project-name equestrian-prod
```

**Pros:**
- ✅ More control
- ✅ Step-by-step process
- ✅ Good for debugging

### Option 3: CI/CD Pipeline
Set up GitHub Actions for automatic deployments on push.

**Pros:**
- ✅ Fully automated
- ✅ Triggered by git push
- ✅ Includes testing
- ✅ Production-ready

## 🌍 Environment Management

### Development Environment
- **Purpose:** Testing and development
- **URL:** `https://dev.yourdomain.com`
- **Database:** Separate Supabase project
- **Updates:** Frequent, less stable

### Staging Environment (Optional)
- **Purpose:** Pre-production testing
- **URL:** `https://staging.yourdomain.com`
- **Database:** Separate Supabase project
- **Updates:** Before production releases

### Production Environment
- **Purpose:** Live application
- **URL:** `https://yourdomain.com`
- **Database:** Production Supabase project
- **Updates:** Stable releases only

## ✅ Pre-Deployment Checklist

Before deploying to production:

### Code Quality
- [ ] All tests passing
- [ ] Code reviewed
- [ ] No console.log statements
- [ ] Error handling in place
- [ ] Security checks passed

### Configuration
- [ ] Environment variables set
- [ ] Secrets configured
- [ ] Database migrations ready
- [ ] API endpoints correct
- [ ] CORS configured

### Testing
- [ ] Tested in development
- [ ] Tested in staging (if applicable)
- [ ] Manual testing completed
- [ ] Performance tested
- [ ] Security tested

### Documentation
- [ ] CHANGELOG updated
- [ ] API docs updated
- [ ] README updated
- [ ] Deployment notes written

### Backup
- [ ] Database backed up
- [ ] Previous version tagged
- [ ] Rollback plan ready

## 🔄 Deployment Process

### 1. Prepare Release
```bash
# Create release branch
git checkout -b release/v1.0.0

# Update version
npm version patch

# Commit changes
git commit -am "chore: bump version to 1.0.0"
```

### 2. Deploy Backend
```bash
cd backend
wrangler deploy --env prod
```

### 3. Deploy Frontend
```bash
cd frontend
npm run build
wrangler pages deploy dist --project-name equestrian-prod
```

### 4. Verify Deployment
```bash
# Check health endpoint
curl https://api.yourdomain.com/api/health

# Test frontend
open https://yourdomain.com
```

### 5. Monitor
- Check logs for errors
- Monitor performance
- Watch for user reports

## 🐛 Troubleshooting

### Common Issues

**Deployment fails:**
- Check environment variables
- Verify Wrangler authentication
- Review error messages

**Frontend not loading:**
- Check build output
- Verify API URL
- Check browser console

**API errors:**
- Check database connection
- Verify secrets are set
- Review backend logs

**See [Troubleshooting Guide](./troubleshooting.md) for detailed solutions.**

## 🔙 Rollback

If deployment fails:

```bash
# Rollback backend
wrangler rollback --env prod

# Rollback frontend
wrangler pages deployment list
wrangler pages deployment rollback <deployment-id>
```

See [Rollback Procedures](./rollback.md) for details.

## 📊 Post-Deployment

### Verification Steps
1. ✅ Health check passes
2. ✅ Frontend loads
3. ✅ API responds
4. ✅ Database accessible
5. ✅ No errors in logs

### Monitoring
- Set up uptime monitoring
- Configure error alerts
- Monitor performance metrics
- Track user analytics

### Communication
- Notify team of deployment
- Update status page
- Announce new features
- Document known issues

## 🆘 Getting Help

- **Deployment Issues:** See [Troubleshooting](./troubleshooting.md)
- **Environment Setup:** See [Multi-Environment](./multi-environment.md)
- **Rollback Help:** See [Rollback Procedures](./rollback.md)
- **Custom Domains:** See [Custom Domains](./custom-domains.md)

## 📖 Next Steps

- **[Deployment Guide](./deployment-guide.md)** - Detailed instructions
- **[Multi-Environment](./multi-environment.md)** - Environment management
- **[Troubleshooting](./troubleshooting.md)** - Problem solving
- **[Operations Guide](../07-operations/README.md)** - Production operations

---

**Ready to deploy?** Start with [Deployment Guide](./deployment-guide.md)