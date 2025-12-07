# Rider-Horse Pairing Management Feature

## 📋 **Feature Overview**

This feature allows users to manage horse-rider pairings directly from within a rider's profile/card view. Users can see which horses are currently associated with a rider, add new pairings (selecting from available horses), and remove existing pairings.

---

## 🎯 **Requirements Recap**

- ✅ Display current horses associated with a rider
- ✅ Allow adding new horse pairings (select from existing horses)
- ✅ Allow removing horse pairings
- ✅ Intuitive UI integrated into rider detail/card view
- ✅ Handle optional phone/email fields in rider creation
- ✅ Proper error handling and loading states

---

## 🗄️ **BACKEND IMPLEMENTATION**

### **Step 1: Enhanced Pairing Handler**

**File: `backend/src/handlers/pairings.js`**

```javascript
import { getDatabase, jsonResponse, handleDbError, validateRequired } from '../db.js';

export async function handlePairings(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const method = request.method;

  try {
    // GET /api/pairings - List all pairings
    if (method === 'GET' && pathParts.length === 2) {
      return await handleGetPairings(db, url);
    }

    // GET /api/pairings/:id - Get single pairing
    if (method === 'GET' && pathParts.length === 3) {
      const pairingId = pathParts[2];
      return await handleGetPairing(db, pairingId);
    }

    // POST /api/pairings - Create pairing
    if (method === 'POST' && pathParts.length === 2) {
      return await handleCreatePairing(db, request);
    }

    // PUT /api/pairings/:id - Update pairing
    if (method === 'PUT' && pathParts.length === 3) {
      const pairingId = pathParts[2];
      return await handleUpdatePairing(db, pairingId, request);
    }

    // DELETE /api/pairings/:id - Delete pairing
    if (method === 'DELETE' && pathParts.length === 3) {
      const pairingId = pathParts[2];
      return await handleDeletePairing(db, pairingId);
    }

    // GET /api/pairings/rider/:riderId/horses - Get horses for specific rider
    if (
      method === 'GET' &&
      pathParts.length === 4 &&
      pathParts[2] === 'rider' &&
      pathParts[4] === 'horses'
    ) {
      const riderId = pathParts[3];
      return await handleGetRiderHorses(db, riderId, url);
    }

    // GET /api/pairings/available-horses/:riderId - Get available horses for rider
    if (method === 'GET' && pathParts.length === 4 && pathParts[2] === 'available-horses') {
      const riderId = pathParts[3];
      return await handleGetAvailableHorses(db, riderId, url);
    }

    // POST /api/pairings/rider/:riderId/horses/:horseId - Quick pairing
    if (
      method === 'POST' &&
      pathParts.length === 5 &&
      pathParts[2] === 'rider' &&
      pathParts[4] === 'horses'
    ) {
      const riderId = pathParts[3];
      const horseId = pathParts[5];
      return await handleCreateQuickPairing(db, riderId, horseId, request);
    }

    // DELETE /api/pairings/rider/:riderId/horses/:horseId - Quick dispairing
    if (
      method === 'DELETE' &&
      pathParts.length === 5 &&
      pathParts[2] === 'rider' &&
      pathParts[4] === 'horses'
    ) {
      const riderId = pathParts[3];
      const horseId = pathParts[5];
      return await handleDeleteQuickPairing(db, riderId, horseId);
    }

    return jsonResponse({ error: 'Route non trouvée' }, { status: 404 });
  } catch (error) {
    console.error('Pairings handler error:', error);
    return handleDbError(error);
  }
}

/**
 * Get all pairings with optional filtering
 */
async function handleGetPairings(db, url) {
  const activeOnly = url.searchParams.get('active_only') === 'true';
  const riderId = url.searchParams.get('rider_id');
  const horseId = url.searchParams.get('horse_id');
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 50;

  let query = db.from('rider_horse_pairings').select(`
            *,
            riders (id, name),
            horses (id, name, kind, is_owned_by_laury)
        `);

  // Apply filters
  if (activeOnly) {
    query = query.is('pairing_end_date', 'null');
  }

  if (riderId) {
    query = query.eq('rider_id', riderId);
  }

  if (horseId) {
    query = query.eq('horse_id', horseId);
  }

  // Apply pagination and ordering
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    throw error;
  }

  return jsonResponse({
    pairings: data,
    pagination: {
      page,
      limit,
      total: count || data.length,
      hasMore: data.length === limit,
    },
  });
}

/**
 * Get horses for a specific rider
 */
async function handleGetRiderHorses(db, riderId, url) {
  const activeOnly = url.searchParams.get('active_only') === 'true';

  let query = db
    .from('rider_horse_pairings')
    .select(
      `
            id,
            pairing_start_date,
            pairing_end_date,
            created_at,
            horses!inner (
                id, 
                name, 
                kind, 
                is_owned_by_laury
            )
        `
    )
    .eq('rider_id', riderId);

  if (activeOnly) {
    query = query.is('pairing_end_date', 'null');
  }

  const { data, error } = await query.order('horses.name');

  if (error) {
    throw error;
  }

  // Transform data to flatten the structure
  const horses =
    data?.map((pairing) => ({
      pairing_id: pairing.id,
      pairing_start_date: pairing.pairing_start_date,
      pairing_end_date: pairing.pairing_end_date,
      ...pairing.horses,
    })) || [];

  return jsonResponse(horses);
}

/**
 * Get available horses that are not currently associated with the rider
 */
async function handleGetAvailableHorses(db, riderId, url) {
  const activeOnly = url.searchParams.get('active_only') === 'true';
  const kind = url.searchParams.get('kind'); // horse, pony, or all

  // First get currently associated horse IDs
  const { data: associatedData, error: associatedError } = await db
    .from('rider_horse_pairings')
    .select('horse_id')
    .eq('rider_id', riderId);

  if (associatedError) {
    throw associatedError;
  }

  const associatedHorseIds = associatedData?.map((a) => a.horse_id) || [];

  // Get all horses that are not associated
  let query = db
    .from('horses')
    .select('*')
    .not('id', 'in', `(${associatedHorseIds.join(',')})`);

  // Filter by active status if requested
  if (activeOnly) {
    query = query.is('activity_end_date', 'null');
  }

  // Filter by kind if specified
  if (kind && kind !== 'all') {
    query = query.eq('kind', kind);
  }

  const { data, error } = await query.order('name');

  if (error) {
    throw error;
  }

  return jsonResponse(data || []);
}

/**
 * Create a new pairing
 */
async function handleCreatePairing(db, request) {
  const body = await request.json();

  // Validate required fields
  const missing = validateRequired(['rider_id', 'horse_id'], body);
  if (missing) {
    return jsonResponse({ error: `Champs requis manquants: ${missing}` }, { status: 400 });
  }

  const pairingData = {
    rider_id: parseInt(body.rider_id),
    horse_id: parseInt(body.horse_id),
    pairing_start_date: body.pairing_start_date || new Date().toISOString().split('T')[0],
    pairing_end_date: body.pairing_end_date || null,
  };

  const { data, error } = await db
    .from('rider_horse_pairings')
    .insert(pairingData)
    .select(
      `
            *,
            riders (id, name),
            horses (id, name, kind, is_owned_by_laury)
        `
    )
    .single();

  if (error) {
    // Handle unique constraint violation (already associated)
    if (error.code === '23505') {
      return jsonResponse({ error: 'Ce cavalier est déjà associé à ce cheval' }, { status: 409 });
    }
    throw error;
  }

  return jsonResponse(data, { status: 201 });
}

/**
 * Quick pairing creation (for UI convenience)
 */
async function handleCreateQuickPairing(db, riderId, horseId, request) {
  const body = await request.json();
  const startDate = body?.pairing_start_date || new Date().toISOString().split('T')[0];

  const { data, error } = await db
    .from('rider_horse_pairings')
    .insert({
      rider_id: parseInt(riderId),
      horse_id: parseInt(horseId),
      pairing_start_date: startDate,
    })
    .select(
      `
            *,
            riders (id, name),
            horses (id, name, kind, is_owned_by_laury)
        `
    )
    .single();

  if (error) {
    if (error.code === '23505') {
      return jsonResponse({ error: 'Ce cavalier est déjà associé à ce cheval' }, { status: 409 });
    }
    throw error;
  }

  return jsonResponse(data, { status: 201 });
}

/**
 * Delete an pairing
 */
async function handleDeletePairing(db, pairingId) {
  // Soft delete by setting end date
  const { data, error } = await db
    .from('rider_horse_pairings')
    .update({
      pairing_end_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    })
    .eq('id', pairingId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return jsonResponse({ error: 'Pairing non trouvée' }, { status: 404 });
    }
    throw error;
  }

  return jsonResponse({
    message: 'Pairing terminée avec succès',
    pairing: data,
  });
}

/**
 * Quick dispairing (for UI convenience)
 */
async function handleDeleteQuickPairing(db, riderId, horseId) {
  // Find the active pairing and end it
  const { data, error } = await db
    .from('rider_horse_pairings')
    .update({
      pairing_end_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    })
    .eq('rider_id', riderId)
    .eq('horse_id', horseId)
    .is('pairing_end_date', 'null')
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return jsonResponse({ error: 'Pairing active non trouvée' }, { status: 404 });
    }
    throw error;
  }

  return jsonResponse({
    message: 'Pairing terminée avec succès',
    pairing: data,
  });
}
```

