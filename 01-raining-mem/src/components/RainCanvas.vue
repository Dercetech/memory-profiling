<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { FrameMetrics } from '../monitoring/frame-metrics.js';
import { RainWorld } from '../simulation/rain-world.js';

const props = defineProps({
  dropLifetime: {
    type: Number,
    required: true
  },
  rainMultiplier: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['stats']);
const canvas = ref(null);
const frame = ref(null);

let animationFrame = 0;
let lastFrame = 0;
let lastStatsUpdate = 0;
let resizeObserver;
let world;
const frameMetrics = new FrameMetrics();
let latestFrameMetrics = frameMetrics.snapshot;

function resizeWorld() {
  if (!canvas.value || !frame.value) return;

  const bounds = frame.value.getBoundingClientRect();
  const pixelSize = bounds.width < 640 ? 3 : 4;
  const width = Math.max(160, Math.floor(bounds.width / pixelSize));
  const height = Math.max(80, Math.floor(bounds.height / pixelSize));

  canvas.value.width = width;
  canvas.value.height = height;
  world = new RainWorld(width, height, props.dropLifetime);
}

function readMemory() {
  const usedBytes = performance.memory?.usedJSHeapSize;
  return Number.isFinite(usedBytes) ? usedBytes / (1024 * 1024) : null;
}

function animate(timestamp) {
  const frameTime = lastFrame === 0 ? 0 : timestamp - lastFrame;
  const delta = Math.min(frameTime / 1000, 0.05);
  lastFrame = timestamp;

  if (world && canvas.value) {
    const workStartedAt = performance.now();
    world.update(delta, timestamp);
    world.draw(canvas.value.getContext('2d'));
    const workTime = performance.now() - workStartedAt;

    if (frameTime > 0) {
      latestFrameMetrics = frameMetrics.record(frameTime, workTime) ?? latestFrameMetrics;
    }

    if (timestamp - lastStatsUpdate > 250) {
      emit('stats', {
        ...world.getStats(),
        memory: readMemory(),
        ...latestFrameMetrics
      });
      lastStatsUpdate = timestamp;
    }
  }

  animationFrame = requestAnimationFrame(animate);
}

watch(
  () => props.dropLifetime,
  (lifetime) => world?.setDropLifetime(lifetime)
);

watch(
  () => props.rainMultiplier,
  (multiplier) => world?.setRainMultiplier(multiplier)
);

function clearDrops() {
  world?.clearDrops(performance.now());
}

defineExpose({ clearDrops });

onMounted(() => {
  resizeObserver = new ResizeObserver(resizeWorld);
  resizeObserver.observe(frame.value);
  resizeWorld();
  animationFrame = requestAnimationFrame(animate);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect();
});
</script>

<template>
  <div ref="frame" class="canvas-frame">
    <canvas
      ref="canvas"
      role="img"
      aria-label="Paysage en pixel art sous la pluie, avec des gouttes qui forment des flaques dans les creux du terrain"
    ></canvas>
  </div>
</template>
