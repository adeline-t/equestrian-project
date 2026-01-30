# Rapport complet : Structure de facturation pour le centre équestre

## Vue d'ensemble

Ce système de facturation gère deux flux distincts :

1. **Facturation club** : Factures mensuelles aux cavaliers (packages + dépassements + éléments personnalisés)
2. **Facturation instructeur** : Factures mensuelles aux instructeurs basées sur le nombre de créneaux donnés

### Principes clés

- Facturation mensuelle avec possibilité d'ajouts a posteriori
- Historique complet des prix avec dates de validité
- Traçabilité complète de ce qui a été facturé
- Support des surcoûts par événement
- Éléments de facturation personnalisés (cotisations, licences, etc.)
- Gestion spécifique pour events "special" et "service"

---

## Structure des données

### 1. Gestion des prix

#### 1.1 Prix instructeurs (par type d'événement)

- Table `instructor_pricing` : Prix de base par event_type avec historique
- Permet de changer les prix tout en conservant l'ancien tarif pour la facturation passée

#### 1.2 Prix club (par type d'événement et catégorie)

- Table `club_pricing` : Prix par event_type et catégorie de facturation
- Catégories : package_service, package_private, extra_service, extra_private

#### 1.3 Prix des packages

- Table `package_pricing` : Tarif mensuel des forfaits selon composition
- Basé sur services_per_week + private_lessons_per_week

#### 1.4 Prix spécifiques par événement

- Table `event_specific_pricing` : Pour events "special" et "service" sans prix par défaut
- Colonnes `club_surcharge` et `instructor_surcharge` dans `events` : Surcoûts ajoutés au prix de base

#### 1.5 Éléments de facturation personnalisés

- Table `custom_billing_items` : Catalogue d'éléments réutilisables (cotisations, licences, etc.)

### 2. Factures et lignes de facturation

#### 2.1 Factures principales

- Table `invoices` : En-tête de facture avec numéro, type, mois de facturation, statut

#### 2.2 Lignes de facturation

- Table `billed_participants` : Participants facturés (facturation club)
- Table `billed_slots` : Créneaux facturés (facturation instructeur)
- Table `invoice_custom_lines` : Lignes personnalisées (cotisations, éléments ponctuels)

### 3. Optimisations

#### 3.1 Index de performance

- Index sur billing_month + status pour requêtes par période et statut
- Index partiels sur les prix actifs (WHERE valid_until IS NULL)
- Index composites pour les recherches fréquentes

#### 3.2 Vues utilitaires

- `v_unbilled_participants` : Participants non encore facturés
- `v_unbilled_instructor_slots` : Créneaux instructeur non facturés
- `v_event_pricing_summary` : Vue d'ensemble des prix finaux par événement
- `v_invoice_totals` : Calcul automatique des totaux de factures

#### 3.3 Fonctions SQL

- `get_instructor_price()` : Récupère le prix instructeur valide à une date
- `get_club_price()` : Récupère le prix club valide à une date
- `get_package_price()` : Récupère le prix package valide à une date
- `get_instructor_price_for_event()` : Prix instructeur final (base + surcoût)
- `get_club_price_for_event()` : Prix club final (base + surcoût)

---

## Flux de facturation

### Facturation club (cavaliers)

1. **Génération mensuelle** : Créer une facture par cavalier actif
2. **Ligne forfait** : Ajouter le prix du package si actif
3. **Lignes dépassements** : Calculer extras services/privés au-delà du forfait
4. **Lignes personnalisées** : Ajouter cotisations, licences, etc.
5. **Statut** : Draft → Issued → Paid

### Facturation instructeur

1. **Génération mensuelle** : Créer une facture par instructeur ayant donné des cours
2. **Lignes par événement** : Grouper les créneaux par event_id
3. **Calcul** : Nombre de créneaux × prix final (base + surcoût)
4. **Statut** : Draft → Issued → Paid

### Refacturation a posteriori

1. Identifier les éléments non facturés via vues `v_unbilled_*`
2. Créer nouvelle facture ou modifier brouillon existant
3. Ajouter lignes manquantes avec prices au moment de la prestation

---

## SQL complet de création

