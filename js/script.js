// Variables
var canvas = document.getElementById("myCanvas");
var backgroundCanvas = document.getElementById("bgCanvas");
var playerCanvas = document.getElementById("playerCanvas");
var pointsCanvas = document.getElementById("pointsCanvas");
var points = pointsCanvas.getContext("2d");
var player = playerCanvas.getContext("2d");
var bg = backgroundCanvas.getContext("2d");
var ctx = canvas.getContext("2d");
var rightPressed = false;
var leftPressed = false;
var topPressed = false;
var bottomPressed = false;
var spacePressed = false;

// Important! Cooldowns on shots are in the DRAW function!

// Boss data
var bossCondition = 20;
var bossHealth = 40;
var bossWidth = 45;
var bossHeight = 80;
var bossX = canvas.width / 2 - bossWidth / 2 - 10; // Get centered already, god damn it!
var bossY = - 200 - bossHeight;
var bossLaserXSpeed = 1;
var bossLaserYSpeed = 0.8;
var bossSpeed = 0.5;

// Player data
var playerWidth = 250;
var playerHeight = 85;
var nbrOfLifes = 4; 
var lifeWidth = 105;
var lifeHeight = 40;
var warningWidth = 280;
var warningHeight = 100;

// Background data
var bgHTimes = 3;
var bgWTimes = 3;
var bgWidth = 100;
var bgHeight = 75;

// Square data
var squareX = 100;
var squareY = 0;
var squareWidth = 50;
var squareHeight = 50;

// Xwing data
var xWingX = 120;
var xWingY = 100;
var xWingWidth = 35;
var xWingHeight = 22;
var nbrOfShots = 0;

// Tie Fighter data 
var tieX = 120;
var tieY = 0;
var tieWidth = 24;
var tieHeight = 24;
var tieLeftWidth = 28;
var tieLeftHeight = 28;
var tieRightWidth = 28;
var tieRightHeight = 28;

// Images
var xWing = new Image();
xWing.src = 'css/images/xwing.png'; 

var tie = new Image();
tie.src = 'css/images/tief.png'; 

var bgImg = new Image();
bgImg.src = 'css/images/bg.jpg';

var playerImg = new Image();
playerImg.src = 'css/images/pilot.png';

var playerLife = new Image();
playerLife.src = 'css/images/r2d2.png';

var warning = new Image();
warning.src = 'css/images/warning.png';

var tieLeft = new Image();
tieLeft.src = 'css/images/tief_left.png';

var tieRight = new Image();
tieRight.src = 'css/images/tief_right.png';

var boss = new Image();
boss.src = 'css/images/cruiser.png';

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

// Boss
function drawBoss() {
	if (bossHealth > 0) {
		ctx.drawImage(boss, bossX, bossY, bossWidth, bossHeight);
		if (bossY < 0) { // "Spawn"
			bossY += 1;
		}
	}
}

function moveBoss() {
	bossX += bossSpeed;
	if (bossX + bossWidth >= canvas.width) {
		bossSpeed = -bossSpeed;
	} else if (bossX <= 0) {
		bossSpeed = -bossSpeed;
	}
}

// Boss mid lasers
bossMidLasers = [];
var shotBossMidCD = 20;
function drawBossMidLaser() {
	var n = bossMidLasers.length;
	for (var i = 0; n > i; i++) {
		ctx.beginPath();
		ctx.rect(bossMidLasers[i][0], bossMidLasers[i][1], 1, 4);
		ctx.fillStyle = "rgb(86,206,82)";
		ctx.fill();
		ctx.closePath();
		if (bossMidLasers[i][1] >= canvas.height) {
			bossMidLasers.splice(i, 1);
		}
	}
	
}

