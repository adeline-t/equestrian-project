-- Supprimer l'ancienne contrainte
ALTER TABLE public.rider_horse_pairings 
DROP CONSTRAINT rider_horse_associations_rider_id_horse_id_association_star_key;

-- Créer un index UNIQUE partiel pour les pairings actifs
CREATE UNIQUE INDEX unique_active_pairing 
ON public.rider_horse_pairings (rider_id, horse_id) 
WHERE pairing_end_date IS NULL;
