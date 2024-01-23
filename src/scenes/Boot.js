import Phaser from "../lib/phaser.js";

export class Boot extends Phaser.Scene {
  constructor() {
    super({
      key: "Boot",
    });
  }

  preload() {
    this.load.image("retroFont", "assets/alphanumerical.png");
    this.load.image("bullet", " assets/bullet.png");
    this.load.spritesheet("enemy", "assets/enemy.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("zigzagEnemy", "assets/zigzagEnemy.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image("collectible", "assets/collectible.png");
    this.load.spritesheet("background", "assets/background.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("player", "assets/PlayerPlaceholderSpritesheet.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.audio("laser", "assets/laserLarge_003.ogg");
    this.load.audio("dash", "assets/upgrade4.ogg");
    this.load.audio("gameTheme", "assets/8_bit_retro_funk.mp3");
  }

  create() {
    this.music = this.sound.add("gameTheme", { loop: true });
    this.music.play();

    this.scene.start("Play");
  }
}
