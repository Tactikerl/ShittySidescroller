import Phaser from "../../lib/phaser.js";
import { flashingTween, bounceTween } from "../../utils/tweens.js";

export class BasicEnemy extends Phaser.Physics.Arcade.Sprite {
  died = false;
  speed = 200;
  health = 1;

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.enemyTexture = texture;
    this.setFlipX(true);

    this.dieSound = scene.sound.get("explosionSfx");
    this.particles = scene.add.particles(5, 0, "enemyStar", {
      speed: 100,
      scale: { start: 1, end: 0 },
      lifespan: 500,
      quantity: 1,
      //gravityX: 600,
      //radial: false,
      blendMode: "ADD",
      follow: this,
      angle: { max: 45, min: -45 },
      emitting: false,
    });

    this.hurtEmitter = scene.add.particles(0, 0, "star", {
      speed: 100,
      frame: 0,
      scale: { start: 1, end: 0 },
      lifespan: 2000,
      alpha: { start: 1, end: 0 },
      quantity: 10,
      blendMode: "ADD",
      emitting: false,
    });
  }

  spawn(x, y) {
    this.setPosition(x, y);

    this.enableBody(true, x, y, true, true);
    this.setCircle(16);
    this.setVelocityX(-this.speed);
    this.particles.start();
    this.health = 1;
  }

  hurt() {
    this.health--;
    this.hurtEmitter.emitParticleAt(this.x, this.y);

    this.hurtTween1 && this.hurtTween1.isActive() && this.hurtTween1.remove();
    this.postFX.clear();
    if (this.hurtTween2 && this.hurtTween2.isActive()) {
      this.hurtTween2.remove();
      this.scaleX = 1;
      this.scaleY = 1;
      this.angle = 0;
    }

    if (this.health <= 0) {
      this.die();
      return true;
    } else {
      this.hurtTween1 = this.scene.tweens.add(flashingTween(this, 100, 0));
      this.hurtTween2 = this.scene.tweens.add(bounceTween(this, 100));
      return false;
    }
  }

  die() {
    this.disableBody(false, false);
    this.play("explosionAnim");
    this.dieSound.play();
    this.setVelocity(0);
    this.particles.stop();
    this.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      function () {
        this.setTexture(this.enemyTexture);
        this.setFrame(0);
        this.disableBody(true, true);
      },
      this
    );
    return true;
  }

  getKillScore() {
    return 10;
  }

  onImpact() {}

  update(time, delta) {
    if (!this.body.enable) {
      return;
    }

    if (this.x < -16) {
      this.disableBody(true, true);
      this.particles.stop();
    }
  }
}
