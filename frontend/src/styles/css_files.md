# 📁 Project Files Export

Generated on: Mon Jan 26 21:34:39 CET 2026

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
```

---

## 📄 common.css

**Path:** `common.css`

```
/* ============================================
   COMMON STYLES
   Import all foundations, layouts, and components
   ============================================ */

/* Foundations */
@import './foundations/variables.css';
@import './foundations/reset.css';
@import './foundations/animations.css';

/* Layouts */
@import './layouts/container.css';
@import './layouts/grid.css';
@import './layouts/flex.css';
@import './layouts/headers.css';
@import './layouts/sections.css';
@import './layouts/empty-states.css';

/* Components */
@import './components/buttons.css';
@import './components/forms.css';
@import './components/badges.css';
@import './components/cards.css';
@import './components/tables.css';
@import './components/modals.css';
@import './components/alerts.css';
@import './components/filters.css';
@import './components/utilities.css';
@import './components/error-boundary.css';
```

---

## 📄 alerts.css

**Path:** `components/alerts.css`

```
/* ALERTS - Optimisé */
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
```

---

## 📄 badges.css

**Path:** `components/badges.css`

```
/* ============================================
   BADGES - Optimisé
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

/* COLOR VARIANTS */
.badge-primary {
  background-image: var(--gradient-primary);
}

.badge-success {
  background-image: var(--gradient-success);
}

.badge-danger {
  background-image: var(--gradient-danger);
}

.badge-secondary {
  background-image: var(--gradient-secondary);
}

.badge-warning {
  background-image: var(--gradient-warning);
}

.badge-info {
  background-image: var(--gradient-info);
}

/* DOMAIN BADGES - Horses */
.badge[data-type='pony'] {
  background: var(--gradient-pony);
}

.badge[data-type='horse'] {
  background: var(--gradient-info);
}

/* DOMAIN BADGES - Owners */
.badge[data-type='laury'] {
  background: var(--gradient-primary);
}

.badge[data-type='private_owner'] {
  background: var(--gradient-warning);
}

.badge[data-type='club'] {
  background: var(--gradient-info);
}

.badge[data-type='other'] {
  background: var(--gradient-danger);
}

/* DOMAIN BADGES - Riders */
.badge[data-type='owner'] {
  background: var(--gradient-warning);
}

.badge[data-type='loaner'] {
  background: var(--gradient-success);
}

/* DOMAIN BADGES - Pairings */
.badge[data-type='own'] {
  background: var(--gradient-warning);
}

.badge[data-type='loan'] {
  background: var(--gradient-success);
}

/* STATUS BADGES */
.badge[data-type='active'] {
  background: var(--gradient-success);
}

.badge[data-type='inactive'] {
  background: var(--gradient-secondary);
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
  background: var(--gradient-info);
}

.badge[data-type='grouped_lesson'] {
  background: var(--gradient-primary);
}

.badge[data-type='competition'] {
  background: var(--gradient-warning);
}

.badge[data-type='blocked'] {
  background: var(--gradient-secondary);
}

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
  background: var(--gradient-info);
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

.riders-count-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px var(--spacing-sm);
  background: var(--gradient-info);
  color: var(--color-white);
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-base);
  cursor: default;
}

.riders-count-badge.clickable {
  cursor: pointer;
}

.riders-count-badge.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

/* TODAY BADGE */
.today-badge {
  display: inline-block;
  padding: 2px var(--spacing-sm);
  background: var(--gradient-success);
  color: var(--color-white);
  border-radius: var(--radius-full);
  font-size: 10px;
  white-space: nowrap;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .badge {
    font-size: 10px;
    padding: 3px var(--spacing-sm);
  }

  .day-badge {
    min-width: 28px;
    padding: 3px 5px;
    font-size: 9px;
  }

  .riders-count-badge {
    padding: 4px var(--spacing-sm);
    font-size: 11px;
    gap: 4px;
  }
}
```

---

## 📄 buttons.css

**Path:** `components/buttons.css`

```
/* ============================================
   BUTTONS - Optimisé avec variables
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

.btn-lg {
  padding: var(--spacing-sm) var(--spacing-xl);
  font-size: var(--font-size-md);
  gap: 10px;
  height: 48px;
}

/* ICON BUTTONS */
.btn-icon {
  padding: var(--spacing-sm);
  width: 36px;
  height: 36px;
  gap: 0;
  min-width: 36px;
}

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

/* BUTTON VARIANTS - SOLID */
.btn-primary {
  background-image: var(--gradient-primary);
  color: var(--color-white);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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

.btn-secondary {
  background-image: var(--gradient-secondary);
  color: var(--color-white);
}

.btn-secondary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(113, 128, 150, 0.4);
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

.btn-outline-danger {
  background: transparent;
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
}

.btn-outline-danger:hover:not(:disabled) {
  background: var(--color-danger);
  color: var(--color-white);
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

/* CLOSE BUTTON */
.btn-close,
.modal-close {
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

.btn-close:hover,
.modal-close:hover {
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

.segment-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

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

  .btn-lg {
    padding: 10px var(--spacing-lg);
    font-size: 15px;
  }

  .btn-group {
    width: 100%;
  }

  .btn-group .btn {
    flex: 1;
  }
  .segmented-control {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .segmented-control .segment-btn {
    width: 100%;
    justify-content: center;
  }
}
```

---

## 📄 cards.css

**Path:** `components/cards.css`

```
/* ============================================
   CARDS - All Card Styles Consolidated
   ============================================ */

/* ============================================
   BASE CARD
   ============================================ */

.card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  padding: 20px;
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card {
  background: var(--color-bg-card);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card h2 {
  margin-bottom: 24px;
  color: var(--color-gray-800);
  font-size: 1.5rem;
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: 12px;
}

.card h2::before {
  content: ' ';
  width: 4px;
  height: 24px;
  background: var(--gradient-primary);
  border-radius: 2px;
}

.card .week-title h2::before {
  width: 0px;
  border-radius: 0px;
}

/* ============================================
   CARD SECTIONS
   ============================================ */

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-gray-200);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-md);
}

.card-title-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: 1; /* alignement parfait */
}

.card-title svg {
  width: 18px;
  height: 18px;
  display: block;
  flex-shrink: 0;
}

/* Badge */
.card-title .count-badge {
  margin-left: auto; /* pousse le badge à droite si souhaité */
}

.card-footer {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--color-gray-200);
}

