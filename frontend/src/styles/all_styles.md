# 📁 Project Files Export

Generated on: Thu Jan 22 15:33:17 CET 2026

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
   
   - calendar.css for calendar features
   - events.css for event features
   - riders.css for rider features
   - horses.css for horse features
   - pairings.css for pairing features
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
```

---

## 📄 alerts.css
**Path:** `components/alerts.css`

```
/* ============================================
   ALERTS - All Alert Styles Consolidated
   ============================================ */

/* Base Alert */
.alert {
  padding: 12px 16px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  border-left: 4px solid;
  margin-bottom: 16px;
}

/* Alert Variants */
.alert-info {
  background-color: var(--color-info-light);
  color: var(--color-info-dark);
  border-left-color: var(--color-info);
}

.alert-success {
  background-image: var(--gradient-alert-success);
  color: var(--color-success-dark);
  border-left-color: var(--color-success);
}

.alert-warning {
  background-color: var(--color-warning-light);
  color: var(--color-warning-dark);
  border-left-color: var(--color-warning);
}

.alert-error,
.alert-danger {
  background-image: var(--gradient-alert-error);
  color: var(--color-danger-dark);
  border-left-color: var(--color-danger);
}

/* Alert Content */
.alert strong {
  font-weight: var(--font-weight-semibold);
}

.alert p {
  margin: 0;
}

.alert p + p {
  margin-top: 8px;
}

/* Dismissible Alerts */
.alert-dismissible {
  padding-right: 40px;
  position: relative;
}

.alert-dismissible .btn-close {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  transition: opacity var(--transition-base);
}

.alert-dismissible .btn-close:hover {
  opacity: 1;
}

/* Legacy Support */
.error {
  padding: 12px 16px;
  background: var(--color-danger-light);
  color: var(--color-danger-dark);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-danger);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.success {
  padding: 12px 16px;
  background: var(--color-success-light);
  color: var(--color-success-dark);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-success);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
```

---

## 📄 badges.css
**Path:** `components/badges.css`

```
/* ============================================
   BADGES – CONSOLIDATED & UNIFIED
   Design System compliant
   ============================================ */

/* ============================================
   BADGE BASE
   ============================================ */

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  padding: 4px 12px;
  border-radius: var(--radius-xl);

  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  white-space: nowrap;

  color: var(--color-white);

  transition: transform var(--transition-fast), box-shadow var(--transition-fast),
    opacity var(--transition-fast);
}

.badge.clickable {
  cursor: pointer;
}

.badge.clickable:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  opacity: 0.9;
}

/* ============================================
   COLOR VARIANT BADGES
   ============================================ */

.badge-primary {
  background-image: var(--gradient-primary);
  color: var(--color-white);
}

.badge-success {
  background-image: var(--gradient-success);
  color: var(--color-white);
}

.badge-danger {
  background-image: var(--gradient-danger);
  color: var(--color-white);
}

.badge-secondary {
  background-image: var(--gradient-secondary);
  color: var(--color-white);
}

.badge-warning {
  background-image: var(--gradient-warning);
  color: var(--color-white);
}

.badge-info {
  background-image: var(--gradient-info);
  color: var(--color-white);
}

/* ============================================
   HORSES
   ============================================ */

.badge[data-type='pony'] {
  background: var(--gradient-pony);
}

.badge[data-type='horse'] {
  background: var(--gradient-info);
}

/* ============================================
   OWNERS
   ============================================ */

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

/* ============================================
   RIDERS
   ============================================ */

.badge[data-type='owner'] {
  background: var(--gradient-warning);
}

.badge[data-type='loaner'] {
  background: var(--gradient-success);
}

/* Note: 'club' déjà défini dans OWNERS */

/* ============================================
   PAIRINGS
   ============================================ */

.badge[data-type='own'] {
  background: var(--gradient-warning);
}

.badge[data-type='loan'] {
  background: var(--gradient-success);
}

/* ============================================
   ASSIGNMENTS
   ============================================ */

.badge[data-type='manual'] {
  background: linear-gradient(
    135deg,
    var(--color-assignment-manual-light),
    var(--color-assignment-manual-dark)
  );
}

.badge[data-type='automatic'] {
  background: linear-gradient(
    135deg,
    var(--color-assignment-automatic-light),
    var(--color-assignment-automatic-dark)
  );
}

/* ============================================
   STATUS
   ============================================ */

.badge[data-type='active'] {
  background: var(--gradient-success);
}

.badge[data-type='inactive'] {
  background: var(--gradient-secondary);
}

.badge[data-type='pending'] {
  background: var(--gradient-warning);
}

.badge[data-type='completed'] {
  background: var(--gradient-info);
}

.badge[data-type='cancelled'] {
  background: var(--gradient-danger);
}

/* ============================================
   INSTRUCTORS
   ============================================ */

/* Laury */
.badge[data-type='1'] {
  background: var(--gradient-primary);
}

/* Kévin */
.badge[data-type='2'] {
  background: var(--gradient-info);
}

/* Julie */
.badge[data-type='3'] {
  background: var(--gradient-pony);
}

/* Capucine */
.badge[data-type='4'] {
  background: var(--gradient-warning);
}

/* Autre */
.badge[data-type='0'] {
  background: var(--gradient-secondary);
}

/* ============================================
   EVENT TYPES
   ============================================ */

.badge[data-type='private_lesson'] {
  background: var(--gradient-info);
}

.badge[data-type='grouped_lesson'] {
  background: var(--gradient-primary);
}

