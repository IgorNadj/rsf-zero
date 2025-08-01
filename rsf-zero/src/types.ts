export type Action = {
  id: string; // <sourceFilePath>#<actionName>
  name: string; // the named export
  sourceFilePath: string;
}

export type ActionRegistry = Record<Action['id'], CallableFunction>;