.card-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* ============================================
   INFO CARDS
   ============================================ */

.info-card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all var(--transition-base);
}

.info-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-color: var(--color-gray-300);
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--gradient-light);
  border-bottom: 1px solid var(--color-gray-200);
}

.info-card-header svg {
  font-size: 18px;
  flex-shrink: 0;
}

.info-card-header h3 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
}

.info-card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ============================================
   INFO ROWS
   ============================================ */

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row label {
  min-width: 120px;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
  font-size: 14px;
  display: flex;
  align-items: center;
}

.info-row span,
.info-row p {
  flex: 1;
  color: var(--color-gray-900);
  font-size: 14px;
  margin: 0;
}

.info-item-modern {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.info-icon {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  background: var(--gradient-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-primary);
  font-size: 16px;
  transition: all var(--transition-base);
}

.info-icon-success {
  background: var(--color-success-light);
  color: var(--color-success-dark);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  font-size: 16px;
}

.info-icon-warning {
  background: var(--color-danger-light);
  color: var(--color-danger-dark);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  font-size: 16px;
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.info-label {
  font-size: 0.75rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.9rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  word-wrap: break-word;
}

/* ============================================
   DATA CARDS
   ============================================ */

.data-card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  overflow: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all var(--transition-base);
}

.data-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.data-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: var(--gradient-light);
  border-bottom: 1px solid var(--color-gray-200);
}

.data-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.data-card-title h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
}

.data-card-body {
  padding: 20px;
}

/* ============================================
   STATS CARDS
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

.stats-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.stat-item:hover {
  border-color: var(--color-primary-light);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  line-height: 1;
}

/* ============================================
   CARD LAYOUTS
   ============================================ */

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.cards-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .card {
    padding: 16px;
  }

  .card {
    padding: 20px;
  }

  .info-row {
    flex-direction: column;
    gap: 8px;
  }

  .info-row label {
    min-width: auto;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .stats-card {
    grid-template-columns: 1fr;
  }
}

/* ============================================
   DETAIL CARDS - Entity detail view cards
   Shared between HorseCard, RiderCard, etc.
   ============================================ */

/* ============================================
   CARD TITLE (in modal header)
   ============================================ */

.detail-card-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
}

.detail-card-avatar {
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

.detail-card-title-text {
  flex: 1;
  min-width: 0;
}

.detail-card-title-text h2 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
}

.detail-card-meta {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.detail-card-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-left: auto;
  flex-shrink: 0;
}

/* ============================================
   CARD CONTENT
   ============================================ */

.detail-card-content {
  padding: var(--spacing-xs);
}

/* ============================================
   CARD GRID LAYOUT
   ============================================ */

.detail-card-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.detail-card-grid.event {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.detail-card-sidebar,
.detail-card-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* ============================================
   PAIRINGS LIST - Modern iOS style
   ============================================ */

.pairings-list-modern {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.pairing-item-modern {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.pairing-item-modern:hover {
  background: var(--color-gray-50);
  border-color: var(--color-primary-light);
  transform: translateX(2px);
}

.pairing-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-width: 0;
}

.pairing-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.pairing-header span:first-child {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
}

.pairing-days {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.pairing-actions {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
  flex-shrink: 0;
}

/* ============================================
   PACKAGE ITEM - Modern style
   ============================================ */

.package-item-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background: var(--gradient-light);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.package-item-modern:hover {
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-sm);
  transform: translateX(2px);
}

.package-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  font-weight: var(--font-weight-medium);
}

.package-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
}

/* ============================================
   INFO ITEMS - Simple layout
   ============================================ */