.badge[data-type='special'] {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.badge[data-type='competition'] {
  background: var(--gradient-warning);
}

.badge[data-type='blocked'] {
  background: var(--gradient-secondary);
}

.badge[data-type='service'] {
  background: var(--gradient-info);
}

.badge[data-type='loaner_free_time'] {
  background: var(--gradient-success);
}

/* ============================================
   SLOT STATUSES
   ============================================ */

.badge[data-type='scheduled'] {
  background: var(--gradient-secondary);
}

.badge[data-type='confirmed'] {
  background: var(--gradient-success);
}

/* Note: 'completed' et 'cancelled' déjà définis dans STATUS */

/* ============================================
   DAY BADGES (Loan days)
   ============================================ */

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

  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.day-badge.active {
  background: var(--gradient-primary);
}

.day-badge.inactive {
  background: var(--gradient-light);
  color: var(--color-gray-600);
  border: 1px solid var(--color-gray-400);
  opacity: 0.6;
}

.day-badge:hover {
  transform: translateY(-1px);
}

/* ============================================
   COUNT BADGES
   ============================================ */

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 24px;
  height: 24px;
  padding: 0 var(--spacing-sm);

  background: var(--color-primary-purple);
  color: var(--color-white);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

.riders-count-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
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

.riders-count-badge svg {
  font-size: 14px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

/* ============================================
   TODAY BADGE
   ============================================ */

.today-badge {
  display: inline-block;
  padding: 2px 8px;

  background: var(--gradient-success);
  color: var(--color-white);

  border-radius: var(--radius-full);
  font-size: 10px;
  white-space: nowrap;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .badge {
    font-size: 10px;
    padding: 3px 8px;
  }

  .day-badge {
    min-width: 32px;
    padding: 3px 5px;
    min-width: 28px;
    font-size: 9px;
  }

  .riders-count-badge {
    padding: 4px 8px;
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
   BUTTONS - All Button Styles Consolidated
   ============================================ */

/* ============================================
   BASE BUTTON
   ============================================ */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: 10px 20px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  text-decoration: none;
  line-height: 1.5;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:active:not(:disabled) {
  transform: scale(0.98);
}

.btn svg,
.btn i {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: inherit;
}

/* ============================================
   BUTTON SIZES
   ============================================ */

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
  gap: 6px;
  height: 36px;
}

.btn-md {
  padding: 10px 20px;
  height: 42px;
}

.btn-lg {
  padding: 12px 24px;
  font-size: 16px;
  gap: 10px;
  height: 48px;
}

/* ============================================
   ICON BUTTONS
   ============================================ */

.btn-icon {
  padding: 8px;
  width: 36px;
  height: 36px;
  gap: 0;
  min-width: 36px;
}

.btn-icon-modern {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-300);
  background: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
  color: var(--color-gray-600);
  font-size: 16px;
  padding: 0;
}

.btn-icon-modern:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
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
  transform: scale(1.1);
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
  transform: scale(1.1);
}

.btn-icon-modern svg {
  display: block;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.btn-icon-modern.success svg {
  color: var(--color-success-medium-dark);
}

.btn-icon-modern.success:hover:not(:disabled) svg {
  color: var(--color-white);
}

.btn-icon-modern.danger svg {
  color: var(--color-danger-medium-dark);
}

.btn-icon-modern.danger:hover:not(:disabled) svg {
  color: var(--color-white);
}

/* ============================================
   ICON BUTTON VARIANTS - Boutons d'actions
   ============================================ */

.btn-icon-view,
.btn-icon-edit,
.btn-icon-delete {
  background: var(--color-white);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-icon-view {
  color: var(--color-info-blue);
  border-color: var(--color-info-light);
}

.btn-icon-view:hover {
  background: var(--color-info-light);
  border-color: var(--color-info-blue);
  color: var(--color-info-blue-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(66, 153, 225, 0.2);
}

.btn-icon-edit {
  color: var(--color-gray-600);
  border-color: var(--color-gray-300);
}

.btn-icon-edit:hover {
  background: var(--color-gray-100);
  border-color: var(--color-gray-400);
  color: var(--color-gray-800);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-icon-delete {
  color: var(--color-danger-medium);
  border-color: var(--color-danger-light);
}

.btn-icon-delete:hover {
  background: var(--color-danger-light);
  border-color: var(--color-danger);
  color: var(--color-danger-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2);
}

/* ============================================
   BUTTON VARIANTS - SOLID
   ============================================ */

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

.btn-warning {
  background-image: var(--gradient-warning);
  color: var(--color-white);
}

.btn-warning:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(237, 137, 54, 0.4);
}

.btn-info {
  background-image: var(--gradient-info);
  color: var(--color-white);
}

.btn-info:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

/* ============================================
   BUTTON VARIANTS - OUTLINE
   ============================================ */

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
  color: var(--color-gray-600);
  border: 2px solid var(--color-gray-300);
}

.btn-outline-secondary:hover:not(:disabled) {
  background: rgba(108, 117, 125, 0.1);
  border-color: var(--color-secondary);
  color: var(--color-secondary);
  transform: translateY(-1px);
}

.btn-outline-danger {
  background-color: transparent;
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
}

.btn-outline-danger:hover:not(:disabled) {
  background-color: var(--color-danger);
  color: var(--color-white);
}

/* ============================================
   BUTTON VARIANTS - GHOST
   ============================================ */

.btn-ghost {
  background: none;
  border: none;
  color: var(--color-gray-600);
  padding: var(--spacing-xs);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--color-gray-100);
  color: var(--color-gray-900);
}

.btn-edit-ghost:hover {
  background: var(--color-info-light);
  color: var(--color-info-blue-dark);
}

.btn-danger-ghost:hover {
  background: var(--color-danger-light);
  color: var(--color-danger-medium-dark);
}

/* ============================================
   BUTTON VARIANTS - LINK
   ============================================ */

.btn-link {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  padding: var(--spacing-xs);
  transition: all var(--transition-base);
  text-decoration: none;
}

.btn-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

/* ============================================
   CLOSE BUTTON
   ============================================ */

.btn-close,
.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: background-color var(--transition-base);
  color: var(--color-gray-600);
  flex-shrink: 0;
  font-size: 24px;
  width: 36px;
  height: 36px;
}

.btn-close:hover,
.modal-close:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
}

/* ============================================
   BUTTON GROUPS
   ============================================ */

.btn-group {
  display: inline-flex;
  gap: var(--spacing-sm);
}

.btn-group-vertical {
  display: inline-flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xs);
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

/* ============================================
   MOBILE MENU BUTTON
   ============================================ */

.btn-menu {
  color: var(--color-info-blue);
  padding: 10px;
  font-size: 18px;
  min-width: 44px;
  min-height: 44px;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .btn {
    padding: 8px 16px;
    font-size: 13px;
  }

  .btn-sm {
    padding: 5px 10px;
    font-size: 12px;
  }

  .btn-lg {
    padding: 10px 20px;
    font-size: 15px;
  }

  .segment-btn {
    padding: 8px 12px;
    font-size: 13px;
  }

  .btn-group,
  .button-group {
    width: 100%;
  }

  .btn-group .btn,
  .button-group .btn {
    flex: 1;
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
  background: var(--gradient-primary);
  border-radius: 2px;
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
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-body {
  /* Card body styles */
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
  color: var(--color-primary);
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

  .card-enhanced {
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
```

---

## 📄 filters.css
**Path:** `components/filters.css`

```
/* ============================================
   FILTERS - All Filter Styles Consolidated
   ============================================ */

/* Filter Section */
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Filter Buttons */
.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Filter Pills */
.filter-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.pill {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: var(--color-white);
  color: var(--color-gray-700);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-full);
  font-size: 14px;
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

/* Rider Type Pills */
.pill[data-rider-type='owner'].pill-active {
  background: var(--gradient-warning);
  border-color: var(--color-warning-orange);
  box-shadow: 0 2px 8px rgba(237, 137, 54, 0.3);
}

.pill[data-rider-type='club'].pill-active {
  background: var(--gradient-info);
  border-color: var(--color-info-blue);
  box-shadow: 0 2px 8px rgba(66, 153, 225, 0.3);
}

.pill[data-rider-type='loaner'].pill-active {
  background: var(--gradient-success);
  border-color: var(--color-success-medium);
  box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3);
}

.pill[data-rider-type='all'].pill-active {
  background: var(--gradient-secondary);
  border-color: var(--color-secondary);
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
}

/* Ownership Type Pills */
.pill[data-ownership-type='all'].pill-active {
  background: var(--gradient-secondary);
  border-color: var(--color-secondary);
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
}

.pill[data-ownership-type='laury'].pill-active {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-color: var(--color-laury);
  box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
}

.pill[data-ownership-type='private_owner'].pill-active {
  background: var(--gradient-success);
  border-color: var(--color-success);
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.pill[data-ownership-type='club'].pill-active {
  background: var(--gradient-info);
  border-color: var(--color-info);
  box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);
}

.pill[data-ownership-type='other'].pill-active {
  background: var(--gradient-warning);
  border-color: var(--color-warning);
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .filter-buttons {
    justify-content: center;
  }

  .filter-pills {
    justify-content: center;
    padding: 10px;
  }

  .pill {
    padding: 6px 12px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .filter-section {
    gap: 12px;
  }

  .filter-buttons {
    gap: 8px;
  }

  .filter-pills {
    gap: 6px;
    padding: 8px;
  }

  .pill {
    padding: 5px 10px;
    font-size: 12px;
  }
}
```

---

## 📄 forms.css
**Path:** `components/forms.css`

```
/* ============================================
   FORMS - All Form Styles Consolidated
   ============================================ */

/* ============================================
   FORM GROUPS
   ============================================ */

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: 8px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

/* ============================================
   FORM LABELS
   ============================================ */

.form-group label,
.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.form-label-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-label-icon svg {
  color: var(--color-primary);
  font-size: 16px;
}

/* ============================================
   FORM INPUTS
   ============================================ */

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 8px 12px;
  font-size: var(--font-size-sm);
  border: 1px solid var(--color-gray-400);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
  font-family: inherit;
  background: var(--color-white);
  color: var(--color-gray-900);
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
  background-color: var(--color-gray-100);
  cursor: not-allowed;
  opacity: 0.6;
}

.form-input::placeholder {
  color: var(--color-gray-500);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Input with specific heights */
.form-input-md {
  height: 42px;
}

.form-input-sm {
  height: 36px;
  padding: 0 var(--spacing-sm);
  font-size: var(--font-size-sm);
}

/* ============================================
   INLINE FORM GROUPS
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
  color: var(--color-gray-700);
  margin-bottom: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.inline-form-group label svg {
  font-size: 14px;
  flex-shrink: 0;
}

.inline-form-group input,
.inline-form-group select {
  flex: 1;
  height: 36px;
  padding: 0 var(--spacing-sm);
  border: 1px solid var(--color-gray-300);
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
   NUMBER INPUTS
   ============================================ */

.compact-number-input {
  width: 80px;
  height: 36px;
  padding: 0 var(--spacing-sm);
  font-size: var(--font-size-sm);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  text-align: center;
  color: var(--color-gray-900);
  transition: all var(--transition-base);
}

.compact-number-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* ============================================
   DATE & TIME INPUTS
   ============================================ */

input[type='date'],
input[type='time'],
input[type='datetime-local'] {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: inherit;
  transition: all var(--transition-base);
  background: var(--color-white);
}

input[type='date']:focus,
input[type='time']:focus,
input[type='datetime-local']:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* ============================================
   CHECKBOX & RADIO
   ============================================ */

input[type='checkbox'],
input[type='radio'] {
  width: 16px;
  height: 16px;
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

/* ============================================
   FORM VALIDATION STATES
   ============================================ */

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

/* ============================================
   HELPER TEXT
   ============================================ */

.form-helper-text,
.text-muted {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-gray-600);
}

.text-info {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-info);
}

.text-danger {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-danger);
}

/* ============================================
   FORM ACTIONS
   ============================================ */

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  align-items: center;
}

.form-actions-end {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 2px solid var(--color-gray-150);
}

/* ============================================
   SPECIAL INPUT TYPES
   ============================================ */

/* Selection Cards (for radio/checkbox alternatives) */
.selection-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.selection-card {
  position: relative;
}

.selection-card input[type='radio'],
.selection-card input[type='checkbox'] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.selection-card-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  text-align: center;
  background: var(--color-white);
}

