export const extname = (filePath: string) => {
  const index = filePath.lastIndexOf(".");
  if (index <= 0) {
    return "";
  }
  if (["/", "."].includes(filePath[index - 1]!)) {
    return "";
  }
  return filePath.slice(index);
};
