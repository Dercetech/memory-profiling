/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import Phaser from 'phaser';
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  MAX_VISIBLE_ORBS,
  PLAYER_SPEED
} from '../config.js';
import { formatNativeMemoryUsage } from '../memory-usage.js';
import { createPhysicalControls } from '../physical-controls.js';

export class OrbCollectorScene extends Phaser.Scene {
  constructor() {
    super('orb-collector');
  }

  create() {
    this.createTextures();

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x111827);
    this.add.grid(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      40,
      40,
      0x1f2937,
      0x243044,
      0.45
    );

    this.player = this.physics.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'player');
    this.player.setCollideWorldBounds(true);

    this.orbs = this.physics.add.group();
    this.orbAnimations = [];
    this.score = 0;
    this.scoreLabel = this.add
      .text(24, 20, 'Orbes ramassées : 0', {
        color: '#f8fafc',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold'
      })
      .setDepth(1);
    this.memoryLabel = this.add
      .text(24, 49, formatNativeMemoryUsage(), {
        color: '#94a3b8',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '15px'
      })
      .setDepth(1);

    this.controls = createPhysicalControls(this.input.keyboard);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.controls.destroy());

    this.physics.add.overlap(this.player, this.orbs, this.collectOrb, undefined, this);

    for (let index = 0; index < 7; index += 1) {
      this.spawnOrb();
    }

    this.time.addEvent({ delay: 900, callback: this.spawnOrb, callbackScope: this, loop: true });
    this.time.addEvent({
      delay: 1000,
      callback: () => this.memoryLabel.setText(formatNativeMemoryUsage()),
      loop: true
    });
  }

  createTextures() {
    if (!this.textures.exists('player')) {
      const player = this.add.graphics();
      player.fillStyle(0x38bdf8);
      player.fillCircle(16, 16, 16);
      player.lineStyle(3, 0xe0f2fe);
      player.strokeCircle(16, 16, 14);
      player.generateTexture('player', 32, 32);
      player.destroy();
    }

    if (!this.textures.exists('orb')) {
      const orb = this.add.graphics();
      orb.fillStyle(0xfbbf24, 0.2);
      orb.fillCircle(16, 16, 16);
      orb.fillStyle(0xfef3c7);
      orb.fillCircle(16, 16, 8);
      orb.generateTexture('orb', 32, 32);
      orb.destroy();
    }
  }

  spawnOrb() {
    if (this.orbs.countActive(true) >= MAX_VISIBLE_ORBS) {
      return;
    }

    const orb = this.orbs.create(
      Phaser.Math.Between(32, GAME_WIDTH - 32),
      Phaser.Math.Between(82, GAME_HEIGHT - 32),
      'orb'
    );

    orb.setData('spawnedAt', performance.now());
    orb.setScale(Phaser.Math.FloatBetween(0.75, 1.2));

    const animation = this.tweens.add({
      targets: orb,
      scale: orb.scaleX * 1.18,
      duration: 600,
      yoyo: true,
      repeat: -1
    });

    // Fuite intentionnelle du laboratoire : l'animation conserve chaque orbe
    // ramassée, même après sa destruction visuelle.
    this.orbAnimations.push(animation);
  }

  collectOrb(player, orb) {
    orb.destroy();
    this.score += 1;
    this.scoreLabel.setText(`Orbes ramassées : ${this.score}`);
  }

  update() {
    this.player.setVelocity(0);
    this.player.setVelocityX(this.controls.horizontal * PLAYER_SPEED);
    this.player.setVelocityY(this.controls.vertical * PLAYER_SPEED);
  }
}
