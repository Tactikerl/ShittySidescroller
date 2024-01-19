import Phaser from "./lib/phaser.js";
import { Boot } from "./scenes/Boot.js";
import { Play } from "./scenes/Play.js";
import { PlayUI } from "./scenes/PlayUI.js";

var config = {
  type: Phaser.AUTO,
  width: 720,
  height: 480,
  scene: [Boot, Play, PlayUI],
  parent: "game-wrapper",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
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
