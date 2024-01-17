import Phaser from "../lib/phaser.js";

export class Player extends Phaser.Physics.Arcade.Sprite {
  lastFired = 0;
  speed = 150;

  constructor(scene, x, y, bullets) {
    super(scene, x, y, "player", 0);
    this.bullets = bullets;

    scene.add.existing(this);
    scene.physics.add.existing(this, false);

    this.keyboard = scene.input.keyboard.createCursorKeys();
    this.keySpace = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.setCollideWorldBounds(true);
  }

  disableMe() {
    this.disableBody(true, true);
  }

  update(time, delta) {
    this.setVelocity(0);
    this.setFrame(0);
    if (this.keyboard.left.isDown) {
      this.setVelocityX(-this.speed);
      this.setFrame(1);
    }
    if (this.keyboard.right.isDown) {
      this.setVelocityX(this.speed);
      this.setFrame(2);
    }
    if (this.keyboard.up.isDown) {
      this.setVelocityY(-this.speed);
      this.setFrame(5);
    }
    if (this.keyboard.down.isDown) {
      this.setVelocityY(this.speed);
      this.setFrame(3);
    }

    if (this.keySpace.isDown && time > this.lastFired) {
      const bullet = this.bullets.get();

      if (bullet) {
        bullet.fire(this.x, this.y);

        this.lastFired = time + 90;
      }
    }
  }
}
