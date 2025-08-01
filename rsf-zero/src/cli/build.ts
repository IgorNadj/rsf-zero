import {resolveConfig} from 'vite';
import type { Action } from "../types.ts";
import {buildServerFiles} from "./build/buildServerFiles.ts";
import {buildClientFiles} from "./build/buildClientFiles.ts";


export const build = async () => {

  const rootDir = (
    await resolveConfig({}, 'build', 'production', 'production')
  ).root;

  // Map used for building the action registry
  const actions: Action[] = [];

  // Build client files
  await buildClientFiles(rootDir, (action: Action) => actions.push(action));

  // Build server files
  buildServerFiles(actions, rootDir);
}








