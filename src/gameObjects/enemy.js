import Phaser from "../lib/phaser.js";
// import { EnemyBullet } from "./enemyBullet.js";
import eventsCenter from "../EventsCenter.js";

export class Enemy extends Phaser.Physics.Arcade.Image {
  constructor(scene) {
    super(scene, 0, 0, "enemy");
    this.setFlipX(true);
    this.speed = 200;
    // this.bulletList = [
    //   scene.physics.add
    //     .image(0, 0, "bullet")
    //     .disableBody(true, true)
    //     .setTint(0xfc7703),
    //   scene.physics.add
    //     .image(0, 0, "bullet")
    //     .disableBody(true, true)
    //     .setTint(0xfc7703),
    //   scene.physics.add
    //     .image(0, 0, "bullet")
    //     .disableBody(true, true)
    //     .setTint(0xfc7703),
    // ];
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
    // for (let i = 0; i < this.bulletList.length; i++) {
    //   const bullet = this.bulletList[i];
    //   if (bullet.visible) {
    //     if (bullet.x < -16) {
    //       bullet.disableBody(true, true);
    //     }
    //   }
    // }
  }

  shootBullet() {
    const x = this.x;
    const y = this.y;

    eventsCenter.emit("enemy-shoot", { x, y });
  }
}