.detail-card-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 992px) {
  .detail-card-grid {
    grid-template-columns: 1fr;
  }

  .detail-card-sidebar {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .detail-card-content {
    padding: var(--spacing-xs);
  }

  .detail-card-title {
    flex-wrap: wrap;
  }

  .detail-card-avatar {
    display: none;
  }

  .detail-card-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .detail-card-sidebar {
    grid-template-columns: 1fr;
  }

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
/* FILTERS - Optimisé */
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

## 📄 forms.css

**Path:** `components/forms.css`

```
/* ============================================
   FORMS - Optimisé avec variables
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

/* FORM ERROR */
.form-error {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-danger-light);
  color: var(--color-danger-dark);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  border-left: 4px solid var(--color-danger);
}

/* INLINE FORM GROUP */
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

/* FORM VALIDATION */
.form-input.is-invalid,
.form-select.is-invalid,
.form-textarea.is-invalid {
  border-color: var(--color-danger);
}

.form-input.is-invalid:focus,
.form-select.is-invalid:focus,
.form-textarea.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
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

.invalid-feedback {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-danger);
}

.valid-feedback {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-success);
}

/* HELPER TEXT */
.form-helper-text,
.text-muted {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-text-muted);
}

/* FORM ACTIONS */
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

/* BUTTON GROUP */
.button-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: var(--spacing-sm);
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

/* ============================================
   FORM LAYOUTS - Common form structures
   Shared between entity forms (Horse, Rider, etc.)
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

.entity-form .form-section {
  /* Utilise les styles de sections.css */
}

.entity-form .form-section h3 {
  margin: 0 0 var(--spacing-md) 0;
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-gray-150);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
}

/* ============================================
   FORM GROUPS
   ============================================ */

.entity-form .form-group {
  margin-bottom: var(--spacing-md);
}

.entity-form .form-group:last-child {
  margin-bottom: 0;
}

/* ============================================
   REQUIRED INDICATOR
   ============================================ */

.required {
  color: var(--color-danger);
  margin-left: 2px;
}

/* ============================================
   ERROR MESSAGES
   ============================================ */

.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.error-message svg {
  flex-shrink: 0;
  font-size: var(--font-size-sm);
}

/* ============================================
   FORM INPUT ERROR STATE
   ============================================ */

.entity-form .form-input.error,
.entity-form .form-select.error,
.entity-form .form-textarea.error {
  border-color: var(--color-danger);
  background: var(--color-danger-light);
}

.entity-form .form-input.error:focus,
.entity-form .form-select.error:focus,
.entity-form .form-textarea.error:focus {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

/* ============================================
   FORM HELP TEXT
   ============================================ */

.form-help {
  display: block;
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  font-style: italic;
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
  .entity-form .form-section h3 {
    font-size: var(--font-size-sm);
  }

  .entity-form .modal-footer {
    margin-top: var(--spacing-lg);
  }
}
```

---

## 📄 modals.css

**Path:** `components/modals.css`

```
/* ============================================
   MODAL – BASE
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

.modal-header,
.modal-footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.modal-header {
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
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

.modal-body {
  flex: 1;
  padding: var(--spacing-md);
  overflow-y: auto;
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

  .modal-header,
  .modal-footer {
    padding: var(--spacing-md) var(--spacing-lg);
  }

  .modal-footer {
    flex-direction: column;
    align-items: stretch;
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
/* TABLES - Optimisé */
.table-container {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

/* Base Table */
.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
}

.table thead,
.table tbody {
  display: block;
}

.table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

.table thead {
  background-image: var(--gradient-light);
  border-bottom: 2px solid var(--color-border);
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

@media (max-width: 768px) {
  .table th,
  .table td {
    padding: var(--spacing-sm) var(--spacing-sm);
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

/* ============================================
   LIST VIEWS - Common styles for list pages
   Shared between HorsesList, RidersList, etc.
   ============================================ */

/* ============================================
   LIST HEADER
   ============================================ */

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

/* ============================================
   FILTER SECTION
   ============================================ */

.list-filters {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

/* ============================================
   MESSAGES SECTION
   ============================================ */

.list-messages {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

/* ============================================
   COUNT BADGE (for clickable counts)
   ============================================ */

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

/* ============================================
   DAY BADGES (for loan/activity days)
   ============================================ */

.days-cell {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: var(--spacing-xs) var(--spacing-sm);
}

.days-cell .day-badge {
  /* Utilise les styles existants de badges.css */
}

/* ============================================
   BADGES CONTAINER (for multiple badges in cell)
   ============================================ */

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
  .list-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .list-header-actions {
    width: 100%;
    flex-direction: column;
  }

  .list-header-actions .btn {
    width: 100%;
  }

  .days-cell {
    gap: 2px;
    padding: 2px;
    flex-wrap: wrap;
  }
}
/* ==============================================
   STATISTICS & DATA TABLES
============================================== */

/* Stats Grid */
.stats-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.stats-riders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: var(--spacing-md);
}

/* Data Table */
.table-container {
  overflow-x: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

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
}

.table-header-left {
  text-align: left;
}

.table-header-accent {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
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

/* Loading State */
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

/* Responsive */
@media (max-width: 768px) {
  .stats-riders-grid {
    grid-template-columns: 1fr;
  }

  .table-container {
    border-radius: 0;
    margin: 0 calc(-1 * var(--spacing-md));
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

## 📄 utilities.css

**Path:** `components/utilities.css`

```
/* ============================================
   UTILITIES - Optimisé
   ============================================ */

/* SPACING */
.mt-10 { margin-top: 10px; }
.mt-20 { margin-top: var(--spacing-lg); }
.mb-10 { margin-bottom: 10px; }
.mb-15 { margin-bottom: 15px; }
.mb-20 { margin-bottom: var(--spacing-lg); }
.mb-30 { margin-bottom: var(--spacing-2xl); }

/* DISPLAY */
.d-flex { display: flex; }
.d-inline-flex { display: inline-flex; }
.d-block { display: block; }
.d-none { display: none; }

/* TEXT */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.text-muted { color: var(--color-text-muted); }
.text-primary { color: var(--color-primary); }
.text-success { color: var(--color-success); }
.text-danger { color: var(--color-danger); }

.font-weight-normal { font-weight: var(--font-weight-normal); }
.font-weight-medium { font-weight: var(--font-weight-medium); }
.font-weight-bold { font-weight: var(--font-weight-bold); }

/* WIDTH/HEIGHT */
.w-100 { width: 100%; }
.h-100 { height: 100%; }

/* CURSOR */
.cursor-pointer { cursor: pointer; }
.cursor-not-allowed { cursor: not-allowed; }

/* ANIMATIONS */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-lg);
}
```

---

## 📄 calendar-actions-mobile.css

**Path:** `features/calendar/calendar-actions-mobile.css`

```
/* ============================================
   MOBILE CALENDAR ACTIONS
   Bottom action bar only (no filters sheet)
   ============================================ */

