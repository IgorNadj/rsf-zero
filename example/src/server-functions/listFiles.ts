'use server';

import fs from 'fs/promises'

export type MyFileType = {
  filename: string;
  lastModified?: Date;
}

export const listFiles = async (withLastModified = false): Promise<MyFileType[]> => {
  const filenames = await fs.readdir('./');

  const files = [];

  for (const filename of filenames) {
    if (withLastModified) {
      const stats = await fs.stat(filename);
      files.push({
        filename,
        lastModified: stats.mtime,
      });
    } else {
      files.push({
        filename,
      })
    }
  }

  return files;
}
