import Phaser from "./lib/phaser.js";
import { Bullet } from "./bullet.js";
import { Enemy } from "./enemy.js";
import { Collectible } from "./collectible.js";
export class MyScene extends Phaser.Scene {
  lastFired = 0;
  speed;
  constructor() {
    super({ key: "MyScene" });
  }

  preload() {
    //Assets to be loaded before create() is called

    this.load.image("retroFont", "assets/numbers.png");
    this.load.image("bullet", " assets/bullet.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("collectible", "assets/collectible.png");
    this.load.spritesheet("background", "assets/background.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.spritesheet("player", "assets/PlayerPlaceholderSpritesheet.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    //Adding sprites, sounds, etc...
    this.background = this.add
      .tileSprite(
        0,
        0,
        this.scale.width * 2,
        this.scale.height * 2,
        "background"
      )
      .setScale(0.5, 0.5)
      .setOrigin(0, 0);
    this.anims.create({
      key: "backgroundAnim",
      frames: this.anims.generateFrameNumbers("background", {
        start: 0,
        end: 1,
        first: 0,
      }),
      frameRate: 3,
      repeat: -1,
    });
    this.backgroundAnim = this.add
      .sprite(0, 0, "background")
      .setVisible(false)
      .play("backgroundAnim");

    this.player = this.physics.add.sprite(100, 240, "player", 0);

    // this.enemy = this.physics.add.image(600, 240, "enemy");
    // this.enemy.flipX = true;
    // this.enemy.setVelocityX(-100);
    this.enemies = this.physics.add.group({
      classType: Enemy,
      maxSize: 10,
      runChildUpdate: true,
    });

    this.collectibles = this.physics.add.group({
      classType: Collectible,
      maxSize: 1,
      runChildUpdate: true,
    });

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
      this.enemies,
      this.bullets,
      this.enemyHit,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.playerHit,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.collectibles,
      this.collectCollectible,
      null,
      this
    );

    this.enemyEvent = this.time.addEvent({
      delay: 1500,
      callback: this.respawnEnemy,
      callbackScope: this,
      loop: true,
    });

    this.collectibleEvent = this.time.addEvent({
      delay: 30000,
      callback: this.spawnCollectible,
      callbackScope: this,
      loop: true,
    });

    this.createRetroFonts();
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

    this.background.setFrame(this.backgroundAnim.frame.name);
    this.background.tilePositionX += 3;
  }

  enemyHit(enemy, bullet) {
    bullet.hit();
    enemy.disableBody(true, true);
    this.score += 10;
    this.scoreText.text = this.score;
  }

  respawnEnemy() {
    //Span enemy
    const enemy = this.enemies.get();

    if (enemy) {
      const x = 750;
      const y = Phaser.Math.Between(20, 460);
      enemy.spawn(x, y);
    }
  }

  spawnCollectible() {
    const collectible = this.collectibles.get();

    if (collectible) {
      const x = Phaser.Math.Between(20, this.scale.width - 20);
      const y = Phaser.Math.Between(20, this.scale.height - 20);
      collectible.spawn(x, y, this.time.now);
    }
  }

  collectCollectible(player, collectible) {
    collectible.collectedOrFaded();
    this.score += 25;
    this.scoreText.text = this.score;
  }

  playerHit(player, enemy) {
    player.disableBody(true, true);
    this.scene.restart();
  }

  createRetroFonts() {
    this.score = 0;
    var config = {
      image: "retroFont",
      width: 16,
      height: 16,
      chars: "1234567890",
      charsPerRow: 10,
      spacing: { x: 0, y: 0 },
    };
    this.cache.bitmapFont.add(
      "retroFont",
      Phaser.GameObjects.RetroFont.Parse(this, config)
    );

    this.scoreText = this.add.bitmapText(5, 5, "retroFont", this.score);

    this.children.bringToTop(this.scoreText);
    //this.scoreText.setScrollFactor(0);
  }
}
