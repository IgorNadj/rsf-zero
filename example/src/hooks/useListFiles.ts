import { useEffect, useState } from "react";
import { listFiles } from "../server-functions/listFiles.ts";
import type { MyFileType } from "../server-functions/listFiles.ts";

export const useListFiles = (withLastModified = false): MyFileType[] => {
  const [files, setFiles] = useState<MyFileType[]>([]);

  useEffect(() => {
    listFiles(withLastModified)
      .then(files => setFiles(files))
  }, []);

  return files;
}
