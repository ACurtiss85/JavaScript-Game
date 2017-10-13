

window.addEventListener("keydown", keyTouch, false);
window.addEventListener("keyup", clearmove, false);

var myGamePiece;
var lives = 5;
var level = 1;
var playerScore = 0;
var collision = false;
var compWords = ["domain", "software", "website", "computer", "programs"];
var humanWords = ["firewall", "ascii", "compile", "java", "router"];
var letters = ["a", "b", "c", "d", "e", "f", "g", "i", "j", "l", "m", "n", "o", "p", "r", "s", "t", "u", "w",];
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
	myGameArea.context.fillText ("Lives: " + lives, 10, 50);
	myGameArea.context.fillText("Player Score: " + playerScore, 10, 80);	
	myGameArea.context.fillText("Game Piece X: " + myGamePiece.x, 10, 110);
	myGameArea.context.fillText ("Computer word: " + cWord, 10, 140);
	myGameArea.context.fillText ("Player word: " + pWord, 10, 170);
	myGameArea.context.fillText ("Press 'F' To Fire ", 600, 20);
	myGameArea.context.fillText ("Left Arrow Goes left, Right Arrow Goes Right", 500, 50);	
	myGameArea.context.fillText ("pLetters: " + pLetters, 10, 290);
	myGameArea.context.fillText ("cLetters: " + cLetters, 10, 310);
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
			if(cLetters.includes(enemies[i].compText)){
					
			
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
					}
					else if (wordCount >= (humanWords.length-1)){
						level++;						
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
	testEnemy.speedY = enemySpeed;
  
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

function drawWordBoard(){
	var elementC = document.getElementById("computerWord");
	var elementH = document.getElementById("humanWord");


	for(i = 0; i < cWord.length; i++){
		var letter = document.createElement("p");
		letter.id = "computerLetter" + i;
		letter.class = "letter";
		
		letter.innerHTML = cWord[i];
		
		elementC.appendChild(letter);
		console.log("Worked   ");
				
	}

	for(i = 0; i < pWord.length; i++){
		var letter = document.createElement("p");
		letter.id = "humanLetter" + i;
		letter.class = "letter";
	
		letter.innerHTML = pWord[i];
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
	
	for(i = 0; i < cWord.length; i++){
		
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
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	myGameArea.context.fillStyle = "black";
	myGameArea.context.font = "bold 16px Arial";
	myGameArea.context.fillText("GAME OVER ", 500, 200);
	gameOver = true;
}
