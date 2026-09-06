/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
const ACTION_CODES = Object.freeze({
  forward: ['KeyW', 'KeyZ', 'ArrowUp'],
  backward: ['KeyS', 'ArrowDown'],
  rotateLeft: ['KeyA', 'KeyQ', 'ArrowLeft'],
  rotateRight: ['KeyD', 'ArrowRight'],
  fire: ['Space'],
  special: ['KeyX'],
  recharge: ['KeyO'],
  toggleDebug: ['KeyD'],
  transferToShield: ['KeyC'],
  fastRotate: ['ShiftLeft', 'ShiftRight'],
  pause: ['Escape']
});

const GAMEPLAY_CODES = new Set(Object.values(ACTION_CODES).flat());

export class KeyboardControls {
  constructor() {
    this.pressedCodes = new Set();
    this.justPressedCodes = new Set();
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  isDown(action) {
    return ACTION_CODES[action].some((code) => this.pressedCodes.has(code));
  }

  consumePress(action) {
    return ACTION_CODES[action].some((code) => this.justPressedCodes.has(code));
  }

  endFrame() {
    this.justPressedCodes.clear();
  }

  handleKeyDown(event) {
    if (!GAMEPLAY_CODES.has(event.code)) {
      return;
    }

    event.preventDefault();

    if (!this.pressedCodes.has(event.code)) {
      this.justPressedCodes.add(event.code);
    }

    this.pressedCodes.add(event.code);
  }

  handleKeyUp(event) {
    if (!GAMEPLAY_CODES.has(event.code)) {
      return;
    }

    event.preventDefault();
    this.pressedCodes.delete(event.code);
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.pressedCodes.clear();
    this.justPressedCodes.clear();
  }
}