/* ============================================
   MOBILE ACTION BAR - Fixed Bottom
   ============================================ */

.mobile-calendar-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: none; /* Hidden by default, shown on mobile */
  align-items: center;
  justify-content: space-around;
  background: var(--color-white);
  border-top: 0.5px solid rgba(0, 0, 0, 0.1);
  padding: var(--spacing-xs) var(--spacing-md);
  padding-bottom: calc(var(--spacing-xs) + env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 95;
  gap: var(--spacing-sm);
}

.mobile-action-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-width: 64px;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: transparent;
  border: none;
  border-radius: var(--radius-lg);
  color: var(--color-gray-600);
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.mobile-action-btn:active {
  transform: scale(0.95);
  background: var(--color-gray-100);
}

.mobile-action-label {
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  color: var(--color-gray-600);
}

.mobile-action-btn.primary {
  background: linear-gradient(135deg, #4299e1 0%, #5da9e9 100%);
  color: var(--color-white);
  box-shadow: 0 2px 8px rgba(66, 153, 225, 0.3);
  flex: 0 0 auto;
  min-width: 56px;
  min-height: 56px;
  border-radius: 50%;
  padding: 0;
}

.mobile-action-btn.primary .mobile-action-label {
  display: none; /* No label for primary button */
}

.mobile-action-btn.primary:active {
  transform: scale(0.95);
  box-shadow: 0 1px 4px rgba(66, 153, 225, 0.4);
}

.mobile-action-btn.danger {
  color: var(--color-danger-red);
}

.mobile-action-btn.danger .mobile-action-label {
  color: var(--color-danger-red);
}

.mobile-action-btn.danger:active {
  background: rgba(239, 68, 68, 0.1);
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
    padding-bottom: calc(70px + env(safe-area-inset-bottom, 0px));
  }
}

@media (max-width: 480px) {
  .mobile-action-btn {
    min-width: 56px;
    font-size: 22px;
    gap: 1px;
  }

  .mobile-action-label {
    font-size: 9px;
  }

  .mobile-action-btn.primary {
    min-width: 52px;
    min-height: 52px;
  }
}

/* Safe areas */
@supports (padding: max(0px)) {
  .mobile-calendar-actions {
    padding-bottom: max(var(--spacing-xs), calc(var(--spacing-xs) + env(safe-area-inset-bottom, 0px)));
  }
}
```

---

## 📄 calendar-mobile.css

**Path:** `features/calendar/calendar-mobile.css`

```
/* ============================================
   MOBILE CALENDAR VIEW - iOS Style
   Styles spécifiques mobile uniquement
   ============================================ */

.mobile-calendar-view {
  display: none;
  flex-direction: column;
  height: 100%;
  background: var(--color-gray-50);
  overflow: hidden;
}

/* ============================================
   HEADER - SÉLECTEUR DE SEMAINE
   ============================================ */

.mobile-calendar-header {
  background: var(--color-white);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: var(--spacing-md) var(--spacing-sm) var(--spacing-sm);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
}

.mobile-week-selector {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  gap: 4px;
}

.mobile-day-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--spacing-xs);
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 0;
}

.mobile-day-button:active {
  transform: scale(0.95);
}

.mobile-day-name {
  font-size: 11px;
  font-weight: 400;
  color: #8e8e93;
  text-transform: capitalize;
  line-height: 1;
}

.mobile-day-number {
  font-size: 28px;
  font-weight: 400;
  color: #000;
  line-height: 1;
}

.mobile-event-count {
  font-size: 12px;
  color: #8e8e93;
  min-height: 10px;
  line-height: 1;
  font-weight: 600;
}

.mobile-day-button.selected {
  background: var(--color-primary-light);
}

.mobile-day-button.selected .mobile-day-name,
.mobile-day-button.selected .mobile-day-number,
.mobile-day-button.selected .mobile-event-count {
  color: var(--color-white);
}

.mobile-day-button.today:not(.selected) .mobile-day-number {
  color: var(--color-primary-light);
  font-weight: 400;
}

/* ============================================
   EVENTS CONTAINER
   ============================================ */

.mobile-events-container {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  -webkit-overflow-scrolling: touch;
}

.mobile-selected-date {
  margin-bottom: var(--spacing-lg);
  padding: 0 var(--spacing-xs);
}

.mobile-selected-date h2 {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  margin: 0;
  text-transform: capitalize;
}

.mobile-date-number {
  color: #8e8e93;
  font-weight: 400;
}

/* ============================================
   ALL-DAY EVENTS
   RESPONSIVE
   ============================================ */

.mobile-allday-section {
  margin-bottom: var(--spacing-md);
}

.mobile-allday-card {
  background: var(--color-white);
  border-radius: 10px;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-allday-card:active {
  transform: scale(0.98);
  opacity: 0.7;
}

.mobile-allday-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.mobile-allday-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  color: #8e8e93;
}

