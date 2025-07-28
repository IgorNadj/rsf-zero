export type Action = {
  name: string; // the named export
  sourceFilePath: string;
}

export type ActionHandler = {
  actionName: string;
  actionFn: CallableFunction;
}

export type ActionRegistry = Record<ActionHandler['actionName'], ActionHandler['actionFn']>;
