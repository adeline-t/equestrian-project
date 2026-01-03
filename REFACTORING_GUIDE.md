# Frontend Refactoring Guide

## 🎯 Overview

This guide provides patterns and examples for refactoring all frontend components to use shared utilities, constants, hooks, and CSS.

---

## ✅ What's Already Done

### Refactored Components
1. ✅ **LessonModal** - Fully refactored with sub-components
2. ✅ **SingleLessonModal** - Fully refactored with sub-components
3. ✅ **BlockedTimeModal** - Fully refactored

### Infrastructure Created
1. ✅ **Shared Constants**
   - `constants/lessonTypes.js` - Lesson type configurations
   - `constants/statuses.js` - Status configurations
   - `constants/horses.js` - Horse-related constants
   - `constants/packages.js` - Package-related constants

2. ✅ **Shared Utilities**
   - `utils/formatters/time.js` - Time formatting functions
   - `utils/formatters/duration.js` - Duration calculations
   - `utils/validators/lesson.js` - Lesson validation
   - `utils/validators/horse.js` - Horse validation
   - `utils/validators/rider.js` - Rider validation
   - `utils/validators/package.js` - Package validation

3. ✅ **Custom Hooks**
   - `hooks/useLessonData.js` - Lesson data fetching
   - `hooks/useLessonEdit.js` - Lesson edit logic
   - `hooks/useParticipants.js` - Participant management
   - `hooks/useRiderHorses.js` - Rider-horse pairing
   - `hooks/useRiders.js` - Riders data fetching
   - `hooks/useHorses.js` - Horses data fetching
   - `hooks/useFormState.js` - Form state management

4. ✅ **Common Components**
   - `components/common/Modal` - Reusable modal wrapper

5. ✅ **Organized CSS**
   - `styles/common/` - Shared styles (modal, forms, buttons, alerts, badges, utilities)
   - `styles/components/` - Component-specific styles (lessons, cards, tables)

---

## 📋 Components Remaining to Refactor

### High Priority
1. **RiderCard.jsx** (772 lines)
2. **HorsesList.jsx** (559 lines)
3. **TemplateModal.jsx** (488 lines)
4. **PairingsList.jsx** (450 lines)
5. **PackageForm.jsx** (441 lines)
6. **RiderPackages.jsx** (433 lines)
7. **packagesList.jsx** (427 lines)
8. **HorseForm.jsx** (422 lines)
9. **RidersList.jsx** (385 lines)
10. **RiderForm.jsx** (345 lines)
11. **PairingForm.jsx** (336 lines)
12. **TemplateManagement.jsx** (319 lines)

### Medium Priority
13. **CalendarView.jsx** (299 lines)
14. **DayColumn.jsx** (284 lines)
15. **LessonCard.jsx** (262 lines)
16. **WeekView.jsx** (56 lines)

---

## 🔧 Refactoring Patterns

### Pattern 1: Replace Inline Utilities with Shared Functions

**Before:**
```javascript
const formatTime = (time) => {
  if (!time) return '';
  return time.substring(0, 5);
};

const calculateDuration = (start, end) => {
  // ... calculation logic
};
```

**After:**
```javascript
import { formatTime, calculateDuration } from '../../utils/formatters';
```

### Pattern 2: Replace Hardcoded Values with Constants

**Before:**
```javascript
const lessonTypes = [
  { value: 'private', label: 'Cours particulier' },
  { value: 'group', label: 'Cours collectif' },
  // ...
];
```

**After:**
```javascript
import { LESSON_TYPES, getLessonTypeLabel } from '../../constants';
```

### Pattern 3: Use Custom Hooks for Data Fetching

**Before:**
```javascript
const [riders, setRiders] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadRiders = async () => {
    try {
      setLoading(true);
      const data = await ridersApi.getAll();
      setRiders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  loadRiders();
}, []);
```

**After:**
```javascript
import { useRiders } from '../../hooks';

const { riders, loading, error, refresh } = useRiders();
```

