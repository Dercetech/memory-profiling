/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import Phaser from 'phaser';

import { ASSET_KEYS, loadGameAssets } from '../config/assets.js';
import {
  BULLETS,
  CAPACITOR,
  ENEMIES,
  EXPLOSIONS,
  GAME_DIMENSIONS,
  PLAYER,
  SHIELD,
  SPECIAL_ATTACK,
  WORLD_BOUNDS
} from '../config/game.js';
import { Bullet } from '../entities/Bullet.js';
import { EnergyShield } from '../entities/EnergyShield.js';
import { ExplosionParticle } from '../entities/ExplosionParticle.js';
import { SpecialEnergyParticle } from '../entities/SpecialEnergyParticle.js';
import { KeyboardControls } from '../input/KeyboardControls.js';
import { calculateCollisionDamage } from '../systems/calculateCollisionDamage.js';
import { Capacitor } from '../systems/Capacitor.js';
import { Enemy } from '../entities/Enemy.js';
import { PlayerRespawnController } from '../systems/PlayerRespawnController.js';
import { SpecialAttack } from '../systems/SpecialAttack.js';
import { GameStatsHud } from '../ui/GameStatsHud.js';
import { PauseOverlay } from '../ui/PauseOverlay.js';
import { ProfilingHud } from '../ui/ProfilingHud.js';
import { ShipLifeIndicator } from '../ui/ShipLifeIndicator.js';
import { CapacitorIndicator } from '../ui/CapacitorIndicator.js';

export class JemAsteroidsScene extends Phaser.Scene {
  constructor() {
    super('JemAsteroidsScene');
  }

  preload() {
    loadGameAssets(this);
  }

  create() {
    this.lastFiredAt = 0;
    this.isPaused = false;
    this.innerBounds = new Phaser.Geom.Rectangle(
      WORLD_BOUNDS.inner.x,
      WORLD_BOUNDS.inner.y,
      WORLD_BOUNDS.inner.width,
      WORLD_BOUNDS.inner.height
    );
    this.outerBounds = new Phaser.Geom.Rectangle(
      WORLD_BOUNDS.outer.x,
      WORLD_BOUNDS.outer.y,
      WORLD_BOUNDS.outer.width,
      WORLD_BOUNDS.outer.height
    );

    this.createMineAnimation();
    this.createBackground();
    this.createObjectGroups();
    this.createShip();
    this.createControls();
    this.createEffects();
    this.registerCollisions();
    this.spawnInitialEnemies();
    this.profilingHud = new ProfilingHud(this);
    this.gameStatsHud = new GameStatsHud(this);
    this.lifeIndicator = new ShipLifeIndicator(this, this.ship);
    this.playerRespawn = new PlayerRespawnController(
      this,
      this.ship,
      this.lifeIndicator.setLife.bind(this.lifeIndicator)
    );
    this.energyShield = new EnergyShield(
      this,
      this.ship,
      this.lifeIndicator.setShield.bind(this.lifeIndicator)
    );
    this.capacitorIndicator = new CapacitorIndicator(this, this.ship);
    this.capacitor = new Capacitor(
      (points) => {
        this.capacitorIndicator.setPoints(points);
        this.gameStatsHud.setCapacitor(points);
      }
    );
    this.specialAttack = new SpecialAttack(this.ship, this.specialParticles);
    this.pauseOverlay = new PauseOverlay(this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
  }

  createMineAnimation() {
    this.textures.addSpriteSheetFromAtlas(ASSET_KEYS.mineSheet, {
      atlas: ASSET_KEYS.space,
      frame: 'mine',
      frameWidth: 64
    });
    this.anims.create({
      key: ASSET_KEYS.mineAnimation,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.mineSheet, { start: 0, end: 15 }),
      frameRate: 20,
      repeat: -1
    });
  }

  createBackground() {
    this.add.tileSprite(
      GAME_DIMENSIONS.width / 2,
      GAME_DIMENSIONS.height / 2,
      GAME_DIMENSIONS.width,
      GAME_DIMENSIONS.height,
      ASSET_KEYS.background
    );
    this.add.image(200, 200, ASSET_KEYS.space, 'purple-planet').setOrigin(0);
  }

