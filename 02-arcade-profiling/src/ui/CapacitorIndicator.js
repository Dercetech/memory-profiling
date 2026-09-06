/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import { CAPACITOR, GAME_DIMENSIONS } from '../config/game.js';

export class CapacitorIndicator {
  constructor(scene, ship) {
    this.ship = ship;
    this.points = 0;
    this.graphics = scene.add.graphics().setDepth(4);
    this.label = scene.add
      .text(0, 0, '', {
        font: '14px Courier',
        fill: '#9cf7ff',
        stroke: '#001116',
        strokeThickness: 3
      })
      .setOrigin(0.5, 0)
      .setDepth(4);
  }

  setPoints(points) {
    this.points = points;
  }

  update(time) {
    this.graphics.clear();

    if (!this.ship.active || !this.ship.visible) {
      this.label.setVisible(false);
      return;
    }

    const x = this.ship.x;
    const y = Math.min(this.ship.y + 50, GAME_DIMENSIONS.height - 24);
    const width = 76;
    const height = 7;
    const percentage = this.points / CAPACITOR.maximumPoints;
    const canFireSpecial = this.points >= CAPACITOR.specialAttackCost;
    const isFull = this.points === CAPACITOR.maximumPoints;

    this.graphics.fillStyle(0x001116, 0.8);
    this.graphics.fillRect(x - width / 2, y, width, height);
    this.graphics.fillStyle(0x48d9ff, 0.9);
    this.graphics.fillRect(x - width / 2, y, width * percentage, height);
    this.graphics.lineStyle(1, 0x9cf7ff, 0.9);
    this.graphics.strokeRect(x - width / 2, y, width, height);

    this.label.setVisible(true);
    this.label.setPosition(x, y + height + 2);
    this.label.setText(this.getLabel(time, canFireSpecial, isFull));
  }

  getLabel(time, canFireSpecial, isFull) {
    if (isFull) {
      return 'FULL';
    }

    if (canFireSpecial) {
      return Math.floor(time / 500) % 2 === 0 ? 'PRESS X' : 'CHARGING';
    }

    return `CHARGING ${Math.floor(this.points)}%`;
  }

  destroy() {
    this.graphics.destroy();
    this.label.destroy();
  }
}