### Pattern 4: Use Common Modal Component

**Before:**
```javascript
return (
  <Portal>
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Title</h2>
          <button onClick={onClose}>X</button>
        </div>
        <div className="modal-body">
          {/* content */}
        </div>
        <div className="modal-footer">
          {/* actions */}
        </div>
      </div>
    </div>
  </Portal>
);
```

**After:**
```javascript
import Modal from '../../components/common/Modal';

return (
  <Modal
    isOpen={true}
    onClose={onClose}
    title="Title"
    size="medium"
    footer={<div>{/* actions */}</div>}
  >
    {/* content */}
  </Modal>
);
```

### Pattern 5: Use Form State Hook

**Before:**
```javascript
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
```

**After:**
```javascript
import { useFormState } from '../../hooks';

const {
  formData,
  errors,
  handleChange,
  handleBlur,
  setFieldError,
  resetForm
} = useFormState(initialState);
```

### Pattern 6: Use Validators

**Before:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.name) {
    alert('Name is required');
    return;
  }
  
  if (formData.start_time >= formData.end_time) {
    alert('End time must be after start time');
    return;
  }
  
  // ... submit logic
};
```

**After:**
```javascript
import { validateLessonForm } from '../../utils/validators';

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const validation = validateLessonForm(formData);
  if (!validation.isValid) {
    setFormErrors(validation.errors);
    return;
  }
  
  // ... submit logic
};
```

### Pattern 7: Organize CSS with Imports

**Before:**
```css
/* Component.css - 500 lines of mixed styles */
.modal-overlay { ... }
.btn { ... }
.form-input { ... }
/* ... everything in one file */
```

**After:**
```css
/* Component.css */
@import '../../styles/common/index.css';
@import '../../styles/components/specific.css';

/* Only component-specific overrides here */
.component-specific-class {
  /* ... */
}
```

---

## 📝 Step-by-Step Refactoring Checklist

For each component, follow these steps:

### 1. Analysis Phase
- [ ] Identify duplicated utility functions
- [ ] Identify hardcoded constants
- [ ] Identify data fetching patterns
- [ ] Identify validation logic
- [ ] Identify CSS duplication

### 2. Extraction Phase
- [ ] Replace inline utilities with shared functions
- [ ] Replace hardcoded values with constants
- [ ] Extract validation logic to validators
- [ ] Extract data fetching to custom hooks

### 3. Component Refactoring
- [ ] Use common Modal component (if applicable)
- [ ] Use Portal for overlays
- [ ] Use useFormState for form management
- [ ] Split large components into sub-components
- [ ] Separate business logic from presentation

### 4. CSS Refactoring
- [ ] Import common CSS styles
- [ ] Remove duplicated CSS
- [ ] Keep only component-specific styles
- [ ] Use utility classes where appropriate

### 5. Testing & Verification
- [ ] Test all functionality
- [ ] Verify no regressions
- [ ] Check console for errors
- [ ] Verify styling is correct

---

## 🎨 CSS Organization

### Common Styles (Already Created)
```
styles/common/
├── index.css          # Main import file
├── modal.css          # Modal styles
├── forms.css          # Form styles
├── buttons.css        # Button styles
├── alerts.css         # Alert styles
├── badges.css         # Badge styles
└── utilities.css      # Utility classes
```

### Component Styles
```
styles/components/
├── lessons.css        # Lesson-specific styles
├── cards.css          # Card component styles
└── tables.css         # Table component styles
```

### Usage in Components
```css
/* YourComponent.css */
@import '../../styles/common/index.css';
@import '../../styles/components/cards.css';

/* Component-specific styles only */
.your-component-specific {
  /* ... */
}
```

---

## 🔍 Example: Refactoring HorseForm

### Before (Simplified)
```javascript
import React, { useState } from 'react';
import { horsesApi } from '../../services/api';

