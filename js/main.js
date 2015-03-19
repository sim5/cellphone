window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render } );
    
    function preload() {

        game.load.image( 'world', 'assets/sky.png' );
 
	   game.load.spritesheet('dude', 'assets/sam.png', 32, 51);
	     game.load.spritesheet('owner', 'assets/sam.png', 32, 51);
        game.load.image( 'rocks', 'assets/rock.png');
	
      game.load.image( 'birdz', 'assets/bd.png');
	
	 
	game.load.image('grounds','assets/plat.png'); 
		
        game.load.audio( 'music', 'assets/chase.mp3');
        game.load.audio( 'birdzSound', 'assets/explode1.wav');
		 game.load.image('bullet', 'assets/cell.png');
		 game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
		 
		 game.load.audio('jump','assets/jump.mp3');
	
    }
    
var time;
    var world;
 
    var player;
    
	var hos;
 
    var carz;
    var carTimer = 2500;
    var nextCar = 0;
    var carCount = 0;
    var mincarTimer = 100;
	var jumpTimer = 0;
	
	
    

    var birdzs;
    var birdzTimer = 3000;
    var nextbirdz = 0;
	
	
    

    var lost;
    var style;
    var lives;
    var isAlive;
    

    var cursors;
    var fireButton;
    
 
    var music;
    var birdzfx;
    
	
	var fireButton;
var platforms;
var grounds;
var explosions;
    
	var bullet;
	var bullets;
var bulletTime = 0;
var firingTimer = 0;

