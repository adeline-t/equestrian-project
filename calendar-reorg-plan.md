# Calendar Component Reorganization Plan

## Current Issues Identified

### 1. **Scattered File Structure**
- `CalendarView.jsx` exists at root level
- `CalendarView/` subdirectory with subcomponents
- `DayColumn.jsx` exists at root level
- `DayColumn/` subdirectory with subcomponents
- `WeekView.jsx` at root level
- Inconsistent organization pattern

### 2. **Calendar Structure Analysis**
```
calendar/
├── CalendarView.jsx              # Main calendar view
├── CalendarView/                 # Subcomponents
│   ├── CalendarFilters.jsx       # Filter controls
│   └── CalendarHeader.jsx        # Header with navigation
├── DayColumn.jsx                 # Day column component
├── DayColumn/                    # Subcomponents
│   ├── DayGrid.jsx              # Grid display
│   └── DayHeader.jsx            # Column header
└── WeekView.jsx                  # Week view component
```

## Proposed New Structure

```
calendar/
├── CalendarView/                 # Main calendar view component
│   ├── index.jsx                 # Main CalendarView
│   ├── CalendarFilters/          # Filter controls
│   │   └── index.jsx
│   ├── CalendarHeader/           # Header with navigation
│   │   └── index.jsx
│   └── DayColumn/                # Day display columns
│       ├── index.jsx             # Main DayColumn
│       ├── DayGrid/              # Grid display
│       │   └── index.jsx
│       └── DayHeader/            # Column header
│           └── index.jsx
└── WeekView/                     # Week view component
    └── index.jsx
```

## Rationale

### 1. **Logical Hierarchy**
- `CalendarView` is the main container
- `DayColumn` is a subcomponent of `CalendarView`
- `WeekView` could be a separate view or integrated into CalendarView
- Each component with subcomponents gets its own directory

### 2. **Consistent Pattern**
- All major components in their own directories
- `index.jsx` as the main export
- Subcomponents in nested directories
- Clear component boundaries

### 3. **Import Clarity**
- Easy to understand component relationships
- Predictable import paths
- Clear separation of concerns

## Migration Steps

### Phase 1: Create New Directory Structure
1. Create `CalendarView/index.jsx` from existing `CalendarView.jsx`
2. Create `CalendarView/CalendarFilters/index.jsx`
3. Create `CalendarView/CalendarHeader/index.jsx`
4. Move `DayColumn.jsx` to `CalendarView/DayColumn/index.jsx`
5. Move `DayColumn/DayGrid.jsx` to `CalendarView/DayColumn/DayGrid/index.jsx`
6. Move `DayColumn/DayHeader.jsx` to `CalendarView/DayColumn/DayHeader/index.jsx`
7. Create `WeekView/index.jsx` from existing `WeekView.jsx`

### Phase 2: Update Import Statements
1. Update all imports within calendar components
2. Update external imports to calendar components
3. Verify no broken imports

### Phase 3: Cleanup
1. Remove old root-level files
2. Verify application works
3. Commit changes

## Expected Benefits

✅ **Clear hierarchy** - CalendarView contains DayColumn
✅ **Consistent structure** - All components follow same pattern
✅ **Easy navigation** - Predictable file locations
✅ **Better maintainability** - Clear component relationships
✅ **Scalable** - Easy to add new subcomponents