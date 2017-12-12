import { images } from '../images';
import { levels } from '../maps';

export default class AssetsLoader{
    constructor(game){
        this.game = game;
    }
    getAssets(){
        this.game.load.tilemap('level1', levels.level1, null, Phaser.Tilemap.TILED_JSON);
        // this.game.load.spritesheet('tiles', images.platform1, 16, 16);
        this.game.load.spritesheet('player', images.player, 32, 32);
        this.game.load.image('cursor',images.cursor);
        this.game.load.spritesheet('hook',images.hook,16,8);
        this.game.load.spritesheet('tiles1',images.grass_main,32,32);
        this.game.load.spritesheet('tiles2',images.generic_deathtiles,32,32);
        this.game.load.spritesheet('flagStart',images.flag_start,32,64);
        this.game.load.spritesheet('flagEnd',images.flag_end,32,64);
    }
}