/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */

export function createDetachedElementsUi(sandbox) {
  const addEntryButton = document.querySelector('#add-entry');
  const releaseReferencesButton = document.querySelector('#release-references');
  const entryList = document.querySelector('#entry-list');
  const emptyState = document.querySelector('#empty-state');
  const visibleCount = document.querySelector('#visible-count');
  const retainedCount = document.querySelector('#retained-count');
  const status = document.querySelector('#lab-status');
  let nextEntryId = 1;

  function updateLabState(message) {
    const visibleEntries = entryList.children.length;
    visibleCount.textContent = String(visibleEntries);
    retainedCount.textContent = String(sandbox.retainedElements.length);
    emptyState.hidden = visibleEntries > 0;
    releaseReferencesButton.disabled = sandbox.retainedElements.length === 0;
    status.textContent = message;
  }

  function retainDetachedElement(entry) {
    sandbox.retainDetachedElement(entry);
    updateLabState(`L’élément ${entry.dataset.entryId} est retiré du DOM, mais sa référence est retenue.`);
    addEntryButton.focus();
  }

  function createEntry() {
    const entry = document.createElement('li');
    const entryId = nextEntryId++;
    entry.dataset.entryId = String(entryId);
    entry.className = 'entry';

    const label = document.createElement('span');
    label.textContent = `Element ${entryId}`;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'secondary';
    removeButton.textContent = 'Remove from DOM';
    removeButton.addEventListener('click', () => retainDetachedElement(entry));

    entry.append(label, removeButton);
    entryList.append(entry);
    updateLabState(`L’élément ${entryId} est ajouté à la liste.`);
  }

  function releaseRetainedReferences() {
    const releasedCount = sandbox.releaseRetainedReferences();
    const plural = releasedCount > 1;
    updateLabState(`${releasedCount} référence${plural ? 's' : ''} retenue${plural ? 's' : ''} libérée${plural ? 's' : ''}.`);
  }

  addEntryButton.addEventListener('click', createEntry);
  releaseReferencesButton.addEventListener('click', releaseRetainedReferences);
  updateLabState('Le lab est prêt.');

  return { releaseRetainedReferences };
}
