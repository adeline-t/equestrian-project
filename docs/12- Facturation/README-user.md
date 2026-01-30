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

## Points d'attention

- Génération automatique des numéros de facture
- Trigger pour calculer automatiquement `total_amount` dans `invoices`
- Table d'historique des paiements
- Intégration avec système comptable externe
- Export PDF des factures
