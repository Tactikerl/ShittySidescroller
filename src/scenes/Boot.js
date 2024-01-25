import Phaser from "../lib/phaser.js";

export class Boot extends Phaser.Scene {
  constructor() {
    super({
      key: "Boot",
    });
  }

  preload() {
    this.load.image("retroFont", "assets/alphanumerical.png");
    this.load.spritesheet("button", "assets/button.png", {
      frameWidth: 48,
      frameHeight: 16,
    });
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
    this.load.spritesheet("explosion", "assets/explosion.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image("logo", " assets/Logo.png");

    this.load.audio("laser", "assets/laserLarge_003.ogg");
    this.load.audio("dash", "assets/upgrade4.ogg");
    this.load.audio("gameTheme", "assets/8_bit_retro_funk.mp3");
    this.load.audio("enemyShoot", "assets/error3.ogg");
    this.load.audio("pickup", "assets/pickup4.ogg");
    this.load.audio("explosionSfx", "assets/explosion2.ogg");
  }

  create() {
    this.scene.start("Title");
  }
}