.mobile-allday-info {
  flex: 1;
  min-width: 0;
}

.mobile-allday-title {
  font-size: 17px;
  font-weight: 400;
  color: #000;
  margin-bottom: 2px;
}

.mobile-allday-subtitle {
  font-size: 15px;
  color: #8e8e93;
}

/* ============================================
   TIMED EVENTS LIST
   ============================================ */

.mobile-events-list {
  background: var(--color-white);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.04);
}

.mobile-event-card {
  display: flex;
  align-items: flex-start;
  padding: var(--spacing-md);
  background: var(--color-white);
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-height: 72px;
}

.mobile-event-card:last-child {
  border-bottom: none;
}

.mobile-event-card:active {
  background-color: #f8f8f8;
}

/* ============================================
   ALL-DAY EVENTS
   ============================================ */

.mobile-allday-section {
  margin-bottom: var(--spacing-md);
}
.mobile-allday-card[data-type='private_lesson'] {
  background: linear-gradient(135deg, #4299e1 0%, #5da9e9 100%);
  color: var(--color-white);
  box-shadow: 0 2px 8px rgba(66, 153, 225, 0.25);
}

.mobile-allday-card[data-type='grouped_lesson'] {
  background: linear-gradient(135deg, #8b5cf6 0%, #9b51e0 100%);
  color: var(--color-white);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.25);
}

.mobile-allday-card[data-type='competition'] {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: var(--color-white);
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.25);
}

.mobile-allday-card[data-type='blocked'] {
  background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
  color: var(--color-white);
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.25);
}

/* All-day text colors */
.mobile-allday-card[data-type] .mobile-allday-title,
.mobile-allday-card[data-type] .mobile-allday-subtitle,
.mobile-allday-card[data-type] .mobile-allday-icon {
  color: var(--color-white);
}

/* ============================================
   TIMED EVENTS - Colored Icons + Borders
   ============================================ */

/* Private Lesson */
.mobile-event-card[data-type='private_lesson'] {
  border-left: 4px solid #4299e1;
}

.mobile-event-card[data-type='private_lesson'] .mobile-event-icon {
  background: linear-gradient(135deg, #4299e1 0%, #5da9e9 100%);
  color: var(--color-white);
  box-shadow: 0 2px 6px rgba(66, 153, 225, 0.3);
}

.mobile-event-card[data-type='private_lesson'] .mobile-time-value {
  color: #4299e1;
  font-weight: 600;
}

.mobile-event-card[data-type='private_lesson'] .mobile-event-divider {
  background: linear-gradient(to bottom, #4299e1, rgba(66, 153, 225, 0.1));
}

/* Grouped Lesson */
.mobile-event-card[data-type='grouped_lesson'] {
  border-left: 4px solid #8b5cf6;
}

.mobile-event-card[data-type='grouped_lesson'] .mobile-event-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #9b51e0 100%);
  color: var(--color-white);
  box-shadow: 0 2px 6px rgba(139, 92, 246, 0.3);
}

.mobile-event-card[data-type='grouped_lesson'] .mobile-time-value {
  color: #8b5cf6;
  font-weight: 600;
}

.mobile-event-card[data-type='grouped_lesson'] .mobile-event-divider {
  background: linear-gradient(to bottom, #8b5cf6, rgba(139, 92, 246, 0.1));
}

/* Competition */
.mobile-event-card[data-type='competition'] {
  border-left: 4px solid #fbbf24;
}

.mobile-event-card[data-type='competition'] .mobile-event-icon {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: var(--color-white);
  box-shadow: 0 2px 6px rgba(251, 191, 36, 0.3);
}

.mobile-event-card[data-type='competition'] .mobile-time-value {
  color: #f59e0b;
  font-weight: 600;
}

.mobile-event-card[data-type='competition'] .mobile-event-divider {
  background: linear-gradient(to bottom, #fbbf24, rgba(251, 191, 36, 0.1));
}

/* Blocked */
.mobile-event-card[data-type='blocked'] {
  border-left: 4px solid #6b7280;
}

.mobile-event-card[data-type='blocked'] .mobile-event-icon {
  background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
  color: var(--color-white);
  box-shadow: 0 2px 6px rgba(107, 114, 128, 0.3);
}

.mobile-event-card[data-type='blocked'] .mobile-time-value {
  color: #6b7280;
  font-weight: 600;
}

.mobile-event-card[data-type='blocked'] .mobile-event-divider {
  background: linear-gradient(to bottom, #6b7280, rgba(107, 114, 128, 0.1));
}

/* ============================================
   STATUS OVERLAYS
   ============================================ */

/* Pending - Yellow tint */
.mobile-event-card[data-status='pending'] {
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.08) 0%, transparent 100%);
}

.mobile-allday-card[data-status='pending']::after {
  content: '⏳';
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  font-size: 18px;
}

/* Confirmed - Blue tint */
.mobile-event-card[data-status='confirmed'] {
  background: linear-gradient(90deg, rgba(66, 153, 225, 0.08) 0%, transparent 100%);
}

.mobile-allday-card[data-status='confirmed']::after {
  content: '✓';
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  font-size: 18px;
  font-weight: bold;
}

/* Cancelled - Greyed out */
.mobile-event-card[data-status='cancelled'],
.mobile-allday-card[data-status='cancelled'] {
  opacity: 0.5;
  filter: grayscale(60%);
}

.mobile-event-card[data-status='cancelled'] .mobile-event-title,
.mobile-allday-card[data-status='cancelled'] .mobile-allday-title {
  text-decoration: line-through;
}

/* ============================================
   ACTIVE/HOVER STATES avec couleurs
   ============================================ */

.mobile-event-card[data-type='private_lesson']:active {
  background: linear-gradient(90deg, rgba(66, 153, 225, 0.12) 0%, transparent 100%);
}

.mobile-event-card[data-type='grouped_lesson']:active {
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.12) 0%, transparent 100%);
}

