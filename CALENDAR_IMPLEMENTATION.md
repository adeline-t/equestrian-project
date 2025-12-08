# Implémentation du Système de Calendrier - Documentation

## Vue d'ensemble

Cette Pull Request implémente un système complet de gestion de calendrier pour le centre équestre avec les fonctionnalités suivantes :

### ✅ Fonctionnalités Principales

1. **Cours Récurrents (Templates)**
   - Création de templates de cours avec règles de récurrence
   - Support de 5 types de cours : particulier, collectif, stage, concours, événement
   - Génération automatique des instances de cours
   - Participants pré-assignés dans les templates

2. **Plages Bloquées (Périodes de Repos)** 🆕
   - Création de plages horaires bloquées où aucun cours ne peut être réservé
   - Fonctionnent comme des cours récurrents mais avec 0 participant
   - Peuvent être annulées ponctuellement pour permettre des cours exceptionnels
   - Vérification automatique des conflits lors de la création de cours

3. **Indicateur de Cours Non Effectué** 🆕
   - Flag booléen `not_given_by_laury` pour marquer les cours non donnés
   - Champ `not_given_reason` pour documenter la raison
   - Timestamp `not_given_at` pour tracer la date de marquage
   - Endpoint dédié pour récupérer tous les cours non donnés

4. **Gestion des Participants**
   - Inscription/désinscription aux cours
   - Auto-assignation des chevaux via demi-pensions
   - Gestion manuelle des assignations
   - Validation des capacités maximales

5. **Génération Automatique**
   - Job cron quotidien (2h du matin)
   - Génération par fenêtre glissante (4 semaines)
   - Évite les conflits avec plages bloquées

## Structure des Fichiers

### Backend

```
backend/
├── src/
│   ├── handlers/
│   │   └── calendar.js              # Handler principal des routes calendrier
│   ├── repositories/
│   │   └── lesson-repository.js     # Repository pour accès aux données
│   ├── services/
│   │   └── lesson-generator.js      # Service de génération des cours
│   ├── cron/
│   │   └── generate-lessons.js      # Job cron pour génération automatique
│   └── index.js                     # Mise à jour avec routes calendrier
└── wrangler.toml.example            # Configuration avec cron trigger
```

### Database

```
database/
└── migrations/
    └── 20250115_create_calendar_system.sql  # Migration complète
```

## Schéma de Base de Données

### Tables Principales

1. **lesson_templates**
   - Templates de cours récurrents
   - Support du type 'blocked' pour plages bloquées
   - Règles de récurrence en JSONB

2. **lesson_instances**
   - Instances de cours réels
   - Champs `not_given_by_laury`, `not_given_reason`, `not_given_at`
   - Statut 'blocked' pour plages bloquées

3. **lesson_participants**
   - Participants inscrits aux cours
   - Contrainte empêchant les participants sur plages bloquées

4. **template_default_participants**
   - Participants pré-assignés dans templates

5. **lesson_type_rules**
   - Règles métier par type de cours
   - Règle spéciale pour type 'blocked'

### Fonctions SQL

- `check_blocked_periods()` - Vérifie les conflits avec plages bloquées
- `mark_lesson_not_given()` - Marque un cours comme non donné
- `calculate_end_time()` - Calcule l'heure de fin

### Vues

- `v_upcoming_lessons` - Cours à venir
- `v_active_blocked_periods` - Plages bloquées actives
- `v_lessons_not_given_by_laury` - Cours non donnés par Laury
- `v_lesson_statistics` - Statistiques des cours

## API Endpoints

### Templates

```
GET    /api/calendar/templates                    # Liste des templates
POST   /api/calendar/templates                    # Créer un template
GET    /api/calendar/templates/:id                # Détails d'un template
PUT    /api/calendar/templates/:id                # Modifier un template
DELETE /api/calendar/templates/:id                # Supprimer un template
GET    /api/calendar/templates/:id/participants   # Participants par défaut
POST   /api/calendar/templates/:id/generate       # Générer les instances
POST   /api/calendar/templates/:id/preview        # Prévisualiser occurrences
```

### Lessons (Instances)

```
GET    /api/calendar/lessons                      # Liste des cours
POST   /api/calendar/lessons                      # Créer un cours ponctuel
GET    /api/calendar/lessons/:id                  # Détails d'un cours
PUT    /api/calendar/lessons/:id                  # Modifier un cours
DELETE /api/calendar/lessons/:id                  # Annuler un cours
POST   /api/calendar/lessons/:id/mark-not-given   # Marquer comme non donné 🆕
```

### Participants

```
POST   /api/calendar/lessons/:id/participants                    # Ajouter participant
PUT    /api/calendar/lessons/:lessonId/participants/:participantId  # Modifier participant
DELETE /api/calendar/lessons/:lessonId/participants/:participantId  # Retirer participant
```

