/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import { PLAYER } from '../config/game.js';

export class PlayerRespawnController {
  constructor(scene, ship, onHealthChanged) {
    this.scene = scene;
    this.ship = ship;
    this.onHealthChanged = onHealthChanged;
    this.health = PLAYER.maximumHealth;
    this.isRespawning = false;
    this.isInvincible = false;
    this.respawnEvent = undefined;
    this.blinkEvent = undefined;
    this.invincibilityEvent = undefined;
    this.notifyHealthChanged();
  }

  canBeHit() {
    return this.ship.active && !this.isRespawning && !this.isInvincible;
  }

  takeDamage(damage) {
    if (!this.canBeHit()) {
      return undefined;
    }

    this.health = Math.max(0, this.health - damage);
    this.notifyHealthChanged();

    const wasDestroyed = this.health === 0;

    if (wasDestroyed) {
      this.beginRespawn();
    }

    return { damage, wasDestroyed };
  }

  beginRespawn() {
    if (!this.canBeHit()) {
      return false;
    }

    this.isRespawning = true;
    this.ship.disableBody(true, true);
    this.respawnEvent = this.scene.time.delayedCall(PLAYER.respawnDelay, this.respawn, [], this);

    return true;
  }

  respawn() {
    this.ship.enableBody(true, PLAYER.startX, PLAYER.startY, true, true);
    this.ship.setVelocity(0);
    this.ship.setAcceleration(0);
    this.ship.setAngularVelocity(0);
    this.ship.setRotation(0);
    this.health = PLAYER.maximumHealth;
    this.notifyHealthChanged();
    this.isRespawning = false;
    this.isInvincible = true;

    const blinkCount = Math.floor(PLAYER.invincibilityDuration / PLAYER.blinkInterval);

    this.blinkEvent = this.scene.time.addEvent({
      delay: PLAYER.blinkInterval,
      repeat: blinkCount - 1,
      callback: this.toggleVisibility,
      callbackScope: this
    });
    this.invincibilityEvent = this.scene.time.delayedCall(
      PLAYER.invincibilityDuration,
      this.endInvincibility,
      [],
      this
    );
  }

  toggleVisibility() {
    this.ship.setVisible(!this.ship.visible);
  }

  endInvincibility() {
    this.isInvincible = false;
    this.ship.setVisible(true);
    this.blinkEvent = undefined;
    this.invincibilityEvent = undefined;
  }

  notifyHealthChanged() {
    this.onHealthChanged?.(this.health, PLAYER.maximumHealth);
  }

  destroy() {
    this.respawnEvent?.remove(false);
    this.blinkEvent?.remove(false);
    this.invincibilityEvent?.remove(false);
    this.onHealthChanged = undefined;
  }
}
