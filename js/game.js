
window.onload = init;

var sounds;
var audioElements;
var canvas;
var ctx;
var paused = false;
var started = false;
var gameOver = false;
var worldTime;
var worldSpeed = 200;
var timer;
var imagesLoaded = false;
var imageError = false;
var windowLoaded = false;

var tempX,tempY;
var interval;
var score = 0;
var highScore = 0;
var imageNames=[];
var turkeys=[];
var background;
var timeAccumulator;
var restartButton;
var resumeButton;
var startButton;
var button, pauseButton;

//Add image sources to the array

imageNames.push('images/turkey-left-sheet.png') //index 0
imageNames.push('images/turkey-sheet.png') //index 1
imageNames.push("images/Explosion.png"); //index 2
imageNames.push("images/autumn_desktop_resized.png"); // index 3
imageNames.push("images/pumpkin.png"); // index 4
imageNames.push("images/turkey-shot.png"); // index 5
imageNames.push("images/autumn_desktop_resized.png");//index 6

//Load images from the array
var preloader = new ImagePreLoader(imageNames, imagesLoadedOK, imageLoadError);


function init(){
    windowLoaded = true;
    timer = window.setInterval(function () {
        if (imagesLoaded) {
            clearInterval(timer);
            game();
        }
        else if (imageError) {
            clearInterval(timer);
            window.alert("You're screwed an image failed to load.")
        }
    }, 200);
    sounds = ["gunshot",
        "gobble1"];
    audioElements = new Array(sounds.length);
    for(var i = 0;i<sounds.length;i++) {
        audioElements[i] = new buzz.sound("sounds/" + sounds[i], {
            formats: ["ogg", "mp3", "wav", "aac"],
            preload: true
        });
    }
}
function game(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.onclick=checkCollisions;
    window.addEventListener('resize', resizeGame, false);
    pauseButton = new Button(1,1,20,10,canvas,'Pause',5);
    pauseButton.debug = true;
    startButton = new Button(40,40,20,20,canvas,'Start',30);
    startButton.debug = true;
    restartButton = new Button(40,40,20,20,canvas,'Restart',30);
    restartButton.debug = true;
    resumeButton = new Button(40,40,20,20,canvas,'Resume',30);
    resumeButton.debug = true;
    button = startButton;
    background = new ImageSprite(0,0,100,100,canvas, preloader.images[6]);
    background.draw(ctx);

    resizeGame();
    draw();


    score = 0;
    turkeys=[];
    for(var i=0;i<30;i++)
    {
        var ry = Math.floor(Math.random()*40) + 45;

        turkeys.push(new Turkey(-(i*15),ry,10,10,canvas,preloader.images[1],preloader.images[5],preloader.images[2],"right",3,3));
        var t = turkeys[i];
    }
   for(var i=0;i<30;i++)
    {
        var ry = Math.floor(Math.random()*20) + 65;
        turkeys.push(new Turkey((i*15),ry,10,10,canvas,preloader.images[0],preloader.images[5],preloader.images[2],"left",3,3));

    }

    timer = 150;
    //Start game timer
    interval = setInterval(function(){
        update();
        draw();


    },worldSpeed);
}

function checkCollisions(evt){
    //Get mouse position
   var rect = canvas.getBoundingClientRect();
   var tempX = evt.clientX - rect.left;
   var  tempY = evt.clientY - rect.top;
    var p = new Point(tempX,tempY);
    audioElements[0].play();


    //Check to resume game
    if(paused || !started){
        if(startButton.contains(p) || resumeButton.contains(p)) {
            paused = false;
            started = true;
            timeAccumulator = new Date();

        }

    }

    //Check to pause the game
   if(!paused && started){
        audioElements[0].play();
        if(pauseButton.checkContainsPoint(p)){
            paused = true;
        }
    }

    for(var i=0;i<turkeys.length;i++){
        if(turkeys[i].checkContainsPoint(p) && !turkeys[i].isShot){
            turkeys[i].shootTurkey();
            audioElements[1].play();
            score +=10;
            break;
        }
    }

    //Check to reset the game
    if(gameOver){
        if(restartButton.checkContainsPoint(p)){
            started = true;
            gameOver = false;
            game();
            console.log('reset');
        }
    }
}

