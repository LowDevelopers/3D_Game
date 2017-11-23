import { images } from '../images';
import { levels } from '../maps';

export default class AssetsLoader{
    constructor(game){
        this.game = game;
    }
    getAssets(){
        this.game.load.tilemap('level1', levels.level1, null, Phaser.Tilemap.TILED_JSON);
        this.game.load.spritesheet('tiles', images.platform1, 16, 16);
        this.game.load.spritesheet('player', images.player, 32, 32);
        this.game.load.image('cursor',images.cursor);
        this.game.load.spritesheet('hook',images.hook,32,26);
    }
}