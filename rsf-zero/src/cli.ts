#!/usr/bin/env node

import { dev } from './cli/dev.ts';
import { build } from "./cli/build.ts";
import { start } from "./cli/start.ts";

const args = process.argv.slice(2);
const command = args[0];

if (command === 'dev') {
  await dev();

} else if (command === 'build') {
  await build();

} else if (command === 'start') {
  await start();

} else {
  console.log('rsf-zero: Unknown command. Available commands: dev, build, start');
  process.exit(1);
}

