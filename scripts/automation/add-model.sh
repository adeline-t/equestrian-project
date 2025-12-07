#!/bin/bash

# add-model.sh - Bash Model Generator
# Interactive script to generate new data models for the equestrian management system
# Usage: cd scripts && ./add-model.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Project paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
DATABASE_DIR="$PROJECT_ROOT/database"

# Global variables for model info
MODEL_NAME=""
MODEL_NAME_LOWER=""
MODEL_NAME_PLURAL=""
TABLE_NAME=""
DISPLAY_NAME=""
DISPLAY_PLURAL=""
MAIN_EMOJI=""
HAS_ACTIVITY_DATES="false"
NEEDS_CUSTOM_ENDPOINTS="false"
declare -a FIELDS=()

# Function to print colored output
print_color() {
    local color=$1
    shift
    echo -e "${color}$@${NC}"
}

# Function to print section header
print_header() {
    echo ""
    print_color "$CYAN" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    print_color "$CYAN" "$1"
    print_color "$CYAN" "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

# Function to validate PascalCase
validate_pascal_case() {
    local input=$1
    if [[ $input =~ ^[A-Z][a-zA-Z0-9]*$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate snake_case
validate_snake_case() {
    local input=$1
    if [[ $input =~ ^[a-z][a-z0-9_]*$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to convert to snake_case
to_snake_case() {
    echo "$1" | sed 's/\([A-Z]\)/_\L\1/g' | sed 's/^_//'
}

# Function to gather model information
gather_model_info() {
    print_header "🐴 Equestrian Model Generator"
    print_color "$GRAY" "Add new models to your equestrian management system"
    echo ""
    
    print_color "$BLUE" "📋 Model Configuration"
    echo ""
    
    # Get model name
    while true; do
        read -p "Model name (singular, PascalCase, e.g., Instructor, Horse): " MODEL_NAME
        if [ -z "$MODEL_NAME" ]; then
            print_color "$RED" "❌ Model name is required"
            continue
        fi
        if ! validate_pascal_case "$MODEL_NAME"; then
            print_color "$RED" "❌ Model name must be in PascalCase (e.g., Instructor, Horse, Rider)"
            continue
        fi
        break
    done
    
    MODEL_NAME_LOWER=$(echo "$MODEL_NAME" | tr '[:upper:]' '[:lower:]')
    MODEL_NAME_PLURAL="${MODEL_NAME_LOWER}s"
    TABLE_NAME=$(to_snake_case "$MODEL_NAME_LOWER")"s"
    
    # Get display name (French, singular)
    while true; do
        read -p "Display name (French, singular, e.g., Moniteur, Cheval): " DISPLAY_NAME
        if [ -z "$DISPLAY_NAME" ]; then
            print_color "$RED" "❌ Display name is required"
            continue
        fi
        break
    done
    
    # Get display plural (French)
    while true; do
        read -p "Display name (French, plural, e.g., Moniteurs, Chevaux): " DISPLAY_PLURAL
        if [ -z "$DISPLAY_PLURAL" ]; then
            print_color "$RED" "❌ Plural name is required"
            continue
        fi
        break
    done
    
    # Get main emoji
    echo ""
    print_color "$BLUE" "Select main emoji for this model:"
    echo "1) 👤 Person"
    echo "2) 🐴 Horse"
    echo "3) 🏇 Rider"
    echo "4) 🏃 Runner"
    echo "5) 👨‍🏫 Male Teacher"
    echo "6) 👩‍🏫 Female Teacher"
    echo "7) 💰 Money"
    echo "8) 📅 Calendar"
    echo "9) 🏢 Building"
    echo "10) 🎯 Target"
    echo "11) ⭐ Star"
    echo "12) 📝 Note"
    echo "13) 🔧 Tool"
    
    while true; do
        read -p "Choose emoji (1-13): " emoji_choice
        case $emoji_choice in
            1) MAIN_EMOJI="👤"; break;;
            2) MAIN_EMOJI="🐴"; break;;
            3) MAIN_EMOJI="🏇"; break;;
            4) MAIN_EMOJI="🏃"; break;;
            5) MAIN_EMOJI="👨‍🏫"; break;;
            6) MAIN_EMOJI="👩‍🏫"; break;;
            7) MAIN_EMOJI="💰"; break;;
            8) MAIN_EMOJI="📅"; break;;
            9) MAIN_EMOJI="🏢"; break;;
            10) MAIN_EMOJI="🎯"; break;;
            11) MAIN_EMOJI="⭐"; break;;
            12) MAIN_EMOJI="📝"; break;;
            13) MAIN_EMOJI="🔧"; break;;
            *) print_color "$RED" "❌ Invalid choice. Please enter 1-13";;
        esac
    done
    
    # Ask about activity dates
    echo ""
    read -p "Does this model have activity start/end dates? (y/N): " activity_dates
    if [[ $activity_dates =~ ^[Yy]$ ]]; then
        HAS_ACTIVITY_DATES="true"
    fi
    
    # Ask about custom endpoints
    read -p "Does this model need custom API endpoints beyond basic CRUD? (y/N): " custom_endpoints
    if [[ $custom_endpoints =~ ^[Yy]$ ]]; then
        NEEDS_CUSTOM_ENDPOINTS="true"
    fi
}

