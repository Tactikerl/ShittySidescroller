import Phaser from "../lib/phaser.js";

export class Boot extends Phaser.Scene {
  constructor() {
    super({
      key: "Boot",
    });
  }

  preload() {
    this.load.spritesheet("loadingBar", "assets/loadingBar.png", {
      frameWidth: 9,
      frameHeight: 12,
    });
  }

  create() {
    this.scene.start("Preloader");
  }
}
