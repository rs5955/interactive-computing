var world;
var house1;
var cloudsArr = [];
var bonsaiArr = [];
var steamArr = [];
var dog1,dog2;
var poolCont;

//SOUNDS
var dogBark,bgMusic,walkSound;

function preload(){
    soundFormats("ogg","mp3");
    dogBark = loadSound("sounds/dogBark.mp3");
    dogBark.setVolume(.5);
    bgMusic = loadSound("sounds/bgMusic.mp3");
    bgMusic.setVolume(8);
    walkSound = loadSound("sounds/walk.mp3");
}
function setup(){
    noCanvas(); //remove canvas
    world = new World('VRScene'); //refer to the html a-scene
    bgMusic.loop();
    var g = new Plane({
        x:0,y:0,z:0,
        width:80,height:80,
        rotationX:-90,rotationY:90,
        asset: "grass",repeatX:100,repeatY:100
    });
    world.add(g);
    var backWall = new Plane({
       x:0,y:.1,z:15,
        width:80,height:5,
        rotationX:180,rotationY:0,
        side:"double",
        asset:"dirt",repeatX:80,repeatY:1
    });
    world.add(backWall);
    var wallLeft = new Plane({
       x:-20,y:.1,z:-20,
        width:80,height:5,
        rotationX:0,rotationY:90,
        side:"double",
        asset:"dirt",repeatX:80,repeatY:1
    });
    world.add(wallLeft);
    var wallRight = new Plane({
       x:20,y:.1,z:-20,
        width:80,height:5,
        rotationX:0,rotationY:90,
        side:"double",
        asset:"dirt",repeatX:80,repeatY:1
    });
    world.add(wallRight);
    var wallFront = new Plane({
       x:0,y:.1,z:-35,
        width:80,height:5,
        rotationX:0,rotationY:0,
        side:"double",
        asset:"dirt",repeatX:80,repeatY:1
    });
    world.add(wallFront);
    poolCont = new Container3D({
        x:0,y:.1,z:-18,
    })
//rectangular pool
//    var pool = new Plane({
//        x:0,y:.07,z:0,
//        width:10,height:4,
//        rotationX:-90,rotationY:90,
//        asset:"water",
//        repeatX:1,repeatY:1,
//    });
    //circular pool
    var pool = new Circle({
        x:0,y:0,z:0,
        radius:3,
        asset:"water",
        side:"double",
        rotationX:90,   
    })
    world.add(poolCont);
    poolCont.addChild(pool);
//    var sign = new Box({
//        x:0,y:.3,z:-1,
//        width:1,height:.7,depth:.1,
//        red:182,green:155,blue:76,
//        clickFunction: function(e){
//            e.setRed(255);
//        }
//        
//    });
//    world.add(sign);
    
    torii = new OBJ({
            asset: "torii_obj",
            mtl: "torii_mtl",
            x:0,y:3,z:-2,
            rotationX:0,rotationY:0,
            scaleX:1.4,
            scaleY:1.4,
            scaleZ:1.4,
        });
    world.add(torii);
    bonsai = new OBJ({
            asset: "bonsai_obj",
            mtl: "bonsai_mtl",
            x:0,y:3,z:7,
            rotationX:0,rotationY:0,
            scaleX:8,
            scaleY:8,
            scaleZ:8,
        });
    world.add(bonsai);
    bonsaiArr.push(new Bonsai(10,10));
    
    new Bonsai(-2,0,90);
    new Bonsai(2,0,0);
    //gardens
    new Garden(-10,10);
    new Garden(-10,-2);
    new Garden(-10,-14);
    new Garden(-10,-26);
    new Garden(10,10);
    new Garden(10,-2);
    new Garden(10,-14);
    new Garden(10,-26);
    house1 = new House(0,-10);
    for(var i=0;i<random(20,30);i++){
        cloudsArr.push(new Clouds());
    }
    dog1 = new Dog(2,-2);
    dog2 = new Dog(3,-10);
}
function draw(){
    if(mouseIsPressed){
        world.moveUserForward(.08);
        if(!walkSound.isPlaying()){
            walkSound.play();
        }
    }
    for(var i=0;i<cloudsArr.length;i++){
        cloudsArr[i].move();
    }
    dog1.move();
    dog2.move();    
    var steam1 = new Steam(0,-18);
    steamArr.push(steam1);
    for(var i=0;i<steamArr.length;i++){
        var retVal = steamArr[i].move();
        if(retVal == "small"){
            steamArr.splice(i,1);
            i-=1;
        }
    }
}
class Bonsai{
    constructor(x,z,rY){
        this.obj = new OBJ({
            asset: "bonsai_obj",
            mtl: "bonsai_mtl",
            x:x,y:.5,z:z,
            rotationX:0,rotationY:rY,
            scaleX:.75,
            scaleY:.75,
            scaleZ:.75,
        });
    world.add(this.obj);
    }
}
class Garden{
    constructor(x,z){
        this.box = new Box({
            x:x,y:0,z:z,
            width:10,height:.1,depth:10,
            asset:"stone",
            repeatX:10,repeatY:10
        });
        world.add(this.box);
        new Bonsai(x-4,z-4,90);
        new Bonsai(x-4,z+4,-90);
        new Bonsai(x+4,z-4,-90);
        new Bonsai(x+4,z+4,90);
        new Sakura(x,z);
        this.moveObj = new Box({
            x:x,y:1.5,z:z,
            width:2,height:3,depth:2,
            red:255,green:255,blue:255,
            opacity:0,
            clickFunction: function(e){
                world.slideToObject(e,1000);
                e.hide();
            }
        });
        world.add(this.moveObj);
        new Dirt(5,5,x,z);
    }
}

