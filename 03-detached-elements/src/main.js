/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import './style.css';
import { createDetachedElementsSandbox } from './sandbox/detached-elements-sandbox.js';
import { createDetachedElementsUi } from './ui/detached-elements-ui.js';

const sandbox = createDetachedElementsSandbox();
const ui = createDetachedElementsUi(sandbox);

window.detachedElementsLab = {
  retainedElements: sandbox.retainedElements,
  releaseRetainedReferences: ui.releaseRetainedReferences,
};
