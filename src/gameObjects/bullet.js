import Phaser from "../lib/phaser.js";

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene) {
    super(scene, 0, 0, "star", 0);

    this.speed = 400;

    this.laserSound = scene.sound.get("laser");
  }

  fire(x, y) {
    this.laserSound.play();
    this.play("rollingStar");

    this.setPosition(x + 32, y);

    this.enableBody(
      // Enable physics body
      true, // Reset body and game object, at (x, y)
      x,
      y,
      true, // Activate sprite
      true // Show sprite
    );

    this.setVelocityX(this.speed);
  }

  hit() {
    this.disableBody(
      // Stop and disable physics body
      true, // Deactivate sprite (active=false)
      true // Hide sprite (visible=false)
    );
  }

  update(time, delta) {
    if (this.x > 720) {
      this.disableBody(
        // Stop and disable physics body
        true, // Deactivate sprite (active=false)
        true // Hide sprite (visible=false)
      );
    }
  }
}
