import Phaser from "../lib/phaser.js";

export class Player extends Phaser.Physics.Arcade.Sprite {
  lastFired = 0;
  speed = 200;

  isDashing = false;
  lastDashed = 0;
  dashCooldown = 0;

  constructor(scene, x, y, bullets) {
    super(scene, x, y, "player", 0);

    this.bullets = bullets;

    this.particleHolder = scene.add.image(-100, -100, "star");

    this.particles = scene.add.particles(0, 0, "star", {
      speed: 100,
      lifespan: 500,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
    });

    this.particles.startFollow(this);

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
    if (this.body.velocity.x == 0 && this.body.velocity.y == 0) {
      this.particles.startFollow(this.particleHolder);
    } else {
      this.particles.startFollow(this);
    }

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
