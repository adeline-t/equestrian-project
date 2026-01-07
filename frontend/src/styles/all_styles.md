# 📁 Project Files Export

Generated on: Wed Jan  7 19:11:20 CET 2026

## 📄 alerts.css
**Path:** `common/alerts.css`

```
/* ============================================
   ALERT STYLES - Consolidated
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
  color: #0c5460;
  border-left-color: var(--color-info);
}

.alert-success {
  background-color: var(--color-success-light);
  color: #155724;
  border-left-color: var(--color-success);
}

.alert-warning {
  background-color: var(--color-warning-light);
  color: #856404;
  border-left-color: var(--color-warning);
}

.alert-error,
.alert-danger {
  background-color: var(--color-danger-light);
  color: #721c24;
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
   ALERT STATES (Legacy Support)
   ============================================ */

.error {
  padding: 12px 16px;
  background: var(--color-danger-light);
  color: #742a2a;
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
  color: #22543d;
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-success);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}```

---

## 📄 badges.css
**Path:** `common/badges.css`

```
/* ============================================
   BADGE STYLES - Consolidated
   ============================================ */

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  border-radius: 4px;
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
   STATUS BADGES
   ============================================ */

.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.status-scheduled {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-confirmed {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-completed {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.status-cancelled {
  background-color: #ffebee;
  color: #c62828;
}

.status-blocked {
  background-color: #fafafa;
  color: #616161;
}

/* ============================================
   PARTICIPATION BADGES
   ============================================ */

.badge-confirmed {
  background-color: #e8f5e9;
  color: #388e3c;
}

.badge-pending {
  background-color: #fff3e0;
  color: #e65100;
}

.badge-cancelled {
  background-color: #ffebee;
  color: #c62828;
}

.badge-info {
  background-color: #e3f2fd;
  color: #1976d2;
}

/* ============================================
   LESSON TYPE BADGES
   ============================================ */

.lesson-type-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: var(--font-weight-medium);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.lesson-type-badge.private {
  background-color: #e3f2fd;
  color: #1976d2;
}

.lesson-type-badge.group {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.lesson-type-badge.training {
  background-color: #fff3e0;
  color: #e65100;
}

.lesson-type-badge.competition {
  background-color: #fce4ec;
  color: #c2185b;
}

.lesson-type-badge.event {
  background-color: #e0f2f1;
  color: #00695c;
}

.lesson-type-badge.blocked {
  background-color: #fafafa;
  color: #616161;
}

/* ============================================
   COLOR VARIANT BADGES
   ============================================ */

.badge-info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.badge-success {
  background-color: #d4edda;
  color: #155724;
}

.badge-warning {
  background-color: #fff3cd;
  color: #856404;
}

.badge-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.badge-secondary {
  background-color: #e9ecef;
  color: #495057;
}

.badge-primary {
  background-color: #007bff;
  color: white;
}

/* ============================================
   HORSE TYPE BADGES
   ============================================ */

.badge-horse {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.badge-pony {
  background: linear-gradient(135deg, #ed64a6 0%, #d53f8c 100%);
  color: white;
}```

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

---

## 📄 buttons.css
**Path:** `common/buttons.css`

