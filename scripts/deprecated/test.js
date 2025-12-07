#!/usr/bin/env node

// Test script for equestrian model automation
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class TestSuite {
  constructor() {
    this.testsRun = 0;
    this.testsPassed = 0;
    this.testsFailed = 0;
  }

  async run() {
    console.log(chalk.cyan('🧪 Equestrian Model Automation Test Suite'));
    console.log(chalk.gray('==========================================\n'));

    await this.testConfiguration();
    await this.testTemplates();
    await this.testDependencies();
    await this.testPermissions();

    this.showResults();
  }

  async testConfiguration() {
    console.log(chalk.blue('📋 Testing Configuration...'));

    await this.test('Model schema config exists', async () => {
      const configPath = path.join(__dirname, 'config', 'model-schema.json');
      return await fs.pathExists(configPath);
    });

    await this.test('Model schema config is valid JSON', async () => {
      const configPath = path.join(__dirname, 'config', 'model-schema.json');
      const content = await fs.readJson(configPath);
      return content && content.fieldTypes && typeof content.fieldTypes === 'object';
    });

    await this.test('All required field types are defined', async () => {
      const configPath = path.join(__dirname, 'config', 'model-schema.json');
      const content = await fs.readJson(configPath);
      const requiredTypes = ['string', 'text', 'integer', 'decimal', 'boolean', 'date', 'email', 'phone'];
      return requiredTypes.every(type => content.fieldTypes[type]);
    });
  }

  async testTemplates() {
    console.log(chalk.blue('📄 Testing Templates...'));

    await this.test('Backend handler template exists', async () => {
      const templatePath = path.join(__dirname, 'templates', 'backend', 'handler.js.template');
      return await fs.pathExists(templatePath);
    });

    await this.test('Frontend List template exists', async () => {
      const templatePath = path.join(__dirname, 'templates', 'frontend', 'List.jsx.template');
      return await fs.pathExists(templatePath);
    });

    await this.test('Frontend Form template exists', async () => {
      const templatePath = path.join(__dirname, 'templates', 'frontend', 'Form.jsx.template');
      return await fs.pathExists(templatePath);
    });

    await this.test('Frontend Types template exists', async () => {
      const templatePath = path.join(__dirname, 'templates', 'frontend', 'types.js.template');
      return await fs.pathExists(templatePath);
    });

    await this.test('Database migration template exists', async () => {
      const templatePath = path.join(__dirname, 'templates', 'database', 'migration.sql.template');
      return await fs.pathExists(templatePath);
    });

    await this.test('Templates contain required placeholders', async () => {
      const handlerTemplate = await fs.readFile(
        path.join(__dirname, 'templates', 'backend', 'handler.js.template'),
        'utf8'
      );
      
      const requiredPlaceholders = [
        '{{ModelName}}',
        '{{modelName}}',
        '{{tableName}}',
        '{{modelNamePlural}}'
      ];
      
      return requiredPlaceholders.every(placeholder => 
        handlerTemplate.includes(placeholder)
      );
    });
  }

  async testDependencies() {
    console.log(chalk.blue('📦 Testing Dependencies...'));

    await this.test('package.json exists', async () => {
      const packagePath = path.join(__dirname, 'package.json');
      return await fs.pathExists(packagePath);
    });

    await this.test('required dependencies are installed', async () => {
      const requiredDeps = ['inquirer', 'fs-extra', 'chalk', 'ora'];
      const nodeModulesPath = path.join(__dirname, 'node_modules');
      
      if (!await fs.pathExists(nodeModulesPath)) {
        return false;
      }
      
      for (const dep of requiredDeps) {
        const depPath = path.join(nodeModulesPath, dep);
        if (!await fs.pathExists(depPath)) {
          return false;
        }
      }
      
      return true;
    });

    await this.test('scripts are configured in package.json', async () => {
      const packagePath = path.join(__dirname, 'package.json');
      const packageJson = await fs.readJson(packagePath);
      return packageJson.scripts && packageJson.scripts.test;
    });

    await this.test('bin commands are configured', async () => {
      const packagePath = path.join(__dirname, 'package.json');
      const packageJson = await fs.readJson(packageJson);
      return packageJson.bin && 
             packageJson.bin['add-model'] && 
             packageJson.bin['modify-model'];
    });
  }

  async testPermissions() {
    console.log(chalk.blue('🔧 Testing Permissions...'));

    await this.test('add-model.js is executable', async () => {
      const scriptPath = path.join(__dirname, 'add-model.js');
      try {
        await fs.access(scriptPath, fs.constants.F_OK);
        const stats = await fs.stat(scriptPath);
        // Check if executable bit is set (simplified check)
        return stats.mode & 0o111;
      } catch (error) {
        return false;
      }
    });

    await this.test('modify-model.js is executable', async () => {
      const scriptPath = path.join(__dirname, 'modify-model.js');
      try {
        await fs.access(scriptPath, fs.constants.F_OK);
        const stats = await fs.stat(scriptPath);
        return stats.mode & 0o111;
      } catch (error) {
        return false;
      }
    });
  }

  test(description, testFn) {
    this.testsRun++;
    
    testFn()
      .then(result => {
        if (result) {
          console.log(chalk.green(`  ✅ ${description}`));
          this.testsPassed++;
        } else {
          console.log(chalk.red(`  ❌ ${description}`));
          this.testsFailed++;
        }
      })
      .catch(error => {
        console.log(chalk.red(`  ❌ ${description} - Error: ${error.message}`));
        this.testsFailed++;
      });
  }

  showResults() {
    console.log('\n' + chalk.cyan('📊 Test Results'));
    console.log(chalk.gray('================'));
    
    console.log(`Total tests: ${this.testsRun}`);
    console.log(chalk.green(`Passed: ${this.testsPassed}`));
    
    if (this.testsFailed > 0) {
      console.log(chalk.red(`Failed: ${this.testsFailed}`));
      console.log('\n' + chalk.yellow('⚠️  Some tests failed. Please check the configuration and try again.'));
      process.exit(1);
    } else {
      console.log(chalk.green('\n🎉 All tests passed! The automation tools are ready to use.'));
      console.log('\n' + chalk.blue('📋 Next steps:'));
      console.log(chalk.gray('1. Run ./add-model.js to add a new model'));
      console.log(chalk.gray('2. Run ./modify-model.js to modify an existing model'));
      console.log(chalk.gray('3. Read README.md for detailed documentation'));
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const testSuite = new TestSuite();
  testSuite.run().catch(console.error);
}

module.exports = TestSuite;