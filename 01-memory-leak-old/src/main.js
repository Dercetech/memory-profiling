/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import Phaser from 'phaser';
import './style.css';
import { GAME_HEIGHT, GAME_WIDTH } from './config.js';
import { OrbCollectorScene } from './scenes/orb-collector-scene.js';

const currentYear = document.querySelector('[data-current-year]');
if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#111827',
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: OrbCollectorScene
});
