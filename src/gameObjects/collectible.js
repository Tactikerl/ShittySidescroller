import Phaser from "../lib/phaser.js";
export class Collectible extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 0, 0, "treasure");
    this.isFading = false;
    this.pickupSound = scene.sound.get("pickup");
  }

  spawn(x, y, time) {
    this.setPosition(x, y);
    this.spawnTime = time;
    this.isFading = false;

    this.enableBody(true, x, y, true, true);
    this.play("coinFlip");
  }

  collectedOrFaded(fading = false) {
    this.fadingTween && this.fadingTween.remove();
    this.setTint(Phaser.Display.Color.GetColor(255, 255, 255));
    if (fading) {
      this.disableBody(true, true);
    } else {
      this.disableBody(false, false);
      this.play("coinFade");
      this.pickupSound.play();
      this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
        this.disableBody(true, true);
      });
    }
  }

  update(time, delta) {
    const elapsedTime = time - this.spawnTime;
    if (elapsedTime > 5000 && !this.isFading) {
      this.isFading = true;
      this.triggerFade();
    }
    if (elapsedTime > 10000) {
      this.collectedOrFaded(true);
    }
  }

  triggerFade() {
    this.fadingTween = this.scene.tweens.addCounter({
      from: 255,
      to: 0,
      duration: 500,
      loop: -1,
      onUpdate: (tween) => {
        const value = Math.floor(tween.getValue());

        this.setTint(Phaser.Display.Color.GetColor(value, value, value));
      },
    });
  }
}
