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
import { Path, strings } from "@angular-devkit/core";
// import {
//   buildRelativePath,
//   insertImport,
// } from "@schematics/angular/utility/ast-utils";

import { CqrsModuleOptions } from "./schema";

export function moduleSchematic(options: CqrsModuleOptions): Rule {
  return (tree: Tree, ctx: SchematicContext) => {
    const sourceTemplates = url("./files");
    const sourceParameterizedTemplates = apply(sourceTemplates, [
      template({
        ...options,
        ...strings,
      }),
      move(options.path),
    ]);

    return chain([
      branchAndMerge(mergeWith(sourceParameterizedTemplates)),
      // Then modify the barrel file:
      (tree: Tree) => {
        const barrelPath = `${options.path}/index.ts`;
        const moduleFilePath = `${options.path}/${strings.dasherize(
          options.name
        )}.module.ts`;
        const moduleClassName = `${strings.classify(options.name)}Module`;
        const insertPos = tree.read(barrelPath)
          ? tree.read(barrelPath)!.length
          : 0;
        const text = `export * from './${strings.dasherize(
          options.name
        )}.module';\n`;
        tree.overwrite(
          barrelPath,
          tree.read(barrelPath)
            ? tree.read(barrelPath)!.toString() + text
            : text
        );
        return tree;
      },
    ])(tree, ctx);
  };
}
