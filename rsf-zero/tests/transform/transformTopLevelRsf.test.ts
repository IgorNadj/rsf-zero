import { describe, expect, test } from 'vitest';
import * as swc from '@swc/core';
import { transformTopLevelRsf } from "../../src/transform/transformTopLevelRsf";

const compileTsx = (code: string) =>
  swc.transformSync(code, {
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: true,
      },
      transform: {
        react: { runtime: 'automatic' },
      },
      target: 'esnext',
    },
  }).code;


describe('transforms', () => {

  test('no use server', async () => {
    const code = compileTsx(`
export const hello = async () => 'world';
`);
    expect(
      transformTopLevelRsf('/src/App.ts', code, (action) => {}),
    ).toEqual(undefined);
  });

  test('transforms exports', async () => {
    const code = compileTsx(`
export const hello = async () => 'world';
`);
    expect(
      transformTopLevelRsf('/src/App.ts', code, (action) => {}),
    ).toEqual(undefined);
  });


  test('top-level use server', async () => {
    const code = `
'use server';

const privateFunction = () => 'Secret';

// const function expression
export const log1 = async function(mesg) {
  console.log(mesg);
}

// const arrow function
export const log2 = async (mesg) => {
  console.log(mesg);
};

// function declaration
export async function log3(mesg) {
  console.log(mesg);
}

// default export
export default async function log4(mesg) {
  console.log(mesg);
}
`;
    expect(transformTopLevelRsf('/src/func.ts', code, (action) => {}))
      .toEqual(`
import { createActionCaller } from 'rsf-zero/client';
export const log1 = createActionCaller('/src/func.ts#log1');
export const log2 = createActionCaller('/src/func.ts#log2');
export const log3 = createActionCaller('/src/func.ts#log3');
export default createActionCaller('/src/func.ts#default');`);
  });

});
