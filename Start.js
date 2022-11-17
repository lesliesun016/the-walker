class Start extends Phaser.Scene {
  constructor() {
    super({ key: "Video" });
    this.buttonPressed = false;
    this.vid = null;
    this.playVideoButton = null;
  }
  preload() {
    this.load.video("flipbook", "./video/the_walker.mp4");
  }
  create() {
    this.vid = this.add.video(500, 200, "flipbook");
    this.playVideoButton = this.add.text(480, 270, "play", {
      fill: "#fff",
      fontSize: "25px",
    });
    this.playVideoButton
      .setInteractive()
      .on("pointerdown", () => {
        this.vid.play(false);
        this.buttonPressed = true;
        this.playVideoButton.visible = false;
      })
      .on("pointerover", () => {
        this.playVideoButton.setStyle({ fill: "#000" });
      })
      .on("pointerout", () => {
        this.playVideoButton.setStyle({ fill: "#fff" });
      });
  }
  update() {
    if (this.buttonPressed && !this.vid.isPlaying()) {
      this.scene.start("Game");
    }
  }
}

export default Start;
