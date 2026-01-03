# Comprehensive Frontend Refactoring Plan

## Files to Remove (Old/Unused)
1. `components/lessons/LessonModal.jsx` (1,173 lines) - OLD, replaced by LessonModal/index.jsx
2. `components/lessons/SingleLessonModal.jsx` (773 lines) - OLD, replaced by SingleLessonModal/index.jsx
3. `components/lessons/BlockedTimeModal.jsx` (330 lines) - OLD, replaced by BlockedTimeModal/index.jsx

## Files to Refactor (Priority Order)

### High Priority - Large Components
1. ✅ RiderCard.jsx (772 lines) - NEEDS REFACTORING
2. ✅ HorsesList.jsx (559 lines) - NEEDS REFACTORING
3. ✅ TemplateModal.jsx (488 lines) - NEEDS REFACTORING
4. ✅ PairingsList.jsx (450 lines) - NEEDS REFACTORING
5. ✅ PackageForm.jsx (441 lines) - NEEDS REFACTORING
6. ✅ RiderPackages.jsx (433 lines) - NEEDS REFACTORING
7. ✅ packagesList.jsx (427 lines) - NEEDS REFACTORING
8. ✅ HorseForm.jsx (422 lines) - NEEDS REFACTORING
9. ✅ RidersList.jsx (385 lines) - NEEDS REFACTORING
10. ✅ RiderForm.jsx (345 lines) - NEEDS REFACTORING
11. ✅ PairingForm.jsx (336 lines) - NEEDS REFACTORING
12. ✅ TemplateManagement.jsx (319 lines) - NEEDS REFACTORING

### Medium Priority - Calendar Components
13. ✅ CalendarView.jsx (299 lines) - NEEDS REFACTORING
14. ✅ DayColumn.jsx (284 lines) - NEEDS REFACTORING
15. ✅ LessonCard.jsx (262 lines) - NEEDS REFACTORING
16. ✅ WeekView.jsx (56 lines) - MINOR REFACTORING

## Refactoring Checklist for Each Component
- [ ] Remove old file versions
- [ ] Use common Modal component
- [ ] Use Portal for overlays
- [ ] Use shared utilities (formatters, validators)
- [ ] Use shared constants (lesson types, statuses)
- [ ] Use custom hooks where applicable
- [ ] Extract duplicated code
- [ ] Reorganize CSS (use common styles)
- [ ] Add proper prop validation
- [ ] Improve error handling
- [ ] Add loading states