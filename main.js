// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas);

let chessBoard = [
    ['x','x','x','x','x','x'],
    ['x','x','x','x','x','x'],
    ['x','x','x','x','x','x'],
    ['x','x','x','x','x','x'],
    ['x','x','x','x','x','x'],
    ['x','x','x','x','x','x'],
    ['x','x','x','x','x','x'],
    ['x','x','x','x','x','x'],
];

// sound effect
var soundEfx;
var soundBonus = "sounds/bonus.wav";
soundEfx = document.getElementById("soundEfx");

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/catspritesheet.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/sushismol.png";

// Obstacle Image
var obsReady = false;
var obsImage = new Image();
obsImage.onload = function () {
    obsReady = true;
}
obsImage.src ="images/dogspritesheet1.png"

// border image
// border top-bottom
var btReady = false;
var btImage = new Image();
btImage.onload = function() {
    btReady = true;
};
btImage.src = "images/borderTB.png";

// border left-right
var blReady = false;
var blImage = new Image();
blImage.onload = function() {
    blReady = true;
};
blImage.src = "images/borderLR.png";

// Game objects
var hero = {
    speed: 256, // movement in pixels per second
    x: 0,  // where on the canvas are they?
    y: 0  // where on the canvas are they?
};
var monster = {
// for this version, the monster does not move, so just and x and y
//    speed: 100,
    x: 0,
    y: 0
};
// obstacle object
var obs = {
    x: 0,
    y: 0 
};
var monstersCaught = 0;
let died = false;

// === Animate the cat sprite ===
let rows = 8;
let cols = 4;

let trackRight = 1;
let trackLeft = 3;
let trackUp = 2;
let trackDown = 0;
 
let spriteWidth = 611;
let spriteHeight = 1216;
let width = spriteWidth / cols;
let height = spriteHeight / rows;

let curXFrame = 0;
let frameCount = 4;

let srcX = 0;
let srcY = 0;

let left = false;
let right = true;
let up = false;
let down = false;

// == Animate the dog sprite
let drows = 1;
let dcols = 5;
let track = 0;

let dogSpriteWidth = 491;
let dogSpriteHeight = 88;
let dogWidth = dogSpriteWidth / dcols;
let dogHeight = dogSpriteHeight / drows;
let curXFrameDog = 0;
let frameCountDog = 5;

let srcDogX = 0;
let srcDogY = 0;

let counter = 0;
let i = 0;

// === End of animated sprite ===

// Handle keyboard controls
var keysDown = {}; //object were we properties when keys go down
                // and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down.  In our game loop, we will move the hero image if when
// we go thru render, a key is down
addEventListener("keydown", function (e) {
    console.log(e.keyCode + " down")
    keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
    console.log(e.keyCode + " up")
    delete keysDown[e.keyCode];
}, false);

//=====================================================================

// Draw everything in the main render function
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (heroReady) {
        ctx.drawImage(heroImage, srcX, srcY, width, height, hero.x, hero.y, width, height);
    }
    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }
    // Dog
    if (obsReady) {
            ctx.drawImage(obsImage, srcDogX, srcDogY, dogWidth, dogHeight, obs.x, obs.y, dogWidth, dogHeight);
        }

    // Draw Border
    if (btReady) {
		ctx.drawImage(btImage, 0, 0);
		ctx.drawImage(btImage, 0, 800 - 39);
	}
	
	if (blReady) {
		ctx.drawImage(blImage, 0, 0);
		ctx.drawImage(blImage, 800-39, 0);
	}

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    if (monstersCaught === 5) {
        ctx.fillText("You are full.", 60, 60);
    }
    else{
        ctx.fillText("Food Collected: " + monstersCaught, 65, 65);
    }

    
}

// Update game objects
var update = function (modifier) {
    ctx.clearRect(hero.x, hero.y, width, height);
    left = false;
    right = false;
    up = false;
    down = false;

    // monster.y -= monster.speed * modifier;
    // monster.x -= monster.speed * modifier;

    if (38 in keysDown) { // Player holding up
        hero.y -= hero.speed * modifier;
        up = true;
        if (hero.y < 30) {
            hero.y = 30;
        }
    }
    
    if (40 in keysDown) { // Player holding down
        hero.y += hero.speed * modifier;
        down = true;
        if (hero.y > 660) {
            hero.y = 660;
        }
        
    }
    if (37 in keysDown) { // Player holding left
        hero.x -= hero.speed * modifier;
        left = true;
        if (hero.x < 30) {
            hero.x = 30;
        }
    }
    if (39 in keysDown) { // Player holding right
        hero.x += hero.speed * modifier;
        right = true;
        if (hero.x > 640) {
            hero.x = 640;
        }
    }
    // Are they touching?
    if (
        hero.x <= (monster.x + 75)
        && monster.x <= (hero.x + 75)
        && hero.y <= (monster.y + 60)
        && monster.y <= (hero.y + 60)
    ) {
        // play sound when touch
        soundEfx.src = "sounds/eat.wav"
        soundEfx.play();
        ++monstersCaught;       // keep track of our “score”
        reset();       // start a new cycle
    }

    if (
        hero.x <= (obs.x + 75)
        && obs.x <= (hero.x + 75)
        && hero.y <= (obs.y + 60)
        && obs.y <= (hero.y + 60)
    ) {
        soundEfx.src = "soundGameOver.wav";
        soundEfx.play();
        gameOver()
    }

    // update dog sprite index
    ctx.clearRect(obs.x, obs.y, dogWidth, dogHeight);

    //curXFrameDog = ++curXFrameDog % frameCountDog;
    if (i == 20) {
        curXFrameDog = ++curXFrameDog % frameCountDog;
        i = 0;
    }   else {
        i++;
    }
    srcDogX = curXFrameDog * dogWidth;
    srcDogY = track * dogHeight;

    // updating cat sprite index
    // curXFrame = ++ curXFrame % frameCount;
    if (counter == 20) {
        curXFrame = ++curXFrame % frameCount;
        counter = 0;
    }   else {
        counter++;
    }

    // calculate x coordinate for spritesheet
    srcX = curXFrame * width;
    if (left) {
        srcY = trackLeft * height;
    }

    if (right) {
        srcY = trackRight * height;
    }

    if (up) {
        srcY = trackUp * height;
    }

    if (down) {
        srcY = trackDown * height;
    }
};

let gameOver = function() {
    alert("Dog stole your food :( Game over.")
    died = true;
    reset();
}

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;

    if (monstersCaught < 5 && died == false) {
        //  Request to do this again ASAP
        requestAnimationFrame(main);
    }
};

// Reset the game when the player catches a monster
var reset = function () {
    if (died == true) {
        soundEfx.src = "soundGameOver.wav";
        soundEfx.play();
    }
    else {
        placeItem(hero);
        placeItem(monster);
        placeItem(obs);
    
        if (monstersCaught === 5) {
            alert("You are full!");
            soundEfx.src = soundBonus;
            soundEfx.play();
        }
    }
};

let placeItem = function (character) {
    let X = 5;
    let Y = 6;
    let success = false;
    while (!success) {
        X = Math.floor(Math.random() * 6);
        Y = Math.floor(Math.random() * 8);
        if (chessBoard[X][Y] === 'x' ) {
            success = true;
        }
    }

    chessBoard[X][Y] = 'O';
    character.x = (X * 100) + 40;
    character.y = (Y * 100) + 40;
}

// Let's play this game!
var then = Date.now();
reset();
main();  // call the main game loop.