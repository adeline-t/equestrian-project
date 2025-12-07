# 📚 Scripts Catalog

> **Central inventory of all project scripts with descriptions, usage, and dependencies.**

This catalog provides a quick reference for all scripts in the Equestrian Project. For detailed documentation, see [docs/09-scripts/](../docs/09-scripts/).

## 🗂️ New Organization Structure

As of version 2.0.0, scripts are organized into subdirectories for better maintainability:

```
scripts/
├── setup/              # First-time configuration and installation
├── automation/         # Code generation and model management
├── utils/             # Maintenance, testing, and validation
├── deprecated/        # Archived non-functional or replaced scripts
├── config/            # Configuration files
├── templates/         # Code generation templates
└── examples/          # Example scripts
```

**Convenience Symlinks**: All scripts have symlinks in the root `scripts/` directory for backward compatibility.

## 📊 Quick Reference Table

| Script | Category | Location | Status | Purpose |
|--------|----------|----------|--------|---------|
| `add-model.sh` | Automation | automation/ | ⭐ NEW | Complete model generator |
| `add-field.sh` | Automation | automation/ | ⭐ NEW | Add field to existing model |
| `test.sh` | Testing | utils/ | ⭐ NEW | Comprehensive test suite |
| `setup-project.sh` | Setup | setup/ | ✅ Working | Complete project setup |
| `setup-supabase.sh` | Setup | setup/ | ✅ Working | Supabase configuration |
| `setup-cloudflare.sh` | Setup | setup/ | ✅ Working | Cloudflare configuration |
| `install.sh` | Setup | setup/ | ✅ Working | Dependency installation |
| `quick-start.sh` | Setup | setup/ | ✅ Working | Quick setup |
| `cleanup.sh` | Utility | utils/ | ✅ Working | Clean build artifacts |
| `validate-scripts.sh` | Validation | utils/ | ✅ Working | Script integrity checker |
| `add-model.js` | Automation | deprecated/ | ❌ Deprecated | Non-functional JS version |
| `modify-model.js` | Automation | deprecated/ | ❌ Deprecated | Partially functional |
| `test.js` | Testing | deprecated/ | ❌ Deprecated | Outdated JS version |

## 🗂️ Scripts by Category

### 🤖 Automation Scripts (automation/)

#### `add-model.sh` ⭐ NEW
**Purpose**: Complete, production-ready model generator

**Usage**:
```bash
cd scripts
./add-model.sh
# or
cd scripts/automation
./add-model.sh
```

**What it does**:
- Interactive CLI with colored output
- Generates complete, working backend handler
- Creates full database migration with indexes
- Generates working frontend components (List, Form)
- Creates comprehensive CSS styles
- Updates API service and routing automatically
- Provides clear next steps

**Features**:
- ✅ 100% functional (not stubs)
- ✅ No dependencies (pure bash)
- ✅ Production-ready output
- ✅ All field types supported
- ✅ Complete CRUD operations
- ✅ Input validation
- ✅ Error handling

**Dependencies**: bash, sed, awk, date

**Platform**: macOS, Linux

**See Also**: [docs/09-scripts/add-model-bash.md](../docs/09-scripts/add-model-bash.md)

---

#### `add-field.sh` ⭐ NEW
**Purpose**: Simple helper to add a field to existing model

**Usage**:
```bash
cd scripts
./add-field.sh
# or
cd scripts/automation
./add-field.sh
```

**What it does**:
- Select existing model interactively
- Gather field information
- Generate database migration
- Provide code snippets for handler updates
- Provide code snippets for frontend updates
- Step-by-step guidance

**Features**:
- ✅ Migration generation
- ✅ Code snippets with proper formatting
- ✅ Colored output
- ✅ Clear instructions
- ✅ All field types supported

**Dependencies**: bash, sed, awk, date

**Platform**: macOS, Linux

---

### ⚙️ Setup Scripts (setup/)

#### `setup-project.sh`
**Purpose**: Complete project setup from scratch

