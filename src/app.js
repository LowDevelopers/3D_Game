import 'p2';
import 'pixi';
import 'phaser';
import AssetsLoader from './utils/AssetsLoader';

let game = new Phaser.Game(800, 600, Phaser.AUTO, 'root', {
  preload: preload,
  create: create,
  update: update
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


function create() {

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 250;

  map = game.add.tilemap('level1');
  map.addTilesetImage('platform1', 'tiles');
  map.setCollisionByExclusion([1]);

  layer = map.createLayer('level1');
  layer.resizeWorld();

  


  player = game.add.sprite(50, 20, 'player');
  player.animations.add('left', [ 1, 2, 3, 4],10,true);
  player.animations.add('jump', [0],20,true);
  player.animations.add('right', [ 5, 6, 7, 8],10,true);
    

  game.physics.enable(player, Phaser.Physics.ARCADE);

  player.body.bounce.y = 0.2;
  player.body.collideWorldBounds = true;
  player.body.setSize(16, 16, 5, 16);


  game.camera.follow(player);
  cursor = game.add.sprite( game.world.centerX, game.world.centerY, 'cursor');
  game.input.addMoveCallback(move, this);

  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  this.game.canvas.style.cursor = 'none';


 
}

function createRope(xAnchor,yAnchor,xCursor,yCursor){
        //if we created our first rect this will contain it
      let height = 20;  //height for the physics body - your image height is 8px
      let maxForce =20000;  //the force that holds the rectangles together
      let angle = 0;

      

      let gip = 0;
      gip = (Math.sqrt((xAnchor - xCursor)*(xAnchor - xCursor) + (yAnchor - yCursor)*(yAnchor - yCursor)));
      console.log(gip);
      angle = ((xCursor - xAnchor))/gip; 
      // angle = ((xAnchor - xCursor))/gip;
      console.log(angle);
      angle = Math.acos(angle);
      console.log(angle);
      angle = (angle*180)/Math.PI;
      let length = 10;

      if(yCursor < yAnchor){
        angle = -angle;
      }
       
      // angle =  Math.atan( ( yCursor - yAnchor ) / (xCursor - xAnchor ) ) * ( 180 / Math.PI )
      console.log(angle);
  
      for (let i = 0; i <= length; i++)
      {
          let x = xAnchor + (i * Math.cos((angle*Math.PI)/180)*32);
          let y = yAnchor + (i * Math.sin((angle*Math.PI)/180)*32);
          
          // Switch sprite every second time
          
          if (i === length) {
              newRect = game.add.sprite(x, y, 'hook', 1);
              newRect.angle = angle;
              lastRect.bringToTop();
          } else {
              newRect = game.add.sprite(x, y, 'hook', 0);
              newRect.angle = angle;
          }  
          lastRect = newRect;
          hook.push(lastRect);

      }
  }

function move(x, y) {
          cursor.x = game.input.mouse.event.x - 299 + game.camera.x;
          cursor.y = game.input.mouse.event.y - 16 + game.camera.y;       
  }

  function deleteHook(){
    let length = hook.length;
    
    for(let i = 0; i < length; i++){
      hook[i].kill();
    }
    }

function update() {

  game.physics.arcade.collide(player, layer);

  player.body.velocity.x = 0;

  // hook.x = player.x + 8;
  // hook.y = player.y + 8;

  if (cursors.left.isDown) {
    player.body.velocity.x = -150;
    if (facing != 'left'   && player.body.onFloor()) {
      player.animations.play('left');
      facing = 'left';
    }
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 150;
    if (facing != 'right'   && player.body.onFloor()) {
      player.animations.play('right');
      facing = 'right';
    }
  } else {
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

  if(!(player.body.onFloor()) && game.time.now < jumpTimer){
    player.frame = 0;
  }

  if(jumpButton.isDown && !(player.body.onFloor()) &&  doublejump === true && game.time.now > firstJumpTimer){
    player.body.velocity.y = -300;
    doublejump = false;
  }

  if(player.body.onFloor()){
    doublejump = true;
  }

  if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
    player.body.velocity.y = -300;
    jumpTimer = game.time.now + 750;  
    firstJumpTimer = game.time.now + 200;
    
  }

  if (game.input.activePointer.isDown && hookTimer === true)
  {
    createRope(player.x, player.y,cursor.x,cursor.y);
    hookTimer = false;
  }

  if(game.input.activePointer.isUp && hookTimer === false){
    console.log('asd');
    deleteHook();
  }

  if(game.input.activePointer.isUp){
    hookTimer = true;
  }


}


