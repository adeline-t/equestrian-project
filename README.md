# 🐴 Equestrian Facility Management System

A modern, production-ready web application for managing horse riders, horses, and lesson scheduling at equestrian facilities.

## 🌟 Features

### Core Management
- **Complete CRUD Operations** for riders, horses, and their pairings
- **Package Management** for lesson subscriptions and pricing
- **Historical Tracking** with date ranges for activities and pairings
- **Modern UI** with responsive design and French language interface
- **Real-time Updates** with instant feedback and validation
- **Mobile-Responsive** design that works on all devices

### 📅 Calendar System
- **Recurring Lessons** with flexible scheduling rules (daily, weekly, monthly)
- **Blocked Periods** for rest days and maintenance (prevents all bookings)
- **Automatic Generation** via daily cron job (4-week rolling window)
- **Participant Management** with automatic horse assignment via half-board pairings
- **Lesson Tracking** with indicator for lessons not given by instructor
- **Weekly Calendar View** with visual indicators and filters
- **5 Lesson Types**: Private, Group, Training, Competition, Event
- **Conflict Detection** with blocked periods and availability checking

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
- **[Quick Start](docs/01-getting-started/quick-start.md)** - Get running quickly

### Calendar System
- **[Calendar System Overview](docs/10-calendar-system/README.md)** - Complete guide to the calendar system
- **[Cron Configuration](docs/10-calendar-system/cron-configuration.md)** - Setup and usage of automatic generation
- **[API Reference](docs/10-calendar-system/api-reference.md)** - Complete API documentation

### Development
- **[Adding New Models](docs/02-development/adding-models.md)** - Guide for creating new data models
- **[Modifying Existing Models](docs/02-development/modifying-models.md)** - Guide for updating models
- **[Local Development](docs/02-development/README.md)** - Development workflow

### Deployment
- **[Deployment Guide](docs/03-deployment/deployment-guide.md)** - Complete deployment instructions
- **[Multi-Environment Setup](docs/03-deployment/multi-environment.md)** - Dev/Prod environments
- **[Troubleshooting](docs/03-deployment/troubleshooting.md)** - Common issues and solutions

### Features
- **[Rider-Horse Pairings](docs/04-features/associations.md)** - Pairing management feature
- **[Environment Variables](docs/08-reference/environment-variables.md)** - Configuration reference

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git
- Cloudflare account (free)
- Supabase account (free)

### Launch Locally

**Use the launch script:**

```bash
./launch-local.sh
```

The script will automatically:
- ✅ Check prerequisites
- ✅ Install dependencies
- ✅ Launch frontend (port 5173)
- ✅ Launch backend (port 8787)
- ✅ Monitor services

### First-Time Setup

1. **Clone the repository:**

```bash
git clone https://github.com/adeline-t/equestrian-project.git
cd equestrian-project
```

2. **Set up the database:**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL script from `database/schema.sql` in Supabase SQL Editor
   - Run migrations from `database/migrations/` in order
   - Copy your Project URL and anon key

3. **Configure environment files:**

   Create `frontend/.env`:
   ```bash
   VITE_API_URL=http://localhost:8787/api
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

   Create `backend/.dev.vars`:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Launch the application:**

```bash
./launch-local.sh
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
│   │   │   ├── pairings.js
│   │   │   ├── packages.js
│   │   │   └── calendar.js
│   │   ├── repositories/       # Data access layer
│   │   ├── services/           # Business logic
│   │   ├── cron/              # Scheduled tasks
│   │   ├── db.js              # Database utilities
│   │   └── index.js           # Main router
│   ├── wrangler.toml.example  # Cloudflare config template
│   └── package.json
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── riders/
│   │   │   ├── horses/
│   │   │   ├── pairings/
│   │   │   ├── packages/
│   │   │   ├── lessons/
│   │   │   ├── calendar/
│   │   │   └── templates/
│   │   ├── services/          # API services
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── .env.dev.example      # Dev environment template
│   ├── .env.prod.example     # Prod environment template
│   └── package.json
├── database/
│   ├── schema.sql            # Base database schema
│   └── migrations/           # Database migrations
├── docs/                      # Documentation
│   ├── 01-getting-started/   # Getting started guides
│   ├── 02-development/       # Development guides
│   ├── 03-deployment/        # Deployment guides
│   ├── 04-features/          # Feature documentation
│   ├── 05-api/              # API documentation
│   ├── 06-architecture/     # Architecture docs
│   ├── 07-operations/       # Operations guides
│   ├── 08-reference/        # Reference materials
│   ├── 09-scripts/          # Scripts documentation
│   └── 10-calendar-system/  # Calendar system docs
├── scripts/                   # Automation scripts
│   ├── setup/               # Setup scripts
│   └── utils/               # Utility scripts
├── launch-local.sh           # Local launcher script
├── deploy.sh                 # Deployment script
└── README.md                # This file
```

## 🔧 Development

### Local Development

```bash
# Start development servers
./launch-local.sh

# Or manually:
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Available Scripts

**Setup Scripts:**
- `scripts/setup/install.sh` - Install dependencies
- `scripts/setup/quick-start.sh` - Quick project setup
- `scripts/setup/setup-project.sh` - Complete project setup
- `scripts/setup/setup-supabase.sh` - Supabase configuration
- `scripts/setup/setup-cloudflare.sh` - Cloudflare configuration

**Utility Scripts:**
- `scripts/utils/cleanup.sh` - Clean build artifacts

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

See [Deployment Guide](docs/03-deployment/deployment-guide.md) for complete instructions.

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

The API provides RESTful endpoints for managing riders, horses, pairings, packages, and calendar events.

### Base URL
- Development: `http://localhost:8787/api`
- Production: `https://your-worker.workers.dev/api`

### Main Endpoints

**Riders:**
- `GET /api/riders` - List all riders
- `GET /api/riders/:id` - Get single rider
- `POST /api/riders` - Create rider
- `PUT /api/riders/:id` - Update rider
- `DELETE /api/riders/:id` - Delete rider

**Horses:**
- `GET /api/horses` - List all horses
- `GET /api/horses/:id` - Get single horse
- `POST /api/horses` - Create horse
- `PUT /api/horses/:id` - Update horse
- `DELETE /api/horses/:id` - Delete horse

**Pairings:**
- `GET /api/pairings` - List all pairings
- `POST /api/pairings` - Create pairing
- `PUT /api/pairings/:id` - Update pairing
- `DELETE /api/pairings/:id` - Delete pairing

**Packages:**
- `GET /api/packages` - List all packages
- `POST /api/packages` - Create package
- `PUT /api/packages/:id` - Update package
- `DELETE /api/packages/:id` - Delete package

**Calendar:**
- `GET /api/lessons` - List lessons
- `POST /api/lessons` - Create lesson
- `GET /api/templates` - List lesson templates
- `POST /api/templates` - Create template
- `GET /api/blocked-periods` - List blocked periods
- `POST /api/blocked-periods` - Create blocked period

**Utility:**
- `GET /api/health` - Health check

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
- **Troubleshooting:** See [Troubleshooting Guide](docs/03-deployment/troubleshooting.md)

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Cloudflare Workers](https://workers.cloudflare.com/)
- Database by [Supabase](https://supabase.com/)
- Bundled with [Vite](https://vitejs.dev/)

---

**Made with ❤️ for equestrian facilities**