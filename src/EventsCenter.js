import Phaser from "./lib/phaser.js";

const eventsCenter = new Phaser.Events.EventEmitter();

export default eventsCenter;

export const events = {
  enemyShoot: "enemy-shoot",
  healthPickup: "health-pickup",
  playTime: "play-time",
  updateScore: "update-score",
  playerDamage: "player-damage",
  playerDashing: "player-dashing",
};
