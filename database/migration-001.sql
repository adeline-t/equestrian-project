-- ============================================
-- MIGRATION: Un seul forfait actif par cavalier
-- Version corrigée - Sans tests automatiques
-- ============================================
-- Date: 2026-01-14
-- Description: Ajouter une contrainte pour garantir qu'un cavalier
--              ne peut avoir qu'un seul forfait avec is_active = true

-- ============================================
-- ÉTAPE 1: Analyse des données existantes
-- ============================================

-- Vérifier les cavaliers avec plusieurs forfaits actifs
SELECT 
  rider_id,
  COUNT(*) as active_packages_count,
  STRING_AGG(id::text, ', ') as package_ids
FROM packages
WHERE is_active = true
GROUP BY rider_id
HAVING COUNT(*) > 1;

-- Détail des forfaits en conflit
SELECT 
  p.id,
  p.rider_id,
  r.name as rider_name,
  p.services_per_week,
  p.group_lessons_per_week,
  p.is_active,
  p.created_at,
  p.updated_at
FROM packages p
JOIN riders r ON r.id = p.rider_id
WHERE p.is_active = true
ORDER BY p.rider_id, p.created_at DESC;

-- ============================================
-- ÉTAPE 2: Sauvegarde
-- ============================================

-- Créer une table de backup
DROP TABLE IF EXISTS packages_backup_20260114;
CREATE TABLE packages_backup_20260114 AS
SELECT * FROM packages;

-- Vérifier
SELECT COUNT(*) as total_packages FROM packages_backup_20260114;
SELECT COUNT(*) as active_packages FROM packages_backup_20260114 WHERE is_active = true;

-- ============================================
-- ÉTAPE 3: Nettoyage des doublons
-- ============================================

-- Garder le forfait le plus récent par cavalier
-- et désactiver les anciens
WITH ranked_packages AS (
  SELECT 
    id,
    rider_id,
    ROW_NUMBER() OVER (
      PARTITION BY rider_id 
      ORDER BY created_at DESC
    ) as rn
  FROM packages
  WHERE is_active = true
)
UPDATE packages
SET 
  is_active = false,
  updated_at = NOW()
WHERE id IN (
  SELECT id 
  FROM ranked_packages 
  WHERE rn > 1
);

-- Vérifier le résultat du nettoyage
SELECT 
  'Avant nettoyage' as moment,
  COUNT(*) as total_packages,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active_packages
FROM packages_backup_20260114
UNION ALL
SELECT 
  'Après nettoyage' as moment,
  COUNT(*) as total_packages,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active_packages
FROM packages;

-- Afficher les forfaits désactivés
SELECT 
  p.id,
  p.rider_id,
  r.name as rider_name,
  p.services_per_week,
  p.group_lessons_per_week,
  p.created_at,
  p.updated_at,
  'Désactivé par migration' as status
FROM packages p
JOIN riders r ON r.id = p.rider_id
WHERE p.id IN (
  SELECT id FROM packages_backup_20260114 WHERE is_active = true
)
AND p.is_active = false
ORDER BY p.rider_id, p.created_at DESC;

-- ============================================
-- ÉTAPE 4: Créer la contrainte unique
-- ============================================

-- Supprimer l'index s'il existe déjà
DROP INDEX IF EXISTS unique_active_package_per_rider;

-- Créer l'index unique partiel
CREATE UNIQUE INDEX unique_active_package_per_rider 
ON packages (rider_id) 
WHERE is_active = true;

-- ============================================
-- ÉTAPE 5: Vérification finale
-- ============================================

-- Vérifier qu'il n'y a plus de doublons
SELECT 
  rider_id,
  COUNT(*) as active_packages_count
FROM packages
WHERE is_active = true
GROUP BY rider_id
HAVING COUNT(*) > 1;
-- Devrait retourner 0 lignes

-- Statistiques finales
SELECT 
  COUNT(DISTINCT rider_id) as total_riders_with_active_package,
  COUNT(*) as total_active_packages,
  MAX(packages_per_rider) as max_packages_per_rider
FROM (
  SELECT 
    rider_id,
    COUNT(*) as packages_per_rider
  FROM packages
  WHERE is_active = true
  GROUP BY rider_id
) sub;
-- max_packages_per_rider devrait être 1

-- Répartition des forfaits actifs/inactifs
SELECT 
  is_active,
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
FROM packages
GROUP BY is_active
ORDER BY is_active DESC;

-- Vérifier que l'index est créé
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE indexname = 'unique_active_package_per_rider';

-- ============================================
-- ÉTAPE 6: Documentation
-- ============================================

-- Ajouter un commentaire sur l'index
COMMENT ON INDEX unique_active_package_per_rider IS 
'Garantit qu''un cavalier ne peut avoir qu''un seul forfait actif (is_active = true) à la fois. 
Créé le 2026-01-14 lors de la migration.';

-- ============================================
-- RÉSUMÉ DE LA MIGRATION
-- ============================================

DO $$
DECLARE
  total_packages INTEGER;
  active_packages INTEGER;
  inactive_packages INTEGER;
  riders_with_active INTEGER;
  constraint_exists BOOLEAN;
  duplicates_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_packages FROM packages;
  SELECT COUNT(*) INTO active_packages FROM packages WHERE is_active = true;
  SELECT COUNT(*) INTO inactive_packages FROM packages WHERE is_active = false;
  SELECT COUNT(DISTINCT rider_id) INTO riders_with_active FROM packages WHERE is_active = true;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'unique_active_package_per_rider'
  ) INTO constraint_exists;
  
  SELECT COUNT(*) INTO duplicates_count FROM (
    SELECT rider_id
    FROM packages
    WHERE is_active = true
    GROUP BY rider_id
    HAVING COUNT(*) > 1
  ) sub;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RÉSUMÉ DE LA MIGRATION';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total de forfaits: %', total_packages;
  RAISE NOTICE 'Forfaits actifs: %', active_packages;
  RAISE NOTICE 'Forfaits inactifs: %', inactive_packages;
  RAISE NOTICE 'Cavaliers avec forfait actif: %', riders_with_active;
  RAISE NOTICE 'Doublons restants: %', duplicates_count;
  RAISE NOTICE 'Contrainte unique active: %', CASE WHEN constraint_exists THEN 'OUI ✓' ELSE 'NON ✗' END;
  RAISE NOTICE '========================================';
  
  IF duplicates_count > 0 THEN
    RAISE WARNING 'ATTENTION: Des doublons existent encore! Vérifiez les données.';
  ELSE
    RAISE NOTICE 'Succès: Aucun doublon détecté ✓';
  END IF;
  
  IF NOT constraint_exists THEN
    RAISE WARNING 'ATTENTION: La contrainte unique n''a pas été créée!';
  ELSE
    RAISE NOTICE 'Succès: Contrainte unique active ✓';
  END IF;
  
  RAISE NOTICE '';
END $$;

-- ============================================
-- ROLLBACK (si nécessaire)
-- ============================================

-- Pour annuler cette migration:
/*
-- 1. Supprimer la contrainte unique
DROP INDEX IF EXISTS unique_active_package_per_rider;

-- 2. Restaurer les données (optionnel)
TRUNCATE packages CASCADE;
INSERT INTO packages SELECT * FROM packages_backup_20260114;

-- 3. Supprimer le backup
DROP TABLE IF EXISTS packages_backup_20260114;
*/