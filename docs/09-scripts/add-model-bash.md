# add-model.sh - Bash Model Generator

## Overview

The `add-model.sh` script is a complete rewrite of the original `add-model.js` in bash. Unlike the JavaScript version, this script generates **fully functional, production-ready code** for new data models.

## Key Improvements Over JavaScript Version

### ✅ Complete Code Generation
- **All methods implemented** - No stub functions
- **Working components** - Generated code is immediately usable
- **Full CRUD functionality** - Create, Read, Update, Delete operations
- **Proper validation** - Input validation and error handling
- **Complete styling** - CSS included for all components

### ✅ Better User Experience
- **Colored output** - Easy to read terminal interface
- **Clear prompts** - Step-by-step guidance
- **Input validation** - Prevents invalid entries
- **Progress indicators** - Shows what's being generated
- **Next steps guide** - Clear instructions after generation

### ✅ Simpler Maintenance
- **Single file** - No external dependencies
- **Inline templates** - No separate template files needed
- **Pure bash** - No Node.js required
- **Easy to modify** - Clear, readable code

## Usage

### Basic Usage

```bash
cd scripts
./add-model.sh
```

### Interactive Prompts

The script will guide you through:

1. **Model Configuration**
   - Model name (PascalCase)
   - Display name (French, singular)
   - Display name (French, plural)
   - Main emoji
   - Activity dates (yes/no)
   - Custom endpoints (yes/no)

2. **Field Definitions**
   - Field name (snake_case)
   - Field type
   - Required status
   - Unique constraint
   - Default value
   - Enum options (if applicable)

### Example Session

```bash
$ cd scripts
$ ./add-model.sh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🐴 Equestrian Model Generator
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add new models to your equestrian management system

📋 Model Configuration

Model name (singular, PascalCase, e.g., Instructor, Horse): Instructor
Display name (French, singular, e.g., Moniteur, Cheval): Moniteur
Display name (French, plural, e.g., Moniteurs, Chevaux): Moniteurs

Select main emoji for this model:
1) 👤 Person
2) 🐴 Horse
3) 🏇 Rider
4) 🏃 Runner
5) 👨‍🏫 Male Teacher
6) 👩‍🏫 Female Teacher
7) 💰 Money
8) 📅 Calendar
9) 🏢 Building
10) 🎯 Target
11) ⭐ Star
12) 📝 Note
13) 🔧 Tool
Choose emoji (1-13): 6

Does this model have activity start/end dates? (y/N): y
Does this model need custom API endpoints beyond basic CRUD? (y/N): n

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Model Fields
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field #1
Field name (snake_case, e.g., first_name, phone_number): name
Select field type:
1) string - VARCHAR(255)
2) text - TEXT (long text)
3) integer - INTEGER
4) decimal - DECIMAL(10,2)
5) boolean - BOOLEAN
6) date - DATE
7) datetime - TIMESTAMP
8) email - VARCHAR(255) with validation
9) phone - VARCHAR(50) with validation
10) enum - VARCHAR(100) with options
Choose type (1-10): 1
Is this field required? (y/N): y
Should this field be unique? (y/N): n
Add another field? (y/N): y

Field #2
Field name (snake_case, e.g., first_name, phone_number): email
Choose type (1-10): 8
Is this field required? (y/N): n
Should this field be unique? (y/N): y
Add another field? (y/N): y

Field #3
Field name (snake_case, e.g., first_name, phone_number): certification_level
Choose type (1-10): 10
Is this field required? (y/N): n
Should this field be unique? (y/N): n
Enum options (comma-separated, e.g., Active,Inactive,Pending): Galop 1,Galop 2,Galop 3,Galop 4,Galop 5,Galop 6,Galop 7
Add another field? (y/N): n

✓ Collected 3 field(s)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔨 Generating Files
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generating backend handler: backend/src/handlers/instructor.js
✓ Backend handler generated
Generating database migration: database/migrations/20241207120000_create_instructors.sql
✓ Database migration generated
Generating frontend List component: frontend/src/components/instructor/instructorsList.jsx
✓ Frontend List component generated
Generating frontend Form component: frontend/src/components/instructor/InstructorForm.jsx
✓ Frontend Form component generated
Generating styles: frontend/src/components/instructor/instructor.css
✓ Styles generated

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 Updating Project Files
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Updating API service: frontend/src/services/api.js
✓ API service updated
Updating backend router: backend/src/index.js
✓ Backend router updated

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Model Generation Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Next steps:

1. Database Migration:
   - Open Supabase SQL Editor
   - Run the migration file: database/migrations/*_create_instructors.sql

2. Frontend Routing:
   - Add route to your App.jsx:
     <Route path="/instructors" element={<InstructorList />} />
   - Import the component:
     import InstructorList from './components/instructor/instructorsList.jsx';

3. Navigation:
   - Add navigation link to your menu
   - Use emoji: 👩‍🏫

4. Testing:
   - Test the API endpoints
   - Verify frontend functionality
   - Check form validation

🎉 Your new Moniteur model is ready!
```

