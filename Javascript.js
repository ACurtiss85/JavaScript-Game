

window.addEventListener("keydown", keyTouch, false);
window.addEventListener("keyup", clearmove, false);

var myGamePiece;
var lives = 3;
var level = 1;
var playerScore = 0;
var computerScore = 0;
//Just using this now for testing to display the computer's word
//var computerWord = "tester";
//var humanWord = "testing";

var collision = false;
var compWords = ["domain", "software", "website", "computer", "programs"];
var compWordsHit = [];
var humanWordsHit = [];
var humanWords = ["firewall", "ascii", "compile", "java", "router"];
var letters = ["a", "b", "c", "d", "e", "f", "g", "i", "j", "l", "m", "n", "o", "p", "r", "s", "t", "u", "w",];
var enemies = [];
////var enemyLetters =[]; //array of letters that are currently in play
var cWord; //computer word
var pWord; //player word
var pLetters = []; //array of letters that player has gotten
var cLetters = []; //array of letters that computer has gotten (dropped to bottom)
var blockAddTime = 0;
var blockSpeed = 100;
var cWordScore = 0;
var pWordScore = 0;
var gameOver = false;
var wordCount = 0;
var enemySpeed = 7;

/* I think the computer and the player should each have
3 - 5 predetermined words.  Maybe we could store them in an array.*/

function startGame() {
	update_scores();
	
    myGamePiece = new component(80, 80, "cat.jpg", 590, 565, "image");
    myGameArea.start();
	pickWords();
	for(i = 0; i < cWord.length; i++){
		cLetters[i] = cWord[i];
	}
	for(i = 0; i < pWord.length; i++){
		pLetters[i] = pWord[i];
	}
    pWord = humanWords[wordCount];
 //   compWordsHit.length = computerWord.length;
 //   humanWordsHit.length = humanWord.length;
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
    var randPos = Math.floor(Math.random()*19);
    var currLetter = letters[randPos];
    //if type is letter then we add it to the enemyLetters array
    if(type=="letter"){
////	enemyLetters.push(currLetter);
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
	    ctx.font = "24pt Arial";
	    ctx.fillStyle = "black";
	    ctx.fillText(currLetter, this.x + this.width/2, this.y +this.height/2);
            //ctx.strokeText(currLetter, 10, 10);
      this.compText = currLetter;
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
if(gameOver == false){   

    myGameArea.clear();
    myGamePiece.newPos();
    myGamePiece.update();
	
	if(lives < 0){
		gameOver();
	}
		
	
	
//	if(playerScore >= 3){
//	level++;
//	playerScore = 0;
//	}

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
	
	myGameArea.context.fillText ("pLetters: " + pLetters, 10, 290);
	myGameArea.context.fillText ("cLetters: " + cLetters, 10, 310);
////	myGameArea.context.fillText ("Enemy Letters: " + enemyLetters, 10, 340);
	
	myGameArea.context.fillText ("pWord: " + pWord, 10, 430);
	myGameArea.context.fillText ("cWord: " + cWord, 10, 460);
	myGameArea.context.fillText ("WordCount: " + wordCount, 10, 490);
	
}
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
////			enemyLetters.splice(i,1);
		}
		if(enemies[i].y > canvas.height){
			var l = enemies[i].compText;
			if(cLetters.includes(enemies[i].compText)){
					
			//console.log(document.getElementById("computerLetter" + i);
			while (cLetters.includes(enemies[i].compText)){
			var index = cLetters.indexOf(enemies[i].compText);
				if (index > -1 ){
					cLetters.splice(index, 1);			
				}
			}
			enemies.splice(i, 1);
////			enemyLetters.splice(i,1);
			redrawCompBoard(l);
			}
			//document.getElementById(id).style.property = new style
			
			
			
			if(cLetters.length <= 4){
				clearBoard();
					if(wordCount < (humanWords.length-1)){
					//	lives--;
						wordCount++;
					}
					else if (wordCount >= (humanWords.length-1)){
						level++;
					//	lives--;
						wordCount = 0;
					}
						
					pickWords();
						
				
					cLetters = [];
					pLetters = [];
					for(i = 0; i < cWord.length; i++){
						cLetters[i] = cWord[i];
					}
					for(i = 0; i < pWord.length; i++){
						pLetters[i] = pWord[i];
					}			
					drawWordBoard();			
			}
			
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
	testEnemy.speedY = enemySpeed;




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
			
			
			
			while (pLetters.includes(enemies[i].compText)){
			var index = pLetters.indexOf(enemies[i].compText);
				if (index > -1 ){
					pLetters.splice(index, 1);	
						playerScore++;
				}
			}
			
			
			var ll = enemies[i].compText;
			enemies.splice(i, 1);
			redrawPlayerBoard(ll)			
			
			if(pLetters.length <= 4){
				clearBoard();
					if(wordCount < (humanWords.length-1)){
						playerScore++;
						wordCount++;
					}
					else if (wordCount >= (humanWords.length-1)){
						playerScore++;
						level++;
						enemySpeed++;
						wordCount = 0;
					}
						
					pickWords();
						
				
					cLetters = [];
					pLetters = [];
					for(i = 0; i < cWord.length; i++){
						cLetters[i] = cWord[i];
					}
					for(i = 0; i < pWord.length; i++){
						pLetters[i] = pWord[i];
					}			
					drawWordBoard();			
			}
			
			
			
			
			
			
			
			
			
			
			
		}
	}
	}
}

