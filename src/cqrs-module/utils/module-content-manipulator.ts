/**
 * Utility class for manipulating module content and adding imports/declarations
 */
export class ModuleContentManipulator {
  /**
   * Adds import statement and module declaration to the module content.
   * @param content - Original module content
   * @param moduleName - Name of the module to import
   * @param importPath - Import path for the module
   * @returns Updated module content
   */
  static addImportAndDeclaration(
    content: string,
    moduleName: string,
    importPath: string
  ): string {
    let updatedContent = content;

    if (this.hasExistingImport(content, moduleName, importPath)) {
      console.log(`Import for ${moduleName} already exists`);
    } else {
      updatedContent = this.addImportStatement(
        updatedContent,
        moduleName,
        importPath
      );
    }

    updatedContent = this.addToModuleImports(updatedContent, moduleName);

    return updatedContent;
  }

  /**
   * Checks if an import statement already exists
   * @param content - Module content
   * @param moduleName - Name of the module
   * @param importPath - Import path
   * @returns boolean indicating if import exists
   */
  private static hasExistingImport(
    content: string,
    moduleName: string,
    importPath: string
  ): boolean {
    const importRegex = new RegExp(
      `import\\s*{[^}]*${moduleName}[^}]*}\\s*from\\s*['"\`]${importPath.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      )}['"\`]`
    );
    return importRegex.test(content);
  }

  /**
   * Adds an import statement to the module content
   * @param content - Module content
   * @param moduleName - Name of the module to import
   * @param importPath - Import path
   * @returns Updated content with import statement
   */
  private static addImportStatement(
    content: string,
    moduleName: string,
    importPath: string
  ): string {
    const importStatement = `import { ${moduleName} } from '${importPath}';`;
    const lines = content.split('\n');
    const lastImportIndex = this.findLastImportIndex(lines);

    if (lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, importStatement);
    } else {
      lines.unshift(importStatement);
    }

    return lines.join('\n');
  }

  /**
   * Finds the index of the last import statement
   * @param lines - Array of content lines
   * @returns Index of last import statement or -1 if none found
   */
  private static findLastImportIndex(lines: string[]): number {
    let lastImportIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }

    return lastImportIndex;
  }

  /**
   * Adds a module to the imports array in @Module decorator
   * @param content - Module content
   * @param moduleName - Name of the module to add
   * @returns Updated content with module in imports
   */
  private static addToModuleImports(
    content: string,
    moduleName: string
  ): string {
    const moduleRegex = /@Module\s*\(\s*\{([\s\S]*?)\}\s*\)/;
    const match = content.match(moduleRegex);

    if (!match) {
      console.warn('Could not find @Module decorator to add imports');
      return content;
    }

    const moduleConfig = match[1];
    const importsRegex = /imports\s*:\s*\[([\s\S]*?)\]/;
    const importsMatch = moduleConfig.match(importsRegex);

    if (importsMatch) {
      return this.addToExistingImports(content, importsMatch, moduleName);
    } else {
      return this.createNewImportsArray(
        content,
        moduleRegex,
        moduleConfig,
        moduleName
      );
    }
  }

  /**
   * Adds module to existing imports array
   * @param content - Module content
   * @param importsMatch - Regex match for existing imports
   * @param moduleName - Name of module to add
   * @returns Updated content
   */
  private static addToExistingImports(
    content: string,
    importsMatch: RegExpMatchArray,
    moduleName: string
  ): string {
    const existingImports = importsMatch[1];

    if (existingImports.includes(moduleName)) {
      console.log(`Module ${moduleName} is already in imports array`);
      return content;
    }

    const trimmedImports = existingImports.trim();
    const newImports = trimmedImports
      ? `${trimmedImports},\n    ${moduleName}`
      : `\n    ${moduleName}\n  `;

    return content.replace(
      /imports\s*:\s*\[([\s\S]*?)\]/,
      `imports: [${newImports}]`
    );
  }

  /**
   * Creates a new imports array in the module decorator
   * @param content - Module content
   * @param moduleRegex - Regex for @Module decorator
   * @param moduleConfig - Current module configuration
   * @param moduleName - Name of module to add
   * @returns Updated content
   */
  private static createNewImportsArray(
    content: string,
    moduleRegex: RegExp,
    moduleConfig: string,
    moduleName: string
  ): string {
    const configLines = moduleConfig.split('\n');
    const hasExistingConfig = configLines.some(
      line => line.trim() && !line.trim().startsWith('//')
    );

    if (hasExistingConfig) {
      const newModuleConfig = `imports: [${moduleName}],\n${moduleConfig.trimStart()}`;
      return content.replace(moduleRegex, `@Module({\n  ${newModuleConfig}})`);
    } else {
      return content.replace(
        moduleRegex,
        `@Module({\n  imports: [${moduleName}]\n})`
      );
    }
  }

  /**
   * Validates if content contains a valid @Module decorator
   * @param content - Module content to validate
   * @returns boolean indicating if valid module
   */
  static isValidModuleContent(content: string): boolean {
    const moduleRegex = /@Module\s*\(\s*\{/;
    return moduleRegex.test(content);
  }

  /**
   * Extracts the module class name from the content
   * @param content - Module content
   * @returns Module class name or null if not found
   */
  static extractModuleClassName(content: string): string | null {
    const classRegex = /export\s+class\s+(\w+Module)/;
    const match = content.match(classRegex);
    return match ? match[1] : null;
  }
}
