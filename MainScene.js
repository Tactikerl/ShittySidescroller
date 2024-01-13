import { Bullet } from "./bullet.js";
export class MyScene extends Phaser.Scene {
  lastFired = 0;
  speed;
  constructor() {
    super({ key: "MyScene" });
  }

  preload() {
    //Assets to be loaded before create() is called
    this.load.image("player", "/assets/playerPlaceHolder.png");
    this.load.image("bullet", "/assets/bullet.png");
    this.load.image("enemy", "/assets/enemy.png");
  }

  create() {
    //Adding sprites, sounds, etc...
    this.add.text(0, 0, "Shitty SideScroller");
    this.player = this.physics.add.image(500, 300, "player");

    this.enemy = this.physics.add.image(1500, 300, "enemy");

    this.keyboard = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.player.body.setCollideWorldBounds(true);

    this.bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true,
    });
    this.speed = 300;

    this.physics.add.overlap(
      this.enemy,
      this.bullets,
      this.enemyHit,
      null,
      this
    );
  }

  update(time, delta) {
    //Keep update on everytick
    //Game logic, collision, movement, etc...
    this.player.body.setVelocity(0);
    if (this.keyboard.left.isDown) {
      this.player.setVelocityX(-this.speed);
    }
    if (this.keyboard.right.isDown) {
      this.player.setVelocityX(this.speed);
    }
    if (this.keyboard.up.isDown) {
      this.player.setVelocityY(-this.speed);
    }
    if (this.keyboard.down.isDown) {
      this.player.setVelocityY(this.speed);
    }

    if (this.keySpace.isDown && time > this.lastFired) {
      const bullet = this.bullets.get();

      if (bullet) {
        bullet.fire(this.player.x, this.player.y);

        this.lastFired = time + 90;
      }
    }
  }

  enemyHit(enemy, bullet) {
    bullet.hit();
    enemy.disableBody(true, true);
  }
}