.selection-card-label:hover {
  border-color: var(--color-primary-light);
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.selection-card input:checked + .selection-card-label {
  border-color: var(--color-primary);
  background: var(--gradient-primary);
  color: var(--color-white);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.selection-card-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.1);
  border-radius: var(--radius-md);
  font-size: 20px;
  transition: all var(--transition-base);
}

.selection-card input:checked + .selection-card-label .selection-card-icon {
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-white);
}

.selection-card-text {
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
}

/* ============================================
   RESPONSIVE
   ============================================ */

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

  .selection-cards {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .form-actions .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .form-group {
    padding: var(--spacing-xs);
  }
}
```

---

## 📄 modals.css
**Path:** `components/modals.css`

```
/* ============================================
   MODALS - All Modal Styles Consolidated
   ============================================ */

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

/* Modal Content */
.modal-content {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn var(--transition-slow);
}

/* Modal Sizes */
.modal-content.small {
  width: 100%;
  max-width: 400px;
}

.modal-content.medium {
  width: 100%;
  max-width: 600px;
}

.modal-content.large {
  width: 100%;
  max-width: 900px;
}

.modal-content.xlarge {
  width: 100%;
  max-width: 1400px;
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-gray-200);
}

.modal-header h2,
.modal-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 1.3rem;
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
  gap: var(--spacing-sm);
}

.modal-title-danger {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-danger);
}

/* Modal Body */
.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

/* Modal Footer */
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--color-gray-200);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

/* Modal Tabs */
.modal-tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--color-gray-200);
  padding: 0 24px;
}

.modal-tabs .tab {
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

.modal-tabs .tab:hover {
  color: var(--color-primary);
}

.modal-tabs .tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* Modal States */
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
  margin-top: 12px;
  color: var(--color-gray-600);
}

.modal-error h3 {
  margin: 16px 0 8px;
  color: var(--color-danger);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content.small,
  .modal-content.medium,
  .modal-content.large,
  .modal-content.xlarge {
    max-width: 95vw;
  }

  .modal-header {
    padding: 16px 18px;
  }

  .modal-body {
    padding: 18px;
  }

  .modal-footer {
    padding: 12px 20px;
    flex-direction: column;
    align-items: stretch;
  }

  .modal-footer .btn {
    width: 100%;
  }
}
```

---

## 📄 tables.css
**Path:** `components/tables.css`

```
/* ============================================
   TABLES - All Table Styles Consolidated
   ============================================ */

/* Table Container */
.table-container {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Base Table */
.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--color-white);
  border-radius: var(--radius-lg);
}

.table thead {
  background-image: var(--gradient-light);
  border-bottom: 2px solid var(--color-gray-200);
}

.table th {
  padding: 12px 16px;
  text-align: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  color: var(--color-gray-650);
  border-bottom: 1px solid var(--color-gray-300);
}

.table td {
  padding: 12px 16px;
  font-size: var(--font-size-sm);
  text-align: center;
  color: var(--color-gray-900);
  border-bottom: 1px solid var(--color-gray-200);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr:hover {
  background-color: var(--color-gray-100);
}

/* Table Actions */
.table-actions,
.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
}

.table-actions button,
.action-buttons button {
  /* Les styles spécifiques sont sur .btn-icon-view, .btn-icon-edit, etc. */
  flex-shrink: 0;
}

/* Table Variants */
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

/* Responsive */
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
}
```

---

## 📄 utilities.css
**Path:** `components/utilities.css`

```
/* ============================================
   UTILITY CLASSES
   ============================================ */

/* ============================================
   SPACING UTILITIES
   ============================================ */

.mt-10 { margin-top: 10px; }
.mt-20 { margin-top: 20px; }
.mb-10 { margin-bottom: 10px; }
.mb-15 { margin-bottom: 15px; }
.mb-20 { margin-bottom: 20px; }
.mb-30 { margin-bottom: 30px; }
.ml-10 { margin-left: 10px; }
.mr-10 { margin-right: 10px; }

.pt-10 { padding-top: 10px; }
.pt-20 { padding-top: 20px; }
.pb-10 { padding-bottom: 10px; }
.pb-20 { padding-bottom: 20px; }
.pl-10 { padding-left: 10px; }
.pr-10 { padding-right: 10px; }

/* ============================================
   DISPLAY UTILITIES
   ============================================ */

.d-flex { display: flex; }
.d-inline-flex { display: inline-flex; }
.d-block { display: block; }
.d-inline-block { display: inline-block; }
.d-none { display: none; }

/* ============================================
   TEXT UTILITIES
   ============================================ */

.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.text-muted { color: var(--color-gray-600); }
.text-primary { color: var(--color-primary); }
.text-success { color: var(--color-success); }
.text-danger { color: var(--color-danger); }
.text-warning { color: var(--color-warning); }
.text-info { color: var(--color-info); }

