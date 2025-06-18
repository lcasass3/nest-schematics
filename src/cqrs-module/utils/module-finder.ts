import { Tree } from '@angular-devkit/schematics';
import { CqrsModuleOptions } from '../schema';

/**
 * Utility class for finding module files in the project
 */
export class ModuleFinder {
  /**
   * Finds the module file based on options or searches for the nearest module.
   * @param tree - The file tree
   * @param options - The CQRS module options
   * @returns The path to the module file or null if not found
   */
  static findModule(tree: Tree, options: CqrsModuleOptions): string | null {
    if (options.module) {
      return options.module;
    }

    const nearestModule = this.findNearestModule(tree, options.path as string);
    if (nearestModule) {
      return nearestModule;
    }

    return this.findInCommonLocations(tree);
  }

  /**
   * Searches for the nearest module file starting from a given path
   * @param tree - The file tree
   * @param startPath - Path to start searching from
   * @returns The path to the module file or null if not found
   */
  private static findNearestModule(
    tree: Tree,
    startPath: string
  ): string | null {
    const pathSegments = startPath.split('/').filter(Boolean);

    while (pathSegments.length > 0) {
      const currentPath = pathSegments.join('/');
      const dir = tree.getDir(currentPath);

      if (dir) {
        const moduleFile = dir.subfiles.find(
          file => file.endsWith('.module.ts') || file.endsWith('.module.js')
        );

        if (moduleFile) {
          return `${currentPath}/${moduleFile}`;
        }
      }

      pathSegments.pop();
    }

    return null;
  }

  /**
   * Searches for module files in common NestJS locations
   * @param tree - The file tree
   * @returns The path to the module file or null if not found
   */
  private static findInCommonLocations(tree: Tree): string | null {
    const commonPaths = [
      'src/app.module.ts',
      'src/app/app.module.ts',
      'app.module.ts',
    ];

    for (const path of commonPaths) {
      if (tree.exists(path)) {
        return path;
      }
    }

    return null;
  }

  /**
   * Validates if a module file exists and is readable
   * @param tree - The file tree
   * @param modulePath - Path to the module file
   * @returns boolean indicating if module is valid
   */
  static isValidModule(tree: Tree, modulePath: string): boolean {
    if (!modulePath || !tree.exists(modulePath)) {
      return false;
    }

    const content = tree.read(modulePath)?.toString();
    return !!content && content.includes('@Module');
  }
}
