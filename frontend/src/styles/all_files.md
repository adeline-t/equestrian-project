# 📁 Project Files Export

Generated on: Wed Jan 28 10:00:22 CET 2026

## 📄 app.css
**Path:** `app.css`

```
/* ============================================
   APPLICATION STYLES
   Main entry point - imports only common styles
   Features are imported separately as needed
   ============================================ */

@import './common.css';

/* ============================================
   NOTE: Feature-specific styles should be imported
   separately in their respective components:
   
   - features/calendar/calendar/calendar.css for calendar features
   - features/events/event-modal.css for event modals
   - features/riders/riders-list.css for rider lists
   - features/horses/horses-list.css for horse lists
   - features/pairings/pairings.css for pairing features
   - features/stats/stats.css for statistics
   - features/home/header.css for header (desktop)
   - features/home/header-mobile.css for header (mobile)
   ============================================ */

/* À la fin de app.css */
@import './features/calendar/calendar-base.css';
@import './features/calendar/calendar-actions-mobile.css';
@import './features/calendar/calendar-desktop.css';
@import './features/calendar/calendar-mobile.css';
@import './features/calendar/calendar-complete.css';
```

---

## 📄 common.css
**Path:** `common.css`

```
/* ============================================
   COMMON STYLES
   Import all foundations, layouts, and components
   ============================================ */

/* 1. Foundations */
@import './foundations/variables.css';
@import './foundations/base-layouts.css';
@import './foundations/utilities.css';

/* 2. Components de base */
@import './components/components.css';
@import './components/layouts.css';

/* 3. Conteneurs */
@import './components/cards.css';

/* 4. Tables et listes */
@import './components/tables.css';

/* 5. Filtres */
@import './components/filters.css';

/* 6. États et alertes */
@import './components/alerts-states.css';

/* 7. Modales */
@import './components/modals.css';

/* 8. Formulaires (pour RiderForm) */
@import './components/form-controls.css';
@import './components/form-layouts.css';
```

---

## 📄 alerts-states.css
**Path:** `components/alerts-states.css`

```
/* ============================================
   ALERTS & STATES - Messages et états
   Alerts, loading, error, empty states
   ============================================ */

/* ============================================
   ALERTS
   ============================================ */

.alert {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  border-left: 4px solid;
  margin-bottom: var(--spacing-md);
}

.alert-info {
  background: var(--color-info-light);
  color: var(--color-info-dark);
  border-left-color: var(--color-info);
}

.alert-success {
  background-image: var(--gradient-alert-success);
  color: var(--color-success-dark);
  border-left-color: var(--color-success);
}

.alert-warning {
  background: var(--color-warning-light);
  color: var(--color-warning-dark);
  border-left-color: var(--color-warning);
}

.alert-error,
.alert-danger {
  background-image: var(--gradient-alert-error);
  color: var(--color-danger-dark);
  border-left-color: var(--color-danger);
}

.alert strong {
  font-weight: var(--font-weight-semibold);
}

.alert p {
  margin: 0;
}

.alert p + p {
  margin-top: var(--spacing-sm);
}

/* ============================================
   EMPTY STATES
   ============================================ */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4xl) var(--spacing-lg);
  text-align: center;
  color: var(--color-text-muted);
}

.empty-state-small {
  text-align: center;
  padding: 30px;
  background: var(--color-gray-100);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--color-gray-400);
  margin-bottom: var(--spacing-md);
}

.empty-state-icon {
  font-size: 64px;
  margin-bottom: var(--spacing-lg);
  opacity: 0.8;
  color: var(--color-gray-400);
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.empty-state p {
  font-size: var(--font-size-base);
  margin: 0;
  color: var(--color-text-muted);
}

.empty-state-small p {
  color: var(--color-gray-600);
  margin-bottom: 15px;
  font-size: var(--font-size-sm);
}

/* ============================================
   LOADING STATE
   ============================================ */

.loading,
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
  text-align: center;
  color: var(--color-text-muted);
  gap: var(--spacing-md);
}

.loading p {
  margin-top: var(--spacing-sm);
  color: var(--color-text-muted);
}

.loading-state {
  color: var(--color-gray-600);
}

.loading-state svg {
  width: 32px;
  height: 32px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-md);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* ============================================
   ERROR STATE
   ============================================ */

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
  text-align: center;
}

.error-icon {
  font-size: 48px;
  color: var(--color-danger);
  margin-bottom: var(--spacing-md);
}

.error h3 {
  margin: var(--spacing-md) 0 var(--spacing-sm);
  color: var(--color-danger);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .empty-state {
    padding: var(--spacing-3xl) var(--spacing-lg);
  }

  .empty-state-icon {
    font-size: 48px;
  }

  .empty-state h3 {
    font-size: var(--font-size-lg);
  }
}
```

---

## 📄 cards.css
**Path:** `components/cards.css`

```
/* ============================================
   CARDS - Conteneurs de contenu
   Cards de base, info cards, data cards
   ============================================ */

/* ============================================
   BASE CARD
   ============================================ */

.card {
  background: var(--color-bg-card);
  backdrop-filter: blur(10px);
  padding: var(--spacing-lg);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl);
  margin-bottom: var(--spacing-lg);
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card h2 {
  margin-bottom: var(--spacing-lg);
  color: var(--color-text);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.card h2::before {
  content: ' ';
  width: 4px;
  height: 24px;
  background: var(--gradient-primary);
  border-radius: 2px;
}

.card .week-title h2::before {
  width: 0;
  border-radius: 0;
}

/* ============================================
   CARD SECTIONS
   ============================================ */

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.card-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.card-title-text,
.card-title h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.card-title svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.card-title .count-badge {
  margin-left: auto;
}

.card-actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

/* ============================================
   INFO + DATA CARDS
   ============================================ */

.data-card,
.info-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.info-card {
  overflow: hidden;
}

.data-card {
  overflow: auto;
}

.data-card:hover,
.info-card:hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border-dark);
}

/* ============================================
   CARD HEADERS
   ============================================ */

.data-card-header,
.info-card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-gray-50);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-sm) var(--spacing-md);
}

.data-card-title,
.info-card-title,
.info-card-header h3 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  flex: 1;
}

.info-card-header svg {
  font-size: var(--font-size-base);
}

/* ============================================
   CARD BODY
   ============================================ */

.data-card-body,
.info-card-body {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* ============================================
   INFO ITEM MODERN
   ============================================ */

.info-item-modern,
.data-card-body .info-item-modern {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.info-content,
.data-card-body .info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xs);
  min-width: 0;
}

.info-label,
.data-card-body .info-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value,
.data-card-body .info-value,
.info-content p,
.data-card-body .info-content p {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

/* ============================================
   INFO ICONS
   ============================================ */

.info-icon,
.info-icon-success,
.info-icon-warning {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-base);
  transition: all var(--transition-base);
}

.info-icon {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.info-icon-success {
  background: var(--color-success-light);
  color: var(--color-success-dark);
}

.info-icon-warning {
  background: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.info-card-avatar {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  font-size: var(--font-size-2xl);
  box-shadow: var(--shadow-lg);
}

.detail-card-meta {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .card,
  .info-card,
  .data-card {
    padding: var(--spacing-md);
  }

  .info-row {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .info-row label {
    min-width: auto;
  }

  .info-card-avatar {
    display: none;
  }
}
```

---

## 📄 components.css
**Path:** `components/components.css`

```
/* ============================================
   COMPONENTS - Composants de base réutilisables
   Boutons, Badges, Formulaires de base
   ============================================ */

/* ============================================
   BUTTONS
   ============================================ */

/* BASE BUTTON */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  text-decoration: none;
  line-height: var(--line-height-normal);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:active:not(:disabled) {
  transform: scale(0.98);
}

/* BUTTON SIZES */
.btn-sm {
  padding: 6px var(--spacing-sm);
  font-size: var(--font-size-xs);
  gap: 6px;
  height: 36px;
}

.btn-md {
  padding: var(--spacing-sm) var(--spacing-lg);
  height: 42px;
}

/* BUTTON VARIANTS - SOLID */
.btn-primary {
  background-image: var(--gradient-primary);
  color: var(--color-white);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background-image: var(--gradient-secondary);
  color: var(--color-white);
}

.btn-secondary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(113, 128, 150, 0.4);
}

.btn-success {
  background-image: var(--gradient-success);
  color: var(--color-white);
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
}

.btn-danger {
  background-image: var(--gradient-danger);
  color: var(--color-white);
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.4);
}

/* BUTTON VARIANTS - OUTLINE */
.btn-outline-primary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-outline-primary:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-white);
}

.btn-outline-secondary {
  background: transparent;
  color: var(--color-text-muted);
  border: 2px solid var(--color-border-dark);
}

.btn-outline-secondary:hover:not(:disabled) {
  background: rgba(108, 117, 125, 0.1);
  border-color: var(--color-secondary);
  color: var(--color-secondary);
  transform: translateY(-1px);
}

/* BUTTON VARIANTS - GHOST */
.btn-ghost {
  background: none;
  border: none;
  color: var(--color-text-muted);
  padding: var(--spacing-xs);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--color-bg-hover);
  color: var(--color-text);
}

/* MODERN BUTTONS */
.btn-modern {
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  color: var(--color-text-muted);
  padding: var(--spacing-xs) var(--spacing-lg);
}

.btn-modern.danger {
  background: var(--color-danger-light);
  color: var(--color-danger-medium-dark);
  border: 2px solid var(--color-danger-medium-dark);
}

.btn-modern.danger:hover:not(:disabled) {
  background: var(--color-danger);
  border-color: 2px var(--color-danger);
  color: var(--color-white);
}

/* ICON BUTTONS */
.btn-icon-modern {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
  color: var(--color-text-muted);
  font-size: var(--spacing-md);
  padding: 0;
}

.btn-icon-modern:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
  transform: scale(1.1);
}

.btn-icon-modern.success {
  background: var(--color-success-light);
  border-color: var(--color-success-light);
  color: var(--color-success-medium-dark);
}

.btn-icon-modern.success:hover:not(:disabled) {
  background: var(--color-success-medium);
  border-color: var(--color-success-medium);
  color: var(--color-white);
}

.btn-icon-modern.danger {
  background: var(--color-danger-light);
  border-color: var(--color-danger-light);
  color: var(--color-danger-medium-dark);
}

.btn-icon-modern.danger:hover:not(:disabled) {
  background: var(--color-danger);
  border-color: var(--color-danger);
  color: var(--color-white);
}

/* CLOSE BUTTON */
.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: background-color var(--transition-base);
  color: var(--color-text-muted);
  flex-shrink: 0;
  font-size: var(--spacing-lg);
  width: 36px;
  height: 36px;
}

.btn-close:hover {
  background: var(--color-bg-hover);
  color: var(--color-text);
}

/* BUTTON GROUPS */
.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

/* ============================================
   BADGES
   ============================================ */

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px var(--spacing-sm);
  border-radius: var(--radius-xl);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--color-white);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.badge.clickable {
  cursor: pointer;
}

.badge.clickable:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* DOMAIN BADGES – HORSES */
.badge[data-type='pony'] {
  background: var(--gradient-pony);
}

.badge[data-type='horse'] {
  background: var(--gradient-horse);
}

/* DOMAIN BADGES – OWNERS */
.badge[data-type='laury'] {
  background: var(--gradient-laury);
}

.badge[data-type='private_owner'] {
  background: var(--gradient-owner);
}

.badge[data-type='club'] {
  background: var(--gradient-club);
}

.badge[data-type='other'] {
  background: var(--gradient-other);
}

/* DOMAIN BADGES – RIDERS */
.badge[data-type='owner'] {
  background: var(--gradient-rider-owner);
}

.badge[data-type='loaner'] {
  background: var(--gradient-rider-loaner);
}

/* DOMAIN BADGES – PAIRINGS */
.badge[data-type='own'] {
  background: var(--gradient-pairing-own);
}

.badge[data-type='loan'] {
  background: var(--gradient-pairing-loan);
}

/* STATUS BADGES */
.badge[data-type='active'] {
  background: var(--gradient-status-active);
}

.badge[data-type='inactive'] {
  background: var(--gradient-status-inactive);
}

.badge[data-type='pending'] {
  background: var(--gradient-warning);
}

.badge[data-type='confirmed'] {
  background: var(--gradient-info);
}

.badge[data-type='cancelled'] {
  background: var(--gradient-danger);
}

/* EVENT TYPE BADGES */
.badge[data-type='private_lesson'] {
  background: var(--gradient-event-private-lesson);
}

.badge[data-type='grouped_lesson'] {
  background: var(--gradient-event-grouped-lesson);
}

.badge[data-type='competition'] {
  background: var(--gradient-event-competition);
}

.badge[data-type='blocked'] {
  background: var(--gradient-event-blocked);
}

/* NUMBERED BADGES */
.badge[data-type='1'] {
  background-image: var(--gradient-primary);
}

.badge[data-type='2'] {
  background-image: var(--gradient-info);
}

.badge[data-type='3'] {
  background-image: var(--gradient-success);
}

.badge[data-type='4'] {
  background-image: var(--gradient-warning);
}

.badge[data-type='5'] {
  background-image: var(--gradient-danger);
}

.badge[data-type='6'] {
  background-image: var(--gradient-secondary);
}

.badge[data-type='7'] {
  background-image: var(--gradient-pony);
}

.badge[data-type='8'] {
  background-image: var(--gradient-alert-success);
}

.badge[data-type='9'] {
  background-image: var(--gradient-alert-error);
}

.badge[data-type='10'] {
  background-image: var(--gradient-light);
  color: var(--color-text);
}

/* DAY BADGES */
.day-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  padding: 4px 6px;
  border-radius: var(--radius-md);
  font-size: 10px;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  background: var(--gradient-primary);
  color: var(--color-white);
  transition: transform var(--transition-fast);
}

.day-badge.active {
  background: var(--gradient-primary);
}

.day-badge.inactive {
  background: var(--gradient-light);
  color: var(--color-text-muted);
  border: 1px solid var(--color-gray-400);
  opacity: 0.6;
}

.day-badge:hover {
  transform: translateY(-1px);
}

/* COUNT BADGES */
.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--spacing-lg);
  height: var(--spacing-lg);
  padding: 0 var(--spacing-sm);
  background: var(--color-primary-purple);
  color: var(--color-white);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

.count-badge.warning {
  background: var(--color-warning-orange);
  color: var(--color-white);
}

/* ============================================
   FORMS - BASE INPUTS
   ============================================ */

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.form-row {
  display: flex;
  gap: var(--spacing-lg);
}

.form-row .form-group {
  flex: 1;
}

.form-group label,
.form-label {
  display: flex;
  align-items: center;
  padding: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  gap: var(--spacing-xs);
}

.form-label svg {
  font-size: var(--spacing-md);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-sm);
  font-size: var(--font-size-sm);
  border: 1px solid var(--color-gray-400);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
  font-family: inherit;
  background: var(--color-surface);
  color: var(--color-text);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-input:disabled,
.form-select:disabled,
.form-textarea:disabled {
  background: var(--color-bg-tertiary);
  cursor: not-allowed;
  opacity: 0.6;
}

.form-input::placeholder {
  color: var(--color-text-secondary);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-input-md {
  height: 42px;
}

.form-input-sm {
  height: 36px;
  padding: 0 var(--spacing-sm);
  font-size: var(--font-size-sm);
}

/* CHECKBOX & RADIO */
input[type='checkbox'],
input[type='radio'] {
  width: var(--spacing-md);
  height: var(--spacing-md);
  cursor: pointer;
}

.checkbox-group,
.radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.checkbox-item,
.radio-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* DATE & TIME INPUTS */
input[type='date'],
input[type='time'],
input[type='datetime-local'] {
  width: 100%;
  padding: var(--spacing-sm);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-family: inherit;
  transition: all var(--transition-base);
  background: var(--color-surface);
}

input[type='date']:focus,
input[type='time']:focus,
input[type='datetime-local']:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* REQUIRED INDICATOR */
.required {
  color: var(--color-danger);
  margin-left: 2px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .btn {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-xs);
  }

  .btn-sm {
    padding: 5px 10px;
    font-size: 12px;
  }

  .btn-group .btn {
    flex: 1;
  }

  .badge {
    font-size: 10px;
    padding: 3px var(--spacing-sm);
  }

  .day-badge {
    min-width: 28px;
    padding: 3px 5px;
    font-size: 9px;
  }

  .form-row {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
```

---

## 📄 error-boundary.css
**Path:** `components/error-boundary.css`

