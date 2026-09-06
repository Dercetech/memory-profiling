const MOVEMENT_CODES = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD'
]);

export function createPhysicalControls(keyboard) {
  const heldCodes = new Set();

  const handleKeyDown = (event) => {
    if (MOVEMENT_CODES.has(event.code)) {
      event.preventDefault();
      heldCodes.add(event.code);
    }
  };

  const handleKeyUp = (event) => {
    if (MOVEMENT_CODES.has(event.code)) {
      event.preventDefault();
      heldCodes.delete(event.code);
    }
  };

  keyboard.on('keydown', handleKeyDown);
  keyboard.on('keyup', handleKeyUp);

  return {
    get horizontal() {
      const left = heldCodes.has('ArrowLeft') || heldCodes.has('KeyA');
      const right = heldCodes.has('ArrowRight') || heldCodes.has('KeyD');
      return Number(right) - Number(left);
    },

    get vertical() {
      const up = heldCodes.has('ArrowUp') || heldCodes.has('KeyW');
      const down = heldCodes.has('ArrowDown') || heldCodes.has('KeyS');
      return Number(down) - Number(up);
    },

    destroy() {
      keyboard.off('keydown', handleKeyDown);
      keyboard.off('keyup', handleKeyUp);
      heldCodes.clear();
    }
  };
}
