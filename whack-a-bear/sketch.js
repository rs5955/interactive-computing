var score = 0;
var misses = 0;
var elapsedTime = 0;
var timeNow;
var interval = 30000;
var moleArray = new Array(9);
var gameState = 0;//0,1,2;title,gameplay,endscreen
var hammer, monster, hole, gameplayBG, titleBG, startButton,clickMusic,victoryMusic,loseMusic;

function preload(){
    //load images
    hammer = loadImage("images/hammer.png");
    monster = loadImage("images/monster.png");
    hole = loadImage("images/hole.png");
    gameplayBG = loadImage("images/gameplayBG.jpeg");
    titleBG = loadImage("images/titleBG.jpg");
    startButton = loadImage("images/start.png");
    soundFormats("ogg","mp3");
    clickMusic = loadSound("sounds/click.mp3");
    victoryMusic = loadSound("sounds/victory.mp3");
    loseMusic = loadSound("sounds/lose.mp3");
}

function setup() {
    //create the canvas
    theCanvas = createCanvas(500, 500);
    theCanvas.style('display', 'block');
    theCanvas.style('margin', 'auto');
    theCanvas.parent('gameHere');
    
    //initialize the moles
    moleArray[0] = new Mole(90,120);
    moleArray[1] = new Mole(250,120);
    moleArray[2] = new Mole(410,120);
    moleArray[3] = new Mole(90,260);
    moleArray[4] = new Mole(250,260);
    moleArray[5] = new Mole(410,260);
    moleArray[6] = new Mole(90,420);
    moleArray[7] = new Mole(250,420);
    moleArray[8] = new Mole(410,420);  
    timeNow = millis();
}

function draw() {
    textFont("monospace");
    if(gameState == 0){
        title();
    }
    else if(gameState == 1){
        gameplay();
    }
    else if(gameState == 2){
        endscreen();
    }
    else{
        
    }
    //set cursor to hammer
    noCursor();
    image(hammer,mouseX-20,mouseY-20,70,110);
}

function title(){
    //title page
    image(titleBG,0,0,width,height);
    fill(0,117,252);
    textAlign(CENTER);
    textSize(50);
    textStyle(BOLD);
    text("Whack-a-Bear",width/2,height/3);
    for(var i=0; i<moleArray.length; i++){
        moleArray[i].state = 0;
    }
    image(startButton,width/2-150,220,300,250);
    score = 0;
    misses = 0;
}

function gameplay(){
    //gameplay
    image(gameplayBG,0,0,width,height);
    noStroke();
    fill(100,255,150);
    rect(0,0,width,50);
    fill(0);
    textAlign(LEFT);
    textStyle(BOLD);
    textSize(20);
    text("Score: "+score,40,32);
    text("Misses: "+misses,200,32);
    elapsedTime = 0;
    text("Time: "+(int((millis()-timeNow)/1000)),370,32);
    
    for(var i=0;i<moleArray.length;i++){
        moleArray[i].display();
        moleArray[i].update();
    }
        
    if((millis() - timeNow)>=interval){
        timeNow = millis();
        gameState = 2;
        loseMusic.play();
    }
}

function endscreen(){
    //end page
    background(0);
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text("Times Up!", width/2, height/4);
    textSize(20);
    text("Score: "+score, width/2, height/4+100);
    text("Misses: "+misses, width/2, height/4+150);
    text("Click anywhere to restart", width/2, height/4+250);
    
}

class Mole{
    constructor(xPos,yPos){
        this.xPos = xPos;
        this.yPos = yPos;
        
        //state: 0==down, 1==up
        this.state = 0;
        
        this.howLong = int(random(120,480)); //60==1s
        this.frameState = 0; //begin at 0
    }
    
    display(){
        fill(255);
        image(hole,this.xPos-60,this.yPos-60,120,120);
        if(this.state == 1){
//            ellipse(this.xPos,this.yPos,120,120);
            image(monster,this.xPos-50,this.yPos-50,100,100);
        }
        else{
//            rect(this.xPos,this.yPos,100,100);
        }
    }
    
    update(){
        this.frameState += 1;
        if(this.frameState>=this.howLong){
            if (this.state == 1) {
                this.state = 0;
            }
            else {
                this.state = 1;
            }
            
            this.frameState = 0;
            this.howLong = int(random(300,500));
        }
    }
    
    checkHit(x,y){
        if(dist(x,y,this.xPos,this.yPos)<60 && this.state == 1){
            score += 1;
            this.state = 0;
        }
        else if(dist(x,y,this.xPos,this.yPos)<60 && this.state == 0){
            misses +=1 ;
        }
    }
}

function mousePressed(){
    if (gameState == 0){
        if(mouseX>150 && mouseX<350 && mouseY>285 && mouseY<360){
            gameState = 1;
            victoryMusic.play();
        }
    }
    else if (gameState == 1){
        for(var i=0; i<moleArray.length; i++){
            moleArray[i].checkHit(mouseX,mouseY);
            clickMusic.play();
        }
    }
    else if (gameState == 2){
        if(mouseX>0 && mouseX<width && mouseY>0 && mouseY<height){
            gameState = 0;
        }
    }
    else{
        console.log("");
    }
}