```
/* ============================================
   ERROR BOUNDARY
   Styles pour le composant ErrorBoundary
   ============================================ */

.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: var(--gradient-primary);
}

.error-boundary-content {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-3xl);
  max-width: 600px;
  width: 100%;
  box-shadow: var(--shadow-2xl);
  text-align: center;
}

.error-boundary-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
}

.error-boundary-content h1 {
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-2xl);
}

.error-boundary-message {
  color: var(--color-gray-600);
  margin-bottom: var(--spacing-xl);
  line-height: var(--line-height-relaxed);
}

.error-boundary-details {
  text-align: left;
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-md);
  background: var(--color-gray-50);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.error-boundary-details summary {
  cursor: pointer;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.error-boundary-details summary:hover {
  color: var(--color-primary-dark);
}

.error-boundary-stack {
  margin-top: var(--spacing-md);
}

.error-boundary-stack h3 {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin: var(--spacing-md) 0 var(--spacing-xs) 0;
}

.error-boundary-stack pre {
  background: var(--color-white);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  overflow-x: auto;
  font-size: var(--font-size-xs);
  line-height: var(--line-height-normal);
  color: var(--color-danger);
  border: 1px solid var(--color-border);
}

.error-boundary-count {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-warning-light);
  border: 1px solid var(--color-warning);
  border-radius: var(--radius-md);
  color: var(--color-warning-dark);
  font-size: var(--font-size-sm);
}

@media (max-width: 768px) {
  .error-boundary-content {
    padding: var(--spacing-xl);
  }

  .error-boundary-content h1 {
    font-size: var(--font-size-xl);
  }
}
```

---

## 📄 filters.css
**Path:** `components/filters.css`

```
/* ============================================
   FILTERS - Systèmes de filtrage
   Filter sections, pills, buttons
   ============================================ */

/* ============================================
   FILTER SECTION
   ============================================ */

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* ============================================
   FILTER PILLS
   ============================================ */

.filter-pills {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  padding: var(--spacing-sm);
  background: rgba(102, 126, 234, 0.05);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.pill {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface);
  color: var(--color-text);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
}

.pill:hover:not(.pill-active) {
  border-color: var(--color-primary-light);
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-1px);
}

.pill.pill-active {
  background: var(--gradient-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .filter-buttons {
    justify-content: center;
  }

  .filter-pills {
    justify-content: center;
    padding: 10px;
  }

  .pill {
    padding: 6px var(--spacing-sm);
    font-size: var(--font-size-xs);
  }
}
```

---

## 📄 form-controls.css
**Path:** `components/form-controls.css`

```
/* ============================================
   FORM CONTROLS - Contrôles avancés
   Segmented controls, inline forms, validation, actions
   ============================================ */

/* ============================================
   SEGMENTED CONTROL
   ============================================ */

.segmented-control {
  display: inline-flex;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-gray-300);
  background: var(--color-gray-100);
}

.segment-btn {
  flex: 1;
  padding: 10px 16px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  background: var(--color-white);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  color: var(--color-gray-700);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.segment-btn:not(:last-child) {
  border-right: 1px solid var(--color-gray-300);
}

.segment-btn:hover:not(:disabled) {
  background: var(--color-gray-150);
}

.segment-btn.active {
  background-image: var(--gradient-primary);
  color: var(--color-white);
  font-weight: var(--font-weight-semibold);
  box-shadow: inset 0 0 0 1px var(--color-primary-dark);
}

.segment-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.segment-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ============================================
   FORM BUTTONS PRIMARY
   ============================================ */

.form-btn-primary {
  padding: var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  background: var(--color-white);
  border: 1px solid var(--color-gray-300);
  cursor: pointer;
  transition: all var(--transition-base);
  color: var(--color-gray-700);
  gap: var(--spacing-sm);
}

.form-btn-primary:hover {
  color: var(--color-primary-light);
  font-weight: var(--font-weight-semibold);
  border: 1px solid var(--color-primary-light);
  background: var(--color-gray-100);
}

.form-btn-primary.active {
  background-image: var(--gradient-primary);
  color: var(--color-white);
  font-weight: var(--font-weight-semibold);
  box-shadow: inset 0 0 0 1px var(--color-primary-dark);
  border: none;
}

/* ============================================
   INLINE FORM GROUP
   ============================================ */

.inline-form-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin: var(--spacing-xs) 0;
}

.inline-form-group label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  margin-bottom: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.inline-form-group input,
.inline-form-group select {
  flex: 1;
  height: 36px;
  padding: 0 var(--spacing-sm);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-base);
}

.inline-form-group input:focus,
.inline-form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* ============================================
   DATE INPUT WRAPPER
   ============================================ */

.date-input-wrapper {
  display: grid;
  align-items: center;
}

.date-input-wrapper label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.date-input-wrapper label svg {
  color: var(--color-primary);
  font-size: var(--font-size-md);
}

.date-input-helper {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
}

.date-input-helper svg {
  font-size: var(--font-size-sm);
  color: var(--color-info);
}

/* ============================================
   FORM VALIDATION
   ============================================ */

.form-input.is-invalid,
.form-select.is-invalid,
.form-textarea.is-invalid,
.form-input.error,
.form-select.error,
.form-textarea.error {
  border-color: var(--color-danger);
}

.form-input.is-invalid:focus,
.form-select.is-invalid:focus,
.form-textarea.is-invalid:focus,
.form-input.error:focus,
.form-select.error:focus,
.form-textarea.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.entity-form .form-input.error,
.entity-form .form-select.error,
.entity-form .form-textarea.error {
  background: var(--color-danger-light);
}

.form-input.is-valid,
.form-select.is-valid,
.form-textarea.is-valid {
  border-color: var(--color-success);
}

.form-input.is-valid:focus,
.form-select.is-valid:focus,
.form-textarea.is-valid:focus {
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.invalid-feedback,
.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-danger);
  font-weight: var(--font-weight-medium);
}

.error-message svg {
  flex-shrink: 0;
  font-size: var(--font-size-sm);
}

/* ============================================
   FORM ERROR
   ============================================ */

.form-error {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-danger-light);
  color: var(--color-danger-dark);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  border-left: 4px solid var(--color-danger);
}

/* ============================================
   HELPER TEXT
   ============================================ */

.form-helper-text,
.form-help {
  display: block;
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.form-help {
  color: var(--color-gray-600);
  font-style: italic;
}

/* ============================================
   FORM ACTIONS
   ============================================ */

.form-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
  align-items: center;
}

.form-actions-end {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  padding-top: var(--spacing-lg);
  border-top: 2px solid var(--color-border-light);
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .segmented-control {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .segmented-control .segment-btn {
    width: 100%;
    justify-content: center;
  }

  .inline-form-group {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .inline-form-group label {
    width: 100%;
  }

  .inline-form-group input,
  .inline-form-group select {
    width: 100%;
  }

  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .form-actions .btn {
    width: 100%;
  }
}
```

---

## 📄 form-layouts.css
**Path:** `components/form-layouts.css`

```
/* ============================================
   FORM LAYOUTS - Structures de formulaires
   Layouts communs entre Horse, Rider, etc.
   ============================================ */

/* ============================================
   ENTITY FORM CONTAINER
   ============================================ */

.entity-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* ============================================
   FORM SECTIONS
   ============================================ */

.form-section {
  background: var(--gradient-light);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);
  margin-bottom: var(--spacing-md);
}

.form-section:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-light);
}

.form-section h2,
.form-section h3 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  margin: 0 0 var(--spacing-md) 0;
  padding-bottom: var(--spacing-sm);
}

.entity-form .form-section h3 {
  border-bottom: 2px solid var(--color-gray-150);
}

.form-section-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-gray-150);
}

.form-section-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  border-radius: var(--radius-md);
  color: var(--color-white);
  font-size: var(--font-size-md);
}

.form-section-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
}

/* ============================================
   FORM GROUPS IN ENTITY FORMS
   ============================================ */

.entity-form .form-group {
  margin-bottom: var(--spacing-md);
}

.entity-form .form-group:last-child {
  margin-bottom: 0;
}

/* ============================================
   SEGMENTED CONTROL IN FORMS
   ============================================ */

.entity-form .segmented-control {
  margin-top: var(--spacing-xs);
}

/* ============================================
   FORM FOOTER (actions)
   ============================================ */

.entity-form .modal-footer {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 2px solid var(--color-border-light);
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .form-section {
    padding: var(--spacing-md);
  }

  .entity-form .form-section h3 {
    font-size: var(--font-size-sm);
  }

  .entity-form .modal-footer {
    margin-top: var(--spacing-lg);
  }
}
```

---

## 📄 layouts.css
**Path:** `components/layouts.css`

```
/* ============================================
   LAYOUTS - Structures de page
   Headers, sections, dividers
   ============================================ */

/* ============================================
   HEADERS
   ============================================ */

header {
  background: var(--color-bg-card);
  backdrop-filter: blur(10px);
  color: var(--color-text);
  padding: var(--spacing-lg) 0;
  margin-bottom: var(--spacing-2xl);
  box-shadow: var(--shadow-sm);
  border-bottom: 3px solid var(--color-primary);
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

header h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.header-actions-group {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-left: auto;
}

/* Navigation */
nav {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

nav a {
  color: var(--color-text-muted);
  text-decoration: none;
  padding: var(--spacing-sm) var(--spacing-md);
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
  background: var(--gradient-primary);
  color: var(--color-white);
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

/* ============================================
   PAGE HEADER
   ============================================ */

.page-header {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
}

.page-header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.page-header h2 {
  margin: 0;
  font-size: clamp(1.25rem, 5vw, var(--font-size-2xl));
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  position: relative;
}

/* ============================================
   SECTION HEADER
   ============================================ */

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0;
}

.section-icon {
  color: var(--color-primary);
  font-size: var(--spacing-md);
}

/* ============================================
   SECTIONS
   ============================================ */

.section {
  margin-bottom: var(--spacing-xl);
}

/* ============================================
   DIVIDERS
   ============================================ */

.section-divider {
  height: 2px;
  background: var(--gradient-primary);
  border: none;
  margin: var(--spacing-xl) 0;
  border-radius: var(--radius-full);
}

.section-divider-light {
  height: 1px;
  background: var(--color-border);
  border: none;
  margin: var(--spacing-lg) 0;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  header .container {
    flex-direction: column;
    align-items: stretch;
  }

  header h1 {
    text-align: center;
    font-size: var(--font-size-2xl);
  }

  nav {
    justify-content: center;
  }

  .page-header-title {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}
```

---

## 📄 list-items.css
**Path:** `components/list-items.css`

```
/* ============================================
   LIST ITEMS - Éléments de liste
   Participants, pairings, packages
   ============================================ */

/* ============================================
   PAIRINGS LIST
   ============================================ */

.pairings-list-modern {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* ============================================
   PARTICIPANT / PAIRING ROW
   ============================================ */

.participant-row,
.pairing-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.participant-row:hover,
.pairing-row:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-primary-light);
  transform: translateX(2px);
}

.participant-info,
.pairing-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-width: 0;
}

.participant-header,
.pairing-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.participant-header span:first-child,
.pairing-header span:first-child {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.participant-days,
.pairing-days {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.participant-actions,
.pairing-actions {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
  flex-shrink: 0;
}

/* ============================================
   PACKAGE ITEM
   ============================================ */

.package-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.package-item:hover {
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-sm);
  transform: translateX(2px);
}

.package-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
}

.package-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .pairing-item-modern {
    flex-direction: column;
    align-items: flex-start;
  }

  .pairing-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
```

---

## 📄 modals.css
**Path:** `components/modals.css`

```
/* ============================================
   MODALS - Fenêtres modales
   Overlay, structure, tailles, sections
   ============================================ */

/* ============================================
   MODAL BASE
   ============================================ */

/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal-backdrop);
  padding: var(--spacing-xs);
}

/* Modal Container */
.modal {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn var(--transition-slow);
  width: 100%;
  max-width: 100%;
  margin: auto;
}

/* ============================================
   MODAL SIZES
   ============================================ */

.modal--sm {
  max-width: 400px;
}

.modal--md {
  max-width: 600px;
}

.modal--lg {
  max-width: 900px;
}

.modal--xl {
  max-width: 1400px;
}

/* ============================================
   MODAL CONTENT
   ============================================ */

.modal-content {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn var(--transition-slow);
  width: 100%;
}

/* ============================================
   MODAL SECTIONS
   ============================================ */
/* Header flexible pour toutes les modales */
.modal-header.modal-header-flex {
  display: flex;
  align-items: center;
  justify-content: space-between; /* titre à gauche, actions à droite */
  gap: var(--spacing-md);
}

/* Si tu as un groupe de boutons dans le header */
.modal-header .header-actions-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
  min-width: 0;
}

.modal-header,
.modal-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-sm);
}

.modal-header {
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
  gap: var(--spacing-md);
  width: 100%;
}

.modal-header h2,
.modal-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
}

.modal-header h2 svg,
.modal-header h2 i,
.modal-header h3 svg,
.modal-header h3 i {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Modal Title Variants */
.modal-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--color-text);
}

.modal-title-warning {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-danger);
}

.modal-header-text {
  flex: 1;
  min-width: 0;
}

.modal-header-text h2 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.modal-body {
  flex: 1;
  padding: var(--spacing-md);
  overflow-y: auto;
}

.modal-content-scrollable {
  padding: var(--spacing-xs);
}

.modal-footer {
  justify-content: flex-end;
  padding: var(--spacing-md) var(--spacing-xl);
  border-top: 1px solid var(--color-border);
  gap: var(--spacing-sm);
}

/* ============================================
   MODAL TABS
   ============================================ */

.modal-tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--color-gray-200);
  padding: 0 var(--spacing-xl);
}

.modal-tabs .modal-tab {
  background: none;
  border: none;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
  border-bottom: 2px solid transparent;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-tabs .modal-tab:hover {
  color: var(--color-primary);
}

.modal-tabs .modal-tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* ============================================
   MODAL STATES
   ============================================ */

.modal-loading,
.modal-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.modal-loading p,
.modal-error p {
  margin-top: var(--spacing-sm);
  color: var(--color-gray-600);
}

.modal-error h3 {
  margin: var(--spacing-md) 0 var(--spacing-sm);
  color: var(--color-danger);
}

/* ============================================
   MODAL CARD SPECIFIC
   ============================================ */

.modal-card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.modal-card-avatar {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  font-size: var(--font-size-2xl);
  flex-shrink: 0;
  box-shadow: var(--shadow-lg);
}

.modal-card-meta {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.modal-card-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-left: auto;
}

.modal-card-content {
  padding: var(--spacing-lg);
}

.modal-card-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.modal-card-sidebar,
.modal-card-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 992px) {
  .modal-card-grid {
    grid-template-columns: 1fr;
  }

  .modal-card-sidebar {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .modal {
    max-width: 95vw;
  }

  .modal-header {
    flex-wrap: wrap;
    padding: var(--spacing-md) var(--spacing-lg);
  }

  .modal-footer {
    flex-direction: column;
    align-items: stretch;
    padding: var(--spacing-md) var(--spacing-lg);
  }

  .modal-body {
    padding: var(--spacing-sm);
  }

  .modal-card-content {
    padding: var(--spacing-md);
  }

  .modal-card-sidebar {
    grid-template-columns: 1fr;
  }

  .modal-card-avatar {
    display: none;
  }

  .modal-card-header {
    flex-wrap: wrap;
  }
}
```

---

## 📄 tables.css
**Path:** `components/tables.css`

