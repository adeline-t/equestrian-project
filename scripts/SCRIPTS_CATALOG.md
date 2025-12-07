# 📚 Scripts Catalog

> **Central inventory of all project scripts with descriptions, usage, and dependencies.**

This catalog provides a quick reference for all scripts in the Equestrian Project. For detailed documentation, see [docs/09-scripts/](../docs/09-scripts/).

## 📊 Quick Reference Table

| Script | Category | Platform | Purpose | Status | Location |
|--------|----------|----------|---------|--------|----------|
| `start.sh` | Launch | macOS/Linux | One-command app launcher | ✅ Working | Root |
| `start.bat` | Launch | Windows | One-command app launcher | ✅ Working | Root |
| `launch-local.sh` | Launch | macOS/Linux | Full-featured launcher with monitoring | ✅ Working | Root |
| `launch-local.ps1` | Launch | Windows | PowerShell launcher with monitoring | ✅ Working | Root |
| `deploy.sh` | Deployment | macOS/Linux | Production deployment script | ✅ Working | Root |
| `add-model.sh` | Automation | macOS/Linux | Interactive model generator (Bash) | ⭐ NEW | scripts/ |
| `add-model.js` | Automation | Cross-platform | Interactive model generator (JS) | ❌ Broken | scripts/ |
| `modify-model.js` | Automation | Cross-platform | Interactive model modifier | ⚠️ Untested | scripts/ |
| `setup-project.sh` | Setup | macOS/Linux | Complete project setup | ✅ Working | scripts/ |
| `setup-supabase.sh` | Setup | macOS/Linux | Supabase configuration | ✅ Working | scripts/ |
| `setup-cloudflare.sh` | Setup | macOS/Linux | Cloudflare configuration | ✅ Working | scripts/ |
| `install.sh` | Setup | macOS/Linux | Dependency installation | ✅ Working | scripts/ |
| `quick-start.sh` | Setup | macOS/Linux | Quick setup and launch | ✅ Working | scripts/ |
| `cleanup.sh` | Utility | macOS/Linux | Clean build artifacts | ✅ Working | scripts/ |
| `test.js` | Testing | Cross-platform | Script testing utility | ✅ Working | scripts/ |
| `validate-scripts.sh` | Validation | macOS/Linux | Script integrity checker | ✅ Working | scripts/ |

## 🗂️ Scripts by Category

### 🚀 Launch Scripts (Root Level)

#### `start.sh`
**Purpose**: Simplest way to launch the application locally.

**Usage**:
```bash
./start.sh
```

**What it does**:
- Calls `launch-local.sh` automatically
- No parameters needed
- Perfect for daily development

**Dependencies**: None (calls launch-local.sh)

**Platform**: macOS, Linux

---

#### `start.bat`
**Purpose**: Windows equivalent of start.sh.

**Usage**:
```cmd
start.bat
```

**What it does**:
- Calls `launch-local.ps1` automatically
- Handles PowerShell execution policy
- Windows-optimized

**Dependencies**: PowerShell

**Platform**: Windows

---

#### `launch-local.sh`
**Purpose**: Full-featured local development launcher with monitoring.

**Usage**:
```bash
./launch-local.sh
```

**What it does**:
- Checks prerequisites (Node.js, npm, ports)
- Installs dependencies if needed
- Launches backend (port 8787)
- Launches frontend (port 5173)
- Monitors service health
- Saves logs to `logs/` directory
- Handles graceful shutdown

**Dependencies**:
- Node.js 18+
- npm
- lsof (for port checking)

**Platform**: macOS, Linux

**Exit Codes**:
- `0`: Success
- `1`: Prerequisites missing or service failed

---

#### `launch-local.ps1`
**Purpose**: PowerShell version of launch-local.sh for Windows.

**Usage**:
```powershell
.\launch-local.ps1
```

**What it does**:
- Same features as launch-local.sh
- Windows-specific port checking
- PowerShell job management
- Colored console output

**Dependencies**:
- Node.js 18+
- npm
- PowerShell 5.1+

**Platform**: Windows

---

### 📦 Deployment Scripts (Root Level)

#### `deploy.sh`
**Purpose**: Deploy application to production environment.

