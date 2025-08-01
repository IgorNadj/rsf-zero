import path from "path";
import fs from "fs";
import {
  CompilerOptions,
  createProgram,
  flattenDiagnosticMessageText,
  ModuleKind,
} from "typescript";
import {Action} from "../types.ts";
import md5 from "md5";
import * as os from "node:os";
import {
  generateActionRegistryJs,
  generateActionRegistryTs,
  generateEmptyActionRegistryJs
} from "../transform/server/generateActionRegistry.ts";
import {debug} from "../utils/debug.ts";


export const buildServerFiles = (actions: Action[], rootDir: string) => {
  const serverOutDir = path.join(rootDir, 'dist/server');
  const srcDir = path.join(rootDir, 'src');

  // Clear /dist/server before starting
  if (fs.existsSync(serverOutDir)) {
    fs.rmSync(serverOutDir, { recursive: true });
    fs.mkdirSync(serverOutDir, { recursive: true });
  }

  const actionRegistryJsPath = path.join(serverOutDir, 'actionRegistry.js');

  if (actions.length > 0) {
    // Compile and output all standard files, e.g. those which are imported by the user's actions
    buildStandardFiles(actions, serverOutDir, srcDir);

    // Then generate a registry file which the server will load
    buildRegistryFile(actions, srcDir, actionRegistryJsPath);
  } else {
    // Create an empty registry file
    buildEmptyRegistryFile(actionRegistryJsPath);
  }
  debug(`Built server with ${actions.length} actions to ${serverOutDir}.`);
}


const buildStandardFiles = (actions: Action[], serverOutDir: string, srcDir: string) => {
  // Create tmp directory
  const tmpDir = os.tmpdir();
  const projectHash = md5(process.cwd());
  const generatedRegistryFilePath = path.join(tmpDir, `rsf-zero-registry-${projectHash}.ts`);

  const compilerOptions: CompilerOptions = {
    strict: true,
    module: ModuleKind.ESNext,
    allowSyntheticDefaultImports: true,
    skipLibCheck: true,
    rewriteRelativeImportExtensions: true,
    outDir: serverOutDir,
    rootDir: srcDir,
  };

  // Generate registry ts file
  const registryContent = generateActionRegistryTs(actions, generatedRegistryFilePath);
  fs.writeFileSync(generatedRegistryFilePath, registryContent);
  debug('wrote action registry ts file to: ' + generatedRegistryFilePath)

  // Create TypeScript program with the temporary file as entry point
  const program = createProgram([generatedRegistryFilePath], compilerOptions);

  // Emit the compiled files
  const emitResult = program.emit();
  debug('Built server files to: ' + serverOutDir);

  // Check for compilation errors
  const allDiagnostics = program.getSemanticDiagnostics()
    .concat(program.getSyntacticDiagnostics())
    .concat(emitResult.diagnostics);

  if (allDiagnostics.length > 0) {
    allDiagnostics.forEach(diagnostic => {
      if (diagnostic.file) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
        const message = flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
      } else {
        console.error(flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
      }
    });

    if (emitResult.emitSkipped) {
      throw new Error('TypeScript compilation failed');
    }
  }
}

const buildRegistryFile = (actions: Action[], srcDir: string, actionRegistryJsPath: string) => {
  // This file is what the server loads. It imports all the user's actions.
  // It also exports a map of the action id to the action function.
  //
  // There are two ways to build this file, one is to place it in the user's src/ directory
  // and use tsc to compile it and output it into dist. The other is to directly write it to
  // dist as a javascript file.
  //
  // The first way means we pollute the user's src/ directory, which I don't like, so instead
  // we do the direct option. A bit less ideal in this codebase, but a nicer DevEx for the user.

  fs.writeFileSync(actionRegistryJsPath, generateActionRegistryJs(actions, srcDir));
  debug('wrote action registry js file to: ' + actionRegistryJsPath)
}

const buildEmptyRegistryFile = (actionRegistryJsPath: string)=> {
  // We still need an empty file for the server
  fs.writeFileSync(actionRegistryJsPath, generateEmptyActionRegistryJs());
  debug('wrote empty action registry js file to: ' + actionRegistryJsPath)
}