```
/* ============================================
   TABLES & LISTS - Tableaux et vues liste
   Tables de base, tables de données, statistiques
   ============================================ */

/* ============================================
   BASE TABLE
   ============================================ */

.table-container {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
}

.table thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background-image: var(--gradient-light);
}

.table th {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  color: var(--color-gray-650);
  border-bottom: 1px solid var(--color-border-dark);
}

.table td {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  text-align: center;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr:hover {
  background: var(--color-bg-hover);
}

.table-actions,
.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
}

.row-clickable {
  position: relative;
  cursor: pointer;
  transition: all var(--transition-base);
}

.row-clickable:hover {
  cursor: pointer;
  background: var(--color-bg-hover);
  transform: translateX(2px);
}

/* ============================================
   DATA TABLE (Statistics & Advanced)
   ============================================ */

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.data-table.compact {
  font-size: var(--font-size-xs);
}

/* Table Headers */
.data-table thead {
  background: var(--color-bg-secondary);
  border-bottom: 2px solid var(--color-border-dark);
}

.data-table th {
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-700);
  text-align: left;
  white-space: nowrap;
}

.table-header-sticky {
  position: sticky;
  left: 0;
  background: var(--color-bg-secondary);
  z-index: 2;
  min-width: 150px;
}

.table-header-center {
  text-align: center;
  align-content: center;
}

.table-header-left {
  text-align: left;
}

.table-header-accent {
  background: var(--color-primary-light);
  color: var(--color-white);
}

/* Table Body */
.data-table tbody tr {
  border-bottom: 1px solid var(--color-border);
  transition: background-color var(--transition-fast);
}

.data-table tbody tr:hover {
  background: var(--color-bg-secondary);
}

.data-table tbody tr:last-child {
  border-bottom: none;
}

.data-table td {
  padding: var(--spacing-sm) var(--spacing-md);
}

/* Table Cells */
.table-cell-name {
  position: sticky;
  left: 0;
  background: var(--color-surface);
  z-index: 1;
  font-weight: var(--font-weight-medium);
}

.data-table tbody tr:hover .table-cell-name {
  background: var(--color-bg-secondary);
}

.table-cell-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.table-cell-content svg {
  width: 16px;
  height: 16px;
  color: var(--color-gray-500);
  flex-shrink: 0;
}

.table-cell-center {
  text-align: center;
}

.table-cell-left {
  text-align: left;
}

.table-cell-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
}

.table-cell-accent {
  background: var(--color-primary-light);
  font-weight: var(--font-weight-semibold);
  color: var(--color-white);
}

/* Count Pills */
.count-pill {
  display: inline-block;
  min-width: 24px;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-align: center;
}

.count-pill.active {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.count-pill.empty {
  color: var(--color-gray-400);
}

.count-total {
  color: var(--color-primary);
  font-size: var(--font-size-base);
}

/* Total Row */
.table-row-total {
  border-top: 2px solid var(--color-border-dark);
  background: var(--color-bg-secondary);
  font-weight: var(--font-weight-semibold);
}

.table-row-total:hover {
  background: var(--color-bg-secondary) !important;
}

/* ============================================
   LIST VIEWS
   ============================================ */

/* List Header */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.list-header h2 {
  margin: 0;
}

.list-header-actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

/* Filter Section */
.list-filters {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

/* Messages Section */
.list-messages {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

/* Count Badge Interactive */
.count-badge-interactive {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px var(--spacing-sm);
  background: var(--gradient-info);
  color: var(--color-white);
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-base);
  cursor: default;
}

.count-badge-interactive.clickable {
  cursor: pointer;
}

.count-badge-interactive.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

/* Days Cell */
.days-cell {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: var(--spacing-xs) var(--spacing-sm);
}

/* Badges Container */
.badges-cell {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  align-items: center;
  justify-content: center;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .table th,
  .table td {
    padding: var(--spacing-sm) var(--spacing-sm);
  }

  .data-table th,
  .data-table td {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }

  .table-header-sticky,
  .table-cell-name {
    min-width: 100px;
  }

  .list-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .list-header-actions {
    width: 100%;
    flex-direction: column;
  }

  .days-cell {
    gap: 2px;
    padding: 2px;
    flex-wrap: wrap;
  }

  .table-container {
    border-radius: 0;
    margin: 0 calc(-1 * var(--spacing-md));
  }
}

@media (max-width: 640px) {
  .table thead {
    display: none;
  }

  .table tbody tr td.table-actions {
    display: none;
  }

  .table tbody tr {
    display: block;
    background: var(--color-surface);
    margin-bottom: var(--spacing-md);
    padding: var(--spacing-md);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--color-border-light);
  }

  .table tbody tr td {
    display: flex;
    padding: var(--spacing-xs) 0;
    border-bottom: 1px solid var(--color-bg-tertiary);
    justify-content: flex-start;
    text-align: left;
    gap: var(--spacing-sm);
  }

  .table tbody tr td:last-child {
    border-bottom: none;
  }

  .table tbody tr td::before {
    content: attr(data-label);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-muted);
    margin-right: var(--spacing-md);
    flex-shrink: 0;
  }
}
```

---

## 📄 calendar-actions-mobile.css
**Path:** `features/calendar/calendar-actions-mobile.css`

```
/* ============================================
   MOBILE CALENDAR ACTIONS - FULLY VARIABLE
   ============================================ */

/* MOBILE ACTION BAR - Fixed Bottom */
.mobile-calendar-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: none; /* Hidden by default, shown on mobile */
  align-items: center;
  justify-content: space-around;
  background: var(--color-surface);
  border-top: 0.5px solid var(--color-border-light);
  padding: var(--spacing-xs) var(--spacing-md);
  padding-bottom: calc(var(--spacing-xs) + env(safe-area-inset-bottom, 0px));
  box-shadow: var(--shadow-md);
  z-index: var(--z-mobile-action-bar);
  gap: var(--spacing-sm);
}

/* MOBILE ACTION BUTTONS */
.mobile-action-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--mobile-action-btn-gap);
  min-width: var(--mobile-action-btn-size);
  min-height: var(--mobile-action-btn-size);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: transparent;
  border: none;
  border-radius: var(--radius-lg);
  color: var(--color-text-muted);
  font-size: var(--font-size-2xl);
  cursor: pointer;
  transition: all var(--transition-base);
  -webkit-tap-highlight-color: transparent;
}

/* BUTTON ACTIVE STATE */
.mobile-action-btn:active {
  transform: scale(0.95);
  background: var(--color-bg-tertiary);
}

/* LABELS */
.mobile-action-label {
  font-size: var(--mobile-action-label-font);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  white-space: nowrap;
  color: var(--color-text-muted);
}

/* PRIMARY BUTTON */
.mobile-action-btn.primary {
  background: var(--mobile-action-btn-primary-bg);
  color: var(--color-white);
  box-shadow: var(--shadow-mobile-btn-primary);
  flex: 0 0 auto;
  min-width: var(--mobile-action-btn-size);
  min-height: var(--mobile-action-btn-size);
  border-radius: var(--radius-full);
  padding: 0;
}

.mobile-action-btn.primary .mobile-action-label {
  display: none; /* No label for primary button */
}

.mobile-action-btn.primary:active {
  transform: scale(0.95);
  box-shadow: var(--shadow-mobile-btn-primary-active);
}

/* DANGER BUTTON */
.mobile-action-btn.danger {
  background: var(--mobile-action-btn-danger-bg);
  color: var(--color-white);
  box-shadow: var(--shadow-mobile-btn-danger);
}

.mobile-action-btn.danger .mobile-action-label {
  color: var(--color-white);
}

.mobile-action-btn.danger:active {
  background: var(--mobile-action-btn-danger-active-bg);
  box-shadow: var(--shadow-mobile-btn-danger-active);
}

/* ============================================
   RESPONSIVE - SHOW ON MOBILE
   ============================================ */
@media (max-width: 768px) {
  .mobile-calendar-actions {
    display: flex;
  }

  /* Hide desktop filters on mobile */
  .calendar-filters {
    display: none !important;
  }

  /* Adjust calendar view to account for bottom bar */
  .mobile-calendar-view {
    padding-bottom: calc(var(--mobile-action-bar-height) + env(safe-area-inset-bottom, 0px));
  }
}

@media (max-width: 480px) {
  .mobile-action-btn {
    min-width: var(--mobile-action-btn-size-sm);
    min-height: var(--mobile-action-btn-size-sm);
    font-size: var(--font-size-xl);
    gap: var(--mobile-action-btn-gap);
  }

  .mobile-action-label {
    font-size: var(--mobile-action-label-font-sm);
  }
}

/* Safe area support */
@supports (padding: max(0px)) {
  .mobile-calendar-actions {
    padding-bottom: max(
      var(--spacing-xs),
      calc(var(--spacing-xs) + env(safe-area-inset-bottom, 0px))
    );
  }
}
```

---

## 📄 calendar-base.css
**Path:** `features/calendar/calendar-base.css`

```
/* ============================================
   CALENDAR BASE STYLES - FULLY VARIABLE
   ============================================ */

/* Optional additional variables for calendar (add to :root) */
:root {
  --calendar-bg: var(--color-surface);
  --calendar-padding: var(--spacing-lg);
  --calendar-gap: var(--spacing-md);
  --calendar-radius: var(--radius-lg);
  --calendar-header-title-size: var(--font-size-xl);
  --calendar-header-title-color: var(--color-text);
  --calendar-filter-bg: rgba(255, 255, 255, 0.7);
  --calendar-filter-border: var(--color-border);
  --calendar-loading-height: 400px;
  --calendar-loading-icon-size: 32px;
  --calendar-empty-icon-size: 48px;
  --calendar-empty-icon-opacity: 0.3;
  --calendar-empty-padding-vertical: var(--spacing-3xl);
  --calendar-empty-padding-horizontal: var(--spacing-xl);
  --calendar-empty-message-font: 17px;
  --calendar-empty-message-weight: 400;
  --calendar-error-color: var(--color-danger);
}

/* ============================================
   MAIN CONTAINER
   ============================================ */
.calendar-view {
  display: flex;
  flex-direction: column;
  gap: var(--calendar-gap);
  height: 100%;
  background: var(--calendar-bg);
  padding: var(--calendar-padding);
  border-radius: var(--calendar-radius);
}

/* ============================================
   CALENDAR HEADER (Navigation semaine)
   ============================================ */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--calendar-gap);
  flex-wrap: wrap;
  gap: var(--calendar-gap);
}

.calendar-header__title {
  margin: 0;
  font-size: var(--calendar-header-title-size);
  font-weight: var(--font-weight-semibold);
  color: var(--calendar-header-title-color);
}

.calendar-header__nav {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

/* ============================================
   CALENDAR FILTERS (Desktop only)
   ============================================ */
.calendar-filters {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-lg);
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  background: var(--calendar-filter-bg);
  backdrop-filter: blur(8px);
  border: 1px solid var(--calendar-filter-border);
  border-radius: var(--calendar-radius);
  padding: var(--spacing-sm);
}

.calendar-filters__group {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
  flex-wrap: wrap;
}

.calendar-filters__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.calendar-filters__item label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  white-space: nowrap;
}

.calendar-filters__item .form-select {
  min-width: 140px;
}

.calendar-filters__actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

/* ============================================
   LOADING & ERROR STATES
   ============================================ */
.calendar-loading,
.calendar-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: var(--calendar-loading-height);
  gap: var(--calendar-gap);
  color: var(--color-gray-500);
}

.calendar-loading__spinner {
  font-size: var(--calendar-loading-icon-size);
  animation: spin 1s linear infinite;
}

.calendar-error__icon {
  font-size: var(--calendar-loading-icon-size);
  color: var(--calendar-error-color);
}

.calendar-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--calendar-empty-padding-vertical) var(--calendar-empty-padding-horizontal);
  text-align: center;
  color: var(--color-text-light);
}

.calendar-empty-state__icon {
  font-size: var(--calendar-empty-icon-size);
  opacity: var(--calendar-empty-icon-opacity);
  margin-bottom: var(--calendar-gap);
}

.calendar-empty-state__message {
  margin: 0;
  font-size: var(--calendar-empty-message-font);
  font-weight: var(--calendar-empty-message-weight);
}

.calendar-empty-state--mobile {
  margin-top: var(--spacing-2xl);
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
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
  .calendar-view {
    padding: 0;
    gap: 0;
    height: 100%;
    overflow: hidden;
  }

  .calendar-header {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-surface);
    border-bottom: 0.5px solid var(--color-border-light);
  }

  .calendar-filters {
    display: none !important;
  }
}
```

---

## 📄 calendar-complete.css
**Path:** `features/calendar/calendar-complete.css`

```
/* ============================================
   CALENDAR COMPLETE - VARIABLE-DRIVEN
   ============================================ */

/* ============================================
   VARIABLES (add these in :root)
   ============================================ */
:root {
  /* Spacing & sizing */
  --calendar-gap: var(--spacing-md);
  --calendar-padding: var(--spacing-md);
  --calendar-radius: var(--radius-lg);
  --hour-height: 60px;
  --day-header-height: 40px;
  --all-day-section-height: 48px;

  /* Colors */
  --calendar-bg: var(--color-white);
  --calendar-surface: var(--color-surface);
  --calendar-bg-secondary: var(--color-gray-50);
  --calendar-border: var(--color-border);
  --calendar-border-dark: var(--color-border-dark);
  --calendar-text: var(--color-gray-900);
  --calendar-text-light: var(--color-gray-500);
  --calendar-disabled: var(--color-gray-100);
  --color-primary-light: var(--color-primary);
  --color-white: #ffffff;
  --color-danger-red: var(--color-danger);

  /* Fonts */
  --calendar-font-xs: var(--font-size-xs);
  --calendar-font-sm: var(--font-size-sm);
  --calendar-font-md: var(--font-size-md);
  --calendar-font-lg: var(--font-size-lg);
  --calendar-font-xl: var(--font-size-xl);
  --calendar-font-weight-normal: 400;
  --calendar-font-weight-medium: 500;
  --calendar-font-weight-semibold: 600;
  --calendar-font-weight-bold: 700;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 2px 8px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 4px 12px rgba(0, 0, 0, 0.2);

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #9b51e0 100%);
  --gradient-info: linear-gradient(135deg, #4299e1 0%, #5da9e9 100%);
  --gradient-warning: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  --gradient-secondary: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
  --gradient-light: linear-gradient(to bottom, var(--color-white), var(--calendar-bg-secondary));

  /* Selection */
  --selection-color: rgba(66, 153, 225, 0.1);
  --selection-border: rgba(66, 153, 225, 0.3);
}

/* ============================================
   DESKTOP - ALL-DAY SLOTS
   ============================================ */
.all-day-section {
  height: var(--all-day-section-height);
  min-height: var(--all-day-section-height);
  padding: var(--spacing-xs);
  background: var(--calendar-bg-secondary);
  border-bottom: 1px solid var(--calendar-border);
  overflow: hidden;
  position: relative;
}

.all-day-slots {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  height: 100%;
}

.all-day-slot-card {
  flex: 1;
  min-width: 0;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  color: var(--color-white);
  font-size: var(--calendar-font-xs);
  font-weight: var(--calendar-font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  overflow: hidden;
}

.all-day-slot-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.all-day-slot-card[data-type='private_lesson'] {
  background: var(--gradient-info);
}
.all-day-slot-card[data-type='grouped_lesson'] {
  background: var(--gradient-primary);
}
.all-day-slot-card[data-type='competition'] {
  background: var(--gradient-warning);
}
.all-day-slot-card[data-type='blocked'] {
  background: var(--gradient-secondary);
  opacity: 0.8;
}

.all-day-slot-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 0;
}

.all-day-slot-status-icon {
  font-size: var(--calendar-font-sm);
  flex-shrink: 0;
}
.all-day-slot-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ============================================
   DESKTOP - FULL HEIGHT SLOTS
   ============================================ */
.full-height-slots-container {
  position: absolute;
  top: calc(var(--day-header-height) + var(--all-day-section-height));
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 15;
  padding: var(--spacing-xs);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  pointer-events: none;
}

.full-height-slot-card {
  flex: 1;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  color: var(--color-white);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  pointer-events: auto;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.full-height-slot-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
  border-color: rgba(255, 255, 255, 0.5);
}

.full-height-slot-card[data-type='competition'] {
  background: var(--gradient-warning);
}

.full-height-slot-card[data-type='blocked'] {
  background: var(--gradient-secondary);
}

.full-height-slot-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
}
.full-height-slot-icon {
  font-size: var(--spacing-lg);
  flex-shrink: 0;
}
.full-height-slot-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.full-height-slot-type {
  font-size: var(--calendar-font-xs);
  opacity: 0.9;
  text-transform: uppercase;
  font-weight: var(--calendar-font-weight-semibold);
}
.full-height-slot-name {
  font-size: var(--calendar-font-sm);
  font-weight: var(--calendar-font-weight-semibold);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ============================================
   DESKTOP - DAY GRID
   ============================================ */
.day-column {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  border-right: 1px solid var(--calendar-border);
  background: var(--calendar-surface);
}
.day-column:last-child {
  border-right: none;
}
.day-column.today {
  background: linear-gradient(
    to bottom,
    var(--today-bg, var(--color-primary-light)),
    transparent 80px
  );
}
.day-column.past {
  opacity: 0.7;
}
.day-column.invalid {
  background: var(--calendar-disabled);
  opacity: 0.5;
}
.day-column.has-full-height-event .day-grid-container {
  pointer-events: none;
}

.day-grid-container {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}
.day-grid {
  position: relative;
  height: calc((var(--end-hour) - var(--start-hour)) * var(--hour-height));
}

.selection-overlay {
  position: absolute;
  background: var(--selection-color);
  border: 2px solid var(--selection-border);
  border-radius: var(--radius-md);
  pointer-events: none;
  z-index: 5;
}

/* ============================================
   DESKTOP - EVENT CARD
   ============================================ */
.event-card {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  overflow: hidden;
}
.event-card:hover {
  transform: translateY(-1px) scale(1.01);
  box-shadow: var(--shadow-md);
  z-index: 10;
}

/* ============================================
   MOBILE - ACTION BAR & EVENTS (same variables as previous)
   ============================================ */
```

---

## 📄 calendar-desktop.css
**Path:** `features/calendar/calendar-desktop.css`

