import Phaser from "./lib/phaser.js";
import { Boot } from "./scenes/Boot.js";
import { Title } from "./scenes/Title.js";
import { Play } from "./scenes/Play.js";
import { PlayUI } from "./scenes/PlayUI.js";
import { Preloader } from "./scenes/Preloader.js";

var config = {
  type: Phaser.AUTO,
  width: 720,
  height: 400,
  scene: [Boot, Preloader, Title, Play, PlayUI],
  backgroundColor: 0x000010,
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

  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
  },
};

var game = new Phaser.Game(config);
