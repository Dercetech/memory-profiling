<script setup>
import { computed, ref } from 'vue';
import RainCanvas from './components/RainCanvas.vue';

const dropLifetime = ref(4000);
const stats = ref({
  falling: 0,
  settled: 0,
  memory: null,
  workTime: null,
  budget: 1000 / 60,
  budgetUsed: null
});
const rainMultiplier = ref(1);
const rainCanvas = ref(null);
const currentYear = new Date().getFullYear();

const lifetimeLabel = computed(() => {
  const seconds = dropLifetime.value / 1000;
  return `${seconds.toLocaleString('fr-BE', { maximumFractionDigits: 1 })} s`;
});

const memoryLabel = computed(() => {
  if (stats.value.memory === null) {
    return 'Mémoire JS indisponible';
  }

  return `Mémoire JS ${stats.value.memory.toFixed(1)} Mo`;
});

const cpuLabel = computed(() => {
  if (stats.value.workTime === null || stats.value.budgetUsed === null) {
    return `CPU JS — / ${stats.value.budget.toFixed(2)} ms`;
  }

  return `CPU JS ${stats.value.workTime.toFixed(2)} ms / ${stats.value.budget.toFixed(2)} ms (${stats.value.budgetUsed.toFixed(1)} %)`;
});

function setRainMultiplier(multiplier) {
  rainMultiplier.value = multiplier;
}

function removeRaindrops() {
  rainMultiplier.value = 0;
  rainCanvas.value?.clearDrops();
}
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div>
        <p class="eyebrow">Laboratoire 01 · Fuite mémoire</p>
        <h1>It’s Raining Mem</h1>
        <p class="aka">aka Jem’s Memory Leak lab</p>
      </div>
      <div class="header-actions" aria-label="Commandes de pluie">
        <button
          type="button"
          :aria-pressed="rainMultiplier === 1"
          @click="setRainMultiplier(1)"
        >
          Rain ×1
        </button>
        <button
          type="button"
          :aria-pressed="rainMultiplier === 2"
          @click="setRainMultiplier(2)"
        >
          Rain ×2
        </button>
        <button
          type="button"
          :aria-pressed="rainMultiplier === 4"
          @click="setRainMultiplier(4)"
        >
          Rain ×4
        </button>
        <button
          type="button"
          :aria-pressed="rainMultiplier === 0"
          @click="removeRaindrops"
        >
          Remove raindrops
        </button>
      </div>
    </header>

    <main class="simulator">
      <RainCanvas
        ref="rainCanvas"
        :drop-lifetime="dropLifetime"
        :rain-multiplier="rainMultiplier"
        @stats="stats = $event"
      />

      <section class="controls" aria-labelledby="lifetime-title">
        <div class="control-heading">
          <label id="lifetime-title" for="drop-lifetime">
            Durée de vie d’une goutte au sol
          </label>
          <output for="drop-lifetime">{{ lifetimeLabel }}</output>
        </div>
        <input
          id="drop-lifetime"
          v-model.number="dropLifetime"
          type="range"
          min="500"
          max="15000"
          step="500"
        />
        <p class="stats">
          <span>{{ stats.falling }} gouttes tombent</span>
          <span>{{ stats.settled }} gouttes au sol</span>
          <span>{{ memoryLabel }}</span>
          <span>{{ cpuLabel }}</span>
        </p>
      </section>
    </main>

    <footer class="site-footer">
      <span>© {{ currentYear }} Dercetech SRL</span>
      <a href="https://training.dercetech.com">training.dercetech.com</a>
    </footer>
  </div>
</template>
