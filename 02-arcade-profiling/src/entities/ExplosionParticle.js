/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import Phaser from 'phaser';

import { ASSET_KEYS } from '../config/assets.js';
import { EXPLOSIONS } from '../config/game.js';

export class ExplosionParticle extends Phaser.Physics.Arcade.Image {
  constructor(scene) {
    super(scene, 0, 0, ASSET_KEYS.explosion, 'red');

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setBlendMode(Phaser.BlendModes.ADD);
    this.setDepth(1);
    this.setScale(0.3);
    this.fadeRemaining = EXPLOSIONS.particleFadeDuration;
  }

  explode(x, y) {
    this.fadeRemaining = EXPLOSIONS.particleFadeDuration;
    this.setAlpha(1);
    this.setPosition(x, y);
    this.body.reset(x, y);
    this.scene.physics.velocityFromRotation(
      Phaser.Math.FloatBetween(0, Math.PI * 2),
      Phaser.Math.Between(EXPLOSIONS.minimumSpeed, EXPLOSIONS.maximumSpeed),
      this.body.velocity
    );
  }

  update(_, delta) {
    this.fadeRemaining -= delta;

    if (this.fadeRemaining <= 0) {
      this.setAlpha(0);
      return;
    }

    this.setAlpha(this.fadeRemaining / EXPLOSIONS.particleFadeDuration);
  }
}
