/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import { ENEMIES, PLAYER } from '../config/game.js';

export function calculateCollisionDamage(shipVelocity, mineVelocity) {
  const combinedVelocityX = shipVelocity.x + mineVelocity.x;
  const combinedVelocityY = shipVelocity.y + mineVelocity.y;
  const combinedSpeed = Math.hypot(combinedVelocityX, combinedVelocityY);
  const severity = Math.min(combinedSpeed / ENEMIES.maximumSpeed, 1);
  const damage = Math.ceil(PLAYER.maximumCollisionDamage * severity);

  return Math.max(PLAYER.minimumCollisionDamage, damage);
}
