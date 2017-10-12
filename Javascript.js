

window.addEventListener("keydown", keyTouch, false);
window.addEventListener("keyup", clearmove, false);

var myGamePiece;
var lives = 3;
var level = 1;
var playerScore = 0;
var computerScore = 0;
//Just using this now for testing to display the computer's word
var computerWord = "tester";
var humanWord = "testing";

var collision = false;
var compWords = ["domain", "software", "website", "computer", "programs"];
var humanWords = ["firewall", "database", "compile", "algorithm", "router"];
var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var enemies = [];
var enemyLetters =[]; //array of letters that are currently in play
var cWord; //computer word
var pWord; //player word
var pLetters = []; //array of letters that player has gotten
var cLetters = []; //array of letters that computer has gotten (dropped to bottom)
var blockAddTime = 0;
var blockSpeed = 100;

/* I think the computer and the player should each have
3 - 5 predetermined words.  Maybe we could store them in an array.*/

function startGame() {
	update_scores();
    myGamePiece = new component(80, 80, "cat.jpg", 590, 565, "image");
    myGameArea.start();
    cWord = compWords[0];
    pWord = humanWords[0];
		addEnemy();
		drawWordBoard();
}

var myGameArea = {
    canvas : document.getElementById('myCanvas'),
    start : function() {
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
	this.lifeVal = 1;
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }

    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    //random letter generation
    var randPos = Math.floor(Math.random()*26);
    var currLetter = letters[randPos];
    //if type is letter then we add it to the enemyLetters array 
    if(type=="letter"){
	enemyLetters.push(currLetter);
    }

    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else if(type == "letter") {
 	    
	    
            ctx.fillStyle = color;
            
            
	    ctx.fillRect(this.x, this.y, this.width, this.height);
	    ctx.font = "18pt Arial";
	    ctx.fillStyle = "black";
	    ctx.fillText(currLetter, this.x + this.width/2, this.y +this.height/2);
            //ctx.strokeText(currLetter, 10, 10);
        }
	else{
	    ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);

	}
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.newPos();
    myGamePiece.update();
	
	/*For now I just add one point to player score when you shoot a block and the level goes up when you get to 3 
	I think the easiest way to do the score would be to use the final level score after all lives are gone
	We could also do a points system if we want to make it a bit more complex.*/
	if(playerScore >= 3){
	level++;
	playerScore = 0;
	}
	
	updateEnemyArray();
	collision = testCollision();
	if(collision == true){
		ctx.clearRect(testEnemy.x, testEnemy.y, 80, 80);
		
	}


	if(typeof bullet != "undefined")
	{
		bullet.newPos();
		bullet.update();
	}
	if(myGamePiece.x < 4){
		myGamePiece.x = 4;
	}
	if(myGamePiece.x > 1210){
		myGamePiece.x = 1210;
	}

	myGameArea.context.fillStyle = "black";
	myGameArea.context.font = "bold 16px Arial";
	myGameArea.context.fillText("Level: " + level, 10, 20);
	myGameArea.context.fillText("Player Score: " + playerScore, 10, 50);
	myGameArea.context.fillText("Computer Score: " + computerScore, 10, 80);
	myGameArea.context.fillText("Game Piece X: " + myGamePiece.x, 10, 110);
	myGameArea.context.fillText ("Computer word: " + cWord, 10, 140);
	myGameArea.context.fillText ("Player word: " + pWord, 10, 170);
	myGameArea.context.fillText ("Press 'F' To Fire ", 600, 20);
	myGameArea.context.fillText ("Lives: " + lives, 10, 200);
	//for testing
	myGameArea.context.fillText("LetterArray: " + enemyLetters, 10, 230);
}

function moveleft() {
    myGamePiece.speedX = -10;
}

function moveright() {
	myGamePiece.speedX = 10;
}

function clearmove() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}

function fireBullet(){
	bullet = new component(10, 10, "red", (myGamePiece.x + 40), (myGamePiece.y + 40));
	bullet.speedY = -20;
}

function keyTouch(e) {
    switch(e.keyCode) {
        case 37:
            // left key pressed
			moveleft();
			break;
        case 39:
            // right key pressed
			moveright();
            break;
		case 70:
            // I had to change the fire key to 'f' so the screen wouldn't move around
			fireBullet();
            break;
    }
}

function updateEnemyArray(){
	//every 50 units of time, add a new enemy to the enemy array
	canvas = document.getElementById('myCanvas');
	if(blockAddTime%blockSpeed == 0){
		var dropBlock = addEnemy();
		enemies.push(dropBlock);
	}
	//Update time units for adding enemies
	blockAddTime +=1;

	//Remove any enemies whose position is out of bounds or liveVal is set to 0
	for(i = 0; i < enemies.length; i++){
		if(enemies[i].lifeVal == 0){
			enemies.splice(i, 1);
			enemyLetters.splice(i,1);
		}
		if(enemies[i].y > canvas.height){
			enemies.splice(i, 1);
			enemyLetters.splice(i,1);
		}
	}

	//Redraw all enemies in the enemy array
	for(i = 0; i < enemies.length; i++){
		enemies[i].newPos();
		enemies[i].update();
	}


}

function addEnemy()
{

	canvas = document.getElementById('myCanvas');
	randomX = Math.floor((Math.random() * (canvas.width - 80)) +1);
	testEnemy = new component(80, 80, "red", randomX, 0, "letter");
	//textEnemy.fillText(currLetter, 10, 10);
	testEnemy.speedY = 2;




   /* With multiple enemies on the screen we should look
   into the addChild functionality I think this will allow us to remove
   them as well.  Same goes for bullets.*/

/*are we thinking that enemies are the letters dropping? */

/*I implemented an enemies array and gave our componenets a
life value. This way, we can add enemies to the enemies array and then
pop them out of the array when their life value is 0. Then draw what's
in the array each iteration of the frame draw, which should only be enemies with
valid life value and location. This also allows for deleting objects after being
hit by a bullet*/

return testEnemy;
}

function testCollision(){
	if (typeof bullet != "undefined"){
		for(i = 0; i < enemies.length; i++){
		if(bullet.x < enemies[i].x + 80 && bullet.x+10 > enemies[i].x && bullet.y < enemies[i].y+80 && bullet.y+10 > enemies[i].y){
			enemies[i].lifeVal = 0;
			playerScore++;
		}
	}
	}
}

function drawWordBoard(){
	var elementC = document.getElementById("computerWord");
	var elementH = document.getElementById("humanWord");


	for(i = 0; i < computerWord.length; i++){
		var letter = document.createElement("p");
		letter.id = "computerLetter" + i;
		letter.class = "letter";
		console.log(letter.class);
		letter.innerHTML = computerWord[i];
		elementC.appendChild(letter);
	}

	for(i = 0; i < humanWord.length; i++){
		var letter = document.createElement("p");
		letter.id = "humanLetter" + i;
		letter.class = "letter";
		console.log(letter.class);
		letter.innerHTML = humanWord[i];
		elementH.appendChild(letter);
	}

}
