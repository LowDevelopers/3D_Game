import 'p2';
import 'pixi';
import 'phaser';
import AssetsLoader from './utils/AssetsLoader';

let game = new Phaser.Game(800, 600, Phaser.CANVAS, 'root', {
  preload: preload,
  create: create,
  update: update,
  preRender: preRender,
  render: render  
});


function preload() {
  const assetsLoader = new AssetsLoader(game);
  assetsLoader.getAssets();
}

let map;
let layer;
let player;
let hook = [];
let facing = 'left';
let jumpTimer = 0;
let cursors;
let jumpButton;
let bg;
let cursor;
let doublejump = true;
let firstJumpTimer = 0;
let mouseBody;
let newRect;
let lastRect;
let hookTimer = true;
let line;
let mouseSpring;
var drawLine = false;
let fireArrow;
let fireButton;
let left;
let right;
let angle;
let graphics;
let layerConstick;
let flagFirstStart;
let flagFirstEnd;
let flagSecondStart;
let flagSecondEnd;
let flagThirdStart;
let flagThirdEnd;
let checkPointX;
let checkPointY;
let infoButton;

function create() {

  // game.physics.startSystem(Phaser.Physics.ARCADE);
  // game.physics.arcade.gravity.y = 250;
  game.physics.startSystem(Phaser.Physics.P2JS);

  map = game.add.tilemap('level1');
  map.addTilesetImage('generic_deathtiles','tiles2');
  
  map.addTilesetImage('grass_main','tiles1');
  layer = map.createLayer('grass');
  map.setCollisionBetween(1,400,layer);
  // map.setCollisionBetween(3221225000,3221227000,layer);
  map.setCollisionBetween(1059,1060,layer);
  
  layer.resizeWorld();
  game.physics.p2.convertTilemap(map, layer);


  game.physics.p2.restitution = 0;
  game.physics.p2.gravity.y = 300;



  //

  player = game.add.sprite(300, 340, 'player');
  checkPointX = 300;
  checkPointY = 340;
  // game.physics.enable(player, Phaser.Physics.ARCADE);
  player.animations.add('left', [1, 2, 3, 4], 10, true);
  player.animations.add('jump', [0], 20, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);


  //p2
  game.physics.p2.enable(player);
  // game.physics.arcade.enable(player);

  player.body.fixedRotation = true;
  player.body.collideWorldBounds = true;
  game.camera.follow(player);

  cursor = game.add.sprite(game.world.centerX, game.world.centerY, 'cursor');

  cursors = game.input.keyboard.createCursorKeys();

 

  game.physics.p2.enable(cursor);
  // game.physics.arcade.enable(cursor);
    
  cursor.body.collideWorldBounds = false;
  cursor.body.static = true;

  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.F);
  left = game.input.keyboard.addKey(Phaser.Keyboard.A);
  right = game.input.keyboard.addKey(Phaser.Keyboard.D);
  infoButton = game.input.keyboard.addKey(Phaser.Keyboard.C);

  this.game.canvas.style.cursor = 'none';
  line = new Phaser.Line(player.x, player.y, cursor.body.x, cursor.body.y);
  
  graphics = game.add.graphics(0,0);
  game.input.onUp.add(release, this);
  game.input.addMoveCallback(move, this);
  // game.physics.p2.setPostBroadphaseCallback(checkCaustic, this);

  flagFirstStart = game.add.sprite(300,320,'flagStart');
  flagFirstEnd = game.add.sprite(1300,1217,'flagEnd');
  flagSecondStart = game.add.sprite(1120,1217,'flagStart');
  flagSecondEnd = game.add.sprite(1730,1730,'flagEnd');
  flagThirdStart = game.add.sprite(2000,1730,'flagStart');
  flagThirdEnd = game.add.sprite(2925,2947,'flagEnd');

}

  

  function pushHook(playerX, playerY,  cursorX,  cursorY){
    angle = 0; 
    let gip = 0;
    let height = 8; //height for the physics body - your image height is 8px
    var width = 16;  
  
  
    gip = (Math.sqrt((playerX - cursorX) * (playerX - cursorX) + (playerY -
      cursorY) * (playerY - cursorY)));
    angle = ((cursorX - playerX)) / gip;
    angle = Math.acos(angle);
    angle = (angle * 180) / Math.PI;
  
  
    if (cursorY < playerY) {
      angle = -angle;
    }
      if(fireArrow){
        let hyp = 0;
        hyp = (Math.sqrt((player.x - fireArrow.x) * (player.x - fireArrow.x) + (player.y -
          fireArrow.y) * (player.y - fireArrow.y)));
          if(hyp > 250){
            release();
            return;
          }
    if(checkIfCanHook(fireArrow)){
      createHook(fireArrow.x,fireArrow.y)
    }else{
      fireArrow.body.velocity.x = fireArrow.body.x - playerX+ (30 * Math.cos((angle * Math.PI) / 180) * 32);
      fireArrow.body.velocity.y = fireArrow.body.y -  playerY + (30* Math.sin((angle * Math.PI) / 180) * 32); 
    }
   }
   else{
     let x = playerX + (1 * Math.cos((angle * Math.PI) / 180) * 64);
     let y = playerY + (1 * Math.sin((angle * Math.PI) / 180) * 64);
 
    fireArrow = game.add.sprite(x, y, 'hook', 1)
    game.physics.p2.enable(fireArrow);
    fireArrow.body.setRectangle(width, height);
    // fireArrow.body.angle = angle;
    drawLine = true;
    // fireArrow.body.static = true;
   }
  }

  function createHook(cursorX,  cursorY){
    mouseSpring = game.physics.p2.createSpring(fireArrow,player ,20,7,0);
   
    // mouseSpring = game.physics.p2.createDistanceConstraint(fireArrow,player ,200);
    hookTimer = false;
  }

  function changeAngle(){
    angle = 0; 
    let gip = 0;
    gip = (Math.sqrt((player.x - fireArrow.x) * (player.x - fireArrow.x) + (player.y -
      fireArrow.y) * (player.y - fireArrow.y)));
    angle = ((fireArrow.x - player.x)) / gip;
    angle = Math.acos(angle);
    angle = (angle * 180) / Math.PI;
  
    if (fireArrow.y < player.y) {
      angle = -angle;
    }
    fireArrow.body.angle = angle;
  }

