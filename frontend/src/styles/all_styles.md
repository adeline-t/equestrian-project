# 📁 Project Files Export

Generated on: Fri Jan 16 15:38:15 CET 2026

## 📄 alerts.css
**Path:** `common/alerts.css`

```
/* ============================================
   ALERT STYLES
   ============================================ */

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

/* ============================================
   ALERT VARIANTS
   ============================================ */

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

/* ============================================
   ALERT CONTENT
   ============================================ */

.alert strong {
  font-weight: var(--font-weight-semibold);
}

.alert p {
  margin: 0;
}

.alert p + p {
  margin-top: 8px;
}

/* ============================================
   DISMISSIBLE ALERTS
   ============================================ */

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

/* ============================================
   LEGACY SUPPORT
   ============================================ */

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
**Path:** `common/badges.css`

```
/* ============================================
   BADGE STYLES
   ============================================ */

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-xl);
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.badge.clickable:hover {
  opacity: 0.8;
  transform: scale(1.05);
  transition: all var(--transition-base);
  cursor: pointer;
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
   STATUS BADGES
   ============================================ */

.status-badge {
  padding: var(--spacing-xs) 10px;
  border-radius: var(--radius-xl);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.status-scheduled {
  background-color: var(--color-info-light);
  color: var(--color-info-blue-dark);
}

.status-confirmed {
  background-color: var(--color-success-light);
  color: var(--color-success-medium-dark);
}

.status-completed {
  background-color: var(--color-primary-light);
  color: var(--color-primary-purple);
}

.status-cancelled {
  background-color: var(--color-danger-light);
  color: var(--color-danger-dark);
}

.status-blocked {
  background-color: var(--color-gray-100);
  color: var(--color-gray-600);
}

/* ============================================
   PARTICIPATION BADGES
   ============================================ */

.badge-confirmed {
  background-color: var(--color-success-light);
  color: var(--color-success-medium-dark);
}

.badge-pending {
  background-color: var(--color-warning-light);
  color: var(--color-warning-orange-dark);
}

.badge-cancelled {
  background-color: var(--color-danger-light);
  color: var(--color-danger-dark);
}

/* ============================================
   LESSON TYPE BADGES
   ============================================ */

.lesson-type-badge {
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: var(--font-weight-medium);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.lesson-type-badge.private {
  background-color: var(--color-info-light);
  color: var(--color-info-blue-dark);
}

.lesson-type-badge.group {
  background-color: var(--color-primary-light);
  color: var(--color-primary-purple);
}

.lesson-type-badge.training {
  background-color: var(--color-warning-light);
  color: var(--color-warning-orange-dark);
}

.lesson-type-badge.competition {
  background-color: var(--color-danger-light);
  color: var(--color-danger-medium-dark);
}

.lesson-type-badge.event {
  background-color: var(--color-success-light);
  color: var(--color-success-dark);
}

.lesson-type-badge.blocked {
  background-color: var(--color-gray-100);
  color: var(--color-gray-600);
}

/* ============================================
   RIDER TYPE BADGES
   ============================================ */

.badge-rider-type {
  font-weight: var(--font-weight-semibold);
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.badge-rider-type[data-rider-type='owner'] {
  background: var(--gradient-warning);
  color: var(--color-white);
}

.badge-rider-type[data-rider-type='club'] {
  background: var(--gradient-info);
  color: var(--color-white);
}

.badge-rider-type[data-rider-type='boarder'] {
  background: var(--gradient-success);
  color: var(--color-white);
}

.badge-rider-type:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all var(--transition-base);
}

/* ============================================
   HORSE KIND BADGES
   ============================================ */

.badge-kind[data-kind='pony'] {
  background: var(--gradient-pony);
  color: var(--color-white);
}

.badge-kind[data-kind='horse'] {
  background: var(--gradient-info);
  color: var(--color-white);
}

.badge-horse {
  background-image: var(--gradient-info);
  color: var(--color-white);
}

.badge-pony {
  background-image: var(--gradient-pony);
  color: var(--color-white);
}

/* ============================================
   PACKAGE STATUS BADGES
   ============================================ */

.package-status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--radius-xl);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.package-status-badge.active {
  background: var(--color-success-badge-light);
  color: var(--color-success-dark);
}

.package-status-badge.upcoming {
  background: var(--color-info-light);
  color: var(--color-info-dark);
}

.package-status-badge.expired {
  background: var(--color-gray-200);
  color: var(--color-gray-650);
}

.package-status-badge.inactive {
  background: var(--color-danger-badge-light);
  color: var(--color-danger-dark);
}

.package-status-badge.suspended {
  background: var(--color-warning-light);
  color: var(--color-warning-dark);
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .badge {
    font-size: 10px;
    padding: 3px 6px;
  }

  .status-badge,
  .lesson-type-badge {
    font-size: 11px;
    padding: 4px 8px;
  }

  .package-status-badge {
    font-size: 10px;
    padding: 3px 10px;
  }
}
```

---

## 📄 base.css
**Path:** `common/base.css`

```
/* ============================================
   BASE STYLES - Variables & Reset
   ============================================ */

:root {
  /* Primary Colors */
  --color-primary: #007bff;
  --color-primary-dark: #0056b3;
  --color-primary-light: #667eea;
  --color-primary-purple: #764ba2;

  /* Secondary Colors */
  --color-secondary: #6c757d;
  --color-secondary-dark: #545b62;

  /* Success Colors */
  --color-success: #28a745;
  --color-success-dark: #1e7e34;
  --color-success-light: #d4edda;
  --color-success-medium: #48bb78;
  --color-success-medium-dark: #38a169;

  /* Danger Colors */
  --color-danger: #dc3545;
  --color-danger-dark: #bd2130;
  --color-danger-light: #f8d7da;
  --color-danger-medium: #f56565;
  --color-danger-medium-dark: #e53e3e;

  /* Warning Colors */
  --color-warning: #ffc107;
  --color-warning-dark: #e0a800;
  --color-warning-light: #fff3cd;
  --color-warning-orange: #ed8936;
  --color-warning-orange-dark: #dd6b20;

  /* Info Colors */
  --color-info: #17a2b8;
  --color-info-dark: #117a8b;
  --color-info-light: #d1ecf1;
  --color-info-blue: #4299e1;
  --color-info-blue-dark: #3182ce;

  /* Neutral Colors */
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

  /* Badge Colors */
  --color-success-badge-light: #c6f6d5;
  --color-success-badge-medium: #9ae6b4;
  --color-danger-badge-light: #fed7d7;
  --color-danger-badge-medium: #fc8181;

  /* Pony Colors */
  --color-pony-light: #ed64a6;
  --color-pony-dark: #d53f8c;

  /* Component-specific colors */
  --color-horse: #4299e1;
  --color-owner: #ed8936;
  --color-club: #4299e1;
  --color-boarder: #48bb78;
  --color-laury: #f5576c;

  /* Status Colors */
  --color-status-active: #48bb78;
  --color-status-inactive: #f56565;
  --color-status-pending: #ed8936;
  --color-status-completed: #4299e1;
  --color-status-cancelled: #718096;

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

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-purple) 100%);
  --gradient-pony: linear-gradient(135deg, var(--color-pony-light) 0%, var(--color-pony-dark) 100%);
  --gradient-success: linear-gradient(135deg, var(--color-success-medium) 0%, var(--color-success-medium-dark) 100%);
  --gradient-danger: linear-gradient(135deg, var(--color-danger-medium) 0%, var(--color-danger-medium-dark) 100%);
  --gradient-secondary: linear-gradient(135deg, var(--color-gray-500) 0%, var(--color-gray-650) 100%);
  --gradient-warning: linear-gradient(135deg, var(--color-warning-orange) 0%, var(--color-warning-orange-dark) 100%);
  --gradient-info: linear-gradient(135deg, var(--color-info-blue) 0%, var(--color-info-blue-dark) 100%);
  --gradient-light: linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-gray-150) 100%);
  --gradient-alert-success: linear-gradient(135deg, var(--color-success-badge-light) 0%, var(--color-success-badge-medium) 100%);
  --gradient-alert-error: linear-gradient(135deg, var(--color-danger-badge-light) 0%, var(--color-danger-badge-medium) 100%);
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
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
  color: var(--color-gray-800);
  background: var(--gradient-primary);
}

