# Modifying Existing Models - Step-by-Step Guide

## 📋 **Overview**

This guide demonstrates how to modify existing models in your equestrian management system. We'll use the specific example of adding a boolean field `isOwnedByLaury` to the existing `Horse` model to track which horses are owned by Laury versus the center.

---

## 🎯 **Example Scenario: Adding `isOwnedByLaury` to Horse Model**

**Requirements:**
- Add a boolean field `is_owned_by_laury` to the `horses` table
- Default value should be `false` (center-owned)
- Update backend API to handle the new field
- Update frontend forms and lists to display/manage this field
- Maintain backward compatibility

---

## 🗄️ **STEP 1: Database Migration**

### **1.1 Create Migration SQL**

**File: `database/migrations/003_add_is_owned_by_laury_to_horses.sql`**
```sql
-- Migration: Add is_owned_by_laury field to horses table
-- Created: 2024-XX-XX
-- Purpose: Track whether horses are owned by Laury or the center

-- Add the new column to horses table
ALTER TABLE horses 
ADD COLUMN is_owned_by_laury BOOLEAN DEFAULT FALSE NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN horses.is_owned_by_laury IS 'True if horse is owned by Laury, false if owned by center';

-- Create index for filtering (optional but recommended)
CREATE INDEX idx_horses_is_owned_by_laury ON horses(is_owned_by_laury);

-- Update existing records if needed (uncomment if you want to set some existing records)
-- UPDATE horses SET is_owned_by_laury = TRUE WHERE name IN ('List specific horse names if needed');

-- Add check constraint for data integrity
ALTER TABLE horses 
ADD CONSTRAINT chk_horses_is_owned_by_laury 
CHECK (is_owned_by_laury IN (TRUE, FALSE));

-- Update the trigger to include the new field in validation
-- (Note: This is optional since we're just adding a boolean field)
```

### **1.2 Alternative: Use Supabase Dashboard**

1. Go to **Supabase Dashboard** → **Database** → **Table Editor**
2. Select the **`horses`** table
3. Click **"Add column"**
4. Fill in:
   - **Name**: `is_owned_by_laury`
   - **Type**: `bool` (boolean)
   - **Default Value**: `false`
   - **Is Nullable**: `false` (uncheck)
5. Click **"Save"**

### **1.3 Verify Migration**

**Check the updated table structure:**
```sql
-- Verify the column was added correctly
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'horses' 
AND column_name = 'is_owned_by_laury';

-- Test with sample data
SELECT id, name, kind, is_owned_by_laury 
FROM horses 
LIMIT 5;
```

---

## ⚙️ **STEP 2: Backend API Updates**

### **2.1 Update Horse Handler**

**File: `backend/src/handlers/horses.js`**

**BEFORE:**
```javascript
// In handleHorses function - POST method
const horseData = {
    name: body.name.trim(),
    kind: body.kind,
    activity_start_date: body.activity_start_date || null,
    activity_end_date: body.activity_end_date || null,
};
```

**AFTER:**
```javascript
// In handleHorses function - POST method
const horseData = {
    name: body.name.trim(),
    kind: body.kind,
    activity_start_date: body.activity_start_date || null,
    activity_end_date: body.activity_end_date || null,
    is_owned_by_laury: Boolean(body.is_owned_by_laury || false),
};
```

**BEFORE:**
```javascript
// In handleHorses function - PUT method
const updateData = {
    name: body.name?.trim() || horse.name,
    kind: body.kind || horse.kind,
    activity_start_date: body.activity_start_date || horse.activity_start_date,
    activity_end_date: body.activity_end_date || horse.activity_end_date,
    updated_at: new Date().toISOString(),
};
```

**AFTER:**
```javascript
// In handleHorses function - PUT method
const updateData = {
    name: body.name?.trim() || horse.name,
    kind: body.kind || horse.kind,
    activity_start_date: body.activity_start_date || horse.activity_start_date,
    activity_end_date: body.activity_end_date || horse.activity_end_date,
    is_owned_by_laury: body.is_owned_by_laury !== undefined ? Boolean(body.is_owned_by_laury) : horse.is_owned_by_laury,
    updated_at: new Date().toISOString(),
};
```

