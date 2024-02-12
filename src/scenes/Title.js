import Phaser from "../lib/phaser.js";

export class Title extends Phaser.Scene {
  constructor() {
    super({
      key: "Title",
    });
  }

  create() {
    this.createBackground();

    this.add.image(this.scale.width / 2, 80, "logo");

    this.createRetroFont();

    this.buttonList = [];
    this.createButton(
      this.scale.height / 2 - 30,
      "PLAY",
      this.startGame,
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.createButton(
      this.scale.height / 2 + 30,
      "SCOREBOARD",
      this.goToScoreboard,
      Phaser.Input.Keyboard.KeyCodes.S,
      180
    );

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

    for (const button of this.buttonList) {
      if (Phaser.Input.Keyboard.JustDown(button.key)) {
        button.callback();
      }
    }
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
    this.anims.create({
      key: "heartBeat",
      frames: this.anims.generateFrameNumbers("heartPickup", {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
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

  createButton(y, txt, callback, keyName, width = 100) {
    const cap = this.add
      .nineslice(this.scale.width / 2, y, "button", 0, width, 35, 4, 4, 4, 4)
      .setInteractive({ useHandCursor: true })
      .on("pointerup", callback, this);

    const label = this.add
      .bitmapText(this.scale.width / 2, y, "retroFont", txt)
      .setOrigin(0.5)
      .setTint(0x606061);

    const key = this.input.keyboard.addKey(keyName);

    this.buttonList.push({ cap, label, key, callback });
  }

  startGame() {
    const button = this.buttonList.find((b) => b.label.text === "PLAY");
    button.cap.setFrame(1);
    button.label.setY(button.label.y + 2);

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

  goToScoreboard() {
    const button = this.buttonList.find((b) => b.label.text === "SCOREBOARD");
    button.cap.setFrame(1);
    button.label.setY(button.label.y + 2);

    this.scene.start("Scoreboard");
  }
}
