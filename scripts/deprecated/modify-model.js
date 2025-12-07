#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

class ModelModifier {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.configPath = path.join(__dirname, 'config', 'model-schema.json');
    this.config = null;
  }

  async init() {
    console.log(chalk.cyan('🔧 Equestrian Model Modifier'));
    console.log(chalk.gray('Modify existing models in your equestrian management system\n'));

    try {
      this.config = await fs.readJson(this.configPath);
      await this.selectExistingModel();
      await this.gatherModificationInfo();
      await this.generateModifications();
      await this.showNextSteps();
    } catch (error) {
      console.error(chalk.red('❌ Error:', error.message));
      process.exit(1);
    }
  }

  async selectExistingModel() {
    // Scan existing handlers to find models
    const handlersPath = path.join(this.projectRoot, 'backend', 'src', 'handlers');
    const handlers = await fs.readdir(handlersPath);

    const modelChoices = handlers
      .filter((file) => file.endsWith('.js') && file !== 'index.js')
      .map((file) => ({
        name: file.replace('.js', ''),
        value: file.replace('.js', ''),
      }));

    if (modelChoices.length === 0) {
      console.log(chalk.yellow('⚠️  No existing models found'));
      process.exit(0);
    }

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'modelName',
        message: 'Select model to modify:',
        choices: modelChoices,
      },
    ]);

    this.modelName = answer.modelName;
    this.modelNamePascal = this.toPascalCase(this.modelName);
    this.tableName = this.modelName + 's'; // Simple pluralization
  }

  async gatherModificationInfo() {
    console.log(chalk.blue('\n🔨 Modification Type'));

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'modificationType',
        message: 'What type of modification do you want to make?',
        choices: [
          {
            name: '➕ Add new field(s)',
            value: 'add_fields',
          },
          {
            name: '🗑️ Remove field(s)',
            value: 'remove_fields',
          },
          {
            name: '✏️ Modify field(s)',
            value: 'modify_fields',
          },
          {
            name: '🔗 Add relationships',
            value: 'add_relationships',
          },
          {
            name: '🚀 Add custom API endpoints',
            value: 'add_endpoints',
          },
        ],
      },
    ]);

    this.modificationType = answer.modificationType;

    switch (this.modificationType) {
      case 'add_fields':
        await this.gatherNewFields();
        break;
      case 'remove_fields':
        await this.gatherFieldsToRemove();
        break;
      case 'modify_fields':
        await this.gatherFieldsToModify();
        break;
      case 'add_relationships':
        await this.gatherRelationships();
        break;
      case 'add_endpoints':
        await this.gatherEndpoints();
        break;
    }
  }

  async gatherNewFields() {
    console.log(chalk.blue('\n➕ Adding New Fields'));

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
              return 'Field name must be in snake_case';
            }
            return true;
          },
        },
        {
          type: 'list',
          name: 'type',
          message: 'Field type:',
          choices: Object.keys(this.config.fieldTypes).map((key) => ({
            name: `${key} - ${this.config.fieldTypes[key].sql}`,
            value: key,
          })),
        },
        {
          type: 'confirm',
          name: 'required',
          message: 'Is this field required?',
          default: false,
        },
        {
          type: 'input',
          name: 'defaultValue',
          message: 'Default value (leave empty for no default):',
          when: (answers) => answers.type === 'boolean' || answers.type === 'string',
          default: '',
        },
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
            },
          },
        ]);
        fieldAnswer.enumOptions = enumAnswer.options.split(',').map((opt) => opt.trim());
      }

      fields.push({
        ...fieldAnswer,
        name: fieldAnswer.name.trim(),
        displayName: this.toDisplayName(fieldAnswer.name),
      });

      const continueAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continue',
          message: 'Add another field?',
          default: false,
        },
      ]);

      addingFields = continueAnswer.continue;
    }

    this.newFields = fields;
  }

  async gatherFieldsToRemove() {
    console.log(chalk.blue('\n🗑️ Removing Fields'));

    // Get existing fields from handler
    const handlerPath = path.join(
      this.projectRoot,
      'backend',
      'src',
      'handlers',
      `${this.modelName}.js`
    );
    const handlerContent = await fs.readFile(handlerPath, 'utf8');

    // Extract field names from the handler (simplified)
    const fieldMatches = handlerContent.match(/body\.(\w+)/g);
    const existingFields = fieldMatches
      ? [...new Set(fieldMatches.map((f) => f.replace('body.', '')))]
      : [];

    if (existingFields.length === 0) {
      console.log(chalk.yellow('⚠️  No fields found to remove'));
      process.exit(0);
    }

    const answer = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'fields',
        message: 'Select fields to remove:',
        choices: existingFields.map((field) => ({
          name: field,
          value: field,
        })),
      },
    ]);

    this.fieldsToRemove = answer.fields;
  }

  async gatherFieldsToModify() {
    console.log(chalk.blue('\n✏️ Modifying Fields'));

    // Get existing fields
    const handlerPath = path.join(
      this.projectRoot,
      'backend',
      'src',
      'handlers',
      `${this.modelName}.js`
    );
    const handlerContent = await fs.readFile(handlerPath, 'utf8');

    const fieldMatches = handlerContent.match(/body\.(\w+)/g);
    const existingFields = fieldMatches
      ? [...new Set(fieldMatches.map((f) => f.replace('body.', '')))]
      : [];

    if (existingFields.length === 0) {
      console.log(chalk.yellow('⚠️  No fields found to modify'));
      process.exit(0);
    }

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'field',
        message: 'Select field to modify:',
        choices: existingFields.map((field) => ({
          name: field,
          value: field,
        })),
      },
      {
        type: 'input',
        name: 'newName',
        message: 'New field name (leave unchanged if not renaming):',
        default: (answers) => answers.field,
      },
      {
        type: 'confirm',
        name: 'changeRequired',
        message: 'Change required status?',
        default: false,
      },
      {
        type: 'list',
        name: 'required',
        message: 'Make required:',
        choices: ['Yes', 'No'],
        when: (answers) => answers.changeRequired,
        filter: (input) => input === 'Yes',
      },
    ]);

    this.fieldModification = answer;
  }

  async gatherRelationships() {
    console.log(chalk.blue('\n🔗 Adding Relationships'));

    const relationshipAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'targetModel',
        message: 'Target model name:',
        validate: (input) => input.trim() !== '',
      },
      {
        type: 'list',
        name: 'relationshipType',
        message: 'Relationship type:',
        choices: [
          { name: 'Has Many (one-to-many)', value: 'hasMany' },
          { name: 'Belongs To (many-to-one)', value: 'belongsTo' },
          { name: 'Many to Many', value: 'manyToMany' },
        ],
      },
      {
        type: 'input',
        name: 'foreignKey',
        message: 'Foreign key field name (snake_case):',
        default: (answers) => `${answers.targetModel.toLowerCase()}_id`,
        validate: (input) => /^[a-z][a-z0-9_]*$/.test(input),
      },
    ]);

    this.relationship = relationshipAnswer;
  }

  async gatherEndpoints() {
    console.log(chalk.blue('\n🚀 Adding Custom Endpoints'));

    const endpoints = [];
    let addingEndpoints = true;

    while (addingEndpoints) {
      const endpointAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'method',
          message: 'HTTP method:',
          choices: ['GET', 'POST', 'PUT', 'DELETE'],
        },
        {
          type: 'input',
          name: 'path',
          message: 'Endpoint path (relative to /api/{model}):',
          validate: (input) => {
            if (!input.trim()) return 'Path is required';
            if (input.startsWith('/')) return 'Path should not start with /';
            return true;
          },
        },
        {
          type: 'input',
          name: 'description',
          message: 'Endpoint description:',
          validate: (input) => input.trim() !== '',
        },
      ]);

      endpoints.push(endpointAnswer);

      const continueAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continue',
          message: 'Add another endpoint?',
          default: false,
        },
      ]);

      addingEndpoints = continueAnswer.continue;
    }

    this.customEndpoints = endpoints;
  }

  async generateModifications() {
    const spinner = ora('Generating modifications...').start();

    try {
      switch (this.modificationType) {
        case 'add_fields':
          await this.addFields();
          break;
        case 'remove_fields':
          await this.removeFields();
          break;
        case 'modify_fields':
          await this.modifyFields();
          break;
        case 'add_relationships':
          await this.addRelationships();
          break;
        case 'add_endpoints':
          await this.addEndpoints();
          break;
      }

      spinner.succeed('Modifications generated successfully!');
    } catch (error) {
      spinner.fail('Failed to generate modifications');
      console.error(chalk.red(error.message));
      throw error;
    }
  }

  async addFields() {
    // Generate database migration
    const migrationContent = this.generateFieldAdditionMigration();
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
    const migrationFile = `${timestamp}_add_fields_to_${this.tableName}.sql`;

    await fs.writeFile(
      path.join(this.projectRoot, 'database', 'migrations', migrationFile),
      migrationContent
    );

    // Update backend handler
    await this.updateHandlerForNewFields();

    // Update frontend components
    await this.updateFrontendForNewFields();

    console.log(chalk.green(`\n✅ Added ${this.newFields.length} field(s) to ${this.modelName}`));
  }

  async removeFields() {
    // Generate database migration
    const migrationContent = this.generateFieldRemovalMigration();
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
    const migrationFile = `${timestamp}_remove_fields_from_${this.tableName}.sql`;

    await fs.writeFile(
      path.join(this.projectRoot, 'database', 'migrations', migrationFile),
      migrationContent
    );

    // Update backend handler
    await this.updateHandlerForRemovedFields();

    // Update frontend components
    await this.updateFrontendForRemovedFields();

    console.log(
      chalk.green(`\n✅ Removed ${this.fieldsToRemove.length} field(s) from ${this.modelName}`)
    );
  }

  async modifyFields() {
    // Generate database migration
    const migrationContent = this.generateFieldModificationMigration();
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
    const migrationFile = `${timestamp}_modify_fields_in_${this.tableName}.sql`;

    await fs.writeFile(
      path.join(this.projectRoot, 'database', 'migrations', migrationFile),
      migrationContent
    );

    // Update backend handler
    await this.updateHandlerForModifiedFields();

    // Update frontend components
    await this.updateFrontendForModifiedFields();

    console.log(chalk.green(`\n✅ Modified field(s) in ${this.modelName}`));
  }

  async addRelationships() {
    // Generate database migration
    const migrationContent = this.generateRelationshipMigration();
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
    const migrationFile = `${timestamp}_add_relationships_to_${this.tableName}.sql`;

    await fs.writeFile(
      path.join(this.projectRoot, 'database', 'migrations', migrationFile),
      migrationContent
    );

    // Update backend handler
    await this.updateHandlerForRelationships();

    // Update frontend components
    await this.updateFrontendForRelationships();

    console.log(chalk.green(`\n✅ Added relationship to ${this.modelName}`));
  }

  async addEndpoints() {
    // Update backend handler
    await this.updateHandlerForCustomEndpoints();

    console.log(
      chalk.green(
        `\n✅ Added ${this.customEndpoints.length} custom endpoint(s) to ${this.modelName}`
      )
    );
  }

  // Migration generators
  generateFieldAdditionMigration() {
    const statements = this.newFields.map((field) => {
      const fieldType = this.config.fieldTypes[field.type].sql;
      let sql = `ALTER TABLE ${this.tableName}\nADD COLUMN ${field.name} ${fieldType}`;

      if (field.required) sql += ' NOT NULL';
      if (field.defaultValue) sql += ` DEFAULT ${field.defaultValue}`;

      return sql + ';';
    });

    return `-- Migration: Add fields to ${this.tableName}
-- Created: ${new Date().toISOString().split('T')[0]}
-- Purpose: Add new fields to existing table

${statements.join('\n\n')}

-- Add comments for documentation
${this.newFields
  .map((field) => `COMMENT ON COLUMN ${this.tableName}.${field.name} IS '${field.displayName}';`)
  .join('\n')}`;
  }

  generateFieldRemovalMigration() {
    const statements = this.fieldsToRemove.map(
      (field) => `ALTER TABLE ${this.tableName}\nDROP COLUMN IF EXISTS ${field};`
    );

    return `-- Migration: Remove fields from ${this.tableName}
-- Created: ${new Date().toISOString().split('T')[0]}
-- Purpose: Remove unused fields from table

${statements.join('\n\n')}

-- Note: This operation is irreversible. Consider backing up your data first.`;
  }

  generateFieldModificationMigration() {
    const statements = [];

    if (this.fieldModification.newName !== this.fieldModification.field) {
      statements.push(
        `ALTER TABLE ${this.tableName}\nRENAME COLUMN ${this.fieldModification.field} TO ${this.fieldModification.newName};`
      );
    }

    if (this.fieldModification.changeRequired) {
      const sqlType = this.getFieldType(this.fieldModification.field);
      if (this.fieldModification.required) {
        statements.push(
          `ALTER TABLE ${this.tableName}\nALTER COLUMN ${
            this.fieldModification.newName || this.fieldModification.field
          } SET NOT NULL;`
        );
      } else {
        statements.push(
          `ALTER TABLE ${this.tableName}\nALTER COLUMN ${
            this.fieldModification.newName || this.fieldModification.field
          } DROP NOT NULL;`
        );
      }
    }

    return `-- Migration: Modify fields in ${this.tableName}
-- Created: ${new Date().toISOString().split('T')[0]}
-- Purpose: Modify existing fields in table

${statements.join('\n\n')}`;
  }

  generateRelationshipMigration() {
    const { targetModel, relationshipType, foreignKey } = this.relationship;
    const targetTable = targetModel.toLowerCase() + 's';

    let sql = '';

    if (relationshipType === 'manyToMany') {
      sql = `-- Create junction table for many-to-many relationship
CREATE TABLE ${this.tableName}_${targetTable} (
    id SERIAL PRIMARY KEY,
    ${this.tableName.slice(0, -1)}_id INTEGER NOT NULL REFERENCES ${
        this.tableName
      }(id) ON DELETE CASCADE,
    ${targetModel.toLowerCase()}_id INTEGER NOT NULL REFERENCES ${targetTable}(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(${this.tableName.slice(0, -1)}_id, ${targetModel.toLowerCase()}_id)
);

CREATE INDEX idx_${this.tableName}_${targetTable}_${this.tableName.slice(0, -1)} ON ${
        this.tableName
      }_${targetTable}(${this.tableName.slice(0, -1)}_id);
CREATE INDEX idx_${this.tableName}_${targetTable}_${targetModel.toLowerCase()} ON ${
        this.tableName
      }_${targetTable}(${targetModel.toLowerCase()}_id);`;
    } else {
      sql = `-- Add foreign key for ${relationshipType} relationship
ALTER TABLE ${this.tableName}
ADD COLUMN ${foreignKey} INTEGER REFERENCES ${targetTable}(id) ON DELETE ${
        relationshipType === 'belongsTo' ? 'SET NULL' : 'CASCADE'
      };

CREATE INDEX idx_${this.tableName}_${foreignKey} ON ${this.tableName}(${foreignKey});`;
    }

    return `-- Migration: Add relationships to ${this.tableName}
-- Created: ${new Date().toISOString().split('T')[0]}
-- Purpose: Add ${relationshipType} relationship to ${targetModel}

${sql}`;
  }

  // Handler update methods
  async updateHandlerForNewFields() {
    const handlerPath = path.join(
      this.projectRoot,
      'backend',
      'src',
      'handlers',
      `${this.modelName}.js`
    );
    let handlerContent = await fs.readFile(handlerPath, 'utf8');

    // Add field validations
    const validationInsert = this.newFields
      .filter((field) => field.type === 'email' || field.type === 'phone')
      .map((field) => {
        if (field.type === 'email') {
          return `      if (body.${field.name} && !validateEmail(body.${field.name})) {\n        return jsonResponse({ error: 'Email invalide' }, 400, getSecurityHeaders());\n      }`;
        } else if (field.type === 'phone') {
          return `      if (body.${field.name} && !validatePhone(body.${field.name})) {\n        return jsonResponse({ error: 'Numéro de téléphone invalide' }, 400, getSecurityHeaders());\n      }`;
        }
      })
      .join('\n\n      ');

    // Add field assignments
    const assignmentInsert = this.newFields
      .map((field) => {
        let assignment = `        ${field.name}: `;

        if (field.type === 'string') {
          assignment += `body.${field.name}?.trim() || null`;
        } else if (field.type === 'boolean') {
          assignment += `Boolean(body.${field.name} || false)`;
        } else if (field.type === 'integer') {
          assignment += `body.${field.name} ? parseInt(body.${field.name}) : null`;
        } else if (field.type === 'decimal') {
          assignment += `body.${field.name} ? parseFloat(body.${field.name}) : null`;
        } else {
          assignment += `body.${field.name} || null`;
        }

        return assignment + ',';
      })
      .join('\n');

    // Update handler content (simplified - you'd need more sophisticated string manipulation)
    console.log(
      chalk.yellow('⚠️  Please manually update the handler with the following additions:')
    );
    console.log(chalk.gray('\nValidations:'));
    console.log(chalk.gray(validationInsert));
    console.log(chalk.gray('\nField assignments:'));
    console.log(chalk.gray(assignmentInsert));
  }

  async updateFrontendForNewFields() {
    // Update form component
    const formPath = path.join(
      this.projectRoot,
      'frontend',
      'src',
      'components',
      this.modelName,
      `${this.toPascalCase(this.modelName)}Form.jsx`
    );

    if (await fs.pathExists(formPath)) {
      const formContent = await fs.readFile(formPath, 'utf8');

      console.log(chalk.yellow('⚠️  Please manually update the form component with new fields'));
      console.log(chalk.gray(`Form located at: ${formPath}`));
    }

    // Update list component
    const listPath = path.join(
      this.projectRoot,
      'frontend',
      'src',
      'components',
      this.modelName,
      `${this.modelName}sList.jsx`
    );

    if (await fs.pathExists(listPath)) {
      console.log(
        chalk.yellow('⚠️  Please manually update the list component to display new fields')
      );
      console.log(chalk.gray(`List located at: ${listPath}`));
    }
  }

  // Helper methods (simplified implementations)
  async updateHandlerForRemovedFields() {
    console.log(chalk.yellow('⚠️  Please manually remove field references from the handler'));
  }

  async updateFrontendForRemovedFields() {
    console.log(
      chalk.yellow('⚠️  Please manually remove field references from frontend components')
    );
  }

  async updateHandlerForModifiedFields() {
    console.log(chalk.yellow('⚠️  Please manually update field references in the handler'));
  }

  async updateFrontendForModifiedFields() {
    console.log(chalk.yellow('⚠️  Please manually update field references in frontend components'));
  }

  async updateHandlerForRelationships() {
    console.log(chalk.yellow('⚠️  Please manually add relationship handling to the handler'));
  }

  async updateFrontendForRelationships() {
    console.log(
      chalk.yellow('⚠️  Please manually add relationship display to frontend components')
    );
  }

  async updateHandlerForCustomEndpoints() {
    console.log(chalk.yellow('⚠️  Please manually implement the custom endpoints in the handler'));

    this.customEndpoints.forEach((endpoint) => {
      console.log(chalk.cyan(`\n${endpoint.method} /api/${this.modelName}s/${endpoint.path}:`));
      console.log(chalk.gray(`// ${endpoint.description}`));
      console.log(chalk.gray('// Add implementation here'));
    });
  }

  async showNextSteps() {
    console.log(chalk.green('\n✅ Model modification complete!'));
    console.log(chalk.cyan('\n📋 Next steps:'));

    console.log(chalk.white('\n1. Database Migration:'));
    console.log(chalk.gray('   - Run the generated migration file'));
    console.log(chalk.gray('   - Test in development first'));

    console.log(chalk.white('\n2. Backend Updates:'));
    console.log(chalk.gray('   - Complete any manual handler updates'));
    console.log(chalk.gray('   - Test the API endpoints'));

    console.log(chalk.white('\n3. Frontend Updates:'));
    console.log(chalk.gray('   - Complete any manual component updates'));
    console.log(chalk.gray('   - Test the user interface'));

    console.log(chalk.white('\n4. Testing:'));
    console.log(chalk.gray('   - Test all CRUD operations'));
    console.log(chalk.gray('   - Verify data integrity'));

    console.log(chalk.green(`\n🎉 Your ${this.modelName} model has been modified!`));
  }

  // Helper methods
  toPascalCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  toDisplayName(str) {
    return str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async getFieldType(fieldName) {
    // This would need to parse the existing handler or database schema
    // Simplified implementation
    return 'VARCHAR(255)';
  }
}

// Run the modifier
if (require.main === module) {
  const modifier = new ModelModifier();
  modifier.init().catch(console.error);
}

module.exports = ModelModifier;