```
/* ============================================
   BUTTON STYLES - Consolidated
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
  background: var(--color-primary);
  color: var(--color-white);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Icon alignment in buttons */
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
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.btn-secondary {
  background-color: var(--color-secondary);
  color: var(--color-white);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-success {
  background-color: var(--color-success);
  color: var(--color-white);
}

.btn-success:hover:not(:disabled) {
  background-color: var(--color-success-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn-danger {
  background-color: var(--color-danger);
  color: var(--color-white);
}

.btn-danger:hover:not(:disabled) {
  background-color: var(--color-danger-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-warning {
  background-color: var(--color-warning);
  color: var(--color-black);
}

.btn-warning:hover:not(:disabled) {
  background-color: var(--color-warning-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.btn-info {
  background-color: var(--color-info);
  color: var(--color-white);
}

.btn-info:hover:not(:disabled) {
  background-color: var(--color-info-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
}

/* ============================================
   BUTTON VARIANTS - OUTLINE
   ============================================ */

.btn-outline-primary {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.btn-outline-primary:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn-outline-secondary {
  background-color: transparent;
  color: var(--color-secondary);
  border: 1px solid var(--color-secondary);
}

.btn-outline-secondary:hover:not(:disabled) {
  background-color: var(--color-secondary);
  color: var(--color-white);
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
   BUTTON GROUPS
   ============================================ */

.btn-group {
  display: inline-flex;
  gap: var(--spacing-sm);
}

/* ============================================
   BUTTON STATES
   ============================================ */

.btn:active {
  transform: translateY(0);
}

.btn:active:not(:disabled) {
  transform: scale(0.98);
}

/* ============================================
   RESPONSIVE ADJUSTMENTS
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
}```

---

## 📄 forms.css
**Path:** `common/forms.css`

```
/* ============================================
   FORM STYLES - Consolidated
   ============================================ */

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
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

/* ============================================
   VALIDATION MESSAGES
   ============================================ */

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
}```

---

## 📄 index.css
**Path:** `common/index.css`

```
/* ============================================
   COMMON STYLES - Main Import File
   ============================================ */

@import './base.css';
@import './buttons.css';
@import './forms.css';
@import './alerts.css';
@import './badges.css';
@import './modal.css';
@import './tables.css';
@import './utilities.css';
@import './infotooltip.css';
```

---

## 📄 infotooltip.css
**Path:** `common/infotooltip.css`

```
/* ============================================
   INFO TOOLTIP COMPONENT STYLES
   ============================================ */

@import './base.css';

/* ============================================
   INFO TOOLTIP WRAPPER
   ============================================ */

.info-tooltip-wrapper {
  position: relative;
  display: inline-block;
}

/* ============================================
   INFO TOOLTIP TRIGGER
   ============================================ */

.info-tooltip-trigger {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4299e1;
  font-size: 16px;
  transition: all var(--transition-base);
  border-radius: var(--radius-full);
}

.info-tooltip-trigger:hover {
  background: rgba(66, 153, 225, 0.1);
  color: #2c5aa0;
  transform: scale(1.1);
}

.info-tooltip-trigger:focus {
  outline: 2px solid #4299e1;
  outline-offset: 2px;
}

/* ============================================
   INFO TOOLTIP CONTENT
   ============================================ */

.info-tooltip {
  position: absolute;
  background: var(--color-gray-800);
  color: var(--color-white);
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  font-size: 0.85rem;
  line-height: 1.6;
  width: 400px;
  z-index: 1000;
  box-shadow: var(--shadow-lg);
  animation: tooltipFadeIn 0.2s ease;
  display: block;
}

/* ============================================
   TOOLTIP POSITION VARIANTS
   ============================================ */

.info-tooltip-top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
}

.info-tooltip-top::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--color-gray-800);
}

.info-tooltip-bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
}

.info-tooltip-bottom::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-bottom-color: var(--color-gray-800);
}

.info-tooltip-left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 8px;
}

.info-tooltip-left::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-left-color: var(--color-gray-800);
}

.info-tooltip-right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
}

.info-tooltip-right::after {
  content: '';
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-right-color: var(--color-gray-800);
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

@media (max-width: 768px) {
  .info-tooltip {
    width: 300px;
    font-size: 0.8rem;
    padding: 10px 12px;
  }

  .info-tooltip-trigger {
    font-size: 14px;
  }
}```

---

## 📄 modal.css
**Path:** `common/modal.css`

```
/* ============================================
   MODAL STYLES - Consolidated
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
   MODAL BODY
   ============================================ */

.modal-body {
  padding: 24px;
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
   SPECIAL MODAL SIZES
   ============================================ */

.rider-card-modal {
  max-width: 1400px;
  width: 95%;
  max-height: 90vh;
}

.template-modal {
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

@media (max-width: 768px) {
  .modal-content.small,
  .modal-content.medium,
  .modal-content.large,
  .modal-content.xlarge {
    max-width: 95vw;
  }

  .modal-header {
    padding: 16px 20px;
  }

  .modal-body {
    padding: 20px;
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
}```

