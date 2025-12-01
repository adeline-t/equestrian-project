# Installation Guide

This guide will walk you through the complete installation process for the Equestrian Management System.

## 📋 Before You Begin

Ensure you have completed the [Prerequisites](./prerequisites.md) guide.

## 🚀 Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/adeline-t/equestrian-project.git

# Navigate to the project directory
cd equestrian-project
```

### Step 2: Set Up the Database (Supabase)

#### 2.1 Create Supabase Project

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in the details:
   - **Organization:** Select or create one
   - **Name:** `equestrian-db-dev` (for development)
   - **Database Password:** Generate a strong password (save it!)
   - **Region:** Choose closest to your users
4. Click **"Create new project"** (takes 2-3 minutes)

#### 2.2 Run Database Schema

1. In Supabase dashboard, go to **"SQL Editor"**
2. Click **"New query"**
3. Copy the contents of `database/schema.sql` from your project
4. Paste into the SQL editor
5. Click **"Run"** to execute
6. Verify tables were created in the **"Table Editor"**

#### 2.3 Get Database Credentials

1. Go to **"Settings"** → **"API"** in Supabase dashboard
2. Copy and save these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)
   - **service_role key** (for admin operations, optional)

### Step 3: Configure Backend

#### 3.1 Install Backend Dependencies

```bash
cd backend
npm install
```

#### 3.2 Create Wrangler Configuration

```bash
# Copy the example file
cp wrangler.toml.example wrangler.toml

# Edit wrangler.toml with your values
nano wrangler.toml  # or use your preferred editor
```

Update the following in `wrangler.toml`:
```toml
[env.dev]
name = "equestrian-api-dev"
vars = { 
  ENVIRONMENT = "development",
  SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL"  # Update this
}
```

#### 3.3 Set Supabase Secret

```bash
# Set the Supabase anon key as a secret
wrangler secret put SUPABASE_ANON_KEY --env dev

# When prompted, paste your Supabase anon key
# Press Enter to save
```

#### 3.4 Test Backend Locally (Optional)

```bash
# Start local development server
npm run dev

# In another terminal, test the API
curl http://localhost:8787/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "API opérationnelle",
  "timestamp": "2024-12-01T...",
  "version": "1.0.0"
}
```

### Step 4: Configure Frontend

#### 4.1 Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

#### 4.2 Create Environment File

```bash
# Copy the development example
cp .env.dev.example .env.dev

# Edit with your values
nano .env.dev
```

Update `.env.dev`:
```env
# Use localhost for local backend testing
VITE_API_URL=http://localhost:8787/api

# Or use deployed backend URL
# VITE_API_URL=https://equestrian-api-dev.your-subdomain.workers.dev/api

VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_ENVIRONMENT=development
VITE_LOG_LEVEL=debug
```

#### 4.3 Copy to Active Environment

```bash
cp .env.dev .env
```

#### 4.4 Test Frontend Locally

```bash
# Start development server
npm run dev
```

The application should open at `http://localhost:5173`

### Step 5: Deploy to Production (Optional)

#### 5.1 Authenticate with Cloudflare

```bash
wrangler login
```

This will open your browser for authentication.

#### 5.2 Deploy Backend

```bash
cd backend
wrangler deploy --env dev
```

Note the deployed URL (e.g., `https://equestrian-api-dev.your-subdomain.workers.dev`)

#### 5.3 Update Frontend Configuration

Update `frontend/.env.dev` with the deployed backend URL:
```env
VITE_API_URL=https://equestrian-api-dev.your-subdomain.workers.dev/api
```

#### 5.4 Deploy Frontend

```bash
cd ../frontend
npm run build
wrangler pages deploy dist --project-name equestrian-dev
```

Note the deployed URL for your frontend.

## ✅ Verification

### Test the Installation

1. **Backend Health Check:**
```bash
curl https://your-backend-url.workers.dev/api/health
```

2. **Frontend Access:**
Open your browser to the frontend URL

3. **Create Test Data:**
- Click "Nouveau Cavalier" to create a rider
- Click "Nouveau Cheval" to create a horse
- Create an association between them

### Expected Results

- ✅ Backend responds with health check
- ✅ Frontend loads without errors
- ✅ Can create riders and horses
- ✅ Can create associations
- ✅ Data persists in database

## 🔧 Post-Installation Configuration

### Set Up Production Environment

For production deployment, repeat the process with production credentials:

1. Create a separate Supabase project for production
2. Create `wrangler.toml` with `[env.prod]` section
3. Create `frontend/.env.prod` with production values
4. Deploy using `--env prod` flag

See [Deployment Guide](../03-deployment/deployment-guide.md) for details.

### Configure Custom Domain (Optional)

See [Custom Domain Setup](../03-deployment/custom-domains.md) for instructions.

## 🆘 Troubleshooting

### Backend Won't Deploy

**Error:** "Authentication required"
```bash
# Re-authenticate
wrangler logout
wrangler login
```

**Error:** "Supabase connection failed"
- Verify SUPABASE_URL in wrangler.toml
- Verify SUPABASE_ANON_KEY secret is set
- Check Supabase project is active

### Frontend Build Fails

**Error:** "VITE_API_URL is not defined"
- Ensure .env file exists
- Verify VITE_API_URL is set
- Restart dev server after changing .env

**Error:** "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Issues

**Error:** "relation does not exist"
- Verify schema.sql was executed successfully
- Check table names in Supabase Table Editor
- Re-run schema.sql if needed

### CORS Errors

**Error:** "CORS policy blocked"
- Verify backend is deployed and accessible
- Check VITE_API_URL points to correct backend
- Ensure backend CORS headers are configured

## 📚 Next Steps

After successful installation:

1. **[Quick Start Guide](./quick-start.md)** - Learn basic usage
2. **[Development Guide](../02-development/README.md)** - Start developing
3. **[Features Documentation](../04-features/README.md)** - Explore features
4. **[API Reference](../05-api/README.md)** - Learn the API

## 🎓 Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---

**Installation complete?** Continue to [Quick Start](./quick-start.md) to learn how to use the system.