**Usage**:
```bash
./scripts/setup-project.sh
# or
cd scripts/setup
./setup-project.sh
```

**What it does**:
- Checks prerequisites
- Installs frontend dependencies
- Installs backend dependencies
- Creates environment files
- Prompts for Supabase credentials
- Creates wrangler.toml
- Validates configuration

**Dependencies**: Node.js 18+, npm, Git

**Platform**: macOS, Linux

---

#### `setup-supabase.sh`
**Purpose**: Configure Supabase connection

**Usage**:
```bash
./scripts/setup-supabase.sh
# or
cd scripts/setup
./setup-supabase.sh
```

**What it does**:
- Validates Supabase credentials
- Tests database connection
- Optionally runs schema migrations
- Creates environment variables
- Verifies RLS policies

**Dependencies**: curl, jq

**Platform**: macOS, Linux

---

#### `setup-cloudflare.sh`
**Purpose**: Configure Cloudflare Workers and Pages

**Usage**:
```bash
./scripts/setup-cloudflare.sh
# or
cd scripts/setup
./setup-cloudflare.sh
```

**What it does**:
- Validates Cloudflare credentials
- Creates wrangler.toml
- Sets up Workers secrets
- Configures Pages project
- Tests deployment

**Dependencies**: wrangler CLI

**Platform**: macOS, Linux

---

#### `install.sh`
**Purpose**: Install all project dependencies

**Usage**:
```bash
./scripts/install.sh
# or
cd scripts/setup
./install.sh
```

**What it does**:
- Installs frontend dependencies
- Installs backend dependencies
- Installs script dependencies
- Verifies installations
- Reports any issues

**Dependencies**: Node.js 18+, npm

**Platform**: macOS, Linux

---

#### `quick-start.sh`
**Purpose**: Quick setup and preparation

**Usage**:
```bash
./scripts/quick-start.sh
# or
cd scripts/setup
./quick-start.sh
```

**What it does**:
- Runs prerequisite checks
- Installs dependencies
- Checks environment configuration
- Optionally runs setup-project.sh
- Provides next steps

**Dependencies**: Node.js 18+, npm

**Platform**: macOS, Linux

---

### 🛠️ Utility Scripts (utils/)

#### `test.sh` ⭐ NEW
**Purpose**: Comprehensive script testing suite

**Usage**:
```bash
cd scripts
./test.sh [test-name]
# or
cd scripts/utils
./test.sh [test-name]

# Run specific test
./test.sh syntax
./test.sh dependencies
```

**What it does**:
- Tests script executability
- Validates shebang lines
- Checks script syntax
- Verifies dependencies
- Tests configuration files
- Validates templates
- Checks documentation
- Tests project structure
- Validates add-model.sh functionality
- Checks deprecated scripts
- Tests git integration
- Validates catalog consistency

**Available Tests**:
- `executability` - Test script permissions
- `shebangs` - Test shebang lines
- `syntax` - Test script syntax
- `dependencies` - Test system dependencies
- `config` - Test configuration files
- `templates` - Test template files
- `documentation` - Test documentation
- `structure` - Test project structure
- `add-model` - Test add-model.sh
- `deprecated` - Test deprecated scripts
- `git` - Test git integration
- `catalog` - Test catalog consistency

**Features**:
- ✅ Colored output
- ✅ Detailed test results
- ✅ Pass/fail statistics
- ✅ Individual test selection
- ✅ CI/CD friendly exit codes

**Dependencies**: bash, optional: jq

**Platform**: macOS, Linux

---

#### `cleanup.sh`
**Purpose**: Clean build artifacts and temporary files

