import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import * as path from 'path';

describe('CQRS Module Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@lcasass3/nest-schematics',
    path.join(__dirname, '../../../dist/collection.json')
  );

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = new UnitTestTree(Tree.empty());
    // Setup basic NestJS project structure
    appTree.create(
      '/package.json',
      JSON.stringify({
        name: 'test-app',
        dependencies: {
          '@nestjs/common': '^10.0.0',
          '@nestjs/core': '^10.0.0',
          '@nestjs/cqrs': '^10.0.0',
          '@nestjs/typeorm': '^10.0.0',
          typeorm: '^0.3.0',
        },
      })
    );

    appTree.create(
      '/src/app.module.ts',
      `
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
    `
    );
  });

  describe('Basic Module Generation', () => {
    it('should generate and process template files correctly', async () => {
      const options = { name: 'user' };

      const tree = await schematicRunner.runSchematic(
        'cqrs-module',
        options,
        appTree
      );

      expect(tree.files.length).toBeGreaterThan(3);

      // Check main module content is processed correctly
      const moduleContent = tree.readContent(
        '/src/user/users.module.ts.template'
      );
      expect(moduleContent).toContain('export class UsersModule');
      expect(moduleContent).toContain('@Module');
      expect(moduleContent).toContain('CqrsModule');
      expect(moduleContent).toContain('UsersController');

      // Check controller content
      const controllerContent = tree.readContent(
        '/src/user/infrastructure/users.controller.ts.template'
      );
      expect(controllerContent).toContain('class UsersController');
      expect(controllerContent).toContain('@Controller');
      expect(controllerContent).toContain('CommandBus');
      expect(controllerContent).toContain('QueryBus');

      // Check domain entity
      const entityContent = tree.readContent(
        '/src/user/domain/entities/user.entity.ts.template'
      );
      expect(entityContent).toContain('export interface User');
    });

    it('should handle plural names correctly', async () => {
      const options = { name: 'categories' };

      const tree = await schematicRunner.runSchematic(
        'cqrs-module',
        options,
        appTree
      );

      // Should generate in singular folder but with plural module name
      expect(tree.files).toContain(
        '/src/category/categories.module.ts.template'
      );

      const moduleContent = tree.readContent(
        '/src/category/categories.module.ts.template'
      );
      expect(moduleContent).toContain('CategoriesModule');
      expect(moduleContent).toContain('CategoriesController');

      // Domain entity should be singular
      const entityContent = tree.readContent(
        '/src/category/domain/entities/category.entity.ts.template'
      );
      expect(entityContent).toContain('export interface Category');
    });

    it('should register module in app.module.ts', async () => {
      const options = { name: 'product' };

      const tree = await schematicRunner.runSchematic(
        'cqrs-module',
        options,
        appTree
      );

      const appModuleContent = tree.readContent('/src/app.module.ts');
      expect(appModuleContent).toContain('import { ProductsModule }');
      expect(appModuleContent).toContain('ProductsModule');
      // Should be in the imports array
      expect(appModuleContent).toMatch(
        /imports:\s*\[[\s\S]*ProductsModule[\s\S]*\]/
      );
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid name', async () => {
      const options = { name: '123invalid' };

      await expect(
        schematicRunner.runSchematic('cqrs-module', options, appTree)
      ).rejects.toThrow();
    });

    it('should throw error for empty name', async () => {
      const options = { name: '' };

      await expect(
        schematicRunner.runSchematic('cqrs-module', options, appTree)
      ).rejects.toThrow();
    });
  });
});
