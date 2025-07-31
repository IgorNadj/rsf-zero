import { useListFiles } from "./hooks/useListFiles.ts";
import { useMemoryUsage } from "./hooks/useMemoryUsage.ts";

export const App = () => {

  const files = useListFiles(true);

  const memoryUsage = useMemoryUsage();

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

      Server memory usage:

      { memoryUsage ? ` ${memoryUsage} MB` : ' Loading...' }
    </>
  );
};
