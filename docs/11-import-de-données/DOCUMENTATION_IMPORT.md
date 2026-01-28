# Documentation du format d'import de planning

## Structure générale

Le fichier JSON doit contenir trois tableaux principaux :
- `events` : les types d'événements
- `planning_slots` : les créneaux horaires
- `event_participants` : les participants (cavaliers et chevaux)

---

## 1. Tableau `events`

Définit les événements/types de cours.

### Champs obligatoires :
- `id` (number) : Identifiant unique de l'événement (utilisé pour lier aux slots)
- `event_type` (string) : Type d'événement

### Champs optionnels :
- `name` (string) : Nom de l'événement (par défaut = event_type)
- `min_participants` (number) : Nombre minimum de participants (par défaut = 0)
- `max_participants` (number) : Nombre maximum de participants (par défaut = 10)

### Types d'événements disponibles :
- `"private_lesson"` : Cours particulier
- `"group_lesson"` : Cours collectif
- `"training"` : Entraînement/stage
- `"competition"` : Concours
- `"rest"` : Repos
- `"other"` : Autre

### Exemple :
```json
{
  "id": 1,
  "event_type": "private_lesson",
  "name": "Cours particulier saut",
  "min_participants": 1,
  "max_participants": 1
}
```

---

## 2. Tableau `planning_slots`

Définit les créneaux horaires associés aux événements.

### Champs obligatoires :
- `id` (number) : Identifiant unique du créneau (utilisé pour lier aux participants)
- `event_id` (number) : ID de l'événement correspondant
- `slot_date` (string) : Date au format `YYYY-MM-DD` (ex: "2026-01-29")
- `start_time` (string) : Heure de début au format `HH:MM` (ex: "14:00")
- `end_time` (string) : Heure de fin au format `HH:MM` (ex: "15:00")

### Champs optionnels :
- `is_all_day` (boolean) : Créneau sur toute la journée (par défaut = false)
- `slot_status` (string) : Statut du créneau (par défaut = "scheduled")

### Statuts disponibles :
- `"scheduled"` : Programmé
- `"completed"` : Terminé
- `"cancelled"` : Annulé

### Exemple :
```json
{
  "id": 1,
  "event_id": 1,
  "slot_date": "2026-01-29",
  "start_time": "14:00",
  "end_time": "15:00",
  "is_all_day": false,
  "slot_status": "scheduled"
}
```

### Exemple créneau toute la journée (repos) :
```json
{
  "id": 3,
  "event_id": 3,
  "slot_date": "2026-01-29",
  "start_time": "00:00",
  "end_time": "23:59",
  "is_all_day": true,
  "slot_status": "scheduled"
}
```

---

## 3. Tableau `event_participants`

Définit les participants (paires cavalier-cheval) pour chaque créneau.

### Champs obligatoires :
- `id` (number) : Identifiant unique du participant
- `planning_slot_id` (number) : ID du créneau correspondant

### Champs optionnels (au moins l'un des deux doit être renseigné) :
- `rider_name` (string ou null) : Nom du cavalier
- `horse_name` (string ou null) : Nom du cheval

### Règles importantes :
1. **Au moins un nom** : Soit `rider_name`, soit `horse_name`, soit les deux doivent être renseignés
2. **Cavaliers null acceptés** : Pour un événement "repos" par exemple, on peut avoir uniquement un cheval
3. **Chevaux null acceptés** : Pour un cours sans cheval attribué, on peut avoir uniquement un cavalier
4. **Recherche fuzzy** : Les noms sont recherchés de manière approximative dans la base
5. **Création automatique** : Si un cavalier ou cheval n'existe pas, il sera créé automatiquement
6. **Noms spéciaux** : Le nom "essai" (ou "Essai") est ignoré et ne crée pas de cavalier

### Exemple avec cavalier et cheval :
```json
{
  "id": 1,
  "planning_slot_id": 1,
  "rider_name": "Charlotte",
  "horse_name": "Zelda"
}
```

### Exemple avec seulement un cheval (repos) :
```json
{
  "id": 4,
  "planning_slot_id": 3,
  "rider_name": null,
  "horse_name": "Perfect"
}
```

### Exemple avec seulement un cavalier :
```json
{
  "id": 5,
  "planning_slot_id": 2,
  "rider_name": "Océane",
  "horse_name": null
}
```

---

## Processus d'import

L'import se déroule en 4 étapes :

1. **Chargement des données existantes**
   - Récupération de tous les cavaliers
   - Récupération de tous les chevaux
   - Récupération de tous les créneaux

