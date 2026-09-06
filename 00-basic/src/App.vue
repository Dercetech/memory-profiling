<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import {
  makeClumsyEntries,
  createStructure,
  getLabState,
  installDebugApi,
  emptyClumsyArray,
  unlinkStructure,
  uninstallDebugApi
} from './lab-controller.js';

const labState = ref(getLabState());
const usedHeap = ref(null);
const lastAction = ref('Commencez par créer une structure.');
const currentYear = new Date().getFullYear();
let memoryTimer = 0;

const heapLabel = computed(() => {
  if (usedHeap.value === null) return 'JS heap unavailable — use DevTools';
  return `${usedHeap.value.toFixed(1)} MiB`;
});

function readHeap() {
  const bytes = performance.memory?.usedJSHeapSize;
  usedHeap.value = Number.isFinite(bytes) ? bytes / (1024 * 1024) : null;
}

function syncState() {
  labState.value = getLabState();
  readHeap();
}

function createOne() {
  createStructure();
  lastAction.value = 'A atteint B et C. Le cycle B ↔ C est reachable.';
  syncState();
}

function unlinkOne() {
  const hadStructure = labState.value.hasCurrentStructure;
  unlinkStructure();
  lastAction.value = hadStructure
    ? 'A a supprimé ses references. L’island B ↔ C est unreachable et collectible.'
    : 'Aucune structure courante à unlink.';
  syncState();
}

function leakTenThousand() {
  makeClumsyEntries(10_000);
  lastAction.value = '10 000 structures ajoutées à myClumsyArray[]. Cette liste applicative reste reachable depuis window.';
  syncState();
}

function releaseLeaks() {
  emptyClumsyArray();
  lastAction.value = 'myClumsyArray[] est vide. Les islands sont maintenant collectible au prochain garbage collection.';
  syncState();
}

onMounted(() => {
  installDebugApi();
  readHeap();
  memoryTimer = window.setInterval(readHeap, 500);
});

onBeforeUnmount(() => {
  window.clearInterval(memoryTimer);
  uninstallDebugApi();
});
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div>
        <p class="eyebrow">Laboratoire 01 · Garbage collector</p>
        <h1>The Boring Memory Leak</h1>
        <p class="subtitle">Trois objets, un cycle et une root un peu trop attachée.</p>
      </div>
      <div class="heap-meter" aria-live="polite">
        <span>JS heap</span>
        <strong>{{ heapLabel }}</strong>
      </div>
    </header>

    <main>
      <div class="control-intro" aria-labelledby="controls-title">
        <p class="section-label">Experience</p>
        <h2 id="controls-title">Reachable ou collectible&nbsp;?</h2>
        <p aria-live="polite">{{ lastAction }}</p>
      </div>

      <section class="diagram-card" aria-labelledby="structure-title">
        <div class="section-heading">
          <div>
            <p class="section-label">Object graph</p>
            <h2 id="structure-title">Une structure en mémoire</h2>
          </div>
          <dl class="counts">
            <div><dt>Current A</dt><dd>{{ labState.hasCurrentStructure ? 1 : 0 }}</dd></div>
          </dl>
        </div>

        <div class="object-graph" :class="{ disconnected: !labState.hasCurrentStructure }" role="img" :aria-label="labState.hasCurrentStructure ? 'La root currentA atteint A, qui pointe vers le cycle B et C.' : 'currentA vaut null. Le cycle B et C est unreachable et collectible.'">
          <div class="graph-node root-node">root<br><code>currentA</code></div>
          <span class="arrow" aria-hidden="true">→</span>
          <div class="graph-node a-node">A</div>
          <span class="arrow" aria-hidden="true">→</span>
          <div class="island">
            <div class="graph-node">B</div>
            <span class="cycle-arrow" aria-hidden="true">↔</span>
            <div class="graph-node">C</div>
          </div>
          <strong class="graph-state">{{ labState.hasCurrentStructure ? 'reachable' : 'unreachable · collectible' }}</strong>
        </div>
        <div class="actions" role="group" aria-label="Structure en mémoire">
          <button type="button" @click="createOne">Create 1 structure</button>
          <button type="button" :disabled="!labState.hasCurrentStructure" @click="unlinkOne">Unlink structure</button>
        </div>
      </section>

      <section class="diagram-card" aria-labelledby="batch-title">
        <div class="section-heading">
          <div>
            <p class="section-label">Root reference</p>
            <h2 id="batch-title">Un tableau qui retient tout</h2>
          </div>
          <dl class="counts">
            <div><dt>Entries in my clumsy array</dt><dd>{{ labState.clumsyEntryCount.toLocaleString('en-US') }}</dd></div>
          </dl>
        </div>
        <div class="leak-path" :class="{ active: labState.clumsyEntryCount > 0 }" role="img" :aria-label="labState.clumsyEntryCount > 0 ? 'window atteint myClumsyArray, qui retient les cycles B et C.' : 'myClumsyArray est vide.'">
          <span class="graph-node root-node">window</span>
          <span class="arrow" aria-hidden="true">→</span>
          <span class="graph-node"><code>myClumsyArray[]</code></span>
          <span class="arrow" aria-hidden="true">→</span>
          <span class="graph-node">{{ labState.clumsyEntryCount.toLocaleString('en-US') }} × (B ↔ C)</span>
        </div>
        <div class="actions" role="group" aria-label="Batch et cleanup">
          <button type="button" class="danger" @click="leakTenThousand">Batch create (clumsy)</button>
          <button type="button" :disabled="labState.clumsyEntryCount === 0" @click="releaseLeaks">Proper cleanup</button>
        </div>
      </section>

      <section class="code-card" aria-labelledby="code-title">
        <p class="section-label">Code to debug</p>
        <h2 id="code-title">Le cycle n’est pas la leak</h2>
        <figure class="code-snippet">
          <figcaption><code>00-basic/src/memory-leak.js</code></figcaption>
          <pre><code>export function unlinkStructure(a) {
  a.b = null;
  a.c = null;
}

export function leakStructure(a) {
  myClumsyArray.push({ id: a.name, b: a.b, c: a.c });
  unlinkStructure(a);
}</code></pre>
        </figure>
        <h3>Le batch et son cleanup</h3>
        <figure class="code-snippet">
          <figcaption><code>00-basic/src/lab-controller.js</code></figcaption>
          <pre><code>export function makeClumsyEntries(count = 10_000) {
  for (let index = 0; index &lt; count; index += 1) {
    leakStructure(buildStructure(BATCH_PAYLOAD_SIZE));
  }

  return getLabState();
}

export function emptyClumsyArray() {
  myClumsyArray.length = 0;
  return getLabState();
}</code></pre>
        </figure>
        <p>Dans DevTools, l’API est disponible sous <code>window.memoryLeakLab</code>. Prenez deux <strong>heap snapshots</strong>, filtrez sur <code>Brol</code>, puis suivez le <strong>retaining path</strong>.</p>
      </section>
    </main>

    <footer class="site-footer">
      <span>© {{ currentYear }} Dercetech SRL</span>
      <a href="https://training.dercetech.com">training.dercetech.com</a>
    </footer>
  </div>
</template>
