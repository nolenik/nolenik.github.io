var Game = {};
Game.Preload=function(game){

};
Game.Preload.prototype = {
    preload:function() {
        this.load.image('start','assets/sprites/startButton.png');
        this.load.image('back','assets/sprites/back.png');
        this.load.bitmapFont('desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml');
        this.load.audio('sound', ['assets/audio/sound.mp3', 'assets/audio/sound.ogg']);
        this.load.image('musicButton','assets/sprites/musicButton.png');
        this.load.image('cannon', 'assets/sprites/cannon.png');
	    this.load.image('pauseButton', 'assets/sprites/pauseButton.png');
	    this.load.image('banana','assets/sprites/banana.png');
	    this.load.image('liana','assets/sprites/liana.png');
	    this.load.image('monkey', 'assets/sprites/monkey.png');
	    this.load.image('box','assets/sprites/box.png');
	    this.load.image('wheel','assets/sprites/wheel.png');
	    this.load.image('timeBar','assets/sprites/timeBar.png');
        this.load.image('forceBar','assets/sprites/forceBar.png');
        this.load.image('button', 'assets/sprites/retryButton.png');
    },
    create:function() {
        //play music 
        music = this.add.audio('sound');
        music.loopFull(0.6);
        this.state.start('StartGame');
    }
}