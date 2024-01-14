import Phaser from "./lib/phaser.js";
import { Bullet } from "./bullet.js";
export class MyScene extends Phaser.Scene {
  lastFired = 0;
  speed;
  constructor() {
    super({ key: "MyScene" });
  }

  preload() {
    //Assets to be loaded before create() is called

    this.load.image("bullet", "/assets/bullet.png");
    this.load.image("enemy", "/assets/enemy.png");
    this.load.spritesheet(
      "player",
      "/assets/PlayerPlaceholderSpritesheet.png",
      { frameWidth: 32, frameHeight: 32 }
    );
  }

  create() {
    //Adding sprites, sounds, etc...
    this.add.text(0, 0, "Shitty SideScroller");
    this.player = this.physics.add.sprite(100, 240, "player", 0);

    this.enemy = this.physics.add.image(600, 240, "enemy");
    this.enemy.flipX = true;
    this.enemy.setVelocityX(-100);

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
    this.speed = 150;

    this.physics.add.overlap(
      this.enemy,
      this.bullets,
      this.enemyHit,
      null,
      this
    );

    this.timedEvent = this.time.addEvent({
      delay: 3000,
      callback: this.respawnEnemy,
      callbackScope: this,
      loop: true,
    });
  }

  update(time, delta) {
    //Keep update on everytick
    //Game logic, collision, movement, etc...
    this.player.body.setVelocity(0);
    this.player.setFrame(0);
    if (this.keyboard.left.isDown) {
      this.player.setVelocityX(-this.speed);
      this.player.setFrame(1);
    }
    if (this.keyboard.right.isDown) {
      this.player.setVelocityX(this.speed);
      this.player.setFrame(2);
    }
    if (this.keyboard.up.isDown) {
      this.player.setVelocityY(-this.speed);
      this.player.setFrame(5);
    }
    if (this.keyboard.down.isDown) {
      this.player.setVelocityY(this.speed);
      this.player.setFrame(3);
    }

    if (this.keySpace.isDown && time > this.lastFired) {
      const bullet = this.bullets.get();

      if (bullet) {
        bullet.fire(this.player.x, this.player.y);

        this.lastFired = time + 90;
      }
    }

    if (this.enemy.x < -16) {
      this.enemy.setPosition(740, this.enemy.y);
    }
  }

  enemyHit(enemy, bullet) {
    bullet.hit();
    enemy.disableBody(true, true);
  }

  respawnEnemy() {
    let enemy = this.physics.add.image(600, 240, "enemy");
    enemy.flipX = true;
    enemy.setVelocityX(-100);
  }
}