/* ============================================
   ANIMATIONS
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
}
```

---

## 📄 buttons.css
**Path:** `common/buttons.css`

```
/* ============================================
   BUTTON STYLES
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
}

.btn-lg {
  padding: 12px 24px;
  font-size: 16px;
  gap: 10px;
}

.btn-icon {
  padding: 8px;
  width: 36px;
  height: 36px;
  gap: 0;
  min-width: 36px;
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
}

.btn-close:hover,
.modal-close:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
}

/* ============================================
   ICON BUTTONS
   ============================================ */

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
}

.btn-icon-modern:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  transform: scale(1.1);
}

.btn-icon-modern.danger:hover {
  background: var(--color-danger);
  border-color: var(--color-danger);
}

/* Legacy icon buttons */
.btn-icon-view {
  color: var(--color-info-blue);
}

.btn-icon-view:hover {
  background: var(--color-info-light);
  color: var(--color-info-blue-dark);
  transform: scale(1.15);
}

.btn-icon-edit {
  color: var(--color-gray-500);
}

.btn-icon-edit:hover {
  background: var(--color-gray-150);
  color: var(--color-gray-800);
  transform: scale(1.15);
}

.btn-icon-delete {
  color: var(--color-danger-medium-dark);
}

.btn-icon-delete:hover {
  background: var(--color-danger-light);
  color: var(--color-danger-dark);
  transform: scale(1.15);
}

