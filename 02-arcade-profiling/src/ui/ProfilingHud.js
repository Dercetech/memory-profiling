/*
 * Formation Dercetech — JavaScript profiling et mémoire
 * Dercetech Training — JavaScript profiling and memory
 * Référence / Reference: https://training.dercetech.com/trainings/memory-profiling/
 */
import Phaser from 'phaser';

import { FrameMetrics } from '../monitoring/FrameMetrics.js';
import { MemoryMonitor } from '../monitoring/MemoryMonitor.js';

export class ProfilingHud {
  constructor(scene) {
    this.scene = scene;
    this.frameMetrics = new FrameMetrics();
    this.memoryMonitor = new MemoryMonitor();
    this.isObjectCountVisible = false;
    this.text = scene.add.text(10, 10, '', {
      font: '16px Courier',
      fill: '#00ff00',
      lineSpacing: 5
    }).setDepth(10);

    this.render();
  }

  recordFrame(time, delta, sceneWorkTime) {
    this.memoryMonitor.update(time);

    if (this.frameMetrics.recordFrame(delta, sceneWorkTime)) {
      this.render();
    }
  }

  toggleObjectCount() {
    this.isObjectCountVisible = !this.isObjectCountVisible;
    this.render();
  }

  render() {
    const {
      framesPerSecond,
      averageFrameTime,
      averageSceneWorkTime,
      sceneBudgetUsed
    } = this.frameMetrics.snapshot;
    const bulletCount = this.scene.bullets?.getLength() ?? 0;
    const specialParticleCount = this.scene.specialParticles?.getLength() ?? 0;
    const explosionParticleCount = this.scene.explosionDebris?.getLength() ?? 0;

    const lines = [
      this.memoryMonitor.label,
      `CPU JS (scène) : ${averageSceneWorkTime.toFixed(3)} ms/image (${sceneBudgetUsed.toFixed(1)} % du budget 60 Hz)`,
      `Cadence : ${framesPerSecond.toFixed(1)} FPS — ${averageFrameTime.toFixed(2)} ms/image`
    ];

    if (this.isObjectCountVisible) {
      lines.push(`Objets retenus : tirs ${bulletCount} · attaque X ${specialParticleCount} · explosions ${explosionParticleCount}`);
    }

    this.text.setText(lines);
  }
}
