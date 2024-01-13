import { MyScene } from "./MainScene.js";
var config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  scene: [MyScene],
  parent: "game-wrapper", //<div id="game-wrapper"></div>
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 0 },
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.NO_CENTER,
  },
  pixelArt: true,
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
  },
};

var game = new Phaser.Game(config);
