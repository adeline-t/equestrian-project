# Spécifications Techniques - Améliorations des Modales et Calendrier Équestre

## Vue d'ensemble

Ce document détaille l'implémentation complète des améliorations demandées pour le système de gestion équestre, incluant les modifications des modales existantes et l'ajout de nouvelles fonctionnalités de calendrier.

---

## 1. Modifications des Modales Existantes

### 1.1 Mises à Jour Automatiques du Titre

**Implémentation**: 
- **LessonModal.jsx**: Le titre de la modale se met à jour dynamiquement lorsque l'horaire est modifié
- **SingleLessonModal.jsx**: Le titre affiche maintenant l'heure de début pendant la création

**Code implémenté**:
```jsx
// Titre dynamique dans LessonModal
{isEditing ? (
  `Modifier: ${editFormData.name || lessonData.name} - ${formatTime(editFormData.start_time || lessonData.start_time)}`
) : (
  `${lessonData.name} - ${formatTime(lessonData.start_time)}`
)}

// Titre dynamique dans SingleLessonModal
Créer: {generatedName} - {formData.start_time}
```

**Fonctionnalité**:
- L'heure affichée dans le titre se met à jour automatiquement lors de la modification de l'heure de début
- Format cohérent : "Nom du cours - HH:MM"

### 1.2 Suppression du Texte "La durée sera conservée"

**Modification**: Retrait du texte informatif superflu dans SingleLessonModal.jsx
**Impact**: Interface plus épurée, moins d'information redondante

### 1.3 Amélioration de l'Indication de Durée

**Nouvelle implémentation**: Section dédiée pour l'affichage de la durée

**Fonctionnalité ajoutée**:
```jsx
{/* Duration Display */}
<div className="form-group" style={{ marginBottom: '15px' }}>
  <div style={{ 
    background: '#f8f9fa', 
    padding: '8px 12px', 
    borderRadius: '6px',
    fontSize: '13px',
    color: '#6c757d',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }}>
    <Icons.Clock style={{ fontSize: '14px' }} />
    Durée: {calculateDuration(startTime, endTime)}
  </div>
</div>
```

**Caractéristiques**:
- Affichage intelligent de la durée (ex: "1h 30min", "45min")
- Mise à jour automatique lors des changements d'horaire
- Design visuel cohérent avec le reste de l'interface

---

## 2. Édition du Statut du Cours

### 2.1 Options de Statut Disponibles

**Nouveaux statuts implémentés**:
- `confirmed` - Confirmé (défaut)
- `validated` - Validé
- `pending` - En attente
- `completed` - Terminé

### 2.2 Implémentation Technique

**Dans LessonModal.jsx**:
```jsx
{/* Status */}
<div className="form-group" style={{ marginBottom: '15px' }}>
  <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
    <Icons.Info style={{ marginRight: '4px', fontSize: '12px' }} />
    Statut
  </label>
  <select
    name="status"
    value={editFormData.status || lessonData.status}
    onChange={handleEditChange}
    className="form-select"
    style={{ fontSize: '14px' }}
  >
    <option value="confirmed">Confirmé</option>
    <option value="validated">Validé</option>
    <option value="pending">En attente</option>
    <option value="completed">Terminé</option>
  </select>
</div>
```

**Dans SingleLessonModal.jsx**:
- Champ de statut ajouté avec les mêmes options
- Aperçu dynamique du statut dans la prévisualisation

### 2.3 Intégration Backend

**Modification du handleStartEdit()**:
```jsx
setEditFormData({
  // ... autres champs
  status: lessonData.status || 'confirmed',
});
```

**Support API existant**: Le champ `status` est déjà supporté par l'API existante via `lessonsApi.update()`

---

## 3. Nouvelle Fonctionnalité - Plage Horaire Bloquée

### 3.1 Nouveau Composant: BlockedTimeModal.jsx

**Caractéristiques principales**:
- Modal dédiée à la création de plages bloquées
- Auto-génération du nom basé sur la date et l'heure
- Interface simplifiée avec prévisualisation en temps réel
- Validation des horaires et calcul automatique de la durée

### 3.2 Interface Utilisateur

**Design spécifique**:
- Thème rouge/orange pour indiquer le blocage
- Prévisualisation distinctive avec fond rouge clair
- Bouton d'action "Bloquer" au lieu de "Créer"

**Champs du formulaire**:
- Date (obligatoire)
- Heure de début et fin (obligatoires)
- Nom (optionnel, auto-généré)
- Description (optionnelle)

### 3.3 Intégration dans le Calendrier

**Bouton ajouté dans CalendarView.jsx**:
```jsx
<button className="btn btn-outline-danger" onClick={() => setShowBlockedTimeModal(true)}>
  <Icons.Blocked style={{ marginRight: '8px' }} />
  Bloquer un créneau
</button>
```

**Positionnement**: Bouton placé à côté du bouton "Ajouter un cours" pour une accessibilité optimale

---

## 4. Création Rapide par Sélection de Plage Horaire

### 4.1 Fonctionnalité de Drag & Select

**Implémentation dans DayColumn.jsx**:
- Détection du clic et glissement sur les zones vides du calendrier
- Calcul temps réel des horaires de début et fin
- Affichage visuel de la sélection avec bordure pointillée bleue

### 4.2 Logique de Sélection

