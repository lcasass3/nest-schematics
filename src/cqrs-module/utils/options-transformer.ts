import { join, Path, strings } from "@angular-devkit/core";
import pluralize from "pluralize";
import { CqrsModuleOptions } from "../schema";

/**
 * Utility class for transforming and formatting options
 */
export class OptionsTransformer {
  /**
   * Transforms the options for the CQRS module.
   * This includes formatting the name, setting the path,
   * and defining the metadata for module declaration.
   * @param options - The user provided options for the CQRS module.
   * @returns Transformed options
   */
  static transform(options: CqrsModuleOptions): CqrsModuleOptions {
    const target = { ...options };
    target.name = this.formatName(options.name);
    target.path = this.buildPath(options.path, target.name);
    target.metadata = "imports";

    return target;
  }

  /**
   * Formats the name to be singular and dasherized.
   * @param name - The name to format.
   * @returns The formatted name.
   */
  static formatName(name: string): string {
    const singularName = pluralize.isSingular(name)
      ? name
      : pluralize.singular(name);

    return strings.dasherize(singularName);
  }

  /**
   * Builds the complete path for the module
   * @param basePath - Base path for the module
   * @param name - Formatted name of the module
   * @returns Complete path
   */
  private static buildPath(basePath: string | undefined, name: string): string {
    return join(strings.dasherize(basePath || "src") as Path, name);
  }

  /**
   * Generates the module class name from the options
   * @param options - CQRS module options
   * @returns Module class name
   */
  static getModuleClassName(options: CqrsModuleOptions): string {
    return `${strings.classify(pluralize.plural(options.name))}Module`;
  }

  /**
   * Validates the transformed options
   * @param options - Options to validate
   * @returns Validation result with errors if any
   */
  static validate(options: CqrsModuleOptions): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!options.name || options.name.trim() === "") {
      errors.push("Name is required");
    }

    if (options.name && !/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(options.name)) {
      errors.push(
        "Name must start with a letter and contain only letters, numbers, hyphens, and underscores"
      );
    }

    if (options.path && !options.path.trim()) {
      errors.push("Path cannot be empty if provided");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Creates template variables for file generation
   * @param options - Transformed options
   * @returns Template variables object
   */
  static createTemplateVariables(
    options: CqrsModuleOptions
  ): Record<string, any> {
    return {
      ...options,
      ...strings,
      plural: pluralize.plural,
      singular: pluralize.singular,
      isSingular: pluralize.isSingular,
      isPlural: pluralize.isPlural,
    };
  }
}
