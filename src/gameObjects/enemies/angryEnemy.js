import eventsCenter from "../../EventsCenter.js";
import { BasicEnemy } from "./basicEnemy.js";

export class AngryEnemy extends BasicEnemy {
  constructor(scene) {
    super(scene, 0, 0, "enemy", 0);
    this.particles.setParticleTint(0xff3131);
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
    if (this.died) {
      return;
    }
    super.die();

    this.shootEvent.remove(false);
  }

  shootBullet() {
    const x = this.x;
    const y = this.y;

    eventsCenter.emit("enemy-shoot", { x, y, color: 0xdb74ff });
  }
}