/* ============================================
   BUTTON GROUPS
   ============================================ */

.btn-group {
  display: inline-flex;
  gap: var(--spacing-sm);
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
}

/* ============================================
   SEGMENTED CONTROL (BUTTON GROUP)
   ============================================ */

.segmented-control {
  display: inline-flex;
  gap: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-gray-300);
  background: var(--color-gray-100);
}

/* Chaque segment = un bouton */
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
}

/* Séparateur visuel entre les segments */
.segment-btn:not(:last-child) {
  border-right: 1px solid var(--color-gray-300);
}

/* Hover */
.segment-btn:hover {
  background: var(--color-gray-150);
}

/* État actif (sélectionné) */
.segment-btn.active {
  background: var(--color-primary-light);
  color: var(--color-white);
  font-weight: var(--font-weight-semibold);
  box-shadow: inset 0 0 0 1px var(--color-primary-dark);
}

/* Pressed */
.segment-btn:active:not(:disabled) {
  transform: scale(0.97);
}

/* Disabled */
.segment-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .segment-btn {
    padding: 8px 12px;
    font-size: 13px;
  }
}
```

---

## 📄 cards.css
**Path:** `common/cards.css`

```
/* ============================================
   CARD STYLES
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

.stat-label {
  font-size: 0.7rem;
  color: var(--color-gray-600);
  font-weight: var(--font-weight-medium);
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
**Path:** `common/filters.css`

```
/* ============================================
   FILTER STYLES
   ============================================ */

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* ============================================
   FILTER BUTTONS
   ============================================ */

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

/* ============================================
   RIDER TYPE PILLS
   ============================================ */

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

.pill[data-rider-type='boarder'].pill-active {
  background: var(--gradient-success);
  border-color: var(--color-success-medium);
  box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3);
}

.pill[data-rider-type='all'].pill-active {
  background: var(--gradient-secondary);
  border-color: var(--color-secondary);
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
}

/* ============================================
   OWNERSHIP TYPE PILLS
   ============================================ */

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
**Path:** `common/forms.css`

```
/* ============================================
   FORM STYLES
   ============================================ */
.form-section {
  padding: 20px;
}

.form-group {
  padding: 8px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.form-row {
  display: flex;
  gap: 20px;
}
.form-row .form-group {
  flex: 1;
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
   CHECKBOX & RADIO
   ============================================ */

input[type='checkbox'],
input[type='radio'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
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

/* ============================================
   HELPER TEXT
   ============================================ */

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
```

---

## 📄 index.css
**Path:** `common/index.css`

```
/* ============================================
   MAIN CSS - Import all styles
   ============================================ */

/* Common foundation */
@import './base.css';
@import './layout.css';
@import './buttons.css';
@import './forms.css';
@import './badges.css';
@import './alerts.css';
@import './tables.css';
@import './modals.css';
@import './filters.css';
@import './cards.css';
@import './utilities.css';
```

---

## 📄 layout.css
**Path:** `common/layout.css`

```
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
  background: var(--gradient-primary);
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
  background: var(--gradient-primary);
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
   RESPONSIVE
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
}
```

---

## 📄 modals.css
**Path:** `common/modals.css`

```
/* ============================================
   MODAL STYLES
   ============================================ */

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

/* ============================================
   MODAL SIZES
   ============================================ */

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

/* ============================================
   MODAL HEADER
   ============================================ */

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

/* ============================================
   MODAL BODY
   ============================================ */

.modal-body {
  padding: 0px;
  overflow-y: auto;
  flex: 1;
}

/* ============================================
   MODAL FOOTER
   ============================================ */

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--color-gray-200);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

/* ============================================
   MODAL TABS
   ============================================ */

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

/* ============================================
   MODAL ACTIONS COMPACT
   ============================================ */

.modal-actions-compact {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.modal-actions-compact .btn {
  padding: 6px 10px;
  font-size: 13px;
  line-height: 1.2;
  min-height: auto;
  white-space: nowrap;
}

.modal-actions-compact .btn-sm {
  padding: 4px 8px;
  font-size: 12px;
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
  margin-top: 12px;
  color: var(--color-gray-600);
}

.modal-error h3 {
  margin: 16px 0 8px;
  color: var(--color-danger);
}

/* ============================================
   RESPONSIVE
   ============================================ */

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

  .modal-actions-compact {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .modal-actions-compact .btn {
    justify-content: center;
    width: 100%;
  }
}
```