### Vues Calendrier

```
GET    /api/calendar/schedule/week               # Vue hebdomadaire
GET    /api/calendar/schedule/blocked-periods    # Plages bloquées 🆕
GET    /api/calendar/schedule/not-given          # Cours non donnés 🆕
POST   /api/calendar/schedule/check-availability # Vérifier disponibilité
```

### Génération

```
POST   /api/calendar/generate                    # Générer toutes les instances
```

## Exemples d'Utilisation

### 1. Créer une Plage Bloquée Récurrente

```bash
curl -X POST http://localhost:8787/api/calendar/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Repos hebdomadaire",
    "description": "Période de repos pour les chevaux",
    "lesson_type": "blocked",
    "start_time": "12:00",
    "duration_minutes": 120,
    "valid_from": "2024-01-01",
    "recurrence_rule": {
      "frequency": "weekly",
      "interval": 1,
      "byDay": ["sunday"],
      "startTime": "12:00",
      "duration": 120
    }
  }'
```

### 2. Annuler une Plage Bloquée Ponctuelle

```bash
# Pour permettre un cours exceptionnel
curl -X DELETE http://localhost:8787/api/calendar/lessons/123 \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Cours exceptionnel demandé"
  }'
```

### 3. Marquer un Cours comme Non Donné

```bash
curl -X POST http://localhost:8787/api/calendar/lessons/456/mark-not-given \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Laury malade"
  }'
```

### 4. Récupérer les Cours Non Donnés

```bash
curl "http://localhost:8787/api/calendar/schedule/not-given?start_date=2024-01-01&end_date=2024-12-31"
```

### 5. Vérifier Disponibilité (avec Plages Bloquées)

```bash
curl -X POST http://localhost:8787/api/calendar/schedule/check-availability \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "start_time": "14:00",
    "duration": 60
  }'
```

## Points d'Attention et Cas Limites

### 1. Plages Bloquées

**⚠️ Points d'attention :**
- Les plages bloquées empêchent TOUTE création de cours sur leur créneau
- Elles doivent être annulées explicitement pour permettre un cours exceptionnel
- La génération automatique respecte les plages bloquées
- Les participants ne peuvent pas être ajoutés aux plages bloquées (contrainte DB)

**Cas limites :**
- Que se passe-t-il si on essaie de créer un cours sur une plage bloquée ?
  → Erreur 409 avec détails de la plage bloquée
- Peut-on modifier une plage bloquée pour ajouter des participants ?
  → Non, contrainte de base de données l'empêche
- Que se passe-t-il si on annule une plage bloquée ?
  → Le créneau devient disponible pour d'autres cours

### 2. Cours Non Donnés

**⚠️ Points d'attention :**
- Le flag `not_given_by_laury` est indépendant du statut du cours
- Un cours peut être marqué comme non donné même s'il est "completed"
- Le timestamp `not_given_at` est automatiquement défini
- La raison est optionnelle mais recommandée pour traçabilité

**Cas limites :**
- Peut-on marquer un cours futur comme non donné ?
  → Oui, techniquement possible (à valider selon besoin métier)
- Peut-on "démarquer" un cours ?
  → Oui, en mettant `not_given_by_laury: false`
- Comment différencier un cours annulé d'un cours non donné ?
  → Status 'cancelled' vs flag `not_given_by_laury`

### 3. Génération Automatique

**⚠️ Points d'attention :**
- Le cron s'exécute à 2h du matin (configurable)
- Génère 4 semaines à l'avance
- Ignore les dates déjà générées
- Respecte les plages bloquées

**Cas limites :**
- Que se passe-t-il si le cron échoue ?
  → Logs dans Cloudflare, génération manuelle possible via API
- Les instances modifiées sont-elles régénérées ?
  → Non, le flag `is_modified` les protège
- Que se passe-t-il si on modifie un template ?
  → Seules les instances futures non modifiées sont affectées

### 4. Conflits et Validations

**⚠️ Points d'attention :**
- Vérification automatique des conflits avec plages bloquées
- Validation de la capacité maximale
- Validation des règles par type de cours
- Contraintes de base de données pour intégrité

**Cas limites :**
- Deux cours peuvent-ils se chevaucher ?
  → Oui, sauf si l'un est une plage bloquée
- Peut-on dépasser la capacité maximale ?
  → Non, validation côté API
- Que se passe-t-il si on supprime un cavalier inscrit ?
  → Cascade delete sur les participations

### 5. Performances

**⚠️ Points d'attention :**
- Index sur tous les champs de recherche fréquents
- Requêtes optimisées avec JOINs
- Pagination recommandée pour grandes listes
- Cache possible avec Cloudflare KV

