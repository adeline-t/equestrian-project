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

**Getting Started:**
- [Launch the app](../../README.md#quick-start) → Use `./launch-local.sh`
- [First-time setup](../01-getting-started/installation.md) → Use `./scripts/setup/setup-project.sh`
- [Quick start](../01-getting-started/quick-start.md) → Use `./scripts/setup/quick-start.sh`

**Development:**
- [Local development](../02-development/README.md) → Use `./launch-local.sh`
- [Clean build artifacts](./script-reference.md#cleanup) → Use `./scripts/utils/cleanup.sh`

**Deployment:**
- [Deploy to production](../03-deployment/deployment-guide.md) → Use `./deploy.sh`
- [Setup Cloudflare](./script-reference.md#setup-cloudflare) → Use `./scripts/setup/setup-cloudflare.sh`

### By Category

| Category | Scripts | Purpose |
|----------|---------|---------|
| **Launch** | `launch-local.sh` | Start the application locally |
| **Deployment** | `deploy.sh` | Deploy to production |
| **Setup** | `setup-*.sh`, `install.sh` | Initial project configuration |
| **Utility** | `cleanup.sh` | Maintenance and cleanup |

## 📖 Available Scripts

### Root Level Scripts

Scripts at the project root are for **frequent daily use:**

```
equestrian-project/
├── launch-local.sh       # Launch app locally (most used)
└── deploy.sh             # Deploy to production
```

**Why at root?**
- Maximum discoverability
- Shortest path to execute
- Follows common project conventions
- Easy to remember

### Scripts Directory

Scripts in `scripts/` are for **development and setup:**

```
scripts/
├── setup/
│   ├── setup-project.sh      # Complete project setup
│   ├── setup-supabase.sh     # Supabase configuration
│   ├── setup-cloudflare.sh   # Cloudflare configuration
│   ├── install.sh            # Install dependencies
│   └── quick-start.sh        # Quick setup
└── utils/
    └── cleanup.sh            # Clean build artifacts
```

**Why in scripts/?**
- Used less frequently
- Development-focused
- Keeps root clean
- Logical grouping

## 🚀 Common Usage

### Launch Application Locally

```bash
# From project root
./launch-local.sh
```

This script:
- ✅ Checks prerequisites
- ✅ Installs dependencies if needed
- ✅ Launches backend on port 8787
- ✅ Launches frontend on port 5173
- ✅ Monitors both services

### Deploy to Production

```bash
# Deploy to development environment
./deploy.sh dev

# Deploy to production environment
./deploy.sh prod
```

### Setup Scripts

**Complete project setup:**
```bash
./scripts/setup/setup-project.sh
```

**Install dependencies only:**
```bash
./scripts/setup/install.sh
```

**Quick start setup:**
```bash
./scripts/setup/quick-start.sh
```

**Configure Supabase:**
```bash
./scripts/setup/setup-supabase.sh
```

**Configure Cloudflare:**
```bash
./scripts/setup/setup-cloudflare.sh
```

### Utility Scripts

**Clean build artifacts:**
```bash
./scripts/utils/cleanup.sh --all        # Everything
./scripts/utils/cleanup.sh --frontend   # Frontend only
./scripts/utils/cleanup.sh --backend    # Backend only
./scripts/utils/cleanup.sh --logs       # Logs only
```

## 🔧 Script Development

### Creating New Scripts

1. **Choose the right directory:**
   - `setup/` - Configuration and installation
   - `utils/` - Maintenance and testing

2. **Create the script:**
```bash
cd scripts/setup  # or utils/
nano my-script.sh
```

3. **Add shebang and header:**
```bash
#!/bin/bash
# my-script.sh - Brief description
# Usage: ./my-script.sh [options]

set -e  # Exit on error
```

4. **Make executable:**
```bash
chmod +x my-script.sh
```

5. **Test:**
```bash
# Syntax check
bash -n my-script.sh

# Run the script
./my-script.sh
```

### Best Practices

**Script Writing:**
1. ✅ Always use `#!/bin/bash` shebang
2. ✅ Use `set -e` to exit on errors
3. ✅ Add clear comments and usage
4. ✅ Use colored output for better UX
5. ✅ Validate user input
6. ✅ Handle errors gracefully
7. ✅ Provide clear next steps

**Organization:**
1. ✅ Put scripts in appropriate directories
2. ✅ Update documentation
3. ✅ Use consistent naming
4. ✅ Keep scripts focused and simple

**Documentation:**
1. ✅ Update this README
2. ✅ Add inline comments
3. ✅ Provide usage examples
4. ✅ Document dependencies

## 🐛 Troubleshooting

### Permission Denied
```bash
chmod +x scripts/script-name.sh
```

### Script Not Found
```bash
# Use relative path from project root
./scripts/setup/script-name.sh

# Or navigate to scripts directory
cd scripts/setup
./script-name.sh
```

### Dependencies Missing
```bash
# Install all dependencies
./scripts/setup/install.sh
```

## 📊 Script Inventory

### Active Scripts

| Script | Location | Purpose |
|--------|----------|---------|
| `launch-local.sh` | Root | Launch application locally |
| `deploy.sh` | Root | Deploy to production |
| `setup-project.sh` | `scripts/setup/` | Complete project setup |
| `setup-supabase.sh` | `scripts/setup/` | Configure Supabase |
| `setup-cloudflare.sh` | `scripts/setup/` | Configure Cloudflare |
| `install.sh` | `scripts/setup/` | Install dependencies |
| `quick-start.sh` | `scripts/setup/` | Quick setup |
| `cleanup.sh` | `scripts/utils/` | Clean build artifacts |

## 🤝 Contributing

When adding or modifying scripts:

1. Follow the directory structure
2. Use bash for new scripts
3. Add proper documentation
4. Update this README
5. Test thoroughly

## 📚 Additional Resources

- **Main Documentation:** [../docs/](../docs/)
- **Development Guide:** [../docs/02-development/](../docs/02-development/)
- **Deployment Guide:** [../docs/03-deployment/](../docs/03-deployment/)
- **API Documentation:** [../docs/05-api/](../docs/05-api/)

## 💡 Tips

1. **Use tab completion:** Makes finding scripts easier
2. **Check documentation:** Each script has usage instructions
3. **Follow examples:** Look at existing scripts for patterns
4. **Test locally first:** Always test before deploying

---

**Questions?** Check [Script Reference](./script-reference.md) or the main [Documentation](../docs/)

**Issues?** Open an issue on GitHub

**Need Help?** See the detailed documentation in [docs/](../docs/)

---

**Last Updated:** January 2025  
**Version:** 2.0.0  
**Status:** Production Ready ✅