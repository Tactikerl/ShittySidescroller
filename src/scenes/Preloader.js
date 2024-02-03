import Phaser from "../lib/phaser.js";

export class Preloader extends Phaser.Scene {
  constructor() {
    super({
      key: "Preloader",
    });
  }

  preload() {
    this.createProgressBar();

    this.load.image("retroFont", "assets/alphanumerical.png");
    this.load.spritesheet("button", "assets/button.png", {
      frameWidth: 48,
      frameHeight: 16,
    });
    this.load.spritesheet("bolt", " assets/bolt.png", {
      frameHeight: 32,
      frameWidth: 48,
    });
    this.load.spritesheet("enemy", "assets/enemy.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("zigzagEnemy", "assets/zigzagEnemy.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("lustyEnemy", "assets/lustyEnemy.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image("collectible", "assets/collectible.png");
    this.load.spritesheet("background", "assets/background.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("player", "assets/PlayerPlaceholder2.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("explosion", "assets/explosion.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("star", "assets/star.png", {
      frameWidth: 9,
      frameHeight: 9,
    });
    this.load.spritesheet("bigStar", "assets/bigStar.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("heart", "assets/HP.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.image("logo", " assets/Logo.png");
    this.load.image("dButton", " assets/dButton.png");
    this.load.image("sButton", " assets/sButton.png");
    this.load.image("controlBase", "assets/controlBase.png");
    this.load.image("controlThumb", "assets/controlThumb.png");

    const url =
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js";
    this.load.plugin("rexvirtualjoystickplugin", url, true);

    this.load.audio("laser", "assets/laserLarge_003.mp3");
    this.load.audio("dash", "assets/upgrade4.mp3");
    this.load.audio("gameTheme", "assets/8_bit_retro_funk.mp3");
    this.load.audio("enemyShoot", "assets/error3.mp3");
    this.load.audio("pickup", "assets/pickup4.mp3");
    this.load.audio("explosionSfx", "assets/explosion2.mp3");
  }

  create() {
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        this.scene.start("Title");
      }
    );
    this.cameras.main.setBackgroundColor("#000010");

    this.cameras.main.fadeOut(250, 0, 0, 16);
  }

  createProgressBar() {
    const barContainer = 260;
    this.add
      .nineslice(
        this.scale.width / 2 - barContainer / 2,
        this.scale.height / 2,
        "loadingBar",
        0,
        barContainer,
        24,
        3,
        3,
        3,
        3
      )
      .setOrigin(0, 0.5);

    let fill = this.add
      .nineslice(
        this.scale.width / 2 - barContainer / 2,
        this.scale.height / 2,
        "loadingBar",
        1,
        0,
        24,
        3,
        3,
        3,
        3
      )
      .setOrigin(0, 0.5);

    this.load.on("progress", (value) => {
      fill.width = barContainer * value;
    });
  }
}
