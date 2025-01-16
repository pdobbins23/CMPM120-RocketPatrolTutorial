class Play extends Phaser.Scene {
	constructor() {
		super("playScene");
	}

	create() {
		this.starfield = this.add
			.tileSprite(0, 0, 640, 480, "starfield")
			.setOrigin(0, 0);

		this.add
			.rectangle(
				0,
				borderUISize + borderPadding,
				game.config.width,
				borderUISize * 2,
				0x00ff00,
			)
			.setOrigin(0, 0);
		this.add
			.rectangle(0, 0, game.config.width, borderUISize, 0xffffff)
			.setOrigin(0, 0);
		this.add
			.rectangle(
				0,
				game.config.height - borderUISize,
				game.config.width,
				borderUISize,
				0xffffff,
			)
			.setOrigin(0, 0);
		this.add
			.rectangle(0, 0, borderUISize, game.config.height, 0xffffff)
			.setOrigin(0, 0);
		this.add
			.rectangle(
				game.config.width - borderUISize,
				0,
				borderUISize,
				game.config.height,
				0xffffff,
			)
			.setOrigin(0, 0);

		this.p1Rocket = new Rocket(
			this,
			game.config.width / 2,
			game.config.height - borderUISize - borderPadding,
			"rocket",
		).setOrigin(0.5, 0);

		this.ship01 = new Spaceship(
			this,
			game.config.width + borderUISize * 6,
			borderUISize * 4,
			"spaceship",
			0,
			30,
		).setOrigin(0, 0);
		this.ship02 = new Spaceship(
			this,
			game.config.width + borderUISize * 3,
			borderUISize * 5 + borderPadding * 2,
			"spaceship",
			0,
			20,
		).setOrigin(0, 0);
		this.ship03 = new Spaceship(
			this,
			game.config.width,
			borderUISize * 6 + borderPadding * 4,
			"spaceship",
			0,
			10,
		).setOrigin(0, 0);

		keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
		keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
		keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

		this.p1Score = 0;

		let scoreConfig = {
			fontFamily: "Courier",
			fontSize: "28px",
			backgroundColor: "#F3B141",
			color: "#843605",
			align: "right",
			padding: {
				top: 5,
				bottom: 5,
			},
			fixedWidth: 100,
		};

		this.scoreLeft = this.add.text(
			borderUISize + borderPadding,
			borderUISize + borderPadding * 2,
			this.p1Score,
			scoreConfig,
		);

		scoreConfig.fixedWidth = 0;

		this.gameOver = false;

		this.clock = this.time.delayedCall(
			game.settings.gameTimer,
			() => {
				this.gameOver = true;

				this.add
					.text(
						game.config.width / 2,
						game.config.height / 2,
						"GAME OVER",
						scoreConfig,
					)
					.setOrigin(0.5);
				this.add
					.text(
						game.config.width / 2,
						game.config.height / 2 + 64,
						"Press (R) to Restart",
						scoreConfig,
					)
					.setOrigin(0.5);
			},
			null,
			this,
		);
	}

	update() {
		this.starfield.tilePositionX -= 4;

		if (!this.gameOver) {
			this.p1Rocket.update();

			this.ship01.update();
			this.ship02.update();
			this.ship03.update();
		} else if (Phaser.Input.Keyboard.JustDown(keyRESET)) {
			this.scene.restart();
		}

		if (this.checkCollision(this.p1Rocket, this.ship01)) {
			this.p1Rocket.reset();
			this.shipExplode(this.ship01);
		}
		if (this.checkCollision(this.p1Rocket, this.ship02)) {
			this.p1Rocket.reset();
			this.shipExplode(this.ship02);
		}
		if (this.checkCollision(this.p1Rocket, this.ship03)) {
			this.p1Rocket.reset();
			this.shipExplode(this.ship03);
		}
	}

	checkCollision(rocket, ship) {
		return (
			rocket.x < ship.x + ship.width &&
			rocket.x + rocket.width > ship.x &&
			rocket.y < ship.y + ship.height &&
			rocket.height + rocket.y > ship.y
		);
	}

	shipExplode(ship) {
		ship.alpha = 0;

		let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);

		boom.anims.play("explode");
		boom.on("animationcomplete", () => {
			ship.reset();
			ship.alpha = 1;
			boom.destroy();
		});

		this.p1Score += ship.points;
		this.scoreLeft.text = this.p1Score;

		this.sound.play("ship-explosion");
	}
}
