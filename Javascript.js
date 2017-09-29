var myGamePiece;

window.addEventListener("keydown", keyTouch, false);
window.addEventListener("keyup", clearmove, false);

function startGame() {
    myGamePiece = new component(80, 80, "cat.jpg", 590, 565, "image");
    myGameArea.start();
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
	
	myGameArea.context.font = "bold 16px Arial";
	myGameArea.context.fillText("Game Piece X: " + myGamePiece.x, 10, 50); 
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
		case 32:
            // right key pressed
			fireBullet();
            break;  			
    }   
}

var customer = {
	name: "Tom Smith",
	talk: function(){ 
		return "My name is " + this.name;
		},
	talk2: function(){
		document.write("Talk 2" + this.name);
	}
}
	








