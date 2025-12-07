# 🐴 Equestrian Facility Management System

A modern, production-ready web application for managing horse riders and horses at equestrian facilities.

## 🌟 Features

- **Complete CRUD Operations** for riders, horses, and their associations
- **Historical Tracking** with date ranges for activities and associations
- **Modern UI** with responsive design and French language interface
- **Real-time Updates** with instant feedback and validation
- **Statistics Dashboard** with filtering and search capabilities
- **Mobile-Responsive** design that works on all devices

## 🏗️ Technology Stack

### Frontend
- **React 18** with modern hooks and components
- **Vite** for lightning-fast development and building
- **React Router** for client-side routing
- **Axios** for API communication
- **Date-fns** for date handling and formatting

### Backend
- **Cloudflare Workers** for serverless, global deployment
- **Supabase PostgreSQL** for reliable database hosting
- **Modern JavaScript (ES6+)** with async/await patterns

### Database
- **PostgreSQL** with proper indexing and constraints
- **Automatic timestamp tracking** with triggers
- **Foreign key relationships** for data integrity

## 📚 Documentation

Complete documentation is available in the `docs/` directory:

### Getting Started
- **[Prerequisites](docs/01-getting-started/prerequisites.md)** - System requirements and tools needed
- **[Installation Guide](docs/01-getting-started/installation.md)** - Step-by-step setup instructions
- **[Quick Start](docs/01-getting-started/quick-start.md)** - Get running in 5 minutes
- **[macOS Launch Guide](docs/01-getting-started/macos-launch.md)** - macOS-specific instructions

### Scripts & Tools
- **[Scripts Directory](scripts/README.md)** - Overview of all scripts and organization
- **[Scripts Catalog](scripts/SCRIPTS_CATALOG.md)** - Complete inventory of all scripts
- **[Scripts Documentation](docs/09-scripts/README.md)** - Comprehensive script guides
- **[Script Reference](docs/09-scripts/script-reference.md)** - Detailed script documentation
- **[Model Generator Guide](docs/09-scripts/add-model-bash.md)** - Complete model generation guide
- **[Quick Launch Reference](QUICK_LAUNCH.md)** - One-page quick reference

### Development
- **[Adding New Models](docs/02-development/adding-models.md)** - Guide for creating new data models
- **[Modifying Existing Models](docs/02-development/modifying-models.md)** - Guide for updating models
- **[Local Development](docs/02-development/README.md)** - Development workflow

### Deployment
- **[Deployment Guide](docs/03-deployment/deployment-guide.md)** - Complete deployment instructions
- **[Multi-Environment Setup](docs/03-deployment/multi-environment.md)** - Dev/Prod environments
- **[Troubleshooting](docs/03-deployment/troubleshooting.md)** - Common issues and solutions

### Features
- **[Rider-Horse Associations](docs/04-features/associations.md)** - Association management feature
- **[Environment Variables](docs/08-reference/environment-variables.md)** - Configuration reference

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git
- Cloudflare account (free)
- Supabase account (free)

### Easiest Way to Launch Locally

**Just run one command:**

```bash
# Linux/Mac
./start.sh

# Windows
start.bat
```

That's it! The script will automatically:
- ✅ Check prerequisites
- ✅ Install dependencies
- ✅ Launch frontend (port 5173)
- ✅ Launch backend (port 8787)
- ✅ Monitor services

**See [LAUNCH_README.md](LAUNCH_README.md) for detailed launch instructions.**

### First-Time Setup

1. **Clone the repository:**
```bash
git clone https://github.com/adeline-t/equestrian-project.git
cd equestrian-project
```

2. **Set up the database:**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL script from `database/schema.sql` in Supabase SQL Editor
   - Copy your Project URL and anon key

3. **Configure environment files:**

   Create `frontend/.env`:
   ```bash
   VITE_API_URL=http://localhost:8787/api
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

   Create `backend/.env`:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Launch the application:**
```bash
./start.sh
```

Visit `http://localhost:5173` to see the application.

### Manual Launch (Alternative)

If you prefer to launch services manually:

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

## 📁 Project Structure