```sql
-- ========================================
-- STRUCTURE COMPLÈTE DE FACTURATION
-- Centre Équestre - Gestion des factures
-- ========================================

-- ========================================
-- 1. GESTION DES PRIX
-- ========================================

-- Prix pour les instructeurs (par type d'événement)
CREATE TABLE public.instructor_pricing (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  event_type text NOT NULL,
  price_per_slot numeric(10,2) NOT NULL,

  valid_from date NOT NULL,
  valid_until date, -- NULL = toujours valide

  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),

  CONSTRAINT instructor_pricing_pkey PRIMARY KEY (id),
  CONSTRAINT check_instructor_pricing_dates CHECK (valid_until IS NULL OR valid_until > valid_from)
);

-- Prix pour le club (par type d'événement et catégorie)
CREATE TABLE public.club_pricing (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  event_type text NOT NULL,
  pricing_category text NOT NULL CHECK (pricing_category IN ('package_service', 'package_private', 'extra_service', 'extra_private')),
  price_per_slot numeric(10,2) NOT NULL,

  valid_from date NOT NULL,
  valid_until date, -- NULL = toujours valide

  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),

  CONSTRAINT club_pricing_pkey PRIMARY KEY (id),
  CONSTRAINT check_club_pricing_dates CHECK (valid_until IS NULL OR valid_until > valid_from)
);

-- Prix des packages (abonnement forfaitaire)
CREATE TABLE public.package_pricing (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  services_per_week integer NOT NULL,
  private_lessons_per_week integer NOT NULL,
  monthly_price numeric(10,2) NOT NULL,

  valid_from date NOT NULL,
  valid_until date, -- NULL = toujours valide

  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),

  CONSTRAINT package_pricing_pkey PRIMARY KEY (id),
  CONSTRAINT check_package_pricing_dates CHECK (valid_until IS NULL OR valid_until > valid_from)
);

-- Prix spécifiques pour certains events (notamment "special" et "service")
CREATE TABLE public.event_specific_pricing (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  event_id integer NOT NULL,

  -- Prix de base (remplace le prix par défaut du event_type)
  -- NULL = utiliser le prix standard du event_type
  club_base_price numeric(10,2),
  instructor_base_price numeric(10,2),

  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),

  CONSTRAINT event_specific_pricing_pkey PRIMARY KEY (id),
  CONSTRAINT fk_event_pricing_event FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  CONSTRAINT unique_event_pricing UNIQUE (event_id)
);

-- Éléments de facturation personnalisés (hors événements)
CREATE TABLE public.custom_billing_items (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('club', 'instructor')),
  code character varying NOT NULL, -- ex: "COTISATION_2026", "PENSION_CHEVAL"
  label text NOT NULL, -- ex: "Cotisation annuelle 2026"
  default_price numeric(10,2) NOT NULL,
  is_active boolean NOT NULL DEFAULT true,

  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),

  CONSTRAINT custom_billing_items_pkey PRIMARY KEY (id),
  CONSTRAINT unique_billing_item_code UNIQUE (code)
);

-- Ajout de surcoûts directement sur les events
ALTER TABLE public.events
  ADD COLUMN club_surcharge numeric(10,2) DEFAULT 0 CHECK (club_surcharge >= 0),
  ADD COLUMN instructor_surcharge numeric(10,2) DEFAULT 0 CHECK (instructor_surcharge >= 0),
  ADD COLUMN surcharge_reason text;

-- ========================================
-- 2. FACTURES ET LIGNES DE FACTURATION
-- ========================================

-- Factures principales
CREATE TABLE public.invoices (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  invoice_number character varying NOT NULL UNIQUE,
  invoice_type text NOT NULL CHECK (invoice_type IN ('club', 'instructor')),
  billing_month date NOT NULL, -- premier jour du mois facturé
  invoice_date date NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'paid', 'cancelled')),

  rider_id integer, -- pour facturation club
  instructor_id integer, -- pour facturation instructeur

  total_amount numeric(10,2) NOT NULL DEFAULT 0,
  notes text,

  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),

  CONSTRAINT invoices_pkey PRIMARY KEY (id),
  CONSTRAINT fk_invoices_rider FOREIGN KEY (rider_id) REFERENCES public.riders(id),
  CONSTRAINT check_invoice_target CHECK (
    (invoice_type = 'club' AND rider_id IS NOT NULL AND instructor_id IS NULL) OR
    (invoice_type = 'instructor' AND instructor_id IS NOT NULL AND rider_id IS NULL)
  )
);

-- Éléments facturés au club (par participant)
CREATE TABLE public.billed_participants (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  invoice_id integer NOT NULL,
  event_participant_id integer NOT NULL,
  billing_category text NOT NULL CHECK (billing_category IN ('package_service', 'package_private', 'extra_service', 'extra_private', 'competition', 'special')),

  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  quantity numeric(10,2) NOT NULL DEFAULT 1,
  amount numeric(10,2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
  description text,

  created_at timestamp without time zone NOT NULL DEFAULT now(),

  CONSTRAINT billed_participants_pkey PRIMARY KEY (id),
  CONSTRAINT fk_billed_participant_invoice FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE,
  CONSTRAINT fk_billed_participant_event FOREIGN KEY (event_participant_id) REFERENCES public.event_participants(id),
  CONSTRAINT unique_participant_billing UNIQUE (event_participant_id, invoice_id)
);

-- Slots facturés à l'instructeur
CREATE TABLE public.billed_slots (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  invoice_id integer NOT NULL,
  planning_slot_id integer NOT NULL,

  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  amount numeric(10,2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
  description text,

  created_at timestamp without time zone NOT NULL DEFAULT now(),

  CONSTRAINT billed_slots_pkey PRIMARY KEY (id),
  CONSTRAINT fk_billed_slot_invoice FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE,
  CONSTRAINT fk_billed_slot_planning FOREIGN KEY (planning_slot_id) REFERENCES public.planning_slots(id),
  CONSTRAINT unique_slot_billing UNIQUE (planning_slot_id, invoice_id)
);

-- Lignes de facturation personnalisées (pour cotisation, pension, etc.)
CREATE TABLE public.invoice_custom_lines (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  invoice_id integer NOT NULL,
  custom_item_id integer, -- NULL si ponctuel

  description text NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  quantity numeric(10,2) NOT NULL DEFAULT 1,
  total_price numeric(10,2) GENERATED ALWAYS AS (unit_price * quantity) STORED,

  created_at timestamp without time zone NOT NULL DEFAULT now(),

  CONSTRAINT invoice_custom_lines_pkey PRIMARY KEY (id),
  CONSTRAINT fk_custom_lines_invoice FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE,
  CONSTRAINT fk_custom_lines_item FOREIGN KEY (custom_item_id) REFERENCES public.custom_billing_items(id)
);

-- ========================================
-- 3. INDEX POUR PERFORMANCE
-- ========================================

-- Index sur invoices : requêtes par mois et statut
CREATE INDEX idx_invoices_billing_month_status ON public.invoices(billing_month, status);
CREATE INDEX idx_invoices_status ON public.invoices(status) WHERE status != 'cancelled';
CREATE INDEX idx_invoices_rider_month ON public.invoices(rider_id, billing_month) WHERE rider_id IS NOT NULL;
CREATE INDEX idx_invoices_instructor_month ON public.invoices(instructor_id, billing_month) WHERE instructor_id IS NOT NULL;

-- Index sur billed_participants
CREATE INDEX idx_billed_participants_event ON public.billed_participants(event_participant_id);
CREATE INDEX idx_billed_participants_invoice ON public.billed_participants(invoice_id);

-- Index sur billed_slots
CREATE INDEX idx_billed_slots_planning ON public.billed_slots(planning_slot_id);
CREATE INDEX idx_billed_slots_invoice ON public.billed_slots(invoice_id);

-- Index sur invoice_custom_lines
CREATE INDEX idx_invoice_custom_lines_invoice ON public.invoice_custom_lines(invoice_id);

-- Index sur les prix : recherche par type et date de validité
CREATE INDEX idx_instructor_pricing_type_date ON public.instructor_pricing(event_type, valid_from, valid_until);
CREATE INDEX idx_instructor_pricing_active ON public.instructor_pricing(event_type) WHERE valid_until IS NULL;

CREATE INDEX idx_club_pricing_type_cat_date ON public.club_pricing(event_type, pricing_category, valid_from, valid_until);
CREATE INDEX idx_club_pricing_active ON public.club_pricing(event_type, pricing_category) WHERE valid_until IS NULL;

CREATE INDEX idx_package_pricing_config_date ON public.package_pricing(services_per_week, private_lessons_per_week, valid_from, valid_until);
CREATE INDEX idx_package_pricing_active ON public.package_pricing(services_per_week, private_lessons_per_week) WHERE valid_until IS NULL;

-- Index sur event_specific_pricing
CREATE INDEX idx_event_specific_pricing_event ON public.event_specific_pricing(event_id);

-- Index sur custom_billing_items
CREATE INDEX idx_custom_billing_items_active ON public.custom_billing_items(item_type) WHERE is_active = true;

-- Index composite pour trouver les non-facturés rapidement
CREATE INDEX idx_event_participants_slot_rider ON public.event_participants(planning_slot_id, rider_id) WHERE is_cancelled = false;
CREATE INDEX idx_planning_slots_date_instructor ON public.planning_slots(slot_date, actual_instructor_id) WHERE deleted_at IS NULL;

-- ========================================
-- 4. FONCTIONS UTILITAIRES
-- ========================================

-- Fonction pour obtenir le prix instructeur valide à une date
CREATE OR REPLACE FUNCTION get_instructor_price(
  p_event_type text,
  p_date date DEFAULT CURRENT_DATE
) RETURNS numeric AS $$
  SELECT price_per_slot
  FROM public.instructor_pricing
  WHERE event_type = p_event_type
    AND valid_from <= p_date
    AND (valid_until IS NULL OR valid_until >= p_date)
  ORDER BY valid_from DESC
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Fonction pour obtenir le prix club valide à une date
CREATE OR REPLACE FUNCTION get_club_price(
  p_event_type text,
  p_pricing_category text,
  p_date date DEFAULT CURRENT_DATE
) RETURNS numeric AS $$
  SELECT price_per_slot
  FROM public.club_pricing
  WHERE event_type = p_event_type
    AND pricing_category = p_pricing_category
    AND valid_from <= p_date
    AND (valid_until IS NULL OR valid_until >= p_date)
  ORDER BY valid_from DESC
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Fonction pour obtenir le prix package valide à une date
CREATE OR REPLACE FUNCTION get_package_price(
  p_services_per_week integer,
  p_private_lessons_per_week integer,
  p_date date DEFAULT CURRENT_DATE
) RETURNS numeric AS $$
  SELECT monthly_price
  FROM public.package_pricing
  WHERE services_per_week = p_services_per_week
    AND private_lessons_per_week = p_private_lessons_per_week
    AND valid_from <= p_date
    AND (valid_until IS NULL OR valid_until >= p_date)
  ORDER BY valid_from DESC
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Fonction pour obtenir le prix instructeur final (base + surcoût)
CREATE OR REPLACE FUNCTION get_instructor_price_for_event(
  p_event_id integer,
  p_date date DEFAULT CURRENT_DATE
) RETURNS numeric AS $$
DECLARE
  v_event_type text;
  v_base_price numeric;
  v_surcharge numeric;
  v_specific_price numeric;
BEGIN
  -- Récupérer le type d'événement et le surcoût
  SELECT e.event_type, e.instructor_surcharge
  INTO v_event_type, v_surcharge
  FROM public.events e
  WHERE e.id = p_event_id;

  -- Vérifier s'il y a un prix spécifique pour cet event
  SELECT instructor_base_price
  INTO v_specific_price
  FROM public.event_specific_pricing
  WHERE event_id = p_event_id;

  -- Si prix spécifique défini, l'utiliser comme base
  IF v_specific_price IS NOT NULL THEN
    v_base_price := v_specific_price;
  ELSE
    -- Sinon, utiliser le prix standard du event_type
    v_base_price := get_instructor_price(v_event_type, p_date);
  END IF;

  -- Retourner base + surcoût
  RETURN COALESCE(v_base_price, 0) + COALESCE(v_surcharge, 0);
END;
$$ LANGUAGE plpgsql STABLE;

-- Fonction pour obtenir le prix club final (base + surcoût)
CREATE OR REPLACE FUNCTION get_club_price_for_event(
  p_event_id integer,
  p_pricing_category text,
  p_date date DEFAULT CURRENT_DATE
) RETURNS numeric AS $$
DECLARE
  v_event_type text;
  v_base_price numeric;
  v_surcharge numeric;
  v_specific_price numeric;
BEGIN
  -- Récupérer le type d'événement et le surcoût
  SELECT e.event_type, e.club_surcharge
  INTO v_event_type, v_surcharge
  FROM public.events e
  WHERE e.id = p_event_id;

  -- Vérifier s'il y a un prix spécifique pour cet event
  SELECT club_base_price
  INTO v_specific_price
  FROM public.event_specific_pricing
  WHERE event_id = p_event_id;

  -- Si prix spécifique défini, l'utiliser comme base
  IF v_specific_price IS NOT NULL THEN
    v_base_price := v_specific_price;
  ELSE
    -- Sinon, utiliser le prix standard du event_type
    v_base_price := get_club_price(v_event_type, p_pricing_category, p_date);
  END IF;

  -- Retourner base + surcoût
  RETURN COALESCE(v_base_price, 0) + COALESCE(v_surcharge, 0);
END;
$$ LANGUAGE plpgsql STABLE;

-- ========================================
-- 5. VUES UTILITAIRES
-- ========================================

-- Vue : Participants non facturés pour un mois donné
CREATE OR REPLACE VIEW v_unbilled_participants AS
SELECT
  ep.id,
  ep.planning_slot_id,
  ep.rider_id,
  r.name as rider_name,
  ps.slot_date,
  ps.event_id,
  e.event_type,
  e.name as event_name,
  DATE_TRUNC('month', ps.slot_date)::date as billing_month
FROM public.event_participants ep
INNER JOIN public.riders r ON ep.rider_id = r.id
INNER JOIN public.planning_slots ps ON ep.planning_slot_id = ps.id
INNER JOIN public.events e ON ps.event_id = e.id
LEFT JOIN public.billed_participants bp ON ep.id = bp.event_participant_id
WHERE
  ep.is_cancelled = false
  AND ps.deleted_at IS NULL
  AND e.deleted_at IS NULL
  AND bp.id IS NULL;

-- Vue : Slots non facturés aux instructeurs
CREATE OR REPLACE VIEW v_unbilled_instructor_slots AS
SELECT
  ps.id,
  ps.slot_date,
  ps.actual_instructor_id,
  ps.event_id,
  e.name as event_name,
  e.event_type,
  DATE_TRUNC('month', ps.slot_date)::date as billing_month
FROM public.planning_slots ps
INNER JOIN public.events e ON ps.event_id = e.id
LEFT JOIN public.billed_slots bs ON ps.id = bs.planning_slot_id
WHERE
  ps.deleted_at IS NULL
  AND e.deleted_at IS NULL
  AND ps.actual_instructor_id IS NOT NULL
  AND bs.id IS NULL;

-- Vue : Prix finaux de tous les événements
CREATE OR REPLACE VIEW v_event_pricing_summary AS
SELECT
  e.id as event_id,
  e.name,
  e.event_type,

  -- Prix club
  COALESCE(esp.club_base_price,
    (SELECT price_per_slot FROM public.club_pricing cp
     WHERE cp.event_type = e.event_type
       AND cp.pricing_category = 'extra_service'
       AND cp.valid_from <= CURRENT_DATE
       AND (cp.valid_until IS NULL OR cp.valid_until >= CURRENT_DATE)
     ORDER BY cp.valid_from DESC LIMIT 1)
  ) as club_base_price,
  e.club_surcharge,
  COALESCE(esp.club_base_price,
    (SELECT price_per_slot FROM public.club_pricing cp
     WHERE cp.event_type = e.event_type
       AND cp.pricing_category = 'extra_service'
       AND cp.valid_from <= CURRENT_DATE
       AND (cp.valid_until IS NULL OR cp.valid_until >= CURRENT_DATE)
     ORDER BY cp.valid_from DESC LIMIT 1)
  ) + COALESCE(e.club_surcharge, 0) as club_final_price,

  -- Prix instructeur
  COALESCE(esp.instructor_base_price,
    (SELECT price_per_slot FROM public.instructor_pricing ip
     WHERE ip.event_type = e.event_type
       AND ip.valid_from <= CURRENT_DATE
       AND (ip.valid_until IS NULL OR ip.valid_until >= CURRENT_DATE)
     ORDER BY ip.valid_from DESC LIMIT 1)
  ) as instructor_base_price,
  e.instructor_surcharge,
  COALESCE(esp.instructor_base_price,
    (SELECT price_per_slot FROM public.instructor_pricing ip
     WHERE ip.event_type = e.event_type
       AND ip.valid_from <= CURRENT_DATE
       AND (ip.valid_until IS NULL OR ip.valid_until >= CURRENT_DATE)
     ORDER BY ip.valid_from DESC LIMIT 1)
  ) + COALESCE(e.instructor_surcharge, 0) as instructor_final_price,

  e.surcharge_reason

FROM public.events e
LEFT JOIN public.event_specific_pricing esp ON e.id = esp.event_id
WHERE e.deleted_at IS NULL;

-- Vue : Totaux des factures
CREATE OR REPLACE VIEW v_invoice_totals AS
SELECT
  i.id as invoice_id,
  i.invoice_number,
  i.invoice_type,
  i.billing_month,
  i.status,
  COALESCE(participants.total, 0) +
  COALESCE(slots.total, 0) +
  COALESCE(custom.total, 0) as calculated_total,
  i.total_amount as stored_total,
  CASE
    WHEN i.invoice_type = 'club' THEN r.name
    ELSE NULL
  END as client_name
FROM public.invoices i
LEFT JOIN public.riders r ON i.rider_id = r.id
LEFT JOIN (
  SELECT invoice_id, SUM(amount) as total
  FROM public.billed_participants
  GROUP BY invoice_id
) participants ON i.id = participants.invoice_id
LEFT JOIN (
  SELECT invoice_id, SUM(amount) as total
  FROM public.billed_slots
  GROUP BY invoice_id
) slots ON i.id = slots.invoice_id
LEFT JOIN (
  SELECT invoice_id, SUM(total_price) as total
  FROM public.invoice_custom_lines
  GROUP BY invoice_id
) custom ON i.id = custom.invoice_id;

-- Vue : Résumé mensuel de facturation
CREATE OR REPLACE VIEW v_monthly_billing_summary AS
SELECT
  billing_month,
  invoice_type,
  status,
  COUNT(*) as invoice_count,
  SUM(total_amount) as total_amount
FROM public.invoices
GROUP BY billing_month, invoice_type, status
ORDER BY billing_month DESC, invoice_type, status;
```

