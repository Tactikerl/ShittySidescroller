export class MyScene extends Phaser.Scene {
  constructor() {
    super({ key: "MyScene" });
  }

  preload() {
    //Assets to be loaded before create() is called
    this.load.image("player", "/assets/playerPlaceHolder.png");
  }

  create() {
    //Adding sprites, sounds, etc...
    this.add.text(0, 0, "Shitty SideScroller");
    this.player = this.physics.add.image(500, 300, "player");

    this.keyboard = this.input.keyboard.createCursorKeys();
  }

  update() {
    //Keep update on everytick
    //Game logic, collision, movement, etc...
    let isMovingX = false;
    let isMovingY = false;
    if (this.keyboard.left.isDown) {
      isMovingX = true;
      this.player.setVelocityX(-160);
    }
    if (this.keyboard.right.isDown) {
      isMovingX = true;
      this.player.setVelocityX(160);
    }
    if (this.keyboard.up.isDown) {
      isMovingY = true;
      this.player.setVelocityY(-160);
    }
    if (this.keyboard.down.isDown) {
      isMovingY = true;
      this.player.setVelocityY(160);
    }

    if (!isMovingX) {
      this.player.setVelocityX(0);
    }
    if (!isMovingY) {
      this.player.setVelocityY(0);
    }
  }
}
