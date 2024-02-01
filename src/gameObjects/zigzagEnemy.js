import Phaser from "../lib/phaser.js";
// import { EnemyBullet } from "./enemyBullet.js";
import eventsCenter from "../EventsCenter.js";

export class ZigzagEnemy extends Phaser.Physics.Arcade.Sprite {
  died = false;

  constructor(scene) {
    super(scene, 0, 0, "zigzagEnemy");
    this.setFlipX(true);
    this.speed = 300;

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
    this.shootEvent.remove(false);
    this.died = true;
    this.play("explosionAnim");
    this.dieSound.play();
    this.setVelocity(0);
    this.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      function () {
        this.setTexture("zigzagEnemy");
        this.setFrame(0);
        this.disableBody(true, true);
      },
      this
    );
  }

  update(time, delta) {
    if (this.died) {
      return;
    }

    const sinTime = Math.sin(time / 100);
    this.setVelocityY(200 * sinTime);
    if (this.x < -16) {
      this.disableBody(true, true);
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
