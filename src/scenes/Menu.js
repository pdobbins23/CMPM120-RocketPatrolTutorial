class Menu extends Phaser.Scene {
	constructor() {
		super("menuScene");
	}

	preload() {
		// load images
		this.load.path = "./assets/img/";

		this.load.image([
			{ key: "rocket" },
			{ key: "spaceship" },
			{ key: "starfield" },
		]);

		this.load.spritesheet([
			{
				key: "explosion",
				frameConfig: {
					frameWidth: 64,
					frameHeight: 32,
					startFrame: 0,
					endFrame: 9,
				},
			},
		]);

		// load sfx
		this.load.path = "./assets/sfx/";

		this.load.audio("sfx-select", "sfx-select.wav");
		this.load.audio("sfx-explosion", "sfx-explosion.wav");
		this.load.audio("sfx-shot", "sfx-shot.wav");
	}

	create() {
		this.anims.create({
			key: "explode",
			frames: this.anims.generateFrameNumbers("explosion", {
				start: 0,
				end: 9,
				first: 0,
			}),
			frameRate: 30,
		});

		let menuConfig = {
			fontFamily: "Courier",
			fontSize: "28px",
			backgroundColor: "#F3B141",
			color: "#843605",
			align: "right",
			padding: {
				top: 5,
				bottom: 5,
			},
			fixedWidth: 0,
		};

		this.add
			.text(
				game.config.width / 2,
				game.config.height / 2 - borderUISize - borderPadding,
				"ROCKET PATROL",
				menuConfig,
			)
			.setOrigin(0.5);
		this.add
			.text(
				game.config.width / 2,
				game.config.height / 2,
				"Use <-> arrows to move & (F) to fire",
				menuConfig,
			)
			.setOrigin(0.5);

		menuConfig.backgroundColor = "#00FF00";
		menuConfig.color = "#000";

		this.add
			.text(
				game.config.width / 2,
				game.config.height / 2 + borderUISize + borderPadding,
				"Press <- for Novice or -> for Expert",
				menuConfig,
			)
			.setOrigin(0.5);

		keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
	}

	update() {
		if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
			game.settings = {
				spaceshipSpeed: 3,
				gameTimer: 60000,
			};

			this.sound.play("sfx-select");

			this.scene.start("playScene");
		}
		if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
			game.settings = {
				spaceshipSpeed: 4,
				gameTimer: 45000,
			};

			this.sound.play("sfx-select");

			this.scene.start("playScene");
		}
	}
}
