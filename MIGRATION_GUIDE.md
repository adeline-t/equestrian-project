# 📦 Scripts Migration Guide v2.0.0

This guide helps you migrate from the old scripts structure to the new organized structure.

## 🎯 What Changed?

### Version 2.0.0 (December 2024)

#### Major Changes
1. **Directory Reorganization**: Scripts moved to subdirectories
2. **New Scripts**: test.sh, add-field.sh
3. **Deprecated Scripts**: add-model.js, modify-model.js, test.js moved to deprecated/
4. **Convenience Symlinks**: Backward compatibility maintained

#### New Structure
```
scripts/
├── setup/              # NEW: Setup scripts
├── automation/         # NEW: Automation scripts
├── utils/             # NEW: Utility scripts
├── deprecated/        # NEW: Deprecated scripts
└── *.sh               # Symlinks for backward compatibility
```

## 🔄 Migration Steps

### For Users

**Good News**: You don't need to change anything! Symlinks maintain backward compatibility.

```bash
# Old way (still works!)
cd scripts
./add-model.sh

# New way (also works!)
cd scripts/automation
./add-model.sh
```

### For Scripts/Automation

If you have scripts or automation that reference the old paths:

#### Option 1: Use Symlinks (Recommended)
```bash
# These still work:
./scripts/add-model.sh
./scripts/test.sh
./scripts/cleanup.sh
```

#### Option 2: Update to New Paths
```bash
# Old
./scripts/add-model.js      # ❌ Deprecated

# New
./scripts/add-model.sh      # ✅ Via symlink
./scripts/automation/add-model.sh  # ✅ Direct path
```

### For Documentation

Update any documentation that references old paths:

```markdown
<!-- Old -->
See [scripts/add-model.js](scripts/add-model.js)

<!-- New -->
See [scripts/automation/add-model.sh](scripts/automation/add-model.sh)
```

## 📝 Script Mapping

### Moved Scripts

| Old Location | New Location | Symlink |
|--------------|--------------|---------|
| `scripts/add-model.sh` | `scripts/automation/add-model.sh` | ✅ Yes |
| `scripts/setup-project.sh` | `scripts/setup/setup-project.sh` | ✅ Yes |
| `scripts/setup-supabase.sh` | `scripts/setup/setup-supabase.sh` | ✅ Yes |
| `scripts/setup-cloudflare.sh` | `scripts/setup/setup-cloudflare.sh` | ✅ Yes |
| `scripts/install.sh` | `scripts/setup/install.sh` | ✅ Yes |
| `scripts/quick-start.sh` | `scripts/setup/quick-start.sh` | ✅ Yes |
| `scripts/cleanup.sh` | `scripts/utils/cleanup.sh` | ✅ Yes |
| `scripts/validate-scripts.sh` | `scripts/utils/validate-scripts.sh` | ✅ Yes |

### Deprecated Scripts

| Old Location | New Location | Replacement |
|--------------|--------------|-------------|
| `scripts/add-model.js` | `scripts/deprecated/add-model.js` | `automation/add-model.sh` |
| `scripts/modify-model.js` | `scripts/deprecated/modify-model.js` | `automation/add-field.sh` |
| `scripts/test.js` | `scripts/deprecated/test.js` | `utils/test.sh` |

### New Scripts

| Script | Location | Purpose |
|--------|----------|---------|
| `test.sh` | `scripts/utils/test.sh` | Comprehensive test suite |
| `add-field.sh` | `scripts/automation/add-field.sh` | Add field to existing model |

## 🚀 Quick Migration Checklist

### For End Users
- [ ] No action needed! Symlinks maintain compatibility
- [ ] Optional: Learn new structure from [scripts/README.md](scripts/README.md)
- [ ] Optional: Use new scripts (test.sh, add-field.sh)

### For Developers
- [ ] Update any hardcoded paths in scripts
- [ ] Update documentation references
- [ ] Test scripts with new structure
- [ ] Update CI/CD pipelines if needed
- [ ] Review [scripts/README.md](scripts/README.md)

### For CI/CD
- [ ] Verify script paths in workflows
- [ ] Update any absolute paths
- [ ] Test automation pipelines
- [ ] Update deployment scripts

## 📖 Updated Documentation

### Must Read
1. **[scripts/README.md](scripts/README.md)** - Overview of new structure
2. **[scripts/SCRIPTS_CATALOG.md](scripts/SCRIPTS_CATALOG.md)** - Complete catalog
3. **[scripts/deprecated/README.md](scripts/deprecated/README.md)** - Deprecated scripts info

### Detailed Guides
4. **[docs/09-scripts/add-model-bash.md](docs/09-scripts/add-model-bash.md)** - Model generator
5. **[docs/09-scripts/script-reference.md](docs/09-scripts/script-reference.md)** - Script reference

## 🔧 Troubleshooting

### Issue: Script not found

**Symptom**:
```bash
./scripts/add-model.sh: No such file or directory
```