.font-weight-normal { font-weight: var(--font-weight-normal); }
.font-weight-medium { font-weight: var(--font-weight-medium); }
.font-weight-bold { font-weight: var(--font-weight-bold); }

/* ============================================
   WIDTH/HEIGHT UTILITIES
   ============================================ */

.w-100 { width: 100%; }
.h-100 { height: 100%; }

/* ============================================
   OVERFLOW UTILITIES
   ============================================ */

.overflow-auto { overflow: auto; }
.overflow-hidden { overflow: hidden; }
.overflow-scroll { overflow: scroll; }

/* ============================================
   POSITION UTILITIES
   ============================================ */

.position-relative { position: relative; }
.position-absolute { position: absolute; }
.position-fixed { position: fixed; }
.position-sticky { position: sticky; }

/* ============================================
   CURSOR UTILITIES
   ============================================ */

.cursor-pointer { cursor: pointer; }
.cursor-not-allowed { cursor: not-allowed; }
.cursor-default { cursor: default; }

/* ============================================
   VISIBILITY UTILITIES
   ============================================ */

.visible { visibility: visible; }
.invisible { visibility: hidden; }
.opacity-0 { opacity: 0; }
.opacity-50 { opacity: 0.5; }
.opacity-100 { opacity: 1; }
```

---

## 📄 calendar.css
**Path:** `features/calendar.css`

```
/* ============================================
   CALENDAR FEATURE
   Version corrigée + améliorée (structure + UI)
   ============================================ */

@import '../common.css';

/* ============================================
   VARIABLES
   ============================================ */

:root {
  --hour-height: 60px;
  --start-hour: 8;
  --end-hour: 22;

  --selection-color: rgba(66, 153, 225, 0.2);
  --selection-border: var(--color-info-blue);
  --today-bg: var(--color-info-light, #ebf8ff);
  --hour-line-color: var(--color-gray-200);
}

/* ============================================
   CALENDAR VIEW
   ============================================ */

.calendar-view {
  padding: var(--spacing-lg);
  background: var(--color-gray-100);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.calendar-loading,
.calendar-error {
  min-height: 400px;
  padding: var(--spacing-xl);
  margin: var(--spacing-lg);
}

/* ============================================
   HEADER
   ============================================ */

.calendar-header {
}

.calendar-title::before {
  content: '';
  width: var(--spacing-xs);
  height: 24px;
  background: var(--gradient-primary);
  border-radius: var(--radius-sm);
  position: absolute;
  left: calc(-1 * var(--spacing-md));
  top: 50%;
  transform: translateY(-50%);
}

.calendar-nav-buttons {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.calendar-filters {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.filter-line,
.filters-group {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

/* ============================================
   CALENDAR CONTENT
   ============================================ */

.calendar-content {
  flex: 1;
  min-height: 0;
  overflow-x: auto;
  padding: var(--spacing-sm);
}

/* ============================================
   WEEK VIEW / GRID
   ============================================ */

.week-view {
  background: var(--gradient-light);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-gray-200);
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.week-grid {
  display: grid;
  grid-template-columns: 64px repeat(7, minmax(0, 1fr));
  width: 100%;
  height: 100%;
  background: var(--color-white);
}

/* ============================================
   TIME COLUMN
   ============================================ */

.time-column {
  background: linear-gradient(to bottom, var(--color-gray-100), var(--color-gray-50));
  border-right: 1px solid var(--color-gray-300);
  display: flex;
  flex-direction: column;
}

.time-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  border-bottom: 1px solid var(--color-gray-300);
  position: sticky;
  top: 0;
  background: var(--color-gray-100);
  z-index: 20;
}

.time-slot {
  height: var(--hour-height);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding-right: var(--spacing-sm);
  padding-top: 2px;
  font-size: 11px;
  color: var(--color-gray-600);
  letter-spacing: 0.02em;
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
  border-right: 1px solid var(--color-gray-200);
  background: var(--color-white);
}

.day-column:last-child {
  border-right: none;
}

.day-column.today {
  background: linear-gradient(to bottom, var(--today-bg), transparent 120px);
}

.day-column.past {
  opacity: 0.6;
}

/* ============================================
   DAY HEADER
   ============================================ */

.day-header {
  height: 80px;
  padding: var(--spacing-sm);
  border-bottom: 1px solid var(--color-gray-300);
  text-align: center;
  background: linear-gradient(to bottom, var(--color-white), var(--color-gray-50));
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
   ALL DAY SLOTS
   ============================================ */

.all-day-slots {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  border-bottom: 1px solid var(--color-gray-200);
}

/* ============================================
   DAY GRID
   ============================================ */

.day-grid-container {
  position: relative;
  flex: 1;
  min-height: 0;
}

.day-grid {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: calc((var(--end-hour) - var(--start-hour)) * var(--hour-height));
  overflow-y: auto;
  overflow-x: hidden;
}

/* Scrollbar */
.day-grid::-webkit-scrollbar {
  width: 6px;
}

.day-grid::-webkit-scrollbar-thumb {
  background: var(--color-gray-300);
  border-radius: var(--radius-full);
}

/* ============================================
   HOUR MARKERS
   ============================================ */

.hour-markers {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.hour-marker-row {
  position: absolute;
  width: 100%;
  height: var(--hour-height);
  border-bottom: 1px dashed var(--color-gray-200);
  box-sizing: border-box;
  cursor: crosshair;
}

.hour-marker-row:nth-child(2n) {
  border-bottom: 1px solid var(--color-gray-300);
}

.hour-marker-row:hover {
  background-color: rgba(66, 153, 225, 0.04);
}

/* ============================================
   SELECTION
   ============================================ */

.selection-overlay {
  position: absolute;
  background-color: var(--selection-color);
  border: 2px solid var(--selection-border);
  border-radius: var(--radius-sm);
  pointer-events: none;
  z-index: 10;
}

/* ============================================
   EVENTS
   ============================================ */

.events-container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.event-slot-wrapper {
  position: absolute;
  left: 0;
  right: 0;
}

/* ============================================
   EVENT CARD
   ============================================ */

.event-card {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-lg);
  background: var(--color-white);
  border-left: 4px solid var(--color-info-blue);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: var(--spacing-xs) var(--spacing-sm);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.event-card:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: var(--shadow-xl);
  z-index: 10;
}

/* ============================================
   MOBILE
   ============================================ */

.mobile-day-view,
.mobile-days-nav {
  display: none;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 640px) {
  .week-grid {
    display: none;
  }

  .mobile-day-view,
  .mobile-days-nav {
    display: block;
  }
}
```

---

## 📄 events.css
**Path:** `features/events.css`

```
/* ============================================
   EVENTS FEATURE
   Styles spécifiques aux événements uniquement
   Les styles communs sont dans common.css
   ============================================ */

@import '../common.css';

/* ============================================
   EVENT FORM (extends .form-section)
   ============================================ */

.event-form-modern {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--spacing-sm);
}

.event-form-row {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.event-form-times-group {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
  flex-wrap: wrap;
}

.event-form-duration-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--gradient-light);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

/* ============================================
   PARTICIPANTS SECTION
   ============================================ */

.participants-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.participants-table-wrapper {
  background: var(--gradient-light);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.participants-table {
  width: 100%;
  border-collapse: collapse;
}

.participants-table thead {
  background: var(--color-gray-100);
}

.participants-table th {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-700);
  border-bottom: 2px solid var(--color-gray-200);
}

.participants-table tbody tr {
  border-bottom: 1px solid var(--color-gray-150);
  transition: all var(--transition-base);
}

.participants-table tbody tr:hover {
  background: var(--color-gray-50);
}

.participants-table td {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-gray-900);
}

.participant-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.participant-actions {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}

/* ============================================
   EVENT MODAL
   ============================================ */

.event-modal-title-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: 100%;
}

.event-modal-title-badges {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.event-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-xl);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.event-badge svg {
  width: 14px;
  height: 14px;
}

.event-badge-recurrence {
  background: #e9d5ff;
  color: #7c3aed;
}

.event-badge-scheduled {
  background: var(--color-info-light);
  color: var(--color-info-blue-dark);
}

.event-badge-confirmed {
  background: var(--color-success-light);
  color: var(--color-success-medium-dark);
}

.event-badge-cancelled {
  background: var(--color-danger-light);
  color: var(--color-danger-dark);
}

.event-badge-blocked {
  background: var(--color-gray-100);
  color: var(--color-gray-700);
}

.event-modal-subtitle {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-gray-200);
}

.event-modal-meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.event-tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: var(--color-primary);
  color: var(--color-white);
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: var(--font-weight-bold);
  margin-left: var(--spacing-xs);
}

