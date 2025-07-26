#!/usr/bin/env node

import { startDev } from './dev/startDev.ts';
import { build } from "./build/build.js";
import {start} from "./start/start.js";

const args = process.argv.slice(2);
const command = args[0];

if (command === 'dev') {
  await startDev();

} else if (command === 'build') {
  await build();

} else if (command === 'start') {
  await start();

} else {
  console.log('rsf-zero: Unknown command. Available commands: dev, build, start');
  process.exit(1);
}

