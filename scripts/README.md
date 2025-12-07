# 📚 Scripts Directory

Welcome to the scripts directory! This folder contains all automation, setup, and utility scripts for the Equestrian Project.

## 🗂️ Directory Structure

```
scripts/
├── setup/              # First-time configuration and installation
│   ├── setup-project.sh
│   ├── setup-supabase.sh
│   ├── setup-cloudflare.sh
│   ├── install.sh
│   └── quick-start.sh
│
├── automation/         # Code generation and model management
│   ├── add-model.sh    # ⭐ Complete model generator
│   └── add-field.sh    # ⭐ Add field to existing model
│
├── utils/             # Maintenance, testing, and validation
│   ├── test.sh         # ⭐ Comprehensive test suite
│   ├── cleanup.sh
│   └── validate-scripts.sh
│
├── deprecated/        # Archived non-functional or replaced scripts
│   ├── README.md       # ⚠️ Read this before using anything here
│   ├── add-model.js    # ❌ Non-functional
│   ├── modify-model.js # ❌ Partially functional
│   └── test.js         # ❌ Outdated
│
├── config/            # Configuration files
│   └── model-schema.json
│
├── templates/         # Code generation templates
│   ├── backend/
│   ├── frontend/
│   └── database/
│
├── examples/          # Example scripts and usage
│   └── create-instructor-example.js
│
├── *.sh               # Convenience symlinks to actual scripts
├── SCRIPTS_CATALOG.md # Complete catalog of all scripts
├── .scripts-index.json # Machine-readable script index
└── README.md          # This file
```

## 🚀 Quick Start

### For New Users

```bash
# 1. Set up the project
./scripts/setup-project.sh

# 2. Launch the application
./start.sh
```

### For Developers

```bash
# Create a new model
cd scripts
./add-model.sh

# Add a field to existing model
./add-field.sh

# Run tests
./test.sh

# Clean build artifacts
./cleanup.sh --all
```

## 📖 Documentation

### Main Documentation
- **[SCRIPTS_CATALOG.md](SCRIPTS_CATALOG.md)** - Complete catalog of all scripts
- **[.scripts-index.json](.scripts-index.json)** - Machine-readable index
- **[deprecated/README.md](deprecated/README.md)** - Info on deprecated scripts

### Detailed Guides
- **[docs/09-scripts/](../docs/09-scripts/)** - Detailed script documentation
- **[docs/09-scripts/add-model-bash.md](../docs/09-scripts/add-model-bash.md)** - Model generator guide
- **[docs/02-development/](../docs/02-development/)** - Development guides

## ⭐ Featured Scripts

### 🤖 add-model.sh
**Complete, production-ready model generator**

```bash
cd scripts
./add-model.sh
```

**Features**:
- ✅ Generates complete, working code (not stubs!)
- ✅ No dependencies (pure bash)
- ✅ Interactive with colored output
- ✅ Creates backend, frontend, database, and styles
- ✅ Production-ready output

**See**: [docs/09-scripts/add-model-bash.md](../docs/09-scripts/add-model-bash.md)

---

### ➕ add-field.sh
**Simple helper to add a field to existing model**

```bash
cd scripts
./add-field.sh
```

**Features**:
- ✅ Interactive field selection
- ✅ Generates migration
- ✅ Provides code snippets
- ✅ Step-by-step guidance

---

### 🧪 test.sh
**Comprehensive testing suite**

```bash
cd scripts
./test.sh              # Run all tests
./test.sh syntax       # Run specific test
```

**Tests**:
- Script executability
- Shebang lines
- Syntax validation
- Dependencies
- Configuration files
- Templates
- Documentation
- Project structure
- And more!

---

## 📂 Script Categories

### Setup Scripts (setup/)
First-time configuration and installation:
- `setup-project.sh` - Complete project setup
- `setup-supabase.sh` - Supabase configuration
- `setup-cloudflare.sh` - Cloudflare configuration
- `install.sh` - Install dependencies
- `quick-start.sh` - Quick setup

### Automation Scripts (automation/)
Code generation and model management:
- `add-model.sh` - Generate complete model
- `add-field.sh` - Add field to existing model

### Utility Scripts (utils/)
Maintenance, testing, and validation:
- `test.sh` - Test suite
- `cleanup.sh` - Clean build artifacts
- `validate-scripts.sh` - Validate script integrity

### Deprecated Scripts (deprecated/)
⚠️ **Do not use!** See [deprecated/README.md](deprecated/README.md)

## 🔗 Convenience Symlinks

All scripts have symlinks in the root `scripts/` directory for backward compatibility:

```bash
# These are equivalent:
./scripts/add-model.sh
./scripts/automation/add-model.sh

# These are equivalent:
./scripts/test.sh
./scripts/utils/test.sh
```

This means you can use scripts the old way or the new organized way!

## 🎯 Common Tasks

### Adding a New Model

```bash
cd scripts
./add-model.sh

# Follow the prompts:
# 1. Enter model name (e.g., Instructor)
# 2. Enter display names (French)
# 3. Choose emoji
# 4. Add fields
# 5. Apply migration in Supabase
# 6. Test!
```

### Adding a Field to Existing Model

```bash
cd scripts
./add-field.sh

# Follow the prompts:
# 1. Select model
# 2. Enter field details
# 3. Apply migration
# 4. Update handler (code provided)
# 5. Update frontend (code provided)
```

### Running Tests

```bash
cd scripts
./test.sh              # All tests
./test.sh syntax       # Just syntax
./test.sh dependencies # Just dependencies
```

### Cleaning Up

