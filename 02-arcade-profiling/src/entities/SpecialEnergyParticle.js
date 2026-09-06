/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import Phaser from 'phaser';

import { ASSET_KEYS } from '../config/assets.js';
import { SPECIAL_ATTACK } from '../config/game.js';

export class SpecialEnergyParticle extends Phaser.Physics.Arcade.Image {
  constructor(scene) {
    super(scene, 0, 0, ASSET_KEYS.space, 'blue');

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setBlendMode(Phaser.BlendModes.ADD);
    this.setDepth(2);
    this.lifespan = 0;
  }

  fire(ship, angle) {
    this.lifespan = SPECIAL_ATTACK.particleLifespan;
    this.setActive(true);
    this.setVisible(true);
    this.setScale(1.15);
    this.setPosition(ship.x, ship.y);
    this.body.reset(ship.x, ship.y);
    this.body.setCircle(6, 2, 2);

    this.scene.physics.velocityFromRotation(
      angle,
      SPECIAL_ATTACK.particleSpeed,
      this.body.velocity
    );
  }

  update(_, delta) {
    this.lifespan -= delta;

    if (this.lifespan <= 0) {
      this.setVisible(false);
      // this.destroy(); manque ici
    }
  }
}
