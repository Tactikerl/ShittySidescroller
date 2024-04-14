import eventsCenter, { events } from "../../EventsCenter.js";
import { BasicEnemy } from "./basicEnemy.js";

export class AngryEnemy extends BasicEnemy {
  health = 2;
  constructor(scene) {
    super(scene, 0, 0, "enemy", 0);
    this.particles.setParticleTint(0xff3131);
  }

  spawn(x, y) {
    super.spawn(x, y);

    this.health = 2;
    this.shootEvent = this.scene.time.addEvent({
      delay: 250,
      callback: this.shootBullet,
      callbackScope: this,
      repeat: 2,
    });
  }

  hurt() {
    const isDead = super.hurt();

    if (isDead) {
      this.shootEvent.remove(false);
    }

    return isDead;
  }

  shootBullet() {
    const x = this.x;
    const y = this.y;

    eventsCenter.emit(events.enemyShoot, { x, y, color: 0xdb74ff });
  }
}
