# Lesson Template Management System

## Overview
The Lesson Template Management System provides a comprehensive interface for creating, managing, and organizing recurring lesson templates in the equestrian center management application.

## Features

### Backend API Endpoints

All endpoints are prefixed with `/api/calendar/templates`

#### 1. List Templates
- **Endpoint**: `GET /api/calendar/templates`
- **Query Parameters**:
  - `active` (boolean): Filter by active status
  - `lesson_type` (string): Filter by lesson type
  - `exclude_blocked` (boolean): Exclude blocked periods
- **Response**: Array of template objects

#### 2. Get Template Details
- **Endpoint**: `GET /api/calendar/templates/:id`
- **Response**: Single template object with full details

#### 3. Create Template
- **Endpoint**: `POST /api/calendar/templates`
- **Request Body**:
```json
{
  "name": "Cours du Lundi Soir",
  "description": "Cours collectif hebdomadaire",
  "lesson_type": "group",
  "start_time": "19:00",
  "duration_minutes": 60,
  "valid_from": "2024-01-01",
  "valid_until": "2024-12-31",
  "max_participants": 8,
  "min_participants": 2,
  "recurrence_rule": {
    "frequency": "weekly",
    "interval": 1,
    "byDay": ["monday"],
    "startTime": "19:00",
    "duration": 60
  }
}
```
- **Response**: Created template object
- **Status**: 201 Created

#### 4. Update Template
- **Endpoint**: `PUT /api/calendar/templates/:id`
- **Request Body**: Partial template object (only fields to update)
- **Response**: Updated template object

#### 5. Delete Template
- **Endpoint**: `DELETE /api/calendar/templates/:id`
- **Query Parameters**:
  - `delete_future_instances` (boolean): Also delete future lesson instances
- **Response**: Success message

## Data Model

### Lesson Template Schema

```sql
CREATE TABLE lesson_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    lesson_type VARCHAR(50) NOT NULL,
    recurrence_rule JSONB NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    valid_from DATE NOT NULL,
    valid_until DATE,
    max_participants INTEGER,
    min_participants INTEGER DEFAULT 1,
    instructor_id INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);
```

### Lesson Types

1. **private** - Cours particulier (1 participant)
2. **group** - Cours collectif (2-8 participants)
3. **training** - Stage (3-12 participants)
4. **competition** - Concours (unlimited participants)
5. **event** - Événement (flexible)
6. **blocked** - Plage bloquée (0 participants)

### Recurrence Rule Structure

```json
{
  "frequency": "weekly|daily|monthly",
  "interval": 1,
  "byDay": ["monday", "wednesday", "friday"],
  "byMonthDay": 15,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

## Frontend Components

### TemplateManagement Component

Main component for managing lesson templates.

**Location**: `/frontend/src/components/templates/TemplateManagement.jsx`

**Features**:
- List all templates with filtering
- Create new templates
- Edit existing templates
- Delete templates
- Toggle active/inactive status
- Visual indicators for lesson types

**Props**: None (standalone component)

### TemplateModal Component

Modal dialog for creating and editing templates (reused from calendar).

**Location**: `/frontend/src/components/calendar/TemplateModal.jsx`

**Props**:
- `template` (object, optional): Template to edit
- `onClose` (function): Callback when modal closes
- `onSuccess` (function): Callback when template is saved

## Usage Examples

### Creating a Weekly Group Lesson

```javascript
const newTemplate = {
  name: "Cours Collectif Mercredi",
  description: "Cours pour cavaliers intermédiaires",
  lesson_type: "group",
  start_time: "18:00",
  duration_minutes: 60,
  valid_from: "2024-01-01",
  valid_until: "2024-12-31",
  max_participants: 6,
  min_participants: 3,
  recurrence_rule: {
    frequency: "weekly",
    interval: 1,
    byDay: ["wednesday"]
  }
};

await templatesApi.create(newTemplate);
```

### Filtering Templates

```javascript
// Get only active group lessons
const activeGroupLessons = await templatesApi.getAll({
  active: true,
  lessonType: 'group'
});

// Get all templates excluding blocked periods
const lessons = await templatesApi.getAll({
  excludeBlocked: true
});
```

### Updating a Template

```javascript
// Update only specific fields
await templatesApi.update(templateId, {
  max_participants: 8,
  description: "Updated description"
});

