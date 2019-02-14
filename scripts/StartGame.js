

Game.StartGame = function(game) {

};
var music;
//trigger for playing music
var musicPlay=true;
Game.StartGame.prototype = {
    preload:function() {
        this.add.image(0,0,'back');
    },
    create:function() {
        ///create start menu text
        bmptext = this.add.bitmapText(this.world.centerX,100,'desyrel','Feed the Monkey',64);
        bmptext.anchor.x=0.5;
        
        //create start game button
        start = this.add.sprite(this.world.centerX,this.world.centerY,'start');
        start.anchor.x=0.5;
        start.anchor.y=0.5;
        start.inputEnabled=true;
        start.input.useHandCursor=true;
        start.events.onInputUp.add(function() { this.state.start('Play');},this);

        //create music button
        musicButton=this.add.sprite(this.world.width-35,35,'musicButton');
	    musicButton.anchor.x=0.5;
	    musicButton.anchor.x=0.5;
	    musicButton.inputEnabled=true;
        musicButton.input.useHandCursor=true;
        musicButton.bringToTop();
        musicButton.events.onInputUp.add(function() {
		{
            if(musicPlay) {
                music.pause();
                musicPlay=false;
            }
            else {
                music.resume();
                musicPlay=true;
            }
		}
    },this);
        //add hint
        bmptext = this.add.bitmapText(20, this.world.height-80,'desyrel', 'ARROWS - CHANGE CANNON\'S ANGLE\nSPACEBAR - LOADING AND SHOT',24);
    }
}