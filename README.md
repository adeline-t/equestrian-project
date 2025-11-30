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

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Git
- Cloudflare account (free)
- Supabase account (free)

### Installation

1. **Clone and setup the project:**
```bash
git clone <repository-url>
cd equestrian-manager
```

2. **Set up the database:**
```bash
# Go to Supabase dashboard → SQL Editor
# Copy and paste the contents of database/schema.sql
# Execute the script to create tables
```

3. **Configure backend:**
```bash
cd backend
npm install

# Update wrangler.toml with your Supabase URL
wrangler secret put SUPABASE_KEY  # Add your Supabase anon key
npm run deploy                   # Deploy to Cloudflare Workers
```

4. **Configure frontend:**
```bash
cd ../frontend
npm install

# Create .env file from .env.example
cp .env.example .env
# Update VITE_API_URL with your Workers URL

npm run build                    # Build for production
npm run dev                      # Or run in development
```

5. **Deploy frontend:**
```bash
# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=equestrian-frontend
```

## 📁 Project Structure

```
equestrian-manager/
├── backend/                     # Cloudflare Workers API
│   ├── src/
│   │   ├── handlers/           # Route handlers
│   │   │   ├── riders.js
│   │   │   ├── horses.js
│   │   │   └── associations.js
│   │   ├── db.js              # Database utilities
│   │   └── index.js           # Main router
│   ├── wrangler.toml          # Cloudflare config
│   └── package.json
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── riders/
│   │   │   ├── horses/
│   │   │   └── associations/
│   │   ├── services/          # API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── database/
│   └── schema.sql              # Database schema
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Backend (Cloudflare Workers Secrets):**
```bash
wrangler secret put SUPABASE_KEY
# Paste your Supabase anon/public key
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-workers-url.workers.dev/api
```

### Database Schema

The system uses three main tables:

1. **riders** - Horse riders information
2. **horses** - Horse details and type
3. **rider_horse_associations** - Many-to-many relationships with date ranges

## 🎯 Usage Guide

### Managing Riders

1. **Add a Rider:**
   - Click "➕ Nouveau Cavalier"
   - Fill in name (required), phone, email
   - Set activity dates if needed
   - Click "✓ Créer le cavalier"

2. **Edit a Rider:**
   - Click "✏️ Modifier" next to any rider
   - Update the information
   - Click "✓ Mettre à jour le cavalier"

3. **Delete a Rider:**
   - Click "🗑️ Supprimer" next to any rider
   - Confirm the deletion

### Managing Horses

1. **Add a Horse:**
   - Click "➕ Nouveau Cheval"
   - Enter name and select type (Cheval/Poney)
   - Set activity dates if needed
   - Click "✓ Créer le cheval"

2. **Filter Horses:**
   - Use filter buttons to show all, horses only, or ponies only
   - View statistics in the dashboard

### Managing Associations

1. **Create Association:**
   - Click "➕ Nouvelle Association"
   - Select rider and horse from dropdowns
   - Set association dates if needed
   - Click "✓ Créer l'association"

2. **View Status:**
   - Green badge = Active association
   - Gray badge = Inactive association
   - Filter by active/inactive status

## 🔒 Security Features

- **CORS Configuration** for cross-origin requests
- **Input Validation** on both frontend and backend
- **SQL Injection Protection** using parameterized queries
- **Rate Limiting** to prevent abuse
- **Security Headers** for additional protection
- **Environment Variables** for sensitive data

## 📊 API Endpoints

### Riders
- `GET /api/riders` - List all riders
- `GET /api/riders/:id` - Get single rider
- `POST /api/riders` - Create rider
- `PUT /api/riders/:id` - Update rider
- `DELETE /api/riders/:id` - Delete rider
- `GET /api/riders/:id/horses` - Get rider's horses

### Horses
- `GET /api/horses` - List all horses
- `GET /api/horses/:id` - Get single horse
- `POST /api/horses` - Create horse
- `PUT /api/horses/:id` - Update horse
- `DELETE /api/horses/:id` - Delete horse
- `GET /api/horses/:id/riders` - Get horse's riders

### Associations
- `GET /api/associations` - List all associations
- `GET /api/associations/:id` - Get single association
- `POST /api/associations` - Create association
- `PUT /api/associations/:id` - Update association
- `DELETE /api/associations/:id` - Delete association

### Utility
- `GET /api/health` - Health check
- `GET /api/docs` - API documentation

## 🌍 Deployment

### Production Deployment

1. **Backend (Cloudflare Workers):**
```bash
cd backend
npm run deploy
```

2. **Frontend (Cloudflare Pages):**
```bash
cd frontend
npm run build
npx wrangler pages deploy dist --project-name=equestrian-frontend
```

### Environment Updates

To update the application:

1. **Backend Changes:**
```bash
cd backend
npm run deploy  # Automatic redeployment
```

2. **Frontend Changes:**
```bash
cd frontend
npm run build
npx wrangler pages deploy dist --project-name=equestrian-frontend
```

## 💰 Costs

This solution is **100% FREE**:

- **Supabase**: 500MB database, 50K users/month
- **Cloudflare Workers**: 100K requests/day
- **Cloudflare Pages**: Unlimited bandwidth, 500 builds/month

## 🔧 Troubleshooting

### Common Issues

1. **"Failed to fetch" Error:**
   - Check VITE_API_URL in frontend .env
   - Verify backend is deployed and accessible
   - Check browser console for CORS errors

2. **Database Connection Errors:**
   - Verify SUPABASE_URL in wrangler.toml
   - Check SUPABASE_KEY secret is set correctly
   - Ensure Supabase database is active

3. **Build Failures:**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version: `node -v` (should be 18+)

### Getting Help

- Check Cloudflare Workers logs: `wrangler tail`
- Verify Supabase database status
- Test API endpoints directly with curl/Postman

## 🚀 Future Enhancements

The architecture supports easy expansion:

1. **Authentication System**
   - User login with Supabase Auth
   - Role-based access control
   - Personalized dashboards

2. **Advanced Features**
   - Scheduling system for lessons
   - Payment tracking and invoices
   - Medical records management
   - Document storage for insurance papers

3. **Analytics & Reporting**
   - Usage statistics
   - Export to PDF/Excel
   - Advanced filtering and search

4. **Mobile App**
   - React Native implementation
   - Offline support
   - Push notifications

## 📝 License

MIT License - feel free to use this for your equestrian facility!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ for the equestrian community**