import { useListFiles } from "./hooks/useListFiles.ts";
import { useMemoryUsage } from "./hooks/useMemoryUsage.ts";
import {type HeapMemoryUsage, heapMemoryUsage} from "./server-functions/memoryUsage.ts";
import {useEffect, useState} from "react";

export const App = () => {

  const files = useListFiles(true);

  const memoryUsage = useMemoryUsage();

  const [heapUsage, setHeapUsage] = useState<HeapMemoryUsage | null>(null);
  useEffect(() => {
    heapMemoryUsage()
      .then(usage => setHeapUsage(usage))
  }, [])

  return (
    <>
      Hello World

      <hr />

      Here's the output from our server function:

      <ul>
        { files.map(file => (
          <li key={file.filename}>
            {file.filename}
            { file.lastModified ? ` - ${file.lastModified}` : ""}
          </li>
        ))}
      </ul>

      <hr />

      <div>
        Server memory usage:
        { memoryUsage ? ` ${memoryUsage} MB` : ' Loading...' }
      </div>

      <div>
        Heap memory usage:
        { heapUsage && (
          <>
            {heapUsage.used} / {heapUsage.total} MB
          </>
        )}
      </div>

    </>
  );
};
