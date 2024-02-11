import Phaser from "../lib/phaser.js";

export class ScoreField extends Phaser.Scene {
  stars;

  distance = 300;
  speed = 250;

  max = 500;
  xx = [];
  yy = [];
  zz = [];

  constructor() {
    super({
      key: "ScoreField",
    });
  }

  create() {
    this.input.keyboard.enabled = false;

    this.width = this.scale.width;
    this.height = this.scale.height;

    this.stars = this.add.blitter(0, 0, "star", 4).setAlpha(0.5);

    for (let i = 0; i < this.max; i++) {
      this.xx[i] = Math.floor(Math.random() * this.width) - this.width / 2;
      this.yy[i] = Math.floor(Math.random() * this.height) - this.height / 2;
      this.zz[i] = Math.floor(Math.random() * 1700) - 100;

      let perspective = this.distance / (this.distance - this.zz[i]);
      let x = this.width / 2 + this.xx[i] * perspective;
      let y = this.height / 2 + this.yy[i] * perspective;

      this.stars.create(x, y);
    }
  }

  update(time, delta) {
    for (let i = 0; i < this.max; i++) {
      let perspective = this.distance / (this.distance - this.zz[i]);
      let x = this.width / 2 + this.xx[i] * perspective;
      let y = this.height / 2 + this.yy[i] * perspective;

      this.zz[i] += this.speed * (delta / 1000);

      if (this.zz[i] > 300) {
        this.zz[i] -= 600;
      }

      let bob = this.stars.children.list[i];

      bob.x = x;
      bob.y = y;
    }
  }
}
