# Adding New Object Models - Complete Workflow Guide

## 📋 **Overview**

This guide provides a complete step-by-step workflow for adding new entities/models to your Equestrian Management System. We'll use the example of adding an **"Instructor"** model, but these steps apply to any new object.

---

## 🗄️ **STEP 1: Database Schema Design**

### **1.1 Plan Your Model Structure**

Before writing code, answer these questions:

- What fields does the model need?
- Which fields are required vs optional?
- What data types and constraints?
- How will it relate to existing models?
- What indexes are needed for performance?

### **1.2 Create Database Migration**

**File: `database/schema.sql` (add to existing)**

```sql
-- ========================================
-- INSTRUCTORS TABLE
-- ========================================
CREATE TABLE instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    specialization VARCHAR(100),
    certification_level VARCHAR(50),
    certification_date DATE,
    hire_date DATE,
    activity_start_date DATE,
    activity_end_date DATE,
    hourly_rate DECIMAL(10,2),
    max_students INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- INSTRUCTOR-LESSON ASSOCIATIONS (Optional)
-- ========================================
CREATE TABLE instructor_lesson_assignments (
    id SERIAL PRIMARY KEY,
    instructor_id INTEGER NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
    lesson_type VARCHAR(100) NOT NULL,
    lesson_day VARCHAR(20) NOT NULL,
    lesson_time TIME NOT NULL,
    max_participants INTEGER DEFAULT 8,
    hourly_rate_override DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX idx_instructors_name ON instructors(name);
CREATE INDEX idx_instructors_specialization ON instructors(specialization);
CREATE INDEX idx_instructors_active ON instructors(activity_end_date) WHERE activity_end_date IS NULL;
CREATE INDEX idx_instructor_assignments_instructor ON instructor_lesson_assignments(instructor_id);
CREATE INDEX idx_instructor_assignments_active ON instructor_lesson_assignments(is_active);

-- ========================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ========================================
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON instructors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instructor_assignments_updated_at BEFORE UPDATE ON instructor_lesson_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SAMPLE DATA (Optional - for testing)
-- ========================================
INSERT INTO instructors (name, phone, email, specialization, certification_level, hire_date, hourly_rate, max_students) VALUES
('Marie Dubois', '+33 6 12 34 56 78', 'marie.dubois@ecole.fr', 'Dressage', 'Level 3', '2023-01-15', 45.00, 6),
('Jean Martin', '+33 6 23 45 67 89', 'jean.martin@ecole.fr', 'Saut d''obstacle', 'Level 2', '2023-03-20', 40.00, 8),
('Sophie Bernard', '+33 6 34 56 78 90', 'sophie.bernard@ecole.fr', 'Poney club', 'Level 1', '2023-06-10', 35.00, 10);
```

### **1.3 Apply Schema Changes**

```bash
# Connect to your Supabase dashboard
# Go to SQL Editor → New Query
# Paste and run the schema changes above
```

---

## ⚙️ **STEP 2: Backend API Development**

### **2.1 Create Handler File**

**File: `backend/src/handlers/instructors.js`**