```
/* ============================================
   CALENDAR DESKTOP STYLES - VARIABLE DRIVEN
   ============================================ */

/* ============================================
   DESKTOP WEEK VIEW
   ============================================ */
.desktop-week-view {
  background: var(--gradient-light);
  border-radius: var(--calendar-radius, var(--radius-lg));
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--calendar-border, var(--color-border));
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.desktop-week-view__grid {
  display: grid;
  grid-template-columns: 64px repeat(7, minmax(0, 1fr));
  width: 100%;
  flex: 1;
  min-height: 0;
  background: var(--calendar-surface, var(--color-surface));
}

/* ============================================
   DESKTOP TIME COLUMN
   ============================================ */
.desktop-time-column {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--calendar-border-dark, var(--color-border-dark));
  background: var(--calendar-bg-secondary, var(--color-bg-secondary));
  position: sticky;
  left: 0;
  z-index: 10;
}

.desktop-time-column__header {
  height: var(--day-header-height);
  min-height: var(--day-header-height);
  border-bottom: 1px solid var(--calendar-border-dark, var(--color-border-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--calendar-font-xs, var(--font-size-xs));
  font-weight: var(--calendar-font-weight-semibold, var(--font-weight-semibold));
  color: var(--calendar-text-light, var(--color-gray-600));
  text-transform: uppercase;
  background: var(--gradient-light);
  position: sticky;
  top: 0;
  z-index: 20;
}

.desktop-time-column__allday-spacer {
  height: var(--all-day-section-height);
  min-height: var(--all-day-section-height);
  border-bottom: 1px solid var(--calendar-border, var(--color-border));
  background: var(--calendar-bg-secondary, var(--color-bg-secondary));
}

.desktop-time-column__slot {
  height: var(--hour-height);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 2px;
  border-bottom: 1px solid var(--calendar-border, var(--color-border));
  font-size: var(--calendar-font-xs, var(--font-size-xs));
  color: var(--calendar-text-light, var(--color-gray-600));
  font-weight: var(--calendar-font-weight-medium, var(--font-weight-medium));
}

/* ============================================
   DESKTOP DAY COLUMN
   ============================================ */
.desktop-day-column {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  border-right: 1px solid var(--calendar-border, var(--color-border));
  background: var(--calendar-surface, var(--color-surface));
}

.desktop-day-column:last-child {
  border-right: none;
}

.desktop-day-column--today {
  background: linear-gradient(
    to bottom,
    var(--today-bg, var(--color-primary-light)),
    transparent 80px
  );
}

.desktop-day-column--past {
  opacity: 0.7;
}

.desktop-day-column__allday-section {
  height: var(--all-day-section-height);
  min-height: var(--all-day-section-height);
  padding: var(--spacing-xs);
  background: var(--calendar-bg-secondary, var(--color-bg-secondary));
  border-bottom: 1px solid var(--calendar-border, var(--color-border));
  overflow: hidden;
  position: relative;
}

.desktop-day-column__full-height {
  position: absolute;
  top: calc(var(--day-header-height) + var(--all-day-section-height));
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 15;
  padding: var(--spacing-xs);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.desktop-day-column__grid-container {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ============================================
   DESKTOP DAY HEADER
   ============================================ */
.desktop-day-header {
  height: var(--day-header-height);
  min-height: var(--day-header-height);
  border-bottom: 1px solid var(--calendar-border-dark, var(--color-border-dark));
  text-align: center;
  background: linear-gradient(
    to bottom,
    var(--calendar-surface, var(--color-surface)),
    var(--calendar-bg-secondary, var(--color-bg-secondary))
  );
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs);
}

.desktop-day-header--today {
  background: var(--gradient-primary);
  color: var(--color-white);
}

.desktop-day-header--invalid {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.desktop-day-header__name {
  font-weight: var(--calendar-font-weight-bold, var(--font-weight-bold));
  font-size: var(--calendar-font-sm, var(--font-size-sm));
  text-transform: capitalize;
}

/* ============================================
   DESKTOP DAY GRID
   ============================================ */
.desktop-day-grid {
  position: relative;
  height: calc((var(--end-hour) - var(--start-hour)) * var(--hour-height));
}

.desktop-day-grid__markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
}

.desktop-day-grid__marker {
  position: absolute;
  left: 0;
  right: 0;
  border-bottom: 1px solid var(--calendar-border, var(--color-border));
}

.desktop-day-grid__marker:last-child {
  border-bottom: none;
}

.desktop-day-grid__selection {
  position: absolute;
  background: var(--selection-color);
  border: 2px solid var(--selection-border);
  border-radius: var(--radius-md);
  pointer-events: none;
  z-index: 5;
}

.desktop-day-grid__events {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
}

.desktop-day-grid__event-wrapper {
  position: absolute;
  width: 100%;
  pointer-events: auto;
}

/* ============================================
   ALL-DAY SLOTS (Desktop)
   ============================================ */
.all-day-slots {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  height: 100%;
}

.full-height-slots {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  height: 100%;
}

/* Card styles are in calendar-slots.css */

/* ============================================
   RESPONSIVE - HIDE ON MOBILE
   ============================================ */
@media (max-width: 768px) {
  .desktop-week-view,
  .desktop-time-column,
  .desktop-day-column {
    display: none !important;
  }
}
```

---

## 📄 calendar-mobile.css
**Path:** `features/calendar/calendar-mobile.css`

```
/* ============================================
   MOBILE CALENDAR VIEW - iOS Style (Variable Driven)
   ============================================ */

.mobile-calendar-view {
  display: none;
  flex-direction: column;
  height: 100%;
  background: var(--calendar-bg, var(--color-gray-50));
  overflow: hidden;
}

.mobile-calendar-view__header {
  background: var(--calendar-header-bg, var(--color-white));
  border-bottom: 1px solid var(--calendar-border-light, rgba(0, 0, 0, 0.1));
  padding: var(--spacing-md) var(--spacing-sm) var(--spacing-sm);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 0 var(--calendar-shadow-light, rgba(0, 0, 0, 0.05));
}

.mobile-calendar-view__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  -webkit-overflow-scrolling: touch;
}

.mobile-calendar-view__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--spacing-md);
  color: var(--calendar-text-muted, var(--color-gray-500));
}

/* ============================================
   MOBILE DAY SELECTOR
   ============================================ */

.mobile-day-selector {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  gap: var(--spacing-xs, 4px);
}

.mobile-day-selector__button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xxs, 4px);
  padding: var(--spacing-xs);
  background: transparent;
  border: none;
  border-radius: var(--calendar-radius-sm, 12px);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 0;
}

.mobile-day-selector__button:active {
  transform: scale(0.95);
}

.mobile-day-selector__button--selected {
  background: var(--calendar-primary-bg, var(--color-primary-light));
}

.mobile-day-selector__button--selected .mobile-day-selector__day-name,
.mobile-day-selector__button--selected .mobile-day-selector__day-number,
.mobile-day-selector__button--selected .mobile-day-selector__event-count {
  color: var(--calendar-primary-text, var(--color-white));
}

.mobile-day-selector__button--today:not(.mobile-day-selector__button--selected)
  .mobile-day-selector__day-number {
  color: var(--calendar-primary-bg, var(--color-primary-light));
  font-weight: 400;
}

.mobile-day-selector__day-name {
  font-size: var(--calendar-font-xs, 11px);
  font-weight: 400;
  color: var(--calendar-text-muted, #8e8e93);
  text-transform: capitalize;
  line-height: 1;
}

.mobile-day-selector__day-number {
  font-size: var(--calendar-font-lg, 28px);
  font-weight: 400;
  color: var(--calendar-text, #000);
  line-height: 1;
}

.mobile-day-selector__event-count {
  font-size: var(--calendar-font-sm, 12px);
  color: var(--calendar-text-muted, #8e8e93);
  min-height: 10px;
  line-height: 1;
  font-weight: 600;
}

/* ============================================
   MOBILE EVENTS LIST
   ============================================ */

.mobile-events-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.mobile-events-list__header {
  margin-bottom: var(--spacing-lg);
  padding: 0 var(--spacing-xs);
}

.mobile-events-list__title {
  font-size: var(--calendar-font-xl, 32px);
  font-weight: 700;
  color: var(--calendar-text, #000);
  margin: 0;
  text-transform: capitalize;
}

.mobile-events-list__date-number {
  color: var(--calendar-text-muted, #8e8e93);
  font-weight: 400;
}

.mobile-events-list__allday-section {
  margin-bottom: var(--spacing-md);
}

.mobile-events-list__timed-section {
  background: var(--calendar-bg, var(--color-white));
  border-radius: var(--calendar-radius-sm, 10px);
  overflow: hidden;
  box-shadow: 0 0 0 0.5px var(--calendar-border-light, rgba(0, 0, 0, 0.04));
}

/* ============================================
   MOBILE ACTION BAR
   ============================================ */

.mobile-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: none;
  align-items: center;
  justify-content: space-around;
  background: var(--calendar-bg, var(--color-white));
  border-top: 0.5px solid var(--calendar-border-light, rgba(0, 0, 0, 0.1));
  padding: var(--spacing-xs) var(--spacing-md);
  padding-bottom: calc(var(--spacing-xs) + env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -2px 10px var(--calendar-shadow-light, rgba(0, 0, 0, 0.05));
  z-index: 95;
  gap: var(--spacing-sm);
}

.mobile-action-bar__button {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xxxs, 2px);
  min-width: 64px;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: transparent;
  border: none;
  border-radius: var(--calendar-radius-lg, var(--radius-lg));
  color: var(--calendar-text, var(--color-gray-600));
  font-size: var(--calendar-font-xl, 24px);
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.mobile-action-bar__button:active {
  transform: scale(0.95);
  background: var(--calendar-bg-light, var(--color-gray-100));
}

.mobile-action-bar__button--primary {
  background: linear-gradient(
    135deg,
    var(--color-primary, #4299e1) 0%,
    var(--color-primary-light, #5da9e9) 100%
  );
  color: var(--calendar-primary-text, var(--color-white));
  box-shadow: 0 2px 8px rgba(66, 153, 225, 0.3);
  flex: 0 0 auto;
  min-width: 56px;
  min-height: 56px;
  border-radius: 50%;
  padding: 0;
}

.mobile-action-bar__button--primary .mobile-action-bar__label {
  display: none;
}

.mobile-action-bar__button--primary:active {
  transform: scale(0.95);
  box-shadow: 0 1px 4px rgba(66, 153, 225, 0.4);
}

.mobile-action-bar__button--danger {
  color: var(--color-danger-red);
}

.mobile-action-bar__button--danger .mobile-action-bar__label {
  color: var(--color-danger-red);
}

.mobile-action-bar__button--danger:active {
  background: rgba(239, 68, 68, 0.1);
}

.mobile-action-bar__label {
  font-size: var(--calendar-font-xxs, 10px);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  color: var(--calendar-text, var(--color-gray-600));
}

/* ============================================
   RESPONSIVE - SHOW ON MOBILE
   ============================================ */

@media (max-width: 768px) {
  .mobile-calendar-view {
    display: flex;
    padding-bottom: calc(70px + env(safe-area-inset-bottom, 0px));
  }

  .mobile-action-bar {
    display: flex;
  }

  .mobile-day-selector {
    gap: 2px;
    padding: 0;
  }

  .mobile-day-selector__button {
    padding: 6px 4px;
  }

  .mobile-day-selector__day-name {
    font-size: var(--calendar-font-xxs, 10px);
  }

  .mobile-day-selector__day-number {
    font-size: var(--calendar-font-lg, 22px);
  }

  .mobile-events-list__title {
    font-size: var(--calendar-font-xl, 28px);
  }

  .mobile-events-list__header {
    padding: 0 var(--spacing-xs);
  }
}

@media (max-width: 480px) {
  .mobile-action-bar__button {
    min-width: 56px;
    font-size: var(--calendar-font-lg, 22px);
    gap: 1px;
  }

  .mobile-action-bar__label {
    font-size: var(--calendar-font-xxs, 9px);
  }

  .mobile-action-bar__button--primary {
    min-width: 52px;
    min-height: 52px;
  }
}

/* Safe areas */
@supports (padding: max(0px)) {
  .mobile-action-bar {
    padding-bottom: max(
      var(--spacing-xs),
      calc(var(--spacing-xs) + env(safe-area-inset-bottom, 0px))
    );
  }
}
```

---

## 📄 calendar-slots.css
**Path:** `features/calendar/calendar-slots.css`

