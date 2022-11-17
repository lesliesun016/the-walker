class Cave extends Phaser.Scene {
  constructor() {
    super({ key: "Cave" });
    this.cave = null;
    this.caveWalker = null;
    this.drinkWalker = null;
    this.drinkButton = null;
    this.turnBlack = null;
    this.drunk = false;

    this.rt = null;
    this.trail = null;
    this.tween = null;
    this.diffX = -50;

    this.drinkSound = null;
    this.runSound = null;
  }
  preload() {
    this.load.image("cave", "./images/cave.png");
    this.load.image("trail", "./images/trailcave.png");
    this.load.spritesheet("turnBlack", "./images/turnBlackSpritesheet.png", {
      frameWidth: 960,
      frameHeight: 540,
    });
    this.load.spritesheet("caveWalker", "./images/cavespritesheetcopy.png", {
      frameWidth: 100,
      frameHeight: 100,
    });

    this.load.audio("drinkSound", "./sounds/drink.wav");
    this.load.audio("runSound", "./sounds/run.wav");
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000);
    this.cameras.main.fadeIn(3000);
    this.cave = this.add.image(480, 270, "cave");

    // sound
    this.drinkSound = this.sound.add("drinkSound");
    this.runSound = this.sound.add("runSound");

    // turn black animation
    this.turnBlack = this.add.sprite(480, 270, "turnBlack").setVisible(false);
    this.anims.create({
      key: "turnBlack",
      frames: this.anims.generateFrameNumbers("turnBlack", {
        start: 0,
        end: 2,
      }),
      frameRate: 1,
    });

    // walker animation
    this.caveWalker = this.physics.add.sprite(540, 50, "caveWalker");
    this.drinkWalker = this.physics.add
      .sprite(800, 400, "caveWalker")
      .setVisible(false);

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("caveWalker", {
        start: 0,
        end: 4,
      }),
      frameRate: 8,
    });

    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("caveWalker", {
        start: 4,
        end: 0,
      }),
      frameRate: 8,
    });

    this.anims.create({
      key: "pause",
      frames: [{ key: "caveWalker", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "drink",
      frames: this.anims.generateFrameNumbers("caveWalker", {
        start: 5,
        end: 7,
      }),
      frameRate: 4,
    });

    // drink button
    this.drinkButton = this.add
      .text(750, 380, "drink", {
        fill: "#fff",
        fontSize: "20px",
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.drinkButton.visible = false;
        this.caveWalker.visible = false;
        this.drinkWalker.visible = true;
        this.drinkWalker.anims.play("drink");

        this.drinkSound.play();
      })
      .on("pointerover", () => {
        this.drinkButton.setStyle({ fill: "#000" });
      })
      .on("pointerout", () => {
        this.drinkButton.setStyle({ fill: "#fff" });
      });

    //trail
    this.rt = this.add.renderTexture(
      0,
      0,
      this.cave.displayWidth,
      this.cave.displayHeight
    );
    this.trail = this.add
      .image(this.caveWalker.x + this.diffX, this.caveWalker.y, "trail")
      .setVisible(false);
    this.tween = this.tweens.add({
      targets: this.trail,
      x: this.caveWalker.x,
      y: this.caveWalker.y,
      ease: "Sine.easeInOut",
      duration: 1000,
      repeat: -1,
    });
  }

  drawTrail() {
    const dist = Phaser.Math.Distance.Between(
      this.trail.x,
      this.trail.y,
      this.caveWalker.x,
      this.caveWalker.y
    );

    this.tween.timeScale = dist / 100;
    this.tween.updateTo(
      "x",
      this.caveWalker.x + this.diffX + Phaser.Math.Between(-2, 10),
      true
    );
    this.tween.updateTo("y", this.caveWalker.y, true);

    this.trail.setAlpha(100 / (dist + 0.001));
    if (Phaser.Math.Between(0, 1) < 0.5) this.rt.draw(this.trail);
  }

  playRunSound() {
    if (!this.runSound.isPlaying) this.runSound.play();
  }

  update() {
    if (this.caveWalker != null && this.caveWalker.visible) {
      const cursors = this.input.keyboard.createCursorKeys();
      if (cursors.down.isDown) {
        this.caveWalker.setVelocityY(160);
        this.caveWalker.setVelocityX(60);
        this.caveWalker.anims.play("down", true);

        this.drawTrail();
        this.playRunSound();
      } else if (cursors.up.isDown) {
        this.caveWalker.setVelocityY(-160);
        this.caveWalker.setVelocityX(-60);
        this.caveWalker.anims.play("up", true);

        this.drawTrail();
        this.playRunSound();
      } else {
        this.caveWalker.setVelocityY(0);
        this.caveWalker.setVelocityX(0);
        this.caveWalker.anims.play("pause");
      }
    }

    if (
      this.drinkWalker != null &&
      this.drinkWalker.visible &&
      !this.drinkWalker.anims.isPlaying
    ) {
      if (!this.turnBlack.visible) {
        this.turnBlack.visible = true;
        this.turnBlack.anims.play("turnBlack", false);
      } else if (!this.turnBlack.anims.isPlaying) {
        this.scene.switch("Game");
      }
    }
  }
}

export default Cave;