/* ============================================
   EVENT DETAILS
   ============================================ */

.event-details-row {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-gray-150);
}

.event-details-row:last-child {
  border-bottom: none;
}

.event-details-label {
  min-width: 140px;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.event-details-value {
  flex: 1;
  color: var(--color-gray-900);
  font-size: var(--font-size-sm);
}

/* ============================================
   BLOCKED TIME FORM (utilise les classes communes)
   ============================================ */

.blocked-time-form {
  display: flex;
  flex-direction: column;
}

.blocked-time-duration-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--gradient-light);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  margin-top: var(--spacing-sm);
}

.blocked-time-duration-display svg {
  font-size: 16px;
  color: var(--color-primary);
}

/* ============================================
   SCHEDULED EVENTS MODAL
   Reuses common styles with minimal additions
   ============================================ */

/* Date Header */
.scheduled-date-header {
  background: var(--gradient-light);
  border-left: 4px solid var(--color-secondary);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scheduled-date-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  text-transform: capitalize;
  display: flex;
  flex: 1;
  align-items: center;
  gap: var(--spacing-sm);
}

.scheduled-date-count {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

/* Events List */
.scheduled-events-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* Event Card */
.scheduled-event-card {
  display: flex;
  flex-direction: column;
}

.scheduled-event-card.processing {
  opacity: 0.6;
}

.scheduled-event-main {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-sm);
  align-items: stretch;
}

.scheduled-event-box {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
}

.scheduled-event-box:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-light);
}

/* Event Time */
.scheduled-event-time {
  gap: var(--spacing-xs);
}

.scheduled-event-time-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  gap: var(--spacing-xs);
}

.scheduled-event-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.scheduled-event-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
}

.scheduled-event-details {
  min-width: 200px !important;
}

.scheduled-event-metadata {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.scheduled-event-metadata-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

/* Event Participants */
.scheduled-event-participants-list {
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: var(--spacing-xs);
}

.scheduled-event-participant {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
}

.scheduled-event-participant svg {
  font-size: 12px;
  color: var(--color-primary);
}

.scheduled-event-actions {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-left: auto;
  align-items: flex-end;
  gap: var(--spacing-sm);
}

.scheduled-event-created {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  font-style: italic;
  margin-top: var(--spacing-xs);
  text-align: right;
}

.scheduled-event-btn-validate {
  background: var(--color-success-light);
  color: var(--color-success-medium-dark);
}

.scheduled-event-btn-validate:hover:not(:disabled) {
  background: var(--color-success-medium);
  color: var(--color-white);
}

/* Delete Confirmation */
.scheduled-delete-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.scheduled-delete-event {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
}

.scheduled-delete-warning {
  margin-top: var(--spacing-sm);
  color: var(--color-danger-medium-dark);
  font-weight: var(--font-weight-medium);
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .event-form-modern {
    max-height: 60vh;
    gap: var(--spacing-sm);
  }

  .event-form-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }

  .event-form-times-group {
    flex-direction: column;
    align-items: stretch;
  }

  .participants-table-wrapper {
    overflow-x: auto;
  }

  .participants-table {
    min-width: 500px;
  }

  .event-modal-subtitle {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .scheduled-events-content {
    max-height: 50vh;
  }

  .scheduled-event-card {
    padding: var(--spacing-sm);
  }

  .scheduled-event-content {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .scheduled-event-time {
    min-width: auto;
  }

  .scheduled-event-participants {
    min-width: auto;
    width: 100%;
  }

  .scheduled-date-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}

@media (max-width: 480px) {
  .event-form-modern {
    max-height: 50vh;
  }
}

/* Event Time Range */
.scheduled-event-time-range {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.scheduled-event-time-separator {
  display: none; /* Plus nécessaire */
}

.badge-recurrence {
  background: var(--gradient-info);
}

.modal-title-danger {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-danger);
}

.event-details-type-banner {
  padding: 12px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
}

.modal-footer-split {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.modal-footer-actions {
  display: flex;
  gap: var(--spacing-md);
}

.text-danger {
  color: var(--color-danger-medium-dark);
  font-weight: 500;
}

.mt-12 {
  margin-top: 12px;
}

.mb-16 {
  margin-bottom: 16px;
}

.badge-icon {
  font-size: 14px;
  margin-right: 4px;
}

.detail-label-icon {
  font-size: 12px;
  margin-right: 4px;
}

.metadata-icon {
  font-size: 11px;
  margin-right: 4px;
}

.blocked-event-status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
}

.participant-horse-item {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
}

.participant-horse-item:hover {
  background-color: var(--color-gray-100);
}

.participant-horse-item.selected {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn-link {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}

.btn-link:hover {
  color: var(--color-primary-dark);
}
```

---

## 📄 horses.css
**Path:** `features/horses.css`

```
/* ============================================
   HORSES FEATURE
   Styles spécifiques aux chevaux uniquement
   Les styles communs sont dans common.css
   ============================================ */

@import '../common.css';

/* ============================================
   HORSES TABLE LAYOUT
   ============================================ */

.table thead,
.table tbody {
  display: block;
}

.table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

.table thead tr {
  display: grid;
  grid-template-columns: 200px 120px 140px 140px 420px 100px 1fr;
  gap: 0;
}

.table tbody tr {
  display: grid;
  grid-template-columns: 200px 120px 140px 140px 420px 100px 1fr;
  gap: 0;
}

.table th:nth-child(1),
.table td:nth-child(1) {
  justify-content: flex-start;
  text-align: left;
}

.table th:nth-child(7),
.table td:nth-child(7) {
  justify-content: flex-end;
  text-align: right;
}

/* ============================================
   HORSE ROW
   ============================================ */
.horse-row-clickable {
  cursor: pointer;
}

.horse-row-clickable:hover {
  background-color: var(--color-gray-50);
}

.horse-row {
  position: relative;
}

.horse-row:hover {
  background: var(--color-gray-50);
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
  justify-content: flex-end;
}

/* ============================================
   LOAN DAYS BADGES
   ============================================ */

.loan-days-cell {
  display: inline-flex !important;
  flex-direction: row !important;
  gap: var(--spacing-xs);
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  padding: var(--spacing-xs) var(--spacing-sm);
}

.no-loan-days {
  color: var(--color-gray-400);
  font-size: var(--font-size-sm);
  font-style: italic;
}

/* ============================================
   MOBILE MENU
   ============================================ */

@media (max-width: 768px) {
  .horse-row {
    cursor: default;
  }

  .horse-row:hover {
    background: transparent;
  }

  .btn-menu {
    color: var(--color-info-blue);
    padding: var(--spacing-sm);
    font-size: var(--font-size-lg);
    min-width: 44px;
    min-height: 44px;
  }

  .menu-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
    animation: fadeIn var(--transition-base) ease;
  }

  .actions-menu-mobile {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--color-white);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    box-shadow: var(--shadow-xl);
    z-index: 1000;
    padding: var(--spacing-lg);
    padding-bottom: calc(var(--spacing-lg) + env(safe-area-inset-bottom));
    animation: slideIn var(--transition-slow) ease;
  }

  .actions-menu-mobile button {
    width: 100%;
    padding: var(--spacing-md);
    border: none;
    background: var(--color-gray-50);
    margin-bottom: var(--spacing-sm);
    border-radius: var(--radius-lg);
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    color: var(--color-gray-800);
  }

  .actions-menu-mobile button:hover {
    background: var(--color-gray-150);
  }

  .actions-menu-mobile .menu-delete {
    background: var(--color-danger-light);
    color: var(--color-danger-medium-dark);
  }

  .actions-menu-mobile .menu-delete:hover {
    background: var(--color-danger-badge-light);
  }
}

/* ============================================
   RESPONSIVE TABLE LAYOUT
   ============================================ */

@media (max-width: 1200px) {
  .table thead tr,
  .table tbody tr {
    grid-template-columns: 80px 100px 140px 120px 140px 90px 1fr;
  }

  .loan-days-cell {
    gap: 3px;
    padding: var(--spacing-xs) 6px;
  }
}

@media (max-width: 992px) {
  .table thead tr,
  .table tbody tr {
    grid-template-columns: 80px 90px 120px 100px 120px 80px 1fr;
  }

  .loan-days-cell {
    gap: 2px;
    padding: var(--spacing-xs);
  }
}

@media (max-width: 768px) {
  .table thead tr,
  .table tbody tr {
    grid-template-columns: 80px 80px 110px 90px 110px 70px 60px;
  }

  .loan-days-cell {
    gap: 2px;
    padding: 2px;
    flex-wrap: wrap;
  }
}

@media (max-width: 640px) {
  .table thead,
  .table thead tr {
    display: none !important;
  }

  .table tbody tr {
    display: block;
    background: var(--color-white);
    margin-bottom: var(--spacing-md);
    padding: var(--spacing-md);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--color-gray-150);
  }

  .table tbody tr td {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--color-gray-100);
  }

  .table tbody tr td:last-child {
    border-bottom: none;
  }

  .table tbody tr td::before {
    content: attr(data-label);
    font-weight: var(--font-weight-semibold);
    color: var(--color-gray-600);
    margin-right: var(--spacing-sm);
    flex-shrink: 0;
  }

  .loan-days-cell {
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .action-buttons {
    justify-content: flex-end;
    gap: var(--spacing-sm);
  }
}