## Generated Files

The script generates the following files:

### Backend
- `backend/src/handlers/{model}.js` - Complete API handler with CRUD operations

### Database
- `database/migrations/{timestamp}_create_{table}.sql` - Database migration

### Frontend
- `frontend/src/components/{model}/{Model}List.jsx` - List component with table
- `frontend/src/components/{model}/{Model}Form.jsx` - Form component with validation
- `frontend/src/components/{model}/{model}.css` - Complete styling

### Updates
- `frontend/src/services/api.js` - Adds API export
- `backend/src/index.js` - Adds route handler

## Supported Field Types

| Type | SQL Type | Form Input | Validation |
|------|----------|------------|------------|
| string | VARCHAR(255) | text | trim, null check |
| text | TEXT | textarea | trim, null check |
| integer | INTEGER | number | parseInt |
| decimal | DECIMAL(10,2) | number (step=0.01) | parseFloat |
| boolean | BOOLEAN | checkbox | Boolean cast |
| date | DATE | date | date format |
| datetime | TIMESTAMP | datetime-local | datetime format |
| email | VARCHAR(255) | email | email validation |
| phone | VARCHAR(50) | tel | phone validation |
| enum | VARCHAR(100) | select | enum options |

## Features

### Backend Handler
- ✅ Complete CRUD operations (GET, POST, PUT, DELETE)
- ✅ Input validation
- ✅ Rate limiting
- ✅ Error handling
- ✅ Security headers
- ✅ Type coercion (parseInt, parseFloat, Boolean)
- ✅ Email/phone validation
- ✅ Null handling

### Frontend List Component
- ✅ Data fetching with loading states
- ✅ Error handling
- ✅ Success messages
- ✅ Empty state
- ✅ Table display
- ✅ Edit/Delete actions
- ✅ Modal form integration
- ✅ Proper date formatting
- ✅ Boolean display (✓/✗)

### Frontend Form Component
- ✅ Create/Edit modes
- ✅ All field types supported
- ✅ Form validation
- ✅ Error display
- ✅ Loading states
- ✅ Modal overlay
- ✅ Proper input types
- ✅ Enum dropdowns
- ✅ Date/datetime pickers

### Database Migration
- ✅ Table creation
- ✅ All field types
- ✅ Constraints (NOT NULL, UNIQUE)
- ✅ Default values
- ✅ Indexes
- ✅ Timestamps (created_at, updated_at)
- ✅ Update trigger
- ✅ Comments
- ✅ Activity dates (optional)

### Styling
- ✅ Complete CSS for all components
- ✅ Modal styling
- ✅ Form styling
- ✅ Table styling
- ✅ Alert styling
- ✅ Responsive design
- ✅ Hover effects
- ✅ Loading states

## Validation Rules

### Model Name
- Must be PascalCase
- Must start with uppercase letter
- Only letters and numbers allowed
- Examples: `Instructor`, `Horse`, `Rider`

### Field Name
- Must be snake_case
- Must start with lowercase letter
- Only lowercase letters, numbers, and underscores
- Examples: `first_name`, `phone_number`, `email`

### Display Names
- Any text allowed
- Used for UI labels
- French language recommended

## Post-Generation Steps

### 1. Apply Database Migration

```bash
# Copy the SQL from the migration file
cat database/migrations/*_create_{table}.sql

# Paste into Supabase SQL Editor and run
```

### 2. Update Frontend Routing

Add to `frontend/src/App.jsx`:

