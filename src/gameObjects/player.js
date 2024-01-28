import Phaser from "../lib/phaser.js";
import eventsCenter from "../EventsCenter.js";

export class Player extends Phaser.Physics.Arcade.Sprite {
  lastFired = 0;
  speed = 200;

  isDashing = false;
  lastDashed = 0;
  dashCooldown = 0;

  constructor(scene, x, y, bullets) {
    super(scene, x, y, "player", 0);

    this.bullets = bullets;

    this.particles = scene.add.particles(-5, 0, "star", {
      speed: 100,
      frame: 0,
      scale: { start: 1, end: 0 },
      lifespan: {
        onEmit: () =>
          (!this.isDashing ? this.body.speed / this.speed : 1) * 500,
      },
      alpha: {
        onEmit: () => (this.body.speed / this.speed) * 500,
      },
      quantity: {
        onEmit: () => (this.body.speed / this.speed) * 1,
      },
      blendMode: "ADD",
      follow: this,
    });

    scene.add.existing(this);

    scene.physics.add.existing(this, false);

    this.setBodySize(26, 26).setOffset(4, 4);
    this.setCircle(12);
    this.keyboard = scene.input.keyboard.createCursorKeys();
    this.keySpace = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.keyShift = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );

    this.setCollideWorldBounds(true);

    this.dashSound = scene.sound.get("dash");
  }

  disableMe() {
    this.disableBody(true, true);
  }

  update(time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.keyShift)) {
      if (time > this.dashCooldown) {
        this.isDashing = true;
        this.lastDashed = time + 200;
        this.dashCooldown = time + 1000;

        let currentVelocity = this.body.velocity;

        if (currentVelocity.x === 0 && currentVelocity.y === 0) {
          this.setVelocityX(this.speed * 4);
        } else {
          this.setVelocity(currentVelocity.x * 4, currentVelocity.y * 4);
        }

        this.dashSound.play();
        eventsCenter.emit("player-dashing", {
          dashingTime: 200,
          cooldownTime: 1000,
        });
      }
    }

    if (time > this.lastDashed) {
      this.isDashing = false;
    }

    if (this.isDashing) {
      return;
    }

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
