# Equestrian Model Automation Scripts

This directory contains automation scripts to streamline the process of adding new models and modifying existing models in your equestrian management system.

## 🚀 Quick Start

### Installation

```bash
cd scripts
npm install
chmod +x add-model.js modify-model.js
```

### Adding a New Model

```bash
./add-model.js
```

### Modifying an Existing Model

```bash
./modify-model.js
```

## 📁 File Structure

```
scripts/
├── package.json                    # Node.js dependencies and scripts
├── add-model.js                   # Main script for adding new models
├── modify-model.js                # Script for modifying existing models
├── README.md                      # This file
├── config/
│   └── model-schema.json          # Field types and configuration
└── templates/
    ├── backend/
    │   └── handler.js.template    # Backend API handler template
    ├── frontend/
    │   ├── List.jsx.template      # List component template
    │   ├── Form.jsx.template      # Form component template
    │   ├── types.js.template      # Type definitions template
    │   └── styles.css.template    # CSS styles template
    └── database/
        └── migration.sql.template # Database migration template
```

## 🎯 Features

### Model Addition (`add-model.js`)

- **Interactive CLI**: Guided setup with prompts
- **Complete CRUD**: Generates full Create, Read, Update, Delete operations
- **Database Migrations**: SQL migration files for Supabase
- **Backend Handler**: Complete API handler with validation
- **Frontend Components**: React components for list and forms
- **Type Safety**: TypeScript-like type definitions
- **Styling**: Pre-built CSS styles
- **API Integration**: Updates API service automatically
- **Routing**: Updates backend routing automatically

### Model Modification (`modify-model.js`)

- **Add Fields**: Add new fields to existing models
- **Remove Fields**: Safely remove unused fields
- **Modify Fields**: Change field properties (type, required status)
- **Add Relationships**: Create foreign key and many-to-many relationships
- **Custom Endpoints**: Add specialized API endpoints

## 🔧 Supported Field Types

| Type | SQL Type | JavaScript | Form Input | Validation |
|------|----------|------------|------------|------------|
| `string` | VARCHAR(255) | string | text | trim |
| `text` | TEXT | string | textarea | trim |
| `integer` | INTEGER | number | number | parseInt |
| `decimal` | DECIMAL(10,2) | number | number | parseFloat |
| `boolean` | BOOLEAN | boolean | checkbox | Boolean |
| `date` | DATE | string | date | date |
| `datetime` | TIMESTAMP | string | datetime-local | datetime |
| `email` | VARCHAR(255) | string | email | email |
| `phone` | VARCHAR(50) | string | tel | phone |
| `enum` | VARCHAR(100) | string | select | enum |

## 📝 Usage Examples

### Example 1: Adding an Instructor Model

```bash
./add-model.js
```

**Prompts:**
- Model name: `Instructor`
- Display name: `Moniteur`
- Display plural: `Moniteurs`
- Main emoji: `👨‍🏫`
- Has activity dates: `Yes`
- Fields:
  - `name` (string, required)
  - `email` (email, optional)
  - `phone` (phone, optional)
  - `specialization` (enum: Dressage,Saut d'obstacle,Pony club)
  - `certification_level` (string, optional)
  - `hourly_rate` (decimal, optional)

**Generated Files:**
- `backend/src/handlers/instructors.js`
- `database/migrations/001_create_instructors.sql`
- `frontend/src/components/instructors/InstructorsList.jsx`
- `frontend/src/components/instructors/InstructorForm.jsx`
- `frontend/src/types/instructors.js`
- `frontend/src/components/instructors/instructors.css`

### Example 2: Adding Field to Horse Model

```bash
./modify-model.js
```

**Prompts:**
- Model: `horses`
- Modification: `Add new field(s)`
- Field name: `is_owned_by_laury`
- Type: `boolean`
- Required: `No`
- Default value: `false`

**Generated:**
- `database/migrations/002_add_field_to_horses.sql`
- Updated handler with validation
- Frontend form updates needed

## 🔄 Workflow Integration

### Development Workflow

1. **Plan Model**: Define fields and relationships
2. **Run Generator**: Use `add-model.js` or `modify-model.js`
3. **Database Migration**: Apply SQL changes to Supabase
4. **Test Backend**: Verify API endpoints work
5. **Test Frontend**: Check UI functionality
6. **Deploy**: Push changes to production

### Production Deployment

1. **Backup Database**: Always backup before migrations
2. **Test Migration**: Run migrations in staging first
3. **Deploy Backend**: Update Cloudflare Workers
4. **Deploy Frontend**: Update static assets
5. **Verify**: Test all functionality in production

## 🛠️ Customization

### Adding New Field Types

Edit `config/model-schema.json`:

```json
{
  "fieldTypes": {
    "customType": {
      "sql": "CUSTOM_TYPE",
      "js": "string",
      "validation": "customValidation",
      "form": "customInput"
    }
  }
}
```

### Custom Templates

Modify files in `templates/` directory:
- Backend logic: `templates/backend/handler.js.template`
- Frontend components: `templates/frontend/*.template`
- Database schemas: `templates/database/migration.sql.template`

### Template Variables

Available variables in templates:
- `{{modelName}}`: PascalCase model name (e.g., Instructor)
- `{{modelNameLower}}`: lowercase model name (e.g., instructor)
- `{{modelNamePlural}}`: plural lowercase (e.g., instructors)
- `{{tableName}}`: database table name (e.g., instructors)
- `{{ModelName}}`: Display name (e.g., Moniteur)
- `{{currentDate}}`: Current date in YYYY-MM-DD format

## 🧪 Testing

### Running Tests

```bash
npm test
```

### Manual Testing Checklist

- [ ] Database migration runs successfully
- [ ] API endpoints return correct responses
- [ ] Form validation works properly
- [ ] List displays data correctly
- [ ] Create/Update/Delete operations work
- [ ] Error handling is appropriate
- [ ] Responsive design works on mobile

## 🐛 Troubleshooting

### Common Issues

**1. Template Not Found**
```
Error: ENOENT: no such file or directory, open 'templates/...'
```
**Solution**: Ensure you're running scripts from the `scripts/` directory

**2. Permission Denied**
```
Error: EACCES: permission denied
```
**Solution**: Run `chmod +x *.js` to make scripts executable

**3. Module Not Found**
```
Error: Cannot find module 'inquirer'
```
**Solution**: Run `npm install` to install dependencies

**4. Database Migration Fails**
```
Error: column already exists
```
**Solution**: Check if field already exists or use different migration name

### Debug Mode

Enable verbose logging:

```bash
DEBUG=true ./add-model.js
```

## 📚 Advanced Topics

### Complex Relationships

For many-to-many relationships, the script creates:
- Junction table with foreign keys
- Proper indexes for performance
- Cascade delete constraints

### Custom Validation

Add custom validation in handler templates:

```javascript
// Custom validation example
if (body.customField && body.customField.length < 3) {
  return jsonResponse({ 
    error: 'Custom field must be at least 3 characters' 
  }, 400, getSecurityHeaders());
}
```

### API Endpoint Extensions

Add custom endpoints by modifying handler:

```javascript
// GET /api/instructors/active
if (path === '/api/instructors/active' && method === 'GET') {
  const { data } = await db
    .from('instructors')
    .select('*')
    .is('activity_end_date', null);
  
  return jsonResponse(data, 200, getSecurityHeaders());
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check this README first
2. Look at generated code examples
3. Test with simple models first
4. Review error messages carefully

---

Generated with ❤️ for the Equestrian Management System