```javascript
import {
  getDatabase,
  handleDbError,
  jsonResponse,
  validateEmail,
  validatePhone,
  validateRequired,
} from '../db.js';

export async function handleInstructors(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const method = request.method;

  try {
    // GET /api/instructors - List all instructors
    if (method === 'GET' && pathParts.length === 2) {
      const { data, error } = await db.from('instructors').select('*').order('name');

      if (error) return handleDbError(error);

      // Filter active instructors if requested
      const activeOnly = url.searchParams.get('active') === 'true';
      const filteredData = activeOnly
        ? data.filter((instructor) => !instructor.activity_end_date)
        : data;

      return jsonResponse(filteredData, 200, getSecurityHeaders());
    }

    // GET /api/instructors/:id - Get single instructor
    if (method === 'GET' && pathParts.length === 3) {
      const id = pathParts[2];
      const { data, error } = await db.from('instructors').select('*').eq('id', id).single();

      if (error) return handleDbError(error);

      // Get instructor's lesson assignments
      const { data: assignments, error: assignError } = await db
        .from('instructor_lesson_assignments')
        .select('*')
        .eq('instructor_id', id)
        .eq('is_active', true)
        .order('lesson_day, lesson_time');

      if (assignError) console.error('Assignment fetch error:', assignError);

      return jsonResponse(
        {
          ...data,
          assignments: assignments || [],
        },
        200,
        getSecurityHeaders()
      );
    }

    // POST /api/instructors - Create instructor
    if (method === 'POST' && pathParts.length === 2) {
      const body = await request.json();

      // Validation
      const requiredFields = ['name'];
      const missing = validateRequired(requiredFields, body);
      if (missing) {
        return jsonResponse(
          {
            error: `Champs requis: ${missing}`,
          },
          400,
          getSecurityHeaders()
        );
      }

      // Email validation
      if (body.email && !validateEmail(body.email)) {
        return jsonResponse(
          {
            error: 'Email invalide',
          },
          400,
          getSecurityHeaders()
        );
      }

      // Phone validation
      if (body.phone && !validatePhone(body.phone)) {
        return jsonResponse(
          {
            error: 'Numéro de téléphone invalide',
          },
          400,
          getSecurityHeaders()
        );
      }

      const instructorData = {
        name: body.name.trim(),
        phone: body.phone?.trim() || null,
        email: body.email?.trim().toLowerCase() || null,
        specialization: body.specialization?.trim() || null,
        certification_level: body.certification_level || null,
        certification_date: body.certification_date || null,
        hire_date: body.hire_date || null,
        activity_start_date: body.activity_start_date || null,
        activity_end_date: body.activity_end_date || null,
        hourly_rate: body.hourly_rate ? parseFloat(body.hourly_rate) : null,
        max_students: body.max_students ? parseInt(body.max_students) : null,
      };

      const { data, error } = await db.from('instructors').insert(instructorData).select().single();

      if (error) return handleDbError(error);

      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT /api/instructors/:id - Update instructor
    if (method === 'PUT' && pathParts.length === 3) {
      const id = pathParts[2];
      const body = await request.json();

      // Get current instructor
      const { data: currentInstructor, error: fetchError } = await db
        .from('instructors')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) return handleDbError(fetchError);

      // Validation for updates
      if (body.email && !validateEmail(body.email)) {
        return jsonResponse(
          {
            error: 'Email invalide',
          },
          400,
          getSecurityHeaders()
        );
      }

      if (body.phone && !validatePhone(body.phone)) {
        return jsonResponse(
          {
            error: 'Numéro de téléphone invalide',
          },
          400,
          getSecurityHeaders()
        );
      }

      const updateData = {
        name: body.name?.trim() || currentInstructor.name,
        phone: body.phone?.trim() || currentInstructor.phone,
        email: body.email?.trim().toLowerCase() || currentInstructor.email,
        specialization: body.specialization?.trim() || currentInstructor.specialization,
        certification_level: body.certification_level || currentInstructor.certification_level,
        certification_date: body.certification_date || currentInstructor.certification_date,
        hire_date: body.hire_date || currentInstructor.hire_date,
        activity_start_date: body.activity_start_date || currentInstructor.activity_start_date,
        activity_end_date: body.activity_end_date || currentInstructor.activity_end_date,
        hourly_rate: body.hourly_rate
          ? parseFloat(body.hourly_rate)
          : currentInstructor.hourly_rate,
        max_students: body.max_students
          ? parseInt(body.max_students)
          : currentInstructor.max_students,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await db
        .from('instructors')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) return handleDbError(error);

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE /api/instructors/:id - Delete instructor
    if (method === 'DELETE' && pathParts.length === 3) {
      const id = pathParts[2];

      // Check if instructor has active assignments
      const { data: assignments, error: assignError } = await db
        .from('instructor_lesson_assignments')
        .select('id')
        .eq('instructor_id', id)
        .eq('is_active', true)
        .limit(1);

      if (assignError) return handleDbError(assignError);

      if (assignments && assignments.length > 0) {
        return jsonResponse(
          {
            error: 'Impossible de supprimer un moniteur avec des leçons actives',
          },
          400,
          getSecurityHeaders()
        );
      }

      const { error } = await db.from('instructors').delete().eq('id', id);

      if (error) return handleDbError(error);

      return jsonResponse(
        {
          message: 'Moniteur supprimé avec succès',
        },
        200,
        getSecurityHeaders()
      );
    }

    // GET /api/instructors/:id/assignments - Get instructor's lesson assignments
    if (method === 'GET' && pathParts.length === 4 && pathParts[3] === 'assignments') {
      const instructorId = pathParts[2];

      const { data, error } = await db
        .from('instructor_lesson_assignments')
        .select('*')
        .eq('instructor_id', instructorId)
        .eq('is_active', true)
        .order('lesson_day, lesson_time');

      if (error) return handleDbError(error);

      return jsonResponse(data || [], 200, getSecurityHeaders());
    }

    // 404 - Unknown route
    return jsonResponse(
      {
        error: 'Route non trouvée',
      },
      404,
      getSecurityHeaders()
    );
  } catch (error) {
    console.error('Instructor handler error:', error);
    return jsonResponse(
      {
        error: 'Erreur serveur interne',
      },
      500,
      getSecurityHeaders()
    );
  }
}

// Helper function for security headers
function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  };
}
```