var jump;


    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        jump = game.add.audio('jump');
        world = game.add.tileSprite(0, 0, 800, 600, 'world');
        player = game.add.sprite( 50, 528, 'dude');
        

        player.anchor.setTo( 0.5, 0.5 );
        
        
        game.physics.enable( player, Phaser.Physics.ARCADE );
      
        player.body.collideWorldBounds = true;
		player.body.bounce.y = 0.2;
		
    player.body.gravity.y  = 5000;
	
	player.animations.add('right', [24,25,26], 10, true);

    
         bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
	
	explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);
    
        carz = game.add.group();
        carz.enableBody = true;
        carz.physicsBodyType = Phaser.Physics.ARCADE;
        carz.createMultiple(50, 'rocks', 0, false);
        carz.setAll('anchor.x', 0.5);
        carz.setAll('anchor.y', 0.5);
        carz.setAll('outOfBoundsKill', true);
        carz.setAll('checkWorldBounds', true);
		
		
		
		 platforms = game.add.group();
    platforms.enableBody = true;
		

        
     

        birdzs = game.add.group();
        birdzs.enableBody = true;
        birdzs.physicsBodyType = Phaser.Physics.ARCADE;
        birdzs.createMultiple(30, 'birdz', 0, false);
        birdzs.setAll('anchor.x', 0.5);
        birdzs.setAll('anchor.y', 0.5);
        birdzs.setAll('outOfBoundsKill', true);
        birdzs.setAll('checkWorldBounds', true);
		
		
     
        
    
        cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        

        music = game.add.audio('music', 1, true);
        music.play('', 0, 1, true);
        birdzfx = game.add.audio('birdzSound');
        
     
        isAlive = true;
        lives = 5;
        
        style = { font: "65px Arial", fill: "#ff0044", align: "center" };
		
		    map(platforms);
			
			createowner();
    }
    
    function update() {
       
        world.tilePosition.x -= 5;
		time= (50000-game.time.now)/1000;
		
		
      game.physics.arcade.collide(player, platforms);
        
        player.body.velocity.setTo(0, 0);
  player.animations.play('right');
        
		 if (cursors.up.isDown&&player.body.touching.down&& game.time.now > jumpTimer)
    {
	jump.volume = 0.5;
	jump.play();
        player.body.velocity.y = -6000;
        jumpTimer = game.time.now + 750;
    }
   if (fireButton.isDown)
        {
            fireBullet();
        }
		
		if(game.time.now>50000)
		{
	
		carz.removeAll();
		birdzs.removeAll();
		world.tilePosition.x+=5;
		if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

     
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

    }
		}
        
       
        createbirdz(); 

        
        createEnemy();

		
        
     
    
        game.physics.arcade.overlap(carz, player, rocksHandler, null, this);
        game.physics.arcade.overlap(birdzs, player, birdzHandler, null, this);
		 game.physics.arcade.overlap(player, hos, hosHandler, null, this);
		 
		   game.physics.arcade.overlap(bullets, birdzs, collisionHandler, null, this);
    }
    

    
    function createbirdz() {
        if (game.time.now > nextbirdz && birdzs.countDead() > 0)
        {
            nextbirdz = game.time.now + birdzTimer;

            var birdz = birdzs.getFirstExists(false);

            birdz.reset(800, 400);
			birdz.scale.setTo(.3,.3);

            birdz.body.velocity.x = -100;
        }
    }
	
	
	    
 
    
    function createEnemy() {
        if (carz.countDead() > 0&&game.time.now > nextCar )
        {
            if(carTimer > mincarTimer)
            {
                carCount += 1;
                if(carCount >= 5)
                {
                    carCount = 0;
                    carTimer -= 100;
                }
            }
            
            nextCar = game.time.now + carTimer;

            var enemy = carz.getFirstExists(false);

            enemy.reset(game.world.width,528);

            enemy.body.velocity.x = -250;
			
				enemy.scale.setTo(.2,.2);
        }
    }
	
	
    
	function createowner(){
	
	
	
			hos = game.add.sprite( game.world.width-50, 528, 'owner');
			
        

      

        
        
     
		
        
   
      
  
	
	hos.animations.add('move', [3,4,5], 10, true);
	
	  hos.animations.play('move');
			  
        game.physics.enable( hos, Phaser.Physics.ARCADE );
		
		      hos.anchor.setTo( 0.5, 0.5 );
	
	}
	
	function hosHandler(player, hos){
	
			

	 lost = game.add.text(game.world.centerX, game.world.centerY, "You have returned \n the lost cellphone!", style);
            lost.anchor.setTo( 0.5, 0.5);

			hos.animations.add('stop', [15], 10, true);
	
	  hos.animations.play('stop');
	  
	  player.animations.add('stopp', [25], 10, true);
	  
	  player.animations.play('stopp');
	 
			
	
	}
	


    
    function rocksHandler(player, enemy)
    {
        enemy.kill();
		 birdzfx.play();
        if(lives > 0)
            lives -= 1;
        
        if(lives <= 0)
        {
            player.kill();
            isAlive = false;
            lost = game.add.text(game.world.centerX, game.world.centerY, "GAME OVER!\n Press F5 to restart", style);
            lost.anchor.setTo( 0.5, 0.5);
        }
    }
	
	  
    
    function birdzHandler(player, birdz)
    {
        birdz.kill();
        birdzfx.play();
 
        
       if(lives > 0)
            lives -= 1;
        
        if(lives <= 0)
        {
            player.kill();
            isAlive = false;
            lost = game.add.text(game.world.centerX, game.world.centerY, "GAME OVER!\n Press F5 to restart", style);
            lost.anchor.setTo( 0.5, 0.5);
        }
    }
	

    
    function render() {    
        game.debug.text('Lives: ' + lives, 0, 50);
		game.debug.text('Time remaining to catch the phone owner: ' + time+' seconds', 0, 100);
    }
	
	function map(platforms) {



    var plat = platforms.create(0, 550, 'grounds');
    plat.body.immovable = true;
	plat.scale.setTo(5,5);
	


}

function collisionHandler (bullet, birdzs) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    birdzs.kill();

    //  Increase the score
   
    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(birdzs.body.x, birdzs.body.y);
    explosion.play('kaboom', 30, false, true);

  

}
function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.x += 200;
            bulletTime = game.time.now + 1000;
			bullet.scale.setTo(.03,.03);
        }
    }

}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function setupInvader (birdzs) {

    birdzs.anchor.x = 0.5;
    birdzs.anchor.y = 0.5;
    birdzs.animations.add('kaboom');

}

};
