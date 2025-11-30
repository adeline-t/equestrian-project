# Environment Variables Reference

This document provides a complete reference of all environment variables used in the equestrian project across different environments.

## 📋 Overview

The project uses environment-specific configuration files to manage different deployment environments:
- **Development**: `.env.dev` files
- **Production**: `.env.prod` files
- **Active Runtime**: `.env` files (copied from environment-specific files)

---

## 🎨 Frontend Environment Variables

### Core API Configuration
| Variable | Type | Development | Production | Description |
|----------|------|-------------|------------|-------------|
| `VITE_API_URL` | URL | `https://dev-api.yourdomain.com/api` | `https://api.yourdomain.com/api` | Base URL for API requests |
| `VITE_ENVIRONMENT` | String | `development` | `production` | Current environment identifier |
| `VITE_LOG_LEVEL` | String | `debug` | `error` | Logging verbosity level |

### Supabase Configuration
| Variable | Type | Development | Production | Description |
|----------|------|-------------|------------|-------------|
| `VITE_SUPABASE_URL` | URL | Dev Supabase URL | Prod Supabase URL | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | String | Dev anon key | Prod anon key | Supabase anonymous public key |

### Development Features
| Variable | Type | Development | Production | Description |
|----------|------|-------------|------------|-------------|
| `VITE_ENABLE_MOCK_DATA` | Boolean | `true` | `false` | Enable mock data for testing |
| `VITE_SHOW_DEBUG_INFO` | Boolean | `true` | `false` | Show debug information in UI |

### Production Features
| Variable | Type | Development | Production | Description |
|----------|------|-------------|------------|-------------|
| `VITE_ENABLE_ANALYTICS` | Boolean | `false` | `true` | Enable analytics tracking |
| `VITE_ENABLE_ERROR_REPORTING` | Boolean | `false` | `true` | Enable error reporting service |

---

## ⚙️ Backend Environment Variables

### Core Configuration
| Variable | Type | Development | Production | Description |
|----------|------|-------------|------------|-------------|
| `ENVIRONMENT` | String | `development` | `production` | Current environment identifier |
| `LOG_LEVEL` | String | `debug` | `error` | Logging verbosity level |

### Supabase Configuration
| Variable | Type | Development | Production | Description |
|----------|------|-------------|------------|-------------|
| `SUPABASE_URL` | URL | Dev Supabase URL | Prod Supabase URL | Supabase project URL |
| `SUPABASE_ANON_KEY` | String | Dev anon key | Prod anon key | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | String | Dev service key | Prod service key | Supabase service role key (admin access) |

### Database Configuration
| Variable | Type | Development | Production | Description |
|----------|------|-------------|------------|-------------|
| `DATABASE_URL` | URL | Dev database URL | Prod database URL | Direct database connection string |

### Security Settings
| Variable | Type | Development | Production | Description |
|----------|------|-------------|------------|-------------|
| `CORS_ORIGIN` | String/URL | `*` (all origins) | `https://yourdomain.com` | Allowed CORS origins |
| `ENABLE_DEBUG_LOGS` | Boolean | `true` | `false` | Enable debug logging |
| `ENABLE_PERMISSIVE_RLS` | Boolean | `true` | `false` | Enable permissive Row Level Security |

---

## 🔧 Wrangler.toml Configuration

### Environment Sections
```toml
# Default (development)
[vars]
ENVIRONMENT = "development"

[env.dev]
name = "equestrian-api-dev"
vars = { ENVIRONMENT = "development", LOG_LEVEL = "debug" }

[env.prod]
name = "equestrian-api-prod"
vars = { ENVIRONMENT = "production", LOG_LEVEL = "error" }
```

---

## 🔐 Security Considerations

### Public vs Private Variables

#### Frontend (Public - VITE_*)
These variables are embedded in the client bundle and visible to users:
- ✅ `VITE_SUPABASE_URL` - Safe to expose
- ✅ `VITE_SUPABASE_ANON_KEY` - Safe to expose (public key)
- ✅ `VITE_API_URL` - Safe to expose
- ❌ **Never** include service role keys or secrets

#### Backend (Private)
These variables are server-side only and never exposed to clients:
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Must remain secret
- ✅ `DATABASE_URL` - Must remain secret
- ✅ Any API keys or secrets

### Best Practices
1. **Never commit** `.env` files to version control
2. **Always use** Wrangler secrets for production sensitive data
3. **Use different** keys for dev and prod environments
4. **Rotate keys** regularly in production
5. **Limit scope** of service role keys

---

## 🚀 Environment-Specific Setup Scripts

### Development Setup
```bash
# Copy development environment files
cp frontend/.env.dev frontend/.env
cp backend/.env.dev backend/.env

# Set Wrangler secrets for development
npx wrangler secret put SUPABASE_URL --env dev
npx wrangler secret put SUPABASE_ANON_KEY --env dev
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env dev
```

### Production Setup
```bash
# Copy production environment files
cp frontend/.env.prod frontend/.env
cp backend/.env.prod backend/.env

# Set Wrangler secrets for production
npx wrangler secret put SUPABASE_URL --env prod
npx wrangler secret put SUPABASE_ANON_KEY --env prod
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env prod
```

---

## 📝 File Structure

```
equestrian-project/
├── frontend/
│   ├── .env              # Active environment (copied from dev/prod)
│   ├── .env.dev          # Development configuration
│   ├── .env.prod         # Production configuration
│   ├── .env.example      # Template with placeholders
│   └── vite.config.*.js  # Environment-specific Vite configs
├── backend/
│   ├── .env              # Active environment (copied from dev/prod)
│   ├── .env.dev          # Development configuration
│   └── .env.prod         # Production configuration
└── scripts/
    ├── setup-supabase.sh  # Automated Supabase setup
    └── setup-cloudflare.sh # Automated Cloudflare setup
```

---

## 🔍 Validation Commands

### Check Frontend Environment
```bash
# Verify frontend environment variables
cd frontend
cat .env

# Check Vite configuration
npm run build -- --mode production
```

### Check Backend Environment
```bash
# Verify backend environment variables
cd backend
cat .env

# Check Wrangler configuration
npx wrangler dev --env dev
```

### Validate Secrets
```bash
# List configured secrets (dev)
npx wrangler secret list --env dev

# List configured secrets (prod)
npx wrangler secret list --env prod
```

---

## 🆘 Troubleshooting

### Common Issues

#### Variable Not Found
```bash
# Check if .env file exists and is readable
ls -la .env*
cat .env

# Verify variable names match exactly
grep -r "VITE_API_URL" .
```

#### Wrangler Secrets Missing
```bash
# Check secret status
npx wrangler secret list --env [dev|prod]

# Add missing secrets
npx wrangler secret put VARIABLE_NAME --env [dev|prod]
```

#### Environment Mismatch
```bash
# Verify current environment
echo $VITE_ENVIRONMENT

# Switch environments
cp .env.dev .env  # or .env.prod
```

### Debug Commands
```bash
# Test environment variable loading
node -e "console.log(process.env.VITE_API_URL)"

# Test Wrangler environment
npx wrangler dev --env dev --inspect
```

---

## 📚 Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Cloudflare Workers Environment Variables](https://developers.cloudflare.com/workers/platform/environment-variables/)
- [Supabase Environment Variables](https://supabase.com/docs/reference/javascript/auth-signin#sign-in-with-email-password)
- [Wrangler Secrets](https://developers.cloudflare.com/workers/wrangler/commands/#secret)

---

This reference should help you understand and manage all environment variables across your equestrian project's different deployment environments.