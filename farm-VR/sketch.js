var world;

var to, container,treeOb;
var bgMusic;

var smokes = [];

function preload(){
    soundFormats("ogg","mp3");
    bgMusic = loadSound("sounds/bgMusic.mp3");
}

function setup(){
    noCanvas(); //remove canvas
    world = new World('VRScene'); //refer to the html a-scene
    bgMusic.loop();
    
    var g = new Plane({
        x:0,y:0,z:0,
        width:100,height:100,
        rotationX:-90,
        asset: "grass",repeatX:100,repeatY:100
    });
    world.add(g);
    var houseX = 0;
    for(var i=0;i<4;i++){
        var b = new Box({
            x:-3+houseX,y:.5,z:-2-10*i,
            width:5,height:10,depth:5,
            asset: "brick",
            clickFunction: function(items){
                items.setColor(random(255),random(255),random(255));
            }
        });
        world.add(b);
        var c = new Circle({
            x:-3+houseX, y:.5, z:.60-10*i,
            radius:2,
            side:"double",
            asset:"door"
        });
        world.add(c);
        var co = new Cone({
            x:-2+houseX, y:6, z:-1-10*i,
            height:2,
            radiusBottom:1, radiusTop:.5,
            red:244,green:164,blue:96
            
        });
        world.add(co);
        houseX += 1;
    }
    to = new Torus({
        x:10,y:0,z:0,
        radius:5,
        radiusTubular: .05,
        red:192,green:192,blue:192,
        clickFunction: function(items){
            items.setColor(random(255),random(255),random(255));
        }       
    });
    world.add(to);
    var torTwo = new Torus({
        x:10,y:0,z:0,
        radius:5,
        radiusTubular: .2,
        red:192,green:192,blue:192,
        clickFunction: function(items){
            items.setColor(random(255),random(255),random(255));
        }
    });
    world.add(torTwo);
    torTwo.spinX(90);
    var cyl = new Cylinder({
        x:10,y:0,z:0,
        height:.25,
        radius:5,
        red:64,green:164,blue:223
    });
    world.add(cyl);
    
    container = new Container3D({x:10,y:.5,z:0});
    world.add(container);
    var item1 = new Box({
        x:-2,y:0,z:0,
        red:255,green:0,blue:0
    });
    container.addChild(item1);
    var item2 = new Sphere({
        x:2,y:-.25,z:0,
        radius:.5,
        asset: "bball",
    });
    container.addChild(item2);
    
    wishing = new OBJ({
       asset: "wishing_obj",
        mtl: "wishing_mtl",
        x:2.5,y:1.5,z:-2,
        rotationX:0,
        rotationY:0,
        scaleX:6,
        scaleY:6,
        scaleZ:6
    });
    world.add(wishing);
    treeOb = new OBJ({
            asset: "tree_obj",
            mtl: "tree_mtl",
            x:-10,y:7,z:-2,
            rotationX:0,rotationY:0,
            scaleX:5,
            scaleY:5,
            scaleZ:5,
        });
    world.add(treeOb);
}

function draw(){
    var houseX = 0;
    for(var i=0;i<4;i++){
        var temp = new Smoke(-2+houseX,7,-1-10*i);
        smokes.push(temp);
        
        houseX+=1;
    }
    for(var i=0;i<smokes.length;i++){
        var retVal = smokes[i].move();
        if(retVal == "small"){
            smokes.splice(i,1);
            i-=1;
        }
    }
    
    to.spinY(.5);
    to.spinZ(.5);
    if(mouseIsPressed){
        world.moveUserForward(.05);
    }
    
    container.spinY(1);
}

class Smoke{
    constructor(x,y,z){
        this.mySpawn = new Sphere({
            x:x,y:y,z:z,
            red:128,green:128,blue:128,
            radius:.2
        })
        world.add(this.mySpawn);
        
        this.xOffset = random(1000);
        this.zOffset = random(5000,10000);
    }
    move(){
        var yMov = .01;
        var xMov = map(noise(this.xOffset),0,1,-.01,.01);
        var zMov = map(noise(this.zOffset),0,1,-.01,.01);
        this.xOffset += .01;
        this.zOffset += .01;
        
        this.mySpawn.nudge(xMov,yMov,zMov);
        var boxScale = this.mySpawn.getScale();
        this.mySpawn.setScale(boxScale.x-.005,boxScale.y-.005,boxScale.z-.005);
        
        if(boxScale.x <= 0){
            world.remove(this.mySpawn);
            return "small";
        }
        else{
            return "fine";
        }
    }
}