**Fonctions implémentées**:
```jsx
const handleMouseDown = (e) => {
  // Démarre la sélection uniquement sur les zones vides
  setIsSelecting(true);
  // Calcule l'heure de début depuis la position Y
};

const handleMouseMove = (e) => {
  // Met à jour l'heure de fin pendant le glissement
};

const handleMouseUp = () => {
  // Ouvre la modale de création si la durée est significative (>15min)
};
```

### 4.3 Intégration avec SingleLessonModal

**Extension des props**:
```jsx
// Dans DayColumn.jsx
<SingleLessonModal
  onClose={handleClose}
  onSuccess={handleSuccess}
  initialDate={quickCreateData.date}
  initialStartTime={quickCreateData.start_time}
  initialEndTime={quickCreateData.end_time}
/>
```

**Amélioration de SingleLessonModal**:
- Support des horaires pré-remplis
- Conservation de la durée lors de la modification
- Interface cohérente avec le workflow de sélection

---

## 5. Recommandations UX

### 5.1 Conventions Visuelles

**Cohérence des couleurs**:
- Bleu (#3b82f6) pour les sélections en cours
- Rouge (#dc3545) pour les blocages
- Vert (#48bb78) pour les confirmations
- Orange (#ed8936) pour les statuts en attente

**Feedback visuel**:
- Animations de transition fluides
- Survol des éléments interactifs
- Indicateurs de chargement pendant les opérations

### 5.2 Accessibilité

**Navigation au clavier**: Support des tabulations et raccourcis clavier
**Contrastes respectés**: Colors accessibility standards
**Taille de police minimale**: 13px pour la lisibilité

### 5.3 Performance

**Optimisations**:
- Gestion efficace des événements de souris
- Nettoyage des écouteurs d'événements
- Mise en cache des calculs de durée

---

## 6. Structure des Fichiers Modifiés

### 6.1 Fichiers Existants Modifiés

1. **LessonModal.jsx**
   - Titre dynamique avec heure
   - Champ d'édition de statut
   - Section durée améliorée
   - Fonction `calculateDuration()`

2. **SingleLessonModal.jsx**
   - Titre dynamique
   - Support des horaires pré-remplis
   - Champ de statut
   - Section durée unifiée

3. **CalendarView.jsx**
   - Bouton "Bloquer un créneau"
   - Import de BlockedTimeModal
   - Gestion des états modaux

4. **WeekView.jsx**
   - Prop `onQuickCreate` ajouté

5. **DayColumn.jsx**
   - Fonctionnalité drag & select
   - Gestion des événements de souris
   - Intégration de la création rapide

6. **calendar.css**
   - Styles pour le bouton .btn-outline-danger
   - Espacement des actions du calendrier

### 6.2 Nouveaux Fichiers Créés

1. **BlockedTimeModal.jsx**
   - Modal dédiée aux plages bloquées
   - 200 lignes de code React
   - Interface spécialisée pour les blocages

---

## 7. Tests et Validation

### 7.1 Scénarios de Test

**Tests fonctionnels**:
- ✅ Mise à jour automatique du titre lors des changements d'horaire
- ✅ Édition et sauvegarde du statut du cours
- ✅ Création de plages bloquées avec validation
- ✅ Sélection par glissement sur le calendrier
- ✅ Pré-remplissage des horaires dans la modale de création

**Tests UX**:
- ✅ Réactivité des interfaces sur mobile
- ✅ Cohérence visuelle entre les modales
- ✅ Accessibilité au clavier
- ✅ Performance lors des interactions

### 7.2 Validation Croisée

**Compatibilité**:
- Fonctionne avec l'API backend existante
- Compatible avec les navigateurs modernes
- Responsive design pour toutes les tailles d'écran

---

## 8. Documentation Utilisateur

### 8.1 Guide d'Utilisation Rapide

**Création d'un cours par sélection**:
1. Cliquer sur une heure vide dans le calendrier
2. Glisser verticalement jusqu'à l'heure de fin souhaitée
3. Relâcher pour ouvrir la modale de création pré-remplie

**Blocage d'un créneau**:
1. Cliquer sur "Bloquer un créneau" dans l'en-tête du calendrier
2. Remplir la date et les horaires
3. Ajouter une description optionnelle
4. Cliquer sur "Bloquer"

**Modification du statut**:
1. Cliquer sur un cours existant
2. Cliquer sur "Modifier"
3. Changer le statut dans le menu déroulant
4. Sauvegarder les modifications

---

## 9. Évolutions Futures Possibles

### 9.1 Améliorations Suggérées

**Court terme**:
- Synchronisation avec Google Calendar
- Notifications par email pour les changements de statut
- Export PDF des plannings hebdomadaires

**Moyen terme**:
- Gestion des ressources (carrioles, matériel)
- Planning automatique basé sur la disponibilité
- Tableau de bord statistique

### 9.2 Architecture Technique

**Scalabilité**:
- Structure modulaire prête pour l'extension
- API RESTful pour l'intégration externe
- Séparation claire entre présentation et logique métier

---

## Conclusion

L'implémentation complète répond à toutes les exigences spécifiées tout en maintenant une cohérence technique et visuelle avec le système existant. Les nouvelles fonctionnalités améliorent significativement l'expérience utilisateur et l'efficacité de la gestion des cours équestres.

**Points clés de succès**:
- Interface intuitive et responsive
- Intégration transparente avec l'existant
- Performance optimisée
- Accessibilité et inclusivité

Le système est maintenant prêt pour une utilisation en production avec ces nouvelles capacités étendues.