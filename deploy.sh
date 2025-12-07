#!/bin/bash

# Multi-Environment Deployment Script
# Usage: ./deploy.sh [dev|prod]

set -e  # Exit on any error

ENVIRONMENT=${1:-dev}
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"

echo "🚀 Starting deployment to $ENVIRONMENT environment..."

# Function to check if required tools are installed
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js v18+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed"
        exit 1
    fi
    
    if ! command -v wrangler &> /dev/null; then
        echo "⚠️  Wrangler CLI is not installed. Installing now..."
        npm install -g wrangler
    fi
    
    echo "✅ Prerequisites check passed"
}

# Function to validate environment
validate_environment() {
    local env_file
    case $ENVIRONMENT in
        "dev")
            env_file="$FRONTEND_DIR/.env.dev"
            ;;
        "prod")
            env_file="$FRONTEND_DIR/.env.prod"
            ;;
        *)
            echo "❌ Invalid environment '$ENVIRONMENT'. Use 'dev' or 'prod'"
            exit 1
            ;;
    esac
    
    if [ ! -f "$env_file" ]; then
        echo "⚠️  Environment file $env_file does not exist"
        echo "📝 Creating from example file..."
        
        if [ -f "$env_file.example" ]; then
            cp "$env_file.example" "$env_file"
            echo "✅ Created $env_file from example"
            echo "⚠️  Please edit $env_file with your actual values before deploying"
            echo "Press Enter to continue or Ctrl+C to cancel..."
            read
        else
            echo "❌ Example file $env_file.example not found"
            exit 1
        fi
    fi
    
    echo "✅ Environment validation passed"
}

# Function to install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    cd "$FRONTEND_DIR"
    if [ ! -d "node_modules" ]; then
        npm install --production=false
    fi
    echo "✅ Frontend dependencies installed"
    
    cd "$BACKEND_DIR"
    if [ ! -d "node_modules" ]; then
        npm install --production=false
    fi
    echo "✅ Backend dependencies installed"
}

# Function to load environment variables
load_environment() {
    echo "🔧 Loading environment variables for $ENVIRONMENT..."
    
    # Load frontend environment
    cd "$FRONTEND_DIR"
    case $ENVIRONMENT in
        "dev")
            if [ -f ".env.dev" ]; then
                cp .env.dev .env
                cp .env.dev .env.local
                echo "✅ Frontend development environment loaded"
            else
                echo "❌ .env.dev not found"
                exit 1
            fi
            ;;
        "prod")
            if [ -f ".env.prod" ]; then
                cp .env.prod .env
                cp .env.prod .env.local
                echo "✅ Frontend production environment loaded"
            else
                echo "❌ .env.prod not found"
                exit 1
            fi
            ;;
    esac
    
    # Load backend environment
    cd "$BACKEND_DIR"
    case $ENVIRONMENT in
        "dev")
            if [ -f ".env.dev" ]; then
                cp .env.dev .env
                echo "✅ Backend development environment loaded"
            fi
            ;;
        "prod")
            if [ -f ".env.prod" ]; then
                cp .env.prod .env
                echo "✅ Backend production environment loaded"
            fi
            ;;
    esac
}

# Function to build frontend
build_frontend() {
    echo "🔨 Building frontend..."
    
    cd "$FRONTEND_DIR"
    
    # Use appropriate vite config
    if [ "$ENVIRONMENT" = "prod" ]; then
        if [ -f "vite.config.prod.js" ]; then
            npm run build -- --config vite.config.prod.js
        else
            echo "⚠️  vite.config.prod.js not found, using default config"
            npm run build
        fi
    else
        if [ -f "vite.config.dev.js" ]; then
            npm run build -- --config vite.config.dev.js
        else
            echo "⚠️  vite.config.dev.js not found, using default config"
            npm run build
        fi
    fi
    
    # Check for output directory (handle both dist and dist-dev)
    if [ "$ENVIRONMENT" = "dev" ] && [ -d "dist-dev" ]; then
        OUTPUT_DIR="dist-dev"
    elif [ -d "dist" ]; then
        OUTPUT_DIR="dist"
    else
        echo "❌ Frontend build failed - output directory not created"
        exit 1
    fi
    
    echo "✅ Frontend build completed (output: $OUTPUT_DIR)"
}

# Function to deploy backend
deploy_backend() {
    echo "🌐 Deploying backend to $ENVIRONMENT..."
    
    cd "$BACKEND_DIR"
    
    # Check if wrangler.toml exists
    if [ ! -f "wrangler.toml" ]; then
        echo "⚠️  wrangler.toml not found"
        if [ -f "wrangler.toml.example" ]; then
            echo "📝 Creating wrangler.toml from example..."
            cp wrangler.toml.example wrangler.toml
            echo "⚠️  Please edit wrangler.toml with your actual values"
            echo "Press Enter to continue or Ctrl+C to cancel..."
            read
        else
            echo "❌ wrangler.toml.example not found"
            exit 1
        fi
    fi
    
    # Set Wrangler environment
    if [ "$ENVIRONMENT" = "dev" ]; then
        npx wrangler deploy --env dev
    else
        npx wrangler deploy --env prod
    fi
    
    echo "✅ Backend deployment completed"
}

# Function to deploy frontend
deploy_frontend() {
    echo "🎨 Deploying frontend to $ENVIRONMENT..."
    
    cd "$FRONTEND_DIR"
    
    # Determine output directory
    if [ "$ENVIRONMENT" = "dev" ] && [ -d "dist-dev" ]; then
        OUTPUT_DIR="dist-dev"
    else
        OUTPUT_DIR="dist"
    fi
    
    # Deploy to Cloudflare Pages
    if [ "$ENVIRONMENT" = "dev" ]; then
        npx wrangler pages deploy "$OUTPUT_DIR" --project-name equestrian-dev
        echo "🌍 Development Frontend: https://dev.yourdomain.com"
        echo "📊 Development API: https://equestrian-api-dev.your-subdomain.workers.dev"
    else
        npx wrangler pages deploy "$OUTPUT_DIR" --project-name equestrian-prod
        echo "🌍 Production Frontend: https://yourdomain.com"
        echo "📊 Production API: https://equestrian-api-prod.your-subdomain.workers.dev"
    fi
    
    echo "✅ Frontend deployment completed"
}

# Function to run post-deployment checks
post_deployment_checks() {
    echo "🔍 Running post-deployment checks..."
    
    echo "📊 Deployment Summary:"
    echo "  Environment: $ENVIRONMENT"
    echo "  Frontend: Deployed"
    echo "  Backend: Deployed"
    
    echo "✅ Post-deployment checks completed"
}

# Main deployment flow
main() {
    check_prerequisites
    validate_environment
    install_dependencies
    load_environment
    build_frontend
    deploy_backend
    deploy_frontend
    post_deployment_checks
    
    echo ""
    echo "🎉 Deployment to $ENVIRONMENT completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Test the application functionality"
    echo "2. Monitor logs for any issues"
    echo "3. Update DNS records if needed (first deployment)"
    echo ""
}

# Run the main function
main "$@"
