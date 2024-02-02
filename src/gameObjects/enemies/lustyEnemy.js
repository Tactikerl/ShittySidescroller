import Phaser from "../../lib/phaser.js";
import eventsCenter from "../../EventsCenter.js";

export class LustyEnemy extends Phaser.Physics.Arcade.Sprite {
  died = false;

  constructor(scene) {
    super(scene, 0, 0, "lustyEnemy", 0);
    this.setFlipX(true);
    this.speed = 210;

    this.dieSound = scene.sound.get("explosionSfx");
  }

  spawn(x, y, target) {
    this.died = false;
    this.setPosition(x, y);

    this.enableBody(true, x, y, true, true);
    this.setCircle(16);
    this.setVelocityX(-this.speed);

    this.myBeloved = target;
  }

  die() {
    if (this.died) {
      return;
    }

    this.shootEvent && this.shootEvent.remove(false);
    this.died = true;
    this.play("explosionAnim");
    this.dieSound.play();
    this.setVelocity(0);
    this.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      function () {
        this.setTexture("lustyEnemy");
        this.setFrame(0);
        this.disableBody(true, true);
      },
      this
    );
  }

  onImpact() {
    this.die();
  }

  update(time, delta) {
    if (this.died) {
      return;
    }

    const myBelovedAngle = Phaser.Math.Angle.BetweenPoints(
      this,
      this.myBeloved
    );
    this.body.velocity.setAngle(myBelovedAngle);

    var deg = Phaser.Math.RadToDeg(myBelovedAngle);

    this.setFrame(0);
    if (this.body.velocity.y < -50) {
      this.setFrame(5);
    }
    if (this.body.velocity.y > 50) {
      this.setFrame(3);
    }

    if ((deg > 0 && deg < 90) || (deg < 0 && deg > -90)) {
      this.setFlipX(false);
    } else {
      this.setFlipX(true);
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