**Usage**:
```bash
./deploy.sh [environment]

# Examples:
./deploy.sh prod        # Deploy to production
./deploy.sh staging     # Deploy to staging
```

**What it does**:
- Builds frontend for production
- Deploys backend to Cloudflare Workers
- Deploys frontend to Cloudflare Pages
- Validates deployment
- Provides deployment URLs

**Dependencies**:
- Node.js 18+
- npm
- wrangler CLI
- Cloudflare account configured

**Platform**: macOS, Linux

**Environment Variables Required**:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

---

### 🤖 Model Automation Scripts (scripts/)

#### `add-model.sh` ⭐ NEW
**Purpose**: Interactive generator for creating new data models (Bash version).

**Status**: ✅ **Production Ready** - Complete, functional implementation

**Usage**:
```bash
cd scripts
./add-model.sh
```

**What it does**:
- Interactive CLI prompts with colored output
- Generates complete, working database migration SQL
- Creates fully functional backend API handler with validation
- Creates complete frontend components (List, Form) with all features
- Generates comprehensive CSS styles
- Updates routing automatically
- Provides clear next steps

**Dependencies**:
- bash
- Standard Unix utilities (sed, awk, date)

**Platform**: macOS, Linux

**Generated Files**:
- `backend/src/handlers/{model}.js` - Complete CRUD handler
- `database/migrations/{timestamp}_create_{model}.sql` - Full migration
- `frontend/src/components/{model}/{Model}List.jsx` - Working list component
- `frontend/src/components/{model}/{Model}Form.jsx` - Complete form component
- `frontend/src/components/{model}/{model}.css` - Full styling

**Key Features**:
- ✅ All code generation methods implemented (not stubs)
- ✅ Generates production-ready, working code
- ✅ Complete CRUD functionality
- ✅ Input validation and error handling
- ✅ Colored terminal output
- ✅ No external dependencies (pure bash)

**See Also**: 
- [docs/09-scripts/add-model-bash.md](../docs/09-scripts/add-model-bash.md)
- [docs/02-development/adding-models.md](../docs/02-development/adding-models.md)

---

#### `add-model.js` ⚠️ DEPRECATED
**Purpose**: Interactive generator for creating new data models (JavaScript version).

**Status**: ❌ **NON-FUNCTIONAL** - Incomplete implementation (30% complete)

**Issues**:
- All code generation methods are stubs returning placeholder comments
- Generated files are non-functional skeletons
- Missing implementation for all critical features
- See `ADD_MODEL_ISSUES.md` for detailed analysis

**Recommendation**: **Use `add-model.sh` instead**

**See Also**: 
- [ADD_MODEL_ISSUES.md](../ADD_MODEL_ISSUES.md) - Detailed issue analysis
- [docs/09-scripts/add-model-bash.md](../docs/09-scripts/add-model-bash.md) - Working alternative

---

#### `modify-model.js`
**Purpose**: Interactive tool for modifying existing models.

**Usage**:
```bash
cd scripts
./modify-model.js
```

**What it does**:
- Add new fields to existing models
- Remove fields safely
- Modify field properties
- Add relationships
- Create custom endpoints
- Generate migration SQL

**Dependencies**:
- Node.js 18+
- npm packages: inquirer, chalk, fs-extra

**Platform**: Cross-platform (Node.js)

**Operations Supported**:
- Add field(s)
- Remove field(s)
- Modify field properties
- Add foreign key relationship
- Add many-to-many relationship
- Add custom endpoint

**See Also**: [docs/02-development/modifying-models.md](../docs/02-development/modifying-models.md)

---

### ⚙️ Setup Scripts (scripts/)

#### `setup-project.sh`
**Purpose**: Complete project setup from scratch.

**Usage**:
```bash
./scripts/setup-project.sh
```

**What it does**:
- Checks prerequisites
- Installs frontend dependencies
- Installs backend dependencies
- Creates environment files from templates
- Prompts for Supabase credentials
- Creates wrangler.toml
- Validates configuration

**Dependencies**:
- Node.js 18+
- npm
- Git

**Platform**: macOS, Linux

