# 🚀 Deployment Guide - Equestrian Management System

This guide will walk you through deploying the complete equestrian management system to production using 100% free hosting platforms.

## 📋 Prerequisites

Before you begin, you'll need:

- **Node.js 18+** installed on your local machine
- **Git** for version control
- **Cloudflare account** (free signup)
- **Supabase account** (free signup)
- **GitHub account** (recommended for automatic deployments)

## 🗂️ Step-by-Step Deployment

### Step 1: Database Setup (Supabase)

1. **Create Supabase Account**

   - Go to [supabase.com](https://supabase.com)
   - Click "Sign up with GitHub" (free, no credit card required)
   - Verify your email if prompted

2. **Create New Project**

   - From dashboard, click "New Project"
   - **Organization**: Create new or use existing
   - **Name**: `equestrian-db`
   - **Database Password**: Generate a strong password (save it securely)
   - **Region**: Choose closest to your users
   - Click "Create new project" (takes 2-3 minutes)

3. **Run Database Schema**

   - In Supabase dashboard, go to "SQL Editor" in the sidebar
   - Click "New query"
   - Copy the entire contents of `database/schema.sql`
   - Click "Run" to execute the schema
   - Verify success by checking that tables were created

4. **Get Database Credentials**
   - Go to "Settings" → "API" in the sidebar
   - Copy the **Project URL** (starts with `https://xxx.supabase.co`)
   - Copy the **anon public key** (long string starting with `eyJ...`)
   - Save both values for the next steps

### Step 2: Backend Deployment (Cloudflare Workers)

1. **Install Wrangler CLI**

```bash
npm install -g wrangler
```

2. **Login to Cloudflare**

```bash
wrangler login
```

- This opens your browser for authentication
- If you don't have an account, create one at [dash.cloudflare.com](https://dash.cloudflare.com/sign-up)

3. **Configure Backend**

```bash
cd backend
npm install
```

4. **Update Configuration**

   - Open `wrangler.toml`
   - Replace `YOUR_SUPABASE_URL` with your Supabase Project URL

5. **Set Database Secret**

```bash
x
```

- When prompted, paste your Supabase anon/public key
- Press Enter to save

6. **Test Locally (Optional)**

```bash
npm run dev
```

- Opens local development server on http://localhost:8787
- Test with: `curl http://localhost:8787/api/health`

7. **Deploy to Production**

```bash
npm run deploy
```

- First deployment takes ~30 seconds
- You'll receive a URL like: `https://equestrian-api.your-subdomain.workers.dev`
- **Save this URL** - you'll need it for the frontend

8. **Verify Deployment**

```bash
curl https://equestrian-api.your-subdomain.workers.dev/api/health
```

- Should return: `{"status":"ok","message":"API opérationnelle"}`

### Step 3: Frontend Deployment (Cloudflare Pages)

1. **Configure Frontend**

```bash
cd ../frontend
npm install
```

2. **Set Environment Variables**

```bash
cp .env.example .env
```

- Edit `.env` and replace with your Workers URL:

```env
VITE_API_URL=https://equestrian-api.your-subdomain.workers.dev/api
```

3. **Test Locally**

```bash
npm run dev
```

- Opens http://localhost:3000
- Test creating riders, horses, and associations
- Verify everything works before deploying

4. **Build for Production**

```bash
npm run build
```

- Creates optimized `dist/` folder
- Verify no errors in the build process

5. **Deploy to Cloudflare Pages**

**Option A: Using Wrangler CLI (Recommended)**

```bash
npx wrangler pages deploy dist --project-name=equestrian-frontend
```

- First deployment creates the project
- Subsequent deployments update the existing project
- Takes ~20 seconds
- You'll get URL: `https://equestrian-frontend.pages.dev`

**Option B: Using Cloudflare Dashboard**

- Go to [dash.cloudflare.com](https://dash.cloudflare.com)
- Click "Pages" in the sidebar
- Click "Create a project"
- Choose "Direct Upload"
- Drag and drop the entire `dist` folder
- Click "Deploy site"

6. **Configure Environment Variables in Cloudflare**
   - In Cloudflare dashboard → Pages → Your project
   - Go to "Settings" → "Environment variables"
   - Add `VITE_API_URL` with your Workers URL
   - Redeploy if you make changes

### Step 4: Final Verification

1. **Test Your Live Application**

   - Visit your Cloudflare Pages URL
   - Test all functionality:
     - ✅ Create a rider
     - ✅ Create a horse
     - ✅ Create an association
     - ✅ Edit existing records
     - ✅ Delete records
     - ✅ View lists and filters

2. **Test API Endpoints**

```bash
# Health check
curl https://your-workers-url.workers.dev/api/health

# Get API documentation
curl https://your-workers-url.workers.dev/api/docs

# Test riders endpoint
curl https://your-workers-url.workers.dev/api/riders
```

## 🔧 Configuration Summary

### Environment Variables

**Backend (Cloudflare Workers Secrets):**

```bash
# Set via: wrangler secret put SUPABASE_KEY
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Backend (wrangler.toml):**

```toml
[vars]
SUPABASE_URL = "https://xxx.supabase.co"
```

**Frontend (.env):**

```env
VITE_API_URL=https://your-workers-url.workers.dev/api
```

## 🔄 Updating Your Application

### Update Backend

```bash
cd backend
# Make your changes
npm run deploy  # Automatic redeployment
```

### Update Frontend

```bash
cd frontend
# Make your changes
npm run build
npx wrangler pages deploy dist --project-name=equestrian-frontend
```

### Update Database Schema

- Go to Supabase dashboard → SQL Editor
- Run your ALTER TABLE or migration scripts
- Be careful with production data!

## 🔍 Troubleshooting

### Common Issues & Solutions

#### Issue: "Failed to fetch" in frontend

**Solutions:**

1. Check `VITE_API_URL` in `.env` is correct
2. Verify backend is deployed: `curl YOUR_WORKERS_URL/api/health`
3. Check browser console for CORS errors
4. Ensure backend Workers URL is accessible

#### Issue: Database connection errors

**Solutions:**

1. Verify `SUPABASE_URL` in `wrangler.toml`
2. Check `SUPABASE_KEY` secret: `wrangler secret list`
3. Ensure Supabase database status is "Active"
4. Test connection in Supabase dashboard

#### Issue: Build failures

**Solutions:**

1. Clear dependencies: `rm -rf node_modules && npm install`
2. Check Node.js version: `node -v` (should be 18+)
3. Check for syntax errors in your code
4. Review build logs for specific error messages

#### Issue: Supabase database paused

**Solutions:**

1. Free tier databases pause after 7 days of inactivity
2. Simply access your app - it auto-resumes
3. Or go to Supabase dashboard → "Resume database"

#### Issue: CORS errors

**Solutions:**

1. Backend already includes CORS headers
2. Check if custom domains are causing issues
3. Verify API URL matches exactly

### Debugging Tools

**View Backend Logs:**

```bash
cd backend
wrangler tail
```

Shows real-time logs from your Workers.

**Test API Directly:**

```bash
# Test health endpoint
curl -v https://your-workers-url.workers.dev/api/health

# Test with POST data
curl -X POST https://your-workers-url.workers.dev/api/riders \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Rider"}'
```

**Check Network Requests:**

- Open browser DevTools (F12)
- Go to Network tab
- Reload page and check for failed requests

## 📊 Monitoring and Maintenance

### Monitor Usage

- **Cloudflare Dashboard**: View request metrics and logs
- **Supabase Dashboard**: Monitor database usage and storage
- Both platforms provide free analytics

### Backup Strategy

- **Supabase**: Automatic daily backups on paid tiers
- **Free tier**: Export data regularly via SQL Editor
- Consider weekly manual exports for important data

### Performance Optimization

- Images and assets are optimized by Vite
- Cloudflare CDN provides global caching
- Database is optimized with proper indexes

## 🔒 Security Considerations

### Current Security Features

- ✅ CORS properly configured
- ✅ Input validation on both frontend and backend
- ✅ SQL injection protection via parameterized queries
- ✅ Rate limiting to prevent abuse
- ✅ Security headers included
- ✅ Environment variables for sensitive data

### Recommended Additional Security

1. **Add Authentication**: Use Supabase Auth for user login
2. **Row Level Security**: Enable RLS in Supabase for data access control
3. **Custom Domain**: Use your own domain for production
4. **Regular Updates**: Keep dependencies updated

## 💰 Cost Breakdown

This solution is **completely free**:

| Service            | Free Tier Limits                      | Cost         |
| ------------------ | ------------------------------------- | ------------ |
| Supabase Database  | 500MB storage, 2GB bandwidth/month    | $0           |
| Supabase Auth      | 50,000 monthly active users           | $0           |
| Cloudflare Workers | 100,000 requests/day                  | $0           |
| Cloudflare Pages   | Unlimited bandwidth, 500 builds/month | $0           |
| **Total**          | -                                     | **$0/month** |

### Scaling Limits

- Supports up to 50,000 users/month
- Handles millions of API requests
- Scales globally without configuration
- Perfect for small to medium equestrian centers

## 🆘 Getting Help

### Documentation

- **This README**: Complete setup and usage guide
- **API Documentation**: Visit `/api/docs` endpoint
- **Cloudflare Docs**: [developers.cloudflare.com](https://developers.cloudflare.com)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

### Community Support

- Cloudflare Discord community
- Supabase GitHub discussions
- Stack Overflow with tags: `cloudflare-workers`, `supabase`

### Emergency Steps

If your application goes down:

1. **Check Supabase status**: status.supabase.com
2. **Check Cloudflare status**: www.cloudflarestatus.com
3. **Review recent deployments** in both dashboards
4. **Test API endpoints** individually
5. **Check environment variables** are correct

---

## 🎉 Congratulations!

You now have a **production-ready equestrian management system** deployed globally with:

- ✅ **100% Free Hosting** ($0/month forever)
- ✅ **Global CDN** for instant load times
- ✅ **Auto-scaling** infrastructure
- ✅ **Modern Tech Stack** (React + Workers + PostgreSQL)
- ✅ **Security Best Practices**
- ✅ **Easy Maintenance** and updates

Your application is ready for real-world use by equestrian facilities!

**Built with ❤️ for the equestrian community**
