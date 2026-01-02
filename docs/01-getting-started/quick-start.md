# Quick Start Guide

This guide provides the fastest way to get your equestrian application running locally.

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites

Ensure you have the following installed:

```bash
# Check Node.js version (v18+)
node --version

# Check npm version
npm --version

# Check Git
git --version
```

If you need to install these tools, see the [Prerequisites Guide](./prerequisites.md).

### 2. Clone the Repository

```bash
git clone https://github.com/adeline-t/equestrian-project.git
cd equestrian-project
```

### 3. Set Up Supabase Database

1. **Create a Supabase project:**
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Fill in project details and create

2. **Run the database schema:**
   - In Supabase dashboard, go to "SQL Editor"
   - Copy contents of `database/schema.sql`
   - Paste and run in SQL Editor

3. **Run migrations:**
   - Run each migration file from `database/migrations/` in order
   - Start with the oldest date first

4. **Get your credentials:**
   - Go to Settings → API
   - Copy your Project URL and anon key

### 4. Configure Environment Files

**Frontend configuration:**

Create `frontend/.env`:

```bash
VITE_API_URL=http://localhost:8787/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ENVIRONMENT=development
VITE_LOG_LEVEL=debug
```

**Backend configuration:**

Create `backend/.dev.vars`:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Launch the Application

**Option 1: Using the launch script (Recommended)**

```bash
./launch-local.sh
```

The script will:
- ✅ Check prerequisites
- ✅ Install dependencies
- ✅ Launch backend on port 8787
- ✅ Launch frontend on port 5173
- ✅ Monitor both services

**Option 2: Manual launch**

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### 6. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8787/api

## 🔧 Common Commands

### Development

```bash
# Start development servers
./launch-local.sh

# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev
```

### Building

```bash
# Build frontend
cd frontend
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## 🌐 URLs After Setup

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | `http://localhost:5173` | React application |
| Backend API | `http://localhost:8787/api` | API endpoints |
| API Health | `http://localhost:8787/api/health` | Health check |

## 🔍 Testing Your Setup

### 1. Backend Health Check

```bash
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

### 2. Frontend Access

Open http://localhost:5173 in your browser. You should see the application interface.

### 3. Create Test Data

- Click "Nouveau Cavalier" to create a rider
- Click "Nouveau Cheval" to create a horse
- Create a pairing between them
- Verify data persists in the database

## ✅ Verification Checklist

- [ ] Node.js 18+ installed
- [ ] Supabase project created
- [ ] Database schema applied
- [ ] Migrations run successfully
- [ ] Environment files configured
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access frontend at localhost:5173
- [ ] Can access backend at localhost:8787
- [ ] Health check returns OK
- [ ] Can create and view data

## 🚨 Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Check what's using the port
lsof -i :5173  # Frontend
lsof -i :8787  # Backend

# Kill the process
lsof -ti:5173 | xargs kill -9
lsof -ti:8787 | xargs kill -9
```

### Backend Connection Errors

**Error:** "Supabase connection failed"

- Verify `SUPABASE_URL` in `.dev.vars`
- Verify `SUPABASE_ANON_KEY` is correct
- Check Supabase project is active
- Ensure database schema was applied

### Frontend Build Errors

**Error:** "VITE_API_URL is not defined"

- Ensure `.env` file exists in `frontend/`
- Verify all required variables are set
- Restart dev server after changing `.env`

**Error:** "Module not found"

```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Database Errors

**Error:** "relation does not exist"

- Verify `schema.sql` was executed successfully
- Check table names in Supabase Table Editor
- Run migrations in correct order
- Re-run schema if needed

## 🎯 Next Steps

After completing the quick start:

1. **Explore Features** - See [Features Documentation](../04-features/README.md)
2. **Learn Development** - Check [Development Guide](../02-development/README.md)
3. **Deploy Your App** - Read [Deployment Guide](../03-deployment/README.md)
4. **API Reference** - Review [API Documentation](../05-api/README.md)

## 📚 Additional Resources

- [Full Installation Guide](./installation.md) - Detailed setup instructions
- [Prerequisites Guide](./prerequisites.md) - System requirements
- [Troubleshooting Guide](../03-deployment/troubleshooting.md) - Common issues
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---

**Ready to develop?** Continue to the [Development Guide](../02-development/README.md)