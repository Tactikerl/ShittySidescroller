import Phaser from "../lib/phaser.js";

export class Enemy extends Phaser.Physics.Arcade.Image {
  constructor(scene) {
    super(scene, 0, 0, "enemy");
    this.setFlipX(true);
    this.speed = 200;
  }

  spawn(x, y) {
    this.setPosition(x, y);

    this.enableBody(
      // Enable physics body
      true, // Reset body and game object, at (x, y)
      x,
      y,
      true, // Activate sprite
      true // Show sprite
    );

    this.setVelocityX(-this.speed);
  }

  update(time, delta) {
    if (this.x < -16) {
      this.disableBody(
        // Stop and disable physics body
        true, // Deactivate sprite (active=false)
        true // Hide sprite (visible=false)
      );
    }
  }
}
