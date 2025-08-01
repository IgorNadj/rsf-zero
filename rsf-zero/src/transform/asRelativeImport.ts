import fs from "fs";
import path from "path";

/**
 * Converts any import e.g. absolute path to a relative one.
 *
 * Given `/User/x/my-file.ts, /User/x`
 * Returns `./my-file.ts`
 *
 * Given `/User/x/my-file.ts, /User/somewhere-else`
 * Returns `../x/my-file.ts`
 *
 * Can be passed an optional `replaceExtWith` param to replace the extension.
 */
export const asRelativeImport = (targetPath: string, relativeToPath: string, replaceExtWith?: string) => {
  const relativeToDirPath = fs.lstatSync(relativeToPath).isDirectory() ? relativeToPath : path.dirname(relativeToPath);

  const relative = path.relative(relativeToDirPath, targetPath);

  // Add leading dot slash
  return relative.startsWith('.') ? relative : './' + relative;
}