---

## 📄 tables.css
**Path:** `common/tables.css`

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

---

## 📄 utilities.css
**Path:** `common/utilities.css`

```
/* ============================================
   UTILITY CLASSES - Consolidated
   ============================================ */

/* ============================================
   SPACING UTILITIES
   ============================================ */

/* Margin */
.mt-10 { margin-top: 10px; }
.mt-20 { margin-top: 20px; }
.mb-10 { margin-bottom: 10px; }
.mb-15 { margin-bottom: 15px; }
.mb-20 { margin-bottom: 20px; }
.mb-30 { margin-bottom: 30px; }
.ml-10 { margin-left: 10px; }
.mr-10 { margin-right: 10px; }

/* Padding */
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

.empty-state-small {
  text-align: center;
  padding: 30px;
  background: var(--color-gray-100);
  border-radius: var(--radius-lg);
  border: 2px dashed #cbd5e0;
}

.empty-state-small p {
  color: var(--color-gray-600);
  margin-bottom: 15px;
}

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
   COMPOSITE UTILITIES
   ============================================ */

.flex {
  display: flex;
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
}```

---

## 📄 calendar.css
**Path:** `components/calendar.css`

```
/* ============================================
   CALENDAR COMPONENT STYLES
   ============================================ */

@import '../common/index.css';

/* ============================================
   CALENDAR VIEW - MAIN CONTAINER
   ============================================ */

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

/* ============================================
   CALENDAR HEADER
   ============================================ */

.calendar-header {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  box-shadow: var(--shadow-sm);
}

.calendar-header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 20px;
  flex-wrap: wrap;
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
}

.calendar-nav-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.calendar-header-bottom {
  display: flex;
  justify-content: flex-start;
}

/* ============================================
   COMPACT STATS
   ============================================ */

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

/* ============================================
   CALENDAR FILTERS
   ============================================ */

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
  gap: 20px;
  flex-wrap: wrap;
}

.filters-controls {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
  flex: 1;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

/* ============================================
   CALENDAR CONTENT
   ============================================ */

.calendar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* ============================================
   WEEK VIEW
   ============================================ */

.week-view {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.week-grid {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* ============================================
   TIME COLUMN
   ============================================ */

.time-column {
  background: var(--color-gray-100);
  border-right: 2px solid var(--color-gray-300);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
}

.time-header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.time-slot {
  height: 60px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  border-bottom: 1px solid var(--color-gray-200);
  font-size: 12px;
  color: var(--color-gray-600);
  flex-shrink: 0;
  font-weight: var(--font-weight-medium);
  padding-top: 4px;
  position: relative;
}

/* ============================================
   DAY COLUMN
   ============================================ */

.day-column {
  border-right: 1px solid var(--color-gray-300);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.day-column:last-child {
  border-right: none;
}

.day-column.today {
  background: #fffbf0;
}

.day-column.past {
  background: var(--color-gray-100);
  opacity: 0.7;
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
  justify-content: center;
}

.day-name {
  font-weight: var(--font-weight-bold);
  font-size: 14px;
  text-transform: capitalize;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.day-date {
  font-size: 12px;
  color: var(--color-gray-600);
}

.today-badge {
  display: inline-block;
  background: #48bb78;
  color: var(--color-white);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  margin-left: 8px;
  white-space: nowrap;
}

/* ============================================
   DAY GRID
   ============================================ */

.day-grid-container {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.day-grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
}

.day-grid {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 840px;
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
  pointer-events: none;
  z-index: 1;
}

.hour-marker-row {
  position: absolute;
  width: 100%;
  border-bottom: 1px solid var(--color-gray-200);
}

.hour-label {
  position: absolute;
  left: 4px;
  top: 2px;
  font-size: 0.65rem;
  color: var(--color-gray-600);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  background: inherit;
  padding: 0 2px;
}

.no-lessons {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-gray-500);
  font-style: italic;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

/* ============================================
   LESSONS CONTAINER
   ============================================ */

.lessons-container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
}

/* ============================================
   LESSON CARD
   ============================================ */

.lesson-card {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
  overflow: visible;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0;
  border: none;
  background: transparent;
  min-height: auto;
  max-height: none;
}

.lesson-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  z-index: 10;
}

/* ============================================
   LESSON CARD - COMPACT (< 76 minutes)
   ============================================ */

.lesson-card.compact {
  padding: 4px 6px;
  min-height: 40px;
  max-height: none;
}

.lesson-card.compact > div {
  padding: 4px 6px !important;
  font-size: 11px !important;
  min-height: auto;
  max-height: none;
}

.lesson-card.compact > div > div {
  gap: 2px !important;
}

/* ============================================
   LESSON CARD - STANDARD (>= 76 minutes)
   ============================================ */

.lesson-card.standard {
  padding: 8px;
  min-height: 60px;
  max-height: none;
}

.lesson-card.standard > div {
  padding: 8px !important;
  font-size: 12px !important;
  min-height: auto;
  max-height: none;
}

/* ============================================
   LESSON CARD CONTENT
   ============================================ */

.lesson-card > div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border-radius: var(--radius-md);
  min-height: auto;
  max-height: none;
  overflow: visible;
}

/* ============================================
   LESSON CARD - TEXT TRUNCATION
   ============================================ */

.lesson-card strong,
.lesson-card span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.lesson-card .lesson-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

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

  .week-grid {
    grid-template-columns: 60px repeat(7, 1fr);
  }

  .time-header {
    height: 70px;
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

  .lesson-card {
    left: 4px;
    right: 4px;
    width: calc(100% - 8px);
  }

  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-controls {
    width: 100%;
  }

  .filters-actions {
    width: 100%;
  }

  .filters-actions .btn {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .calendar-view {
    padding: 10px;
    gap: 10px;
  }

  .calendar-header {
    padding: 12px;
  }

  .calendar-title {
    font-size: 1.25rem;
  }

  .calendar-filters {
    padding: 12px;
  }

  .filters-row {
    gap: 12px;
  }

  .filters-controls {
    gap: 12px;
  }

  .filter-group label {
    font-size: 0.8rem;
  }

  .week-grid {
    grid-template-columns: 50px repeat(7, 1fr);
  }

  .time-header {
    height: 60px;
    font-size: 11px;
  }

  .time-slot {
    height: 45px;
    font-size: 9px;
  }

  .day-header {
    height: 60px;
    padding: 6px;
    font-size: 12px;
  }

  .day-grid {
    min-height: 630px;
  }

  .hour-marker-row {
    height: 45px;
  }

  .stat-compact-item {
    padding: 6px 8px;
    flex: 1;
  }

  .stat-compact-value {
    font-size: 1rem;
  }

  .stat-compact-label {
    display: inline;
    margin-left: 4px;
    font-size: 0.65rem;
  }
}

@media (max-width: 480px) {
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
}```

