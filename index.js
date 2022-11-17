import Start from "./Start.js";
import Game from "./Game.js";
import Cave from "./Cave.js";
import End from "./End.js";

const config = {
  type: Phaser.AUTO,
  scale: {
    width: 960,
    height: 540,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  backgroundColor: "#000",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [Game, Cave, End],
};

const game = new Phaser.Game(config);
