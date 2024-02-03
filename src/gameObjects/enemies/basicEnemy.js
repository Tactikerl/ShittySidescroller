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
  }

  spawn(x, y) {
    this.died = false;
    this.setPosition(x, y);

    this.enableBody(true, x, y, true, true);
    this.setCircle(16);
    this.setVelocityX(-this.speed);
  }

  die() {
    if (this.died) {
      return;
    }

    this.died = true;
    this.play("explosionAnim");
    this.dieSound.play();
    this.setVelocity(0);
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

  onImpact() {}

  update(time, delta) {
    if (this.died) {
      return;
    }

    if (this.x < -16) {
      this.disableBody(true, true);
    }
  }
}
