import Phaser from "../lib/phaser.js";
// import { EnemyBullet } from "./enemyBullet.js";
import eventsCenter from "../EventsCenter.js";

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
    this.setCircle(16);

    this.setVelocityX(-this.speed);

    this.shootEvent = this.scene.time.addEvent({
      delay: 250,
      callback: this.shootBullet,
      callbackScope: this,
      repeat: 2,
    });
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

  shootBullet() {
    const x = this.x;
    const y = this.y;

    eventsCenter.emit("enemy-shoot", { x, y });
  }
}
