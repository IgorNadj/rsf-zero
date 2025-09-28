#!/usr/bin/env node

import fs from 'fs';
import { dev } from './cli/dev.ts';
import { build } from "./cli/build.ts";
import { start } from "./cli/start.ts";
import { loadOptions } from "./utils/options.ts";
import { banner } from "./cli/utils.ts";

const args = process.argv.slice(2);
const command = args[0];


banner();
const options = await loadOptions();


if (command === 'dev') {
  await dev();

} else if (command === 'build') {
  await build();

} else if (command === 'start') {
  await start(options);

} else {
  console.log('rsf-zero: Unknown command. Available commands: dev, build, start');
  process.exit(1);
}

