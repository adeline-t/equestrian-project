# Reference Documentation

This section contains reference materials, configuration guides, and technical specifications.

## 📚 Documentation in This Section

- **[Environment Variables](./environment-variables.md)** - Complete environment variable reference
- **[Configuration](./configuration.md)** - Configuration file reference
- **[CLI Commands](./cli-commands.md)** - Command-line interface reference
- **[Glossary](./glossary.md)** - Terms and definitions
- **[FAQ](./faq.md)** - Frequently asked questions

## 🔧 Quick Reference

### Environment Variables

**Backend (Cloudflare Workers):**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
ENVIRONMENT=production
```

**Frontend (React/Vite):**
```bash
VITE_API_URL=https://your-api-url/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ENVIRONMENT=production
```

See [Environment Variables](./environment-variables.md) for complete reference.

### Common Commands

**Development:**
```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Run tests
npm test
```

**Deployment:**
```bash
# Deploy to development
./deploy.sh dev

# Deploy to production
./deploy.sh prod

# Rollback deployment
wrangler rollback --env prod
```

**Database:**
```bash
# Connect to database
psql -h your-supabase-host -U postgres

# Run migrations
psql -h your-supabase-host -U postgres -f migration.sql

# Backup database
pg_dump -h your-supabase-host -U postgres > backup.sql
```

See [CLI Commands](./cli-commands.md) for complete reference.

## 📖 Configuration Files

### Backend Configuration

**wrangler.toml:**
```toml
name = "equestrian-api"
main = "src/index.js"
compatibility_date = "2024-01-01"

[env.dev]
name = "equestrian-api-dev"
vars = { ENVIRONMENT = "development" }

[env.prod]
name = "equestrian-api-prod"
vars = { ENVIRONMENT = "production" }
```

### Frontend Configuration

**vite.config.js:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
});
```

See [Configuration](./configuration.md) for complete reference.

## 📊 API Reference

### Base URLs
- **Development:** `http://localhost:8787/api`
- **Production:** `https://your-worker.workers.dev/api`

### Endpoints Summary

**Riders:**
- `GET /api/riders` - List all
- `GET /api/riders/:id` - Get one
- `POST /api/riders` - Create
- `PUT /api/riders/:id` - Update
- `DELETE /api/riders/:id` - Delete

**Horses:**
- `GET /api/horses` - List all
- `GET /api/horses/:id` - Get one
- `POST /api/horses` - Create
- `PUT /api/horses/:id` - Update
- `DELETE /api/horses/:id` - Delete

**Associations:**
- `GET /api/associations` - List all
- `GET /api/associations/:id` - Get one
- `POST /api/associations` - Create
- `PUT /api/associations/:id` - Update
- `DELETE /api/associations/:id` - Delete

See [API Documentation](../05-api/README.md) for complete reference.

## 🗂️ Database Schema

### Tables

**riders:**
```sql
CREATE TABLE riders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    activity_start_date DATE,
    activity_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**horses:**
```sql
CREATE TABLE horses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    kind VARCHAR(10) NOT NULL CHECK (kind IN ('horse', 'pony')),
    activity_start_date DATE,
    activity_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**rider_horse_associations:**
```sql
CREATE TABLE rider_horse_associations (
    id SERIAL PRIMARY KEY,
    rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
    horse_id INTEGER NOT NULL REFERENCES horses(id) ON DELETE CASCADE,
    association_start_date DATE,
    association_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rider_id, horse_id, association_start_date)
);
```

See [Database Schema](../06-architecture/database-schema.md) for complete reference.

## 📝 Glossary

### Common Terms

**API** - Application Programming Interface, the backend service that handles data operations

**Backend** - Server-side code running on Cloudflare Workers

**Frontend** - Client-side React application

**Worker** - Cloudflare Workers serverless function

**Supabase** - Managed PostgreSQL database hosting service

**Wrangler** - Cloudflare's CLI tool for Workers

**Vite** - Frontend build tool and development server

**Association** - Relationship between a rider and a horse

See [Glossary](./glossary.md) for complete definitions.

## ❓ Frequently Asked Questions

### General

**Q: Is this project free to host?**
A: Yes, using Cloudflare's free tier and Supabase's free tier.

**Q: Can I use a custom domain?**
A: Yes, Cloudflare supports custom domains for both Pages and Workers.

**Q: How do I backup my data?**
A: Supabase provides automatic daily backups. You can also export manually.

### Development

**Q: What Node.js version do I need?**
A: Node.js 18 or later is required.

**Q: Can I use TypeScript?**
A: Yes, you can migrate to TypeScript. The project currently uses JavaScript.

**Q: How do I add a new feature?**
A: Use the model generator script: `cd scripts && node add-model.js`

### Deployment

**Q: How long does deployment take?**
A: Typically 2-5 minutes for both frontend and backend.

**Q: Can I rollback a deployment?**
A: Yes, use `wrangler rollback --env prod` for Workers.

**Q: How do I set environment variables?**
A: Use `wrangler secret put SECRET_NAME --env prod` for Workers.

See [FAQ](./faq.md) for more questions and answers.

## 🔗 External Resources

### Documentation
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

### Tools
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Community
- [Cloudflare Discord](https://discord.gg/cloudflaredev)
- [Supabase Discord](https://discord.supabase.com/)
- [React Community](https://react.dev/community)

## 🆘 Getting Help

- **Environment Variables:** See [Environment Variables](./environment-variables.md)
- **Configuration:** See [Configuration](./configuration.md)
- **Commands:** See [CLI Commands](./cli-commands.md)
- **Terms:** See [Glossary](./glossary.md)
- **Questions:** See [FAQ](./faq.md)

## 📖 Related Documentation

- **[Getting Started](../01-getting-started/README.md)** - Installation and setup
- **[Development Guide](../02-development/README.md)** - Development workflow
- **[Deployment Guide](../03-deployment/README.md)** - Deployment procedures
- **[API Documentation](../05-api/README.md)** - API reference
- **[Architecture](../06-architecture/README.md)** - System architecture
- **[Operations](../07-operations/README.md)** - Production operations

---

**Need a quick reference?** Check the sections above or dive into detailed documentation.