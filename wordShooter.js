

window.addEventListener("keydown", keyTouch, false);
window.addEventListener("keyup", clearmove, false);

var myGamePiece;
var lives = 5;
var level = 1;
var playerScore = 0;
var collision = false;
var compWords = ["domain", "software", "website", "computer", "programs"];
var humanWords = ["firewall", "ascii", "compile", "java", "router"];
var letters = ["a", "b", "c", "d", "e", "f", "g", "i", "j", "l", "m", "n", "o", "p", "r", "s", "t", "u", "v", "w",];
var enemies = [];
var cWord; //computer word
var pWord; //player word
var pLetters = []; //array of letters that player has gotten
var cLetters = []; //array of letters that computer has gotten (dropped to bottom)
var blockAddTime = 0;
var blockSpeed = 100;
var gameOver = false;
var wordCount = 0;
var enemySpeed = 7;
var m = document.getElementById("myMusic");
var pew = document.getElementById("pew");
var blast = document.getElementById("blast");
var soundFX = false;
var boxColor = "white";

function playAudio() {
    m.play();
}

function pauseAudio() {
    m.pause();
}

function toggleFX() {
	if(soundFX == true){
		soundFX = false;
		boxColor = "white";
	}
	else{
		soundFX = true;
		boxColor = "#39FF14";
	}
}

function startGame() {

  alert("Press left to move left and right to move right.  'F' key will fire bullets.  Letters in boxes will fall from the top of the canvas.  Its your job to shoot them.  Below the play area you will see two strings of letters.  The one on the right is the computers and the one on the left is yours.");
  alert("If you shoot a letter that is in your word it will black out below and you will score a point. If you black out an entire word you score another point and the words are replaced.  However, if a letter falls below the screen and it is also in the computers word you loose a life and a letter is blacked out for the computer.  If you make it through all 5 sets of words they reset and the speed increases.  Try to get the high score!!!");
  alert("Click When Ready To Play");
	//update_scores();
    myGamePiece = new component(80, 80, "cat.jpg", 590, 565, "image");
	fXBox = new component(25, 25, "#39FF14", 1200, 10, "box");
    myGameArea.start();
	pickWords();
	for(i = 0; i < cWord.length; i++){
		cLetters[i] = cWord[i];
	}
	for(i = 0; i < pWord.length; i++){
		pLetters[i] = pWord[i];
	}
    pWord = humanWords[wordCount];
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
    var randPos = Math.floor(Math.random()*20);
    var currLetter = letters[randPos];

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
			this.compText = currLetter;
        } else if(type == "box") {
			ctx.fillStyle = boxColor;
			ctx.fillRect(this.x, this.y, this.width, this.height);

		} else{
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
		fXBox.update();


		if(lives < 0){
			var score = playerScore;
			highscore(score)
			GameOver();
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
		myGameArea.context.font = "bold 20px Arial";
		myGameArea.context.fillText("Level: " + level, 10, 20);
		myGameArea.context.fillText ("Lives: " + lives, 10, 50);
		myGameArea.context.fillText("Player Score: " + playerScore, 10, 80);
		myGameArea.context.fillText ("SoundFX: ", 1100, 30);
		myGameArea.context.fillText ("Press 'F' To Fire ", 600, 20);
		myGameArea.context.fillText ("Left Arrow Goes left, Right Arrow Goes Right", 500, 50);
		//myGameArea.context.fillText("Game Piece X: " + myGamePiece.x, 10, 110);
		//myGameArea.context.fillText ("Computer word: " + cWord, 10, 140);
		//myGameArea.context.fillText ("Player word: " + pWord, 10, 170);
		//myGameArea.context.fillText ("pLetters: " + pLetters, 10, 290);
		//myGameArea.context.fillText ("cLetters: " + cLetters, 10, 310);
		//myGameArea.context.fillText ("WordCount: " + wordCount, 10, 490);
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
	if (soundFX == true){
		pew.play();
	}
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
			// f key pressed
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
		}

		if(enemies[i].y > canvas.height){
			var l = enemies[i].compText;
			if(cLetters.includes(l)){
				while (cLetters.includes(enemies[i].compText)){
				var index = cLetters.indexOf(enemies[i].compText);
					if (index > -1 ){
						cLetters.splice(index, 1);
						lives--;
					}
				}
				enemies.splice(i, 1);
				redrawCompBoard(l);
			}

			if(cLetters.length <= 0){
				clearBoard();
				if(wordCount < (humanWords.length-1)){
					wordCount++;
					enemies=[];
				}
				else if (wordCount >= (humanWords.length-1)){
					level++;
					enemies=[];
					wordCount = 0;
				}
				cLetters = [];
				pLetters = [];

				pickWords();

					for(z = 0; z < cWord.length; z++){
						cLetters[z] = cWord[z];
					}
					for(w = 0; w < pWord.length; w++){
						pLetters[w] = pWord[w];
					}
					drawWordBoard();
			}
		}
	}

	for(s = 0; s < enemies.length; s++){
		enemies[s].newPos();
		enemies[s].update();
	}
}