  createObjectGroups() {
    this.bullets = this.physics.add.group({
      runChildUpdate: true
    });
    this.enemies = this.physics.add.group({
      runChildUpdate: true
    });
    this.specialParticles = this.physics.add.group({
      runChildUpdate: true
    });
    this.explosionDebris = this.physics.add.group({
      runChildUpdate: true
    });
  }

  createShip() {
    this.ship = this.physics.add.image(PLAYER.startX, PLAYER.startY, ASSET_KEYS.space, 'ship').setDepth(2);
    this.ship.setDamping(true);
    this.ship.setDrag(0.95);
    this.ship.setMaxVelocity(PLAYER.maximumVelocity);
  }

  createControls() {
    this.controls = new KeyboardControls();
  }

  createEffects() {
    this.explosionFlash = this.add.particles(ASSET_KEYS.explosion);
    this.explosionFlash.createEmitter({
      frame: 'muzzleflash2',
      lifespan: 220,
      scale: { start: 2, end: 0 },
      rotate: { start: 0, end: 180 },
      blendMode: 'ADD',
      on: false
    });

    const thrustParticles = this.add.particles(ASSET_KEYS.space);
    const thrustEmitter = thrustParticles.createEmitter({
      frame: 'blue',
      speed: 200,
      lifespan: {
        onEmit: () => Phaser.Math.Percent(this.ship.body.speed, 0, PLAYER.maximumVelocity) * 2000
      },
      alpha: {
        onEmit: () => Phaser.Math.Percent(this.ship.body.speed, 0, PLAYER.maximumVelocity)
      },
      angle: {
        onEmit: () => this.ship.angle - 180
      },
      scale: { start: 0.6, end: 0 },
      blendMode: 'ADD'
    });
    thrustEmitter.startFollow(this.ship);
  }

  registerCollisions() {
    this.physics.add.overlap(
      this.bullets,
      this.enemies,
      this.hitEnemy,
      this.canBulletHitEnemy,
      this
    );
    this.physics.add.overlap(
      this.ship,
      this.enemies,
      this.hitShip,
      this.canShipHitEnemy,
      this
    );
    this.physics.add.overlap(
      this.specialParticles,
      this.enemies,
      this.hitSpecialParticleEnemy,
      this.canSpecialParticleHitEnemy,
      this
    );
  }

  spawnInitialEnemies() {
    for (let index = 0; index < ENEMIES.initialCount; index += 1) {
      this.spawnEnemy();
    }
  }

  spawnEnemy() {
    const enemy = new Enemy(this);
    this.enemies.add(enemy);
    enemy.launch({ innerBounds: this.innerBounds, outerBounds: this.outerBounds });
  }

  canBulletHitEnemy(bullet, enemy) {
    return bullet.active && enemy.active;
  }

  hitEnemy(bullet, enemy) {
    bullet.destroy();

    if (enemy.takeDamage(BULLETS.damage)) {
      this.destroyEnemy(enemy);
    }
  }

  canShipHitEnemy(_, enemy) {
    return enemy.active && this.playerRespawn.canBeHit();
  }

  canSpecialParticleHitEnemy(particle, enemy) {
    return particle.active && enemy.active;
  }

  hitSpecialParticleEnemy(_particle, enemy) {
    this.destroyEnemy(enemy);
  }

  hitShip(_, enemy) {
    const damage = calculateCollisionDamage(this.ship.body.velocity, enemy.body.velocity);
    const unblockedDamage = this.energyShield.absorb(damage);

    this.emitExplosion(enemy.x, enemy.y);
    this.gameStatsHud.addCollision();
    enemy.destroy();
    this.spawnEnemy();

    if (unblockedDamage === 0) {
      return;
    }

    const collision = this.playerRespawn.takeDamage(unblockedDamage);

    if (collision?.wasDestroyed) {
      this.cameras.main.shake(500, 0.02);
    } else {
      this.cameras.main.shake(120, unblockedDamage / 2000);
    }
  }

