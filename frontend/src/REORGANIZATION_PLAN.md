# Utils Folder Reorganization Plan

## Current Issues
- utils/ contains mixed concerns (components, validators, formatters, stats)
- No clear separation between libraries, helpers, and configuration
- Some files in wrong categories (ErrorBoundary, Portal should be components)

## Proposed Structure

```
src/
├── lib/
│   ├── libraries/          # Third-party integrations and complex utilities
│   │   ├── api.js         # API client configuration
│   │   └── icons.js       # Icon library wrapper
│   ├── helpers/           # Pure functions and business logic
│   │   ├── validators/    # Validation functions
│   │   ├── formatters/    # Data formatting functions
│   │   ├── stats/         # Statistics calculation functions
│   │   └── filters/       # Data filtering functions
│   └── config/            # Configuration constants
│       ├── api.js         # API endpoints
│       ├── forms.js       # Form configurations
│       └── ui.js          # UI constants (sizes, colors, etc.)
├── components/
│   ├── common/            # Reusable UI components
│   │   ├── Modal/
│   │   ├── ErrorBoundary.jsx
│   │   └── Portal.jsx
│   └── ...
├── constants/             # Domain-specific constants
│   ├── horses.js
│   ├── lessons.js
│   ├── packages.js
│   └── riders.js
├── services/              # Data fetching and API calls
│   ├── apiService.js
│   ├── calendarService.js
│   └── index.js
└── hooks/                 # React hooks for state management
    └── ...
```

## Migration Plan

### Phase 1: Create New Structure
- Create lib/ folders
- Move components to proper locations
- Organize helpers by category

### Phase 2: Move Files
- lib/libraries/ ← utils/icons.js
- lib/helpers/validators/ ← utils/validators/*
- lib/helpers/formatters/ ← utils/formatters/*
- lib/helpers/stats/ ← utils/horseStats.js, utils/pairingStats.js
- lib/helpers/filters/ ← utils/activityFilters.js
- components/common/ ← utils/ErrorBoundary.jsx, utils/Portal.jsx

### Phase 3: Update Constants
- Move configuration from constants/ to lib/config/
- Keep domain constants in constants/
- Add missing constants (modal sizes, validation rules, etc.)

### Phase 4: Services Unification
- Consolidate API logic in services/
- Ensure hooks only handle state, services handle data fetching
- Create clear separation of concerns