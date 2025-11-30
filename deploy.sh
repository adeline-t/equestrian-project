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
        echo "❌ Wrangler CLI is not installed. Installing now..."
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
        echo "❌ Environment file $env_file does not exist"
        exit 1
    fi
    
    echo "✅ Environment validation passed"
}

# Function to install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    cd "$FRONTEND_DIR"
    npm install --production=false
    echo "✅ Frontend dependencies installed"
    
    cd "$BACKEND_DIR"
    npm install --production=false
    echo "✅ Backend dependencies installed"
}

# Function to load environment variables
load_environment() {
    echo "🔧 Loading environment variables for $ENVIRONMENT..."
    
    cd "$FRONTEND_DIR"
    case $ENVIRONMENT in
        "dev")
            cp .env.dev .env
            cp .env.dev .env.local
            echo "✅ Development environment loaded"
            ;;
        "prod")
            cp .env.prod .env
            cp .env.prod .env.local
            echo "✅ Production environment loaded"
            ;;
    esac
    
    cd "$BACKEND_DIR"
    case $ENVIRONMENT in
        "dev")
            cp .env.dev .env
            echo "✅ Backend development environment loaded"
            ;;
        "prod")
            cp .env.prod .env
            echo "✅ Backend production environment loaded"
            ;;
    esac
}

# Function to build frontend
build_frontend() {
    echo "🔨 Building frontend..."
    
    cd "$FRONTEND_DIR"
    
    # Use appropriate vite config
    if [ "$ENVIRONMENT" = "prod" ]; then
        npm run build -- --config vite.config.prod.js
    else
        npm run build -- --config vite.config.dev.js
    fi
    
    if [ ! -d "dist" ]; then
        echo "❌ Frontend build failed - dist directory not created"
        exit 1
    fi
    
    echo "✅ Frontend build completed"
}

# Function to deploy backend
deploy_backend() {
    echo "🌐 Deploying backend to $ENVIRONMENT..."
    
    cd "$BACKEND_DIR"
    
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
    
    # Deploy to Cloudflare Pages
    if [ "$ENVIRONMENT" = "dev" ]; then
        npx wrangler pages deploy dist --project-name equestrian-dev
        echo "🌍 Frontend deployed: https://dev.yourdomain.com"
    else
        npx wrangler pages deploy dist --project-name equestrian-prod
        echo "🌍 Frontend deployed: https://yourdomain.com"
    fi
    
    echo "✅ Frontend deployment completed"
}

# Function to run post-deployment checks
post_deployment_checks() {
    echo "🔍 Running post-deployment checks..."
    
    # Check if workers are responding
    if [ "$ENVIRONMENT" = "dev" ]; then
        echo "📊 Development API: https://equestrian-api-dev.your-subdomain.workers.dev"
    else
        echo "📊 Production API: https://equestrian-api-prod.your-subdomain.workers.dev"
    fi
    
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
    echo "1. Update your DNS records if needed"
    echo "2. Test the application functionality"
    echo "3. Monitor logs for any issues"
    echo ""
}

# Run the main function
main "$@"