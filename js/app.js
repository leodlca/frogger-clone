/*    Sounds     */

var win = new Audio("sound/win.ogg");
win.volume = 0.3;

var hit = new Audio("sound/hit.ogg");
hit.volume = 0.3;

var background = new Audio("sound/background.ogg");
background.volume = 0.3;

var fail = new Audio("sound/fail.ogg");
fail.volume = 0.5;

var mute = false;

/*    Enemies Section    */

// Defines enemy's position (X,Y), its speed and sprite.      
var Enemy = function(y_pos, speed) {
    this.x = -100;
    this.y = y_pos;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // The speed is multiplied by the dt parameter so it will
    // ensure that the game runs at the same speed for all
    // computers.
    this.x += this.speed * dt;
    if (this.x > 550) {
        // Resets enemy's position if it goes out of the screen
        // by selecting a random number for its Y position and
        // speed.
        this.reset(enemy_y[Math.floor(Math.random() * 4)],
            enemy_speed[Math.floor(Math.random() * 3)]);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Resets enemy to its original position, called by this.update
Enemy.prototype.reset = function(y_pos, speed) {
    this.y = y_pos;
    this.x = -100;
    this.speed = speed;
};

/*    Player Section     */

// TODO: Move all of the game functionality to a new object Game.

// Defines player's position (X,Y), its win counter, life (HP) counter,
// record and sprite.
var Player = function() {
    this.p_dead = false; // Bool to know if the player has been hit by a bug (HP>0)
    this.pause = false; // Bool to know if the player has pressed pause
    this.p_dead_master = false; // Bool to know if the player has more than 0 HP
    this.y = 400;
    this.x = 200;
    this.win_count = 0;
    this.lives_count = 3;
    this.record = 0;
    this.sprite = 'images/char-boy.png';
};

// Updates player's position by first, checking if there's any enemy at
// its position, and secondly, checking if it has reached the water blocks
// so it calls the reset and win functions.
Player.prototype.update = function() {
    background.play(); 
    this.collision();
    if (this.y < 60) {
        setTimeout(3000);
        this.reset();
        win.play();
        this.win();
    }
};

// Resets player to its original position.
Player.prototype.reset = function() {
    this.y = 400;
    this.x = 200;

};


// Checks for collision with an enemy by looping through all the enemy's
// array, allEnemies. 
Player.prototype.collision = function() {
    allEnemies.forEach(function(enemy) {
        if (this.y === enemy.y) {
            if (enemy.x >= this.x - 50 && enemy.x <= this.x + 50) {
                // Checks if the player is at least 50 pixels to the left
                // or to the right, from the enemy.
                hit.play(); // Plays hit.ogg (audio)
                this.lose_life();
                this.reset();
            }
        }
    }.bind(this));
};

// Renders player's sprite
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Moves the player according to the key the user presses.
// Acess Pause Menu when P is pressed and Mutes all sounds when M is pressed.
Player.prototype.handleInput = function(allowedKeys) {
    var move_x = 100;
    var move_y = 85;
    switch (allowedKeys) {
        case 'left':
            if (this.x < 100) break;
            this.x -= move_x;
            break;
        case 'right':
            this.pause = false;
            if (this.x > 300) break;
            this.x += move_x;
            break;
        case 'up':
            if (this.y < 20) break;
            this.y -= move_y;
            break;
        case 'down':
            if (this.y > 370) break;
            this.y += move_y;
            break;
        case 'mute':
            if (mute) {
                background.volume = 0.3;
                mute = false;
            } else {
                background.volume = 0;
                mute = true;
            }
            break;
        case 'pause':
            if (this.pause) {
                this.pause = false;
            } else {
                this.pause = true;
            }


    }
};

// It's called when the player reaches the water blocks,
// it adds 1 to the win counter.
Player.prototype.win = function() {
    this.win_count += 1;
    if (this.win_count > this.record) {
        // Checks if the current win count is bigger than
        // the record count, if it is, the record is replaced.
        this.record = this.win_count;
    }
};

// Subtracts one from the players lives.
Player.prototype.lose_life = function() {
    this.lives_count -= 1;
    if (this.lives_count <= 0) {
        // If the lives count reaches 0, it calls master reset.
        this.master_reset();
        return;
    }
    this.p_dead = true;
    setTimeout(function() {
        player.p_dead = false;
    }, 200);
};

// Resets player's position by calling reset, and set lives and 
// win count values to 3 and 0.
Player.prototype.master_reset = function() {
    this.lives_count = 3;
    this.win_count = 0;

    // Pauses everything for 1,5s and plays fail.ogg

    this.p_dead_master = true;
    background.pause();
    fail.play();
    setTimeout(function() {
        player.p_dead_master = false;
    }, 1500);
    this.reset();
};

/*     (Random) Arrays    */

// An array with 4 different possible pos Y values to spawn
// or respawn an enemy.
var enemy_y = [315, 230, 145, 60];

// An array with 3 different possible speed values to spawn
// or respawn an enemy.
var enemy_speed = [350, 500, 550];

/*    Calls enemies and player objects    */

var enemy_1 = new Enemy(enemy_y[Math.floor(Math.random() * 4)],
    enemy_speed[Math.floor(Math.random() * 3)]);

var enemy_2 = new Enemy(enemy_y[Math.floor(Math.random() * 4)],
    enemy_speed[Math.floor(Math.random() * 3)]);

var enemy_3 = new Enemy(enemy_y[Math.floor(Math.random() * 4)],
    enemy_speed[Math.floor(Math.random() * 3)]);

var enemy_4 = new Enemy(enemy_y[Math.floor(Math.random() * 4)],
    enemy_speed[Math.floor(Math.random() * 3)]);

var enemy_5 = new Enemy(enemy_y[Math.floor(Math.random() * 4)],
    enemy_speed[Math.floor(Math.random() * 3)]);


var allEnemies = [enemy_1, enemy_2, enemy_3, enemy_4, enemy_5];
var player = new Player();



// This listens for key presses and sends the keys to 
// Player.handleInput() method. It takes 8 different keys.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left', // Left arrow
        38: 'up', // Up arrow
        39: 'right', // Right arrow
        40: 'down', // Down arrow
        87: 'up', // W
        83: 'down', // S
        68: 'right', // A
        65: 'left', // D
        77: 'mute', // M
        80: 'pause' // P

    };

    player.handleInput(allowedKeys[e.keyCode]);
});