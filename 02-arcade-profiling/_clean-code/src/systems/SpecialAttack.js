/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import { SPECIAL_ATTACK } from '../config/game.js';

export class SpecialAttack {
  constructor(ship, particles) {
    this.ship = ship;
    this.particles = particles;
  }

  fire() {
    for (let index = 0; index < SPECIAL_ATTACK.particlesPerRing; index += 1) {
      const particle = this.particles.getFirstDead(false);

      if (!particle) {
        break;
      }

      const angle = (index / SPECIAL_ATTACK.particlesPerRing) * Math.PI * 2;
      particle.fire(this.ship, angle);
    }
  }

  destroy() {
    this.particles = undefined;
  }
}
