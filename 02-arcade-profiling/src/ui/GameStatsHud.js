/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import { CAPACITOR, GAME_DIMENSIONS } from '../config/game.js';

export class GameStatsHud {
  constructor(scene) {
    this.kills = 0;
    this.collisions = 0;

    const textStyle = {
      font: '20px Courier',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    };

    this.killsText = scene
      .add.text(12, GAME_DIMENSIONS.height - 36, '', textStyle)
      .setOrigin(0, 1)
      .setDepth(10);
    this.collisionsText = scene.add
      .text(12, GAME_DIMENSIONS.height - 12, '', textStyle)
      .setOrigin(0, 1)
      .setDepth(10);
    this.blastHint = scene.add
      .text(GAME_DIMENSIONS.width / 2, GAME_DIMENSIONS.height - 36, 'X: BLAST', textStyle)
      .setOrigin(0.5, 1)
      .setDepth(10);
    this.shieldBoostHint = scene.add
      .text(GAME_DIMENSIONS.width / 2, GAME_DIMENSIONS.height - 12, 'C: SHIELD BOOST', textStyle)
      .setOrigin(0.5, 1)
      .setDepth(10);
    this.fastRotateHint = scene.add
      .text(GAME_DIMENSIONS.width - 12, GAME_DIMENSIONS.height - 12, 'SHIFT: FAST ROTATE', textStyle)
      .setOrigin(1, 1)
      .setDepth(10);
    this.shootHint = scene.add
      .text(GAME_DIMENSIONS.width - 12, GAME_DIMENSIONS.height - 36, 'SPACE: SHOOT', textStyle)
      .setOrigin(1, 1)
      .setDepth(10);

    this.setCapacitor(0);
    this.render();
  }

  addKill() {
    this.kills += 1;
    this.render();
  }

  addCollision() {
    this.collisions += 1;
    this.render();
  }

  setCapacitor(points) {
    this.blastHint.setColor(
      points >= CAPACITOR.blastIndicatorThreshold ? '#9cf7ff' : '#6c7780'
    );
    this.shieldBoostHint.setColor(
      points >= CAPACITOR.shieldTransferCost ? '#9cf7ff' : '#6c7780'
    );
  }

  render() {
    this.killsText.setText(`Kills: ${this.kills}`);
    this.collisionsText.setText(`Collisions: ${this.collisions}`);
  }
}
