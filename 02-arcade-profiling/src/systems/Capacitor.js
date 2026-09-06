/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import { CAPACITOR } from '../config/game.js';

export class Capacitor {
  constructor(onStateChanged) {
    this.onStateChanged = onStateChanged;
    this.points = 0;

    this.notifyStateChanged();
  }

  update(delta) {
    const previousWholePoints = Math.floor(this.points);

    this.points = Math.min(
      CAPACITOR.maximumPoints,
      this.points + (delta / 1000) * CAPACITOR.rechargePerSecond
    );

    if (Math.floor(this.points) !== previousWholePoints) {
      this.notifyStateChanged();
    }
  }

  spend(points) {
    if (this.points < points) {
      return false;
    }

    this.points -= points;
    this.notifyStateChanged();
    return true;
  }

  restoreFully() {
    if (this.points === CAPACITOR.maximumPoints) {
      return;
    }

    this.points = CAPACITOR.maximumPoints;
    this.notifyStateChanged();
  }

  notifyStateChanged() {
    this.onStateChanged?.(this.points, CAPACITOR.maximumPoints);
  }

  destroy() {
    this.onStateChanged = undefined;
  }
}