function HorseForm({ horse, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: horse?.name || '',
    kind: horse?.kind || 'cheval',
    breed: horse?.breed || '',
    color: horse?.color || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      alert('Name required');
      return;
    }
    
    setLoading(true);
    try {
      if (horse) {
        await horsesApi.update(horse.id, formData);
      } else {
        await horsesApi.create(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* ... form content */}
      </div>
    </div>
  );
}
```

### After (Refactored)
```javascript
import React, { useState } from 'react';
import { horsesApi } from '../../services/api';
import Modal from '../common/Modal';
import { Icons } from '../../utils/icons.jsx';
import { useFormState } from '../../hooks';
import { validateHorseForm } from '../../utils/validators';
import { HORSE_KINDS, HORSE_BREEDS, HORSE_COLORS } from '../../constants';
import './HorseForm.css';

function HorseForm({ horse, onClose, onSuccess }) {
  const {
    formData,
    errors,
    handleChange,
    setFormErrors,
  } = useFormState({
    name: horse?.name || '',
    kind: horse?.kind || 'cheval',
    breed: horse?.breed || '',
    color: horse?.color || '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateHorseForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }
    
    setLoading(true);
    try {
      if (horse) {
        await horsesApi.update(horse.id, formData);
      } else {
        await horsesApi.create(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setFormErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={
        <span>
          <Icons.Horse style={{ marginRight: '8px' }} />
          {horse ? 'Modifier le cheval' : 'Ajouter un cheval'}
        </span>
      }
      size="medium"
      footer={
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            <Icons.Cancel style={{ marginRight: '8px' }} />
            Annuler
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Icons.Loading className="spin" style={{ marginRight: '8px' }} />
                Enregistrement...
              </>
            ) : (
              <>
                <Icons.Save style={{ marginRight: '8px' }} />
                Enregistrer
              </>
            )}
          </button>
        </div>
      }
    >
      {errors.submit && (
        <div className="alert alert-error">
          <Icons.Warning style={{ marginRight: '8px' }} />
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <Icons.Edit style={{ marginRight: '4px' }} />
            Nom *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'is-invalid' : ''}`}
            required
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name}</div>
          )}
        </div>

        <div className="form-group">
          <label>Type *</label>
          <select
            name="kind"
            value={formData.kind}
            onChange={handleChange}
            className="form-select"
            required
          >
            {HORSE_KINDS.map(kind => (
              <option key={kind.value} value={kind.value}>
                {kind.label}
              </option>
            ))}
          </select>
        </div>

        {/* ... more fields */}
      </form>
    </Modal>
  );
}

export default HorseForm;
```

### CSS File
```css
/* HorseForm.css */
@import '../../styles/common/index.css';

/* Component-specific styles only */
.horse-form-specific {
  /* ... */
}
```

---

## 📊 Benefits of Refactoring

### Code Quality
- ✅ **No duplication** - Shared utilities used everywhere
- ✅ **Consistent patterns** - Same approach across all components
- ✅ **Better organization** - Clear separation of concerns
- ✅ **Easier testing** - Isolated logic

### Maintainability
- ✅ **Single source of truth** - Constants and utilities in one place
- ✅ **Easier updates** - Change once, applies everywhere
- ✅ **Better readability** - Smaller, focused components
- ✅ **Clear structure** - Predictable file organization

### Developer Experience
- ✅ **Faster development** - Reuse existing patterns
- ✅ **Better IDE support** - Improved autocomplete
- ✅ **Easier onboarding** - Consistent patterns to learn
- ✅ **Less cognitive load** - Familiar patterns

---

## 🚀 Next Steps

1. **Pick a component** from the priority list
2. **Follow the patterns** outlined in this guide
3. **Test thoroughly** after refactoring
4. **Commit incrementally** with clear messages
5. **Repeat** for next component

---

## 📞 Questions?

Refer to the refactored components for examples:
- `components/lessons/LessonModal/` - Complete refactored modal
- `components/lessons/SingleLessonModal/` - Form with participants
- `components/lessons/BlockedTimeModal/` - Simple form modal

All patterns and utilities are documented in their respective files.