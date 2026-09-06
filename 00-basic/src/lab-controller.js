/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import {
  BATCH_PAYLOAD_SIZE,
  buildStructure,
  myClumsyArray,
  leakStructure,
  unlinkStructure as unlinkModelStructure
} from './memory-leak.js';

let currentA = null;

export function createStructure() {
  currentA = buildStructure();
  return getLabState();
}

export function unlinkStructure() {
  if (!currentA) return getLabState();

  unlinkModelStructure(currentA);
  currentA = null;
  return getLabState();
}

export function makeClumsyEntries(count = 10_000) {
  for (let index = 0; index < count; index += 1) {
    leakStructure(buildStructure(BATCH_PAYLOAD_SIZE));
  }

  return getLabState();
}

export function emptyClumsyArray() {
  myClumsyArray.length = 0;
  return getLabState();
}

export function getLabState() {
  return {
    hasCurrentStructure: currentA !== null,
    clumsyEntryCount: myClumsyArray.length
  };
}

export function installDebugApi() {
  window.memoryLeakLab = {
    get currentA() {
      return currentA;
    },
    myClumsyArray,
    createStructure,
    unlinkStructure,
    leakStructure,
    makeClumsyEntries,
    emptyClumsyArray
  };
}

export function uninstallDebugApi() {
  delete window.memoryLeakLab;
}