---

## 📄 tables.css
**Path:** `common/tables.css`

```
/* ============================================
   TABLE STYLES
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

/* ============================================
   TABLE ACTIONS
   ============================================ */

.table-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
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
   RESPONSIVE
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
}
```

---

## 📄 utilities.css
**Path:** `common/utilities.css`

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
   FLEX UTILITIES
   ============================================ */

.flex { display: flex; }
.flex-column { flex-direction: column; }
.flex-row { flex-direction: row; }
.flex-wrap { flex-wrap: wrap; }
.align-items-center { align-items: center; }
.align-items-start { align-items: flex-start; }
.align-items-end { align-items: flex-end; }
.justify-content-center { justify-content: center; }
.justify-content-between { justify-content: space-between; }
.justify-content-end { justify-content: flex-end; }
.gap-8 { gap: 8px; }
.gap-10 { gap: 10px; }
.gap-12 { gap: 12px; }
.gap-16 { gap: 16px; }
.gap-20 { gap: 20px; }

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
   LOADING & STATES
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

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: var(--color-danger);
}

.error p {
  margin-top: 12px;
  color: var(--color-danger);
}

/* ============================================
   EMPTY STATES
   ============================================ */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: var(--color-gray-600);
}

.empty-state p {
  margin-top: 12px;
  font-size: var(--font-size-sm);
}

.empty-state-icon {
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.8;
  color: var(--color-gray-400);
}

.empty-state-small {
  text-align: center;
  padding: 30px;
  background: var(--color-gray-100);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--color-gray-400);
}

.empty-state-small p {
  color: var(--color-gray-600);
  margin-bottom: 15px;
}

.empty-message {
  color: var(--color-gray-500);
  margin: 0;
  font-size: var(--font-size-sm);
}
```

---

## 📄 calendar.css
**Path:** `components/calendar.css`

```
/* ============================================
   CALENDAR COMPONENT STYLES
   Conservé tel quel - déjà bien organisé
   ============================================ */

@import '../common/index.css';

:root {
  --hour-height: 60px;
  --start-hour: 8;
  --end-hour: 22;
  --selection-color: rgba(66, 153, 225, 0.2);
  --selection-border: var(--color-info-blue);
  --today-bg: #ebf8ff;
  --hour-line-color: var(--color-gray-200);
  --text-color: var(--color-gray-800);
  --label-color: var(--color-gray-500);
  --lesson-card-padding: 4px;
}

.calendar-view {
  padding: 20px;
  background: var(--color-gray-100);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.calendar-loading,
.calendar-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 40px;
  margin: 20px;
}

.calendar-header {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  box-shadow: var(--shadow-sm);
}

.calendar-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.calendar-title {
  margin: 0;
  font-size: clamp(1.25rem, 5vw, 1.75rem);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-800);
  position: relative;
}

.calendar-title::before {
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

.calendar-header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 20px;
  flex-wrap: wrap;
}

.calendar-nav-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
  color: var(--text-color);
}

.calendar-header-bottom {
  display: flex;
  justify-content: flex-start;
}

.calendar-stats-compact {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.stat-compact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--color-gray-100);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-200);
  transition: all var(--transition-base);
}

.stat-compact-item:hover {
  background: var(--color-gray-200);
  border-color: var(--color-gray-300);
}

.stat-compact-value {
  font-size: 1.1rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-800);
  min-width: 24px;
  text-align: center;
}

.stat-compact-label {
  font-size: 0.7rem;
  color: var(--color-gray-600);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  white-space: nowrap;
}

.calendar-filters {
  background: var(--color-white);
  padding: 16px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.filters-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.filters-controls {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
  flex: 1;
}

.filters-actions {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.calendar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-x: auto;
  padding: 8px;
}

.week-view {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
}

.week-grid {
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  flex: 1;
  min-height: 0;
  overflow: hidden;
  gap: 4px;
}

.time-column {
  background: var(--color-gray-100);
  border-right: 2px solid var(--color-gray-300);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 60px;
  flex-shrink: 0;
}

.time-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  border-bottom: 2px solid var(--color-gray-300);
  position: sticky;
  top: 0;
  background: var(--color-gray-100);
  z-index: 10;
  flex-shrink: 0;
  font-size: 0.9rem;
}

