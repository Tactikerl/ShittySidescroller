import Phaser from "../lib/phaser.js";
import eventsCenter, { events } from "../EventsCenter.js";
import { saveGif } from "../utils/saveImage.js";

const {
  healthPickup,
  playTime,
  updateScore,
  playerDamage,
  playerDashing,
} = events;

export class PlayUI extends Phaser.Scene {
  constructor() {
    super({
      key: "PlayUI",
    });
  }

  create(data) {
    this.scoreText = this.add.bitmapText(5, 5, "retroFont", data.score);
    eventsCenter.on(
      updateScore,
      (score) => (this.scoreText.text = score),
      this
    );

    this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

    this.pauseText = this.add
      .bitmapText(360, 240, "retroFont", "GAME PAUSED")
      .setOrigin(0.5)
      .setVisible(false);

    this.playTime = this.add
      .bitmapText(this.scale.width, 5, "retroFont", "00:00:00")
      .setOrigin(1, 0);
    eventsCenter.on(
      playTime,
      (time) => {
        this.playTime.text = new Date(time * 1000).toISOString().slice(11, 19);
      },
      this
    );

    this.healthBar();

    this.createStaminaBar();

    this.input.keyboard.on("keydown-I", (event) => {
      event.stopPropagation();

      saveGif(this, 3000);
    });
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
  }

  healthBar() {
    const heartPoints = 3;
    this.HP = [];

    for (let index = 0; index < heartPoints; index++) {
      const heart = this.add.image(
        this.scale.width / 2 - 18 + index * 18,
        30,
        "heart",
        0
      );
      this.HP.push(heart);
    }

    eventsCenter.on(healthPickup, (health) => {
      this.HP[health - 1].setFrame(0);
    });

    eventsCenter.on(playerDamage, (health) => {
      this.HP[health].setFrame(2);
    });
  }

  createStaminaBar() {
    this.barContainer = 130;

    this.add
      .nineslice(
        this.scale.width / 2 - this.barContainer / 2,
        13,
        "loadingBar",
        0,
        this.barContainer,
        14,
        3,
        3,
        3,
        3
      )
      .setOrigin(0, 0.5);

    this.fill = this.add
      .nineslice(
        this.scale.width / 2 - this.barContainer / 2,
        13,
        "loadingBar",
        2,
        this.barContainer,
        14,
        3,
        3,
        3,
        3
      )
      .setOrigin(0, 0.5);

    eventsCenter.on(playerDashing, this.dashUpdate, this);
  }

  dashUpdate(dashTimes) {
    this.tweens.chain({
      targets: this.fill,
      tweens: [
        {
          width: 0,
          duration: dashTimes.dashingTime,
          ease: "sine.inout",
          onUpdate: (tween) => {
            var value = 255 * (Math.floor(tween.getValue()) / 130);
            this.fill.setTint(Phaser.Display.Color.GetColor(255, value, value));
          },
        },
        {
          width: this.barContainer,
          duration: dashTimes.cooldownTime,
          ease: "sine.inout",
          onUpdate: (tween) => {
            var value = 255 * (Math.floor(tween.getValue()) / 130);
            this.fill.setTint(Phaser.Display.Color.GetColor(255, value, value));
          },
        },
      ],
    });
  }
}
