import Phaser from "../lib/phaser.js";
import eventsCenter from "../EventsCenter.js";

export class PlayUI extends Phaser.Scene {
  constructor() {
    super({
      key: "PlayUI",
    });
  }

  create(data) {
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

    this.scoreText = this.add.bitmapText(5, 5, "retroFont", data.score);

    eventsCenter.on("update-score", this.updateScore, this);

    //this.children.bringToTop(this.scoreText);
    //this.scoreText.setScrollFactor(0);

    this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.pauseText = this.add
      .bitmapText(360, 240, "retroFont", "GAME PAUSED")
      .setOrigin(0.5)
      .setVisible(false);

    this.playTime = this.add
      .bitmapText(this.scale.width, 5, "retroFont", "00:00:00")
      .setOrigin(1, 0);

    this.gameStartTime = this.time.now;
  }

  update(time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.keyP)) {
      if (this.scene.isPaused("Play")) {
        this.scene.resume("Play");
        this.pauseText.setVisible(false);
      } else {
        this.scene.pause("Play");
        this.pauseText.setVisible(true);
      }
    }

    const playSeconds = Math.round((time - this.gameStartTime) * 0.001);
    this.playTime.text = new Date(playSeconds * 1000)
      .toISOString()
      .slice(11, 19);
  }

  updateScore(score) {
    this.scoreText.text = score;
  }
}
