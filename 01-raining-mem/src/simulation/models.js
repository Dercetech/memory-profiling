/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
export class PhysicalPixel {
  constructor(x, y, color, solid = false) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.solid = solid;
  }
}

export class Raindrop {
  constructor(x, y, now) {
    this.x = x;
    this.y = y;
    this.velocity = 12 + Math.random() * 10;
    this.state = 'falling';
    this.settledAt = null;
    this.nextFlowAt = 0;
    this.bornAt = now;
    this.positions = [];
  }
}
