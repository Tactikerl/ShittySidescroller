import Phaser from "../lib/phaser.js";

export class Scoreboard extends Phaser.Scene {
  constructor() {
    super({
      key: "Scoreboard",
    });
  }

  create() {
    this.scene.launch("ScoreField");
    this.scene.bringToTop();

    this.padding = this.scale.width / 2 - 340 / 2;
    this.topPadding = 200;
    this.fontSize = 16;
    this.listSpacing = 25;
    this.extraPadding = 30;

    this.add
      .bitmapText(
        this.padding + this.extraPadding,
        this.topPadding,
        "retroFont",
        "RANK  SCORE   NAME"
      )
      .setTint(0xff00ff);

    this.add
      .bitmapText(
        this.padding + this.fontSize * 6 + this.extraPadding,
        this.listSpacing + this.topPadding,
        "retroFont",
        "50000"
      )
      .setTint(0x0261c7);

    this.playerText = this.add
      .bitmapText(
        this.fontSize * 14 + this.padding + this.extraPadding,
        this.listSpacing + this.topPadding,
        "retroFont",
        ""
      )
      .setTint(0x0261c7);

    this.input.keyboard.enabled = false;

    this.scene.launch("InputScore", { padding: this.padding });

    let panel = this.scene.get("InputScore");

    panel.events.on("updateName", this.updateName, this);
    panel.events.on("submitName", this.submitName, this);
  }

  submitName() {
    this.scene.stop("InputScore");

    this.add
      .bitmapText(
        this.padding + this.extraPadding,
        this.listSpacing + this.topPadding,
        "retroFont",
        "1ND   50000   " + this.playerText.text
      )
      .setTint(0xff0000);

    this.add
      .bitmapText(
        this.padding + this.extraPadding,
        this.listSpacing * 2 + this.topPadding,
        "retroFont",
        "2ND   40000   ANT"
      )
      .setTint(0xff8200);
    this.add
      .bitmapText(
        this.padding + this.extraPadding,
        this.listSpacing * 3 + this.topPadding,
        "retroFont",
        "3RD   30000   .A."
      )
      .setTint(0xffff00);
    this.add
      .bitmapText(
        this.padding + this.extraPadding,
        this.listSpacing * 4 + this.topPadding,
        "retroFont",
        "4TH   20000   BOB"
      )
      .setTint(0x00ff00);
    this.add
      .bitmapText(
        this.padding + this.extraPadding,
        this.listSpacing * 5 + this.topPadding,
        "retroFont",
        "5TH   10000   ZIK"
      )
      .setTint(0x00bfff);
  }

  updateName(name) {
    this.playerText.setText(name);
  }
}
