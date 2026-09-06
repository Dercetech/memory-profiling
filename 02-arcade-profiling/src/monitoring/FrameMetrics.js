/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
const FRAME_BUDGET_MS = 1000 / 60;

export class FrameMetrics {
  constructor({ reportingInterval = 500 } = {}) {
    this.reportingInterval = reportingInterval;
    this.elapsed = 0;
    this.frameCount = 0;
    this.totalFrameTime = 0;
    this.totalSceneWorkTime = 0;
    this.snapshot = {
      framesPerSecond: 0,
      averageFrameTime: 0,
      averageSceneWorkTime: 0,
      sceneBudgetUsed: 0
    };
  }

  recordFrame(frameTime, sceneWorkTime) {
    this.elapsed += frameTime;
    this.frameCount += 1;
    this.totalFrameTime += frameTime;
    this.totalSceneWorkTime += sceneWorkTime;

    if (this.elapsed < this.reportingInterval) {
      return false;
    }

    const averageFrameTime = this.totalFrameTime / this.frameCount;
    const averageSceneWorkTime = this.totalSceneWorkTime / this.frameCount;

    this.snapshot = {
      framesPerSecond: 1000 / averageFrameTime,
      averageFrameTime,
      averageSceneWorkTime,
      sceneBudgetUsed: (averageSceneWorkTime / FRAME_BUDGET_MS) * 100
    };
    this.elapsed = 0;
    this.frameCount = 0;
    this.totalFrameTime = 0;
    this.totalSceneWorkTime = 0;

    return true;
  }
}
