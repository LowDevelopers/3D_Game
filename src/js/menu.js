import AssetsLoader from '../utils/AssetsLoader';
import game from './main.js';


let load_complete = false;
let menuMusic, musicOn = false;
let clickMusic;
const Menu = {
    preload: function(){
        this.load.onLoadStart.add(loadMenuStart, this);
        this.load.onFileComplete.add(fileMenuComplete, this);
        this.load.onLoadComplete.add(loadMenuComplete, this);
        const assetsLoader = new AssetsLoader(Menu);
        assetsLoader.getAssets();
      },
    create: function() {
        const background = this.add.sprite(0, 0, 'backgroundMenu')
        const style = {
            font: "bold 55px Algerian",
            fill: 'chocolate',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        const menu_text = this.add.text(400, 80, "HOOK LIFE", style);
        menu_text.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
        menu_text.anchor.setTo(0.5, 0.5);
        // menu_text.visible = false;
        if (load_complete) menu_text.visible = true;
        const startButton = this.add.button(400, 200, 'startGameButton', this.startGame, this);
        const settings = this.add.button(400, 350, 'settingsButton', this.settings, this);
        startButton.anchor.setTo(0.5, 0.5);
        settings.anchor.setTo(0.5, 0.5);
        // startButton.scale.setTo(0.2, 0.2);
        // settings.scale.setTo(0.2, 0.2);
        menuMusic = this.add.audio('music_menu');
        menuMusic.loop = true;
        menuMusic.play();

        clickMusic = this.add.audio('button_click');
    },
    startGame: function() {
        clickMusic.play();
        menuMusic.stop();
        this.state.start('Game');
    },
    settings: function() {
        clickMusic.play();
        menuMusic.stop();
        this.state.start('Settings');
    }
};

let text;
let main_loading;

function loadMenuStart() {
    main_loading = this.add.text(400, 240, 'Loading...', {
        font: "16px Press Start 2P",
        fill: '#ffffff'
    });
    main_loading.anchor.setTo(0.5, 0.5);
}

function fileMenuComplete(progress, cacheKey, success, totalLoaded) {
    main_loading.setText("Loading: " + progress + "%");
}

function loadMenuComplete() {
    load_complete = true;
    main_loading.kill();
    // this.state.start('Menu');
}

export default Menu;