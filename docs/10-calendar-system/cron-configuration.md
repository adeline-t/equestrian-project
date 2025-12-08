# Configuration et Utilisation du Cron - Génération Automatique des Cours

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Installation et Configuration](#installation-et-configuration)
3. [Fonctionnement](#fonctionnement)
4. [Tests et Vérification](#tests-et-vérification)
5. [Monitoring](#monitoring)
6. [Troubleshooting](#troubleshooting)

---

## Vue d'ensemble

### Objectif

Le système de cron génère automatiquement les instances de cours à partir des templates récurrents, maintenant une fenêtre glissante de 4 semaines à l'avance.

### Avantages

- ✅ **Automatisation complète** : Aucune intervention manuelle nécessaire
- ✅ **Fenêtre glissante** : Toujours 4 semaines de cours disponibles
- ✅ **Respect des contraintes** : Évite les plages bloquées automatiquement
- ✅ **Performance** : Exécution quotidienne en arrière-plan
- ✅ **Fiabilité** : Gestion des erreurs et logs détaillés

### Principe de Fonctionnement

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Cron Trigger                   │
│                  Tous les jours à 2h du matin                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              backend/src/cron/generate-lessons.js            │
│                                                               │
│  1. Récupérer tous les templates actifs                     │
│  2. Pour chaque template :                                   │
│     - Calculer les occurrences (4 semaines)                 │
│     - Vérifier les instances existantes                     │
│     - Vérifier les conflits avec plages bloquées            │
│     - Créer les nouvelles instances                         │
│     - Ajouter les participants par défaut                   │
│  3. Logger les résultats                                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Base de Données                           │
│                                                               │
│  Nouvelles instances créées dans lesson_instances           │
│  Participants ajoutés dans lesson_participants              │
└─────────────────────────────────────────────────────────────┘
```

---

## Installation et Configuration

### Étape 1 : Configuration de wrangler.toml

Le fichier `wrangler.toml` doit contenir la configuration du cron trigger.

**Fichier : `backend/wrangler.toml`**

```toml
name = "equestrian-api"
main = "src/index.js"
compatibility_date = "2024-01-01"

# ============================================
# CRON TRIGGERS
# ============================================
[triggers]
crons = ["0 2 * * *"]  # Tous les jours à 2h du matin (UTC)

# Pour tester plus fréquemment en développement :
# crons = ["*/15 * * * *"]  # Toutes les 15 minutes

# Environnement de développement
[env.dev]
name = "equestrian-api-dev"
vars = { 
  ENVIRONMENT = "development",
  SUPABASE_URL = "https://your-dev-project.supabase.co"
}

# Environnement de production
[env.prod]
name = "equestrian-api-prod"
vars = { 
  ENVIRONMENT = "production",
  SUPABASE_URL = "https://your-prod-project.supabase.co"
}
```

### Étape 2 : Vérifier le Code du Cron

Le handler du cron est déjà implémenté dans `backend/src/index.js` :

```javascript
export default {
  async fetch(request, env, ctx) {
    // ... handlers HTTP
  },

  // Handler pour le cron trigger
  async scheduled(event, env, ctx) {
    console.log('Cron trigger fired:', event.cron);
    
    try {
      const result = await scheduledGenerateLessons(env);
      console.log('Cron job completed:', result);
    } catch (error) {
      console.error('Cron job failed:', error);
    }
  },
};
```

### Étape 3 : Déployer sur Cloudflare

```bash
# Se placer dans le dossier backend
cd backend

# Déployer en production
npm run deploy

# Ou déployer en développement
wrangler deploy --env dev
```

### Étape 4 : Vérifier le Déploiement

```bash
# Vérifier que le cron est actif
wrangler deployments list

# Vérifier les cron triggers configurés
wrangler triggers list
```

---

## Fonctionnement

### Fréquence d'Exécution Recommandée

**Production : `0 2 * * *` (Tous les jours à 2h du matin UTC)**

Pourquoi 2h du matin ?
- ✅ Faible trafic utilisateur
- ✅ Temps suffisant avant l'ouverture du centre
- ✅ Évite les conflits avec les opérations manuelles
- ✅ Logs disponibles pour vérification matinale

**Développement : `*/15 * * * *` (Toutes les 15 minutes)**

Pour tester rapidement :
- ✅ Feedback immédiat
- ✅ Tests itératifs
- ⚠️ À ne pas utiliser en production (charge inutile)

### Format Cron

Le format utilisé est le standard cron Unix :

```
┌───────────── minute (0 - 59)
│ ┌───────────── heure (0 - 23)
│ │ ┌───────────── jour du mois (1 - 31)
│ │ │ ┌───────────── mois (1 - 12)
│ │ │ │ ┌───────────── jour de la semaine (0 - 6) (Dimanche = 0)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

**Exemples :**

```toml
# Tous les jours à 2h du matin
crons = ["0 2 * * *"]

# Tous les jours à 2h et 14h
crons = ["0 2,14 * * *"]

# Du lundi au vendredi à 2h
crons = ["0 2 * * 1-5"]

# Toutes les heures
crons = ["0 * * * *"]

# Toutes les 30 minutes
crons = ["*/30 * * * *"]

# Le 1er de chaque mois à 3h
crons = ["0 3 1 * *"]
```

### Algorithme de Génération

```javascript
// Pseudo-code simplifié
async function generateLessons() {
  // 1. Définir la fenêtre de génération
  const today = new Date();
  const endDate = addWeeks(today, 4); // +4 semaines
  
  // 2. Récupérer tous les templates actifs
  const templates = await getActiveTemplates();
  
  // 3. Pour chaque template
  for (const template of templates) {
    // 3.1 Calculer les occurrences selon la règle de récurrence
    const dates = calculateOccurrences(
      template.recurrence_rule,
      today,
      endDate
    );
    
    // 3.2 Pour chaque date
    for (const date of dates) {
      // 3.2.1 Vérifier si l'instance existe déjà
      const exists = await checkInstanceExists(template.id, date);
      if (exists) continue;
      
      // 3.2.2 Vérifier les conflits avec plages bloquées
      const blocked = await checkBlockedPeriods(
        date,
        template.start_time,
        template.end_time
      );
      if (blocked) continue;
      
      // 3.2.3 Créer l'instance
      const instance = await createInstance(template, date);
      
      // 3.2.4 Ajouter les participants par défaut
      await addDefaultParticipants(instance.id, template.id, date);
    }
  }
}
```

### Gestion des Participants par Défaut

Lors de la création d'une instance, les participants pré-assignés du template sont automatiquement ajoutés :

1. **Récupération des participants par défaut** du template
2. **Pour chaque participant** :
   - Si `auto_assign_horse = true` :
     - Chercher une demi-pension active pour la date du cours
     - Si trouvée, assigner le cheval de la DP
     - Sinon, aucun cheval assigné
   - Si `auto_assign_horse = false` :
     - Utiliser le cheval spécifié dans le template
3. **Création de l'inscription** avec le cheval approprié

---

## Tests et Vérification

### Test 1 : Déclenchement Manuel du Cron

Pour tester le cron sans attendre l'heure programmée :

```bash
# Méthode 1 : Via l'API (recommandé)
curl -X POST https://your-worker.workers.dev/api/calendar/generate \
  -H "Content-Type: application/json" \
  -d '{"weeks_ahead": 4}'

# Méthode 2 : Via wrangler (en développement)
# Note : Cloudflare ne permet pas de déclencher manuellement les crons
# Il faut utiliser l'endpoint API ci-dessus
```

### Test 2 : Vérifier les Logs

```bash
# Suivre les logs en temps réel
wrangler tail --format pretty

# Filtrer les logs du cron
wrangler tail --format json | grep "Cron trigger"

# Voir les derniers logs
wrangler tail --format pretty --since 1h
```

**Exemple de logs attendus :**

```
Cron trigger fired: 0 2 * * *
Starting scheduled lesson generation...
Lesson generation completed:
  - Generated: 28
  - Skipped: 5
  - Errors: 0
```

### Test 3 : Vérifier les Résultats en Base de Données

```sql
-- Vérifier les cours générés aujourd'hui
SELECT 
  COUNT(*) as generated_today,
  lesson_type,
  status
FROM lesson_instances
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY lesson_type, status;

-- Vérifier la fenêtre de génération
SELECT 
  MIN(lesson_date) as first_lesson,
  MAX(lesson_date) as last_lesson,
  COUNT(*) as total_lessons
FROM lesson_instances
WHERE lesson_date >= CURRENT_DATE
AND status = 'scheduled';

-- Vérifier les templates actifs
SELECT 
  id,
  name,
  lesson_type,
  is_active
FROM lesson_templates
WHERE is_active = TRUE;
```

### Test 4 : Scénario Complet

**Objectif :** Vérifier que le système génère correctement les cours

1. **Créer un template de test** :
```bash
curl -X POST http://localhost:8787/api/calendar/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Cron - Cours quotidien",
    "lesson_type": "group",
    "start_time": "10:00",
    "duration_minutes": 60,
    "valid_from": "'$(date +%Y-%m-%d)'",
    "max_participants": 5,
    "recurrence_rule": {
      "frequency": "daily",
      "interval": 1,
      "startTime": "10:00",
      "duration": 60
    }
  }'
```

2. **Déclencher la génération** :
```bash
curl -X POST http://localhost:8787/api/calendar/generate \
  -H "Content-Type: application/json" \
  -d '{"weeks_ahead": 1}'
```

3. **Vérifier les résultats** :
```bash
# Récupérer les cours de la semaine
curl "http://localhost:8787/api/calendar/lessons?start_date=$(date +%Y-%m-%d)&end_date=$(date -d '+7 days' +%Y-%m-%d)"
```

4. **Vérifier qu'il y a 7 cours** (1 par jour pendant 1 semaine)

---

## Monitoring

### Métriques à Surveiller

#### 1. Succès du Cron

```bash
# Vérifier les exécutions récentes
wrangler tail --format json --since 24h | grep "Cron job completed"

# Compter les succès/échecs
wrangler tail --format json --since 24h | \
  grep "Cron" | \
  jq 'select(.message | contains("completed") or contains("failed"))'
```

#### 2. Nombre de Cours Générés

```sql
-- Cours générés par jour (derniers 7 jours)
SELECT 
  DATE(created_at) as date,
  COUNT(*) as generated
FROM lesson_instances
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

#### 3. Erreurs de Génération

```bash
# Logs d'erreur
wrangler tail --format json --since 24h | \
  grep "error" | \
  jq '.message'
```

### Dashboard Cloudflare

1. **Accéder au dashboard** : https://dash.cloudflare.com
2. **Workers & Pages** → Votre worker
3. **Metrics** :
   - Requests (devrait montrer les exécutions du cron)
   - Errors (devrait être à 0)
   - Duration (temps d'exécution)

### Alertes Recommandées

Configurer des alertes pour :
- ❌ Échec du cron pendant 2 jours consécutifs
- ⚠️ Aucun cours généré pendant 24h
- ⚠️ Temps d'exécution > 10 secondes
- ❌ Erreurs dans les logs

---

## Troubleshooting

### Problème 1 : Le Cron Ne S'Exécute Pas

**Symptômes :**
- Aucun log dans wrangler tail
- Pas de nouveaux cours générés
- Fenêtre de cours qui se réduit

**Diagnostic :**

```bash
# 1. Vérifier la configuration
cat backend/wrangler.toml | grep -A 2 "triggers"

# 2. Vérifier le déploiement
wrangler deployments list

# 3. Vérifier les triggers
wrangler triggers list
```

**Solutions :**

1. **Vérifier wrangler.toml** :
   ```toml
   [triggers]
   crons = ["0 2 * * *"]
   ```

2. **Re-déployer** :
   ```bash
   cd backend
   wrangler deploy
   ```

3. **Vérifier les permissions** :
   - Le worker doit avoir accès à la base de données
   - Vérifier les secrets (SUPABASE_URL, etc.)

4. **Tester manuellement** :
   ```bash
   curl -X POST https://your-worker.workers.dev/api/calendar/generate
   ```

### Problème 2 : Erreurs Lors de la Génération

**Symptômes :**
- Logs d'erreur dans wrangler tail
- Certains cours ne sont pas générés
- Message "Cron job failed"

**Diagnostic :**

```bash
# Voir les erreurs détaillées
wrangler tail --format json | grep "error" | jq '.'
```

**Solutions courantes :**

1. **Erreur de connexion DB** :
   ```bash
   # Vérifier les secrets
   wrangler secret list
   
   # Re-créer les secrets si nécessaire
   wrangler secret put SUPABASE_URL
   wrangler secret put SUPABASE_ANON_KEY
   ```

2. **Erreur de règle de récurrence** :
   ```sql
   -- Vérifier les templates avec règles invalides
   SELECT id, name, recurrence_rule
   FROM lesson_templates
   WHERE is_active = TRUE;
   ```

3. **Timeout** :
   - Si trop de templates, augmenter le timeout
   - Ou diviser en plusieurs exécutions

### Problème 3 : Cours Générés en Double

**Symptômes :**
- Plusieurs instances pour la même date/template
- Erreurs de contrainte unique

**Diagnostic :**

```sql
-- Trouver les doublons
SELECT 
  template_id,
  lesson_date,
  COUNT(*) as count
FROM lesson_instances
GROUP BY template_id, lesson_date
HAVING COUNT(*) > 1;
```

**Solutions :**

1. **Supprimer les doublons** :
   ```sql
   -- Garder seulement le plus ancien
   DELETE FROM lesson_instances
   WHERE id NOT IN (
     SELECT MIN(id)
     FROM lesson_instances
     GROUP BY template_id, lesson_date
   );
   ```

2. **Vérifier la logique de génération** :
   - Le code vérifie déjà les instances existantes
   - Peut être un problème de concurrence si plusieurs crons s'exécutent

### Problème 4 : Plages Bloquées Non Respectées

**Symptômes :**
- Cours générés sur des plages bloquées
- Conflits lors de la création manuelle

**Diagnostic :**

```sql
-- Vérifier les plages bloquées actives
SELECT * FROM v_active_blocked_periods
WHERE lesson_date >= CURRENT_DATE
ORDER BY lesson_date, start_time;

-- Vérifier les conflits
SELECT 
  li.id,
  li.name,
  li.lesson_date,
  li.start_time,
  li.end_time
FROM lesson_instances li
WHERE li.lesson_type != 'blocked'
AND EXISTS (
  SELECT 1 FROM lesson_instances blocked
  WHERE blocked.lesson_type = 'blocked'
  AND blocked.status != 'cancelled'
  AND blocked.lesson_date = li.lesson_date
  AND blocked.start_time < li.end_time
  AND blocked.end_time > li.start_time
);
```

**Solutions :**

1. **Supprimer les cours en conflit** :
   ```sql
   DELETE FROM lesson_instances
   WHERE id IN (/* IDs des cours en conflit */);
   ```

2. **Vérifier la fonction de vérification** :
   ```sql
   -- Tester la fonction
   SELECT * FROM check_blocked_periods(
     '2024-01-15',
     '14:00:00',
     '15:00:00'
   );
   ```

### Problème 5 : Performance Dégradée

**Symptômes :**
- Cron prend plus de 10 secondes
- Timeout du worker
- Logs de performance

**Diagnostic :**

```bash
# Mesurer le temps d'exécution
wrangler tail --format json | \
  grep "Cron job completed" | \
  jq '.timestamp'
```

**Solutions :**

1. **Optimiser les requêtes** :
   ```sql
   -- Vérifier les index
   SELECT * FROM pg_indexes
   WHERE tablename LIKE 'lesson_%';
   
   -- Analyser les requêtes lentes
   EXPLAIN ANALYZE
   SELECT * FROM lesson_instances
   WHERE template_id = 1
   AND lesson_date BETWEEN '2024-01-01' AND '2024-01-31';
   ```

2. **Réduire la fenêtre de génération** :
   ```javascript
   // Dans generate-lessons.js
   const weeksAhead = 2; // Au lieu de 4
   ```

3. **Pagination** :
   - Générer les templates par lots
   - Utiliser plusieurs exécutions si nécessaire

---

## Commandes de Référence

### Gestion du Cron

```bash
# Déployer avec le cron
wrangler deploy

# Lister les triggers
wrangler triggers list

# Voir les logs en temps réel
wrangler tail --format pretty

# Voir les logs JSON
wrangler tail --format json

# Filtrer les logs du cron
wrangler tail --format json | grep "Cron"

# Voir les dernières 24h
wrangler tail --format pretty --since 24h
```

### Tests

```bash
# Générer manuellement
curl -X POST https://your-worker.workers.dev/api/calendar/generate \
  -H "Content-Type: application/json" \
  -d '{"weeks_ahead": 4}'

# Vérifier les cours générés
curl "https://your-worker.workers.dev/api/calendar/lessons?start_date=$(date +%Y-%m-%d)&end_date=$(date -d '+28 days' +%Y-%m-%d)"

# Vérifier les templates actifs
curl "https://your-worker.workers.dev/api/calendar/templates?active=true"
```

### Base de Données

```sql
-- Statistiques de génération
SELECT 
  DATE(created_at) as date,
  COUNT(*) as generated,
  COUNT(DISTINCT template_id) as templates_used
FROM lesson_instances
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Vérifier la fenêtre de cours
SELECT 
  MIN(lesson_date) as first_lesson,
  MAX(lesson_date) as last_lesson,
  COUNT(*) as total_lessons,
  COUNT(DISTINCT lesson_date) as days_covered
FROM lesson_instances
WHERE lesson_date >= CURRENT_DATE
AND status = 'scheduled';

-- Templates actifs
SELECT 
  id,
  name,
  lesson_type,
  is_active,
  valid_from,
  valid_until
FROM lesson_templates
WHERE is_active = TRUE
ORDER BY lesson_type, name;
```

---

## Bonnes Pratiques

### 1. Monitoring Régulier

- ✅ Vérifier les logs quotidiennement
- ✅ Surveiller les métriques Cloudflare
- ✅ Configurer des alertes
- ✅ Tester après chaque déploiement

### 2. Maintenance

- ✅ Archiver les cours anciens mensuellement
- ✅ Vérifier les templates inactifs
- ✅ Optimiser les index si nécessaire
- ✅ Documenter les changements

### 3. Sécurité

- ✅ Ne jamais committer wrangler.toml avec secrets
- ✅ Utiliser wrangler secret pour les valeurs sensibles
- ✅ Limiter les permissions de la base de données
- ✅ Logger les erreurs sans exposer de données sensibles

### 4. Performance

- ✅ Maintenir la fenêtre à 4 semaines maximum
- ✅ Archiver les cours anciens régulièrement
- ✅ Optimiser les requêtes SQL
- ✅ Utiliser les index appropriés

---

## Ressources

### Documentation Cloudflare

- [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
- [Scheduled Events](https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Documentation Interne

- [Système de Calendrier](./README.md)
- [API Reference](./api-reference.md)
- [Guide de Migration](../../CALENDAR_IMPLEMENTATION.md)

---

**Version:** 1.0.0  
**Dernière mise à jour:** 2025-01-15  
**Auteur:** SuperNinja AI