function release() {

      if(fireArrow){
        game.physics.p2.removeSpring(mouseSpring);
        drawLine = false;
        fireArrow.kill();
        fireArrow = null;
        hookTimer = false;
      }
  }
  
  function preRender() {
      if(fireArrow){
        if (line)
        {
            graphics = game.add.graphics(0,0);
            if(graphics){
              graphics.lineStyle(4, 0x3D3D3D);
              graphics.moveTo(player.body.x - game.camera.x,player.body.y - game.camera.y);
              graphics.lineTo(fireArrow.x - game.camera.x,fireArrow.y - game.camera.y);
              graphics.endFill();
            }
           
        }
      }

      
  
  }
  
  function render() {
  
      if (drawLine)
      {
          graphics.kill();
      }
  
  }


function move(pointer, x, y, isDown) {
  cursor.body.x = x + game.camera.x;
  cursor.body.y = y + game.camera.y;
  // line.setTo(player.x, player.y, cursor.x, cursor.y);
}

// function fire(xAnchor, yAnchor, xCursor, yCursor){
//    xA = xAnchor;
//    yA = yAnchor;
//    angle = 0; 
//   let gip = 0;
//   let height = 8; //height for the physics body - your image height is 8px
//   var width = 16;  


//   gip = (Math.sqrt((xAnchor - xCursor) * (xAnchor - xCursor) + (yAnchor -
//     yCursor) * (yAnchor - yCursor)));
//   angle = ((xCursor - xAnchor)) / gip;
//   angle = Math.acos(angle);
//   angle = (angle * 180) / Math.PI;


//   if (yCursor < yAnchor) {
//     angle = -angle;
//   }

