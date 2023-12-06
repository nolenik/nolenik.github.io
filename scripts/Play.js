

Game.Play = function(game) {};

var forceBar;
var scoreDisplay;
var timeBar;
var cannon;
var banana;
var box;
var blocks = [];
var monkey;

Game.Play.prototype = {
 preload:function() {

	
	this.add.image(0,0,'back');
},



create: function() {

    
    //initialization of variables
	force = 300;
    minForce=300;
    maxForce=800;
	beginTime=10800;
    maxTime=2160000;
	leftTime=beginTime;
	score=0;
	deltaForce=10;
	maxHeight=100;

	//enable physic
    this.physics.startSystem(Phaser.Physics.P2JS);
	this.physics.p2.setImpactEvents(true);

     //create groups of collision
	monkeyCollisionGroup = this.physics.p2.createCollisionGroup();
	bananaCollisionGroup = this.physics.p2.createCollisionGroup();
	boxCollisionGroup = this.physics.p2.createCollisionGroup();
	
    //check bounds of collision's groups
	this.physics.p2.updateBoundsCollisionGroup();

	//initialization of physic
    this.physics.p2.gravity.y = 400;
	this.physics.p2.restitution = 0.4;
	
    //create a invisible sprite so that the pause text was always on top
	sprite = this.add.sprite(150,200,''); 
	sprite.anchor.x=0.5;
	sprite.anchor.y=0.5;
    
    //create pause text
	pauseText=this.add.bitmapText(0,0,'desyrel','',70);
    sprite.addChild(pauseText);

	//create pause button
	pauseButton=this.add.sprite(this.world.width-35,35,'pauseButton');
	pauseButton.anchor.x=0.5;
	pauseButton.anchor.x=0.5;
	pauseButton.inputEnabled=true;
	pauseButton.input.useHandCursor=true;
    pauseButton.events.onInputUp.add(function() {
		if(!this.game.paused)
		{
			this.game.paused=true;
			pauseText.text="Click to continue";
			sprite.bringToTop();
		}
	},this);
	
    //create music button
	musicButton=this.add.sprite(pauseButton.x,pauseButton.y+35,'musicButton');
	musicButton.anchor.x=0.5;
	musicButton.anchor.x=0.5;
	musicButton.inputEnabled=true;
	musicButton.input.useHandCursor=true;
    musicButton.events.onInputUp.add(function() {
        if(musicPlay) {
            music.pause();
            musicPlay=false;
        }
        else {
            music.resume();
            musicPlay=true;
        }
	},this); 

	//create display of score
    scoreDisplay = this.add.bitmapText(20,20, 'desyrel',"Score: "+ score,40 );
	
	//visualize time
	timeBar=this.add.sprite(this.world.centerX,40,'timeBar');
	timeBar.initialWidth=200;
	timeBar.anchor.x=0.5;
	timeBar.anchor.y=0.5;

	//add cannon
	cannon = this.add.sprite(75, 590, 'cannon');
	wheel = this.add.sprite(55,600,'wheel');
	wheel.anchor.y=1;
	cannon.anchor.y=1;
	
	//a bit of math's magic for determination coordinates of banana (part 1)
	diag=(cannon.width)/Math.cos(Math.atan(28/cannon.width));
	
	//create monkey and box
	this.createMonkey();
	this.createBox();
	
	//click on spacebar
	this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onUp.add(this.shoot,this);

	//click on pause
	this.input.onUp.add(function() {
		if(this.game.paused) {
		   this.game.paused=false;
		   pauseText.text='';
		}
	},this);
},

//create box
createBox:function() {
	randX=this.rnd.integerInRange(6,800/50-6);
	randY=this.rnd.integerInRange(5,600/50-5);
	box = this.add.sprite(50*randX,50*randY,'box');
	this.physics.p2.enable(box);
	box.body.data.gravityScale=0;
	box.body.static=true;
	box.body.setCollisionGroup(boxCollisionGroup);
	box.body.collides(bananaCollisionGroup);
},

//create banana
createBanana:function() {
	//a bit of math's magic for determination coordinates of banana (part 2)
	ang=(Math.atan(28/(cannon.width-10))*180/Math.PI-cannon.angle)*Math.PI/180;
	banana = this.add.sprite(cannon.x+diag*Math.cos(ang), cannon.y-diag*Math.sin(ang), 'banana');
	this.physics.p2.enable(banana);
	
	banana.anchor.x=0.5;
	banana.anchor.y=0.5;
	
	banana.body.fixedRotation = false;
	banana.body.angle=banana.angle=cannon.angle;
	banana.body.data.gravityScale=0;
	
	banana.body.setCollisionGroup(bananaCollisionGroup);
	banana.body.collides([monkeyCollisionGroup,boxCollisionGroup]);
	banana.body.onBeginContact.add(this.hit,this);
},

//create monkey and lianas
createMonkey:function() {
	var count = this.rnd.integerInRange(15,50);
	var x = this.rnd.integerInRange(600,750);
	for(var i=0; i<count;i++) {
		blocks[i]=this.add.sprite(x, 8*i,'liana');
		blocks[i].anchor.x=0.5;
	}
	monkey =this.add.sprite(x+5, 8*count+25,'monkey');
	monkey.anchor.x=0.5;
	this.physics.p2.enable(monkey);
	monkey.body.data.gravityScale=0;
	monkey.body.static=true;
	monkey.body.setCollisionGroup(monkeyCollisionGroup);
	monkey.body.collides(bananaCollisionGroup);
	drawed=true;
},

//visualize force
createForceBar:function() {
	forceBar=this.add.sprite(30,580,'forceBar');
	forceBar.anchor.x=0.5;
	forceBar.anchor.y=0;
},

//destroy monkey and lianas
monkeyDestroy:function() {
	monkey.destroy(true);
	for (var i=0; i<blocks.length;i++)
	    blocks[i].destroy(true);
},

//shot from cannon
shoot:function() {
	if(!this.game.paused) {
	    deltaForce=10; //this need if when you hit monkey and force decreased
	    if (forceBar)    //this strange "if" here because if destroy of sprite and end game at the same time then game crash 
	        forceBar.destroy(true);
	    forceBar=undefined;
	    if(!banana)
	        this.createBanana();
	    banana.body.data.gravityScale=1;
	    if (banana.body.velocity.y==0) {
		    //physic of body thrown at an angle to the horizon
	        banana.body.velocity.y=Math.sin(banana.angle*Math.PI/180)*force;
	        banana.body.velocity.x=Math.cos(banana.angle*Math.PI/180)*force;
	    }
	    force=minForce;
    }
},
// hit the monkey
hit:function(body, bodyB, shapeA, shapeB, equation) {
	if(!body) {
	    banana.destroy(true);
	    banana=undefined;
	}
	if(body) {
		if (body.sprite.key=="monkey") {
		box.destroy();
		this.createBox();
		if(banana)	
		    banana.destroy(true);
		banana=undefined;
		if (leftTime+1440*4<maxTime)	
			leftTime+=1440*4;
		else
		    leftTime+=maxTime-leftTime;
		this.monkeyDestroy();
		this.createMonkey();
		scoreDisplay.text="Score: "+(++score);
		}
	}
},
//if time is over
end:function() {
	if (localStorage.getItem("highscore")==undefined)
	    localStorage.setItem("highscore",0);
    if (localStorage.getItem("highscore")<score)
		localStorage.setItem("highscore",score);
	banana=undefined;
	forceBar=undefined;
	this.state.start('EndGame');
	this.input.onDown.removeAll();
	this.input.onUp.removeAll();
	this.input.keyboard.reset(true);
},
update:function() {
	//update timer
	timeBar.width=timeBar.initialWidth*leftTime/beginTime;
    //change angle of cannon
	if ((this.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.input.keyboard.isDown(Phaser.Keyboard.UP)) && cannon.angle!=-90) {
		cannon.angle -= 3;
	}
	if ((this.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) && cannon.angle!=0) {
        cannon.angle += 3;
	}
	//change force of shot
	if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && force<maxForce+1) {
		force+=deltaForce;
		if(force>=maxForce || force<=minForce)
			deltaForce*=-1;
		if(!forceBar) {
			this.createForceBar();
		}
		forceBar.height=-(maxHeight*(force-minForce)/(maxForce-minForce));
	}
	//check left time
	if (leftTime>0)
		leftTime-=24;
	if (leftTime<=0) 
	    this.end();
},
    render:function() {}
}
