// Variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var rightPressed = false;
var leftPressed = false;
var topPressed = false;
var bottomPressed = false;
var spacePressed = false;

// Square data
var squareX = 100;
var squareY = 0;
var squareWidth = 50;
var squareHeight = 50;

// Xwing data
var xWingX = 120;
var xWingY = 100;
var xWingWidth = 35;
var xWingHeight = 35;
var nbrOfShots = 0;

// Tie Fighter data 
var tieX = 120;
var tieY = 0;
var tieWidth = 35;
var tieHeight = 35;

// Images
var xWing = new Image();
xWing.src = 'css/images/xwing.png'; 

var tie = new Image();
tie.src = 'css/images/tief.png'; 


// Event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Key handlers
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
	else if(e.keyCode == 38) {
		topPressed = true;
	}
	else if(e.keyCode == 40) {
		bottomPressed = true;
	}
	else if(e.keyCode == 32) {
		spacePressed = true;
	}
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
	else if(e.keyCode == 38) {
		topPressed = false;
	}
	else if(e.keyCode == 40) {
		bottomPressed = false;
	}
	else if(e.keyCode == 32) {
		spacePressed = false;
	}
}

// Tie Fighter Functions.
var tieStatus = 1;
function drawTie() {
	if (tieStatus == 1) {
		ctx.drawImage(tie, tieX, tieY, tieWidth, tieHeight);
	}
}




// X-Wing Functions.
function drawXwing() {
		ctx.drawImage(xWing, xWingX, xWingY, xWingWidth, xWingHeight);
}

var lasersXwing = []; //Empty array for laser objects

function pressLaser() {
	if (spacePressed) {
		addLaser();
	}
}

var shotCD = 20; //Cooldown to stop the addLaser function
function addLaser() {
	if (shotCD >= 20) {
		if (nbrOfShots%2 == 0) {
			var laserX = xWingX;
		} else {
			var laserX = xWingX + xWingWidth - 3;
		}
			var laserY = xWingY;
			var status = 1;
			var ugh = [laserX, laserY, status];
			lasersXwing.push(ugh);	
			nbrOfShots += 1; // Shooting from both sides
			shotCD = 0; // Reset on cooldown
	}
}

function moveLaser() {
	var n = lasersXwing.length;
	for (var i = 0; n > i; i++) {
		lasersXwing[i][1] -= 2;
	}
}

function drawLaser() {
	var n = lasersXwing.length;
	for (var i = 0; n > i; i++) {
		ctx.beginPath();
		ctx.rect(lasersXwing[i][0], lasersXwing[i][1], 2, 4);
		ctx.fillStyle = "red";
		ctx.fill();
		ctx.closePath();
		if (lasersXwing[i][1] < 0 || lasersXwing[i][2] == 0) {
			lasersXwing.splice(i, 1);
		}
	}
}
function laserCol() {
	var n = lasersXwing.length;
	for (var i = 0; n > i; i++) {
		if (lasersXwing[i][1] <= tieY + tieHeight) {
			if (lasersXwing[i][0] < tieX + tieWidth && lasersXwing[i][0] + 2 > tieX) {
				tieStatus = 0;
				lasersXwing.splice(i, 1);
			}
		}
	}
}

function moveXwing() {
	if(rightPressed && canvas.width - xWingWidth > xWingX) {
		xWingX += 3;
	}
	else if(leftPressed && xWingX > 0) {
		xWingX -= 3;
	}
	else if(topPressed && xWingY > 0) {
		xWingY -= 3;
	}
	else if(bottomPressed && canvas.height - xWingHeight > xWingY) {
		xWingY += 3;
	}
}

function xWingCol() {
	if (xWingY <= tieY + tieHeight) {
		if (xWingX < tieX + tieWidth && xWingX + xWingWidth > tieX) {
			alert("You lost!");
		}
	}
}

// Draw
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	xWingCol();
	drawXwing();
	drawTie(0);
	moveXwing();
	pressLaser();
	moveLaser();
	drawLaser();
	laserCol();
	shotCD += 1;	// Cooldown reset
}


setInterval(draw,10);