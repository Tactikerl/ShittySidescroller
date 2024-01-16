import Phaser from "./lib/phaser.js";
export class Bullet extends Phaser.Physics.Arcade.Image {
  constructor(scene) {
    super(scene, 0, 0, "bullet");

    this.speed = Phaser.Math.GetSpeed(400, 1);
  }

  fire(x, y) {
    this.setPosition(x + 32, y);

    this.enableBody(
      // Enable physics body
      true, // Reset body and game object, at (x, y)
      x,
      y,
      true, // Activate sprite
      true // Show sprite
    );
  }

  hit() {
    this.disableBody(
      // Stop and disable physics body
      true, // Deactivate sprite (active=false)
      true // Hide sprite (visible=false)
    );
  }

  update(time, delta) {
    this.x += this.speed * delta;

    if (this.x > 720) {
      this.disableBody(
        // Stop and disable physics body
        true, // Deactivate sprite (active=false)
        true // Hide sprite (visible=false)
      );
    }
  }
}
