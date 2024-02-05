import Phaser from "../lib/phaser.js";

export class Title extends Phaser.Scene {
  constructor() {
    super({
      key: "Title",
    });
  }

  create() {
    this.createBackground();

    this.add.image(this.scale.width / 2, this.scale.height / 2 - 40, "logo");

    this.createRetroFont();

    this.createStartButton();

    this.tutorialText = this.add
      .bitmapText(
        this.scale.width / 2,
        this.scale.height / 2 + 120,
        "retroFont",
        "USE ARROW KEYS TO MOVE\nSPACEBAR TO SHOOT\nLEFT SHIFT TO DASH\nP TO PAUSE"
      )
      .setOrigin(0.5);

    this.music = this.sound.add("gameTheme", { loop: true });
    this.music.play();

    this.makeSFX();
    this.makeAnims();
    this.cameras.main.fadeIn(250, 0, 0, 16);
  }

  update() {
    this.background.setFrame(this.backgroundAnim.frame.name);

    if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      this.startGame();
    }
  }

  startGame() {
    this.playButton.setFrame(1);
    this.buttonText.setY(this.buttonText.y + 2);

    this.sound.unlock();
    if (!this.sound.locked) {
      this.music.play();
    } else {
      this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
        this.music.play();
      });
    }

    this.scene.start("Play");
  }

  createBackground() {
    this.background = this.add
      .tileSprite(
        0,
        0,
        this.scale.width * 2,
        this.scale.height * 2,
        "background"
      )
      .setScale(0.5, 0.5)
      .setOrigin(0, 0);

    if (!this.anims.exists("backgroundAnim")) {
      this.anims.create({
        key: "backgroundAnim",
        frames: this.anims.generateFrameNumbers("background", {
          start: 0,
          end: 1,
          first: 0,
        }),
        frameRate: 3,
        repeat: -1,
      });
    }

    this.backgroundAnim = this.add
      .sprite(0, 0, "background")
      .setVisible(false)
      .play("backgroundAnim");
  }

  makeSFX() {
    this.sound.add("laser", { loop: false });
    this.sound.add("enemyShoot", { loop: false });
    this.sound.add("pickup", { loop: false });
    this.sound.add("dash", { loop: false });
    this.sound.add("explosionSfx", { loop: false });
  }

  makeAnims() {
    if (!this.anims.exists("explosion")) {
      this.anims.create({
        key: "explosionAnim",
        frames: this.anims.generateFrameNumbers("explosion", {
          start: 0,
          end: 5,
          first: 0,
        }),
        frameRate: 10,
      });
      this.anims.create({
        key: "rollingStar",
        frames: this.anims.generateFrameNumbers("star", {
          start: 0,
          end: 3,
          first: 0,
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "rollingBigStar",
        frames: this.anims.generateFrameNumbers("bigStar", {
          start: 0,
          end: 3,
          first: 0,
        }),
        frameRate: 15,
        repeat: -1,
      });
      this.anims.create({
        key: "enemyBolt",
        frames: this.anims.generateFrameNumbers("bolt", {
          start: 0,
          end: 3,
          first: 0,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }
    this.anims.create({
      key: "coinFlip",
      frames: this.anims.generateFrameNumbers("treasure", {
        start: 0,
        end: 3,
        first: 0,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "coinFade",
      frames: this.anims.generateFrameNumbers("treasure", {
        start: 4,
        end: 7,
        first: 0,
      }),
      frameRate: 10,
    });
  }

  createRetroFont() {
    var config = {
      image: "retroFont",
      width: 16,
      height: 16,
      chars: "1234567890!?ABCDEFGHIJKLMNOPQRSTUVWXYZ.,: ",
      charsPerRow: 12,
      spacing: { x: 0, y: 0 },
    };
    this.cache.bitmapFont.add(
      "retroFont",
      Phaser.GameObjects.RetroFont.Parse(this, config)
    );
  }

  createStartButton() {
    this.playButton = this.add
      .nineslice(
        this.scale.width / 2,
        this.scale.height / 2 + 40,
        "button",
        0,
        100,
        35,
        4,
        4,
        4,
        4
      )
      .setInteractive({ useHandCursor: true });

    this.buttonText = this.add
      .bitmapText(
        this.scale.width / 2,
        this.scale.height / 2 + 40,
        "retroFont",
        "PLAY"
      )
      .setOrigin(0.5)
      .setTint(0x606061);

    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.playButton.on("pointerup", this.startGame, this);
  }
}
