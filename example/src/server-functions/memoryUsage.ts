'use server';


/**
 * Returns memory usage in MB
 */
export const memoryUsage = async (): Promise<number> => {
  const memoryUsageInBytes = process.memoryUsage();
  return Math.round(memoryUsageInBytes.rss / 1000000);
}