# Function to gather field information
gather_fields() {
    print_header "📝 Model Fields"
    
    local adding_fields=true
    local field_count=0
    
    while $adding_fields; do
        echo ""
        print_color "$BLUE" "Field #$((field_count + 1))"
        
        # Get field name
        while true; do
            read -p "Field name (snake_case, e.g., first_name, phone_number): " field_name
            if [ -z "$field_name" ]; then
                print_color "$RED" "❌ Field name is required"
                continue
            fi
            if ! validate_snake_case "$field_name"; then
                print_color "$RED" "❌ Field name must be in snake_case"
                continue
            fi
            # Check for duplicates
            local duplicate=false
            for field in "${FIELDS[@]}"; do
                if [[ $field == name:$field_name:* ]]; then
                    print_color "$RED" "❌ Field name already exists"
                    duplicate=true
                    break
                fi
            done
            if $duplicate; then
                continue
            fi
            break
        done
        
        # Get field type
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
        echo "10) enum - VARCHAR(100) with options"
        
        local field_type=""
        while true; do
            read -p "Choose type (1-10): " type_choice
            case $type_choice in
                1) field_type="string"; break;;
                2) field_type="text"; break;;
                3) field_type="integer"; break;;
                4) field_type="decimal"; break;;
                5) field_type="boolean"; break;;
                6) field_type="date"; break;;
                7) field_type="datetime"; break;;
                8) field_type="email"; break;;
                9) field_type="phone"; break;;
                10) field_type="enum"; break;;
                *) print_color "$RED" "❌ Invalid choice";;
            esac
        done
        
        # Get required status
        read -p "Is this field required? (y/N): " is_required
        local required="false"
        if [[ $is_required =~ ^[Yy]$ ]]; then
            required="true"
        fi
        
        # Get unique status
        read -p "Should this field be unique? (y/N): " is_unique
        local unique="false"
        if [[ $is_unique =~ ^[Yy]$ ]]; then
            unique="true"
        fi
        
        # Get default value for certain types
        local default_value=""
        if [[ $field_type == "boolean" || $field_type == "string" ]]; then
            read -p "Default value (leave empty for no default): " default_value
        fi
        
        # Get enum options if type is enum
        local enum_options=""
        if [[ $field_type == "enum" ]]; then
            while true; do
                read -p "Enum options (comma-separated, e.g., Active,Inactive,Pending): " enum_options
                if [ -z "$enum_options" ]; then
                    print_color "$RED" "❌ At least one option is required"
                    continue
                fi
                break
            done
        fi
        
        # Store field info
        FIELDS+=("name:$field_name:type:$field_type:required:$required:unique:$unique:default:$default_value:enum:$enum_options")
        field_count=$((field_count + 1))
        
        # Ask to add another field
        echo ""
        read -p "Add another field? (y/N): " add_more
        if [[ ! $add_more =~ ^[Yy]$ ]]; then
            adding_fields=false
        fi
    done
    
    print_color "$GREEN" "✓ Collected $field_count field(s)"
}