---

## Données d'exemple pour initialisation

```sql
-- ========================================
-- DONNÉES D'EXEMPLE POUR INITIALISATION
-- ========================================

-- Prix instructeurs par type d'événement (valables à partir du 01/01/2026)
INSERT INTO public.instructor_pricing (event_type, price_per_slot, valid_from) VALUES
  ('lesson', 45.00, '2026-01-01'),
  ('private_lesson', 60.00, '2026-01-01'),
  ('competition', 80.00, '2026-01-01');

-- Prix club par type d'événement et catégorie
INSERT INTO public.club_pricing (event_type, pricing_category, price_per_slot, valid_from) VALUES
  ('lesson', 'package_service', 0.00, '2026-01-01'), -- inclus dans package
  ('lesson', 'extra_service', 25.00, '2026-01-01'),
  ('private_lesson', 'package_private', 0.00, '2026-01-01'), -- inclus dans package
  ('private_lesson', 'extra_private', 45.00, '2026-01-01'),
  ('competition', 'extra_service', 50.00, '2026-01-01');

-- Prix des packages
INSERT INTO public.package_pricing (services_per_week, private_lessons_per_week, monthly_price, valid_from) VALUES
  (1, 0, 120.00, '2026-01-01'),
  (2, 0, 180.00, '2026-01-01'),
  (3, 0, 250.00, '2026-01-01'),
  (2, 1, 280.00, '2026-01-01'),
  (3, 1, 350.00, '2026-01-01'),
  (4, 1, 420.00, '2026-01-01');

-- Éléments de facturation personnalisés
INSERT INTO public.custom_billing_items (item_type, code, label, default_price) VALUES
  ('club', 'COTISATION_2026', 'Cotisation annuelle 2026', 210.00),
  ('club', 'LICENCE_FFE', 'Licence FFE', 36.00),
  ('club', 'PENSION_CHEVAL_COMPLET', 'Pension cheval (mois) - Complet', 450.00),
  ('club', 'PENSION_CHEVAL_PRE', 'Pension cheval (mois) - Pré', 250.00),
  ('club', 'FERRURE', 'Forfait ferrure', 120.00),
  ('instructor', 'FORMATION_CONTINUE', 'Formation continue', 150.00),
  ('instructor', 'DEPLACEMENT_CONCOURS', 'Frais déplacement concours', 80.00);
```