---

## 📄 cards.css
**Path:** `components/cards.css`

```
/* ============================================
   CARD COMPONENT STYLES
   ============================================ */

@import '../common/index.css';

/* ============================================
   CARD BASE
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
   SECTION STYLES
   ============================================ */

.section {
  background: var(--color-white);
  padding: 20px;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.section h3 {
  margin: 0 0 16px 0;
  color: var(--color-gray-800);
  font-size: 1.25rem;
  font-weight: var(--font-weight-semibold);
}

.section-minimal {
  padding: 15px 20px;
  background: #f9fafb;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.section-minimal h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-gray-800);
  font-weight: var(--font-weight-semibold);
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

@media (max-width: 768px) {
  .card {
    padding: 16px;
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
}```

---

## 📄 lessons.css
**Path:** `components/lessons.css`

```
/* ============================================
   LESSONS COMPONENT STYLES
   ============================================ */

@import '../common/index.css';

/* ============================================
   LESSON CARD CONTENT
   ============================================ */

.lesson-card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  height: 100%;
}

/* ============================================
   LESSON CARD - COMPACT LAYOUT
   ============================================ */

.lesson-card.compact .lesson-card-content {
  gap: 2px;
}

.lesson-card.compact .lesson-card-content > div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ============================================
   LESSON CARD - STANDARD LAYOUT
   ============================================ */

.lesson-card.standard .lesson-card-content {
  gap: 4px;
}

/* ============================================
   DETAIL ROW STYLES
   ============================================ */

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
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

/* ============================================
   PARTICIPANTS SECTION
   ============================================ */

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

/* ============================================
   ADD PARTICIPANT FORM
   ============================================ */

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

/* ============================================
   ADVANCED TAB STYLES
   ============================================ */

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
  border-bottom: 2px solid #e5e7eb;
}

.advanced-section .detail-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
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

.advanced-section .alert {
  margin-bottom: 16px;
}

.advanced-section .alert:last-child {
  margin-bottom: 0;
}

/* ============================================
   EDIT FORM - COMPACT ADJUSTMENTS
   ============================================ */

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

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

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
}```

