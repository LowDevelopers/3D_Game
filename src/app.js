import 'p2';
import 'pixi';
import 'phaser';
import { images } from './images';
import { levels } from './maps';

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'root', { preload: preload, create: create });

function preload() {
    game.load.image('logo', images.logo);
}

function create() {
    game.add.sprite(80, 0, 'logo');
}