### **2.2 Add Filter Support (Optional but Recommended)**

**Add filtering capability to the GET method:**
```javascript
// In handleHorses function - GET method
if (request.method === 'GET' && pathParts.length === 2) {
    const lauryOwned = url.searchParams.get('laury_owned');
    const centerOwned = url.searchParams.get('center_owned');
    
    let query = db.from('horses').select('*');
    
    // Add filtering for ownership
    if (lauryOwned === 'true') {
        query = query.eq('is_owned_by_laury', true);
    }
    if (centerOwned === 'true') {
        query = query.eq('is_owned_by_laury', false);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) return handleDbError(error);
    return jsonResponse(data, 200, getSecurityHeaders());
}
```

### **2.3 Update API Documentation**

**In `backend/src/index.js`** - update the docs endpoint:
```javascript
// Update the horses section in /api/docs
horses: {
    'GET /api/horses': 'List all horses (supports ?laury_owned=true&center_owned=true)',
    'GET /api/horses/:id': 'Get single horse',
    'POST /api/horses': 'Create horse (include is_owned_by_laury field)',
    'PUT /api/horses/:id': 'Update horse',
    'DELETE /api/horses/:id': 'Delete horse',
    'GET /api/horses/:id/riders': 'Get riders for horse'
},
```

---

## 🎨 **STEP 3: Frontend Updates**

### **3.1 Update API Service**

**File: `frontend/src/services/api.js`**

**BEFORE:**
```javascript
export const horsesApi = {
    ...createCrudApi('horses'),
    getRiders: async (id) => {
        try {
            const response = await api.get(`/horses/${id}/riders`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },
};
```

**AFTER:**
```javascript
export const horsesApi = {
    ...createCrudApi('horses'),
    getRiders: async (id) => {
        try {
            const response = await api.get(`/horses/${id}/riders`);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },
    
    // Add filtering methods
    getLauryOwned: async () => {
        try {
            const response = await api.get('/horses?laury_owned=true');
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },
    
    getCenterOwned: async () => {
        try {
            const response = await api.get('/horses?center_owned=true');
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },
};
```

### **3.2 Update Horse List Component**

**File: `frontend/src/components/horses/HorsesList.jsx`**

**BEFORE:**
```jsx
// In the table header
<thead>
    <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Activité</th>
        <th>Actions</th>
    </tr>
</thead>

// In the table body
<td>{horse.name}</td>
<td>{getKindEmoji(horse.kind)} {getKindLabel(horse.kind)}</td>
<td>{formatActivity(horse.activity_start_date, horse.activity_end_date)}</td>
```

**AFTER:**
```jsx
// In the table header
<thead>
    <tr>
        <th>Nom</th>
        <th>Type</th>
        <th>Propriétaire</th>
        <th>Activité</th>
        <th>Actions</th>
    </tr>
</thead>

// In the table body
<td>{horse.name}</td>
<td>{getKindEmoji(horse.kind)} {getKindLabel(horse.kind)}</td>
<td>
    {horse.is_owned_by_laury ? (
        <span className="badge badge-laury">👑 Laury</span>
    ) : (
        <span className="badge badge-center">🏢 Centre</span>
    )}
</td>
<td>{formatActivity(horse.activity_start_date, horse.activity_end_date)}</td>
```

**Add filtering controls:**
```jsx
// Add after the existing filters section
const [ownershipFilter, setOwnershipFilter] = useState('all');

// Add filter component
<div className="filters">
    <div className="filter-group">
        <label>Filtrer par propriétaire:</label>
        <select 
            value={ownershipFilter} 
            onChange={(e) => setOwnershipFilter(e.target.value)}
        >
            <option value="all">Tous</option>
            <option value="laury">Chevaux de Laury</option>
            <option value="center">Chevaux du centre</option>
        </select>
    </div>
</div>

// Update loadHorses function to use filter
const loadHorses = async () => {
    try {
        setLoading(true);
        let data;
        
        if (ownershipFilter === 'laury') {
            data = await horsesApi.getLauryOwned();
        } else if (ownershipFilter === 'center') {
            data = await horsesApi.getCenterOwned();
        } else {
            data = await horsesApi.getAll();
        }
        
        setHorses(data || []);
        setError(null);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

// Update useEffect to include filter dependency
useEffect(() => {
    loadHorses();
}, [ownershipFilter]);
```