function addBossMidLaser() {
	if (bossY >= 0 && shotBossMidCD >= 20) {
		var laserXOne = bossX;
		var laserYOne = bossY + bossHeight / 2 - 10;
		var laserXTwo = bossX + 10;
		var laserYTwo = bossY + bossHeight / 2;
		var laserXThree = bossX + bossWidth - 10;
		var laserYThree = bossY + bossHeight / 2;
		var laserXFour = bossX + bossWidth;
		var laserYFour = bossY + bossHeight / 2 - 10;
		var laserStatus = 1
		var bossLaserArrayOne = [laserXOne, laserYOne, laserStatus];
		var bossLaserArrayTwo = [laserXTwo, laserYTwo, laserStatus];
		var bossLaserArrayThree = [laserXThree, laserYThree, laserStatus];
		var bossLaserArrayFour = [laserXFour, laserYFour, laserStatus];
		bossMidLasers.push(bossLaserArrayOne);
		bossMidLasers.push(bossLaserArrayTwo);
		bossMidLasers.push(bossLaserArrayThree);
		bossMidLasers.push(bossLaserArrayFour);
		shotBossMidCD = 0;
	}
}

function moveBossMidLaser() {
	var n = bossMidLasers.length;
	for (var i = 0; n > i; i++) {
		bossMidLasers[i][1] += bossLaserYSpeed;
	}
}

// Boss left laser
bossLeftLasers = [];
var shotBossLeftCD = 20;
function drawBossLeftLaser() {
	var n = bossLeftLasers.length;
	for (var i = 0; n > i; i++) {
		ctx.beginPath();
		ctx.rect(bossLeftLasers[i][0], bossLeftLasers[i][1], 2, 2);
		ctx.fillStyle = "rgb(86,206,82)";
		ctx.fill();
		ctx.closePath();
		if (bossLeftLasers[i][1] >= canvas.height) {
			bossLeftLasers.splice(i, 1);
		}
	}
	
}

function addBossLeftLaser() {
	if (bossY >= 0 && shotBossLeftCD >= 20) {
		var laserXOne = bossX;
		var laserYOne = bossY + bossHeight / 2 - 10;
		var laserXTwo = bossX + 10;
		var laserYTwo = bossY + bossHeight / 2;
		var laserXThree = bossX + 20;
		var laserYThree = bossY + bossHeight / 2 - 20;
		var laserStatus = 1
		var bossLaserArrayOne = [laserXOne, laserYOne, laserStatus];
		var bossLaserArrayTwo = [laserXTwo, laserYTwo, laserStatus];
		var bossLaserArrayThree = [laserXThree, laserYThree, laserStatus];
		bossLeftLasers.push(bossLaserArrayOne);
		bossLeftLasers.push(bossLaserArrayTwo);
		bossLeftLasers.push(bossLaserArrayThree);
		shotBossLeftCD = 0;
	}
}

function moveBossLeftLaser() {
	var n = bossLeftLasers.length;
	for (var i = 0; n > i; i++) {
		bossLeftLasers[i][1] += bossLaserYSpeed;
		bossLeftLasers[i][0] -= bossLaserXSpeed;
	}
}

// Boss Right laser
bossRightLasers = [];
var shotBossRightCD = 20;
function drawBossRightLaser() {
	var n = bossRightLasers.length;
	for (var i = 0; n > i; i++) {
		ctx.beginPath();
		ctx.rect(bossRightLasers[i][0], bossRightLasers[i][1], 2, 2);
		ctx.fillStyle = "rgb(86,206,82)";
		ctx.fill();
		ctx.closePath();
		if (bossRightLasers[i][1] >= canvas.height) {
			bossRightLasers.splice(i, 1);
		}
	}
	
}

function addBossRightLaser() {
	if (bossY >= 0 && shotBossRightCD >= 20) {
		var laserXOne = bossX + bossWidth;
		var laserYOne = bossY + bossHeight / 2 - 10;
		var laserXTwo = bossX + bossWidth - 10;
		var laserYTwo = bossY + bossHeight / 2;
		var laserXThree = bossX + bossWidth - 20;
		var laserYThree = bossY + bossHeight / 2 - 20;
		var laserStatus = 1
		var bossLaserArrayOne = [laserXOne, laserYOne, laserStatus];
		var bossLaserArrayTwo = [laserXTwo, laserYTwo, laserStatus];
		var bossLaserArrayThree = [laserXThree, laserYThree, laserStatus];
		bossRightLasers.push(bossLaserArrayOne);
		bossRightLasers.push(bossLaserArrayTwo);
		bossRightLasers.push(bossLaserArrayThree);
		shotBossRightCD = 0;
	}
}

