# Pull Request

## 📋 Description

<!-- Provide a clear and concise description of your changes -->

## 🎯 Type of Change

<!-- Mark the relevant option with an 'x' -->

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🔧 Configuration change
- [ ] 🎨 Code style update (formatting, renaming)
- [ ] ♻️ Refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] ✅ Test update
- [ ] 🔨 Build/CI update
- [ ] 📦 Dependency update

## 🔗 Related Issues

<!-- Link to related issues using #issue_number -->

Closes #
Related to #

## 📝 Changes Made

<!-- List the specific changes made in this PR -->

- 
- 
- 

## 🧪 Testing

<!-- Describe the tests you ran and how to reproduce them -->

### Test Environment
- [ ] Local development
- [ ] Staging environment
- [ ] Production environment

### Test Cases
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed

### How to Test
```bash
# Provide commands to test your changes
./start.sh
# ... additional test steps
```

## 📸 Screenshots (if applicable)

<!-- Add screenshots to help explain your changes -->

## ✅ Checklist

### Code Quality
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] My changes generate no new warnings or errors
- [ ] I have removed any console.log or debugging code

### Documentation
- [ ] I have updated the documentation accordingly
- [ ] I have updated the README if needed
- [ ] I have updated relevant guides in `docs/`
- [ ] I have updated the Scripts Catalog if adding/modifying scripts
- [ ] I have updated `.scripts-index.json` if adding/modifying scripts

### Testing
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] I have tested on multiple browsers (if frontend changes)
- [ ] I have tested on different screen sizes (if UI changes)

### Database Changes
- [ ] I have created a database migration if needed
- [ ] I have tested the migration on a clean database
- [ ] I have documented any schema changes
- [ ] I have updated seed data if necessary

### Scripts
- [ ] New scripts are executable (`chmod +x`)
- [ ] Scripts have proper shebang lines
- [ ] Scripts are documented in SCRIPTS_CATALOG.md
- [ ] Scripts are added to .scripts-index.json
- [ ] Script validation passes (`./scripts/validate-scripts.sh`)

### Environment & Configuration
- [ ] I have updated environment variable documentation
- [ ] I have added new environment variables to `.env.example` files
- [ ] I have updated `wrangler.toml` if needed
- [ ] Configuration changes are documented

### Deployment
- [ ] This change is safe to deploy to production
- [ ] I have considered backward compatibility
- [ ] I have documented any deployment steps required
- [ ] I have tested the deployment process

## 🚀 Deployment Notes

<!-- Any special instructions for deploying this change -->

### Pre-deployment Steps
```bash
# List any steps needed before deployment
```

### Post-deployment Steps
```bash
# List any steps needed after deployment
```

### Rollback Plan
<!-- Describe how to rollback if issues occur -->

## 📊 Performance Impact

<!-- Describe any performance implications -->

- [ ] No performance impact
- [ ] Performance improved
- [ ] Performance may be affected (explain below)

## 🔒 Security Considerations

<!-- Describe any security implications -->

- [ ] No security impact
- [ ] Security improved
- [ ] Requires security review

## 🤔 Questions for Reviewers

<!-- Any specific questions or areas you'd like reviewers to focus on -->

## 📚 Additional Context

<!-- Add any other context about the PR here -->

## 🎨 Code Review Checklist (for Reviewers)

- [ ] Code is clean and follows project conventions
- [ ] Logic is sound and efficient
- [ ] Error handling is appropriate
- [ ] Security considerations are addressed
- [ ] Documentation is clear and complete
- [ ] Tests are comprehensive
- [ ] No unnecessary dependencies added
- [ ] Performance is acceptable
- [ ] UI/UX is intuitive (if applicable)
- [ ] Accessibility is maintained (if applicable)

---

**By submitting this pull request, I confirm that my contribution is made under the terms of the project's license.**