/*
function checkWin() {

//var cWord; //computer word
//var pWord; //player word
//var pLetters = []; //array of letters that player has gotten
//var cLetters = [];

var pWordTemp[];
var cWordTemp[];
for (i = 0; i < pWord.length; i++) {
	pWordTemp.push(pWord.substr(i,1));
}

for (i = 0; i < cWord.length; i++) {
	cWordTemp.push(cWord.substr(i,1));
}

for(i = 0; i < pWord.length; i++){
	for(j = 0; j < pLetters.length; p++){
		if (pWordTemp[i] === pLetters[j]){
		pWordTemp.splice(i,1);
		}
	}
}

for(i = 0; i < cWord.length; i++){
	for(j = 0; j < cLetters.length; p++){
		if (cWordTemp[i] === cLetters[j]){
		cWordTemp.splice(i,1);
		}
	}
}

if (pWordTemp.length == 0){
	window.alert("Player Wins");
}

if (cWordTemp.length == 0) {
	window.alert("Computer Wins");
}


}

*/

function removeLetterHuman(enemy){

//  for(i = 0; i < 5; i++){
//    if(humanWord[i] == enemy.compText){
			//removeLetter = 'humanLetter' + i;
//			$("#humanLetter2").remove();
//	  }
//  }
	return false;
}

function checkLetterHuman(enemy){

 if(humanWord.includes(enemy.compText)){
   return true;
  }
  return false;
}

function checkLetterComputer(enemy){

 if(computerWord.includes(enemy.compText)){
   return true;
  }
  return false;
}



function drawWordBoard(){
	var elementC = document.getElementById("computerWord");
	var elementH = document.getElementById("humanWord");


	for(i = 0; i < cWord.length; i++){
		var letter = document.createElement("p");
		letter.id = "computerLetter" + i;
		letter.class = "letter";
		//console.log(letter.class);
		//letter.innerHTML = computerWord[i];
		letter.innerHTML = cWord[i];
		
		elementC.appendChild(letter);
		console.log("Worked   ");
				
	}

	for(i = 0; i < pWord.length; i++){
		var letter = document.createElement("p");
		letter.id = "humanLetter" + i;
		letter.class = "letter";
	//	console.log(letter.class);
		letter.innerHTML = pWord[i];
		elementH.appendChild(letter);
/*    if(humanWordsHit[i] == true){
      letter.color = green;
    }*/
	}
}

function clearBoard(){
	var element;
	var element2;
	for(i = 0; i < cWord.length; i++){
		element = document.getElementById("computerLetter" + i);
		element.parentNode.removeChild(element);				
	}
	
	for(j = 0; j < pWord.length; j++){
		element2 = document.getElementById("humanLetter" + j);
		element2.parentNode.removeChild(element2);
	}	
}

function pickWords(){
	cWord = compWords[wordCount];
	pWord = humanWords[wordCount];
}

function redrawCompBoard(l){
	//console.log(cWord[i].toString());
	for(i = 0; i < cWord.length; i++){
		//console.log(document.getElementById("computerLetter" + i).innerHTML);
		if(document.getElementById("computerLetter" + i).innerHTML == l)
		document.getElementById("computerLetter" + i).style.backgroundColor = "black";
	}	
}

function redrawPlayerBoard(ll){
	console.log(ll);
	for(i = 0; i < pWord.length; i++){
		
	if(document.getElementById("humanLetter" + i).innerHTML == ll)
		document.getElementById("humanLetter" + i).style.backgroundColor = "black";
	}	
}

function gameOver(){
	gameOver = true;
}
