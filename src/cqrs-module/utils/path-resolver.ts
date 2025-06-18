import { strings } from "@angular-devkit/core";
import pluralize from "pluralize";

/**
 * Utility class for calculating relative paths between directories
 */
export class PathResolver {
  /**
   * Generates the relative import path for the module.
   * @param modulePath - Path to the parent module file
   * @param targetPath - Path where the new module is generated
   * @param name - Name of the new module
   * @returns Relative import path
   */
  static getRelativeImportPath(
    modulePath: string,
    targetPath: string,
    name: string
  ): string {
    const moduleDir = modulePath.split("/").slice(0, -1).join("/");
    const targetDir = targetPath;

    const moduleName = strings.dasherize(pluralize.plural(name));

    const relativePath = this.getRelativePath(moduleDir, targetDir);
    return `${relativePath}/${moduleName}.module`;
  }

  /**
   * Calculates relative path between two directories.
   * @param from - Source directory
   * @param to - Target directory
   * @returns Relative path
   */
  static getRelativePath(from: string, to: string): string {
    const fromParts = from.split("/").filter(Boolean);
    const toParts = to.split("/").filter(Boolean);

    // Find common base
    let commonLength = 0;
    for (let i = 0; i < Math.min(fromParts.length, toParts.length); i++) {
      if (fromParts[i] === toParts[i]) {
        commonLength++;
      } else {
        break;
      }
    }

    const upLevels = fromParts.length - commonLength;
    const downPath = toParts.slice(commonLength);

    const relativeParts = Array(upLevels).fill("..").concat(downPath);
    const result = relativeParts.join("/");

    return result.startsWith(".") ? result : `./${result}`;
  }

  /**
   * Normalizes a file path by removing empty segments and resolving relative parts
   * @param path - The path to normalize
   * @returns Normalized path
   */
  static normalizePath(path: string): string {
    return path.split("/").filter(Boolean).join("/");
  }

  /**
   * Extracts the directory path from a file path
   * @param filePath - The file path
   * @returns Directory path
   */
  static getDirectoryPath(filePath: string): string {
    return filePath.split("/").slice(0, -1).join("/");
  }
}