function moveBossRightLaser() {
	var n = bossRightLasers.length;
	for (var i = 0; n > i; i++) {
		bossRightLasers[i][1] += bossLaserYSpeed;
		bossRightLasers[i][0] += bossLaserXSpeed;
	}
}

// Player

function drawPlayer() {
	player.drawImage(playerImg, 20, 0, playerWidth, playerHeight);
}

function drawLife() {
	for (var i = 1; nbrOfLifes > i; i++) {
		player.drawImage(playerLife, lifeWidth * i - lifeWidth, playerHeight + 	10, lifeWidth, lifeHeight);
	}
	if (nbrOfLifes == 1) {
		player.drawImage(warning, 10, playerHeight - 20, warningWidth, warningHeight); // Why -20 you ask? Because of reasons (which i know nothing of)
	}
}
var pointsX = 0;
function drawPoints() {
	points.font = "25px Arial";
	points.fillStyle = "rgb(141,163,63)";
	points.fillText("Points: " + pointsX, 90, canvas.height - 10);
}

// Background
var bgArray = [];

function addBg() { 
	for (var i = 1; bgWTimes >= i; i++ ) {
		for (var j = 1; bgHTimes >= j; j++ ) {
			if (bgArray.length < bgHTimes * bgWTimes) {  // Remember that empty background? Yep, this line
				var test = [bgWidth * i - bgWidth, bgHeight * j - 2 * bgHeight];
				bgArray.push(test);
			}
		}
	}
}

function moveBg() {
	var n = bgArray.length;
	for (var i = 0; n > i; i++) {
		if (bossY < 0) { // Stop bg movement when boss arrives
			if (bgArray[i][1] < canvas.height) {
				bgArray[i][1] += 1;
			} else {
				bgArray[i][1] = -75;
			}
		}
	}
}

function drawBg() {
	var n = bgArray.length;
	for (var i = 0; n > i; i++) {
		bg.drawImage(bgImg, bgArray[i][0], bgArray[i][1], bgWidth, bgHeight);
	}
}

// Tie Fighter Functions.

// Left Squadron 
tieLeftSquadron = [];
function drawLeftTie() {
	var n = tieLeftSquadron.length;
	for (var i = 0; n > i; i++) {
		tieLeftSquadron[i][1] += 1;
		tieLeftSquadron[i][0] += 1;
		if (tieLeftSquadron[i][2] == 1) {
			ctx.drawImage(tieLeft, tieLeftSquadron[i][0], tieLeftSquadron[i][1], tieLeftWidth, tieLeftHeight);
		}
		if (tieLeftSquadron[i][1] >= canvas.height) {
			tieLeftSquadron.splice(i, 1);
		}
	}
}
function addLeftTie() {
	var n = canvas.width / 5;
	var tie = tieLeftSquadron.length; // Only 5 ties please!
	
	if (tie < 5 && pointsX < bossCondition) {
		for (var i = 1; 5 >= i; i++) {
			var t = [- tieLeftWidth * i * 2, - 100 - tieLeftHeight * i, 1, 1]; // Magical numbers to adjust it a bit | x, y, status, type
			tieLeftSquadron.push(t);
		}
	}
}

tieLeftLasers = [];
var shotLeftTCD = 40;
function addLeftTLaser() {
	var n = tieLeftSquadron.length;
	if (shotLeftTCD >= 40)
	for (var i = 0; n > i; i++) {
		if (tieLeftSquadron[i][2] == 1) {
			var tLaserX = tieLeftSquadron[i][0] + tieLeftWidth / 2;
			var tLaserY = tieLeftSquadron[i][1] + tieLeftHeight / 2;
			var tLaserStatus = 1;
			var tLaserArray = [tLaserX, tLaserY, tLaserStatus];
			tieLeftLasers.push(tLaserArray);
			shotLeftTCD = 0; // Shot reset
		}
	}
}

