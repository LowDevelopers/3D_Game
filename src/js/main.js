import 'p2';
import 'pixi';
import 'phaser';
import Game from './app.js';
import Menu from './menu.js';
import Settings from './settings.js';
import Win from './win.js';

let game;
game = new Phaser.Game(800, 600, Phaser.CANVAS, 'root');
game.state.add('Menu', Menu);
game.state.add('Game', Game);
game.state.add('Settings', Settings);
game.state.add('Win', Win);
// game.state.add('Intro', Intro);
game.state.start('Menu');

export default game;