//   // for(let i = 0; i < 9; i++){
//   //   addHook(x, y,angle);
//   // }

//   game.time.events.repeat(Phaser.Timer.SECOND * 0.07, 7, addHook, this);

// //  if(hook.length > 8){
// //     deleteHook();
// //   }

// }

// function addHook(){
//     let gip = 0;
  
//     if(fireArrow){
//       gip = (Math.sqrt((xA - fireArrow.body.x) * (xA - fireArrow.body.x) + (yA -
//         fireArrow.body.y) * (yA - fireArrow.body.y)));
//       if(gip > 310){
//         deleteHook();
//         return;
//       }
//     }
  
//   let height = 8; //height for the physics body - your image height is 8px
//   var width = 16;  
//   let x = xA + (1 * Math.cos((angle * Math.PI) / 180) * 32);
//   let y = yA + (1 * Math.sin((angle * Math.PI) / 180) * 32);
//   if(fireArrow){
//     if(checkIfCanHook(fireArrow)){
     
//     }else{
//       fireArrow.body.velocity.x = fireArrow.body.x - xA + (45 * Math.cos((angle * Math.PI) / 180) * 32);
//       fireArrow.body.velocity.y = fireArrow.body.y -  yA + (45* Math.sin((angle * Math.PI) / 180) * 32);
//       newRect = game.add.sprite(x,y, 'hook', 0);    
//       game.physics.p2.enable(newRect);
//       newRect.body.setRectangle(width, height);
//       newRect.body.angle = angle;   
//       game.physics.p2.createRevoluteConstraint(lastRect, [-8, 0],newRect, [8, 0],800);
//       lastRect = newRect;
//       hook.push(lastRect);
//     }
//       //  lastRect.body.static = true;
//    }
//    else{
//      let x = xA + (1 * Math.cos((angle * Math.PI) / 180) * 96);
//      let y = yA + (1 * Math.sin((angle * Math.PI) / 180) * 96);
 
//     fireArrow = game.add.sprite(x, y, 'hook', 1)
//     game.physics.p2.enable(fireArrow);
//     fireArrow.body.setRectangle(width, height);
//     fireArrow.body.angle = angle;
//     lastRect = fireArrow;
//     hook.push(fireArrow);
//    }
// }



// function createRope(xAnchor, yAnchor, xCursor, yCursor) {
//   //if we created our first rect this will contain it
//   let height = 16; //height for the physics body - your image height is 8px
//   var width = 32;  
//   let maxForce = 20000; //the force that holds the rectangles together
//   let angle = 0;

//   //  player.body.mass = 300;
 

//   let gip = 0;
//   gip = (Math.sqrt((xAnchor - xCursor) * (xAnchor - xCursor) + (yAnchor -
//     yCursor) * (yAnchor - yCursor)));
//   angle = ((xCursor - xAnchor)) / gip;
//   angle = Math.acos(angle);
//   angle = (angle * 180) / Math.PI;
//   let length = 10;

//   if (yCursor < yAnchor) {
//     angle = -angle;
//   }

//   for (let i = 1; i <= length; i++) {
//     let x = xAnchor + (i * Math.cos((angle * Math.PI) / 180) * 32);
//     let y = yAnchor + (i * Math.sin((angle * Math.PI) / 180) * 32);

//     // Switch sprite every second time

//     if (i === length) {
//       newRect = game.add.sprite(x, y, 'hook', 1);
      
//       lastRect.bringToTop();
//     } else {
//       newRect = game.add.sprite(x, y, 'hook', 0);
      
//     }

  
//     game.physics.p2.enable(newRect);
//    newRect.body.setRectangle(width, height);

//    if(checkIfCanHook(newRect)){
//     console.log(newRect.body.x);
//   }
//    newRect.body.angle = angle;

//             if(newRect.x !== x){
//               console.log('hete');
//             }           
    
//             if (i === length)
//             {
//                 newRect.body.static = true;
//             }
//             else{
//               // newRect.body.static = true;
//             }
    
