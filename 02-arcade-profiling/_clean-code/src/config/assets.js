/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
export const ASSET_KEYS = Object.freeze({
  background: 'background',
  explosion: 'explosion',
  space: 'space',
  mineSheet: 'mine-sheet',
  mineAnimation: 'mine-anim'
});

export function loadGameAssets(scene) {
  scene.load.image(ASSET_KEYS.background, '/assets/tests/space/nebula.jpg');
  scene.load.atlas(
    ASSET_KEYS.space,
    '/assets/tests/space/space.png',
    '/assets/tests/space/space.json'
  );
  scene.load.atlas(
    ASSET_KEYS.explosion,
    '/assets/particles/explosion.png',
    '/assets/particles/explosion.json'
  );
}