**Solution**:
```bash
# Check if symlink exists
ls -la scripts/add-model.sh

# If missing, recreate symlink
cd scripts
ln -sf automation/add-model.sh add-model.sh
```

### Issue: Permission denied

**Symptom**:
```bash
./scripts/add-model.sh: Permission denied
```

**Solution**:
```bash
# Make executable
chmod +x scripts/automation/add-model.sh
chmod +x scripts/add-model.sh
```

### Issue: Old script still referenced

**Symptom**:
```bash
Using deprecated add-model.js
```

**Solution**:
```bash
# Update to new script
cd scripts
./add-model.sh  # Uses symlink to automation/add-model.sh
```

### Issue: Tests failing

**Symptom**:
```bash
Tests failed: Script not found
```

**Solution**:
```bash
# Run new test suite
cd scripts
./test.sh

# Check validation
./validate-scripts.sh
```

## 🎓 Learning the New Structure

### Quick Tour

```bash
# View structure
cd scripts
tree -L 2

# Explore categories
ls -la setup/
ls -la automation/
ls -la utils/
ls -la deprecated/

# Try new scripts
./test.sh
./add-field.sh
```

### Best Practices

1. **Use symlinks** for backward compatibility
2. **Learn new structure** gradually
3. **Read documentation** in scripts/README.md
4. **Try new scripts** (test.sh, add-field.sh)
5. **Avoid deprecated/** scripts

## 📊 Benefits of New Structure

### Before (v1.x)
```
scripts/
├── add-model.js        # ❌ Non-functional
├── modify-model.js     # ⚠️ Partially functional
├── test.js             # ⚠️ Outdated
├── setup-project.sh
├── cleanup.sh
└── ... (all mixed together)
```

**Issues**:
- ❌ No organization
- ❌ Hard to find scripts
- ❌ Non-functional scripts mixed with working ones
- ❌ No clear categories

### After (v2.0)
```
scripts/
├── setup/              # ✅ Clear purpose
├── automation/         # ✅ Code generation
├── utils/             # ✅ Maintenance
├── deprecated/        # ✅ Separated
└── *.sh               # ✅ Convenience symlinks
```

**Benefits**:
- ✅ Clear organization
- ✅ Easy to find scripts
- ✅ Deprecated scripts separated
- ✅ Clear categories
- ✅ Backward compatible

## 🔄 Rollback Plan

If you need to rollback (not recommended):

```bash
# 1. Checkout previous version
git checkout v1.1.0

# 2. Or manually restore old structure
cd scripts
rm -rf setup automation utils deprecated
# (Old scripts would be in root)
```

**Note**: Rollback not recommended because:
- Old add-model.js doesn't work
- New structure is better organized
- Symlinks maintain compatibility
- New scripts are superior

## 📞 Support

### Getting Help

1. **Read Documentation**:
   - [scripts/README.md](scripts/README.md)
   - [scripts/SCRIPTS_CATALOG.md](scripts/SCRIPTS_CATALOG.md)
   - [docs/09-scripts/](docs/09-scripts/)

2. **Run Tests**:
   ```bash
   cd scripts
   ./test.sh
   ./validate-scripts.sh
   ```

3. **Check Issues**:
   - Review [ADD_MODEL_ISSUES.md](ADD_MODEL_ISSUES.md)
   - Review [SCRIPTS_AUDIT.md](SCRIPTS_AUDIT.md)

### Common Questions

**Q: Do I need to change my workflow?**  
A: No! Symlinks maintain backward compatibility.

**Q: Should I use new paths or symlinks?**  
A: Either works! Symlinks are convenient, new paths are explicit.

**Q: What happened to add-model.js?**  
A: Moved to deprecated/ because it's non-functional. Use add-model.sh instead.

**Q: Can I still use old scripts?**  
A: Symlinks work, but deprecated scripts (*.js) should not be used.

**Q: How do I learn the new structure?**  
A: Read [scripts/README.md](scripts/README.md) and explore the directories.

## ✅ Migration Complete!

Once you've reviewed this guide:

1. ✅ Understand new structure
2. ✅ Know about symlinks
3. ✅ Updated any custom scripts
4. ✅ Read new documentation
5. ✅ Tried new scripts

You're ready to use the new structure!

## 🎉 What's Next?

1. **Explore new scripts**:
   ```bash
   cd scripts
   ./test.sh
   ./add-field.sh
   ```

2. **Read documentation**:
   - [scripts/README.md](scripts/README.md)
   - [scripts/SCRIPTS_CATALOG.md](scripts/SCRIPTS_CATALOG.md)

3. **Try new features**:
   - Comprehensive testing with test.sh
   - Simple field addition with add-field.sh
   - Better organization

4. **Provide feedback**:
   - Report issues
   - Suggest improvements
   - Share success stories

---

**Migration Version**: 2.0.0  
**Date**: December 2024  
**Status**: Complete ✅

**Questions?** See [scripts/README.md](scripts/README.md) or [docs/09-scripts/](docs/09-scripts/)