### **2.2 Update Main Router**

**File: `backend/src/index.js`** (add to imports and routes)

```javascript
// Add this import at the top
import { handleInstructors } from './handlers/instructors.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // ... existing code ...

    try {
      // Add instructors routes before the 404
      if (path.startsWith('/api/instructors')) {
        return handleInstructors(request, env);
      }

      // ... existing riders, horses, pairings routes ...

      // ... rest of existing code ...
    } catch (error) {
      // ... existing error handling ...
    }
  },
};
```

### **2.3 Update API Documentation**

**In `backend/src/index.js`** - update the docs endpoint:

```javascript
// Update the docs endpoint in the main fetch function
if (path === '/api/docs') {
  return jsonResponse(
    {
      title: 'Equestrian Management API',
      version: '1.0.0',
      endpoints: {
        // ... existing endpoints ...
        instructors: {
          'GET /api/instructors': 'List all instructors',
          'GET /api/instructors/:id': 'Get single instructor',
          'POST /api/instructors': 'Create instructor',
          'PUT /api/instructors/:id': 'Update instructor',
          'DELETE /api/instructors/:id': 'Delete instructor',
          'GET /api/instructors/:id/assignments': 'Get instructor lesson assignments',
        },
        // ... other endpoints ...
      },
    },
    200,
    getSecurityHeaders()
  );
}
```

---

## 🎨 **STEP 3: Frontend API Integration**

### **3.1 Update API Service**

**File: `frontend/src/services/api.js`** (add at the end)

