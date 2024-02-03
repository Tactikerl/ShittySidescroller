import Phaser from "../lib/phaser.js";

export class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 0, 0, "bolt");

    this.speed = -500;
    // this.setTint(0xfc7703);
    this.enemyShoot = scene.sound.get("enemyShoot");
  }

  fire(x, y, color) {
    this.enemyShoot.play();
    this.play("enemyBolt");
    this.setTint(color);
    this.enableBody(true, x - 16, y, true, true);
    this.setBodySize(16, 16).setOffset(3, 8);
    this.setVelocityX(this.speed);
  }

  hit() {
    this.disableBody(true, true);
  }

  update(time, delta) {
    if (this.x < -16) {
      this.disableBody(true, true);
    }
  }
}
