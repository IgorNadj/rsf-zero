#!/usr/bin/env node

import { startServer } from './server/startServer.ts';

const args = process.argv.slice(2);
const command = args[0];

if (command === 'start') {
  startServer();
} else {
  console.log('rsf-zero: Unknown command. Available commands: start');
  process.exit(1);
}

// TODO: next steps
//
//
// - When loading server functions, instead of returning the file name, return a
//   javascript reference to the function. That way we can call it directly instead
//   importing it.
