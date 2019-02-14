Game.EndGame = function(game) {

};
Game.EndGame.prototype = {
    preload:function() {
        this.add.image(0,0,'back');
    },
    create:function() {
	this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(function(){ this.state.start('Play');},this);    
         //create game over text and show highscore
        countDisplay = this.add.bitmapText(this.world.centerX, 80,'desyrel', "Game Over\nHighscore: "+localStorage.getItem("highscore"), 50);           
        countDisplay.anchor.x=0.5;
        countDisplay.anchor.x=0.5;
        //create retry button
        retry = this.add.sprite(countDisplay.x,countDisplay.y+200,'button');
        retry.anchor.x=0.5;
        retry.anchor.y=0.5;
        retry.width=150;
        retry.height=90;
        retry.inputEnabled=true;
        retry.input.useHandCursor=true;
        //add event if click on retry button
        retry.events.onInputUp.add(function(){
            this.state.start('Play');},this);
        //retry button text  
        retryText=this.add.bitmapText(retry.x+3,retry.y-10,'desyrel',"Retry",40);
        retryText.anchor.x=0.5;
        retryText.anchor.y=0.5;

        //create menu button
        menu = this.add.sprite(retry.x,retry.y+80,'button');
        menu.anchor.x=0.5;
        menu.anchor.y=0.5;
        menu.width=150;
        menu.height=90;
        menu.inputEnabled=true;
        menu.input.useHandCursor=true;
        //add event if click on menu button
        menu.events.onInputUp.add(function(){
            this.state.start('StartGame');},this);
        //menu button text  
        menuText=this.add.bitmapText(menu.x+3,menu.y-10,'desyrel',"Menu",40);
        menuText.anchor.x=0.5;
        menuText.anchor.y=0.5;

        //create music button
        musicButton=this.add.sprite(this.world.width-35,35,'musicButton');
	    musicButton.anchor.x=0.5;
	    musicButton.anchor.x=0.5;
	    musicButton.inputEnabled=true;
        musicButton.input.useHandCursor=true;
        musicButton.bringToTop();
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
    }
}