function update(){
    worldTime = new Date();
    if(!paused && started){

        if(worldTime - timeAccumulator > 1000)
        {
            timer-= 10;
            timeAccumulator = worldTime;
        }
        for(var i=0;i<turkeys.length;i++){
            var t = turkeys[i];
            t.update(worldTime);
            t.zigzag();
            var ry =  Math.floor(Math.random()*40) + 45
            if(t.x > t.container.width + 10 && t.direction == "right"){
                t.moveTo(-15, ry);
            }
            if( t.x < - t.width - 10 && t.direction == "left")
            {
                t.moveTo(115, ry )
            }

        }

    }

    if(timer <= 0)
    {
        clearInterval(interval);
        jQuery.ajax({
            type: 'POST',
            dataType: 'json',
            url:"server/gameController.php",
            data: {'id':userID,'score':score},
            success: function(data){
                highScore = data;
                gameOver = true;
                started = false;
                draw();
            }
        });
    }

}

function draw(){
    //Draw background
   background.draw(ctx);


    //Check for game over
    if(timer <=0)
    {
        timer = 0;
        turkeys = [];
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#FFFF66';

        ctx.font="400 " + (.05 * canvas.width * canvas.width/canvas.height) + "px Lato";
        var dim = ctx.measureText("Game Over");
        var x = canvas.width/2 - dim.width/2;
        ctx.fillText("Game Over", x, .15 * canvas.height);

        ctx.font="400 " + (.04 * canvas.width * canvas.width/canvas.height) + "px Lato";
        dim = ctx.measureText("Score: "+score);
        x = canvas.width/2 - dim.width/2;
        ctx.fillText("Score: "+score,x, .25 * canvas.height);

        ctx.font="400 " + (.025 * canvas.width * canvas.width/canvas.height) + "px Lato";
         dim = ctx.measureText("High score: " + highScore);
         x = canvas.width/2 - dim.width/2;
        ctx.fillText("High score: " + highScore, x, .32 * canvas.height);

       restartButton.draw(ctx);
    }

    //Draw pause button
    if(!paused && started && !gameOver){
        pauseButton.draw(ctx);
    }

    //Draw start button and an overlay box
    if(!started && !paused && !gameOver){
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        startButton.draw(ctx);

        ctx.fillStyle = "rgba(0,0,0,.5)";
        ctx.font="400 " + (.015 * canvas.width * canvas.width/canvas.height) + "px Lato";
        var dim = ctx.measureText("Happy Thanksgiving from the Math and Computing Students");
        var x = canvas.width/2 - dim.width/2;
        ctx.fillText("Happy Thanksgiving from the Math and Computing Students", x, .2 * canvas.height);
         dim = ctx.measureText("at");
        x = canvas.width/2 - dim.width/2;
        ctx.fillText("at", x, .25 * canvas.height);
        dim = ctx.measureText("Mount St. Joseph University");
        x = canvas.width/2 - dim.width/2;
        ctx.fillText("Mount St. Joseph University", x, .3 * canvas.height);

    }

    //Draw resume button only and an overlay box
    else if(paused && !gameOver){

        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        resumeButton.draw(ctx);
    }

    //Draw game sprites
    else if(started && !paused){
        for(var i=0;i<turkeys.length;i++){
            turkeys[i].draw(ctx);
        }

    }

    //draw score and timer
    ctx.fillStyle = 'orange';
    ctx.font="400 " + (.015 * canvas.width * canvas.width/canvas.height) + "px Lato";

    x = .85*canvas.width ;
    ctx.fillText("Score: " + score, x , .05 * canvas.height);
    var h = ctx.measureText("M");
    ctx.fillText("Time: " + timer/10, x , .1 * canvas.height );



}

function imagesLoadedOK(evt) {
    imagesLoaded = true;
    console.log("All images loaded.");
}

function imageLoadError(evt) {
    var img;
    imageError = true;
    if (evt.target) {
        img = event.target;
    }
    else {
        img = event.currentTarget;
    }
    console.log("Error loading image: " + img.src);
}

function resizeGame() {
    var gameArea = document.getElementById('gameArea');
    var widthToHeight = 16 / 9;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;

    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
    }

    gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';
    canvas.width = newWidth;
    canvas.height = newHeight;
    background.resize();
    background.draw(ctx);
    startButton.resize();
    pauseButton.resize();
    resumeButton.resize();
    restartButton.resize();

    //startButton.draw(ctx);
    for(var i=0; i < turkeys.length;i++)
    {
        turkeys[i].resize();
        turkeys[i].draw(ctx);
    }



}