/* ============================================
   HORSE CARD MODAL
   ============================================ */

.horse-card-modal {
  max-width: 1200px;
  width: 95%;
  max-height: 85vh;
  overflow-y: auto;
}

.horse-card-content {
  padding: var(--spacing-lg);
}

.horse-card-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.horse-card-avatar {
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

.horse-card-title-text {
  flex: 1;
  min-width: 0;
}

.horse-card-title-text h2 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.horse-card-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-sm);
}

.horse-card-meta {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.horse-card-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.horse-card-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.horse-card-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* ============================================
   PAIRINGS LIST (reuse from riders)
   ============================================ */

.pairings-list-modern {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.pairing-item-modern {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--gradient-light);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.pairing-item-modern:hover {
  border-color: var(--color-success-medium);
  box-shadow: var(--shadow-md);
  transform: translateX(4px);
}

.pairing-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;
}

.pairing-header {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.pairing-horse-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pairing-type-badge {
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pairing-type-badge.loan {
  background: var(--color-success-light);
  color: var(--color-success-medium);
}

.pairing-type-badge.own {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.pairing-days {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.day-badge {
  min-width: 38px;
  padding: 4px 8px;
  font-size: 11px;
  text-align: center;
  border-radius: var(--radius-sm);
}

.day-badge.active {
  background: var(--color-success-medium);
  color: white;
}

.day-badge.inactive {
  background: var(--color-gray-200);
  color: var(--color-gray-600);
}

.pairing-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

/* ============================================
   RESPONSIVE HORSE CARD
   ============================================ */

@media (max-width: 1200px) {
  .horse-card-grid {
    grid-template-columns: 280px 1fr;
  }
}

@media (max-width: 992px) {
  .horse-card-grid {
    grid-template-columns: 1fr;
  }

  .horse-card-sidebar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .horse-card-content {
    padding: var(--spacing-md);
  }

  .horse-card-sidebar {
    grid-template-columns: 1fr;
  }

  .pairing-item-modern {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .pairing-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

/* ============================================
   RIDERS MODAL
   ============================================ */

.modal-loading {
  text-align: center;
  padding: 40px;
}

.modal-loading > svg {
  font-size: 32px;
  margin-bottom: 12px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--color-gray-500);
}

.empty-state > svg {
  font-size: 48px;
  margin-bottom: 12px;
}

.modal-title-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}

.riders-modal-content {
  /* Container for the modal content */
}

.riders-modal-info {
  margin: 16px;
  color: var(--color-gray-600);
  display: flex;
  align-items: center;
  gap: 8px;
}

.riders-modal-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
}

.riders-modal-item {
  padding: 16px;
  border-bottom: 1px solid var(--color-gray-200);
  background-color: var(--color-white);
}

.riders-modal-item:last-child {
  border-bottom: none;
}

.riders-modal-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.riders-modal-rider-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.riders-modal-rider-name {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
}

.pairing-days {
  display: flex;
  flex-direction: row;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 12px;
  padding-top: 12px;
}
```

---

## 📄 pairings.css
**Path:** `features/pairings.css`

```
/* ============================================
   PAIRINGS FEATURE
   Styles spécifiques aux pairings uniquement
   Les styles communs sont dans common.css
   ============================================ */

@import '../common.css';

/* ============================================
   PAIRING FORM
   ============================================ */

.pairing-form-modern {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.pairing-form-section {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);
}

.pairing-form-section:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-light);
}

.pairing-form-section-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-gray-150);
}

.pairing-form-section-icon {
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

.pairing-form-section-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
  margin: 0;
}

/* ============================================
   HORSE SELECTION CARD
   ============================================ */

.horse-selection-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
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

/* ============================================
   DATE INPUTS
   ============================================ */

.dates-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.date-input-wrapper {
  position: relative;
}

.date-input-wrapper label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
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
   LINK TYPE SELECTOR
   ============================================ */

.link-type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
}

.link-type-option {
  position: relative;
}

.link-type-option input[type='radio'] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.link-type-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  text-align: center;
  background: var(--color-white);
}

.link-type-label:hover {
  border-color: var(--color-primary-light);
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.link-type-option input:checked + .link-type-label {
  border-color: var(--color-primary);
  background: var(--gradient-primary);
  color: var(--color-white);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.link-type-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.1);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xl);
  transition: all var(--transition-base);
}

.link-type-option input:checked + .link-type-label .link-type-icon {
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-white);
}

.link-type-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

/* ============================================
   LOAN DAYS SELECTOR
   ============================================ */

.loan-settings {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 2px solid var(--color-gray-150);
}

.loan-days-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.loan-days-input label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.days-selector-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  margin-bottom: var(--spacing-sm);
}

.days-selector-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-sm);
}

.day-button {
  position: relative;
  aspect-ratio: 1;
  padding: var(--spacing-sm) var(--spacing-sm);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  color: var(--color-gray-700);
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
  background: var(--color-gray-100);
}