```bash
./scripts/cleanup.sh --all        # Everything
./scripts/cleanup.sh --frontend   # Frontend only
./scripts/cleanup.sh --backend    # Backend only
./scripts/cleanup.sh --logs       # Logs only
```

### Setting Up Project

```bash
# First time
./scripts/setup-project.sh

# Just dependencies
./scripts/install.sh

# Quick start
./scripts/quick-start.sh
```

## 🔧 Development

### Creating a New Script

1. **Choose the right directory**:
   - `setup/` - Configuration and installation
   - `automation/` - Code generation
   - `utils/` - Maintenance and testing

2. **Create the script**:
```bash
cd scripts/automation  # or setup/ or utils/
nano my-script.sh
```

3. **Add shebang and header**:
```bash
#!/bin/bash
# my-script.sh - Brief description
# Usage: ./my-script.sh [options]

set -e  # Exit on error
```

4. **Make executable**:
```bash
chmod +x my-script.sh
```

5. **Create symlink**:
```bash
cd ..
ln -sf automation/my-script.sh my-script.sh
```

6. **Update documentation**:
   - Add to `SCRIPTS_CATALOG.md`
   - Update `.scripts-index.json`
   - Add detailed docs if needed

7. **Test**:
```bash
./test.sh
./validate-scripts.sh
```

### Testing Your Script

```bash
# Syntax check
bash -n my-script.sh

# Run validation
./validate-scripts.sh

# Run full test suite
./test.sh
```

## 📋 Best Practices

### Script Writing
1. ✅ Always use `#!/bin/bash` shebang
2. ✅ Use `set -e` to exit on errors
3. ✅ Add clear comments and usage
4. ✅ Use colored output for better UX
5. ✅ Validate user input
6. ✅ Handle errors gracefully
7. ✅ Provide clear next steps

### Organization
1. ✅ Put scripts in appropriate directories
2. ✅ Create symlinks for convenience
3. ✅ Update documentation
4. ✅ Keep deprecated scripts separate
5. ✅ Use consistent naming

### Documentation
1. ✅ Update SCRIPTS_CATALOG.md
2. ✅ Update .scripts-index.json
3. ✅ Add inline comments
4. ✅ Provide usage examples
5. ✅ Document dependencies

## 🐛 Troubleshooting

### Permission Denied
```bash
chmod +x scripts/script-name.sh
```

### Script Not Found
```bash
# Use relative path from project root
./scripts/script-name.sh

# Or use symlink
cd scripts
./script-name.sh
```

### Dependencies Missing
```bash
# Check what's missing
./scripts/test.sh dependencies

# Install dependencies
./scripts/install.sh
```

### Tests Failing
```bash
# Run specific test
./scripts/test.sh syntax

# Check validation
./scripts/validate-scripts.sh

# Review output for details
```

## 📊 Statistics

- **Total Scripts**: 13 (10 active + 3 deprecated)
- **Active Scripts**: 10
- **Deprecated Scripts**: 3
- **Categories**: 4 (setup, automation, utils, deprecated)
- **Lines of Code**: ~3,000+ (active scripts)
- **Test Coverage**: 12 test categories

## 🔄 Version History

### Version 2.0.0 (December 2024) - Current
- ✨ Major reorganization into subdirectories
- ✨ New: test.sh (comprehensive test suite)
- ✨ New: add-field.sh (field addition helper)
- ♻️ Deprecated: add-model.js, modify-model.js, test.js
- 🔗 Added convenience symlinks
- 📚 Updated all documentation

### Version 1.1.0 (December 2024)
- ✨ New: add-model.sh (complete bash implementation)
- ♻️ Deprecated: add-model.js (non-functional)
- 📚 Added comprehensive documentation

### Version 1.0.0 (Initial)
- Initial script collection
- Basic automation tools
- Setup and utility scripts

## 🤝 Contributing

When adding or modifying scripts:

1. Follow the directory structure
2. Use bash for new scripts (not JavaScript)
3. Add proper documentation
4. Create symlinks for convenience
5. Update SCRIPTS_CATALOG.md
6. Update .scripts-index.json
7. Run tests: `./test.sh`
8. Run validation: `./validate-scripts.sh`

## 📚 Additional Resources

- **Main Documentation**: [../docs/](../docs/)
- **Development Guide**: [../docs/02-development/](../docs/02-development/)
- **Deployment Guide**: [../docs/03-deployment/](../docs/03-deployment/)
- **API Documentation**: [../docs/05-api/](../docs/05-api/)

## 💡 Tips

1. **Use tab completion**: Symlinks make tab completion work from scripts/
2. **Run tests often**: `./test.sh` catches issues early
3. **Check deprecated/**: Don't use anything in there!
4. **Read the catalog**: SCRIPTS_CATALOG.md has all the details
5. **Follow examples**: Look at existing scripts for patterns

## 🎉 Success Stories

### Before (JavaScript version)
- ❌ Non-functional code generation
- ❌ Required Node.js and npm packages
- ❌ Generated files didn't work
- ⏱️ Hours of manual work per model

### After (Bash version)
- ✅ Complete, working code generation
- ✅ No dependencies (pure bash)
- ✅ Production-ready output
- ⏱️ Minutes to generate complete model

**Time Saved**: 2-4 hours per model  
**Developer Satisfaction**: 📈 Way up!

---

**Questions?** Check [SCRIPTS_CATALOG.md](SCRIPTS_CATALOG.md) or [docs/09-scripts/](../docs/09-scripts/)

**Issues?** Run `./test.sh` and `./validate-scripts.sh`

**Need Help?** See the detailed documentation in [docs/](../docs/)

---

**Last Updated**: December 2024  
**Version**: 2.0.0  
**Status**: Production Ready ✅