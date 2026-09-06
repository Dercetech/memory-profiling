const BYTES_PER_MEGABYTE = 1024 * 1024;

export function formatNativeMemoryUsage() {
  const memory = performance.memory;

  if (!memory || !Number.isFinite(memory.usedJSHeapSize)) {
    return 'Mémoire JS : indisponible dans ce navigateur';
  }

  const usedMegabytes = memory.usedJSHeapSize / BYTES_PER_MEGABYTE;
  return `Mémoire JS : ${usedMegabytes.toFixed(1)} Mo`;
}
