import AssetsLoader from '../utils/AssetsLoader';
import game from './main.js';

let clickMusic, menuMusic, musicOn = false;

const Settings = {
    preload: function(){
        const assetsLoader = new AssetsLoader(Settings);
        assetsLoader.getAssets();
      },
    create: function() {
        const background = this.add.sprite(0, 0, 'backgroundMenu');
        const style = {
            font: "bold 55px Algerian",
            fill: 'chocolate',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        const controls = this.add.text(400, 80, "CONTROLS", style);
        controls.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
        controls.anchor.setTo(0.5, 0.5);
        controller('buttonA', 'Move left', 100, 180);
        controller('buttonD', 'Move right', 250, 180);
        controller('buttonSpace', 'Jump', 400, 180);
        controller('buttonMouse', 'Hook', 550, 180);
        controller('buttonEsc', 'Menu', 700, 180);

        const back = this.add.button(400, 410, 'backButton', this.menu, this);
        back.anchor.setTo(0.5, 0.5);
        menuMusic = this.add.audio('music_menu');
        menuMusic.loop = true;
        menuMusic.play();

        clickMusic = this.add.audio('button_click');
    },
    menu: function() {
        clickMusic.play();
        menuMusic.stop();
        this.state.start('Menu');
    }
}

function controller(button, message, x, y) {
    const style = {
        font: "bold 14px Press Start 2P",
        fill: 'white',
        boundsAlignH: "center",
        boundsAlignV: "middle"
    };
    const text = Settings.add.text(x, y - 40, message, style);
    text.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
    text.anchor.setTo(0.5, 0.5);
    const image = Settings.add.sprite(x, y, button);
    image.scale.setTo(0.5, 0.5);
    image.anchor.setTo(0.5, 0.5);
}

export default Settings;