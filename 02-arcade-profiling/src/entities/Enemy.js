/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import Phaser from 'phaser';

import { ASSET_KEYS } from '../config/assets.js';
import { ENEMIES } from '../config/game.js';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 0, 0, ASSET_KEYS.mineSheet);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(1);
    this.hasEnteredArena = false;
    this.hitPoints = ENEMIES.maximumHitPoints;
    this.target = new Phaser.Math.Vector2();
  }

  launch({ innerBounds, outerBounds }) {
    this.play(ASSET_KEYS.mineAnimation);
    this.hasEnteredArena = false;
    this.hitPoints = ENEMIES.maximumHitPoints;

    const position = Phaser.Geom.Rectangle.RandomOutside(outerBounds, innerBounds);
    innerBounds.getRandomPoint(this.target);

    this.setActive(true);
    this.setVisible(true);
    this.setPosition(position.x, position.y);
    this.body.reset(position.x, position.y);

    const angle = Phaser.Math.Angle.BetweenPoints(position, this.target);
    const speed = Phaser.Math.Between(ENEMIES.minimumSpeed, ENEMIES.maximumSpeed);

    this.scene.physics.velocityFromRotation(angle, speed, this.body.velocity);
  }

  update() {
    const isWithinArena = this.scene.innerBounds.contains(this.x, this.y);

    if (!this.hasEnteredArena && isWithinArena) {
      this.hasEnteredArena = true;
    } else if (this.hasEnteredArena && !isWithinArena) {
      const scene = this.scene;

      this.destroy();
      scene.spawnEnemy();
    }
  }

  takeDamage(damage) {
    this.hitPoints = Math.max(0, this.hitPoints - damage);

    return this.hitPoints === 0;
  }
}
