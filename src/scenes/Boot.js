import Phaser from "../lib/phaser.js";

export class Boot extends Phaser.Scene {
  constructor() {
    super({
      key: "Boot",
    });
  }

  preload() {
    this.load.image("retroFont", "assets/numbers.png");
    this.load.image("bullet", " assets/bullet.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("collectible", "assets/collectible.png");
    this.load.spritesheet("background", "assets/background.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("player", "assets/PlayerPlaceholderSpritesheet.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    this.scene.start("Play");
  }
}
