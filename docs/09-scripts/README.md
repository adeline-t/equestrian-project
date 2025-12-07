# 📜 Scripts Documentation

> **Complete guide to the Equestrian Project's script ecosystem.**

This section documents all scripts in the project, their purposes, and how to use them effectively.

## 📚 What's in This Section

### [Script Reference](./script-reference.md)
Detailed documentation for each script including:
- Complete parameter documentation
- Exit codes and error handling
- Advanced usage examples
- Troubleshooting tips

## 🎯 Quick Navigation

### By Task

**Getting Started**:
- [Launch the app](../../QUICK_LAUNCH.md) → Use `./start.sh`
- [First-time setup](../01-getting-started/installation.md) → Use `./scripts/setup-project.sh`
- [Quick start](../01-getting-started/quick-start.md) → Use `./scripts/quick-start.sh`

**Development**:
- [Add new model](../02-development/adding-models.md) → Use `./scripts/add-model.js`
- [Modify model](../02-development/modifying-models.md) → Use `./scripts/modify-model.js`
- [Clean build artifacts](./script-reference.md#cleanup) → Use `./scripts/cleanup.sh`

**Deployment**:
- [Deploy to production](../03-deployment/deployment-guide.md) → Use `./deploy.sh`
- [Setup Cloudflare](./script-reference.md#setup-cloudflare) → Use `./scripts/setup-cloudflare.sh`

**Maintenance**:
- [Validate scripts](./script-reference.md#validate-scripts) → Use `./scripts/validate-scripts.sh`
- [Run tests](./script-reference.md#test) → Use `./scripts/test.js`

### By Category

| Category | Scripts | Purpose |
|----------|---------|---------|
| **Launch** | `start.sh`, `launch-local.sh` | Start the application locally |
| **Deployment** | `deploy.sh` | Deploy to production |
| **Automation** | `add-model.js`, `modify-model.js` | Generate and modify models |
| **Setup** | `setup-*.sh`, `install.sh` | Initial project configuration |
| **Utility** | `cleanup.sh`, `test.js` | Maintenance and testing |
| **Validation** | `validate-scripts.sh` | Script integrity checking |

## 📖 Script Catalog

For a complete inventory of all scripts, see:
- **[Scripts Catalog](../../scripts/SCRIPTS_CATALOG.md)** - Quick reference with usage examples
- **[Script Reference](./script-reference.md)** - Detailed documentation

## 🎨 Script Organization

### Root Level Scripts
Scripts at the project root are for **frequent daily use**:

```
equestrian-project/
├── start.sh              # Launch app (most used)
├── start.bat             # Launch app (Windows)
├── launch-local.sh       # Full launcher with monitoring
├── launch-local.ps1      # PowerShell launcher
└── deploy.sh             # Deploy to production
```

**Why at root?**
- Maximum discoverability
- Shortest path to execute
- Follows common project conventions
- Easy to remember

### Scripts Directory
Scripts in `scripts/` are for **development and setup**:

```
scripts/
├── add-model.js          # Model generator
├── modify-model.js       # Model modifier
├── setup-project.sh      # Complete setup
├── setup-supabase.sh     # Supabase config
├── setup-cloudflare.sh   # Cloudflare config
├── install.sh            # Install dependencies
├── quick-start.sh        # Quick setup
├── cleanup.sh            # Clean artifacts
├── test.js               # Test scripts
└── validate-scripts.sh   # Validate integrity
```

**Why in scripts/?**
- Used less frequently
- Development-focused
- Keeps root clean
- Logical grouping

## 🔧 Script Development

### Creating New Scripts

When adding a new script:

1. **Choose location**:
   - Root: Frequent use (launch, deploy)
   - scripts/: Development use (setup, utilities)

2. **Follow conventions**:
   ```bash
   #!/bin/bash
   # Script Name
   # Brief description
   # Usage: ./script-name.sh [options]
   
   set -e  # Exit on error
   ```

3. **Make executable**:
   ```bash
   chmod +x script-name.sh
   ```

4. **Update documentation**:
   - Add to [Scripts Catalog](../../scripts/SCRIPTS_CATALOG.md)
   - Update [Script Reference](./script-reference.md)
   - Update `.scripts-index.json`

5. **Test thoroughly**:
   ```bash
   ./scripts/validate-scripts.sh
   ./scripts/test.js
   ```

### Script Standards

**Naming**:
- Use kebab-case: `setup-database.sh`
- Be descriptive: `setup-supabase.sh` not `setup.sh`
- Include extension: `.sh`, `.js`, `.ps1`

**Headers**:
```bash
#!/bin/bash
# Script Name
# Description of what the script does
# Usage: ./script-name.sh [options]
# Exit codes: 0=success, 1=error
```

**Error Handling**:
```bash
set -e  # Exit on error
set -u  # Exit on undefined variable
set -o pipefail  # Exit on pipe failure
```

**Output**:
```bash
# Use colors for clarity
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}✓ Success${NC}"
echo -e "${RED}✗ Error${NC}"
```

## 🔄 Common Workflows

### Daily Development
```bash
# 1. Launch app
./start.sh

# 2. Make changes (hot reload enabled)

# 3. Stop app (Ctrl+C)
```

### Adding a Feature
```bash
# 1. Create new model
cd scripts
./add-model.js

# 2. Apply database migration
# (Run SQL in Supabase dashboard)

# 3. Test locally
cd ..
./start.sh

# 4. Deploy
./deploy.sh staging
```

### Maintenance
```bash
# Clean build artifacts
./scripts/cleanup.sh --all

# Reinstall dependencies
./scripts/install.sh

# Validate scripts
./scripts/validate-scripts.sh

# Run tests
cd scripts
node test.js
```

## 🐛 Troubleshooting

### Script Won't Execute

**Issue**: Permission denied

**Solution**:
```bash
chmod +x script-name.sh
```

---

**Issue**: Command not found

**Solution**: Use correct path
```bash
./start.sh          # Correct (from project root)
start.sh            # Wrong (unless in PATH)
```

### Dependencies Missing

**Issue**: Node.js not found

**Solution**:
```bash
# macOS
brew install node

# Linux
sudo apt-get install nodejs npm
```

### Port Conflicts

**Issue**: Port already in use

**Solution**: Launch scripts handle this automatically, or:
```bash
# macOS/Linux
lsof -ti:5173 | xargs kill -9
lsof -ti:8787 | xargs kill -9
```

## 📊 Script Dependencies

### System Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: 2.0.0 or higher

### Optional Tools
- **wrangler**: For Cloudflare deployments
- **jq**: For JSON parsing
- **shellcheck**: For script validation

### Installing on macOS
```bash
# Using Homebrew
brew install node git jq shellcheck

# Install wrangler
npm install -g wrangler
```

## 🎯 Best Practices

### When to Use Scripts

**Use scripts for**:
- ✅ Repetitive tasks
- ✅ Complex multi-step processes
- ✅ Environment setup
- ✅ Deployment procedures
- ✅ Code generation

**Don't use scripts for**:
- ❌ One-time manual tasks
- ❌ Simple single commands
- ❌ Tasks requiring human judgment
- ❌ Highly variable processes

### Script Maintenance

**Regular tasks**:
1. Run validation: `./scripts/validate-scripts.sh`
2. Update documentation when scripts change
3. Test scripts after Node.js updates
4. Review and remove unused scripts
5. Keep dependencies up to date

**Version control**:
- Commit scripts with descriptive messages
- Document breaking changes
- Tag releases that change scripts
- Maintain changelog for script updates

## 📚 Additional Resources

### Internal Documentation
- [Scripts Catalog](../../scripts/SCRIPTS_CATALOG.md) - Complete script inventory
- [Script Reference](./script-reference.md) - Detailed documentation
- [Model Automation](../../scripts/README.md) - Model script specifics
- [Quick Launch](../../QUICK_LAUNCH.md) - Quick reference card

### External Resources
- [Bash Scripting Guide](https://www.gnu.org/software/bash/manual/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [ShellCheck](https://www.shellcheck.net/) - Script analysis tool

## 🆘 Getting Help

### For Script Issues

1. **Check the catalog**: [Scripts Catalog](../../scripts/SCRIPTS_CATALOG.md)
2. **Read detailed docs**: [Script Reference](./script-reference.md)
3. **Run validation**: `./scripts/validate-scripts.sh`
4. **Check logs**: Look in `logs/` directory
5. **Ask for help**: Create an issue on GitHub

### Reporting Script Bugs

When reporting issues, include:
- Script name and version
- Command executed
- Error message
- System information (`uname -a`)
- Node.js version (`node --version`)

## 🔄 Keeping Scripts Updated

### Check for Updates
```bash
# Pull latest changes
git pull origin master

# Verify scripts
./scripts/validate-scripts.sh

# Update dependencies
./scripts/install.sh
```

### Script Versioning

Scripts follow the project version. Check:
```bash
# Project version
cat package.json | grep version

# Script metadata
cat scripts/.scripts-index.json | grep version
```

---

**Last Updated**: December 2024  
**Maintained by**: Equestrian Project Team