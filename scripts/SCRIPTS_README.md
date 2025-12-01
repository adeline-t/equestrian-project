# Scripts Documentation

This directory contains automation and setup scripts for the Equestrian Management Project.

## 📋 Available Scripts

### Quick Start Scripts

#### `quick-start.sh`
**Purpose:** Get the project running quickly with minimal configuration.

**Usage:**
```bash
./scripts/quick-start.sh
```

**What it does:**
- Checks for Node.js and npm
- Installs all dependencies (frontend, backend, scripts)
- Checks for environment configuration
- Provides next steps for development

**When to use:** First time setting up the project or after cloning the repository.

---

#### `setup-project.sh`
**Purpose:** Complete project setup including environment files and dependencies.

**Usage:**
```bash
./scripts/setup-project.sh
```

**What it does:**
- Creates environment files from templates
- Installs all project dependencies
- Verifies configuration
- Provides detailed next steps

**When to use:** Initial project setup or when resetting the project.

---

### Service Setup Scripts

#### `setup-supabase.sh`
**Purpose:** Interactive guide for setting up Supabase database.

**Usage:**
```bash
./scripts/setup-supabase.sh
```

**What it does:**
- Guides you through creating a Supabase project
- Collects and configures Supabase credentials
- Updates environment files automatically
- Provides SQL schema setup instructions

**When to use:** When setting up a new Supabase project for development or production.

---

#### `setup-cloudflare.sh`
**Purpose:** Interactive guide for deploying to Cloudflare Workers.

**Usage:**
```bash
./scripts/setup-cloudflare.sh
```

**What it does:**
- Checks for Wrangler CLI installation
- Guides through Cloudflare authentication
- Helps configure wrangler.toml
- Provides deployment instructions
- Explains custom domain setup

**When to use:** When deploying the backend to Cloudflare Workers.

---

### Development Scripts

#### `install.sh`
**Purpose:** Install automation tools for model management.

**Usage:**
```bash
cd scripts
./install.sh
```

**What it does:**
- Installs script dependencies
- Makes automation scripts executable
- Creates test configuration
- Verifies installation

**When to use:** When setting up the model automation tools.

---

#### `cleanup.sh`
**Purpose:** Clean up build artifacts and temporary files.

**Usage:**
```bash
./scripts/cleanup.sh
```

**What it does:**
- Removes node_modules directories
- Cleans build outputs
- Removes temporary files
- Resets the project to a clean state

**When to use:** When you need to reset the project or free up disk space.

---

### Model Automation Scripts

#### `add-model.js`
**Purpose:** Automatically generate a new model with all necessary files.

**Usage:**
```bash
cd scripts
./add-model.js
```

**What it does:**
- Interactive prompts for model details
- Generates backend handler
- Generates frontend components
- Creates API routes
- Updates documentation

**When to use:** When adding a new data model to the project.

---

#### `modify-model.js`
**Purpose:** Modify existing models with new fields or changes.

**Usage:**
```bash
cd scripts
./modify-model.js
```

**What it does:**
- Lists existing models
- Allows adding/removing fields
- Updates all related files
- Maintains consistency across codebase

**When to use:** When updating an existing model's structure.

---

#### `test.js`
**Purpose:** Test the automation scripts.

**Usage:**
```bash
cd scripts
npm test
```

**What it does:**
- Runs automated tests
- Verifies script functionality
- Checks template integrity

**When to use:** After modifying automation scripts or templates.

---

## 🚀 Common Workflows

### First Time Setup
```bash
# 1. Quick start
./scripts/quick-start.sh

# 2. Set up Supabase
./scripts/setup-supabase.sh

# 3. Start development
cd frontend && npm run dev
# In another terminal:
cd backend && npm run dev
```

### Adding a New Model
```bash
# 1. Install automation tools (if not done)
cd scripts && ./install.sh

# 2. Add the model
./add-model.js

# 3. Test the new model
cd .. && npm test
```

### Deploying to Production
```bash
# 1. Set up Cloudflare Workers
./scripts/setup-cloudflare.sh

# 2. Deploy backend
cd backend && npm run deploy

# 3. Build and deploy frontend
cd ../frontend && npm run build && npm run deploy
```

### Cleaning Up
```bash
# Remove all build artifacts and dependencies
./scripts/cleanup.sh

# Then reinstall
./scripts/quick-start.sh
```

---

## 🛠️ Script Maintenance

### Making Scripts Executable
If a script isn't executable, run:
```bash
chmod +x scripts/script-name.sh
```

### Updating Scripts
When modifying scripts:
1. Test thoroughly in a development environment
2. Update this documentation
3. Commit changes with clear messages
4. Update version numbers if applicable

### Adding New Scripts
When adding new scripts:
1. Follow the naming convention (kebab-case)
2. Add a shebang line (`#!/bin/bash`)
3. Include error handling (`set -e`)
4. Add colored output for better UX
5. Document in this README
6. Make executable with `chmod +x`

---

## 📝 Script Templates

### Basic Bash Script Template
```bash
#!/bin/bash

# Script Name and Description
# Purpose: What this script does

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Main script logic here
echo "Starting script..."

# Your code here

print_success "Script completed!"
```

---

## 🐛 Troubleshooting

### Script Won't Run
- Check if it's executable: `ls -l scripts/`
- Make it executable: `chmod +x scripts/script-name.sh`
- Check for correct shebang: `#!/bin/bash`

### Permission Denied
```bash
chmod +x scripts/*.sh
```

### Dependencies Not Found
```bash
# Reinstall dependencies
./scripts/quick-start.sh
```

### Environment Variables Not Set
```bash
# Reconfigure environment
./scripts/setup-project.sh
```

---

## 📚 Additional Resources

- [Project Documentation](../docs/)
- [Backend Documentation](../backend/README.md)
- [Frontend Documentation](../frontend/README.md)
- [Deployment Guide](../docs/deployment/)

---

## 🤝 Contributing

When contributing new scripts:
1. Follow existing patterns and conventions
2. Add comprehensive error handling
3. Include user-friendly output
4. Document thoroughly
5. Test on multiple platforms (macOS, Linux)
6. Update this README

---

**Last Updated:** December 2024
**Maintained By:** Equestrian Project Team