.day-button.selected:disabled {
  opacity: 1;
}

/* ============================================
   PAIRING DISPLAY
   ============================================ */

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

.pairing-type-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.pairing-type-badge.own {
  background: var(--gradient-warning);
  color: var(--color-white);
}

.pairing-type-badge.loan {
  background: var(--gradient-success);
  color: var(--color-white);
}

.pairing-days {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: var(--spacing-xs);
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .dates-grid {
    grid-template-columns: 1fr;
  }

  .link-type-selector {
    grid-template-columns: 1fr;
  }

  .days-selector-grid {
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
  }

  .day-button {
    font-size: var(--font-size-xs);
    padding: var(--spacing-sm) 6px;
  }

  .pairing-form-section {
    padding: var(--spacing-md);
  }

  .pairing-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}

@media (max-width: 480px) {
  .days-selector-grid {
    gap: var(--spacing-xs);
  }

  .day-button {
    font-size: 11px;
    padding: var(--spacing-sm) var(--spacing-xs);
  }

  .pairing-type-badge {
    font-size: 11px;
    padding: 2px var(--spacing-sm);
  }
}
```

---

## 📄 riders.css
**Path:** `features/riders.css`

```
/* ============================================
   RIDERS FEATURE
   Styles spécifiques aux cavaliers uniquement
   Les styles communs sont dans common.css
   ============================================ */

@import '../common.css';

/* ============================================
   RIDERS TABLE LAYOUT
   ============================================ */

.riders-list .table thead,
.riders-list .table tbody {
  display: block;
}

.riders-list .table thead {
  position: sticky;
  top: 0;
  z-index: 10;
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

/* ============================================
   RIDER ROW
   ============================================ */

.rider-row {
  position: relative;
}

.rider-row:hover {
  background: var(--color-gray-50);
  cursor: pointer;
}

.rider-row-clickable {
  cursor: pointer;
  transition: all var(--transition-base);
}

.rider-row-clickable:hover {
  background-color: var(--color-gray-50);
  transform: translateX(2px);
}

.rider-row-clickable:active {
  background-color: var(--color-gray-100);
}

.rider-row-clickable:hover td:first-child {
  color: var(--color-primary);
}

/* ============================================
   HORSES BADGES
   ============================================ */

.riders-list td[data-label='Chevaux'] {
  text-align: center;
}

.horses-badges {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  align-items: center;
  justify-content: center;
}

/* ============================================
   RIDER CARD MODAL
   ============================================ */

.rider-card-modal {
  max-width: 1200px;
  width: 95%;
  max-height: 85vh;
  overflow-y: auto;
}

.rider-card-content {
  padding: var(--spacing-lg);
}

.rider-card-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.rider-card-avatar {
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

.rider-card-title-text {
  flex: 1;
  min-width: 0;
}

.rider-card-title-text h2 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rider-card-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-sm);
}

.rider-card-meta {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.rider-card-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.rider-card-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.rider-card-main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* ============================================
   PACKAGES LIST
   ============================================ */

.packages-list-modern {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.package-item-modern {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--gradient-light);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.package-item-modern:hover {
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-md);
  transform: translateX(4px);
}

.package-info {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}

.package-detail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.package-label {
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.package-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

/* ============================================
   PAIRINGS LIST
   ============================================ */

.pairings-list-modern {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.pairing-item-modern {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--gradient-light);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.pairing-item-modern:hover {
  border-color: var(--color-success-medium);
  box-shadow: var(--shadow-md);
  transform: translateX(4px);
}

.pairing-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--color-success-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-success-medium);
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.pairing-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;
}

.pairing-horse-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pairing-meta {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.pairing-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 1200px) {
  .rider-card-grid {
    grid-template-columns: 280px 1fr;
  }

  .riders-list .table thead tr,
  .riders-list .table tbody tr {
    grid-template-columns: 180px 100px 180px 120px 90px 1fr;
  }
}

@media (max-width: 992px) {
  .rider-card-grid {
    grid-template-columns: 1fr;
  }

  .rider-card-sidebar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .rider-card-content {
    padding: var(--spacing-md);
  }

  .rider-card-sidebar {
    grid-template-columns: 1fr;
  }

  .package-item-modern,
  .pairing-item-modern {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .pairing-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 640px) {
  .riders-list .table thead {
    display: none;
  }

  .riders-list .table tbody tr {
    display: block;
    background: var(--color-white);
    margin-bottom: var(--spacing-md);
    padding: var(--spacing-md);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--color-gray-150);
  }

  .riders-list .table tbody tr td {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--color-gray-100);
  }

  .riders-list .table tbody tr td:last-child {
    border-bottom: none;
  }

  .riders-list .table tbody tr td::before {
    content: attr(data-label);
    font-weight: var(--font-weight-semibold);
    color: var(--color-gray-600);
    margin-right: var(--spacing-md);
    flex-shrink: 0;
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

/* ============================================
   ANIMATION UTILITIES
   ============================================ */

.spin {
  animation: spin 1s linear infinite;
}

.fade-in {
  animation: fadeIn var(--transition-base);
}

.slide-in {
  animation: slideIn var(--transition-slow);
}
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
  line-height: 1.6;
  color: var(--color-gray-800);
  background: var(--gradient-primary);
}

/* ============================================
   ACCESSIBILITY
   ============================================ */

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ============================================
   COMMON ELEMENTS
   ============================================ */

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
   CSS VARIABLES - Design System
   ============================================ */

:root {
  /* ============================================
     COLORS - Primary
     ============================================ */
  --color-primary: #007bff;
  --color-primary-dark: #0056b3;
  --color-primary-light: #667eea;
  --color-primary-purple: #764ba2;

  /* ============================================
     COLORS - Secondary
     ============================================ */
  --color-secondary: #6c757d;
  --color-secondary-dark: #545b62;

  /* ============================================
     COLORS - Success
     ============================================ */
  --color-success: #28a745;
  --color-success-dark: #1e7e34;
  --color-success-light: #d4edda;
  --color-success-medium: #48bb78;
  --color-success-medium-dark: #38a169;

  /* ============================================
     COLORS - Danger
     ============================================ */
  --color-danger: #dc3545;
  --color-danger-dark: #bd2130;
  --color-danger-light: #f8d7da;
  --color-danger-medium: #f56565;
  --color-danger-medium-dark: #e53e3e;

  /* ============================================
     COLORS - Warning
     ============================================ */
  --color-warning: #ffc107;
  --color-warning-dark: #e0a800;
  --color-warning-light: #fff3cd;
  --color-warning-orange: #ed8936;
  --color-warning-orange-dark: #dd6b20;

  /* ============================================
     COLORS - Info
     ============================================ */
  --color-info: #17a2b8;
  --color-info-dark: #117a8b;
  --color-info-light: #d1ecf1;
  --color-info-blue: #4299e1;
  --color-info-blue-dark: #3182ce;

  /* ============================================
     COLORS - Neutral
     ============================================ */
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

  /* ============================================
     COLORS - Badge Specific
     ============================================ */
  --color-success-badge-light: #c6f6d5;
  --color-success-badge-medium: #9ae6b4;
  --color-danger-badge-light: #fed7d7;
  --color-danger-badge-medium: #fc8181;

  /* ============================================
   DOMAIN COLORS - CSS VARIABLES
   ============================================ */

  /* HORSES */
  --color-pony-light: #ed64a6;
  --color-pony-dark: #d53f8c;
  --color-horse-light: #63b3ed;
  --color-horse-dark: #4299e1;

  /* OWNERS */
  --color-laury-light: #fddce3;
  --color-laury-dark: #f5576c;
  --color-owner-light: #fee3c5;
  --color-owner-dark: #ed8936;
  --color-club-light: #dbeafe;
  --color-club-dark: #4299e1;
  --color-other-light: #fcdada;
  --color-other-dark: #f56565;

  /* RIDERS */
  --color-rider-owner-light: #ed8936;
  --color-rider-owner-dark: #dd6b20;
  --color-rider-club-light: #4299e1;
  --color-rider-club-dark: #3182ce;
  --color-rider-loaner-light: #28a745;
  --color-rider-loaner-dark: #1e7e34;

  /* PAIRINGS */
  --color-pairing-own-light: #fef3c7;
  --color-pairing-own-dark: #ed8936;
  --color-pairing-loan-light: #d1fae5;
  --color-pairing-loan-dark: #48bb78;

  /* ASSIGNMENTS */
  --color-assignment-manual-light: #90cdf4;
  --color-assignment-manual-dark: #4299e1;
  --color-assignment-automatic-light: #9ae6b4;
  --color-assignment-automatic-dark: #38a169;

  /* STATUS */
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

  /* INSTRUCTORS */
  --color-instructor-light: #bee3f8;
  --color-instructor-dark: #4299e1;

  /* ============================================
     SPACING
     ============================================ */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* ============================================
     BORDER RADIUS
     ============================================ */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* ============================================
     SHADOWS
     ============================================ */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 10px 20px rgba(0, 0, 0, 0.2);

  /* ============================================
     TRANSITIONS
     ============================================ */
  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;

  /* ============================================
     TYPOGRAPHY - Font Sizes
     ============================================ */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.75rem;

  /* ============================================
     TYPOGRAPHY - Font Weights
     ============================================ */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* ============================================
     GRADIENTS
     ============================================ */
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
  padding: 20px;
  width: 90%;
}

main {
  flex: 1;
  padding-bottom: 40px;
}

/* ============================================
   VIEW CONTAINERS
   ============================================ */

.view-container {
  padding: 20px;
  background: var(--color-gray-100);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-x: auto;
  padding: 8px;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  .view-container {
    padding: 12px;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .view-container {
    padding: 8px;
    gap: 8px;
  }
}
```

---

## 📄 empty-states.css
**Path:** `layouts/empty-states.css`

```
/* ============================================
   EMPTY STATES
   ============================================ */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: var(--color-gray-600);
}

.empty-state-compact {
  padding: 40px 20px;
}

.empty-state-small {
  text-align: center;
  padding: 30px;
  background: var(--color-gray-100);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--color-gray-400);
}

