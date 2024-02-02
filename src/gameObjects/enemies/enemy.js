import Phaser from "../../lib/phaser.js";
// import { EnemyBullet } from "./enemyBullet.js";
import eventsCenter from "../../EventsCenter.js";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  died = false;

  constructor(scene) {
    super(scene, 0, 0, "enemy", 0);
    this.setFlipX(true);
    this.speed = 200;

    this.dieSound = scene.sound.get("explosionSfx");
  }

  spawn(x, y) {
    this.died = false;
    this.setPosition(x, y);

    this.enableBody(true, x, y, true, true);
    this.setCircle(16);
    this.setVelocityX(-this.speed);

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

    this.shootEvent.remove(false);
    this.died = true;
    this.play("explosionAnim");
    this.dieSound.play();
    this.setVelocity(0);
    this.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      function () {
        this.setTexture("enemy");
        this.setFrame(0);
        this.disableBody(true, true);
      },
      this
    );
  }

  onImpact() {}

  update(time, delta) {
    if (this.died) {
      return;
    }

    if (this.x < -16) {
      this.disableBody(true, true);
    }
  }

  shootBullet() {
    const x = this.x;
    const y = this.y;

    eventsCenter.emit("enemy-shoot", { x, y });
  }
}
