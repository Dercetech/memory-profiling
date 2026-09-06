/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import { drawPixelText } from '../commons/canvas-fonts.js';
import { Raindrop } from './models.js';
import { createCloud, createLandscape } from './procgen.js';

const SKY = '#75b9e7';
const RAIN = '#d7f3ff';
const WATER = '#2387c9';

const keyOf = (x, y) => `${x}:${y}`;
const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
const randomInt = (minimum, maximum) =>
  Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

// Le petit monde du lab : il connaît le terrain, les nuages et chaque goutte
// encore visible. C’est volontairement un monde très attentif à ses gouttes.
export class RainWorld {
  constructor(width, height, dropLifetime) {
    this.width = width;
    this.height = height;
    this.dropLifetime = dropLifetime;
    this.landscape = createLandscape(width, height);
    this.clouds = [
      createCloud(width * 0.08, height * 0.12, width),
      createCloud(width * 0.42, height * 0.2, width),
      createCloud(width * 0.74, height * 0.1, width)
    ];
    this.drops = [];
    this.rainfallSamples = [];
    this.spawnBudget = 0;
    this.rainMultiplier = 1;
  }

  setDropLifetime(milliseconds) {
    // Le slider règle combien de temps une goutte reste au sol avant de
    // disparaître du paysage.
    this.dropLifetime = milliseconds;
  }

  setRainMultiplier(multiplier) {
    // Les boutons Rain x1, x2 et x4 ne changent pas la pluie existante : ils
    // changent seulement la cadence d’arrivée des nouvelles gouttes.
    this.rainMultiplier = multiplier;
  }

  clearDrops(now) {
    // Retire les gouttes visibles d’un coup. Elles sont toutefois gardées dans
    // rainfallSamples : c’est le défaut intentionnel que le lab invite à voir.
    for (const drop of this.drops) {
      drop.expiredAt = now;
      this.rainfallSamples.push(drop);
    }

    this.drops = [];
  }

  isBlocked(x, y, occupied) {
    // Répond à la question simple : « une goutte peut-elle prendre cette case ? »
    // Le sol, les bords et les autres flaques comptent comme des obstacles.
    if (x < 0 || x >= this.width || y >= this.height) return true;
    return this.landscape.solidCells.has(keyOf(x, y)) || occupied.has(keyOf(x, y));
  }

  spawnDrop(now) {
    // Fait apparaître une nouvelle goutte un peu au-dessus de l’écran, pour
    // qu’elle entre naturellement dans le paysage en tombant.
    this.drops.push(
      new Raindrop(randomInt(0, this.width - 1), -randomInt(1, 12), now)
    );
  }

  settleDrop(drop, occupied, now) {
    // Une goutte qui rencontre le sol, ou une autre goutte, s’arrête à la
    // première case libre au-dessus. Elle devient alors une petite flaque.
    const x = clamp(Math.round(drop.x), 0, this.width - 1);
    let y = clamp(Math.floor(drop.y), 0, this.height - 1);

    while (y > 0 && this.isBlocked(x, y, occupied)) {
      y -= 1;
    }

    drop.x = x;
    drop.y = y;
    drop.velocity = 0;
    drop.state = 'settled';
    drop.settledAt = now;
    drop.nextFlowAt = now + randomInt(45, 110);
    occupied.add(keyOf(x, y));
  }

  moveSettledDrop(drop, occupied, now) {
    // Une flaque ne reste pas forcément figée : si son support disparaît, elle
    // peut reprendre sa descente ou glisser sur le côté. Chaque goutte au sol
    // est donc régulièrement reconsidérée.
    const currentKey = keyOf(drop.x, drop.y);
    occupied.delete(currentKey);

    if (now >= drop.nextFlowAt) {
      const directions = Math.random() < 0.5 ? [-1, 1] : [1, -1];

      if (!this.isBlocked(drop.x, drop.y + 1, occupied)) {
        drop.y += 1;
      } else {
        for (const direction of directions) {
          const nextX = drop.x + direction;

          if (!this.isBlocked(nextX, drop.y + 1, occupied)) {
            drop.x = nextX;
            drop.y += 1;
            break;
          }

          if (
            !this.isBlocked(nextX, drop.y, occupied) &&
            this.isBlocked(nextX, drop.y + 1, occupied)
          ) {
            drop.x = nextX;
            break;
          }
        }
      }

      drop.nextFlowAt = now + randomInt(45, 110);
    }

    occupied.add(keyOf(drop.x, drop.y));
  }

  update(delta, now) {
    // Un tick du monde : les nuages avancent, la pluie arrive, chaque goutte
    // tombe, se pose, glisse ou expire. Le coût augmente avec le nombre de
    // gouttes que ce passage doit examiner.
    for (const cloud of this.clouds) {
      cloud.x += cloud.speed * delta;
      if (cloud.x > this.width + cloud.width) cloud.x = -cloud.width;
    }

    this.spawnBudget += delta * Math.max(14, this.width / 8) * this.rainMultiplier;
    while (this.spawnBudget >= 1) {
      this.spawnDrop(now);
      this.spawnBudget -= 1;
    }

    const occupied = new Set(
      this.drops
        .filter((drop) => drop.state === 'settled')
        .map((drop) => keyOf(drop.x, drop.y))
    );
    const activeDrops = [];

    for (const drop of this.drops) {
      drop.positions.push({ x: drop.x, y: drop.y, at: now });

      if (drop.state === 'falling') {
        drop.velocity += 36 * delta;
        const nextY = drop.y + drop.velocity * delta;
        const cellX = clamp(Math.round(drop.x), 0, this.width - 1);
        const cellY = Math.floor(nextY);

        if (cellY >= 0 && this.isBlocked(cellX, cellY + 1, occupied)) {
          drop.y = cellY;
          this.settleDrop(drop, occupied, now);
        } else {
          drop.y = nextY;
        }
      } else if (now - drop.settledAt >= this.dropLifetime) {
        drop.expiredAt = now;
        this.rainfallSamples.push(drop);
        continue;
      } else {
        this.moveSettledDrop(drop, occupied, now);
      }

      activeDrops.push(drop);
    }

    this.drops = activeDrops;
  }

  draw(context) {
    // Dessine l’état actuel. Cette fonction montre le résultat ; la mécanique
    // qui coûte du travail se trouve surtout dans update().
    context.fillStyle = SKY;
    context.fillRect(0, 0, this.width, this.height);

    for (const cloud of this.clouds) {
      for (const pixel of cloud.pixels) {
        context.fillStyle = pixel.color;
        context.fillRect(Math.round(cloud.x + pixel.x), cloud.y + pixel.y, 1, 1);
      }
    }

    for (const pixel of this.landscape.pixels) {
      context.fillStyle = pixel.color;
      context.fillRect(pixel.x, pixel.y, 1, 1);
    }

    for (const drop of this.drops) {
      context.fillStyle = drop.state === 'settled' ? WATER : RAIN;
      context.fillRect(Math.round(drop.x), Math.round(drop.y), 1, 1);
    }

    drawPixelText(context, 'training.dercetech.com', this.width / 2, 4);
  }

  getStats() {
    // Donne à l’interface les deux compteurs lisibles sous le paysage.
    let falling = 0;
    let settled = 0;

    for (const drop of this.drops) {
      if (drop.state === 'falling') falling += 1;
      else settled += 1;
    }

    return { falling, settled };
  }
}
