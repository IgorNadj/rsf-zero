'use server';


/**
 * Returns memory usage in MB
 */
export const getMemoryUsage = async (): Promise<number> => {
  const memoryUsageInBytes = process.memoryUsage();
  return Math.round(memoryUsageInBytes.rss / 1000000);
}

/**
 * Returns heap memory usage in MB
 */
export type HeapMemoryUsage = {
  used: number,
  total: number,
}
export const getHeapUsage = async (): Promise<HeapMemoryUsage> => {
  const memoryUsageInBytes = process.memoryUsage();
  return {
    used: Math.round(memoryUsageInBytes.heapUsed / 1000000),
    total: Math.round(memoryUsageInBytes.heapTotal / 1000000),
  }
}

