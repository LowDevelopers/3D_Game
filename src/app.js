import 'p2';
import 'pixi';
import 'phaser';
import logo from './logo.png'
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'root', { preload: preload, create: create });

function preload() {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    game.load.image('logo', logo);

}

function create() {

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    var s = game.add.sprite(80, 0, 'logo');

}