---

## 📄 list-view.css
**Path:** `components/list-view.css`

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

---

## 📄 riders.css
**Path:** `components/riders.css`

```
/* ============================================
   RIDERS COMPONENT STYLES
   ============================================ */

@import '../common/index.css';

/* ============================================
   RIDER CARD MODAL
   ============================================ */

.rider-card-modal {
  max-width: 1400px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
}

.rider-card-content {
  padding: 20px;
}

/* Force badge consistency */
.badge,
.horse-name-type .badge,
.owned-horse-item .badge {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 6px 12px !important;
  border-radius: 20px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  white-space: nowrap !important;
  height: 28px !important;
  min-width: 28px !important;
}

/* ============================================
   RIDER INFO SECTION
   ============================================ */

.rider-info-section {
  background: #f7fafc;
  padding: 20px;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.rider-info-section h3 {
  margin: 0 0 15px 0;
  color: var(--color-gray-800);
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: var(--font-weight-semibold);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-label {
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-600);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-value {
  color: var(--color-gray-800);
  font-size: 0.95rem;
  font-weight: var(--font-weight-medium);
}

/* ============================================
   DATE STATUS ROW
   ============================================ */

.date-status-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 15px;
}

.date-status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.date-status-item .info-label {
  margin: 0;
  font-size: 0.8rem;
}

.date-status-item .info-value {
  margin: 0;
  font-size: 0.95rem;
}

/* ============================================
   OWNED HORSES LIST
   ============================================ */

.owned-horses-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.owned-horse-item {
  padding: 12px;
  background: #f7fafc;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
  transition: all var(--transition-base);
}

.owned-horse-item:hover {
  border-color: #cbd5e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.horse-name-type {
  display: flex;
  align-items: center;
  gap: 10px;
}

.horse-name-type strong {
  color: var(--color-gray-800);
  font-weight: var(--font-weight-semibold);
}

.horse-name-type .badge {
  padding: 4px 8px;
  font-size: 0.75rem;
  border-radius: 4px;
  font-weight: var(--font-weight-medium);
}

/* ============================================
   PACKAGES TABLE - UNIFIED
   ============================================ */

.packages-table-wrapper {
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Table Header */
.packages-table-header {
  display: grid;
  grid-template-columns: 140px 180px 180px 140px 140px;
  gap: 0;
  background: #f7fafc;
  border-bottom: 2px solid #e2e8f0;
  padding: 0;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-600);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.packages-table-header > div {
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-right: 1px solid #e2e8f0;
}

.packages-table-header > div:last-child {
  border-right: none;
}

/* Table Body */
.packages-table-body {
  display: flex;
  flex-direction: column;
}

.package-row {
  display: grid;
  grid-template-columns: 140px 180px 180px 140px 140px;
  gap: 0;
  border-bottom: 1px solid #e2e8f0;
  transition: all var(--transition-base);
  background: var(--color-white);
}

.package-row:hover {
  background: #f9fafb;
  box-shadow: inset 0 0 0 1px #edf2f7;
}

.package-row:last-child {
  border-bottom: none;
}

/* Column Styles */
.package-row > div {
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-right: 1px solid #edf2f7;
  min-height: 50px;
}

.package-row > div:last-child {
  border-right: none;
}

/* Status Column */
.col-status {
  justify-content: center;
}

.package-status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.package-status-badge.active {
  background: #c6f6d5;
  color: #22543d;
}

.package-status-badge.expired {
  background: #e2e8f0;
  color: #4a5568;
}

.package-status-badge.upcoming {
  background: #bee3f8;
  color: #2c5282;
}

.package-status-badge.inactive {
  background: #fed7d7;
  color: #742a2a;
}

/* Lesson Columns */
.col-particuliers,
.col-prestations {
  justify-content: center;
}

.lesson-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  min-width: 40px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(66, 153, 225, 0.2);
  transition: transform var(--transition-base);
}

.lesson-badge:hover {
  transform: scale(1.05);
}

/* Date Columns */
.col-debut,
.col-fin {
  justify-content: center;
}

.date-value {
  font-size: 0.85rem;
  color: var(--color-gray-800);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

/* Actions Column */
.col-actions {
  justify-content: center;
}

.package-row .btn-secondary {
  padding: 6px 8px !important;
  font-size: 0.9rem;
  margin: 0 !important;
}

/* ============================================
   PAIRINGS LIST
   ============================================ */

.pairings-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pairing-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f7fafc;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
  transition: all var(--transition-base);
}

.pairing-item:hover {
  border-color: #cbd5e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pairing-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.pairing-horse-name {
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
  font-size: 0.95rem;
}

.pairing-actions {
  display: flex;
  gap: 8px;
  margin-left: 12px;
}

.pairing-item .btn-secondary,
.pairing-item .btn-danger {
  padding: 6px 10px !important;
  font-size: 0.9rem !important;
  margin: 0 !important;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

@media (max-width: 1200px) {
  .rider-card-modal {
    max-width: 90%;
    width: 90%;
  }

  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .packages-table-header,
  .package-row {
    grid-template-columns: 100px 140px 140px 120px 120px;
  }

  .packages-table-header > div,
  .package-row > div {
    padding: 10px 12px;
    font-size: 0.8rem;
  }
}

@media (max-width: 1024px) {
  .packages-table-header,
  .package-row {
    grid-template-columns: 80px 100px 100px 100px 100px;
  }

  .packages-table-header > div,
  .package-row > div {
    padding: 8px 10px;
    min-height: 45px;
  }

  .lesson-badge {
    font-size: 0.75rem;
    min-width: 32px;
    padding: 2px 6px;
  }

  .package-status-badge {
    font-size: 0.7rem;
    padding: 3px 10px;
  }
}

@media (max-width: 768px) {
  .rider-card-modal {
    width: 95%;
    max-height: 95vh;
  }

  .rider-card-content {
    padding: 15px;
  }

  .rider-info-section {
    padding: 15px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .date-status-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .date-status-item {
    flex-direction: column;
    gap: 4px;
  }

  .owned-horses-list {
    flex-direction: column;
    gap: 8px;
  }

  .owned-horse-item {
    width: 100%;
  }

  /* Packages Table - Switch to Card Layout */
  .packages-table-wrapper {
    border: none;
    box-shadow: none;
  }

  .packages-table-header {
    display: none;
  }

  .packages-table-body {
    gap: 12px;
  }

  .package-row {
    display: flex;
    flex-direction: column;
    grid-template-columns: none;
    border: 1px solid #e2e8f0;
    border-radius: var(--radius-lg);
    padding: 12px;
    gap: 8px;
    background: var(--color-white);
  }

  .package-row:hover {
    background: var(--color-white);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .package-row > div {
    border: none;
    border-bottom: 1px solid #edf2f7;
    padding: 8px 0;
    justify-content: space-between;
    text-align: left;
    min-height: auto;
  }

  .package-row > div:last-child {
    border-bottom: none;
  }

  .col-actions {
    justify-content: flex-end;
  }

  .pairing-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .pairing-info {
    width: 100%;
  }

  .pairing-actions {
    width: 100%;
    justify-content: flex-end;
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .rider-card-modal {
    width: 98%;
    max-height: 98vh;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .rider-info-section {
    padding: 12px;
  }

  .package-row {
    padding: 10px;
    gap: 6px;
  }

  .package-row > div {
    padding: 6px 0;
    font-size: 0.8rem;
  }

  .lesson-badge {
    font-size: 0.75rem;
    min-width: 28px;
    padding: 2px 6px;
  }

  .date-value {
    font-size: 0.75rem;
  }

  .package-status-badge {
    font-size: 0.65rem;
    padding: 2px 8px;
  }
}```

