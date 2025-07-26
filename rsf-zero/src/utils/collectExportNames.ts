import * as swc from "@swc/core";

export const collectExportNames = (mod: swc.Module) => {
  const exportNames = new Set<string>();
  for (const item of mod.body) {
    if (item.type === "ExportDeclaration") {
      if (item.declaration.type === "FunctionDeclaration") {
        exportNames.add(item.declaration.identifier.value);
      } else if (item.declaration.type === "VariableDeclaration") {
        for (const d of item.declaration.declarations) {
          if (d.id.type === "Identifier") {
            exportNames.add(d.id.value);
          }
        }
      }
    } else if (item.type === "ExportNamedDeclaration") {
      for (const s of item.specifiers) {
        if (s.type === "ExportSpecifier") {
          exportNames.add(s.exported ? s.exported.value : s.orig.value);
        }
      }
    }
  }
  return exportNames;
};
