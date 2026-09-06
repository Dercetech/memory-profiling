/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import { GAME_DIMENSIONS } from '../config/game.js';

export class PauseOverlay {
  constructor(scene) {
    this.shade = scene.add
      .rectangle(
        GAME_DIMENSIONS.width / 2,
        GAME_DIMENSIONS.height / 2,
        GAME_DIMENSIONS.width,
        GAME_DIMENSIONS.height,
        0x000000,
        0.72
      )
      .setDepth(50)
      .setVisible(false);
    this.label = scene.add
      .text(GAME_DIMENSIONS.width / 2, GAME_DIMENSIONS.height / 2, 'PAUSED\nPRESS ESC TO RESUME', {
        font: '28px Courier',
        align: 'center',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 5
      })
      .setOrigin(0.5)
      .setDepth(51)
      .setVisible(false);
  }

  setPaused(isPaused) {
    this.shade.setVisible(isPaused);
    this.label.setVisible(isPaused);
  }

  destroy() {
    this.shade.destroy();
    this.label.destroy();
  }
}
