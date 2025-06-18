import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";
import {
  apply,
  branchAndMerge,
  chain,
  mergeWith,
  move,
  template,
  url,
} from "@angular-devkit/schematics";
import { Path } from "@angular-devkit/core";

import { CqrsModuleOptions } from "./schema";
import {
  DependencyValidator,
  ModuleFinder,
  PathResolver,
  ModuleContentManipulator,
  OptionsTransformer,
} from "./utils";

export default function moduleSchematic(options: CqrsModuleOptions): Rule {
  return (tree: Tree, ctx: SchematicContext) => {
    const validation = OptionsTransformer.validate(options);
    if (!validation.valid) {
      throw new Error(`Invalid options: ${validation.errors.join(", ")}`);
    }

    const transformedOptions = OptionsTransformer.transform(options);

    return branchAndMerge(
      chain([
        DependencyValidator.validate(),
        mergeWith(generateFiles(transformedOptions)),
        addDeclarationToModule(transformedOptions),
      ])
    )(tree, ctx);
  };
}

/**
 * Generates the files from templates with proper transformations.
 * @param options - The transformed options for the CQRS module.
 * @returns Source for generating files
 */
function generateFiles(options: CqrsModuleOptions) {
  const sourceTemplates = url("./cqrs-module/files");
  const templateVariables = OptionsTransformer.createTemplateVariables(options);

  return apply(sourceTemplates, [
    template(templateVariables),
    move(options.path as Path),
  ]);
}

/**
 * Adds the generated module declaration to a parent module if specified.
 * @param options - The transformed options for the CQRS module.
 * @returns Rule for adding module declaration
 */
function addDeclarationToModule(options: CqrsModuleOptions): Rule {
  return (tree: Tree) => {
    // Skip if no module option is provided and no path to search from
    if (!options.module && !options.path) {
      console.log(
        "No module path specified and no search path available. Skipping module registration."
      );
      return tree;
    }

    // Find the module file
    const modulePath = ModuleFinder.findModule(tree, options);

    if (!modulePath) {
      console.warn(`No module file found. Skipping module registration.`);
      return tree;
    }

    if (!ModuleFinder.isValidModule(tree, modulePath)) {
      console.warn(
        `Invalid module file: ${modulePath}. Skipping module registration.`
      );
      return tree;
    }

    const moduleContent = tree.read(modulePath)?.toString();
    if (!moduleContent) {
      console.warn(`Could not read module file: ${modulePath}`);
      return tree;
    }

    // Validate module content
    if (!ModuleContentManipulator.isValidModuleContent(moduleContent)) {
      console.warn(
        `Module file does not contain valid @Module decorator: ${modulePath}`
      );
      return tree;
    }

    // Generate the import statement and module declaration
    const moduleName = OptionsTransformer.getModuleClassName(options);
    const relativePath = PathResolver.getRelativeImportPath(
      modulePath,
      options.path as string,
      options.name
    );

    const updatedContent = ModuleContentManipulator.addImportAndDeclaration(
      moduleContent,
      moduleName,
      relativePath
    );

    tree.overwrite(modulePath, updatedContent);
    return tree;
  };
}
