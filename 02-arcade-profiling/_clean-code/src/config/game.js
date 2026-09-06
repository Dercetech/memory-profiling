/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
export const GAME_DIMENSIONS = Object.freeze({
  width: 800,
  height: 600
});

export const WORLD_BOUNDS = Object.freeze({
  inner: Object.freeze({ x: 0, y: 0, width: GAME_DIMENSIONS.width, height: GAME_DIMENSIONS.height }),
  outer: Object.freeze({ x: -200, y: -200, width: 1200, height: 1000 })
});

export const PLAYER = Object.freeze({
  startX: GAME_DIMENSIONS.width / 2,
  startY: GAME_DIMENSIONS.height / 2,
  maximumVelocity: 400,
  angularVelocity: 300,
  fastRotationMultiplier: 2,
  acceleration: 800,
  wrapPadding: 32,
  maximumHealth: 100,
  minimumCollisionDamage: 1,
  maximumCollisionDamage: 40,
  respawnDelay: 1000,
  invincibilityDuration: 3000,
  blinkInterval: 120
});

export const BULLETS = Object.freeze({
  speed: 800,
  lifespan: 1000,
  poolSize: 32,
  cooldown: 100,
  damage: 100,
  capacitorCost: 1
});

export const SHIELD = Object.freeze({
  maximumHitPoints: 40,
  recoveryPerSecond: 1,
  capacitorTransferHitPoints: 10,
  minimumRadius: 30,
  maximumRadius: 40,
  minimumThickness: 2,
  maximumThickness: 7,
  maximumOpacity: 0.7,
  rimSegments: 24,
  minimumRimParticlesPerSecond: 8,
  maximumRimParticlesPerSecond: 44
});

export const CAPACITOR = Object.freeze({
  maximumPoints: 100,
  rechargePerSecond: 5,
  specialAttackCost: 30,
  blastIndicatorThreshold: 20,
  shieldTransferCost: 10
});

export const SPECIAL_ATTACK = Object.freeze({
  particlesPerRing: 30,
  particleSpeed: 850,
  particleLifespan: 1300,
  poolSize: 180
});

export const EXPLOSIONS = Object.freeze({
  particlesPerMine: 32,
  minimumSpeed: 120,
  maximumSpeed: 480,
  particleFadeDuration: 1000,
  poolSize: 128
});

export const ENEMIES = Object.freeze({
  initialCount: 6,
  minimumSpeed: 100,
  maximumSpeed: 400,
  maximumHitPoints: 100
});