**Cas limites :**
- Combien de cours peut-on générer d'un coup ?
  → Limité par timeout Cloudflare (30s en prod)
- Performance avec beaucoup de templates actifs ?
  → Index optimisés, mais monitoring recommandé
- Que se passe-t-il avec des milliers de cours ?
  → Pagination obligatoire, archivage des anciens cours

## Migration

### Étapes de Déploiement

1. **Backup de la base de données**
   ```bash
   pg_dump -h your-host -U postgres -d your-db > backup.sql
   ```

2. **Exécuter la migration**
   ```bash
   psql -h your-host -U postgres -d your-db < database/migrations/20250115_create_calendar_system.sql
   ```

3. **Vérifier la migration**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' AND table_name LIKE 'lesson_%';
   ```

4. **Déployer le backend**
   ```bash
   cd backend
   npm run deploy
   ```

5. **Tester les endpoints**
   ```bash
   curl https://your-worker.workers.dev/api/health
   ```

### Rollback

En cas de problème :

```sql
BEGIN;
DROP VIEW IF EXISTS v_lesson_statistics;
DROP VIEW IF EXISTS v_lessons_not_given_by_laury;
DROP VIEW IF EXISTS v_active_blocked_periods;
DROP VIEW IF EXISTS v_upcoming_lessons;
DROP TABLE IF EXISTS lesson_participants CASCADE;
DROP TABLE IF EXISTS template_default_participants CASCADE;
DROP TABLE IF EXISTS lesson_instances CASCADE;
DROP TABLE IF EXISTS lesson_type_rules CASCADE;
DROP TABLE IF EXISTS lesson_templates CASCADE;
DROP FUNCTION IF EXISTS check_blocked_periods;
DROP FUNCTION IF EXISTS mark_lesson_not_given;
DROP FUNCTION IF EXISTS calculate_end_time;
COMMIT;
```

## Tests Recommandés

### Tests Unitaires

1. **Génération de cours**
   - Vérifier calcul des occurrences
   - Tester différentes fréquences (daily, weekly, monthly)
   - Vérifier respect des plages bloquées

2. **Validation des règles**
   - Tester capacité maximale
   - Tester contraintes par type de cours
   - Vérifier empêchement participants sur plages bloquées

3. **Marquage cours non donnés**
   - Vérifier mise à jour des flags
   - Tester avec/sans raison
   - Vérifier timestamp automatique

### Tests d'Intégration

1. **Workflow complet**
   - Créer template → Générer instances → Ajouter participants
   - Créer plage bloquée → Tenter créer cours → Vérifier refus
   - Marquer cours non donné → Récupérer liste

2. **Cron job**
   - Tester génération automatique
   - Vérifier logs
   - Tester récupération après échec

### Tests de Performance

1. **Charge**
   - Générer 1000+ cours
   - Tester requêtes avec pagination
   - Mesurer temps de réponse

2. **Concurrence**
   - Inscriptions simultanées
   - Modifications concurrentes
   - Génération pendant utilisation

## Monitoring et Maintenance

### Logs à Surveiller

- Erreurs de génération automatique
- Conflits avec plages bloquées
- Échecs d'inscription (capacité)
- Performances des requêtes

### Maintenance Régulière

```sql
-- Nettoyer les cours très anciens (> 1 an)
DELETE FROM lesson_instances 
WHERE lesson_date < CURRENT_DATE - INTERVAL '1 year' 
AND status = 'completed';

-- Statistiques mensuelles
SELECT * FROM v_lesson_statistics 
WHERE month >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 months');

-- Cours non donnés récents
SELECT * FROM v_lessons_not_given_by_laury 
WHERE lesson_date >= CURRENT_DATE - INTERVAL '1 month';
```

## Prochaines Étapes Possibles

1. **Frontend**
   - Vue calendrier hebdomadaire
   - Interface de gestion des templates
   - Gestion des plages bloquées
   - Indicateur visuel des cours non donnés

2. **Notifications**
   - Email pour cours annulés
   - Rappels de cours
   - Alertes plages bloquées

3. **Statistiques**
   - Dashboard de fréquentation
   - Taux de cours non donnés
   - Utilisation des plages horaires

4. **Optimisations**
   - Cache avec Cloudflare KV
   - Pagination améliorée
   - Export PDF/Excel

## Support

Pour toute question ou problème :
- Consulter la documentation complète dans `/docs`
- Vérifier les logs Cloudflare
- Tester avec les exemples fournis
- Contacter l'équipe de développement

---

**Version:** 1.1.0  
**Date:** 2025-01-15  
**Auteur:** SuperNinja AI