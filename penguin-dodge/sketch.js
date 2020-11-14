// the "state" variable will keep track of which mode our game is currently operating in
// 0 = game start
// 1 = difficulty menu
// 2 = game playing
// 3 = game end

var state = 0;
var diff = 0; //1 = easy, 2 = normal
var victory = 1; //1 = win, 2 = lose;
var theCanvas;
var scene,start,penguinL,penguinR,currentPeng,penPosX,penPosY, penSpeed,
    gameTitle, gameBG, bearL, bearR, currentBear, penPos2X,penPos2Y,penSpeed2,
    currentPeng2, objective, points, losses;
var bear1,bear2,bear3,bear4;
var bgMusic, clickMusic, victoryMusic, loseMusic;

function preload(){
    scene = loadImage("images/antarctica.jpg");
    start = loadImage("images/start.png");
    penguinL = loadImage("images/penguinL.png");
    penguinR = loadImage("images/penguinR.png");
    gameTitle = loadImage("images/gameTitle.jpg");
    gameBG = loadImage("images/gameBG.jpg");
    bearL = loadImage("images/bearL.png");
    bearR = loadImage("images/bearR.png");
    objective = loadImage("images/objective.png");
    soundFormats("ogg","mp3");
    bgMusic = loadSound("sounds/bgmusic.mp3");
    clickMusic = loadSound("sounds/click.mp3");
    victoryMusic = loadSound("sounds/victory.mp3");
    loseMusic = loadSound("sounds/lose.mp3");
}

function setup() {
    theCanvas = createCanvas(500, 500);
    theCanvas.style('display', 'block');
    theCanvas.style('margin', 'auto');
    theCanvas.parent('canvasHere');
    currentPeng = penguinL;
    penPosX = width/2;
    penPosY = height/2;
    penSpeed = 1;
    penPos2X = 50;
    penPos2Y = height-100;
    penSpeed2 = 2;
    currentPeng2 = penguinR;
    currentBear = bearL;
    //instantiate 4 bear objects
    bear1 = new Bear(100,300);
    bear2 = new Bear(350,220);
    bear3 = new Bear(100,140);
    bear4 = new Bear(350,60);
    //scoring for the game
    points = 0;
    losses = 0;
    //background music control
    bgMusic.setVolume(.5);
    bgMusic.play();
    bgMusic.loop();    
}

function draw() {
    // play a different portion of the game based on which state we are in
    if (state == 0) {
        gameStart();
    }
    else if (state == 1) {
        selectDiff();
    }
    else if (state == 2) {
        gamePlaying();
//        console.log(penSpeed2);
//        console.log(bear1.speed);
    }
    else {
        gameEnd();
    }
    //replace cursor with a small circle
    fill(255);
    noStroke();
    noCursor(); 
    ellipse(mouseX,mouseY,20,20);
}

function gameStart() {
//    background(171,207,217);
    textAlign(LEFT);
    imageMode(CORNER);
    rectMode(CENTER);
    image(scene,0,0,width,height);
    imageMode(CENTER);
    image(gameTitle,width/2,height/4,400,120);
    image(start,width/2,height/2+100,300,100);
    textSize(30);
    textStyle(BOLD);
    fill(0,73,229);
    noStroke();
    image(currentPeng,penPosX,penPosY,100,100);
    penPosX -= penSpeed;
    //designing the moving starting screen penguin
    if(penPosX<100){
        penSpeed *= -1;
    }
    if(penPosX>width-100){
        penSpeed *=-1;
    }
    if(penSpeed<0){
        currentPeng = penguinR;
    }
    else{
        currentPeng = penguinL;
    }
    //reset values
    victory = 0;
    penPos2X = 50;
    penPos2Y = height-100;
    penSpeed2 = 2;
}

function selectDiff(){
    //difficulty selection screen
    imageMode(CORNER);
    rectMode(CORNER);
    image(scene,0,0,width,height);
    fill(200,90);   
    rect(20,20,250,150);
    fill(39,222,232,200);
    rect(100,220,250,100);
    rect(100,340,250,100);
    textFont("monospace");
    textStyle(BOLD);
    textSize(40);
    fill(0);
    text("SELECT\nYOUR\nDIFFICULTY", 30, 60);
    textSize(50);
    text("EASY",width/4,height/2+30);
    text("NORMAL",width/4,height/2+150);
}