//             if (lastRect)
//             {
//                 game.physics.p2.createRevoluteConstraint(newRect, [-16, 0], lastRect, [8, 0], maxForce);
//             }
//             else{
//               game.physics.p2.createRevoluteConstraint(newRect, [-16, 0], player, [0, 0], maxForce);
//             }
//     lastRect = newRect;
//     hook.push(lastRect);
//   }
// }


// function forceHook() {
//   console.log(hook);
//   game.time.events.repeat(Phaser.Timer.SECOND * 0.6, hookLength, removeLink, this);

// }

// function removeLink(){
//   let length = hook.length;
//   // if(length > 3){
//   //   if(hook[length-1]){

    
//   //   // if(length === hookLength){
//   //   //   game.physics.p2.world.constraints.splice(0,2);
//   //   //   game.physics.p2.createRevoluteConstraint(hook[1], [16, 0], player, [0, 0], 1500);
//   //   //   hook[0].kill();
//   //   //   hook.splice(0,1);
//   //   // }
//   //   // else{
//   //   //   if(hook[1]){
//   //   //   game.physics.p2.world.constraints.splice(0,1);
//   //   //   game.physics.p2.world.constraints.splice(-1,1);
//   //   //   game.physics.p2.createRevoluteConstraint(hook[1], [16, 0], player, [0, 0], 1500);
//   //   //   hook[0].kill();
//   //   //   hook.splice(0,1);
//   //   // } 
//   //   // }
//   //   game.physics.p2.world.constraints.splice(-2,2);
//   //   game.physics.p2.createRevoluteConstraint(hook[length-2], [16, 0], player, [0, 0], 1500);
//   //   hook[length-1].kill();
//   //   hook.splice(-1,1);
//   // }
//   // }
//     if(length>=2){
//       game.physics.p2.world.constraints.splice(-2,2);
//       game.physics.p2.createRevoluteConstraint(hook[length-2], [8, 0], player, [0, 0], 800);
//       // hook[length-1].kill();
//       // hook.splice(-1,1);
//     }
// }

// function clearAllConstraints() {
//   var allConstraints = game.physics.p2.world.constraints.splice(0, game.physics.p2.world.constraints.length);
//   if (allConstraints.length > 0) {
//     for (let i = 0; i <= allConstraints.length; i++) {
//       game.physics.p2.removeConstraint(allConstraints[i]);
//     }
//   }

// }



// function deleteHook() {
//   let length = hook.length;
//   clearAllConstraints();
//   for(let i = 0; i < length; i++){
//     hook[i].kill();
//   }
//   hook = [];
//   lastRect = null;
//   fireArrow = null;
// }