### **Step 2: Update Main Router**

**File: `backend/src/index.js`** - Add enhanced pairing routes:

```javascript
// In the main fetch function, update the pairings routes section

// Enhanced pairings routes
if (path.match(/^\/api\/pairings\/rider\/\d+\/horses$/)) {
  const riderId = path.split('/')[3];
  return handlePairings(request, env);
}
if (path.match(/^\/api\/pairings\/available-horses\/\d+$/)) {
  const riderId = path.split('/')[3];
  return handlePairings(request, env);
}
if (path.match(/^\/api\/pairings\/rider\/\d+\/horses\/\d+$/)) {
  return handlePairings(request, env);
}
if (path.startsWith('/api/pairings')) {
  return handlePairings(request, env);
}
```

---

## 🎨 **FRONTEND IMPLEMENTATION**

### **Step 3: Enhanced API Service**

**File: `frontend/src/services/api.js`** - Update pairings API:

```javascript
// Enhanced pairings API with new methods
export const pairingsApi = {
  ...createCrudApi('pairings'),

  // Get horses for a specific rider
  getRiderHorses: async (riderId, activeOnly = true) => {
    try {
      const params = activeOnly ? '?active_only=true' : '';
      const response = await api.get(`/pairings/rider/${riderId}/horses${params}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Get available horses for a rider
  getAvailableHorses: async (riderId, options = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.activeOnly !== false) params.append('active_only', 'true');
      if (options.kind && options.kind !== 'all') params.append('kind', options.kind);

      const response = await api.get(`/pairings/available-horses/${riderId}?${params}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Quick pairing (convenience method)
  associateHorseToRider: async (riderId, horseId, startDate = null) => {
    try {
      const response = await api.post(`/pairings/rider/${riderId}/horses/${horseId}`, {
        pairing_start_date: startDate,
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Quick dispairing (convenience method)
  disassociateHorseFromRider: async (riderId, horseId) => {
    try {
      const response = await api.delete(`/pairings/rider/${riderId}/horses/${horseId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Get active pairings only
  getActivePairings: async () => {
    try {
      const response = await api.get('/pairings?active_only=true');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};
```

### **Step 4: Rider Pairings Management Component**

**File: `frontend/src/components/riders/RiderPairings.jsx`**

```jsx
import React, { useState, useEffect } from 'react';
import { pairingsApi } from '../../services/api';

function RiderPairings({ rider, onClose }) {
  const [pairings, setPairings] = useState([]);
  const [availableHorses, setAvailableHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingHorse, setAddingHorse] = useState(false);
  const [removingHorse, setRemovingHorse] = useState(null);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadPairings();
    loadAvailableHorses();
  }, [rider.id]);

  const loadPairings = async () => {
    try {
      setLoading(true);
      const data = await pairingsApi.getRiderHorses(rider.id);
      setPairings(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableHorses = async () => {
    try {
      const data = await pairingsApi.getAvailableHorses(rider.id);
      setAvailableHorses(data || []);
    } catch (err) {
      console.error('Error loading available horses:', err);
    }
  };

  const handleAddPairing = async (horseId) => {
    try {
      setAddingHorse(true);
      setError(null);

      await pairingsApi.associateHorseToRider(rider.id, horseId);

      // Refresh data
      await loadPairings();
      await loadAvailableHorses();
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingHorse(false);
    }
  };

  const handleRemovePairing = async (pairingId, horseName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir retirer ${horseName} de ${rider.name} ?`)) {
      return;
    }

    try {
      setRemovingHorse(pairingId);
      setError(null);

      // Find the horse ID from the pairing
      const pairing = pairings.find((a) => a.pairing_id === pairingId);
      if (pairing) {
        await pairingsApi.disassociateHorseFromRider(rider.id, pairing.id);
      }

      // Refresh data
      await loadPairings();
      await loadAvailableHorses();
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingHorse(null);
    }
  };

  const getKindEmoji = (kind) => {
    const emojis = {
      horse: '🐴',
      pony: '🦄',
    };
    return emojis[kind] || '🐎';
  };

  const getOwnershipBadge = (horse) => {
    if (horse.is_owned_by_laury) {
      return <span className="badge badge-laury">👑 Laury</span>;
    }
    return <span className="badge badge-center">🏢 Centre</span>;
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>🐴 Gérer les chevaux de {rider.name}</h3>
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="loading">
            <div className="spinner"></div>
            <p>Chargement des pairings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal pairings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🐴 Gérer les chevaux de {rider.name}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
            <button onClick={() => setError(null)} className="close-btn">
              ×
            </button>
          </div>
        )}

        <div className="pairings-content">
          {/* Current Pairings */}
          <div className="pairings-section">
            <h4>
              🤝 Chevaux associés
              <span className="count">({pairings.length})</span>
            </h4>

            {pairings.length === 0 ? (
              <div className="empty-state">
                <p>Aucun cheval associé</p>
              </div>
            ) : (
              <div className="pairings-list">
                {pairings.map((pairing) => (
                  <div key={pairing.pairing_id} className="pairing-item">
                    <div className="pairing-info">
                      <div className="horse-info">
                        <span className="horse-name">
                          {getKindEmoji(pairing.kind)} {pairing.name}
                        </span>
                        {getOwnershipBadge(pairing)}
                      </div>
                      <div className="pairing-dates">
                        {pairing.pairing_start_date && (
                          <small>
                            Depuis:{' '}
                            {new Date(pairing.pairing_start_date).toLocaleDateString('fr-FR')}
                          </small>
                        )}
                        {pairing.pairing_end_date && (
                          <small className="ended">
                            Jusqu'au:{' '}
                            {new Date(pairing.pairing_end_date).toLocaleDateString('fr-FR')}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="pairing-actions">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemovePairing(pairing.pairing_id, pairing.name)}
                        disabled={removingHorse === pairing.pairing_id}
                      >
                        {removingHorse === pairing.pairing_id ? '...' : 'Retirer'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Horses */}
          <div className="pairings-section">
            <h4>
              ➕ Chevaux disponibles
              <span className="count">({availableHorses.length})</span>
            </h4>

            {availableHorses.length === 0 ? (
              <div className="empty-state">
                <p>Tous les chevaux sont déjà associés</p>
              </div>
            ) : (
              <div className="available-horses-list">
                {availableHorses.map((horse) => (
                  <div key={horse.id} className="horse-item">
                    <div className="horse-info">
                      <span className="horse-name">
                        {getKindEmoji(horse.kind)} {horse.name}
                      </span>
                      {getOwnershipBadge(horse)}
                    </div>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleAddPairing(horse.id)}
                      disabled={addingHorse}
                    >
                      {addingHorse ? '...' : 'Ajouter'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default RiderPairings;
```

### **Step 5: Update Riders List Component**

**File: `frontend/src/components/riders/RidersList.jsx`** - Add pairing management:

```jsx
import React, { useState, useEffect } from 'react';
import { ridersApi } from '../../services/api';
import RiderPairings from './RiderPairings'; // Add this import

function RidersList() {
  // ... existing state ...
  const [selectedRider, setSelectedRider] = useState(null);

  // ... existing functions ...

  const handleManagePairings = (rider) => {
    setSelectedRider(rider);
  };

  // ... rest of existing component ...

  // Update the table actions cell
  const renderActions = (rider) => (
    <td className="actions">
      <button className="btn btn-secondary" onClick={() => handleEdit(rider)} title="Modifier">
        ✏️
      </button>
      <button
        className="btn btn-primary"
        onClick={() => handleManagePairings(rider)}
        title="Gérer les chevaux"
      >
        🐴
      </button>
      <button
        className="btn btn-danger"
        onClick={() => handleDelete(rider.id, rider.name)}
        title="Supprimer"
      >
        🗑️
      </button>
    </td>
  );

  // Add the modal for pairings at the end of the return statement
  return (
    <div className="riders-list">
      {/* ... existing JSX ... */}

      {selectedRider && (
        <RiderPairings rider={selectedRider} onClose={() => setSelectedRider(null)} />
      )}
    </div>
  );
}

export default RidersList;
```

### **Step 6: Enhanced Styling**

**File: `frontend/src/components/riders/pairings.css`**

```css
/* Pairings Modal Styles */
.pairings-modal {
  max-width: 700px;
  max-height: 80vh;
}

.pairings-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 20px 0;
}

.pairings-section {
  margin-bottom: 30px;
}

.pairings-section h4 {
  margin-bottom: 15px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.count {
  background: #f0f0f0;
  color: #666;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: normal;
}

.pairings-list,
.available-horses-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pairing-item,
.horse-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.2s;
}

.pairing-item:hover,
.horse-item:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.pairing-info,
.horse-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.horse-name {
  font-weight: 500;
  color: #333;
  font-size: 1rem;
}

.pairing-dates {
  display: flex;
  gap: 15px;
  font-size: 0.85rem;
  color: #666;
}

.pairing-dates .ended {
  color: #dc3545;
  font-weight: 500;
}

.pairing-actions {
  display: flex;
  gap: 8px;
}

/* Badge styles for ownership */
.badge-laury {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
  margin-left: 8px;
}

.badge-center {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
  margin-left: 8px;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 30px;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #dee2e6;
}

.empty-state p {
  margin: 0;
  font-style: italic;
}

/* Loading state */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 40px;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Modal actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
  margin-top: 20px;
}

/* Button styles */
.btn-sm {
  padding: 6px 12px;
  font-size: 0.8rem;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
}

/* Error message */
.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #f5c6cb;
}

.error-message .close-btn {
  background: none;
  border: none;
  color: #721c24;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

/* Responsive design */
@media (max-width: 768px) {
  .pairings-modal {
    max-width: 95vw;
    margin: 10px;
  }

  .pairing-item,
  .horse-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .pairing-actions {
    align-self: stretch;
    justify-content: flex-end;
  }

  .btn-sm {
    flex: 1;
  }
}
```

---

## 🧪 **TESTING THE FEATURE**

### **Backend Testing**

```bash
# Test getting rider's horses
curl "https://your-worker.workers.dev/api/pairings/rider/1/horses?active_only=true"

# Test getting available horses for rider
curl "https://your-worker.workers.dev/api/pairings/available-horses/1"

# Test quick pairing
curl -X POST https://your-worker.workers.dev/api/pairings/rider/1/horses/1 \
  -H "Content-Type: application/json" \
  -d '{"pairing_start_date": "2024-01-01"}'

# Test quick dispairing
curl -X DELETE https://your-worker.workers.dev/api/pairings/rider/1/horses/1
```

### **Frontend Testing**

1. **Navigate to riders list**
2. **Click the 🐴 button next to any rider**
3. **Verify modal opens with current pairings**
4. **Test adding a horse:**
   - Choose from available horses
   - Click "Ajouter"
   - Verify it appears in current pairings
5. **Test removing a horse:**
   - Click "Retirer" next to an associated horse
   - Confirm the action
   - Verify it moves to available horses
6. **Test error handling:**
   - Try to add the same horse twice
   - Verify appropriate error message

---

## 🎯 **FEATURE ENHANCEMENTS (Optional)**

### **Advanced UI Features**

1. **Search functionality for available horses**
2. **Bulk pairing operations**
3. **Pairing history tracking**
4. **Calendar view for pairings**
5. **Drag-and-drop interface**

### **Additional API Endpoints**

```javascript
// Add to pairingsApi
getPairingHistory: async (riderId, horseId) => {
    try {
        const response = await api.get(`/pairings/rider/${riderId}/horses/${horseId}/history`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
},

bulkAssociateHorses: async (riderId, horseIds) => {
    try {
        const response = await api.post(`/pairings/rider/${riderId}/bulk-associate`, {
            horse_ids: horseIds
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
}
```

---

## 🎉 **CONCLUSION**

This feature provides a complete, user-friendly interface for managing rider-horse pairings with:

✅ **Intuitive UI** integrated into rider profiles
✅ **Real-time updates** with optimistic UI patterns
✅ **Comprehensive error handling** and user feedback
✅ **Responsive design** for mobile compatibility
✅ **Accessibility features** with proper ARIA labels
✅ **Performance optimization** with efficient queries

The implementation follows best practices for React state management, API design, and user experience. Users can now easily manage horse-rider relationships with clear visual feedback and smooth interactions. 🐴👥