function moveLeftTLaser() {
	var n = tieLeftLasers.length;
	for (var i = 0; n > i; i++) {
		tieLeftLasers[i][1] += 2;
		tieLeftLasers[i][0] += 2;
	}
}

function drawLeftTLaser() {
	var n = tieLeftLasers.length;
	for (var i = 0; n > i; i++) {
		if (tieLeftLasers[i][1] < canvas.height) {
			ctx.beginPath();
			ctx.rect(tieLeftLasers[i][0], tieLeftLasers[i][1], 2, 2);
			ctx.fillStyle = "rgb(86,206,82)";
			ctx.fill();
			ctx.closePath();
		} else {
			tieLeftLasers.splice(i, 1);
		}
	}
}


// Middle Squadron
tieMidSquadron = [];
function drawMidTie() {
	var n = tieMidSquadron.length;
	for (var i = 0; n > i; i++) {
		tieMidSquadron[i][1] += 1; //Before drawing so you they actually end up being deleted
		if (tieMidSquadron[i][2] == 1) {
			ctx.drawImage(tie, tieMidSquadron[i][0], tieMidSquadron[i][1], tieWidth, tieHeight);
		}
		if (tieMidSquadron[i][1] >= canvas.height) {
			tieMidSquadron.splice(i, 1);
		}
	}
}
function addMidTie() {
	var n = canvas.width / 5;
	var tie = tieMidSquadron.length; // Only 5 ties please!
	
	if (tie < 5 && pointsX < bossCondition) {
		for (var i = 1; 5 >= i; i++) {
			var t = [n * i - tieWidth * 1.5, -tieHeight, 1, 2]; // 1.5 is to center it a bit, delete later on | x, y, status, type
			tieMidSquadron.push(t);
		}
	}
}

tieMidLasers = [];
var shotMidTCD = 40;
function addMidTLaser() {
	var n = tieMidSquadron.length;
	if (shotMidTCD >= 40)
	for (var i = 0; n > i; i++) {
		if (tieMidSquadron[i][2] == 1) {
			var tLaserX = tieMidSquadron[i][0] + tieWidth / 2;
			var tLaserY = tieMidSquadron[i][1] + tieHeight / 2;
			var tLaserStatus = 1;
			var tLaserArray = [tLaserX, tLaserY, tLaserStatus];
			tieMidLasers.push(tLaserArray);
			shotMidTCD = 0; // Shot reset
		}
	}
}

function moveMidTLaser() {
	var n = tieMidLasers.length;
	for (var i = 0; n > i; i++) {
		tieMidLasers[i][1] += 2;
	}
}

function drawMidTLaser() {
	var n = tieMidLasers.length;
	for (var i = 0; n > i; i++) {
		if (tieMidLasers[i][1] < canvas.height) {
			ctx.beginPath();
			ctx.rect(tieMidLasers[i][0], tieMidLasers[i][1], 1, 4);
			ctx.fillStyle = "rgb(86,206,82)";
			ctx.fill();
			ctx.closePath();
		} else {
			tieMidLasers.splice(i, 1);
		}
	}
}

// Right squadron functions
tieRightSquadron = [];
function drawRightTie() {
	var n = tieRightSquadron.length;
	for (var i = 0; n > i; i++) {
		tieRightSquadron[i][0] -= 1;
		tieRightSquadron[i][1] += 1; //Before drawing so you they actually end up being deleted
		if (tieRightSquadron[i][2] == 1) {
			ctx.drawImage(tieRight, tieRightSquadron[i][0], tieRightSquadron[i][1], tieRightWidth, tieRightHeight);
		}
		if (tieRightSquadron[i][1] >= canvas.height) {
			tieRightSquadron.splice(i, 1);
		}
	}
}
function addRightTie() {
	var n = canvas.width / 5;
	var tie = tieRightSquadron.length; // Only 5 ties please!
	
	if (tie < 5 && pointsX < bossCondition) {
		for (var i = 1; 5 >= i; i++) {
			var t = [canvas.width + tieRightWidth * i * 2, - 150 - tieRightHeight * i, 1, 3]; // Why is it diffrent than left one? No idea | x, y, status, type
			tieRightSquadron.push(t);
		}
	}	
}

