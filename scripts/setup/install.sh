#!/bin/bash

# Equestrian Model Automation Installation Script
# This script sets up the automation tools for the equestrian management system

set -e

echo "🐴 Equestrian Model Automation Installation"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the scripts/ directory"
    exit 1
fi

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check npm installation
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x add-model.js modify-model.js

# Create test directory if it doesn't exist
if [ ! -d "test" ]; then
    echo "📁 Creating test directory..."
    mkdir test
fi

# Create a simple test configuration
if [ ! -f "test/test-config.json" ]; then
    echo "⚙️  Creating test configuration..."
    cat > test/test-config.json << EOF
{
  "testModel": {
    "name": "TestModel",
    "displayName": "Test Model",
    "plural": "Test Models",
    "fields": [
      {
        "name": "name",
        "type": "string",
        "required": true
      },
      {
        "name": "description",
        "type": "text",
        "required": false
      }
    ]
  }
}
EOF
fi

# Verify installation
echo "🔍 Verifying installation..."

# Check if scripts are executable
if [ -x "add-model.js" ] && [ -x "modify-model.js" ]; then
    echo "✅ Scripts are executable"
else
    echo "❌ Error: Scripts are not executable"
    exit 1
fi

# Check if dependencies are installed
if [ -d "node_modules" ]; then
    echo "✅ Dependencies are installed"
else
    echo "❌ Error: Dependencies are not installed"
    exit 1
fi

# Check if templates exist
if [ -d "templates" ] && [ -f "templates/backend/handler.js.template" ]; then
    echo "✅ Templates are available"
else
    echo "❌ Error: Templates are missing"
    exit 1
fi

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Test the installation: npm test"
echo "2. Add a new model: ./add-model.js"
echo "3. Modify existing model: ./modify-model.js"
echo "4. Read the documentation: cat README.md"
echo ""
echo "🚀 You're ready to automate your model development!"