.time-slot {
  height: var(--hour-height);
  display: flex;
  align-items: top;
  justify-content: flex-end;
  padding-right: 8px;
  font-size: 0.75rem;
  color: var(--label-color);
  border-bottom: 1px solid var(--hour-line-color);
  flex-shrink: 0;
}

.day-column {
  border-right: 1px solid var(--color-gray-300);
  border-left: 1px solid var(--color-gray-200);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  background: linear-gradient(to bottom, transparent 80%, rgba(0, 0, 0, 0.03) 100%);
}

.day-column:last-child {
  border-right: none;
  min-width: 120px;
}

.day-column.today {
  background-color: var(--today-bg);
}

.day-header {
  height: 80px;
  padding: 10px;
  border-bottom: 2px solid var(--color-gray-300);
  text-align: center;
  background: var(--color-white);
  position: sticky;
  top: 0;
  z-index: 10;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: top;
}

.day-name {
  font-weight: var(--font-weight-bold);
  font-size: 14px;
  text-transform: capitalize;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.today-badge {
  display: inline-block;
  background: var(--color-success-medium);
  color: var(--color-white);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  margin-left: 8px;
  white-space: nowrap;
}

.day-grid-container {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.day-grid {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: calc((var(--end-hour) - var(--start-hour)) * var(--hour-height));
  background: var(--color-white);
  overflow-y: auto;
  overflow-x: hidden;
}

.hour-markers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hour-marker-row {
  border-bottom: 1px solid var(--hour-line-color);
  position: absolute;
  width: 100%;
  height: var(--hour-height);
  box-sizing: border-box;
}

.selection-overlay {
  position: absolute;
  background-color: var(--selection-color);
  border: 2px solid var(--selection-border);
  border-radius: 4px;
  pointer-events: none;
  z-index: 10;
}

.lessons-container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.lessons-container > div {
  position: absolute;
}

.lesson-card {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: var(--shadow-sm);
  overflow: visible;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  min-height: 40px;
  max-height: 100%;
  padding: 0;
}

.lesson-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  z-index: 10;
}

.lesson-card.compact {
  padding: 4px 6px;
  min-height: 40px;
}

.lesson-card.standard {
  padding: 8px;
  min-height: 60px;
}

.lesson-card > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: var(--radius-md);
  overflow: visible;
  width: 100%;
  height: auto;
  min-height: inherit;
  box-sizing: border-box;
}

.lesson-card strong,
.lesson-card span,
.lesson-card .lesson-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

@media (max-width: 1400px) {
  .week-grid {
    grid-template-columns: 70px repeat(7, 1fr);
  }
  .time-slot {
    font-size: 11px;
  }
  .lesson-card {
    padding: 6px;
  }
  .stat-compact-label {
    display: none;
  }
}

@media (max-width: 1024px) {
  .calendar-view {
    padding: 12px;
    gap: 12px;
  }
  .calendar-header-title {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 12px;
  }
}

@media (max-width: 768px) {
  .week-grid {
    grid-template-columns: 60px repeat(7, 1fr);
    display: block;
  }
  .day-column {
    min-width: 100%;
    margin-bottom: 16px;
    border-left: none;
  }
  .day-header {
    height: 70px;
    padding: 8px;
  }
  .time-slot {
    height: 50px;
    font-size: 10px;
  }
  .day-grid {
    min-height: 700px;
  }
  .hour-marker-row {
    height: 50px;
  }
  .lessons-container > div {
    left: 4px;
    right: 4px;
    width: calc(100% - 8px);
  }
}

@media (max-width: 480px) {
  .week-grid {
    grid-template-columns: 40px repeat(7, 1fr);
  }
  .time-header {
    height: 50px;
    font-size: 9px;
  }
  .time-slot {
    height: 40px;
    font-size: 8px;
  }
  .day-header {
    height: 50px;
    padding: 4px;
    font-size: 10px;
  }
  .day-grid {
    min-height: 560px;
  }
  .hour-marker-row {
    height: 40px;
  }
  .calendar-view {
    padding: 8px;
    gap: 8px;
  }
  .calendar-header {
    padding: 10px;
  }
  .calendar-title {
    font-size: 1rem;
  }
  .calendar-header-title {
    gap: 8px;
  }
  .calendar-nav-buttons {
    gap: 4px;
  }
}
```

---

## 📄 lessons.css
**Path:** `components/lessons.css`

```
/* ============================================
   LESSONS COMPONENT - Specific Styles Only
   ============================================ */

@import '../common/index.css';

.lesson-card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  height: 100%;
}

