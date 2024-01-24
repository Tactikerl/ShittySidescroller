import Phaser from "../lib/phaser.js";

export class Title extends Phaser.Scene {
  constructor() {
    super({
      key: "Title",
    });
  }

  create() {
    this.createBackground();
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

    this.playButton = this.add
      .nineslice(360, 240, "button", 0, 100, 35, 4, 4, 4, 4)
      .setInteractive({ useHandCursor: true });

    this.buttonText = this.add
      .bitmapText(360, 240, "retroFont", "PLAY")
      .setOrigin(0.5)
      .setTint(0x606061);

    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.playButton.on("pointerup", this.startGame, this);

    this.music = this.sound.add("gameTheme", { loop: true });
    this.music.play();
    this.makeSFX();
  }

  update() {
    this.background.setFrame(this.backgroundAnim.frame.name);
    // this.background.tilePositionX += 3;
    if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      this.startGame();
    }
  }

  startGame() {
    this.playButton.setFrame(1);
    this.buttonText.setY(this.buttonText.y + 2);
    console.log(this.time.now);
    this.scene.start("Play", { startTime: this.time.now });
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
  }
}
