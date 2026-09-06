/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
/*
 * Jem's "It's Raining Mem" — a small weather system with a very large opinion of itself.
 *
 * - The world simulation lives in src/simulation/rain-world.js. RainWorld owns clouds,
 *   landscape, raindrops, occupancy, and the historical rainfallSamples array.
 * - RainCanvas.vue refreshes that world. Its animate() function is the tick: each
 *   requestAnimationFrame calls world.update(delta, timestamp), then world.draw().
 * - RainWorld.update() spends from spawnBudget and calls spawnDrop() to create drops.
 * - A falling drop settles when isBlocked() finds landscape or another settled drop below it.
 *   settledAt starts its on-the-ground lifetime; once it expires, update() removes it from
 *   active drops but keeps it in rainfallSamples for the memory investigation.
 * - When the support under a settled drop disappears, moveSettledDrop() notices the new gap
 *   on a later tick and lets the drop flow down or sideways. Gravity remains employed.
 * - Every active drop is inspected, moved, drawn, and sampled on every tick. A large puddle
 *   is therefore a perfectly earnest way to turn gentle rain into CPU work. Each to their hobby.
 */
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

createApp(App).mount('#app');