2. **Traitement des cavaliers et chevaux**
   - Pour chaque participant, recherche du cavalier/cheval existant
   - Création automatique si non trouvé
   - Les cavaliers null sont comptés mais pas créés
   - Les chevaux null sont comptés mais pas créés

3. **Création des événements et créneaux**
   - Vérification que le créneau n'existe pas déjà (même date + même heure)
   - Création de l'événement
   - Création du créneau associé
   - Les créneaux existants sont ignorés

4. **Ajout des participants**
   - Liaison cavalier-cheval au créneau
   - Au moins un des deux (cavalier ou cheval) doit être présent
   - Les participants sans cavalier ni cheval sont ignorés

---

## Résultat de l'import

Après l'import, vous obtenez un rapport contenant :

- `ridersCreated` : Nombre de cavaliers créés
- `ridersFound` : Nombre de cavaliers trouvés (existants)
- `ridersSkipped` : Nombre de cavaliers null (ignorés)
- `horsesCreated` : Nombre de chevaux créés
- `horsesFound` : Nombre de chevaux trouvés (existants)
- `horsesSkipped` : Nombre de chevaux null (ignorés)
- `eventsCreated` : Nombre d'événements créés
- `slotsCreated` : Nombre de créneaux créés
- `slotsSkipped` : Nombre de créneaux ignorés (déjà existants)
- `participantsCreated` : Nombre de participants ajoutés
- `participantsSkipped` : Nombre de participants ignorés (ni cavalier ni cheval)
- `errors` : Liste des erreurs rencontrées

---

## Exemples complets

### Exemple 1 : Cours particulier simple
```json
{
  "events": [
    {
      "id": 1,
      "event_type": "private_lesson",
      "min_participants": 1,
      "max_participants": 1
    }
  ],
  "planning_slots": [
    {
      "id": 1,
      "event_id": 1,
      "slot_date": "2026-01-29",
      "start_time": "14:00",
      "end_time": "15:00",
      "is_all_day": false
    }
  ],
  "event_participants": [
    {
      "id": 1,
      "planning_slot_id": 1,
      "rider_name": "Charlotte",
      "horse_name": "Zelda"
    }
  ]
}
```

### Exemple 2 : Cours collectif avec plusieurs participants
```json
{
  "events": [
    {
      "id": 1,
      "event_type": "group_lesson",
      "name": "Cours collectif débutants",
      "min_participants": 2,
      "max_participants": 6
    }
  ],
  "planning_slots": [
    {
      "id": 1,
      "event_id": 1,
      "slot_date": "2026-01-29",
      "start_time": "15:00",
      "end_time": "16:00",
      "is_all_day": false
    }
  ],
  "event_participants": [
    {
      "id": 1,
      "planning_slot_id": 1,
      "rider_name": "Léna",
      "horse_name": "Héra"
    },
    {
      "id": 2,
      "planning_slot_id": 1,
      "rider_name": "Océane",
      "horse_name": "Nuits"
    },
    {
      "id": 3,
      "planning_slot_id": 1,
      "rider_name": "Gabriel",
      "horse_name": "Lady"
    }
  ]
}
```

### Exemple 3 : Journée de repos pour un cheval
```json
{
  "events": [
    {
      "id": 1,
      "event_type": "rest",
      "name": "Repos",
      "min_participants": 0,
      "max_participants": 0
    }
  ],
  "planning_slots": [
    {
      "id": 1,
      "event_id": 1,
      "slot_date": "2026-01-29",
      "start_time": "00:00",
      "end_time": "23:59",
      "is_all_day": true
    }
  ],
  "event_participants": [
    {
      "id": 1,
      "planning_slot_id": 1,
      "rider_name": null,
      "horse_name": "Perfect"
    }
  ]
}
```

---

## Conseils et bonnes pratiques

1. **Vérifiez vos dates** : Utilisez toujours le format `YYYY-MM-DD`
2. **Heures cohérentes** : `end_time` doit être après `start_time`
3. **IDs uniques** : Chaque ID doit être unique dans son tableau
4. **Noms cohérents** : Utilisez toujours la même orthographe pour un même cavalier/cheval
5. **Testez d'abord** : Importez d'abord un petit fichier pour tester
6. **Créneaux existants** : Les créneaux avec même date + même heure seront ignorés
7. **Sauvegardez** : Gardez une copie de votre base avant l'import

---

## Gestion des erreurs

Si l'import échoue partiellement :
- Les éléments créés avant l'erreur restent en base
- Consultez le tableau `errors` pour identifier les problèmes
- Corrigez le JSON et relancez l'import
- Les créneaux existants seront automatiquement ignorés
