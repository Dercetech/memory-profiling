/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
export const FRAME_BUDGET_MS = 1000 / 60;

export class FrameMetrics {
  constructor(reportingInterval = 500) {
    this.reportingInterval = reportingInterval;
    this.reset();
    this.snapshot = {
      workTime: null,
      budget: FRAME_BUDGET_MS,
      budgetUsed: null
    };
  }

  record(frameTime, workTime) {
    this.elapsed += frameTime;
    this.frameCount += 1;
    this.totalWorkTime += workTime;

    if (this.elapsed < this.reportingInterval) return null;

    const averageWorkTime = this.totalWorkTime / this.frameCount;
    this.snapshot = {
      workTime: averageWorkTime,
      budget: FRAME_BUDGET_MS,
      budgetUsed: (averageWorkTime / FRAME_BUDGET_MS) * 100
    };
    this.reset();

    return this.snapshot;
  }

  reset() {
    this.elapsed = 0;
    this.frameCount = 0;
    this.totalWorkTime = 0;
  }
}