.lesson-card.compact .lesson-card-content {
  gap: 2px;
}

.lesson-card.compact .lesson-card-content > div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lesson-card.standard .lesson-card-content {
  gap: 4px;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-gray-150);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row label {
  min-width: 140px;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  font-size: 14px;
  display: flex;
  align-items: center;
}

.detail-row span,
.detail-row p {
  flex: 1;
  color: var(--color-gray-900);
  font-size: 14px;
  margin: 0;
}

.participants-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.participant-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: var(--color-gray-100);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
}

.participant-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.participant-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.participant-name strong {
  font-size: 14px;
  color: var(--color-gray-900);
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.participant-name small {
  font-size: 12px;
  color: var(--color-gray-600);
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.participant-horse {
  font-size: 13px;
  color: var(--color-gray-700);
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.participant-status {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}

.add-participant-form {
  background-color: var(--color-gray-100);
  padding: 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
}

.add-participant-form h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  display: flex;
  align-items: center;
}

.advanced-tab {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.advanced-section {
  background: var(--color-gray-100);
  border-radius: var(--radius-lg);
  padding: 16px;
}

.advanced-section .section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--color-gray-200);
}

.advanced-section .detail-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-gray-200);
}

.advanced-section .detail-row:last-child {
  border-bottom: none;
}

.advanced-section .detail-row label {
  display: flex;
  align-items: center;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
  font-size: 14px;
  min-width: 180px;
}

.advanced-section .detail-row span {
  color: var(--color-gray-800);
  font-size: 14px;
  text-align: right;
  flex: 1;
}

.edit-form .form-group {
  margin-bottom: 12px !important;
}

.edit-form .form-input,
.edit-form .form-select,
.edit-form .form-textarea {
  font-size: 13px !important;
  padding: 6px 8px !important;
}

.edit-form label {
  font-size: 13px !important;
  margin-bottom: 4px !important;
}

@media (max-width: 768px) {
  .advanced-section .detail-row {
    flex-direction: column;
    gap: 8px;
  }

  .advanced-section .detail-row label {
    min-width: auto;
  }

  .advanced-section .detail-row span {
    text-align: left;
  }

  .participant-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .participant-status {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 600px) {
  .detail-row {
    flex-direction: column;
    gap: 8px;
  }

  .detail-row label {
    min-width: auto;
  }

  .add-participant-form {
    padding: 16px;
  }

  .add-participant-form h4 {
    font-size: 14px;
  }
}
```

---

## 📄 pairing.css
**Path:** `components/pairing.css`

```
/* ============================================
   PAIRING FORM - Modern Styles
   ============================================ */

.pairing-form-modern {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ============================================
   FORM SECTIONS
   ============================================ */

.pairing-form-section {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: 20px;
  transition: all var(--transition-base);
}

.pairing-form-section:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-light);
}

.pairing-form-section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
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
  font-size: 16px;
}

.pairing-form-section-title {
  font-size: 16px;
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
  gap: 12px;
  padding: 16px;
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
  font-size: 24px;
  flex-shrink: 0;
}

.horse-selection-card .horse-info {
  flex: 1;
}

.horse-selection-card .horse-name {
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
  margin-bottom: 4px;
  display: flex; /* ← AJOUTÉ */
  align-items: center; /* ← AJOUTÉ (pour aligner verticalement) */
  gap: 12px; /* ← Maintenant fonctionnel ! */
}

.horse-selection-card .badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: var(--font-weight-medium);
}

.horse-selection-card .badge-horse {
  background: var(--gradient-primary);
  color: var(--color-white);
}

.horse-selection-card .badge-pony {
  background: var(--gradient-pony);
  color: var(--color-white);
}

/* ============================================
   DATE INPUTS GRID
   ============================================ */

.dates-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.date-input-wrapper {
  position: relative;
}

.date-input-wrapper label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.date-input-wrapper label svg {
  color: var(--color-primary);
  font-size: 16px;
}

.date-input-wrapper input[type='date'] {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: inherit;
  transition: all var(--transition-base);
  background: var(--color-white);
}

.date-input-wrapper input[type='date']:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.date-input-helper {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 12px;
  color: var(--color-gray-600);
}

.date-input-helper svg {
  font-size: 14px;
  color: var(--color-info);
}

/* ============================================
   LINK TYPE SELECTOR
   ============================================ */

.link-type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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
  gap: 8px;
  padding: 16px;
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
  font-size: 20px;
  transition: all var(--transition-base);
}

.link-type-option input:checked + .link-type-label .link-type-icon {
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-white);
}

.link-type-text {
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
}