tieRightLasers = [];
var shotRightTCD = 40;
function addRightTLaser() {
	var n = tieRightSquadron.length;
	if (shotRightTCD >= 40)
	for (var i = 0; n > i; i++) {
		if (tieRightSquadron[i][2] == 1) {
			var tLaserX = tieRightSquadron[i][0] + tieWidth / 2;
			var tLaserY = tieRightSquadron[i][1] + tieHeight / 2;
			var tLaserStatus = 1;
			var tLaserArray = [tLaserX, tLaserY, tLaserStatus];
			tieRightLasers.push(tLaserArray);
			shotRightTCD = 0; // Shot reset
		}
	}
}

function moveRightTLaser() {
	var n = tieRightLasers.length;
	for (var i = 0; n > i; i++) {
		tieRightLasers[i][1] += 2;
		tieRightLasers[i][0] -= 2;
	}
}

function drawRightTLaser() {
	var n = tieRightLasers.length;
	for (var i = 0; n > i; i++) {
		if (tieRightLasers[i][1] < canvas.height) {
			ctx.beginPath();
			ctx.rect(tieRightLasers[i][0], tieRightLasers[i][1], 2, 2);
			ctx.fillStyle = "rgb(86,206,82)";
			ctx.fill();
			ctx.closePath();
		} else {
			tieRightLasers.splice(i, 1);
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
// XWing's lasers colision with mid ties
function laserMidCol() {
	var n = lasersXwing.length;
	var tie = tieMidSquadron.length;
	for (var i = 0; n > i; i++) { // Check each mid tie
		for (var j = 0; tie > j; j++) {
			if (lasersXwing[i][1] <= tieMidSquadron[j][1] + tieHeight && tieMidSquadron[j][2] == 1) {
				if (lasersXwing[i][0] < tieMidSquadron[j][0] + tieWidth && lasersXwing[i][0] + 2 > tieMidSquadron[j][0]) {
					tieMidSquadron[j][2] = 0;
					lasersXwing.splice(i, 1);
					pointsX += 1;
				}
			}
		}
	}
}
// Xwing's lasers colision with left ties
function laserLeftCol() {
	var n = lasersXwing.length;
	var tie = tieLeftSquadron.length;
	for (var i = 0; n > i; i++) { // Check each mid tie
		for (var j = 0; tie > j; j++) {
			if (lasersXwing[i][1] <= tieLeftSquadron[j][1] + tieHeight && tieLeftSquadron[j][2] == 1) {
				if (lasersXwing[i][0] < tieLeftSquadron[j][0] + tieWidth && lasersXwing[i][0] + 2 > tieLeftSquadron[j][0]) {
					tieLeftSquadron[j][2] = 0;
					lasersXwing.splice(i, 1);
					pointsX += 1;
				}
			}
		}
	}
}

// XWing's lasers colision with right ties
function laserRightCol() {
	var n = lasersXwing.length;
	var tie = tieRightSquadron.length;
	for (var i = 0; n > i; i++) { // Check each right tie
		for (var j = 0; tie > j; j++) {
			if (lasersXwing[i][1] <= tieRightSquadron[j][1] + tieHeight && tieRightSquadron[j][2] == 1) {
				if (lasersXwing[i][0] < tieRightSquadron[j][0] + tieWidth && lasersXwing[i][0] + 2 > tieRightSquadron[j][0]) {
					tieRightSquadron[j][2] = 0;
					lasersXwing.splice(i, 1);
					pointsX += 1;
				}
			}
		}
	}
}

// XWing's laser collision with boss
function laserBossCol() {
	var n = lasersXwing.length;
	for (var i = 0; n > i; i++) {
		if (lasersXwing[i][1] <= bossY + bossHeight) {
			if (lasersXwing[i][0] >= bossX && lasersXwing[i][0] <= bossX + bossWidth) {
				lasersXwing.splice(i, 1);
				bossHealth -= 1;
				if (bossHealth <= 0) {
					alert("You saved galaxy from The Evil Empire!")
				}
			}
		}
	}
}

// Collision with middle boss lasers 
function bossMidLaserCol() {
	var n = bossMidLasers.length;
	for (var i = 0; n > i; i++) {
		if (bossMidLasers[i][1] >= xWingY && bossMidLasers[i][1] <= xWingY + xWingHeight) {
			if (bossMidLasers[i][0] > xWingX && bossMidLasers[i][0] < xWingX + xWingWidth) {
				if (nbrOfLifes > 1) {
					bossMidLasers.splice(i, 1);
					nbrOfLifes -= 1;
				} else {
					alert("You lose.");
					document.location.reload();
				}
			}
		}
	}
}

// Collision with left boss lasers 
function bossLeftLaserCol() {
	var n = bossLeftLasers.length;
	for (var i = 0; n > i; i++) {
		if (bossLeftLasers[i][1] >= xWingY && bossLeftLasers[i][1] <= xWingY + xWingHeight) {
			if (bossLeftLasers[i][0] > xWingX && bossLeftLasers[i][0] < xWingX + xWingWidth) {
				if (nbrOfLifes > 1) {
					bossLeftLasers.splice(i, 1);
					nbrOfLifes -= 1;
				} else {
					alert("You lose.");
					document.location.reload();
				}
			}
		}
	}
}

// Collision with right boss lasers
function bossRightLaserCol() {
	var n = bossRightLasers.length;
	for (var i = 0; n > i; i++) {
		if (bossRightLasers[i][1] >= xWingY && bossRightLasers[i][1] <= xWingY + xWingHeight) {
			if (bossRightLasers[i][0] > xWingX && bossRightLasers[i][0] < xWingX + xWingWidth) {
				if (nbrOfLifes > 1) {
					bossRightLasers.splice(i, 1);
					nbrOfLifes -= 1;
				} else {
					alert("You lose.");
					document.location.reload();
				}
			}
		}
	}
}
// Colision with middle tie lasers
function tMidLaserCol() {
	var n = tieMidLasers.length;
	for (var i = 0; n > i; i++) {
		if (tieMidLasers[i][1] >= xWingY && tieMidLasers[i][1] <= xWingY + xWingHeight) {
			if (tieMidLasers[i][0] > xWingX && tieMidLasers[i][0] < xWingX + xWingWidth) {
				if (nbrOfLifes > 1) {
					tieMidLasers.splice(i, 1);
					nbrOfLifes -= 1;
				} else {
					alert("You lose.");
					document.location.reload();
				}
			}
		}
	}
}

// Colision with left tie lasers
function tLeftLaserCol() {
	var n = tieLeftLasers.length;
	for (var i = 0; n > i; i++) {
		if (tieLeftLasers[i][1] >= xWingY && tieLeftLasers[i][1] <= xWingY + xWingHeight) {
			if (tieLeftLasers[i][0] > xWingX && tieLeftLasers[i][0] < xWingX + xWingWidth) {
				if (nbrOfLifes > 1) {
					tieLeftLasers.splice(i, 1);
					nbrOfLifes -= 1;
				} else {
					alert("You lose.");
					document.location.reload();
				}
			}
		}
	}
}

// Colision with right tie lasers
function tRightLaserCol() {
	var n = tieRightLasers.length;
	for (var i = 0; n > i; i++) {
		if (tieRightLasers[i][1] >= xWingY && tieRightLasers[i][1] <= xWingY + xWingHeight) {
			if (tieRightLasers[i][0] > xWingX && tieRightLasers[i][0] < xWingX + xWingWidth) {
				if (nbrOfLifes > 1) {
					tieRightLasers.splice(i, 1);
					nbrOfLifes -= 1;
				} else {
					alert("You lose.");
					document.location.reload();
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

// Collision with boss
function xWingBossCol() {
	if (xWingY <= bossY + bossHeight && xWingY + xWingHeight >= bossY) {
		if (xWingX < bossX + bossWidth && xWingX + xWingWidth > bossX) {
			alert("You crashed into the Empire Cruiser!");
			document.location.reload();
		}
	}
}
// Colision with ties
function xWingMidCol() {
	var tie = tieMidSquadron.length;
	for (var i = 0; tie > i; i++) {
		if (xWingY <= tieMidSquadron[i][1] + tieHeight && xWingY + xWingHeight >= tieMidSquadron[i][1] && tieMidSquadron[i][2] == 1) {
			if (xWingX < tieMidSquadron[i][0] + tieWidth && xWingX + xWingWidth > tieMidSquadron[i][0]) {
				alert("You crashed into the Tie Fighter!");
				document.location.reload();
			}
		}
	}
}

function xWingLeftCol() {
	var tie = tieLeftSquadron.length;
	for (var i = 0; tie > i; i++) {
		if (xWingY <= tieLeftSquadron[i][1] + tieHeight && xWingY + xWingHeight >= tieLeftSquadron[i][1] && tieLeftSquadron[i][2] == 1) {
			if (xWingX < tieLeftSquadron[i][0] + tieWidth && xWingX + xWingWidth > tieLeftSquadron[i][0]) {
				alert("You crashed into the Tie Fighter!");
				document.location.reload();
			}
		}
	}
}

function xWingRightCol() {
	var tie = tieRightSquadron.length;
	for (var i = 0; tie > i; i++) {
		if (xWingY <= tieRightSquadron[i][1] + tieHeight && xWingY + xWingHeight >= tieRightSquadron[i][1] && tieRightSquadron[i][2] == 1) {
			if (xWingX < tieRightSquadron[i][0] + tieWidth && xWingX + xWingWidth > tieRightSquadron[i][0]) {
				alert("You crashed into the Tie Fighter!");
				document.location.reload();
			}
		}
	}
}

// Draw
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	player.clearRect(0, 0, canvas.width, canvas.height);
	points.clearRect(0, 0, canvas.width, canvas.height);
	drawPlayer();
	drawLife();
	drawPoints();
	addBg();
	drawBg();
	moveBg();
// XWing colision with ties	and boss
	xWingMidCol();
	xWingLeftCol();
	xWingRightCol();
	xWingBossCol();
	drawXwing();
// Boss
	if (pointsX >= bossCondition) {
		drawBoss();
		if (bossY >= 0) {
			moveBoss();
		}
		laserBossCol();
		// Mid lasers
		drawBossMidLaser();
		addBossMidLaser();
		moveBossMidLaser();
		// Left lasers
		drawBossLeftLaser();
		addBossLeftLaser();
		moveBossLeftLaser();
		// Right lasers
		drawBossRightLaser();
		addBossRightLaser();
		moveBossRightLaser();
	}

// Left Tie functions 
	addLeftTie();
	drawLeftTie();
	addLeftTLaser();
	moveLeftTLaser();
	drawLeftTLaser();
// Mid Tie functions
	addMidTie();
	drawMidTie();
	addMidTLaser();
	moveMidTLaser();
	drawMidTLaser();
// Right Tie functions
	addRightTie();
	drawRightTie();
	addRightTLaser();
	moveRightTLaser();
	drawRightTLaser();
// XWing's colision with tie lasers
	tMidLaserCol();
	tLeftLaserCol();
	tRightLaserCol();
// XWing's collision with boss lasers
	bossRightLaserCol();
	bossMidLaserCol();
	bossLeftLaserCol();
	moveXwing();
	pressLaser();
	moveLaser();
	drawLaser();
// Destroy ties on XWing's laser colision
	laserMidCol();
	laserLeftCol();
	laserRightCol();
	shotCD += 2;	// Cooldown reset on XWing shots
	shotMidTCD += 0.5;	// Cooldown on tie shots
	shotLeftTCD += 0.4; // Cooldown on left tie shots
	shotRightTCD += 0.4; // Cooldown on right tie shots
	shotBossMidCD += 0.3; // Cooldown on middle boss shots
	shotBossLeftCD += 0.5; // Cooldown on left boss shots
	shotBossRightCD += 0.5;  // Cooldown on right boss shots
}

setInterval(draw, 15);