```javascript
// Create instructors API instance
export const instructorsApi = {
  ...createCrudApi('instructors'),

  // Get instructor with assignments
  getWithAssignments: async (id) => {
    try {
      const response = await api.get(`/instructors/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Get instructor assignments only
  getAssignments: async (instructorId) => {
    try {
      const response = await api.get(`/instructors/${instructorId}/assignments`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Get active instructors only
  getActive: async () => {
    try {
      const response = await api.get('/instructors?active=true');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// Create lesson assignments API (for the junction table)
export const lessonAssignmentsApi = createCrudApi('lesson-assignments');
```

### **3.2 Create Type Definitions**

**File: `frontend/src/types/instructors.js`**

```javascript
// Instructor type definitions
export const InstructorStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  FORMER: 'former',
};

export const CertificationLevel = {
  LEVEL_1: 'Level 1',
  LEVEL_2: 'Level 2',
  LEVEL_3: 'Level 3',
  LEVEL_4: 'Level 4',
  GRAND_PRIX: 'Grand Prix',
};

export const Specialization = {
  DRESSAGE: 'Dressage',
  JUMPING: "Saut d'obstacle",
  CROSS_COUNTRY: 'Cross-country',
  PONY_CLUB: 'Pony club',
  GENERAL: 'Général',
};

// Validation helpers
export const validateInstructor = (instructor) => {
  const errors = [];

  if (!instructor.name || instructor.name.trim().length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères');
  }

  if (instructor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(instructor.email)) {
    errors.push('Email invalide');
  }

  if (instructor.phone && !/^[\d\s\+\-\(\)]+$/.test(instructor.phone)) {
    errors.push('Numéro de téléphone invalide');
  }

  if (instructor.hourly_rate && (isNaN(instructor.hourly_rate) || instructor.hourly_rate < 0)) {
    errors.push('Le taux horaire doit être un nombre positif');
  }

  if (instructor.max_students && (isNaN(instructor.max_students) || instructor.max_students < 1)) {
    errors.push("Le nombre maximum d'élèves doit être au moins 1");
  }

  return errors;
};

// Utility functions
export const isInstructorActive = (instructor) => {
  return !instructor.activity_end_date;
};

export const getInstructorStatusLabel = (instructor) => {
  if (!instructor.activity_end_date) return 'Actif';
  if (instructor.activity_end_date) return 'Inactif';
  return 'Inconnu';
};
```

---

## 🖥️ **STEP 4: Frontend UI Components**

### **4.1 Create Instructors List Component**

**File: `frontend/src/components/instructors/InstructorsList.jsx`**

```jsx
import React, { useState, useEffect } from 'react';
import { instructorsApi } from '../../services/api.js';
import { isInstructorActive, getInstructorStatusLabel } from '../../types/instructors.js';

function InstructorsList() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    try {
      setLoading(true);
      const data = await instructorsApi.getAll();
      setInstructors(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (instructorData) => {
    try {
      await instructorsApi.create(instructorData);
      await loadInstructors();
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, instructorData) => {
    try {
      await instructorsApi.update(id, instructorData);
      await loadInstructors();
      setEditingInstructor(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${name}?`)) {
      try {
        await instructorsApi.delete(id);
        await loadInstructors();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getSpecializationBadge = (specialization) => {
    const colors = {
      Dressage: 'bg-blue-100 text-blue-800',
      "Saut d'obstacle": 'bg-green-100 text-green-800',
      'Cross-country': 'bg-orange-100 text-orange-800',
      'Pony club': 'bg-purple-100 text-purple-800',
      Général: 'bg-gray-100 text-gray-800',
    };
    return colors[specialization] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="loading">Chargement des moniteurs...</div>;
  }

  return (
    <div className="instructors-list">
      <div className="page-header">
        <h1>👨‍🏫 Moniteurs</h1>
        <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
          + Ajouter un moniteur
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          ❌ {error}
          <button onClick={() => setError(null)} className="alert-close">
            ×
          </button>
        </div>
      )}

      {showCreateForm && (
        <InstructorForm onSubmit={handleCreate} onCancel={() => setShowCreateForm(false)} />
      )}

      {instructors.length === 0 ? (
        <div className="empty-state">
          <p>Aucun moniteur trouvé</p>
          <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
            Créer le premier moniteur
          </button>
        </div>
      ) : (
        <div className="instructors-grid">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="instructor-card">
              <div className="card-header">
                <h3>{instructor.name}</h3>
                <span
                  className={`badge ${
                    isInstructorActive(instructor) ? 'badge-success' : 'badge-secondary'
                  }`}
                >
                  {getInstructorStatusLabel(instructor)}
                </span>
              </div>

              <div className="card-body">
                {instructor.email && <div className="info-item">📧 {instructor.email}</div>}
                {instructor.phone && <div className="info-item">📞 {instructor.phone}</div>}
                {instructor.specialization && (
                  <div className="info-item">
                    <span className={`badge ${getSpecializationBadge(instructor.specialization)}`}>
                      {instructor.specialization}
                    </span>
                  </div>
                )}
                {instructor.certification_level && (
                  <div className="info-item">🏆 {instructor.certification_level}</div>
                )}
                {instructor.hourly_rate && (
                  <div className="info-item">💰 {instructor.hourly_rate}€/heure</div>
                )}
                {instructor.max_students && (
                  <div className="info-item">👥 Max: {instructor.max_students} élèves</div>
                )}
                {instructor.hire_date && (
                  <div className="info-item">
                    📅 Embauché: {new Date(instructor.hire_date).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>

              <div className="card-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingInstructor(instructor)}
                >
                  ✏️ Modifier
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(instructor.id, instructor.name)}
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingInstructor && (
        <InstructorForm
          instructor={editingInstructor}
          onSubmit={(data) => handleUpdate(editingInstructor.id, data)}
          onCancel={() => setEditingInstructor(null)}
        />
      )}
    </div>
  );
}

export default InstructorsList;
```

### **4.2 Create Instructor Form Component**

**File: `frontend/src/components/instructors/InstructorForm.jsx`**

```jsx
import React, { useState, useEffect } from 'react';
import { validateInstructor, CertificationLevel, Specialization } from '../../types/instructors.js';

function InstructorForm({ instructor, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialization: '',
    certification_level: '',
    certification_date: '',
    hire_date: '',
    activity_start_date: '',
    activity_end_date: '',
    hourly_rate: '',
    max_students: '',
  });

  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (instructor) {
      setFormData({
        name: instructor.name || '',
        phone: instructor.phone || '',
        email: instructor.email || '',
        specialization: instructor.specialization || '',
        certification_level: instructor.certification_level || '',
        certification_date: instructor.certification_date || '',
        hire_date: instructor.hire_date || '',
        activity_start_date: instructor.activity_start_date || '',
        activity_end_date: instructor.activity_end_date || '',
        hourly_rate: instructor.hourly_rate || '',
        max_students: instructor.max_students || '',
      });
    }
  }, [instructor]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateInstructor(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors([error.message]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{instructor ? '✏️ Modifier un moniteur' : '➕ Ajouter un moniteur'}</h2>
          <button className="modal-close" onClick={onCancel}>
            ×
          </button>
        </div>

        {errors.length > 0 && (
          <div className="alert alert-error">
            {errors.map((error, index) => (
              <div key={index}>❌ {error}</div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="instructor-form">
          <div className="form-row">
            <div className="form-group required">
              <label htmlFor="name">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={submitting}
                placeholder="Nom du moniteur"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={submitting}
                placeholder="email@exemple.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={submitting}
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialization">Spécialisation</label>
              <select
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="">Sélectionner...</option>
                {Object.values(Specialization).map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="certification_level">Niveau de certification</label>
              <select
                id="certification_level"
                name="certification_level"
                value={formData.certification_level}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="">Sélectionner...</option>
                {Object.values(CertificationLevel).map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="certification_date">Date de certification</label>
              <input
                type="date"
                id="certification_date"
                name="certification_date"
                value={formData.certification_date}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hire_date">Date d'embauche</label>
              <input
                type="date"
                id="hire_date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="activity_start_date">Début d'activité</label>
              <input
                type="date"
                id="activity_start_date"
                name="activity_start_date"
                value={formData.activity_start_date}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="activity_end_date">Fin d'activité (si applicable)</label>
              <input
                type="date"
                id="activity_end_date"
                name="activity_end_date"
                value={formData.activity_end_date}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="hourly_rate">Taux horaire (€)</label>
              <input
                type="number"
                id="hourly_rate"
                name="hourly_rate"
                value={formData.hourly_rate}
                onChange={handleChange}
                disabled={submitting}
                min="0"
                step="0.01"
                placeholder="45.00"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="max_students">Nombre max d'élèves</label>
              <input
                type="number"
                id="max_students"
                name="max_students"
                value={formData.max_students}
                onChange={handleChange}
                disabled={submitting}
                min="1"
                placeholder="8"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={submitting}
            >
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Enregistrement...' : instructor ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InstructorForm;
```

### **4.3 Add Navigation**

**File: `frontend/src/App.jsx`** (add route and import)

```jsx
import InstructorsList from './components/instructors/InstructorsList.jsx';

// Add to your router configuration:
<Route path="/instructors" element={<InstructorsList />} />;
```

### **4.4 Update Navigation Menu**

**Add instructors link to your navigation component**

---

## 🎨 **STEP 5: Styling**

### **5.1 Add Instructor-Specific CSS**

**File: `frontend/src/components/instructors/instructors.css`**

```css
/* Instructors Grid Layout */
.instructors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* Instructor Card */
.instructor-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.instructor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.card-body {
  padding: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #555;
}

.info-item:last-child {
  margin-bottom: 0;
}

.card-actions {
  padding: 16px 20px;
  background: #f8f9fa;
  display: flex;
  gap: 10px;
  border-top: 1px solid #e9ecef;
}

.card-actions .btn {
  flex: 1;
  padding: 8px 12px;
  font-size: 0.85rem;
}

/* Specialization Badges */
.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.badge-success {
  background-color: #d4edda;
  color: #155724;
}

.badge-secondary {
  background-color: #e2e3e5;
  color: #383d41;
}

.badge-blue {
  background-color: #cce5ff;
  color: #004085;
}

.badge-green {
  background-color: #d4edda;
  color: #155724;
}

.badge-orange {
  background-color: #ffeaa7;
  color: #856404;
}

.badge-purple {
  background-color: #e7d3ff;
  color: #6f42c1;
}

.badge-gray {
  background-color: #e2e3e5;
  color: #383d41;
}

/* Form Styles */
.instructor-form {
  max-width: 600px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 6px;
  color: #333;
  font-size: 0.9rem;
}

.form-group.required label::after {
  content: ' *';
  color: #dc3545;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

/* Responsive Design */
@media (max-width: 768px) {
  .instructors-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
  }

  .card-actions .btn {
    width: 100%;
  }
}
```

### **5.2 Import CSS**

**In `InstructorsList.jsx`**: Add at the top

```jsx
import './instructors.css';
```

---

## 🧪 **STEP 6: Testing & Validation**

### **6.1 Backend Testing**

```bash
# Test instructor endpoints
curl -X GET https://your-worker.workers.dev/api/instructors
curl -X GET https://your-worker.workers.dev/api/instructors/1
curl -X POST https://your-worker.workers.dev/api/instructors \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Instructor","email":"test@example.com"}'
```

### **6.2 Frontend Testing**

1. Navigate to `/instructors` route
2. Test create, read, update, delete operations
3. Verify form validation
4. Test error handling
5. Check responsive design

---

## 📚 **STEP 7: Documentation Updates**

### **7.1 Update README**

Add instructors to your feature list and API documentation.

### **7.2 Update API Documentation**

Ensure the `/api/docs` endpoint includes instructor endpoints.

---

## ✅ **Step 8: Production Deployment**

### **8.1 Deploy Backend**

```bash
cd backend
npm run deploy
```

### **8.2 Deploy Frontend**

```bash
cd frontend
npm run build
# Deploy to your hosting provider
```

### **8.3 Verify Production**

1. Test all instructor endpoints in production
2. Verify frontend loads instructor data
3. Test CRUD operations
4. Check error handling

---

## 🔄 **STEP 9: Future Enhancements**

### **Possible Additions:**

- Instructor availability calendar
- Lesson scheduling integration
- Instructor performance metrics
- Bulk operations (import/export)
- Instructor photos/profiles
- Certification tracking
- Salary management
- Instructor-student assignment history

---

## 🎯 **Best Practices Summary**

1. **Database First**: Always start with schema design
2. **Validation Layer**: Implement both frontend and backend validation
3. **Error Handling**: Comprehensive error handling at every layer
4. **Type Safety**: Use type definitions for better development experience
5. **Responsive Design**: Ensure mobile-friendly UI
6. **Security**: Never expose sensitive data, validate all inputs
7. **Testing**: Test all endpoints and UI interactions
8. **Documentation**: Keep API documentation updated

---

## 🚨 **Common Pitfalls to Avoid**

1. **Missing CORS Headers**: Always include proper CORS configuration
2. **Environment Variables**: Don't hardcode URLs or credentials
3. **SQL Injection**: Use parameterized queries (handled by Supabase)
4. **Memory Leaks**: Clean up event listeners and subscriptions
5. **Race Conditions**: Handle async operations properly
6. **Missing Error States**: Always show user feedback for errors
7. **Accessibility**: Include proper ARIA labels and keyboard navigation

---

## 🎉 **Congratulations!**

You've successfully added a new object model to your Equestrian Management System! This workflow can be adapted for any new entity you want to add to your application.

The same pattern applies to:

- Equipment tracking
- Facility management
- Lesson scheduling
- Billing/invoicing
- Student progress tracking
- And much more!

Happy coding! 🐴