/* ============================================
   LOAN DAYS SELECTOR
   ============================================ */

.loan-settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 16px;
  border-top: 2px solid var(--color-gray-150);
}

.loan-days-input {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loan-days-input label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.loan-days-input input[type='number'] {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  text-align: center;
  transition: all var(--transition-base);
}

.loan-days-input input[type='number']:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.days-selector-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  margin-bottom: 12px;
}

.days-selector-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day-button {
  position: relative;
  aspect-ratio: 1;
  padding: 12px 8px;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  color: var(--color-gray-700);
  font-size: 13px;
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
   FORM ACTIONS
   ============================================ */

.pairing-form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 2px solid var(--color-gray-150);
}

/* ============================================
   RESPONSIVE DESIGN
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
    font-size: 12px;
    padding: 10px 6px;
  }

  .pairing-form-section {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .days-selector-grid {
    gap: 4px;
  }

  .day-button {
    font-size: 11px;
    padding: 8px 4px;
  }
}

/* ============================================
   PAIRING DISPLAY - Enhanced with visible days
   ============================================ */

/* Pairing info structure */
.pairing-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.pairing-header {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.pairing-horse-name {
  font-size: 15px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
}

/* Type badge (Propriétaire / Demi-pension) */
.pairing-type-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
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

/* Days container */
.pairing-days {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 4px;
}

/* Individual day badge */
.day-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  padding: 5px 10px;
  background: var(--gradient-success);
  color: var(--color-white);
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  text-align: center;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
  transition: all var(--transition-base);
}

.day-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

/* Alternative style - colorful days */
.day-badge.colorful {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.day-badge.colorful:nth-child(1) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.day-badge.colorful:nth-child(2) {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.day-badge.colorful:nth-child(3) {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.day-badge.colorful:nth-child(4) {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.day-badge.colorful:nth-child(5) {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
}

.day-badge.colorful:nth-child(6) {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.day-badge.colorful:nth-child(7) {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .pairing-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .day-badge {
    min-width: 36px;
    padding: 4px 8px;
    font-size: 11px;
  }

  .pairing-days {
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .pairing-horse-name {
    font-size: 14px;
  }

  .pairing-type-badge {
    font-size: 11px;
    padding: 2px 8px;
  }

  .day-badge {
    min-width: 32px;
    padding: 3px 6px;
    font-size: 10px;
  }
}
```

---

## 📄 pairings.css
**Path:** `components/pairings.css`

```
/* ============================================
   PAIRINGS COMPONENT - Specific Styles Only
   ============================================ */

@import '../common/index.css';

.pairing-form-modern {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pairing-form-section {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: 20px;
  transition: all var(--transition-base);
}

.pairing-form-section:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-light);
}

.pairing-form-section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
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
  font-size: 16px;
}

.pairing-form-section-title {
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
  margin: 0;
}

.horse-selection-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
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
  font-size: 24px;
  flex-shrink: 0;
}

.horse-selection-card .horse-info {
  flex: 1;
}

.horse-selection-card .horse-name {
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.dates-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.date-input-wrapper {
  position: relative;
}

.date-input-wrapper label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.date-input-wrapper input[type='date'] {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: inherit;
  transition: all var(--transition-base);
  background: var(--color-white);
}

.date-input-wrapper input[type='date']:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.date-input-helper {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 12px;
  color: var(--color-gray-600);
}

.link-type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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
  gap: 8px;
  padding: 16px;
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
  font-size: 20px;
  transition: all var(--transition-base);
}

.link-type-option input:checked + .link-type-label .link-type-icon {
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-white);
}

.link-type-text {
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
}

.loan-settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 16px;
  border-top: 2px solid var(--color-gray-150);
}

.loan-days-input {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loan-days-input input[type='number'] {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  text-align: center;
  transition: all var(--transition-base);
}

.loan-days-input input[type='number']:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.days-selector-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day-button {
  position: relative;
  aspect-ratio: 1;
  padding: 12px 8px;
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  color: var(--color-gray-700);
  font-size: 13px;
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

.pairing-form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 2px solid var(--color-gray-150);
}

.pairing-type-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
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
  margin-top: 4px;
}

.day-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  padding: 5px 10px;
  background: var(--gradient-success);
  color: var(--color-white);
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  text-align: center;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
  transition: all var(--transition-base);
}