  update(time, delta) {
    const startedAt = performance.now();

    if (this.controls.consumePress('pause')) {
      this.togglePause();
    }

    if (this.controls.consumePress('toggleDebug')) {
      this.profilingHud.toggleObjectCount();
    }

    if (this.isPaused) {
      this.profilingHud.recordFrame(time, delta, performance.now() - startedAt);
      this.controls.endFrame();
      return;
    }

    if (this.controls.consumePress('recharge')) {
      this.energyShield.restoreFully();
      this.capacitor.restoreFully();
    }

    this.energyShield.update(delta);
    this.capacitor.update(delta);
    this.transferCapacitorToShield();
    this.updateShipControls();
    this.physics.world.wrap(this.ship, PLAYER.wrapPadding);

    if (this.controls.isDown('fire') && time > this.lastFiredAt) {
      this.fireBullet(time);
    }

    if (this.controls.consumePress('special')) {
      this.fireSpecialAttack();
    }

    this.capacitorIndicator.update(time);
    this.lifeIndicator.update(time);

    this.profilingHud.recordFrame(time, delta, performance.now() - startedAt);
    this.controls.endFrame();
  }

  updateShipControls() {
    const turnDirection = Number(this.controls.isDown('rotateRight'))
      - Number(this.controls.isDown('rotateLeft'));
    const thrustDirection = Number(this.controls.isDown('forward'))
      - Number(this.controls.isDown('backward'));

    const rotationMultiplier = this.controls.isDown('fastRotate')
      ? PLAYER.fastRotationMultiplier
      : 1;

    this.ship.setAngularVelocity(PLAYER.angularVelocity * rotationMultiplier * turnDirection);

    if (thrustDirection === 0) {
      this.ship.setAcceleration(0);
      return;
    }

    this.physics.velocityFromRotation(
      this.ship.rotation,
      PLAYER.acceleration * thrustDirection,
      this.ship.body.acceleration
    );
  }

  fireBullet(time) {
    if (this.capacitor.spend(BULLETS.capacitorCost)) {
      const bullet = new Bullet(this);
      this.bullets.add(bullet);
      bullet.fire(this.ship);
      this.lastFiredAt = time + BULLETS.cooldown;
    }
  }

  fireSpecialAttack() {
    if (this.capacitor.spend(CAPACITOR.specialAttackCost)) {
      this.specialAttack.fire();
    }
  }

  transferCapacitorToShield() {
    const isTransferRequested = this.controls.consumePress('transferToShield');

    if (
      isTransferRequested
      && !this.energyShield.isFullyCharged()
      && this.capacitor.spend(CAPACITOR.shieldTransferCost)
    ) {
      this.energyShield.receiveCapacitorCharge(SHIELD.capacitorTransferHitPoints);
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.pauseOverlay.setPaused(this.isPaused);

    if (this.isPaused) {
      this.physics.pause();
    } else {
      this.physics.resume();
    }
  }

  destroyEnemy(enemy) {
    this.emitExplosion(enemy.x, enemy.y);
    this.cameras.main.shake(500, 0.01);
    enemy.destroy();
    this.spawnEnemy();
    this.gameStatsHud.addKill();
  }

  emitExplosion(x, y) {
    this.explosionFlash.emitParticleAt(x, y);
    const particleCount = EXPLOSIONS.particlesPerMine * 100;

    for (let index = 0; index < particleCount; index += 1) {
      const particle = new ExplosionParticle(this);

      this.explosionDebris.add(particle);
      particle.explode(x, y);
    }
  }

  shutdown() {
    this.playerRespawn?.destroy();
    this.energyShield?.destroy();
    this.capacitor?.destroy();
    this.specialAttack?.destroy();
    this.capacitorIndicator?.destroy();
    this.lifeIndicator?.destroy();
    this.pauseOverlay?.destroy();
    this.controls?.destroy();
  }
}
