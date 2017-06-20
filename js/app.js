/*    Game json    */

var Game = {
    sounds: {

        // Every audio related to the game is declared here.

        win: new Audio("sound/win.ogg"),
        hit: new Audio("sound/hit.ogg"),
        fail: new Audio("sound/fail.ogg"),
        background: new Audio("sound/background.ogg"),

        // Mute is a boolean that tells if the game is currently muted.

        mute: false,

        setMute: function() {
        	Game.sounds.win.volume = 0;
            Game.sounds.hit.volume = 0;
            Game.sounds.fail.volume = 0;
            Game.sounds.background.pause();
        },

        // setVolume is called by init(), so it runs once, when the game starts or when
        // the game is unmuted.

        setVolume: function(){
            Game.sounds.win.volume = 0.4;
            Game.sounds.hit.volume = 0.2;
            Game.sounds.fail.volume = 0.3;
            Game.sounds.background.volume = 0.125;
            Game.sounds.background.play();
        }
    },

    // Pause is a boolean that tells if the game is currently paused.

    paused: false,

    // displayInfo() is called by main, so it's rendered continuously.

    displayInfo: function(){
        ctx.font = "33px Impact";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.strokeText("Wins: " + player.win_count, 5, 80); 
        ctx.fillText("Wins: " + player.win_count, 5, 80);
        ctx.strokeText("Record: " + player.record, 190, 80);
        ctx.fillText("Record: " + player.record, 190, 80);
        ctx.strokeText("HP: " + player.lives_count, 430, 80);
        ctx.fillText("HP: " + player.lives_count, 430, 80);
    }
};

/*    Enemies Section    */

// Enemy Class, Defines enemy's position (X,Y), its speed and sprite.    

