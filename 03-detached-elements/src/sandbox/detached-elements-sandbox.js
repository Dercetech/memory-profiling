/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */

export function createDetachedElementsSandbox() {
  const retainedElements = [];

  function retainDetachedElement(entry) {
    entry.remove();
    retainedElements.push(entry); // Gross - but simulates the outcome of justified retentions
  }

  function releaseRetainedReferences() {
    const releasedCount = retainedElements.length;
    retainedElements.length = 0;
    return releasedCount;
  }

  return {
    retainedElements,
    retainDetachedElement,
    releaseRetainedReferences,
  };
}
