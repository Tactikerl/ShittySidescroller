import Phaser from "../lib/phaser.js";

export class EnemyBullet extends Phaser.Physics.Arcade.Image {
  constructor(scene) {
    super(scene, 0, 0, "bullet");

    this.speed = -500;
    this.setTint(0xfc7703);
    this.enemyShoot = scene.sound.get("enemyShoot");
  }

  fire(x, y) {
    this.enemyShoot.play();
    this.setPosition(x - 32, y);

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
    if (this.x < -16) {
      this.disableBody(
        // Stop and disable physics body
        true, // Deactivate sprite (active=false)
        true // Hide sprite (visible=false)
      );
    }
  }
}
