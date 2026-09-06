/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import { ASSET_KEYS } from '../config/assets.js';
import { SHIELD } from '../config/game.js';

export class EnergyShield {
  constructor(scene, ship, onStateChanged) {
    this.ship = ship;
    this.onStateChanged = onStateChanged;
    this.hitPoints = SHIELD.maximumHitPoints;
    this.regenerationProgress = 0;
    this.rimEmissionProgress = 0;
    this.graphics = scene.add.graphics().setDepth(3);
    this.rimParticles = scene.add.particles(ASSET_KEYS.space).setDepth(3);
    this.rimEmitters = this.createRimEmitters();

    this.notifyStateChanged();
    this.render();
  }

  absorb(damage) {
    const absorbedDamage = Math.min(damage, this.hitPoints);

    this.hitPoints -= absorbedDamage;
    this.notifyStateChanged();
    this.render();

    return damage - absorbedDamage;
  }

  update(delta) {
    this.regenerationProgress += (delta / 1000) * SHIELD.recoveryPerSecond;

    const recoveredHitPoints = Math.floor(this.regenerationProgress);

    if (recoveredHitPoints > 0) {
      this.regenerationProgress -= recoveredHitPoints;
      const previousHitPoints = this.hitPoints;

      this.hitPoints = Math.min(SHIELD.maximumHitPoints, this.hitPoints + recoveredHitPoints);

      if (this.hitPoints !== previousHitPoints) {
        this.notifyStateChanged();
      }
    }

    this.render(delta);
  }

  restoreFully() {
    if (this.hitPoints === SHIELD.maximumHitPoints) {
      return;
    }

    this.hitPoints = SHIELD.maximumHitPoints;
    this.regenerationProgress = 0;
    this.notifyStateChanged();
    this.render();
  }

  receiveCapacitorCharge(hitPoints) {
    const previousHitPoints = this.hitPoints;

    this.hitPoints = Math.min(SHIELD.maximumHitPoints, this.hitPoints + hitPoints);

    if (this.hitPoints !== previousHitPoints) {
      this.regenerationProgress = 0;
      this.notifyStateChanged();
      this.render();
    }
  }

  isFullyCharged() {
    return this.hitPoints === SHIELD.maximumHitPoints;
  }

  createRimEmitters() {
    return Array.from({ length: SHIELD.rimSegments }, (_, index) => {
      const angle = (index / SHIELD.rimSegments) * 360;

      return this.rimParticles.createEmitter({
        frame: 'blue',
        angle: { min: angle - 9, max: angle + 9 },
        speed: { min: 35, max: 115 },
        lifespan: { min: 260, max: 720 },
        alpha: { start: 0.8, end: 0 },
        scale: { start: 0.7, end: 0 },
        blendMode: 'ADD',
        on: false
      });
    });
  }

  render(delta = 0) {
    this.graphics.clear();

    if (!this.ship.active || !this.ship.visible || this.hitPoints === 0) {
      this.rimEmissionProgress = 0;
      return;
    }

    const state = this.hitPoints / SHIELD.maximumHitPoints;
    const radius = SHIELD.minimumRadius + (SHIELD.maximumRadius - SHIELD.minimumRadius) * state;
    const thickness = SHIELD.minimumThickness
      + (SHIELD.maximumThickness - SHIELD.minimumThickness) * state;
    const opacity = SHIELD.maximumOpacity * state;

    this.graphics.lineStyle(thickness, 0x48d9ff, opacity);
    this.graphics.strokeCircle(this.ship.x, this.ship.y, radius);
    this.emitRimParticles(delta, radius, state);
  }

  emitRimParticles(delta, radius, state) {
    const particlesPerSecond = SHIELD.minimumRimParticlesPerSecond
      + (SHIELD.maximumRimParticlesPerSecond - SHIELD.minimumRimParticlesPerSecond) * state;

    this.rimEmissionProgress += (delta / 1000) * particlesPerSecond;

    const particleCount = Math.floor(this.rimEmissionProgress);

    if (particleCount === 0) {
      return;
    }

    this.rimEmissionProgress -= particleCount;

    for (let index = 0; index < particleCount; index += 1) {
      const segment = Math.floor(Math.random() * SHIELD.rimSegments);
      const angle = (segment / SHIELD.rimSegments) * Math.PI * 2;
      const x = this.ship.x + Math.cos(angle) * radius;
      const y = this.ship.y + Math.sin(angle) * radius;

      this.rimEmitters[segment].emitParticleAt(x, y);
    }
  }

  notifyStateChanged() {
    this.onStateChanged?.(this.hitPoints, SHIELD.maximumHitPoints);
  }

  destroy() {
    this.graphics.destroy();
    this.rimParticles.destroy();
    this.onStateChanged = undefined;
  }
}
