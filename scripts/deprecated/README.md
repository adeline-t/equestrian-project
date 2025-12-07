# Deprecated Scripts

This folder contains scripts that are no longer maintained or have been replaced by better alternatives.

## ⚠️ Do Not Use These Scripts

The scripts in this folder are kept for reference only and should not be used in production.

## Deprecated Scripts

### add-model.js ❌
**Status**: Non-functional (30% complete)  
**Replaced by**: `automation/add-model.sh`  
**Reason**: All code generation methods are stubs returning placeholder comments. Generated files are non-functional.  
**Issues**: See `../ADD_MODEL_ISSUES.md` for detailed analysis.

### modify-model.js ⚠️
**Status**: Partially functional  
**Replaced by**: `automation/add-field.sh` (for simple modifications)  
**Reason**: Complex implementation with limited functionality. Most modifications are better done manually with guidance.  
**Note**: Generates migrations but requires manual handler and frontend updates.

### test.js 🔄
**Status**: Functional but outdated  
**Replaced by**: `utils/test.sh`  
**Reason**: Migrated to bash for consistency and to remove Node.js dependency.  
**Note**: The bash version has more comprehensive tests and better output.

## Why These Scripts Were Deprecated

### Technical Reasons
1. **Incomplete Implementation**: Code generation methods were never completed
2. **External Dependencies**: Required Node.js and npm packages
3. **Maintenance Burden**: Complex code that was difficult to maintain
4. **Limited Functionality**: Generated non-functional code requiring extensive manual work

### Strategic Reasons
1. **Better Alternatives**: Bash versions are simpler, faster, and more maintainable
2. **No Dependencies**: Pure bash scripts work everywhere
3. **Complete Implementation**: New scripts generate production-ready code
4. **Better UX**: Colored output, better prompts, clearer guidance

## Migration Guide

If you were using these scripts, here's how to migrate:

### From add-model.js → add-model.sh
```bash
# Old way (doesn't work)
cd scripts
./add-model.js

# New way (works!)
cd scripts/automation
./add-model.sh
```

### From modify-model.js → add-field.sh
```bash
# Old way (partially works)
cd scripts
./modify-model.js

# New way (simpler, with guidance)
cd scripts/automation
./add-field.sh
```

### From test.js → test.sh
```bash
# Old way
cd scripts
node test.js

# New way
cd scripts/utils
./test.sh
```

## Can I Still Use These?

**Short answer**: No, please don't.

**Long answer**: 
- `add-model.js` will not generate working code
- `modify-model.js` requires extensive manual work
- `test.js` works but is outdated

Use the new bash versions instead. They're better in every way.

## What If I Need the Old Functionality?

If you absolutely need something from these scripts:

1. **For model generation**: Use `automation/add-model.sh` - it's complete and works
2. **For modifications**: Use `automation/add-field.sh` or modify manually
3. **For testing**: Use `utils/test.sh` - it has more tests

## Historical Context

These scripts were created as part of the initial project automation effort. While they had good intentions and solid structure, the implementation was never completed. The JavaScript versions served as prototypes that helped inform the design of the superior bash versions.

## Removal Timeline

These scripts will be kept in the deprecated folder for:
- **Reference**: To understand the original design
- **Learning**: To see what didn't work and why
- **History**: To maintain project history

They may be removed in a future major version update.

## Questions?

If you have questions about why these scripts were deprecated or need help migrating, please:
1. Check the main scripts documentation: `../SCRIPTS_CATALOG.md`
2. Read the issue analysis: `../ADD_MODEL_ISSUES.md`
3. Review the new scripts: `../automation/` and `../utils/`

---

**Last Updated**: December 2024  
**Deprecation Date**: December 2024  
**Removal Date**: TBD (future major version)