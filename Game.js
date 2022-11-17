class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
    this.background = null;
    this.taintedCave = null;

    this.walker = null;
    this.walkCave = null;
    this.enterButton = null;
    this.enteredCave = false;

    this.rt = null;
    this.trail = null;
    this.tween = null;
    this.diffY = 85;

    this.walkSound = null;
  }

  preload() {
    this.load.image("background", "./images/platform.png");
    this.load.spritesheet("walker", "./images/spritesheetall.png", {
      frameWidth: 200,
      frameHeight: 200,
    });
    this.load.image("trail", "./images/trail.png");

    this.load.image("taintedCave", "./images/taintedcave.png");

    this.load.audio("walkSound", "./sounds/walk.wav");
  }

  fadeInGame() {
    this.cameras.main.fadeIn(3000);
    this.cameras.main.setBackgroundColor(0xd2dae5);

    this.background = this.add.image(960, 240, "background");
    this.taintedCave = this.add
      .image(1350, 260, "taintedCave")
      .setVisible(false);

    this.walkSound = this.sound.add("walkSound");

    this.walker = this.physics.add.sprite(50, 240, "walker");
    this.walkCave = this.physics.add
      .sprite(1300, 240, "walker")
      .setVisible(false);

    // trail
    this.rt = this.add.renderTexture(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight
    );
    this.trail = this.add
      .image(this.walker.x, this.walker.y + this.diffY, "trail")
      .setVisible(false);
    this.tween = this.tweens.add({
      targets: this.trail,
      x: this.walker.x,
      y: this.walker.y,
      ease: "Sine.easeInOut",
      duration: 1000,
      repeat: -1,
    });

    // enter button
    this.enterButton = this.add.text(1300, 90, "enter", {
      fill: "#fff",
      fontSize: "25px",
    });
    this.enterButton
      .setInteractive()
      .on("pointerdown", () => {
        this.walker.visible = false;
        this.walkCave.visible = true;
        this.enterButton.visible = false;
        this.cameras.main.startFollow(this.walkCave).setOrigin(0.5);
        this.walkCave.anims.play("cave", false);
      })
      .on("pointerover", () => {
        this.enterButton.setStyle({ fill: "#000" });
      })
      .on("pointerout", () => {
        this.enterButton.setStyle({ fill: "#fff" });
      });

    // walker animation
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("walker", { start: 7, end: 12 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("walker", { start: 5, end: 0 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "walker", frame: 6 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "cave",
      frames: this.anims.generateFrameNumbers("walker", { start: 13, end: 15 }),
      frameRate: 2,
    });

    this.cameras.main.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight
    );
    this.cameras.main.startFollow(this.walker).setOrigin(0.5);
  }

  create() {
    this.time.addEvent({
      delay: 1000,
      callback: this.fadeInGame,
      callbackScope: this,
      loop: false,
    });
  }

  drawTrail() {
    const dist = Phaser.Math.Distance.Between(
      this.trail.x,
      this.trail.y,
      this.walker.x,
      this.walker.y
    );

    this.tween.timeScale = dist / 100;
    this.tween.updateTo("x", this.walker.x, true);
    this.tween.updateTo(
      "y",
      this.walker.y + this.diffY + Phaser.Math.Between(-2, 10),
      true
    );

    this.trail.setAlpha(100 / (dist + 0.001));
    if (Phaser.Math.Between(0, 1) < 0.5) this.rt.draw(this.trail);
  }

  playWalkSound() {
    if (!this.walkSound.isPlaying) this.walkSound.play();
  }

  update() {
    if (this.walker != null && this.walker.visible) {
      const cursors = this.input.keyboard.createCursorKeys();
      if (cursors.left.isDown) {
        this.walker.setVelocityX(-160);
        this.walker.anims.play("left", true);

        this.drawTrail();
        this.playWalkSound();
      } else if (cursors.right.isDown) {
        this.walker.setVelocityX(160);
        this.walker.anims.play("right", true);

        this.drawTrail();
        this.playWalkSound();
      } else {
        this.walker.setVelocityX(0);
        this.walker.anims.play("turn");
      }
    }

    if (this.walkCave != null && this.walkCave.visible) {
      this.trail.visible = false;
      if (!this.walkCave.anims.isPlaying && !this.enteredCave) {
        this.enteredCave = true;
        this.cameras.main.fadeOut(3000);
        this.scene.switch("Cave");
      }
    }

    // switch from cave to game scene
    if (this.enteredCave) {
      this.cameras.main.fadeIn(3000);
      this.cameras.main.startFollow(this.walker).setOrigin(0.5);

      this.taintedCave.visible = true;
      this.walkCave.visible = false;
      this.walker.visible = true;
      this.trail.visible = true;
      this.enteredCave = false;
    }

    if (
      this.walker != null &&
      this.walker.x >= this.background.displayWidth &&
      this.taintedCave.visible
    ) {
      this.scene.start("Game");
    }
  }
}

export default Game;