**Interactive Prompts**:
- Supabase URL
- Supabase Anon Key
- Supabase Service Role Key
- Environment selection (dev/prod)

---

#### `setup-supabase.sh`
**Purpose**: Configure Supabase connection and database.

**Usage**:
```bash
./scripts/setup-supabase.sh
```

**What it does**:
- Validates Supabase credentials
- Tests database connection
- Optionally runs schema migrations
- Creates environment variables
- Verifies RLS policies

**Dependencies**:
- curl
- jq (for JSON parsing)
- Supabase account

**Platform**: macOS, Linux

**Environment Variables Set**:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

#### `setup-cloudflare.sh`
**Purpose**: Configure Cloudflare Workers and Pages.

**Usage**:
```bash
./scripts/setup-cloudflare.sh
```

**What it does**:
- Validates Cloudflare credentials
- Creates wrangler.toml
- Sets up Workers secrets
- Configures Pages project
- Tests deployment

**Dependencies**:
- wrangler CLI
- Cloudflare account

**Platform**: macOS, Linux

**Cloudflare Resources Created**:
- Workers project
- Pages project
- KV namespaces (if needed)

---

#### `install.sh`
**Purpose**: Install all project dependencies.

**Usage**:
```bash
./scripts/install.sh
```

**What it does**:
- Installs frontend dependencies
- Installs backend dependencies
- Installs script dependencies
- Verifies installations
- Reports any issues

**Dependencies**:
- Node.js 18+
- npm

**Platform**: macOS, Linux

**Installs**:
- Frontend: React, Vite, etc.
- Backend: Cloudflare Workers, Supabase
- Scripts: Inquirer, Chalk, etc.

---

#### `quick-start.sh`
**Purpose**: Fastest way to get started (setup + launch).

**Usage**:
```bash
./scripts/quick-start.sh
```

**What it does**:
- Runs prerequisite checks
- Installs dependencies
- Checks environment configuration
- Optionally runs setup-project.sh
- Provides next steps

**Dependencies**:
- Node.js 18+
- npm

**Platform**: macOS, Linux

**Note**: Does not launch services, only prepares environment.

---

### 🧹 Utility Scripts (scripts/)

#### `cleanup.sh`
**Purpose**: Clean build artifacts and temporary files.

**Usage**:
```bash
./scripts/cleanup.sh [options]

# Options:
./scripts/cleanup.sh --all        # Clean everything
./scripts/cleanup.sh --frontend   # Clean frontend only
./scripts/cleanup.sh --backend    # Clean backend only
./scripts/cleanup.sh --logs       # Clean logs only
```

**What it does**:
- Removes build directories (dist, dist-dev)
- Cleans node_modules/.cache
- Removes log files
- Cleans wrangler cache
- Removes temporary files

**Dependencies**: None

**Platform**: macOS, Linux

**Disk Space Saved**: Typically 100-500MB

---

#### `test.js`
**Purpose**: Test script functionality and templates.

**Usage**:
```bash
cd scripts
node test.js [test-name]

# Examples:
node test.js              # Run all tests
node test.js templates    # Test templates only
node test.js validation   # Test validation only
```

**What it does**:
- Tests template rendering
- Validates script syntax
- Checks file generation
- Verifies dependencies
- Reports test results

**Dependencies**:
- Node.js 18+
- npm packages: jest (optional)

**Platform**: Cross-platform (Node.js)

---

#### `validate-scripts.sh`
**Purpose**: Validate script integrity and dependencies.

**Usage**:
```bash
./scripts/validate-scripts.sh
```

**What it does**:
- Checks script executability
- Verifies shebang lines
- Validates dependencies
- Checks for common issues
- Reports validation results

**Dependencies**:
- bash
- shellcheck (optional, for enhanced validation)

**Platform**: macOS, Linux

**Exit Codes**:
- `0`: All scripts valid
- `1`: Validation errors found

---

## 🔄 Common Workflows

### First-Time Setup
```bash
# 1. Clone repository
git clone https://github.com/adeline-t/equestrian-project.git
cd equestrian-project

# 2. Run setup
./scripts/setup-project.sh

# 3. Launch application
./start.sh
```

