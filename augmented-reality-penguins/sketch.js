var world;
var markerZB;
//position trackers
var charX = 0;
var charY = 0;
//images
var penguin,rock,fish,heartFull,heartNull,golden,medkit;
var bg;
var vidRepositioned = false;
var rocks = [];
var fishArr = [];
var points = 0;
var health = 3;
var gameState = 0;
//singleton items
var fishyGold,medicalItem;
//SOUNDS
var bgMusic,clickMusic,highScore,rockHit,victoryMusic;

function preload(){
    //LOAD EVERYTHING
    penguin = loadImage("images/penguin.png");
    bg = loadImage("images/background.PNG");
    rock = loadImage("images/rock.png");
    fish = loadImage("images/fish.png");
    heartFull = loadImage("images/heartFull.png");
    heartNull = loadImage("images/heartNull.png");
    golden = loadImage("images/golden.png");
    medkit = loadImage("images/medkit.png");
    bgMusic = loadSound("sounds/bgMusic.mp3");
    clickMusic = loadSound("sounds/click.mp3");
    highScore = loadSound("sounds/highscore.mp3");
    rockHit = loadSound("sounds/rockHit.mp3");
    victoryMusic = loadSound("sounds/victory.mp3");
}
function setup(){
    world = new World('ARScene');
    markerZB = world.getMarker("zb");
    //MUSIC SETUP
    bgMusic.setVolume(.8);
    bgMusic.loop();
    noiseDetail(24);
    //instantiate the objects and put them into the array
    for(var i=0;i<7;i++){
        rocks.push(new Rock());
    }
    for(var i=0;i<3;i++){
        fishArr.push(new Fish());
    }
    fishyGold = new GoldenFish();
    medicalItem = new Medkit();
    textFont("monospace");
}
function draw(){
    //GAMESTATES
    if(gameState==0){
        starting();
    }
    else if(gameState==1){
        gameplay();
    }
    else if(gameState==2){
        endgame();
    }
}
function starting(){
    world.clearDrawingCanvas();
    //TEXT PRESETS
    fill(0);
    textSize(30);
    textStyle(BOLD);
    text("WELCOME TO FISH CATCHING",width/4,height/2);
    image(penguin,width/4,height/2-150,100,100);
    image(fish,width/4+100,height/2-150,100,100);
    textSize(20);
    text("Click anywhere to begin!",width/4,height/2+80);
    text("Make sure to hold up your ZB marker",width/4,height/2+120);
    if(mouseIsPressed){
        //ONCE MOUSE IS CLICKED, GO TO GAMEPLAY
        gameState += 1;
        clickMusic.play();
    }
}
function gameplay(){
    imageMode(CENTER);
    world.clearDrawingCanvas();
    image(bg,width/2,height/2,width,height);
    
    if(!vidRepositioned){
        var vidElement = document.querySelector("video");
        if(vidElement){
            vidElement.style["z-index"] = "200";
            vidRepositioned = true;
        }
    }
    //CHECKS IF MARKER IS SEEN BY WEBCAM
    if(markerZB.isVisible()){
        var zbPos = markerZB.getScreenPosition();
        
        charX = zbPos.x;
        charY = zbPos.y;
    }
    imageMode(CENTER);
    image(penguin,charX,charY,70,70);
    //MAKE ALL THE OBJECTS MOVE
    for(var i=0;i<rocks.length;i++){
        rocks[i].move();
    }
    for(var i=0;i<fishArr.length;i++){
        fishArr[i].move();
    }
    fill(0);
    textSize(20);
    textStyle(BOLD);
    text("Points: "+points,width/15,height/5+50);
    text("Health: ",width/15,height/5+100);
    imageMode(CORNER);
    //UPDATE HEALTHPOINTS IF HIT
    if(health==3){
        image(heartFull,width/15+80,height/5+65,50,50);
        image(heartFull,width/15+140,height/5+65,50,50);
        image(heartFull,width/15+200,height/5+65,50,50);
    }
    else if(health==2){
        image(heartFull,width/15+80,height/5+65,50,50);
        image(heartFull,width/15+140,height/5+65,50,50);
        image(heartNull,width/15+200,height/5+65,50,50);
    }
    else if(health==1){
        image(heartFull,width/15+80,height/5+65,50,50);
        image(heartNull,width/15+140,height/5+65,50,50);
        image(heartNull,width/15+200,height/5+65,50,50);
    }
    else{
        //IF HEALTH DROPS TO 0 THEN MOVE TO END SCREEN
        gameState+=1;
        victoryMusic.play();
    }
    //GOLDEN FISH (+5 PTS)
    fishyGold.move();
    //MEDKIT (HEALth +1)
    medicalItem.move();
}
function endgame(){
    world.clearDrawingCanvas();
    fill(0);
    textSize(30);
    textStyle(BOLD);
    text("GAMEOVER",width/4,height/2-100);
    text("FINAL SCORE: "+points,width/4,height/2);
    text("Click anywhere to start again!",width/4,height/2+100);
    //RESET ALL THE DATA FIELDS
    if(mouseIsPressed){
        rocks.length = 0;
        fishArr.length = 0;
        for(var i=0;i<7;i++){
        rocks.push(new Rock());
        }
        for(var i=0;i<3;i++){
            fishArr.push(new Fish());
        }
        health = 3;
        points = 0;
        gameState = 0;
        fishyGold = new GoldenFish();
        medicalItem = new Medkit();
        clickMusic.play();
    }
}
//ROCK OBJECT (-2 POINTS IF HIT and -1 HEALTH POINT)
function Rock(){
    this.x = random(width);
    this.y = random(-300,0);
    this.speed = random(1,3);
    this.xOffset = random(0,1000);
    this.move = function(){
        this.y += this.speed;
        var xMov = map(noise(this.xOffset),0,1,-1,1);
        this.x += xMov;
        this.xNoiseOffset += .01;
        if(dist(this.x,this.y,charX,charY)<50){
            if(!(points<=0)){
                points-=1;
            }
            health-=1;
            rockHit.play();
            this.x = random(width);
            this.y = random(-300,0);
        }
        if(this.y>height){
            this.x = random(width);
            this.y = random(-300,0);
        }
        image(rock,this.x,this.y,40,40);
    }
}
//FISH OBJECT (+1 POINTS IF HIT)
function Fish(){
    this.x = random(width);
    this.y = random(-300,0);
    this.speed = random(1,3);
    this.xOffset = random(0,1000);
    this.move = function(){
        this.y += this.speed;
        var xMov = map(noise(this.xOffset),0,1,-1,1);
        this.x += xMov;
        this.xNoiseOffset += .01;
        if(dist(this.x,this.y,charX,charY)<50){
            points+=1;
            this.x = random(width);
            this.y = random(-300,0);
        }
        if(this.y>height){
            this.x = random(width);
            this.y = random(-300,0);
        }
        image(fish,this.x,this.y,40,40);
    }
}
function GoldenFish(){
    this.x = random(width);
    this.y = random(-1000,-500);
    this.speed = random(3,6);
    this.xOffset = random(0,1000);
    this.move = function(){
        this.y += this.speed;
        var xMov = map(noise(this.xOffset),0,1,-1,1);
        this.x += xMov;
        this.xNoiseOffset += .01;
        if(dist(this.x,this.y,charX,charY)<50){
            points+=5;
            this.x = random(width);
            this.y = random(-1000,-500);
            this.speed = random(3,6);
            if(!highScore.isPlaying()){    
                highScore.play();
            }
        }
        if(this.y>height){
            this.x = random(width);
            this.y = random(-1000,-500);
        }
        image(golden,this.x,this.y,60,60);
    }
}
function Medkit(){
    this.x = random(width);
    this.y = random(-5000,-4000);
    this.speed = random(5,8);
    this.xOffset = random(0,1000);
    this.move = function(){
        this.y += this.speed;
        var xMov = map(noise(this.xOffset),0,1,-1,1);
        this.x += xMov;
        this.xNoiseOffset += .01;
        if(dist(this.x,this.y,charX,charY)<50){
            if(health<3){
                health+=1;
            }
            console.log("HEAL");
            this.x = random(width);
            this.y = random(-5000,-4000);
            this.speed = random(5,8);
            if(!highScore.isPlaying()){    
                highScore.play();
            }
        }
        if(this.y>height){
            this.x = random(width);
            this.y = random(-5000,-4000);
        }
        image(medkit,this.x,this.y,60,60);
    }
}