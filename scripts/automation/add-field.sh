#!/bin/bash

# add-field.sh - Simple Field Addition Helper
# Adds a single field to an existing model
# Usage: ./scripts/add-field.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m'

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Print functions
print_color() {
    local color=$1
    shift
    echo -e "${color}$@${NC}"
}

print_header() {
    echo ""
    print_color "$CYAN" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    print_color "$CYAN" "$1"
    print_color "$CYAN" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

# Validation functions
validate_snake_case() {
    local input=$1
    if [[ $input =~ ^[a-z][a-z0-9_]*$ ]]; then
        return 0
    else
        return 1
    fi
}

# Main function
main() {
    print_header "➕ Add Field to Existing Model"
    print_color "$GRAY" "Simple helper to add a single field to an existing model"
    echo ""
    
    # Check if handlers directory exists
    local handlers_dir="$PROJECT_ROOT/backend/src/handlers"
    if [ ! -d "$handlers_dir" ]; then
        print_color "$RED" "❌ Handlers directory not found: $handlers_dir"
        exit 1
    fi
    
    # List existing models
    print_color "$BLUE" "Available models:"
    local models=($(ls "$handlers_dir"/*.js 2>/dev/null | xargs -n1 basename | sed 's/.js$//' | grep -v "^index$"))
    
    if [ ${#models[@]} -eq 0 ]; then
        print_color "$RED" "❌ No models found in $handlers_dir"
        exit 1
    fi
    
    local i=1
    for model in "${models[@]}"; do
        echo "$i) $model"
        i=$((i + 1))
    done
    echo ""
    
    # Select model
    local model_choice
    while true; do
        read -p "Select model (1-${#models[@]}): " model_choice
        if [[ $model_choice =~ ^[0-9]+$ ]] && [ "$model_choice" -ge 1 ] && [ "$model_choice" -le "${#models[@]}" ]; then
            break
        fi
        print_color "$RED" "❌ Invalid choice. Please enter 1-${#models[@]}"
    done
    
    local model_name="${models[$((model_choice - 1))]}"
    local table_name="${model_name}s"
    
    print_color "$GREEN" "✓ Selected model: $model_name"
    echo ""
    
    # Get field information
    print_color "$BLUE" "Field Information"
    echo ""
    
    # Field name
    local field_name
    while true; do
        read -p "Field name (snake_case, e.g., phone_number): " field_name
        if [ -z "$field_name" ]; then
            print_color "$RED" "❌ Field name is required"
            continue
        fi
        if ! validate_snake_case "$field_name"; then
            print_color "$RED" "❌ Field name must be in snake_case"
            continue
        fi
        break
    done
    
    # Field type
    echo ""
    print_color "$BLUE" "Select field type:"
    echo "1) string - VARCHAR(255)"
    echo "2) text - TEXT (long text)"
    echo "3) integer - INTEGER"
    echo "4) decimal - DECIMAL(10,2)"
    echo "5) boolean - BOOLEAN"
    echo "6) date - DATE"
    echo "7) datetime - TIMESTAMP"
    echo "8) email - VARCHAR(255) with validation"
    echo "9) phone - VARCHAR(50) with validation"
    
    local field_type
    while true; do
        read -p "Choose type (1-9): " type_choice
        case $type_choice in
            1) field_type="string"; sql_type="VARCHAR(255)"; break;;
            2) field_type="text"; sql_type="TEXT"; break;;
            3) field_type="integer"; sql_type="INTEGER"; break;;
            4) field_type="decimal"; sql_type="DECIMAL(10,2)"; break;;
            5) field_type="boolean"; sql_type="BOOLEAN"; break;;
            6) field_type="date"; sql_type="DATE"; break;;
            7) field_type="datetime"; sql_type="TIMESTAMP"; break;;
            8) field_type="email"; sql_type="VARCHAR(255)"; break;;
            9) field_type="phone"; sql_type="VARCHAR(50)"; break;;
            *) print_color "$RED" "❌ Invalid choice";;
        esac
    done
    
    # Required?
    read -p "Is this field required? (y/N): " is_required
    local required="false"
    local sql_required=""
    if [[ $is_required =~ ^[Yy]$ ]]; then
        required="true"
        sql_required=" NOT NULL"
    fi
    
    # Default value
    local default_value=""
    local sql_default=""
    if [[ $field_type == "boolean" ]]; then
        read -p "Default value (true/false, leave empty for false): " default_value
        if [ -n "$default_value" ]; then
            sql_default=" DEFAULT $default_value"
        else
            sql_default=" DEFAULT false"
        fi
    elif [[ $field_type == "string" ]]; then
        read -p "Default value (leave empty for no default): " default_value
        if [ -n "$default_value" ]; then
            sql_default=" DEFAULT '$default_value'"
        fi
    fi
    
    # Generate migration
    print_header "📝 Generating Migration"
    
    local timestamp=$(date +%Y%m%d%H%M%S)
    local migration_file="$PROJECT_ROOT/database/migrations/${timestamp}_add_${field_name}_to_${table_name}.sql"
    
    mkdir -p "$PROJECT_ROOT/database/migrations"
    
    cat > "$migration_file" << EOF
-- Migration: Add ${field_name} to ${table_name}
-- Generated: $(date +%Y-%m-%d)
-- Field: ${field_name} (${field_type})

-- Add column
ALTER TABLE ${table_name}
ADD COLUMN ${field_name} ${sql_type}${sql_required}${sql_default};

-- Add comment
COMMENT ON COLUMN ${table_name}.${field_name} IS 'Added via add-field.sh';

-- Create index if needed (uncomment if field should be indexed)
-- CREATE INDEX idx_${table_name}_${field_name} ON ${table_name}(${field_name});
EOF
    
    print_color "$GREEN" "✓ Migration generated: $migration_file"
    
    # Generate handler update instructions
    print_header "🔧 Handler Update Instructions"
    
    print_color "$YELLOW" "Add the following to your handler file:"
    print_color "$GRAY" "File: backend/src/handlers/${model_name}.js"
    echo ""
    
    # Generate field assignment
    local assignment=""
    case $field_type in
        string|text|email|phone)
            assignment="        ${field_name}: body.${field_name}?.trim() || null,"
            ;;
        boolean)
            assignment="        ${field_name}: body.${field_name} || false,"
            ;;
        integer)
            assignment="        ${field_name}: body.${field_name} ? parseInt(body.${field_name}) : null,"
            ;;
        decimal)
            assignment="        ${field_name}: body.${field_name} ? parseFloat(body.${field_name}) : null,"
            ;;
        *)
            assignment="        ${field_name}: body.${field_name} || null,"
            ;;
    esac
    
    print_color "$CYAN" "1. In the POST handler, add to field assignments:"
    echo ""
    print_color "$GRAY" "$assignment"
    echo ""
    
    print_color "$CYAN" "2. In the PUT handler, add to update assignments:"
    echo ""
    local update_assignment=""
    case $field_type in
        string|text|email|phone)
            update_assignment="        ${field_name}: body.${field_name}?.trim() || current${model_name^}.${field_name},"
            ;;
        boolean)
            update_assignment="        ${field_name}: body.${field_name} !== undefined ? Boolean(body.${field_name}) : current${model_name^}.${field_name},"
            ;;
        integer)
            update_assignment="        ${field_name}: body.${field_name} !== undefined ? parseInt(body.${field_name}) : current${model_name^}.${field_name},"
            ;;
        decimal)
            update_assignment="        ${field_name}: body.${field_name} !== undefined ? parseFloat(body.${field_name}) : current${model_name^}.${field_name},"
            ;;
        *)
            update_assignment="        ${field_name}: body.${field_name} !== undefined ? body.${field_name} : current${model_name^}.${field_name},"
            ;;
    esac
    print_color "$GRAY" "$update_assignment"
    echo ""
    
    # Validation if needed
    if [[ $field_type == "email" ]]; then
        print_color "$CYAN" "3. Add email validation:"
        echo ""
        print_color "$GRAY" "      if (body.${field_name} && !validateEmail(body.${field_name})) {"
        print_color "$GRAY" "        return jsonResponse({ error: 'Email invalide' }, 400, getSecurityHeaders());"
        print_color "$GRAY" "      }"
        echo ""
    elif [[ $field_type == "phone" ]]; then
        print_color "$CYAN" "3. Add phone validation:"
        echo ""
        print_color "$GRAY" "      if (body.${field_name} && !validatePhone(body.${field_name})) {"
        print_color "$GRAY" "        return jsonResponse({ error: 'Numéro de téléphone invalide' }, 400, getSecurityHeaders());"
        print_color "$GRAY" "      }"
        echo ""
    fi
    
    # Generate form field
    print_header "🎨 Frontend Form Update"
    
    print_color "$YELLOW" "Add the following to your form component:"
    print_color "$GRAY" "File: frontend/src/components/${model_name}/${model_name^}Form.jsx"
    echo ""
    
    # Convert snake_case to Title Case
    local label=$(echo "$field_name" | sed 's/_/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')
    
    print_color "$CYAN" "1. Add to initial state:"
    echo ""
    print_color "$GRAY" "    ${field_name}: '',"
    echo ""
    
    print_color "$CYAN" "2. Add form field:"
    echo ""
    
    case $field_type in
        text)
            cat << EOF | while IFS= read -r line; do print_color "$GRAY" "$line"; done
        <div className="form-group">
          <label htmlFor="${field_name}">${label}</label>
          <textarea
            id="${field_name}"
            value={formData.${field_name}}
            onChange={(e) => setFormData({ ...formData, ${field_name}: e.target.value })}
            rows="4"
          />
        </div>
EOF
            ;;
        boolean)
            cat << EOF | while IFS= read -r line; do print_color "$GRAY" "$line"; done
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.${field_name}}
              onChange={(e) => setFormData({ ...formData, ${field_name}: e.target.checked })}
            />
            ${label}
          </label>
        </div>
EOF
            ;;
        date)
            cat << EOF | while IFS= read -r line; do print_color "$GRAY" "$line"; done
        <div className="form-group">
          <label htmlFor="${field_name}">${label}</label>
          <input
            type="date"
            id="${field_name}"
            value={formData.${field_name}}
            onChange={(e) => setFormData({ ...formData, ${field_name}: e.target.value })}
          />
        </div>
EOF
            ;;
        datetime)
            cat << EOF | while IFS= read -r line; do print_color "$GRAY" "$line"; done
        <div className="form-group">
          <label htmlFor="${field_name}">${label}</label>
          <input
            type="datetime-local"
            id="${field_name}"
            value={formData.${field_name}}
            onChange={(e) => setFormData({ ...formData, ${field_name}: e.target.value })}
          />
        </div>
EOF
            ;;
        integer|decimal)
            cat << EOF | while IFS= read -r line; do print_color "$GRAY" "$line"; done
        <div className="form-group">
          <label htmlFor="${field_name}">${label}</label>
          <input
            type="number"
$([ "$field_type" = "decimal" ] && echo "            step=&quot;0.01&quot;")
            id="${field_name}"
            value={formData.${field_name}}
            onChange={(e) => setFormData({ ...formData, ${field_name}: e.target.value })}
          />
        </div>
EOF
            ;;
        email)
            cat << EOF | while IFS= read -r line; do print_color "$GRAY" "$line"; done
        <div className="form-group">
          <label htmlFor="${field_name}">${label}</label>
          <input
            type="email"
            id="${field_name}"
            value={formData.${field_name}}
            onChange={(e) => setFormData({ ...formData, ${field_name}: e.target.value })}
          />
        </div>
EOF
            ;;
        phone)
            cat << EOF | while IFS= read -r line; do print_color "$GRAY" "$line"; done
        <div className="form-group">
          <label htmlFor="${field_name}">${label}</label>
          <input
            type="tel"
            id="${field_name}"
            value={formData.${field_name}}
            onChange={(e) => setFormData({ ...formData, ${field_name}: e.target.value })}
          />
        </div>
EOF
            ;;
        *)
            cat << EOF | while IFS= read -r line; do print_color "$GRAY" "$line"; done
        <div className="form-group">
          <label htmlFor="${field_name}">${label}</label>
          <input
            type="text"
            id="${field_name}"
            value={formData.${field_name}}
            onChange={(e) => setFormData({ ...formData, ${field_name}: e.target.value })}
          />
        </div>
EOF
            ;;
    esac
    
    echo ""
    
    # List component update
    print_header "📋 Frontend List Update"
    
    print_color "$YELLOW" "Add the following to your list component:"
    print_color "$GRAY" "File: frontend/src/components/${model_name}/${model_name^}sList.jsx"
    echo ""
    
    print_color "$CYAN" "1. Add table header:"
    echo ""
    print_color "$GRAY" "              <th>${label}</th>"
    echo ""
    
    print_color "$CYAN" "2. Add table cell:"
    echo ""
    case $field_type in
        boolean)
            print_color "$GRAY" "              <td>{${model_name}.${field_name} ? '✓' : '✗'}</td>"
            ;;
        date)
            print_color "$GRAY" "              <td>{${model_name}.${field_name} ? new Date(${model_name}.${field_name}).toLocaleDateString('fr-FR') : '-'}</td>"
            ;;
        datetime)
            print_color "$GRAY" "              <td>{${model_name}.${field_name} ? new Date(${model_name}.${field_name}).toLocaleString('fr-FR') : '-'}</td>"
            ;;
        *)
            print_color "$GRAY" "              <td>{${model_name}.${field_name} || '-'}</td>"
            ;;
    esac
    
    echo ""
    
    # Next steps
    print_header "✅ Next Steps"
    
    print_color "$CYAN" "1. Apply the database migration:"
    print_color "$GRAY" "   - Open Supabase SQL Editor"
    print_color "$GRAY" "   - Run the migration file: $migration_file"
    echo ""
    
    print_color "$CYAN" "2. Update the backend handler:"
    print_color "$GRAY" "   - Follow the instructions above"
    print_color "$GRAY" "   - Add field assignments to POST and PUT handlers"
    print_color "$GRAY" "   - Add validation if needed"
    echo ""
    
    print_color "$CYAN" "3. Update the frontend components:"
    print_color "$GRAY" "   - Add field to form component"
    print_color "$GRAY" "   - Add column to list component"
    echo ""
    
    print_color "$CYAN" "4. Test the changes:"
    print_color "$GRAY" "   - Start the development server"
    print_color "$GRAY" "   - Test creating/editing records"
    print_color "$GRAY" "   - Verify the new field works correctly"
    echo ""
    
    print_color "$GREEN" "🎉 Field addition guide complete!"
    echo ""
}

# Run main
main