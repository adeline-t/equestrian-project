#!/usr/bin/env node

// Example script showing how to programmatically create a model
const ModelGenerator = require('../add-model.js');

class InstructorExample {
  constructor() {
    this.generator = new ModelGenerator();
  }

  async run() {
    console.log('🎯 Creating Instructor Model Example');
    console.log('===================================\n');

    // Pre-configure the model information
    this.generator.modelInfo = {
      modelName: 'Instructor',
      displayName: 'Moniteur',
      displayPlural: 'Moniteurs',
      modelNameLower: 'instructor',
      modelNamePlural: 'instructors',
      tableName: 'instructors',
      defaultSortField: 'name',
      mainEmoji: '👨‍🏫',
      hasActivityDates: true,
      needsCustomEndpoints: true,
      fields: [
        {
          name: 'name',
          type: 'string',
          required: true,
          unique: false,
          defaultValue: '',
          displayName: 'Name',
          formLabel: 'Name'
        },
        {
          name: 'phone',
          type: 'phone',
          required: false,
          unique: false,
          defaultValue: '',
          displayName: 'Phone',
          formLabel: 'Phone'
        },
        {
          name: 'email',
          type: 'email',
          required: false,
          unique: false,
          defaultValue: '',
          displayName: 'Email',
          formLabel: 'Email'
        },
        {
          name: 'specialization',
          type: 'enum',
          required: false,
          unique: false,
          enumOptions: ['Dressage', 'Saut d\'obstacle', 'Cross-country', 'Pony club', 'Général'],
          displayName: 'Specialization',
          formLabel: 'Specialization'
        },
        {
          name: 'certification_level',
          type: 'string',
          required: false,
          unique: false,
          defaultValue: '',
          displayName: 'Certification Level',
          formLabel: 'Certification Level'
        },
        {
          name: 'certification_date',
          type: 'date',
          required: false,
          unique: false,
          defaultValue: '',
          displayName: 'Certification Date',
          formLabel: 'Certification Date'
        },
        {
          name: 'hire_date',
          type: 'date',
          required: false,
          unique: false,
          defaultValue: '',
          displayName: 'Hire Date',
          formLabel: 'Hire Date'
        },
        {
          name: 'hourly_rate',
          type: 'decimal',
          required: false,
          unique: false,
          defaultValue: '',
          displayName: 'Hourly Rate',
          formLabel: 'Hourly Rate'
        },
        {
          name: 'max_students',
          type: 'integer',
          required: false,
          unique: false,
          defaultValue: '',
          displayName: 'Max Students',
          formLabel: 'Max Students'
        }
      ]
    };

    try {
      // Load configuration
      const fs = require('fs-extra');
      const path = require('path');
      
      this.generator.config = await fs.readJson(
        path.join(__dirname, '..', 'config', 'model-schema.json')
      );

      console.log('📋 Model Configuration:');
      console.log(`  Name: ${this.generator.modelInfo.displayName}`);
      console.log(`  Plural: ${this.generator.modelInfo.displayPlural}`);
      console.log(`  Fields: ${this.generator.modelInfo.fields.length}`);
      console.log(`  Activity Dates: ${this.generator.modelInfo.hasActivityDates ? 'Yes' : 'No'}`);
      console.log(`  Custom Endpoints: ${this.generator.modelInfo.needsCustomEndpoints ? 'Yes' : 'No'}`);

      console.log('\n🔧 Generating files...');
      
      // Generate all files
      await this.generator.ensureDirectories();
      await this.generator.generateBackendHandler();
      await this.generator.generateDatabaseMigration();
      await this.generator.generateFrontendComponents();
      await this.generator.generateFrontendTypes();
      await this.generator.generateStyles();

      console.log('\n📝 Files that will be generated:');
      console.log('  Backend:');
      console.log('    - backend/src/handlers/instructors.js');
      console.log('  Database:');
      console.log('    - database/migrations/[timestamp]_create_instructors.sql');
      console.log('  Frontend:');
      console.log('    - frontend/src/components/instructors/InstructorsList.jsx');
      console.log('    - frontend/src/components/instructors/InstructorForm.jsx');
      console.log('    - frontend/src/types/instructors.js');
      console.log('    - frontend/src/components/instructors/instructors.css');

      console.log('\n⚠️  Manual updates needed:');
      console.log('  1. Add route to frontend/App.jsx');
      console.log('  2. Add navigation menu item');
      console.log('  3. Run database migration');
      console.log('  4. Update API documentation');

      console.log('\n✅ Example completed successfully!');
      console.log('\n📖 This is just a demonstration. To actually create the model:');
      console.log('   ./add-model.js');
      console.log('   (and follow the interactive prompts)');

    } catch (error) {
      console.error('❌ Error:', error.message);
      console.error('\nThis is a demonstration script only.');
      console.error('Run ./add-model.js to actually create a model.');
    }
  }
}

// Run the example
if (require.main === module) {
  const example = new InstructorExample();
  example.run().catch(console.error);
}

module.exports = InstructorExample;