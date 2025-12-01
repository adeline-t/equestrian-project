# Development Guide

This section contains guides for developing and extending the Equestrian Management System.

## 📚 Documentation in This Section

- **[Local Development](./local-development.md)** - Setting up your development environment
- **[Adding Models](./adding-models.md)** - Creating new data models
- **[Modifying Models](./modifying-models.md)** - Updating existing models
- **[Database Migrations](./database-migrations.md)** - Managing database changes
- **[Testing Guide](./testing.md)** - Writing and running tests
- **[Code Style](./code-style.md)** - Coding standards and best practices

## 🎯 Quick Links

### New to Development?
Start with [Local Development](./local-development.md) to set up your environment.

### Adding Features?
Check out [Adding Models](./adding-models.md) for the automated model generator.

### Modifying Existing Code?
See [Modifying Models](./modifying-models.md) for safe modification practices.

### Working with Database?
Review [Database Migrations](./database-migrations.md) for schema changes.

## 🛠️ Development Workflow

### 1. Set Up Local Environment
```bash
# Clone repository
git clone https://github.com/adeline-t/equestrian-project.git
cd equestrian-project

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment
```bash
# Backend
cd backend
cp wrangler.toml.example wrangler.toml
# Edit with your values

# Frontend
cd ../frontend
cp .env.dev.example .env.dev
cp .env.dev .env
# Edit with your values
```

### 3. Run Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Make Changes
- Create a feature branch
- Make your changes
- Write tests
- Test locally
- Commit and push

### 5. Deploy
```bash
# Deploy to development
./deploy.sh dev

# Deploy to production
./deploy.sh prod
```

## 🏗️ Architecture Overview

### Backend (Cloudflare Workers)
- **Language:** JavaScript (ES6+)
- **Runtime:** Cloudflare Workers
- **Database:** Supabase PostgreSQL
- **Structure:** Handler-based routing

### Frontend (React)
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router
- **State:** Local component state
- **Styling:** CSS

### Database (PostgreSQL)
- **Host:** Supabase
- **Schema:** See `database/schema.sql`
- **Migrations:** Manual SQL scripts

## 🔧 Common Development Tasks

### Adding a New Endpoint
1. Create handler function in appropriate file
2. Add route in `backend/src/index.js`
3. Test with curl or Postman
4. Update API documentation

### Adding a New Component
1. Create component file in `frontend/src/components/`
2. Import and use in parent component
3. Add styling if needed
4. Write component tests

### Modifying Database Schema
1. Write migration SQL
2. Test in development Supabase
3. Update `database/schema.sql`
4. Run migration in production
5. Update code to use new schema

### Adding Dependencies
```bash
# Backend
cd backend
npm install package-name

# Frontend
cd frontend
npm install package-name
```

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# Run all tests
npm run test:all
```

### Write Tests
- Unit tests for utilities
- Integration tests for API endpoints
- Component tests for React components
- E2E tests for critical workflows

## 📝 Code Standards

### JavaScript Style
- Use ES6+ features
- Async/await for promises
- Descriptive variable names
- Comments for complex logic

### React Best Practices
- Functional components with hooks
- PropTypes for type checking
- Meaningful component names
- Keep components small and focused

### API Design
- RESTful endpoints
- Consistent error responses
- Proper HTTP status codes
- Validate all inputs

## 🐛 Debugging

### Backend Debugging
```bash
# View logs
wrangler tail

# Debug locally
npm run dev
# Add console.log statements
```

### Frontend Debugging
- Use React DevTools
- Check browser console
- Use network tab for API calls
- Add breakpoints in browser

## 🆘 Getting Help

- **Documentation:** Check other docs in this section
- **Issues:** Search existing GitHub issues
- **Questions:** Open a discussion on GitHub
- **Bugs:** Report with reproduction steps

## 📖 Next Steps

- **[Local Development](./local-development.md)** - Detailed setup guide
- **[Adding Models](./adding-models.md)** - Model generator tutorial
- **[Testing Guide](./testing.md)** - Testing best practices
- **[API Reference](../05-api/README.md)** - API documentation

---

**Ready to develop?** Start with [Local Development](./local-development.md)