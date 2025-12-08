# 📅 Calendar System Documentation

The calendar system provides comprehensive lesson scheduling, template management, and conflict prevention for the equestrian facility management application.

## 📋 Core Features

### 🔄 Template Management
Create and manage recurring lesson templates and blocked periods with:
- **6 Lesson Types**: Private, Group, Training, Competition, Event, Blocked
- **Flexible Scheduling**: Daily, weekly, and monthly recurrence patterns
- **Participant Management**: Default participants and automatic horse assignment
- **Visual Editor**: Intuitive template creation interface

**📖 [Complete Template Management Guide](./template-management.md)**

### ⚡ Conflict Prevention System
- **Double-Booking Detection**: Prevents overlapping lessons
- **Blocked Period Enforcement**: Respects rest and maintenance periods
- **Override Functionality**: Force scheduling for exceptions
- **Real-Time Validation**: Instant availability checking

### 🤖 Automatic Generation
- **Daily Cron Job**: Maintains 4-week rolling window
- **Intelligent Conflicts**: Detects issues during generation
- **Performance Optimized**: Handles high volume efficiently
- **Error Recovery**: Retry mechanisms and logging

### 📊 Calendar Interface
- **Weekly View**: Time-slotted grid layout
- **Color Coding**: Visual lesson type identification
- **Interactive Cards**: Click to view/edit lesson details
- **Mobile Responsive**: Works on all device sizes

## 🗂️ Documentation Index

| Topic | Description |
|-------|-------------|
| **[Template Management](./template-management.md)** | Complete guide to templates and blocked periods |
| **[API Reference](./api-reference.md)** | Detailed endpoint documentation |
| **[Cron Configuration](./cron-configuration.md)** | Automatic generation setup |

## 🚀 Quick Start Examples

### Create a Weekly Group Lesson
```javascript
POST /api/calendar/templates
{
  "name": "Cours collectif débutants",
  "lesson_type": "group",
  "start_time": "19:00",
  "duration_minutes": 60,
  "valid_from": "2024-01-01",
  "recurrence_rule": {
    "frequency": "weekly",
    "byDay": ["monday", "wednesday"]
  },
  "max_participants": 8,
  "min_participants": 2
}
```

### Check Time Slot Availability
```javascript
POST /api/calendar/schedule/check-availability
{
  "date": "2024-01-15",
  "start_time": "19:00",
  "duration": 60
}
```

### Force Create Despite Conflicts
```javascript
POST /api/calendar/lessons
{
  "name": "Special lesson",
  "lesson_date": "2024-01-15",
  "start_time": "19:00",
  "duration_minutes": 60,
  "force_schedule": true  // Override conflicts
}
```

## 🗃️ Database Schema

The calendar system uses 5 main tables:

| Table | Purpose |
|-------|---------|
| `lesson_templates` | Recurring lesson definitions and blocked periods |
| `lesson_instances` | Actual scheduled lessons |
| `lesson_participants` | Rider and horse assignments |
| `template_default_participants` | Pre-assigned participants |
| `lesson_type_rules` | Configuration by lesson type |

**[View Complete Schema](../../database/migrations/20250115_create_calendar_system.sql)**

## 🏗️ Architecture Overview

```
Frontend (React)                     Backend (Cloudflare Workers)                Database (PostgreSQL)
┌─────────────────────────┐         ┌─────────────────────────┐                 ┌─────────────────────────┐
│ CalendarView            │  API →  │ handlers/calendar.js   │   SQL queries    │ lesson_templates        │
│ TemplateModal           │ ← REST  │ repositories/lesson-   │ ←──────────────→ │ lesson_instances        │
│ WeekView → DayColumn    │         │ repository.js          │                 │ lesson_participants     │
│ calendarApi.js          │         │ services/lesson-        │                 │ template_default_       │
│                         │         │ generator.js            │                 │ participants            │
└─────────────────────────┘         │ cron/generate-lessons.js│                 │ lesson_type_rules        │
                                      └─────────────────────────┘                 └─────────────────────────┘
```

## 🔧 Configuration

