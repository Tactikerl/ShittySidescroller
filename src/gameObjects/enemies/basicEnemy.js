import Phaser from "../../lib/phaser.js";
import eventsCenter from "../../EventsCenter.js";

export class BasicEnemy extends Phaser.Physics.Arcade.Sprite {
  died = false;
  speed = 200;

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
  }

  spawn(x, y) {
    this.setPosition(x, y);

    this.enableBody(true, x, y, true, true);
    this.setCircle(16);
    this.setVelocityX(-this.speed);
    this.particles.start();
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
