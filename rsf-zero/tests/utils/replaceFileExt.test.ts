import { describe, expect, test } from 'vitest';
import {replaceFileExt} from "../../src/utils/replaceFileExt";

describe('replaceFileExt', () => {
  test('replaces extension', () => {
    expect(replaceFileExt('/usr/dir/file.ts', '.js')).toBe('/usr/dir/file.js');
    expect(replaceFileExt('./file.ts', '.js')).toBe('./file.js');
    expect(replaceFileExt('../file.ts', '.js')).toBe('../file.js');
  });
})
