import {useListFiles} from "./hooks/useListFiles.ts";
import {getHeapUsage, getMemoryUsage, type HeapMemoryUsage} from "./memoryUsage.ts";
import {useEffect, useState} from "react";

export const App = () => {

  // Example of importing a server function via a hook
  // - this is your most likely use case, as you would want to wrap your request calls
  //   with something like @tanstack/react-query so that it doesn't run on every render
  const files = useListFiles(false);

  // Example of importing a server function via useEffect
  // - just to show that the hook does nothing special
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);
  useEffect(() => {
    getMemoryUsage()
      .then(usage => setMemoryUsage(usage))
  }, [])

  // Example of importing two server functions from the same file
  const [heapUsage, setHeapUsage] = useState<HeapMemoryUsage | null>(null);
  useEffect(() => {
    getHeapUsage()
      .then(usage => setHeapUsage(usage))
  }, [])

  return (
    <>
      Hello World

      <hr />

      <div>
        Files on disk:
        <ul>
          { files.map(file => (
            <li key={file.filename}>
              {file.filename}
              { file.lastModified ? ` - ${file.lastModified}` : ""}
            </li>
          ))}
        </ul>
      </div>

      <hr/>

      <div>
        Server memory usage:
        { memoryUsage ? ` ${memoryUsage} MB` : ' Loading...' }
      </div>

      <hr/>

      <div>
        Heap usage:
        { heapUsage ? ` ${heapUsage.used} / ${heapUsage.total} MB` : ' Loading...' }
      </div>

      <hr/>

      <a href="/api/health">Custom API endpoint</a>

    </>
  );
};
