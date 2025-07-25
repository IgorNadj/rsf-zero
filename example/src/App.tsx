import { useListFiles } from "./hooks/useListFiles.ts";

export const App = () => {

  const files = useListFiles(true);

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
    </>
  );
};
