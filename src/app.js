import 'p2';
import 'pixi';
import 'phaser';
import { images } from './images';
import { levels } from './maps';

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'root', { preload: preload, create: create });

function preload() {
    game.load.tilemap('level1', levels.level1, null, Phaser.Tilemap.TILED_JSON);
    game.load.image('logo', images.platform1);
}

function create() {
    game.add.sprite(80, 0, 'logo');
}