```
/* ============================================
   CALENDAR SLOTS - COMPLETE & UNIFIED STYLES
   Variable-driven, supports all SlotCard variants
   ============================================ */

/* ============================================
   DESKTOP - ALL-DAY SLOTS (variant: desktop-allday)
   ============================================ */

.all-day-slots {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  height: 100%;
}

.full-height-slots {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  height: 100%;
}

/* Base SlotCard Styles */
.slot-card {
  cursor: pointer;
  transition: all var(--transition-base);
  border-radius: var(--slot-border-radius, var(--radius-md));
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.slot-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  z-index: calc(var(--z-slot-card) + 1);
}

.slot-card:active {
  transform: translateY(0);
}

/* ============================================
   DESKTOP GRID VARIANT (vue semaine)
   ============================================ */

.slot-card--desktop-grid {
  display: flex;
  flex-direction: column;
  padding: var(--slot-padding);
  gap: var(--slot-gap);
  color: var(--color-white);
  min-height: 100%;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Event type colors */
.slot-card--desktop-grid[data-type='private_lesson'] {
  background: var(--gradient-event-private-lesson);
}

.slot-card--desktop-grid[data-type='grouped_lesson'] {
  background: var(--gradient-event-grouped-lesson);
}

.slot-card--desktop-grid[data-type='competition'] {
  background: var(--gradient-event-competition);
}

.slot-card--desktop-grid[data-type='blocked'] {
  background: var(--gradient-event-blocked);
  opacity: 0.85;
}

.slot-card--desktop-grid[data-type='service'] {
  background: var(--gradient-event-service);
  opacity: 0.85;
}

.slot-card--desktop-grid[data-type='special'] {
  background: var(--gradient-event-special);
  opacity: 0.85;
}

.slot-card--desktop-grid[data-type='loaner_free_time'] {
  background: var(--gradient-event-loaner-free-time);
  opacity: 0.85;
}

/* Header Row */
.slot-card__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-height: 18px;
}

.slot-card__status-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  opacity: 0.9;
}

.slot-card__title {
  flex: 1;
  font-weight: var(--font-weight-semibold);
  font-size: 11px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.slot-card__count-badge {
  background: rgba(255, 255, 255, 0.25);
  padding: 2px 6px;
  border-radius: var(--radius-lg);
  font-size: 9px;
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Participants Row */
.slot-card__participants {
  flex: 1;
  display: flex;
  gap: var(--spacing-xs);
  align-items: flex-start;
  flex-wrap: wrap;
  overflow: hidden;
}

.slot-card__participant-badge {
  background: rgba(255, 255, 255, 0.9);
  padding: 3px 7px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 9px;
  font-weight: var(--font-weight-bold);
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  flex-shrink: 1;
  transition: all var(--transition-fast);
  cursor: default;
  max-width: 100%;
}

.slot-card__participant-badge:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
}

.badge-rider {
  color: var(--color-info-blue);
  font-weight: var(--font-weight-bold);
}

.badge-separator {
  color: rgba(0, 0, 0, 0.3);
  font-weight: var(--font-weight-normal);
  font-size: 8px;
}

.badge-horse {
  color: var(--color-gray-700);
  font-weight: var(--font-weight-semibold);
}

/* More badge */
.slot-card__participant-badge--more {
  background: rgba(255, 255, 255, 0.5);
  color: var(--color-gray-800);
  border-color: rgba(255, 255, 255, 0.3);
  padding: 3px 6px;
}

.slot-card__participant-badge--more:hover {
  background: rgba(255, 255, 255, 0.7);
}

/* Empty state */
.slot-card__empty-text {
  font-size: 9px;
  opacity: 0.7;
  font-style: italic;
  padding: 2px 0;
}

/* ============================================
   DESKTOP ALL-DAY VARIANT (petits slots horizontaux)
   ============================================ */

.slot-card--desktop-allday {
  display: flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--color-white);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  min-width: 0;
  flex: 1;
}

.slot-card--desktop-allday[data-type='private_lesson'] {
  background: var(--gradient-info);
}

.slot-card--desktop-allday[data-type='grouped_lesson'] {
  background: var(--gradient-primary);
}

.slot-card--desktop-allday[data-type='competition'] {
  background: var(--gradient-event-competition);
}

.slot-card--desktop-allday[data-type='blocked'] {
  background: var(--gradient-event-blocked);
  opacity: 0.8;
}

.slot-card--desktop-allday .slot-card__content {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 0;
  width: 100%;
}

.slot-card--desktop-allday .slot-card__icon {
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}

.slot-card--desktop-allday .slot-card__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

/* ============================================
   MOBILE TIMED VARIANT (liste avec horaire)
   ============================================ */

.slot-card--mobile-timed {
  display: flex;
  align-items: stretch;
  background: var(--color-white);
  border-bottom: 0.5px solid var(--color-border-light);
  padding: var(--spacing-md);
  gap: var(--spacing-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.slot-card--mobile-timed:last-child {
  border-bottom: none;
}

.slot-card--mobile-timed:active {
  background: var(--color-gray-50);
}

/* Time column */
.slot-card__time {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-width: 50px;
  padding-top: 2px;
}

.slot-card__time-value {
  font-size: 15px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  line-height: 1.2;
}

/* Divider */
.slot-card__divider {
  width: 3px;
  background: var(--color-gray-200);
  border-radius: var(--radius-full);
  align-self: stretch;
  margin: 2px 0;
}

/* Event type colors for mobile divider */
.slot-card--mobile-timed[data-type='private_lesson'] .slot-card__divider {
  background: var(--color-info-blue);
}

.slot-card--mobile-timed[data-type='grouped_lesson'] .slot-card__divider {
  background: var(--color-primary-light);
}

.slot-card--mobile-timed[data-type='competition'] .slot-card__divider {
  background: var(--color-warning-orange);
}

.slot-card--mobile-timed[data-type='blocked'] .slot-card__divider {
  background: var(--color-gray-500);
}

/* Content column */
.slot-card--mobile-timed .slot-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;
}

.slot-card--mobile-timed .slot-card__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.slot-card--mobile-timed .slot-card__icon {
  font-size: 18px;
  color: var(--color-gray-700);
  flex-shrink: 0;
}

.slot-card--mobile-timed .slot-card__title {
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  line-height: 1.3;
}

.slot-card__details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slot-card__detail-line {
  font-size: 14px;
  color: var(--color-gray-600);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Status-specific styles for mobile */
.slot-card--mobile-timed[data-status='cancelled'] {
  opacity: 0.6;
}

.slot-card--mobile-timed[data-status='cancelled'] .slot-card__title {
  text-decoration: line-through;
}

/* ============================================
   MOBILE ALL-DAY VARIANT (carte compacte)
   ============================================ */

.slot-card--mobile-allday {
  display: flex;
  background: var(--color-white);
  border-radius: 10px;
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  box-shadow: 0 0 0 0.5px var(--color-border-light);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.slot-card--mobile-allday:active {
  background: var(--color-gray-50);
  transform: scale(0.98);
}

.slot-card--mobile-allday .slot-card__content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
}

.slot-card--mobile-allday .slot-card__icon {
  font-size: 24px;
  flex-shrink: 0;
}

/* Event type colors for mobile all-day icons */
.slot-card--mobile-allday[data-type='private_lesson'] .slot-card__icon {
  color: var(--color-info-blue);
}

.slot-card--mobile-allday[data-type='grouped_lesson'] .slot-card__icon {
  color: var(--color-primary-light);
}

.slot-card--mobile-allday[data-type='competition'] .slot-card__icon {
  color: var(--color-warning-orange);
}

.slot-card--mobile-allday[data-type='blocked'] .slot-card__icon {
  color: var(--color-gray-500);
}

.slot-card--mobile-allday .slot-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.slot-card--mobile-allday .slot-card__title {
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slot-card__subtitle {
  font-size: 13px;
  color: var(--color-gray-500);
}

/* ============================================
   RESPONSIVE ADJUSTMENTS
   ============================================ */

@media (max-width: 768px) {
  /* Hide desktop variants on mobile */
  .slot-card--desktop-grid,
  .slot-card--desktop-allday {
    display: none !important;
  }
}

@media (min-width: 769px) {
  /* Hide mobile variants on desktop */
  .slot-card--mobile-timed,
  .slot-card--mobile-allday {
    display: none !important;
  }
}

/* ============================================
   ACCESSIBILITY
   ============================================ */

.slot-card:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.slot-card:focus:not(:focus-visible) {
  outline: none;
}

/* ============================================
   ANIMATIONS
   ============================================ */

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slot-card {
  animation: slideInFromBottom 0.3s ease-out;
}

/* ============================================
   PRINT STYLES
   ============================================ */

@media print {
  .slot-card {
    break-inside: avoid;
    box-shadow: none;
  }

  .slot-card:hover {
    transform: none;
  }
}

/* ============================================
   CALENDAR SLOTS - OVERLAP MANAGEMENT
   Gestion du chevauchement des événements
   ============================================ */

/* ============================================
   DESKTOP - OVERLAPPING COLUMNS
   ============================================ */

/* Wrapper d'événement avec gestion du z-index au hover */
.desktop-day-grid__event-wrapper {
  position: absolute;
  z-index: var(--z-slot-card);
  transition: z-index 0s;
}

/* Au hover, passer au premier plan */
.desktop-day-grid__event-wrapper:hover {
  z-index: calc(var(--z-slot-card) + 10) !important;
}

/* Espacement entre colonnes quand il y a chevauchement */
.desktop-day-grid__event-wrapper[data-has-overlap='true'] {
  padding-right: 2px;
}

/* ============================================
   SLOT NARROW - Mode colonne étroite
   ============================================ */

/* Carte en mode étroit (affichage minimal) */
.slot-card--desktop-grid[data-narrow='true'] {
  /* Réduire le padding pour gagner de l'espace */
  padding: 4px;
  gap: 3px;
}

/* Header compact */
.slot-card--desktop-grid[data-narrow='true'] .slot-card__header {
  gap: 3px;
  min-height: 14px;
}

.slot-card--desktop-grid[data-narrow='true'] .slot-card__status-icon {
  width: 10px;
  height: 10px;
}

.slot-card--desktop-grid[data-narrow='true'] .slot-card__title {
  font-size: 9px;
  line-height: 1.1;
}

.slot-card--desktop-grid[data-narrow='true'] .slot-card__count-badge {
  font-size: 7px;
  padding: 1px 4px;
  border-radius: 6px;
}

/* Participants en mode compact - vertical stack au lieu de horizontal */
.slot-card--desktop-grid[data-narrow='true'] .slot-card__participants {
  flex-direction: column;
  gap: 2px;
  align-items: stretch;
}

.slot-card--desktop-grid[data-narrow='true'] .slot-card__participant-badge {
  font-size: 7px;
  padding: 2px 4px;
  justify-content: center;
  border-width: 1px;
}

.slot-card--desktop-grid[data-narrow='true'] .badge-separator {
  font-size: 6px;
}

/* Empty text */
.slot-card--desktop-grid[data-narrow='true'] .slot-card__empty-text {
  font-size: 7px;
}

/* ============================================
   SLOT HOVER - Expansion pleine largeur
   ============================================ */

/* Au hover, l'événement prend toute la largeur de la colonne jour */
.desktop-day-grid__event-wrapper:hover .slot-card--desktop-grid[data-narrow='true'] {
  /* Calculer pour prendre toute la largeur */
  position: absolute;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;

  /* Revenir au padding normal */
  padding: var(--slot-padding);
  gap: var(--slot-gap);

  /* Box shadow pour le mettre en avant */
  box-shadow: var(--shadow-lg);

  /* Animation */
  transition: all var(--transition-base);
}

/* Header en mode hover - retour à la normale */
.desktop-day-grid__event-wrapper:hover
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__header {
  gap: var(--spacing-xs);
  min-height: 18px;
}

.desktop-day-grid__event-wrapper:hover
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__status-icon {
  width: 14px;
  height: 14px;
}

.desktop-day-grid__event-wrapper:hover
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__title {
  font-size: 11px;
  line-height: 1.2;
}

.desktop-day-grid__event-wrapper:hover
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__count-badge {
  font-size: 9px;
  padding: 2px 6px;
  border-radius: var(--radius-lg);
}

/* Participants en mode hover - retour horizontal */
.desktop-day-grid__event-wrapper:hover
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__participants {
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  align-items: flex-start;
}

.desktop-day-grid__event-wrapper:hover
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__participant-badge {
  font-size: 9px;
  padding: 3px 7px;
  border-width: 1.5px;
}

.desktop-day-grid__event-wrapper:hover
  .slot-card--desktop-grid[data-narrow='true']
  .badge-separator {
  font-size: 8px;
}

.desktop-day-grid__event-wrapper:hover
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__empty-text {
  font-size: 9px;
}

/* ============================================
   INDICATEUR VISUEL DE COLONNES
   ============================================ */

/* Ajouter une petite bordure gauche pour indiquer qu'il y a plusieurs colonnes */
.slot-card--desktop-grid[data-narrow='true']::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}

/* Au hover, retirer cet indicateur */
.desktop-day-grid__event-wrapper:hover .slot-card--desktop-grid[data-narrow='true']::before {
  display: none;
}

/* ============================================
   RESPONSIVE - MOBILE
   ============================================ */

/* Sur mobile, pas de mode narrow (liste simple) */
@media (max-width: 768px) {
  .slot-card--desktop-grid[data-narrow='true'] {
    /* Désactiver tous les styles narrow sur mobile */
    padding: var(--slot-padding);
    gap: var(--slot-gap);
  }

  .slot-card--desktop-grid[data-narrow='true'] .slot-card__participants {
    flex-direction: row;
    flex-wrap: wrap;
  }

  /* Pas d'expansion au hover sur mobile */
  .desktop-day-grid__event-wrapper:hover .slot-card--desktop-grid[data-narrow='true'] {
    position: relative;
    left: auto !important;
    right: auto !important;
    width: auto !important;
  }
}

/* ============================================
   COLUMN COUNT SPECIFIC ADJUSTMENTS
   ============================================ */

/* Avec 2 colonnes - encore assez lisible */
.desktop-day-grid__event-wrapper[data-column-count='2']
  .slot-card--desktop-grid[data-narrow='true'] {
  min-width: 80px;
}

/* Avec 3 colonnes - très compact */
.desktop-day-grid__event-wrapper[data-column-count='3']
  .slot-card--desktop-grid[data-narrow='true'] {
  min-width: 60px;
}

.desktop-day-grid__event-wrapper[data-column-count='3']
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__title {
  font-size: 8px;
}

.desktop-day-grid__event-wrapper[data-column-count='3']
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__participant-badge {
  font-size: 6px;
  padding: 1px 3px;
}

/* Avec 4+ colonnes - ultra compact, presque juste la couleur */
.desktop-day-grid__event-wrapper[data-column-count='4']
  .slot-card--desktop-grid[data-narrow='true'],
.desktop-day-grid__event-wrapper[data-column-count='5']
  .slot-card--desktop-grid[data-narrow='true'],
.desktop-day-grid__event-wrapper[data-column-count='6']
  .slot-card--desktop-grid[data-narrow='true'] {
  min-width: 40px;
  padding: 2px;
}

/* Cacher les participants si 4+ colonnes, juste afficher le titre */
.desktop-day-grid__event-wrapper[data-column-count='4']
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__participants,
.desktop-day-grid__event-wrapper[data-column-count='5']
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__participants,
.desktop-day-grid__event-wrapper[data-column-count='6']
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__participants {
  display: none;
}

.desktop-day-grid__event-wrapper[data-column-count='4']
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__title,
.desktop-day-grid__event-wrapper[data-column-count='5']
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__title,
.desktop-day-grid__event-wrapper[data-column-count='6']
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__title {
  font-size: 7px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

/* Au hover, tout redevient visible */
.desktop-day-grid__event-wrapper:hover
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__participants {
  display: flex !important;
}

.desktop-day-grid__event-wrapper:hover
  .slot-card--desktop-grid[data-narrow='true']
  .slot-card__title {
  writing-mode: horizontal-tb !important;
  text-orientation: initial !important;
}

/* ============================================
   ANIMATIONS & TRANSITIONS
   ============================================ */

.desktop-day-grid__event-wrapper {
  transition: z-index 0s, transform var(--transition-base);
}

.slot-card--desktop-grid[data-narrow='true'] {
  transition: all var(--transition-base);
}

/* Smooth expansion au hover */
@media (prefers-reduced-motion: no-preference) {
  .desktop-day-grid__event-wrapper:hover .slot-card--desktop-grid[data-narrow='true'] {
    animation: expandSlot var(--transition-base) ease-out;
  }
}

@keyframes expandSlot {
  from {
    opacity: 0.9;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ============================================
   ACCESSIBILITY
   ============================================ */

/* Focus visible pour navigation clavier */
.desktop-day-grid__event-wrapper:focus-within {
  z-index: calc(var(--z-slot-card) + 10) !important;
}

.slot-card--desktop-grid[data-narrow='true']:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .slot-card--desktop-grid[data-narrow='true']::before {
    width: 3px;
    background: currentColor;
  }
}
```

---

## 📄 calendar.css
**Path:** `features/calendar/calendar.css`

```
/* ============================================
   CALENDAR DESKTOP - Specific styles only
   Most styles come from common.css
   ============================================ */

:root {
  --hour-height: 60px;
  --start-hour: 9;
  --end-hour: 22;
  --day-header-height: 50px;
  --all-day-section-height: 50px;
}

/* ============================================
   CALENDAR VIEW CONTAINER
   ============================================ */

.calendar-view {
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* ============================================
   CALENDAR HEADER & NAV
   ============================================ */

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.calendar-header h2 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
}

.calendar-nav-buttons {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

/* ============================================
   CALENDAR FILTERS
   ============================================ */

.calendar-filters {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-lg);
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm);
}

.filter-line {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.filter-group label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  white-space: nowrap;
}

.filter-group .form-select {
  min-width: 140px;
}

.filters-group {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}

/* ============================================
   WEEK VIEW - GRID
   ============================================ */

.week-view {
  background: var(--gradient-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.week-grid {
  display: grid;
  grid-template-columns: 64px repeat(7, minmax(0, 1fr));
  width: 100%;
  flex: 1;
  min-height: 0;
  background: var(--color-surface);
}

/* ============================================
   TIME COLUMN
   ============================================ */

.time-column {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-border-dark);
  background: var(--color-bg-secondary);
  position: sticky;
  left: 0;
  z-index: 10;
}

.time-header {
  height: var(--day-header-height);
  min-height: var(--day-header-height);
  border-bottom: 1px solid var(--color-border-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-600);
  text-transform: uppercase;
  background: var(--gradient-light);
  position: sticky;
  top: 0;
  z-index: 20;
}

.time-all-day-spacer {
  height: var(--all-day-section-height);
  min-height: var(--all-day-section-height);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
}

.time-slot {
  height: var(--hour-height);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 2px;
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
  font-weight: var(--font-weight-medium);
}

/* ============================================
   DAY COLUMN
   ============================================ */

.day-column {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  border-right: 1px solid var(--color-border);
  background: var(--color-surface);
}

.day-column:last-child {
  border-right: none;
}

.day-column.today {
  background: linear-gradient(to bottom, var(--today-bg), transparent 80px);
}

.day-column.past {
  opacity: 0.7;
}

.day-column.has-full-height-event .day-grid-container {
  pointer-events: none;
}

/* ============================================
   DAY HEADER
   ============================================ */

.day-header {
  height: var(--day-header-height);
  min-height: var(--day-header-height);
  border-bottom: 1px solid var(--color-border-dark);
  text-align: center;
  background: linear-gradient(to bottom, var(--color-surface), var(--color-bg-secondary));
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs);
}

.day-header.today {
  background: var(--gradient-primary);
  color: var(--color-white);
}

.day-name {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
  text-transform: capitalize;
}

/* ============================================
   ALL-DAY SECTION
   ============================================ */

.all-day-section {
  height: var(--all-day-section-height);
  min-height: var(--all-day-section-height);
  padding: var(--spacing-xs);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  overflow: hidden;
  position: relative;
}

.all-day-slots {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  height: 100%;
}

.all-day-slot-card {
  flex: 1;
  min-width: 0;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  color: var(--color-white);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  overflow: hidden;
}

.all-day-slot-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.all-day-slot-card[data-type='private_lesson'] {
  background: var(--gradient-info);
}

.all-day-slot-card[data-type='grouped_lesson'] {
  background: var(--gradient-primary);
}

.all-day-slot-card[data-type='competition'] {
  background: var(--gradient-warning);
}

.all-day-slot-card[data-type='blocked'] {
  background: var(--gradient-secondary);
  opacity: 0.8;
}

.all-day-slot-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 0;
}

.all-day-slot-status-icon {
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}

.all-day-slot-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ============================================
   FULL HEIGHT EVENTS (Competition/Blocked)
   ============================================ */
.full-height-slots-container {
  position: absolute;
  /* Commence après le header + all-day-section */
  top: calc(var(--day-header-height) + var(--all-day-section-height));
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 15; /* Au-dessus de la grille */
  padding: var(--spacing-xs);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  pointer-events: none; /* Pour laisser passer les clics sauf sur les cards */
}

.full-height-slot-card {
  flex: 1;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  color: var(--color-white);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  pointer-events: auto; /* Réactiver les clics sur la card */
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.full-height-slot-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
  border-color: rgba(255, 255, 255, 0.5);
}

.full-height-slot-card[data-type='competition'] {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.full-height-slot-card[data-type='blocked'] {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
}

.full-height-slot-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
}

.full-height-slot-icon {
  font-size: var(--spacing-lg);
  flex-shrink: 0;
}

.full-height-slot-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.full-height-slot-type {
  font-size: var(--font-size-xs);
  opacity: 0.9;
  text-transform: uppercase;
  font-weight: var(--font-weight-semibold);
}

.full-height-slot-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ============================================
   DAY GRID
   ============================================ */

.day-grid-container {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

.day-grid {
  position: relative;
  height: calc((var(--end-hour) - var(--start-hour)) * var(--hour-height));
}

.hour-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
}

.hour-marker-row {
  position: absolute;
  left: 0;
  right: 0;
  border-bottom: 1px solid var(--color-border);
}

.hour-marker-row:last-child {
  border-bottom: none;
}

/* ============================================
   SELECTION OVERLAY
   ============================================ */

.selection-overlay {
  position: absolute;
  background: var(--selection-color);
  border: 2px solid var(--selection-border);
  border-radius: var(--radius-md);
  pointer-events: none;
  z-index: 5;
}

/* ============================================
   EVENTS CONTAINER
   ============================================ */

.events-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
}

.event-slot-wrapper {
  position: absolute;
  width: 100%;
  pointer-events: auto;
}

/* ============================================
   EVENT CARD
   ============================================ */

.event-card {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  overflow: hidden;
}

.event-card:hover {
  transform: translateY(-1px) scale(1.01);
  box-shadow: var(--shadow-md);
  z-index: 10;
}

/* ============================================
   SLOT CONTENT
   ============================================ */

.slot-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--spacing-xs);
  border-radius: var(--radius-md);
  color: var(--color-white);
  font-size: var(--font-size-xs);
  gap: 2px;
}

.slot-content[data-type='private_lesson'] {
  background: var(--gradient-info);
}

.slot-content[data-type='grouped_lesson'] {
  background: var(--gradient-primary);
}

.slot-content[data-type='competition'] {
  background: var(--gradient-warning);
}

.slot-content[data-type='blocked'] {
  background: var(--gradient-secondary);
  opacity: 0.8;
}

/* Layouts selon durée */
.slot-content[data-layout='ultra-compact'] {
  padding: 2px var(--spacing-xs);
}

.slot-content[data-layout='compact'] {
  padding: var(--spacing-xs);
}

.slot-content[data-layout='normal'] {
  padding: var(--spacing-xs) var(--spacing-sm);
}

.slot-content[data-layout='comfortable'] {
  padding: var(--spacing-sm);
}

/* ============================================
   SLOT ELEMENTS
   ============================================ */

.slot-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xs);
  margin-bottom: 2px;
}

.slot-title {
  font-weight: var(--font-weight-semibold);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.slot-status-icon {
  font-size: var(--font-size-xs);
  flex-shrink: 0;
}

.slot-instructor {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  opacity: 0.9;
}

.slot-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  opacity: 0.9;
}

.slot-duration {
  opacity: 0.8;
}

.slot-participants {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  opacity: 0.9;
}

/* Ultra compact - only title */
.slot-content[data-layout='ultra-compact'] .slot-instructor,
.slot-content[data-layout='ultra-compact'] .slot-time,
.slot-content[data-layout='ultra-compact'] .slot-participants {
  display: none;
}

/* Compact - title + time */
.slot-content[data-layout='compact'] .slot-instructor,
.slot-content[data-layout='compact'] .slot-participants {
  display: none;
}

/* ============================================
   LOADING & ERROR STATES
   ============================================ */

.calendar-loading,
.calendar-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl);
  text-align: center;
  color: var(--color-gray-600);
}

.calendar-error {
  color: var(--color-danger);
}

/* ============================================
   RESPONSIVE - HIDE ON MOBILE
   ============================================ */

@media (max-width: 768px) {
  .week-view,
  .calendar-filters {
    display: none !important;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .full-height-slot-icon {
    width: 24px;
    height: 24px;
  }

  .full-height-slot-type {
    font-size: var(--font-size-xs);
  }

  .full-height-slot-name {
    font-size: var(--font-size-base);
  }
}

/* ==============================================
   SLOT CONTENT - Solution 2 (Avatars)
============================================== */

.slot-content {
  padding: 6px;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 6px;
  overflow: hidden;
}

/* TOP ROW: Status + Name + Count */
.slot-header-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 18px;
}

.slot-status-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  opacity: 0.9;
}

.slot-title {
  flex: 1;
  font-weight: 600;
  font-size: 11px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.slot-count-badge {
  background: rgba(255, 255, 255, 0.25);
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 700;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* BOTTOM ROW: Avatars */
.slot-avatars-container {
  flex: 1;
  display: flex;
  gap: 4px;
  align-items: center;
  overflow: hidden;
}

/* Participant pair (rider + horse) */
.participant-pair {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.participant-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
  position: relative;
}

/* Rider avatar - lighter background */
.participant-avatar.rider {
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-gray-800);
}

/* Horse avatar - darker background */
.participant-avatar.horse {
  background: rgba(255, 255, 255, 0.6);
  color: var(--color-gray-900);
}

/* More participants indicator */
.participant-avatar.more {
  background: rgba(255, 255, 255, 0.4);
  color: var(--color-white);
  font-size: 8px;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
}

/* Empty state */
.slot-empty-text {
  font-size: 9px;
  opacity: 0.7;
  font-style: italic;
}

/* Hover effect on event card */
.event-card:hover .participant-avatar {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.6);
}

.participant-avatar {
  transition: all 0.15s ease;
}

/* ==============================================
   SLOT CONTENT - Badges arrondis
============================================== */

.slot-content {
  padding: 6px;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 6px;
  overflow: hidden;
}

/* TOP ROW: Status + Name + Count */
.slot-header-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 18px;
}

.slot-status-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  opacity: 0.9;
}

.slot-title {
  flex: 1;
  font-weight: 600;
  font-size: 11px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.slot-count-badge {
  background: rgba(255, 255, 255, 0.25);
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 700;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* BOTTOM ROW: Participants badges */
.slot-participants-row {
  flex: 1;
  display: flex;
  gap: 4px;
  align-items: flex-start;
  flex-wrap: wrap;
  overflow: hidden;
}

.participant-badge {
  background: rgba(255, 255, 255, 0.9);
  padding: 3px 7px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 9px;
  font-weight: 700;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  flex-shrink: 1;
  transition: all 0.15s ease;
  cursor: default;
}

.participant-badge:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
}

.badge-rider {
  color: var(--color-primary, #3b82f6);
  font-weight: 700;
}

.badge-separator {
  color: rgba(0, 0, 0, 0.3);
  font-weight: 400;
  font-size: 8px;
}

.badge-horse {
  color: var(--color-gray-700, #374151);
  font-weight: 600;
}

/* More participants badge */
.participant-badge.more {
  background: rgba(255, 255, 255, 0.5);
  color: var(--color-gray-800);
  border-color: rgba(255, 255, 255, 0.3);
  padding: 3px 6px;
}

.participant-badge.more:hover {
  background: rgba(255, 255, 255, 0.7);
}

/* Empty state */
.slot-empty-text {
  font-size: 9px;
  opacity: 0.7;
  font-style: italic;
  padding: 2px 0;
}

/* Hover effect on event card */
.event-card:hover .participant-badge {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

---

## 📄 event-form.css
**Path:** `features/events/event-form.css`

```
@import '../../common.css';

