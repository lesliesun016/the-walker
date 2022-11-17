class End extends Phaser.Scene {
  constructor() {
    super({ key: "End" });
    this.title = null;
    this.drum = null;
  }
  preload() {
    this.load.audio("drum", "./sounds/drum.wav");
  }
  create() {
    this.drum = this.sound.add("drum").play();
    this.cameras.main.setBackgroundColor(0x000000);
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.title = this.add
      .text(screenCenterX, screenCenterY, "The Walker", {
        fill: "#fff",
        fontSize: "25px",
        align: "center",
      })
      .setOrigin(0.5);
  }
}

export default End;
