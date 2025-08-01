import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { asRelativeImport } from '../../src/utils/asRelativeImport';

// mock fs.lstatSync because these files don't actually exist
vi.mock('fs', () => ({
  default: {
    lstatSync: vi.fn((p) => ({
      isDirectory: () => p.endsWith('/dir') || p.endsWith('/subdir')
    }))
  }
}));

describe('asRelativeImport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('same directory', () => {
    const result = asRelativeImport('/usr/dir/file.ts', '/usr/dir');
    expect(result).toBe('./file.ts');
  });

  test('file in same directory', () => {
    const result = asRelativeImport('/usr/dir/file.ts', '/usr/dir/index.ts');
    expect(result).toBe('./file.ts');
  });

  test('child directory', () => {
    const result = asRelativeImport('/usr/dir/subdir/file.ts', '/usr/dir');
    expect(result).toBe('./subdir/file.ts');
  });

  test('parent directory', () => {
    const result = asRelativeImport('/usr/dir/file.ts', '/usr/dir/subdir');
    expect(result).toBe('../file.ts');
  });
});
