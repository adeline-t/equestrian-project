#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

class ModelGenerator {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.configPath = path.join(__dirname, 'config', 'model-schema.json');
    this.templatesPath = path.join(__dirname, 'templates');
    this.config = null;
  }

  async init() {
    console.log(chalk.cyan('🐴 Equestrian Model Generator'));
    console.log(chalk.gray('Add new models to your equestrian management system\n'));

    try {
      this.config = await fs.readJson(this.configPath);
    } catch (error) {
      console.error(chalk.red('❌ Failed to load configuration:', error.message));
      process.exit(1);
    }

    await this.gatherModelInfo();
    await this.generateFiles();
    await this.updateProjectFiles();
    await this.showNextSteps();
  }

  async gatherModelInfo() {
    console.log(chalk.blue('📋 Model Configuration'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'modelName',
        message: 'Model name (singular, PascalCase):',
        validate: (input) => {
          if (!input.trim()) return 'Model name is required';
          if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
            return 'Model name must be in PascalCase (e.g., Instructor, Horse, Rider)';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'displayName',
        message: 'Display name (French, singular):',
        validate: (input) => {
          if (!input.trim()) return 'Display name is required';
          return true;
        }
      },
      {
        type: 'input',
        name: 'displayPlural',
        message: 'Display name (French, plural):',
        validate: (input) => {
          if (!input.trim()) return 'Plural name is required';
          return true;
        }
      },
      {
        type: 'list',
        name: 'mainEmoji',
        message: 'Main emoji for this model:',
        choices: ['👤', '🐴', '🏇', '🏃', '👨‍🏫', '👩‍🏫', '💰', '📅', '🏢', '🎯', '⭐', '📝', '🔧']
      },
      {
        type: 'confirm',
        name: 'hasActivityDates',
        message: 'Does this model have activity start/end dates?',
        default: false
      },
      {
        type: 'confirm',
        name: 'needsCustomEndpoints',
        message: 'Does this model need custom API endpoints beyond basic CRUD?',
        default: false
      }
    ]);

    this.modelInfo = {
      ...answers,
      modelName: answers.modelName.trim(),
      displayName: answers.displayName.trim(),
      displayPlural: answers.displayPlural.trim(),
      modelNameLower: answers.modelName.toLowerCase(),
      modelNamePlural: answers.modelNameLower + 's',
      tableName: this.toSnakeCase(answers.modelNameLower) + 's',
      defaultSortField: 'name'
    };

    await this.gatherFields();
  }

  async gatherFields() {
    console.log(chalk.blue('\n📝 Model Fields'));

    const fields = [];
    let addingFields = true;

    while (addingFields) {
      const fieldAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Field name (snake_case):',
          validate: (input) => {
            if (!input.trim()) return 'Field name is required';
            if (!/^[a-z][a-z0-9_]*$/.test(input)) {
              return 'Field name must be in snake_case (e.g., first_name, phone_number)';
            }
            if (fields.some(f => f.name === input.trim())) {
              return 'Field name already exists';
            }
            return true;
          }
        },
        {
          type: 'list',
          name: 'type',
          message: 'Field type:',
          choices: Object.keys(this.config.fieldTypes).map(key => ({
            name: `${key} - ${this.config.fieldTypes[key].sql}`,
            value: key
          }))
        },
        {
          type: 'confirm',
          name: 'required',
          message: 'Is this field required?',
          default: false
        },
        {
          type: 'confirm',
          name: 'unique',
          message: 'Should this field be unique?',
          default: false
        },
        {
          type: 'input',
          name: 'defaultValue',
          message: 'Default value (leave empty for no default):',
          when: (answers) => answers.type === 'boolean' || answers.type === 'string',
          default: ''
        }
      ]);

      if (fieldAnswer.type === 'enum') {
        const enumAnswer = await inquirer.prompt([
          {
            type: 'input',
            name: 'options',
            message: 'Enum options (comma-separated):',
            validate: (input) => {
              if (!input.trim()) return 'At least one option is required';
              return true;
            }
          }
        ]);
        fieldAnswer.enumOptions = enumAnswer.options.split(',').map(opt => opt.trim());
      }

      fields.push({
        ...fieldAnswer,
        name: fieldAnswer.name.trim(),
        displayName: this.toDisplayName(fieldAnswer.name),
        formLabel: this.toFormLabel(fieldAnswer.name)
      });

      const continueAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continue',
          message: 'Add another field?',
          default: false
        }
      ]);

      addingFields = continueAnswer.continue;
    }

    this.modelInfo.fields = fields;
  }

  async generateFiles() {
    const spinner = ora('Generating files...').start();

    try {
      // Create directories
      await this.ensureDirectories();

      // Generate backend handler
      await this.generateBackendHandler();

      // Generate database migration
      await this.generateDatabaseMigration();

      // Generate frontend components
      await this.generateFrontendComponents();

      // Generate frontend types
      await this.generateFrontendTypes();

      // Generate styles
      await this.generateStyles();

      spinner.succeed('Files generated successfully!');
    } catch (error) {
      spinner.fail('Failed to generate files');
      console.error(chalk.red(error.message));
      throw error;
    }
  }

  async ensureDirectories() {
    const dirs = [
      path.join(this.projectRoot, 'backend', 'src', 'handlers'),
      path.join(this.projectRoot, 'frontend', 'src', 'components', this.modelInfo.modelNameLower),
      path.join(this.projectRoot, 'frontend', 'src', 'types'),
      path.join(this.projectRoot, 'database', 'migrations')
    ];

    for (const dir of dirs) {
      await fs.ensureDir(dir);
    }
  }

  async generateBackendHandler() {
    const template = await fs.readFile(
      path.join(this.templatesPath, 'backend', 'handler.js.template'),
      'utf8'
    );

    const handlerContent = this.renderTemplate(template, {
      ...this.modelInfo,
      requiredFieldsArray: this.modelInfo.fields
        .filter(f => f.required)
        .map(f => `'${f.name}'`)
        .join(', '),
      validationBlocks: this.generateValidationBlocks(),
      fieldAssignments: this.generateFieldAssignments(),
      updateValidationBlocks: this.generateUpdateValidationBlocks(),
      updateFieldAssignments: this.generateUpdateFieldAssignments(),
      deleteValidationBlocks: this.generateDeleteValidationBlocks(),
      additionalEndpoints: this.modelInfo.needsCustomEndpoints ? 
        '// Add custom endpoints here' : ''
    });

    const outputPath = path.join(
      this.projectRoot,
      'backend',
      'src',
      'handlers',
      `${this.modelInfo.modelNameLower}.js`
    );

    await fs.writeFile(outputPath, handlerContent);
  }

  async generateDatabaseMigration() {
    const template = await fs.readFile(
      path.join(this.templatesPath, 'database', 'migration.sql.template'),
      'utf8'
    );

    const migrationContent = this.renderTemplate(template, {
      ...this.modelInfo,
      currentDate: new Date().toISOString().split('T')[0],
      tableColumns: this.generateTableColumns(),
      indexStatements: this.generateIndexStatements(),
      triggerStatements: this.generateTriggerStatements(),
      sampleDataStatements: this.generateSampleDataStatements(),
      foreignKeyStatements: this.generateForeignKeyStatements()
    });

    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
    const filename = `${timestamp}_create_${this.modelInfo.tableName}.sql`;
    const outputPath = path.join(this.projectRoot, 'database', 'migrations', filename);

    await fs.writeFile(outputPath, migrationContent);
  }

  async generateFrontendComponents() {
    // Generate List component
    const listTemplate = await fs.readFile(
      path.join(this.templatesPath, 'frontend', 'List.jsx.template'),
      'utf8'
    );

    const listContent = this.renderTemplate(listTemplate, {
      ...this.modelInfo,
      dateFnsImport: this.modelInfo.fields.some(f => f.type === 'date' || f.type === 'datetime') ?
        "import { format } from 'date-fns';\nimport { fr } from 'date-fns/locale';" : '',
      additionalStates: this.generateAdditionalStates(),
      helperFunctions: this.generateHelperFunctions(),
      filteringLogic: this.generateFilteringLogic(),
      statsCalculations: this.generateStatsCalculations(),
      statsDisplay: this.generateStatsDisplay(),
      filterButtons: this.generateFilterButtons(),
      tableHeaders: this.generateTableHeaders(),
      tableCells: this.generateTableCells()
    });

    await fs.writeFile(
      path.join(
        this.projectRoot,
        'frontend',
        'src',
        'components',
        this.modelInfo.modelNameLower,
        `${this.modelInfo.modelNamePlural}List.jsx`
      ),
      listContent
    );

    // Generate Form component
    const formTemplate = await fs.readFile(
      path.join(this.templatesPath, 'frontend', 'Form.jsx.template'),
      'utf8'
    );

    const formContent = this.renderTemplate(formTemplate, {
      ...this.modelInfo,
      validationImport: `import { validate${this.modelInfo.modelName} } from '../../types/${this.modelInfo.modelNameLower}.js';`,
      initialFormState: this.generateInitialFormState(),
      editFormState: this.generateEditFormState(),
      formFields: this.generateFormFields()
    });

    await fs.writeFile(
      path.join(
        this.projectRoot,
        'frontend',
        'src',
        'components',
        this.modelInfo.modelNameLower,
        `${this.modelInfo.modelName}Form.jsx`
      ),
      formContent
    );
  }

  async generateFrontendTypes() {
    const template = await fs.readFile(
      path.join(this.templatesPath, 'frontend', 'types.js.template'),
      'utf8'
    );

    const typesContent = this.renderTemplate(template, {
      ...this.modelInfo,
      enumDefinitions: this.generateEnumDefinitions(),
      validationLogic: this.generateValidationLogic(),
      utilityFunctions: this.generateUtilityFunctions()
    });

    await fs.writeFile(
      path.join(
        this.projectRoot,
        'frontend',
        'src',
        'types',
        `${this.modelInfo.modelNameLower}.js`
      ),
      typesContent
    );
  }

  async generateStyles() {
    const template = await fs.readFile(
      path.join(this.templatesPath, 'frontend', 'styles.css.template'),
      'utf8'
    );

    const stylesContent = this.renderTemplate(template, {
      ...this.modelInfo,
      badgeStyles: this.generateBadgeStyles()
    });

    await fs.writeFile(
      path.join(
        this.projectRoot,
        'frontend',
        'src',
        'components',
        this.modelInfo.modelNameLower,
        `${this.modelInfo.modelNameLower}.css`
      ),
      stylesContent
    );
  }

  async updateProjectFiles() {
    const spinner = ora('Updating project files...').start();

    try {
      // Update API service
      await this.updateApiService();

      // Update backend router
      await this.updateBackendRouter();

      // Update frontend App.jsx
      await this.updateFrontendApp();

      spinner.succeed('Project files updated successfully!');
    } catch (error) {
      spinner.fail('Failed to update project files');
      console.error(chalk.red(error.message));
      throw error;
    }
  }

  async updateApiService() {
    const apiPath = path.join(this.projectRoot, 'frontend', 'src', 'services', 'api.js');
    const apiContent = await fs.readFile(apiPath, 'utf8');

    // Add the API export for the new model
    const newApiExport = `export const ${this.modelInfo.modelNamePlural}Api = createCrudApi('${this.modelInfo.modelNamePlural}');`;
    
    if (!apiContent.includes(newApiExport)) {
      const updatedContent = apiContent.replace(
        'export const associationsApi = createCrudApi(\'associations\');',
        `export const ${this.modelInfo.modelNamePlural}Api = createCrudApi('${this.modelInfo.modelNamePlural}');\n\nexport const associationsApi = createCrudApi(\'associations\');`
      );
      await fs.writeFile(apiPath, updatedContent);
    }
  }

  async updateBackendRouter() {
    const routerPath = path.join(this.projectRoot, 'backend', 'src', 'index.js');
    const routerContent = await fs.readFile(routerPath, 'utf8');

    // Add import
    const importLine = `import { handle${this.modelInfo.modelName} } from './handlers/${this.modelInfo.modelNameLower}.js';`;
    
    if (!routerContent.includes(importLine)) {
      // Add import after existing handler imports
      const updatedContent = routerContent.replace(
        'import { handleAssociations } from \'./handlers/associations.js\';',
        `import { handleAssociations } from './handlers/associations.js';\nimport { handle${this.modelInfo.modelName} } from './handlers/${this.modelInfo.modelNameLower}.js';`
      );

      // Add route handler
      const routeHandler = `if (path.startsWith('/api/${this.modelInfo.modelNamePlural}')) {\n        return handle${this.modelInfo.modelName}(request, env);\n      }`;
      
      const finalContent = updatedContent.replace(
        'if (path.startsWith(\'/api/associations\')) {',
        `${routeHandler}\n\n      if (path.startsWith('/api/associations')) {`
      );

      await fs.writeFile(routerPath, finalContent);
    }
  }

  async updateFrontendApp() {
    const appPath = path.join(this.projectRoot, 'frontend', 'src', 'App.jsx');
    const appContent = await fs.readFile(appPath, 'utf8');

    // Add import
    const importLine = `import ${this.modelInfo.modelNamePlural}List from './components/${this.modelInfo.modelNameLower}/${this.modelInfo.modelNamePlural}List.jsx';`;
    
    if (!appContent.includes(importLine)) {
      // Add import
      const withImport = appContent.replace(
        'import AssociationsList from \'./components/associations/AssociationsList.jsx\';',
        `import AssociationsList from './components/associations/AssociationsList.jsx';\nimport ${this.modelInfo.modelNamePlural}List from './components/${this.modelInfo.modelNameLower}/${this.modelInfo.modelNamePlural}List.jsx';`
      );

      // Add route (this is a simplified version - you'd need to match your routing setup)
      console.log(chalk.yellow('⚠️  Please manually add the route for the new model to your App.jsx file'));
      console.log(chalk.gray(`   Add: <Route path="/${this.modelInfo.modelNamePlural}" element={<${this.modelInfo.modelNamePlural}List />} />`));
    }
  }

  async showNextSteps() {
    console.log(chalk.green('\n✅ Model generation complete!'));
    console.log(chalk.cyan('\n📋 Next steps:'));
    
    console.log(chalk.white('\n1. Database Migration:'));
    console.log(chalk.gray(`   - Run the migration file in database/migrations/`));
    console.log(chalk.gray(`   - Or add the table manually via Supabase dashboard`));

    console.log(chalk.white('\n2. Frontend Routing:'));
    console.log(chalk.gray(`   - Add the route to your App.jsx:`));
    console.log(chalk.gray(`     <Route path="/${this.modelInfo.modelNamePlural}" element={<${this.modelInfo.modelNamePlural}List />} />`));

    console.log(chalk.white('\n3. Navigation:'));
    console.log(chalk.gray(`   - Add navigation link to your menu`));

    console.log(chalk.white('\n4. Testing:'));
    console.log(chalk.gray(`   - Test the new endpoints`));
    console.log(chalk.gray(`   - Verify frontend functionality`));

    console.log(chalk.white('\n5. API Documentation:'));
    console.log(chalk.gray(`   - Update the /api/docs endpoint with new endpoints`));

    console.log(chalk.green(`\n🎉 Your new ${this.modelInfo.displayName} model is ready!`));
  }

  // Template rendering helper methods
  renderTemplate(template, data) {
    let result = template;
    
    // Simple template replacement
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, data[key]);
    });

    return result;
  }

  // Helper methods for generating code sections
  generateValidationBlocks() {
    return this.modelInfo.fields
      .filter(field => field.type === 'email' || field.type === 'phone')
      .map(field => {
        if (field.type === 'email') {
          return `// Email validation\n      if (body.${field.name} && !validateEmail(body.${field.name})) {\n        return jsonResponse({ error: 'Email invalide' }, 400, getSecurityHeaders());\n      }`;
        } else if (field.type === 'phone') {
          return `// Phone validation\n      if (body.${field.name} && !validatePhone(body.${field.name})) {\n        return jsonResponse({ error: 'Numéro de téléphone invalide' }, 400, getSecurityHeaders());\n      }`;
        }
      })
      .join('\n\n      ');
  }

  generateFieldAssignments() {
    return this.modelInfo.fields
      .map(field => {
        let assignment = `        ${field.name}: body.${field.name}`;
        
        if (field.type === 'string') {
          assignment += '?.trim() || null';
        } else if (field.type === 'boolean') {
          assignment += ` || ${field.defaultValue || 'false'}`;
        } else if (field.type === 'integer') {
          assignment += ' ? parseInt(body.' + field.name + ') : null';
        } else if (field.type === 'decimal') {
          assignment += ' ? parseFloat(body.' + field.name + ') : null';
        } else {
          assignment += ' || null';
        }
        
        return assignment + ',';
      })
      .join('\n');
  }

  generateUpdateValidationBlocks() {
    return this.generateValidationBlocks();
  }

  generateUpdateFieldAssignments() {
    return this.modelInfo.fields
      .map(field => {
        let assignment = `        ${field.name}: body.${field.name}`;
        
        if (field.type === 'string') {
          assignment += '?.trim() || current' + this.modelInfo.modelName + '.' + field.name;
        } else if (field.type === 'boolean') {
          assignment += ' !== undefined ? Boolean(body.' + field.name + ') : current' + this.modelInfo.modelName + '.' + field.name;
        } else {
          assignment += ' || current' + this.modelInfo.modelName + '.' + field.name;
        }
        
        return assignment + ',';
      })
      .join('\n');
  }

  generateDeleteValidationBlocks() {
    return '';
  }

  generateTableColumns() {
    const columns = [];
    
    // Add custom fields
    this.modelInfo.fields.forEach(field => {
      let columnDef = `    ${field.name} ${this.config.fieldTypes[field.type].sql}`;
      
      if (field.required) columnDef += ' NOT NULL';
      if (field.defaultValue) columnDef += ` DEFAULT ${field.defaultValue}`;
      if (field.unique) columnDef += ' UNIQUE';
      
      columns.push(columnDef);
    });

    // Add activity dates if needed
    if (this.modelInfo.hasActivityDates) {
      columns.push('    activity_start_date DATE');
      columns.push('    activity_end_date DATE');
    }

    return columns.join(',\n');
  }

  generateIndexStatements() {
    const indexes = [];
    
    // Add index for name field if it exists
    if (this.modelInfo.fields.some(f => f.name === 'name')) {
      indexes.push(`CREATE INDEX idx_${this.modelInfo.tableName}_name ON ${this.modelInfo.tableName}(name);`);
    }

    // Add indexes for unique fields
    this.modelInfo.fields
      .filter(field => field.unique && field.name !== 'name')
      .forEach(field => {
        indexes.push(`CREATE INDEX idx_${this.modelInfo.tableName}_${field.name} ON ${this.modelInfo.tableName}(${field.name});`);
      });

    return indexes.join('\n');
  }

  generateTriggerStatements() {
    return `CREATE TRIGGER update_${this.modelInfo.tableName}_updated_at BEFORE UPDATE ON ${this.modelInfo.tableName}\n    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`;
  }

  generateSampleDataStatements() {
    return `-- Add sample data if needed\n-- INSERT INTO ${this.modelInfo.tableName} (name) VALUES ('Sample ${this.modelInfo.displayName}');`;
  }

  generateForeignKeyStatements() {
    return '-- Add foreign key constraints if needed';
  }

  // String manipulation helpers
  toSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  toDisplayName(str) {
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  toFormLabel(str) {
    return this.toDisplayName(str);
  }

  // Additional generator methods (simplified for brevity)
  generateAdditionalStates() { return '// Add additional states here'; }
  generateHelperFunctions() { return '// Add helper functions here'; }
  generateFilteringLogic() { return '// Add filtering logic here'; }
  generateStatsCalculations() { return '// Add stats calculations here'; }
  generateStatsDisplay() { return '// Add stats display here'; }
  generateFilterButtons() { return '// Add filter buttons here'; }
  generateTableHeaders() { return '// Add table headers here'; }
  generateTableCells() { return '// Add table cells here'; }
  generateInitialFormState() { return '// Add initial form state here'; }
  generateEditFormState() { return '// Add edit form state here'; }
  generateFormFields() { return '// Add form fields here'; }
  generateEnumDefinitions() { return '// Add enum definitions here'; }
  generateValidationLogic() { return '// Add validation logic here'; }
  generateUtilityFunctions() { return '// Add utility functions here'; }
  generateBadgeStyles() { return '// Add badge styles here'; }
}

// Run the generator
if (require.main === module) {
  const generator = new ModelGenerator();
  generator.init().catch(console.error);
}

module.exports = ModelGenerator;