---

## Requêtes utiles pour l'exploitation

```sql
-- ========================================
-- REQUÊTES COURANTES
-- ========================================

-- 1. Participants non facturés du mois en cours
SELECT * FROM v_unbilled_participants
WHERE billing_month = DATE_TRUNC('month', CURRENT_DATE)::date
ORDER BY rider_name, slot_date;

-- 2. Slots instructeur non facturés du mois en cours
SELECT * FROM v_unbilled_instructor_slots
WHERE billing_month = DATE_TRUNC('month', CURRENT_DATE)::date
ORDER BY actual_instructor_id, slot_date;

-- 3. Factures en brouillon
SELECT * FROM v_invoice_totals
WHERE status = 'draft'
ORDER BY billing_month DESC, invoice_number;

-- 4. Factures non payées (brouillon + émises)
SELECT * FROM v_invoice_totals
WHERE status IN ('draft', 'issued')
ORDER BY billing_month DESC, invoice_date DESC;

-- 5. Résumé mensuel de facturation
SELECT * FROM v_monthly_billing_summary
WHERE billing_month >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')::date;

-- 6. Détail complet d'une facture club
SELECT
  i.invoice_number,
  i.billing_month,
  i.invoice_date,
  i.status,
  r.name as cavalier,
  'Participant' as type_ligne,
  e.name as evenement,
  ps.slot_date as date,
  bp.billing_category as categorie,
  bp.unit_price,
  bp.quantity,
  bp.amount
FROM public.invoices i
INNER JOIN public.riders r ON i.rider_id = r.id
INNER JOIN public.billed_participants bp ON i.id = bp.invoice_id
INNER JOIN public.event_participants ep ON bp.event_participant_id = ep.id
INNER JOIN public.planning_slots ps ON ep.planning_slot_id = ps.id
INNER JOIN public.events e ON ps.event_id = e.id
WHERE i.id = $1

UNION ALL

SELECT
  i.invoice_number,
  i.billing_month,
  i.invoice_date,
  i.status,
  r.name as cavalier,
  'Custom' as type_ligne,
  icl.description as evenement,
  NULL as date,
  NULL as categorie,
  icl.unit_price,
  icl.quantity,
  icl.total_price as amount
FROM public.invoices i
INNER JOIN public.riders r ON i.rider_id = r.id
INNER JOIN public.invoice_custom_lines icl ON i.id = icl.invoice_id
WHERE i.id = $1
ORDER BY date, type_ligne;

-- 7. Détail complet d'une facture instructeur
SELECT
  i.invoice_number,
  i.billing_month,
  i.invoice_date,
  i.status,
  e.name as evenement,
  ps.slot_date,
  ps.start_time,
  ps.end_time,
  COUNT(DISTINCT ep.id) FILTER (WHERE ep.is_cancelled = false) as nb_participants,
  bs.unit_price,
  bs.quantity,
  bs.amount
FROM public.invoices i
INNER JOIN public.billed_slots bs ON i.id = bs.invoice_id
INNER JOIN public.planning_slots ps ON bs.planning_slot_id = ps.id
INNER JOIN public.events e ON ps.event_id = e.id
LEFT JOIN public.event_participants ep ON ps.id = ep.planning_slot_id
WHERE i.id = $1
GROUP BY i.invoice_number, i.billing_month, i.invoice_date, i.status,
         e.name, ps.slot_date, ps.start_time, ps.end_time,
         bs.unit_price, bs.quantity, bs.amount
ORDER BY ps.slot_date, ps.start_time;

-- 8. Cavaliers avec éléments non facturés ce mois
SELECT
  r.id,
  r.name,
  COUNT(DISTINCT ep.id) as nb_prestations_non_facturees,
  DATE_TRUNC('month', CURRENT_DATE)::date as mois_concerné
FROM public.riders r
INNER JOIN public.event_participants ep ON r.id = ep.rider_id
INNER JOIN public.planning_slots ps ON ep.planning_slot_id = ps.id
LEFT JOIN public.billed_participants bp ON ep.id = bp.event_participant_id
WHERE
  ep.is_cancelled = false
  AND ps.deleted_at IS NULL
  AND DATE_TRUNC('month', ps.slot_date) = DATE_TRUNC('month', CURRENT_DATE)
  AND bp.id IS NULL
GROUP BY r.id, r.name
HAVING COUNT(DISTINCT ep.id) > 0
ORDER BY nb_prestations_non_facturees DESC;

-- 9. Liste des prix actuellement en vigueur
SELECT
  'Instructeur' as type,
  event_type,
  NULL as categorie,
  price_per_slot as prix,
  valid_from as debut_validite,
  valid_until as fin_validite
FROM public.instructor_pricing
WHERE valid_from <= CURRENT_DATE
  AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)

UNION ALL

SELECT
  'Club' as type,
  event_type,
  pricing_category as categorie,
  price_per_slot as prix,
  valid_from as debut_validite,
  valid_until as fin_validite
FROM public.club_pricing
WHERE valid_from <= CURRENT_DATE
  AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)

ORDER BY type, event_type, categorie;

-- 10. Événements avec surcoûts
SELECT
  event_id,
  name,
  event_type,
  club_surcharge,
  instructor_surcharge,
  club_final_price,
  instructor_final_price,
  surcharge_reason
FROM v_event_pricing_summary
WHERE club_surcharge > 0 OR instructor_surcharge > 0
ORDER BY club_surcharge DESC, instructor_surcharge DESC;
```

