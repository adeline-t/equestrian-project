#!/bin/bash

# Supabase Setup Script
# This script helps set up Supabase projects for dev and prod environments

set -e

echo "🔧 Supabase Setup Script"
echo "This script will guide you through setting up Supabase projects"
echo ""

# Function to create Supabase project
create_supabase_project() {
    local env_name=$1
    local project_name=$2
    
    echo ""
    echo "📝 Setting up $env_name Supabase project..."
    echo ""
    echo "Please follow these steps:"
    echo "1. Go to https://supabase.com/dashboard"
    echo "2. Sign in or create an account"
    echo "3. Click 'New Project'"
    echo "4. Use these settings:"
    echo "   - Organization: Your organization name"
    echo "   - Project Name: $project_name"
    echo "   - Database Password: Generate a strong password"
    echo "   - Region: Choose your closest region"
    echo ""
    echo "5. After creating the project, copy these values:"
    echo ""
    
    read -p "Enter Project URL (e.g., https://abcdefg.supabase.co): " project_url
    read -p "Enter Anon Key: " anon_key
    read -p "Enter Service Role Key: " service_role_key
    
    # Save to environment file
    local env_file
    case $env_name in
        "Development")
            env_file="frontend/.env.dev"
            ;;
        "Production")
            env_file="frontend/.env.prod"
            ;;
    esac
    
    # Update frontend environment file
    sed -i.bak "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=$project_url|g" "$env_file"
    sed -i.bak "s|VITE_SUPABASE_ANON_KEY=.*|VITE_SUPABASE_ANON_KEY=$anon_key|g" "$env_file"
    
    # Update backend environment file
    local backend_env_file
    case $env_name in
        "Development")
            backend_env_file="backend/.env.dev"
            ;;
        "Production")
            backend_env_file="backend/.env.prod"
            ;;
    esac
    
    sed -i.bak "s|SUPABASE_URL=.*|SUPABASE_URL=$project_url|g" "$backend_env_file"
    sed -i.bak "s|SUPABASE_ANON_KEY=.*|SUPABASE_ANON_KEY=$anon_key|g" "$backend_env_file"
    sed -i.bak "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=$service_role_key|g" "$backend_env_file"
    
    echo "✅ $env_name Supabase configuration updated"
    echo "   Frontend: $env_file"
    echo "   Backend: $backend_env_file"
}

# Function to setup database schema
setup_database_schema() {
    local env_name=$1
    
    echo ""
    echo "🗄️ Setting up database schema for $env_name..."
    echo ""
    echo "Please run these SQL commands in your Supabase SQL Editor:"
    echo ""
    
    cat << 'EOF'
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create riders table
CREATE TABLE IF NOT EXISTS riders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id)
);

-- Create horses table
CREATE TABLE IF NOT EXISTS horses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    kind VARCHAR(100) NOT NULL,
    is_owned_by_laury BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id)
);

-- Create associations table
CREATE TABLE IF NOT EXISTS associations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
    horse_id UUID NOT NULL REFERENCES horses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_associated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE(rider_id, horse_id)
);

-- Enable Row Level Security
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE associations ENABLE ROW LEVEL SECURITY;

EOF
    
    if [ "$env_name" = "Development" ]; then
        cat << 'EOF'
-- Development RLS Policies (permissive)
CREATE POLICY "Dev - All operations on riders" ON riders
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Dev - All operations on horses" ON horses
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Dev - All operations on associations" ON associations
    FOR ALL USING (true) WITH CHECK (true);

EOF
    else
        cat << 'EOF'
-- Production RLS Policies (restrictive)
CREATE POLICY "Users can read riders" ON riders
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert riders" ON riders
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own riders" ON riders
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own riders" ON riders
    FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Users can read horses" ON horses
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert horses" ON horses
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own horses" ON horses
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own horses" ON horses
    FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Users can read associations" ON associations
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert associations" ON associations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own associations" ON associations
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own associations" ON associations
    FOR DELETE USING (auth.uid() = created_by);

EOF
    fi
    
    echo "✅ Copy and run these SQL commands in your Supabase SQL Editor"
}

# Main setup function
main() {
    echo "This script will help you set up Supabase for both dev and prod environments"
    echo ""
    
    # Setup Development
    echo "1. Setting up Development Environment"
    create_supabase_project "Development" "equestrian-dev"
    setup_database_schema "Development"
    
    echo ""
    read -p "Press Enter to continue with Production setup..."
    
    # Setup Production
    echo ""
    echo "2. Setting up Production Environment"
    create_supabase_project "Production" "equestrian-prod"
    setup_database_schema "Production"
    
    echo ""
    echo "🎉 Supabase setup completed!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Test both environments"
    echo "2. Configure your custom domains"
    echo "3. Set up authentication providers"
    echo ""
}

# Run the setup
main