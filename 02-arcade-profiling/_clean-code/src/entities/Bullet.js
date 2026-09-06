/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import Phaser from 'phaser';

import { ASSET_KEYS } from '../config/assets.js';
import { BULLETS } from '../config/game.js';

export class Bullet extends Phaser.Physics.Arcade.Image {
  constructor(scene) {
    super(scene, 0, 0, ASSET_KEYS.space, 'blaster');

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setBlendMode(Phaser.BlendModes.ADD);
    this.setDepth(1);
    this.lifespan = BULLETS.lifespan;
    this.deactivate();
  }

  fire(ship) {
    this.lifespan = BULLETS.lifespan;
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
    this.setAngle(ship.body.rotation);
    this.setPosition(ship.x, ship.y);
    this.body.reset(ship.x, ship.y);
    this.body.setSize(10, 10, true);

    const angle = Phaser.Math.DegToRad(ship.body.rotation);

    this.scene.physics.velocityFromRotation(angle, BULLETS.speed, this.body.velocity);
    this.body.velocity.scale(2);
  }

  update(_, delta) {
    this.lifespan -= delta;

    if (this.lifespan <= 0) {
      this.deactivate();
    }
  }

  deactivate() {
    this.setActive(false);
    this.setVisible(false);
    this.body.stop();
    this.body.enable = false;
  }
}
