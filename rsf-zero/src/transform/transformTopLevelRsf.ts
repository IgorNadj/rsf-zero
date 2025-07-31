import * as swc from "@swc/core";
import {isTopLevelRsfFile} from "../utils/isTopLevelRsfFile.ts";
import {debug} from "../utils/debug.ts";
import {Action} from "../types.ts";

/**
 * Given a file that starts with 'use server', return a transformed client version of that file.
 */
export const transformTopLevelRsf =
  (
    id: string,
    code: string,
    onActionFound: (action: Action) => void,
  ): string | undefined => {
    if (!isTopLevelRsfFile(id, code)) {
      return undefined;
    }

    debug("Transforming file for client: ", id);

    const mod = swc.parseSync(code);

    const exportNames = new Set<string>();

    for (const item of mod.body) {
      if (item.type === 'ExportDeclaration') {
        if (item.declaration.type === 'FunctionDeclaration') {
          exportNames.add(item.declaration.identifier.value);
        } else if (item.declaration.type === 'ClassDeclaration') {
          exportNames.add(item.declaration.identifier.value);
        } else if (item.declaration.type === 'VariableDeclaration') {
          for (const d of item.declaration.declarations) {
            if (d.id.type === 'Identifier') {
              exportNames.add(d.id.value);
            }
          }
        }
      } else if (item.type === 'ExportNamedDeclaration') {
        for (const s of item.specifiers) {
          if (s.type === 'ExportSpecifier') {
            exportNames.add(s.exported ? s.exported.value : s.orig.value);
          }
        }
      } else if (item.type === 'ExportDefaultExpression') {
        exportNames.add('default');
      } else if (item.type === 'ExportDefaultDeclaration') {
        exportNames.add('default');
      }
    }

    let newCode = `
import { createActionCaller } from 'rsf-zero/client';`;

    for (const exportName of exportNames) {
      onActionFound({
        sourceFilePath: id,
        name: exportName,
      })

      if (exportName === 'default') {
        newCode += `
export default createActionCaller('${id}#${exportName}');`;
      } else {
        newCode += `
export const ${exportName} = createActionCaller('${id}#${exportName}');`;
      }
    }

    return newCode;
};