---

## 📄 templates.css
**Path:** `components/templates.css`

```
/* ============================================
   TEMPLATES COMPONENT STYLES
   ============================================ */

@import '../common/index.css';

/* ============================================
   TEMPLATE MANAGEMENT
   ============================================ */

.template-management {
  padding: 20px;
  background: var(--color-gray-100);
  min-height: 100vh;
}

.template-header {
  background: var(--color-white);
  padding: 20px;
  border-radius: var(--radius-lg);
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template-header h1 {
  margin: 0;
  color: var(--color-gray-800);
  font-size: 24px;
}

.template-filters {
  background: var(--color-white);
  padding: 20px;
  border-radius: var(--radius-lg);
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-600);
}

/* ============================================
   TEMPLATE LIST
   ============================================ */

.template-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.template-card {
  background: var(--color-white);
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-lg);
  padding: 20px;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.template-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.template-card.inactive {
  opacity: 0.7;
  background-color: #f7fafc;
}

.template-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.template-info h3 {
  margin: 0 0 8px 0;
  color: var(--color-gray-800);
  font-size: 18px;
  font-weight: var(--font-weight-semibold);
}

.template-actions {
  display: flex;
  gap: 8px;
}

.template-description {
  color: var(--color-gray-600);
  margin: 0 0 15px 0;
  line-height: 1.5;
  font-size: 14px;
}

.template-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-item label {
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
  font-size: 12px;
  text-transform: uppercase;
}

.detail-item span {
  color: var(--color-gray-800);
  font-weight: var(--font-weight-semibold);
  font-size: 14px;
}

/* ============================================
   TEMPLATE MODAL STYLES
   ============================================ */

.template-modal {
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.template-form {
  padding: 20px;
}

.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h3 {
  margin: 0 0 20px 0;
  color: var(--color-gray-800);
  font-size: 1.1rem;
  font-weight: var(--font-weight-semibold);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

/* ============================================
   DAY SELECTOR
   ============================================ */

.day-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.day-button {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  background: var(--color-white);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
  transition: all var(--transition-base);
}

.day-button:hover {
  border-color: #cbd5e0;
  background: #f7fafc;
}

.day-button.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-white);
}

.day-button.active:hover {
  border-color: var(--color-primary-dark);
  background: var(--color-primary-dark);
}

/* ============================================
   TEMPLATE MODAL OVERRIDES
   ============================================ */

.template-modal .modal-header {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.template-modal .modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-gray-800);
}

.template-modal .btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--color-gray-600);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.template-modal .btn-close:hover {
  background: #f7fafc;
  color: var(--color-gray-800);
}

.template-modal .modal-footer {
  padding: 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

@media (max-width: 768px) {
  .template-management {
    padding: 1rem;
  }

  .template-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .template-filters {
    flex-direction: column;
  }

  .template-card {
    padding: 1rem;
  }

  .template-actions {
    justify-content: flex-start;
  }

  .template-details {
    grid-template-columns: 1fr;
  }
}```

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

