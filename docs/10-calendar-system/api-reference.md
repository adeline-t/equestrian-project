# API Reference - Système de Calendrier

Documentation complète des endpoints API du système de calendrier.

## Base URL

```
Production: https://your-worker.workers.dev/api/calendar
Development: http://localhost:8787/api/calendar
```

## Table des Matières

1. [Templates](#templates)
2. [Lessons](#lessons)
3. [Participants](#participants)
4. [Schedule](#schedule)
5. [Generation](#generation)

---

## Templates

Gestion des templates de cours récurrents et plages bloquées.

### GET /templates

Liste tous les templates.

**Query Parameters:**
- `active` (boolean, optional): Filtrer par statut actif/inactif
- `lesson_type` (string, optional): Filtrer par type de cours
- `exclude_blocked` (boolean, optional): Exclure les plages bloquées

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Cours collectif débutants - Lundi soir",
      "description": "Cours collectif pour cavaliers débutants",
      "lesson_type": "group",
      "recurrence_rule": {
        "frequency": "weekly",
        "interval": 1,
        "byDay": ["monday"],
        "startTime": "19:00",
        "duration": 60
      },
      "start_time": "19:00:00",
      "duration_minutes": 60,
      "valid_from": "2024-01-01",
      "valid_until": null,
      "max_participants": 8,
      "min_participants": 2,
      "is_active": true,
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### POST /templates

Créer un nouveau template.

**Request Body:**
```json
{
  "name": "Cours particulier Nathalie - Mercredi",
  "description": "Cours particulier avec Nathalie sur Bounty",
  "lesson_type": "private",
  "recurrence_rule": {
    "frequency": "weekly",
    "interval": 1,
    "byDay": ["wednesday"],
    "startTime": "13:00",
    "duration": 45
  },
  "start_time": "13:00",
  "duration_minutes": 45,
  "valid_from": "2024-01-01",
  "valid_until": null,
  "max_participants": 1,
  "min_participants": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "name": "Cours particulier Nathalie - Mercredi",
    "lesson_type": "private",
    "created_at": "2024-01-15T14:30:00Z"
  },
  "message": "Template créé avec succès. Les cours ont été générés pour les 4 prochaines semaines."
}
```

### GET /templates/:id

Récupérer un template spécifique.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Cours collectif débutants - Lundi soir",
    "description": "Cours collectif pour cavaliers débutants",
    "lesson_type": "group",
    "recurrence_rule": {...},
    "start_time": "19:00:00",
    "duration_minutes": 60,
    "valid_from": "2024-01-01",
    "valid_until": null,
    "max_participants": 8,
    "min_participants": 2,
    "is_active": true
  }
}
```

### PUT /templates/:id

Mettre à jour un template.

**Request Body:**
```json
{
  "name": "Cours collectif débutants - Lundi soir (MODIFIÉ)",
  "start_time": "19:30",
  "max_participants": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "updated_at": "2024-01-15T15:00:00Z"
  },
  "message": "Template mis à jour avec succès"
}
```

### DELETE /templates/:id

Supprimer un template.

**Query Parameters:**
- `delete_future_instances` (boolean, optional): Supprimer aussi les instances futures

**Response:**
```json
{
  "success": true,
  "message": "Template supprimé avec succès"
}
```

### GET /templates/:id/participants

Récupérer les participants par défaut d'un template.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "rider_id": 5,
      "rider_name": "Nathalie Dubois",
      "rider_email": "nathalie@example.com",
      "horse_id": 12,
      "horse_name": "Bounty",
      "auto_assign_horse": false,
      "priority_order": 1
    }
  ]
}
```

### POST /templates/:id/generate

Générer manuellement les instances pour un template.

**Request Body:**
```json
{
  "start_date": "2024-01-15",
  "end_date": "2024-02-15"
}
```

**Response:**
```json
{
  "success": true,
  "generated": 8,
  "skipped": 2,
  "details": [
    {
      "date": "2024-01-15",
      "created": true
    },
    {
      "date": "2024-01-22",
      "created": true
    }
  ],
  "message": "8 cours générés, 2 ignorés"
}
```

### POST /templates/:id/preview

Prévisualiser les occurrences d'un template.

**Request Body:**
```json
{
  "start_date": "2024-01-01",
  "end_date": "2024-03-31"
}
```

**Response:**
```json
{
  "success": true,
  "occurrences": [
    {
      "date": "2024-01-08",
      "start_time": "19:00",
      "day_name": "Lundi"
    },
    {
      "date": "2024-01-15",
      "start_time": "19:00",
      "day_name": "Lundi"
    }
  ],
  "total": 12
}
```

---

## Lessons

Gestion des instances de cours (cours réels).

### GET /lessons

Liste les cours dans une plage de dates.

**Query Parameters:**
- `start_date` (string, required): Date de début (YYYY-MM-DD)
- `end_date` (string, required): Date de fin (YYYY-MM-DD)
- `lesson_type` (string, optional): Filtrer par type
- `status` (string, optional): Filtrer par statut
- `exclude_blocked` (boolean, optional): Exclure les plages bloquées

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "template_id": 1,
      "template_name": "Cours collectif débutants - Lundi soir",
      "name": "Cours collectif débutants - Lundi soir",
      "lesson_type": "group",
      "lesson_date": "2024-01-15",
      "start_time": "19:00:00",
      "end_time": "20:00:00",
      "status": "scheduled",
      "max_participants": 8,
      "participant_count": 6,
      "is_modified": false,
      "not_given_by_laury": false
    }
  ]
}
```

### GET /lessons/:id

Récupérer les détails d'un cours avec participants.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 101,
    "template_id": 1,
    "name": "Cours collectif débutants - Lundi soir",
    "description": "Cours collectif pour cavaliers débutants",
    "lesson_type": "group",
    "lesson_date": "2024-01-15",
    "start_time": "19:00:00",
    "end_time": "20:00:00",
    "status": "scheduled",
    "max_participants": 8,
    "is_modified": false,
    "not_given_by_laury": false,
    "participants": [
      {
        "id": 1,
        "rider_id": 5,
        "rider_name": "Sophie Martin",
        "rider_email": "sophie@example.com",
        "horse_id": 8,
        "horse_name": "Luna",
        "horse_kind": "horse",
        "horse_assignment_type": "auto",
        "participation_status": "confirmed",
        "registered_at": "2024-01-01T10:00:00Z"
      }
    ]
  }
}
```

