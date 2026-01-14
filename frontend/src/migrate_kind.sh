#!/bin/bash

# Script pour trouver toutes les occurrences de "kind" à remplacer
# Utilisation: bash find-kind-references.sh

echo "🔍 Recherche de toutes les références à 'kind' dans le code..."
echo ""

echo "=========================================="
echo "1. rider.kind (à remplacer par rider.rider_type)"
echo "=========================================="
grep -rn "rider\.kind" src/ --include="*.js" --include="*.jsx" | grep -v "getRiderKindLabel" | grep -v "badge-kind"

echo ""
echo "=========================================="
echo "2. formData.kind (à remplacer par formData.rider_type)"
echo "=========================================="
grep -rn "formData\.kind" src/ --include="*.js" --include="*.jsx"

echo ""
echo "=========================================="
echo "3. name=\"kind\" (à remplacer par name=\"rider_type\")"
echo "=========================================="
grep -rn 'name="kind"' src/ --include="*.js" --include="*.jsx"

echo ""
echo "=========================================="
echo "4. id=\"kind\" (à remplacer par id=\"rider_type\")"
echo "=========================================="
grep -rn 'id="kind"' src/ --include="*.js" --include="*.jsx"

echo ""
echo "=========================================="
echo "5. PropTypes avec kind"
echo "=========================================="
grep -rn "kind: PropTypes" src/ --include="*.js" --include="*.jsx"

echo ""
echo "=========================================="
echo "6. Objets avec propriété kind"
echo "=========================================="
grep -rn "kind:" src/ --include="*.js" --include="*.jsx" | grep -v "// kind:" | grep -v "getRiderKind" | grep -v "badge-kind"

echo ""
echo "=========================================="
echo "7. Déstructuration avec kind"
echo "=========================================="
grep -rn "{ kind" src/ --include="*.js" --include="*.jsx" | grep -v "getRiderKind"

echo ""
echo "✅ Recherche terminée !"
echo ""
echo "💡 Conseil: Examinez chaque ligne et remplacez 'kind' par 'rider_type' si approprié"