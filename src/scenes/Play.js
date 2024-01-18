import Phaser from "../lib/phaser.js";
import { Player } from "../gameObjects/player.js";
import { Bullet } from "../gameObjects/bullet.js";
import { Enemy } from "../gameObjects/enemy.js";
import { Collectible } from "../gameObjects/collectible.js";
import { EnemyBullet } from "../gameObjects/enemyBullet.js";
import eventsCenter from "../EventsCenter.js";

export class Play extends Phaser.Scene {
  constructor() {
    super({ key: "Play" });
  }

  create() {
    //Adding sprites, sounds, etc...
    this.createBackground();

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

    this.bullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true,
    });

    this.enemyBullets = this.physics.add.group({
      classType: EnemyBullet,
      maxSize: 20,
      runChildUpdate: true,
    });

    eventsCenter.on("enemy-shoot", (config) => {
      const bullet = this.enemyBullets.get();

      if (bullet) {
        bullet.fire(config.x, config.y);
      }
    });

    this.player = new Player(this, 100, 240, this.bullets);

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

    this.physics.add.overlap(
      this.player,
      this.enemyBullets,
      this.enemyBulletHit,
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

    this.score = 0;
    this.scene.launch("PlayUI", { score: this.score });
  }

  update(time, delta) {
    this.player.update(time, delta);

    this.background.setFrame(this.backgroundAnim.frame.name);
    this.background.tilePositionX += 3;
  }

  createBackground() {
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
  }

  enemyHit(enemy, bullet) {
    bullet.hit();
    enemy.disableBody(true, true);
    this.score += 10;
    eventsCenter.emit("update-score", this.score);
  }

  enemyBulletHit(player, enemyBullet) {
    enemyBullet.hit();
    this.playerHit(player);
  }

  respawnEnemy() {
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
    eventsCenter.emit("update-score", this.score);
  }

  playerHit(player, enemy) {
    player.disableMe();
    this.scene.restart();
  }
}