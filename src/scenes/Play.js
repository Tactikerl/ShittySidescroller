import Phaser from "../lib/phaser.js";
import { Player } from "../gameObjects/player.js";
import { Bullet } from "../gameObjects/bullet.js";
import { Enemy } from "../gameObjects/enemy.js";
import { ZigzagEnemy } from "../gameObjects/zigzagEnemy.js";
import { LustyEnemy } from "../gameObjects/lustyEnemy.js";
import { Collectible } from "../gameObjects/collectible.js";
import { EnemyBullet } from "../gameObjects/enemyBullet.js";
import eventsCenter from "../EventsCenter.js";

export class Play extends Phaser.Scene {
  constructor() {
    super({ key: "Play" });
  }

  create(data) {
    //Adding sprites, sounds, etc...
    this.createBackground();

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

    this.player = new Player(this, 100, this.scale.height / 2, this.bullets);

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
      (player, bullet) => !(player.isDashing || player.invisFrames),
      this
    );

    this.createEnemies();

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
    this.scene.launch("PlayUI", {
      score: this.score,
      startTime: data.startTime,
    });

    this.createControls();
  }

  update(time, delta) {
    this.player.update(time, delta, this.controls);

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

    this.backgroundAnim = this.add
      .sprite(0, 0, "background")
      .setVisible(false)
      .play("backgroundAnim");
  }

  createControls() {
    const stickSize = 70;
    const joyStick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: stickSize + 35,
      y: this.scale.height - stickSize - 25,
      radius: stickSize - 20,
      base: this.add.image(0, 0, "controlBase").setAlpha(0.3),
      thumb: this.add.image(0, 0, "controlThumb").setAlpha(0.3),
      dir: "8dir",
      forceMin: 0,
    });

    const keyboard = this.input.keyboard.createCursorKeys();
    const keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    const keyShift = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );

    const mobileButtons = { dButton: false, sButton: false };
    const dButton = this.add
      .image(this.scale.width - 64 / 2, this.scale.height - 64 * 1.5, "dButton")
      .setAlpha(0.5)
      .setInteractive()
      .on("pointerdown", () => (mobileButtons.dButton = true))
      .on("pointerup", () => (mobileButtons.dButton = false));

    const sButton = this.add
      .image(this.scale.width - 64 * 2, this.scale.height - 64 / 2, "sButton")
      .setAlpha(0.5)
      .setInteractive()
      .on("pointerdown", () => (mobileButtons.sButton = true))
      .on("pointerup", () => (mobileButtons.sButton = false));

    this.controls = {
      joyStick,
      mobileButtons,
      keyboard,
      keySpace,
      keyShift,
    };
  }

  createEnemies() {
    const enemyTypeList = [
      { type: Enemy, maxSize: 10 },
      { type: ZigzagEnemy, maxSize: 10 },
      { type: LustyEnemy, maxSize: 10 },
    ];
    this.enemyGroups = [];

    for (let index = 0; index < enemyTypeList.length; index++) {
      const enemyType = enemyTypeList[index];

      const enemies = this.physics.add.group({
        classType: enemyType.type,
        maxSize: enemyType.maxSize,
        runChildUpdate: true,
      });
      this.enemyGroups.push(enemies);

      this.physics.add.overlap(
        enemies,
        this.bullets,
        (enemy, bullet) => {
          if (enemy.died) {
            return;
          }
          bullet.hit();
          enemy.die();
          this.score += 10;
          eventsCenter.emit("update-score", this.score);
        },
        null,
        this
      );

      this.physics.add.overlap(
        this.player,
        enemies,
        (player, enemy) => {
          player.disableMe();

          if (player.health == 0) {
            this.restartGame();
          }
        },
        (player, enemy) => !(player.isDashing || player.invisFrames),
        this
      );
    }
  }

  enemyBulletHit(player, enemyBullet) {
    enemyBullet.hit();

    player.disableMe();

    if (player.health == 0) {
      this.restartGame();
    }
  }

  respawnEnemy() {
    var enemyPicker = Phaser.Math.Between(0, this.enemyGroups.length - 1);
    const enemy = this.enemyGroups[enemyPicker].get();

    if (enemy) {
      const x = this.scale.width + 20;
      const spawnPoints = [...Array(5).keys()].map(
        (x, i) => ((this.scale.height - 80) / 5) * (i + 1)
      );
      const y = Phaser.Utils.Array.GetRandom(spawnPoints);
      enemy.spawn(x, y, this.player);
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

  // This is the trash collection.
  restartGame() {
    eventsCenter.off("enemy-shoot");
    eventsCenter.off("update-score");
    this.scene.restart({ startTime: 0 });
  }
}