**Usage**:
```bash
./scripts/cleanup.sh [options]
# or
cd scripts/utils
./cleanup.sh [options]

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

#### `validate-scripts.sh`
**Purpose**: Validate script integrity

**Usage**:
```bash
./scripts/validate-scripts.sh
# or
cd scripts/utils
./validate-scripts.sh
```

**What it does**:
- Checks script executability
- Verifies shebang lines
- Validates dependencies
- Checks for common issues
- Reports validation results

**Dependencies**: bash, optional: shellcheck

**Platform**: macOS, Linux

---

### ⚠️ Deprecated Scripts (deprecated/)

See [deprecated/README.md](deprecated/README.md) for details on deprecated scripts.

**Do not use these scripts**. They are kept for reference only.

- `add-model.js` - Non-functional (30% complete) → Use `automation/add-model.sh`
- `modify-model.js` - Partially functional → Use `automation/add-field.sh`
- `test.js` - Outdated → Use `utils/test.sh`

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

### Adding a Field to Existing Model
```bash
# 1. Run helper script
cd scripts
./add-field.sh

# 2. Follow the instructions provided
# 3. Apply migration
# 4. Update handler and frontend as guided
# 5. Test
```

### Testing Scripts
```bash
# Run all tests
cd scripts
./test.sh

# Run specific test
./test.sh syntax
./test.sh dependencies
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

---

## 🔧 Script Dependencies

### System Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: 2.0.0 or higher
- **Bash**: 4.0 or higher

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

---

## 📝 Script Development Guidelines

### Creating New Scripts

1. **Choose appropriate location**:
   - `setup/`: First-time configuration
   - `automation/`: Code generation
   - `utils/`: Maintenance and testing

2. **Follow naming conventions**:
   - Use kebab-case: `my-script.sh`
   - Be descriptive: `setup-database.sh` not `setup.sh`
   - Include extension: `.sh`

3. **Add proper headers**:
```bash
#!/bin/bash
# Script Name
# Brief description of what the script does
# Usage: ./script-name.sh [options]

set -e  # Exit on error
```

4. **Make executable**:
```bash
chmod +x script-name.sh
```

5. **Create symlink in root**:
```bash
cd scripts
ln -sf category/script-name.sh script-name.sh
```

6. **Update documentation**:
   - Add entry to this catalog
   - Update `.scripts-index.json`
   - Add detailed docs if needed

---

## 🐛 Troubleshooting

### Script Won't Execute

**Error**: `Permission denied`

**Solution**:
```bash
chmod +x scripts/script-name.sh
```

---

**Error**: `command not found`

**Solution**: Ensure script is executable and in correct directory
```bash
# From project root
./scripts/script-name.sh          # Correct
scripts/script-name.sh             # Wrong (unless in PATH)
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

---

## 📚 Additional Resources

- **Detailed Documentation**: [docs/09-scripts/](../docs/09-scripts/)
- **Model Automation**: [docs/09-scripts/add-model-bash.md](../docs/09-scripts/add-model-bash.md)
- **Development Guide**: [docs/02-development/](../docs/02-development/)
- **Deployment Guide**: [docs/03-deployment/](../docs/03-deployment/)

---

## 🔄 Keeping This Catalog Updated

When adding new scripts:
1. Add script to appropriate directory
2. Create symlink in root scripts/
3. Update this catalog
4. Update `.scripts-index.json`
5. Add detailed documentation if needed
6. Run validation: `./scripts/validate-scripts.sh`
7. Run tests: `./scripts/test.sh`

---

## 📊 Version History

### Version 2.0.0 (December 2024)
- **Major reorganization**: Scripts moved to subdirectories
- **New scripts**: test.sh, add-field.sh
- **Deprecated**: add-model.js, modify-model.js, test.js
- **Improved**: Better organization, clearer structure
- **Added**: Convenience symlinks for backward compatibility

### Version 1.1.0 (December 2024)
- **New**: add-model.sh (complete bash implementation)
- **Deprecated**: add-model.js (non-functional)
- **Updated**: Documentation and references

### Version 1.0.0 (Initial)
- Initial script collection
- Basic automation tools
- Setup and utility scripts

---

**Last Updated**: December 2024  
**Version**: 2.0.0  
**Maintained by**: Equestrian Project Team