/* EVENTS - Formulaires - Optimisé */
.event-form-modern {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.event-form-row {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.event-form-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.create-event-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
}

.create-event-form-column,
.create-event-participants-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.create-event-participants-column {
  border-left: 2px solid var(--color-border-dark);
  padding-left: var(--spacing-lg);
}

@media (max-width: 768px) {
  .event-form-row {
    grid-template-columns: 1fr;
  }

  .create-event-layout {
    grid-template-columns: 1fr;
  }

  .create-event-participants-column {
    border-left: none;
    border-top: 1px solid var(--color-border);
    padding-left: 0;
    padding-top: var(--spacing-lg);
  }
}
```

---

## 📄 event-modal.css
**Path:** `features/events/event-modal.css`

```
@import '../../common.css';

/* EVENTS - Modal & Details - Optimisé */
.event-modal {
  max-width: 1200px;
  width: 95%;
  max-height: 85vh;
  overflow-y: auto;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.event-modal-content {
  padding: var(--spacing-xs);
}

.event-modal-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.event-modal-avatar {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  font-size: var(--font-size-2xl);
  flex-shrink: 0;
  box-shadow: var(--shadow-lg);
}

.event-modal-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.event-modal-sidebar,
.event-modal-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.event-box {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

@media (max-width: 1024px) {
  .event-modal-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .event-modal-content {
    padding: var(--spacing-xs);
  }
}
```

---

## 📄 event-participants.css
**Path:** `features/events/event-participants.css`

```
@import '../../common.css';

/* EVENTS - Participants - Optimisé */
.participants-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.participants-table-wrapper {
  background: var(--gradient-light);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.participants-table {
  width: 100%;
  border-collapse: collapse;
}

.participants-table thead {
  background: var(--color-bg-tertiary);
}

.participants-table th {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  border-bottom: 2px solid var(--color-border);
}

.participants-table tbody tr {
  border-bottom: 1px solid var(--color-border-light);
  transition: all var(--transition-base);
}

.participants-table tbody tr:hover {
  background: var(--color-bg-hover);
}

.participants-table td {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.participant-badge- {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-surface);
  color: var(--color-info-blue-dark);
  border: 1px solid var(--color-info-blue-dark);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  transition: all var(--transition-base);
  animation: slideIn 0.2s ease-out;
}

.participant-badge-:hover {
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-sm);
}
@media (max-width: 768px) {
  .participants-table-wrapper {
    overflow-x: auto;
  }

  .participants-table {
    min-width: 500px;
  }
}
```

---

## 📄 scheduled-events.css
**Path:** `features/events/scheduled-events.css`

```
/* ============================================
   SCHEDULED EVENTS MODAL - Ultra minimal
   Maximum reuse from common.css
   ============================================ */

/* ============================================
   CONTENT LAYOUT
   ============================================ */

.scheduled-events-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* ============================================
   EVENT CARD - Grid only
   ============================================ */

.scheduled-event-card {
  padding: var(--spacing-md);
}

.scheduled-event-card.processing {
  opacity: 0.6;
  pointer-events: none;
}

.scheduled-event-main {
  display: grid;
  grid-template-columns: 100px 180px 1fr auto;
  gap: var(--spacing-md);
  align-items: center;
}

/* ============================================
   TIME SECTION - Specific layout
   ============================================ */

.scheduled-event-time {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: center;
  justify-content: center;
}

.scheduled-event-time-range {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* ============================================
   DETAILS SECTION - Specific layout
   ============================================ */

.scheduled-event-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.scheduled-event-metadata {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.metadata-icon {
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}

/* ============================================
   PARTICIPANTS - Specific layout
   ============================================ */

.scheduled-event-participants {
  min-width: 200px;
  display: flex;
  flex-direction: row;
  gap: var(--spacing-xs);
}

.scheduled-event-participants.inline {
  display: flex;
  gap: 4px;
}

.participant-chip {
  font-size: 11px;
  padding: 2px 6px;
  text-align: center;
  white-space: nowrap;
  line-height: 1.3;
  border: 1px solid var(--color-border-light);
  background: var(--color-grey-50);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

/* ============================================
   FOOTER - Specific style
   ============================================ */

.scheduled-event-created {
  text-align: right;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
  margin-top: var(--spacing-md);
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 992px) {
  .scheduled-event-main {
    grid-template-columns: 80px 1fr;
  }

  .scheduled-event-time {
    grid-row: 1 / 3;
  }

  .scheduled-event-participants {
    grid-column: 2;
    min-width: 0;
  }

  .scheduled-event-details {
    grid-column: 2;
  }
}

@media (max-width: 768px) {
  .scheduled-event-main {
    grid-template-columns: 1fr;
  }

  .scheduled-event-card {
    padding: var(--spacing-sm);
  }
}
```

---

## 📄 header-mobile.css
**Path:** `features/home/header-mobile.css`

```
@import '../../common.css';

/* ============================================
   HEADER - BASE STYLES
   ============================================ */

.header {
  background: var(--color-white);
  border-bottom: 1px solid var(--color-gray-200);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  gap: var(--spacing-lg);
}

/* ============================================
   DESKTOP HEADER
   ============================================ */

.header-desktop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: var(--spacing-lg);
}

.header-mobile {
  display: none;
}

.header-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  display: flex;
  align-items: center;
  margin: 0;
  white-space: nowrap;
}

.header-title svg {
  font-size: 28px;
  color: var(--color-primary);
}

.header-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-gray-700);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-base);
  white-space: nowrap;
}

.nav-link:hover {
  background: var(--color-gray-100);
  color: var(--color-primary);
}

.nav-link.active {
  background: var(--color-primary-light);
  color: var(--color-white);
}

.nav-link svg {
  font-size: 18px;
}

/* Mode labels desktop */
.mode-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}

.mode-label.mode-admin {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.mode-label.mode-user {
  background: var(--color-primary-light);
  color: var(--color-white);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
}

.mode-label.mode-user:hover {
  background: var(--color-primary);
  color: var(--color-white);
}

/* ============================================
   MOBILE HEADER - COMPACT
   ============================================ */

@media (max-width: 768px) {
  .header-desktop {
    display: none;
  }

  .header-mobile {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: var(--spacing-sm);
  }

  .header-container {
    padding: var(--spacing-sm) var(--spacing-md);
    min-height: 56px; /* Header compact */
  }

  .header-title-mobile {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-gray-900);
    margin: 0;
    flex: 1;
    min-width: 0;
  }

  .header-title-mobile svg {
    font-size: 24px;
    color: var(--color-primary);
    flex-shrink: 0;
  }

  .header-title-mobile span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Mobile menu toggle button */
  .mobile-menu-toggle {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    color: var(--color-gray-700);
    cursor: pointer;
    transition: all var(--transition-base);
    flex-shrink: 0;
  }

  .mobile-menu-toggle:hover {
    background: var(--color-gray-100);
  }

  .mobile-menu-toggle:active {
    transform: scale(0.95);
  }

  .mobile-menu-toggle svg {
    font-size: 24px;
  }

  /* Mode badge mobile - compact */
  .mode-badge-mobile {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: all var(--transition-base);
    flex-shrink: 0;
  }

  .mode-badge-mobile svg {
    font-size: 18px;
  }

  .mode-badge-mobile.mode-admin {
    background: var(--color-danger-light);
    color: var(--color-danger);
  }

  .mode-badge-mobile.mode-user {
    background: var(--color-primary-light);
    color: var(--color-white);
  }

  .mode-badge-mobile:active {
    transform: scale(0.95);
  }
}

/* ============================================
   MOBILE MENU OVERLAY
   ============================================ */

@media (max-width: 768px) {
  .mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    max-width: 80vw;
    background: var(--color-white);
    box-shadow: var(--shadow-xl);
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .mobile-menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--color-gray-200);
  }

  .mobile-menu-header h2 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-gray-900);
    margin: 0;
  }

  .mobile-menu-header button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    color: var(--color-gray-700);
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .mobile-menu-header button:hover {
    background: var(--color-gray-100);
  }

  .mobile-menu-header button svg {
    font-size: 20px;
  }

  .mobile-menu-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  /* User card in mobile menu */
  .mobile-user-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--color-primary-light);
    border: none;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-base);
    text-align: left;
    width: 100%;
  }

  .mobile-user-card:active {
    transform: scale(0.98);
  }

  .mobile-user-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-white);
    color: var(--color-primary-light);
    border-radius: 50%;
    font-size: 14px;
    flex-shrink: 0;
  }

  .mobile-user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .mobile-user-name {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    color: var(--color-white);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mobile-user-label {
    font-size: var(--font-size-sm);
    color: var(--color-white);
  }

  /* Mobile navigation links */
  .mobile-menu-links {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mobile-nav-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    text-decoration: none;
    color: var(--color-gray-700);
    font-weight: var(--font-weight-medium);
    transition: all var(--transition-base);
  }

  .mobile-nav-link:hover {
    background: var(--color-gray-100);
  }

  .mobile-nav-link.active {
    background: var(--color-primary-light);
    color: var(--color-white);
  }

  .mobile-nav-link svg {
    font-size: 20px;
    flex-shrink: 0;
  }

  /* Logout button */
  .mobile-logout-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: transparent;
    border: 1px solid var(--color-gray-300);
    border-radius: var(--radius-md);
    color: var(--color-gray-700);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-base);
    margin-top: auto;
  }

  .mobile-logout-btn:hover {
    background: var(--color-gray-100);
    border-color: var(--color-gray-400);
  }

  .mobile-logout-btn:active {
    transform: scale(0.98);
  }

  .mobile-logout-btn svg {
    font-size: 20px;
  }

  /* Mobile menu footer */
  .mobile-menu-footer {
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-gray-200);
  }

  .mobile-mode-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
  }

  .mobile-mode-badge.admin {
    background: var(--color-danger-light);
    color: var(--color-danger);
  }

  .mobile-mode-badge.user {
    background: var(--color-primary-light);
    color: var(--color-white);
  }

  .mobile-mode-badge svg {
    font-size: 16px;
  }
}

/* ============================================
   SAFE AREAS (iPhone notch)
   ============================================ */

@supports (padding: max(0px)) {
  @media (max-width: 768px) {
    .header-container {
      padding-left: max(var(--spacing-md), env(safe-area-inset-left));
      padding-right: max(var(--spacing-md), env(safe-area-inset-right));
      padding-top: max(var(--spacing-sm), env(safe-area-inset-top));
    }

    .mobile-menu {
      padding-left: env(safe-area-inset-left, 0);
    }
  }
}

/* ============================================
   TABLET ADJUSTMENTS
   ============================================ */

@media (max-width: 992px) and (min-width: 769px) {
  .header-title {
    font-size: var(--font-size-lg);
  }

  .header-nav {
    gap: var(--spacing-sm);
  }

  .nav-link {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
  }
}
```

---

## 📄 header.css
**Path:** `features/home/header.css`

```
@import '../../common.css';

/* HOME - Header Desktop - Optimisé */
.header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  box-shadow: var(--shadow-sm);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  gap: var(--spacing-lg);
}

.header-desktop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: var(--spacing-lg);
}

.header-mobile {
  display: none;
}

.header-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  display: flex;
  align-items: center;
  margin: 0;
  white-space: nowrap;
}

.header-title svg {
  font-size: 28px;
  color: var(--color-primary);
  margin-right: var(--spacing-sm);
}

.header-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.mode-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}

