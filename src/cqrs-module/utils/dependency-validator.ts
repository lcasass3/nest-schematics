import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * Utility class for validating project dependencies
 */
export class DependencyValidator {
  private static readonly REQUIRED_DEPENDENCIES = [
    '@nestjs/common',
    '@nestjs/core',
    '@nestjs/cqrs',
    '@nestjs/typeorm',
    'typeorm',
    'zod',
  ];

  /**
   * Validates that required dependencies are present in package.json
   * @returns Rule for dependency validation
   */
  static validate(): Rule {
    return (tree: Tree, ctx: SchematicContext) => {
      const packageJsonPath = 'package.json';

      if (!tree.exists(packageJsonPath)) {
        ctx.logger.warn(
          'package.json not found. Cannot validate dependencies.'
        );
        return tree;
      }

      const packageContent = tree.read(packageJsonPath)?.toString();
      if (!packageContent) {
        ctx.logger.warn('Could not read package.json');
        return tree;
      }

      try {
        const packageJson = JSON.parse(packageContent);
        const allDeps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        };

        const missingDeps = this.REQUIRED_DEPENDENCIES.filter(
          dep => !allDeps[dep]
        );

        if (missingDeps.length > 0) {
          ctx.logger.warn(
            `Missing required dependencies: ${missingDeps.join(', ')}`
          );
          ctx.logger.info(
            'Please install them using: npm install ' + missingDeps.join(' ')
          );
        }
      } catch (error) {
        ctx.logger.warn('Could not parse package.json');
      }

      return tree;
    };
  }

  /**
   * Checks if a specific dependency exists in package.json
   * @param tree - The file tree
   * @param dependencyName - Name of the dependency to check
   * @returns boolean indicating if dependency exists
   */
  static hasDependency(tree: Tree, dependencyName: string): boolean {
    const packageJsonPath = 'package.json';

    if (!tree.exists(packageJsonPath)) {
      return false;
    }

    const packageContent = tree.read(packageJsonPath)?.toString();
    if (!packageContent) {
      return false;
    }

    try {
      const packageJson = JSON.parse(packageContent);
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      return !!allDeps[dependencyName];
    } catch (error) {
      return false;
    }
  }
}