function addEnemy()
{
	canvas = document.getElementById('myCanvas');
	randomX = Math.floor((Math.random() * (canvas.width - 80)) +1);
	testEnemy = new component(80, 80, "red", randomX, 0, "letter");
	testEnemy.speedY = enemySpeed;
	return testEnemy;
}

function testCollision(){
	ii=0;
	if (typeof bullet != "undefined"){
		for(ii = 0; ii < enemies.length; ii++){
			if(bullet.x < enemies[ii].x + 80 && bullet.x+10 > enemies[ii].x && bullet.y < enemies[ii].y+80 && bullet.y+10 > enemies[ii].y){

				if(soundFX == true){
					blast.play();
				}
				enemies[ii].lifeVal = 0;

			var ll = enemies[ii].compText;

			//remove letter that was hit from pLetters array
			while (pLetters.includes(ll)){
			var index = pLetters.indexOf(ll);
				if (index > -1 ){
					pLetters.splice(index, 1);
						playerScore++;
						redrawPlayerBoard(ll);
				}
			}

			enemies.splice(ii, 1);

			if(pLetters.length <= 0){
				clearBoard();
					if(wordCount < (humanWords.length-1)){
						playerScore++;
						wordCount++;
						enemies=[];
					}
					else if (wordCount >= (humanWords.length-1)){
						playerScore++;
						level++;
						enemySpeed++;
						wordCount = 0;
						enemies=[];
					}
					cLetters = [];
					pLetters = [];
					alert("Get ready for the next word!");
					pickWords();

					for(g = 0; g < cWord.length; g++){
						cLetters[g] = cWord[g];
					}
					for(h = 0; h < pWord.length; h++){
						pLetters[h] = pWord[h];
					}
					drawWordBoard();
				}

			}
		}
	}
}



function drawWordBoard(){
	var elementC = null;
	var elementH = null;
	elementC = document.getElementById("computerWord");
	elementH = document.getElementById("humanWord");

	for(b = 0; b < cWord.length; b++){
		var letter = document.createElement("p");
		letter.id = "computerLetter" + b;
		letter.class = "letter";
		letter.innerHTML = cWord[b];
		elementC.appendChild(letter);
	}

	for(v = 0; v < pWord.length; v++){
		var letter = document.createElement("p");
		letter.id = "humanLetter" + v;
		letter.class = "letter";
		letter.innerHTML = pWord[v];
		elementH.appendChild(letter);
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
	for(a = 0; a < cWord.length; a++){
		if(document.getElementById("computerLetter" + a).innerHTML == l)
		document.getElementById("computerLetter" + a).style.backgroundColor = "black";
	}
}

function redrawPlayerBoard(ll){
	for(o = 0; o < pWord.length; o++){
		if(document.getElementById("humanLetter" + o).innerHTML == ll){
			document.getElementById("humanLetter" + o).style.backgroundColor = "black";
		}
	}
}

function GameOver(){

	myGameArea.context.fillStyle = "black";
	myGameArea.context.font = "bold 32px Arial";
	myGameArea.context.fillText("GAME OVER ", 550, 300);
	//myGameArea.clear();
   // myGamePiece.newPos();
    myGamePiece.update();
	gameOver = true;
	GameOver();
}
