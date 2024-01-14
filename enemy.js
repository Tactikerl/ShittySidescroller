import Phaser from "./lib/phaser.js";
export class Enemy extends Phaser.Physics.Arcade.Image {
  constructor(scene) {
    super(scene, 0, 0, "enemy");

    this.speed = 100;
  }

  fire(x, y) {
    this.setPosition(x + 32, y);

    this.setActive(true);
    this.setVisible(true);
  }

  hit() {
    this.setActive(false);
    this.setVisible(false);
  }

  update(time, delta) {
    this.x += this.speed * delta;
    console.log(this.x);

    if (this.x > 720) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
