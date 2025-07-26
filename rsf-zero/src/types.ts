export type Action = {
  name: string; // the named export
  sourceFilePath: string;
}

export type ActionRegistry = Record<string, CallableFunction>;
