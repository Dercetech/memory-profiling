/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import { PhysicalPixel } from './models.js';

const EARTH = ['#6f4428', '#865334', '#9b6741'];
const GRASS = ['#39753a', '#4f9144', '#70aa4f'];
const CLOUD = ['#f7fbff', '#e7f0f5', '#d5e2ea'];

const keyOf = (x, y) => `${x}:${y}`;
const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
const randomInt = (minimum, maximum) =>
  Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

export function createLandscape(width, height) {
  const pixels = [];
  const solidCells = new Set();
  let earthHeight = randomInt(5, 10);
  let grassHeight = randomInt(2, 4);

  for (let x = 0; x < width; x += 1) {
    if (x > 0) {
      earthHeight = clamp(earthHeight + randomInt(-2, 2), 5, 10);
      grassHeight = clamp(grassHeight + randomInt(-1, 1), 2, 4);
    }

    const earthTop = height - earthHeight;
    const grassTop = earthTop - grassHeight;

    for (let y = earthTop; y < height; y += 1) {
      pixels.push(new PhysicalPixel(x, y, EARTH[randomInt(0, EARTH.length - 1)], true));
      solidCells.add(keyOf(x, y));
    }

    for (let y = grassTop; y < earthTop; y += 1) {
      pixels.push(new PhysicalPixel(x, y, GRASS[randomInt(0, GRASS.length - 1)], true));
      solidCells.add(keyOf(x, y));
    }
  }

  return { pixels, solidCells };
}

export function createCloud(x, y, width) {
  const pixels = [];
  const cloudWidth = randomInt(16, 28);
  const cloudHeight = randomInt(4, 7);

  for (let offsetX = 0; offsetX < cloudWidth; offsetX += 1) {
    for (let offsetY = 0; offsetY < cloudHeight; offsetY += 1) {
      const center = cloudWidth / 2;
      const distance = Math.abs(offsetX - center) / center;
      const roof = Math.floor(distance * 2);

      if (offsetY >= roof && !(offsetY === cloudHeight - 1 && Math.random() < 0.15)) {
        pixels.push(new PhysicalPixel(offsetX, offsetY, CLOUD[(offsetX + offsetY) % CLOUD.length]));
      }
    }
  }

  return {
    x: x % width,
    y,
    speed: 0.6 + Math.random() * 0.5,
    width: cloudWidth,
    pixels
  };
}