# Function to generate backend handler
generate_backend_handler() {
    local handler_file="$BACKEND_DIR/src/handlers/${MODEL_NAME_LOWER}.js"
    
    print_color "$BLUE" "Generating backend handler: $handler_file"
    
    # Build required fields array
    local required_fields=""
    for field in "${FIELDS[@]}"; do
        IFS=':' read -ra PARTS <<< "$field"
        local fname="${PARTS[1]}"
        local required="${PARTS[5]}"
        if [[ $required == "true" ]]; then
            if [ -z "$required_fields" ]; then
                required_fields="'$fname'"
            else
                required_fields="$required_fields, '$fname'"
            fi
        fi
    done
    
    # Build validation blocks
    local validation_blocks=""
    for field in "${FIELDS[@]}"; do
        IFS=':' read -ra PARTS <<< "$field"
        local fname="${PARTS[1]}"
        local ftype="${PARTS[3]}"
        
        if [[ $ftype == "email" ]]; then
            validation_blocks+="
      // Email validation
      if (body.$fname && !validateEmail(body.$fname)) {
        return jsonResponse({ error: 'Email invalide' }, 400, getSecurityHeaders());
      }
"
        elif [[ $ftype == "phone" ]]; then
            validation_blocks+="
      // Phone validation
      if (body.$fname && !validatePhone(body.$fname)) {
        return jsonResponse({ error: 'Numéro de téléphone invalide' }, 400, getSecurityHeaders());
      }
"
        fi
    done
    
    # Build field assignments for create
    local field_assignments=""
    for field in "${FIELDS[@]}"; do
        IFS=':' read -ra PARTS <<< "$field"
        local fname="${PARTS[1]}"
        local ftype="${PARTS[3]}"
        local fdefault="${PARTS[7]}"
        
        case $ftype in
            string|text|email|phone)
                field_assignments+="        $fname: body.$fname?.trim() || null,\n"
                ;;
            boolean)
                if [ -n "$fdefault" ]; then
                    field_assignments+="        $fname: body.$fname || $fdefault,\n"
                else
                    field_assignments+="        $fname: body.$fname || false,\n"
                fi
                ;;
            integer)
                field_assignments+="        $fname: body.$fname ? parseInt(body.$fname) : null,\n"
                ;;
            decimal)
                field_assignments+="        $fname: body.$fname ? parseFloat(body.$fname) : null,\n"
                ;;
            *)
                field_assignments+="        $fname: body.$fname || null,\n"
                ;;
        esac
    done
    
    # Build field assignments for update
    local update_assignments=""
    for field in "${FIELDS[@]}"; do
        IFS=':' read -ra PARTS <<< "$field"
        local fname="${PARTS[1]}"
        local ftype="${PARTS[3]}"
        
        case $ftype in
            string|text|email|phone)
                update_assignments+="        $fname: body.$fname?.trim() || current${MODEL_NAME}.$fname,\n"
                ;;
            boolean)
                update_assignments+="        $fname: body.$fname !== undefined ? Boolean(body.$fname) : current${MODEL_NAME}.$fname,\n"
                ;;
            integer)
                update_assignments+="        $fname: body.$fname !== undefined ? parseInt(body.$fname) : current${MODEL_NAME}.$fname,\n"
                ;;
            decimal)
                update_assignments+="        $fname: body.$fname !== undefined ? parseFloat(body.$fname) : current${MODEL_NAME}.$fname,\n"
                ;;
            *)
                update_assignments+="        $fname: body.$fname !== undefined ? body.$fname : current${MODEL_NAME}.$fname,\n"
                ;;
        esac
    done
    
    # Create handler file
    cat > "$handler_file" << EOF
import { getDatabase, handleDbError, jsonResponse, validateRequired, checkRateLimit, getSecurityHeaders } from '../db.js';

