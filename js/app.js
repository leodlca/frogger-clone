// Enemies our player must avoid
var Enemy = function(y_pos, speed) {
    this.x = -100;
    this.y = y_pos;
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > 550){
        this.reset(enemy_y[Math.floor(Math.random() * 3)], 
                    enemy_speed[Math.floor(Math.random() * 3)]);
    }
    //NEED TO ADD COLISION
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function(y_pos, speed){
    this.y = y_pos;
    this.x = -100;
    this.speed = speed;
}   

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(){
    this.y = 400;
    this.x = 200;
    this.win_count = 0;
    this.loss_count = 0;
    this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function() {
    this.collision();
    if (this.y < 60){
        this.reset();
        this.win();
    }
};

Player.prototype.reset = function() {
    this.y = 400;
    this.x = 200;
};

Player.prototype.collision = function() {
    allEnemies.forEach(function(enemy){
        if (player.y === enemy.y){
            if (enemy.x >= player.x - 20 && enemy.x <= player.x + 20){
                player.loss();
                player.reset();
            }
        };
    });
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(allowedKeys){
    switch (allowedKeys){
        case 'left':
            if (this.x < 100) break;
            this.x -= 100;
            break;
        case 'right':
            if (this.x > 300) break;
            this.x += 100;
            break;
        case 'up':
            if (this.y < 20) break; 
            this.y -= 85;
            break;
        case 'down':
        if (this.y > 370) break;
            this.y += 85;
    }
};

Player.prototype.win = function(){
    this.win_count += 1; 
}

Player.prototype.loss = function(){
    this.loss_count += 1;
}

var enemy_y = [230, 145, 60];
var enemy_speed = [350, 500, 550];

var enemy_1 = new Enemy(enemy_y[Math.floor(Math.random() * 3)], 
                        enemy_speed[Math.floor(Math.random() * 3)]);

var enemy_2 = new Enemy(enemy_y[Math.floor(Math.random() * 3)], 
                        enemy_speed[Math.floor(Math.random() * 3)]);

var enemy_3 = new Enemy(enemy_y[Math.floor(Math.random() * 3)], 
                        enemy_speed[Math.floor(Math.random() * 3)]);

var enemy_4 = new Enemy(enemy_y[Math.floor(Math.random() * 3)], 
                        enemy_speed[Math.floor(Math.random() * 3)]);

var enemy_5 = new Enemy(enemy_y[Math.floor(Math.random() * 3)], 
                        enemy_speed[Math.floor(Math.random() * 3)]);


var allEnemies = [enemy_1, enemy_2, enemy_3, enemy_4, enemy_5];
var player = new Player();
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