.mobile-event-card[data-type='competition']:active {
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.12) 0%, transparent 100%);
}

.mobile-event-card[data-type='blocked']:active {
  background: linear-gradient(90deg, rgba(107, 114, 128, 0.12) 0%, transparent 100%);
}

/* ============================================
   EXTENDED EVENT TYPES (1-10)
   ============================================ */

.mobile-event-card[data-type='1'] .mobile-event-icon,
.mobile-allday-card[data-type='1'] {
  background: var(--gradient-primary);
}

.mobile-event-card[data-type='1'] {
  border-left-color: var(--color-primary-purple);
}

.mobile-event-card[data-type='2'] .mobile-event-icon,
.mobile-allday-card[data-type='2'] {
  background: var(--gradient-info);
}

.mobile-event-card[data-type='2'] {
  border-left-color: var(--color-info-blue);
}

.mobile-event-card[data-type='3'] .mobile-event-icon,
.mobile-allday-card[data-type='3'] {
  background: var(--gradient-success);
}

.mobile-event-card[data-type='3'] {
  border-left-color: var(--color-success-green);
}

.mobile-event-card[data-type='4'] .mobile-event-icon,
.mobile-allday-card[data-type='4'] {
  background: var(--gradient-warning);
}

.mobile-event-card[data-type='4'] {
  border-left-color: var(--color-warning-orange);
}

.mobile-event-card[data-type='5'] .mobile-event-icon,
.mobile-allday-card[data-type='5'] {
  background: var(--gradient-danger);
}

.mobile-event-card[data-type='5'] {
  border-left-color: var(--color-danger-red);
}

.mobile-event-card[data-type='6'] .mobile-event-icon,
.mobile-allday-card[data-type='6'] {
  background: var(--gradient-secondary);
}

.mobile-event-card[data-type='7'] .mobile-event-icon,
.mobile-allday-card[data-type='7'] {
  background: var(--gradient-pony);
}

.mobile-event-card[data-type='8'] .mobile-event-icon,
.mobile-allday-card[data-type='8'] {
  background: var(--gradient-alert-success);
}

.mobile-event-card[data-type='9'] .mobile-event-icon,
.mobile-allday-card[data-type='9'] {
  background: var(--gradient-alert-error);
}

.mobile-event-card[data-type='10'] .mobile-event-icon,
.mobile-allday-card[data-type='10'] {
  background: var(--gradient-light);
  color: var(--color-text);
}

.mobile-event-time {
  min-width: 48px;
  padding-right: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
}

.mobile-time-value {
  font-size: 15px;
  font-weight: 400;
  color: #000;
  line-height: 1.2;
}

.mobile-event-divider {
  width: 2px;
  align-self: stretch;
  background: rgba(0, 0, 0, 0.04);
  margin: 0 var(--spacing-sm);
  flex-shrink: 0;
}

.mobile-event-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.mobile-event-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.mobile-event-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 18px;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.04);
  color: #8e8e93;
}

.mobile-event-title {
  flex: 1;
  font-size: 17px;
  font-weight: 400;
  color: #000;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-event-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 44px;
}

.mobile-detail-line {
  font-size: 15px;
  color: #8e8e93;
  line-height: 1.3;
}

/* ============================================
   EMPTY STATE
   ============================================ */

.mobile-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
  text-align: center;
  color: #8e8e93;
  margin-top: var(--spacing-2xl);
}

.mobile-empty-state p {
  margin: var(--spacing-md) 0 0 0;
  font-size: 17px;
  font-weight: 400;
}

/* ============================================
   FLOATING ACTION BUTTON
   ============================================ */

.mobile-fab {
  position: fixed;
  bottom: calc(var(--spacing-xl) + env(safe-area-inset-bottom, 0px));
  right: var(--spacing-lg);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #007aff;
  color: var(--color-white);
  border: none;
  box-shadow: 0 3px 10px rgba(0, 122, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 90;
}

.mobile-fab:active {
  transform: scale(0.9);
}

.mobile-fab svg {
  font-size: 28px;
}

.mobile-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--spacing-md);
  color: var(--color-gray-500);
}

/* ============================================
   RESPONSIVE - SHOW ON MOBILE
   ============================================ */

