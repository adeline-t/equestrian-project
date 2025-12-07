# 📖 Script Reference

> **Detailed reference documentation for all project scripts.**

This document provides comprehensive documentation for each script including parameters, exit codes, examples, and troubleshooting.

## Table of Contents

- [Launch Scripts](#launch-scripts)
  - [start.sh](#startsh)
  - [launch-local.sh](#launch-localsh)
- [Deployment Scripts](#deployment-scripts)
  - [deploy.sh](#deploysh)
- [Automation Scripts](#automation-scripts)
  - [add-model.js](#add-modeljs)
  - [modify-model.js](#modify-modeljs)
- [Setup Scripts](#setup-scripts)
  - [setup-project.sh](#setup-projectsh)
  - [setup-supabase.sh](#setup-supabasesh)
  - [setup-cloudflare.sh](#setup-cloudflaresh)
  - [install.sh](#installsh)
  - [quick-start.sh](#quick-startsh)
- [Utility Scripts](#utility-scripts)
  - [cleanup.sh](#cleanupsh)
  - [test.js](#testjs)
  - [validate-scripts.sh](#validate-scriptssh)

---

## Launch Scripts

### start.sh

**Purpose**: Simplest one-command launcher for local development.

**Location**: `./start.sh` (project root)

**Platform**: macOS, Linux

**Synopsis**:
```bash
./start.sh
```

**Description**:
Wrapper script that calls `launch-local.sh`. Provides the shortest path to launching the application.

**Parameters**: None

**Exit Codes**:
- `0`: Launch successful
- `1`: Launch failed (passes through from launch-local.sh)

**Examples**:
```bash
# Launch the application
./start.sh
```

**Dependencies**:
- `launch-local.sh` must exist

**Notes**:
- No configuration needed
- Perfect for daily development
- Automatically handles all setup

**Troubleshooting**:

*Issue*: Permission denied
```bash
chmod +x start.sh
```

*Issue*: launch-local.sh not found
```bash
# Ensure you're in project root
pwd  # Should show .../equestrian-project
```

---

### launch-local.sh

**Purpose**: Full-featured local launcher with monitoring and logging.

**Location**: `./launch-local.sh` (project root)

**Platform**: macOS, Linux

**Synopsis**:
```bash
./launch-local.sh
```

**Description**:
Comprehensive launcher that:
- Checks prerequisites (Node.js, npm, ports)
- Installs dependencies automatically
- Verifies environment configuration
- Launches backend (port 8787) and frontend (port 5173)
- Monitors service health continuously
- Saves logs to `logs/` directory
- Handles graceful shutdown on Ctrl+C

**Parameters**: None

**Exit Codes**:
- `0`: All services launched and running
- `1`: Prerequisites missing, service failed, or user cancelled

**Environment Variables**:
None required (reads from .env files)

**Ports Used**:
- `5173`: Frontend (Vite dev server)
- `8787`: Backend (Cloudflare Workers)

**Examples**:
```bash
# Launch with default settings
./launch-local.sh

# View logs while running (in another terminal)
tail -f logs/frontend.log
tail -f logs/backend.log
```

**Dependencies**:
- Node.js 18+
- npm 9+
- lsof (for port checking)
- Frontend dependencies (installed automatically)
- Backend dependencies (installed automatically)

**Files Created**:
- `logs/frontend.log`: Frontend output
- `logs/backend.log`: Backend output

**Interactive Prompts**:
1. Port conflict resolution (if ports in use)
2. Environment configuration warning (if .env missing)
3. Continue with warnings (if configuration incomplete)

**Monitoring**:
- Health checks every 5 seconds
- Automatic crash detection
- Process ID tracking
- Resource monitoring

**Shutdown**:
- Press `Ctrl+C` to stop
- Gracefully terminates both services
- Cleans up background processes
- Frees ports 5173 and 8787

**Troubleshooting**:

*Issue*: Port already in use
```bash
# Script will offer to kill process automatically
# Or manually:
lsof -ti:5173 | xargs kill -9
lsof -ti:8787 | xargs kill -9
```

*Issue*: Dependencies won't install
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf frontend/node_modules backend/node_modules

# Run script again
./launch-local.sh
```

*Issue*: Service crashes immediately
```bash
# Check logs
cat logs/backend.log
cat logs/frontend.log

# Common causes:
# - Missing environment variables
# - Invalid Supabase credentials
# - Port conflicts
```

**Advanced Usage**:

View real-time logs:
```bash
# Terminal 1: Launch
./launch-local.sh

# Terminal 2: Watch frontend logs
tail -f logs/frontend.log

# Terminal 3: Watch backend logs
tail -f logs/backend.log
```

Monitor processes:
```bash
# Check if services are running
ps aux | grep node

# Check port usage
lsof -i :5173
lsof -i :8787
```

---

## Deployment Scripts

### deploy.sh

**Purpose**: Deploy application to production or staging environments.

**Location**: `./deploy.sh` (project root)

**Platform**: macOS, Linux

**Synopsis**:
```bash
./deploy.sh [environment]
```

**Description**:
Deploys the complete application stack:
- Builds frontend for production
- Deploys backend to Cloudflare Workers
- Deploys frontend to Cloudflare Pages
- Validates deployment
- Provides deployment URLs

**Parameters**:
- `environment` (optional): Target environment
  - `prod`: Production (default)
  - `staging`: Staging environment
  - `dev`: Development environment

**Exit Codes**:
- `0`: Deployment successful
- `1`: Deployment failed

**Environment Variables Required**:
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID

**Examples**:
```bash
# Deploy to production
./deploy.sh prod

# Deploy to staging
./deploy.sh staging

# Deploy to dev (default to prod if no arg)
./deploy.sh
```

**Dependencies**:
- Node.js 18+
- npm 9+
- wrangler CLI
- Cloudflare account configured
- Valid API credentials

**Deployment Steps**:
1. Validates environment
2. Builds frontend (`npm run build`)
3. Deploys backend (`wrangler deploy`)
4. Deploys frontend (`wrangler pages deploy`)
5. Runs smoke tests
6. Displays deployment URLs

**Files Modified**:
- `frontend/dist/`: Production build
- `backend/.wrangler/`: Deployment artifacts

**Troubleshooting**:

*Issue*: Cloudflare authentication failed
```bash
# Login to Cloudflare
wrangler login

# Or set API token
export CLOUDFLARE_API_TOKEN="your-token"
```

*Issue*: Build fails
```bash
# Clean and rebuild
./scripts/cleanup.sh --all
npm install
./deploy.sh
```

*Issue*: Deployment succeeds but site doesn't work
```bash
# Check environment variables in Cloudflare dashboard
# Verify Supabase credentials
# Check browser console for errors
```

---

## Automation Scripts

### add-model.js

**Purpose**: Interactive generator for creating new data models.

**Location**: `./scripts/add-model.js`

**Platform**: Cross-platform (Node.js)

**Synopsis**:
```bash
cd scripts
./add-model.js
```

**Description**:
Interactive CLI tool that generates complete CRUD functionality for new models:
- Database migration SQL
- Backend API handler with validation
- Frontend List component
- Frontend Form component
- Type definitions
- CSS styles
- Automatic routing updates

**Parameters**: None (interactive prompts)

**Exit Codes**:
- `0`: Model created successfully
- `1`: Generation failed or user cancelled

**Interactive Prompts**:
1. Model name (singular, PascalCase)
2. Display name (French, singular)
3. Display name (French, plural)
4. Main emoji for UI
5. Has activity dates? (yes/no)
6. Field definitions:
   - Field name
   - Field type
   - Required? (yes/no)
   - Default value (optional)
   - Enum values (if type is enum)

**Supported Field Types**:
- `string`: VARCHAR(255)
- `text`: TEXT (long text)
- `integer`: INTEGER
- `decimal`: DECIMAL(10,2)
- `boolean`: BOOLEAN
- `date`: DATE
- `datetime`: TIMESTAMP
- `email`: VARCHAR(255) with validation
- `phone`: VARCHAR(50) with validation
- `enum`: VARCHAR(100) with options

**Generated Files**:
```
backend/src/handlers/{model}.js
database/migrations/XXX_create_{model}.sql
frontend/src/components/{model}/{Model}List.jsx
frontend/src/components/{model}/{Model}Form.jsx
frontend/src/types/{model}.js
frontend/src/components/{model}/{model}.css
```

**Examples**:

Creating an Instructor model:
```bash
cd scripts
./add-model.js

# Prompts:
Model name: Instructor
Display name: Moniteur
Display plural: Moniteurs
Main emoji: 👨‍🏫
Has activity dates: Yes

# Fields:
name (string, required)
email (email, optional)
phone (phone, optional)
specialization (enum: Dressage,Saut d'obstacle,Pony club)
certification_level (string, optional)
hourly_rate (decimal, optional)
```

**Dependencies**:
- Node.js 18+
- npm packages: inquirer, chalk, fs-extra

**Post-Generation Steps**:
1. Review generated SQL migration
2. Apply migration in Supabase SQL Editor
3. Update backend routing (if needed)
4. Test API endpoints
5. Test frontend components
6. Commit changes to git

**Troubleshooting**:

*Issue*: Module not found
```bash
cd scripts
npm install
```

*Issue*: Template not found
```bash
# Ensure you're in scripts directory
pwd  # Should show .../equestrian-project/scripts
```

*Issue*: Generated code has errors
```bash
# Check template files in scripts/templates/
# Verify field types are supported
# Review generated files manually
```

**See Also**:
- [Adding Models Guide](../02-development/adding-models.md)
- [Model Automation README](../../scripts/README.md)

---

### modify-model.js

**Purpose**: Interactive tool for modifying existing data models.

**Location**: `./scripts/modify-model.js`

**Platform**: Cross-platform (Node.js)

**Synopsis**:
```bash
cd scripts
./modify-model.js
```

**Description**:
Interactive CLI tool for modifying existing models:
- Add new fields
- Remove fields
- Modify field properties
- Add relationships (foreign keys, many-to-many)
- Add custom API endpoints

**Parameters**: None (interactive prompts)

**Exit Codes**:
- `0`: Modification successful
- `1`: Modification failed or user cancelled

**Interactive Prompts**:
1. Select model to modify
2. Select modification type:
   - Add new field(s)
   - Remove field(s)
   - Modify field properties
   - Add foreign key relationship
   - Add many-to-many relationship
   - Add custom endpoint
3. Specific prompts based on modification type

**Modification Types**:

**Add Field**:
- Field name
- Field type
- Required status
- Default value
- Validation rules

**Remove Field**:
- Field name to remove
- Confirm removal
- Handle existing data

**Modify Field**:
- Field to modify
- New type (if changing)
- New required status
- New default value

**Add Relationship**:
- Related model
- Relationship type
- Foreign key name
- Cascade options

**Add Endpoint**:
- Endpoint path
- HTTP method
- Handler logic template

**Generated Files**:
```
database/migrations/XXX_modify_{model}.sql
backend/src/handlers/{model}.js (updated)
frontend/src/components/{model}/* (updated if needed)
```

**Examples**:

Adding a field to Horse model:
```bash
cd scripts
./modify-model.js

# Prompts:
Select model: horses
Modification: Add new field(s)
Field name: is_owned_by_laury
Type: boolean
Required: No
Default: false
```

Adding a relationship:
```bash
cd scripts
./modify-model.js

# Prompts:
Select model: lessons
Modification: Add foreign key relationship
Related model: instructors
Foreign key: instructor_id
On delete: SET NULL
```

**Dependencies**:
- Node.js 18+
- npm packages: inquirer, chalk, fs-extra

**Post-Modification Steps**:
1. Review generated migration SQL
2. Apply migration in Supabase
3. Test modified endpoints
4. Update frontend if needed
5. Test thoroughly
6. Commit changes

**Troubleshooting**:

*Issue*: Model not found
```bash
# Ensure model exists in backend/src/handlers/
ls backend/src/handlers/
```

*Issue*: Migration fails
```bash
# Check for:
# - Existing field with same name
# - Invalid data type
# - Constraint violations
```

**See Also**:
- [Modifying Models Guide](../02-development/modifying-models.md)
- [Model Automation README](../../scripts/README.md)

---

## Setup Scripts

### setup-project.sh

**Purpose**: Complete project setup from scratch.

**Location**: `./scripts/setup-project.sh`

**Platform**: macOS, Linux

**Synopsis**:
```bash
./scripts/setup-project.sh
```

**Description**:
Comprehensive setup script that:
- Checks prerequisites
- Installs all dependencies
- Creates environment files
- Configures Supabase connection
- Creates wrangler.toml
- Validates configuration

**Parameters**: None (interactive prompts)

**Exit Codes**:
- `0`: Setup completed successfully
- `1`: Setup failed

**Interactive Prompts**:
1. Supabase URL
2. Supabase Anon Key
3. Supabase Service Role Key
4. Environment selection (dev/prod)
5. Cloudflare configuration (optional)

**Files Created**:
- `frontend/.env` or `frontend/.env.dev`
- `backend/.env` or `backend/.env.dev`
- `backend/wrangler.toml`

**Dependencies**:
- Node.js 18+
- npm 9+
- Git

**Setup Steps**:
1. Prerequisite checks
2. Frontend dependency installation
3. Backend dependency installation
4. Environment file creation
5. Supabase configuration
6. Cloudflare configuration (optional)
7. Validation

**Examples**:
```bash
# Run complete setup
./scripts/setup-project.sh

# Follow prompts to enter credentials
```

**Troubleshooting**:

*Issue*: npm install fails
```bash
# Clear cache
npm cache clean --force

# Try again
./scripts/setup-project.sh
```

*Issue*: Invalid Supabase credentials
```bash
# Verify credentials in Supabase dashboard
# Settings → API
# Copy exact values
```

**See Also**:
- [Installation Guide](../01-getting-started/installation.md)
- [Prerequisites](../01-getting-started/prerequisites.md)

---

### setup-supabase.sh

**Purpose**: Configure Supabase connection and database.

**Location**: `./scripts/setup-supabase.sh`

**Platform**: macOS, Linux

**Synopsis**:
```bash
./scripts/setup-supabase.sh
```

**Description**:
Configures Supabase:
- Validates credentials
- Tests database connection
- Optionally runs schema migrations
- Creates environment variables
- Verifies RLS policies

**Parameters**: None (interactive prompts)

**Exit Codes**:
- `0`: Configuration successful
- `1`: Configuration failed

**Interactive Prompts**:
1. Supabase URL
2. Supabase Anon Key
3. Supabase Service Role Key
4. Run migrations? (yes/no)

**Dependencies**:
- curl
- jq (for JSON parsing)
- Supabase account

**Environment Variables Set**:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Examples**:
```bash
./scripts/setup-supabase.sh

# Enter credentials when prompted
```

**Troubleshooting**:

*Issue*: Connection test fails
```bash
# Verify URL format
# Should be: https://xxxxx.supabase.co

# Test manually
curl https://your-project.supabase.co/rest/v1/
```

---

### setup-cloudflare.sh

**Purpose**: Configure Cloudflare Workers and Pages.

**Location**: `./scripts/setup-cloudflare.sh`

**Platform**: macOS, Linux

**Synopsis**:
```bash
./scripts/setup-cloudflare.sh
```

**Description**:
Configures Cloudflare:
- Validates credentials
- Creates wrangler.toml
- Sets up Workers secrets
- Configures Pages project
- Tests deployment

**Parameters**: None (interactive prompts)

**Exit Codes**:
- `0`: Configuration successful
- `1`: Configuration failed

**Dependencies**:
- wrangler CLI
- Cloudflare account

**Examples**:
```bash
./scripts/setup-cloudflare.sh
```

---

### install.sh

**Purpose**: Install all project dependencies.

**Location**: `./scripts/install.sh`

**Platform**: macOS, Linux

**Synopsis**:
```bash
./scripts/install.sh
```

**Description**:
Installs dependencies for:
- Frontend (React, Vite, etc.)
- Backend (Cloudflare Workers, Supabase)
- Scripts (Inquirer, Chalk, etc.)

**Parameters**: None

**Exit Codes**:
- `0`: Installation successful
- `1`: Installation failed

**Examples**:
```bash
./scripts/install.sh
```

---

### quick-start.sh

**Purpose**: Quick setup and preparation.

**Location**: `./scripts/quick-start.sh`

**Platform**: macOS, Linux

**Synopsis**:
```bash
./scripts/quick-start.sh
```

**Description**:
Fastest way to prepare environment:
- Checks prerequisites
- Installs dependencies
- Checks configuration
- Provides next steps

**Parameters**: None

**Exit Codes**:
- `0`: Quick start completed
- `1`: Quick start failed

**Examples**:
```bash
./scripts/quick-start.sh
```

---

## Utility Scripts

### cleanup.sh

**Purpose**: Clean build artifacts and temporary files.

**Location**: `./scripts/cleanup.sh`

**Platform**: macOS, Linux

**Synopsis**:
```bash
./scripts/cleanup.sh [options]
```

**Description**:
Removes build artifacts, caches, and temporary files to free disk space.

**Parameters**:
- `--all`: Clean everything (default)
- `--frontend`: Clean frontend only
- `--backend`: Clean backend only
- `--logs`: Clean logs only

**Exit Codes**:
- `0`: Cleanup successful
- `1`: Cleanup failed

**Files Removed**:
- `frontend/dist/`
- `frontend/dist-dev/`
- `frontend/node_modules/.cache/`
- `backend/.wrangler/`
- `backend/node_modules/.cache/`
- `logs/*.log`

**Disk Space Saved**: Typically 100-500MB

**Examples**:
```bash
# Clean everything
./scripts/cleanup.sh --all

# Clean frontend only
./scripts/cleanup.sh --frontend

# Clean backend only
./scripts/cleanup.sh --backend

# Clean logs only
./scripts/cleanup.sh --logs
```

**Troubleshooting**:

*Issue*: Permission denied
```bash
# Some files may require sudo
sudo ./scripts/cleanup.sh --all
```

---

### test.js

**Purpose**: Test script functionality and templates.

**Location**: `./scripts/test.js`

**Platform**: Cross-platform (Node.js)

**Synopsis**:
```bash
cd scripts
node test.js [test-name]
```

**Description**:
Tests script functionality:
- Template rendering
- Script syntax validation
- File generation
- Dependency checks

**Parameters**:
- `test-name` (optional): Specific test to run

**Exit Codes**:
- `0`: All tests passed
- `1`: Tests failed

**Examples**:
```bash
cd scripts

# Run all tests
node test.js

# Run specific test
node test.js templates
node test.js validation
```

---

### validate-scripts.sh

**Purpose**: Validate script integrity and dependencies.

**Location**: `./scripts/validate-scripts.sh`

**Platform**: macOS, Linux

**Synopsis**:
```bash
./scripts/validate-scripts.sh
```

**Description**:
Validates all scripts:
- Checks executability
- Verifies shebang lines
- Validates dependencies
- Checks for common issues

**Parameters**: None

**Exit Codes**:
- `0`: All scripts valid
- `1`: Validation errors found

**Validation Checks**:
- Script files are executable
- Shebang lines are correct
- Required dependencies exist
- No syntax errors
- Consistent naming

**Examples**:
```bash
./scripts/validate-scripts.sh
```

**Output**:
```
✓ Checking script executability...
✓ Validating shebang lines...
✓ Checking dependencies...
✓ All scripts valid
```

---

**Last Updated**: December 2024  
**Maintained by**: Equestrian Project Team