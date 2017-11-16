import 'p2';
import 'pixi';
import 'phaser';
import { images } from './images';
import { levels } from './maps';

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'root', {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  game.load.tilemap('level1', levels.level1, null, Phaser.Tilemap.TILED_JSON);
  game.load.spritesheet('tiles', images.platform1, 16, 16);
  game.load.spritesheet('player', images.player, 32, 32);
}

let map;
let layer;
let player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;

function create() {

  game.physics.startSystem(Phaser.Physics.ARCADE);

  map = game.add.tilemap('level1');
  map.addTilesetImage('platform1', 'tiles');

  map.setCollisionByExclusion([1]);

  layer = map.createLayer('level1');
  layer.resizeWorld();

  game.physics.arcade.gravity.y = 250;
  player = game.add.sprite(50, 20, 'player');

    player.animations.add('left', [ 1, 2, 3, 4],10,true);
    player.animations.add('jump', [0],20,true);
    player.animations.add('right', [ 5, 6, 7, 8],10,true);
    



  game.physics.enable(player, Phaser.Physics.ARCADE);

  player.body.bounce.y = 0.2;
  player.body.collideWorldBounds = true;
  player.body.setSize(16, 16, 5, 16);

  game.camera.follow(player);

  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {

  game.physics.arcade.collide(player, layer);

  player.body.velocity.x = 0;

  if (cursors.left.isDown) {
    player.body.velocity.x = -150;
    if (facing != 'left') {
      player.animations.play('left');
      facing = 'left';
    }
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 150;
    if (facing != 'right') {
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

  if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
    player.animations.stop();
    facing = 'jump';
    player.body.velocity.y = -350;
    jumpTimer = game.time.now + 750;
  }

}