### Environment Variables
```bash
# Backend (Cloudflare Workers)
SUPABASE_URL=postgresql://...
DATABASE_URL=postgresql://...

# Frontend (React)
VITE_API_URL=https://your-worker.workers.dev/api
```

### Cron Job Setup
```bash
# Deploy to Cloudflare Workers
wrangler cron job create generate-lessons "0 2 * * *"

# Test manual execution
wrangler cron job trigger generate-lessons
```

## 📈 Performance Features

- **Indexed Queries**: Optimized date and time range searches
- **Batch Processing**: Efficient template generation
- **Lazy Loading**: Progressive calendar view rendering
- **Caching**: Template queries cached for 5 minutes
- **Rate Limiting**: API endpoints protected from abuse

## 🐛 Common Issues & Solutions

### Templates Not Appearing
**Problem**: Template list shows empty despite database records

**Solution**: 
1. Check API response format (should return `results` array)
2. Verify `is_active` flag in database
3. Review browser console for JavaScript errors

### Conflict Detection Not Working
**Problem**: Lessons can be double-booked despite restrictions

**Solution**:
1. Verify timezone handling (use UTC for storage)
2. Check time format (24-hour HH:MM format)
3. Test with manual time calculations
4. Review database indexes on time columns

### Cron Job Not Running
**Problem**: Automatic lesson generation fails

**Solution**:
1. Verify Cloudflare Workers deployment
2. Check cron trigger configuration in `wrangler.toml`
3. Review logs in Cloudflare dashboard
4. Test manual lesson generation via API

### Debug Commands
```bash
# Check database tables
psql $DATABASE_URL -c "\dt lesson_*"

# Test API endpoints
curl -X GET "$API_URL/api/calendar/templates"

# Manual cron execution
wrangler cron job trigger generate-lessons

# View real-time logs
wrangler tail --format pretty
```

## 🔄 Recent Updates

### Version 1.2.0 (Current)
- ✅ **Template List Bug Fix**: Fixed response format mismatch
- ✅ **UI Consistency**: Updated styling to match app design
- ✅ **Double-Booking Prevention**: Added conflict detection with override
- ✅ **Enhanced Cron Job**: Improved conflict checking during generation
- ✅ **Documentation Cleanup**: Consolidated and updated documentation

### Version 1.1.0
- Added blocked periods functionality
- Implemented automatic lesson generation
- Added lesson tracking for instructor

## 📚 Related Documentation

- **[Main Project README](../../README.md)**: Overview of all features
- **[Getting Started Guide](../../docs/01-getting-started/)**: Setup and installation
- **[API Documentation](../../docs/05-api/)**: General API patterns
- **[Deployment Guide](../../docs/03-deployment/)**: Production deployment

## 🎯 Future Roadmap

### Planned Features
- [ ] **Template Categories**: Group by skill level or discipline
- [ ] **Advanced Recurrence**: Complex patterns like "first Monday"
- [ ] **Template Copying**: Duplicate with modifications
- [ ] **Bulk Operations**: Mass activate/deactivate templates
- [ ] **Calendar Export**: PDF/Excel export capabilities
- [ ] **Notification System**: Email/SMS reminders for lessons

### Performance Improvements
- [ ] **Database Optimization**: Additional indexes for complex queries
- [ ] **Frontend Caching**: Service worker for offline viewing
- [ ] **API Optimization**: GraphQL for efficient data fetching
- [ ] **Real-Time Updates**: WebSocket integration

---

## 📞 Support & Contributing

### Getting Help
1. **Check this documentation first**
2. **Review the troubleshooting section**
3. **Search existing GitHub issues**
4. **Create a new issue with detailed information**

### Contributing
1. Fork the repository
2. Create a feature branch
3. Follow the existing code patterns
4. Add tests for new functionality
5. Submit a pull request

**Include in bug reports:**
- Environment details (dev/prod)
- Error messages and stack traces
- Steps to reproduce the issue
- Expected vs actual behavior
- Browser/device information

---

**Version**: 1.2.0  
**Last Updated**: 2025-01-15  
**Maintainer**: Equestrian Project Team