// Toggle active status
await templatesApi.update(templateId, {
  is_active: false
});
```

## Validation Rules

### Backend Validation

1. **Required Fields**:
   - `name`: Template name
   - `lesson_type`: Must be valid lesson type
   - `recurrence_rule`: Valid recurrence configuration
   - `start_time`: Valid time format (HH:MM)
   - `duration_minutes`: Positive integer
   - `valid_from`: Valid date

2. **Business Rules**:
   - `max_participants` must be >= `min_participants`
   - `duration_minutes` must be > 0
   - `valid_until` must be >= `valid_from` (if provided)
   - Blocked periods must have 0 participants

3. **Recurrence Rule Validation**:
   - `frequency` must be: daily, weekly, or monthly
   - Weekly frequency requires `byDay` array
   - Monthly frequency requires `byMonthDay`
   - `interval` must be between 1 and 99

### Frontend Validation

1. **Form Validation**:
   - All required fields must be filled
   - Time format validation
   - Date range validation
   - Participant count validation

2. **User Feedback**:
   - Real-time validation messages
   - Error highlighting
   - Success notifications

## Integration with Calendar System

The template management system is fully integrated with the calendar:

1. **Automatic Instance Generation**:
   - When a template is created, lesson instances are automatically generated for the next 4 weeks
   - A cron job runs daily to maintain a rolling 4-week window

2. **Template Modifications**:
   - Changes to templates don't affect existing lesson instances
   - Only future instances are affected

3. **Deletion Behavior**:
   - Deleting a template can optionally delete future unmodified instances
   - Past instances are preserved for historical records

## API Client Usage

The frontend uses the `templatesApi` service:

```javascript
import { templatesApi } from '../../services/calendarApi';

// Get all templates
const templates = await templatesApi.getAll();

// Get specific template
const template = await templatesApi.getById(id);

// Create template
const newTemplate = await templatesApi.create(data);

// Update template
const updated = await templatesApi.update(id, data);

// Delete template
await templatesApi.delete(id, deleteFutureInstances);

// Get default participants
const participants = await templatesApi.getParticipants(id);

// Generate instances
const result = await templatesApi.generate(id, startDate, endDate);

// Preview occurrences
const preview = await templatesApi.preview(id, startDate, endDate);
```

## Error Handling

### Backend Errors

- **400 Bad Request**: Invalid input data
- **404 Not Found**: Template doesn't exist
- **500 Internal Server Error**: Server-side error

### Frontend Error Handling

```javascript
try {
  await templatesApi.create(data);
} catch (error) {
  if (error.response?.status === 400) {
    // Handle validation errors
    console.error('Validation error:', error.response.data);
  } else {
    // Handle other errors
    console.error('Error creating template:', error);
  }
}
```

## Best Practices

1. **Template Naming**:
   - Use descriptive names (e.g., "Cours Collectif Lundi 19h")
   - Include day and time in the name for clarity

2. **Recurrence Rules**:
   - Keep recurrence rules simple and predictable
   - Use end dates for seasonal templates

3. **Participant Limits**:
   - Set realistic min/max participants based on lesson type
   - Consider instructor capacity

4. **Active Status**:
   - Deactivate templates instead of deleting them
   - Preserve historical data

5. **Blocked Periods**:
   - Use blocked periods for vacations and maintenance
   - Set appropriate date ranges

## Testing

### Manual Testing Checklist

- [ ] Create a new template
- [ ] Edit an existing template
- [ ] Delete a template
- [ ] Toggle active/inactive status
- [ ] Filter templates by type
- [ ] Filter templates by status
- [ ] Verify lesson instances are generated
- [ ] Check validation errors
- [ ] Test with different lesson types

### API Testing

Use tools like Postman or curl to test the API endpoints:

```bash
# Get all templates
curl http://localhost:8787/api/calendar/templates

# Create a template
curl -X POST http://localhost:8787/api/calendar/templates \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Template","lesson_type":"group",...}'

# Update a template
curl -X PUT http://localhost:8787/api/calendar/templates/1 \
  -H "Content-Type: application/json" \
  -d '{"is_active":false}'

# Delete a template
curl -X DELETE http://localhost:8787/api/calendar/templates/1
```

## Troubleshooting

### Common Issues

1. **Templates not appearing in calendar**:
   - Check if template is active
   - Verify recurrence rule is valid
   - Check date range (valid_from/valid_until)

2. **Instances not generating**:
   - Verify cron job is running
   - Check for blocked periods
   - Review recurrence rule configuration

3. **Validation errors**:
   - Check all required fields
   - Verify participant counts
   - Validate date ranges

## Future Enhancements

- [ ] Bulk template operations
- [ ] Template duplication
- [ ] Template import/export
- [ ] Advanced recurrence patterns
- [ ] Template categories/tags
- [ ] Template usage statistics
- [ ] Email notifications for template changes