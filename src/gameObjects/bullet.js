import Phaser from "../lib/phaser.js";

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 0, 0, "bigStar", 0);

    this.speed = 400;

    this.laserSound = scene.sound.get("laser");
  }

  fire(x, y) {
    this.laserSound.play();
    this.play("rollingBigStar");

    this.enableBody(true, x, y, true, true);

    this.setPosition(x + 16, y);
    this.setVelocityX(this.speed);
  }

  hit() {
    this.disableBody(true, true);
  }

  update(time, delta) {
    if (this.x > 720) {
      this.disableBody(true, true);
    }
  }
}
