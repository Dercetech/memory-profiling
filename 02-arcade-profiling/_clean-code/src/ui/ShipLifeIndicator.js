/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
const LIFE_COLORS = Object.freeze({
  background: 0x001600,
  bar: 0x49e868,
  border: 0x9cff9c,
  label: '#9cff9c'
});

const SHIELD_COLORS = Object.freeze({
  background: 0x001116,
  bar: 0x48d9ff,
  border: 0x9cf7ff,
  label: '#9cf7ff'
});

export class ShipLifeIndicator {
  constructor(scene, ship) {
    this.ship = ship;
    this.lifePercentage = 100;
    this.shieldPercentage = 100;
    this.graphics = scene.add.graphics().setDepth(4);
    this.label = scene.add
      .text(0, 0, '', {
        font: '14px Courier',
        fill: '#9cff9c',
        stroke: '#001600',
        strokeThickness: 3
      })
      .setOrigin(0.5, 1)
      .setDepth(4);
  }

  setLife(currentHealth, maximumHealth) {
    this.lifePercentage = currentHealth / maximumHealth;
  }

  setShield(currentHitPoints, maximumHitPoints) {
    this.shieldPercentage = currentHitPoints / maximumHitPoints;
  }

  update(time) {
    this.graphics.clear();

    if (!this.ship.active || !this.ship.visible) {
      this.label.setVisible(false);
      return;
    }

    const x = this.ship.x;
    const y = Math.max(this.ship.y - 54, 22);
    const width = 76;
    const height = 7;
    const showingShield = Math.floor(time / 1000) % 2 === 1;
    const percentage = showingShield ? this.shieldPercentage : this.lifePercentage;
    const colors = showingShield ? SHIELD_COLORS : LIFE_COLORS;

    this.graphics.fillStyle(colors.background, 0.8);
    this.graphics.fillRect(x - width / 2, y, width, height);
    this.graphics.fillStyle(colors.bar, 0.9);
    this.graphics.fillRect(x - width / 2, y, width * percentage, height);
    this.graphics.lineStyle(1, colors.border, 0.9);
    this.graphics.strokeRect(x - width / 2, y, width, height);

    this.label.setVisible(true);
    this.label.setPosition(x, Math.max(y - 2, 18));
    this.label.setColor(colors.label);
    this.label.setText(`${showingShield ? 'SHIELD' : 'LIFE'} ${Math.round(percentage * 100)}%`);
  }

  destroy() {
    this.graphics.destroy();
    this.label.destroy();
  }
}