.mode-label.mode-admin {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.mode-label.mode-user {
  background: var(--color-primary-light);
  color: var(--color-primary);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
}

.mode-label.mode-user:hover {
  background: var(--color-primary);
  color: var(--color-white);
}

@media (max-width: 768px) {
  .header-desktop {
    display: none;
  }
}
```

---

## 📄 home.css
**Path:** `features/home/home.css`

```
/* ============================================
   HOME - Styles minimaux
   La plupart viennent de common.css (layouts, cards, etc.)
   ============================================ */

/* Home Selector */
.home-selector {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
}

.home-selector-card {
  width: 100%;
  max-width: 520px;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-3xl);
  box-shadow: var(--shadow-2xl);
  text-align: center;
}

.home-selector-card h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-3xl);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.home-selector-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

/* Profile Card */
.profile-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-border);
  background: var(--gradient-light);
  cursor: pointer;
  transition: all var(--transition-base);
  text-align: left;
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.profile-card svg {
  font-size: var(--spacing-3xl);
  color: var(--color-primary);
  flex-shrink: 0;
}

.profile-card.admin svg {
  color: var(--color-danger);
}

.profile-card div {
  flex: 1;
}

.profile-card strong {
  display: block;
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xs);
  color: var(--color-gray-900);
}

.profile-card span {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

/* Dev Mode Panel */
.dev-mode-panel {
  position: fixed;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-white);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-fixed);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.dev-mode-panel p {
  margin: 0;
  font-size: var(--font-size-sm);
}

.dev-mode-panel strong {
  color: var(--color-primary);
}

.dev-mode-panel.admin strong {
  color: var(--color-danger);
}

@media (max-width: 768px) {
  .home-selector-card {
    padding: var(--spacing-xl);
    max-width: 95%;
  }

  .home-selector-card h1 {
    font-size: var(--font-size-2xl);
  }

  .profile-card {
    padding: var(--spacing-md);
  }

  .profile-card svg {
    font-size: var(--spacing-2xl);
  }
}
```

---

## 📄 riders-selector.css
**Path:** `features/home/riders-selector.css`

```
/* ============================================
   RIDER SELECTOR MODAL
   Style iOS moderne pour la sélection de cavalier
   ============================================ */

.rider-selector-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  min-height: 300px;
}

/* ============================================
   FILTERS - Pills standard de l'app
   ============================================ */

.rider-selector-filters {
  /* Pas de padding supplémentaire, les pills gèrent leur propre style */
}

/* ============================================
   RIDERS LIST - iOS Style
   ============================================ */

.rider-selector-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.rider-selector-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.rider-selector-card:hover {
  background: var(--color-gray-50);
  border-color: var(--color-primary-light);
  transform: translateX(2px);
}

.rider-selector-card:active {
  transform: scale(0.98);
  background: var(--color-gray-100);
}

.rider-selector-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  border-radius: var(--radius-md);
  color: var(--color-white);
  font-size: 20px;
  flex-shrink: 0;
}

.rider-selector-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.rider-selector-name {
  font-size: 17px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rider-selector-type {
  font-size: 14px;
  color: var(--color-gray-600);
}

.rider-selector-chevron {
  font-size: 24px;
  color: var(--color-gray-400);
  font-weight: 300;
  flex-shrink: 0;
}

/* ============================================
   RESPONSIVE - MOBILE
   ============================================ */

@media (max-width: 768px) {
  .rider-selector-content {
    gap: var(--spacing-md);
    min-height: auto;
  }

  .rider-selector-card {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .rider-selector-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .rider-selector-name {
    font-size: 16px;
  }

  .rider-selector-type {
    font-size: 13px;
  }

  .rider-selector-chevron {
    font-size: 20px;
  }
}

/* ============================================
   EMPTY STATE OVERRIDE
   ============================================ */

.rider-selector-list .empty-state-small {
  margin-top: var(--spacing-lg);
}
```

---

## 📄 horses-list.css
**Path:** `features/horses/horses-list.css`

```
/* HORSES - Liste & Table - Optimisé */
@import '../../common.css';

/* ============================================
   HORSES LIST - Specific styles only
   Most styles come from list-views.css
   ============================================ */
.badges-cell {
  max-width: 200px; /* Limite badges chevaux */
}

.days-cell {
  min-width: 320px; /* Espace pour 7 jours */
}

.horses-list .table thead tr,
.horses-list .table tbody tr {
  display: grid;
  align-items: center;
  grid-template-columns:
    2fr
    minmax(100px, 150px)
    minmax(120px, 180px)
    minmax(80px, 110px)
    minmax(320px, 480px)
    1fr;
}

@media (max-width: 768px) {
  .table thead tr,
  .table tbody tr {
    grid-template-columns: 80px 80px 110px 90px 110px 70px 60px;
  }
}
```

---

## 📄 import-planning.css
**Path:** `features/import/import-planning.css`

```
/* ============================================
   IMPORT PLANNING - Styles minimaux
   La plupart des styles viennent de common.css
   ============================================ */

/* File Upload Area */
.import-file-section {
  margin-bottom: var(--spacing-lg);
}

.file-upload-area {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  overflow: hidden;
}

.file-upload-area:hover {
  border-color: var(--color-primary);
  background: var(--color-gray-50);
}

.file-upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
  cursor: pointer;
  text-align: center;
}

.file-upload-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
}

.file-upload-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-xs);
}

.file-upload-hint {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.file-input-hidden {
  display: none;
}

/* Progress Section */
.import-progress-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xl);
  text-align: center;
}

.import-loading-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
}

.import-progress-section h3 {
  margin: var(--spacing-md) 0;
  color: var(--color-gray-800);
}

.progress-container {
  width: 100%;
  margin: var(--spacing-md) 0;
}

.progress-bar-wrapper {
  width: 100%;
  height: 8px;
  background: var(--color-gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--spacing-xs);
}

.progress-bar-fill {
  height: 100%;
  background: var(--gradient-primary);
  transition: width var(--transition-base);
}

.progress-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.progress-details {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
}

.progress-details p {
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
  margin: var(--spacing-xs) 0;
}

/* Result Section */
.import-result-section {
  padding: var(--spacing-lg);
}

.result-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.result-success-icon {
  font-size: 48px;
  color: var(--color-success);
  margin-bottom: var(--spacing-sm);
}

.result-header h3 {
  margin-top: var(--spacing-md);
  color: var(--color-success-dark);
}

.result-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

/* Import Errors */
.import-errors-section {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--color-danger-light);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-danger);
}

.import-errors-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  color: var(--color-danger-dark);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.import-errors-list {
  max-height: 200px;
  overflow-y: auto;
}

.import-errors-list ul {
  margin: 0;
  padding-left: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-danger-dark);
}

.import-errors-list li {
  margin-bottom: var(--spacing-xs);
}

