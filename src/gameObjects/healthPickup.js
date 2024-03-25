import Phaser from "../lib/phaser.js";
export class HealthPickup extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 0, 0, "heartPickup");
    this.isFading = false;
    this.pickupSound = scene.sound.get("pickup");
    scene.add.existing(this);

    scene.physics.add.existing(this, false);
    this.disableBody(true, true);

    this.spawnEvent = scene.time.addEvent({
      delay: 15000,
      callback: this.spawn,
      callbackScope: this,
      loop: true,
    });
  }

  spawn() {
    this.anims.timeScale = 1;
    const x = Phaser.Math.Between(20, this.scene.scale.width - 20);
    const y = Phaser.Math.Between(20, this.scene.scale.height - 20);
    this.spawnTime = this.scene.time.now;
    this.isFading = false;

    this.enableBody(true, x, y, true, true);
    this.play("heartBeat");
    this.scene.events.on("update", this.update, this);
  }

  collectedOrFaded(faded = false) {
    if (!this.body) {
      return;
    }
    this.fadingTween && this.fadingTween.remove();
    this.setTint(Phaser.Display.Color.GetColor(255, 255, 255));
    this.scene && this.scene.events.off("update", this.update, this);
    if (faded) {
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

    if (elapsedTime > 7000 && !this.isFading) {
      this.isFading = true;
      this.triggerFade();
    }
    if (elapsedTime > 10000) {
      this.collectedOrFaded(true);
    }
  }

  triggerFade() {
    if (!this.scene) {
      return;
    }
    this.fadingTween = this.scene.tweens.addCounter({
      from: 255,
      to: 0,
      duration: 500,
      loop: 6,
      onUpdate: (tween) => {
        const value = Math.floor(tween.getValue());
        this.anims.timeScale = 1 + tween.totalProgress * 2;
        this.setTint(Phaser.Display.Color.GetColor(value, value, value));
      },
    });
  }
}
