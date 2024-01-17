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
      chars: "1234567890",
      charsPerRow: 10,
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
  }

  updateScore(score) {
    this.scoreText.text = score;
  }
}