/* Responsive */
@media (max-width: 768px) {
  .file-upload-label {
    padding: var(--spacing-lg);
  }

  .result-stats-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 📄 pairings.css
**Path:** `features/pairings/pairings.css`

```
/* PAIRINGS - Optimisé */
@import '../../common.css';

/* ============================================
   PAIRINGS - Specific styles only
   Most styles come from form-layouts.css
   ============================================ */

/* Horse/Rider selection card */
.horse-selection-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--gradient-light);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.horse-selection-card .horse-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  border-radius: var(--radius-lg);
  color: var(--color-white);
  font-size: var(--font-size-2xl);
  flex-shrink: 0;
}

.horse-selection-card .horse-info {
  flex: 1;
}

.horse-selection-card .horse-name {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
  margin-bottom: var(--spacing-xs);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* Days selector grid */
.days-selector-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xs);
}

.day-button {
  position: relative;
  aspect-ratio: 1;
  padding: var(--spacing-sm);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-button:hover:not(:disabled) {
  border-color: var(--color-primary-light);
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-2px);
}

.day-button.selected {
  border-color: var(--color-primary);
  background: var(--gradient-primary);
  color: var(--color-white);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.day-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .days-selector-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .day-button {
    font-size: var(--font-size-xs);
    padding: var(--spacing-sm) 6px;
    flex: 1;
    min-width: 40px;
  }
}
```

---

## 📄 riders-list.css
**Path:** `features/riders/riders-list.css`

```
/* RIDERS - Liste & Table - Optimisé */
@import '../../common.css';

/* ============================================
   RIDERS LIST - Specific styles only
   Most styles come from list-views.css
   ============================================ */
.riders-list .badges-cell {
  max-width: 200px; /* Limite badges chevaux */
}

.riders-list .days-cell {
  min-width: 280px; /* Espace pour 7 jours */
}

.riders-list .table thead tr,
.riders-list .table tbody tr {
  display: grid;
  align-items: center;
  grid-template-columns:
    2fr
    minmax(100px, 150px)
    minmax(120px, 180px)
    minmax(80px, 110px)
    minmax(130px, 180px)
    3fr
    1fr;
}

@media (max-width: 768px) {
  .table thead tr,
  .table tbody tr {
    grid-template-columns: 180px 100px 180px 120px 90px 1fr;
  }
}
```

---

## 📄 stats-additions.css
**Path:** `features/stats/stats-additions.css`

```
/* ========================================
   TABS
   ======================================== */

.tabs {
  display: flex;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  overflow-x: auto;
}

.tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background-color: transparent;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.tab svg {
  width: var(--icon-size-sm);
  height: var(--icon-size-sm);
}

.tab:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text);
}

.tab.active {
  background-color: var(--color-bg);
  border-color: var(--color-border);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.tab .count-badge {
  background-color: var(--color-bg-secondary);
}

.tab.active .count-badge {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

/* ========================================
   SUMMARY CARDS GRID
   ======================================== */

.stats-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.summary-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.summary-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.summary-card.warning {
  background-color: var(--color-warning-light);
  border-color: var(--color-warning);
}

.summary-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  flex-shrink: 0;
}

.summary-card.warning .summary-card-icon {
  background-color: var(--color-warning);
  color: var(--color-bg);
}

.summary-card-icon svg {
  width: var(--icon-size-md);
  height: var(--icon-size-md);
}

.summary-card-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;
}

.summary-card-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-card-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  line-height: 1;
}

/* ========================================
   TABLE ENHANCEMENTS
   ======================================== */

.table-row-warning {
  background-color: var(--color-warning-light);
}

.table-row-warning:hover {
  background-color: var(--color-warning-lighter);
}

.count-pill.warning {
  background-color: var(--color-warning-light);
  color: var(--color-warning-dark);
  border-color: var(--color-warning);
}

.count-pill.error {
  background-color: var(--color-error-light);
  color: var(--color-error-dark);
  border-color: var(--color-error);
}

.count-pill.info {
  background-color: var(--color-info-light);
  color: var(--color-info-dark);
  border-color: var(--color-info);
}

.count-total.error {
  color: var(--color-error);
}

/* ========================================
   STATS RIDERS GRID
   ======================================== */

.stats-riders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: var(--spacing-lg);
}

@media (max-width: 1200px) {
  .stats-riders-grid {
    grid-template-columns: 1fr;
  }
}

/* ========================================
   RESPONSIVE
   ======================================== */

@media (max-width: 768px) {
  .tabs {
    gap: var(--spacing-2xs);
    padding: var(--spacing-sm);
  }

  .tab {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }

  .tab svg {
    width: var(--icon-size-xs);
    height: var(--icon-size-xs);
  }

  .stats-summary-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }

  .summary-card {
    padding: var(--spacing-sm);
  }

  .summary-card-icon {
    width: 40px;
    height: 40px;
  }

  .summary-card-value {
    font-size: var(--font-size-xl);
  }
}
```

---

## 📄 stats.css
**Path:** `features/stats/stats.css`

```
/* ============================================
   STATS VIEW - Layout général
   ============================================ */

.stats-view {
  padding: var(--spacing-lg);
  width: 95%;
  max-width: 95%;
  margin: 0 auto;
}

.stats-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

/* ============================================
   STATS SECTIONS
   ============================================ */

.stats-section {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.stats-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--gradient-light);
  border-bottom: 1px solid var(--color-border);
}

/* ============================================
   STATS GRIDS
   ============================================ */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.stats-riders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
}

/* ============================================
   STAT CARDS
   ============================================ */

.stat-card {
  background-image: var(--gradient-light);
  border: 2px solid var(--color-gray-200);
  padding: 20px;
  border-radius: var(--radius-xl);
  text-align: center;
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
   STATS TABLES
   ============================================ */

.stats-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.stats-table thead {
  background: var(--color-bg-secondary);
  border-bottom: 2px solid var(--color-border);
}

.stats-table th {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: center;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.stats-table tbody tr {
  border-bottom: 1px solid var(--color-border-light);
  transition: background var(--transition-fast);
}

.stats-table tbody tr:hover {
  background: var(--color-bg-hover);
}

/* ============================================
   DATA TABLE (Stats spécifiques)
   ============================================ */

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.data-table.compact {
  font-size: var(--font-size-xs);
}

.data-table thead {
  background: var(--color-bg-secondary);
  border-bottom: 2px solid var(--color-border-dark);
}

.data-table th {
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-700);
  text-align: left;
  white-space: nowrap;
}

.data-table tbody tr {
  border-bottom: 1px solid var(--color-border);
  transition: background-color var(--transition-fast);
}

.data-table tbody tr:hover {
  background: var(--color-bg-secondary);
}

.data-table td {
  padding: var(--spacing-sm) var(--spacing-md);
}

/* ============================================
   TABLE CELLS & ACCENTS
   ============================================ */

.table-header-sticky {
  position: sticky;
  left: 0;
  z-index: 2;
  background: var(--color-bg-secondary);
  min-width: 150px;
}

.table-cell-name {
  position: sticky;
  left: 0;
  z-index: 1;
  background: var(--color-surface);
  font-weight: var(--font-weight-medium);
}

.data-table tbody tr:hover .table-cell-name {
  background: var(--color-bg-secondary);
}

.table-cell-center {
  text-align: center;
}

.table-cell-left {
  text-align: left;
}

.table-cell-accent {
  background: var(--color-primary-light);
  color: var(--color-white);
  font-weight: var(--font-weight-semibold);
}

/* ============================================
   COUNT PILLS
   ============================================ */

.count-pill {
  display: inline-block;
  min-width: 24px;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-align: center;
}

.count-pill.active {
  background: var(--color-primary-light);
  color: var(--color-white);
}

.count-pill.empty {
  color: var(--color-gray-400);
}

.count-total {
  color: var(--color-white);
  font-size: var(--font-size-base);
}

/* ============================================
   TOTAL ROW
   ============================================ */

.table-row-total {
  border-top: 2px solid var(--color-border-dark);
  background: var(--color-bg-secondary);
  font-weight: var(--font-weight-semibold);
}

.table-row-total:hover {
  background: var(--color-bg-secondary) !important;
}

/* ============================================
   LOADING STATE
   ============================================ */

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl);
  gap: var(--spacing-md);
  color: var(--color-gray-600);
}

.loading-state svg {
  width: 32px;
  height: 32px;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 1024px) {
  .stats-riders-grid {
    grid-template-columns: 1fr;
  }

  .stats-header {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 768px) {
  .stats-view {
    padding: var(--spacing-md);
  }

  .data-table th,
  .data-table td {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }

  .table-header-sticky,
  .table-cell-name {
    min-width: 100px;
  }
}
```

---

## 📄 base-layouts.css
**Path:** `foundations/base-layouts.css`

```
/* ============================================
   RESET & BASE STYLES
   ============================================ */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: var(--line-height-normal);
  color: var(--color-text);
  background: var(--gradient-primary);
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  cursor: pointer;
}

input,
select,
textarea {
  font-family: inherit;
}

/* ============================================
   LAYOUTS & CONTAINERS
   ============================================ */

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  margin: 0 auto;
  padding: var(--spacing-lg);
  width: 90%;
  max-width: 1400px;
}

main {
  flex: 1;
  padding-bottom: var(--spacing-3xl);
}

.view-container {
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-x: auto;
  padding: var(--spacing-sm);
}

/* ----------------------------
   Flex Utilities
---------------------------- */

.flex {
  display: flex;
}
.inline-flex {
  display: inline-flex;
}
.flex-row {
  flex-direction: row;
}
.flex-column {
  flex-direction: column;
}
.flex-row-reverse {
  flex-direction: row-reverse;
}
.flex-column-reverse {
  flex-direction: column-reverse;
}
.flex-wrap {
  flex-wrap: wrap;
}
.flex-nowrap {
  flex-wrap: nowrap;
}
.align-items-start {
  align-items: flex-start;
}
.align-items-center {
  align-items: center;
}
.align-items-end {
  align-items: flex-end;
}
.align-items-stretch {
  align-items: stretch;
}
.justify-content-start {
  justify-content: flex-start;
}
.justify-content-center {
  justify-content: center;
}
.justify-content-end {
  justify-content: flex-end;
}
.justify-content-between {
  justify-content: space-between;
}
.justify-content-around {
  justify-content: space-around;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.flex-start {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.flex-end {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* ----------------------------
   Grid Utilities
---------------------------- */

.grid {
  display: grid;
  gap: var(--spacing-md);
}
.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}
.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}
.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}
.grid-auto-fit {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
.grid-auto-fill {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}
.two-column {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--spacing-lg);
}
.two-column-balanced {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}
.layout-grid-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
}
.layout-grid-content.event {
  grid-template-columns: 1fr 1fr;
}
.layout-sidebar-content,
.layout-main-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* ----------------------------
   Responsive
---------------------------- */

@media (max-width: 992px) {
  .two-column {
    grid-template-columns: 280px 1fr;
  }
  .layout-grid-content {
    grid-template-columns: 1fr;
  }
  .layout-sidebar-content {
    display: grid;
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .container {
    padding: var(--spacing-md);
    width: 95%;
  }
  .view-container {
    padding: var(--spacing-sm);
    gap: var(--spacing-sm);
  }
  .grid-2,
  .grid-3,
  .grid-4,
  .two-column,
  .two-column-balanced {
    grid-template-columns: 1fr;
  }
  .flex-between {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .container {
    padding: var(--spacing-sm);
    width: 100%;
  }
  .view-container {
    padding: var(--spacing-xs);
    gap: var(--spacing-xs);
  }
}
```

---

## 📄 utilities.css
**Path:** `foundations/utilities.css`

```
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

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* ----------------------------
   Animation Classes
---------------------------- */

.spin {
  animation: spin 1s linear infinite;
}
.fade-in {
  animation: fadeIn var(--transition-base);
}
.slide-in {
  animation: slideIn var(--transition-slow);
}
.bounce {
  animation: bounce 2s infinite;
}
.pulse {
  animation: pulse 0.3s ease-out;
}

/* ============================================
   Utilities
   ============================================ */

/* SPACING */
.mt-10 {
  margin-top: 10px;
}
.mt-20 {
  margin-top: var(--spacing-lg);
}
.mb-10 {
  margin-bottom: 10px;
}
.mb-15 {
  margin-bottom: 15px;
}
.mb-20 {
  margin-bottom: var(--spacing-lg);
}
.mb-30 {
  margin-bottom: var(--spacing-2xl);
}

/* DISPLAY */
.d-flex {
  display: flex;
}
.d-inline-flex {
  display: inline-flex;
}
.d-none {
  display: none;
}

/* TEXT */
.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
.text-muted {
  color: var(--color-text-muted);
}
.text-primary {
  color: var(--color-primary);
}
.text-success {
  color: var(--color-success);
}
.text-danger {
  color: var(--color-danger);
}

.font-weight-normal {
  font-weight: var(--font-weight-normal);
}
.font-weight-medium {
  font-weight: var(--font-weight-medium);
}
.font-weight-bold {
  font-weight: var(--font-weight-bold);
}

/* WIDTH/HEIGHT */
.w-100 {
  width: 100%;
}
.h-100 {
  height: 100%;
}

/* CURSOR */
.cursor-pointer {
  cursor: pointer;
}
.cursor-not-allowed {
  cursor: not-allowed;
}

/* TYPOGRAPHY */
.subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-lg);
}
```

---

## 📄 variables.css
**Path:** `foundations/variables.css`

```
/* ============================================
   CSS VARIABLES - Design System v2.0
   Variables harmonisées et complètes
   ============================================ */
:root {
  /* ============================================
     COLORS – CORE PALETTE (with gradients inline)
     ============================================ */

  /* ---------- Primary ---------- */
  --color-primary: #007bff;
  --color-primary-dark: #0056b3;
  --color-primary-light: #667eea;
  --color-primary-purple: #764ba2;

  --gradient-primary: linear-gradient(
    135deg,
    var(--color-primary-light) 0%,
    var(--color-primary-purple) 100%
  );

  /* ---------- Secondary ---------- */
  --color-secondary: #6c757d;
  --color-secondary-dark: #545b62;

  --gradient-secondary: linear-gradient(
    135deg,
    var(--color-secondary) 0%,
    var(--color-secondary-dark) 100%
  );

  /* ---------- Success ---------- */
  --color-success: #28a745;
  --color-success-dark: #1e7e34;
  --color-success-light: #d4edda;
  --color-success-medium: #48bb78;
  --color-success-medium-dark: #38a169;

  --gradient-success: linear-gradient(
    135deg,
    var(--color-success-medium) 0%,
    var(--color-success-medium-dark) 100%
  );

  /* ---------- Danger ---------- */
  --color-danger: #dc3545;
  --color-danger-dark: #bd2130;
  --color-danger-light: #f8d7da;
  --color-danger-medium: #f56565;
  --color-danger-medium-dark: #e53e3e;

  --gradient-danger: linear-gradient(
    135deg,
    var(--color-danger-medium) 0%,
    var(--color-danger-medium-dark) 100%
  );

  /* ---------- Warning ---------- */
  --color-warning: #ffc107;
  --color-warning-dark: #e0a800;
  --color-warning-light: #fff3cd;
  --color-warning-orange: #ed8936;
  --color-warning-orange-dark: #dd6b20;

  --gradient-warning: linear-gradient(
    135deg,
    var(--color-warning-orange) 0%,
    var(--color-warning-orange-dark) 100%
  );

  /* ---------- Info ---------- */
  --color-info: #17a2b8;
  --color-info-dark: #117a8b;
  --color-info-light: #d1ecf1;
  --color-info-blue: #4299e1;
  --color-info-blue-dark: #3182ce;

  --gradient-info: linear-gradient(
    135deg,
    var(--color-info-blue) 0%,
    var(--color-info-blue-dark) 100%
  );

  /* ---------- Neutral / Gray ---------- */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-50: #f7fafc;
  --color-gray-100: #f8f9fa;
  --color-gray-150: #edf2f7;
  --color-gray-200: #e9ecef;
  --color-gray-300: #dee2e6;
  --color-gray-400: #ced4da;
  --color-gray-450: #adb5bd;
  --color-gray-500: #718096;
  --color-gray-600: #6c757d;
  --color-gray-650: #4a5568;
  --color-gray-700: #040405;
  --color-gray-800: #2d3748;
  --color-gray-900: #212529;


  /* ============================================
     DOMAIN COLORS (colors + gradients together)
     ============================================ */

  /* Horses */
  --color-pony-light: #ed64a6;
  --color-pony-dark: #d53f8c;
  --gradient-pony: linear-gradient(
    135deg,
    var(--color-pony-light) 0%,
    var(--color-pony-dark) 100%
  );

  --color-horse-light: #63b3ed;
  --color-horse-dark: #4299e1;
  --gradient-horse: linear-gradient(
    135deg,
    var(--color-horse-light) 0%,
    var(--color-horse-dark) 100%
  );

  /* Riders */
  --color-rider-owner-light: #ed8936;
  --color-rider-owner-dark: #dd6b20;
  --gradient-rider-owner: linear-gradient(
    135deg,
    var(--color-rider-owner-light) 0%,
    var(--color-rider-owner-dark) 100%
  );

  --color-rider-club-light: #63b3ed;
  --color-rider-club-dark: #3182ce;
  --gradient-rider-club: linear-gradient(
    135deg,
    var(--color-rider-club-light) 0%,
    var(--color-rider-club-dark) 100%
  );

  --color-rider-loaner-light: #28a745;
  --color-rider-loaner-dark: #1e7e34;
  --gradient-rider-loaner: linear-gradient(
    135deg,
    var(--color-rider-loaner-light) 0%,
    var(--color-rider-loaner-dark) 100%
  );

  /* ============================================
     SLOT STATUS (already correct pattern)
     ============================================ */

  --color-slot-scheduled-light: #ffc107;
  --color-slot-scheduled-dark: #e0a800;
  --gradient-slot-scheduled: linear-gradient(
    135deg,
    var(--color-slot-scheduled-light) 0%,
    var(--color-slot-scheduled-dark) 100%
  );

  --color-slot-confirmed-light: #bee3f8;
  --color-slot-confirmed-dark: #3182ce;
  --gradient-slot-confirmed: linear-gradient(
    135deg,
    var(--color-slot-confirmed-light) 0%,
    var(--color-slot-confirmed-dark) 100%
  );

  --color-slot-completed-light: #c6f6d5;
  --color-slot-completed-dark: #38a169;
  --gradient-slot-completed: linear-gradient(
    135deg,
    var(--color-slot-completed-light) 0%,
    var(--color-slot-completed-dark) 100%
  );

  --color-slot-cancelled-light: #fed7d7;
  --color-slot-cancelled-dark: #e53e3e;
  --gradient-slot-cancelled: linear-gradient(
    135deg,
    var(--color-slot-cancelled-light) 0%,
    var(--color-slot-cancelled-dark) 100%
  );

  /* ============================================
   DOMAIN COLORS – OWNERS
   ============================================ */

/* LAURY */
--color-laury-light: #de37b4;
--color-laury-dark:  #de379b;
--gradient-laury: linear-gradient(
  135deg,
  var(--color-laury-light) 0%,
  var(--color-laury-dark) 100%
);

/* OWNER */
--color-owner-light: #ed8936;
--color-owner-dark:  #dd6b20;
--gradient-owner: linear-gradient(
  135deg,
  var(--color-owner-light) 0%,
  var(--color-owner-dark) 100%
);

/* CLUB */
--color-club-light: #63b3ed;
--color-club-dark:  #3182ce;
--gradient-club: linear-gradient(
  135deg,
  var(--color-club-light) 0%,
  var(--color-club-dark) 100%
);

/* OTHER */
--color-other-light: #fcdada;
--color-other-dark:  #f56565;
--gradient-other: linear-gradient(
  135deg,
  var(--color-other-light) 0%,
  var(--color-other-dark) 100%
);

/* ============================================
   DOMAIN COLORS – PAIRINGS
   ============================================ */

/* OWN */
--color-pairing-own-light: #ed8936;
--color-pairing-own-dark:  #dd6b20;
--gradient-pairing-own: linear-gradient(
  135deg,
  var(--color-pairing-own-light) 0%,
  var(--color-pairing-own-dark) 100%
);

/* LOAN */
--color-pairing-loan-light: #28a745;
--color-pairing-loan-dark:  #1e7e34;
--gradient-pairing-loan: linear-gradient(
  135deg,
  var(--color-pairing-loan-light) 0%,
  var(--color-pairing-loan-dark) 100%
);


/* ============================================
   DOMAIN COLORS – ASSIGNMENTS
   ============================================ */

/* MANUAL */
--color-assignment-manual-light: #90cdf4;
--color-assignment-manual-dark:  #4299e1;
--gradient-assignment-manual: linear-gradient(
  135deg,
  var(--color-assignment-manual-light) 0%,
  var(--color-assignment-manual-dark) 100%
);

/* AUTOMATIC */
--color-assignment-automatic-light: #9ae6b4;
--color-assignment-automatic-dark:  #38a169;
--gradient-assignment-automatic: linear-gradient(
  135deg,
  var(--color-assignment-automatic-light) 0%,
  var(--color-assignment-automatic-dark) 100%
);


/* ============================================
   EVENT TYPE COLORS
   ============================================ */

/* PRIVATE LESSON */
--color-event-private-lesson-light: #4299e1;
--color-event-private-lesson-dark:  #3182ce;
--gradient-event-private-lesson: linear-gradient(
  135deg,
  var(--color-event-private-lesson-light) 0%,
  var(--color-event-private-lesson-dark) 100%
);

/* GROUPED LESSON */
--color-event-grouped-lesson-light: #48bb78;
--color-event-grouped-lesson-dark:  #38a169;
--gradient-event-grouped-lesson: linear-gradient(
  135deg,
  var(--color-event-grouped-lesson-light) 0%,
  var(--color-event-grouped-lesson-dark) 100%
);

/* SPECIAL */
--color-event-special-light: #ed8936;
--color-event-special-dark:  #dd6b20;
--gradient-event-special: linear-gradient(
  135deg,
  var(--color-event-special-light) 0%,
  var(--color-event-special-dark) 100%
);

/* COMPETITION */
--color-event-competition-light: #dc3545;
--color-event-competition-dark:  #bd2130;
--gradient-event-competition: linear-gradient(
  135deg,
  var(--color-event-competition-light) 0%,
  var(--color-event-competition-dark) 100%
);

/* BLOCKED */
--color-event-blocked-light: #4a5568;
--color-event-blocked-dark:  #2d3748;
--gradient-event-blocked: linear-gradient(
  135deg,
  var(--color-event-blocked-light) 0%,
  var(--color-event-blocked-dark) 100%
);

/* SERVICE */
--color-event-service-light: #fed7d7;
--color-event-service-dark:  #fc8181;
--gradient-event-service: linear-gradient(
  135deg,
  var(--color-event-service-light) 0%,
  var(--color-event-service-dark) 100%
);

/* LOANER FREE TIME */
--color-event-loaner-free-time-light: #ed8936;
--color-event-loaner-free-time-dark:  #2f855a;
--gradient-event-loaner-free-time: linear-gradient(
  135deg,
  var(--color-event-loaner-free-time-light) 0%,
  var(--color-event-loaner-free-time-dark) 100%
);


    /* COLORS - Semantic Aliases */
  --color-surface: var(--color-white);
  --color-bg-card: rgba(255, 255, 255, 0.95);
  --color-border: var(--color-gray-200);
  --color-border-light: var(--color-gray-150);
  --color-border-dark: var(--color-gray-300);
  --color-text: var(--color-gray-900);
  --color-text-muted: var(--color-gray-600);
  --color-text-secondary: var(--color-gray-500);
  --color-text-light: var(--color-gray-400);
  --color-bg-primary: var(--color-white);
  --color-bg-secondary: var(--color-gray-50);
  --color-bg-tertiary: var(--color-gray-100);
  --color-bg-hover: var(--color-gray-100);

  /* COLORS - Badge Variants */
  --color-success-badge-light: #c6f6d5;
  --color-success-badge-medium: #9ae6b4;
  --color-danger-badge-light: #fed7d7;
  --color-danger-badge-medium: #fc8181;

  /* Gradient Palette Aliases */
  --gradient-palette-1: var(--gradient-primary);
  --gradient-palette-2: var(--gradient-info);
  --gradient-palette-3: var(--gradient-success);
  --gradient-palette-4: var(--gradient-warning);
  --gradient-palette-5: var(--gradient-danger);
  --gradient-palette-6: var(--gradient-secondary);
  --gradient-palette-7: var(--gradient-pony);
  --gradient-palette-8: var(--gradient-alert-success);
  --gradient-palette-9: var(--gradient-alert-error);
  --gradient-palette-10: var(--gradient-event-service);

  /* ============================================
     TYPOGRAPHY
     ============================================ */

  /* Font Sizes */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-normal: 1rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.75rem;
  --font-size-4xl: 2rem;

  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* ============================================
     SPACING
     ============================================ */
  --spacing-0: 0;
  --spacing-px: 1px;
  --spacing-2xs: 2px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 40px;
  --spacing-3xl: 48px;
  --spacing-4xl: 64px;

  /* ============================================
     BORDER RADIUS
     ============================================ */
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* ============================================
     SHADOWS
     ============================================ */
  --shadow-none: none;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 10px 20px rgba(0, 0, 0, 0.2);
  --shadow-2xl: 0 20px 40px rgba(0, 0, 0, 0.25);

  /* Mobile Action Button Shadows */
  --shadow-mobile-btn-primary: 0 2px 8px rgba(66, 153, 225, 0.3);
  --shadow-mobile-btn-primary-active: 0 1px 4px rgba(66, 153, 225, 0.4);
  --shadow-mobile-btn-danger: 0 2px 8px rgba(220, 53, 69, 0.3);
  --shadow-mobile-btn-danger-active: 0 1px 4px rgba(220, 53, 69, 0.4);

  /* ============================================
     TRANSITIONS
     ============================================ */
  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;
  --transition-slower: 0.5s ease;

  /* ============================================
     Z-INDEX
     ============================================ */
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-notification: 1080;
  --z-mobile-action-bar: 95;
  --z-calendar-header: 100;
  --z-selection-overlay: 5;
  --z-slot-card: 10;
  --z-full-height-slot: 15;

  /* ============================================
     CALENDAR + MOBILE ACTION BAR
     ============================================ */
  --hour-height: 60px;
  --start-hour: 9;
  --end-hour: 22;
  --day-header-height: 50px;
  --all-day-section-height: 50px;
  --selection-color: rgba(66, 153, 225, 0.2);
  --selection-border: var(--color-info-blue);
  --today-bg: rgba(66, 153, 225, 0.05);
  --mobile-action-bar-height: 70px;
  --mobile-header-height: auto;
  --desktop-time-column-width: 64px;
  --slot-border-radius: var(--radius-md);
  --slot-padding: var(--spacing-sm);
  --slot-gap: var(--spacing-xs);

  /* Mobile Action Button Variables */
  --mobile-action-btn-size: 56px;
  --mobile-action-btn-size-sm: 52
  --mobile-action-btn-gap: var(--spacing-2xs);
  --mobile-action-label-font: var(--font-size-xs);
  --mobile-action-label-font-sm: 0.5625rem;
  --mobile-action-btn-primary-bg: var(--gradient-info);
  --mobile-action-btn-danger-bg: var(--gradient-danger);
  --mobile-action-btn-danger-active-bg: rgba(220, 53, 69, 0.1);
}
```

---

