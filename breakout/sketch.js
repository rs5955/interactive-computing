var points, misses, beginBool,scene,paddle,padPos,ball,xBall,yBall,xSpeed,ySpeed, objective, xObj, yObj, bounce,miss,objHit,paddleHit;

function preload(){
    scene = loadImage("images/scene.jpg");
    paddle = loadImage("images/paddle.png");
    ball = loadImage("images/ball.png");
    objective = loadImage("images/objective.png");
    soundFormats('ogg','mp3');
    bounce = loadSound("sounds/ballBounce.mp3");
    miss = loadSound("sounds/miss.mp3");
    objHit = loadSound("sounds/objHit.mp3");
    paddleHit = loadSound("sounds/paddleHit.mp3");
}
function setup(){
    createCanvas(500,500);
    noStroke();
    fill(100, 253, 253);
    padPos = width/2;
    xBall = width/2;
    yBall = height/2;
    xSpeed = 0;
    ySpeed = 0;
    xObj = random(35,width-35);
    yObj = random(40,height-240);
    beginBool = 1;
    points = 0;
    misses = 0;
}
function draw(){
//    setting up
    imageMode(CORNER);
    image(scene,0,0,width,height);
    rect(0,0,10,height);
    rect(height-10,0,10,height);
    rect(0,0,width,10);
    fill(0);
    textFont("monospace");
    text("Points: " + points, 20, 30);
    text("Misses: " + misses, 20, 50);
    fill(100, 253, 253);
    imageMode(CENTER);
    image(paddle,padPos,height-25,100,50);
    image(ball,xBall,yBall,28,28);
    image(objective, xObj, yObj, 50, 60);
    if(keyIsDown(65) && padPos>65){
        padPos-=9;
    }
    if(keyIsDown(68) && padPos<width-65){
        padPos+=9;
    }
    xBall += xSpeed;
    yBall += ySpeed;
    //border collision
    
    //TODO
    if(xBall<24 || xBall>width-24){
        if(xSpeed<0){
            xBall = 25; //assumes left side
            xSpeed = random(3,5);
        }
        else{
            xBall = width-25; //assumes right side
            xSpeed = -1*random(3,5);
        }
        bounce.play();
    }
    if(yBall<24){
        yBall = 25;
        ySpeed = random(3,5);
        bounce.play();
    }
    //paddle collision
    if((xBall+14 >= padPos-50) && (xBall-14 <= padPos+50)){
        if(yBall+14 > height-25){
            if(xBall<padPos-17){ //first third
                yBall = height-40;
                xSpeed = -1*(abs(xSpeed));
                ySpeed *= -1;
            }
            //33% to 66% of the paddles width
            else if(xBall<padPos){
                yBall = height-40;
                xSpeed *= -.5*(abs(xSpeed));
                ySpeed *= -1;
            }
            else if(xBall<padPos+16){
                yBall = height-40;
                xSpeed *= .5*(abs(xSpeed));
                ySpeed *= -1;
            }
            else{//last third of the paddle's width
                yBall = height-40;  
                xSpeed = abs(xSpeed);
                ySpeed *= -1;
            }
            paddleHit.play();
        }
    }
    //ball falls down
    if(yBall>height){
        xBall = width/2;
        yBall = height/2;
        xSpeed = 0;
        ySpeed = 0;
        misses += 1;
        beginBool = 1;
        miss.play();
    }
    //objective collision
    if((xObj+25 >= xBall-14) && (xObj-25 <= xBall+14)){
        if((yObj+25 > yBall-14)&&(yObj-25 < yBall+14)){
//            console.log("ping");
            xObj = random(35,width-35);
            yObj = random(40,height-240);
            points += 1;
            objHit.play();
        }
    }
    
}

function mousePressed(){
    if(beginBool == 1){
        var ranX, ranY;
        ranX = random(100);
        ranY = random(100);
        if(ranX>50){
            xSpeed = random(3,5);
        }
        else{
            xSpeed = -1*random(3,5);
        }
        if(ranY>50){
            ySpeed = random(3,5);
        }
        else{
            ySpeed = -1*random(3,5);
        }
        beginBool = 0;
    }
}