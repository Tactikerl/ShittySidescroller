import Phaser from "../lib/phaser.js";
import eventsCenter from "../EventsCenter.js";

export class PlayUI extends Phaser.Scene {
  constructor() {
    super({
      key: "PlayUI",
    });
  }

  create(data) {
    this.scoreText = this.add.bitmapText(5, 5, "retroFont", data.score);

    eventsCenter.on("update-score", this.updateScore, this);

    this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.pauseText = this.add
      .bitmapText(360, 240, "retroFont", "GAME PAUSED")
      .setOrigin(0.5)
      .setVisible(false);

    this.playTime = this.add
      .bitmapText(this.scale.width, 5, "retroFont", "00:00:00")
      .setOrigin(1, 0);

    this.gameStartTime = this.time.now + data.startTime;
    console.log(this.gameStartTime);
  }

  update(time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.keyP)) {
      if (this.scene.isPaused("Play")) {
        this.scene.resume("Play");
        this.pauseText.setVisible(false);

        this.sound.setVolume(1);
      } else {
        this.scene.pause("Play");
        this.pauseText.setVisible(true);

        this.sound.setVolume(0.5);
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
