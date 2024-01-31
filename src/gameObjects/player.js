import Phaser from "../lib/phaser.js";
import eventsCenter from "../EventsCenter.js";

export class Player extends Phaser.Physics.Arcade.Sprite {
  lastFired = 0;
  speed = 200;
  health = 3;

  invisFrames = false;
  invisFramesCooldown = 0;
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

    this.setCollideWorldBounds(true);

    this.dashSound = scene.sound.get("dash");
  }

  disableMe() {
    this.health--;
    eventsCenter.emit("playerDamage", this.health);

    if (this.health == 0) {
      this.disableBody(true, true);
    }
    this.invisFrames = true;
    this.scene.time.delayedCall(
      500,
      () => {
        this.invisFrames = false;
      },
      [],
      this
    );
  }

  update(time, delta, controls) {
    const { joyStick, keyboard, keySpace, keyShift } = controls;
    var cursorKeys = joyStick.createCursorKeys();

    if (Phaser.Input.Keyboard.JustDown(keyShift)) {
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
    if (keyboard.left.isDown || cursorKeys.left.isDown) {
      this.setVelocityX(-this.speed);
      this.setFrame(1);
    }
    if (keyboard.right.isDown || cursorKeys.right.isDown) {
      this.setVelocityX(this.speed);
      this.setFrame(2);
    }
    if (keyboard.up.isDown || cursorKeys.up.isDown) {
      this.setVelocityY(-this.speed);
      this.setFrame(5);
    }
    if (keyboard.down.isDown || cursorKeys.down.isDown) {
      this.setVelocityY(this.speed);
      this.setFrame(3);
    }
    if (this.body.velocity.x != 0 && this.body.velocity.y != 0) {
      this.body.velocity.normalize().scale(this.speed);
    }

    if (keySpace.isDown && time > this.lastFired) {
      const bullet = this.bullets.get();

      if (bullet) {
        bullet.fire(this.x, this.y);

        this.lastFired = time + 90;
      }
    }
  }
}