var Enemy = class {
    constructor(y_pos, speed){
        this.x = -100;
        this.y = y_pos;
        this.speed = speed;
        this.sprite = "images/enemy-bug.png";
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    update(dt) {

        // The speed is multiplied by the dt parameter so it will
        // ensure that the game runs at the same speed for all
        // computers.

        this.x += this.speed * dt;
        if (this.x > 550) {

            // Resets enemy's position if it goes out of the screen
            // by selecting a random number for its Y position and
            // speed.

            this.reset(possible_y[Math.floor(Math.random() * 4)],
                enemy_speed[Math.floor(Math.random() * 3)]);
        }
    }

    reset(y_pos, speed) {
        this.y = y_pos;
        this.x = -100;
        this.speed = speed;
    }


}

/*    Star Class     */

var Star = class {
    constructor(x_pos, y_pos){
        this.x = x_pos;
        this.y = y_pos;
        this.sprite = 'images/Star.png';

        this.playerHasIt = false; // Let the game know if the user has picked up the star yet.
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    update() {
        if (player.x === this.x && player.y === this.y) {
            this.playerHasIt = true;
        }
    }

    reset() {
        star = new Star(possible_x[Math.floor(Math.random() * 4)],
        possible_y[Math.floor(Math.random() * 4)]);
    }
}

/*    Player Class     */

var Player = class {
    constructor() {
        this.dead = false;
        this.y = 400;
        this.x = 200;
        this.win_count = 0;
        this.lives_count = 3;
        this.record = 0;
        this.sprite = 'images/char-horn-girl.png';
    }
    
    update() {
        this.collision();

        // This condition is satisfied when player reaches the river (when the player wins).

        if (this.y < 60 && star.playerHasIt) {
            this.resetPosition();
            star.reset();
            Game.sounds.win.play();
            this.win();
        }
    }

    resetPosition() {
        this.y = 400;
        this.x = 200;
    }

    collision() {
        allEnemies.forEach(function(enemy) {
            if (this.y === enemy.y) {
                if (enemy.x >= this.x - 50 && enemy.x <= this.x + 50) {

                    // Checks if the player is at least 50 pixels to the left
                    // or to the right, from the enemy.
                    
                    Game.sounds.hit.play(); // Plays hit.ogg (audio)
                    this.loseLife();
                    this.resetPosition();
                }
            }
        }.bind(this))
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(allowedKeys) {
        var move_x = 100;
        var move_y = 85;
        switch (allowedKeys) {

            // Handles with player's movement keys

            case 'left':
                if (this.x < 100 || Game.paused || this.dead) break;
                this.x -= move_x;
                break;
            case 'right':
                if (this.x > 300 || Game.paused || this.dead) break;
                this.x += move_x;
                break;
            case 'up':
                // If the player haven't picked up the star yet, he won't be able to reach the river.
                if (this.y < 20 || Game.paused || this.dead || (this.y < 85 && !star.playerHasIt)) break;
                this.y -= move_y;
                break;
            case 'down':
                if (this.y > 370 || Game.paused || this.dead) break;
                this.y += move_y;
                break;

            // Handles with game functions such as mute and pause.

            case 'mute':
                if (Game.sounds.mute) {
                    Game.sounds.setVolume();
                    Game.sounds.mute = false;
                } else {
                    Game.sounds.setMute();
                    Game.sounds.mute = true;
                }
                break;
            case 'pause':
                if (Game.paused) {
                    Game.paused = false;
                } else {
                    Game.paused = true;
                }
                break;
            default:
                break;
        }
    }

    win() {
        this.win_count += 1;
        if (this.win_count > this.record) {

            // Checks if the current win count is bigger than
            // the record count, if it is, the record is replaced.

            this.record = this.win_count;
        }
    }

    loseLife() {
        this.lives_count -= 1;
        if (this.lives_count <= 0) {

            // If the lives count reaches 0, it calls master reset.

            this.masterReset();
            return;
        }

        // Pauses the game for 0,2s when the player dies.

        Game.paused = true;
        setTimeout(function() {
            Game.paused = false;
        }, 200);
    }

    masterReset() {
        this.lives_count = 3;
        this.win_count = 0;
        this.dead = true;

        // Pauses everything for 1,5s and plays fail.ogg

        Game.sounds.background.pause();
        Game.sounds.fail.play();
        setTimeout(function() {
            player.dead = false;
            if (!Game.sounds.mute){
                Game.sounds.background.play();
                star.reset();
                this.resetPosition();
            }
        }, 1500);
    }
}

/*     (Random) Arrays    */

// An array with 4 different possible pos Y values to spawn
// or respawn items/enemies.

var possible_y = [315, 230, 145, 60];

var possible_x = [0, 100, 200, 300, 400]

// An array with 3 different possible speed values to spawn
// or respawn an enemy.

var enemy_speed = [300, 450, 525];

/*    Calls enemies and player objects    */

var enemy_1 = new Enemy(possible_y[Math.floor(Math.random() * 4)],
    enemy_speed[Math.floor(Math.random() * 3)]);

var enemy_2 = new Enemy(possible_y[Math.floor(Math.random() * 4)],
    enemy_speed[Math.floor(Math.random() * 3)]);

var enemy_3 = new Enemy(possible_y[Math.floor(Math.random() * 4)],
    enemy_speed[Math.floor(Math.random() * 3)]);

var enemy_4 = new Enemy(possible_y[Math.floor(Math.random() * 4)],
    enemy_speed[Math.floor(Math.random() * 3)]);

var enemy_5 = new Enemy(possible_y[Math.floor(Math.random() * 4)],
    enemy_speed[Math.floor(Math.random() * 3)]);

var allEnemies = [enemy_1, enemy_2, enemy_3, enemy_4, enemy_5];
var player = new Player();
var star = new Star(possible_x[Math.floor(Math.random() * 4)], 
    possible_y[Math.floor(Math.random() * 4)]);

// This listens for key presses and sends the keys to 
// Player.handleInput() method. It takes 10 different keys.

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