@media (max-width: 768px) {
  .mobile-calendar-view {
    display: flex;
  }

  .calendar-view {
    padding: 0;
    gap: 0;
    height: 100%;
    overflow: hidden;
  }

  .calendar-header {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-white);
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
  }

  .mobile-week-selector {
    gap: 2px;
    padding: 0;
  }

  .mobile-day-button {
    padding: 6px 4px;
  }

  .mobile-day-name {
    font-size: 10px;
  }

  .mobile-day-number {
    font-size: 22px;
  }

  .mobile-selected-date h2 {
    font-size: 28px;
  }

  .mobile-events-container {
    padding: var(--spacing-md) var(--spacing-sm);
  }

  .mobile-event-time {
    min-width: 44px;
  }

  .mobile-fab {
    right: var(--spacing-md);
    width: 52px;
    height: 52px;
  }

  .mobile-fab svg {
    font-size: 26px;
  }
}
@media (max-width: 480px) {
  .mobile-event-card[data-type] {
    border-left-width: 3px;
  }

  .mobile-event-icon,
  .mobile-allday-icon {
    width: 28px;
    height: 28px;
    font-size: 16px;
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

/* Table column widths specific to horses */
.table thead tr,
.table tbody tr {
  display: grid;
  grid-template-columns: 200px 120px 140px 140px 420px 100px 1fr;
  gap: 0;
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

/* Table column widths specific to riders */
.table thead tr,
.table tbody tr {
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

## 📄 stats.css

**Path:** `features/stats/stats.css`

```
/* STATS - Optimisé */
@import '../../common.css';

.stats-view {
  padding: var(--spacing-lg);
  width: 80%;
  max-width: 95%;
  margin: 0 auto;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
  gap: var(--spacing-lg);
}

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

.stats-riders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
}

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
}
```

---

## 📄 animations.css

**Path:** `foundations/animations.css`

```
/* ============================================
   GLOBAL ANIMATIONS
   ============================================ */

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.spin { animation: spin 1s linear infinite; }
.fade-in { animation: fadeIn var(--transition-base); }
.slide-in { animation: slideIn var(--transition-slow); }
.bounce { animation: bounce 2s infinite; }
.pulse { animation: pulse 0.3s ease-out; }
```

---

## 📄 reset.css

**Path:** `foundations/reset.css`

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
  /* COLORS - Primary */
  --color-primary: #007bff;
  --color-primary-dark: #0056b3;
  --color-primary-light: #667eea;
  --color-primary-purple: #764ba2;

  /* COLORS - Secondary */
  --color-secondary: #6c757d;
  --color-secondary-dark: #545b62;

  /* COLORS - Success */
  --color-success: #28a745;
  --color-success-dark: #1e7e34;
  --color-success-light: #d4edda;
  --color-success-medium: #48bb78;
  --color-success-medium-dark: #38a169;

  /* COLORS - Danger */
  --color-danger: #dc3545;
  --color-danger-dark: #bd2130;
  --color-danger-light: #f8d7da;
  --color-danger-medium: #f56565;
  --color-danger-medium-dark: #e53e3e;

  /* COLORS - Warning */
  --color-warning: #ffc107;
  --color-warning-dark: #e0a800;
  --color-warning-light: #fff3cd;
  --color-warning-orange: #ed8936;
  --color-warning-orange-dark: #dd6b20;

  /* COLORS - Info */
  --color-info: #17a2b8;
  --color-info-dark: #117a8b;
  --color-info-light: #d1ecf1;
  --color-info-blue: #4299e1;
  --color-info-blue-dark: #3182ce;

  /* COLORS - Neutral */
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
  --color-gray-700: #495057;
  --color-gray-800: #2d3748;
  --color-gray-900: #212529;

  /* COLORS - Semantic Aliases */
  --color-surface: var(--color-white);
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

  /* DOMAIN COLORS - Horses */
  --color-pony-light: #ed64a6;
  --color-pony-dark: #d53f8c;
  --color-horse-light: #63b3ed;
  --color-horse-dark: #4299e1;

  /* DOMAIN COLORS - Owners */
  --color-laury-light: #fddce3;
  --color-laury-dark: #f5576c;
  --color-owner-light: #fee3c5;
  --color-owner-dark: #ed8936;
  --color-club-light: #dbeafe;
  --color-club-dark: #4299e1;
  --color-other-light: #fcdada;
  --color-other-dark: #f56565;

  /* DOMAIN COLORS - Riders */
  --color-rider-owner-light: #ed8936;
  --color-rider-owner-dark: #dd6b20;
  --color-rider-club-light: #4299e1;
  --color-rider-club-dark: #3182ce;
  --color-rider-loaner-light: #28a745;
  --color-rider-loaner-dark: #1e7e34;

  /* DOMAIN COLORS - Pairings */
  --color-pairing-own-light: #fef3c7;
  --color-pairing-own-dark: #ed8936;
  --color-pairing-loan-light: #d1fae5;
  --color-pairing-loan-dark: #48bb78;

  /* DOMAIN COLORS - Assignments */
  --color-assignment-manual-light: #90cdf4;
  --color-assignment-manual-dark: #4299e1;
  --color-assignment-automatic-light: #9ae6b4;
  --color-assignment-automatic-dark: #38a169;

  /* DOMAIN COLORS - Status */
  --color-status-active-light: #c6f6d5;
  --color-status-active-dark: #48bb78;
  --color-status-inactive-light: #e2e8f0;
  --color-status-inactive-dark: #718096;
  --color-status-pending-light: #fff5db;
  --color-status-pending-dark: #ed8936;
  --color-status-completed-light: #d6bcfa;
  --color-status-completed-dark: #764ba2;
  --color-status-cancelled-light: #fed7d7;
  --color-status-cancelled-dark: #f56565;

  /* SPACING */
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

  /* BORDER RADIUS */
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* SHADOWS */
  --shadow-none: none;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 10px 20px rgba(0, 0, 0, 0.2);
  --shadow-2xl: 0 20px 40px rgba(0, 0, 0, 0.25);

  /* TRANSITIONS */
  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;
  --transition-slower: 0.5s ease;

  /* TYPOGRAPHY - Font Sizes */
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

  /* TYPOGRAPHY - Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* TYPOGRAPHY - Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Z-INDEX System */
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-notification: 1080;

  /* GRADIENTS */
  --gradient-primary: linear-gradient(
    135deg,
    var(--color-primary-light) 0%,
    var(--color-primary-purple) 100%
  );
  --gradient-pony: linear-gradient(135deg, var(--color-pony-light) 0%, var(--color-pony-dark) 100%);
  --gradient-success: linear-gradient(
    135deg,
    var(--color-success-medium) 0%,
    var(--color-success-medium-dark) 100%
  );
  --gradient-danger: linear-gradient(
    135deg,
    var(--color-danger-medium) 0%,
    var(--color-danger-medium-dark) 100%
  );
  --gradient-secondary: linear-gradient(
    135deg,
    var(--color-gray-500) 0%,
    var(--color-gray-650) 100%
  );
  --gradient-warning: linear-gradient(
    135deg,
    var(--color-warning-orange) 0%,
    var(--color-warning-orange-dark) 100%
  );
  --gradient-info: linear-gradient(
    135deg,
    var(--color-info-blue) 0%,
    var(--color-info-blue-dark) 100%
  );
  --gradient-light: linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-gray-150) 100%);
  --gradient-alert-success: linear-gradient(
    135deg,
    var(--color-success-badge-light) 0%,
    var(--color-success-badge-medium) 100%
  );
  --gradient-alert-error: linear-gradient(
    135deg,
    var(--color-danger-badge-light) 0%,
    var(--color-danger-badge-medium) 100%
  );

  --gradient-palette-1: var(--gradient-primary);
  --gradient-palette-2: var(--gradient-info);
  --gradient-palette-3: var(--gradient-success);
  --gradient-palette-4: var(--gradient-warning);
  --gradient-palette-5: var(--gradient-danger);
  --gradient-palette-6: var(--gradient-secondary);
  --gradient-palette-7: var(--gradient-pony);
  --gradient-palette-8: var(--gradient-alert-success);
  --gradient-palette-9: var(--gradient-alert-error);
  --gradient-palette-10: var(--gradient-light);

  /* CALENDAR SPECIFIC */
  --hour-height: 60px;
  --start-hour: 9;
  --end-hour: 22;
  --day-header-height: 50px;
  --all-day-section-height: 50px;
  --selection-color: rgba(66, 153, 225, 0.2);
  --selection-border: var(--color-info-blue);
  --today-bg: var(--color-info-light, #ebf8ff);
  --hour-line-color: var(--color-gray-200);
}
```

---

## 📄 container.css

**Path:** `layouts/container.css`

```
/* ============================================
   CONTAINER LAYOUTS
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

/* ============================================
   VIEW CONTAINERS
   ============================================ */

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

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .container {
    padding: var(--spacing-md);
    width: 95%;
  }

  .view-container {
    padding: var(--spacing-sm);
    gap: var(--spacing-sm);
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

## 📄 empty-states.css

**Path:** `layouts/empty-states.css`

```
/* ============================================
   EMPTY & LOADING STATES
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

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
  text-align: center;
  color: var(--color-text-muted);
}

.loading p {
  margin-top: var(--spacing-sm);
  color: var(--color-text-muted);
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

## 📄 flex.css

**Path:** `layouts/flex.css`

```
/* ============================================
   FLEX UTILITIES
   ============================================ */

.flex {
  display: flex;
}

.inline-flex {
  display: inline-flex;
}

/* ============================================
   FLEX DIRECTION
   ============================================ */

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

/* ============================================
   FLEX WRAP
   ============================================ */

.flex-wrap {
  flex-wrap: wrap;
}

.flex-nowrap {
  flex-wrap: nowrap;
}

/* ============================================
   ALIGN ITEMS
   ============================================ */

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

/* ============================================
   JUSTIFY CONTENT
   ============================================ */

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

/* ============================================
   GAP UTILITIES
   ============================================ */

.gap-xs {
  gap: var(--spacing-xs);
}

.gap-sm {
  gap: var(--spacing-sm);
}

.gap-md {
  gap: var(--spacing-md);
}

.gap-lg {
  gap: var(--spacing-lg);
}

.gap-xl {
  gap: var(--spacing-xl);
}

/* ============================================
   COMMON PATTERNS
   ============================================ */

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

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .flex-between {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
}
```

---

## 📄 grid.css

**Path:** `layouts/grid.css`

```
/* ============================================
   GRID LAYOUTS
   ============================================ */

.grid {
  display: grid;
  gap: var(--spacing-md);
}

/* ============================================
   GRID COLUMNS
   ============================================ */

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

/* ============================================
   SPECIFIC GRIDS
   ============================================ */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
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

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 992px) {
  .two-column {
    grid-template-columns: 280px 1fr;
  }
}

@media (max-width: 768px) {
  .grid-2,
  .grid-3,
  .grid-4,
  .two-column,
  .two-column-balanced {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 📄 headers.css

**Path:** `layouts/headers.css`

```
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

## 📄 sections.css

**Path:** `layouts/sections.css`

```
/* ============================================
   SECTIONS
   ============================================ */

.section {
  margin-bottom: var(--spacing-xl);
}

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

@media (max-width: 768px) {
  .form-section {
    padding: var(--spacing-md);
  }
}
```

---