/* ============================================
   EMPTY STATE CONTENT
   ============================================ */

.empty-state-icon {
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.8;
  color: var(--color-gray-400);
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 12px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
  color: var(--color-gray-600);
}

.empty-state-small p {
  color: var(--color-gray-600);
  margin-bottom: 15px;
  font-size: var(--font-size-sm);
}

.empty-message {
  color: var(--color-gray-500);
  margin: 0;
  font-size: var(--font-size-sm);
}

/* ============================================
   LOADING STATES
   ============================================ */

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: var(--color-gray-600);
}

.loading-compact {
  padding: 20px;
}

.loading p {
  margin-top: 12px;
  color: var(--color-gray-600);
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

.loading-spinner-small {
  width: 24px;
  height: 24px;
  border-width: 3px;
}

/* ============================================
   ERROR STATES
   ============================================ */

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  color: var(--color-danger);
  margin-bottom: 16px;
}

.error h3 {
  margin: 16px 0 8px;
  color: var(--color-danger);
  font-size: 1.25rem;
  font-weight: var(--font-weight-semibold);
}

.error p {
  margin: 0;
  color: var(--color-gray-600);
}

/* ============================================
   SUCCESS STATES
   ============================================ */

.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.success-icon {
  font-size: 48px;
  color: var(--color-success);
  margin-bottom: 16px;
}

.success-state h3 {
  margin: 16px 0 8px;
  color: var(--color-success-dark);
  font-size: 1.25rem;
  font-weight: var(--font-weight-semibold);
}

.success-state p {
  margin: 0;
  color: var(--color-gray-600);
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .empty-state {
    padding: 40px 20px;
  }

  .empty-state-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .empty-state h3 {
    font-size: 1.25rem;
  }

  .empty-state p {
    font-size: 1rem;
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

.gap-4 {
  gap: 4px;
}

.gap-8 {
  gap: 8px;
}

.gap-10 {
  gap: 10px;
}

.gap-12 {
  gap: 12px;
}

.gap-16 {
  gap: 16px;
}

.gap-20 {
  gap: 20px;
}

.gap-24 {
  gap: 24px;
}

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
   COMMON FLEX PATTERNS
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
   STATS GRID
   ============================================ */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

/* ============================================
   CARDS GRID
   ============================================ */

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* ============================================
   TWO COLUMN LAYOUT
   ============================================ */

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

/* ============================================
   MAIN HEADER
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
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

/* ============================================
   NAVIGATION
   ============================================ */

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
  background: var(--gradient-primary);
  color: var(--color-white);
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

/* ============================================
   PAGE HEADER
   ============================================ */

.page-header {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-lg);
}

.page-header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 20px;
  flex-wrap: wrap;
}

.page-header h2 {
  margin: 0;
  font-size: clamp(1.25rem, 5vw, 1.75rem);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-800);
  position: relative;
}

.page-header h2::before {
  content: '';
  width: 4px;
  height: 24px;
  background: var(--gradient-primary);
  border-radius: 2px;
  position: absolute;
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
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
  border-bottom: 1px solid var(--color-gray-200);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
  margin: 0;
}

.section-icon {
  color: var(--color-primary);
  font-size: 16px;
}

/* ============================================
   CARD HEADER
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
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-actions {
  display: flex;
  gap: 8px;
  align-items: center;
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
    font-size: 1.5rem;
  }

  nav {
    justify-content: center;
  }

  .page-header-title {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  header h1 {
    font-size: 1.3rem;
  }

  .page-header {
    padding: 10px;
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

.section-compact {
  margin-bottom: var(--spacing-lg);
}

/* ============================================
   FORM SECTIONS
   ============================================ */

.form-section {
  background: var(--gradient-light);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: 20px;
  transition: all var(--transition-base);
  margin-bottom: var(--spacing-md);
}

.form-section:hover {
  border-color: var(--color-primary-light);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.form-section h2,
.form-section h3 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  border-bottom: 1px solid var(--color-gray-200);
  padding-bottom: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

/* ============================================
   INFO SECTIONS
   ============================================ */

.info-section {
  padding: var(--spacing-md);
  background: var(--gradient-light);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
}

.info-section-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
}

.info-section-icon {
  color: var(--color-primary);
  font-size: 16px;
}

/* ============================================
   DETAIL SECTIONS
   ============================================ */

.detail-section {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 2px solid var(--color-gray-150);
}

.detail-section:first-child {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.detail-section-blocked {
  background: var(--color-gray-50);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

.detail-section-warning {
  background: var(--color-warning-light);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

.detail-section-metadata {
  background: var(--color-gray-50);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  margin-top: var(--spacing-xl);
}

/* ============================================
   STATS SECTIONS
   ============================================ */

.stats-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--gradient-light);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
}

/* ============================================
   DIVIDER
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
  background: var(--color-gray-200);
  border: none;
  margin: var(--spacing-lg) 0;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .form-section {
    padding: 16px;
  }

  .info-section {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .form-section {
    padding: 12px;
  }

  .section-divider {
    margin: var(--spacing-lg) 0;
  }
}
```

---

