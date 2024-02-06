import eventsCenter from "../../EventsCenter.js";
import { BasicEnemy } from "./basicEnemy.js";

export class ZigzagEnemy extends BasicEnemy {
  constructor(scene) {
    super(scene, 0, 0, "zigzagEnemy");
    this.particles.setParticleTint(0x1f51ff);
    this.speed = 300;
  }

  spawn(x, y) {
    super.spawn(x, y);

    this.shootEvent = this.scene.time.addEvent({
      delay: 250,
      callback: this.shootBullet,
      callbackScope: this,
      repeat: 2,
    });
  }

  die() {
    super.die();

    this.shootEvent.remove(false);
  }

  update(time, delta) {
    if (!this.body.enable) {
      return;
    }

    const sinTime = Math.sin(time / 100);
    this.setVelocityY(200 * sinTime);
    if (this.x < -16) {
      this.disableBody(true, true);
      this.particles.stop();
    }
    this.setFrame(0);
    if (this.body.velocity.y < -50) {
      this.setFrame(5);
    }

    if (this.body.velocity.y > 50) {
      this.setFrame(3);
    }
  }

  shootBullet() {
    const x = this.x;
    const y = this.y;

    eventsCenter.emit("enemy-shoot", { x, y });
  }
}