### Daily Development
```bash
# Launch app
./start.sh

# Make changes (hot reload enabled)
# ...

# Stop app (Ctrl+C)
```

### Adding a New Model
```bash
# 1. Generate model (use new bash version)
cd scripts
./add-model.sh

# 2. Apply database migration
# (Run SQL in Supabase dashboard)

# 3. Test locally
cd ..
./start.sh

# 4. Deploy
./deploy.sh staging
```

### Cleaning Up
```bash
# Clean everything
./scripts/cleanup.sh --all

# Reinstall dependencies
./scripts/install.sh

# Launch
./start.sh
```

### Deployment
```bash
# 1. Test locally
./start.sh

# 2. Run tests
cd scripts
node test.js

# 3. Deploy to staging
cd ..
./deploy.sh staging

# 4. Verify staging
# (Test at staging URL)

# 5. Deploy to production
./deploy.sh prod
```

## 🔧 Script Dependencies

### System Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: 2.0.0 or higher

### Optional Tools
- **wrangler**: For Cloudflare deployments
- **jq**: For JSON parsing in shell scripts
- **shellcheck**: For script validation
- **lsof**: For port checking (usually pre-installed)

### Installing Dependencies

**macOS**:
```bash
# Using Homebrew
brew install node git jq shellcheck

# Install wrangler
npm install -g wrangler
```

**Linux (Ubuntu/Debian)**:
```bash
# System packages
sudo apt-get update
sudo apt-get install nodejs npm git jq shellcheck

# Install wrangler
npm install -g wrangler
```

## 📝 Script Development Guidelines

### Creating New Scripts

1. **Choose appropriate location**:
   - Root level: Launch and deployment scripts
   - scripts/: Development and utility scripts

2. **Follow naming conventions**:
   - Use kebab-case: `my-script.sh`
   - Be descriptive: `setup-database.sh` not `setup.sh`
   - Include extension: `.sh`, `.js`, `.ps1`

3. **Add proper headers**:
```bash
#!/bin/bash
# Script Name
# Brief description of what the script does
# Usage: ./script-name.sh [options]
```

4. **Make executable**:
```bash
chmod +x script-name.sh
```

5. **Update this catalog**:
   - Add entry to Quick Reference Table
   - Add detailed section
   - Update `.scripts-index.json`

6. **Document in code**:
   - Add comments for complex logic
   - Document parameters
   - Include usage examples

### Testing Scripts

```bash
# Validate syntax
bash -n script-name.sh

# Run validation
./scripts/validate-scripts.sh

# Test functionality
./scripts/test.js
```

## 🐛 Troubleshooting

### Script Won't Execute

**Error**: `Permission denied`

**Solution**:
```bash
chmod +x script-name.sh
```

---

**Error**: `command not found`

**Solution**: Ensure script is executable and in correct directory
```bash
# From project root
./start.sh          # Correct
start.sh            # Wrong (unless in PATH)
```

---

### Dependencies Missing

**Error**: `Node.js not found`

**Solution**:
```bash
# macOS
brew install node

# Linux
sudo apt-get install nodejs npm
```

---

### Port Already in Use

**Error**: `Port 5173 already in use`

**Solution**: Launch scripts will offer to kill the process automatically, or:
```bash
# macOS/Linux
lsof -ti:5173 | xargs kill -9
lsof -ti:8787 | xargs kill -9
```

---

### Environment Not Configured

**Error**: `Environment file not found`

**Solution**:
```bash
./scripts/setup-project.sh
```

## 📚 Additional Resources

- **Detailed Documentation**: [docs/09-scripts/](../docs/09-scripts/)
- **Model Automation**: [scripts/README.md](./README.md)
- **Development Guide**: [docs/02-development/](../docs/02-development/)
- **Deployment Guide**: [docs/03-deployment/](../docs/03-deployment/)

## 🔄 Keeping This Catalog Updated

When adding new scripts:
1. Update Quick Reference Table
2. Add detailed section
3. Update `.scripts-index.json`
4. Update relevant documentation
5. Run validation: `./scripts/validate-scripts.sh`

---

**Last Updated**: December 2024  
**Maintained by**: Equestrian Project Team