function gamePlaying() {
    //  text("Game is in 'play' mode - click to switch to 'end' mode", 20, 20);
    image(gameBG,0,0,width,height);
//    image(bearL,50,250,100,100);
    image(currentPeng2,penPos2X,penPos2Y,50,50);
    image(objective, 390, 0, 100, 120);
    textSize(20);
    fill(0);
    text("Victories: "+points, 20, 30);
    text("Losses: "+losses, 20, 50);
    //if easy, display 2 bears, if normal, display 4 bears.
    if(diff == 1){
        bear1.display();
        bear3.display();
        bear1.move();
        bear3.move();
    }
    else{
        bear1.display();
        bear2.display();
        bear3.display();
        bear4.display();
        bear1.move();
        bear2.move();
        bear3.move();
        bear4.move();
    }
    //WASD movement controls
    if(keyIsDown(65) && penPos2X>0){
        currentPeng2 = penguinL;
        penPos2X -= penSpeed2;
    }
    if(keyIsDown(68) && penPos2X<450){
        currentPeng2 = penguinR;
        penPos2X += penSpeed2;
    }
    if(keyIsDown(87) && penPos2Y>0){
        penPos2Y -= penSpeed2;
    }
    if(keyIsDown(83) && penPos2Y<450){
        penPos2Y += penSpeed2;
    }
    if(penPos2X>360 && penPos2Y<70){
        victory = 1;
        state = 3;
        points += 1;
        victoryMusic.play();
    }
}

function gameEnd() {
    background(0);
    fill(255);
//    stroke(255);
    textFont("monospace");
    if(victory == 1){
        textStyle(BOLD);
        textSize(50);
        textAlign(LEFT);
        text("Congratulations!\nYou have won!", width/9,height/4);
        textSize(20);
        text("Click anywhere on the\nscreen to restart.", width/6, height/2+100);
    }
    if(victory == 2){
        textStyle(BOLD);
        textAlign(CENTER);
        textSize(40);
        text("\tYou have been\ncaught by a bear!", width/2,height/4);
        
        textSize(20);
        text("Click anywhere on the\nscreen to restart.", width/2, height/2+100);
    }
//  text("Game is in 'end' mode - click to switch to 'start' mode", 20, 20);
}

function mousePressed() {
    if (state == 0) {
    // switch to state 1
        if(mouseX>100 && mouseX<400 && mouseY>300 && mouseY<400){
            state = 1;
            diff = 0; //reset difficulty
            clickMusic.play();
        }
    }
    else if (state == 1) {
    // switch to state 2
        if(mouseX>100 && mouseX<350){
            if(mouseY>220 && mouseY<320){
                state = 2;
                diff = 1; //easy
                clickMusic.play();
            }
            if(mouseY>340 && mouseY<440){
                state = 2; 
                diff = 2; //normal
                clickMusic.play();
            }
        }
        
    }
    else if (state == 3){
        state = 0;
    }
    else{
        console.log("");
    }
}

class Bear{
    constructor(x,y){
        var sgn = [-1,1];
        this.x = x;
        this.y = y;
        this.speed = (sgn[Math.floor(Math.random()*sgn.length)])*((Math.random()*1.5)+1);
//        console.log(this.speed);
    }
    
    display(){
        if(this.speed<0){
            currentBear = bearL;
        }
        else{
            currentBear = bearR;
        }
        image(currentBear, this.x, this.y, 100, 100);
    }
    
    move(){
        this.x += this.speed;
        if(this.x<0 || this.x>350){
            this.speed *= -1;
        }
        if((penPos2X+25>this.x) && (penPos2X<this.x+75)){
           if((penPos2Y+25>this.y) && (penPos2Y<this.y+100)){
               state = 3;
               victory = 2;
               losses += 1;
               loseMusic.play();
              }
           }
    }
}

function updatePenguin(clickedRange) {
    // grab the range data as an integer
    penSpeed = int(clickedRange.value); 
    penSpeed2 = int(clickedRange.value);
}

function updateBear(clickedRange) {
  // grab the range data as an integer
    change = int(clickedRange.value);
    bearArray = [bear1,bear2,bear3,bear4];
    for(i in bearArray){
        b = bearArray[i];
        b.speed = change;
    }
}
