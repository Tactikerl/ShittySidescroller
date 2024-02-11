import Phaser from "./lib/phaser.js";
import { Boot } from "./scenes/Boot.js";
import { Preloader } from "./scenes/Preloader.js";
import { Title } from "./scenes/Title.js";
import { Play } from "./scenes/Play.js";
import { PlayUI } from "./scenes/PlayUI.js";
import { Scoreboard } from "./scenes/Scoreboard.js";
import { InputScore } from "./scenes/InputScore.js";
import { ScoreField } from "./scenes/ScoreField.js";

var config = {
  type: Phaser.AUTO,
  width: 720,
  height: 400,
  scene: [
    Boot,
    Preloader,
    Title,
    Play,
    PlayUI,
    Scoreboard,
    InputScore,
    ScoreField,
  ],
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
  input: { activePointers: 4 },
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
  },
};

var game = new Phaser.Game(config);