.day-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .dates-grid {
    grid-template-columns: 1fr;
  }

  .link-type-selector {
    grid-template-columns: 1fr;
  }

  .days-selector-grid {
    gap: 6px;
  }

  .day-button {
    font-size: 12px;
    padding: 10px 6px;
  }

  .pairing-form-section {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .days-selector-grid {
    gap: 4px;
  }

  .day-button {
    font-size: 11px;
    padding: 8px 4px;
  }

  .day-badge {
    min-width: 32px;
    padding: 3px 6px;
    font-size: 10px;
  }
}
```

---

## 📄 riders.css
**Path:** `components/riders.css`

```
/* ============================================
   RIDERS COMPONENT - Specific Styles Only
   ============================================ */

@import '../common/index.css';

/* ============================================
   RIDERS TABLE - GRID LAYOUT
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
  grid-template-columns: 220px 140px 220px 140px 100px 1fr;
  gap: 0;
}

.table tbody tr {
  display: grid;
  grid-template-columns: 220px 140px 220px 140px 100px 1fr;
  gap: 0;
}

.table th:nth-child(1),
.table td:nth-child(1) {
  justify-content: flex-start;
  text-align: left;
}

.table th:nth-child(6),
.table td:nth-child(6) {
  justify-content: flex-end;
  text-align: right;
}

/* ============================================
   RIDER ROW INTERACTIONS
   ============================================ */

.rider-row {
  position: relative;
}

.rider-row:hover {
  background: var(--color-gray-50);
  cursor: pointer;
}

.action-buttons-desktop {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
  justify-content: flex-end;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.rider-row:hover .action-buttons-desktop {
  opacity: 1;
}

.action-buttons-mobile {
  display: none;
}

/* ============================================
   RIDER CARD
   ============================================ */

.rider-card-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rider-card-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.rider-card-title-text {
  flex: 1;
  min-width: 0;
}

.rider-card-title-text h2 {
  margin: 0 0 6px 0;
  font-size: 1.5rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rider-card-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.rider-card-modal {
  max-width: 1200px;
  width: 95%;
  max-height: 85vh;
  overflow-y: auto;
}

.rider-card-content {
  padding: 20px;
}

.rider-card-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
  margin-top: 16px;
}

.rider-card-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rider-card-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  background: var(--color-primary-purple);
  color: white;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: var(--font-weight-bold);
}

/* ============================================
   PACKAGES & PAIRINGS
   ============================================ */

.packages-list-modern,
.pairings-list-modern {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.package-item-modern {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--gradient-light);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.package-item-modern:hover {
  border-color: var(--color-primary-light);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
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
  gap: 4px;
}

.package-label {
  font-size: 0.75rem;
  color: var(--color-gray-600);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.package-value {
  font-size: 1.25rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.pairing-item-modern {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--gradient-light);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.pairing-item-modern:hover {
  border-color: var(--color-success-medium);
  box-shadow: 0 2px 8px rgba(72, 187, 120, 0.1);
  transform: translateX(4px);
}

.pairing-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.1), rgba(56, 161, 105, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-success-medium);
  font-size: 20px;
  flex-shrink: 0;
}

.pairing-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.pairing-horse-name {
  font-size: 1rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pairing-meta {
  font-size: 0.8rem;
  color: var(--color-gray-600);
}

.pairing-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

/* ============================================
   MOBILE MENU
   ============================================ */

@media (max-width: 768px) {
  .action-buttons-desktop {
    display: none;
  }

  .action-buttons-mobile {
    display: block;
    position: relative;
  }

  .rider-row {
    cursor: default;
  }

  .rider-row:hover {
    background: transparent;
  }

  .btn-menu {
    color: var(--color-info-blue);
    padding: 10px;
    font-size: 18px;
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
    border-radius: 16px 16px 0 0;
    box-shadow: var(--shadow-xl);
    z-index: 1000;
    padding: 20px;
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
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
    gap: 12px;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    color: var(--color-gray-800);
    transition: background var(--transition-base);
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
   RESPONSIVE
   ============================================ */

@media (max-width: 1200px) {
  .rider-card-grid {
    grid-template-columns: 280px 1fr;
  }

  .table thead tr,
  .table tbody tr {
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
    gap: 16px;
  }

  .stats-card {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .rider-card-content {
    padding: 16px;
  }

  .rider-card-sidebar {
    grid-template-columns: 1fr;
  }

  .table thead tr,
  .table tbody tr {
    grid-template-columns: 150px 90px 150px 100px 80px 60px;
  }

  .package-item-modern,
  .pairing-item-modern {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .pairing-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .rider-card-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .package-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .table thead tr,
  .table tbody tr {
    grid-template-columns: 120px 70px 120px 90px 70px 50px;
  }
}
```

---

## 📄 index.css
**Path:** `index.css`

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
  background-image: var(--gradient-light);
  border: 2px solid #e2e8f0;
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
}
```

---