```jsx
import {ModelName}List from './components/{model}/{ModelName}List.jsx';

// In your routes:
<Route path="/{models}" element={<{ModelName}List />} />
```

### 3. Add Navigation Link

Add to your navigation menu:

```jsx
<Link to="/{models}">{emoji} {Display Plural}</Link>
```

### 4. Test the Implementation

```bash
# Start the development server
./start.sh

# Test in browser:
# - Navigate to /{models}
# - Create a new item
# - Edit an item
# - Delete an item
# - Verify validation
```

## Troubleshooting

### Script Won't Run

```bash
# Make executable
chmod +x scripts/add-model.sh

# Run from scripts directory
cd scripts
./add-model.sh
```

### Invalid Model Name

```
❌ Model name must be in PascalCase (e.g., Instructor, Horse, Rider)
```

**Solution**: Use PascalCase (first letter uppercase, no spaces)

### Invalid Field Name

```
❌ Field name must be in snake_case
```

**Solution**: Use snake_case (lowercase, underscores for spaces)

### Field Already Exists

```
❌ Field name already exists
```

**Solution**: Choose a different field name

### API Export Already Exists

```
⚠️  API export already exists, skipping
```

**Solution**: This is normal if regenerating. The script skips duplicate exports.

### Migration Fails

**Common causes:**
- Table already exists
- Invalid SQL syntax
- Missing database function (update_updated_at_column)

**Solution:**
- Drop existing table first (if safe)
- Check SQL syntax in migration file
- Ensure database functions exist

## Comparison with JavaScript Version

| Feature | JavaScript (add-model.js) | Bash (add-model.sh) |
|---------|---------------------------|---------------------|
| Code Generation | ❌ Stub methods only | ✅ Complete implementation |
| Dependencies | Node.js, npm packages | ✅ Pure bash |
| Template System | External files | ✅ Inline heredoc |
| Working Output | ❌ Non-functional | ✅ Production-ready |
| Maintenance | Complex | ✅ Simple |
| Error Handling | Basic | ✅ Comprehensive |
| User Experience | Good prompts | ✅ Excellent with colors |
| File Size | 671 lines | 1000+ lines (but complete) |
| Completion | ~30% | ✅ 100% |

## Advanced Usage

### Custom Modifications

The script can be easily modified for:

1. **Additional Field Types**
   - Add new case in field type selection
   - Add SQL type mapping
   - Add form input type

2. **Custom Validation**
   - Modify validation blocks generation
   - Add custom validation functions

3. **Different Styling**
   - Modify CSS generation section
   - Add custom classes

4. **Additional Features**
   - Add search functionality
   - Add filtering
   - Add pagination
   - Add sorting

### Integration with CI/CD

```bash
# Non-interactive mode (future enhancement)
./add-model.sh --model Instructor --fields name:string:required,email:email
```

## Best Practices

1. **Plan Your Model First**
   - List all fields before running script
   - Decide on field types
   - Consider relationships

2. **Use Consistent Naming**
   - Follow PascalCase for models
   - Follow snake_case for fields
   - Use descriptive names

3. **Test Immediately**
   - Apply migration right away
   - Test CRUD operations
   - Verify validation

4. **Version Control**
   - Commit generated files
   - Include migration in commit
   - Document changes

5. **Customize After Generation**
   - Add custom endpoints if needed
   - Enhance validation
   - Add business logic
   - Improve styling

## Future Enhancements

Potential improvements:

- [ ] Non-interactive mode with CLI flags
- [ ] Relationship support (foreign keys)
- [ ] Many-to-many junction tables
- [ ] Custom validation rules
- [ ] Search/filter generation
- [ ] Pagination support
- [ ] Export/import functionality
- [ ] API documentation generation
- [ ] Test file generation
- [ ] TypeScript support

## Support

For issues or questions:

1. Check this documentation
2. Review generated files
3. Check script output for errors
4. Verify prerequisites
5. Test with simple model first

## See Also

- [Adding Models Guide](../02-development/adding-models.md)
- [Modifying Models Guide](../02-development/modifying-models.md)
- [Scripts Catalog](../../scripts/SCRIPTS_CATALOG.md)
- [Script Reference](./script-reference.md)

---

**Last Updated**: December 2024  
**Script Version**: 1.0.0  
**Status**: Production Ready ✅