class Sakura{
    constructor(x,z){
        this.obj = new OBJ({
            asset: "sakura_obj",
            mtl: "sakura_mtl",
            x:x,y:3,z:z,
            rotationX:0,rotationY:0,
            scaleX:4,
            scaleY:4,
            scaleZ:4,
        });
    world.add(this.obj);
    }
}
class House{
    constructor(x,z){
        this.obj = new OBJ({
            asset: "house_obj",
            mtl: "house_mtl",
            x:x,y:1.25,z:z,
            rotationX:0,rotationY:60,
            scaleX:3,
            scaleY:3,
            scaleZ:3,
        });
    world.add(this.obj);
    }
}
class Clouds{
    constructor(){
        this.box = new Box({
            x:random(-50,50),y:10,z:random(-50,50),  
            red:255,green:255,blue:255,
            width:random(1,2),height:random(.1,.3),depth:random(1,3),
        });
        world.add(this.box);
    }
    move(){
        if(this.box.getZ()<10){
            this.box.nudge(0,0,.02);
        }
        else{
            this.box.setZ(-50);
        }
    }
} 
class Dirt{
    constructor(w,h,x,z){
        this.floor = new Plane({
            x:x,y:.1,z:z,
            width:w,height:h,
            asset:"dirt",
            repeatX:w,repeatY:h,
            rotationX:-90,
        });
        world.add(this.floor);
    }
}
class Dog{
    constructor(x,z){
        this.x=x;
        this.z=z;
        this.speedX = random(.005,.007);
        this.speedZ = random(.005,.007);
        this.cont = new Container3D({
            x:x,y:0,z:z
        });
        this.obj = new OBJ({
            asset: "dog_obj",
            mtl: "dog_mtl",
            x:0,y:0,z:0,
            rotationX:0,rotationY:0,
            scaleX:.001,
            scaleY:.001,
            scaleZ:.001,
        });
        this.box = new Box({
            x:0,y:0,z:0,
            width:.5,height:1.5,depth:1,
            opacity:0,
            clickFunction: function(e){
                if(dogBark.isPlaying()==false){
                    dogBark.play();
                }
            }
        });
        world.add(this.cont);
        this.cont.addChild(this.obj);
        this.cont.addChild(this.box);
    }
    move(){
        if(this.cont.getX()-this.x>2){
            this.speedX *= -1;
            this.cont.rotateY(180);
        }
        if(this.cont.getX()-this.x<-2){
            this.speedX *= -1;
            this.cont.rotateY(0);
        }
        if(this.cont.getZ()-this.z>2){
            this.speedZ *= -1;
            this.cont.rotateY(180);
        }
        if(this.cont.getZ()-this.z<-2){
            this.speedZ *= -1;
            this.cont.rotateY(0);
        }
        this.cont.nudge(this.speedX,0,this.speedZ);
    }
}
class Steam{
    constructor(x,z){
        this.mySpawn = new Sphere({
            x:x,y:.1,z:z,
            red:64,green:164,blue:223,
            opacity:.6,
            radius:.02, 
        });
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
