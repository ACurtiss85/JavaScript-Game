

window.addEventListener("keydown", keyTouch, false);
window.addEventListener("keyup", clearmove, false);

var myGamePiece;
var lives = 3;
var playerScore = 0;
var computerScore = 0;
var collision = false;
var compWords = ["domain", "software", "website", "computer", "programmer"];
var humanWords = ["firewall", "database", "compile", "algorithm", "router"];
var cWord; //computer word
var pWord; //player word

/* I think the computer and the player should each have
3 - 5 predetermined words.  Maybe we could store them in an array.*/

function startGame() {
	
    myGamePiece = new component(80, 80, "cat.jpg", 590, 565, "image");
    myGameArea.start();
	testEnemy = new component(80, 80, "red", 500, 200);
    cWord = compWords[0];
    pWord = humanWords[0];
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
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        } else {
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
	testEnemy.newPos();
	testEnemy.update();
	
	 collision = testCollision();
	 if(collision == true){
		 ctx.clearRect(testEnemy.x, testEnemy.y, 80, 80);
		 console.log("collision!");
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
	myGameArea.context.fillText("Game Piece X: " + myGamePiece.x, 10, 50);
	myGameArea.context.fillText("Game Piece Y: " + myGamePiece.y, 10, 20);
	myGameArea.context.fillText ("Computer word: " + cWord, 10, 80);
	myGameArea.context.fillText ("Player word: " + pWord, 10, 110);	
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
	case 38:
            // up key pressed
	    fireBullet();
            break;  			
    }   
}

function addEnemy() 
{ 
   /* With multiple enemies on the screen we should look
   into the addChild functionality I think this will allow us to remove
   them as well.  Same goes for bullets.*/

/*are we thinking that enemies are the letters dropping? */
}

function testCollision(){
	if (typeof bullet != "undefined"){
		if(bullet.x < testEnemy.x + 80 && bullet.x+10 > testEnemy.x && bullet.y < testEnemy.y+80 && bullet.y+10 > testEnemy.y){
			return true;
		}
	}
}
	

	
	







