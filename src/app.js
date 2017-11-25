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


function create() {

  // game.physics.startSystem(Phaser.Physics.ARCADE);
  // game.physics.arcade.gravity.y = 250;
  game.physics.startSystem(Phaser.Physics.P2JS);



  map = game.add.tilemap('level1');
  map.addTilesetImage('platform1', 'tiles');
  map.setCollisionByExclusion([0]);

  layer = map.createLayer('level1');
  layer.resizeWorld();

  //p2
  game.physics.p2.convertTilemap(map, layer);
  game.physics.p2.restitution = 0;
  game.physics.p2.gravity.y = 300;
  //

  player = game.add.sprite(50, 20, 'player');
  player.animations.add('left', [1, 2, 3, 4], 10, true);
  player.animations.add('jump', [0], 20, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);


  //p2
  game.physics.p2.enable(player);
  player.body.fixedRotation = true;
  //

  game.camera.follow(player);

  cursor = game.add.sprite(game.world.centerX, game.world.centerY, 'cursor');
  // game.physics.p2.enable(cursor,true);
  // cursor.body.static = true;
  // cursor.body.setCircle(1);
  // cursor.body.data.shapes[0].sensor = true;


  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  this.game.canvas.style.cursor = 'none';


  line = new Phaser.Line(player.x, player.y, cursor.x, cursor.y);
  game.input.addMoveCallback(move, this);
  game.input.onDown.add(click, this);
  game.input.onUp.add(release, this);
}

 function click(pointer) {

  var bodies = game.physics.p2.hitTest(pointer.position, [player.body]);


  if (bodies.length) {
    //  Attach to the first body the mouse hit
    mouseSpring = game.physics.p2.createSpring(cursor, bodies[0], 0, 30, 1);
    line.setTo(player.x, player.y, cursor.x, cursor.y);
    drawLine = true;
  }

}

function release() {

  game.physics.p2.removeSpring(mouseSpring);

  drawLine = false;

}

function move(pointer, x, y, isDown) {

  cursor.x = x + game.camera.x;
  cursor.y = y + game.camera.y;
  line.setTo(player.x, player.y, cursor.x, cursor.y);
}


function preRender() {

  if (line) {
    line.setTo(player.x, player.y, cursor.x, cursor.y);
  }

}

function render() {

  if (drawLine) {
    game.debug.geom(line);
  }

}


function createRope(xAnchor, yAnchor, xCursor, yCursor) {
  //if we created our first rect this will contain it
  let height = 16; //height for the physics body - your image height is 8px
  var width = 32;  
  let maxForce = 20000; //the force that holds the rectangles together
  let angle = 0;

  //  player.body.mass = 300;
 

  let gip = 0;
  gip = (Math.sqrt((xAnchor - xCursor) * (xAnchor - xCursor) + (yAnchor -
    yCursor) * (yAnchor - yCursor)));
  angle = ((xCursor - xAnchor)) / gip;
  angle = Math.acos(angle);
  angle = (angle * 180) / Math.PI;
  let length = 10;

  if (yCursor < yAnchor) {
    angle = -angle;
  }

  for (let i = 1; i <= length; i++) {
    let x = xAnchor + (i * Math.cos((angle * Math.PI) / 180) * 32);
    let y = yAnchor + (i * Math.sin((angle * Math.PI) / 180) * 32);

    // Switch sprite every second time

    if (i === length) {
      newRect = game.add.sprite(x, y, 'hook', 1);
      lastRect.bringToTop();
    } else {
      newRect = game.add.sprite(x, y, 'hook', 0);
    }

    

    game.physics.p2.enable(newRect, false);
    newRect.body.angle = angle;
    
            //  Set custom rectangle
            newRect.body.setRectangle(width, height);

            if(checkIfCanHook(newRect)){
              console.log('here');
              newRect = game.add.sprite(x, y, 'hook', 1);
              lastRect.bringToTop();
            }
    
            if (i === length)
            {
                newRect.body.static = true;
                newRect.rotation = true;
            }
            else
            {  
                //  Anchor the first one created
                // newRect.body.mass = length + i;     //  Reduce mass for evey rope element
            }
    
            //  After the first rectangle is created we can add the constraint
            if (lastRect)
            {
                game.physics.p2.createRevoluteConstraint(newRect, [-16, 0], lastRect, [16, 0], maxForce);
            }
            else{
              game.physics.p2.createRevoluteConstraint(newRect, [-16, 0], player, [0, 0], maxForce);
            }
    lastRect = newRect;
    hook.push(lastRect);
  }
}

function forceHook() {
  let length = hook.length;
  game.time.events.repeat(Phaser.Timer.SECOND * 0.1, 9, removeLink, this);

}

function removeLink(){
  let length = hook.length;
  if(length > 0){
    if(length === 10){
      game.physics.p2.world.constraints.splice(0,2);
      game.physics.p2.createRevoluteConstraint(hook[1], [16, 0], player, [0, 0], 1000);
      hook[0].kill();
      hook.splice(0,1);
    }
    else{
      game.physics.p2.world.constraints.splice(0,1);
      game.physics.p2.world.constraints.splice(-1,1);
      game.physics.p2.createRevoluteConstraint(hook[1], [16, 0], player, [0, 0], 1000);
      hook[0].kill();
      hook.splice(0,1);
    }
  
  }
 
}

function clearAllConstraints() {
  var allConstraints = game.physics.p2.world.constraints.splice(0, game.physics.p2.world.constraints.length);
  if (allConstraints.length > 0) {
    for (let i = 0; i <= allConstraints.length; i++) {
      game.physics.p2.removeConstraint(allConstraints[i]);
    }
  }

}



function deleteHook() {
  let length = hook.length;
  clearAllConstraints();
  for(let i = 0; i < length; i++){
    hook[i].kill();
  }
  hook = [];
  lastRect = null;
}

function update() {


  if (cursors.left.isDown) {

    player.body.moveLeft(150);
    // player.body.velocity.x = -150;
    if (facing != 'left') {
      player.animations.play('left');
      facing = 'left';
    }
  } else if (cursors.right.isDown) {

    player.body.moveRight(150);

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
    player.body.velocity.y = -300;
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

  if (game.input.activePointer.isDown && hookTimer === true) {
    createRope(player.x, player.y, cursor.x, cursor.y);
    forceHook();
    hookTimer = false; 
  }

  // if(hook.length){
  //   // moveHook(player.x, player.y);
  //   player.body.velocity.y = -50;
  // }

  if (game.input.activePointer.isUp && hookTimer === false) {
    deleteHook();
  }

  if (game.input.activePointer.isUp) {
    hookTimer = true;
  }


}

function checkIfCanJump() {

  var yAxis = p2.vec2.fromValues(0, 1);
  var result = false;

  for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
    var c = game.physics.p2.world.narrowphase.contactEquations[i];
    if (c.bodyA === player.body.data || c.bodyB === player.body.data) {
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
    console.log(game.physics.p2.world.narrowphase.contactEquations.length);
    var c = game.physics.p2.world.narrowphase.contactEquations[i];
    console.log(c);
    if (c.bodyA === newRect.body.data || c.bodyB === newRect.body.data) {
        result = true;
    }
  }

  return result;
}



