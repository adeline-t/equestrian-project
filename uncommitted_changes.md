# Uncommitted Changes

Generated: 2026-01-07 18:11:30

---

## Modified Files

### .gitignore

```diff
diff --git a/.gitignore b/.gitignore
index ccef611f..ca179d72 100644
--- a/.gitignore
+++ b/.gitignore
@@ -159,3 +159,5 @@ docs/generated/
 # ========================================
 gitignored_files.txt
 copy_gitignored.sh
+frontend/src/components/calendar/export_files.sh
+frontend/fix-imports.sh
```

### frontend/src/App.jsx

```diff
diff --git a/frontend/src/App.jsx b/frontend/src/App.jsx
index bd17b942..18eb7ab9 100644
--- a/frontend/src/App.jsx
+++ b/frontend/src/App.jsx
@@ -7,7 +7,7 @@ import PairingsList from './components/pairings/PairingsList';
 import PackagesList from './components/packages/PackagesList';
 import CalendarView from './components/calendar/CalendarView';
 import TemplateManagement from './components/templates/TemplateManagement';
-import { Icons } from './lib/libraries/icons.jsx';
+import { Icons } from './lib/icons.jsx';
 
 function App() {
   return (
```

### frontend/src/components/calendar/CalendarView/CalendarFilters.jsx

```diff
diff --git a/frontend/src/components/calendar/CalendarView/CalendarFilters.jsx b/frontend/src/components/calendar/CalendarView/CalendarFilters.jsx
index c5d1e6b1..6b1bbc1f 100644
--- a/frontend/src/components/calendar/CalendarView/CalendarFilters.jsx
+++ b/frontend/src/components/calendar/CalendarView/CalendarFilters.jsx
@@ -1,29 +1,34 @@
 import React from 'react';
-import { Icons } from '../../../lib/libraries/icons.jsx';
-import { CALENDAR_LESSON_TYPE_FILTERS, CALENDAR_STATUS_FILTERS } from '../../../constants/domains/filters';
+import { Icons } from '../../../lib/icons';
+import {
+  CALENDAR_LESSON_TYPE_FILTERS,
+  CALENDAR_STATUS_FILTERS,
+} from '../../../lib/domains/filters';
+import '../../../styles/components/calendar.css';
+import '../../../styles/common/index.css';
 
 const CalendarFilters = ({ filters, onFilterChange, onCreateLesson, onCreateBlockedTime }) => {
   const handleCreateLesson = () => {
-    console.log('Creating lesson from filters');
     onCreateLesson();
   };
 
   const handleCreateBlockedTime = () => {
-    console.log('Creating blocked time from filters');
     onCreateBlockedTime();
   };
 
   return (
-    <div className="calendar-filters">
+    <div className="calendar-filters" role="region" aria-label="Filtres du calendrier">
       <div className="filters-row">
         {/* Filter Controls */}
         <div className="filters-controls">
           <div className="filter-group">
-            <label>Type de cours:</label>
+            <label htmlFor="lesson-type-filter">Type de cours:</label>
             <select
+              id="lesson-type-filter"
               value={filters.lessonType}
               onChange={(e) => onFilterChange('lessonType', e.target.value)}
               className="form-select"
+              aria-label="Filtrer par type de cours"
             >
               {CALENDAR_LESSON_TYPE_FILTERS.map((type) => (
                 <option key={type.value} value={type.value}>
@@ -34,11 +39,13 @@ const CalendarFilters = ({ filters, onFilterChange, onCreateLesson, onCreateBloc
           </div>
 
           <div className="filter-group">
-            <label>Statut:</label>
+            <label htmlFor="status-filter">Statut:</label>
             <select
+              id="status-filter"
               value={filters.status}
               onChange={(e) => onFilterChange('status', e.target.value)}
               className="form-select"
+              aria-label="Filtrer par statut"
             >
               {CALENDAR_STATUS_FILTERS.map((status) => (
                 <option key={status.value} value={status.value}>
@@ -55,6 +62,7 @@ const CalendarFilters = ({ filters, onFilterChange, onCreateLesson, onCreateBloc
             className="btn btn-success"
             onClick={handleCreateLesson}
             title="Créer un nouveau cours"
+            aria-label="Créer un nouveau cours"
           >
             <Icons.Add />
             <span className="btn-text">Nouveau cours</span>
@@ -64,6 +72,7 @@ const CalendarFilters = ({ filters, onFilterChange, onCreateLesson, onCreateBloc
             className="btn btn-warning"
             onClick={handleCreateBlockedTime}
             title="Bloquer un créneau"
+            aria-label="Bloquer un créneau horaire"
           >
             <Icons.Blocked />
             <span className="btn-text">Bloquer un créneau</span>
```

### frontend/src/components/calendar/CalendarView/CalendarHeader.jsx

```diff
diff --git a/frontend/src/components/calendar/CalendarView/CalendarHeader.jsx b/frontend/src/components/calendar/CalendarView/CalendarHeader.jsx
index d0a3a7dc..0d68b352 100644
--- a/frontend/src/components/calendar/CalendarView/CalendarHeader.jsx
+++ b/frontend/src/components/calendar/CalendarView/CalendarHeader.jsx
@@ -1,27 +1,33 @@
 import React from 'react';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import '../../../styles/components/calendar.css';
 
 const CalendarHeader = ({ weekTitle, onPrevWeek, onNextWeek, onToday, stats }) => {
   return (
-    <div className="calendar-header">
+    <div className="calendar-header" role="banner">
       {/* Top: Title with Navigation */}
       <div className="calendar-header-title">
         <div className="calendar-title-section">
           <h2 className="calendar-title">{weekTitle}</h2>
         </div>
 
-        <div className="calendar-nav-buttons">
+        <div className="calendar-nav-buttons" role="group" aria-label="Navigation de la semaine">
           <button
             className="btn btn-secondary btn-sm"
             onClick={onPrevWeek}
             title="Semaine précédente"
+            aria-label="Aller à la semaine précédente"
           >
             <Icons.ChevronLeft />
             <span className="btn-text">Précédente</span>
           </button>
 
-          <button className="btn btn-primary" onClick={onToday} title="Aller à aujourd'hui">
+          <button
+            className="btn btn-primary"
+            onClick={onToday}
+            title="Aller à aujourd'hui"
+            aria-label="Aller à la semaine actuelle"
+          >
             <Icons.Calendar />
             <span className="btn-text">Aujourd'hui</span>
           </button>
@@ -30,6 +36,7 @@ const CalendarHeader = ({ weekTitle, onPrevWeek, onNextWeek, onToday, stats }) =
             className="btn btn-secondary btn-sm"
             onClick={onNextWeek}
             title="Semaine suivante"
+            aria-label="Aller à la semaine suivante"
           >
             <span className="btn-text">Suivante</span>
             <Icons.ChevronRight />
@@ -39,21 +46,25 @@ const CalendarHeader = ({ weekTitle, onPrevWeek, onNextWeek, onToday, stats }) =
 
       {/* Bottom: Stats */}
       <div className="calendar-header-bottom">
-        <div className="calendar-stats-compact">
+        <div
+          className="calendar-stats-compact"
+          role="region"
+          aria-label="Statistiques de la semaine"
+        >
           <div className="stat-compact-item">
-            <Icons.List style={{ fontSize: '0.9rem', color: '#2c5aa0' }} />
+            <Icons.List style={{ fontSize: '0.9rem', color: '#2c5aa0' }} aria-hidden="true" />
             <span className="stat-compact-value">{stats.total}</span>
             <span className="stat-compact-label">Total</span>
           </div>
 
           <div className="stat-compact-item">
-            <Icons.Check style={{ fontSize: '0.9rem', color: '#22543d' }} />
+            <Icons.Check style={{ fontSize: '0.9rem', color: '#22543d' }} aria-hidden="true" />
             <span className="stat-compact-value">{stats.confirmed}</span>
             <span className="stat-compact-label">Confirmés</span>
           </div>
 
           <div className="stat-compact-item">
-            <Icons.Blocked style={{ fontSize: '0.9rem', color: '#7c2d12' }} />
+            <Icons.Blocked style={{ fontSize: '0.9rem', color: '#7c2d12' }} aria-hidden="true" />
             <span className="stat-compact-value">{stats.blocked}</span>
             <span className="stat-compact-label">Bloqués</span>
           </div>
```

### frontend/src/components/calendar/CalendarView/index.jsx

```diff
diff --git a/frontend/src/components/calendar/CalendarView/index.jsx b/frontend/src/components/calendar/CalendarView/index.jsx
index a55974f6..9e6a50f8 100644
--- a/frontend/src/components/calendar/CalendarView/index.jsx
+++ b/frontend/src/components/calendar/CalendarView/index.jsx
@@ -1,14 +1,18 @@
 import React from 'react';
 import { useCalendarView } from '../../../hooks/useCalendarView';
 import WeekView from '../WeekView.jsx';
-import LessonModal from '../../lessons/LessonModal';
-import SingleLessonModal from '../../lessons/SingleLessonModal';
-import BlockedTimeModal from '../../lessons/BlockedTimeModal.jsx';
 import CalendarHeader from './CalendarHeader.jsx';
 import CalendarFilters from './CalendarFilters.jsx';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import CalendarModals from './CalendarModals.jsx';
+import CalendarLoading from './CalendarLoading.jsx';
+import CalendarError from './CalendarError.jsx';
+import ErrorBoundary from '../../common/ErrorBoundary.jsx';
+import '../../../styles/common/index.css';
 import '../../../styles/components/calendar.css';
 
+/**
+ * Main Calendar View Component
+ */
 function CalendarView() {
   const {
     // State
@@ -40,36 +44,21 @@ function CalendarView() {
 
     // Utility functions
     loadWeekData,
-
-    // State setters
-    clearError,
   } = useCalendarView();
 
+  // Loading state
   if (loading) {
-    return (
-      <div className="calendar-loading">
-        <Icons.Loading className="spin" style={{ fontSize: '48px', marginBottom: '16px' }} />
-        <h3>Chargement du calendrier...</h3>
-        <p>Veuillez patienter pendant que nous chargeons vos cours</p>
-      </div>
-    );
+    return <CalendarLoading />;
   }
 
+  // Error state
   if (error) {
-    return (
-      <div className="calendar-error">
-        <Icons.Warning style={{ fontSize: '48px', marginBottom: '16px', color: '#e53e3e' }} />
-        <h3>Erreur de chargement</h3>
-        <p>{error}</p>
-        <button className="btn btn-primary" onClick={loadWeekData}>
-          <Icons.Refresh /> Réessayer
-        </button>
-      </div>
-    );
+    return <CalendarError error={error} onRetry={loadWeekData} />;
   }
 
+  // Main render
   return (
-    <div className="calendar-view">
+    <div className="calendar-view" role="main" aria-label="Vue calendrier">
       <CalendarHeader
         weekTitle={weekTitle}
         onPrevWeek={handlePrevWeek}
@@ -94,37 +83,27 @@ function CalendarView() {
         />
       </div>
 
-      {/* LessonModal for viewing/editing existing lessons */}
-      {showLessonModal && selectedLesson && selectedLesson.id && (
-        <LessonModal
-          lesson={selectedLesson}
-          onClose={closeLessonModal}
-          onUpdate={handleModalSuccess}
-        />
-      )}
-
-      {/* SingleLessonModal for creating new lessons */}
-      {showSingleLessonModal && (
-        <SingleLessonModal
-          lesson={null}
-          onClose={closeSingleLessonModal}
-          onSuccess={handleModalSuccess}
-          initialDate={selectedLesson?.date}
-          initialStartTime={selectedLesson?.start_time}
-          initialEndTime={selectedLesson?.end_time}
-        />
-      )}
-
-      {/* BlockedTimeModal for creating blocked time */}
-      {showBlockedTimeModal && (
-        <BlockedTimeModal
-          blockedTime={null}
-          onClose={closeBlockedTimeModal}
-          onSuccess={handleModalSuccess}
-        />
-      )}
+      <CalendarModals
+        showLessonModal={showLessonModal}
+        showSingleLessonModal={showSingleLessonModal}
+        showBlockedTimeModal={showBlockedTimeModal}
+        selectedLesson={selectedLesson}
+        onCloseLessonModal={closeLessonModal}
+        onCloseSingleLessonModal={closeSingleLessonModal}
+        onCloseBlockedTimeModal={closeBlockedTimeModal}
+        onModalSuccess={handleModalSuccess}
+      />
     </div>
   );
 }
 
-export default CalendarView;
+/**
+ * Export with Error Boundary
+ */
+export default function CalendarViewWithErrorBoundary() {
+  return (
+    <ErrorBoundary>
+      <CalendarView />
+    </ErrorBoundary>
+  );
+}
```

### frontend/src/components/calendar/DayColumn/DayGrid.jsx

```diff
diff --git a/frontend/src/components/calendar/DayColumn/DayGrid.jsx b/frontend/src/components/calendar/DayColumn/DayGrid.jsx
index 5e429afc..f570fef1 100644
--- a/frontend/src/components/calendar/DayColumn/DayGrid.jsx
+++ b/frontend/src/components/calendar/DayColumn/DayGrid.jsx
@@ -1,5 +1,6 @@
 import React from 'react';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
+import { LAYOUT_STYLES } from '../../../lib/config/ui/cardStyles';
 import LessonCard from './LessonCard/index.jsx';
 
 const DayGrid = ({
@@ -8,6 +9,8 @@ const DayGrid = ({
   selectionStyle,
   isSelecting,
   calculateLessonStyle,
+  onMouseDown,
+  onMouseMove,
   HOUR_HEIGHT = 60,
   START_HOUR = 8,
   END_HOUR = 22,
@@ -16,9 +19,9 @@ const DayGrid = ({
   const validLessons = lessons || [];
 
   return (
-    <div className="day-grid">
+    <div className="day-grid" role="presentation">
       {/* Hour markers and labels */}
-      <div className="hour-markers">
+      <div className="hour-markers" role="presentation">
         {hours.map((hour) => (
           <div
             key={hour}
@@ -32,6 +35,9 @@ const DayGrid = ({
               borderBottom: '1px solid #e2e8f0',
               backgroundColor: hour % 2 === 0 ? '#fafafa' : 'white',
             }}
+            role="presentation"
+            onMouseDown={(e) => onMouseDown(e, hour, 0)}
+            onMouseMove={(e) => onMouseMove(e, hour, 0)}
           >
             <div
               className="hour-label"
@@ -44,6 +50,7 @@ const DayGrid = ({
                 fontWeight: '500',
                 lineHeight: '1',
               }}
+              aria-label={`${hour.toString().padStart(2, '0')}:00`}
             >
               {hour.toString().padStart(2, '0')}:00
             </div>
@@ -67,18 +74,17 @@ const DayGrid = ({
             width: 'calc(100% - 16px)',
             ...selectionStyle,
           }}
+          role="presentation"
+          aria-hidden="true"
         />
       )}
 
       {/* Lessons */}
       {validLessons.length > 0 && (
-        <div className="lessons-container">
+        <div className="lessons-container" role="presentation">
           {validLessons.map((lesson) => {
             const lessonStyle = calculateLessonStyle(lesson);
 
-            // Debug log
-            console.log(`Rendering lesson ${lesson.id}:`, lessonStyle);
-
             return (
               <div
                 key={lesson.id}
@@ -89,6 +95,7 @@ const DayGrid = ({
                   width: 'calc(100% - 16px)',
                   ...lessonStyle,
                 }}
+                role="presentation"
               >
                 <LessonCard lesson={lesson} onClick={onLessonClick} />
               </div>
```

### frontend/src/components/calendar/DayColumn/DayHeader.jsx

```diff
diff --git a/frontend/src/components/calendar/DayColumn/DayHeader.jsx b/frontend/src/components/calendar/DayColumn/DayHeader.jsx
index 72f2dfb2..dcd23ab4 100644
--- a/frontend/src/components/calendar/DayColumn/DayHeader.jsx
+++ b/frontend/src/components/calendar/DayColumn/DayHeader.jsx
@@ -1,13 +1,15 @@
 import React from 'react';
-import { Icons } from '../../../lib/libraries/icons.jsx';
-import { isToday, parseISO } from 'date-fns';
+import { Icons } from '../../../lib/icons';
+import { isToday, parseISO, format } from 'date-fns';
+import { fr } from 'date-fns/locale';
+import { DATE_FORMATS } from '../../../lib/config/ui/constants';
 
 const DayHeader = ({ date, dayName }) => {
   if (!date) {
     return (
-      <div className="day-header">
+      <div className="day-header" role="banner">
         <div className="day-name">
-          <Icons.Warning style={{ marginRight: '4px' }} />
+          <Icons.Warning style={{ marginRight: '4px' }} aria-hidden="true" />
           Date eronnée
         </div>
       </div>
@@ -17,9 +19,17 @@ const DayHeader = ({ date, dayName }) => {
   const dateObj = parseISO(date);
   const isCurrentDay = isToday(dateObj);
 
+  // Format the date using the constant
+  const formattedDate = format(dateObj, 'dd', { locale: fr });
+
   return (
-    <div className={`day-header ${isCurrentDay ? 'today' : ''}`}>
+    <div
+      className={`day-header ${isCurrentDay ? 'today' : ''}`}
+      role="banner"
+      aria-label={`${dayName} ${formattedDate}${isCurrentDay ? " (aujourd'hui)" : ''}`}
+    >
       <div className="day-name">{dayName}</div>
+      <div className="day-date">{formattedDate}</div>
       {isCurrentDay && (
         <div
           className="today-badge"
@@ -32,6 +42,8 @@ const DayHeader = ({ date, dayName }) => {
             fontSize: '0.75rem',
             display: 'inline-block',
           }}
+          role="status"
+          aria-label="Jour actuel"
         >
           Aujourd'hui
         </div>
```

### frontend/src/components/calendar/DayColumn/LessonCard/LessonCardContent.jsx

```diff
diff --git a/frontend/src/components/calendar/DayColumn/LessonCard/LessonCardContent.jsx b/frontend/src/components/calendar/DayColumn/LessonCard/LessonCardContent.jsx
index ad5ba01f..d1defde6 100644
--- a/frontend/src/components/calendar/DayColumn/LessonCard/LessonCardContent.jsx
+++ b/frontend/src/components/calendar/DayColumn/LessonCard/LessonCardContent.jsx
@@ -1,6 +1,6 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { LAYOUT_STYLES } from '../../../../lib/config/ui.js';
+import { LAYOUT_STYLES } from '../../../../lib/config/ui/cardStyles';
 import {
   HeaderSection,
   TimeSection,
```

### frontend/src/components/calendar/DayColumn/LessonCard/LessonCardIcon.jsx

```diff
diff --git a/frontend/src/components/calendar/DayColumn/LessonCard/LessonCardIcon.jsx b/frontend/src/components/calendar/DayColumn/LessonCard/LessonCardIcon.jsx
index cc438374..886ecce0 100644
--- a/frontend/src/components/calendar/DayColumn/LessonCard/LessonCardIcon.jsx
+++ b/frontend/src/components/calendar/DayColumn/LessonCard/LessonCardIcon.jsx
@@ -1,13 +1,19 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { getLessonTypeIcon } from '../../../../constants/domains/lessons/types.js';
+import { getLessonTypeIcon } from '../../../../lib/domains/lessons/types.js';
 
 /**
  * Render lesson type icon
  */
 function LessonCardIcon({ type, size = '14px' }) {
   const IconComponent = getLessonTypeIcon(type);
-  return <IconComponent style={{ fontSize: size, flexShrink: 0 }} />;
+  return (
+    <IconComponent
+      style={{ fontSize: size, flexShrink: 0 }}
+      aria-hidden="true"
+      role="presentation"
+    />
+  );
 }
 
 LessonCardIcon.propTypes = {
```

### frontend/src/components/calendar/DayColumn/LessonCard/LessonCardSections.jsx

```diff
diff --git a/frontend/src/components/calendar/DayColumn/LessonCard/LessonCardSections.jsx b/frontend/src/components/calendar/DayColumn/LessonCard/LessonCardSections.jsx
index ec1672ed..d76d40e2 100644
--- a/frontend/src/components/calendar/DayColumn/LessonCard/LessonCardSections.jsx
+++ b/frontend/src/components/calendar/DayColumn/LessonCard/LessonCardSections.jsx
@@ -1,10 +1,10 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { Icons } from '../../../../lib/libraries/icons.jsx';
-import { getStatusBadge } from '../../../../constants/domains/lessons/statuses.js';
-import { formatTime } from '../../../../lib/helpers/shared/formatters/time.js';
-import { formatDuration } from '../../../../lib/helpers/shared/formatters/duration.js';
-import { TEXT_STYLES, LAYOUT_STYLES } from '../../../../lib/config/ui.js';
+import { Icons } from '../../../../lib/icons';
+import { getStatusBadge } from '../../../../lib/domains/lessons/statuses.js';
+import { formatTime } from '../../../../lib/helpers/shared/formatters/time';
+import { formatDuration } from '../../../../lib/helpers/shared/formatters/duration';
+import { TEXT_STYLES, LAYOUT_STYLES } from '../../../../lib/config/ui/cardStyles';
 
 /**
  * Status badge section
@@ -27,8 +27,10 @@ export function StatusBadgeSection({ status }) {
         flexShrink: 0,
         marginRight: '4px',
       }}
+      role="img"
+      aria-label={badgeConfig.label}
     >
-      <IconComponent />
+      <IconComponent aria-hidden="true" />
     </div>
   );
 }
@@ -46,8 +48,12 @@ export function ParticipantsSection({ count, max, isCompact = false }) {
   const fontSize = isCompact ? '9px' : '11px';
 
   return (
-    <div style={{ ...LAYOUT_STYLES.row, fontSize }}>
-      <Icons.Users style={{ fontSize, flexShrink: 0 }} />
+    <div
+      style={{ ...LAYOUT_STYLES.row, fontSize }}
+      role="img"
+      aria-label={`${count}${max ? `/${max}` : ''} participants`}
+    >
+      <Icons.Users style={{ fontSize, flexShrink: 0 }} aria-hidden="true" />
       <span>
         {count}
         {max && `/${max}`}
@@ -103,7 +109,11 @@ export function TimeSection({ lesson, isCompact = false }) {
 
   return (
     <div style={{ ...LAYOUT_STYLES.spaceBetween }}>
-      <div style={{ ...styles.time, color: 'white' }}>
+      <div
+        style={{ ...styles.time, color: 'white' }}
+        role="img"
+        aria-label={`De ${formatTime(lesson.start_time)} à ${formatTime(lesson.end_time)}`}
+      >
         {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
       </div>
       <ParticipantsSection
@@ -127,7 +137,11 @@ export function DurationSection({ lesson }) {
   if (!lesson.duration_minutes) return null;
 
   return (
-    <div style={{ ...TEXT_STYLES.standard.duration, color: 'rgba(255,255,255,0.8)' }}>
+    <div
+      style={{ ...TEXT_STYLES.standard.duration, color: 'rgba(255,255,255,0.8)' }}
+      role="img"
+      aria-label={`Durée: ${formatDuration(lesson.duration_minutes)}`}
+    >
       {formatDuration(lesson.duration_minutes)}
     </div>
   );
@@ -153,6 +167,7 @@ export function BlockedLessonSection({ lesson }) {
             whiteSpace: 'nowrap',
             marginRight: '4px',
           }}
+          aria-hidden="true"
         >
           <Icons.Blocked />
         </div>
@@ -184,7 +199,11 @@ export function BlockedLessonSection({ lesson }) {
           {lesson.name}
         </span>
       </div>
-      <div style={{ ...TEXT_STYLES.standard.time, color: 'white' }}>
+      <div
+        style={{ ...TEXT_STYLES.standard.time, color: 'white' }}
+        role="img"
+        aria-label={`De ${formatTime(lesson.start_time)} à ${formatTime(lesson.end_time)}`}
+      >
         {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
       </div>
     </div>
```

### frontend/src/components/calendar/DayColumn/LessonCard/index.jsx

```diff
diff --git a/frontend/src/components/calendar/DayColumn/LessonCard/index.jsx b/frontend/src/components/calendar/DayColumn/LessonCard/index.jsx
index 82486374..7528e9e8 100644
--- a/frontend/src/components/calendar/DayColumn/LessonCard/index.jsx
+++ b/frontend/src/components/calendar/DayColumn/LessonCard/index.jsx
@@ -1,13 +1,14 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { CARD_STYLES } from '../../../../lib/config/ui.js';
+import { CARD_STYLES } from '../../../../lib/config/ui/cardStyles';
 import {
   getLessonColor,
   shouldUseCompactLayout,
   isBlockedLesson,
-} from '../../../../lib/helpers/domains/lessons/formatters.js';
-import { formatTime } from '../../../../lib/helpers/shared/formatters/time.js';
+} from '../../../../lib/helpers/domains/lessons/formatters';
+import { formatTime } from '../../../../lib/helpers/shared/formatters/time';
 import LessonCardContent from './LessonCardContent';
+import '../../../../styles/components/calendar.css';
 
 /**
  * Main Lesson Card Component
@@ -38,6 +39,10 @@ function LessonCard({ lesson, onClick, style }) {
     }
   };
 
+  const lessonLabel = `${lesson.name || 'Cours'}, ${formatTime(lesson.start_time)} - ${formatTime(
+    lesson.end_time
+  )}`;
+
   return (
     <div
       className={`lesson-card ${isCompact ? 'compact' : 'standard'} ${isBlocked ? 'blocked' : ''}`}
@@ -46,9 +51,8 @@ function LessonCard({ lesson, onClick, style }) {
       onKeyDown={handleKeyDown}
       tabIndex={0}
       role="button"
-      aria-label={`${lesson.name || 'Cours'}, ${formatTime(lesson.start_time)} - ${formatTime(
-        lesson.end_time
-      )}`}
+      aria-label={lessonLabel}
+      aria-pressed="false"
     >
       <LessonCardContent lesson={lesson} isCompact={isCompact} isBlocked={isBlocked} />
     </div>
```

### frontend/src/components/calendar/DayColumn/index.jsx

```diff
diff --git a/frontend/src/components/calendar/DayColumn/index.jsx b/frontend/src/components/calendar/DayColumn/index.jsx
index 9de479b7..c488ef8c 100644
--- a/frontend/src/components/calendar/DayColumn/index.jsx
+++ b/frontend/src/components/calendar/DayColumn/index.jsx
@@ -1,11 +1,27 @@
-import React, { useState, useRef, useEffect } from 'react';
+import React, { useState, useRef, useCallback, useMemo } from 'react';
 import SingleLessonModal from '../../lessons/SingleLessonModal';
 import { format, isToday, isPast, parseISO, endOfDay } from 'date-fns';
 import { fr } from 'date-fns/locale';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
+import {
+  timeToMinutes,
+  calculateLessonStyle,
+  calculateSelectionStyle,
+} from '../../../lib/helpers/shared/formatters/time';
+import { getValidLessons } from '../../../lib/helpers/domains/lessons/validators';
 import DayHeader from './DayHeader';
 import DayGrid from './DayGrid';
 
+/**
+ * Calendar configuration constants
+ */
+const CALENDAR_CONFIG = {
+  HOUR_HEIGHT: 60,
+  START_HOUR: 8,
+  END_HOUR: 22,
+  MIN_SELECTION_DURATION: 30, // minutes
+};
+
 function DayColumn({ date, dayName, lessons, onLessonClick, onQuickCreate }) {
   const [isSelecting, setIsSelecting] = useState(false);
   const [selectionStart, setSelectionStart] = useState(null);
@@ -14,13 +30,15 @@ function DayColumn({ date, dayName, lessons, onLessonClick, onQuickCreate }) {
   const [quickCreateData, setQuickCreateData] = useState(null);
   const dayGridRef = useRef(null);
 
+  const { HOUR_HEIGHT, START_HOUR, END_HOUR, MIN_SELECTION_DURATION } = CALENDAR_CONFIG;
+
   if (!date) {
     return (
-      <div className="day-column">
+      <div className="day-column" role="region" aria-label="Colonne du jour invalide">
         <DayHeader date={date} dayName={dayName} />
         <div className="day-grid">
           <div className="no-lessons">
-            <Icons.Warning style={{ fontSize: '32px', marginBottom: '8px' }} />
+            <Icons.Warning style={{ fontSize: '32px', marginBottom: '8px' }} aria-hidden="true" />
             <p>Date invalide</p>
           </div>
         </div>
@@ -32,87 +50,25 @@ function DayColumn({ date, dayName, lessons, onLessonClick, onQuickCreate }) {
   const isCurrentDay = isToday(dateObj);
   const isPastDay = isPast(endOfDay(dateObj)) && !isCurrentDay;
 
-  const HOUR_HEIGHT = 60;
-  const START_HOUR = 8;
-  const END_HOUR = 22;
-
-  const timeToMinutes = (timeStr) => {
-    if (!timeStr) return 0;
-    const [hours, minutes] = timeStr.split(':').map(Number);
-    return hours * 60 + (minutes || 0);
-  };
-
-  const calculateLessonStyle = (lesson) => {
-    if (!lesson?.start_time || !lesson?.end_time) {
-      return { display: 'none' };
-    }
-
-    const startMinutes = timeToMinutes(lesson.start_time);
-    const endMinutes = timeToMinutes(lesson.end_time);
-    const dayStartMinutes = START_HOUR * 60;
-    const dayEndMinutes = END_HOUR * 60;
-
-    console.log('Lesson:', lesson.name, {
-      startMinutes,
-      endMinutes,
-      dayStartMinutes,
-      dayEndMinutes,
-    });
-
-    // Check if lesson is outside visible hours
-    if (endMinutes <= dayStartMinutes || startMinutes >= dayEndMinutes) {
-      return { display: 'none' };
-    }
-
-    // Clamp start and end to visible hours
-    const clampedStart = Math.max(startMinutes, dayStartMinutes);
-    const clampedEnd = Math.min(endMinutes, dayEndMinutes);
-
-    const top = (clampedStart - dayStartMinutes) * (HOUR_HEIGHT / 60);
-    const height = (clampedEnd - clampedStart) * (HOUR_HEIGHT / 60);
-
-    console.log('Calculated style:', {
-      top: `${top}px`,
-      height: `${height}px`,
-      clampedStart,
-      clampedEnd,
-    });
-
-    return {
-      top: `${top}px`,
-      height: `${height}px`,
-    };
-  };
-
-  const calculateSelectionStyle = () => {
-    if (!selectionStart || !selectionEnd) return null;
-
-    const startMinutes = timeToMinutes(selectionStart);
-    const endMinutes = timeToMinutes(selectionEnd);
-    const dayStartMinutes = START_HOUR * 60;
-    const dayEndMinutes = END_HOUR * 60;
-
-    // Ensure start is before end
-    const minMinutes = Math.min(startMinutes, endMinutes);
-    const maxMinutes = Math.max(startMinutes, endMinutes);
-
-    if (maxMinutes <= dayStartMinutes || minMinutes >= dayEndMinutes) {
-      return null;
-    }
-
-    const clampedStart = Math.max(minMinutes, dayStartMinutes);
-    const clampedEnd = Math.min(maxMinutes, dayEndMinutes);
+  // Memoized valid lessons
+  const validLessons = useMemo(
+    () => getValidLessons(lessons, START_HOUR, END_HOUR),
+    [lessons, START_HOUR, END_HOUR]
+  );
 
-    const top = (clampedStart - dayStartMinutes) * (HOUR_HEIGHT / 60);
-    const height = (clampedEnd - clampedStart) * (HOUR_HEIGHT / 60);
+  // Memoized lesson style calculator
+  const calculateLessonStyleMemo = useCallback(
+    (lesson) => calculateLessonStyle(lesson, HOUR_HEIGHT, START_HOUR, END_HOUR),
+    [HOUR_HEIGHT, START_HOUR, END_HOUR]
+  );
 
-    return {
-      top: `${top}px`,
-      height: `${height}px`,
-    };
-  };
+  // Memoized selection style calculator
+  const calculateSelectionStyleMemo = useCallback(
+    () => calculateSelectionStyle(selectionStart, selectionEnd, HOUR_HEIGHT, START_HOUR, END_HOUR),
+    [selectionStart, selectionEnd, HOUR_HEIGHT, START_HOUR, END_HOUR]
+  );
 
-  const handleMouseDown = (e, hour, minute) => {
+  const handleMouseDown = useCallback((e, hour, minute) => {
     if (e.target.closest('.lesson-card')) {
       return;
     }
@@ -122,16 +78,21 @@ function DayColumn({ date, dayName, lessons, onLessonClick, onQuickCreate }) {
     setIsSelecting(true);
     setSelectionStart(startTime);
     setSelectionEnd(startTime);
-  };
-
-  const handleMouseMove = (e, hour, minute) => {
-    if (!isSelecting) return;
-
-    const currentTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
-    setSelectionEnd(currentTime);
-  };
+  }, []);
+
+  const handleMouseMove = useCallback(
+    (e, hour, minute) => {
+      if (!isSelecting) return;
+
+      const currentTime = `${hour.toString().padStart(2, '0')}:${minute
+        .toString()
+        .padStart(2, '0')}`;
+      setSelectionEnd(currentTime);
+    },
+    [isSelecting]
+  );
 
-  const handleMouseUp = () => {
+  const handleMouseUp = useCallback(() => {
     if (!isSelecting || !selectionStart || !selectionEnd) {
       setIsSelecting(false);
       return;
@@ -141,7 +102,7 @@ function DayColumn({ date, dayName, lessons, onLessonClick, onQuickCreate }) {
     const endMinutes = timeToMinutes(selectionEnd);
     const durationMinutes = Math.abs(endMinutes - startMinutes);
 
-    if (durationMinutes >= 30) {
+    if (durationMinutes >= MIN_SELECTION_DURATION) {
       setQuickCreateData({
         date,
         start_time: startMinutes < endMinutes ? selectionStart : selectionEnd,
@@ -153,33 +114,47 @@ function DayColumn({ date, dayName, lessons, onLessonClick, onQuickCreate }) {
     setIsSelecting(false);
     setSelectionStart(null);
     setSelectionEnd(null);
-  };
+  }, [isSelecting, selectionStart, selectionEnd, date, MIN_SELECTION_DURATION]);
+
+  // Cleanup event listeners
+  React.useEffect(() => {
+    const container = dayGridRef.current;
+    if (!container) return;
 
-  const validLessons = (lessons || []).filter((lesson) => {
-    if (!lesson?.start_time || !lesson?.end_time) return false;
-    const startMinutes = timeToMinutes(lesson.start_time);
-    const endMinutes = timeToMinutes(lesson.end_time);
-    const dayStartMinutes = START_HOUR * 60;
-    const dayEndMinutes = END_HOUR * 60;
-    return !(endMinutes <= dayStartMinutes || startMinutes >= dayEndMinutes);
-  });
+    const handleMouseUpEvent = () => handleMouseUp();
+    const handleMouseLeaveEvent = () => handleMouseUp();
+
+    container.addEventListener('mouseup', handleMouseUpEvent);
+    container.addEventListener('mouseleave', handleMouseLeaveEvent);
+
+    return () => {
+      container.removeEventListener('mouseup', handleMouseUpEvent);
+      container.removeEventListener('mouseleave', handleMouseLeaveEvent);
+    };
+  }, [handleMouseUp]);
 
   return (
-    <div className={`day-column ${isCurrentDay ? 'today' : ''} ${isPastDay ? 'past' : ''}`}>
+    <div
+      className={`day-column ${isCurrentDay ? 'today' : ''} ${isPastDay ? 'past' : ''}`}
+      role="region"
+      aria-label={`Colonne du ${dayName}${isCurrentDay ? " (aujourd'hui)" : ''}`}
+    >
       <DayHeader date={date} dayName={dayName} />
 
       <div
         ref={dayGridRef}
         className="day-grid-container"
-        onMouseUp={handleMouseUp}
-        onMouseLeave={handleMouseUp}
+        role="grid"
+        aria-label={`Grille horaire du ${dayName}`}
       >
         <DayGrid
           lessons={validLessons}
           onLessonClick={onLessonClick}
-          selectionStyle={calculateSelectionStyle()}
+          selectionStyle={calculateSelectionStyleMemo()}
           isSelecting={isSelecting}
-          calculateLessonStyle={calculateLessonStyle}
+          calculateLessonStyle={calculateLessonStyleMemo}
+          onMouseDown={handleMouseDown}
+          onMouseMove={handleMouseMove}
           HOUR_HEIGHT={HOUR_HEIGHT}
           START_HOUR={START_HOUR}
           END_HOUR={END_HOUR}
```

### frontend/src/components/calendar/WeekView.jsx

```diff
diff --git a/frontend/src/components/calendar/WeekView.jsx b/frontend/src/components/calendar/WeekView.jsx
index 903309db..782b55d4 100644
--- a/frontend/src/components/calendar/WeekView.jsx
+++ b/frontend/src/components/calendar/WeekView.jsx
@@ -1,51 +1,53 @@
-import React from 'react';
+import React, { useMemo } from 'react';
 import DayColumn from './DayColumn';
-import { Icons } from '../../lib/libraries/icons.jsx';
+import { Icons } from '../../lib/icons';
+import { filterLessons } from '../../lib/helpers/domains/lessons/filters';
+import '../../styles/components/calendar.css';
 
 function WeekView({ weekData, onLessonClick, onQuickCreate, filters }) {
-  const filterLessons = (lessons) => {
-    return lessons.filter((lesson) => {
-      if (filters.lessonType !== 'all' && lesson.lesson_type !== filters.lessonType) {
-        return false;
-      }
+  // Memoized filtered week data
+  const filteredWeekData = useMemo(() => {
+    if (!weekData || !weekData.days) return weekData;
 
-      if (filters.status !== 'all' && lesson.status !== filters.status) {
-        return false;
-      }
-
-      if (!filters.showBlocked && lesson.lesson_type === 'blocked') {
-        return false;
-      }
-
-      return true;
-    });
-  };
+    return {
+      ...weekData,
+      days: weekData.days.map((day) => ({
+        ...day,
+        lessons: filterLessons(day.lessons, filters),
+      })),
+    };
+  }, [weekData, filters]);
 
   return (
-    <div className="week-view">
-      <div className="week-grid">
+    <div className="week-view" role="main" aria-label="Vue hebdomadaire du calendrier">
+      <div className="week-grid" role="grid" aria-label="Grille de la semaine">
         {/* Time column with hours */}
-        <div className="time-column">
-          <div className="time-header">
+        <div className="time-column" role="presentation">
+          <div className="time-header" role="columnheader" aria-label="Colonne des heures">
             <div className="time-header-content">
-              <Icons.Clock />
+              <Icons.Clock aria-hidden="true" />
               <div>Heure</div>
             </div>
           </div>
           {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
-            <div key={hour} className="time-slot">
+            <div
+              key={hour}
+              className="time-slot"
+              role="rowheader"
+              aria-label={`${String(hour).padStart(2, '0')}h`}
+            >
               <span className="time-label">{String(hour).padStart(2, '0')}h</span>
             </div>
           ))}
         </div>
 
         {/* Day columns */}
-        {weekData.days.map((day) => (
+        {filteredWeekData?.days?.map((day) => (
           <DayColumn
             key={day.date}
             date={day.date}
             dayName={day.day_name}
-            lessons={filterLessons(day.lessons)}
+            lessons={day.lessons}
             onLessonClick={onLessonClick}
             onQuickCreate={onQuickCreate}
           />
```

### frontend/src/components/common/DeleteConfirmationModal.jsx

```diff
diff --git a/frontend/src/components/common/DeleteConfirmationModal.jsx b/frontend/src/components/common/DeleteConfirmationModal.jsx
index de13011f..17e2ac6f 100644
--- a/frontend/src/components/common/DeleteConfirmationModal.jsx
+++ b/frontend/src/components/common/DeleteConfirmationModal.jsx
@@ -1,8 +1,9 @@
 import React from 'react';
 import PropTypes from 'prop-types';
 import Modal from './Modal.jsx';
-import { Icons } from '../../lib/libraries/icons.jsx';
+import { Icons } from '../../lib/icons';
 import '../../styles/common/buttons.css';
+import '../../styles/common/alerts.css';
 
 /**
  * Unified Delete Confirmation Modal Component
```

### frontend/src/components/common/InfoTooltip.jsx

```diff
diff --git a/frontend/src/components/common/InfoTooltip.jsx b/frontend/src/components/common/InfoTooltip.jsx
index 162f0e15..4242ae86 100644
--- a/frontend/src/components/common/InfoTooltip.jsx
+++ b/frontend/src/components/common/InfoTooltip.jsx
@@ -1,6 +1,6 @@
 import React, { useState } from 'react';
 import PropTypes from 'prop-types';
-import { Icons } from '../../lib/libraries/icons.jsx';
+import { Icons } from '../../lib/icons';
 import '../../styles/common/infotooltip.css';
 
 function InfoTooltip({ message, position = 'top' }) {
```

### frontend/src/components/common/Modal.jsx

```diff
diff --git a/frontend/src/components/common/Modal.jsx b/frontend/src/components/common/Modal.jsx
index d8820ff3..5ef47b55 100644
--- a/frontend/src/components/common/Modal.jsx
+++ b/frontend/src/components/common/Modal.jsx
@@ -1,7 +1,9 @@
 import React from 'react';
 import Portal from './Portal.jsx';
-import { Icons } from '../../lib/libraries/icons.jsx';
+import { Icons } from '../../lib/icons';
 import '../../styles/common/modal.css';
+import '../../styles/common/modal.css';
+import '../../styles/common/buttons.css';
 
 /**
  * Reusable Modal component
```

### frontend/src/components/horses/HorseForm/FormActions.jsx

```diff
diff --git a/frontend/src/components/horses/HorseForm/FormActions.jsx b/frontend/src/components/horses/HorseForm/FormActions.jsx
index a9d3293c..51bd6685 100644
--- a/frontend/src/components/horses/HorseForm/FormActions.jsx
+++ b/frontend/src/components/horses/HorseForm/FormActions.jsx
@@ -1,5 +1,5 @@
 import React from 'react';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 
 const FormActions = ({ onSubmit, onCancel, submitting, isEdit }) => {
   return (
```

### frontend/src/components/horses/HorseForm/OwnershipFields.jsx

```diff
diff --git a/frontend/src/components/horses/HorseForm/OwnershipFields.jsx b/frontend/src/components/horses/HorseForm/OwnershipFields.jsx
index 4ab23375..77861336 100644
--- a/frontend/src/components/horses/HorseForm/OwnershipFields.jsx
+++ b/frontend/src/components/horses/HorseForm/OwnershipFields.jsx
@@ -1,5 +1,5 @@
 import React from 'react';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 
 const OwnershipFields = ({ formData, onChange, riders, loadingRiders, ownershipOptions }) => {
   return (
```

### frontend/src/components/horses/HorseForm/index.jsx

```diff
diff --git a/frontend/src/components/horses/HorseForm/index.jsx b/frontend/src/components/horses/HorseForm/index.jsx
index 5763ffd2..a6d42d21 100644
--- a/frontend/src/components/horses/HorseForm/index.jsx
+++ b/frontend/src/components/horses/HorseForm/index.jsx
@@ -4,7 +4,7 @@ import { useHorseForm } from '../../../hooks/useHorseForm';
 import BasicInfoFields from './BasicInfoFields';
 import OwnershipFields from './OwnershipFields';
 import FormActions from './FormActions';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 
 function HorseForm({ horse, onSubmit, onCancel }) {
   const {
```

### frontend/src/components/horses/HorsesList/EmptyState.jsx

```diff
diff --git a/frontend/src/components/horses/HorsesList/EmptyState.jsx b/frontend/src/components/horses/HorsesList/EmptyState.jsx
index 13b66b6c..1549400d 100644
--- a/frontend/src/components/horses/HorsesList/EmptyState.jsx
+++ b/frontend/src/components/horses/HorsesList/EmptyState.jsx
@@ -1,6 +1,6 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import '../../../styles/common/buttons.css';
 
 function EmptyState({ type, filter, onCreate }) {
```

### frontend/src/components/horses/HorsesList/HorsesTable.jsx

```diff
diff --git a/frontend/src/components/horses/HorsesList/HorsesTable.jsx b/frontend/src/components/horses/HorsesList/HorsesTable.jsx
index a2a2846b..e11cd4da 100644
--- a/frontend/src/components/horses/HorsesList/HorsesTable.jsx
+++ b/frontend/src/components/horses/HorsesList/HorsesTable.jsx
@@ -1,8 +1,8 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import { isActive } from '../../../lib/helpers/domains/riders/filters.js';
-import { getHorseKindLabel } from '../../../constants/domains/horses/kinds.js';
+import { getHorseKindLabel } from '../../../lib/domains/horses/kinds';
 import '../../../styles/common/badges.css';
 import '../../../styles/common/buttons.css';
 
```

### frontend/src/components/horses/HorsesList/RidersModal.jsx

```diff
diff --git a/frontend/src/components/horses/HorsesList/RidersModal.jsx b/frontend/src/components/horses/HorsesList/RidersModal.jsx
index 322db4a7..4bb7cf7e 100644
--- a/frontend/src/components/horses/HorsesList/RidersModal.jsx
+++ b/frontend/src/components/horses/HorsesList/RidersModal.jsx
@@ -1,7 +1,7 @@
 import React from 'react';
 import PropTypes from 'prop-types';
 import Modal from '../../common/Modal';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import '../../../styles/common/modal.css';
 import '../../../styles/common/badges.css';
 import '../../../styles/common/buttons.css';
```

### frontend/src/components/horses/HorsesList/index.jsx

```diff
diff --git a/frontend/src/components/horses/HorsesList/index.jsx b/frontend/src/components/horses/HorsesList/index.jsx
index 81362429..111dbfda 100644
--- a/frontend/src/components/horses/HorsesList/index.jsx
+++ b/frontend/src/components/horses/HorsesList/index.jsx
@@ -1,5 +1,5 @@
 import React, { useState } from 'react';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import Modal from '../../common/Modal';
 import HorseForm from '../HorseForm';
 import FilterButtons from './FilterButtons';
@@ -10,11 +10,13 @@ import DeleteConfirmationModal from '../../common/DeleteConfirmationModal';
 import { useHorsesList } from '../../../hooks/useHorsesList';
 import { useHorseActions } from '../../../hooks/useHorseActions';
 import { useHorseRiders } from '../../../hooks/useHorseRiders';
-import { calculateHorseStats, filterHorsesByKind } from '../../../lib/helpers/domains/horses/stats.js';
+import {
+  calculateHorseStats,
+  filterHorsesByKind,
+} from '../../../lib/helpers/domains/horses/stats.js';
 import '../../../styles/common/modal.css';
 import '../../../styles/common/alerts.css';
 import '../../../styles/common/buttons.css';
-import '../../../styles/components/horses.css';
 
 function HorsesList() {
   const [successMessage, setSuccessMessage] = useState('');
```

### frontend/src/components/lessons/BlockedTimeModal.jsx

```diff
diff --git a/frontend/src/components/lessons/BlockedTimeModal.jsx b/frontend/src/components/lessons/BlockedTimeModal.jsx
index 216a371e..91843a44 100644
--- a/frontend/src/components/lessons/BlockedTimeModal.jsx
+++ b/frontend/src/components/lessons/BlockedTimeModal.jsx
@@ -3,7 +3,7 @@ import { format, parseISO } from 'date-fns';
 import { fr } from 'date-fns/locale';
 import { lessonsApi } from '../../services/calendarApi.js';
 import Modal from '../common/Modal.jsx';
-import { Icons } from '../../lib/libraries/icons.jsx';
+import { Icons } from '../../lib/icons';
 import { calculateDuration } from '../../lib/helpers/shared/formatters/duration.js';
 import { validateLessonTime } from '../../lib/helpers/domains/lessons/validators';
 import '../../styles/components/lessons.css';
```

### frontend/src/components/lessons/LessonModal/LessonAdvancedTab.jsx

```diff
diff --git a/frontend/src/components/lessons/LessonModal/LessonAdvancedTab.jsx b/frontend/src/components/lessons/LessonModal/LessonAdvancedTab.jsx
index 174c2109..9cf2fad5 100644
--- a/frontend/src/components/lessons/LessonModal/LessonAdvancedTab.jsx
+++ b/frontend/src/components/lessons/LessonModal/LessonAdvancedTab.jsx
@@ -1,7 +1,7 @@
 import React from 'react';
 import { format, parseISO } from 'date-fns';
 import { fr } from 'date-fns/locale';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 
 /**
  * Lesson Advanced Tab Component
```

### frontend/src/components/lessons/LessonModal/LessonDetailsTab.jsx

```diff
diff --git a/frontend/src/components/lessons/LessonModal/LessonDetailsTab.jsx b/frontend/src/components/lessons/LessonModal/LessonDetailsTab.jsx
index 79497208..18f43834 100644
--- a/frontend/src/components/lessons/LessonModal/LessonDetailsTab.jsx
+++ b/frontend/src/components/lessons/LessonModal/LessonDetailsTab.jsx
@@ -1,8 +1,8 @@
 import React from 'react';
 import { format, parseISO } from 'date-fns';
 import { fr } from 'date-fns/locale';
-import { Icons } from '../../../lib/libraries/icons.jsx';
-import { getLessonTypeLabel, isBlockedLesson } from '../../../constants/domains/lessons/types.js';
+import { Icons } from '../../../lib/icons';
+import { getLessonTypeLabel, isBlockedLesson } from '../../../lib/domains/lessons/types';
 
 /**
  * Lesson Details Tab - View Mode
```

### frontend/src/components/lessons/LessonModal/LessonEditForm/BasicInfoFields.jsx

```diff
diff --git a/frontend/src/components/lessons/LessonModal/LessonEditForm/BasicInfoFields.jsx b/frontend/src/components/lessons/LessonModal/LessonEditForm/BasicInfoFields.jsx
index 21507d0b..b44a126e 100644
--- a/frontend/src/components/lessons/LessonModal/LessonEditForm/BasicInfoFields.jsx
+++ b/frontend/src/components/lessons/LessonModal/LessonEditForm/BasicInfoFields.jsx
@@ -1,6 +1,6 @@
 import React from 'react';
-import { Icons } from '../../../../lib/libraries/icons.jsx';
-import { LESSON_TYPES } from '../../../../constants/domains/lessons/types.js';
+import { Icons } from '../../../../lib/icons';
+import { LESSON_TYPES } from '../../../../lib/domains/lessons/types';
 
 const BasicInfoFields = ({ editFormData, lessonData, handleEditChange, handleTypeChange }) => {
   return (
```

### frontend/src/components/lessons/LessonModal/LessonEditForm/SpecialFields.jsx

```diff
diff --git a/frontend/src/components/lessons/LessonModal/LessonEditForm/SpecialFields.jsx b/frontend/src/components/lessons/LessonModal/LessonEditForm/SpecialFields.jsx
index 6493db3e..47d5a454 100644
--- a/frontend/src/components/lessons/LessonModal/LessonEditForm/SpecialFields.jsx
+++ b/frontend/src/components/lessons/LessonModal/LessonEditForm/SpecialFields.jsx
@@ -1,5 +1,5 @@
 import React from 'react';
-import { Icons } from '../../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../../lib/icons';
 
 const SpecialFields = ({ editFormData, handleEditChange }) => {
   return (
```

### frontend/src/components/lessons/LessonModal/LessonEditForm/StatusFields.jsx

```diff
diff --git a/frontend/src/components/lessons/LessonModal/LessonEditForm/StatusFields.jsx b/frontend/src/components/lessons/LessonModal/LessonEditForm/StatusFields.jsx
index 41ac8520..b520be7a 100644
--- a/frontend/src/components/lessons/LessonModal/LessonEditForm/StatusFields.jsx
+++ b/frontend/src/components/lessons/LessonModal/LessonEditForm/StatusFields.jsx
@@ -1,5 +1,5 @@
 import React from 'react';
-import { Icons } from '../../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../../lib/icons';
 
 const StatusFields = ({ editFormData, lessonData, handleEditChange }) => {
   return (
```

### frontend/src/components/lessons/LessonModal/LessonEditForm/index.jsx

```diff
diff --git a/frontend/src/components/lessons/LessonModal/LessonEditForm/index.jsx b/frontend/src/components/lessons/LessonModal/LessonEditForm/index.jsx
index 49937ebd..dcf4418c 100644
--- a/frontend/src/components/lessons/LessonModal/LessonEditForm/index.jsx
+++ b/frontend/src/components/lessons/LessonModal/LessonEditForm/index.jsx
@@ -1,5 +1,5 @@
 import React from 'react';
-import { Icons } from '../../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../../lib/icons';
 import BasicInfoFields from './BasicInfoFields.jsx';
 import StatusFields from './StatusFields.jsx';
 import SpecialFields from './SpecialFields.jsx';
@@ -16,7 +16,7 @@ const LessonEditForm = ({
   handleTypeChange,
 }) => {
   const isBlocked = lessonData.lesson_type === 'blocked' || lessonData.is_blocked;
-  
+
   return (
     <div className="edit-form">
       {/* Error Display */}
```

### frontend/src/components/lessons/LessonModal/LessonParticipantsTab.jsx

```diff
diff --git a/frontend/src/components/lessons/LessonModal/LessonParticipantsTab.jsx b/frontend/src/components/lessons/LessonModal/LessonParticipantsTab.jsx
index 8a64a8f2..d7dae9e2 100644
--- a/frontend/src/components/lessons/LessonModal/LessonParticipantsTab.jsx
+++ b/frontend/src/components/lessons/LessonModal/LessonParticipantsTab.jsx
@@ -1,5 +1,5 @@
 import React from 'react';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import { useRiderHorses } from '../../../hooks/index.js';
 
 /**
```

### frontend/src/components/lessons/LessonModal/index.jsx

```diff
diff --git a/frontend/src/components/lessons/LessonModal/index.jsx b/frontend/src/components/lessons/LessonModal/index.jsx
index e0d98d10..59a1c60d 100644
--- a/frontend/src/components/lessons/LessonModal/index.jsx
+++ b/frontend/src/components/lessons/LessonModal/index.jsx
@@ -1,9 +1,13 @@
 import React, { useState } from 'react';
 import { lessonsApi } from '../../../services/calendarApi';
 import Portal from '../../common/Portal';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import { formatTime } from '../../../lib/helpers/shared/formatters/time.js';
-import { getLessonTypeIcon, isBlockedLesson, LESSON_TYPES } from '../../../constants/domains/lessons/types.js';
+import {
+  getLessonTypeIcon,
+  isBlockedLesson,
+  LESSON_TYPES,
+} from '../../../lib/domains/lessons/types';
 import { useLessonData, useLessonEdit, useParticipants } from '../../../hooks/index.js';
 import LessonDetailsTab from './LessonDetailsTab';
 import LessonEditForm from './LessonEditForm/index.jsx';
```

### frontend/src/components/lessons/SingleLessonModal/LessonForm.jsx

```diff
diff --git a/frontend/src/components/lessons/SingleLessonModal/LessonForm.jsx b/frontend/src/components/lessons/SingleLessonModal/LessonForm.jsx
index a0e7aa0c..d8928d20 100644
--- a/frontend/src/components/lessons/SingleLessonModal/LessonForm.jsx
+++ b/frontend/src/components/lessons/SingleLessonModal/LessonForm.jsx
@@ -1,6 +1,6 @@
 import React from 'react';
-import { Icons } from '../../../lib/libraries/icons.jsx';
-import { LESSON_TYPES } from '../../../constants/domains/lessons/types.js';
+import { Icons } from '../../../lib/icons';
+import { LESSON_TYPES } from '../../../lib/domains/lessons/types';
 import { calculateDuration } from '../../../lib/helpers/shared/formatters/duration.js';
 
 /**
@@ -177,4 +177,4 @@ const LessonForm = ({ formData, handleFormChange, handleTypeChange }) => {
   );
 };
 
-export default LessonForm;
\ No newline at end of file
+export default LessonForm;
```

### frontend/src/components/lessons/SingleLessonModal/ParticipantsList.jsx

```diff
diff --git a/frontend/src/components/lessons/SingleLessonModal/ParticipantsList.jsx b/frontend/src/components/lessons/SingleLessonModal/ParticipantsList.jsx
index 81850954..2c99af41 100644
--- a/frontend/src/components/lessons/SingleLessonModal/ParticipantsList.jsx
+++ b/frontend/src/components/lessons/SingleLessonModal/ParticipantsList.jsx
@@ -1,5 +1,5 @@
 import React, { useEffect } from 'react';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import { useRiderHorses } from '../../../hooks/index.js';
 
 /**
@@ -183,4 +183,4 @@ const ParticipantsList = ({
   );
 };
 
-export default ParticipantsList;
\ No newline at end of file
+export default ParticipantsList;
```

### frontend/src/components/lessons/SingleLessonModal/index.jsx

```diff
diff --git a/frontend/src/components/lessons/SingleLessonModal/index.jsx b/frontend/src/components/lessons/SingleLessonModal/index.jsx
index 9543e64a..efefee64 100644
--- a/frontend/src/components/lessons/SingleLessonModal/index.jsx
+++ b/frontend/src/components/lessons/SingleLessonModal/index.jsx
@@ -2,10 +2,10 @@ import React, { useState } from 'react';
 import { format } from 'date-fns';
 import { lessonsApi } from '../../../services/calendarApi';
 import Modal from '../../common/Modal';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import { formatTime } from '../../../lib/helpers/shared/formatters/time.js';
 import { calculateDuration } from '../../../lib/helpers/shared/formatters/duration.js';
-import { LESSON_TYPES } from '../../../constants/domains/lessons/types.js';
+import { LESSON_TYPES } from '../../../lib/domains/lessons/types';
 import { validateLessonForm } from '../../../lib/helpers/domains/lessons/validators';
 import { useParticipants } from '../../../hooks/index.js';
 import ParticipantsList from './ParticipantsList';
```

### frontend/src/components/packages/PackageForm.jsx

```diff
diff --git a/frontend/src/components/packages/PackageForm.jsx b/frontend/src/components/packages/PackageForm.jsx
index 17a5a4c4..e57e8f57 100644
--- a/frontend/src/components/packages/PackageForm.jsx
+++ b/frontend/src/components/packages/PackageForm.jsx
@@ -1,12 +1,11 @@
 import React from 'react';
 import PropTypes from 'prop-types';
 import Modal from '../common/Modal.jsx';
-import { Icons } from '../../lib/libraries/icons.jsx';
+import { Icons } from '../../lib/icons';
 import { usePackageForm } from '../../hooks/usePackageForm.js';
 import '../../styles/common/forms.css';
 import '../../styles/common/alerts.css';
 import '../../styles/common/buttons.css';
-import '../../styles/components/packages.css';
 
 function PackageForm({
   package: packageData = null,
```

### frontend/src/components/packages/PackagesList/PackagesTable.jsx

```diff
diff --git a/frontend/src/components/packages/PackagesList/PackagesTable.jsx b/frontend/src/components/packages/PackagesList/PackagesTable.jsx
index 07e1cfca..54402a0d 100644
--- a/frontend/src/components/packages/PackagesList/PackagesTable.jsx
+++ b/frontend/src/components/packages/PackagesList/PackagesTable.jsx
@@ -1,4 +1,4 @@
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 
 const PackagesTable = ({ packages, onEdit, onDelete, getStatusBadge, getRiderName }) => {
   if (packages.length === 0) {
```

### frontend/src/components/packages/PackagesList/index.jsx

```diff
diff --git a/frontend/src/components/packages/PackagesList/index.jsx b/frontend/src/components/packages/PackagesList/index.jsx
index 92adc33d..a0be6dcd 100644
--- a/frontend/src/components/packages/PackagesList/index.jsx
+++ b/frontend/src/components/packages/PackagesList/index.jsx
@@ -3,7 +3,7 @@ import PackageForm from '../PackageForm.jsx';
 import PackagesTable from './PackagesTable.jsx';
 import PackageFilterButtons from './PackageFilterButtons.jsx';
 import PackageDeleteModal from '../../common/DeleteConfirmationModal.jsx';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 
 function PackagesList() {
   const {
```

### frontend/src/components/pairings/PairingForm/PairingDateFields.jsx

```diff
diff --git a/frontend/src/components/pairings/PairingForm/PairingDateFields.jsx b/frontend/src/components/pairings/PairingForm/PairingDateFields.jsx
index e12f4af8..dd486096 100644
--- a/frontend/src/components/pairings/PairingForm/PairingDateFields.jsx
+++ b/frontend/src/components/pairings/PairingForm/PairingDateFields.jsx
@@ -1,6 +1,6 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import InfoTooltip from '../../common/InfoTooltip';
 
 const PairingDateFields = ({ formData, onChange }) => {
```

### frontend/src/components/pairings/PairingForm/PairingFormActions.jsx

```diff
diff --git a/frontend/src/components/pairings/PairingForm/PairingFormActions.jsx b/frontend/src/components/pairings/PairingForm/PairingFormActions.jsx
index 7304151d..88369839 100644
--- a/frontend/src/components/pairings/PairingForm/PairingFormActions.jsx
+++ b/frontend/src/components/pairings/PairingForm/PairingFormActions.jsx
@@ -1,6 +1,6 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 
 const PairingFormActions = ({ onSubmit, onCancel, submitting, isEdit }) => {
   return (
```

### frontend/src/components/pairings/PairingForm/PairingSelectionFields.jsx

```diff
diff --git a/frontend/src/components/pairings/PairingForm/PairingSelectionFields.jsx b/frontend/src/components/pairings/PairingForm/PairingSelectionFields.jsx
index 27f9e58a..03e0952f 100644
--- a/frontend/src/components/pairings/PairingForm/PairingSelectionFields.jsx
+++ b/frontend/src/components/pairings/PairingForm/PairingSelectionFields.jsx
@@ -1,6 +1,6 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import InfoTooltip from '../../common/InfoTooltip';
 
 const PairingSelectionFields = ({ formData, onChange, riders, horses, riderId, isEdit }) => {
```

### frontend/src/components/pairings/PairingForm/index.jsx

```diff
diff --git a/frontend/src/components/pairings/PairingForm/index.jsx b/frontend/src/components/pairings/PairingForm/index.jsx
index d84946e0..cf71a6ed 100644
--- a/frontend/src/components/pairings/PairingForm/index.jsx
+++ b/frontend/src/components/pairings/PairingForm/index.jsx
@@ -1,5 +1,5 @@
 import PropTypes from 'prop-types';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import { usePairingForm } from '../../../hooks/usePairingForm';
 import PairingSelectionFields from './PairingSelectionFields';
 import PairingDateFields from './PairingDateFields';
```

### frontend/src/components/pairings/PairingsList/PairingsEmptyState.jsx

```diff
diff --git a/frontend/src/components/pairings/PairingsList/PairingsEmptyState.jsx b/frontend/src/components/pairings/PairingsList/PairingsEmptyState.jsx
index 93e32ef1..d112495f 100644
--- a/frontend/src/components/pairings/PairingsList/PairingsEmptyState.jsx
+++ b/frontend/src/components/pairings/PairingsList/PairingsEmptyState.jsx
@@ -1,6 +1,6 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import '../../../styles/common/buttons.css';
 
 function PairingsEmptyState({ type, filter, onCreate }) {
```

### frontend/src/components/pairings/PairingsList/PairingsFilterButtons.jsx

```diff
diff --git a/frontend/src/components/pairings/PairingsList/PairingsFilterButtons.jsx b/frontend/src/components/pairings/PairingsList/PairingsFilterButtons.jsx
index 5c2b9628..a05ae912 100644
--- a/frontend/src/components/pairings/PairingsList/PairingsFilterButtons.jsx
+++ b/frontend/src/components/pairings/PairingsList/PairingsFilterButtons.jsx
@@ -1,6 +1,6 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import '../../../styles/common/buttons.css';
 
 function PairingsFilterButtons({ filter, stats, onFilterChange }) {
```

### frontend/src/components/pairings/PairingsList/PairingsTable.jsx

```diff
diff --git a/frontend/src/components/pairings/PairingsList/PairingsTable.jsx b/frontend/src/components/pairings/PairingsList/PairingsTable.jsx
index d3ec7b42..5f886eed 100644
--- a/frontend/src/components/pairings/PairingsList/PairingsTable.jsx
+++ b/frontend/src/components/pairings/PairingsList/PairingsTable.jsx
@@ -1,8 +1,8 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import { isActive } from '../../../lib/helpers/domains/riders/filters.js';
-import { getHorseKindLabel } from '../../../constants/domains/horses/kinds.js';
+import { getHorseKindLabel } from '../../../lib/domains/horses/kinds';
 import '../../../styles/common/badges.css';
 import '../../../styles/common/buttons.css';
 
```

### frontend/src/components/pairings/PairingsList/index.jsx

```diff
diff --git a/frontend/src/components/pairings/PairingsList/index.jsx b/frontend/src/components/pairings/PairingsList/index.jsx
index 0a8b776f..a3e6d6a0 100644
--- a/frontend/src/components/pairings/PairingsList/index.jsx
+++ b/frontend/src/components/pairings/PairingsList/index.jsx
@@ -1,7 +1,7 @@
 import React, { useState } from 'react';
 import Modal from '../../common/Modal.jsx';
-import { Icons } from '../../../lib/libraries/icons.jsx';
-import { pairingsApi } from '../../../services/api';
+import { Icons } from '../../../lib/icons';
+import { pairingsApi } from '../../../services/index';
 import PairingForm from '../PairingForm';
 import PairingsFilterButtons from './PairingsFilterButtons';
 import PairingsTable from './PairingsTable';
@@ -15,7 +15,6 @@ import {
 import '../../../styles/common/modal.css';
 import '../../../styles/common/alerts.css';
 import '../../../styles/common/buttons.css';
-import '../../../styles/components/pairings.css';
 
 function PairingsList() {
   const [successMessage, setSuccessMessage] = useState('');
```

### frontend/src/components/riders/RiderCard/OwnedHorsesList.jsx

```diff
diff --git a/frontend/src/components/riders/RiderCard/OwnedHorsesList.jsx b/frontend/src/components/riders/RiderCard/OwnedHorsesList.jsx
index 6c6bfc71..ec65dcfc 100644
--- a/frontend/src/components/riders/RiderCard/OwnedHorsesList.jsx
+++ b/frontend/src/components/riders/RiderCard/OwnedHorsesList.jsx
@@ -1,7 +1,7 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { Icons } from '../../../lib/libraries/icons.jsx';
-import { getHorseKindLabel } from '../../../constants/domains/horses/kinds.js';
+import { Icons } from '../../../lib/icons';
+import { getHorseKindLabel } from '../../../lib/domains/horses/kinds';
 import '../../../styles/common/badges.css';
 
 function OwnedHorsesList({ horses }) {
```

### frontend/src/components/riders/RiderCard/PackagesList.jsx

```diff
diff --git a/frontend/src/components/riders/RiderCard/PackagesList.jsx b/frontend/src/components/riders/RiderCard/PackagesList.jsx
index 18a69b3b..6eea59f5 100644
--- a/frontend/src/components/riders/RiderCard/PackagesList.jsx
+++ b/frontend/src/components/riders/RiderCard/PackagesList.jsx
@@ -1,6 +1,6 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';
 import { fr } from 'date-fns/locale';
 import '../../../styles/common/buttons.css';
```

### frontend/src/components/riders/RiderCard/PairingsList.jsx

```diff
diff --git a/frontend/src/components/riders/RiderCard/PairingsList.jsx b/frontend/src/components/riders/RiderCard/PairingsList.jsx
index a9ffebbc..ed8c75ef 100644
--- a/frontend/src/components/riders/RiderCard/PairingsList.jsx
+++ b/frontend/src/components/riders/RiderCard/PairingsList.jsx
@@ -1,6 +1,6 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import '../../../styles/common/buttons.css';
 
 function PairingsList({ pairings, onAdd, onEdit, onDelete }) {
```

### frontend/src/components/riders/RiderCard/RiderInfo.jsx

```diff
diff --git a/frontend/src/components/riders/RiderCard/RiderInfo.jsx b/frontend/src/components/riders/RiderCard/RiderInfo.jsx
index 408aabef..bbcf6150 100644
--- a/frontend/src/components/riders/RiderCard/RiderInfo.jsx
+++ b/frontend/src/components/riders/RiderCard/RiderInfo.jsx
@@ -1,6 +1,6 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import { isActive } from '../../../lib/helpers/domains/riders/filters.js';
 import '../../../styles/common/badges.css';
 
```

### frontend/src/components/riders/RiderCard/index.jsx

```diff
diff --git a/frontend/src/components/riders/RiderCard/index.jsx b/frontend/src/components/riders/RiderCard/index.jsx
index 3d50f990..76a30133 100644
--- a/frontend/src/components/riders/RiderCard/index.jsx
+++ b/frontend/src/components/riders/RiderCard/index.jsx
@@ -1,6 +1,6 @@
 import React, { useState } from 'react';
 import PropTypes from 'prop-types';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import PackageForm from '../../packages/PackageForm';
 import PairingForm from '../../pairings/PairingForm';
 import Modal from '../../common/Modal';
```

### frontend/src/components/riders/RidersList/RiderForm/ActivityFields.jsx

```diff
diff --git a/frontend/src/components/riders/RidersList/RiderForm/ActivityFields.jsx b/frontend/src/components/riders/RidersList/RiderForm/ActivityFields.jsx
index 8beb3a55..ebbe31a4 100644
--- a/frontend/src/components/riders/RidersList/RiderForm/ActivityFields.jsx
+++ b/frontend/src/components/riders/RidersList/RiderForm/ActivityFields.jsx
@@ -1,5 +1,5 @@
 import React from 'react';
-import { Icons } from '../../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../../lib/icons';
 
 const ActivityFields = ({ formData, onChange, errors = {} }) => {
   return (
```

### frontend/src/components/riders/RidersList/RiderForm/BasicInfoFields.jsx

```diff
diff --git a/frontend/src/components/riders/RidersList/RiderForm/BasicInfoFields.jsx b/frontend/src/components/riders/RidersList/RiderForm/BasicInfoFields.jsx
index 57e1e7b6..12d16804 100644
--- a/frontend/src/components/riders/RidersList/RiderForm/BasicInfoFields.jsx
+++ b/frontend/src/components/riders/RidersList/RiderForm/BasicInfoFields.jsx
@@ -1,5 +1,5 @@
 import React from 'react';
-import { Icons } from '../../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../../lib/icons';
 
 const BasicInfoFields = ({ formData, onChange, errors = {} }) => {
   return (
```

### frontend/src/components/riders/RidersList/RiderForm/FormActions.jsx

```diff
diff --git a/frontend/src/components/riders/RidersList/RiderForm/FormActions.jsx b/frontend/src/components/riders/RidersList/RiderForm/FormActions.jsx
index 79ef5c1a..3580f517 100644
--- a/frontend/src/components/riders/RidersList/RiderForm/FormActions.jsx
+++ b/frontend/src/components/riders/RidersList/RiderForm/FormActions.jsx
@@ -1,5 +1,5 @@
 import React from 'react';
-import { Icons } from '../../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../../lib/icons';
 
 const FormActions = ({ onSubmit, onCancel, submitting, isEdit, submitError }) => {
   return (
```

### frontend/src/components/riders/RidersList/RidersTable.jsx

```diff
diff --git a/frontend/src/components/riders/RidersList/RidersTable.jsx b/frontend/src/components/riders/RidersList/RidersTable.jsx
index 9712959e..44003b9c 100644
--- a/frontend/src/components/riders/RidersList/RidersTable.jsx
+++ b/frontend/src/components/riders/RidersList/RidersTable.jsx
@@ -1,4 +1,4 @@
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 
 const RidersTable = ({ riders, onViewDetails, onEdit, onDelete, getStatusBadge }) => {
   if (riders.length === 0) {
```

### frontend/src/components/riders/RidersList/index.jsx

```diff
diff --git a/frontend/src/components/riders/RidersList/index.jsx b/frontend/src/components/riders/RidersList/index.jsx
index 102dd652..d7f4bf48 100644
--- a/frontend/src/components/riders/RidersList/index.jsx
+++ b/frontend/src/components/riders/RidersList/index.jsx
@@ -6,7 +6,7 @@ import RidersTable from './RidersTable';
 import FilterButtons from './FilterButtons';
 import DeleteConfirmationModal from '../../common/DeleteConfirmationModal';
 import Modal from '../../common/Modal';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import '../../../styles/common/modal.css';
 import '../../../styles/common/alerts.css';
 import '../../../styles/common/buttons.css';
```

### frontend/src/components/templates/TemplateManagement/TemplateFilters.jsx

```diff
diff --git a/frontend/src/components/templates/TemplateManagement/TemplateFilters.jsx b/frontend/src/components/templates/TemplateManagement/TemplateFilters.jsx
index 72d30cff..0e1c9adf 100644
--- a/frontend/src/components/templates/TemplateManagement/TemplateFilters.jsx
+++ b/frontend/src/components/templates/TemplateManagement/TemplateFilters.jsx
@@ -1,5 +1,5 @@
 import React from 'react';
-import { TEMPLATE_LESSON_TYPE_FILTERS, TEMPLATE_STATUS_FILTERS } from '../../../../constants/domains/filters';
+import { TEMPLATE_LESSON_TYPE_FILTERS, TEMPLATE_STATUS_FILTERS } from '../../../lib/domains/filters';
 
 const TemplateFilters = ({ filters, onFilterChange, stats }) => {
   return (
```

### frontend/src/components/templates/TemplateManagement/TemplatesTable.jsx

```diff
diff --git a/frontend/src/components/templates/TemplateManagement/TemplatesTable.jsx b/frontend/src/components/templates/TemplateManagement/TemplatesTable.jsx
index 855448a0..06385706 100644
--- a/frontend/src/components/templates/TemplateManagement/TemplatesTable.jsx
+++ b/frontend/src/components/templates/TemplateManagement/TemplatesTable.jsx
@@ -1,5 +1,5 @@
 import React from 'react';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 
 const TemplatesTable = ({ templates, onEdit, onDelete, loading }) => {
   if (loading) {
```

### frontend/src/components/templates/TemplateManagement/index.jsx

```diff
diff --git a/frontend/src/components/templates/TemplateManagement/index.jsx b/frontend/src/components/templates/TemplateManagement/index.jsx
index fcab5972..41eb275d 100644
--- a/frontend/src/components/templates/TemplateManagement/index.jsx
+++ b/frontend/src/components/templates/TemplateManagement/index.jsx
@@ -4,7 +4,7 @@ import TemplateModal from '../TemplateModal';
 import TemplateFilters from './TemplateFilters';
 import TemplatesTable from './TemplatesTable';
 import DeleteConfirmationModal from './DeleteConfirmationModal';
-import { Icons } from '../../../lib/libraries/icons.jsx';
+import { Icons } from '../../../lib/icons';
 import '../../../styles/components/templates.css';
 
 const TemplateManagement = () => {
```

### frontend/src/components/templates/TemplateModal/BasicInfoSection.jsx

```diff
diff --git a/frontend/src/components/templates/TemplateModal/BasicInfoSection.jsx b/frontend/src/components/templates/TemplateModal/BasicInfoSection.jsx
index 8eb299df..942ff840 100644
--- a/frontend/src/components/templates/TemplateModal/BasicInfoSection.jsx
+++ b/frontend/src/components/templates/TemplateModal/BasicInfoSection.jsx
@@ -1,6 +1,6 @@
 import React from 'react';
 import PropTypes from 'prop-types';
-import { LESSON_TYPES } from '../../../constants/domains/templates/types.js';
+import { LESSON_TYPES } from '../../../lib/domains/lessons/types';
 import '../../../styles/common/forms.css';
 import '../../../styles/common/alerts.css';
 
```

### frontend/src/components/templates/TemplateModal/RecurrenceSection.jsx

```diff
diff --git a/frontend/src/components/templates/TemplateModal/RecurrenceSection.jsx b/frontend/src/components/templates/TemplateModal/RecurrenceSection.jsx
index ba8fbc58..cc5452b5 100644
--- a/frontend/src/components/templates/TemplateModal/RecurrenceSection.jsx
+++ b/frontend/src/components/templates/TemplateModal/RecurrenceSection.jsx
@@ -4,7 +4,7 @@ import {
   RECURRENCE_FREQUENCIES,
   WEEK_DAYS,
   getRecurrenceIntervalText,
-} from '../../../constants/domains/templates';
+} from '../../../lib/domains/templates/recurrence';
 import '../../../styles/common/forms.css';
 import '../../../styles/components/templates.css';
 
```

### frontend/src/constants/domains/filters.js

```diff
diff --git a/frontend/src/constants/domains/filters.js b/frontend/src/constants/domains/filters.js
deleted file mode 100644
index 723dedcd..00000000
--- a/frontend/src/constants/domains/filters.js
+++ /dev/null
@@ -1,83 +0,0 @@
-/**
- * Filter options constants
- */
-
-/**
- * Calendar lesson type filter options
- */
-export const CALENDAR_LESSON_TYPE_FILTERS = [
-  { value: 'all', label: 'Tous les types' },
-  { value: 'private', label: 'Cours Particulier' },
-  { value: 'group', label: 'Cours Collectif' },
-  { value: 'training', label: 'Stage' },
-  { value: 'competition', label: 'Concours' },
-  { value: 'event', label: 'Événement' },
-];
-
-/**
- * Calendar status filter options
- */
-export const CALENDAR_STATUS_FILTERS = [
-  { value: 'all', label: 'Tous les statuts' },
-  { value: 'scheduled', label: 'Planifiés' },
-  { value: 'confirmed', label: 'Confirmés' },
-  { value: 'cancelled', label: 'Annulés' },
-];
-
-/**
- * Template lesson type filter options
- */
-export const TEMPLATE_LESSON_TYPE_FILTERS = [
-  { value: 'all', label: 'Tous les types' },
-  { value: 'private', label: 'Cours Particulier' },
-  { value: 'group', label: 'Cours Collectif' },
-  { value: 'training', label: 'Stage' },
-  { value: 'competition', label: 'Concours' },
-  { value: 'event', label: 'Événement' },
-  { value: 'blocked', label: 'Plage Bloquée' },
-];
-
-/**
- * Template status filter options
- */
-export const TEMPLATE_STATUS_FILTERS = [
-  { value: 'all', label: 'Tous les statuts' },
-  { value: 'active', label: 'Actifs seulement' },
-  { value: 'inactive', label: 'Inactifs seulement' },
-];
-
-/**
- * Horse filter options
- */
-export const HORSE_KIND_FILTERS = {
-  ALL: 'all',
-  HORSE: 'horse',
-  PONY: 'pony',
-};
-
-/**
- * Activity status filter options
- */
-export const ACTIVITY_STATUS_FILTERS = {
-  ALL: 'all',
-  ACTIVE: 'active',
-  INACTIVE: 'inactive',
-};
-
-/**
- * Package status filter options
- */
-export const PACKAGE_STATUS_FILTERS = {
-  ALL: 'all',
-  ACTIVE: 'active',
-  INACTIVE: 'inactive',
-};
-
-/**
- * Pairing status filter options
- */
-export const PAIRING_STATUS_FILTERS = {
-  ALL: 'all',
-  ACTIVE: 'active',
-  INACTIVE: 'inactive',
-};
\ No newline at end of file
```

### frontend/src/constants/domains/horses/index.js

```diff
diff --git a/frontend/src/constants/domains/horses/index.js b/frontend/src/constants/domains/horses/index.js
deleted file mode 100644
index 23a92d31..00000000
--- a/frontend/src/constants/domains/horses/index.js
+++ /dev/null
@@ -1,5 +0,0 @@
-/**
- * Horse domain constants exports
- */
-
-export * from './kinds.js';
\ No newline at end of file
```

### frontend/src/constants/domains/horses/kinds.js

```diff
diff --git a/frontend/src/constants/domains/horses/kinds.js b/frontend/src/constants/domains/horses/kinds.js
deleted file mode 100644
index ca5250ea..00000000
--- a/frontend/src/constants/domains/horses/kinds.js
+++ /dev/null
@@ -1,18 +0,0 @@
-/**
- * Horse kind constants
- */
-
-export const HORSE_KIND_LABELS = [
-  { value: 'pony', label: 'Poney' },
-  { value: 'horse', label: 'Cheval' },
-];
-
-/**
- * Get horse kind label
- * @param {string} kind - Horse kind value
- * @returns {string} Human-readable label
- */
-export const getHorseKindLabel = (kind) => {
-  const horseKind = HORSE_KIND_LABELS.find((k) => k.value === kind);
-  return horseKind?.label || kind;
-};
\ No newline at end of file
```

### frontend/src/constants/domains/index.js

```diff
diff --git a/frontend/src/constants/domains/index.js b/frontend/src/constants/domains/index.js
deleted file mode 100644
index 6c3c04ef..00000000
--- a/frontend/src/constants/domains/index.js
+++ /dev/null
@@ -1,9 +0,0 @@
-/**
- * Domain constants exports
- */
-
-export * from './horses';
-export * from './lessons';
-export * from './packages';
-export * from './templates';
-export * from './filters';
\ No newline at end of file
```

### frontend/src/constants/domains/lessons/index.js

```diff
diff --git a/frontend/src/constants/domains/lessons/index.js b/frontend/src/constants/domains/lessons/index.js
deleted file mode 100644
index df388cc7..00000000
--- a/frontend/src/constants/domains/lessons/index.js
+++ /dev/null
@@ -1,7 +0,0 @@
-/**
- * Lessons domain constants exports
- */
-
-export * from './types.js';
-export * from './statuses.js';
-export * from './participation.js';
\ No newline at end of file
```

### frontend/src/constants/domains/lessons/participation.js

```diff
diff --git a/frontend/src/constants/domains/lessons/participation.js b/frontend/src/constants/domains/lessons/participation.js
deleted file mode 100644
index 7f900ccf..00000000
--- a/frontend/src/constants/domains/lessons/participation.js
+++ /dev/null
@@ -1,25 +0,0 @@
-/**
- * Participation status configurations
- */
-export const PARTICIPATION_STATUSES = {
-  CONFIRMED: 'confirmed',
-  PENDING: 'pending',
-  CANCELLED: 'cancelled',
-  COMPLETED: 'completed',
-};
-
-export const PARTICIPATION_STATUS_LABELS = {
-  [PARTICIPATION_STATUSES.CONFIRMED]: 'Confirmé',
-  [PARTICIPATION_STATUSES.PENDING]: 'En attente',
-  [PARTICIPATION_STATUSES.CANCELLED]: 'Annulé',
-  [PARTICIPATION_STATUSES.COMPLETED]: 'Terminé',
-};
-
-/**
- * Get participation status label
- * @param {string} status - Status value
- * @returns {string} Human-readable label
- */
-export const getParticipationStatusLabel = (status) => {
-  return PARTICIPATION_STATUS_LABELS[status] || status;
-};
\ No newline at end of file
```

### frontend/src/constants/domains/lessons/statuses.js

```diff
diff --git a/frontend/src/constants/domains/lessons/statuses.js b/frontend/src/constants/domains/lessons/statuses.js
deleted file mode 100644
index 910884b2..00000000
--- a/frontend/src/constants/domains/lessons/statuses.js
+++ /dev/null
@@ -1,66 +0,0 @@
-import { Icons } from '../../../lib/libraries/icons.jsx';
-
-/**
- * Lesson status configurations
- */
-export const LESSON_STATUSES = {
-  SCHEDULED: 'scheduled',
-  CONFIRMED: 'confirmed',
-  IN_PROGRESS: 'in_progress',
-  COMPLETED: 'completed',
-  CANCELLED: 'cancelled',
-  BLOCKED: 'blocked',
-};
-
-export const STATUS_BADGES = {
-  scheduled: {
-    label: 'Planifié',
-    icon: Icons.Calendar,
-    color: '#ff9500ff',
-    bgColor: '#ffffffff',
-  },
-  confirmed: {
-    label: 'Confirmé',
-    icon: Icons.Check,
-    color: '#28a745',
-    bgColor: '#d4edda',
-  },
-  in_progress: {
-    label: 'En cours',
-    icon: Icons.Clock,
-    color: '#0c5460',
-    bgColor: '#d1ecf1',
-  },
-  completed: {
-    label: 'Terminé',
-    icon: Icons.Check,
-    color: '#155724',
-    bgColor: '#d4edda',
-  },
-  cancelled: {
-    label: 'Annulé',
-    icon: Icons.Close,
-    color: '#721c24',
-    bgColor: '#f8d7da',
-  },
-  blocked: {
-    label: 'Bloqué',
-    icon: Icons.Blocked,
-    color: '#6c757d',
-    bgColor: '#e2e3e5',
-  },
-};
-
-/**
- * Get status badge configuration
- */
-export const getStatusBadge = (status) => {
-  return STATUS_BADGES[status] || STATUS_BADGES.scheduled;
-};
-
-/**
- * Get status label
- */
-export const getStatusLabel = (status) => {
-  return STATUS_BADGES[status]?.label || status;
-};
\ No newline at end of file
```

### frontend/src/constants/domains/lessons/types.js

```diff
diff --git a/frontend/src/constants/domains/lessons/types.js b/frontend/src/constants/domains/lessons/types.js
deleted file mode 100644
index 566eae42..00000000
--- a/frontend/src/constants/domains/lessons/types.js
+++ /dev/null
@@ -1,88 +0,0 @@
-import { Icons } from '../../../lib/libraries/icons.jsx';
-
-/**
- * Lesson type configurations
- */
-export const LESSON_TYPES = [
-  {
-    value: 'private',
-    label: 'Cours particulier',
-    icon: Icons.PrivateLesson,
-    color: '#007bff',
-    defaultMax: 1,
-  },
-  {
-    value: 'group',
-    label: 'Cours collectif',
-    icon: Icons.GroupLesson,
-    color: '#28a745',
-    defaultMax: 6,
-  },
-  {
-    value: 'training',
-    label: 'Stage',
-    icon: Icons.Training,
-    color: '#ffc107',
-    defaultMax: 10,
-  },
-  {
-    value: 'competition',
-    label: 'Concours',
-    icon: Icons.Competition,
-    color: '#dc3545',
-    defaultMax: 20,
-  },
-  {
-    value: 'event',
-    label: 'Événement',
-    icon: Icons.Event,
-    color: '#6f42c1',
-    defaultMax: 50,
-  },
-  {
-    value: 'blocked',
-    label: 'Période bloquée',
-    icon: Icons.Blocked,
-    color: '#6c757d',
-    defaultMax: null,
-  },
-];
-
-/**
- * Get lesson type icon component
- */
-export const getLessonTypeIcon = (type) => {
-  const lessonType = LESSON_TYPES.find((t) => t.value === type);
-  return lessonType?.icon || Icons.Calendar;
-};
-
-/**
- * Get lesson type label
- */
-export const getLessonTypeLabel = (type) => {
-  const lessonType = LESSON_TYPES.find((t) => t.value === type);
-  return lessonType?.label || type;
-};
-
-/**
- * Get lesson type configuration
- */
-export const getLessonTypeConfig = (type) => {
-  return LESSON_TYPES.find((t) => t.value === type);
-};
-
-/**
- * Check if lesson type is blocked
- */
-export const isBlockedLesson = (type) => {
-  return type === 'blocked';
-};
-
-/**
- * Horse assignment types
- */
-export const HORSE_ASSIGNMENT_TYPES = {
-  AUTO: 'auto',
-  MANUAL: 'manual',
-  NONE: 'none',
-};
\ No newline at end of file
```

### frontend/src/constants/domains/packages/index.js

```diff
diff --git a/frontend/src/constants/domains/packages/index.js b/frontend/src/constants/domains/packages/index.js
deleted file mode 100644
index 917527aa..00000000
--- a/frontend/src/constants/domains/packages/index.js
+++ /dev/null
@@ -1,6 +0,0 @@
-/**
- * Packages domain constants exports
- */
-
-export * from './types.js';
-export * from './statuses.js';
\ No newline at end of file
```

### frontend/src/constants/domains/packages/statuses.js

```diff
diff --git a/frontend/src/constants/domains/packages/statuses.js b/frontend/src/constants/domains/packages/statuses.js
deleted file mode 100644
index 6fa8887a..00000000
--- a/frontend/src/constants/domains/packages/statuses.js
+++ /dev/null
@@ -1,23 +0,0 @@
-/**
- * Package status constants
- */
-export const PACKAGE_STATUS = {
-  ACTIVE: 'active',
-  EXPIRED: 'expired',
-  SUSPENDED: 'suspended',
-};
-
-export const PACKAGE_STATUS_LABELS = {
-  [PACKAGE_STATUS.ACTIVE]: 'Actif',
-  [PACKAGE_STATUS.EXPIRED]: 'Expiré',
-  [PACKAGE_STATUS.SUSPENDED]: 'Suspendu',
-};
-
-/**
- * Get package status label
- * @param {string} status - Status value
- * @returns {string} Human-readable label
- */
-export const getPackageStatusLabel = (status) => {
-  return PACKAGE_STATUS_LABELS[status] || status;
-};
\ No newline at end of file
```

### frontend/src/constants/domains/packages/types.js

```diff
diff --git a/frontend/src/constants/domains/packages/types.js b/frontend/src/constants/domains/packages/types.js
deleted file mode 100644
index 1b63ac1e..00000000
--- a/frontend/src/constants/domains/packages/types.js
+++ /dev/null
@@ -1,23 +0,0 @@
-/**
- * Package type constants
- */
-export const PACKAGE_TYPES = {
-  PRIVATE: 'private',
-  JOINT: 'joint',
-  MIXED: 'mixed',
-};
-
-export const PACKAGE_TYPE_LABELS = {
-  [PACKAGE_TYPES.PRIVATE]: 'Privé',
-  [PACKAGE_TYPES.JOINT]: 'Collectif',
-  [PACKAGE_TYPES.MIXED]: 'Mixte',
-};
-
-/**
- * Get package type label
- * @param {string} type - Package type value
- * @returns {string} Human-readable label
- */
-export const getPackageTypeLabel = (type) => {
-  return PACKAGE_TYPE_LABELS[type] || type;
-};
\ No newline at end of file
```

### frontend/src/constants/domains/templates/index.js

```diff
diff --git a/frontend/src/constants/domains/templates/index.js b/frontend/src/constants/domains/templates/index.js
deleted file mode 100644
index 1ad21f0b..00000000
--- a/frontend/src/constants/domains/templates/index.js
+++ /dev/null
@@ -1,6 +0,0 @@
-/**
- * Templates domain constants exports
- */
-
-export * from './types.js';
-export * from './recurrence.js';
\ No newline at end of file
```

### frontend/src/constants/domains/templates/recurrence.js

```diff
diff --git a/frontend/src/constants/domains/templates/recurrence.js b/frontend/src/constants/domains/templates/recurrence.js
deleted file mode 100644
index 90274f6b..00000000
--- a/frontend/src/constants/domains/templates/recurrence.js
+++ /dev/null
@@ -1,40 +0,0 @@
-/**
- * Week days for recurrence selection
- */
-export const WEEK_DAYS = [
-  { value: 'monday', label: 'Lun' },
-  { value: 'tuesday', label: 'Mar' },
-  { value: 'wednesday', label: 'Mer' },
-  { value: 'thursday', label: 'Jeu' },
-  { value: 'friday', label: 'Ven' },
-  { value: 'saturday', label: 'Sam' },
-  { value: 'sunday', label: 'Dim' },
-];
-
-/**
- * Recurrence frequency options
- */
-export const RECURRENCE_FREQUENCIES = [
-  { value: 'daily', label: 'Quotidien' },
-  { value: 'weekly', label: 'Hebdomadaire' },
-  { value: 'monthly', label: 'Mensuel' },
-];
-
-/**
- * Get recurrence interval description
- * @param {string} frequency - Recurrence frequency
- * @param {number} interval - Interval value
- * @returns {string} Description text
- */
-export function getRecurrenceIntervalText(frequency, interval) {
-  switch (frequency) {
-    case 'weekly':
-      return `Toutes les ${interval} semaine(s)`;
-    case 'daily':
-      return `Tous les ${interval} jour(s)`;
-    case 'monthly':
-      return `Tous les ${interval} mois`;
-    default:
-      return '';
-  }
-}
\ No newline at end of file
```

### frontend/src/constants/domains/templates/types.js

```diff
diff --git a/frontend/src/constants/domains/templates/types.js b/frontend/src/constants/domains/templates/types.js
deleted file mode 100644
index af80b364..00000000
--- a/frontend/src/constants/domains/templates/types.js
+++ /dev/null
@@ -1,20 +0,0 @@
-/**
- * Lesson type options for templates
- */
-export const LESSON_TYPES = [
-  { value: 'private', label: '👤 Cours Particulier', maxP: 1, minP: 1 },
-  { value: 'group', label: '👥 Cours Collectif', maxP: 8, minP: 2 },
-  { value: 'training', label: '🎓 Stage', maxP: 12, minP: 3 },
-  { value: 'competition', label: '🏆 Concours', maxP: null, minP: 1 },
-  { value: 'event', label: '🎉 Événement', maxP: null, minP: 1 },
-  { value: 'blocked', label: '🛫 Plage Bloquée', maxP: 0, minP: 0 },
-];
-
-/**
- * Get template lesson type by value
- * @param {string} value - Lesson type value
- * @returns {Object} Lesson type configuration
- */
-export const getTemplateLessonType = (value) => {
-  return LESSON_TYPES.find((type) => type.value === value);
-};
\ No newline at end of file
```

### frontend/src/constants/index.js

```diff
diff --git a/frontend/src/constants/index.js b/frontend/src/constants/index.js
deleted file mode 100644
index 84962ab0..00000000
--- a/frontend/src/constants/index.js
+++ /dev/null
@@ -1,6 +0,0 @@
-/**
- * Centralized export for all constants
- */
-
-// Export all domain-organized constants
-export * from './domains';
\ No newline at end of file
```

### frontend/src/hooks/index.js

```diff
diff --git a/frontend/src/hooks/index.js b/frontend/src/hooks/index.js
index 3d869f6c..a441e982 100644
--- a/frontend/src/hooks/index.js
+++ b/frontend/src/hooks/index.js
@@ -8,4 +8,5 @@ export { useRiderHorses } from './useRiderHorses.js';
 export { useParticipants } from './useParticipants.js';
 export { useRiders } from './useRiders.js';
 export { useHorses } from './useHorses.js';
-export { useFormState } from './useFormState.js';
\ No newline at end of file
+export { useFormState } from './useFormState.js';
+export { useCalendarView } from './useCalendarView.js';
```

### frontend/src/hooks/useCalendarView.js

```diff
diff --git a/frontend/src/hooks/useCalendarView.js b/frontend/src/hooks/useCalendarView.js
index e13fb167..f10f019c 100644
--- a/frontend/src/hooks/useCalendarView.js
+++ b/frontend/src/hooks/useCalendarView.js
@@ -1,28 +1,31 @@
-import { useState, useEffect } from 'react';
+import React from 'react';
 import { format, startOfWeek } from 'date-fns';
 import { fr } from 'date-fns/locale';
 import { scheduleApi } from '../services/calendarApi';
+import { isLessonConfirmed, isLessonBlocked } from '../lib/domains/lessons/statuses';
+import { calculateCalendarStats } from '../lib/helpers/domains/lessons/stats';
+import { formatWeekTitle } from '../lib/helpers/shared/formatters/date';
 
 /**
  * Custom hook for managing calendar view data and operations
  * @returns {Object} Calendar data, loading state, error, and handler functions
  */
 export function useCalendarView() {
-  const [currentDate, setCurrentDate] = useState(new Date());
-  const [weekData, setWeekData] = useState(null);
-  const [loading, setLoading] = useState(true);
-  const [error, setError] = useState(null);
-  const [selectedLesson, setSelectedLesson] = useState(null);
-  const [showLessonModal, setShowLessonModal] = useState(false); // CHANGED: For viewing/editing
-  const [showSingleLessonModal, setShowSingleLessonModal] = useState(false); // For creation only
-  const [showBlockedTimeModal, setShowBlockedTimeModal] = useState(false); // For creation only
-  const [filters, setFilters] = useState({
+  const [currentDate, setCurrentDate] = React.useState(new Date());
+  const [weekData, setWeekData] = React.useState(null);
+  const [loading, setLoading] = React.useState(true);
+  const [error, setError] = React.useState(null);
+  const [selectedLesson, setSelectedLesson] = React.useState(null);
+  const [showLessonModal, setShowLessonModal] = React.useState(false);
+  const [showSingleLessonModal, setShowSingleLessonModal] = React.useState(false);
+  const [showBlockedTimeModal, setShowBlockedTimeModal] = React.useState(false);
+  const [filters, setFilters] = React.useState({
     lessonType: 'all',
     status: 'all',
     showBlocked: true,
   });
 
-  useEffect(() => {
+  React.useEffect(() => {
     loadWeekData();
   }, [currentDate, filters]);
 
@@ -46,39 +49,35 @@ export function useCalendarView() {
     }
   };
 
-  const handlePrevWeek = () => {
+  const handlePrevWeek = React.useCallback(() => {
     setCurrentDate((prev) => {
       const newDate = new Date(prev);
       newDate.setDate(newDate.getDate() - 7);
       return newDate;
     });
-  };
+  }, []);
 
-  const handleNextWeek = () => {
+  const handleNextWeek = React.useCallback(() => {
     setCurrentDate((prev) => {
       const newDate = new Date(prev);
       newDate.setDate(newDate.getDate() + 7);
       return newDate;
     });
-  };
+  }, []);
 
-  const handleToday = () => {
+  const handleToday = React.useCallback(() => {
     setCurrentDate(new Date());
-  };
-
-  const handleLessonClick = (lesson) => {
-    console.log('Lesson clicked:', lesson);
+  }, []);
 
+  const handleLessonClick = React.useCallback((lesson) => {
     setSelectedLesson(lesson);
-    // Always open LessonModal for viewing/editing existing lessons
     setShowLessonModal(true);
     setShowSingleLessonModal(false);
     setShowBlockedTimeModal(false);
-  };
+  }, []);
 
-  const handleCreateLesson = (initialData = null) => {
+  const handleCreateLesson = React.useCallback((initialData = null) => {
     if (initialData) {
-      // Quick create from day column selection
       setSelectedLesson({
         date: initialData.date,
         start_time: initialData.start_time,
@@ -87,89 +86,55 @@ export function useCalendarView() {
         status: 'scheduled',
       });
     } else {
-      // Create from header button
       setSelectedLesson(null);
     }
 
     setShowSingleLessonModal(true);
     setShowLessonModal(false);
     setShowBlockedTimeModal(false);
-  };
+  }, []);
 
-  const handleCreateBlockedTime = () => {
+  const handleCreateBlockedTime = React.useCallback(() => {
     setSelectedLesson(null);
     setShowBlockedTimeModal(true);
     setShowLessonModal(false);
     setShowSingleLessonModal(false);
-  };
+  }, []);
 
-  const handleFilterChange = (filterName, value) => {
+  const handleFilterChange = React.useCallback((filterName, value) => {
     setFilters((prev) => ({
       ...prev,
       [filterName]: value,
     }));
-  };
+  }, []);
 
-  // Modal handlers
-  const closeLessonModal = () => {
+  const closeLessonModal = React.useCallback(() => {
     setShowLessonModal(false);
     setSelectedLesson(null);
-  };
+  }, []);
 
-  const closeSingleLessonModal = () => {
+  const closeSingleLessonModal = React.useCallback(() => {
     setShowSingleLessonModal(false);
     setSelectedLesson(null);
-  };
+  }, []);
 
-  const closeBlockedTimeModal = () => {
+  const closeBlockedTimeModal = React.useCallback(() => {
     setShowBlockedTimeModal(false);
     setSelectedLesson(null);
-  };
+  }, []);
 
-  const handleModalSuccess = () => {
-    // Close all modals
+  const handleModalSuccess = React.useCallback(() => {
     closeLessonModal();
     closeSingleLessonModal();
     closeBlockedTimeModal();
-
-    // Reload data
     loadWeekData();
-  };
-
-  // Utility functions
-  const getWeekTitle = () => {
-    if (!weekData || !weekData.period) return 'Chargement...';
-
-    const start = new Date(weekData.period.start);
-    const end = new Date(weekData.period.end);
-
-    // Validate dates before formatting
-    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
-      return 'Semaine en cours';
-    }
+  }, []);
 
-    return `Semaine du ${format(start, 'dd MMMM', { locale: fr })} au ${format(
-      end,
-      'dd MMMM yyyy',
-      { locale: fr }
-    )}`;
-  };
-
-  const getCalendarStats = () => {
-    if (!weekData || !weekData.days) return { total: 0, confirmed: 0, blocked: 0 };
-
-    // Flatten all lessons from all days
-    const allLessons = weekData.days.flatMap((day) => day.lessons || []);
-
-    return {
-      total: allLessons.length,
-      confirmed: allLessons.filter((l) => l.status === 'confirmed').length,
-      blocked: allLessons.filter((l) => l.lesson_type === 'blocked').length,
-    };
-  };
+  // Use helper function from lib
+  const weekTitle = formatWeekTitle(weekData);
+  const stats = calculateCalendarStats(weekData);
 
-  // Clear messages
-  const clearError = () => setError(null);
+  const clearError = React.useCallback(() => setError(null), []);
 
   return {
     // State
@@ -178,12 +143,12 @@ export function useCalendarView() {
     loading,
     error,
     selectedLesson,
-    showLessonModal, // CHANGED
+    showLessonModal,
     showSingleLessonModal,
     showBlockedTimeModal,
     filters,
-    weekTitle: getWeekTitle(),
-    stats: getCalendarStats(),
+    weekTitle,
+    stats,
 
     // Actions
     handlePrevWeek,
@@ -195,7 +160,7 @@ export function useCalendarView() {
     handleFilterChange,
 
     // Modal handlers
-    closeLessonModal, // CHANGED
+    closeLessonModal,
     closeSingleLessonModal,
     closeBlockedTimeModal,
     handleModalSuccess,
```

### frontend/src/hooks/useHorseForm.js

```diff
diff --git a/frontend/src/hooks/useHorseForm.js b/frontend/src/hooks/useHorseForm.js
index 4d2eb6c4..4ec9d203 100644
--- a/frontend/src/hooks/useHorseForm.js
+++ b/frontend/src/hooks/useHorseForm.js
@@ -1,6 +1,8 @@
 import { useState, useEffect } from 'react';
 import { riderService } from '../services';
 import { validateHorseForm } from '../lib/helpers/domains/horses/validators';
+import { OWNER_TYPES } from '../lib/domains/horses/owners';
+import { HORSE_KIND_LABELS } from '../lib/domains/horses/kinds';
 
 /**
  * Custom hook for managing horse form data and operations
@@ -10,10 +12,10 @@ import { validateHorseForm } from '../lib/helpers/domains/horses/validators';
 export function useHorseForm(horse) {
   const [formData, setFormData] = useState({
     name: '',
-    kind: 'horse',
+    kind: HORSE_KIND_LABELS.HORSE.value,
     activity_start_date: '',
     activity_end_date: '',
-    is_owned_by: 'Propriétaire',
+    is_owned_by: OWNER_TYPES.OWNER.value,
     owner_id: null,
   });
   const [error, setError] = useState('');
@@ -21,12 +23,6 @@ export function useHorseForm(horse) {
   const [riders, setRiders] = useState([]);
   const [loadingRiders, setLoadingRiders] = useState(false);
 
-  const ownershipOptions = [
-    { value: 'Laury', label: 'Laury' },
-    { value: 'Propriétaire', label: 'Propriétaire' },
-    { value: 'Club', label: 'Club' },
-  ];
-
   const loadRiders = async () => {
     try {
       setLoadingRiders(true);
@@ -48,19 +44,19 @@ export function useHorseForm(horse) {
     if (horse) {
       setFormData({
         name: horse.name || '',
-        kind: horse.kind || 'horse',
+        kind: horse.kind || HORSE_KIND_LABELS.HORSE.value,
         activity_start_date: horse.activity_start_date || '',
         activity_end_date: horse.activity_end_date || '',
-        is_owned_by: horse.is_owned_by || 'Propriétaire',
+        is_owned_by: horse.is_owned_by || OWNER_TYPES.OWNER.value,
         owner_id: horse.owner_id || null,
       });
     } else {
       setFormData({
         name: '',
-        kind: 'horse',
+        kind: HORSE_KIND_LABELS.HORSE.value,
         activity_start_date: '',
         activity_end_date: '',
-        is_owned_by: 'Propriétaire',
+        is_owned_by: OWNER_TYPES.OWNER.value,
         owner_id: null,
       });
     }
@@ -92,10 +88,10 @@ export function useHorseForm(horse) {
   const resetForm = () => {
     setFormData({
       name: '',
-      kind: 'horse',
+      kind: HORSE_KIND_LABELS.HORSE.value,
       activity_start_date: '',
       activity_end_date: '',
-      is_owned_by: 'Propriétaire',
+      is_owned_by: OWNER_TYPES.OWNER.value,
       owner_id: null,
     });
     setError('');
@@ -108,14 +104,15 @@ export function useHorseForm(horse) {
     submitting,
     riders,
     loadingRiders,
-    ownershipOptions,
+    kindOptions: Object.values(HORSE_KIND_LABELS),
+    ownershipOptions: Object.values(OWNER_TYPES),
 
     // Actions
     handleChange,
     validateForm,
     resetForm,
 
-    // State setters - IMPORTANT: These must be included
+    // State setters
     setError,
     setSubmitting,
     setFormData,
```

### frontend/src/hooks/useLessonEdit.js

```diff
diff --git a/frontend/src/hooks/useLessonEdit.js b/frontend/src/hooks/useLessonEdit.js
index 21121740..6126b3c2 100644
--- a/frontend/src/hooks/useLessonEdit.js
+++ b/frontend/src/hooks/useLessonEdit.js
@@ -1,6 +1,11 @@
 import { useState } from 'react';
 import { lessonsApi } from '../services/calendarApi';
-import { calculateDurationInMinutes, addMinutesToTime } from '../lib/helpers/domains/lessons/formatters';
+import {
+  calculateDurationMinutes,
+  addMinutesToTime,
+} from '../lib/helpers/shared/formatters/duration';
+import { LESSON_STATUSES } from '../lib/domains/lessons/statuses';
+import { LESSON_TYPES, getLessonTypeConfig } from '../lib/domains/lessons/types';
 
 /**
  * Custom hook for managing lesson edit mode
@@ -22,11 +27,11 @@ export const useLessonEdit = (lessonData, onSaveSuccess) => {
       lesson_date: lessonData.lesson_date || '',
       start_time: lessonData.start_time || '',
       end_time: lessonData.end_time || '',
-      lesson_type: lessonData.lesson_type || 'private',
+      lesson_type: lessonData.lesson_type || LESSON_TYPES.PRIVATE.value,
       description: lessonData.description || '',
       max_participants: lessonData.max_participants || 1,
       min_participants: lessonData.min_participants || '',
-      status: lessonData.status || 'scheduled',
+      status: lessonData.status || LESSON_STATUSES.SCHEDULED,
       cancellation_reason: lessonData.cancellation_reason || '',
       not_given_by_laury: lessonData.not_given_by_laury || false,
       not_given_reason: lessonData.not_given_reason || '',
@@ -45,7 +50,7 @@ export const useLessonEdit = (lessonData, onSaveSuccess) => {
 
     // If start_time is changed, calculate new end_time based on duration
     if (name === 'start_time') {
-      const durationMinutes = calculateDurationInMinutes(
+      const durationMinutes = calculateDurationMinutes(
         editFormData.start_time,
         editFormData.end_time
       );
@@ -64,9 +69,9 @@ export const useLessonEdit = (lessonData, onSaveSuccess) => {
     }
   };
 
-  const handleTypeChange = (e, lessonTypes) => {
+  const handleTypeChange = (e) => {
     const type = e.target.value;
-    const typeConfig = lessonTypes.find((t) => t.value === type);
+    const typeConfig = getLessonTypeConfig(type);
 
     setEditFormData((prev) => ({
       ...prev,
```

### frontend/src/hooks/usePackageForm.js

```diff
diff --git a/frontend/src/hooks/usePackageForm.js b/frontend/src/hooks/usePackageForm.js
index d21f0bbc..36fe4356 100644
--- a/frontend/src/hooks/usePackageForm.js
+++ b/frontend/src/hooks/usePackageForm.js
@@ -1,5 +1,5 @@
 import { useState, useEffect } from 'react';
-import { validatePackageForm } from '../lib/helpers/domains/packages/packageValidators';
+import { validatePackageForm } from '../lib/helpers/domains/packages/validators';
 
 /**
  * Custom hook for managing package form state and validation
@@ -117,4 +117,4 @@ export function usePackageForm(packageData, riderId, onSubmit) {
     handleChange,
     handleSubmit,
   };
-}
+}
\ No newline at end of file
```

### frontend/src/hooks/usePackagesList.js

```diff
diff --git a/frontend/src/hooks/usePackagesList.js b/frontend/src/hooks/usePackagesList.js
index af515be6..0e90587a 100644
--- a/frontend/src/hooks/usePackagesList.js
+++ b/frontend/src/hooks/usePackagesList.js
@@ -1,5 +1,12 @@
 import { useState, useEffect } from 'react';
 import { packagesApi, ridersApi } from '../services';
+import {
+  PACKAGE_STATUS,
+  getPackageStatusLabel,
+  isPackageActive,
+  isPackageExpired,
+} from '../lib/domains/packages/statuses';
+import { isActive } from '../lib/helpers/shared/filters/activityFilters';
 
 /**
  * Custom hook for managing packages list data and operations
@@ -13,7 +20,7 @@ export function usePackagesList() {
   const [showModal, setShowModal] = useState(false);
   const [editingPackage, setEditingPackage] = useState(null);
   const [successMessage, setSuccessMessage] = useState('');
-  const [filter, setFilter] = useState('all');
+  const [filter, setFilter] = useState(PACKAGE_STATUS.ACTIVE);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [packageToDelete, setPackageToDelete] = useState(null);
 
@@ -53,15 +60,10 @@ export function usePackagesList() {
 
   const handleFormSubmit = async (packageData) => {
     try {
-      console.log('📤 Form submit - Editing:', !!editingPackage);
-      console.log('📤 Package data:', packageData);
-
       if (editingPackage) {
-        console.log('🔄 Updating package ID:', editingPackage.id);
         await packagesApi.update(editingPackage.id, packageData);
         setSuccessMessage('Forfait modifié avec succès');
       } else {
-        console.log('➕ Creating new package');
         await packagesApi.create(packageData);
         setSuccessMessage('Forfait créé avec succès');
       }
@@ -72,9 +74,7 @@ export function usePackagesList() {
 
       // Reload data after successful submission
       await loadData();
-      console.log('✅ Data reloaded');
     } catch (err) {
-      console.error('❌ Form submit error:', err);
       setError(err.message || 'Une erreur est survenue');
       throw err;
     }
@@ -94,7 +94,6 @@ export function usePackagesList() {
       setPackageToDelete(null);
       await loadData();
     } catch (err) {
-      console.error('❌ Error removing from inventory:', err);
       setError(err.message);
       setShowDeleteModal(false);
       setPackageToDelete(null);
@@ -119,19 +118,30 @@ export function usePackagesList() {
     }
   };
 
-  const isActive = (startDate, endDate) => {
-    const now = new Date();
-    const start = startDate ? new Date(startDate) : null;
-    const end = endDate ? new Date(endDate) : null;
+  /**
+   * Determine package status based on dates
+   * @param {Object} pkg - Package object
+   * @returns {string} Package status (active, expired, or suspended)
+   */
+  const getPackageStatus = (pkg) => {
+    if (!pkg) return PACKAGE_STATUS.SUSPENDED;
 
-    if (start && start > now) return false;
-    if (end && end < now) return false;
-    return true;
+    // Check if package is within active date range
+    if (!isActive(pkg.activity_start_date, pkg.activity_end_date)) {
+      return PACKAGE_STATUS.EXPIRED;
+    }
+
+    return PACKAGE_STATUS.ACTIVE;
   };
 
-  const getStatusBadge = (startDate, endDate) => {
-    const active = isActive(startDate, endDate);
-    return active ? 'Actif' : 'Inactif';
+  /**
+   * Get status badge label for display
+   * @param {Object} pkg - Package object
+   * @returns {string} Human-readable status label
+   */
+  const getStatusBadge = (pkg) => {
+    const status = getPackageStatus(pkg);
+    return getPackageStatusLabel(status);
   };
 
   const getRiderName = (riderId) => {
@@ -140,16 +150,21 @@ export function usePackagesList() {
   };
 
   const filteredPackages = packages.filter((pkg) => {
+    const status = getPackageStatus(pkg);
+
     if (filter === 'all') return true;
-    if (filter === 'active') return isActive(pkg.activity_start_date, pkg.activity_end_date);
-    if (filter === 'inactive') return !isActive(pkg.activity_start_date, pkg.activity_end_date);
+    if (filter === PACKAGE_STATUS.ACTIVE) return status === PACKAGE_STATUS.ACTIVE;
+    if (filter === PACKAGE_STATUS.EXPIRED) return status === PACKAGE_STATUS.EXPIRED;
+    if (filter === PACKAGE_STATUS.SUSPENDED) return status === PACKAGE_STATUS.SUSPENDED;
+
     return true;
   });
 
   const stats = {
     total: packages.length,
-    active: packages.filter((p) => isActive(p.activity_start_date, p.activity_end_date)).length,
-    inactive: packages.filter((p) => !isActive(p.activity_start_date, p.activity_end_date)).length,
+    active: packages.filter((p) => getPackageStatus(p) === PACKAGE_STATUS.ACTIVE).length,
+    expired: packages.filter((p) => getPackageStatus(p) === PACKAGE_STATUS.EXPIRED).length,
+    suspended: packages.filter((p) => getPackageStatus(p) === PACKAGE_STATUS.SUSPENDED).length,
   };
 
   const closePackageModal = () => {
@@ -189,6 +204,9 @@ export function usePackagesList() {
     filteredPackages,
     stats,
 
+    // Status constants
+    PACKAGE_STATUS,
+
     // Actions
     loadData,
     handleCreate,
@@ -204,9 +222,11 @@ export function usePackagesList() {
     closeDeleteModal,
 
     // Utility functions
-    isActive,
+    getPackageStatus,
     getStatusBadge,
     getRiderName,
+    isPackageActive,
+    isPackageExpired,
 
     // State setters
     clearSuccessMessage,
```

### frontend/src/hooks/usePairingForm.js

```diff
diff --git a/frontend/src/hooks/usePairingForm.js b/frontend/src/hooks/usePairingForm.js
index f2f76360..453211e1 100644
--- a/frontend/src/hooks/usePairingForm.js
+++ b/frontend/src/hooks/usePairingForm.js
@@ -99,4 +99,4 @@ export function usePairingForm(pairing, riderId) {
     setError,
     setSubmitting,
   };
-}
+}
\ No newline at end of file
```

### frontend/src/hooks/useRiderForm.js

```diff
diff --git a/frontend/src/hooks/useRiderForm.js b/frontend/src/hooks/useRiderForm.js
index 09079bbc..54537a20 100644
--- a/frontend/src/hooks/useRiderForm.js
+++ b/frontend/src/hooks/useRiderForm.js
@@ -118,4 +118,4 @@ export function useRiderForm(rider, onSubmit, onCancel) {
     setErrors,
     setFormData,
   };
-}
+}
\ No newline at end of file
```

### frontend/src/hooks/useRiderPackages.js

```diff
diff --git a/frontend/src/hooks/useRiderPackages.js b/frontend/src/hooks/useRiderPackages.js
index 79bbddd5..6b604c56 100644
--- a/frontend/src/hooks/useRiderPackages.js
+++ b/frontend/src/hooks/useRiderPackages.js
@@ -2,6 +2,13 @@ import { useState, useEffect } from 'react';
 import { ridersApi, packagesApi } from '../services';
 import { format } from 'date-fns';
 import { fr } from 'date-fns/locale';
+import {
+  isActive,
+  filterActivePackages,
+  PACKAGE_STATUS,
+  PACKAGE_STATUS_LABELS,
+  getPackageStatusLabel,
+} from '../lib/helpers/shared/filters/activityFilters';
 
 /**
  * Custom hook for managing rider packages data and operations
@@ -68,7 +75,7 @@ export function useRiderPackages(riderId) {
       setTimeout(() => setSuccessMessage(''), 3000);
       setShowDeleteModal(false);
       setPackageToDelete(null);
-      loadPackages();
+      await loadPackages();
     } catch (err) {
       setError(err.message);
       setShowDeleteModal(false);
@@ -85,7 +92,7 @@ export function useRiderPackages(riderId) {
       setTimeout(() => setSuccessMessage(''), 3000);
       setShowDeleteModal(false);
       setPackageToDelete(null);
-      loadPackages();
+      await loadPackages();
     } catch (err) {
       setError(err.message);
       setShowDeleteModal(false);
@@ -104,31 +111,41 @@ export function useRiderPackages(riderId) {
       }
       setTimeout(() => setSuccessMessage(''), 3000);
       setShowModal(false);
-      loadPackages();
+      setEditingPackage(null);
+      await loadPackages();
     } catch (err) {
       throw err;
     }
   };
 
-  const isActive = (startDate, endDate) => {
-    const now = new Date();
-    const start = startDate ? new Date(startDate) : null;
-    const end = endDate ? new Date(endDate) : null;
+  /**
+   * Determine package status based on dates
+   * @param {Object} pkg - Package object
+   * @returns {string} Package status (active, expired, or suspended)
+   */
+  const getPackageStatus = (pkg) => {
+    if (!pkg) return PACKAGE_STATUS.SUSPENDED;
+
+    // Check if package is within active date range
+    if (!isActive(pkg.activity_start_date, pkg.activity_end_date)) {
+      return PACKAGE_STATUS.EXPIRED;
+    }
 
-    if (start && start > now) return false;
-    if (end && end < now) return false;
-    return true;
+    return PACKAGE_STATUS.ACTIVE;
   };
 
-  const getStatusBadge = (startDate, endDate) => {
-    const active = isActive(startDate, endDate);
-    return active ? 'Actif' : 'Inactif';
+  /**
+   * Get status badge label for display
+   * @param {Object} pkg - Package object
+   * @returns {string} Human-readable status label
+   */
+  const getStatusBadge = (pkg) => {
+    const status = getPackageStatus(pkg);
+    return getPackageStatusLabel(status);
   };
 
-  // Filter active packages
-  const activePackages = packages.filter((pkg) =>
-    isActive(pkg.activity_start_date, pkg.activity_end_date)
-  );
+  // Filter active packages using helper function
+  const activePackages = filterActivePackages(packages);
 
   // Modal handlers
   const closePackageModal = () => {
@@ -169,6 +186,10 @@ export function useRiderPackages(riderId) {
     packageToDelete,
     activePackages,
 
+    // Status constants
+    PACKAGE_STATUS,
+    PACKAGE_STATUS_LABELS,
+
     // Actions
     loadPackages,
     handleCreate,
@@ -184,7 +205,9 @@ export function useRiderPackages(riderId) {
 
     // Utility functions
     isActive,
+    getPackageStatus,
     getStatusBadge,
+    getPackageStatusLabel,
 
     // State setters
     clearSuccessMessage,
```

### frontend/src/hooks/useRidersList.js

```diff
diff --git a/frontend/src/hooks/useRidersList.js b/frontend/src/hooks/useRidersList.js
index 1fe0d26e..48c6260f 100644
--- a/frontend/src/hooks/useRidersList.js
+++ b/frontend/src/hooks/useRidersList.js
@@ -2,6 +2,7 @@ import { useState, useEffect } from 'react';
 import { ridersApi } from '../services';
 import { format } from 'date-fns';
 import { fr } from 'date-fns/locale';
+import { isActive, ACTIVITY_STATUS_FILTERS } from '../lib/helpers/shared/filters/activityFilters';
 
 /**
  * Custom hook for managing riders list data and operations
@@ -17,6 +18,7 @@ export function useRidersList() {
   const [selectedRiderId, setSelectedRiderId] = useState(null);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [riderToDelete, setRiderToDelete] = useState(null);
+  const [filter, setFilter] = useState(ACTIVITY_STATUS_FILTERS.ALL);
 
   useEffect(() => {
     loadRiders();
@@ -66,7 +68,7 @@ export function useRidersList() {
       setTimeout(() => setSuccessMessage(''), 3000);
       setShowDeleteModal(false);
       setRiderToDelete(null);
-      loadRiders();
+      await loadRiders();
     } catch (err) {
       setError(err.message);
       setShowDeleteModal(false);
@@ -83,7 +85,7 @@ export function useRidersList() {
       setTimeout(() => setSuccessMessage(''), 3000);
       setShowDeleteModal(false);
       setRiderToDelete(null);
-      loadRiders();
+      await loadRiders();
     } catch (err) {
       setError(err.message);
       setShowDeleteModal(false);
@@ -102,35 +104,57 @@ export function useRidersList() {
       }
       setTimeout(() => setSuccessMessage(''), 3000);
       setShowModal(false);
-      loadRiders();
+      setEditingRider(null);
+      await loadRiders();
     } catch (err) {
       throw err;
     }
   };
 
-  const isActive = (startDate, endDate) => {
-    const now = new Date();
-    const start = startDate ? new Date(startDate) : null;
-    const end = endDate ? new Date(endDate) : null;
-
-    if (start && start > now) return false;
-    if (end && end < now) return false;
-    return true;
+  /**
+   * Get status badge label for display
+   * @param {Object} rider - Rider object
+   * @returns {string} Human-readable status label
+   */
+  const getStatusBadge = (rider) => {
+    if (!rider) return 'Inactif';
+    const active = isActive(rider.activity_start_date, rider.activity_end_date);
+    return active ? 'Actif' : 'Inactif';
   };
 
-  const getStatusBadge = (startDate, endDate) => {
-    const active = isActive(startDate, endDate);
-    return active ? 'Actif' : 'Inactif';
+  /**
+   * Get rider activity status
+   * @param {Object} rider - Rider object
+   * @returns {boolean} True if rider is active
+   */
+  const getRiderStatus = (rider) => {
+    if (!rider) return false;
+    return isActive(rider.activity_start_date, rider.activity_end_date);
   };
 
+  /**
+   * Get statistics about riders
+   * @returns {Object} Stats object with total, active, and inactive counts
+   */
   const getStats = () => {
     return {
       total: riders.length,
-      active: riders.filter((r) => isActive(r.activity_start_date, r.activity_end_date)).length,
-      inactive: riders.filter((r) => !isActive(r.activity_start_date, r.activity_end_date)).length,
+      active: riders.filter((r) => getRiderStatus(r)).length,
+      inactive: riders.filter((r) => !getRiderStatus(r)).length,
     };
   };
 
+  /**
+   * Filter riders based on activity status
+   * @returns {Array} Filtered array of riders
+   */
+  const filteredRiders = riders.filter((rider) => {
+    if (filter === ACTIVITY_STATUS_FILTERS.ALL) return true;
+    if (filter === ACTIVITY_STATUS_FILTERS.ACTIVE) return getRiderStatus(rider);
+    if (filter === ACTIVITY_STATUS_FILTERS.INACTIVE) return !getRiderStatus(rider);
+    return true;
+  });
+
   // Modal handlers
   const closeRiderModal = () => {
     setShowModal(false);
@@ -153,6 +177,7 @@ export function useRidersList() {
   return {
     // State
     riders,
+    filteredRiders,
     loading,
     error,
     showModal,
@@ -161,8 +186,12 @@ export function useRidersList() {
     selectedRiderId,
     showDeleteModal,
     riderToDelete,
+    filter,
     stats: getStats(),
 
+    // Filter constants
+    ACTIVITY_STATUS_FILTERS,
+
     // Actions
     handleCreate,
     handleEdit,
@@ -171,6 +200,7 @@ export function useRidersList() {
     handleRemoveFromInventory,
     handlePermanentDelete,
     handleFormSubmit,
+    setFilter,
 
     // Modal handlers
     closeRiderModal,
@@ -179,6 +209,7 @@ export function useRidersList() {
 
     // Utility functions
     getStatusBadge,
+    getRiderStatus,
     isActive,
 
     // State setters
```

### frontend/src/hooks/useTemplateForm.js

```diff
diff --git a/frontend/src/hooks/useTemplateForm.js b/frontend/src/hooks/useTemplateForm.js
index a8d0a2ed..909eab03 100644
--- a/frontend/src/hooks/useTemplateForm.js
+++ b/frontend/src/hooks/useTemplateForm.js
@@ -1,6 +1,7 @@
 import { useState, useEffect } from 'react';
 import { templatesApi } from '../services/calendarApi';
 import { ridersApi, horsesApi } from '../services';
+import { LESSON_TYPES } from '../lib/domains/lessons/types';
 
 /**
  * Custom hook for managing template form state and operations
@@ -33,14 +34,13 @@ export function useTemplateForm(template, onSuccess) {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
 
-  const lessonTypes = [
-    { value: 'private', label: '👤 Cours Particulier', maxP: 1, minP: 1 },
-    { value: 'group', label: '👥 Cours Collectif', maxP: 8, minP: 2 },
-    { value: 'training', label: '🎓 Stage', maxP: 12, minP: 3 },
-    { value: 'competition', label: '🏆 Concours', maxP: null, minP: 1 },
-    { value: 'event', label: '🎉 Événement', maxP: null, minP: 1 },
-    { value: 'blocked', label: '🚫 Plage Bloquée', maxP: 0, minP: 0 },
-  ];
+  // Use domain constants for lesson types
+  const lessonTypes = LESSON_TYPES.map((type) => ({
+    value: type.value,
+    label: type.labelShort || type.label,
+    maxP: type.maxP,
+    minP: type.minP,
+  }));
 
   const weekDays = [
     { value: 'monday', label: 'Lun' },
@@ -61,10 +61,7 @@ export function useTemplateForm(template, onSuccess) {
 
   const loadData = async () => {
     try {
-      const [ridersData, horsesData] = await Promise.all([
-        ridersApi.getAll(), 
-        horsesApi.getAll()
-      ]);
+      const [ridersData, horsesData] = await Promise.all([ridersApi.getAll(), horsesApi.getAll()]);
       setRiders(ridersData);
       setHorses(horsesData);
     } catch (err) {
@@ -118,7 +115,7 @@ export function useTemplateForm(template, onSuccess) {
           updated.min_participants = 0;
         } else if (prev.lesson_type === 'blocked') {
           // Restore default values when changing from blocked
-          const lessonType = lessonTypes.find(type => type.value === value);
+          const lessonType = lessonTypes.find((type) => type.value === value);
           if (lessonType) {
             updated.max_participants = lessonType.maxP || 8;
             updated.min_participants = lessonType.minP || 1;
@@ -170,12 +167,12 @@ export function useTemplateForm(template, onSuccess) {
     }
 
     if (!formData.start_time) {
-      setError('L\'heure de début est requise');
+      setError("L'heure de début est requise");
       return false;
     }
 
     if (!formData.duration_minutes || formData.duration_minutes < 15) {
-      setError('La durée doit être d\'au moins 15 minutes');
+      setError("La durée doit être d'au moins 15 minutes");
       return false;
     }
 
@@ -191,7 +188,7 @@ export function useTemplateForm(template, onSuccess) {
 
     if (formData.lesson_type !== 'blocked') {
       if (!formData.min_participants || formData.min_participants < 1) {
-        setError('Le nombre minimum de participants doit être d\'au moins 1');
+        setError("Le nombre minimum de participants doit être d'au moins 1");
         return false;
       }
 
@@ -206,7 +203,7 @@ export function useTemplateForm(template, onSuccess) {
 
   const handleSubmit = async (e) => {
     e.preventDefault();
-    
+
     if (!validateForm()) {
       return;
     }
@@ -222,7 +219,7 @@ export function useTemplateForm(template, onSuccess) {
       } else {
         await templatesApi.create(submitData);
       }
-      
+
       onSuccess();
     } catch (err) {
       console.error('Submit error:', err);
@@ -320,6 +317,6 @@ export function useTemplateForm(template, onSuccess) {
 
     // Utility
     validateForm,
-    prepareSubmitData
+    prepareSubmitData,
   };
-}
\ No newline at end of file
+}
```

### frontend/src/index.css

```diff
diff --git a/frontend/src/index.css b/frontend/src/index.css
deleted file mode 100644
index 71292b9d..00000000
--- a/frontend/src/index.css
+++ /dev/null
@@ -1,1096 +0,0 @@
-* {
-  margin: 0;
-  padding: 0;
-  box-sizing: border-box;
-}
-
-body {
-  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
-    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
-  -webkit-font-smoothing: antialiased;
-  -moz-osx-font-smoothing: grayscale;
-  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
-  min-height: 100vh;
-  color: #2d3748;
-  line-height: 1.6;
-}
-
-/* ============================================
-   LAYOUT & STRUCTURE
-   ============================================ */
-
-.app {
-  min-height: 100vh;
-  display: flex;
-  flex-direction: column;
-}
-
-.container {
-  max-width: 1200px;
-  margin: 0 auto;
-  padding: 20px;
-  width: 100%;
-}
-
-/* ============================================
-   HEADER & NAVIGATION
-   ============================================ */
-
-header {
-  background: rgba(255, 255, 255, 0.95);
-  backdrop-filter: blur(10px);
-  color: #2d3748;
-  padding: 20px 0;
-  margin-bottom: 30px;
-  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
-  border-bottom: 3px solid #667eea;
-}
-
-header .container {
-  display: flex;
-  justify-content: space-between;
-  align-items: center;
-  flex-wrap: wrap;
-  gap: 20px;
-}
-
-header h1 {
-  font-size: 2rem;
-  font-weight: 700;
-  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
-  -webkit-background-clip: text;
-  -webkit-text-fill-color: transparent;
-  background-clip: text;
-  margin: 0;
-}
-
-nav {
-  display: flex;
-  gap: 8px;
-  flex-wrap: wrap;
-}
-
-nav a {
-  color: #555;
-  text-decoration: none;
-  padding: 10px 16px;
-  border-radius: 8px;
-  transition: all 0.3s ease;
-  font-weight: 500;
-  border: 2px solid transparent;
-}
-
-nav a:hover {
-  background: rgba(102, 126, 234, 0.1);
-  color: #667eea;
-  transform: translateY(-1px);
-}
-
-nav a.active {
-  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
-  color: white;
-  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
-}
-
-main {
-  flex: 1;
-  padding-bottom: 40px;
-}
-
-/* ============================================
-   CARDS & SECTIONS
-   ============================================ */
-
-.card {
-  background: rgba(255, 255, 255, 0.95);
-  backdrop-filter: blur(10px);
-  padding: 30px;
-  border-radius: 16px;
-  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
-  margin-bottom: 20px;
-  border: 1px solid rgba(255, 255, 255, 0.2);
-}
-
-.card h2 {
-  margin-bottom: 24px;
-  color: #2d3748;
-  font-size: 1.5rem;
-  font-weight: 600;
-  display: flex;
-  align-items: center;
-  gap: 12px;
-}
-
-.card h2::before {
-  content: '';
-  width: 4px;
-  height: 24px;
-  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
-  border-radius: 2px;
-}
-
-.section {
-  background: white;
-  padding: 20px;
-  border-radius: 8px;
-  border: 1px solid #e2e8f0;
-  margin-bottom: 20px;
-}
-
-.section h3 {
-  margin: 0 0 16px 0;
-  color: #2d3748;
-  font-size: 1.25rem;
-  font-weight: 600;
-}
-
-.section-minimal {
-  padding: 15px 20px;
-  background: #f9fafb;
-  border-radius: 8px;
-  border: 1px solid #e2e8f0;
-  margin-bottom: 20px;
-}
-
-.section-minimal h3 {
-  margin: 0;
-  font-size: 1.1rem;
-  color: #2d3748;
-  font-weight: 600;
-}
-
-/* ============================================
-   FORMS
-   ============================================ */
-
-.form-group {
-  margin-bottom: 20px;
-}
-
-.form-group label {
-  display: block;
-  margin-bottom: 8px;
-  font-weight: 500;
-  color: #4a5568;
-  font-size: 0.95rem;
-}
-
-.form-group input,
-.form-group select {
-  width: 100%;
-  padding: 12px 16px;
-  border: 2px solid #e1e5e9;
-  border-radius: 8px;
-  font-size: 14px;
-  transition: all 0.3s ease;
-  background: white;
-  color: #2d3748;
-}
-
-.form-group input:focus,
-.form-group select:focus {
-  outline: none;
-  border-color: #667eea;
-  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
-  transform: translateY(-1px);
-}
-
-.form-group input::placeholder {
-  color: #a0aec0;
-}
-
-/* ============================================
-   BUTTONS
-   ============================================ */
-
-.btn {
-  padding: 12px 24px;
-  border: none;
-  border-radius: 8px;
-  cursor: pointer;
-  font-size: 14px;
-  font-weight: 500;
-  transition: all 0.3s ease;
-  margin-right: 12px;
-  margin-bottom: 8px;
-  display: inline-flex;
-  align-items: center;
-  justify-content: center;
-  gap: 8px;
-  text-decoration: none;
-  border: 2px solid transparent;
-}
-
-.btn:hover {
-  transform: translateY(-2px);
-  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
-}
-
-.btn:active {
-  transform: translateY(0);
-}
-
-.btn:disabled {
-  opacity: 0.6;
-  cursor: not-allowed;
-  transform: none;
-}
-
-/* Button Sizes */
-.btn-sm {
-  padding: 8px 12px !important;
-  font-size: 0.9rem;
-  margin: 0 !important;
-}
-
-.btn-icon {
-  padding: 8px 12px !important;
-  min-width: 36px;
-  height: 36px;
-  display: flex;
-  align-items: center;
-  justify-content: center;
-  font-size: 1.2rem;
-  font-weight: bold;
-  border-radius: 6px;
-  margin: 0 !important;
-}
-
-/* Button Colors */
-.btn-primary {
-  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
-  color: white;
-}
-
-.btn-primary:hover {
-  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
-}
-
-.btn-success {
-  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
-  color: white;
-}
-
-.btn-success:hover {
-  box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
-}
-
-.btn-danger {
-  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
-  color: white;
-}
-
-.btn-danger:hover {
-  box-shadow: 0 6px 20px rgba(245, 101, 101, 0.4);
-}
-
-.btn-secondary {
-  background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
-  color: white;
-}
-
-.btn-secondary:hover {
-  box-shadow: 0 6px 20px rgba(113, 128, 150, 0.4);
-}
-
-.btn-warning {
-  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
-  color: white;
-}
-
-.btn-warning:hover {
-  box-shadow: 0 6px 20px rgba(237, 137, 54, 0.4);
-}
-
-/* ============================================
-   TABLES
-   ============================================ */
-
-.table {
-  width: 100%;
-  border-collapse: separate;
-  border-spacing: 0;
-  margin-top: 20px;
-  background: white;
-  border-radius: 8px;
-  overflow: hidden;
-  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
-}
-
-.table th,
-.table td {
-  padding: 16px;
-  text-align: left;
-  border-bottom: 1px solid #e1e5e9;
-  color: #2d3748;
-}
-
-.table th {
-  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
-  font-weight: 600;
-  color: #4a5568;
-  font-size: 0.875rem;
-  text-transform: uppercase;
-  letter-spacing: 0.5px;
-}
-
-.table tbody tr:hover {
-  background: #f7fafc;
-}
-
-.table tbody tr:last-child td {
-  border-bottom: none;
-}
-
-.table .actions {
-  display: flex;
-  gap: 8px;
-  flex-wrap: wrap;
-}
-
-.table .actions button {
-  padding: 8px 12px;
-  font-size: 12px;
-  margin: 0;
-}
-
-.table-sm {
-  font-size: 0.875rem;
-}
-
-.table-sm th,
-.table-sm td {
-  padding: 8px 12px;
-}
-
-.table-responsive {
-  overflow-x: auto;
-  -webkit-overflow-scrolling: touch;
-}
-
-/* ============================================
-   BADGES
-   ============================================ */
-
-.badge {
-  display: inline-block;
-  padding: 6px 12px;
-  border-radius: 20px;
-  font-size: 12px;
-  font-weight: 600;
-  text-transform: uppercase;
-  letter-spacing: 0.5px;
-  color: white;
-}
-
-.badge-horse {
-  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
-}
-
-.badge-pony {
-  background: linear-gradient(135deg, #ed64a6 0%, #d53f8c 100%);
-}
-
-.badge-success {
-  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
-}
-
-.badge-secondary {
-  background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
-}
-
-.badge-info {
-  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
-}
-
-.badge-primary {
-  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
-}
-
-/* ============================================
-   ALERTS & MESSAGES
-   ============================================ */
-
-.alert {
-  padding: 16px 20px;
-  border-radius: 8px;
-  margin-bottom: 20px;
-  border-left: 4px solid;
-  font-weight: 500;
-}
-
-.alert-success {
-  background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
-  color: #22543d;
-  border-left-color: #38a169;
-}
-
-.alert-error {
-  background: linear-gradient(135deg, #fed7d7 0%, #fc8181 100%);
-  color: #742a2a;
-  border-left-color: #e53e3e;
-}
-
-.error {
-  background: linear-gradient(135deg, #fed7d7 0%, #fc8181 100%);
-  color: #742a2a;
-  padding: 16px 20px;
-  border-radius: 8px;
-  margin-bottom: 20px;
-  border-left: 4px solid #e53e3e;
-  font-weight: 500;
-}
-
-.success {
-  background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
-  color: #22543d;
-  padding: 16px 20px;
-  border-radius: 8px;
-  margin-bottom: 20px;
-  border-left: 4px solid #38a169;
-  font-weight: 500;
-}
-
-/* ============================================
-   LOADING & EMPTY STATES
-   ============================================ */
-
-.loading {
-  text-align: center;
-  padding: 60px 20px;
-  color: white;
-  font-size: 1.1rem;
-}
-
-.loading::before {
-  content: '';
-  display: inline-block;
-  width: 40px;
-  height: 40px;
-  border: 4px solid rgba(255, 255, 255, 0.3);
-  border-top: 4px solid white;
-  border-radius: 50%;
-  animation: spin 1s linear infinite;
-  margin-bottom: 16px;
-}
-
-.loading-spinner {
-  width: 16px;
-  height: 16px;
-  border: 2px solid rgba(255, 255, 255, 0.3);
-  border-top: 2px solid white;
-  border-radius: 50%;
-  animation: spin 1s linear infinite;
-  display: inline-block;
-}
-
-@keyframes spin {
-  0% {
-    transform: rotate(0deg);
-  }
-  100% {
-    transform: rotate(360deg);
-  }
-}
-
-.empty-state {
-  text-align: center;
-  padding: 80px 20px;
-  color: white;
-}
-
-.empty-state-icon {
-  font-size: 64px;
-  margin-bottom: 24px;
-  opacity: 0.8;
-}
-
-.empty-state h3 {
-  font-size: 1.5rem;
-  margin-bottom: 12px;
-  font-weight: 600;
-}
-
-.empty-state p {
-  font-size: 1.1rem;
-  margin-bottom: 24px;
-  opacity: 0.9;
-}
-
-.empty-state-small {
-  text-align: center;
-  padding: 30px;
-  background: #f7fafc;
-  border-radius: 8px;
-  border: 2px dashed #cbd5e0;
-}
-
-.empty-state-small p {
-  color: #718096;
-  margin-bottom: 15px;
-}
-
-/* ============================================
-   MODALS
-   ============================================ */
-
-.modal-overlay {
-  position: fixed;
-  top: 0;
-  left: 0;
-  right: 0;
-  bottom: 0;
-  background: rgba(0, 0, 0, 0.6);
-  display: flex;
-  align-items: center;
-  justify-content: center;
-  z-index: 1000;
-  padding: 20px;
-  backdrop-filter: blur(4px);
-}
-
-.modal {
-  background: white;
-  padding: 32px;
-  border-radius: 16px;
-  max-width: 600px;
-  width: 100%;
-  max-height: 90vh;
-  overflow-y: auto;
-  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
-  animation: modalSlideIn 0.3s ease;
-}
-
-.rider-card-modal {
-  max-width: 1400px;
-  width: 95%;
-}
-
-@keyframes modalSlideIn {
-  from {
-    opacity: 0;
-    transform: translateY(-30px) scale(0.95);
-  }
-  to {
-    opacity: 1;
-    transform: translateY(0) scale(1);
-  }
-}
-
-.modal-header {
-  display: flex;
-  justify-content: space-between;
-  align-items: center;
-  margin-bottom: 24px;
-  padding-bottom: 16px;
-  border-bottom: 2px solid #e1e5e9;
-}
-
-.modal-header h3 {
-  color: #2d3748;
-  font-size: 1.3rem;
-  font-weight: 600;
-  margin: 0;
-}
-
-.modal-close {
-  background: none;
-  border: none;
-  font-size: 24px;
-  cursor: pointer;
-  color: #718096;
-  padding: 0;
-  width: 32px;
-  height: 32px;
-  display: flex;
-  align-items: center;
-  justify-content: center;
-  border-radius: 6px;
-  transition: all 0.2s ease;
-}
-
-.modal-close:hover {
-  color: #e53e3e;
-  background: #fed7d7;
-}
-
-.modal-body {
-  padding: 20px;
-}
-
-.modal-footer {
-  margin-top: 24px;
-  padding-top: 16px;
-  border-top: 2px solid #e1e5e9;
-  display: flex;
-  gap: 12px;
-  justify-content: flex-end;
-}
-
-/* ============================================
-   RIDER CARD SPECIFIC
-   ============================================ */
-
-.rider-card-content {
-  padding: 20px;
-}
-
-.rider-info-section {
-  background: #f7fafc;
-  padding: 20px;
-  border-radius: 8px;
-  border: 1px solid #e2e8f0;
-  margin-bottom: 30px;
-}
-
-.info-grid {
-  display: grid;
-  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
-  gap: 15px;
-  margin-top: 15px;
-}
-
-.info-item {
-  display: flex;
-  flex-direction: column;
-  gap: 5px;
-}
-
-.info-label {
-  font-size: 0.875rem;
-  color: #718096;
-  font-weight: 500;
-}
-
-.info-value {
-  font-size: 1rem;
-  color: #2d3748;
-  font-weight: 600;
-}
-
-.date-status-row {
-  display: flex;
-  align-items: center;
-  gap: 20px;
-  flex-wrap: wrap;
-  margin-top: 15px;
-}
-
-.date-status-item {
-  display: flex;
-  align-items: center;
-  gap: 8px;
-  white-space: nowrap;
-}
-
-.date-status-item .info-label {
-  margin: 0;
-  font-size: 0.8rem;
-  color: #718096;
-}
-
-.date-status-item .info-value {
-  margin: 0;
-  font-size: 0.95rem;
-  color: #2d3748;
-}
-
-/* Owned Horses */
-.owned-horses-list {
-  display: flex;
-  flex-wrap: wrap;
-  gap: 10px;
-}
-
-.owned-horse-item {
-  display: flex;
-  align-items: center;
-  gap: 8px;
-  padding: 8px 12px;
-  background: white;
-  border-radius: 6px;
-  border: 1px solid #e2e8f0;
-  font-size: 0.9rem;
-}
-
-.horse-name-type {
-  display: flex;
-  align-items: center;
-  gap: 8px;
-}
-
-.horse-name-type strong {
-  color: #2d3748;
-}
-
-.horse-name-type .badge {
-  padding: 4px 8px;
-  font-size: 0.75rem;
-}
-
-/* Packages */
-.packages-list {
-  display: flex;
-  flex-direction: column;
-  gap: 10px;
-}
-
-.package-item {
-  display: flex;
-  align-items: center;
-  justify-content: space-between;
-  padding: 12px;
-  background: white;
-  border-radius: 6px;
-  border: 1px solid #e2e8f0;
-  transition: all 0.2s ease;
-}
-
-.package-item:hover {
-  border-color: #cbd5e0;
-  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
-}
-
-.package-info {
-  display: flex;
-  align-items: center;
-  gap: 16px;
-  flex: 1;
-}
-
-.package-id {
-  font-weight: 600;
-  color: #2d3748;
-  min-width: 40px;
-}
-
-.package-lessons {
-  display: flex;
-  gap: 8px;
-}
-
-.lesson-badge {
-  display: inline-flex;
-  align-items: center;
-  gap: 4px;
-  padding: 4px 8px;
-  background: #edf2f7;
-  border-radius: 4px;
-  font-size: 0.85rem;
-  color: #4a5568;
-  font-weight: 500;
-}
-
-/* Pairings */
-.pairings-list {
-  display: flex;
-  flex-direction: column;
-  gap: 10px;
-}
-
-.pairing-item {
-  display: flex;
-  align-items: center;
-  justify-content: space-between;
-  padding: 12px;
-  background: white;
-  border-radius: 6px;
-  border: 1px solid #e2e8f0;
-  transition: all 0.2s ease;
-}
-
-.pairing-item:hover {
-  border-color: #cbd5e0;
-  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
-}
-
-.pairing-info {
-  display: flex;
-  align-items: center;
-  flex: 1;
-}
-
-.pairing-horse-name {
-  font-weight: 600;
-  color: #2d3748;
-  font-size: 0.95rem;
-}
-
-.pairing-actions {
-  display: flex;
-  gap: 8px;
-  margin-left: 12px;
-}
-
-/* ============================================
-   STATISTICS
-   ============================================ */
-
-.stats-grid {
-  display: grid;
-  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
-  gap: 16px;
-  margin-bottom: 24px;
-}
-
-.stat-card {
-  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
-  padding: 20px;
-  border-radius: 12px;
-  text-align: center;
-  border: 2px solid #e2e8f0;
-  transition: all 0.3s ease;
-}
-
-.stat-card:hover {
-  transform: translateY(-2px);
-  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
-}
-
-.stat-number {
-  display: block;
-  font-size: 2rem;
-  font-weight: 700;
-  color: #667eea;
-  margin-bottom: 4px;
-}
-
-.stat-label {
-  font-size: 0.9rem;
-  color: #718096;
-  font-weight: 500;
-  text-transform: uppercase;
-  letter-spacing: 0.5px;
-}
-
-/* ============================================
-   FILTERS
-   ============================================ */
-
-.filter-buttons {
-  display: flex;
-  gap: 8px;
-  flex-wrap: wrap;
-  margin-bottom: 24px;
-}
-
-.filter-buttons .btn {
-  margin: 0;
-}
-
-/* ============================================
-   UTILITY CLASSES
-   ============================================ */
-
-.text-center {
-  text-align: center;
-}
-
-.mt-20 {
-  margin-top: 20px;
-}
-
-.mb-15 {
-  margin-bottom: 15px;
-}
-
-.mb-20 {
-  margin-bottom: 20px;
-}
-
-.mb-30 {
-  margin-bottom: 30px;
-}
-
-.flex {
-  display: flex;
-}
-
-.flex-between {
-  display: flex;
-  justify-content: space-between;
-  align-items: center;
-}
-
-.flex-center {
-  display: flex;
-  align-items: center;
-  justify-content: center;
-}
-
-.gap-10 {
-  gap: 10px;
-}
-
-.gap-20 {
-  gap: 20px;
-}
-
-/* ============================================
-   RESPONSIVE DESIGN
-   ============================================ */
-
-@media (max-width: 1200px) {
-  .rider-card-modal {
-    max-width: 90%;
-    width: 90%;
-  }
-}
-
-@media (max-width: 768px) {
-  .container {
-    padding: 16px;
-  }
-
-  header .container {
-    flex-direction: column;
-    align-items: stretch;
-  }
-
-  header h1 {
-    text-align: center;
-    font-size: 1.5rem;
-  }
-
-  nav {
-    justify-content: center;
-  }
-
-  .card {
-    padding: 20px;
-  }
-
-  .table {
-    font-size: 0.875rem;
-  }
-
-  .table th,
-  .table td {
-    padding: 12px 8px;
-  }
-
-  .table .actions {
-    flex-direction: column;
-  }
-
-  .modal {
-    margin: 20px;
-    padding: 24px;
-  }
-
-  .btn {
-    padding: 10px 16px;
-    font-size: 13px;
-  }
-
-  .stats-grid {
-    grid-template-columns: repeat(2, 1fr);
-  }
-
-  .rider-card-modal {
-    width: 95%;
-    max-height: 95vh;
-  }
-
-  .info-grid {
-    grid-template-columns: 1fr;
-  }
-
-  .date-status-row {
-    flex-direction: column;
-    align-items: flex-start;
-    gap: 12px;
-  }
-
-  .date-status-item {
-    flex-direction: column;
-    gap: 4px;
-  }
-
-  .owned-horses-list {
-    flex-direction: column;
-    gap: 8px;
-  }
-
-  .owned-horse-item {
-    width: 100%;
-  }
-
-  .package-item {
-    flex-direction: column;
-    align-items: flex-start;
-    gap: 10px;
-  }
-
-  .package-info {
-    width: 100%;
-    flex-direction: column;
-    gap: 8px;
-  }
-
-  .package-item .btn-secondary {
-    align-self: flex-end;
-  }
-
-  .pairing-item {
-    flex-direction: column;
-    align-items: flex-start;
-    gap: 10px;
-  }
-
-  .pairing-info {
-    width: 100%;
-  }
-
-  .pairing-actions {
-    width: 100%;
-    justify-content: flex-end;
-    margin-left: 0;
-  }
-}
-
-@media (max-width: 480px) {
-  .stats-grid {
-    grid-template-columns: 1fr;
-  }
-
-  .rider-card-modal {
-    width: 98%;
-  }
-
-  .modal {
-    padding: 20px;
-  }
-
-  .card {
-    padding: 16px;
-  }
-
-  header h1 {
-    font-size: 1.3rem;
-  }
-
-  .btn {
-    padding: 8px 12px;
-    font-size: 12px;
-  }
-}
-/* Add this to your CSS file */
-.spin {
-  animation: spin 1s linear infinite;
-}
-
-@keyframes spin {
-  from {
-    transform: rotate(0deg);
-  }
-  to {
-    transform: rotate(360deg);
-  }
-}
-
-.badge.clickable:hover {
-  opacity: 0.8;
-  transform: scale(1.05);
-  transition: all 0.2s ease;
-}
```

### frontend/src/lib/config/api.js

```diff
diff --git a/frontend/src/lib/config/api.js b/frontend/src/lib/config/api.js
deleted file mode 100644
index f3753af7..00000000
--- a/frontend/src/lib/config/api.js
+++ /dev/null
@@ -1,102 +0,0 @@
-/**
- * API Configuration Constants
- */
-
-// API endpoints
-export const API_ENDPOINTS = {
-  // Authentication
-  AUTH: {
-    LOGIN: '/auth/login',
-    LOGOUT: '/auth/logout',
-    REFRESH: '/auth/refresh',
-  },
-  
-  // Lessons
-  LESSONS: {
-    LIST: '/lessons',
-    CREATE: '/lessons',
-    UPDATE: '/lessons/:id',
-    DELETE: '/lessons/:id',
-    GET: '/lessons/:id',
-  },
-  
-  // Horses
-  HORSES: {
-    LIST: '/horses',
-    CREATE: '/horses',
-    UPDATE: '/horses/:id',
-    DELETE: '/horses/:id',
-    GET: '/horses/:id',
-    RIDERS: '/horses/:id/riders',
-  },
-  
-  // Riders
-  RIDERS: {
-    LIST: '/riders',
-    CREATE: '/riders',
-    UPDATE: '/riders/:id',
-    DELETE: '/riders/:id',
-    GET: '/riders/:id',
-    HORSES: '/riders/:id/horses',
-    PACKAGES: '/riders/:id/packages',
-  },
-  
-  // Packages
-  PACKAGES: {
-    LIST: '/packages',
-    CREATE: '/packages',
-    UPDATE: '/packages/:id',
-    DELETE: '/packages/:id',
-    GET: '/packages/:id',
-  },
-  
-  // Pairings
-  PAIRINGS: {
-    LIST: '/pairings',
-    CREATE: '/pairings',
-    UPDATE: '/pairings/:id',
-    DELETE: '/pairings/:id',
-    GET: '/pairings/:id',
-  },
-  
-  // Templates
-  TEMPLATES: {
-    LIST: '/templates',
-    CREATE: '/templates',
-    UPDATE: '/templates/:id',
-    DELETE: '/templates/:id',
-    GET: '/templates/:id',
-  },
-};
-
-// API settings
-export const API_SETTINGS = {
-  TIMEOUT: 30000, // 30 seconds
-  RETRY_ATTEMPTS: 3,
-  RETRY_DELAY: 1000, // 1 second
-  CACHE_DURATION: 300000, // 5 minutes
-};
-
-// HTTP status codes
-export const HTTP_STATUS = {
-  OK: 200,
-  CREATED: 201,
-  NO_CONTENT: 204,
-  BAD_REQUEST: 400,
-  UNAUTHORIZED: 401,
-  FORBIDDEN: 403,
-  NOT_FOUND: 404,
-  CONFLICT: 409,
-  INTERNAL_SERVER_ERROR: 500,
-};
-
-// Error messages
-export const ERROR_MESSAGES = {
-  NETWORK: 'Erreur de connexion. Veuillez vérifier votre internet.',
-  TIMEOUT: 'La demande a expiré. Veuillez réessayer.',
-  UNAUTHORIZED: 'Vous devez vous connecter pour accéder à cette ressource.',
-  FORBIDDEN: 'Vous n\'avez pas les permissions pour accéder à cette ressource.',
-  NOT_FOUND: 'La ressource demandée n\'existe pas.',
-  SERVER_ERROR: 'Une erreur serveur est survenue. Veuillez réessayer plus tard.',
-  UNKNOWN: 'Une erreur inconnue est survenue.',
-};
\ No newline at end of file
```

### frontend/src/lib/config/forms.js

```diff
diff --git a/frontend/src/lib/config/forms.js b/frontend/src/lib/config/forms.js
deleted file mode 100644
index de1f84e9..00000000
--- a/frontend/src/lib/config/forms.js
+++ /dev/null
@@ -1,100 +0,0 @@
-/**
- * Form Configuration Constants
- */
-
-// Form field types
-export const FIELD_TYPES = {
-  TEXT: 'text',
-  EMAIL: 'email',
-  PHONE: 'phone',
-  NUMBER: 'number',
-  DATE: 'date',
-  TIME: 'time',
-  SELECT: 'select',
-  TEXTAREA: 'textarea',
-  CHECKBOX: 'checkbox',
-  RADIO: 'radio',
-};
-
-// Form validation messages
-export const VALIDATION_MESSAGES = {
-  REQUIRED: 'Ce champ est requis',
-  INVALID_EMAIL: 'Format d\'email invalide',
-  INVALID_PHONE: 'Format de téléphone invalide',
-  MIN_LENGTH: 'Ce champ doit contenir au moins {min} caractères',
-  MAX_LENGTH: 'Ce champ ne peut pas dépasser {max} caractères',
-  INVALID_DATE: 'Date invalide',
-  INVALID_TIME: 'Heure invalide',
-};
-
-// Horse form configuration
-export const HORSE_FORM_FIELDS = {
-  name: {
-    type: FIELD_TYPES.TEXT,
-    label: 'Nom du cheval',
-    required: true,
-    maxLength: 100,
-  },
-  kind: {
-    type: FIELD_TYPES.SELECT,
-    label: 'Type de cheval',
-    required: true,
-    options: ['horse', 'pony'],
-  },
-  activity_start_date: {
-    type: FIELD_TYPES.DATE,
-    label: 'Date de début d\'activité',
-    required: true,
-  },
-  activity_end_date: {
-    type: FIELD_TYPES.DATE,
-    label: 'Date de fin d\'activité',
-    required: false,
-  },
-  is_owned_by: {
-    type: FIELD_TYPES.SELECT,
-    label: 'Propriétaire',
-    required: true,
-    options: ['Laury', 'Propriétaire', 'Club'],
-  },
-  owner_id: {
-    type: FIELD_TYPES.SELECT,
-    label: 'Cavalier propriétaire',
-    required: false,
-    dependsOn: 'is_owned_by',
-    showWhen: 'Propriétaire',
-  },
-};
-
-// Rider form configuration
-export const RIDER_FORM_FIELDS = {
-  name: {
-    type: FIELD_TYPES.TEXT,
-    label: 'Nom du cavalier',
-    required: true,
-    maxLength: 100,
-  },
-  email: {
-    type: FIELD_TYPES.EMAIL,
-    label: 'Email',
-    required: false,
-  },
-  phone: {
-    type: FIELD_TYPES.PHONE,
-    label: 'Téléphone',
-    required: false,
-  },
-  address: {
-    type: FIELD_TYPES.TEXTAREA,
-    label: 'Adresse',
-    required: false,
-    maxLength: 500,
-  },
-};
-
-// Default form settings
-export const FORM_SETTINGS = {
-  AUTO_SAVE: false,
-  CONFIRM_ON_LEAVE: true,
-  RESET_ON_SUCCESS: false,
-};
\ No newline at end of file
```

### frontend/src/lib/config/index.js

```diff
diff --git a/frontend/src/lib/config/index.js b/frontend/src/lib/config/index.js
index c8b20884..4fe076cc 100644
--- a/frontend/src/lib/config/index.js
+++ b/frontend/src/lib/config/index.js
@@ -1,6 +1,7 @@
 /**
- * Configuration constants
+ * Configuration Constants - Main Export
  */
-export * from './ui';
+
+export * from './api';
 export * from './forms';
-export * from './api';
\ No newline at end of file
+export * from './ui';
\ No newline at end of file
```

### frontend/src/lib/config/ui.js

```diff
diff --git a/frontend/src/lib/config/ui.js b/frontend/src/lib/config/ui.js
deleted file mode 100644
index 48460d95..00000000
--- a/frontend/src/lib/config/ui.js
+++ /dev/null
@@ -1,126 +0,0 @@
-/**
- * UI Configuration Constants
- */
-
-// Modal sizes
-export const MODAL_SIZES = {
-  SMALL: 'small',
-  MEDIUM: 'medium',
-  LARGE: 'large',
-};
-
-// Modal default settings
-export const MODAL_CONFIG = {
-  defaultSize: MODAL_SIZES.MEDIUM,
-  closeOnOverlay: true,
-  animationDuration: 300,
-};
-
-// Form validation rules
-export const VALIDATION_RULES = {
-  NAME: {
-    minLength: 1,
-    maxLength: 100,
-    required: true,
-  },
-  EMAIL: {
-    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
-    required: false,
-  },
-  PHONE: {
-    pattern: /^[\d\s\-+()]+$/,
-    minLength: 10,
-    required: false,
-  },
-  DESCRIPTION: {
-    maxLength: 500,
-    required: false,
-  },
-};
-
-// Date formats
-export const DATE_FORMATS = {
-  DISPLAY: 'DD/MM/YYYY',
-  INPUT: 'YYYY-MM-DD',
-  TIME: 'HH:mm',
-  DATETIME: 'DD/MM/YYYY HH:mm',
-};
-
-// Table configuration
-export const TABLE_CONFIG = {
-  DEFAULT_PAGE_SIZE: 10,
-  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
-  MIN_SEARCH_LENGTH: 2,
-};
-
-// Status colors
-export const STATUS_COLORS = {
-  ACTIVE: '#48bb78',
-  INACTIVE: '#f56565',
-  PENDING: '#ed8936',
-  COMPLETED: '#4299e1',
-  CANCELLED: '#718096',
-};
-
-// Loading states
-export const LOADING_STATES = {
-  IDLE: 'idle',
-  LOADING: 'loading',
-  SUCCESS: 'success',
-  ERROR: 'error',
-};
-
-/**
- * Lesson Card Style Constants
- */
-
-export const CARD_STYLES = {
-  base: {
-    border: 'none',
-    borderRadius: '6px',
-    color: 'white',
-    cursor: 'pointer',
-    transition: 'all 0.2s ease',
-    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
-  },
-  compact: {
-    minHeight: '40px',
-    padding: '4px 6px',
-  },
-  standard: {
-    minHeight: '60px',
-    padding: '6px 8px',
-  },
-};
-
-export const TEXT_STYLES = {
-  compact: {
-    name: { fontSize: '10px', fontWeight: '500' },
-    time: { fontSize: '9px' },
-    label: { fontSize: '9px' },
-  },
-  standard: {
-    name: { fontSize: '11px', fontWeight: '600' },
-    time: { fontSize: '11px', fontWeight: '500' },
-    label: { fontSize: '11px' },
-    duration: { fontSize: '10px' },
-  },
-};
-
-export const LAYOUT_STYLES = {
-  row: {
-    display: 'flex',
-    alignItems: 'center',
-    gap: '4px',
-  },
-  spaceBetween: {
-    display: 'flex',
-    justifyContent: 'space-between',
-    alignItems: 'center',
-  },
-  column: {
-    display: 'flex',
-    flexDirection: 'column',
-    gap: '4px',
-  },
-};
```

### frontend/src/lib/helpers/domains/horses/index.js

```diff
diff --git a/frontend/src/lib/helpers/domains/horses/index.js b/frontend/src/lib/helpers/domains/horses/index.js
index 0c5a4fac..9904f86e 100644
--- a/frontend/src/lib/helpers/domains/horses/index.js
+++ b/frontend/src/lib/helpers/domains/horses/index.js
@@ -2,5 +2,5 @@
  * Horses domain helpers exports
  */
 
-export * from './validators.js';
-export * from './stats.js';
\ No newline at end of file
+export * from './validators';
+export * from './stats';
\ No newline at end of file
```

### frontend/src/lib/helpers/domains/horses/stats.js

```diff
diff --git a/frontend/src/lib/helpers/domains/horses/stats.js b/frontend/src/lib/helpers/domains/horses/stats.js
index 812898eb..0aa10623 100644
--- a/frontend/src/lib/helpers/domains/horses/stats.js
+++ b/frontend/src/lib/helpers/domains/horses/stats.js
@@ -1,4 +1,8 @@
-import { isActive } from '../filters/activityFilters';
+/**
+ * Horse statistics and filtering utilities
+ */
+
+import { isActive } from '../../shared/filters';
 
 /**
  * Calculate statistics for horses list
@@ -24,3 +28,20 @@ export function filterHorsesByKind(horses, filter) {
   if (filter === 'all') return horses;
   return horses.filter((horse) => horse.kind === filter);
 }
+
+/**
+ * Filter horses by activity status
+ * @param {Array} horses - Array of horse objects
+ * @param {string} filter - Filter type ('all', 'active', 'inactive')
+ * @returns {Array} Filtered horses
+ */
+export function filterHorsesByStatus(horses, filter) {
+  if (filter === 'all') return horses;
+  if (filter === 'active') {
+    return horses.filter((h) => isActive(h.activity_start_date, h.activity_end_date));
+  }
+  if (filter === 'inactive') {
+    return horses.filter((h) => !isActive(h.activity_start_date, h.activity_end_date));
+  }
+  return horses;
+}
\ No newline at end of file
```

### frontend/src/lib/helpers/domains/lessons/formatters.js

```diff
diff --git a/frontend/src/lib/helpers/domains/lessons/formatters.js b/frontend/src/lib/helpers/domains/lessons/formatters.js
index ba1ebc42..7e7a3103 100644
--- a/frontend/src/lib/helpers/domains/lessons/formatters.js
+++ b/frontend/src/lib/helpers/domains/lessons/formatters.js
@@ -2,7 +2,7 @@
  * Lesson Card Helper Functions
  */
 
-import { LESSON_TYPES } from '../../../constants/domains/lessons/types.js';
+import { LESSON_TYPES } from '../../../domains/lessons/types';
 
 /**
  * Get lesson card background color based on lesson type
@@ -16,6 +16,8 @@ export const getLessonColor = (lessonType) => {
 
 /**
  * Check if lesson is short (compact display)
+ * @param {Object} lesson - Lesson object
+ * @returns {boolean} True if lesson is short
  */
 export const isShortLesson = (lesson) => {
   if (!lesson.duration_minutes) return true;
@@ -24,6 +26,8 @@ export const isShortLesson = (lesson) => {
 
 /**
  * Check if lesson is blocked type
+ * @param {Object} lesson - Lesson object
+ * @returns {boolean} True if lesson is blocked
  */
 export const isBlockedLesson = (lesson) => {
   return lesson.lesson_type === 'blocked';
@@ -31,7 +35,18 @@ export const isBlockedLesson = (lesson) => {
 
 /**
  * Determine if card should use compact layout
+ * @param {Object} lesson - Lesson object
+ * @returns {boolean} True if should use compact layout
  */
 export const shouldUseCompactLayout = (lesson) => {
   return isShortLesson(lesson) && !isBlockedLesson(lesson);
 };
+
+/**
+ * Get lesson layout type
+ * @param {Object} lesson - Lesson object
+ * @returns {string} 'compact' or 'standard'
+ */
+export const getLessonLayout = (lesson) => {
+  return shouldUseCompactLayout(lesson) ? 'compact' : 'standard';
+};
\ No newline at end of file
```

### frontend/src/lib/helpers/domains/lessons/index.js

```diff
diff --git a/frontend/src/lib/helpers/domains/lessons/index.js b/frontend/src/lib/helpers/domains/lessons/index.js
index ae522c37..13f6ff9a 100644
--- a/frontend/src/lib/helpers/domains/lessons/index.js
+++ b/frontend/src/lib/helpers/domains/lessons/index.js
@@ -2,5 +2,7 @@
  * Lessons domain helpers exports
  */
 
-export * from './validators.js';
-export * from './formatters.js';
\ No newline at end of file
+export * from './validators';
+export * from './formatters';
+export * from './filters';
+export * from './stats';
```

### frontend/src/lib/helpers/domains/lessons/validators.js

```diff
diff --git a/frontend/src/lib/helpers/domains/lessons/validators.js b/frontend/src/lib/helpers/domains/lessons/validators.js
index e732b53c..807fe527 100644
--- a/frontend/src/lib/helpers/domains/lessons/validators.js
+++ b/frontend/src/lib/helpers/domains/lessons/validators.js
@@ -1,6 +1,7 @@
 /**
  * Lesson validation utilities
  */
+import { LESSON_TYPES } from '../../../domains/lessons/types';
 
 /**
  * Validate lesson time range
@@ -51,11 +52,6 @@ export const validateParticipantCount = (currentCount, maxParticipants) => {
 export const validateLessonForm = (formData) => {
   const errors = {};
 
-  // Name validation - now optional, will be auto-generated if empty
-  // if (!formData.name || formData.name.trim() === '') {
-  //   errors.name = 'Le nom du cours est requis';
-  // }
-
   // Date validation
   if (!formData.lesson_date) {
     errors.lesson_date = 'La date du cours est requise';
@@ -68,12 +64,18 @@ export const validateLessonForm = (formData) => {
   }
 
   // Type validation
-  if (!formData.lesson_type) {
-    errors.lesson_type = 'Le type de cours est requis';
+  if (!formData.type) {
+    errors.type = 'Le type de cours est requis';
+  } else {
+    // Validate that type exists in LESSON_TYPES
+    const lessonType = Object.values(LESSON_TYPES).find((t) => t.value === formData.type);
+    if (!lessonType) {
+      errors.type = 'Type de cours invalide';
+    }
   }
 
   // Participants validation
-  if (formData.lesson_type !== 'blocked') {
+  if (formData.type !== 'blocked') {
     if (formData.min_participants && formData.max_participants) {
       if (parseInt(formData.min_participants) > parseInt(formData.max_participants)) {
         errors.participants = 'Le minimum ne peut pas être supérieur au maximum';
@@ -85,4 +87,40 @@ export const validateLessonForm = (formData) => {
     isValid: Object.keys(errors).length === 0,
     errors,
   };
-};
\ No newline at end of file
+};
+
+/**
+ * Validate lesson is within visible hours
+ * @param {Object} lesson - Lesson object
+ * @param {number} START_HOUR - Calendar start hour
+ * @param {number} END_HOUR - Calendar end hour
+ * @returns {boolean} True if lesson is visible
+ */
+export const isLessonVisible = (lesson, START_HOUR = 8, END_HOUR = 22) => {
+  if (!lesson?.start_time || !lesson?.end_time) return false;
+
+  const timeToMinutes = (timeStr) => {
+    const [hours, minutes] = timeStr.split(':').map(Number);
+    return hours * 60 + (minutes || 0);
+  };
+
+  const startMinutes = timeToMinutes(lesson.start_time);
+  const endMinutes = timeToMinutes(lesson.end_time);
+  const dayStartMinutes = START_HOUR * 60;
+  const dayEndMinutes = END_HOUR * 60;
+
+  return !(endMinutes <= dayStartMinutes || startMinutes >= dayEndMinutes);
+};
+
+/**
+ * Get valid lessons for display
+ * @param {Array} lessons - Array of lesson objects
+ * @param {number} START_HOUR - Calendar start hour
+ * @param {number} END_HOUR - Calendar end hour
+ * @returns {Array} Valid lessons
+ */
+export const getValidLessons = (lessons, START_HOUR = 8, END_HOUR = 22) => {
+  if (!lessons || !Array.isArray(lessons)) return [];
+
+  return lessons.filter((lesson) => isLessonVisible(lesson, START_HOUR, END_HOUR));
+};
```

### frontend/src/lib/helpers/domains/packages/calculations.js

```diff
diff --git a/frontend/src/lib/helpers/domains/packages/calculations.js b/frontend/src/lib/helpers/domains/packages/calculations.js
deleted file mode 100644
index 74b5a732..00000000
--- a/frontend/src/lib/helpers/domains/packages/calculations.js
+++ /dev/null
@@ -1,15 +0,0 @@
-/**
- * Package calculation utilities
- */
-
-/**
- * Calculate remaining lessons in a package
- * @param {Object} pkg - Package object
- * @returns {Object} Remaining lessons by type
- */
-export const calculateRemainingLessons = (pkg) => {
-  return {
-    private: (pkg.private_lesson_count || 0) - (pkg.private_lessons_used || 0),
-    joint: (pkg.joint_lesson_count || 0) - (pkg.joint_lessons_used || 0),
-  };
-};
\ No newline at end of file
```

### frontend/src/lib/helpers/domains/packages/index.js

```diff
diff --git a/frontend/src/lib/helpers/domains/packages/index.js b/frontend/src/lib/helpers/domains/packages/index.js
index 85cd7666..2c152f2c 100644
--- a/frontend/src/lib/helpers/domains/packages/index.js
+++ b/frontend/src/lib/helpers/domains/packages/index.js
@@ -2,6 +2,5 @@
  * Packages domain helpers exports
  */
 
-export * from './calculations.js';
-export * from './validation.js';
-export * from './validators.js';
\ No newline at end of file
+export * from './validation';
+export * from './validators';
```

### frontend/src/lib/helpers/domains/packages/packageValidators.js

```diff
diff --git a/frontend/src/lib/helpers/domains/packages/packageValidators.js b/frontend/src/lib/helpers/domains/packages/packageValidators.js
deleted file mode 100644
index f138b12b..00000000
--- a/frontend/src/lib/helpers/domains/packages/packageValidators.js
+++ /dev/null
@@ -1,48 +0,0 @@
-/**
- * Package validation utilities
- */
-
-/**
- * Validate package form data
- * @param {Object} formData - Package form data
- * @returns {Object} Validation result with isValid and errors object
- */
-export const validatePackageForm = (formData) => {
-  const errors = {};
-
-  // Rider validation
-  if (!formData.rider_id) {
-    errors.rider_id = 'Le cavalier est requis';
-  }
-
-  // Lesson counts validation
-  const privateCount = parseInt(formData.private_lesson_count) || 0;
-  const jointCount = parseInt(formData.joint_lesson_count) || 0;
-
-  if (privateCount < 0) {
-    errors.private_lesson_count = 'Le nombre de cours particuliers ne peut pas être négatif';
-  }
-
-  if (jointCount < 0) {
-    errors.joint_lesson_count = 'Le nombre de cours collectifs ne peut pas être négatif';
-  }
-
-  if (privateCount === 0 && jointCount === 0) {
-    errors.lesson_count = 'Au moins un type de cours doit avoir une quantité supérieure à 0';
-  }
-
-  // Date validation
-  if (formData.activity_start_date && formData.activity_end_date) {
-    const startDate = new Date(formData.activity_start_date);
-    const endDate = new Date(formData.activity_end_date);
-
-    if (endDate < startDate) {
-      errors.dates = 'La date de fin doit être après la date de début';
-    }
-  }
-
-  return {
-    isValid: Object.keys(errors).length === 0,
-    errors,
-  };
-};
\ No newline at end of file
```

### frontend/src/lib/helpers/domains/packages/validation.js

```diff
diff --git a/frontend/src/lib/helpers/domains/packages/validation.js b/frontend/src/lib/helpers/domains/packages/validation.js
index 4fc1bfef..90913f6e 100644
--- a/frontend/src/lib/helpers/domains/packages/validation.js
+++ b/frontend/src/lib/helpers/domains/packages/validation.js
@@ -9,19 +9,43 @@
  */
 export const isPackageActive = (pkg) => {
   if (!pkg) return false;
-  
+
   const now = new Date();
   const startDate = pkg.activity_start_date ? new Date(pkg.activity_start_date) : null;
   const endDate = pkg.activity_end_date ? new Date(pkg.activity_end_date) : null;
-  
+
   if (startDate && now < startDate) return false;
   if (endDate && now > endDate) return false;
-  
-  // Import calculation function to avoid circular dependency
-  const remaining = {
-    private: (pkg.private_lesson_count || 0) - (pkg.private_lessons_used || 0),
-    joint: (pkg.joint_lesson_count || 0) - (pkg.joint_lessons_used || 0),
-  };
-  
-  return remaining.private > 0 || remaining.joint > 0;
-};
\ No newline at end of file
+
+  return true;
+};
+
+/**
+ * Check if package is expired
+ * @param {Object} pkg - Package object
+ * @returns {boolean} True if package is expired
+ */
+export const isPackageExpired = (pkg) => {
+  if (!pkg) return false;
+
+  const now = new Date();
+  const endDate = pkg.activity_end_date ? new Date(pkg.activity_end_date) : null;
+
+  if (endDate && now > endDate) return true;
+
+  return false;
+};
+
+/**
+ * Check if package is future (not started yet)
+ * @param {Object} pkg - Package object
+ * @returns {boolean} True if package is in the future
+ */
+export const isPackageFuture = (pkg) => {
+  if (!pkg) return false;
+
+  const now = new Date();
+  const startDate = pkg.activity_start_date ? new Date(pkg.activity_start_date) : null;
+
+  return startDate && now < startDate;
+};
```

### frontend/src/lib/helpers/domains/packages/validators.js

```diff
diff --git a/frontend/src/lib/helpers/domains/packages/validators.js b/frontend/src/lib/helpers/domains/packages/validators.js
index f6165b9f..748be4fd 100644
--- a/frontend/src/lib/helpers/domains/packages/validators.js
+++ b/frontend/src/lib/helpers/domains/packages/validators.js
@@ -1,14 +1,54 @@
 /**
- * Package validation rules
+ * Package validation utilities (Consolidated)
  */
 
-import { validatePackageForm } from './packageValidators';
+/**
+ * Validate package form data
+ * @param {Object} formData - Package form data
+ * @returns {Object} Validation result with isValid and errors object
+ */
+export const validatePackageForm = (formData) => {
+  const errors = {};
+
+  // Rider validation
+  if (!formData.rider_id) {
+    errors.rider_id = 'Le cavalier est requis';
+  }
+
+  // Lesson counts validation
+  const privateCount = parseInt(formData.private_lesson_count) || 0;
+  const jointCount = parseInt(formData.joint_lesson_count) || 0;
+
+  if (privateCount < 0) {
+    errors.private_lesson_count = 'Le nombre de cours particuliers ne peut pas être négatif';
+  }
+
+  if (jointCount < 0) {
+    errors.joint_lesson_count = 'Le nombre de cours collectifs ne peut pas être négatif';
+  }
 
-// Re-export the existing validator for consistency
-export { validatePackageForm };
+  if (privateCount === 0 && jointCount === 0) {
+    errors.lesson_count = 'Au moins un type de cours doit avoir une quantité supérieure à 0';
+  }
+
+  // Date validation
+  if (formData.activity_start_date && formData.activity_end_date) {
+    const startDate = new Date(formData.activity_start_date);
+    const endDate = new Date(formData.activity_end_date);
+
+    if (endDate < startDate) {
+      errors.dates = 'La date de fin doit être après la date de début';
+    }
+  }
+
+  return {
+    isValid: Object.keys(errors).length === 0,
+    errors,
+  };
+};
 
 /**
- * Validate package data
+ * Validate package data (simplified version)
  * @param {Object} data - Package data to validate
  * @returns {Object} Validation result with isValid and errors
  */
```

### frontend/src/lib/helpers/domains/pairings/index.js

```diff
diff --git a/frontend/src/lib/helpers/domains/pairings/index.js b/frontend/src/lib/helpers/domains/pairings/index.js
index 19f864f2..5f862390 100644
--- a/frontend/src/lib/helpers/domains/pairings/index.js
+++ b/frontend/src/lib/helpers/domains/pairings/index.js
@@ -2,5 +2,5 @@
  * Pairings domain helpers exports
  */
 
-export * from './validators.js';
-export * from './stats.js';
\ No newline at end of file
+export * from './validators';
+export * from './stats';
\ No newline at end of file
```

### frontend/src/lib/helpers/domains/pairings/stats.js

```diff
diff --git a/frontend/src/lib/helpers/domains/pairings/stats.js b/frontend/src/lib/helpers/domains/pairings/stats.js
index a917fc71..4780ddd4 100644
--- a/frontend/src/lib/helpers/domains/pairings/stats.js
+++ b/frontend/src/lib/helpers/domains/pairings/stats.js
@@ -1,4 +1,8 @@
-import { isActive } from '../filters/activityFilters.js';
+/**
+ * Pairing statistics and filtering utilities
+ */
+
+import { isActive } from '../../shared/filters';
 
 /**
  * Calculate statistics for pairings list
@@ -21,9 +25,8 @@ export function calculatePairingStats(pairings) {
  */
 export function filterPairingsByStatus(pairings, filter) {
   if (filter === 'all') return pairings;
-  const active = isActive;
   return pairings.filter((pairing) => {
-    const isActivePairing = active(pairing.pairing_start_date, pairing.pairing_end_date);
+    const isActivePairing = isActive(pairing.pairing_start_date, pairing.pairing_end_date);
     return filter === 'active' ? isActivePairing : !isActivePairing;
   });
-}
+}
\ No newline at end of file
```

### frontend/src/lib/helpers/domains/pairings/validators.js

```diff
diff --git a/frontend/src/lib/helpers/domains/pairings/validators.js b/frontend/src/lib/helpers/domains/pairings/validators.js
index afb21790..5d9dc010 100644
--- a/frontend/src/lib/helpers/domains/pairings/validators.js
+++ b/frontend/src/lib/helpers/domains/pairings/validators.js
@@ -11,13 +11,13 @@ export const validatePairingForm = (formData) => {
   const errors = {};
 
   // Rider validation
-  if (!formData.rider_id) {
-    errors.rider_id = 'Le cavalier est requis';
+  if (!formData.rider_id || isNaN(parseInt(formData.rider_id))) {
+    errors.rider_id = 'Le cavalier est requis et doit être valide';
   }
 
   // Horse validation
-  if (!formData.horse_id) {
-    errors.horse_id = 'Le cheval est requis';
+  if (!formData.horse_id || isNaN(parseInt(formData.horse_id))) {
+    errors.horse_id = 'Le cheval est requis et doit être valide';
   }
 
   // Start date validation - now optional
```

### frontend/src/lib/helpers/domains/riders/filters.js

```diff
diff --git a/frontend/src/lib/helpers/domains/riders/filters.js b/frontend/src/lib/helpers/domains/riders/filters.js
index 1a5158ad..5dfcd59d 100644
--- a/frontend/src/lib/helpers/domains/riders/filters.js
+++ b/frontend/src/lib/helpers/domains/riders/filters.js
@@ -1,55 +1,33 @@
 /**
- * Check if an item is currently active based on start and end dates
- * @param {string} startDate - Activity start date
- * @param {string} endDate - Activity end date
- * @returns {boolean} True if the item is active
+ * Rider-specific filter utilities
  */
-export function isActive(startDate, endDate) {
-  const now = new Date();
-  const start = startDate ? new Date(startDate) : null;
-  const end = endDate ? new Date(endDate) : null;
 
-  if (start && start > now) return false;
-  if (end && end < now) return false;
-  return true;
-}
-
-/**
- * Filter packages to return only active ones
- * @param {Array} packages - Array of package objects
- * @returns {Array} Filtered array of active packages
- */
-export function filterActivePackages(packages) {
-  if (!packages || !Array.isArray(packages)) return [];
-  return packages.filter((pkg) =>
-    isActive(pkg.activity_start_date, pkg.activity_end_date)
-  );
-}
+import { isActive, filterActivePackages, filterActivePairings, filterActiveHorses } from '../../shared/filters';
 
 /**
- * Filter pairings to return only active ones (both pairing and horse must be active)
- * @param {Array} pairings - Array of pairing objects
- * @returns {Array} Filtered array of active pairings
+ * Calculate statistics for riders list
+ * @param {Array} riders - Array of rider objects
+ * @returns {Object} Statistics object with counts
  */
-export function filterActivePairings(pairings) {
-  if (!pairings || !Array.isArray(pairings)) return [];
-  return pairings.filter((pairing) => {
-    const pairingActive = isActive(pairing.pairing_start_date, pairing.pairing_end_date);
-    const horseActive =
-      pairing.horses &&
-      isActive(pairing.horses.activity_start_date, pairing.horses.activity_end_date);
-    return pairingActive && horseActive;
-  });
+export function calculateRiderStatsWithPackages(riders) {
+  return {
+    total: riders.length,
+    active: riders.filter((r) => isActive(r.activity_start_date, r.activity_end_date)).length,
+    withActivePackages: riders.filter((r) => 
+      r.packages && filterActivePackages(r.packages).length > 0
+    ).length,
+  };
 }
 
 /**
- * Filter horses to return only active ones
- * @param {Array} horses - Array of horse objects
- * @returns {Array} Filtered array of active horses
+ * Get active items for a rider
+ * @param {Object} rider - Rider object
+ * @returns {Object} Active items
  */
-export function filterActiveHorses(horses) {
-  if (!horses || !Array.isArray(horses)) return [];
-  return horses.filter((horse) =>
-    isActive(horse.activity_start_date, horse.activity_end_date)
-  );
+export function getRiderActiveItems(rider) {
+  return {
+    packages: rider.packages ? filterActivePackages(r.packages) : [],
+    pairings: rider.pairings ? filterActivePairings(rider.pairings) : [],
+    horses: rider.horses ? filterActiveHorses(rider.horses) : [],
+  };
 }
\ No newline at end of file
```

### frontend/src/lib/helpers/domains/riders/index.js

```diff
diff --git a/frontend/src/lib/helpers/domains/riders/index.js b/frontend/src/lib/helpers/domains/riders/index.js
index a787e528..3c4b31ab 100644
--- a/frontend/src/lib/helpers/domains/riders/index.js
+++ b/frontend/src/lib/helpers/domains/riders/index.js
@@ -2,6 +2,6 @@
  * Riders domain helpers exports
  */
 
-export * from './validators.js';
-export * from './stats.js';
-export * from './filters.js';
\ No newline at end of file
+export * from './validators';
+export * from './stats';
+export * from './filters';
\ No newline at end of file
```

### frontend/src/lib/helpers/domains/riders/stats.js

```diff
diff --git a/frontend/src/lib/helpers/domains/riders/stats.js b/frontend/src/lib/helpers/domains/riders/stats.js
index c7bc064e..1ba2d71f 100644
--- a/frontend/src/lib/helpers/domains/riders/stats.js
+++ b/frontend/src/lib/helpers/domains/riders/stats.js
@@ -1,4 +1,8 @@
-import { isActive } from '../filters/activityFilters';
+/**
+ * Rider statistics and filtering utilities
+ */
+
+import { isActive } from '../../shared/filters';
 
 /**
  * Calculate statistics for riders list
```

### frontend/src/lib/helpers/shared/formatters/duration.js

```diff
diff --git a/frontend/src/lib/helpers/shared/formatters/duration.js b/frontend/src/lib/helpers/shared/formatters/duration.js
index fce4f2e2..955fdfeb 100644
--- a/frontend/src/lib/helpers/shared/formatters/duration.js
+++ b/frontend/src/lib/helpers/shared/formatters/duration.js
@@ -3,43 +3,64 @@
  */
 
 /**
- * Format duration in minutes to human-readable string
+ * Format duration in minutes to readable string
  * @param {number} minutes - Duration in minutes
- * @returns {string} Formatted duration (e.g., "1h 30min", "45 min")
+ * @returns {string} Formatted duration (e.g., "1h30min", "45min", "2h")
  */
-export const formatDuration = (minutes) => {
-  if (!minutes || minutes <= 0) return '0 min';
-
-  if (minutes < 60) {
-    return `${minutes} min`;
-  }
+export function formatDuration(minutes) {
+  if (!minutes || minutes <= 0) return '';
 
   const hours = Math.floor(minutes / 60);
-  const remainingMinutes = minutes % 60;
+  const mins = minutes % 60;
 
-  if (remainingMinutes === 0) {
+  if (hours === 0) {
+    return `${mins}min`;
+  }
+
+  if (mins === 0) {
     return `${hours}h`;
   }
 
-  return `${hours}h ${remainingMinutes}min`;
-};
+  return `${hours}h${mins}min`;
+}
 
 /**
- * Calculate and format duration between two times
+ * Calculate duration between two times
  * @param {string} startTime - Start time in HH:MM format
  * @param {string} endTime - End time in HH:MM format
- * @returns {string} Formatted duration
+ * @returns {number} Duration in minutes
+ */
+export function calculateDurationMinutes(startTime, endTime) {
+  if (!startTime || !endTime) return 0;
+
+  const timeToMinutes = (timeStr) => {
+    const [hours, minutes] = timeStr.split(':').map(Number);
+    return hours * 60 + (minutes || 0);
+  };
+
+  const startMinutes = timeToMinutes(startTime);
+  const endMinutes = timeToMinutes(endTime);
+
+  return Math.max(0, endMinutes - startMinutes);
+}
+
+/**
+ * Add minutes to a time string
+ * @param {string} timeStr - Time in HH:MM format
+ * @param {number} minutesToAdd - Minutes to add
+ * @returns {string} New time in HH:MM format
  */
-export const calculateDuration = (startTime, endTime) => {
-  if (!startTime || !endTime) return '0 min';
+export function addMinutesToTime(timeStr, minutesToAdd) {
+  if (!timeStr) return '';
 
-  const [startHour, startMin] = startTime.split(':').map(Number);
-  const [endHour, endMin] = endTime.split(':').map(Number);
+  const [hours, minutes] = timeStr.split(':').map(Number);
+  let totalMinutes = hours * 60 + minutes + minutesToAdd;
 
-  const startMinutes = startHour * 60 + startMin;
-  const endMinutes = endHour * 60 + endMin;
+  // Handle day overflow (24 hours = 1440 minutes)
+  totalMinutes = totalMinutes % 1440;
 
-  const durationMinutes = endMinutes - startMinutes;
+  const newHours = Math.floor(totalMinutes / 60);
+  const newMinutes = totalMinutes % 60;
 
-  return formatDuration(durationMinutes);
-};
\ No newline at end of file
+  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
+}
```

### frontend/src/lib/helpers/shared/formatters/index.js

```diff
diff --git a/frontend/src/lib/helpers/shared/formatters/index.js b/frontend/src/lib/helpers/shared/formatters/index.js
index 03fa8356..46a190b6 100644
--- a/frontend/src/lib/helpers/shared/formatters/index.js
+++ b/frontend/src/lib/helpers/shared/formatters/index.js
@@ -1,6 +1,18 @@
 /**
- * Shared formatters exports
+ * Shared Formatters - Main Export
  */
 
+export * from './time.js';
+export * from './date.js';
 export * from './duration.js';
-export * from './time.js';
\ No newline at end of file
+
+// Re-export for backward compatibility
+export {
+  timeToMinutes,
+  minutesToTime,
+  formatTime,
+  calculateLessonStyle,
+  calculateSelectionStyle,
+} from './time.js';
+export { formatWeekTitle, formatDate, formatDateTime } from './date.js';
+export { formatDuration } from './duration.js';
```

### frontend/src/lib/helpers/shared/formatters/time.js

```diff
diff --git a/frontend/src/lib/helpers/shared/formatters/time.js b/frontend/src/lib/helpers/shared/formatters/time.js
index d773db30..9e96796a 100644
--- a/frontend/src/lib/helpers/shared/formatters/time.js
+++ b/frontend/src/lib/helpers/shared/formatters/time.js
@@ -1,61 +1,115 @@
 /**
- * Time formatting utilities
+ * Time formatting and calculation utilities
  */
 
 /**
- * Format time string to HH:MM format
- * @param {string} time - Time string (e.g., "14:30:00" or "14:30")
- * @returns {string} Formatted time in HH:MM format
+ * Convert time string to minutes
+ * @param {string} timeStr - Time in HH:MM format
+ * @returns {number} Total minutes
  */
-export const formatTime = (time) => {
-  if (!time) return '';
-  return time.substring(0, 5); // HH:MM format
-};
+export function timeToMinutes(timeStr) {
+  if (!timeStr) return 0;
+  const [hours, minutes] = timeStr.split(':').map(Number);
+  return hours * 60 + (minutes || 0);
+}
 
 /**
- * Parse time string to minutes since midnight
- * @param {string} time - Time string in HH:MM format
- * @returns {number} Minutes since midnight
+ * Convert minutes to time string
+ * @param {number} minutes - Total minutes
+ * @returns {string} Time in HH:MM format
  */
-export const timeToMinutes = (time) => {
-  if (!time) return 0;
-  const [hours, minutes] = time.split(':').map(Number);
-  return hours * 60 + minutes;
-};
+export function minutesToTime(minutes) {
+  const hours = Math.floor(minutes / 60);
+  const mins = minutes % 60;
+  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
+}
 
 /**
- * Convert minutes since midnight to time string
- * @param {number} minutes - Minutes since midnight
- * @returns {string} Time string in HH:MM format
+ * Format time string for display
+ * @param {string} timeStr - Time in HH:MM format
+ * @returns {string} Formatted time
  */
-export const minutesToTime = (minutes) => {
-  const hours = Math.floor(minutes / 60);
-  const mins = minutes % 60;
-  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
-};
+export function formatTime(timeStr) {
+  if (!timeStr) return '';
+  const [hours, minutes] = timeStr.split(':');
+  return `${hours}:${minutes}`;
+}
 
 /**
- * Add minutes to a time string
- * @param {string} time - Time string in HH:MM format
- * @param {number} minutesToAdd - Minutes to add
- * @returns {string} New time string in HH:MM format
+ * Calculate lesson style positioning
+ * @param {Object} lesson - Lesson object
+ * @param {number} HOUR_HEIGHT - Height of one hour in pixels
+ * @param {number} START_HOUR - Calendar start hour
+ * @param {number} END_HOUR - Calendar end hour
+ * @returns {Object} Style object with top and height
  */
-export const addMinutesToTime = (time, minutesToAdd) => {
-  const totalMinutes = timeToMinutes(time) + minutesToAdd;
-  return minutesToTime(totalMinutes);
-};
+export function calculateLessonStyle(lesson, HOUR_HEIGHT = 60, START_HOUR = 8, END_HOUR = 22) {
+  if (!lesson?.start_time || !lesson?.end_time) {
+    return { display: 'none' };
+  }
+
+  const startMinutes = timeToMinutes(lesson.start_time);
+  const endMinutes = timeToMinutes(lesson.end_time);
+  const dayStartMinutes = START_HOUR * 60;
+  const dayEndMinutes = END_HOUR * 60;
+
+  // Check if lesson is outside visible hours
+  if (endMinutes <= dayStartMinutes || startMinutes >= dayEndMinutes) {
+    return { display: 'none' };
+  }
+
+  // Clamp start and end to visible hours
+  const clampedStart = Math.max(startMinutes, dayStartMinutes);
+  const clampedEnd = Math.min(endMinutes, dayEndMinutes);
+
+  const top = (clampedStart - dayStartMinutes) * (HOUR_HEIGHT / 60);
+  const height = (clampedEnd - clampedStart) * (HOUR_HEIGHT / 60);
+
+  return {
+    top: `${top}px`,
+    height: `${height}px`,
+  };
+}
 
 /**
- * Calculate duration between two times
- * @param {string} startTime - Start time in HH:MM format
- * @param {string} endTime - End time in HH:MM format
- * @returns {number} Duration in minutes
+ * Calculate selection style positioning
+ * @param {string} selectionStart - Start time in HH:MM format
+ * @param {string} selectionEnd - End time in HH:MM format
+ * @param {number} HOUR_HEIGHT - Height of one hour in pixels
+ * @param {number} START_HOUR - Calendar start hour
+ * @param {number} END_HOUR - Calendar end hour
+ * @returns {Object|null} Style object or null if invalid
  */
-export const calculateDurationInMinutes = (startTime, endTime) => {
-  if (!startTime || !endTime) return 0;
-  
-  const startMinutes = timeToMinutes(startTime);
-  const endMinutes = timeToMinutes(endTime);
-  
-  return endMinutes - startMinutes;
-};
\ No newline at end of file
+export function calculateSelectionStyle(
+  selectionStart,
+  selectionEnd,
+  HOUR_HEIGHT = 60,
+  START_HOUR = 8,
+  END_HOUR = 22
+) {
+  if (!selectionStart || !selectionEnd) return null;
+
+  const startMinutes = timeToMinutes(selectionStart);
+  const endMinutes = timeToMinutes(selectionEnd);
+  const dayStartMinutes = START_HOUR * 60;
+  const dayEndMinutes = END_HOUR * 60;
+
+  // Ensure start is before end
+  const minMinutes = Math.min(startMinutes, endMinutes);
+  const maxMinutes = Math.max(startMinutes, endMinutes);
+
+  if (maxMinutes <= dayStartMinutes || minMinutes >= dayEndMinutes) {
+    return null;
+  }
+
+  const clampedStart = Math.max(minMinutes, dayStartMinutes);
+  const clampedEnd = Math.min(maxMinutes, dayEndMinutes);
+
+  const top = (clampedStart - dayStartMinutes) * (HOUR_HEIGHT / 60);
+  const height = (clampedEnd - clampedStart) * (HOUR_HEIGHT / 60);
+
+  return {
+    top: `${top}px`,
+    height: `${height}px`,
+  };
+}
```

### frontend/src/lib/helpers/shared/index.js

```diff
diff --git a/frontend/src/lib/helpers/shared/index.js b/frontend/src/lib/helpers/shared/index.js
index ea3abbd2..aef3d920 100644
--- a/frontend/src/lib/helpers/shared/index.js
+++ b/frontend/src/lib/helpers/shared/index.js
@@ -1,5 +1,6 @@
 /**
- * Shared helpers exports
+ * Shared Helpers - Main Export
  */
 
-export * from './formatters';
\ No newline at end of file
+export * from './formatters';
+export * from './filters';
```

### frontend/src/lib/index.js

```diff
diff --git a/frontend/src/lib/index.js b/frontend/src/lib/index.js
index eba753cd..cab64603 100644
--- a/frontend/src/lib/index.js
+++ b/frontend/src/lib/index.js
@@ -1,12 +1,9 @@
 /**
- * Centralized exports for all utility libraries
+ * Centralized export for all constants and services
  */
 
-// Libraries
-export * from './libraries/icons.jsx';
+// Export all domain-organized constants
+export * from './domains';
 
-// Helpers (now domain-organized)
-export * from './helpers';
-
-// Configuration
-export * from './config';
\ No newline at end of file
+// Export all services
+export * from './services';
\ No newline at end of file
```

### frontend/src/lib/libraries/icons.jsx

```diff
diff --git a/frontend/src/lib/libraries/icons.jsx b/frontend/src/lib/libraries/icons.jsx
deleted file mode 100644
index 3a426511..00000000
--- a/frontend/src/lib/libraries/icons.jsx
+++ /dev/null
@@ -1,87 +0,0 @@
-import {
-  FaPlus,
-  FaPencilAlt,
-  FaTrash,
-  FaEye,
-  FaHorseHead,
-  FaCalendarAlt,
-  FaClone,
-  FaCheck,
-  FaTimes,
-  FaExclamationTriangle,
-  FaArrowUp,
-  FaUser,
-  FaPhone,
-  FaEnvelope,
-  FaCalendar,
-  FaList,
-  FaLink,
-  FaChevronDown,
-  FaChevronLeft,
-  FaChevronRight,
-  FaUsers,
-  FaInfoCircle,
-  FaSave,
-  FaBan,
-  FaSpinner,
-  FaGraduationCap,
-  FaShoppingBasket,
-  FaUserGraduate,
-  FaAward,
-  FaLocationArrow,
-  FaClock,
-  FaCalendarDay,
-  FaArrowCircleRight,
-  FaCog,
-  FaTag,
-  FaFilter,
-} from 'react-icons/fa';
-
-export const Icons = {
-  Add: FaPlus,
-  Edit: FaPencilAlt,
-  Delete: FaTrash,
-  View: FaEye,
-  Horse: FaHorseHead,
-  Calendar: FaCalendarAlt,
-  Template: FaClone,
-  Check: FaCheck,
-  Close: FaTimes,
-  Warning: FaExclamationTriangle,
-  Remove: FaArrowUp,
-  User: FaUser,
-  Users: FaUsers,
-  Phone: FaPhone,
-  Email: FaEnvelope,
-  Date: FaCalendar,
-  List: FaList,
-  Link: FaLink,
-  ChevronDown: FaChevronDown,
-  ChevronLeft: FaChevronLeft,
-  ChevronRight: FaChevronRight,
-  Info: FaInfoCircle,
-  Save: FaSave,
-  Cancel: FaBan,
-  Loading: FaSpinner,
-  Lesson: FaGraduationCap,
-  Packages: FaShoppingBasket,
-  PrivateLesson: FaUserGraduate,
-  GroupLesson: FaUsers,
-  Service: FaShoppingBasket,
-  Clock: FaClock,
-  Location: FaLocationArrow,
-  Competition: FaAward,
-  Training: FaGraduationCap,
-  Event: FaCalendarDay,
-  Blocked: FaBan,
-  Repeat: FaArrowCircleRight,
-  Settings: FaCog,
-  Tag: FaTag,
-  Filter: FaFilter,
-};
-
-export const renderIcon = (Icon, props = {}) => {
-  return <Icon {...props} />;
-};
-
-export default Icons;
```

### frontend/src/main.jsx

```diff
diff --git a/frontend/src/main.jsx b/frontend/src/main.jsx
index 7497ae86..2be1bec2 100644
--- a/frontend/src/main.jsx
+++ b/frontend/src/main.jsx
@@ -1,7 +1,7 @@
 import React from 'react';
 import ReactDOM from 'react-dom/client';
 import App from './App.jsx';
-import './index.css';
+import './styles/index.css';
 
 ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
```

### frontend/src/services/api.js

```diff
diff --git a/frontend/src/services/api.js b/frontend/src/services/api.js
deleted file mode 100644
index ec7ba5f7..00000000
--- a/frontend/src/services/api.js
+++ /dev/null
@@ -1,305 +0,0 @@
-import axios from 'axios';
-
-const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';
-
-// Create axios instance with default configuration
-const api = axios.create({
-  baseURL: API_BASE_URL,
-  headers: {
-    'Content-Type': 'application/json',
-  },
-  timeout: 10000, // 10 seconds timeout
-});
-
-// Request interceptor for debugging
-api.interceptors.request.use(
-  (config) => {
-    console.log(`🟢 API Request: ${config.method?.toUpperCase()} ${config.url}`);
-    if (config.data) {
-      console.log('📤 Request Data:', config.data);
-      console.log(
-        '📤 Request Data Types:',
-        Object.keys(config.data).reduce((acc, key) => {
-          acc[key] = typeof config.data[key];
-          return acc;
-        }, {})
-      );
-    }
-    return config;
-  },
-  (error) => {
-    console.error('❌ Request error:', error);
-    return Promise.reject(error);
-  }
-);
-
-// Response interceptor for error handling
-api.interceptors.response.use(
-  (response) => {
-    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
-    return response;
-  },
-  (error) => {
-    console.error('❌ Response error:', error);
-    if (error.response) {
-      console.error('❌ Response data:', error.response.data);
-      console.error('❌ Response status:', error.response.status);
-    }
-    return Promise.reject(error);
-  }
-);
-
-// Error handler helper
-const handleError = (error) => {
-  if (error.response) {
-    // Server responded with error status
-    const message =
-      error.response.data?.error || error.response.data?.message || 'Une erreur est survenue';
-    const status = error.response.status;
-
-    console.error('🔴 API Error Details:', {
-      status,
-      message,
-      data: error.response.data,
-      url: error.config?.url,
-      method: error.config?.method,
-      requestData: error.config?.data,
-    });
-
-    let errorMessage = message;
-    switch (status) {
-      case 400:
-        errorMessage = message; // Don't add extra text, just use the backend message
-        break;
-      case 401:
-        errorMessage = `${message} (Non autorisé)`;
-        break;
-      case 403:
-        errorMessage = `${message} (Accès refusé)`;
-        break;
-      case 404:
-        errorMessage = `${message} (Non trouvé)`;
-        break;
-      case 409:
-        errorMessage = `${message} (Conflit)`;
-        break;
-      case 429:
-        errorMessage = `${message} (Trop de requêtes)`;
-        break;
-      case 500:
-        errorMessage = `${message} (Erreur serveur)`;
-        break;
-      default:
-        errorMessage = `${message} (${status})`;
-    }
-
-    const customError = new Error(errorMessage);
-    customError.response = error.response;
-    customError.status = status;
-    throw customError;
-  } else if (error.request) {
-    // Request was made but no response received
-    throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
-  } else {
-    // Something else happened
-    throw new Error(error.message || 'Une erreur est survenue lors de la requête.');
-  }
-};
-
-// Generic CRUD helper
-const createCrudApi = (resource) => ({
-  getAll: async () => {
-    try {
-      const response = await api.get(`/${resource}`);
-      return response.data;
-    } catch (error) {
-      handleError(error);
-    }
-  },
-
-  getById: async (id) => {
-    try {
-      const response = await api.get(`/${resource}/${id}`);
-      return response.data;
-    } catch (error) {
-      handleError(error);
-    }
-  },
-
-  create: async (data) => {
-    try {
-      const response = await api.post(`/${resource}`, data);
-      return response.data;
-    } catch (error) {
-      handleError(error);
-    }
-  },
-
-  update: async (id, data) => {
-    try {
-      const response = await api.put(`/${resource}/${id}`, data);
-      return response.data;
-    } catch (error) {
-      handleError(error);
-    }
-  },
-
-  delete: async (id) => {
-    try {
-      const response = await api.delete(`/${resource}/${id}`);
-      return response.data;
-    } catch (error) {
-      handleError(error);
-    }
-  },
-});
-
-// Create specific API instances
-export const ridersApi = {
-  ...createCrudApi('riders'),
-  getHorses: async (id) => {
-    try {
-      const response = await api.get(`/riders/${id}/horses`);
-      return response.data;
-    } catch (error) {
-      handleError(error);
-    }
-  },
-  getPackages: async (id) => {
-    try {
-      const response = await api.get(`/riders/${id}/packages`);
-      return response.data;
-    } catch (error) {
-      handleError(error);
-    }
-  },
-};
-
-export const horsesApi = {
-  ...createCrudApi('horses'),
-  getRiders: async (id) => {
-    try {
-      const response = await api.get(`/horses/${id}/riders`);
-      return response.data;
-    } catch (error) {
-      handleError(error);
-    }
-  },
-};
-
-export const pairingsApi = createCrudApi('pairings');
-
-export const packagesApi = {
-  getAll: async () => {
-    try {
-      const response = await api.get('/packages');
-      return response.data;
-    } catch (error) {
-      handleError(error);
-    }
-  },
-
-  getById: async (id) => {
-    try {
-      const response = await api.get(`/packages/${id}`);
-      return response.data;
-    } catch (error) {
-      handleError(error);
-    }
-  },
-
-  create: async (data) => {
-    console.log('📦 packagesApi.create called with:', data);
-
-    // Ensure numeric fields are numbers
-    const validatedData = {
-      rider_id: Number(data.rider_id),
-      private_lesson_count: Number(data.private_lesson_count) || 0,
-      joint_lesson_count: Number(data.joint_lesson_count) || 0,
-      activity_start_date: data.activity_start_date || null,
-      activity_end_date: data.activity_end_date || null,
-    };
-
-    console.log('📦 Validated data:', validatedData);
-    console.log('📦 Data types:', {
-      rider_id: typeof validatedData.rider_id,
-      private_lesson_count: typeof validatedData.private_lesson_count,
-      joint_lesson_count: typeof validatedData.joint_lesson_count,
-    });
-
-    try {
-      const response = await api.post('/packages', validatedData);
-      return response.data;
-    } catch (error) {
-      handleError(error);
-    }
-  },
-
-  update: async (id, data) => {
-    console.log('📦 packagesApi.update called with:', { id, data });
-
-    // Ensure numeric fields are numbers
-    const validatedData = {
-      rider_id: Number(data.rider_id),
-      private_lesson_count: Number(data.private_lesson_count) || 0,
-      joint_lesson_count: Number(data.joint_lesson_count) || 0,
-      activity_start_date: data.activity_start_date || null,
-      activity_end_date: data.activity_end_date || null,
-    };
-
-    console.log('📦 Validated data:', validatedData);
-
-    try {
-      const response = await api.put(`/packages/${id}`, validatedData);
-      return response.data;
-    } catch (error) {
-      handleError(error);
-    }
-  },
-
-  delete: async (id) => {
-    try {
-      const response = await api.delete(`/packages/${id}`);
-      return response.data;
-    } catch (error) {
-      handleError(error);
-    }
-  },
-
-  createForRider: async (riderId, packageData) => {
-    try {
-      const response = await api.post('/packages', {
-        ...packageData,
-        rider_id: Number(riderId),
-        private_lesson_count: Number(packageData.private_lesson_count) || 0,
-        joint_lesson_count: Number(packageData.joint_lesson_count) || 0,
-      });
-      return response.data;
-    } catch (error) {
-      handleError(error);
-    }
-  },
-};
-
-// Utility API
-export const utilityApi = {
-  health: async () => {
-    try {
-      const response = await api.get('/health');
-      return response.data;
-    } catch (error) {
-      handleError(error);
-    }
-  },
-
-  docs: async () => {
-    try {
-      const response = await api.get('/docs');
-      return response.data;
-    } catch (error) {
-      handleError(error);
-    }
-  },
-};
-
-export default api;
```

### frontend/src/services/apiService.js

```diff
diff --git a/frontend/src/services/apiService.js b/frontend/src/services/apiService.js
index 92718059..3846b9fc 100644
--- a/frontend/src/services/apiService.js
+++ b/frontend/src/services/apiService.js
@@ -12,7 +12,7 @@ const api = axios.create({
   headers: {
     'Content-Type': 'application/json',
   },
-  timeout: API_SETTINGS.TIMEOUT,
+  timeout: API_SETTINGS?.TIMEOUT || 10000,
 });
 
 // Request interceptor
@@ -21,6 +21,13 @@ api.interceptors.request.use(
     console.log(`🟢 API Request: ${config.method?.toUpperCase()} ${config.url}`);
     if (config.data) {
       console.log('📤 Request Data:', config.data);
+      console.log(
+        '📤 Request Data Types:',
+        Object.keys(config.data).reduce((acc, key) => {
+          acc[key] = typeof config.data[key];
+          return acc;
+        }, {})
+      );
     }
     return config;
   },
@@ -46,23 +53,23 @@ api.interceptors.response.use(
 const handleApiError = (error) => {
   if (error.response) {
     const status = error.response.status;
-    const message = error.response.data?.error || error.response.data?.message || ERROR_MESSAGES.UNKNOWN;
+    const message = error.response.data?.error || error.response.data?.message || ERROR_MESSAGES?.UNKNOWN || 'Une erreur est survenue';
     
     let errorMessage = message;
     switch (status) {
-      case HTTP_STATUS.BAD_REQUEST:
+      case HTTP_STATUS?.BAD_REQUEST || 400:
         errorMessage = message;
         break;
-      case HTTP_STATUS.UNAUTHORIZED:
+      case HTTP_STATUS?.UNAUTHORIZED || 401:
         errorMessage = `${message} (Non autorisé)`;
         break;
-      case HTTP_STATUS.FORBIDDEN:
+      case HTTP_STATUS?.FORBIDDEN || 403:
         errorMessage = `${message} (Accès refusé)`;
         break;
-      case HTTP_STATUS.NOT_FOUND:
+      case HTTP_STATUS?.NOT_FOUND || 404:
         errorMessage = `${message} (Non trouvé)`;
         break;
-      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
+      case HTTP_STATUS?.INTERNAL_SERVER_ERROR || 500:
         errorMessage = `${message} (Erreur serveur)`;
         break;
       default:
@@ -74,16 +81,16 @@ const handleApiError = (error) => {
     customError.status = status;
     return customError;
   } else if (error.request) {
-    return new Error(ERROR_MESSAGES.NETWORK);
+    return new Error(ERROR_MESSAGES?.NETWORK || 'Impossible de contacter le serveur. Vérifiez votre connexion.');
   } else {
-    return new Error(error.message || ERROR_MESSAGES.UNKNOWN);
+    return new Error(error.message || ERROR_MESSAGES?.UNKNOWN || 'Une erreur est survenue lors de la requête.');
   }
 };
 
 // Generic CRUD operations
 const createCrudOperations = (resource) => ({
-  getAll: async () => {
-    const response = await api.get(`/${resource}`);
+  getAll: async (params = {}) => {
+    const response = await api.get(`/${resource}`, { params });
     return response.data;
   },
 
```

### frontend/src/services/calendarApi.js

```diff
diff --git a/frontend/src/services/calendarApi.js b/frontend/src/services/calendarApi.js
index 7919d1b3..4c2768a5 100644
--- a/frontend/src/services/calendarApi.js
+++ b/frontend/src/services/calendarApi.js
@@ -1,42 +1,9 @@
-import axios from 'axios';
-
-const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';
-
-// Create axios instance for calendar API
-const calendarApi = axios.create({
-  baseURL: `${API_BASE_URL}/calendar`,
-  headers: {
-    'Content-Type': 'application/json',
-  },
-  timeout: 30000,
-});
-
-// Request interceptor
-calendarApi.interceptors.request.use(
-  (config) => {
-    console.log(`🟢 Calendar API Request: ${config.method?.toUpperCase()} ${config.url}`);
-    return config;
-  },
-  (error) => {
-    console.error('❌ Calendar Request error:', error);
-    return Promise.reject(error);
-  }
-);
-
-// Response interceptor
-calendarApi.interceptors.response.use(
-  (response) => {
-    console.log(`✅ Calendar API Response: ${response.status} ${response.config.url}`);
-    return response;
-  },
-  (error) => {
-    console.error('❌ Calendar Response error:', error);
-    if (error.response) {
-      console.error('❌ Response data:', error.response.data);
-    }
-    return Promise.reject(error);
-  }
-);
+/**
+ * Calendar API - Handles calendar-specific operations
+ */
+import api from './apiService';
+import { LESSON_TYPES } from '../lib/domains/lessons/types';
+import { LESSON_STATUSES } from '../lib/domains/lessons/statuses';
 
 // ============================================
 // TEMPLATES API
@@ -47,88 +14,98 @@ export const templatesApi = {
    * Get all lesson templates
    */
   getAll: async (filters = {}) => {
-    const params = new URLSearchParams();
-
-    // Only add parameters if they have values
-    if (filters.active !== undefined) {
-      params.append('active', filters.active);
-    }
-    if (filters.lessonType) {
-      params.append('lesson_type', filters.lessonType);
-    }
-    if (filters.excludeBlocked) {
-      params.append('exclude_blocked', 'true');
-    }
+    const params = {};
 
-    const queryString = params.toString();
-    const url = queryString ? `/templates?${queryString}` : '/templates';
+    if (filters.active !== undefined) params.active = filters.active;
+    if (filters.lessonType) params.lesson_type = filters.lessonType;
+    if (filters.excludeBlocked) params.exclude_blocked = 'true';
 
-    const response = await calendarApi.get(url);
-    return response.data;
+    return await api.get('/templates', { params });
   },
 
   /**
    * Get a single template by ID
    */
   getById: async (id) => {
-    const response = await calendarApi.get(`/templates/${id}`);
-    return response.data;
+    return await api.get(`/templates/${id}`);
   },
 
   /**
    * Create a new template
    */
   create: async (data) => {
-    const response = await calendarApi.post('/templates', data);
-    return response.data;
+    // Validate lesson type
+    const lessonType = LESSON_TYPES.find((t) => t.value === data.type);
+    if (!lessonType) {
+      throw new Error('Type de leçon invalide');
+    }
+
+    const validatedData = {
+      ...data,
+      max_participants: Number(data.max_participants) || lessonType.defaultMax,
+    };
+
+    return await api.post('/templates', validatedData);
   },
 
   /**
    * Update a template
    */
   update: async (id, data) => {
-    const response = await calendarApi.put(`/templates/${id}`, data);
-    return response.data;
+    // Validate lesson type if provided
+    if (data.type) {
+      const lessonType = LESSON_TYPES.find((t) => t.value === data.type);
+      if (!lessonType) {
+        throw new Error('Type de leçon invalide');
+      }
+    }
+
+    const validatedData = {
+      ...data,
+      max_participants: data.max_participants ? Number(data.max_participants) : undefined,
+    };
+
+    return await api.put(`/templates/${id}`, validatedData);
   },
 
   /**
    * Delete a template
    */
   delete: async (id, deleteFutureInstances = false) => {
-    const params = deleteFutureInstances ? '?delete_future_instances=true' : '';
-    const response = await calendarApi.delete(`/templates/${id}${params}`);
-    return response.data;
+    const params = deleteFutureInstances ? { delete_future_instances: 'true' } : {};
+    return await api.delete(`/templates/${id}`, { params });
   },
 
   /**
    * Get default participants for a template
    */
   getParticipants: async (id) => {
-    const response = await calendarApi.get(`/templates/${id}/participants`);
-    return response.data;
+    return await api.get(`/templates/${id}/participants`);
   },
 
   /**
    * Generate instances for a template
    */
   generate: async (id, startDate, endDate) => {
-    const response = await calendarApi.post(`/templates/${id}/generate`, {
+    return await api.post(`/templates/${id}/generate`, {
       start_date: startDate,
       end_date: endDate,
     });
-    return response.data;
   },
 
   /**
    * Preview occurrences for a template
    */
   preview: async (id, startDate, endDate) => {
-    const response = await calendarApi.post(`/templates/${id}/preview`, {
+    return await api.post(`/templates/${id}/preview`, {
       start_date: startDate,
       end_date: endDate,
     });
-    return response.data;
   },
+
+  /**
+   * Helper methods using domain constants
+   getLessonTypes: () => LESSON_TYPES,
 };
 
 // ============================================
@@ -140,88 +117,103 @@ export const lessonsApi = {
    * Get lessons in a date range
    */
   getAll: async (startDate, endDate, filters = {}) => {
-    const params = new URLSearchParams({
+    const params = {
       start_date: startDate,
       end_date: endDate,
-    });
-    if (filters.lessonType) params.append('lesson_type', filters.lessonType);
-    if (filters.status) params.append('status', filters.status);
-    if (filters.excludeBlocked) params.append('exclude_blocked', 'true');
+    };
+
+    if (filters.lessonType) params.lesson_type = filters.lessonType;
+    if (filters.status) params.status = filters.status;
+    if (filters.excludeBlocked) params.exclude_blocked = 'true';
 
-    const response = await calendarApi.get(`/lessons?${params.toString()}`);
-    return response.data;
+    return await api.get('/lessons', { params });
   },
 
   /**
    * Get a single lesson by ID
    */
   getById: async (id) => {
-    const response = await calendarApi.get(`/lessons/${id}`);
-    return response.data;
+    return await api.get(`/lessons/${id}`);
   },
 
   /**
    * Create a new lesson
    */
   create: async (data) => {
-    const response = await calendarApi.post('/lessons', data);
-    return response.data;
+    // Validate lesson type
+    const lessonType = LESSON_TYPES.find((t) => t.value === data.type);
+    if (!lessonType) {
+      throw new Error('Type de leçon invalide');
+    }
+
+    const validatedData = {
+      ...data,
+      max_participants: Number(data.max_participants) || lessonType.defaultMax,
+    };
+
+    return await api.post('/lessons', validatedData);
   },
 
   /**
    * Update a lesson
    */
   update: async (id, data) => {
-    const response = await calendarApi.put(`/lessons/${id}`, data);
-    return response.data;
+    // Validate lesson type if provided
+    if (data.type) {
+      const lessonType = LESSON_TYPES.find((t) => t.value === data.type);
+      if (!lessonType) {
+        throw new Error('Type de leçon invalide');
+      }
+    }
+
+    const validatedData = {
+      ...data,
+      max_participants: data.max_participants ? Number(data.max_participants) : undefined,
+    };
+
+    return await api.put(`/lessons/${id}`, validatedData);
   },
 
   /**
    * Cancel a lesson
    */
   cancel: async (id, reason) => {
-    const response = await calendarApi.delete(`/lessons/${id}`, {
-      data: { reason },
-    });
-    return response.data;
+    return await api.delete(`/lessons/${id}`, { data: { reason } });
   },
 
   /**
    * Mark a lesson as not given by Laury
    */
   markNotGiven: async (id, reason) => {
-    const response = await calendarApi.post(`/lessons/${id}/mark-not-given`, {
-      reason,
-    });
-    return response.data;
+    return await api.post(`/lessons/${id}/mark-not-given`, { reason });
   },
 
   /**
    * Add a participant to a lesson
    */
   addParticipant: async (lessonId, participantData) => {
-    const response = await calendarApi.post(`/lessons/${lessonId}/participants`, participantData);
-    return response.data;
+    return await api.post(`/lessons/${lessonId}/participants`, participantData);
   },
 
   /**
    * Update a participant
    */
   updateParticipant: async (lessonId, participantId, data) => {
-    const response = await calendarApi.put(
-      `/lessons/${lessonId}/participants/${participantId}`,
-      data
-    );
-    return response.data;
+    return await api.put(`/lessons/${lessonId}/participants/${participantId}`, data);
   },
 
   /**
    * Remove a participant from a lesson
    */
   removeParticipant: async (lessonId, participantId) => {
-    const response = await calendarApi.delete(`/lessons/${lessonId}/participants/${participantId}`);
-    return response.data;
+    return await api.delete(`/lessons/${lessonId}/participants/${participantId}`);
   },
+
+  /**
+   * Helper methods using domain constants
+   */
+  getLessonTypes: () => LESSON_TYPES,
+  getLessonStatuses: () => LESSON_STATUSES,
 };
 
 // ============================================
@@ -233,47 +225,43 @@ export const scheduleApi = {
    * Get week schedule
    */
   getWeek: async (date, excludeBlocked = false) => {
-    const params = new URLSearchParams({ date });
-    if (excludeBlocked) params.append('exclude_blocked', 'true');
+    const params = { date };
+    if (excludeBlocked) params.exclude_blocked = 'true';
 
-    const response = await calendarApi.get(`/schedule/week?${params.toString()}`);
-    return response.data;
+    return await api.get('/schedule/week', { params });
   },
 
   /**
    * Get blocked periods
    */
   getBlockedPeriods: async (startDate, endDate) => {
-    const params = new URLSearchParams();
-    if (startDate) params.append('start_date', startDate);
-    if (endDate) params.append('end_date', endDate);
+    const params = {};
+    if (startDate) params.start_date = startDate;
+    if (endDate) params.end_date = endDate;
 
-    const response = await calendarApi.get(`/schedule/blocked-periods?${params.toString()}`);
-    return response.data;
+    return await api.get('/schedule/blocked-periods', { params });
   },
 
   /**
    * Get lessons not given by Laury
    */
   getNotGiven: async (startDate, endDate) => {
-    const params = new URLSearchParams();
-    if (startDate) params.append('start_date', startDate);
-    if (endDate) params.append('end_date', endDate);
+    const params = {};
+    if (startDate) params.start_date = startDate;
+    if (endDate) params.end_date = endDate;
 
-    const response = await calendarApi.get(`/schedule/not-given?${params.toString()}`);
-    return response.data;
+    return await api.get('/schedule/not-given', { params });
   },
 
   /**
    * Check availability for a time slot
    */
   checkAvailability: async (date, startTime, duration) => {
-    const response = await calendarApi.post('/schedule/check-availability', {
+    return await api.post('/schedule/check-availability', {
       date,
       start_time: startTime,
       duration,
     });
-    return response.data;
   },
 };
 
@@ -286,10 +274,9 @@ export const generationApi = {
    * Generate all lesson instances
    */
   generateAll: async (weeksAhead = 4) => {
-    const response = await calendarApi.post('/generate', {
+    return await api.post('/generate', {
       weeks_ahead: weeksAhead,
     });
-    return response.data;
   },
 };
 
```

### frontend/src/services/horseService.js

```diff
diff --git a/frontend/src/services/horseService.js b/frontend/src/services/horseService.js
index f4cfa1a7..2a56fd81 100644
--- a/frontend/src/services/horseService.js
+++ b/frontend/src/services/horseService.js
@@ -1,32 +1,47 @@
 /**
  * Horse Service - Handles all horse-related API operations
  */
-import { api } from './apiService';
+import api from './apiService';
+import { createCrudOperations } from './apiService';
+import { validateHorseForm } from '../lib/helpers/domains/horses/validators';
 
 export const horseService = {
   // Basic CRUD operations
-  getAll: async () => {
-    const response = await api.get('/horses');
-    return response.data;
-  },
-
-  getById: async (id) => {
-    const response = await api.get(`/horses/${id}`);
-    return response.data;
-  },
+  ...createCrudOperations('horses'),
 
+  // Override create to add validation
   create: async (data) => {
-    const response = await api.post('/horses', data);
+    // Validate form data
+    const validation = validateHorseForm(data);
+    if (!validation.isValid) {
+      throw new Error(JSON.stringify(validation.errors));
+    }
+
+    // Ensure owner_id is a number
+    const validatedData = {
+      ...data,
+      owner_id: data.owner_id ? Number(data.owner_id) : null,
+    };
+
+    const response = await api.post('/horses', validatedData);
     return response.data;
   },
 
+  // Override update to add validation
   update: async (id, data) => {
-    const response = await api.put(`/horses/${id}`, data);
-    return response.data;
-  },
+    // Validate form data
+    const validation = validateHorseForm(data);
+    if (!validation.isValid) {
+      throw new Error(JSON.stringify(validation.errors));
+    }
+
+    // Ensure owner_id is a number
+    const validatedData = {
+      ...data,
+      owner_id: data.owner_id ? Number(data.owner_id) : null,
+    };
 
-  delete: async (id) => {
-    const response = await api.delete(`/horses/${id}`);
+    const response = await api.put(`/horses/${id}`, validatedData);
     return response.data;
   },
 
@@ -37,7 +52,7 @@ export const horseService = {
   },
 
   addRider: async (horseId, riderId) => {
-    const response = await api.post(`/horses/${horseId}/riders`, { rider_id: riderId });
+    const response = await api.post(`/horses/${horseId}/riders`, { rider_id: Number(riderId) });
     return response.data;
   },
 
```

### frontend/src/services/index.js

```diff
diff --git a/frontend/src/services/index.js b/frontend/src/services/index.js
index d3c1ce0c..3f8d3be8 100644
--- a/frontend/src/services/index.js
+++ b/frontend/src/services/index.js
@@ -4,32 +4,25 @@
  */
 
 // Core API service
-export { api } from './apiService';
+export { api, createCrudOperations } from './apiService';
 
 // Domain-specific services
-import horseServiceDefault from './horseService';
-export const horseService = horseServiceDefault;
+export { horseService } from './horseService';
+export { riderService } from './riderService';
+export { lessonService } from './lessonService';
+export { packageService } from './packageService';
+export { pairingService } from './pairingService';
+export { templateService } from './templateService';
 
-import riderServiceDefault from './riderService';
-export const riderService = riderServiceDefault;
-
-import lessonServiceDefault from './lessonService';
-export const lessonService = lessonServiceDefault;
-
-import packageServiceDefault from './packageService';
-export const packageService = packageServiceDefault;
-
-import pairingServiceDefault from './pairingService';
-export const pairingService = pairingServiceDefault;
-
-import templateServiceDefault from './templateService';
-export const templateService = templateServiceDefault;
+// Calendar API (specialized)
+export { templatesApi, lessonsApi, scheduleApi, generationApi } from './calendarApi';
 
 // Legacy exports for backward compatibility
-export const ridersApi = riderServiceDefault;
-export const horsesApi = horseServiceDefault;
-export const pairingsApi = pairingServiceDefault;
-export const packagesApi = packageServiceDefault;
+export { horseService as horsesApi } from './horseService';
+export { riderService as ridersApi } from './riderService';
+export { packageService as packagesApi } from './packageService';
+export { pairingService as pairingsApi } from './pairingService';
+
 export const utilityApi = {
   health: async () => {
     const { api } = await import('./apiService');
```

### frontend/src/services/lessonService.js

```diff
diff --git a/frontend/src/services/lessonService.js b/frontend/src/services/lessonService.js
index 39bb6ec7..a7076dc9 100644
--- a/frontend/src/services/lessonService.js
+++ b/frontend/src/services/lessonService.js
@@ -1,32 +1,64 @@
 /**
  * Lesson Service - Handles all lesson-related API operations
  */
-import { api } from './apiService';
+import api from './apiService';
+import { createCrudOperations } from './apiService';
+import { validateLessonForm } from '../lib/helpers/domains/lessons/validators';
+import { LESSON_TYPES } from '../lib/domains/lessons/types';
+import { LESSON_STATUSES } from '../lib/domains/lessons/statuses';
+import { PARTICIPATION_STATUSES } from '../lib/domains/lessons/participation';
 
 export const lessonService = {
   // Basic CRUD operations
-  getAll: async (params = {}) => {
-    const response = await api.get('/lessons', { params });
-    return response.data;
-  },
-
-  getById: async (id) => {
-    const response = await api.get(`/lessons/${id}`);
-    return response.data;
-  },
+  ...createCrudOperations('lessons'),
 
+  // Override create to add validation
   create: async (data) => {
-    const response = await api.post('/lessons', data);
+    // Validate form data
+    const validation = validateLessonForm(data);
+    if (!validation.isValid) {
+      throw new Error(JSON.stringify(validation.errors));
+    }
+
+    // Validate lesson type
+    const lessonType = LESSON_TYPES.find((t) => t.value === data.type);
+    if (!lessonType) {
+      throw new Error('Type de leçon invalide');
+    }
+
+    // Ensure numeric fields
+    const validatedData = {
+      ...data,
+      max_participants: Number(data.max_participants) || lessonType.defaultMax,
+    };
+
+    const response = await api.post('/lessons', validatedData);
     return response.data;
   },
 
+  // Override update to add validation
   update: async (id, data) => {
-    const response = await api.put(`/lessons/${id}`, data);
-    return response.data;
-  },
+    // Validate form data
+    const validation = validateLessonForm(data);
+    if (!validation.isValid) {
+      throw new Error(JSON.stringify(validation.errors));
+    }
+
+    // Validate lesson type if provided
+    if (data.type) {
+      const lessonType = LESSON_TYPES.find((t) => t.value === data.type);
+      if (!lessonType) {
+        throw new Error('Type de leçon invalide');
+      }
+    }
+
+    // Ensure numeric fields
+    const validatedData = {
+      ...data,
+      max_participants: data.max_participants ? Number(data.max_participants) : undefined,
+    };
 
-  delete: async (id) => {
-    const response = await api.delete(`/lessons/${id}`);
+    const response = await api.put(`/lessons/${id}`, validatedData);
     return response.data;
   },
 
@@ -49,14 +81,14 @@ export const lessonService = {
   // Calendar operations
   getByDateRange: async (startDate, endDate) => {
     const response = await api.get('/lessons/calendar', {
-      params: { start_date: startDate, end_date: endDate }
+      params: { start_date: startDate, end_date: endDate },
     });
     return response.data;
   },
 
   getByWeek: async (year, week) => {
     const response = await api.get('/lessons/week', {
-      params: { year, week }
+      params: { year, week },
     });
     return response.data;
   },
@@ -104,6 +136,16 @@ export const lessonService = {
     const response = await api.get('/lessons', { params: { status } });
     return response.data;
   },
+
+  // Helper methods using domain constants
+  getLessonTypes: () => LESSON_TYPES,
+  getLessonStatuses: () => LESSON_STATUSES,
+  getParticipationStatuses: () => PARTICIPATION_STATUSES,
+
+  // Get lesson type config by value
+  getLessonTypeConfig: (typeValue) => {
+    return LESSON_TYPES.find((t) => t.value === typeValue);
+  },
 };
 
-export default lessonService;
\ No newline at end of file
+export default lessonService;
```

### frontend/src/services/packageService.js

```diff
diff --git a/frontend/src/services/packageService.js b/frontend/src/services/packageService.js
index d5b12bc8..3091357d 100644
--- a/frontend/src/services/packageService.js
+++ b/frontend/src/services/packageService.js
@@ -1,21 +1,23 @@
 /**
  * Package Service - Handles all package-related API operations
  */
-import { api } from './apiService';
+import api from './apiService';
+import { createCrudOperations } from './apiService';
+import { validatePackageForm } from '../lib/helpers/domains/packages/validators';
+import { PACKAGE_STATUS, PACKAGE_STATUS_LABELS } from '../lib/domains/packages/statuses';
 
 export const packageService = {
   // Basic CRUD operations
-  getAll: async () => {
-    const response = await api.get('/packages');
-    return response.data;
-  },
-
-  getById: async (id) => {
-    const response = await api.get(`/packages/${id}`);
-    return response.data;
-  },
+  ...createCrudOperations('packages'),
 
+  // Override create to add validation
   create: async (data) => {
+    // Validate form data
+    const validation = validatePackageForm(data);
+    if (!validation.isValid) {
+      throw new Error(JSON.stringify(validation.errors));
+    }
+
     const validatedData = {
       ...data,
       rider_id: Number(data.rider_id),
@@ -29,7 +31,14 @@ export const packageService = {
     return response.data;
   },
 
+  // Override update to add validation
   update: async (id, data) => {
+    // Validate form data
+    const validation = validatePackageForm(data);
+    if (!validation.isValid) {
+      throw new Error(JSON.stringify(validation.errors));
+    }
+
     const validatedData = {
       ...data,
       rider_id: Number(data.rider_id),
@@ -43,11 +52,6 @@ export const packageService = {
     return response.data;
   },
 
-  delete: async (id) => {
-    const response = await api.delete(`/packages/${id}`);
-    return response.data;
-  },
-
   // Package-specific operations
   getLessons: async (id) => {
     const response = await api.get(`/packages/${id}/lessons`);
@@ -99,10 +103,31 @@ export const packageService = {
     return response.data;
   },
 
-  filterByType: async (type) => {
-    const response = await api.get('/packages', { params: { type } });
-    return response.data;
+  // Helper methods using domain constants and calculations
+  getPackageStatuses: () => ({ statuses: PACKAGE_STATUS, labels: PACKAGE_STATUS_LABELS }),
+
+  // Calculate remaining lessons for a package
+  getRemainingLessons: async (packageId) => {
+    const pkg = await packageService.getById(packageId);
+    return calculateRemainingLessons(pkg);
+  },
+
+  // Calculate total remaining lessons for a package
+  getTotalRemaining: async (packageId) => {
+    const pkg = await packageService.getById(packageId);
+    return calculateTotalRemainingLessons(pkg);
+  },
+
+  // Calculate package progress percentage
+  getProgress: async (packageId) => {
+    const pkg = await packageService.getById(packageId);
+    return calculatePackageProgress(pkg);
+  },
+
+  // Get package status label
+  getPackageStatusLabel: (status) => {
+    return PACKAGE_STATUS_LABELS[status] || status;
   },
 };
 
-export default packageService;
\ No newline at end of file
+export default packageService;
```

### frontend/src/services/pairingService.js

```diff
diff --git a/frontend/src/services/pairingService.js b/frontend/src/services/pairingService.js
index 3e939f80..f78bf606 100644
--- a/frontend/src/services/pairingService.js
+++ b/frontend/src/services/pairingService.js
@@ -1,21 +1,23 @@
 /**
  * Pairing Service - Handles all pairing-related API operations
  */
-import { api } from './apiService';
+import api from './apiService';
+import { createCrudOperations } from './apiService';
+import { validatePairingForm } from '../lib/helpers/domains/pairings/validators';
+import { calculatePairingStats } from '../lib/helpers/domains/pairings/stats';
 
 export const pairingService = {
   // Basic CRUD operations
-  getAll: async () => {
-    const response = await api.get('/pairings');
-    return response.data;
-  },
-
-  getById: async (id) => {
-    const response = await api.get(`/pairings/${id}`);
-    return response.data;
-  },
+  ...createCrudOperations('pairings'),
 
+  // Override create to add validation
   create: async (data) => {
+    // Validate form data
+    const validation = validatePairingForm(data);
+    if (!validation.isValid) {
+      throw new Error(JSON.stringify(validation.errors));
+    }
+
     const validatedData = {
       ...data,
       rider_id: Number(data.rider_id),
@@ -26,22 +28,24 @@ export const pairingService = {
     return response.data;
   },
 
+  // Override update to add validation
   update: async (id, data) => {
+    // Validate form data
+    const validation = validatePairingForm(data);
+    if (!validation.isValid) {
+      throw new Error(JSON.stringify(validation.errors));
+    }
+
     const validatedData = {
       ...data,
-      rider_id: Number(data.rider_id),
-      horse_id: Number(data.horse_id),
+      rider_id: data.rider_id ? Number(data.rider_id) : undefined,
+      horse_id: data.horse_id ? Number(data.horse_id) : undefined,
     };
 
     const response = await api.put(`/pairings/${id}`, validatedData);
     return response.data;
   },
 
-  delete: async (id) => {
-    const response = await api.delete(`/pairings/${id}`);
-    return response.data;
-  },
-
   // Pairing-specific operations
   getByRider: async (riderId) => {
     const response = await api.get(`/riders/${riderId}/pairings`);
@@ -111,6 +115,15 @@ export const pairingService = {
     const response = await api.delete('/pairings/bulk', { data: { ids } });
     return response.data;
   },
+
+  // Helper methods using helper functions
+  getPairingStats: async (riderId, horseId) => {
+    const pairing = await pairingService.getByRiderAndHorse(riderId, horseId);
+    if (pairing) {
+      return calculatePairingStats(pairing);
+    }
+    return null;
+  },
 };
 
 export default pairingService;
\ No newline at end of file
```

### frontend/src/services/riderService.js

```diff
diff --git a/frontend/src/services/riderService.js b/frontend/src/services/riderService.js
index 31347e2d..0cf09113 100644
--- a/frontend/src/services/riderService.js
+++ b/frontend/src/services/riderService.js
@@ -1,32 +1,35 @@
 /**
  * Rider Service - Handles all rider-related API operations
  */
-import { api } from './apiService';
+import api from './apiService';
+import { createCrudOperations } from './apiService';
+import { validateRiderForm } from '../lib/helpers/domains/riders/validators';
 
 export const riderService = {
   // Basic CRUD operations
-  getAll: async () => {
-    const response = await api.get('/riders');
-    return response.data;
-  },
-
-  getById: async (id) => {
-    const response = await api.get(`/riders/${id}`);
-    return response.data;
-  },
+  ...createCrudOperations('riders'),
 
+  // Override create to add validation
   create: async (data) => {
+    // Validate form data
+    const validation = validateRiderForm(data);
+    if (!validation.isValid) {
+      throw new Error(JSON.stringify(validation.errors));
+    }
+
     const response = await api.post('/riders', data);
     return response.data;
   },
 
+  // Override update to add validation
   update: async (id, data) => {
-    const response = await api.put(`/riders/${id}`, data);
-    return response.data;
-  },
+    // Validate form data
+    const validation = validateRiderForm(data);
+    if (!validation.isValid) {
+      throw new Error(JSON.stringify(validation.errors));
+    }
 
-  delete: async (id) => {
-    const response = await api.delete(`/riders/${id}`);
+    const response = await api.put(`/riders/${id}`, data);
     return response.data;
   },
 
@@ -42,7 +45,7 @@ export const riderService = {
   },
 
   addHorse: async (riderId, horseId) => {
-    const response = await api.post(`/riders/${riderId}/horses`, { horse_id: horseId });
+    const response = await api.post(`/riders/${riderId}/horses`, { horse_id: Number(horseId) });
     return response.data;
   },
 
@@ -51,13 +54,15 @@ export const riderService = {
     return response.data;
   },
 
-  // Package operations
+  // Package operations with validation
   createPackage: async (riderId, packageData) => {
     const validatedData = {
       ...packageData,
       rider_id: Number(riderId),
       private_lesson_count: Number(packageData.private_lesson_count) || 0,
       joint_lesson_count: Number(packageData.joint_lesson_count) || 0,
+      activity_start_date: packageData.activity_start_date || null,
+      activity_end_date: packageData.activity_end_date || null,
     };
 
     const response = await api.post('/packages', validatedData);
@@ -67,8 +72,11 @@ export const riderService = {
   updatePackage: async (id, packageData) => {
     const validatedData = {
       ...packageData,
+      rider_id: Number(packageData.rider_id),
       private_lesson_count: Number(packageData.private_lesson_count) || 0,
       joint_lesson_count: Number(packageData.joint_lesson_count) || 0,
+      activity_start_date: packageData.activity_start_date || null,
+      activity_end_date: packageData.activity_end_date || null,
     };
 
     const response = await api.put(`/packages/${id}`, validatedData);
@@ -80,6 +88,15 @@ export const riderService = {
     return response.data;
   },
 
+  // Package status helpers
+  getPackageStats: async (packageId) => {
+    const pkg = await api.get(`/packages/${packageId}`);
+    return {
+      remainingLessons: calculateTotalRemainingLessons(pkg.data),
+      progress: calculatePackageProgress(pkg.data),
+    };
+  },
+
   // Statistics
   getStats: async () => {
     const response = await api.get('/riders/stats');
@@ -98,4 +115,4 @@ export const riderService = {
   },
 };
 
-export default riderService;
\ No newline at end of file
+export default riderService;
```

### frontend/src/services/templateService.js

```diff
diff --git a/frontend/src/services/templateService.js b/frontend/src/services/templateService.js
index 3e35f6e9..2e809217 100644
--- a/frontend/src/services/templateService.js
+++ b/frontend/src/services/templateService.js
@@ -1,32 +1,66 @@
 /**
  * Template Service - Handles all template-related API operations
  */
-import { api } from './apiService';
+import api from './apiService';
+import { createCrudOperations } from './apiService';
+import { LESSON_TYPES } from '../lib/domains/lessons/types';
+import { RECURRENCE_FREQUENCIES } from '../lib/domains/templates/recurrence';
 
 export const templateService = {
   // Basic CRUD operations
-  getAll: async () => {
-    const response = await api.get('/templates');
-    return response.data;
-  },
-
-  getById: async (id) => {
-    const response = await api.get(`/templates/${id}`);
-    return response.data;
-  },
+  ...createCrudOperations('templates'),
 
+  // Override create to add validation
   create: async (data) => {
-    const response = await api.post('/templates', data);
+    // Validate lesson type
+    const lessonType = LESSON_TYPES.find((t) => t.value === data.type);
+    if (!lessonType) {
+      throw new Error('Type de leçon invalide');
+    }
+
+    // Validate recurrence type if provided
+    if (data.recurrence_type) {
+      const recurrenceType = RECURRENCE_FREQUENCIES.find((t) => t.value === data.recurrence_type);
+      if (!recurrenceType) {
+        throw new Error('Type de récurrence invalide');
+      }
+    }
+
+    // Ensure numeric fields
+    const validatedData = {
+      ...data,
+      max_participants: Number(data.max_participants) || lessonType.defaultMax,
+    };
+
+    const response = await api.post('/templates', validatedData);
     return response.data;
   },
 
+  // Override update to add validation
   update: async (id, data) => {
-    const response = await api.put(`/templates/${id}`, data);
-    return response.data;
-  },
+    // Validate lesson type if provided
+    if (data.type) {
+      const lessonType = LESSON_TYPES.find((t) => t.value === data.type);
+      if (!lessonType) {
+        throw new Error('Type de leçon invalide');
+      }
+    }
+
+    // Validate recurrence type if provided
+    if (data.recurrence_type) {
+      const recurrenceType = RECURRENCE_FREQUENCIES.find((t) => t.value === data.recurrence_type);
+      if (!recurrenceType) {
+        throw new Error('Type de récurrence invalide');
+      }
+    }
 
-  delete: async (id) => {
-    const response = await api.delete(`/templates/${id}`);
+    // Ensure numeric fields
+    const validatedData = {
+      ...data,
+      max_participants: data.max_participants ? Number(data.max_participants) : undefined,
+    };
+
+    const response = await api.put(`/templates/${id}`, validatedData);
     return response.data;
   },
 
@@ -39,14 +73,14 @@ export const templateService = {
   generateLessons: async (id, startDate, endDate) => {
     const response = await api.post(`/templates/${id}/generate`, {
       start_date: startDate,
-      end_date: endDate
+      end_date: endDate,
     });
     return response.data;
   },
 
   previewLessons: async (id, startDate, endDate) => {
     const response = await api.get(`/templates/${id}/preview`, {
-      params: { start_date: startDate, end_date: endDate }
+      params: { start_date: startDate, end_date: endDate },
     });
     return response.data;
   },
@@ -59,7 +93,7 @@ export const templateService = {
 
   getNextOccurrences: async (id, count = 10) => {
     const response = await api.get(`/templates/${id}/next-occurrences`, {
-      params: { count }
+      params: { count },
     });
     return response.data;
   },
@@ -101,6 +135,20 @@ export const templateService = {
     const response = await api.delete('/templates/bulk', { data: { ids } });
     return response.data;
   },
+
+  // Helper methods using domain constants
+  getLessonTypes: () => LESSON_TYPES,
+  getRecurrenceTypes: () => RECURRENCE_FREQUENCIES,
+
+  // Get lesson type config by value
+  getLessonTypeConfig: (typeValue) => {
+    return LESSON_TYPES.find((t) => t.value === typeValue);
+  },
+
+  // Get recurrence type config by value
+  getRecurrenceTypeConfig: (recurrenceValue) => {
+    return RECURRENCE_FREQUENCIES.find((t) => t.value === recurrenceValue);
+  },
 };
 
-export default templateService;
\ No newline at end of file
+export default templateService;
```

### frontend/src/styles/common/alerts.css

```diff
diff --git a/frontend/src/styles/common/alerts.css b/frontend/src/styles/common/alerts.css
index b5b6adc3..02652ef5 100644
--- a/frontend/src/styles/common/alerts.css
+++ b/frontend/src/styles/common/alerts.css
@@ -1,42 +1,54 @@
-/* Common Alert Styles - Shared across all components */
+/* ============================================
+   ALERT STYLES - Consolidated
+   ============================================ */
 
 .alert {
   padding: 12px 16px;
-  border-radius: 6px;
+  border-radius: var(--radius-md);
   display: flex;
   align-items: flex-start;
-  gap: 8px;
-  font-size: 14px;
+  gap: var(--spacing-sm);
+  font-size: var(--font-size-sm);
   line-height: 1.5;
+  border-left: 4px solid;
+  margin-bottom: 16px;
 }
 
+/* ============================================
+   ALERT VARIANTS
+   ============================================ */
+
 .alert-info {
-  background-color: #d1ecf1;
+  background-color: var(--color-info-light);
   color: #0c5460;
-  border: 1px solid #bee5eb;
+  border-left-color: var(--color-info);
 }
 
 .alert-success {
-  background-color: #d4edda;
+  background-color: var(--color-success-light);
   color: #155724;
-  border: 1px solid #c3e6cb;
+  border-left-color: var(--color-success);
 }
 
 .alert-warning {
-  background-color: #fff3cd;
+  background-color: var(--color-warning-light);
   color: #856404;
-  border: 1px solid #ffeaa7;
+  border-left-color: var(--color-warning);
 }
 
 .alert-error,
 .alert-danger {
-  background-color: #f8d7da;
+  background-color: var(--color-danger-light);
   color: #721c24;
-  border: 1px solid #f5c6cb;
+  border-left-color: var(--color-danger);
 }
 
+/* ============================================
+   ALERT CONTENT
+   ============================================ */
+
 .alert strong {
-  font-weight: 600;
+  font-weight: var(--font-weight-semibold);
 }
 
 .alert p {
@@ -47,7 +59,10 @@
   margin-top: 8px;
 }
 
-/* Dismissible alerts */
+/* ============================================
+   DISMISSIBLE ALERTS
+   ============================================ */
+
 .alert-dismissible {
   padding-right: 40px;
   position: relative;
@@ -57,4 +72,43 @@
   position: absolute;
   top: 8px;
   right: 8px;
+  padding: 4px 8px;
+  background: none;
+  border: none;
+  cursor: pointer;
+  color: inherit;
+  opacity: 0.6;
+  transition: opacity var(--transition-base);
+}
+
+.alert-dismissible .btn-close:hover {
+  opacity: 1;
+}
+
+/* ============================================
+   ALERT STATES (Legacy Support)
+   ============================================ */
+
+.error {
+  padding: 12px 16px;
+  background: var(--color-danger-light);
+  color: #742a2a;
+  border-radius: var(--radius-md);
+  border-left: 4px solid var(--color-danger);
+  margin-bottom: 20px;
+  display: flex;
+  align-items: center;
+  gap: var(--spacing-sm);
+}
+
+.success {
+  padding: 12px 16px;
+  background: var(--color-success-light);
+  color: #22543d;
+  border-radius: var(--radius-md);
+  border-left: 4px solid var(--color-success);
+  margin-bottom: 20px;
+  display: flex;
+  align-items: center;
+  gap: var(--spacing-sm);
 }
\ No newline at end of file
```

### frontend/src/styles/common/badges.css

```diff
diff --git a/frontend/src/styles/common/badges.css b/frontend/src/styles/common/badges.css
index 1c2c2112..4b2efcbf 100644
--- a/frontend/src/styles/common/badges.css
+++ b/frontend/src/styles/common/badges.css
@@ -1,21 +1,37 @@
-/* Common Badge Styles - Shared across all components */
+/* ============================================
+   BADGE STYLES - Consolidated
+   ============================================ */
 
 .badge {
   display: inline-flex;
   align-items: center;
+  justify-content: center;
   padding: 4px 8px;
   font-size: 12px;
-  font-weight: 500;
+  font-weight: var(--font-weight-medium);
   border-radius: 4px;
   line-height: 1;
+  text-transform: uppercase;
+  letter-spacing: 0.5px;
+  white-space: nowrap;
 }
 
-/* Status badges */
+.badge.clickable:hover {
+  opacity: 0.8;
+  transform: scale(1.05);
+  transition: all var(--transition-base);
+  cursor: pointer;
+}
+
+/* ============================================
+   STATUS BADGES
+   ============================================ */
+
 .status-badge {
   padding: 4px 10px;
   border-radius: 12px;
   font-size: 12px;
-  font-weight: 500;
+  font-weight: var(--font-weight-medium);
   display: inline-flex;
   align-items: center;
   gap: 4px;
@@ -46,12 +62,39 @@
   color: #616161;
 }
 
-/* Lesson type badges */
+/* ============================================
+   PARTICIPATION BADGES
+   ============================================ */
+
+.badge-confirmed {
+  background-color: #e8f5e9;
+  color: #388e3c;
+}
+
+.badge-pending {
+  background-color: #fff3e0;
+  color: #e65100;
+}
+
+.badge-cancelled {
+  background-color: #ffebee;
+  color: #c62828;
+}
+
+.badge-info {
+  background-color: #e3f2fd;
+  color: #1976d2;
+}
+
+/* ============================================
+   LESSON TYPE BADGES
+   ============================================ */
+
 .lesson-type-badge {
   padding: 6px 12px;
   border-radius: 6px;
   font-size: 13px;
-  font-weight: 500;
+  font-weight: var(--font-weight-medium);
   display: inline-flex;
   align-items: center;
   gap: 6px;
@@ -87,23 +130,50 @@
   color: #616161;
 }
 
-/* Participation badges */
-.badge-confirmed {
-  background-color: #e8f5e9;
-  color: #388e3c;
+/* ============================================
+   COLOR VARIANT BADGES
+   ============================================ */
+
+.badge-info {
+  background-color: #d1ecf1;
+  color: #0c5460;
 }
 
-.badge-pending {
-  background-color: #fff3e0;
-  color: #e65100;
+.badge-success {
+  background-color: #d4edda;
+  color: #155724;
 }
 
-.badge-cancelled {
-  background-color: #ffebee;
-  color: #c62828;
+.badge-warning {
+  background-color: #fff3cd;
+  color: #856404;
 }
 
-.badge-info {
-  background-color: #e3f2fd;
-  color: #1976d2;
+.badge-danger {
+  background-color: #f8d7da;
+  color: #721c24;
+}
+
+.badge-secondary {
+  background-color: #e9ecef;
+  color: #495057;
+}
+
+.badge-primary {
+  background-color: #007bff;
+  color: white;
+}
+
+/* ============================================
+   HORSE TYPE BADGES
+   ============================================ */
+
+.badge-horse {
+  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
+  color: white;
+}
+
+.badge-pony {
+  background: linear-gradient(135deg, #ed64a6 0%, #d53f8c 100%);
+  color: white;
 }
\ No newline at end of file
```

### frontend/src/styles/common/buttons.css

```diff
diff --git a/frontend/src/styles/common/buttons.css b/frontend/src/styles/common/buttons.css
index d64cfd5d..bcd56bdd 100644
--- a/frontend/src/styles/common/buttons.css
+++ b/frontend/src/styles/common/buttons.css
@@ -1,19 +1,23 @@
-/* Common Button Styles - Shared across all components */
+/* ============================================
+   BUTTON STYLES - Consolidated
+   ============================================ */
 
 .btn {
   display: inline-flex;
   align-items: center;
   justify-content: center;
-  gap: 8px;
+  gap: var(--spacing-sm);
   padding: 10px 20px;
-  font-size: 14px;
-  font-weight: 500;
+  font-size: var(--font-size-sm);
+  font-weight: var(--font-weight-medium);
   border: none;
-  border-radius: 6px;
+  border-radius: var(--radius-md);
   cursor: pointer;
-  transition: all 0.2s;
+  transition: all var(--transition-base);
   text-decoration: none;
   line-height: 1.5;
+  background: var(--color-primary);
+  color: var(--color-white);
 }
 
 .btn:disabled {
@@ -31,7 +35,10 @@
   font-size: inherit;
 }
 
-/* Button sizes */
+/* ============================================
+   BUTTON SIZES
+   ============================================ */
+
 .btn-sm {
   padding: 6px 12px;
   font-size: 13px;
@@ -44,110 +51,146 @@
   gap: 10px;
 }
 
-/* Button variants */
+.btn-icon {
+  padding: 8px;
+  width: 36px;
+  height: 36px;
+  gap: 0;
+  min-width: 36px;
+}
+
+/* ============================================
+   BUTTON VARIANTS - SOLID
+   ============================================ */
+
 .btn-primary {
-  background-color: #007bff;
-  color: white;
+  background-color: var(--color-primary);
+  color: var(--color-white);
 }
 
 .btn-primary:hover:not(:disabled) {
-  background-color: #0056b3;
+  background-color: var(--color-primary-dark);
+  transform: translateY(-2px);
+  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
 }
 
 .btn-secondary {
-  background-color: #6c757d;
-  color: white;
+  background-color: var(--color-secondary);
+  color: var(--color-white);
 }
 
 .btn-secondary:hover:not(:disabled) {
-  background-color: #545b62;
+  background-color: var(--color-secondary-dark);
+  transform: translateY(-2px);
+  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
 }
 
 .btn-success {
-  background-color: #28a745;
-  color: white;
+  background-color: var(--color-success);
+  color: var(--color-white);
 }
 
 .btn-success:hover:not(:disabled) {
-  background-color: #1e7e34;
+  background-color: var(--color-success-dark);
+  transform: translateY(-2px);
+  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
 }
 
 .btn-danger {
-  background-color: #dc3545;
-  color: white;
+  background-color: var(--color-danger);
+  color: var(--color-white);
 }
 
 .btn-danger:hover:not(:disabled) {
-  background-color: #bd2130;
+  background-color: var(--color-danger-dark);
+  transform: translateY(-2px);
+  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
 }
 
 .btn-warning {
-  background-color: #ffc107;
-  color: #212529;
+  background-color: var(--color-warning);
+  color: var(--color-black);
 }
 
 .btn-warning:hover:not(:disabled) {
-  background-color: #e0a800;
+  background-color: var(--color-warning-dark);
+  transform: translateY(-2px);
+  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
 }
 
 .btn-info {
-  background-color: #17a2b8;
-  color: white;
+  background-color: var(--color-info);
+  color: var(--color-white);
 }
 
 .btn-info:hover:not(:disabled) {
-  background-color: #117a8b;
+  background-color: var(--color-info-dark);
+  transform: translateY(-2px);
+  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
 }
 
-/* Outline variants */
+/* ============================================
+   BUTTON VARIANTS - OUTLINE
+   ============================================ */
+
 .btn-outline-primary {
   background-color: transparent;
-  color: #007bff;
-  border: 1px solid #007bff;
+  color: var(--color-primary);
+  border: 1px solid var(--color-primary);
 }
 
 .btn-outline-primary:hover:not(:disabled) {
-  background-color: #007bff;
-  color: white;
+  background-color: var(--color-primary);
+  color: var(--color-white);
 }
 
 .btn-outline-secondary {
   background-color: transparent;
-  color: #6c757d;
-  border: 1px solid #6c757d;
+  color: var(--color-secondary);
+  border: 1px solid var(--color-secondary);
 }
 
 .btn-outline-secondary:hover:not(:disabled) {
-  background-color: #6c757d;
-  color: white;
+  background-color: var(--color-secondary);
+  color: var(--color-white);
 }
 
 .btn-outline-danger {
   background-color: transparent;
-  color: #dc3545;
-  border: 1px solid #dc3545;
+  color: var(--color-danger);
+  border: 1px solid var(--color-danger);
 }
 
 .btn-outline-danger:hover:not(:disabled) {
-  background-color: #dc3545;
-  color: white;
+  background-color: var(--color-danger);
+  color: var(--color-white);
 }
 
-/* Icon buttons */
-.btn-icon {
-  padding: 8px;
-  width: 36px;
-  height: 36px;
-  gap: 0;
-}
+/* ============================================
+   BUTTON GROUPS
+   ============================================ */
 
-/* Button groups */
 .btn-group {
   display: inline-flex;
-  gap: 8px;
+  gap: var(--spacing-sm);
 }
 
-/* Responsive adjustments */
+/* ============================================
+   BUTTON STATES
+   ============================================ */
+
+.btn:active {
+  transform: translateY(0);
+}
+
+.btn:active:not(:disabled) {
+  transform: scale(0.98);
+}
+
+/* ============================================
+   RESPONSIVE ADJUSTMENTS
+   ============================================ */
+
 @media (max-width: 768px) {
   .btn {
     padding: 8px 16px;
@@ -163,4 +206,4 @@
     padding: 10px 20px;
     font-size: 15px;
   }
-}
+}
\ No newline at end of file
```

### frontend/src/styles/common/forms.css

```diff
diff --git a/frontend/src/styles/common/forms.css b/frontend/src/styles/common/forms.css
index f43741b5..ef416ccb 100644
--- a/frontend/src/styles/common/forms.css
+++ b/frontend/src/styles/common/forms.css
@@ -1,42 +1,55 @@
-/* Common Form Styles - Shared across all forms */
+/* ============================================
+   FORM STYLES - Consolidated
+   ============================================ */
 
 .form-group {
-  margin-bottom: 16px;
+  margin-bottom: var(--spacing-md);
 }
 
 .form-group label {
   display: block;
   margin-bottom: 6px;
-  font-size: 14px;
-  font-weight: 500;
-  color: #495057;
+  font-size: var(--font-size-sm);
+  font-weight: var(--font-weight-medium);
+  color: var(--color-gray-700);
 }
 
+/* ============================================
+   FORM INPUTS
+   ============================================ */
+
 .form-input,
 .form-select,
 .form-textarea {
   width: 100%;
   padding: 8px 12px;
-  font-size: 14px;
-  border: 1px solid #ced4da;
-  border-radius: 6px;
-  transition: border-color 0.2s, box-shadow 0.2s;
+  font-size: var(--font-size-sm);
+  border: 1px solid var(--color-gray-400);
+  border-radius: var(--radius-md);
+  transition: border-color var(--transition-base), box-shadow var(--transition-base);
   font-family: inherit;
+  background: var(--color-white);
+  color: var(--color-gray-900);
 }
 
 .form-input:focus,
 .form-select:focus,
 .form-textarea:focus {
   outline: none;
-  border-color: #007bff;
+  border-color: var(--color-primary);
   box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
 }
 
 .form-input:disabled,
 .form-select:disabled,
 .form-textarea:disabled {
-  background-color: #e9ecef;
+  background-color: var(--color-gray-100);
   cursor: not-allowed;
+  opacity: 0.6;
+}
+
+.form-input::placeholder {
+  color: var(--color-gray-500);
 }
 
 .form-textarea {
@@ -44,40 +57,56 @@
   min-height: 80px;
 }
 
-.form-actions {
-  display: flex;
-  gap: 12px;
-  margin-top: 20px;
-}
+/* ============================================
+   FORM VALIDATION STATES
+   ============================================ */
 
-/* Form validation states */
 .form-input.is-invalid,
 .form-select.is-invalid,
 .form-textarea.is-invalid {
-  border-color: #dc3545;
+  border-color: var(--color-danger);
+}
+
+.form-input.is-invalid:focus,
+.form-select.is-invalid:focus,
+.form-textarea.is-invalid:focus {
+  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
 }
 
 .form-input.is-valid,
 .form-select.is-valid,
 .form-textarea.is-valid {
-  border-color: #28a745;
+  border-color: var(--color-success);
 }
 
+.form-input.is-valid:focus,
+.form-select.is-valid:focus,
+.form-textarea.is-valid:focus {
+  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
+}
+
+/* ============================================
+   VALIDATION MESSAGES
+   ============================================ */
+
 .invalid-feedback {
   display: block;
   margin-top: 4px;
   font-size: 12px;
-  color: #dc3545;
+  color: var(--color-danger);
 }
 
 .valid-feedback {
   display: block;
   margin-top: 4px;
   font-size: 12px;
-  color: #28a745;
+  color: var(--color-success);
 }
 
-/* Checkbox and Radio styles */
+/* ============================================
+   CHECKBOX & RADIO
+   ============================================ */
+
 input[type='checkbox'],
 input[type='radio'] {
   width: 16px;
@@ -85,17 +114,38 @@ input[type='radio'] {
   cursor: pointer;
 }
 
-/* Helper text */
+/* ============================================
+   FORM ACTIONS
+   ============================================ */
+
+.form-actions {
+  display: flex;
+  gap: 12px;
+  margin-top: 20px;
+  align-items: center;
+}
+
+/* ============================================
+   HELPER TEXT
+   ============================================ */
+
 .text-muted {
   display: block;
   margin-top: 4px;
   font-size: 12px;
-  color: #6c757d;
+  color: var(--color-gray-600);
 }
 
 .text-info {
   display: block;
   margin-top: 4px;
   font-size: 12px;
-  color: #17a2b8;
+  color: var(--color-info);
+}
+
+.text-danger {
+  display: block;
+  margin-top: 4px;
+  font-size: 12px;
+  color: var(--color-danger);
 }
\ No newline at end of file
```

### frontend/src/styles/common/index.css

```diff
diff --git a/frontend/src/styles/common/index.css b/frontend/src/styles/common/index.css
index d101410d..cb5bdf85 100644
--- a/frontend/src/styles/common/index.css
+++ b/frontend/src/styles/common/index.css
@@ -1,8 +1,13 @@
-/* Common Styles - Import all common CSS files */
+/* ============================================
+   COMMON STYLES - Main Import File
+   ============================================ */
 
-@import './modal.css';
-@import './forms.css';
+@import './base.css';
 @import './buttons.css';
+@import './forms.css';
 @import './alerts.css';
 @import './badges.css';
-@import './utilities.css';
\ No newline at end of file
+@import './modal.css';
+@import './tables.css';
+@import './utilities.css';
+@import './infotooltip.css';
\ No newline at end of file
```

### frontend/src/styles/common/infotooltip.css

```diff
diff --git a/frontend/src/styles/common/infotooltip.css b/frontend/src/styles/common/infotooltip.css
index d6dee1d0..a7eda93f 100644
--- a/frontend/src/styles/common/infotooltip.css
+++ b/frontend/src/styles/common/infotooltip.css
@@ -1,8 +1,22 @@
+/* ============================================
+   INFO TOOLTIP COMPONENT STYLES
+   ============================================ */
+
+@import './base.css';
+
+/* ============================================
+   INFO TOOLTIP WRAPPER
+   ============================================ */
+
 .info-tooltip-wrapper {
   position: relative;
   display: inline-block;
 }
 
+/* ============================================
+   INFO TOOLTIP TRIGGER
+   ============================================ */
+
 .info-tooltip-trigger {
   background: none;
   border: none;
@@ -13,8 +27,8 @@
   justify-content: center;
   color: #4299e1;
   font-size: 16px;
-  transition: all 0.2s ease;
-  border-radius: 50%;
+  transition: all var(--transition-base);
+  border-radius: var(--radius-full);
 }
 
 .info-tooltip-trigger:hover {
@@ -28,33 +42,29 @@
   outline-offset: 2px;
 }
 
+/* ============================================
+   INFO TOOLTIP CONTENT
+   ============================================ */
+
 .info-tooltip {
   position: absolute;
-  background: #2d3748;
-  color: white;
+  background: var(--color-gray-800);
+  color: var(--color-white);
   padding: 12px 16px;
-  border-radius: 8px;
+  border-radius: var(--radius-lg);
   font-size: 0.85rem;
   line-height: 1.6;
   width: 400px;
   z-index: 1000;
-  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
+  box-shadow: var(--shadow-lg);
   animation: tooltipFadeIn 0.2s ease;
   display: block;
 }
 
-@keyframes tooltipFadeIn {
-  from {
-    opacity: 0;
-    transform: scale(0.95);
-  }
-  to {
-    opacity: 1;
-    transform: scale(1);
-  }
-}
+/* ============================================
+   TOOLTIP POSITION VARIANTS
+   ============================================ */
 
-/* Position variants */
 .info-tooltip-top {
   bottom: 100%;
   left: 50%;
@@ -69,7 +79,7 @@
   left: 50%;
   transform: translateX(-50%);
   border: 6px solid transparent;
-  border-top-color: #2d3748;
+  border-top-color: var(--color-gray-800);
 }
 
 .info-tooltip-bottom {
@@ -86,7 +96,7 @@
   left: 50%;
   transform: translateX(-50%);
   border: 6px solid transparent;
-  border-bottom-color: #2d3748;
+  border-bottom-color: var(--color-gray-800);
 }
 
 .info-tooltip-left {
@@ -103,7 +113,7 @@
   top: 50%;
   transform: translateY(-50%);
   border: 6px solid transparent;
-  border-left-color: #2d3748;
+  border-left-color: var(--color-gray-800);
 }
 
 .info-tooltip-right {
@@ -120,10 +130,13 @@
   top: 50%;
   transform: translateY(-50%);
   border: 6px solid transparent;
-  border-right-color: #2d3748;
+  border-right-color: var(--color-gray-800);
 }
 
-/* Mobile adjustments */
+/* ============================================
+   RESPONSIVE DESIGN
+   ============================================ */
+
 @media (max-width: 768px) {
   .info-tooltip {
     width: 300px;
@@ -134,4 +147,4 @@
   .info-tooltip-trigger {
     font-size: 14px;
   }
-}
+}
\ No newline at end of file
```

### frontend/src/styles/common/modal.css

```diff
diff --git a/frontend/src/styles/common/modal.css b/frontend/src/styles/common/modal.css
index 24e527d5..fb3f60af 100644
--- a/frontend/src/styles/common/modal.css
+++ b/frontend/src/styles/common/modal.css
@@ -1,4 +1,6 @@
-/* Common Modal Styles - Shared across all modals */
+/* ============================================
+   MODAL STYLES - Consolidated
+   ============================================ */
 
 .modal-overlay {
   position: fixed;
@@ -16,26 +18,19 @@
 }
 
 .modal-content {
-  background: white;
-  border-radius: 12px;
+  background: var(--color-white);
+  border-radius: var(--radius-xl);
   box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
   max-height: 90vh;
   display: flex;
   flex-direction: column;
   overflow: hidden;
-  animation: modalSlideIn 0.3s ease;
+  animation: slideIn var(--transition-slow);
 }
 
-@keyframes modalSlideIn {
-  from {
-    opacity: 0;
-    transform: translateY(-30px) scale(0.95);
-  }
-  to {
-    opacity: 1;
-    transform: translateY(0) scale(1);
-  }
-}
+/* ============================================
+   MODAL SIZES
+   ============================================ */
 
 .modal-content.small {
   width: 100%;
@@ -52,33 +47,50 @@
   max-width: 900px;
 }
 
+.modal-content.xlarge {
+  width: 100%;
+  max-width: 1400px;
+}
+
+/* ============================================
+   MODAL HEADER
+   ============================================ */
+
 .modal-header {
   display: flex;
   align-items: center;
   justify-content: space-between;
   padding: 20px 24px;
-  border-bottom: 1px solid #e9ecef;
+  border-bottom: 1px solid var(--color-gray-200);
 }
 
-.modal-header h2 {
+.modal-header h2,
+.modal-header h3 {
   display: flex;
   align-items: center;
   gap: 8px;
   margin: 0;
   font-size: 1.3rem;
-  font-weight: 600;
-  color: #2d3748;
+  font-weight: var(--font-weight-semibold);
+  color: var(--color-gray-800);
 }
 
 .modal-header h2 svg,
-.modal-header h2 i {
+.modal-header h2 i,
+.modal-header h3 svg,
+.modal-header h3 i {
   display: flex;
   align-items: center;
   justify-content: center;
   flex-shrink: 0;
 }
 
-.btn-close {
+/* ============================================
+   CLOSE BUTTON
+   ============================================ */
+
+.btn-close,
+.modal-close {
   background: none;
   border: none;
   cursor: pointer;
@@ -86,36 +98,50 @@
   display: flex;
   align-items: center;
   justify-content: center;
-  border-radius: 6px;
-  transition: background-color 0.2s;
-  color: #6c757d;
+  border-radius: var(--radius-md);
+  transition: background-color var(--transition-base);
+  color: var(--color-gray-600);
   flex-shrink: 0;
+  font-size: 24px;
 }
 
-.btn-close:hover {
-  background-color: #f8f9fa;
-  color: #212529;
+.btn-close:hover,
+.modal-close:hover {
+  background-color: var(--color-gray-100);
+  color: var(--color-gray-900);
 }
 
+/* ============================================
+   MODAL BODY
+   ============================================ */
+
 .modal-body {
   padding: 24px;
   overflow-y: auto;
   flex: 1;
 }
 
+/* ============================================
+   MODAL FOOTER
+   ============================================ */
+
 .modal-footer {
   padding: 16px 24px;
-  border-top: 1px solid #e9ecef;
+  border-top: 1px solid var(--color-gray-200);
   display: flex;
   align-items: center;
   justify-content: flex-end;
   gap: 12px;
 }
 
+/* ============================================
+   MODAL TABS
+   ============================================ */
+
 .modal-tabs {
   display: flex;
   gap: 8px;
-  border-bottom: 1px solid #e9ecef;
+  border-bottom: 1px solid var(--color-gray-200);
   padding: 0 24px;
 }
 
@@ -125,31 +151,53 @@
   padding: 12px 16px;
   cursor: pointer;
   font-size: 14px;
-  font-weight: 500;
-  color: #6c757d;
+  font-weight: var(--font-weight-medium);
+  color: var(--color-gray-600);
   border-bottom: 2px solid transparent;
-  transition: all 0.2s;
+  transition: all var(--transition-base);
   display: flex;
   align-items: center;
   gap: 8px;
 }
 
 .modal-tabs .tab:hover {
-  color: #007bff;
+  color: var(--color-primary);
 }
 
 .modal-tabs .tab.active {
-  color: #007bff;
-  border-bottom-color: #007bff;
+  color: var(--color-primary);
+  border-bottom-color: var(--color-primary);
 }
 
+/* ============================================
+   MODAL ACTIONS COMPACT
+   ============================================ */
+
 .modal-actions-compact {
   display: flex;
   gap: 8px;
   align-items: center;
+  flex-wrap: wrap;
+  justify-content: flex-end;
+}
+
+.modal-actions-compact .btn {
+  padding: 6px 10px;
+  font-size: 13px;
+  line-height: 1.2;
+  min-height: auto;
+  white-space: nowrap;
 }
 
-/* Loading and Error States */
+.modal-actions-compact .btn-sm {
+  padding: 4px 8px;
+  font-size: 12px;
+}
+
+/* ============================================
+   MODAL STATES
+   ============================================ */
+
 .modal-loading,
 .modal-error {
   display: flex;
@@ -163,25 +211,40 @@
 .modal-loading p,
 .modal-error p {
   margin-top: 12px;
-  color: #6c757d;
+  color: var(--color-gray-600);
 }
 
 .modal-error h3 {
   margin: 16px 0 8px;
-  color: #dc3545;
+  color: var(--color-danger);
 }
 
-/* Responsive */
-@media (max-width: 768px) {
-  .modal-content.large {
-    max-width: 95vw;
-  }
+/* ============================================
+   SPECIAL MODAL SIZES
+   ============================================ */
 
-  .modal-content.medium {
-    max-width: 95vw;
-  }
+.rider-card-modal {
+  max-width: 1400px;
+  width: 95%;
+  max-height: 90vh;
+}
+
+.template-modal {
+  max-width: 700px;
+  width: 90%;
+  max-height: 90vh;
+  overflow-y: auto;
+}
+
+/* ============================================
+   RESPONSIVE DESIGN
+   ============================================ */
 
-  .modal-content.small {
+@media (max-width: 768px) {
+  .modal-content.small,
+  .modal-content.medium,
+  .modal-content.large,
+  .modal-content.xlarge {
     max-width: 95vw;
   }
 
@@ -199,7 +262,18 @@
     align-items: stretch;
   }
 
-  .modal-footer button {
+  .modal-footer .btn {
     width: 100%;
   }
-}
+
+  .modal-actions-compact {
+    flex-direction: column;
+    align-items: stretch;
+    gap: 8px;
+  }
+
+  .modal-actions-compact .btn {
+    justify-content: center;
+    width: 100%;
+  }
+}
\ No newline at end of file
```

### frontend/src/styles/common/utilities.css

```diff
diff --git a/frontend/src/styles/common/utilities.css b/frontend/src/styles/common/utilities.css
index d079eb13..1fc997e7 100644
--- a/frontend/src/styles/common/utilities.css
+++ b/frontend/src/styles/common/utilities.css
@@ -1,13 +1,22 @@
-/* Common Utility Classes - Shared across all components */
+/* ============================================
+   UTILITY CLASSES - Consolidated
+   ============================================ */
 
-/* Spacing utilities */
+/* ============================================
+   SPACING UTILITIES
+   ============================================ */
+
+/* Margin */
 .mt-10 { margin-top: 10px; }
 .mt-20 { margin-top: 20px; }
 .mb-10 { margin-bottom: 10px; }
+.mb-15 { margin-bottom: 15px; }
 .mb-20 { margin-bottom: 20px; }
+.mb-30 { margin-bottom: 30px; }
 .ml-10 { margin-left: 10px; }
 .mr-10 { margin-right: 10px; }
 
+/* Padding */
 .pt-10 { padding-top: 10px; }
 .pt-20 { padding-top: 20px; }
 .pb-10 { padding-bottom: 10px; }
@@ -15,16 +24,23 @@
 .pl-10 { padding-left: 10px; }
 .pr-10 { padding-right: 10px; }
 
-/* Display utilities */
+/* ============================================
+   DISPLAY UTILITIES
+   ============================================ */
+
 .d-flex { display: flex; }
 .d-inline-flex { display: inline-flex; }
 .d-block { display: block; }
 .d-inline-block { display: inline-block; }
 .d-none { display: none; }
 
-/* Flex utilities */
+/* ============================================
+   FLEX UTILITIES
+   ============================================ */
+
 .flex-column { flex-direction: column; }
 .flex-row { flex-direction: row; }
+.flex-wrap { flex-wrap: wrap; }
 .align-items-center { align-items: center; }
 .align-items-start { align-items: flex-start; }
 .align-items-end { align-items: flex-end; }
@@ -32,35 +48,34 @@
 .justify-content-between { justify-content: space-between; }
 .justify-content-end { justify-content: flex-end; }
 .gap-8 { gap: 8px; }
+.gap-10 { gap: 10px; }
 .gap-12 { gap: 12px; }
 .gap-16 { gap: 16px; }
+.gap-20 { gap: 20px; }
+
+/* ============================================
+   TEXT UTILITIES
+   ============================================ */
 
-/* Text utilities */
 .text-center { text-align: center; }
 .text-left { text-align: left; }
 .text-right { text-align: right; }
 
-.text-muted { color: #6c757d; }
-.text-primary { color: #007bff; }
-.text-success { color: #28a745; }
-.text-danger { color: #dc3545; }
-.text-warning { color: #ffc107; }
-.text-info { color: #17a2b8; }
+.text-muted { color: var(--color-gray-600); }
+.text-primary { color: var(--color-primary); }
+.text-success { color: var(--color-success); }
+.text-danger { color: var(--color-danger); }
+.text-warning { color: var(--color-warning); }
+.text-info { color: var(--color-info); }
 
-.font-weight-bold { font-weight: 700; }
-.font-weight-normal { font-weight: 400; }
+.font-weight-normal { font-weight: var(--font-weight-normal); }
+.font-weight-medium { font-weight: var(--font-weight-medium); }
+.font-weight-bold { font-weight: var(--font-weight-bold); }
 
-/* Loading animation */
-.spin {
-  animation: spin 1s linear infinite;
-}
-
-@keyframes spin {
-  from { transform: rotate(0deg); }
-  to { transform: rotate(360deg); }
-}
+/* ============================================
+   LOADING & STATES
+   ============================================ */
 
-/* Empty state */
 .empty-state {
   display: flex;
   flex-direction: column;
@@ -68,15 +83,27 @@
   justify-content: center;
   padding: 40px 20px;
   text-align: center;
-  color: #6c757d;
+  color: var(--color-gray-600);
 }
 
 .empty-state p {
   margin-top: 12px;
-  font-size: 14px;
+  font-size: var(--font-size-sm);
+}
+
+.empty-state-small {
+  text-align: center;
+  padding: 30px;
+  background: var(--color-gray-100);
+  border-radius: var(--radius-lg);
+  border: 2px dashed #cbd5e0;
+}
+
+.empty-state-small p {
+  color: var(--color-gray-600);
+  margin-bottom: 15px;
 }
 
-/* Loading state */
 .loading {
   display: flex;
   flex-direction: column;
@@ -84,14 +111,14 @@
   justify-content: center;
   padding: 40px 20px;
   text-align: center;
+  color: var(--color-gray-600);
 }
 
 .loading p {
   margin-top: 12px;
-  color: #6c757d;
+  color: var(--color-gray-600);
 }
 
-/* Error state */
 .error {
   display: flex;
   flex-direction: column;
@@ -99,9 +126,30 @@
   justify-content: center;
   padding: 40px 20px;
   text-align: center;
+  color: var(--color-danger);
 }
 
 .error p {
   margin-top: 12px;
-  color: #dc3545;
+  color: var(--color-danger);
+}
+
+/* ============================================
+   COMPOSITE UTILITIES
+   ============================================ */
+
+.flex {
+  display: flex;
+}
+
+.flex-between {
+  display: flex;
+  justify-content: space-between;
+  align-items: center;
+}
+
+.flex-center {
+  display: flex;
+  align-items: center;
+  justify-content: center;
 }
\ No newline at end of file
```

### frontend/src/styles/components/calendar.css

```diff
diff --git a/frontend/src/styles/components/calendar.css b/frontend/src/styles/components/calendar.css
index 77488ade..642bc62a 100644
--- a/frontend/src/styles/components/calendar.css
+++ b/frontend/src/styles/components/calendar.css
@@ -1,10 +1,16 @@
+/* ============================================
+   CALENDAR COMPONENT STYLES
+   ============================================ */
+
+@import '../common/index.css';
+
 /* ============================================
    CALENDAR VIEW - MAIN CONTAINER
    ============================================ */
 
 .calendar-view {
   padding: 20px;
-  background: #f5f5f5;
+  background: var(--color-gray-100);
   min-height: 100vh;
   display: flex;
   flex-direction: column;
@@ -18,34 +24,21 @@
   align-items: center;
   justify-content: center;
   min-height: 400px;
-  background: white;
-  border-radius: 8px;
+  background: var(--color-white);
+  border-radius: var(--radius-lg);
   padding: 40px;
   margin: 20px;
 }
 
-@keyframes spin {
-  0% {
-    transform: rotate(0deg);
-  }
-  100% {
-    transform: rotate(360deg);
-  }
-}
-
-.spin {
-  animation: spin 1s linear infinite;
-}
-
 /* ============================================
    CALENDAR HEADER
    ============================================ */
 
 .calendar-header {
-  background: white;
-  border-radius: 8px;
+  background: var(--color-white);
+  border-radius: var(--radius-lg);
   padding: 16px 20px;
-  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
+  box-shadow: var(--shadow-sm);
 }
 
 .calendar-header-title {
@@ -67,8 +60,8 @@
 .calendar-title {
   margin: 0;
   font-size: clamp(1.25rem, 5vw, 1.75rem);
-  font-weight: 700;
-  color: #2d3748;
+  font-weight: var(--font-weight-bold);
+  color: var(--color-gray-800);
 }
 
 .calendar-nav-buttons {
@@ -79,16 +72,15 @@
   flex-shrink: 0;
 }
 
-.calendar-nav-buttons .btn-text {
-  display: inline;
-}
-
 .calendar-header-bottom {
   display: flex;
   justify-content: flex-start;
 }
 
-/* Compact Stats */
+/* ============================================
+   COMPACT STATS
+   ============================================ */
+
 .calendar-stats-compact {
   display: flex;
   gap: 16px;
@@ -101,29 +93,29 @@
   align-items: center;
   gap: 8px;
   padding: 8px 12px;
-  background: #f7fafc;
-  border-radius: 6px;
-  border: 1px solid #e2e8f0;
-  transition: all 0.2s ease;
+  background: var(--color-gray-100);
+  border-radius: var(--radius-md);
+  border: 1px solid var(--color-gray-200);
+  transition: all var(--transition-base);
 }
 
 .stat-compact-item:hover {
-  background: #edf2f7;
-  border-color: #cbd5e0;
+  background: var(--color-gray-200);
+  border-color: var(--color-gray-300);
 }
 
 .stat-compact-value {
   font-size: 1.1rem;
-  font-weight: 700;
-  color: #2d3748;
+  font-weight: var(--font-weight-bold);
+  color: var(--color-gray-800);
   min-width: 24px;
   text-align: center;
 }
 
 .stat-compact-label {
   font-size: 0.7rem;
-  color: #718096;
-  font-weight: 500;
+  color: var(--color-gray-600);
+  font-weight: var(--font-weight-medium);
   text-transform: uppercase;
   letter-spacing: 0.4px;
   white-space: nowrap;
@@ -134,10 +126,10 @@
    ============================================ */
 
 .calendar-filters {
-  background: white;
+  background: var(--color-white);
   padding: 16px;
-  border-radius: 8px;
-  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
+  border-radius: var(--radius-lg);
+  box-shadow: var(--shadow-sm);
 }
 
 .filters-row {
@@ -164,50 +156,8 @@
 
 .filter-group label {
   font-size: 0.875rem;
-  font-weight: 500;
-  color: #4a5568;
-}
-
-.filter-group input[type='checkbox'] {
-  cursor: pointer;
-}
-
-.form-select {
-  padding: 8px 12px;
-  border: 1px solid #cbd5e0;
-  border-radius: 6px;
-  font-size: 0.875rem;
-  background: white;
-  cursor: pointer;
-  transition: all 0.2s ease;
-  min-width: 160px;
-  font-family: inherit;
-}
-
-.form-select:hover {
-  border-color: #a0aec0;
-}
-
-.form-select:focus {
-  outline: none;
-  border-color: #4299e1;
-  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
-}
-
-/* Action Buttons */
-.filters-actions {
-  display: flex;
-  gap: 8px;
-  flex-shrink: 0;
-  flex-wrap: wrap;
-}
-
-.filters-actions .btn {
-  white-space: nowrap;
-}
-
-.filters-actions .btn-text {
-  display: inline;
+  font-weight: var(--font-weight-medium);
+  color: var(--color-gray-700);
 }
 
 /* ============================================
@@ -226,10 +176,10 @@
    ============================================ */
 
 .week-view {
-  background: white;
-  border-radius: 8px;
+  background: var(--color-white);
+  border-radius: var(--radius-lg);
   overflow: hidden;
-  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
+  box-shadow: var(--shadow-sm);
   display: flex;
   flex-direction: column;
   flex: 1;
@@ -249,8 +199,8 @@
    ============================================ */
 
 .time-column {
-  background: #f8f9fa;
-  border-right: 2px solid #dee2e6;
+  background: var(--color-gray-100);
+  border-right: 2px solid var(--color-gray-300);
   display: flex;
   flex-direction: column;
   overflow: hidden;
@@ -261,11 +211,11 @@
   display: flex;
   align-items: center;
   justify-content: center;
-  font-weight: bold;
-  border-bottom: 2px solid #dee2e6;
+  font-weight: var(--font-weight-bold);
+  border-bottom: 2px solid var(--color-gray-300);
   position: sticky;
   top: 0;
-  background: #f8f9fa;
+  background: var(--color-gray-100);
   z-index: 10;
   flex-shrink: 0;
 }
@@ -283,26 +233,21 @@
   display: flex;
   align-items: flex-start;
   justify-content: center;
-  border-bottom: 1px solid #e9ecef;
+  border-bottom: 1px solid var(--color-gray-200);
   font-size: 12px;
-  color: #6c757d;
+  color: var(--color-gray-600);
   flex-shrink: 0;
-  font-weight: 500;
+  font-weight: var(--font-weight-medium);
   padding-top: 4px;
   position: relative;
 }
 
-.time-label {
-  display: block;
-  line-height: 1;
-}
-
 /* ============================================
    DAY COLUMN
    ============================================ */
 
 .day-column {
-  border-right: 1px solid #dee2e6;
+  border-right: 1px solid var(--color-gray-300);
   position: relative;
   display: flex;
   flex-direction: column;
@@ -319,16 +264,16 @@
 }
 
 .day-column.past {
-  background: #f8f9fa;
+  background: var(--color-gray-100);
   opacity: 0.7;
 }
 
 .day-header {
   height: 80px;
   padding: 10px;
-  border-bottom: 2px solid #dee2e6;
+  border-bottom: 2px solid var(--color-gray-300);
   text-align: center;
-  background: white;
+  background: var(--color-white);
   position: sticky;
   top: 0;
   z-index: 10;
@@ -339,7 +284,7 @@
 }
 
 .day-name {
-  font-weight: bold;
+  font-weight: var(--font-weight-bold);
   font-size: 14px;
   text-transform: capitalize;
   margin-bottom: 5px;
@@ -351,13 +296,13 @@
 
 .day-date {
   font-size: 12px;
-  color: #6c757d;
+  color: var(--color-gray-600);
 }
 
 .today-badge {
   display: inline-block;
   background: #48bb78;
-  color: white;
+  color: var(--color-white);
   padding: 2px 8px;
   border-radius: 12px;
   font-size: 10px;
@@ -365,11 +310,6 @@
   white-space: nowrap;
 }
 
-.day-column.past .lesson-card {
-  cursor: pointer;
-  opacity: 1;
-}
-
 /* ============================================
    DAY GRID
    ============================================ */
@@ -395,7 +335,7 @@
   width: 100%;
   height: 100%;
   min-height: 840px;
-  background: white;
+  background: var(--color-white);
   overflow-y: auto;
   overflow-x: hidden;
 }
@@ -413,7 +353,7 @@
 .hour-marker-row {
   position: absolute;
   width: 100%;
-  border-bottom: 1px solid #e2e8f0;
+  border-bottom: 1px solid var(--color-gray-200);
 }
 
 .hour-label {
@@ -421,8 +361,8 @@
   left: 4px;
   top: 2px;
   font-size: 0.65rem;
-  color: #718096;
-  font-weight: 500;
+  color: var(--color-gray-600);
+  font-weight: var(--font-weight-medium);
   line-height: 1;
   background: inherit;
   padding: 0 2px;
@@ -434,7 +374,7 @@
   align-items: center;
   justify-content: center;
   height: 100%;
-  color: #adb5bd;
+  color: var(--color-gray-500);
   font-style: italic;
   position: absolute;
   top: 0;
@@ -454,18 +394,19 @@
   height: 100%;
   z-index: 2;
 }
+
 /* ============================================
-   LESSON CARD - WRAPPER
+   LESSON CARD
    ============================================ */
 
 .lesson-card {
   position: absolute;
   width: 100%;
   height: 100%;
-  border-radius: 6px;
+  border-radius: var(--radius-md);
   cursor: pointer;
-  transition: all 0.2s ease;
-  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
+  transition: all var(--transition-base);
+  box-shadow: var(--shadow-sm);
   overflow: visible;
   display: flex;
   flex-direction: column;
@@ -479,7 +420,7 @@
 
 .lesson-card:hover {
   transform: translateY(-2px);
-  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
+  box-shadow: var(--shadow-md);
   z-index: 10;
 }
 
@@ -522,7 +463,7 @@
 }
 
 /* ============================================
-   LESSON CARD CONTENT - OVERRIDE
+   LESSON CARD CONTENT
    ============================================ */
 
 .lesson-card > div {
@@ -532,7 +473,7 @@
   flex-direction: column;
   gap: 4px;
   padding: 8px;
-  border-radius: 6px;
+  border-radius: var(--radius-md);
   min-height: auto;
   max-height: none;
   overflow: visible;
@@ -557,209 +498,6 @@
   max-width: 100%;
 }
 
-/* ============================================
-   LESSON CARD - HIDE UNNECESSARY CONTENT
-   ============================================ */
-
-.lesson-card.compact > div > div:nth-child(3),
-.lesson-card.compact > div > div:nth-child(4),
-.lesson-card.compact > div > div:nth-child(5) {
-  display: none;
-}
-
-/* ============================================
-   MODAL
-   ============================================ */
-
-.modal-overlay {
-  position: fixed;
-  top: 0;
-  left: 0;
-  right: 0;
-  bottom: 0;
-  background: rgba(0, 0, 0, 0.5);
-  display: flex;
-  align-items: center;
-  justify-content: center;
-  z-index: 1000;
-  padding: 20px;
-}
-
-.modal-content {
-  background: white;
-  border-radius: 8px;
-  max-width: 800px;
-  width: 100%;
-  max-height: 90vh;
-  overflow-y: auto;
-  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
-}
-
-.modal-header {
-  display: flex;
-  justify-content: space-between;
-  align-items: center;
-  padding: 20px;
-  border-bottom: 1px solid #dee2e6;
-}
-
-.modal-header h2 {
-  margin: 0;
-  font-size: 24px;
-}
-
-.btn-close {
-  background: none;
-  border: none;
-  font-size: 32px;
-  cursor: pointer;
-  color: #6c757d;
-  padding: 0;
-  width: 32px;
-  height: 32px;
-  display: flex;
-  align-items: center;
-  justify-content: center;
-  transition: color 0.2s ease;
-}
-
-.btn-close:hover {
-  color: #000;
-}
-
-.modal-body {
-  padding: 20px;
-}
-
-.modal-footer {
-  display: flex;
-  justify-content: flex-end;
-  gap: 10px;
-  padding: 20px;
-  border-top: 1px solid #dee2e6;
-}
-
-/* ============================================
-   ALERTS
-   ============================================ */
-
-.alert {
-  padding: 12px 16px;
-  border-radius: 6px;
-  margin-bottom: 15px;
-  display: flex;
-  align-items: center;
-  gap: 8px;
-  border-left: 4px solid;
-}
-
-.alert-info {
-  background: #d1ecf1;
-  color: #0c5460;
-  border-left-color: #17a2b8;
-}
-
-.alert-warning {
-  background: #fff3cd;
-  color: #856404;
-  border-left-color: #ffc107;
-}
-
-.alert-error {
-  background: #f8d7da;
-  color: #721c24;
-  border-left-color: #dc3545;
-}
-
-.alert-success {
-  background: #d4edda;
-  color: #155724;
-  border-left-color: #28a745;
-}
-
-/* ============================================
-   UTILITIES
-   ============================================ */
-
-.text-muted {
-  color: #6c757d;
-  font-size: 12px;
-}
-
-.mt-20 {
-  margin-top: 20px;
-}
-
-.mb-20 {
-  margin-bottom: 20px;
-}
-
-.empty-state {
-  text-align: center;
-  padding: 40px;
-  color: #6c757d;
-}
-
-.badge {
-  display: inline-block;
-  padding: 3px 8px;
-  border-radius: 12px;
-  font-size: 11px;
-  font-weight: bold;
-}
-
-.badge-info {
-  background: #d1ecf1;
-  color: #0c5460;
-}
-
-.badge-success {
-  background: #d4edda;
-  color: #155724;
-}
-
-.badge-warning {
-  background: #fff3cd;
-  color: #856404;
-}
-
-.badge-danger {
-  background: #f8d7da;
-  color: #721c24;
-}
-
-/* ============================================
-   BUTTON STYLES
-   ============================================ */
-
-.btn-outline-danger {
-  background-color: transparent;
-  border: 1px solid #dc3545;
-  color: #dc3545;
-  padding: 8px 16px;
-  border-radius: 6px;
-  font-size: 14px;
-  font-weight: 500;
-  cursor: pointer;
-  transition: all 0.2s ease;
-  display: inline-flex;
-  align-items: center;
-  justify-content: center;
-  text-decoration: none;
-}
-
-.btn-outline-danger:hover {
-  background-color: #dc3545;
-  color: white;
-  transform: translateY(-1px);
-  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
-}
-
-.btn-outline-danger:focus {
-  outline: none;
-  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.3);
-}
-
 /* ============================================
    RESPONSIVE DESIGN
    ============================================ */
@@ -826,29 +564,6 @@
     width: calc(100% - 8px);
   }
 
-  .lesson-card.compact {
-    padding: 3px 4px;
-    min-height: 35px;
-  }
-
-  .lesson-card.standard {
-    padding: 6px;
-    min-height: 50px;
-  }
-
-  .lesson-card > div {
-    padding: 6px;
-    gap: 3px;
-  }
-
-  .calendar-nav-buttons .btn-text {
-    display: none;
-  }
-
-  .filters-actions .btn-text {
-    display: none;
-  }
-
   .filters-row {
     flex-direction: column;
     align-items: stretch;
@@ -865,10 +580,6 @@
   .filters-actions .btn {
     flex: 1;
   }
-
-  .form-select {
-    width: 100%;
-  }
 }
 
 @media (max-width: 768px) {
@@ -901,21 +612,6 @@
     font-size: 0.8rem;
   }
 
-  .form-select {
-    font-size: 0.8rem;
-    padding: 6px 10px;
-    min-width: 140px;
-  }
-
-  .filters-actions .btn {
-    padding: 8px 12px;
-    font-size: 0.85rem;
-  }
-
-  .filters-actions .btn-text {
-    display: none;
-  }
-
   .week-grid {
     grid-template-columns: 50px repeat(7, 1fr);
   }
@@ -936,21 +632,6 @@
     font-size: 12px;
   }
 
-  .day-name {
-    font-size: 12px;
-    margin-bottom: 2px;
-  }
-
-  .day-date {
-    font-size: 10px;
-  }
-
-  .today-badge {
-    font-size: 8px;
-    padding: 1px 4px;
-    margin-left: 4px;
-  }
-
   .day-grid {
     min-height: 630px;
   }
@@ -959,56 +640,6 @@
     height: 45px;
   }
 
-  .hour-label {
-    font-size: 0.6rem;
-    left: 2px;
-    top: 1px;
-  }
-
-  .lesson-card {
-    left: 2px;
-    right: 2px;
-    width: calc(100% - 4px);
-  }
-
-  .lesson-card.compact {
-    padding: 2px 3px;
-    min-height: 30px;
-  }
-
-  .lesson-card.standard {
-    padding: 4px;
-    min-height: 40px;
-  }
-
-  .lesson-card > div {
-    padding: 4px;
-    gap: 2px;
-    font-size: 10px !important;
-  }
-
-  .modal-content {
-    max-width: 100%;
-    max-height: 100vh;
-    border-radius: 0;
-  }
-
-  .modal-header {
-    padding: 15px;
-  }
-
-  .modal-header h2 {
-    font-size: 18px;
-  }
-
-  .modal-body {
-    padding: 15px;
-  }
-
-  .modal-footer {
-    padding: 15px;
-  }
-
   .stat-compact-item {
     padding: 6px 8px;
     flex: 1;
@@ -1047,49 +678,6 @@
     gap: 4px;
   }
 
-  .calendar-filters {
-    padding: 10px;
-  }
-
-  .filters-row {
-    gap: 8px;
-  }
-
-  .filters-controls {
-    gap: 8px;
-    width: 100%;
-  }
-
-  .filter-group {
-    flex: 1;
-    min-width: 120px;
-  }
-
-  .filter-group label {
-    font-size: 0.75rem;
-  }
-
-  .form-select {
-    font-size: 0.75rem;
-    padding: 6px 8px;
-    min-width: auto;
-    width: 100%;
-  }
-
-  .filters-actions {
-    width: 100%;
-  }
-
-  .filters-actions .btn {
-    flex: 1;
-    padding: 8px 10px;
-    font-size: 0.8rem;
-  }
-
-  .filters-actions .btn-text {
-    display: none;
-  }
-
   .week-grid {
     grid-template-columns: 40px repeat(7, 1fr);
   }
@@ -1110,15 +698,6 @@
     font-size: 10px;
   }
 
-  .day-name {
-    font-size: 10px;
-    margin-bottom: 1px;
-  }
-
-  .day-date {
-    font-size: 8px;
-  }
-
   .day-grid {
     min-height: 560px;
   }
@@ -1126,43 +705,4 @@
   .hour-marker-row {
     height: 40px;
   }
-
-  .hour-label {
-    font-size: 0.55rem;
-  }
-
-  .lesson-card {
-    left: 1px;
-    right: 1px;
-    width: calc(100% - 2px);
-  }
-
-  .lesson-card.compact {
-    padding: 2px 2px;
-    min-height: 25px;
-  }
-
-  .lesson-card.standard {
-    padding: 3px;
-    min-height: 35px;
-  }
-
-  .lesson-card > div {
-    padding: 3px;
-    gap: 1px;
-    font-size: 9px !important;
-  }
-
-  .stat-compact-item {
-    padding: 4px 6px;
-    font-size: 0.8rem;
-  }
-
-  .stat-compact-value {
-    font-size: 0.9rem;
-  }
-
-  .stat-compact-label {
-    font-size: 0.65rem;
-  }
-}
+}
\ No newline at end of file
```

### frontend/src/styles/components/cards.css

```diff
diff --git a/frontend/src/styles/components/cards.css b/frontend/src/styles/components/cards.css
index ea32e38d..fe8ada26 100644
--- a/frontend/src/styles/components/cards.css
+++ b/frontend/src/styles/components/cards.css
@@ -1,31 +1,43 @@
-/* Card component styles */
+/* ============================================
+   CARD COMPONENT STYLES
+   ============================================ */
+
+@import '../common/index.css';
+
+/* ============================================
+   CARD BASE
+   ============================================ */
 
 .card {
-  background: white;
-  border-radius: 8px;
-  border: 1px solid #e9ecef;
+  background: var(--color-white);
+  border-radius: var(--radius-lg);
+  border: 1px solid var(--color-gray-200);
   padding: 20px;
-  transition: box-shadow 0.2s, transform 0.2s;
+  transition: box-shadow var(--transition-base), transform var(--transition-base);
 }
 
 .card:hover {
-  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
+  box-shadow: var(--shadow-lg);
   transform: translateY(-2px);
 }
 
+/* ============================================
+   CARD SECTIONS
+   ============================================ */
+
 .card-header {
   display: flex;
   align-items: center;
   justify-content: space-between;
   margin-bottom: 16px;
   padding-bottom: 12px;
-  border-bottom: 1px solid #e9ecef;
+  border-bottom: 1px solid var(--color-gray-200);
 }
 
 .card-title {
   font-size: 18px;
-  font-weight: 600;
-  color: #212529;
+  font-weight: var(--font-weight-semibold);
+  color: var(--color-gray-900);
   margin: 0;
   display: flex;
   align-items: center;
@@ -41,7 +53,7 @@
   gap: 8px;
   margin-top: 16px;
   padding-top: 12px;
-  border-top: 1px solid #e9ecef;
+  border-top: 1px solid var(--color-gray-200);
 }
 
 .card-actions {
@@ -50,7 +62,10 @@
   align-items: center;
 }
 
-/* Info rows in cards */
+/* ============================================
+   INFO ROWS
+   ============================================ */
+
 .info-row {
   display: flex;
   align-items: flex-start;
@@ -58,31 +73,96 @@
   padding: 8px 0;
 }
 
+.info-row:last-child {
+  border-bottom: none;
+}
+
 .info-row label {
   min-width: 120px;
-  font-weight: 500;
-  color: #6c757d;
+  font-weight: var(--font-weight-medium);
+  color: var(--color-gray-600);
   font-size: 14px;
   display: flex;
   align-items: center;
 }
 
-.info-row span {
+.info-row span,
+.info-row p {
   flex: 1;
-  color: #212529;
+  color: var(--color-gray-900);
   font-size: 14px;
+  margin: 0;
 }
 
-/* Card grid layout */
+/* ============================================
+   CARD LAYOUTS
+   ============================================ */
+
 .cards-grid {
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
   gap: 20px;
 }
 
-/* Card list layout */
 .cards-list {
   display: flex;
   flex-direction: column;
   gap: 16px;
+}
+
+/* ============================================
+   SECTION STYLES
+   ============================================ */
+
+.section {
+  background: var(--color-white);
+  padding: 20px;
+  border-radius: var(--radius-lg);
+  border: 1px solid #e2e8f0;
+  margin-bottom: 20px;
+}
+
+.section h3 {
+  margin: 0 0 16px 0;
+  color: var(--color-gray-800);
+  font-size: 1.25rem;
+  font-weight: var(--font-weight-semibold);
+}
+
+.section-minimal {
+  padding: 15px 20px;
+  background: #f9fafb;
+  border-radius: var(--radius-lg);
+  border: 1px solid #e2e8f0;
+  margin-bottom: 20px;
+}
+
+.section-minimal h3 {
+  margin: 0;
+  font-size: 1.1rem;
+  color: var(--color-gray-800);
+  font-weight: var(--font-weight-semibold);
+}
+
+/* ============================================
+   RESPONSIVE DESIGN
+   ============================================ */
+
+@media (max-width: 768px) {
+  .card {
+    padding: 16px;
+  }
+
+  .info-row {
+    flex-direction: column;
+    gap: 8px;
+  }
+
+  .info-row label {
+    min-width: auto;
+  }
+
+  .cards-grid {
+    grid-template-columns: 1fr;
+  }
 }
\ No newline at end of file
```

### frontend/src/styles/components/horses.css

```diff
diff --git a/frontend/src/styles/components/horses.css b/frontend/src/styles/components/horses.css
deleted file mode 100644
index 9bcefe12..00000000
--- a/frontend/src/styles/components/horses.css
+++ /dev/null
@@ -1,139 +0,0 @@
-/* HorsesList specific styles */
-.card {
-  background: white;
-  padding: 24px;
-  border-radius: 8px;
-  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
-}
-
-.flex-between {
-  display: flex;
-  justify-content: space-between;
-  align-items: center;
-}
-
-.mb-20 {
-  margin-bottom: 20px;
-}
-
-/* Filter Buttons */
-.filter-buttons {
-  display: flex;
-  gap: 10px;
-  flex-wrap: wrap;
-}
-
-/* Table Styles */
-.table-responsive {
-  overflow-x: auto;
-}
-
-.table {
-  width: 100%;
-  border-collapse: collapse;
-  margin-top: 16px;
-}
-
-.table thead {
-  background: #f7fafc;
-}
-
-.table th {
-  padding: 12px;
-  text-align: left;
-  font-weight: 600;
-  color: #4a5568;
-  border-bottom: 2px solid #e2e8f0;
-}
-
-.table td {
-  padding: 12px;
-  border-bottom: 1px solid #e2e8f0;
-  color: #2d3748;
-}
-
-.table tbody tr:hover {
-  background: #f7fafc;
-}
-
-.table .actions {
-  display: flex;
-  gap: 8px;
-  white-space: nowrap;
-}
-
-/* Empty State */
-.empty-state {
-  text-align: center;
-  padding: 60px 20px;
-  color: #718096;
-}
-
-.empty-state-icon {
-  color: #cbd5e0;
-  margin-bottom: 20px;
-}
-
-.empty-state h3 {
-  margin: 0 0 10px 0;
-  color: #2d3748;
-  font-size: 1.5rem;
-}
-
-.empty-state p {
-  margin: 0 0 20px 0;
-  color: #718096;
-}
-
-/* Loading and Error States */
-.loading {
-  display: flex;
-  align-items: center;
-  justify-content: center;
-  padding: 40px;
-  color: #4a5568;
-  font-size: 1rem;
-  gap: 8px;
-}
-
-.error {
-  display: flex;
-  align-items: center;
-  padding: 12px 16px;
-  background: #fed7d7;
-  color: #c53030;
-  border-radius: 6px;
-  margin-bottom: 20px;
-  gap: 8px;
-}
-
-.success {
-  display: flex;
-  align-items: center;
-  padding: 12px 16px;
-  background: #c6f6d5;
-  color: #22543d;
-  border-radius: 6px;
-  margin-bottom: 20px;
-  gap: 8px;
-}
-
-.spin {
-  animation: spin 1s linear infinite;
-}
-
-@keyframes spin {
-  from {
-    transform: rotate(0deg);
-  }
-  to {
-    transform: rotate(360deg);
-  }
-}
-
-/* Clickable badge */
-.badge.clickable:hover {
-  opacity: 0.8;
-  transform: scale(1.05);
-  transition: all 0.2s;
-}
\ No newline at end of file
```

### frontend/src/styles/components/lessons.css

```diff
diff --git a/frontend/src/styles/components/lessons.css b/frontend/src/styles/components/lessons.css
index 210b047d..e9d8ba5c 100644
--- a/frontend/src/styles/components/lessons.css
+++ b/frontend/src/styles/components/lessons.css
@@ -1,5 +1,11 @@
 /* ============================================
-   LESSON CARD CONTENT - STYLES
+   LESSONS COMPONENT STYLES
+   ============================================ */
+
+@import '../common/index.css';
+
+/* ============================================
+   LESSON CARD CONTENT
    ============================================ */
 
 .lesson-card-content {
@@ -50,8 +56,8 @@
 
 .detail-row label {
   min-width: 140px;
-  font-weight: 500;
-  color: #495057;
+  font-weight: var(--font-weight-medium);
+  color: var(--color-gray-700);
   font-size: 14px;
   display: flex;
   align-items: center;
@@ -60,7 +66,7 @@
 .detail-row span,
 .detail-row p {
   flex: 1;
-  color: #212529;
+  color: var(--color-gray-900);
   font-size: 14px;
   margin: 0;
 }
@@ -80,9 +86,9 @@
   align-items: center;
   justify-content: space-between;
   padding: 16px;
-  background-color: #f8f9fa;
-  border-radius: 8px;
-  border: 1px solid #e9ecef;
+  background-color: var(--color-gray-100);
+  border-radius: var(--radius-lg);
+  border: 1px solid var(--color-gray-200);
 }
 
 .participant-info {
@@ -100,7 +106,7 @@
 
 .participant-name strong {
   font-size: 14px;
-  color: #212529;
+  color: var(--color-gray-900);
   display: flex;
   align-items: center;
   overflow: hidden;
@@ -110,7 +116,7 @@
 
 .participant-name small {
   font-size: 12px;
-  color: #6c757d;
+  color: var(--color-gray-600);
   display: flex;
   align-items: center;
   overflow: hidden;
@@ -120,7 +126,7 @@
 
 .participant-horse {
   font-size: 13px;
-  color: #495057;
+  color: var(--color-gray-700);
   display: flex;
   align-items: center;
   overflow: hidden;
@@ -140,17 +146,17 @@
    ============================================ */
 
 .add-participant-form {
-  background-color: #f8f9fa;
+  background-color: var(--color-gray-100);
   padding: 20px;
-  border-radius: 8px;
-  border: 1px solid #e9ecef;
+  border-radius: var(--radius-lg);
+  border: 1px solid var(--color-gray-200);
 }
 
 .add-participant-form h4 {
   margin: 0 0 16px 0;
   font-size: 16px;
-  font-weight: 600;
-  color: #212529;
+  font-weight: var(--font-weight-semibold);
+  color: var(--color-gray-900);
   display: flex;
   align-items: center;
 }
@@ -166,8 +172,8 @@
 }
 
 .advanced-section {
-  background: #f8f9fa;
-  border-radius: 8px;
+  background: var(--color-gray-100);
+  border-radius: var(--radius-lg);
   padding: 16px;
 }
 
@@ -175,8 +181,8 @@
   display: flex;
   align-items: center;
   font-size: 16px;
-  font-weight: 600;
-  color: #1f2937;
+  font-weight: var(--font-weight-semibold);
+  color: var(--color-gray-800);
   margin-bottom: 16px;
   padding-bottom: 8px;
   border-bottom: 2px solid #e5e7eb;
@@ -197,14 +203,14 @@
 .advanced-section .detail-row label {
   display: flex;
   align-items: center;
-  font-weight: 500;
-  color: #6b7280;
+  font-weight: var(--font-weight-medium);
+  color: var(--color-gray-600);
   font-size: 14px;
   min-width: 180px;
 }
 
 .advanced-section .detail-row span {
-  color: #1f2937;
+  color: var(--color-gray-800);
   font-size: 14px;
   text-align: right;
   flex: 1;
@@ -218,35 +224,6 @@
   margin-bottom: 0;
 }
 
-/* ============================================
-   MODAL ACTIONS - COMPACT LAYOUT
-   ============================================ */
-
-.modal-actions-compact {
-  display: flex;
-  flex-wrap: wrap;
-  gap: 6px;
-  justify-content: flex-end;
-  align-items: center;
-}
-
-.modal-actions-compact .btn {
-  padding: 6px 10px;
-  font-size: 13px;
-  line-height: 1.2;
-  min-height: auto;
-  white-space: nowrap;
-}
-
-.modal-actions-compact .btn-sm {
-  padding: 4px 8px;
-  font-size: 12px;
-}
-
-.modal-actions-compact .btn svg {
-  font-size: 14px !important;
-}
-
 /* ============================================
    EDIT FORM - COMPACT ADJUSTMENTS
    ============================================ */
@@ -268,21 +245,10 @@
 }
 
 /* ============================================
-   RESPONSIVE - TABLET (< 768px)
+   RESPONSIVE DESIGN
    ============================================ */
 
 @media (max-width: 768px) {
-  .modal-actions-compact {
-    flex-direction: column;
-    align-items: stretch;
-    gap: 8px;
-  }
-
-  .modal-actions-compact .btn {
-    justify-content: center;
-    width: 100%;
-  }
-
   .advanced-section .detail-row {
     flex-direction: column;
     gap: 8px;
@@ -307,22 +273,7 @@
   }
 }
 
-/* ============================================
-   RESPONSIVE - MOBILE (< 600px)
-   ============================================ */
-
 @media (max-width: 600px) {
-  .modal-actions-compact {
-    flex-direction: column;
-    align-items: stretch;
-    gap: 8px;
-  }
-
-  .modal-actions-compact .btn {
-    justify-content: center;
-    width: 100%;
-  }
-
   .detail-row {
     flex-direction: column;
     gap: 8px;
@@ -339,4 +290,4 @@
   .add-participant-form h4 {
     font-size: 14px;
   }
-}
+}
\ No newline at end of file
```

### frontend/src/styles/components/modals.css

```diff
diff --git a/frontend/src/styles/components/modals.css b/frontend/src/styles/components/modals.css
deleted file mode 100644
index b4741d7b..00000000
--- a/frontend/src/styles/components/modals.css
+++ /dev/null
@@ -1,127 +0,0 @@
-/* Reusable Modal Styles */
-@import '../common/index.css';
-
-/* Modal-specific overrides if needed */
-.modal-overlay {
-  position: fixed;
-  top: 0;
-  left: 0;
-  right: 0;
-  bottom: 0;
-  background-color: rgba(0, 0, 0, 0.5);
-  display: flex;
-  align-items: center;
-  justify-content: center;
-  z-index: 1000;
-  padding: 20px;
-}
-
-.modal-content {
-  background: white;
-  border-radius: 12px;
-  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
-  max-height: 90vh;
-  display: flex;
-  flex-direction: column;
-  overflow: hidden;
-}
-
-.modal-content.small {
-  width: 100%;
-  max-width: 400px;
-}
-
-.modal-content.medium {
-  width: 100%;
-  max-width: 600px;
-}
-
-.modal-content.large {
-  width: 100%;
-  max-width: 900px;
-}
-
-.modal-header {
-  display: flex;
-  align-items: center;
-  justify-content: space-between;
-  padding: 20px 24px;
-  border-bottom: 1px solid #e9ecef;
-}
-
-.modal-header h2 {
-  margin: 0;
-  font-size: 20px;
-  font-weight: 600;
-  color: #212529;
-  display: flex;
-  align-items: center;
-}
-
-.btn-close {
-  background: none;
-  border: none;
-  cursor: pointer;
-  padding: 8px;
-  display: flex;
-  align-items: center;
-  justify-content: center;
-  border-radius: 6px;
-  transition: background-color 0.2s;
-  color: #6c757d;
-}
-
-.btn-close:hover {
-  background-color: #f8f9fa;
-  color: #212529;
-}
-
-.modal-body {
-  padding: 24px;
-  overflow-y: auto;
-  flex: 1;
-}
-
-.modal-footer {
-  padding: 16px 24px;
-  border-top: 1px solid #e9ecef;
-  display: flex;
-  align-items: center;
-  justify-content: flex-end;
-  gap: 12px;
-}
-
-/* Loading state */
-.modal-loading {
-  display: flex;
-  flex-direction: column;
-  align-items: center;
-  justify-content: center;
-  padding: 40px;
-  text-align: center;
-}
-
-.modal-loading p {
-  margin-top: 12px;
-  color: #6c757d;
-}
-
-/* Error state */
-.modal-error {
-  display: flex;
-  flex-direction: column;
-  align-items: center;
-  justify-content: center;
-  padding: 40px;
-  text-align: center;
-}
-
-.modal-error h3 {
-  margin: 16px 0 8px;
-  color: #dc3545;
-}
-
-.modal-error p {
-  color: #6c757d;
-  margin-bottom: 20px;
-}
```

### frontend/src/styles/components/packages.css

```diff
diff --git a/frontend/src/styles/components/packages.css b/frontend/src/styles/components/packages.css
deleted file mode 100644
index bd9331e2..00000000
--- a/frontend/src/styles/components/packages.css
+++ /dev/null
@@ -1,169 +0,0 @@
-/* Model-specific styles */
-
-.empty-state {
-  text-align: center;
-  padding: 40px 20px;
-  color: #666;
-}
-
-.empty-state p {
-  margin-bottom: 20px;
-  font-size: 16px;
-}
-
-.table-container {
-  overflow-x: auto;
-}
-
-.data-table {
-  width: 100%;
-  border-collapse: collapse;
-  margin-top: 20px;
-}
-
-.data-table th,
-.data-table td {
-  padding: 12px;
-  text-align: left;
-  border-bottom: 1px solid #e0e0e0;
-}
-
-.data-table th {
-  background-color: #f5f5f5;
-  font-weight: 600;
-  color: #333;
-}
-
-.data-table tbody tr:hover {
-  background-color: #f9f9f9;
-}
-
-.data-table td button {
-  margin-right: 8px;
-}
-
-.modal-overlay {
-  position: fixed;
-  top: 0;
-  left: 0;
-  right: 0;
-  bottom: 0;
-  background-color: rgba(0, 0, 0, 0.5);
-  display: flex;
-  align-items: center;
-  justify-content: center;
-  z-index: 1000;
-}
-
-.modal-content {
-  background: white;
-  border-radius: 8px;
-  width: 90%;
-  max-width: 600px;
-  max-height: 90vh;
-  overflow-y: auto;
-  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
-}
-
-.modal-header {
-  display: flex;
-  justify-content: space-between;
-  align-items: center;
-  padding: 20px;
-  border-bottom: 1px solid #e0e0e0;
-}
-
-.modal-header h3 {
-  margin: 0;
-  font-size: 20px;
-}
-
-.btn-close {
-  background: none;
-  border: none;
-  font-size: 24px;
-  cursor: pointer;
-  color: #666;
-  padding: 0;
-  width: 30px;
-  height: 30px;
-  display: flex;
-  align-items: center;
-  justify-content: center;
-}
-
-.btn-close:hover {
-  color: #333;
-}
-
-.modal-body {
-  padding: 20px;
-}
-
-.modal-footer {
-  display: flex;
-  justify-content: flex-end;
-  gap: 10px;
-  padding: 20px;
-  border-top: 1px solid #e0e0e0;
-}
-
-.form-group {
-  margin-bottom: 20px;
-}
-
-.form-group label {
-  display: block;
-  margin-bottom: 8px;
-  font-weight: 500;
-  color: #333;
-}
-
-.form-group input[type="text"],
-.form-group input[type="email"],
-.form-group input[type="tel"],
-.form-group input[type="number"],
-.form-group input[type="date"],
-.form-group input[type="datetime-local"],
-.form-group select,
-.form-group textarea {
-  width: 100%;
-  padding: 10px;
-  border: 1px solid #ddd;
-  border-radius: 4px;
-  font-size: 14px;
-  font-family: inherit;
-}
-
-.form-group input[type="checkbox"] {
-  margin-right: 8px;
-}
-
-.form-group textarea {
-  resize: vertical;
-  min-height: 100px;
-}
-
-.alert {
-  padding: 12px 16px;
-  border-radius: 4px;
-  margin-bottom: 16px;
-}
-
-.alert-success {
-  background-color: #d4edda;
-  color: #155724;
-  border: 1px solid #c3e6cb;
-}
-
-.alert-error {
-  background-color: #f8d7da;
-  color: #721c24;
-  border: 1px solid #f5c6cb;
-}
-
-.loading {
-  text-align: center;
-  padding: 40px;
-  color: #666;
-}
```

### frontend/src/styles/components/pairings.css

```diff
diff --git a/frontend/src/styles/components/pairings.css b/frontend/src/styles/components/pairings.css
deleted file mode 100644
index 952ae290..00000000
--- a/frontend/src/styles/components/pairings.css
+++ /dev/null
@@ -1,132 +0,0 @@
-/* PairingsList specific styles */
-.card {
-  background: white;
-  padding: 24px;
-  border-radius: 8px;
-  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
-}
-
-.flex-between {
-  display: flex;
-  justify-content: space-between;
-  align-items: center;
-}
-
-.mb-20 {
-  margin-bottom: 20px;
-}
-
-/* Filter Buttons */
-.filter-buttons {
-  display: flex;
-  gap: 10px;
-  flex-wrap: wrap;
-}
-
-/* Table Styles */
-.table-responsive {
-  overflow-x: auto;
-}
-
-.table {
-  width: 100%;
-  border-collapse: collapse;
-  margin-top: 16px;
-}
-
-.table thead {
-  background: #f7fafc;
-}
-
-.table th {
-  padding: 12px;
-  text-align: left;
-  font-weight: 600;
-  color: #4a5568;
-  border-bottom: 2px solid #e2e8f0;
-}
-
-.table td {
-  padding: 12px;
-  border-bottom: 1px solid #e2e8f0;
-  color: #2d3748;
-}
-
-.table tbody tr:hover {
-  background: #f7fafc;
-}
-
-.table .actions {
-  display: flex;
-  gap: 8px;
-  white-space: nowrap;
-}
-
-/* Empty State */
-.empty-state {
-  text-align: center;
-  padding: 60px 20px;
-  color: #718096;
-}
-
-.empty-state-icon {
-  color: #cbd5e0;
-  margin-bottom: 20px;
-}
-
-.empty-state h3 {
-  margin: 0 0 10px 0;
-  color: #2d3748;
-  font-size: 1.5rem;
-}
-
-.empty-state p {
-  margin: 0 0 20px 0;
-  color: #718096;
-}
-
-/* Loading and Error States */
-.loading {
-  display: flex;
-  align-items: center;
-  justify-content: center;
-  padding: 40px;
-  color: #4a5568;
-  font-size: 1rem;
-  gap: 8px;
-}
-
-.error {
-  display: flex;
-  align-items: center;
-  padding: 12px 16px;
-  background: #fed7d7;
-  color: #c53030;
-  border-radius: 6px;
-  margin-bottom: 20px;
-  gap: 8px;
-}
-
-.success {
-  display: flex;
-  align-items: center;
-  padding: 12px 16px;
-  background: #c6f6d5;
-  color: #22543d;
-  border-radius: 6px;
-  margin-bottom: 20px;
-  gap: 8px;
-}
-
-.spin {
-  animation: spin 1s linear infinite;
-}
-
-@keyframes spin {
-  from {
-    transform: rotate(0deg);
-  }
-  to {
-    transform: rotate(360deg);
-  }
-}
\ No newline at end of file
```

### frontend/src/styles/components/riders.css

```diff
diff --git a/frontend/src/styles/components/riders.css b/frontend/src/styles/components/riders.css
index 53a1f1e3..1d5b81b2 100644
--- a/frontend/src/styles/components/riders.css
+++ b/frontend/src/styles/components/riders.css
@@ -1,8 +1,13 @@
 /* ============================================
-   RIDER CARD & PACKAGES - UNIFIED STYLES
+   RIDERS COMPONENT STYLES
+   ============================================ */
+
+@import '../common/index.css';
+
+/* ============================================
+   RIDER CARD MODAL
    ============================================ */
 
-/* Override section styles for rider card */
 .rider-card-modal {
   max-width: 1400px;
   width: 95%;
@@ -39,19 +44,19 @@
 .rider-info-section {
   background: #f7fafc;
   padding: 20px;
-  border-radius: 8px;
+  border-radius: var(--radius-lg);
   border: 1px solid #e2e8f0;
   margin-bottom: 20px;
 }
 
 .rider-info-section h3 {
   margin: 0 0 15px 0;
-  color: #2d3748;
+  color: var(--color-gray-800);
   font-size: 1.1rem;
   display: flex;
   align-items: center;
   gap: 8px;
-  font-weight: 600;
+  font-weight: var(--font-weight-semibold);
 }
 
 .info-grid {
@@ -67,8 +72,8 @@
 }
 
 .info-label {
-  font-weight: 600;
-  color: #4a5568;
+  font-weight: var(--font-weight-semibold);
+  color: var(--color-gray-600);
   font-size: 0.9rem;
   display: flex;
   align-items: center;
@@ -76,9 +81,9 @@
 }
 
 .info-value {
-  color: #2d3748;
+  color: var(--color-gray-800);
   font-size: 0.95rem;
-  font-weight: 500;
+  font-weight: var(--font-weight-medium);
 }
 
 /* ============================================
@@ -123,9 +128,9 @@
 .owned-horse-item {
   padding: 12px;
   background: #f7fafc;
-  border-radius: 6px;
+  border-radius: var(--radius-md);
   border: 1px solid #e2e8f0;
-  transition: all 0.2s ease;
+  transition: all var(--transition-base);
 }
 
 .owned-horse-item:hover {
@@ -140,15 +145,15 @@
 }
 
 .horse-name-type strong {
-  color: #2d3748;
-  font-weight: 600;
+  color: var(--color-gray-800);
+  font-weight: var(--font-weight-semibold);
 }
 
 .horse-name-type .badge {
   padding: 4px 8px;
   font-size: 0.75rem;
   border-radius: 4px;
-  font-weight: 500;
+  font-weight: var(--font-weight-medium);
 }
 
 /* ============================================
@@ -159,7 +164,7 @@
   display: flex;
   flex-direction: column;
   border: 1px solid #e2e8f0;
-  border-radius: 8px;
+  border-radius: var(--radius-lg);
   overflow: hidden;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
 }
@@ -172,8 +177,8 @@
   background: #f7fafc;
   border-bottom: 2px solid #e2e8f0;
   padding: 0;
-  font-weight: 600;
-  color: #4a5568;
+  font-weight: var(--font-weight-semibold);
+  color: var(--color-gray-600);
   font-size: 0.85rem;
   text-transform: uppercase;
   letter-spacing: 0.5px;
@@ -206,8 +211,8 @@
   grid-template-columns: 140px 180px 180px 140px 140px;
   gap: 0;
   border-bottom: 1px solid #e2e8f0;
-  transition: all 0.2s ease;
-  background: white;
+  transition: all var(--transition-base);
+  background: var(--color-white);
 }
 
 .package-row:hover {
@@ -244,7 +249,7 @@
   padding: 4px 12px;
   border-radius: 12px;
   font-size: 0.75rem;
-  font-weight: 600;
+  font-weight: var(--font-weight-semibold);
   text-transform: uppercase;
   letter-spacing: 0.5px;
   white-space: nowrap;
@@ -289,7 +294,7 @@
   min-width: 40px;
   text-align: center;
   box-shadow: 0 2px 4px rgba(66, 153, 225, 0.2);
-  transition: transform 0.2s ease;
+  transition: transform var(--transition-base);
 }
 
 .lesson-badge:hover {
@@ -304,8 +309,8 @@
 
 .date-value {
   font-size: 0.85rem;
-  color: #2d3748;
-  font-weight: 500;
+  color: var(--color-gray-800);
+  font-weight: var(--font-weight-medium);
   white-space: nowrap;
 }
 
@@ -336,9 +341,9 @@
   align-items: center;
   padding: 12px;
   background: #f7fafc;
-  border-radius: 6px;
+  border-radius: var(--radius-md);
   border: 1px solid #e2e8f0;
-  transition: all 0.2s ease;
+  transition: all var(--transition-base);
 }
 
 .pairing-item:hover {
@@ -353,8 +358,8 @@
 }
 
 .pairing-horse-name {
-  font-weight: 600;
-  color: #2d3748;
+  font-weight: var(--font-weight-semibold);
+  color: var(--color-gray-800);
   font-size: 0.95rem;
 }
 
@@ -385,10 +390,6 @@
     grid-template-columns: repeat(2, 1fr);
   }
 
-  .stats-grid {
-    grid-template-columns: repeat(3, 1fr);
-  }
-
   .packages-table-header,
   .package-row {
     grid-template-columns: 100px 140px 140px 120px 120px;
@@ -482,14 +483,14 @@
     flex-direction: column;
     grid-template-columns: none;
     border: 1px solid #e2e8f0;
-    border-radius: 8px;
+    border-radius: var(--radius-lg);
     padding: 12px;
     gap: 8px;
-    background: white;
+    background: var(--color-white);
   }
 
   .package-row:hover {
-    background: white;
+    background: var(--color-white);
     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
   }
 
@@ -566,4 +567,4 @@
     font-size: 0.65rem;
     padding: 2px 8px;
   }
-}
+}
\ No newline at end of file
```

### frontend/src/styles/components/tables.css

```diff
diff --git a/frontend/src/styles/components/tables.css b/frontend/src/styles/components/tables.css
deleted file mode 100644
index c334d03b..00000000
--- a/frontend/src/styles/components/tables.css
+++ /dev/null
@@ -1,59 +0,0 @@
-/* Table component styles */
-
-.table-container {
-  overflow-x: auto;
-  border-radius: 8px;
-  border: 1px solid #e9ecef;
-}
-
-.table {
-  width: 100%;
-  border-collapse: collapse;
-  background: white;
-}
-
-.table thead {
-  background-color: #f8f9fa;
-  border-bottom: 2px solid #e9ecef;
-}
-
-.table th {
-  padding: 12px 16px;
-  text-align: left;
-  font-weight: 600;
-  font-size: 14px;
-  color: #495057;
-}
-
-.table td {
-  padding: 12px 16px;
-  font-size: 14px;
-  color: #212529;
-  border-bottom: 1px solid #e9ecef;
-}
-
-.table tbody tr:last-child td {
-  border-bottom: none;
-}
-
-.table tbody tr:hover {
-  background-color: #f8f9fa;
-}
-
-.table-actions {
-  display: flex;
-  gap: 8px;
-  align-items: center;
-}
-
-/* Responsive table */
-@media (max-width: 768px) {
-  .table {
-    font-size: 13px;
-  }
-
-  .table th,
-  .table td {
-    padding: 8px 12px;
-  }
-}
\ No newline at end of file
```

### frontend/src/styles/components/templates.css

```diff
diff --git a/frontend/src/styles/components/templates.css b/frontend/src/styles/components/templates.css
index 435bba38..134fd3f0 100644
--- a/frontend/src/styles/components/templates.css
+++ b/frontend/src/styles/components/templates.css
@@ -1,16 +1,25 @@
-/* Template Management Component Styles */
+/* ============================================
+   TEMPLATES COMPONENT STYLES
+   ============================================ */
+
+@import '../common/index.css';
+
+/* ============================================
+   TEMPLATE MANAGEMENT
+   ============================================ */
+
 .template-management {
   padding: 20px;
-  background: #f5f5f5;
+  background: var(--color-gray-100);
   min-height: 100vh;
 }
 
 .template-header {
-  background: white;
+  background: var(--color-white);
   padding: 20px;
-  border-radius: 8px;
+  border-radius: var(--radius-lg);
   margin-bottom: 20px;
-  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
+  box-shadow: var(--shadow-sm);
   display: flex;
   justify-content: space-between;
   align-items: center;
@@ -18,16 +27,16 @@
 
 .template-header h1 {
   margin: 0;
-  color: #333;
+  color: var(--color-gray-800);
   font-size: 24px;
 }
 
 .template-filters {
-  background: white;
+  background: var(--color-white);
   padding: 20px;
-  border-radius: 8px;
+  border-radius: var(--radius-lg);
   margin-bottom: 20px;
-  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
+  box-shadow: var(--shadow-sm);
   display: flex;
   gap: 20px;
   flex-wrap: wrap;
@@ -41,23 +50,13 @@
 
 .filter-group label {
   font-size: 12px;
-  font-weight: bold;
-  color: #666;
-}
-
-.filter-group select {
-  padding: 8px 12px;
-  border: 1px solid #ced4da;
-  border-radius: 4px;
-  font-size: 14px;
-  background: white;
+  font-weight: var(--font-weight-bold);
+  color: var(--color-gray-600);
 }
 
-.filter-group select:focus {
-  outline: none;
-  border-color: #007bff;
-  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
-}
+/* ============================================
+   TEMPLATE LIST
+   ============================================ */
 
 .template-list {
   display: flex;
@@ -66,18 +65,18 @@
 }
 
 .template-card {
-  background: white;
+  background: var(--color-white);
   border: 1px solid #e2e8f0;
-  border-radius: 8px;
+  border-radius: var(--radius-lg);
   padding: 20px;
-  transition: all 0.2s ease;
-  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
+  transition: all var(--transition-base);
+  box-shadow: var(--shadow-sm);
   overflow: hidden;
 }
 
 .template-card:hover {
   transform: translateY(-2px);
-  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
+  box-shadow: var(--shadow-md);
 }
 
 .template-card.inactive {
@@ -94,62 +93,9 @@
 
 .template-info h3 {
   margin: 0 0 8px 0;
-  color: #333;
+  color: var(--color-gray-800);
   font-size: 18px;
-  font-weight: 600;
-}
-
-.lesson-type-badge {
-  display: inline-block;
-  padding: 4px 12px;
-  border-radius: 4px;
-  font-size: 12px;
-  font-weight: bold;
-  text-transform: uppercase;
-  margin-right: 8px;
-}
-
-.lesson-type-badge.private {
-  background: #e7f3ff;
-  color: #007bff;
-}
-
-.lesson-type-badge.group {
-  background: #e8f5e9;
-  color: #28a745;
-}
-
-.lesson-type-badge.training {
-  background: #fff8e1;
-  color: #ffc107;
-}
-
-.lesson-type-badge.competition {
-  background: #ffebee;
-  color: #dc3545;
-}
-
-.lesson-type-badge.event {
-  background: #f3e5f5;
-  color: #6f42c1;
-}
-
-.lesson-type-badge.blocked {
-  background: #f8f9fa;
-  color: #6c757d;
-}
-
-.status-badge {
-  display: inline-block;
-  padding: 2px 8px;
-  border-radius: 12px;
-  font-size: 10px;
-  font-weight: bold;
-}
-
-.status-badge.inactive {
-  background-color: #fff3cd;
-  color: #856404;
+  font-weight: var(--font-weight-semibold);
 }
 
 .template-actions {
@@ -158,7 +104,7 @@
 }
 
 .template-description {
-  color: #666;
+  color: var(--color-gray-600);
   margin: 0 0 15px 0;
   line-height: 1.5;
   font-size: 14px;
@@ -177,228 +123,22 @@
 }
 
 .detail-item label {
-  font-weight: 500;
-  color: #718096;
+  font-weight: var(--font-weight-medium);
+  color: var(--color-gray-600);
   font-size: 12px;
   text-transform: uppercase;
 }
 
 .detail-item span {
-  color: #2d3748;
-  font-weight: 600;
+  color: var(--color-gray-800);
+  font-weight: var(--font-weight-semibold);
   font-size: 14px;
 }
 
-.empty-state {
-  text-align: center;
-  padding: 40px;
-  background: white;
-  border-radius: 8px;
-  border: 2px dashed #cbd5e0;
-  color: #718096;
-}
-
-.empty-state p {
-  margin-bottom: 20px;
-  font-size: 16px;
-}
-
-.loading,
-.error {
-  display: flex;
-  flex-direction: column;
-  align-items: center;
-  justify-content: center;
-  min-height: 400px;
-  background: white;
-  border-radius: 8px;
-  padding: 40px;
-  margin: 20px;
-}
-
-.error p {
-  color: #dc3545;
-  margin-bottom: 20px;
-  font-size: 16px;
-}
-
-/* Buttons */
-.btn {
-  padding: 0.5rem 1rem;
-  border: none;
-  border-radius: 4px;
-  cursor: pointer;
-  font-size: 0.9rem;
-  text-decoration: none;
-  display: inline-flex;
-  align-items: center;
-  gap: 0.5rem;
-  transition: all 0.3s ease;
-}
-
-.btn:hover {
-  transform: translateY(-1px);
-}
-
-.btn-primary {
-  background-color: #4caf50;
-  color: white;
-}
-
-.btn-primary:hover {
-  background-color: #45a049;
-}
-
-.btn-secondary {
-  background-color: #f5f5f5;
-  color: #333;
-  border: 1px solid #ddd;
-}
-
-.btn-secondary:hover {
-  background-color: #e0e0e0;
-}
-
-.btn-danger {
-  background-color: #f44336;
-  color: white;
-}
-
-.btn-danger:hover {
-  background-color: #d32f2f;
-}
-
-.btn-sm {
-  padding: 0.25rem 0.5rem;
-  font-size: 0.8rem;
-}
-
-/* Modal Styles */
-.modal-overlay {
-  position: fixed;
-  top: 0;
-  left: 0;
-  right: 0;
-  bottom: 0;
-  background-color: rgba(0, 0, 0, 0.5);
-  display: flex;
-  justify-content: center;
-  align-items: center;
-  z-index: 1000;
-}
-
-.modal {
-  background: white;
-  border-radius: 8px;
-  min-width: 400px;
-  max-width: 600px;
-  max-height: 90vh;
-  overflow-y: auto;
-  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
-}
-
-.modal-header {
-  display: flex;
-  justify-content: space-between;
-  align-items: center;
-  padding: 1.5rem;
-  border-bottom: 1px solid #e0e0e0;
-}
-
-.modal-header h3 {
-  margin: 0;
-  color: #333;
-}
-
-.close-btn {
-  background: none;
-  border: none;
-  font-size: 1.5rem;
-  cursor: pointer;
-  color: #666;
-}
-
-.close-btn:hover {
-  color: #333;
-}
-
-.modal-body {
-  padding: 1.5rem;
-}
-
-.modal-footer {
-  display: flex;
-  justify-content: flex-end;
-  gap: 1rem;
-  padding: 1.5rem;
-  border-top: 1px solid #e0e0e0;
-}
-
-.warning {
-  color: #f44336;
-  font-style: italic;
-  margin-top: 0.5rem;
-}
-
-/* Icon placeholders - replace with actual icon library */
-.icon-plus:before {
-  content: '➕';
-}
-.icon-edit:before {
-  content: '✏️';
-}
-.icon-trash:before {
-  content: '🗑️';
-}
-.icon-pause:before {
-  content: '⏸️';
-}
-.icon-play:before {
-  content: '▶️';
-}
-.icon-close:before {
-  content: '✖️';
-}
-
-/* Responsive Design */
-@media (max-width: 768px) {
-  .template-management {
-    padding: 1rem;
-  }
-
-  .template-header {
-    flex-direction: column;
-    gap: 1rem;
-    align-items: stretch;
-  }
-
-  .template-filters {
-    flex-direction: column;
-  }
-
-  .template-card {
-    padding: 1rem;
-  }
-
-  .template-header {
-    flex-direction: column;
-    gap: 1rem;
-  }
-
-  .template-actions {
-    justify-content: flex-start;
-  }
-
-  .template-details {
-    grid-template-columns: 1fr;
-  }
-}
-
 /* ============================================
    TEMPLATE MODAL STYLES
    ============================================ */
 
-/* TemplateModal specific styles */
 .template-modal {
   max-width: 700px;
   width: 90%;
@@ -422,9 +162,9 @@
 
 .form-section h3 {
   margin: 0 0 20px 0;
-  color: #2d3748;
+  color: var(--color-gray-800);
   font-size: 1.1rem;
-  font-weight: 600;
+  font-weight: var(--font-weight-semibold);
 }
 
 .form-row {
@@ -434,7 +174,10 @@
   margin-bottom: 15px;
 }
 
-/* Day Selector */
+/* ============================================
+   DAY SELECTOR
+   ============================================ */
+
 .day-selector {
   display: flex;
   gap: 8px;
@@ -444,12 +187,12 @@
 .day-button {
   padding: 8px 16px;
   border: 2px solid #e2e8f0;
-  background: white;
-  border-radius: 6px;
+  background: var(--color-white);
+  border-radius: var(--radius-md);
   cursor: pointer;
-  font-weight: 500;
-  color: #4a5568;
-  transition: all 0.2s;
+  font-weight: var(--font-weight-medium);
+  color: var(--color-gray-600);
+  transition: all var(--transition-base);
 }
 
 .day-button:hover {
@@ -458,32 +201,20 @@
 }
 
 .day-button.active {
-  border-color: #4299e1;
-  background: #4299e1;
-  color: white;
+  border-color: var(--color-primary);
+  background: var(--color-primary);
+  color: var(--color-white);
 }
 
 .day-button.active:hover {
-  border-color: #3182ce;
-  background: #3182ce;
+  border-color: var(--color-primary-dark);
+  background: var(--color-primary-dark);
 }
 
-/* Text helpers */
-.text-muted {
-  display: block;
-  margin-top: 4px;
-  font-size: 0.875rem;
-  color: #718096;
-}
-
-.text-danger {
-  display: block;
-  margin-top: 4px;
-  font-size: 0.875rem;
-  color: #e53e3e;
-}
+/* ============================================
+   TEMPLATE MODAL OVERRIDES
+   ============================================ */
 
-/* Modal specific overrides */
 .template-modal .modal-header {
   padding: 20px;
   border-bottom: 1px solid #e2e8f0;
@@ -492,14 +223,14 @@
 .template-modal .modal-header h2 {
   margin: 0;
   font-size: 1.5rem;
-  color: #2d3748;
+  color: var(--color-gray-800);
 }
 
 .template-modal .btn-close {
   background: none;
   border: none;
   font-size: 2rem;
-  color: #718096;
+  color: var(--color-gray-600);
   cursor: pointer;
   padding: 0;
   width: 32px;
@@ -507,13 +238,13 @@
   display: flex;
   align-items: center;
   justify-content: center;
-  border-radius: 4px;
-  transition: all 0.2s;
+  border-radius: var(--radius-md);
+  transition: all var(--transition-base);
 }
 
 .template-modal .btn-close:hover {
   background: #f7fafc;
-  color: #2d3748;
+  color: var(--color-gray-800);
 }
 
 .template-modal .modal-footer {
@@ -522,4 +253,36 @@
   display: flex;
   justify-content: flex-end;
   gap: 10px;
+}
+
+/* ============================================
+   RESPONSIVE DESIGN
+   ============================================ */
+
+@media (max-width: 768px) {
+  .template-management {
+    padding: 1rem;
+  }
+
+  .template-header {
+    flex-direction: column;
+    gap: 1rem;
+    align-items: stretch;
+  }
+
+  .template-filters {
+    flex-direction: column;
+  }
+
+  .template-card {
+    padding: 1rem;
+  }
+
+  .template-actions {
+    justify-content: flex-start;
+  }
+
+  .template-details {
+    grid-template-columns: 1fr;
+  }
 }
\ No newline at end of file
```

### frontend/vite.config.dev.js

```diff
diff --git a/frontend/vite.config.dev.js b/frontend/vite.config.dev.js
index 07830652..bfcc5329 100644
--- a/frontend/vite.config.dev.js
+++ b/frontend/vite.config.dev.js
@@ -1,4 +1,4 @@
-import { defineConfig } from 'vite';
+import { defineConfig } from './vite.config';
 import react from '@vitejs/plugin-react';
 
 // Development-specific Vite configuration
```

### frontend/vite.config.js

```diff
diff --git a/frontend/vite.config.js b/frontend/vite.config.js
index da4e2033..d96103a1 100644
--- a/frontend/vite.config.js
+++ b/frontend/vite.config.js
@@ -1,4 +1,4 @@
-import { defineConfig } from 'vite';
+import { defineConfig } from './vite.config.dev';
 import react from '@vitejs/plugin-react';
 
 export default defineConfig({
```

### frontend/vite.config.prod.js

```diff
diff --git a/frontend/vite.config.prod.js b/frontend/vite.config.prod.js
index c12c4cb2..dddb34c3 100644
--- a/frontend/vite.config.prod.js
+++ b/frontend/vite.config.prod.js
@@ -1,4 +1,4 @@
-import { defineConfig } from 'vite';
+import { defineConfig } from './vite.config.dev';
 import react from '@vitejs/plugin-react';
 
 // Production-specific Vite configuration
```


## Untracked Files

### frontend/src/components/calendar/CalendarView/CalendarError.jsx

```
import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons.jsx';

/**
 * Calendar Error State Component
 */
function CalendarError({ error, onRetry }) {
  return (
    <div className="calendar-error" role="alert">
      <Icons.Warning style={{ fontSize: '48px', marginBottom: '16px', color: '#e53e3e' }} />
      <h3>Erreur de chargement</h3>
      <p>{error}</p>
      <button className="btn btn-primary" onClick={onRetry} aria-label="Réessayer le chargement">
        <Icons.Refresh /> Réessayer
      </button>
    </div>
  );
}

CalendarError.propTypes = {
  error: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};

export default CalendarError;
```

### frontend/src/components/calendar/CalendarView/CalendarLoading.jsx

```
import React from 'react';
import { Icons } from '../../../lib/icons.jsx';

/**
 * Calendar Loading State Component
 */
function CalendarLoading() {
  return (
    <div className="calendar-loading" role="status" aria-live="polite">
      <Icons.Loading className="spin" style={{ fontSize: '48px', marginBottom: '16px' }} />
      <h3>Chargement du calendrier...</h3>
      <p>Veuillez patienter pendant que nous chargeons vos cours</p>
    </div>
  );
}

export default CalendarLoading;
```

### frontend/src/components/calendar/CalendarView/CalendarModals.jsx

```
import React from 'react';
import PropTypes from 'prop-types';
import LessonModal from '../../lessons/LessonModal';
import SingleLessonModal from '../../lessons/SingleLessonModal';
import BlockedTimeModal from '../../lessons/BlockedTimeModal.jsx';

/**
 * Calendar Modals Component
 * Handles all modal rendering for calendar operations
 */
function CalendarModals({
  showLessonModal,
  showSingleLessonModal,
  showBlockedTimeModal,
  selectedLesson,
  onCloseLessonModal,
  onCloseSingleLessonModal,
  onCloseBlockedTimeModal,
  onModalSuccess,
}) {
  return (
    <>
      {/* LessonModal for viewing/editing existing lessons */}
      {showLessonModal && selectedLesson && selectedLesson.id && (
        <LessonModal
          lesson={selectedLesson}
          onClose={onCloseLessonModal}
          onUpdate={onModalSuccess}
        />
      )}

      {/* SingleLessonModal for creating new lessons */}
      {showSingleLessonModal && (
        <SingleLessonModal
          lesson={null}
          onClose={onCloseSingleLessonModal}
          onSuccess={onModalSuccess}
          initialDate={selectedLesson?.date}
          initialStartTime={selectedLesson?.start_time}
          initialEndTime={selectedLesson?.end_time}
        />
      )}

      {/* BlockedTimeModal for creating blocked time */}
      {showBlockedTimeModal && (
        <BlockedTimeModal
          blockedTime={null}
          onClose={onCloseBlockedTimeModal}
          onSuccess={onModalSuccess}
        />
      )}
    </>
  );
}

CalendarModals.propTypes = {
  showLessonModal: PropTypes.bool.isRequired,
  showSingleLessonModal: PropTypes.bool.isRequired,
  showBlockedTimeModal: PropTypes.bool.isRequired,
  selectedLesson: PropTypes.object,
  onCloseLessonModal: PropTypes.func.isRequired,
  onCloseSingleLessonModal: PropTypes.func.isRequired,
  onCloseBlockedTimeModal: PropTypes.func.isRequired,
  onModalSuccess: PropTypes.func.isRequired,
};

export default CalendarModals;
```

### frontend/src/lib/config/api/endpoints.js

```
/**
 * API Endpoints Configuration
 */

// Authentication endpoints
export const AUTH = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
};

// Lessons endpoints
export const LESSONS = {
  LIST: '/lessons',
  CREATE: '/lessons',
  UPDATE: '/lessons/:id',
  DELETE: '/lessons/:id',
  GET: '/lessons/:id',
};

// Horses endpoints
export const HORSES = {
  LIST: '/horses',
  CREATE: '/horses',
  UPDATE: '/horses/:id',
  DELETE: '/horses/:id',
  GET: '/horses/:id',
  RIDERS: '/horses/:id/riders',
};

// Riders endpoints
export const RIDERS = {
  LIST: '/riders',
  CREATE: '/riders',
  UPDATE: '/riders/:id',
  DELETE: '/riders/:id',
  GET: '/riders/:id',
  HORSES: '/riders/:id/horses',
  PACKAGES: '/riders/:id/packages',
};

// Packages endpoints
export const PACKAGES = {
  LIST: '/packages',
  CREATE: '/packages',
  UPDATE: '/packages/:id',
  DELETE: '/packages/:id',
  GET: '/packages/:id',
};

// Pairings endpoints
export const PAIRINGS = {
  LIST: '/pairings',
  CREATE: '/pairings',
  UPDATE: '/pairings/:id',
  DELETE: '/pairings/:id',
  GET: '/pairings/:id',
};

// Templates endpoints
export const TEMPLATES = {
  LIST: '/templates',
  CREATE: '/templates',
  UPDATE: '/templates/:id',
  DELETE: '/templates/:id',
  GET: '/templates/:id',
};

// All endpoints combined
export const API_ENDPOINTS = {
  AUTH,
  LESSONS,
  HORSES,
  RIDERS,
  PACKAGES,
  PAIRINGS,
  TEMPLATES,
};

/**
 * Build endpoint URL with parameters
 * @param {string} endpoint - Endpoint template
 * @param {Object} params - Parameters to replace
 * @returns {string} Formatted endpoint URL
 */
export const buildEndpoint = (endpoint, params = {}) => {
  let url = endpoint;
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key]);
  });
  return url;
};```

### frontend/src/lib/config/api/errors.js

```
/**
 * API Error Messages and Status Codes
 */

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Erreur de connexion. Veuillez vérifier votre internet.',
  TIMEOUT: 'La demande a expiré. Veuillez réessayer.',
  UNAUTHORIZED: 'Vous devez vous connecter pour accéder à cette ressource.',
  FORBIDDEN: 'Vous n\'avez pas les permissions pour accéder à cette ressource.',
  NOT_FOUND: 'La ressource demandée n\'existe pas.',
  SERVER_ERROR: 'Une erreur serveur est survenue. Veuillez réessayer plus tard.',
  UNKNOWN: 'Une erreur inconnue est survenue.',
};

/**
 * Get error message for HTTP status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} Error message
 */
export const getErrorMessage = (statusCode) => {
  const messageMap = {
    [HTTP_STATUS.BAD_REQUEST]: ERROR_MESSAGES.UNKNOWN,
    [HTTP_STATUS.UNAUTHORIZED]: ERROR_MESSAGES.UNAUTHORIZED,
    [HTTP_STATUS.FORBIDDEN]: ERROR_MESSAGES.FORBIDDEN,
    [HTTP_STATUS.NOT_FOUND]: ERROR_MESSAGES.NOT_FOUND,
    [HTTP_STATUS.CONFLICT]: ERROR_MESSAGES.UNKNOWN,
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: ERROR_MESSAGES.SERVER_ERROR,
  };
  return messageMap[statusCode] || ERROR_MESSAGES.UNKNOWN;
};```

### frontend/src/lib/config/api/index.js

```
/**
 * API Configuration - Main Export
 */

export * from './endpoints';
export * from './errors';
export * from './settings';

// Re-export original API_ENDPOINTS for backward compatibility
export { API_ENDPOINTS } from './endpoints';
export { HTTP_STATUS, ERROR_MESSAGES, getErrorMessage } from './errors';
export { API_SETTINGS, getApiSetting } from './settings';```

### frontend/src/lib/config/api/settings.js

```
/**
 * API Settings Configuration
 */

// API settings
export const API_SETTINGS = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  CACHE_DURATION: 300000, // 5 minutes
};

/**
 * Get API setting value
 * @param {string} key - Setting key
 * @param {*} defaultValue - Default value if key not found
 * @returns {*} Setting value
 */
export const getApiSetting = (key, defaultValue = null) => {
  return API_SETTINGS[key] ?? defaultValue;
};```

### frontend/src/lib/config/forms/fields.js

```
/**
 * Form Field Types and Configuration
 */

// Form field types
export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PHONE: 'phone',
  NUMBER: 'number',
  DATE: 'date',
  TIME: 'time',
  SELECT: 'select',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
};

/**
 * Check if field type is valid
 * @param {string} type - Field type
 * @returns {boolean} True if valid
 */
export const isValidFieldType = (type) => {
  return Object.values(FIELD_TYPES).includes(type);
};

/**
 * Get field type display label
 * @param {string} type - Field type
 * @returns {string} Display label
 */
export const getFieldTypeLabel = (type) => {
  const labels = {
    [FIELD_TYPES.TEXT]: 'Texte',
    [FIELD_TYPES.EMAIL]: 'Email',
    [FIELD_TYPES.PHONE]: 'Téléphone',
    [FIELD_TYPES.NUMBER]: 'Nombre',
    [FIELD_TYPES.DATE]: 'Date',
    [FIELD_TYPES.TIME]: 'Heure',
    [FIELD_TYPES.SELECT]: 'Liste déroulante',
    [FIELD_TYPES.TEXTAREA]: 'Zone de texte',
    [FIELD_TYPES.CHECKBOX]: 'Case à cocher',
    [FIELD_TYPES.RADIO]: 'Bouton radio',
  };
  return labels[type] || type;
};```

### frontend/src/lib/config/forms/index.js

```
/**
 * Forms Configuration - Main Export
 */

export * from './fields';
export * from './validation';
export * from './settings';
export * from './schemas';

// Re-export for backward compatibility
export { FIELD_TYPES, isValidFieldType, getFieldTypeLabel } from './fields';
export { 
  VALIDATION_MESSAGES, 
  getValidationMessage, 
  formatLengthMessage 
} from './validation';
export { FORM_SETTINGS, getFormSetting } from './settings';
export { 
  HORSE_FORM_FIELDS, 
  getHorseFormField, 
  getHorseRequiredFields,
  RIDER_FORM_FIELDS,
  getRiderFormField,
  getRiderRequiredFields,
} from './schemas';```

### frontend/src/lib/config/forms/schemas/horse.js

```
/**
 * Horse Form Schema
 */

import { FIELD_TYPES } from '../fields.js';

export const HORSE_FORM_FIELDS = {
  name: {
    type: FIELD_TYPES.TEXT,
    label: 'Nom du cheval',
    required: true,
    maxLength: 100,
  },
  kind: {
    type: FIELD_TYPES.SELECT,
    label: 'Type de cheval',
    required: true,
    options: ['horse', 'pony'],
  },
  activity_start_date: {
    type: FIELD_TYPES.DATE,
    label: 'Date de début d\'activité',
    required: true,
  },
  activity_end_date: {
    type: FIELD_TYPES.DATE,
    label: 'Date de fin d\'activité',
    required: false,
  },
  is_owned_by: {
    type: FIELD_TYPES.SELECT,
    label: 'Propriétaire',
    required: true,
    options: ['Laury', 'Propriétaire', 'Club'],
  },
  owner_id: {
    type: FIELD_TYPES.SELECT,
    label: 'Cavalier propriétaire',
    required: false,
    dependsOn: 'is_owned_by',
    showWhen: 'Propriétaire',
  },
};

/**
 * Get horse form field configuration
 * @param {string} fieldName - Field name
 * @returns {Object|null} Field configuration
 */
export const getHorseFormField = (fieldName) => {
  return HORSE_FORM_FIELDS[fieldName] || null;
};

/**
 * Get all required horse form fields
 * @returns {Array} Array of required field names
 */
export const getHorseRequiredFields = () => {
  return Object.entries(HORSE_FORM_FIELDS)
    .filter(([_, config]) => config.required)
    .map(([name]) => name);
};```

### frontend/src/lib/config/forms/schemas/index.js

```
/**
 * Form Schemas - Main Export
 */

export * from './horse';
export * from './rider';```

### frontend/src/lib/config/forms/schemas/rider.js

```
/**
 * Rider Form Schema
 */

import { FIELD_TYPES } from '../fields.js';

export const RIDER_FORM_FIELDS = {
  name: {
    type: FIELD_TYPES.TEXT,
    label: 'Nom du cavalier',
    required: true,
    maxLength: 100,
  },
  email: {
    type: FIELD_TYPES.EMAIL,
    label: 'Email',
    required: false,
  },
  phone: {
    type: FIELD_TYPES.PHONE,
    label: 'Téléphone',
    required: false,
  },
  address: {
    type: FIELD_TYPES.TEXTAREA,
    label: 'Adresse',
    required: false,
    maxLength: 500,
  },
};

/**
 * Get rider form field configuration
 * @param {string} fieldName - Field name
 * @returns {Object|null} Field configuration
 */
export const getRiderFormField = (fieldName) => {
  return RIDER_FORM_FIELDS[fieldName] || null;
};

/**
 * Get all required rider form fields
 * @returns {Array} Array of required field names
 */
export const getRiderRequiredFields = () => {
  return Object.entries(RIDER_FORM_FIELDS)
    .filter(([_, config]) => config.required)
    .map(([name]) => name);
};```

### frontend/src/lib/config/forms/settings.js

```
/**
 * Default Form Settings
 */

// Default form settings
export const FORM_SETTINGS = {
  AUTO_SAVE: false,
  CONFIRM_ON_LEAVE: true,
  RESET_ON_SUCCESS: false,
};

/**
 * Get form setting value
 * @param {string} key - Setting key
 * @param {*} defaultValue - Default value if key not found
 * @returns {*} Setting value
 */
export const getFormSetting = (key, defaultValue = null) => {
  return FORM_SETTINGS[key] ?? defaultValue;
};```

### frontend/src/lib/config/forms/validation.js

```
/**
 * Form Validation Messages and Rules
 */

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Ce champ est requis',
  INVALID_EMAIL: 'Format d\'email invalide',
  INVALID_PHONE: 'Format de téléphone invalide',
  MIN_LENGTH: 'Ce champ doit contenir au moins {min} caractères',
  MAX_LENGTH: 'Ce champ ne peut pas dépasser {max} caractères',
  INVALID_DATE: 'Date invalide',
  INVALID_TIME: 'Heure invalide',
};

/**
 * Get validation message with parameters
 * @param {string} messageKey - Message key
 * @param {Object} params - Parameters to replace
 * @returns {string} Formatted message
 */
export const getValidationMessage = (messageKey, params = {}) => {
  let message = VALIDATION_MESSAGES[messageKey] || '';
  
  Object.keys(params).forEach((key) => {
    message = message.replace(`{${key}}`, params[key]);
  });
  
  return message;
};

/**
 * Format validation message for min/max length
 * @param {string} type - 'min' or 'max'
 * @param {number} value - Length value
 * @returns {string} Formatted message
 */
export const formatLengthMessage = (type, value) => {
  const key = type === 'min' ? 'MIN_LENGTH' : 'MAX_LENGTH';
  return getValidationMessage(key, { [type]: value });
};```

### frontend/src/lib/config/ui/cardStyles.js

```
/**
 * Lesson Card Style Constants
 */

// Base card styles
export const CARD_STYLES = {
  base: {
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  compact: {
    minHeight: '40px',
    padding: '4px 6px',
  },
  standard: {
    minHeight: '60px',
    padding: '6px 8px',
  },
};

// Text styles for different card layouts
export const TEXT_STYLES = {
  compact: {
    name: { fontSize: '10px', fontWeight: '500' },
    time: { fontSize: '9px' },
    label: { fontSize: '9px' },
  },
  standard: {
    name: { fontSize: '11px', fontWeight: '600' },
    time: { fontSize: '11px', fontWeight: '500' },
    label: { fontSize: '11px' },
    duration: { fontSize: '10px' },
  },
};

// Layout utility styles
export const LAYOUT_STYLES = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
};

/**
 * Get card style by layout type
 * @param {string} layout - Layout type ('compact' or 'standard')
 * @returns {Object} Style object
 */
export const getCardStyle = (layout) => {
  return {
    ...CARD_STYLES.base,
    ...CARD_STYLES[layout] || CARD_STYLES.standard,
  };
};

/**
 * Get text style by layout type and element
 * @param {string} layout - Layout type ('compact' or 'standard')
 * @param {string} element - Element type ('name', 'time', 'label', 'duration')
 * @returns {Object} Style object
 */
export const getTextStyle = (layout, element) => {
  const layoutStyles = TEXT_STYLES[layout] || TEXT_STYLES.standard;
  return layoutStyles[element] || {};
};```

### frontend/src/lib/config/ui/constants.js

```
/**
 * UI Constants - Core Values
 */

// Modal sizes
export const MODAL_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  INPUT: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'DD/MM/YYYY HH:mm',
};

// Table configuration
export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MIN_SEARCH_LENGTH: 2,
};

// Status colors
export const STATUS_COLORS = {
  ACTIVE: '#48bb78',
  INACTIVE: '#f56565',
  PENDING: '#ed8936',
  COMPLETED: '#4299e1',
  CANCELLED: '#718096',
};

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};```

### frontend/src/lib/config/ui/index.js

```
/**
 * UI Configuration - Main Export
 */

export * from './constants';
export * from './modal';
export * from './validation';
export * from './cardStyles';

// Re-export for backward compatibility
export {
  MODAL_SIZES,
  DATE_FORMATS,
  TABLE_CONFIG,
  STATUS_COLORS,
  LOADING_STATES,
} from './constants';
export {
  MODAL_CONFIG,
  getModalSizeClass,
} from './modal';
export {
  VALIDATION_RULES,
  validateRule,
  getValidationRule,
} from './validation';
export {
  CARD_STYLES,
  TEXT_STYLES,
  LAYOUT_STYLES,
  getCardStyle,
  getTextStyle,
} from './cardStyles';```

### frontend/src/lib/config/ui/modal.js

```
/**
 * Modal Configuration
 */

import { MODAL_SIZES } from './constants.js';

// Modal default settings
export const MODAL_CONFIG = {
  defaultSize: MODAL_SIZES.MEDIUM,
  closeOnOverlay: true,
  animationDuration: 300,
};

/**
 * Get modal size class
 * @param {string} size - Size value
 * @returns {string} CSS class
 */
export const getModalSizeClass = (size) => {
  const sizeMap = {
    [MODAL_SIZES.SMALL]: 'small',
    [MODAL_SIZES.MEDIUM]: 'medium',
    [MODAL_SIZES.LARGE]: 'large',
  };
  return sizeMap[size] || sizeMap[MODAL_SIZES.MEDIUM];
};```

### frontend/src/lib/config/ui/validation.js

```
/**
 * UI Validation Rules
 */

// Form validation rules
export const VALIDATION_RULES = {
  NAME: {
    minLength: 1,
    maxLength: 100,
    required: true,
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: false,
  },
  PHONE: {
    pattern: /^[\d\s\-+()]+$/,
    minLength: 10,
    required: false,
  },
  DESCRIPTION: {
    maxLength: 500,
    required: false,
  },
};

/**
 * Validate value against rule
 * @param {*} value - Value to validate
 * @param {Object} rule - Validation rule
 * @returns {Object} Validation result
 */
export const validateRule = (value, rule) => {
  const errors = [];

  // Required check
  if (rule.required && (!value || value === '')) {
    errors.push('Ce champ est requis');
    return { isValid: false, errors };
  }

  // Skip other checks if value is empty and not required
  if (!value || value === '') {
    return { isValid: true, errors: [] };
  }

  // Min length check
  if (rule.minLength && value.length < rule.minLength) {
    errors.push(`Minimum ${rule.minLength} caractères requis`);
  }

  // Max length check
  if (rule.maxLength && value.length > rule.maxLength) {
    errors.push(`Maximum ${rule.maxLength} caractères autorisés`);
  }

  // Pattern check
  if (rule.pattern && !rule.pattern.test(value)) {
    errors.push('Format invalide');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get validation rule by name
 * @param {string} ruleName - Rule name
 * @returns {Object|null} Validation rule
 */
export const getValidationRule = (ruleName) => {
  return VALIDATION_RULES[ruleName] || null;
};```

### frontend/src/lib/domains/filters.js

```
/**
 * Filter options constants (Consolidated)
 */

/**
 * Calendar lesson type filter options
 */
export const CALENDAR_LESSON_TYPE_FILTERS = [
  { value: 'all', label: 'Tous les types' },
  { value: 'private', label: 'Cours Particulier' },
  { value: 'group', label: 'Cours Collectif' },
  { value: 'training', label: 'Stage' },
  { value: 'competition', label: 'Concours' },
  { value: 'event', label: 'Événement' },
];

/**
 * Calendar status filter options
 */
export const CALENDAR_STATUS_FILTERS = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'scheduled', label: 'Planifiés' },
  { value: 'confirmed', label: 'Confirmés' },
  { value: 'cancelled', label: 'Annulés' },
];

/**
 * Template lesson type filter options
 */
export const TEMPLATE_LESSON_TYPE_FILTERS = [
  { value: 'all', label: 'Tous les types' },
  { value: 'private', label: 'Cours Particulier' },
  { value: 'group', label: 'Cours Collectif' },
  { value: 'training', label: 'Stage' },
  { value: 'competition', label: 'Concours' },
  { value: 'event', label: 'Événement' },
  { value: 'blocked', label: 'Plage Bloquée' },
];

/**
 * Template status filter options
 */
export const TEMPLATE_STATUS_FILTERS = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'active', label: 'Actifs seulement' },
  { value: 'inactive', label: 'Inactifs seulement' },
];

/**
 * Horse filter options
 */
export const HORSE_KIND_FILTERS = {
  ALL: 'all',
  HORSE: 'horse',
  PONY: 'pony',
};

/**
 * Activity status filter options
 */
export const ACTIVITY_STATUS_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

/**
 * Package status filter options
 */
export const PACKAGE_STATUS_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  SUSPENDED: 'suspended',
};

/**
 * Pairing status filter options
 */
export const PAIRING_STATUS_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

/**
 * Generic filter options - Common values used across the app
 */
export const COMMON_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};```

### frontend/src/lib/domains/horses/index.js

```
/**
 * Horse domain constants exports
 */

export * from './kinds.js';
export * from './owners.js';
```

### frontend/src/lib/domains/horses/kinds.js

```
/**
 * Horse kind constants
 */
export const HORSE_KIND_LABELS = {
  PONY: {
    value: 'pony',
    label: 'Poney',
  },
  HORSE: {
    value: 'horse',
    label: 'Cheval',
  },
};

/**
 * Get horse kind label
 * @param {string} kind - Horse kind value
 * @returns {string} Human-readable label
 */
export const getHorseKindLabel = (kind) => {
  const horseKind = Object.values(HORSE_KIND_LABELS).find((k) => k.value === kind);
  return horseKind?.label || kind;
};

/**
 * Check if horse is a pony
 * @param {string} kind - Horse kind value
 * @returns {boolean} True if pony
 */
export const isPony = (kind) => {
  return kind === HORSE_KIND_LABELS.PONY.value;
};

/**
 * Check if horse is a horse
 * @param {string} kind - Horse kind value
 * @returns {boolean} True if horse
 */
export const isHorse = (kind) => {
  return kind === HORSE_KIND_LABELS.HORSE.value;
};
```

### frontend/src/lib/domains/horses/owners.js

```
/**
 * Horse owner type constants
 */
export const OWNER_TYPES = {
  LAURY: {
    value: 'Laury',
    label: 'Laury',
  },
  OWNER: {
    value: 'Propriétaire',
    label: 'Propriétaire',
  },
  CLUB: {
    value: 'Club',
    label: 'Club',
  },
};

/**
 * Get owner type label
 * @param {string} type - Owner type value
 * @returns {string} Human-readable label
 */
export const getOwnerTypeLabel = (type) => {
  const ownerType = Object.values(OWNER_TYPES).find((o) => o.value === type);
  return ownerType?.label || type;
};

/**
 * Check if owner is Laury
 * @param {string} type - Owner type value
 * @returns {boolean} True if Laury
 */
export const isLaury = (type) => {
  return type === OWNER_TYPES.LAURY.value;
};

/**
 * Check if owner is a club
 * @param {string} type - Owner type value
 * @returns {boolean} True if club
 */
export const isClub = (type) => {
  return type === OWNER_TYPES.CLUB.value;
};
```

### frontend/src/lib/domains/index.js

```
/**
 * Domain constants exports
 */

export * from './horses';
export * from './lessons';
export * from './packages';
export * from './templates';
export * from './filters';```

### frontend/src/lib/domains/lessons/index.js

```
/**
 * Lessons domain constants exports
 */

export * from './types.js';
export * from './statuses.js';
export * from './participation.js';```

### frontend/src/lib/domains/lessons/participation.js

```
/**
 * Participation status configurations
 */
export const PARTICIPATION_STATUSES = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const PARTICIPATION_STATUS_LABELS = {
  [PARTICIPATION_STATUSES.CONFIRMED]: 'Confirmé',
  [PARTICIPATION_STATUSES.PENDING]: 'En attente',
  [PARTICIPATION_STATUSES.CANCELLED]: 'Annulé',
  [PARTICIPATION_STATUSES.COMPLETED]: 'Terminé',
};

/**
 * Get participation status label
 * @param {string} status - Status value
 * @returns {string} Human-readable label
 */
export const getParticipationStatusLabel = (status) => {
  return PARTICIPATION_STATUS_LABELS[status] || status;
};

/**
 * Check if participation is confirmed
 * @param {string} status - Status value
 * @returns {boolean} True if confirmed
 */
export const isParticipationConfirmed = (status) => {
  return status === PARTICIPATION_STATUSES.CONFIRMED;
};

/**
 * Check if participation is pending
 * @param {string} status - Status value
 * @returns {boolean} True if pending
 */
export const isParticipationPending = (status) => {
  return status === PARTICIPATION_STATUSES.PENDING;
};

/**
 * Check if participation is cancelled
 * @param {string} status - Status value
 * @returns {boolean} True if cancelled
 */
export const isParticipationCancelled = (status) => {
  return status === PARTICIPATION_STATUSES.CANCELLED;
};

/**
 * Check if participation is completed
 * @param {string} status - Status value
 * @returns {boolean} True if completed
 */
export const isParticipationCompleted = (status) => {
  return status === PARTICIPATION_STATUSES.COMPLETED;
};```

### frontend/src/lib/domains/lessons/statuses.js

```
import { Icons } from '../../icons';

/**
 * Lesson status configurations
 */
export const LESSON_STATUSES = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  BLOCKED: 'blocked',
};

export const STATUS_BADGES = {
  scheduled: {
    label: 'Planifié',
    icon: Icons.Calendar,
    color: '#ff9500ff',
    bgColor: '#ffffffff',
  },
  confirmed: {
    label: 'Confirmé',
    icon: Icons.Check,
    color: '#28a745',
    bgColor: '#d4edda',
  },
  in_progress: {
    label: 'En cours',
    icon: Icons.Clock,
    color: '#0c5460',
    bgColor: '#d1ecf1',
  },
  completed: {
    label: 'Terminé',
    icon: Icons.Check,
    color: '#155724',
    bgColor: '#d4edda',
  },
  cancelled: {
    label: 'Annulé',
    icon: Icons.Close,
    color: '#721c24',
    bgColor: '#f8d7da',
  },
  blocked: {
    label: 'Bloqué',
    icon: Icons.Blocked,
    color: '#6c757d',
    bgColor: '#e2e3e5',
  },
};

/**
 * Get status badge configuration
 * @param {string} status - Status value
 * @returns {Object} Badge configuration with label, icon, color, bgColor
 */
export const getStatusBadge = (status) => {
  return STATUS_BADGES[status] || STATUS_BADGES.scheduled;
};

/**
 * Get status label
 * @param {string} status - Status value
 * @returns {string} Human-readable label
 */
export const getStatusLabel = (status) => {
  return STATUS_BADGES[status]?.label || status;
};

/**
 * Check if lesson is scheduled
 * @param {string} status - Status value
 * @returns {boolean} True if scheduled
 */
export const isLessonScheduled = (status) => {
  return status === LESSON_STATUSES.SCHEDULED;
};

/**
 * Check if lesson is confirmed
 * @param {string} status - Status value
 * @returns {boolean} True if confirmed
 */
export const isLessonConfirmed = (status) => {
  return status === LESSON_STATUSES.CONFIRMED;
};

/**
 * Check if lesson is in progress
 * @param {string} status - Status value
 * @returns {boolean} True if in progress
 */
export const isLessonInProgress = (status) => {
  return status === LESSON_STATUSES.IN_PROGRESS;
};

/**
 * Check if lesson is completed
 * @param {string} status - Status value
 * @returns {boolean} True if completed
 */
export const isLessonCompleted = (status) => {
  return status === LESSON_STATUSES.COMPLETED;
};

/**
 * Check if lesson is cancelled
 * @param {string} status - Status value
 * @returns {boolean} True if cancelled
 */
export const isLessonCancelled = (status) => {
  return status === LESSON_STATUSES.CANCELLED;
};

/**
 * Check if lesson is blocked
 * @param {string} status - Status value
 * @returns {boolean} True if blocked
 */
export const isLessonBlocked = (status) => {
  return status === LESSON_STATUSES.BLOCKED;
};

/**
 * Check if lesson can be modified
 * @param {string} status - Status value
 * @returns {boolean} True if lesson can be modified
 */
export const isLessonModifiable = (status) => {
  return !isLessonCompleted(status) && !isLessonCancelled(status);
};
```

### frontend/src/lib/domains/lessons/types.js

```
/**
 * Lesson type configurations (Shared between lessons and templates)
 */
import { Icons } from '../../icons';

/**
 * Lesson type configurations
 */
export const LESSON_TYPES = {
  PRIVATE: {
    value: 'private',
    label: 'Cours particulier',
    labelShort: '👤 Particulier',
    icon: Icons.PrivateLesson,
    color: '#007bff',
    defaultMax: 1,
    minP: 1,
    maxP: 1,
  },
  GROUP: {
    value: 'group',
    label: 'Cours collectif',
    labelShort: '👥 Collectif',
    icon: Icons.GroupLesson,
    color: '#28a745',
    defaultMax: 6,
    minP: 2,
    maxP: 8,
  },
  TRAINING: {
    value: 'training',
    label: 'Stage',
    labelShort: '🎓 Stage',
    icon: Icons.Training,
    color: '#ffc107',
    defaultMax: 10,
    minP: 3,
    maxP: 12,
  },
  COMPETITION: {
    value: 'competition',
    label: 'Concours',
    labelShort: '🏆 Concours',
    icon: Icons.Competition,
    color: '#dc3545',
    defaultMax: 20,
    minP: 1,
    maxP: null,
  },
  EVENT: {
    value: 'event',
    label: 'Événement',
    labelShort: '🎉 Événement',
    icon: Icons.Event,
    color: '#6f42c1',
    defaultMax: 50,
    minP: 1,
    maxP: null,
  },
  BLOCKED: {
    value: 'blocked',
    label: 'Période bloquée',
    labelShort: '🛫 Bloqué',
    icon: Icons.Blocked,
    color: '#6c757d',
    defaultMax: null,
    minP: 0,
    maxP: 0,
  },
};

/**
 * Get lesson type icon component
 * @param {string} type - Lesson type value
 * @returns {Component} Icon component
 */
export const getLessonTypeIcon = (type) => {
  const lessonType = Object.values(LESSON_TYPES).find((t) => t.value === type);
  return lessonType?.icon || Icons.Calendar;
};

/**
 * Get lesson type label
 * @param {string} type - Lesson type value
 * @param {boolean} short - Use short label with emoji
 * @returns {string} Human-readable label
 */
export const getLessonTypeLabel = (type, short = false) => {
  const lessonType = Object.values(LESSON_TYPES).find((t) => t.value === type);
  if (short) {
    return lessonType?.labelShort || type;
  }
  return lessonType?.label || type;
};

/**
 * Get lesson type configuration
 * @param {string} type - Lesson type value
 * @returns {Object} Full lesson type configuration
 */
export const getLessonTypeConfig = (type) => {
  return Object.values(LESSON_TYPES).find((t) => t.value === type);
};

/**
 * Check if lesson type is blocked
 * @param {string} type - Lesson type value
 * @returns {boolean} True if blocked type
 */
export const isBlockedLesson = (type) => {
  return type === LESSON_TYPES.BLOCKED.value;
};

/**
 * Horse assignment types
 */
export const HORSE_ASSIGNMENT_TYPES = {
  AUTO: 'auto',
  MANUAL: 'manual',
  NONE: 'none',
};

/**
 * Get lesson type max participants
 * @param {string} type - Lesson type value
 * @returns {number|null} Max participants or null if unlimited
 */
export const getLessonTypeMaxParticipants = (type) => {
  const config = getLessonTypeConfig(type);
  return config?.maxP || config?.defaultMax || null;
};

/**
 * Get lesson type min participants
 * @param {string} type - Lesson type value
 * @returns {number} Min participants
 */
export const getLessonTypeMinParticipants = (type) => {
  const config = getLessonTypeConfig(type);
  return config?.minP || 0;
};
```

### frontend/src/lib/domains/packages/index.js

```
/**
 * Packages domain constants exports
 */

export * from './types.js';
export * from './statuses.js';```

### frontend/src/lib/domains/packages/statuses.js

```
/**
 * Package status constants
 */
export const PACKAGE_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  SUSPENDED: 'suspended',
};

export const PACKAGE_STATUS_LABELS = {
  [PACKAGE_STATUS.ACTIVE]: 'Actif',
  [PACKAGE_STATUS.EXPIRED]: 'Expiré',
  [PACKAGE_STATUS.SUSPENDED]: 'Suspendu',
};

/**
 * Get package status label
 * @param {string} status - Status value
 * @returns {string} Human-readable label
 */
export const getPackageStatusLabel = (status) => {
  return PACKAGE_STATUS_LABELS[status] || status;
};

/**
 * Check if package is active
 * @param {string} status - Status value
 * @returns {boolean} True if active
 */
export const isPackageActive = (status) => {
  return status === PACKAGE_STATUS.ACTIVE;
};

/**
 * Check if package is expired
 * @param {string} status - Status value
 * @returns {boolean} True if expired
 */
export const isPackageExpired = (status) => {
  return status === PACKAGE_STATUS.EXPIRED;
};

/**
 * Check if package is suspended
 * @param {string} status - Status value
 * @returns {boolean} True if suspended
 */
export const isPackageSuspended = (status) => {
  return status === PACKAGE_STATUS.SUSPENDED;
};```

### frontend/src/lib/domains/templates/index.js

```
/**
 * Templates domain constants exports
 */

export * from './types.js';
export * from './recurrence.js';```

### frontend/src/lib/domains/templates/recurrence.js

```
/**
 * Week days for recurrence selection
 */
export const WEEK_DAYS = [
  { value: 'monday', label: 'Lun' },
  { value: 'tuesday', label: 'Mar' },
  { value: 'wednesday', label: 'Mer' },
  { value: 'thursday', label: 'Jeu' },
  { value: 'friday', label: 'Ven' },
  { value: 'saturday', label: 'Sam' },
  { value: 'sunday', label: 'Dim' },
];

/**
 * Recurrence frequency options
 */
export const RECURRENCE_FREQUENCIES = [
  { value: 'daily', label: 'Quotidien' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuel' },
];

/**
 * Get recurrence interval description
 * @param {string} frequency - Recurrence frequency
 * @param {number} interval - Interval value
 * @returns {string} Description text
 */
export function getRecurrenceIntervalText(frequency, interval) {
  switch (frequency) {
    case 'weekly':
      return `Toutes les ${interval} semaine(s)`;
    case 'daily':
      return `Tous les ${interval} jour(s)`;
    case 'monthly':
      return `Tous les ${interval} mois`;
    default:
      return '';
  }
}

/**
 * Check if recurrence is valid
 * @param {string} frequency - Recurrence frequency
 * @param {number} interval - Interval value
 * @returns {boolean} True if valid
 */
export function isValidRecurrence(frequency, interval) {
  return RECURRENCE_FREQUENCIES.some(f => f.value === frequency) && 
         interval > 0;
}

/**
 * Get default interval for frequency
 * @param {string} frequency - Recurrence frequency
 * @returns {number} Default interval
 */
export function getDefaultInterval(frequency) {
  switch (frequency) {
    case 'weekly':
      return 1;
    case 'daily':
      return 1;
    case 'monthly':
      return 1;
    default:
      return 1;
  }
}```

### frontend/src/lib/domains/templates/types.js

```
/**
 * Template lesson type configurations
 * Re-exports from lessons/types to avoid duplication
 */
export {
  LESSON_TYPES,
  getLessonTypeIcon,
  getLessonTypeLabel,
  getLessonTypeConfig,
  isBlockedLesson,
  getLessonTypeMaxParticipants,
  getLessonTypeMinParticipants,
} from '../lessons/types.js';

/**
 * Get template lesson type by value (alias for compatibility)
 * @param {string} value - Lesson type value
 * @returns {Object} Lesson type configuration
 * @deprecated Use getLessonTypeConfig instead
 */
export const getTemplateLessonType = (value) => {
  return getLessonTypeConfig(value);
};```

### frontend/src/lib/helpers/domains/lessons/filters.js

```
/**
 * Lesson filtering utilities
 */

/**
 * Filter lessons by type and status
 * @param {Array} lessons - Array of lesson objects
 * @param {Object} filters - Filter criteria
 * @param {string} filters.lessonType - Lesson type filter ('all' or specific type)
 * @param {string} filters.status - Status filter ('all' or specific status)
 * @param {boolean} filters.showBlocked - Whether to show blocked lessons
 * @returns {Array} Filtered lessons
 */
export function filterLessons(lessons, filters = {}) {
  if (!lessons || !Array.isArray(lessons)) return [];

  const { lessonType = 'all', status = 'all', showBlocked = true } = filters;

  return lessons.filter((lesson) => {
    // Filter by lesson type
    if (lessonType !== 'all' && lesson.lesson_type !== lessonType) {
      return false;
    }

    // Filter by status
    if (status !== 'all' && lesson.status !== status) {
      return false;
    }

    // Filter blocked lessons
    if (!showBlocked && lesson.lesson_type === 'blocked') {
      return false;
    }

    return true;
  });
}

/**
 * Filter lessons by date range
 * @param {Array} lessons - Array of lesson objects
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @returns {Array} Filtered lessons
 */
export function filterLessonsByDateRange(lessons, startDate, endDate) {
  if (!lessons || !Array.isArray(lessons)) return [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  return lessons.filter((lesson) => {
    if (!lesson.lesson_date) return false;
    const lessonDate = new Date(lesson.lesson_date);
    return lessonDate >= start && lessonDate <= end;
  });
}

/**
 * Filter lessons by time range
 * @param {Array} lessons - Array of lesson objects
 * @param {string} startTime - Start time (HH:MM format)
 * @param {string} endTime - End time (HH:MM format)
 * @returns {Array} Filtered lessons
 */
export function filterLessonsByTimeRange(lessons, startTime, endTime) {
  if (!lessons || !Array.isArray(lessons)) return [];

  return lessons.filter((lesson) => {
    if (!lesson.start_time || !lesson.end_time) return false;
    return lesson.start_time >= startTime && lesson.end_time <= endTime;
  });
}

/**
 * Group lessons by date
 * @param {Array} lessons - Array of lesson objects
 * @returns {Object} Lessons grouped by date
 */
export function groupLessonsByDate(lessons) {
  if (!lessons || !Array.isArray(lessons)) return {};

  return lessons.reduce((acc, lesson) => {
    const date = lesson.lesson_date || 'unknown';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(lesson);
    return acc;
  }, {});
}
```

### frontend/src/lib/helpers/domains/lessons/stats.js

```
/**
 * Lesson statistics utilities
 */

import {
  isLessonConfirmed,
  isLessonBlocked,
  isLessonCompleted,
} from '../../../domains/lessons/statuses';

/**
 * Calculate calendar statistics
 * @param {Object} weekData - Week data with days and lessons
 * @returns {Object} Statistics object
 */
export function calculateCalendarStats(weekData) {
  if (!weekData || !weekData.days) {
    return { total: 0, confirmed: 0, blocked: 0, completed: 0 };
  }

  // Flatten all lessons from all days
  const allLessons = weekData.days.flatMap((day) => day.lessons || []);

  return {
    total: allLessons.length,
    confirmed: allLessons.filter((l) => isLessonConfirmed(l.status)).length,
    blocked: allLessons.filter((l) => isLessonBlocked(l.status)).length,
    completed: allLessons.filter((l) => isLessonCompleted(l.status)).length,
  };
}

/**
 * Calculate day statistics
 * @param {Array} lessons - Array of lesson objects
 * @returns {Object} Statistics object
 */
export function calculateDayStats(lessons) {
  if (!lessons || !Array.isArray(lessons)) {
    return { total: 0, confirmed: 0, blocked: 0, completed: 0 };
  }

  return {
    total: lessons.length,
    confirmed: lessons.filter((l) => isLessonConfirmed(l.status)).length,
    blocked: lessons.filter((l) => isLessonBlocked(l.status)).length,
    completed: lessons.filter((l) => isLessonCompleted(l.status)).length,
  };
}

/**
 * Get lesson count by type
 * @param {Array} lessons - Array of lesson objects
 * @returns {Object} Count by lesson type
 */
export function getLessonCountByType(lessons) {
  if (!lessons || !Array.isArray(lessons)) {
    return {};
  }

  return lessons.reduce((acc, lesson) => {
    const type = lesson.lesson_type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Get lesson count by status
 * @param {Array} lessons - Array of lesson objects
 * @returns {Object} Count by status
 */
export function getLessonCountByStatus(lessons) {
  if (!lessons || !Array.isArray(lessons)) {
    return {};
  }

  return lessons.reduce((acc, lesson) => {
    const status = lesson.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
}
```

### frontend/src/lib/helpers/shared/filters/activityFilters.js

```
/**
 * Activity Filters - Check if entities are active based on dates
 */

/**
 * Check if an item is currently active based on start and end dates
 * @param {string} startDate - Activity start date (ISO string or date string)
 * @param {string} endDate - Activity end date (ISO string or date string)
 * @returns {boolean} True if the item is active
 */
export function isActive(startDate, endDate) {
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (start && start > now) return false;
  if (end && end < now) return false;
  return true;
}

/**
 * Check if an item is in the past
 * @param {string} endDate - Activity end date
 * @returns {boolean} True if the item is in the past
 */
export function isPast(endDate) {
  if (!endDate) return false;
  const end = new Date(endDate);
  const now = new Date();
  return end < now;
}

/**
 * Check if an item is in the future
 * @param {string} startDate - Activity start date
 * @returns {boolean} True if the item is in the future
 */
export function isFuture(startDate) {
  if (!startDate) return false;
  const start = new Date(startDate);
  const now = new Date();
  return start > now;
}```

### frontend/src/lib/helpers/shared/filters/entityFilters.js

```
/**
 * Entity Filter Utilities - Filter arrays of entities by activity status
 */

import { isActive } from './activityFilters';

/**
 * Filter packages to return only active ones
 * @param {Array} packages - Array of package objects
 * @returns {Array} Filtered array of active packages
 */
export function filterActivePackages(packages) {
  if (!packages || !Array.isArray(packages)) return [];
  return packages.filter((pkg) =>
    isActive(pkg.activity_start_date, pkg.activity_end_date)
  );
}

/**
 * Filter pairings to return only active ones (both pairing and horse must be active)
 * @param {Array} pairings - Array of pairing objects
 * @returns {Array} Filtered array of active pairings
 */
export function filterActivePairings(pairings) {
  if (!pairings || !Array.isArray(pairings)) return [];
  return pairings.filter((pairing) => {
    const pairingActive = isActive(pairing.pairing_start_date, pairing.pairing_end_date);
    const horseActive =
      pairing.horses &&
      isActive(pairing.horses.activity_start_date, pairing.horses.activity_end_date);
    return pairingActive && horseActive;
  });
}

/**
 * Filter horses to return only active ones
 * @param {Array} horses - Array of horse objects
 * @returns {Array} Filtered array of active horses
 */
export function filterActiveHorses(horses) {
  if (!horses || !Array.isArray(horses)) return [];
  return horses.filter((horse) =>
    isActive(horse.activity_start_date, horse.activity_end_date)
  );
}

/**
 * Filter riders to return only active ones
 * @param {Array} riders - Array of rider objects
 * @returns {Array} Filtered array of active riders
 */
export function filterActiveRiders(riders) {
  if (!riders || !Array.isArray(riders)) return [];
  return riders.filter((rider) =>
    isActive(rider.activity_start_date, rider.activity_end_date)
  );
}```

### frontend/src/lib/helpers/shared/filters/index.js

```
/**
 * Shared Filters - Main Export
 */

export * from './activityFilters';
export * from './entityFilters';

// Re-export for backward compatibility
export { isActive, isPast, isFuture } from './activityFilters';
export {
  filterActivePackages,
  filterActivePairings,
  filterActiveHorses,
  filterActiveRiders,
} from './entityFilters';```

### frontend/src/lib/helpers/shared/formatters/date.js

```
/**
 * Date formatting utilities
 */

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format week title
 * @param {Object} weekData - Week data with period
 * @returns {string} Formatted week title
 */
export function formatWeekTitle(weekData) {
  if (!weekData || !weekData.period) return 'Chargement...';

  const start = new Date(weekData.period.start);
  const end = new Date(weekData.period.end);

  // Validate dates before formatting
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Semaine en cours';
  }

  return `Semaine du ${format(start, 'dd MMMM', { locale: fr })} au ${format(end, 'dd MMMM yyyy', {
    locale: fr,
  })}`;
}

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - Format string (default: 'dd/MM/yyyy')
 * @returns {string} Formatted date
 */
export function formatDate(date, formatStr = 'dd/MM/yyyy') {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: fr });
}

/**
 * Format date and time
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - Format string (default: 'dd/MM/yyyy HH:mm')
 * @returns {string} Formatted date and time
 */
export function formatDateTime(date, formatStr = 'dd/MM/yyyy HH:mm') {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: fr });
}
```

### frontend/src/lib/icons.jsx

```
import {
  FaPlus,
  FaPencilAlt,
  FaTrash,
  FaEye,
  FaHorseHead,
  FaCalendarAlt,
  FaClone,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaArrowUp,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaList,
  FaLink,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
  FaInfoCircle,
  FaSave,
  FaBan,
  FaSpinner,
  FaGraduationCap,
  FaShoppingBasket,
  FaUserGraduate,
  FaAward,
  FaLocationArrow,
  FaClock,
  FaCalendarDay,
  FaArrowCircleRight,
  FaCog,
  FaTag,
  FaFilter,
} from 'react-icons/fa';

export const Icons = {
  Add: FaPlus,
  Edit: FaPencilAlt,
  Delete: FaTrash,
  View: FaEye,
  Horse: FaHorseHead,
  Calendar: FaCalendarAlt,
  Template: FaClone,
  Check: FaCheck,
  Close: FaTimes,
  Warning: FaExclamationTriangle,
  Remove: FaArrowUp,
  User: FaUser,
  Users: FaUsers,
  Phone: FaPhone,
  Email: FaEnvelope,
  Date: FaCalendar,
  List: FaList,
  Link: FaLink,
  ChevronDown: FaChevronDown,
  ChevronLeft: FaChevronLeft,
  ChevronRight: FaChevronRight,
  Info: FaInfoCircle,
  Save: FaSave,
  Cancel: FaBan,
  Loading: FaSpinner,
  Lesson: FaGraduationCap,
  Packages: FaShoppingBasket,
  PrivateLesson: FaUserGraduate,
  GroupLesson: FaUsers,
  Service: FaShoppingBasket,
  Clock: FaClock,
  Location: FaLocationArrow,
  Competition: FaAward,
  Training: FaGraduationCap,
  Event: FaCalendarDay,
  Blocked: FaBan,
  Repeat: FaArrowCircleRight,
  Settings: FaCog,
  Tag: FaTag,
  Filter: FaFilter,
};

export const renderIcon = (Icon, props = {}) => {
  return <Icon {...props} />;
};

export default Icons;```

### frontend/src/styles/common/base.css

```
/* ============================================
   BASE STYLES - Variables & Reset
   ============================================ */

:root {
  /* Primary Colors */
  --color-primary: #007bff;
  --color-primary-dark: #0056b3;
  --color-primary-light: #667eea;
  
  /* Secondary Colors */
  --color-secondary: #6c757d;
  --color-secondary-dark: #545b62;
  
  /* Success Colors */
  --color-success: #28a745;
  --color-success-dark: #1e7e34;
  --color-success-light: #d4edda;
  
  /* Danger Colors */
  --color-danger: #dc3545;
  --color-danger-dark: #bd2130;
  --color-danger-light: #f8d7da;
  
  /* Warning Colors */
  --color-warning: #ffc107;
  --color-warning-dark: #e0a800;
  --color-warning-light: #fff3cd;
  
  /* Info Colors */
  --color-info: #17a2b8;
  --color-info-dark: #117a8b;
  --color-info-light: #d1ecf1;
  
  /* Neutral Colors */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-100: #f8f9fa;
  --color-gray-200: #e9ecef;
  --color-gray-300: #dee2e6;
  --color-gray-400: #ced4da;
  --color-gray-500: #adb5bd;
  --color-gray-600: #6c757d;
  --color-gray-700: #495057;
  --color-gray-800: #2d3748;
  --color-gray-900: #212529;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 10px 20px rgba(0, 0, 0, 0.2);
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;
  
  /* Font Sizes */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.75rem;
  
  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}

/* ============================================
   RESET & BASE STYLES
   ============================================ */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
  color: var(--color-gray-800);
  background-color: var(--color-white);
}

/* ============================================
   ANIMATIONS
   ============================================ */

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.spin {
  animation: spin 1s linear infinite;
}```

### frontend/src/styles/common/tables.css

```
/* ============================================
   TABLE STYLES - Consolidated
   ============================================ */

.table-container {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--color-white);
}

.table thead {
  background-color: var(--color-gray-100);
  border-bottom: 2px solid var(--color-gray-200);
}

.table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
  border-bottom: 1px solid var(--color-gray-300);
}

.table td {
  padding: 12px 16px;
  font-size: var(--font-size-sm);
  color: var(--color-gray-900);
  border-bottom: 1px solid var(--color-gray-200);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr:hover {
  background-color: var(--color-gray-100);
}

/* ============================================
   TABLE ACTIONS
   ============================================ */

.table-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.table-actions button {
  padding: 8px 12px;
  font-size: 12px;
  margin: 0;
}

/* ============================================
   TABLE VARIANTS
   ============================================ */

.table-sm {
  font-size: var(--font-size-sm);
}

.table-sm th,
.table-sm td {
  padding: 8px 12px;
}

.table-sm .table-actions button {
  padding: 4px 8px;
  font-size: 11px;
}

/* ============================================
   RESPONSIVE TABLES
   ============================================ */

@media (max-width: 768px) {
  .table {
    font-size: 13px;
  }

  .table th,
  .table td {
    padding: 8px 12px;
  }

  .table-actions {
    flex-direction: column;
    gap: 4px;
  }

  .table-actions button {
    width: 100%;
    justify-content: center;
  }
}```

### frontend/src/styles/components/list-view.css

```
/* ============================================
   LIST VIEW COMPONENT STYLES
   (Used by Horses, Pairings, etc.)
   ============================================ */

@import '../common/index.css';

/* ============================================
   FILTER BUTTONS
   ============================================ */

.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.filter-buttons .btn {
  margin: 0;
}

/* ============================================
   TABLE STYLES (Component-specific)
   ============================================ */

.table-wrapper {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  margin-top: 16px;
}

/* ============================================
   EMPTY STATE (Component-specific)
   ============================================ */

.empty-state-component {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-gray-600);
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 2px dashed #cbd5e0;
}

.empty-state-icon {
  color: #cbd5e0;
  margin-bottom: 20px;
  font-size: 48px;
}

.empty-state-component h3 {
  margin: 0 0 10px 0;
  color: var(--color-gray-800);
  font-size: 1.5rem;
}

.empty-state-component p {
  margin: 0 0 20px 0;
  color: var(--color-gray-600);
}

/* ============================================
   LOADING STATE (Component-specific)
   ============================================ */

.loading-component {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--color-gray-700);
  font-size: 1rem;
  gap: 8px;
}

/* ============================================
   ERROR STATE (Component-specific)
   ============================================ */

.error-component {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fed7d7;
  color: #c53030;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  gap: 8px;
}

/* ============================================
   SUCCESS STATE (Component-specific)
   ============================================ */

.success-component {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #c6f6d5;
  color: #22543d;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  gap: 8px;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

@media (max-width: 768px) {
  .filter-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .filter-buttons .btn {
    width: 100%;
    justify-content: center;
  }

  .empty-state-component {
    padding: 40px 20px;
  }

  .empty-state-component h3 {
    font-size: 1.25rem;
  }
}```

### frontend/src/styles/index.css

```
/* ============================================
   MAIN APPLICATION STYLES
   ============================================ */

@import './common/index.css';

/* ============================================
   LAYOUT & STRUCTURE
   ============================================ */

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

/* ============================================
   HEADER & NAVIGATION
   ============================================ */

header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  color: var(--color-gray-800);
  padding: 20px 0;
  margin-bottom: 30px;
  box-shadow: var(--shadow-sm);
  border-bottom: 3px solid var(--color-primary);
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

header h1 {
  font-size: 2rem;
  font-weight: var(--font-weight-bold);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

nav {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

nav a {
  color: var(--color-gray-600);
  text-decoration: none;
  padding: 10px 16px;
  border-radius: var(--radius-lg);
  transition: all var(--transition-slow);
  font-weight: var(--font-weight-medium);
  border: 2px solid transparent;
}

nav a:hover {
  background: rgba(102, 126, 234, 0.1);
  color: var(--color-primary);
  transform: translateY(-1px);
}

nav a.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: var(--color-white);
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

main {
  flex: 1;
  padding-bottom: 40px;
}

/* ============================================
   STATS GRID
   ============================================ */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 20px;
  border-radius: var(--radius-xl);
  text-align: center;
  border: 2px solid #e2e8f0;
  transition: all var(--transition-slow);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--color-gray-600);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ============================================
   ENHANCED CARD STYLES
   ============================================ */

.card-enhanced {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-enhanced h2 {
  margin-bottom: 24px;
  color: var(--color-gray-800);
  font-size: 1.5rem;
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-enhanced h2::before {
  content: '';
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

/* ============================================
   LOADING & EMPTY STATES (Enhanced)
   ============================================ */

.loading-enhanced {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-gray-800);
  font-size: 1.1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

.empty-state-enhanced {
  text-align: center;
  padding: 80px 20px;
  color: var(--color-gray-800);
}

.empty-state-icon {
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.8;
}

.empty-state-enhanced h3 {
  font-size: 1.5rem;
  margin-bottom: 12px;
  font-weight: var(--font-weight-semibold);
}

.empty-state-enhanced p {
  font-size: 1.1rem;
  margin-bottom: 24px;
  opacity: 0.9;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  header .container {
    flex-direction: column;
    align-items: stretch;
  }

  header h1 {
    text-align: center;
    font-size: 1.5rem;
  }

  nav {
    justify-content: center;
  }

  .card-enhanced {
    padding: 20px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  header h1 {
    font-size: 1.3rem;
  }
}```


---

End of report