### **3.3 Update Horse Form Component**

**File: `frontend/src/components/horses/HorseForm.jsx`**

**BEFORE:**
```jsx
const [formData, setFormData] = useState({
    name: '',
    kind: 'horse',
    activity_start_date: '',
    activity_end_date: '',
});
```

**AFTER:**
```jsx
const [formData, setFormData] = useState({
    name: '',
    kind: 'horse',
    activity_start_date: '',
    activity_end_date: '',
    is_owned_by_laury: false,
});
```

**BEFORE:**
```jsx
// In useEffect for editing
useEffect(() => {
    if (horse) {
        setFormData({
            name: horse.name || '',
            kind: horse.kind || 'horse',
            activity_start_date: horse.activity_start_date || '',
            activity_end_date: horse.activity_end_date || '',
        });
    }
}, [horse]);
```

**AFTER:**
```jsx
// In useEffect for editing
useEffect(() => {
    if (horse) {
        setFormData({
            name: horse.name || '',
            kind: horse.kind || 'horse',
            activity_start_date: horse.activity_start_date || '',
            activity_end_date: horse.activity_end_date || '',
            is_owned_by_laury: horse.is_owned_by_laury || false,
        });
    }
}, [horse]);
```

**Add the checkbox to the form:**
```jsx
// Add this in the form JSX, after the other fields
<div className="form-group">
    <label className="checkbox-label">
        <input
            type="checkbox"
            name="is_owned_by_laury"
            checked={formData.is_owned_by_laury}
            onChange={handleChange}
            disabled={submitting}
        />
        {' '} Ce cheval appartient à Laury
    </label>
    <small className="form-help">
        Cochez cette case si le cheval est la propriété personnelle de Laury
    </small>
</div>
```

---

## 🎨 **STEP 4: Styling Updates**

### **4.1 Add Badge Styles**

**File: `frontend/src/components/horses/horses.css`**
```css
/* Add these badge styles for ownership display */

.badge-laury {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.badge-center {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

/* Form checkbox styling */
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.form-help {
    color: #666;
    font-size: 0.85rem;
    margin-top: 4px;
    display: block;
}

/* Filter styling */
.filter-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.filter-group label {
    font-weight: 500;
    color: #333;
    font-size: 0.9rem;
}

.filter-group select {
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
}

.filters {
    display: flex;
    gap: 20px;
    align-items: flex-end;
    margin: 20px 0;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
}
```

---

## 🧪 **STEP 5: Testing and Validation**

### **5.1 Backend Testing**

**Test the updated API endpoints:**
```bash
# Test creating a horse with ownership field
curl -X POST https://your-worker.workers.dev/api/horses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Joly Jump",
    "kind": "horse",
    "is_owned_by_laury": true,
    "activity_start_date": "2024-01-01"
  }'

# Test filtering by ownership
curl https://your-worker.workers.dev/api/horses?laury_owned=true
curl https://your-worker.workers.dev/api/horses?center_owned=true

# Test updating ownership
curl -X PUT https://your-worker.workers.dev/api/horses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "is_owned_by_laury": true
  }'
```

### **5.2 Frontend Testing**

1. **Navigate to `/horses`**
2. **Test creating a new horse:**
   - Check/uncheck "Ce cheval appartient à Laury"
   - Verify the badge appears correctly in the list
3. **Test editing existing horses:**
   - Toggle the ownership setting
   - Verify changes persist
4. **Test filtering:**
   - Use the ownership filter dropdown
   - Verify it shows only the expected horses

---

## 🔄 **STEP 6: Migration to Production**

### **6.1 Production Migration Steps**

1. **Backup Production Database:**
   ```sql
   -- Create backup before migration
   CREATE TABLE horses_backup AS SELECT * FROM horses;
   ```

2. **Apply Migration:**
   - Use Supabase Dashboard to add the column
   - Or run the SQL migration script

