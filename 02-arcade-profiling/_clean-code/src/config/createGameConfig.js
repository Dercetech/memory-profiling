/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import Phaser from 'phaser';

import { GAME_DIMENSIONS } from './game.js';
import { JemAsteroidsScene } from '../scenes/JemAsteroidsScene.js';

export function createGameConfig() {
  return {
    type: Phaser.AUTO,
    parent: 'game',
    width: GAME_DIMENSIONS.width,
    height: GAME_DIMENSIONS.height,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_DIMENSIONS.width,
      height: GAME_DIMENSIONS.height
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        fps: 60,
        gravity: { y: 0 }
      }
    },
    scene: JemAsteroidsScene
  };
}