### POST /lessons

Créer un cours ponctuel (non récurrent).

**Request Body:**
```json
{
  "name": "Stage d'été - Saut d'obstacles",
  "description": "Stage intensif de 3 jours",
  "lesson_type": "training",
  "lesson_date": "2024-07-15",
  "start_time": "09:00",
  "duration_minutes": 180,
  "max_participants": 12
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 250,
    "name": "Stage d'été - Saut d'obstacles",
    "lesson_date": "2024-07-15",
    "status": "scheduled"
  },
  "message": "Cours créé avec succès"
}
```

### PUT /lessons/:id

Modifier un cours.

**Request Body:**
```json
{
  "start_time": "19:30",
  "max_participants": 10
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 101,
    "is_modified": true,
    "updated_at": "2024-01-15T16:00:00Z"
  },
  "message": "Cours mis à jour avec succès"
}
```

### DELETE /lessons/:id

Annuler un cours.

**Request Body:**
```json
{
  "reason": "Instructeur malade"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 101,
    "status": "cancelled",
    "cancellation_reason": "Instructeur malade"
  },
  "message": "Cours annulé avec succès"
}
```

### POST /lessons/:id/mark-not-given

Marquer un cours comme non donné par Laury.

**Request Body:**
```json
{
  "reason": "Laury en formation"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 101,
    "not_given_by_laury": true,
    "not_given_reason": "Laury en formation",
    "not_given_at": "2024-01-15T17:00:00Z"
  },
  "message": "Cours marqué comme non donné par Laury"
}
```

---

## Participants

Gestion des participants aux cours.

### POST /lessons/:id/participants

Ajouter un participant à un cours.

**Request Body:**
```json
{
  "rider_id": 7,
  "horse_id": null,
  "horse_assignment_type": "auto",
  "notes": "Première participation"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 50,
    "rider_id": 7,
    "rider_name": "Marc Lefebvre",
    "horse_id": 15,
    "horse_name": "Tornado",
    "horse_assignment_type": "auto",
    "participation_status": "registered"
  },
  "message": "Participant ajouté avec succès"
}
```

### PUT /lessons/:lessonId/participants/:participantId

Modifier un participant.

**Request Body:**
```json
{
  "horse_id": 20,
  "horse_assignment_type": "manual",
  "participation_status": "confirmed"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 50,
    "horse_id": 20,
    "horse_name": "Spirit",
    "horse_assignment_type": "manual",
    "updated_at": "2024-01-15T17:00:00Z"
  },
  "message": "Participant mis à jour avec succès"
}
```

### DELETE /lessons/:lessonId/participants/:participantId

Retirer un participant d'un cours.

**Response:**
```json
{
  "success": true,
  "message": "Participant retiré avec succès"
}
```

---

## Schedule

Vues calendrier et disponibilités.

### GET /schedule/week

Récupérer la vue hebdomadaire du calendrier.

**Query Parameters:**
- `date` (string, optional): Date de référence (YYYY-MM-DD), défaut: aujourd'hui
- `exclude_blocked` (boolean, optional): Exclure les plages bloquées

**Response:**
```json
{
  "success": true,
  "period": {
    "start": "2024-01-15",
    "end": "2024-01-21"
  },
  "days": [
    {
      "date": "2024-01-15",
      "day_name": "Lundi",
      "lessons": [
        {
          "id": 101,
          "name": "Cours collectif débutants",
          "lesson_type": "group",
          "start_time": "19:00:00",
          "end_time": "20:00:00",
          "status": "scheduled",
          "participant_count": 6,
          "max_participants": 8
        }
      ]
    }
  ],
  "statistics": {
    "total_lessons": 12,
    "total_participants": 45,
    "blocked_periods": 1
  }
}
```

