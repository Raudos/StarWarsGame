// Variables
var canvas = document.getElementById("myCanvas");
var backgroundCanvas = document.getElementById("bgCanvas");
var bg = backgroundCanvas.getContext("2d");
var ctx = canvas.getContext("2d");
var rightPressed = false;
var leftPressed = false;
var topPressed = false;
var bottomPressed = false;
var spacePressed = false;

// Background data
var bgHTimes = 2;
var bgWTimes = 3;
var bgWidth = 100;
var bgHeight = 100;

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
var tieWidth = 25;
var tieHeight = 25;

// Images
var xWing = new Image();
xWing.src = 'css/images/xwing.png'; 

var tie = new Image();
tie.src = 'css/images/tief.png'; 

var bgImg = new Image();
bgImg.src = 'css/images/bg.jpg';


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

// Background
function drawBg() {
	var bgArray = [];
	for (var i = 1; bgWTimes >= i; i++ ) {
		for (var j = 1; bgHTimes >= j; j++ ) {
			bg.drawImage(bgImg, bgWidth * i - bgWidth, bgHeight * j - bgHeight, bgWidth, bgHeight);
			if (bgArray.length < i * j) {
				var test = [bgWidth * i - bgWidth, bgHeight * j - bgHeight]
				bgArray.push(test);
			}
		}
	}
}


// Tie Fighter Functions.
tieSquadron = [];
function drawTie() {
	var n = tieSquadron.length;
	for (var i = 0; n > i; i++) {
		if (tieSquadron[i][2] == 1) {

			ctx.drawImage(tie, tieSquadron[i][0], tieSquadron[i][1], tieWidth, tieHeight);
		}
	}
}
function addTie() {
	var n = canvas.width / 5;
	var tie = tieSquadron.length; // Only 5 ties please!
	
	if (tie < 5) {
		for (var i = 1; 5 >= i; i++) {
			var t = [n * i - tieWidth * 1.5, 0, 1]; // 1.5 is to center it a bit, delete later on
			tieSquadron.push(t);
		}
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
	var tie = tieSquadron.length;
	for (var i = 0; n > i; i++) { // Check each laser shot
		for (var j = 0; tie > j; j++) {
			if (lasersXwing[i][1] <= tieSquadron[j][1] + tieHeight) {
				if (lasersXwing[i][0] < tieSquadron[j][0] + tieWidth && lasersXwing[i][0] + 2 > tieSquadron[j][0]) {
					tieSquadron[j][2] = 0;
					lasersXwing.splice(i, 1);
				}
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
	var tie = tieSquadron.length;
	for (var i = 0; tie > i; i++) {
		if (xWingY <= tieSquadron[i][1] + tieHeight && tieSquadron[i][2] == 1) {
			if (xWingX < tieSquadron[i][0] + tieWidth && xWingX + xWingWidth > tieSquadron[i][0]) {
				alert("You crashed into the Tie Fighter!");
				document.location.reload();
			}
		}
	}
}

// Draw
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBg();
	xWingCol();
	drawXwing();
	addTie();
	drawTie();
	moveXwing();
	pressLaser();
	moveLaser();
	drawLaser();
	laserCol();
	shotCD += 1;	// Cooldown reset
}


setInterval(draw,10);