var x = 50;

function setup() {
    createCanvas(500, 500);
    background(230,255,255);
    noStroke();
    fill(255,255,102); //yellow
    arc(60,350,200,160,PI,0,OPEN); //sun along the horizon
    fill(255);
    //icy floor
    fill(125,50);
    rect(0,350,width,150);
    //penguin drawing
    fill(255,140,0); //orange
    triangle(220,330,240,350,200,355); //left leg
    triangle(280,330,260,350,300,355); //right leg
    fill(0); //black
    ellipse(250,230,80,85); //head
    ellipse(250,300,80,100); //body
    triangle(225,260,230,300,180,305); //left arm
    triangle(275,260,270,300,320,305); //right arm
    fill(255); //white
    ellipse(240,235,40,60); //left head
    ellipse(260,235,40,60); //right head
    //Eye drawing
    fill(0,191,255);
    ellipse(235,230,17,18);
    ellipse(260,230,17,18);
    fill(0);
    ellipse(235,230,13,14);
    ellipse(260,230,13,14);
    fill(255);
    ellipse(235,227,3,3);
    ellipse(260,227,3,3);
    //belly
    fill(255);
    ellipse(250,300,60,80);
    //nose
    fill(255,140,0);
    arc(247,257,40,30,PI+QUARTER_PI,TAU-QUARTER_PI, PIE);
    
}
function draw(){
    fill(230,255,255);
    rect(0,0,width,100);
    //cloud
    fill(240);
    ellipse(x,50,50,30);
    ellipse(x+20,50,50,30);
    ellipse(x+10,55,40,30);
    ellipse(x+10,45,40,30);
//    x+=1;
    if(x<width){
        x+=1;
    }
    else{
        x=0;
    }
    
}