3. **Update Data (if needed):**
   ```sql
   -- Set specific horses as owned by Laury
   UPDATE horses 
   SET is_owned_by_laury = TRUE 
   WHERE name IN ('Horse1', 'Horse2'); -- Replace with actual names
   ```

4. **Deploy Backend:**
   ```bash
   cd backend
   wrangler deploy
   ```

5. **Deploy Frontend:**
   ```bash
   cd frontend
   npm run build
   # Deploy to your hosting provider
   ```

### **6.2 Rollback Plan**

**If something goes wrong:**
```sql
-- Rollback the column addition
ALTER TABLE horses DROP COLUMN IF EXISTS is_owned_by_laury;

-- Restore from backup if needed
TRUNCATE TABLE horses;
INSERT INTO horses SELECT * FROM horses_backup;
```

---

## 📋 **CHECKLIST: Complete Model Modification**

### ✅ **Database Changes:**
- [ ] Migration SQL created and tested
- [ ] Column added with proper constraints
- [ ] Index created for performance
- [ ] Default value set correctly
- [ ] Existing data preserved

### ✅ **Backend Changes:**
- [ ] Handler updated for new field
- [ ] Create/Update operations handle new field
- [ ] Filtering implemented if needed
- [ ] API documentation updated
- [ ] Error handling tested

### ✅ **Frontend Changes:**
- [ ] Form component updated
- [ ] List component updated
- [ ] API service updated
- [ ] Styling added
- [ ] Validation implemented

### ✅ **Testing:**
- [ ] Backend endpoints tested
- [ ] Frontend UI tested
- [ ] Integration tested
- [ ] Edge cases tested

### ✅ **Deployment:**
- [ ] Migration applied to production
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Production verified

---

## 🚀 **Advanced Features (Optional Extensions)**

### **6.1 Add Ownership Statistics**
```javascript
// Add to API service
export const horsesApi = {
    // ... existing methods
    
    getOwnershipStats: async () => {
        try {
            const response = await api.get('/horses/stats/ownership');
            return response.data;
        } catch (error) {
            handleError(error);
        }
    }
};

// Add to backend handler
if (path === '/api/horses/stats/ownership' && method === 'GET') {
    const { data } = await db
        .from('horses')
        .select('is_owned_by_laury');
    
    const stats = {
        total: data.length,
        laury_owned: data.filter(h => h.is_owned_by_laury).length,
        center_owned: data.filter(h => !h.is_owned_by_laury).length,
    };
    
    return jsonResponse(stats, 200, getSecurityHeaders());
}
```

### **6.2 Add Bulk Ownership Update**
```javascript
// Add to backend handler
if (path === '/api/horses/bulk-update-ownership' && method === 'POST') {
    const { horseIds, isOwnedByLaury } = await request.json();
    
    const { data, error } = await db
        .from('horses')
        .update({ is_owned_by_laury: isOwnedByLaury })
        .in('id', horseIds)
        .select();
    
    if (error) return handleDbError(error);
    return jsonResponse(data, 200, getSecurityHeaders());
}
```

---

## 🎯 **Best Practices Summary**

### **When Modifying Existing Models:**

1. **Always use migrations** - Never modify production schemas directly
2. **Maintain backward compatibility** - Don't break existing functionality
3. **Provide sensible defaults** - New fields should have appropriate defaults
4. **Update all layers** - Database, backend API, and frontend UI
5. **Test thoroughly** - Both new functionality and existing features
6. **Document changes** - Update API docs and user-facing documentation
7. **Plan rollbacks** - Have a clear plan to revert changes if needed

### **Common Pitfalls to Avoid:**

1. **Forgetting to update all API methods** (create vs update)
2. **Missing validation for new fields**
3. **Inconsistent naming conventions** (snake_case vs camelCase)
4. **Not updating UI components that display the data**
5. **Forgetting to update API documentation**
6. **Not testing edge cases (null values, etc.)**

---

## 🎉 **Congratulations!**

You've successfully modified an existing model in your equestrian management system! This pattern can be applied to any model modifications:

- Adding new fields to riders (certifications, specializations, etc.)
- Adding payment information to associations
- Adding health records to horses
- Adding availability schedules to instructors

The key is to follow the systematic approach: Database → Backend → Frontend → Test → Deploy. 🐴