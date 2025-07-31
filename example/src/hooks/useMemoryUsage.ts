import { useEffect, useState } from "react";
import { memoryUsage } from "../server-functions/memoryUsage.ts";

export const useMemoryUsage = (): number | null => {
  const [usage, setUsage] = useState<number | null>(null);

  useEffect(() => {
    memoryUsage()
      .then(usage => setUsage(usage))
  }, []);

  return usage;
}