### GET /schedule/blocked-periods

Récupérer les plages bloquées actives.

**Query Parameters:**
- `start_date` (string, optional): Date de début
- `end_date` (string, optional): Date de fin

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 201,
      "name": "Repos hebdomadaire",
      "description": "Période de repos pour les chevaux",
      "lesson_date": "2024-01-21",
      "start_time": "12:00:00",
      "end_time": "14:00:00",
      "template_id": 5,
      "template_name": "Repos hebdomadaire"
    }
  ]
}
```

### GET /schedule/not-given

Récupérer les cours non donnés par Laury.

**Query Parameters:**
- `start_date` (string, optional): Date de début
- `end_date` (string, optional): Date de fin

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 105,
      "name": "Cours collectif débutants",
      "lesson_date": "2024-01-10",
      "start_time": "19:00:00",
      "not_given_reason": "Laury malade",
      "not_given_at": "2024-01-10T20:00:00Z",
      "participant_count": 6
    }
  ]
}
```

### POST /schedule/check-availability

Vérifier la disponibilité pour un créneau.

**Request Body:**
```json
{
  "date": "2024-01-15",
  "start_time": "14:00",
  "duration": 60
}
```

**Response:**
```json
{
  "success": true,
  "available": false,
  "conflicts": {
    "blocked_periods": [
      {
        "blocked_instance_id": 201,
        "blocked_name": "Repos hebdomadaire",
        "blocked_start": "12:00:00",
        "blocked_end": "16:00:00"
      }
    ]
  }
}
```

---

## Generation

Génération automatique des cours.

### POST /generate

Générer toutes les instances de cours.

**Request Body:**
```json
{
  "weeks_ahead": 4
}
```

**Response:**
```json
{
  "success": true,
  "total_generated": 28,
  "total_skipped": 5,
  "results": [
    {
      "template_id": 1,
      "generated": 4,
      "skipped": 0
    },
    {
      "template_id": 2,
      "generated": 8,
      "skipped": 2,
      "details": [
        {
          "date": "2024-01-15",
          "created": true
        },
        {
          "date": "2024-01-22",
          "reason": "blocked_period",
          "blocked_by": "Repos hebdomadaire"
        }
      ]
    }
  ],
  "message": "28 cours générés pour les 4 prochaines semaines"
}
```

---

## Codes d'Erreur

### Codes HTTP

- `200` - Succès
- `201` - Créé avec succès
- `400` - Requête invalide
- `404` - Ressource non trouvée
- `409` - Conflit (ex: plage bloquée)
- `500` - Erreur serveur

### Format d'Erreur

```json
{
  "success": false,
  "error": "Message d'erreur principal",
  "details": {
    "field": "nom_du_champ",
    "message": "Détails supplémentaires"
  }
}
```

### Erreurs Courantes

**Conflit avec plage bloquée (409):**
```json
{
  "success": false,
  "error": "Conflit avec une plage bloquée",
  "blocked_by": {
    "blocked_instance_id": 201,
    "blocked_name": "Repos hebdomadaire",
    "blocked_start": "12:00:00",
    "blocked_end": "16:00:00"
  }
}
```

**Capacité maximale atteinte (400):**
```json
{
  "success": false,
  "error": "Capacité maximale atteinte"
}
```

**Template non trouvé (404):**
```json
{
  "success": false,
  "error": "Template not found"
}
```

---

## Exemples d'Utilisation

### Workflow Complet

```bash
# 1. Créer un template
TEMPLATE_ID=$(curl -X POST http://localhost:8787/api/calendar/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cours test",
    "lesson_type": "group",
    "start_time": "10:00",
    "duration_minutes": 60,
    "valid_from": "2024-01-01",
    "max_participants": 5,
    "recurrence_rule": {
      "frequency": "weekly",
      "interval": 1,
      "byDay": ["monday"]
    }
  }' | jq -r '.data.id')

# 2. Générer les instances
curl -X POST http://localhost:8787/api/calendar/templates/$TEMPLATE_ID/generate \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2024-01-01",
    "end_date": "2024-01-31"
  }'

# 3. Récupérer les cours générés
curl "http://localhost:8787/api/calendar/lessons?start_date=2024-01-01&end_date=2024-01-31"

# 4. Ajouter un participant
LESSON_ID=101
curl -X POST http://localhost:8787/api/calendar/lessons/$LESSON_ID/participants \
  -H "Content-Type: application/json" \
  -d '{
    "rider_id": 5,
    "horse_id": null,
    "horse_assignment_type": "auto"
  }'

# 5. Marquer comme non donné
curl -X POST http://localhost:8787/api/calendar/lessons/$LESSON_ID/mark-not-given \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Test"
  }'
```

---

**Version:** 1.0.0  
**Dernière mise à jour:** 2025-01-15