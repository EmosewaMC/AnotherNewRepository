class Gameplay extends Phaser.Scene {
	constructor() {
		super("Gameplay");
	}

	preload() {
		this.load.image("rolypoly", "./rp.png");
        this.load.image("slug", './slug.png');
	}

	create() { 
        this.MAX_VELOCITY = -100;
        this.SLUG_VELOCITY = 100;
        this.restarting = false;
        
        
        this.rlyply = this.physics.add.sprite(100,600, "rolypoly").setScale(0.7);
        this.rlyply.flipX = true;
		this.rlyply.setMaxVelocity(200, 300);
        this.rlyply.setVelocityX(-this.MAX_VELOCITY);
        this.rlyply.setSize(310,200);
        
        this.slug = this.physics.add.sprite(1400, 880, "slug");
		this.slug.setScale(0.7);
		this.slug.setMaxVelocity(this.SLUG_VELOCITY, 0);
        this.slug.setSize(200,100);
		this.slug.setVelocityX(-this.SLUG_VELOCITY);
        this.slug.setImmovable(true);

        //ground rectangle
        this.ground = new Phaser.GameObjects.Rectangle(this, 700, 1000, 1400, 150, 0x0000ff);
        this.physics.add.existing(this.ground);
        this.ground.body.immovable = true;
        this.ground.body.allowGravity = false;

        //collision
        this.physics.add.overlap(this.rlyply, this.slug, this.handleCollision, null, this);
        this.physics.add.collider(this.rlyply, this.ground);
        this.physics.add.collider(this.slug, this.ground);

		this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

	update(time, delta) {
        if(this.rlyply.body.touching.down && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
			let vel = this.rlyply.body.velocity.y;
			vel -= 300;
            //console.log(vel);
			this.rlyply.setVelocityY(vel);
        }
        
        
		
        if(this.rlyply.x > 1400){
            this.displayTextAndReset("You Win");
        }
        if(this.rlyply.x < -30){
            this.displayTextAndReset("You Lose");
        }
	}

    handleCollision(player, object) {
        console.log("we in");
		if (player.body.touching.down) {
			player.body.setVelocityX(-100);
		} else {
            player.body.setVelocityX(100);
			
		}
    }

    displayTextAndReset(text){
        
        if(this.restarting != true){
            this.restarting = true;
            this.add.text(550,200,text).setFontSize("40pt");
            this.time.delayedCall(3000, ()=>{
            this.scene.restart();
            });
        }
    }
}


const game = new Phaser.Game({
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 1400,
		height: 1080
	}, 
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: {
				x: 0,
				y: 300
			}
		}
	},
	scene: [Gameplay],
	title: "Roly Poly: To the End",
});