function update() {
  // game.physics.arcade.collide(player, layer);

  if(fireArrow){
    changeAngle();
  }

  if (left.isDown) {

    player.body.moveLeft(230);
    // player.body.velocity.x = -150;
    if (facing != 'left') {
      player.animations.play('left');
      facing = 'left';
    }
  } else if (right.isDown) {

    player.body.moveRight(230);

    if (facing != 'right') {
      player.animations.play('right');
      facing = 'right';
    }
  } else {
    player.body.velocity.x = 0;
    if (facing != 'idle') {
      player.animations.stop();
      if (facing == 'left') {
        player.frame = 1;
      } else {
        player.frame = 5;
      }
      facing = 'idle';
    }
  }

  if (!(checkIfCanJump()) && game.time.now < jumpTimer) {
    player.frame = 0;
  }

  if (jumpButton.isDown && !(checkIfCanJump()) && doublejump === true && game.time
    .now > firstJumpTimer) {
    player.body.velocity.y = -250;
    doublejump = false;
  }

  if (checkIfCanJump()) {
    doublejump = true;
  }

  if (jumpButton.isDown && checkIfCanJump() && game.time.now > jumpTimer) {
    player.body.velocity.y = -300;
    jumpTimer = game.time.now + 750;
    firstJumpTimer = game.time.now + 200;
  }


  if(game.input.activePointer.isDown && hookTimer === true){
    // click(player.x, player.y,  cursor.x,  cursor.y);
    // hookTimer = false;
    pushHook(player.x, player.y,  cursor.x,  cursor.y);
  }

  if(game.input.activePointer.isUp && hookTimer === false){
    hookTimer = true;
  }

  if(Math.abs(player.body.x - flagFirstEnd.x) <= 20 && Math.abs(player.body.y - flagFirstEnd.y) <= 50){
    checkPointX = 1120;
    checkPointY = 1215;
    player.body.x = checkPointX;
    player.body.y = checkPointY;
  }

  if(Math.abs(player.body.x - flagSecondEnd.x) <= 20 && Math.abs(player.body.y - flagSecondEnd.y) <= 50){
    checkPointX = 2000;
    checkPointY = 1740;
    player.body.x = checkPointX;
    player.body.y = checkPointY;
  }

  if(infoButton.isDown){
    console.log(player.body.x);
    console.log(player.body.y);
  }




  // if (game.input.activePointer.isDown && hookTimer === true) {
  //   // createRope(player.x, player.y, cursor.x, cursor.y);
  //   fire(player.x, player.y, cursor.x, cursor.y);
  //   hookTimer = false;
  // }

  // if (game.input.activePointer.isUp  && hookTimer === false) {
  //   deleteHook();
  //   hookTimer = true;
  // }

  // if (game.input.activePointer.isUp) {
  //   if(hook.length){
  //   deleteHook();
  //   } 
  // }

}

function restart(){
  release();
  player.body.x = checkPointX;
  player.body.y = checkPointY;
}

function checkIfCanJump() {

  var yAxis = p2.vec2.fromValues(0, 1);
  var result = false;

  for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
    var c = game.physics.p2.world.narrowphase.contactEquations[i];
    if (c.bodyA === player.body.data || c.bodyB === player.body.data) {
      // console.log('a',c.bodyA.id);
      // console.log('b',c.bodyB.id);
      if(c.bodyA.id === 41 || c.bodyA.id === 52 || c.bodyA.id === 72 || c.bodyA.id === 61 || c.bodyA.id === 78 || c.bodyA.id === 67 || c.bodyA.id === 110 || c.bodyA.id === 81 || c.bodyA.id === 94
      || c.bodyA.id === 84 || c.bodyA.id === 100 || (c.bodyA.id >= 102 && c.bodyA.id <= 160) || (c.bodyA.id >= 183 && c.bodyA.id <= 196) || (c.bodyA.id >= 198 && c.bodyA.id <= 255) || (c.bodyA.id >= 256 && c.bodyA.id <= 274) || c.bodyA.id === 162 || c.bodyA.id === 157
      || c.bodyA.id === 146 || c.bodyA.id === 162 || c.bodyA.id === 147 || c.bodyA.id === 141 || c.bodyA.id === 136 || c.bodyA.id === 163 || c.bodyA.id === 176 
      || c.bodyA.id === 205 || c.bodyA.id === 209 || c.bodyA.id === 217 || c.bodyA.id === 221 || c.bodyA.id === 225 || c.bodyA.id === 234 || c.bodyA.id === 253 || c.bodyA.id === 242 ){
        restart();
        return;
      }
      var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
      if (c.bodyA === player.body.data) d *= -1;
      if (d > 0.5) result = true;
    }
  }

  return result;

}


function checkIfCanHook(newRect){
  
  var yAxis = p2.vec2.fromValues(0, 1);
  var result = false;

  for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
    var c = game.physics.p2.world.narrowphase.contactEquations[i];
    if (c.bodyA === newRect.body.data || c.bodyB === newRect.body.data) {
      console.log('a',c.bodyA.id);
      console.log('b',c.bodyB.id);
      
        result = true;
        newRect.body.velocity.x = 0;
        newRect.body.velocity.y = 0;
        newRect.body.static = true;
      }
    if(newRect.body.data === player.body.data){
      result = false;
    }
  }
  // if(result === true){
  //   forceHook();
  // }
    return result;
}



