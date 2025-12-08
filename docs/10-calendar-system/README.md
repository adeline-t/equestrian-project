# Système de Calendrier - Documentation Complète

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Fonctionnalités](#fonctionnalités)
4. [Guide d'utilisation](#guide-dutilisation)
5. [Configuration](#configuration)
6. [Maintenance](#maintenance)

---

## Vue d'ensemble

Le système de calendrier permet de gérer l'ensemble des cours du centre équestre avec :

- **Cours récurrents** : Création de templates avec règles de récurrence
- **Plages bloquées** : Périodes de repos où aucun cours ne peut être réservé
- **Gestion des participants** : Inscription automatique ou manuelle
- **Suivi des cours** : Indicateur pour les cours non donnés par Laury
- **Génération automatique** : Job cron pour maintenir le calendrier à jour

### Objectifs

- Simplifier la planification des cours
- Automatiser les tâches répétitives
- Assurer la disponibilité des chevaux
- Faciliter le suivi des cours

---

## Architecture

### Architecture Technique

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
├─────────────────────────────────────────────────────────────┤
│  CalendarView → WeekView → DayColumn → LessonCard          │
│  LessonModal | TemplateModal                                │
│  calendarApi.js (API Client)                                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Cloudflare Workers)               │
├─────────────────────────────────────────────────────────────┤
│  handlers/calendar.js → 22 endpoints API                    │
│  repositories/lesson-repository.js → Accès données          │
│  services/lesson-generator.js → Génération cours            │
│  cron/generate-lessons.js → Job automatique                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Database (PostgreSQL)                      │
├─────────────────────────────────────────────────────────────┤
│  lesson_templates → Templates de cours récurrents           │
│  lesson_instances → Cours réels dans le calendrier          │
│  lesson_participants → Participants inscrits                │
│  template_default_participants → Participants pré-assignés  │
│  lesson_type_rules → Règles métier par type                │
└─────────────────────────────────────────────────────────────┘
```

### Modèle de Données

#### Tables Principales

**lesson_templates**
- Définit les cours récurrents et plages bloquées
- Contient les règles de récurrence (JSONB)
- Peut avoir des participants pré-assignés

**lesson_instances**
- Cours réels générés à partir des templates
- Peut être modifié individuellement
- Contient le flag `not_given_by_laury`

**lesson_participants**
- Lie les cavaliers aux cours
- Gère l'assignation des chevaux (auto/manuel)
- Suit le statut de participation

### Patterns de Conception

1. **Template Pattern** : Séparation template/instance pour flexibilité
2. **Repository Pattern** : Abstraction de l'accès aux données
3. **Service Layer** : Logique métier isolée
4. **Observer Pattern** : Notifications (à implémenter)

---

## Fonctionnalités

### 1. Cours Récurrents

#### Création d'un Template

Les templates définissent des cours qui se répètent selon une règle :

**Types de cours disponibles :**
- 👤 **Cours Particulier** : 1 cavalier maximum
- 👥 **Cours Collectif** : 2-8 cavaliers
- 🎓 **Stage** : Événement ponctuel de plusieurs heures
- 🏆 **Concours** : Compétition
- 🎉 **Événement** : Événement spécial
- 🚫 **Plage Bloquée** : Période de repos (0 participant)

**Règles de récurrence :**
- **Quotidien** : Tous les X jours
- **Hebdomadaire** : Certains jours de la semaine
- **Mensuel** : Tous les X mois

**Exemple :**
```json
{
  "name": "Cours collectif débutants - Lundi soir",
  "lesson_type": "group",
  "start_time": "19:00",
  "duration_minutes": 60,
  "recurrence_rule": {
    "frequency": "weekly",
    "interval": 1,
    "byDay": ["monday"],
    "startTime": "19:00",
    "duration": 60
  },
  "max_participants": 8,
  "min_participants": 2
}
```

#### Génération des Instances

Les instances de cours sont générées automatiquement :
- **Fenêtre glissante** : 4 semaines à l'avance
- **Job cron quotidien** : Maintient la fenêtre
- **Respect des plages bloquées** : Aucun cours généré sur plages bloquées
- **Protection des modifications** : Les cours modifiés ne sont pas régénérés

### 2. Plages Bloquées (Périodes de Repos)

#### Objectif

Empêcher toute réservation de cours pendant certaines périodes :
- Repos des chevaux
- Maintenance des installations
- Vacances
- Événements spéciaux

#### Caractéristiques

- ✅ Fonctionnent comme des cours récurrents
- ✅ 0 participant (contrainte DB)
- ✅ Empêchent la création de cours sur leur créneau
- ✅ Peuvent être annulées ponctuellement pour cours exceptionnels
- ✅ Vérification automatique des conflits

#### Création d'une Plage Bloquée

**Via l'interface :**
1. Cliquer sur "Nouveau Template"
2. Sélectionner "🚫 Plage Bloquée"
3. Définir l'horaire et la récurrence
4. Enregistrer

**Via l'API :**
```bash
curl -X POST http://localhost:8787/api/calendar/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Repos hebdomadaire",
    "lesson_type": "blocked",
    "start_time": "12:00",
    "duration_minutes": 120,
    "valid_from": "2024-01-01",
    "recurrence_rule": {
      "frequency": "weekly",
      "interval": 1,
      "byDay": ["sunday"]
    }
  }'
```

#### Gestion des Exceptions

Pour permettre un cours exceptionnel sur une plage bloquée :

1. **Annuler la plage bloquée spécifique** :
   - Ouvrir le cours bloqué dans le calendrier
   - Cliquer sur "Annuler le cours"
   - Le créneau devient disponible

2. **Créer le cours exceptionnel** :
   - Le système vérifie qu'il n'y a plus de conflit
   - Le cours peut être créé normalement

### 3. Indicateur de Cours Non Donné

#### Objectif

Suivre les cours qui n'ont pas été donnés par Laury pour :
- Reporting
- Facturation
- Statistiques
- Suivi de la qualité

#### Utilisation

**Marquer un cours comme non donné :**

1. **Via l'interface** :
   - Ouvrir le cours dans le calendrier
   - Cliquer sur "⚠️ Marquer comme non donné"
   - Saisir la raison (optionnel)
   - Confirmer

2. **Via l'API** :
```bash
curl -X POST http://localhost:8787/api/calendar/lessons/123/mark-not-given \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Laury malade"
  }'
```

**Récupérer les cours non donnés :**

```bash
curl "http://localhost:8787/api/calendar/schedule/not-given?start_date=2024-01-01&end_date=2024-12-31"
```

#### Informations Enregistrées

- `not_given_by_laury` : Boolean (true/false)
- `not_given_reason` : Texte libre (optionnel)
- `not_given_at` : Timestamp automatique

### 4. Gestion des Participants

#### Auto-assignation des Chevaux

Le système assigne automatiquement les chevaux via les demi-pensions :

1. **Lors de la création d'un cours** :
   - Les participants pré-assignés du template sont ajoutés
   - Si le cavalier a une DP active, le cheval est assigné automatiquement

2. **Lors de l'ajout d'un participant** :
   - Le système cherche une DP active pour la date du cours
   - Si trouvée, le cheval est assigné automatiquement
   - Sinon, assignation manuelle possible

#### Assignation Manuelle

Possible dans tous les cas :
- Modifier l'assignation automatique
- Assigner un cheval différent
- Retirer l'assignation

### 5. Vue Calendrier

#### Affichage Hebdomadaire

- **7 colonnes** : Une par jour de la semaine
- **Grille horaire** : 8h-22h par défaut
- **Cartes de cours** : Couleur par type, badges de statut
- **Indicateurs visuels** :
  - 🚫 Plages bloquées (gris)
  - ⚠️ Cours non donnés (orange)
  - ✏️ Cours modifiés (bordure pointillée)
  - Occupation (bordure épaisse si presque plein)

#### Filtres

- **Type de cours** : Tous, particulier, collectif, etc.
- **Statut** : Tous, planifiés, confirmés, terminés, annulés
- **Afficher plages bloquées** : Oui/Non

#### Navigation

- **Semaine précédente / suivante**
- **Aujourd'hui** : Retour à la semaine actuelle
- **Statistiques** : Nombre de cours, participants, plages bloquées

---

## Guide d'utilisation

### Workflow Typique

#### 1. Configuration Initiale

1. **Créer les templates de cours récurrents** :
   - Cours collectifs hebdomadaires
   - Cours particuliers réguliers
   - Plages bloquées (repos)

2. **Définir les participants par défaut** :
   - Cavaliers inscrits à l'année
   - Assignation automatique des chevaux

3. **Lancer la génération initiale** :
   - Le cron génère automatiquement 4 semaines
   - Ou génération manuelle via l'API

#### 2. Utilisation Quotidienne

1. **Consulter le calendrier** :
   - Vue hebdomadaire
   - Vérifier les cours du jour

2. **Gérer les inscriptions** :
   - Ajouter/retirer des participants
   - Modifier les assignations de chevaux

3. **Gérer les imprévus** :
   - Annuler un cours
   - Marquer comme non donné
   - Créer un cours exceptionnel

#### 3. Gestion des Exceptions

**Cours exceptionnel sur plage bloquée :**
1. Annuler la plage bloquée spécifique
2. Créer le cours exceptionnel
3. La plage bloquée reste active pour les autres occurrences

**Modification ponctuelle d'un cours :**
1. Ouvrir le cours
2. Modifier les détails (horaire, participants, etc.)
3. Le cours est marqué comme "modifié"
4. Il ne sera plus régénéré automatiquement

**Annulation d'un cours :**
1. Ouvrir le cours
2. Cliquer sur "Annuler"
3. Saisir la raison
4. Les participants sont notifiés (à implémenter)

### Exemples d'Utilisation

#### Créer un Template de Cours Collectif

```javascript
// Via l'API
const template = {
  name: "Cours collectif débutants - Mercredi",
  description: "Cours pour cavaliers débutants",
  lesson_type: "group",
  start_time: "18:00",
  duration_minutes: 60,
  valid_from: "2024-01-01",
  max_participants: 8,
  min_participants: 2,
  recurrence_rule: {
    frequency: "weekly",
    interval: 1,
    byDay: ["wednesday"],
    startTime: "18:00",
    duration: 60
  }
};

await templatesApi.create(template);
```

#### Créer une Plage Bloquée Récurrente

```javascript
const blockedPeriod = {
  name: "Repos dominical",
  description: "Repos hebdomadaire des chevaux",
  lesson_type: "blocked",
  start_time: "00:00",
  duration_minutes: 1440, // 24 heures
  valid_from: "2024-01-01",
  recurrence_rule: {
    frequency: "weekly",
    interval: 1,
    byDay: ["sunday"]
  }
};

await templatesApi.create(blockedPeriod);
```

#### Ajouter un Participant à un Cours

```javascript
const participant = {
  rider_id: 5,
  horse_id: null, // Auto-assignation via DP
  horse_assignment_type: "auto"
};

await lessonsApi.addParticipant(lessonId, participant);
```

#### Marquer un Cours comme Non Donné

```javascript
await lessonsApi.markNotGiven(lessonId, "Laury en formation");
```

---

## Configuration

### Variables d'Environnement

**Backend (Cloudflare Workers)**

```toml
# wrangler.toml
[triggers]
crons = ["0 2 * * *"]  # Tous les jours à 2h du matin

[env.prod]
vars = {
  ENVIRONMENT = "production",
  SUPABASE_URL = "https://your-project.supabase.co"
}
```

**Frontend (React)**

```env
# .env
VITE_API_URL=https://your-worker.workers.dev/api
```

### Configuration du Cron

Voir la documentation dédiée : [Configuration du Cron](./cron-configuration.md)

### Règles Métier

Les règles par type de cours sont configurables dans la table `lesson_type_rules` :

```sql
-- Exemple : Modifier la capacité des cours collectifs
UPDATE lesson_type_rules
SET rules = jsonb_set(rules, '{maxParticipants}', '10')
WHERE lesson_type = 'group';
```

---

## Maintenance

### Tâches Régulières

#### Quotidien (Automatique)

- ✅ Génération des cours (via cron)
- ✅ Vérification des plages bloquées
- ✅ Mise à jour des assignations de chevaux

#### Hebdomadaire (Manuel)

- Vérifier les cours non donnés
- Contrôler les statistiques
- Vérifier les logs du cron

#### Mensuel (Manuel)

- Archiver les cours anciens (> 1 an)
- Analyser les statistiques
- Optimiser les performances

### Commandes Utiles

#### Vérifier le Statut du Cron

```bash
# Cloudflare Dashboard
wrangler tail --format pretty

# Logs du cron
wrangler tail --format json | grep "Cron trigger"
```

#### Générer Manuellement les Cours

```bash
curl -X POST https://your-worker.workers.dev/api/calendar/generate \
  -H "Content-Type: application/json" \
  -d '{"weeks_ahead": 4}'
```

#### Nettoyer les Cours Anciens

```sql
-- Supprimer les cours terminés de plus d'1 an
DELETE FROM lesson_instances
WHERE lesson_date < CURRENT_DATE - INTERVAL '1 year'
AND status = 'completed';
```

#### Statistiques

```sql
-- Cours par type ce mois-ci
SELECT lesson_type, COUNT(*) as count
FROM lesson_instances
WHERE lesson_date >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY lesson_type;

-- Cours non donnés ce mois-ci
SELECT COUNT(*) as not_given_count
FROM lesson_instances
WHERE not_given_by_laury = TRUE
AND lesson_date >= DATE_TRUNC('month', CURRENT_DATE);

-- Plages bloquées actives
SELECT * FROM v_active_blocked_periods
WHERE lesson_date >= CURRENT_DATE
ORDER BY lesson_date, start_time;
```

### Troubleshooting

#### Problème : Le cron ne génère pas les cours

**Diagnostic :**
```bash
# Vérifier les logs
wrangler tail --format pretty

# Vérifier la configuration
cat wrangler.toml | grep crons
```

**Solutions :**
1. Vérifier que le cron est activé dans wrangler.toml
2. Vérifier les logs d'erreur
3. Générer manuellement pour tester
4. Vérifier les permissions de la base de données

#### Problème : Conflit avec plage bloquée

**Diagnostic :**
```bash
# Vérifier les plages bloquées
curl "http://localhost:8787/api/calendar/schedule/blocked-periods?start_date=2024-01-01&end_date=2024-12-31"
```

**Solutions :**
1. Annuler la plage bloquée spécifique
2. Modifier l'horaire du cours
3. Vérifier la règle de récurrence de la plage bloquée

#### Problème : Cheval non assigné automatiquement

**Diagnostic :**
```sql
-- Vérifier les demi-pensions actives
SELECT * FROM rider_horse_pairings
WHERE rider_id = ?
AND (pairing_end_date IS NULL OR pairing_end_date >= CURRENT_DATE);
```

**Solutions :**
1. Vérifier qu'une DP est active pour la date du cours
2. Vérifier les dates de validité de la DP
3. Assigner manuellement si nécessaire

---

## Ressources

### Documentation Complémentaire

- [Configuration du Cron](./cron-configuration.md)
- [API Reference](./api-reference.md)
- [Guide de Migration](../../CALENDAR_IMPLEMENTATION.md)

### Support

Pour toute question ou problème :
1. Consulter cette documentation
2. Vérifier les logs Cloudflare
3. Tester avec les exemples fournis
4. Contacter l'équipe de développement

---

**Version:** 1.1.0  
**Dernière mise à jour:** 2025-01-15