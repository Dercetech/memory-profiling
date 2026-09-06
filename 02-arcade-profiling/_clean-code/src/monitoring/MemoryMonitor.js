/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
const BYTES_PER_MEBIBYTE = 1024 * 1024;

function formatMebibytes(bytes) {
  return `${(bytes / BYTES_PER_MEBIBYTE).toFixed(1)} MiB`;
}

export class MemoryMonitor {
  constructor({ sampleInterval = 1000 } = {}) {
    this.sampleInterval = sampleInterval;
    this.nextSampleAt = 0;
    this.isSampling = false;
    this.label = 'Mémoire JavaScript : mesure en attente';
  }

  update(now) {
    if (this.isSampling || now < this.nextSampleAt) {
      return;
    }

    this.nextSampleAt = now + this.sampleInterval;

    const legacyHeap = performance.memory?.usedJSHeapSize;

    if (typeof legacyHeap === 'number') {
      this.label = `Mémoire JavaScript : ${formatMebibytes(legacyHeap)} (Chrome)`;
      return;
    }

    if (typeof performance.measureUserAgentSpecificMemory !== 'function') {
      this.label = 'Mémoire JavaScript : indisponible — utilisez DevTools';
      return;
    }

    this.measureTotalUserAgentMemory();
  }

  async measureTotalUserAgentMemory() {
    this.isSampling = true;

    try {
      const result = await performance.measureUserAgentSpecificMemory();
      this.label = `Mémoire agent : ${formatMebibytes(result.bytes)}`;
    } catch {
      this.label = 'Mémoire JavaScript : indisponible — utilisez DevTools';
    } finally {
      this.isSampling = false;
    }
  }
}
