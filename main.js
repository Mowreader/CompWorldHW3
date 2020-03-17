
// GameBoard code below



function distance(a, b) {
    var dx = a.x - b.x; // Distance for x
    var dy = a.y - b.y; // Distance for y
    return Math.sqrt(dx * dx + dy * dy); //Pythagorean Thm
}

function Circle(game, x = this.radius + Math.random() * (800 - this.radius * 2), y = this.radius + Math.random() * (800 - this.radius * 2)) {
    this.type = 'Circle';
    this.player = 1;
    this.radius = 20;
    this.visualRadius = 500;
    this.colors = ["Red", "Green", "Blue", "White"];
    this.setNotIt();
    this.game = game;
    this.x = x;
    this.y = y;
    Entity.call(this, game, this.x, this.y);

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.setIt = function () {
    this.it = true;
    this.color = 2;
    this.visualRadius = 500;
};

Circle.prototype.setNotIt = function () {
    this.it = false;
    this.color = 1;
    this.visualRadius = 200;
};

Circle.prototype.collide = function (other) {
    if (other.type === 'Rectangle'){

        var xBound = this.x > other.x - this.radius && this.x < other.x + other.width + this.radius;
        var yBound = this.y > other.y - this.radius && this.y < other.y + other.height + this.radius;

        // console.log('rectange collision check ' + (xBound && yBound));
        return xBound && yBound;

    } else if (other.type === 'RotateRectangle'){

        // var ang = this.degree*Math.PI/180;
        // var cSin = Math.cos(ang);
        // var sin = Math.sin(ang);

        // tempX = this.x*cSin + this.x*sin;
        // tempY = this.y*cSin - this.y*sin;

        // otherX = other.x*cSin + other.x*sin;
        // otherY = other.y*cSin - other.y*sin;

        // var xBound = tempX > otherX - this.radius && tempX < otherX + other.width + this.radius;
        // var yBound = tempY > otherY - this.radius && tempY < otherY + other.height + this.radius;

        // Bounding Box Method



        var xBound = this.x > other.x - this.radius && this.x < other.x + other.width + this.radius;
        var yBound = this.y > other.y - this.radius && this.y < other.y + other.height + this.radius;

        // console.log('rectange collision check ' + (xBound && yBound));
        return xBound && yBound;

    } else {
        return distance(this, other) < this.radius + other.radius;
    }
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Circle.prototype.update = function () {

    
    Entity.prototype.update.call(this);
    //console.log(this.velocity);
    if (this.game.click !== null && this.game.click.x <= (this.x + this.radius) && this.game.click.y <= (this.y + this.radius)
                                 && this.game.click.x >= (this.x - this.radius) && this.game.click.y >= (this.y - this.radius) && !this.it){
        this.x = Math.floor(Math.random()*800);
        this.y = Math.floor(Math.random()*800);
    }

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        //console.log(ent);
        if (ent !== this && this.collide(ent)) {

            //console.log(ent.type);

            if (ent.type === 'Circle' && ent.it) {
                this.x = Math.floor(Math.random()*800);
                this.y = Math.floor(Math.random()*800);

            } else if (ent.type === 'Circle' && this.it){
                ent.x = Math.floor(Math.random()*800);
                ent.y = Math.floor(Math.random()*800);

            } else if (ent.type === 'Circle'){ // If Circle

                //console.log('CIRCLE collision');
                var temp = { x: this.velocity.x, y: this.velocity.y };

                var dist = distance(this, ent);
                var delta = this.radius + ent.radius - dist;
                var difX = (this.x - ent.x)/dist;
                var difY = (this.y - ent.y)/dist;

                this.x += difX * delta / 2;
                this.y += difY * delta / 2;
                ent.x -= difX * delta / 2;
                ent.y -= difY * delta / 2;

                this.velocity.x = ent.velocity.x * friction;
                this.velocity.y = ent.velocity.y * friction;
                ent.velocity.x = temp.x * friction;
                ent.velocity.y = temp.y * friction;
                this.x += this.velocity.x * this.game.clockTick;
                this.y += this.velocity.y * this.game.clockTick;
                ent.x += ent.velocity.x * this.game.clockTick;
                ent.y += ent.velocity.y * this.game.clockTick;

            } else if (ent.type === 'Rectangle'){ // If Rectangle

                if ((this.y > ent.y + ent.height && this.velocity.y < 0) || (this.y < ent.y &&  this.velocity.y > 0)){
                    this.velocity.y = -this.velocity.y;
                }
                if ((this.x > ent.x + ent.width && this.velocity.x < 0) || (this.x < ent.x && this.velocity.x > 0)){
                    this.velocity.x = -this.velocity.x;
                }

                // console.log('<<<<<<<<<<<<<<<<<<PASSED>>>>>>>>>>>>>>>>>>>');
            } else if (ent.type === 'RotateRectangle'){ // If RotatingRectangle

                var rad = ent.degree * Math.PI / 180;

                if ((this.y > ent.y + ent.height && this.velocity.y < 0) || (this.y < ent.y &&  this.velocity.y > 0)){
                    this.velocity.y = -this.velocity.y;
                }
                if ((this.x > ent.x + ent.width && this.velocity.x < 0) || (this.x < ent.x && this.velocity.x > 0)){
                    this.velocity.x = -this.velocity.x;
                }

                // console.log('<<<<<<<<<<<<<<<<<<PASSED>>>>>>>>>>>>>>>>>>>');
            }

        }

    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Circle.prototype.draw = function (ctx) {

    if (this.color === 2){
        ctx.beginPath();
        ctx.fillStyle = this.colors[this.color];
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    } else {
        ctx.beginPath();
        ctx.strokeStyle = this.colors[this.color];
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.closePath();
    }
    

};

function Rectangle(game, x = Math.random()*600, y = Math.random()*600, w = Math.random()*180 + 20, h = Math.random()*180 + 20) {

    this.type = 'Rectangle';
    this.player = 1;
    this.width = w;
    this.height = h;
    this.colors = ["Red", "Green", "Blue", "White"];
    this.color = 3;
    this.game = game;
    Entity.call(this, game, x, y); // Random position
};

Rectangle.prototype = new Entity();
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.update = function () {
    Entity.prototype.update.call(this);

};

Rectangle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.colors[this.color];
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
    ctx.closePath();
    //ctx.rotate(-20 * Math.PI / 180);

};

function RotateRectangle(game, x = Math.random()*600, y = Math.random()*600, w = Math.random()*200, h = Math.random()*200) {

    this.type = 'RotateRectangle';
    this.player = 1;
    this.degree = 1;
    this.width = w;
    this.height = h;
    this.colors = ["Red", "Green", "Blue", "White"];
    this.color = 0;
    this.game = game;
    this.velocity = {rotationalVelocity : 1}; //1 degree per tick
    Entity.call(this, game, x, y); // Random position
};

RotateRectangle.prototype = new Entity();
RotateRectangle.prototype.constructor = Rectangle;

RotateRectangle.prototype.update = function () {
    Entity.prototype.update.call(this);

    //console.log('Clock ' + this.game.clockTick);


};

RotateRectangle.prototype.draw = function (ctx) {


    ctx.save();
    ctx.beginPath();
    ctx.translate(this.x + this.width/2, this.y + this.height/2);
    ctx.rotate(this.degree*Math.PI/180);
    this.degree++;
    ctx.rect(-this.width/2, -this.height/2, this.width, this.height);
    ctx.strokeStyle = this.colors[this.color];
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

};




// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 200;
var socket = io.connect("http://24.16.255.56:8888");


window.onload = function () {
    // var socket = io.connect("http://24.16.255.56:8888");  // connect to database

    // below three method were copied from ppt.
    socket.on("connect", function () {        
        console.log("Socket connected.")    
    });    
    socket.on("disconnect", function () {
        console.log("Socket disconnected.")    
    });    
    socket.on("reconnect", function () {        
        console.log("Socket reconnected.")    
    });
  
    var text = document.getElementById("text");
    var saveButton = document.getElementById("save");
    var loadButton = document.getElementById("load");
  
    saveButton.onclick = function () {
      console.log("save");
      text.innerHTML = "Saved."

        // if (gameEngine.entities[1].index >= 0) {
        //     gameEngine.list.myList[gameEngine.entities[1].index] = gameEngine.entities[1].grid;
        // }

        var dataStore = [];

        for (var i = 0; i < gameEngine.entities.length; i++){
            if (gameEngine.entities[i].type == 'Circle'){
                dataStore.push({x: gameEngine.entities[i].x, y: gameEngine.entities[i].y, type: gameEngine.entities[i].type});
            } else {
                dataStore.push({x: gameEngine.entities[i].x, y: gameEngine.entities[i].y, 
                    w: gameEngine.entities[i].width, h: gameEngine.entities[i].height,
                    type: gameEngine.entities[i].type});
            }
            
        }

        console.log(dataStore);
            
        socket.emit("save", { studentname: "Ryan Mowreader", statename: "Assignment 3 Ryan Mowreader", data: dataStore });

    };
  
    loadButton.onclick = function () {
      console.log("load");
      text.innerHTML = "Loaded."

      socket.emit("load", { studentname: "Ryan Mowreader", statename: "Assignment 3 Ryan Mowreader" });
    };

    socket.on("load", function (data) {
        gameEngine.entities = [];

        console.log(data);

        for (var i = 0; i < data.data.length; i++){
            console.log(data.data[i].type);

            if (data.data[i].type == 'RotateRectangle'){
                gameEngine.entities.push(new RotateRectangle(gameEngine, data.data[i].x, data.data[i].y, data.data[i].w, data.data[i].h))
            } else if (data.data[i].type == 'Rectangle') {
                gameEngine.entities.push(new Rectangle(gameEngine, data.data[i].x, data.data[i].y, data.data[i].w, data.data[i].h))
            } else {
                gameEngine.entities.push(new Circle(gameEngine, data.data[i].x, data.data[i].y))
            }

        }

        console.log(gameEngine.entities);
        
    });


    var ASSET_MANAGER = new AssetManager();

    ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
    ASSET_MANAGER.queueDownload("./img/black.png");
    ASSET_MANAGER.queueDownload("./img/white.png");

    console.log("starting up da shield");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');


    var gameEngine = new GameEngine();
    var circle = new Circle(gameEngine);
    circle.setIt();
    gameEngine.addEntity(circle);
    for (var i = 0; i < 5; i++) {
        circle = new Circle(gameEngine);
        gameEngine.addEntity(circle);
    }

    for (var i = 0; i < 4; i++) {
        rect = new Rectangle(gameEngine);
        gameEngine.addEntity(rect);
    }

    for (var i = 0; i < 5; i++) {
        rect = new RotateRectangle(gameEngine);
        gameEngine.addEntity(rect);
    }


    gameEngine.init(ctx);
    gameEngine.start();


    //gameEngine.addEntity(new Guy(gameEngine, AM.getAsset("./img/RobotUnicorn.png")));

    console.log("All Done!");
    
  
    // socket.emit("mesasge",);
  
};
