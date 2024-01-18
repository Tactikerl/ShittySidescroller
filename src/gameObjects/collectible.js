import Phaser from "../lib/phaser.js";
export class Collectible extends Phaser.Physics.Arcade.Image {
  constructor(scene) {
    super(scene, 0, 0, "collectible");
    this.isFading = false;
  }

  spawn(x, y, time) {
    this.setPosition(x, y);
    this.spawnTime = time;
    this.isFading = false;

    this.enableBody(
      // Enable physics body
      true, // Reset body and game object, at (x, y)
      x,
      y,
      true, // Activate sprite
      true // Show sprite
    );
  }

  collectedOrFaded() {
    this.fadingTween && this.fadingTween.remove();
    this.setTint(Phaser.Display.Color.GetColor(255, 255, 255));
    this.disableBody(
      // Stop and disable physics body
      true, // Deactivate sprite (active=false)
      true // Hide sprite (visible=false)
    );
  }

  update(time, delta) {
    const elapsedTime = time - this.spawnTime;
    if (elapsedTime > 5000 && !this.isFading) {
      this.isFading = true;
      this.triggerFade();
    }
    if (elapsedTime > 10000) {
      this.collectedOrFaded();
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