---

## Checklist de mise en œuvre

### Phase 1 : Création des tables

- [ ] Exécuter le SQL de création des tables de prix
- [ ] Exécuter le SQL de création des tables de facturation
- [ ] Créer tous les index de performance
- [ ] Modifier la table `events` pour ajouter les colonnes de surcoût

### Phase 2 : Fonctions et vues

- [ ] Créer les 5 fonctions utilitaires
- [ ] Créer les 5 vues principales
- [ ] Tester les fonctions avec des données de test

### Phase 3 : Initialisation des prix

- [ ] Insérer les prix instructeurs
- [ ] Insérer les prix club
- [ ] Insérer les prix packages
- [ ] Créer le catalogue d'éléments personnalisés

### Phase 4 : Tests

- [ ] Tester la création d'une facture club
- [ ] Tester la création d'une facture instructeur
- [ ] Vérifier les calculs de prix avec surcoûts
- [ ] Tester la refacturation a posteriori
- [ ] Vérifier les performances des vues

### Phase 5 : Documentation

- [ ] Documenter le processus de facturation mensuelle
- [ ] Créer des procédures pour le changement de prix
- [ ] Former les utilisateurs sur le statut des factures

---

## Points d'attention

### Performance

- Les index partiels sont critiques pour les requêtes fréquentes
- Les vues matérialisées peuvent être envisagées si le volume augmente
- Penser à VACUUM ANALYZE régulièrement

### Intégrité des données

- Les contraintes UNIQUE empêchent la double facturation
- Les contraintes CHECK garantissent la cohérence des données
- Les DELETE CASCADE simplifient la suppression de factures brouillons

### Évolutions futures possibles

- Génération automatique des numéros de facture
- Trigger pour calculer automatiquement `total_amount` dans `invoices`
- Table d'historique des paiements
- Intégration avec système comptable externe
- Export PDF des factures
