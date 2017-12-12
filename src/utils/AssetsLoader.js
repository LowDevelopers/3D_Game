import { images } from '../images';
import { levels } from '../maps';
import { audio } from '../audio';

export default class AssetsLoader{
    constructor(game){
        this.game = game;
    }
    getAssets(){
        this.game.load.tilemap('level1', levels.level1, null, Phaser.Tilemap.TILED_JSON);
        this.game.load.spritesheet('player', images.player, 32, 32);
        this.game.load.image('cursor',images.cursor);
        this.game.load.spritesheet('hook',images.hook,16,8);
        this.game.load.spritesheet('tiles1',images.grass_main,32,32);
        this.game.load.spritesheet('tiles2',images.generic_deathtiles,32,32);
        this.game.load.spritesheet('flagStart',images.flag_start,32,64);
        this.game.load.spritesheet('flagEnd',images.flag_end,32,64);
        this.game.load.spritesheet('bg_cloud1',images.bg_cloud1,32,32);
        this.game.load.spritesheet('bg_cloud2',images.bg_cloud2,32,32);
        this.game.load.spritesheet('bg_cloud3',images.bg_cloud3,32,32);
        this.game.load.image('backgroundMenu',images.backgroundMenu);
        this.game.load.image('startGameButton',images.startGameButton);
        this.game.load.image('settingsButton',images.settingsButton);
        this.game.load.image('buttonA',images.buttonA);
        this.game.load.image('buttonD',images.buttonD);
        this.game.load.image('buttonSpace',images.buttonSpace);
        this.game.load.image('buttonMouse',images.buttonMouse);
        this.game.load.image('buttonEsc',images.buttonEsc);
        this.game.load.image('backButton',images.backButton);

        this.game.load.audio('music_menu', audio.music_menu);
        this.game.load.audio('button_click', audio.button_click);
        this.game.load.audio('music_jump', audio.music_jump);
        this.game.load.audio('hook_attach', audio.hook_attach);
        this.game.load.audio('hook_noattach', audio.hook_noattach);
        this.game.load.audio('death', audio.death);
        this.game.load.audio('foot', audio.foot);
        this.game.load.audio('land', audio.land);
    }
}