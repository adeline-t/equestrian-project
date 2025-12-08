# Template Management System

## Overview
The Template Management System provides a comprehensive interface for creating, managing, and organizing recurring lesson templates and blocked periods in the equestrian center management application.

## Features

### Template Types
- **Private Lessons** (`private`): One-on-one lessons with 1 participant
- **Group Lessons** (`group`): Group lessons with 2-8 participants
- **Training Sessions** (`training`): Extended training sessions with 3-12 participants
- **Competitions** (`competition`): Events with unlimited participants
- **Events** (`event`): Flexible events with custom settings
- **Blocked Periods** (`blocked`): Time slots where no lessons can be scheduled

### Core Functionality
- **Create/Edit/Delete** templates with full CRUD operations
- **Recurrence Rules**: Daily, weekly, and monthly patterns
- **Automatic Lesson Generation**: 4-week rolling window via cron job
- **Conflict Detection**: Prevents double-booking with override options
- **Participant Management**: Default participants for recurring lessons

## Backend API Endpoints

All endpoints are prefixed with `/api/calendar/templates`

#### 1. List Templates
- **Endpoint**: `GET /api/calendar/templates`
- **Query Parameters**:
  - `active` (boolean): Filter by active status
  - `lesson_type` (string): Filter by lesson type
  - `exclude_blocked` (boolean): Exclude blocked periods
- **Response**: 
```json
{
  "success": true,
  "results": [
    {
      "id": 1,
      "name": "Cours collectif débutants",
      "lesson_type": "group",
      "start_time": "19:00",
      "duration_minutes": 60,
      "recurrence_rule": {...},
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 2. Create Template
- **Endpoint**: `POST /api/calendar/templates`
- **Required Fields**: `name`, `lesson_type`, `recurrence_rule`, `start_time`, `duration_minutes`, `valid_from`
- **Optional Fields**: `description`, `valid_until`, `max_participants`, `min_participants`

#### 3. Get Template Details
- **Endpoint**: `GET /api/calendar/templates/:id`
- **Response**: Single template object with all details

#### 4. Update Template
- **Endpoint**: `PUT /api/calendar/templates/:id`
- **Body**: Partial template object with fields to update

#### 5. Delete Template
- **Endpoint**: `DELETE /api/calendar/templates/:id`
- **Query Parameter**: `delete_future_instances=true` to also delete generated lesson instances

## Frontend Components

### TemplateManagement.jsx
Main component for displaying and managing templates.

**Key Features**:
- Filter by status and lesson type
- Card-based layout with visual indicators
- Inline actions for edit, toggle active, delete
- Responsive design matching app theme

### TemplateModal.jsx
Modal component for creating and editing templates.

**Form Sections**:
1. **General Information**: Name, description, lesson type, time, duration
2. **Recurrence**: Frequency, interval, day selection
3. **Validity Period**: Start and end dates
4. **Capacity**: Min/max participants (not for blocked periods)

## Conflict Prevention & Override

### Double-Booking Detection
The system now prevents scheduling multiple lessons at the same time slot:

```javascript
// Check for conflicts before creating
const conflicts = await lessonRepo.checkAllConflicts(date, startTime, endTime);

if (conflicts.has_conflicts && !force_schedule) {
  return error with conflict details;
}
```

### Force Schedule Option
To override conflict detection, include `force_schedule: true` in the request:

```javascript
// Create lesson despite conflicts
POST /api/calendar/lessons
{
  "name": "Special Lesson",
  "force_schedule": true,
  // ... other fields
}
```

### Conflict Types
- **Blocked Periods**: Conflicts with rest/maintenance periods
- **Lesson Conflicts**: Conflicts with other scheduled lessons

## Database Schema

### lesson_templates Table
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Recurrence Rule Structure
```json
{
  "frequency": "weekly",
  "interval": 1,
  "byDay": ["monday", "wednesday"],
  "startTime": "19:00",
  "duration": 60
}
```

## Usage Examples

### Create a Weekly Group Lesson
```javascript
POST /api/calendar/templates
{
  "name": "Cours collectif Lundi",
  "description": "Cours pour cavaliers débutants",
  "lesson_type": "group",
  "start_time": "19:00",
  "duration_minutes": 60,
  "valid_from": "2024-01-01",
  "recurrence_rule": {
    "frequency": "weekly",
    "interval": 1,
    "byDay": ["monday"],
    "startTime": "19:00",
    "duration": 60
  },
  "max_participants": 8,
  "min_participants": 2
}
```

### Create a Blocked Period
```javascript
POST /api/calendar/templates
{
  "name": "Vacances d'été",
  "description": "Période de fermeture estivale",
  "lesson_type": "blocked",
  "start_time": "09:00",
  "duration_minutes": 480,
  "valid_from": "2024-07-01",
  "valid_until": "2024-08-31",
  "recurrence_rule": {
    "frequency": "daily",
    "interval": 1,
    "startTime": "09:00",
    "duration": 480
  }
}
```

## Recent Improvements

### Bug Fixes
- **Template List Display**: Fixed response format mismatch between backend (`results`) and frontend
- **Blocked Template Visibility**: Ensured all template types appear in the list view

### UI Enhancements
- **Consistent Styling**: Updated to match calendar component design patterns
- **Responsive Design**: Improved mobile layout and breakpoints
- **Visual Indicators**: Better color coding for lesson types

### Scheduling Logic
- **Double-Booking Prevention**: Added conflict detection for regular lessons
- **Override Functionality**: Force schedule option for exceptional circumstances
- **Enhanced Cron Job**: Conflict checking during automatic lesson generation

## Integration Points

### Calendar Integration
- Templates generate lesson instances visible in the calendar
- Blocked periods prevent lesson creation in time slots
- Conflict checking applies to both manual and automatic creation

### Participant Management
- Default participants can be assigned to templates
- Automatic horse assignment via existing pairing system
- Participant limits enforced during lesson creation

### Notification System
- Conflict warnings during lesson creation
- Success/error messages for template operations
- Audit logging for forced scheduling decisions

## Future Enhancements

### Planned Features
- **Template Categories**: Group templates by skill level or discipline
- **Advanced Recurrence**: Complex patterns like "first Monday of month"
- **Template Copying**: Duplicate templates with modifications
- **Bulk Operations**: Mass activation/deactivation of templates

### Performance Optimizations
- **Caching**: Cache template queries for better performance
- **Batch Generation**: Optimize cron job for large numbers of templates
- **Index Optimization**: Database query performance improvements

## Troubleshooting

### Common Issues

**Templates not appearing in list**
- Check response format in network tab
- Verify `is_active` status in database
- Ensure backend returns `results` array

**Conflict detection not working**
- Verify `checkAllConflicts` method implementation
- Check time zone handling in date calculations
- Ensure lesson instances have correct `end_time` values

**Force schedule not working**
- Include `force_schedule: true` in request body
- Check user permissions for override functionality
- Verify audit logging in console output

### Debug Commands
```sql
-- Check all templates
SELECT * FROM lesson_templates ORDER BY created_at DESC;

-- Check for conflicts on specific date
SELECT * FROM lesson_instances 
WHERE lesson_date = '2024-01-01' 
AND status != 'cancelled'
ORDER BY start_time;
```

## Support
For technical support or questions about the Template Management System, please refer to:
- API Documentation: `/docs/10-calendar-system/api-reference.md`
- Database Schema: `/database/migrations/20250115_create_calendar_system.sql`
- Frontend Components: `/frontend/src/components/templates/`