export async function handle${MODEL_NAME}(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Rate limiting
  if (!checkRateLimit(clientIP, 60, 60000)) {
    return jsonResponse({ error: 'Trop de requêtes' }, 429);
  }

  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 204, getSecurityHeaders());
  }

  try {
    // GET /api/${MODEL_NAME_PLURAL} - List all ${MODEL_NAME_PLURAL}
    if (request.method === 'GET' && pathParts.length === 2) {
      const { data, error } = await db
        .from('${TABLE_NAME}')
        .select('*')
        .order('name');

      if (error) return handleDbError(error);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // GET /api/${MODEL_NAME_PLURAL}/:id - Get single ${MODEL_NAME_LOWER}
    if (request.method === 'GET' && pathParts.length === 3) {
      const id = parseInt(pathParts[2]);
      
      if (isNaN(id)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { data, error } = await db
        .from('${TABLE_NAME}')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return handleDbError(error);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST /api/${MODEL_NAME_PLURAL} - Create ${MODEL_NAME_LOWER}
    if (request.method === 'POST' && pathParts.length === 2) {
      const body = await request.json().catch(() => null);
      
      if (!body) {
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());
      }

      // Validate required fields
      const requiredFields = [$required_fields];
      const missingFields = validateRequired(requiredFields, body);
      if (missingFields) {
        return jsonResponse({ error: \`Champs requis: \${missingFields}\` }, 400, getSecurityHeaders());
      }
$validation_blocks
      const ${MODEL_NAME_LOWER}Data = {
$(echo -e "$field_assignments")      };

      const { data, error } = await db
        .from('${TABLE_NAME}')
        .insert(${MODEL_NAME_LOWER}Data)
        .select()
        .single();

      if (error) return handleDbError(error);
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT /api/${MODEL_NAME_PLURAL}/:id - Update ${MODEL_NAME_LOWER}
    if (request.method === 'PUT' && pathParts.length === 3) {
      const id = parseInt(pathParts[2]);
      const body = await request.json().catch(() => null);
      
      if (isNaN(id) || !body) {
        return jsonResponse({ error: 'ID ou corps de requête invalide' }, 400, getSecurityHeaders());
      }

      // Get current ${MODEL_NAME_LOWER}
      const { data: current${MODEL_NAME}, error: fetchError } = await db
        .from('${TABLE_NAME}')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) return handleDbError(fetchError);
$validation_blocks
      const updateData = {
$(echo -e "$update_assignments")      };

      const { data, error } = await db
        .from('${TABLE_NAME}')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) return handleDbError(error);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE /api/${MODEL_NAME_PLURAL}/:id - Delete ${MODEL_NAME_LOWER}
    if (request.method === 'DELETE' && pathParts.length === 3) {
      const id = parseInt(pathParts[2]);
      
      if (isNaN(id)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { error } = await db
        .from('${TABLE_NAME}')
        .delete()
        .eq('id', id);

      if (error) return handleDbError(error);
      return jsonResponse({ message: '${MODEL_NAME} supprimé avec succès' }, 200, getSecurityHeaders());
    }

    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  } catch (error) {
    console.error('Error in handle${MODEL_NAME}:', error);
    return jsonResponse({ error: 'Erreur serveur interne' }, 500, getSecurityHeaders());
  }
}
EOF
    
    print_color "$GREEN" "✓ Backend handler generated"
}

# Function to generate database migration
generate_database_migration() {
    local timestamp=$(date +%Y%m%d%H%M%S)
    local migration_file="$DATABASE_DIR/migrations/${timestamp}_create_${TABLE_NAME}.sql"
    
    print_color "$BLUE" "Generating database migration: $migration_file"
    
    # Ensure migrations directory exists
    mkdir -p "$DATABASE_DIR/migrations"
    
    # Build column definitions
    local columns=""
    for field in "${FIELDS[@]}"; do
        IFS=':' read -ra PARTS <<< "$field"
        local fname="${PARTS[1]}"
        local ftype="${PARTS[3]}"
        local required="${PARTS[5]}"
        local unique="${PARTS[7]}"
        local fdefault="${PARTS[9]}"
        local enum_opts="${PARTS[11]}"
        
        # Map field type to SQL type
        local sql_type=""
        case $ftype in
            string|email|phone) sql_type="VARCHAR(255)";;
            text) sql_type="TEXT";;
            integer) sql_type="INTEGER";;
            decimal) sql_type="DECIMAL(10,2)";;
            boolean) sql_type="BOOLEAN";;
            date) sql_type="DATE";;
            datetime) sql_type="TIMESTAMP";;
            enum) sql_type="VARCHAR(100)";;
        esac
        
        columns+="    $fname $sql_type"
        
        if [[ $required == "true" ]]; then
            columns+=" NOT NULL"
        fi
        
        if [ -n "$fdefault" ] && [[ $ftype == "boolean" ]]; then
            columns+=" DEFAULT $fdefault"
        elif [ -n "$fdefault" ] && [[ $ftype == "string" ]]; then
            columns+=" DEFAULT '$fdefault'"
        fi
        
        if [[ $unique == "true" ]]; then
            columns+=" UNIQUE"
        fi
        
        columns+=",\n"
    done
    
    # Add activity dates if needed
    local activity_columns=""
    if [[ $HAS_ACTIVITY_DATES == "true" ]]; then
        activity_columns="    activity_start_date DATE,\n    activity_end_date DATE,\n"
    fi
    
    # Build indexes
    local indexes=""
    for field in "${FIELDS[@]}"; do
        IFS=':' read -ra PARTS <<< "$field"
        local fname="${PARTS[1]}"
        local unique="${PARTS[7]}"
        
        if [[ $fname == "name" ]] || [[ $unique == "true" ]]; then
            indexes+="CREATE INDEX idx_${TABLE_NAME}_${fname} ON ${TABLE_NAME}($fname);\n"
        fi
    done
    
    # Create migration file
    cat > "$migration_file" << EOF
-- Migration: Create ${TABLE_NAME} table
-- Generated: $(date +%Y-%m-%d)
-- Model: ${MODEL_NAME}

-- Create table
CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
    id SERIAL PRIMARY KEY,
$(echo -e "$columns")$(echo -e "$activity_columns")    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
$(echo -e "$indexes")
-- Create trigger for updated_at
CREATE TRIGGER update_${TABLE_NAME}_updated_at 
    BEFORE UPDATE ON ${TABLE_NAME}
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE ${TABLE_NAME} IS '${DISPLAY_PLURAL} - ${MODEL_NAME} entities';

-- Sample data (optional - uncomment to use)
-- INSERT INTO ${TABLE_NAME} (name) VALUES ('Sample ${DISPLAY_NAME}');
EOF
    
    print_color "$GREEN" "✓ Database migration generated"
}

# Function to generate frontend List component
generate_frontend_list() {
    local list_file="$FRONTEND_DIR/src/components/${MODEL_NAME_LOWER}/${MODEL_NAME_PLURAL}List.jsx"
    
    print_color "$BLUE" "Generating frontend List component: $list_file"
    
    # Ensure directory exists
    mkdir -p "$FRONTEND_DIR/src/components/${MODEL_NAME_LOWER}"
    
    # Build table headers
    local table_headers=""
    for field in "${FIELDS[@]}"; do
        IFS=':' read -ra PARTS <<< "$field"
        local fname="${PARTS[1]}"
        # Convert snake_case to Title Case
        local display=$(echo "$fname" | sed 's/_/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')
        table_headers+="              <th>$display</th>\n"
    done
    
    # Build table cells
    local table_cells=""
    for field in "${FIELDS[@]}"; do
        IFS=':' read -ra PARTS <<< "$field"
        local fname="${PARTS[1]}"
        local ftype="${PARTS[3]}"
        
        case $ftype in
            boolean)
                table_cells+="              <td>{${MODEL_NAME_LOWER}.$fname ? '✓' : '✗'}</td>\n"
                ;;
            date)
                table_cells+="              <td>{${MODEL_NAME_LOWER}.$fname ? new Date(${MODEL_NAME_LOWER}.$fname).toLocaleDateString('fr-FR') : '-'}</td>\n"
                ;;
            datetime)
                table_cells+="              <td>{${MODEL_NAME_LOWER}.$fname ? new Date(${MODEL_NAME_LOWER}.$fname).toLocaleString('fr-FR') : '-'}</td>\n"
                ;;
            *)
                table_cells+="              <td>{${MODEL_NAME_LOWER}.$fname || '-'}</td>\n"
                ;;
        esac
    done
    
    # Create List component
    cat > "$list_file" << 'EOF'
import React, { useState, useEffect } from 'react';
import { EOF
echo "${MODEL_NAME_PLURAL}Api } from '../../services/api.js';" >> "$list_file"
cat >> "$list_file" << EOF
import ${MODEL_NAME}Form from './${MODEL_NAME}Form.jsx';
import './${MODEL_NAME_LOWER}.css';

function ${MODEL_NAME}List() {
  const [${MODEL_NAME_PLURAL}, set${MODEL_NAME}s] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing${MODEL_NAME}, setEditing${MODEL_NAME}] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    load${MODEL_NAME}s();
  }, []);

  const load${MODEL_NAME}s = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ${MODEL_NAME_PLURAL}Api.getAll();
      set${MODEL_NAME}s(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing${MODEL_NAME}(null);
    setShowModal(true);
  };

  const handleEdit = (${MODEL_NAME_LOWER}) => {
    setEditing${MODEL_NAME}(${MODEL_NAME_LOWER});
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(\`Êtes-vous sûr de vouloir supprimer \${name} ?\`)) {
      return;
    }

    try {
      await ${MODEL_NAME_PLURAL}Api.delete(id);
      setSuccessMessage('${DISPLAY_NAME} supprimé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
      load${MODEL_NAME}s();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormSubmit = async (${MODEL_NAME_LOWER}Data) => {
    try {
      if (editing${MODEL_NAME}) {
        await ${MODEL_NAME_PLURAL}Api.update(editing${MODEL_NAME}.id, ${MODEL_NAME_LOWER}Data);
        setSuccessMessage('${DISPLAY_NAME} modifié avec succès');
      } else {
        await ${MODEL_NAME_PLURAL}Api.create(${MODEL_NAME_LOWER}Data);
        setSuccessMessage('${DISPLAY_NAME} créé avec succès');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      load${MODEL_NAME}s();
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return <div className="loading">Chargement des ${MODEL_NAME_PLURAL}...</div>;
  }

  return (
    <div className="card">
      <div className="flex-between mb-20">
        <h2>${MAIN_EMOJI} Liste des ${DISPLAY_PLURAL}</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          ➕ Nouveau ${DISPLAY_NAME}
        </button>
      </div>

      {successMessage && (
        <div className="alert alert-success mb-20">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-20">
          {error}
        </div>
      )}

      {${MODEL_NAME_PLURAL}.length === 0 ? (
        <div className="empty-state">
          <p>Aucun ${DISPLAY_NAME} trouvé</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            ➕ Créer le premier ${DISPLAY_NAME}
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
$(echo -e "$table_headers")                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {${MODEL_NAME_PLURAL}.map((${MODEL_NAME_LOWER}) => (
                <tr key={${MODEL_NAME_LOWER}.id}>
                  <td>{${MODEL_NAME_LOWER}.id}</td>
$(echo -e "$table_cells")                  <td>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(${MODEL_NAME_LOWER})}
                    >
                      ✏️ Modifier
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(${MODEL_NAME_LOWER}.id, ${MODEL_NAME_LOWER}.name)}
                    >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <${MODEL_NAME}Form
          ${MODEL_NAME_LOWER}={editing${MODEL_NAME}}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default ${MODEL_NAME}List;
EOF
    
    print_color "$GREEN" "✓ Frontend List component generated"
}

# Function to generate frontend Form component
generate_frontend_form() {
    local form_file="$FRONTEND_DIR/src/components/${MODEL_NAME_LOWER}/${MODEL_NAME}Form.jsx"
    
    print_color "$BLUE" "Generating frontend Form component: $form_file"
    
    # Build initial form state
    local initial_state=""
    for field in "${FIELDS[@]}"; do
        IFS=':' read -ra PARTS <<< "$field"
        local fname="${PARTS[1]}"
        local ftype="${PARTS[3]}"
        local fdefault="${PARTS[9]}"
        
        case $ftype in
            boolean)
                initial_state+="    $fname: ${fdefault:-false},\n"
                ;;
            integer|decimal)
                initial_state+="    $fname: '',\n"
                ;;
            *)
                initial_state+="    $fname: '',\n"
                ;;
        esac
    done
    
    # Build form fields
    local form_fields=""
    for field in "${FIELDS[@]}"; do
        IFS=':' read -ra PARTS <<< "$field"
        local fname="${PARTS[1]}"
        local ftype="${PARTS[3]}"
        local required="${PARTS[5]}"
        local enum_opts="${PARTS[11]}"
        
        # Convert snake_case to Title Case
        local label=$(echo "$fname" | sed 's/_/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')
        
        local required_attr=""
        if [[ $required == "true" ]]; then
            required_attr=" required"
        fi
        
        case $ftype in
            text)
                form_fields+="        <div className=&quot;form-group&quot;>\n"
                form_fields+="          <label htmlFor=&quot;$fname&quot;>$label</label>\n"
                form_fields+="          <textarea\n"
                form_fields+="            id=&quot;$fname&quot;\n"
                form_fields+="            value={formData.$fname}\n"
                form_fields+="            onChange={(e) => setFormData({ ...formData, $fname: e.target.value })}\n"
                form_fields+="            rows=&quot;4&quot;$required_attr\n"
                form_fields+="          />\n"
                form_fields+="        </div>\n\n"
                ;;
            boolean)
                form_fields+="        <div className=&quot;form-group&quot;>\n"
                form_fields+="          <label>\n"
                form_fields+="            <input\n"
                form_fields+="              type=&quot;checkbox&quot;\n"
                form_fields+="              checked={formData.$fname}\n"
                form_fields+="              onChange={(e) => setFormData({ ...formData, $fname: e.target.checked })}\n"
                form_fields+="            />\n"
                form_fields+="            $label\n"
                form_fields+="          </label>\n"
                form_fields+="        </div>\n\n"
                ;;
            enum)
                form_fields+="        <div className=&quot;form-group&quot;>\n"
                form_fields+="          <label htmlFor=&quot;$fname&quot;>$label</label>\n"
                form_fields+="          <select\n"
                form_fields+="            id=&quot;$fname&quot;\n"
                form_fields+="            value={formData.$fname}\n"
                form_fields+="            onChange={(e) => setFormData({ ...formData, $fname: e.target.value })}$required_attr\n"
                form_fields+="          >\n"
                form_fields+="            <option value=&quot;&quot;>Sélectionner...</option>\n"
                IFS=',' read -ra OPTIONS <<< "$enum_opts"
                for opt in "${OPTIONS[@]}"; do
                    opt=$(echo "$opt" | xargs)  # trim whitespace
                    form_fields+="            <option value=&quot;$opt&quot;>$opt</option>\n"
                done
                form_fields+="          </select>\n"
                form_fields+="        </div>\n\n"
                ;;
            date)
                form_fields+="        <div className=&quot;form-group&quot;>\n"
                form_fields+="          <label htmlFor=&quot;$fname&quot;>$label</label>\n"
                form_fields+="          <input\n"
                form_fields+="            type=&quot;date&quot;\n"
                form_fields+="            id=&quot;$fname&quot;\n"
                form_fields+="            value={formData.$fname}\n"
                form_fields+="            onChange={(e) => setFormData({ ...formData, $fname: e.target.value })}$required_attr\n"
                form_fields+="          />\n"
                form_fields+="        </div>\n\n"
                ;;
            datetime)
                form_fields+="        <div className=&quot;form-group&quot;>\n"
                form_fields+="          <label htmlFor=&quot;$fname&quot;>$label</label>\n"
                form_fields+="          <input\n"
                form_fields+="            type=&quot;datetime-local&quot;\n"
                form_fields+="            id=&quot;$fname&quot;\n"
                form_fields+="            value={formData.$fname}\n"
                form_fields+="            onChange={(e) => setFormData({ ...formData, $fname: e.target.value })}$required_attr\n"
                form_fields+="          />\n"
                form_fields+="        </div>\n\n"
                ;;
            integer|decimal)
                form_fields+="        <div className=&quot;form-group&quot;>\n"
                form_fields+="          <label htmlFor=&quot;$fname&quot;>$label</label>\n"
                form_fields+="          <input\n"
                form_fields+="            type=&quot;number&quot;\n"
                if [[ $ftype == "decimal" ]]; then
                    form_fields+="            step=&quot;0.01&quot;\n"
                fi
                form_fields+="            id=&quot;$fname&quot;\n"
                form_fields+="            value={formData.$fname}\n"
                form_fields+="            onChange={(e) => setFormData({ ...formData, $fname: e.target.value })}$required_attr\n"
                form_fields+="          />\n"
                form_fields+="        </div>\n\n"
                ;;
            email)
                form_fields+="        <div className=&quot;form-group&quot;>\n"
                form_fields+="          <label htmlFor=&quot;$fname&quot;>$label</label>\n"
                form_fields+="          <input\n"
                form_fields+="            type=&quot;email&quot;\n"
                form_fields+="            id=&quot;$fname&quot;\n"
                form_fields+="            value={formData.$fname}\n"
                form_fields+="            onChange={(e) => setFormData({ ...formData, $fname: e.target.value })}$required_attr\n"
                form_fields+="          />\n"
                form_fields+="        </div>\n\n"
                ;;
            phone)
                form_fields+="        <div className=&quot;form-group&quot;>\n"
                form_fields+="          <label htmlFor=&quot;$fname&quot;>$label</label>\n"
                form_fields+="          <input\n"
                form_fields+="            type=&quot;tel&quot;\n"
                form_fields+="            id=&quot;$fname&quot;\n"
                form_fields+="            value={formData.$fname}\n"
                form_fields+="            onChange={(e) => setFormData({ ...formData, $fname: e.target.value })}$required_attr\n"
                form_fields+="          />\n"
                form_fields+="        </div>\n\n"
                ;;
            *)
                form_fields+="        <div className=&quot;form-group&quot;>\n"
                form_fields+="          <label htmlFor=&quot;$fname&quot;>$label</label>\n"
                form_fields+="          <input\n"
                form_fields+="            type=&quot;text&quot;\n"
                form_fields+="            id=&quot;$fname&quot;\n"
                form_fields+="            value={formData.$fname}\n"
                form_fields+="            onChange={(e) => setFormData({ ...formData, $fname: e.target.value })}$required_attr\n"
                form_fields+="          />\n"
                form_fields+="        </div>\n\n"
                ;;
        esac
    done
    
    # Create Form component
    cat > "$form_file" << EOF
import React, { useState, useEffect } from 'react';
import './${MODEL_NAME_LOWER}.css';

function ${MODEL_NAME}Form({ ${MODEL_NAME_LOWER}, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
$(echo -e "$initial_state")  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (${MODEL_NAME_LOWER}) {
      setFormData({
        ...${MODEL_NAME_LOWER}
      });
    }
  }, [${MODEL_NAME_LOWER}]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{${MODEL_NAME_LOWER} ? 'Modifier' : 'Nouveau'} ${DISPLAY_NAME}</h3>
          <button className="btn-close" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-error mb-20">
                {error}
              </div>
            )}

$(echo -e "$form_fields")          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
              disabled={submitting}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ${MODEL_NAME}Form;
EOF
    
    print_color "$GREEN" "✓ Frontend Form component generated"
}

# Function to generate CSS styles
generate_styles() {
    local css_file="$FRONTEND_DIR/src/components/${MODEL_NAME_LOWER}/${MODEL_NAME_LOWER}.css"
    
    print_color "$BLUE" "Generating styles: $css_file"
    
    cat > "$css_file" << 'EOF'
/* Model-specific styles */

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.empty-state p {
  margin-bottom: 20px;
  font-size: 16px;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.data-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
}

.data-table tbody tr:hover {
  background-color: #f9f9f9;
}

.data-table td button {
  margin-right: 8px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"],
.form-group input[type="number"],
.form-group input[type="date"],
.form-group input[type="datetime-local"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.form-group input[type="checkbox"] {
  margin-right: 8px;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.alert {
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}
EOF
    
    print_color "$GREEN" "✓ Styles generated"
}

# Function to update API service
update_api_service() {
    local api_file="$FRONTEND_DIR/src/services/api.js"
    
    print_color "$BLUE" "Updating API service: $api_file"
    
    if [ ! -f "$api_file" ]; then
        print_color "$YELLOW" "⚠️  API service file not found, skipping"
        return
    fi
    
    # Check if export already exists
    if grep -q "export const ${MODEL_NAME_PLURAL}Api" "$api_file"; then
        print_color "$YELLOW" "⚠️  API export already exists, skipping"
        return
    fi
    
    # Add the export before associationsApi
    sed -i.bak "/export const associationsApi/i\\
export const ${MODEL_NAME_PLURAL}Api = createCrudApi('${MODEL_NAME_PLURAL}');\\
" "$api_file"
    
    rm -f "${api_file}.bak"
    
    print_color "$GREEN" "✓ API service updated"
}

# Function to update backend router
update_backend_router() {
    local router_file="$BACKEND_DIR/src/index.js"
    
    print_color "$BLUE" "Updating backend router: $router_file"
    
    if [ ! -f "$router_file" ]; then
        print_color "$YELLOW" "⚠️  Backend router file not found, skipping"
        return
    fi
    
    # Check if import already exists
    if grep -q "handle${MODEL_NAME}" "$router_file"; then
        print_color "$YELLOW" "⚠️  Handler import already exists, skipping"
        return
    fi
    
    # Add import after associations import
    sed -i.bak "/import { handleAssociations }/a\\
import { handle${MODEL_NAME} } from './handlers/${MODEL_NAME_LOWER}.js';
" "$router_file"
    
    # Add route handler before associations route
    sed -i.bak "/if (path.startsWith('\/api\/associations'))/i\\
    if (path.startsWith('/api/${MODEL_NAME_PLURAL}')) {\\
      return handle${MODEL_NAME}(request, env);\\
    }\\

" "$router_file"
    
    rm -f "${router_file}.bak"
    
    print_color "$GREEN" "✓ Backend router updated"
}

# Function to show next steps
show_next_steps() {
    print_header "✅ Model Generation Complete!"
    
    print_color "$CYAN" "📋 Next steps:"
    echo ""
    
    print_color "$WHITE" "1. Database Migration:"
    print_color "$GRAY" "   - Open Supabase SQL Editor"
    print_color "$GRAY" "   - Run the migration file: database/migrations/*_create_${TABLE_NAME}.sql"
    echo ""
    
    print_color "$WHITE" "2. Frontend Routing:"
    print_color "$GRAY" "   - Add route to your App.jsx:"
    print_color "$YELLOW" "     <Route path=&quot;/${MODEL_NAME_PLURAL}&quot; element={<${MODEL_NAME}List />} />"
    print_color "$GRAY" "   - Import the component:"
    print_color "$YELLOW" "     import ${MODEL_NAME}List from './components/${MODEL_NAME_LOWER}/${MODEL_NAME_PLURAL}List.jsx';"
    echo ""
    
    print_color "$WHITE" "3. Navigation:"
    print_color "$GRAY" "   - Add navigation link to your menu"
    print_color "$GRAY" "   - Use emoji: $MAIN_EMOJI"
    echo ""
    
    print_color "$WHITE" "4. Testing:"
    print_color "$GRAY" "   - Test the API endpoints"
    print_color "$GRAY" "   - Verify frontend functionality"
    print_color "$GRAY" "   - Check form validation"
    echo ""
    
    print_color "$GREEN" "🎉 Your new $DISPLAY_NAME model is ready!"
    echo ""
}

# Main execution
main() {
    # Check if we're in the scripts directory
    if [ ! -f "$SCRIPT_DIR/add-model.sh" ]; then
        print_color "$RED" "❌ Error: This script must be run from the scripts directory"
        print_color "$GRAY" "   cd scripts && ./add-model.sh"
        exit 1
    fi
    
    # Gather information
    gather_model_info
    gather_fields
    
    # Generate files
    print_header "🔨 Generating Files"
    
    # Ensure directories exist
    mkdir -p "$BACKEND_DIR/src/handlers"
    mkdir -p "$FRONTEND_DIR/src/components"
    mkdir -p "$FRONTEND_DIR/src/types"
    mkdir -p "$DATABASE_DIR/migrations"
    
    # Generate all files
    generate_backend_handler
    generate_database_migration
    generate_frontend_list
    generate_frontend_form
    generate_styles
    
    # Update project files
    print_header "🔄 Updating Project Files"
    update_api_service
    update_backend_router
    
    # Show next steps
    show_next_steps
}

# Run main function
main