```
equestrian-project/
├── backend/                     # Cloudflare Workers API
│   ├── src/
│   │   ├── handlers/           # Route handlers
│   │   │   ├── riders.js
│   │   │   ├── horses.js
│   │   │   └── associations.js
│   │   ├── db.js              # Database utilities
│   │   └── index.js           # Main router
│   ├── wrangler.toml.example  # Cloudflare config template
│   └── package.json
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── riders/
│   │   │   ├── horses/
│   │   │   └── associations/
│   │   ├── services/          # API services
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── .env.dev.example      # Dev environment template
│   ├── .env.prod.example     # Prod environment template
│   └── package.json
├── database/
│   └── schema.sql            # Database schema
├── docs/                      # Documentation
│   ├── 01-getting-started/   # Getting started guides
│   ├── 09-scripts/           # Scripts documentation
│   └── ...                   # Other documentation
├── scripts/                   # Automation scripts
│   ├── add-model.js          # Model generator
│   ├── modify-model.js       # Model modifier
│   ├── SCRIPTS_CATALOG.md    # Complete script inventory
│   └── .scripts-index.json   # Machine-readable metadata
├── start.sh                   # One-command launcher
├── launch-local.sh            # Full-featured launcher
├── deploy.sh                  # Deployment script
└── README.md                 # This file
```

## 🔧 Development

### Adding a New Model

Use the model generator script:
```bash
cd scripts
npm install
node add-model.js
```

Follow the interactive prompts to generate:
- Database migration
- Backend handler
- Frontend components
- API routes

See [Adding New Models Guide](docs/ADDING_NEW_OBJECT_MODEL_GUIDE.md) for details.

### Modifying an Existing Model

Use the model modifier script:
```bash
cd scripts
node modify-model.js
```

See [Modifying Models Guide](docs/MODIFYING_EXISTING_MODEL_GUIDE.md) for details.

## 🚢 Deployment

### Deploy to Production

1. **Set up production environment:**
   - Create production Supabase project
   - Configure `wrangler.toml` with `[env.prod]` section
   - Create `frontend/.env.prod` with production values

2. **Deploy using the deployment script:**
```bash
./deploy.sh prod
```

Or deploy manually:
```bash
# Deploy backend
cd backend
wrangler deploy --env prod

# Deploy frontend
cd ../frontend
npm run build
wrangler pages deploy dist --project-name equestrian-prod
```

See [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) for complete instructions.

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## 📊 API Documentation

The API provides RESTful endpoints for managing riders, horses, and associations.

### Base URL
- Development: `http://localhost:8787/api`
- Production: `https://your-worker.workers.dev/api`

### Endpoints

**Riders:**
- `GET /api/riders` - List all riders
- `GET /api/riders/:id` - Get single rider
- `POST /api/riders` - Create rider
- `PUT /api/riders/:id` - Update rider
- `DELETE /api/riders/:id` - Delete rider
- `GET /api/riders/:id/horses` - Get horses for rider

**Horses:**
- `GET /api/horses` - List all horses
- `GET /api/horses/:id` - Get single horse
- `POST /api/horses` - Create horse
- `PUT /api/horses/:id` - Update horse
- `DELETE /api/horses/:id` - Delete horse
- `GET /api/horses/:id/riders` - Get riders for horse

**Associations:**
- `GET /api/associations` - List all associations
- `GET /api/associations/:id` - Get single association
- `POST /api/associations` - Create association
- `PUT /api/associations/:id` - Update association
- `DELETE /api/associations/:id` - Delete association

**Utility:**
- `GET /api/health` - Health check
- `GET /api/docs` - API documentation

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation:** Check the [docs/](docs/) directory
- **Issues:** Open an issue on GitHub
- **Troubleshooting:** See [Troubleshooting Guide](docs/PRODUCTION_DEPLOYMENT_TROUBLESHOOTING.md)

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Cloudflare Workers](https://workers.cloudflare.com/)
- Database by [Supabase](https://supabase.com/)
- Bundled with [Vite](https://vitejs.dev/)

---

**Made with ❤️ for equestrian facilities**