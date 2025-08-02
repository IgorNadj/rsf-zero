import { useEffect, useState } from "react";
import { listFiles } from "../listFiles.ts";
import type { MyFileType } from "../listFiles.ts";

export const useListFiles = (withLastModified = false): MyFileType[] => {
  const [files, setFiles] = useState<MyFileType[]>([]);

  useEffect(() => {
    listFiles(withLastModified)
      .then(files => setFiles(files))
  }, []);

  return files;
}
