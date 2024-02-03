import Phaser from "../../lib/phaser.js";
import { BasicEnemy } from "./basicEnemy.js";

export class LustyEnemy extends BasicEnemy {
  constructor(scene) {
    super(scene, 0, 0, "lustyEnemy", 0);

    this.speed = 210;
  }

  spawn(x, y, target) {
    super.spawn(x, y);

    this.myBeloved = target;
  }

  onImpact() {
    this.die();
  }

  update(time, delta) {
    if (this.died) {
      return;
    }

    const myBelovedAngle = Phaser.Math.Angle.BetweenPoints(
      this,
      this.myBeloved
    );
    this.body.velocity.setAngle(myBelovedAngle);

    var deg = Phaser.Math.RadToDeg(myBelovedAngle);

    this.setFrame(0);
    if (this.body.velocity.y < -50) {
      this.setFrame(5);
    }
    if (this.body.velocity.y > 50) {
      this.setFrame(3);
    }

    if ((deg > 0 && deg < 90) || (deg < 0 && deg > -90)) {
      this.setFlipX(false);
    } else {
      this.setFlipX(true);
    }

    if (this.x < -16) {
      this.disableBody(true, true);
    }
  }
}
