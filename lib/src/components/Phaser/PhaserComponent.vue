<template>
    <div
        id="phaser-content"
        :key="gameData"
        ref="phaser"
        class="w-full h-full"
    />
</template>

<script setup>
import {
    defineComponent, onMounted, ref
} from 'vue';
import Phaser from 'phaser';
import { event } from '@/events';
import { themeDefault } from '@/lib/phaser';
import GothicPNG from '@/assets/style/gothic.png';
import GothicXML from '@/assets/style/gothic.xml';
import {
    imagesAvance, imagesSnowy, imagesOceans, imagesMoon
} from './game/modules/loadRecourses';
import Avance from './game/scenes/Avance';

defineComponent({
    name: 'PhaserComponent'
});

const props = defineProps({
    gameData: {
        type: Object,
        default: () => ({})
    },
    themeSelected: {
        type: String,
        default: 'forests'
    }
});

let phaser = ref(null);
let dataGame = {};
let images;
let libImagesLoad = [];
let imagesLoads = false;
const CELL_SIZE = 45;
const libImagesRef = {
    forests: imagesAvance,
    snowy: imagesSnowy,
    oceans: imagesOceans,
    moon: imagesMoon
};
const excludeIMG = [
    'actor',
    'feedback',
    'calle'
];
const actionsIMG = [
    'B',
    'Y',
    'O',
    'C'
];

function preload() {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(150, 160, 250, 30);
    this.load.bitmapFont('gothic', GothicPNG, GothicXML);
    const { width } = this.cameras.main;
    const loadingText = this.make.text({
        x: width / 2,
        y: 145,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#000000'
        }
    });
    loadingText.setOrigin(0.5, 0.5);
    libImagesLoad = [];
    images = libImagesRef[themeDefault.key];
    Object.keys(images).forEach(key => {
        const nameIMG = images[key].split('-')[1].split('.svg')[0].split('.png')[0];
        if (actionsIMG.includes(nameIMG)) {
            this.load.spritesheet(nameIMG, images[key], { frameWidth: CELL_SIZE, frameHeight: CELL_SIZE });
        } else if (!excludeIMG.includes(nameIMG)) {
            libImagesLoad.push(nameIMG);
            this.load.svg(nameIMG, images[key], { width: CELL_SIZE, height: CELL_SIZE });
        } else if (nameIMG === 'calles') {
            this.load.svg(nameIMG, images[key], { width: CELL_SIZE, height: CELL_SIZE });
        } else {
            this.load.svg(nameIMG, images[key], { width: CELL_SIZE * 0.1, height: CELL_SIZE * 0.1 });
        }
    });
    this.load.on('progress', value => {
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(155, 165, 230 * value, 20);
    });
    this.load.on('complete', () => {
        imagesLoads = true;
        if (imagesLoads) {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        }
    });
}

function create() {
    dataGame = {
        nameScene: props.gameData.type,
        LIB_IMG: libImagesLoad,
        CELL_SIZE,
        gameConfig: {
            gridSize: Object.keys(props.gameData.gridSize).length > 0 ? props.gameData.gridSize : { row: 9, col: 11 },
            maxActions: props.gameData.maxActions,
            maxComandos: props.gameData.maxComandos,
            limitCommands: props.gameData.limitCommands,
            maxRepeatActions: props.gameData.maxRepeatActions,
            numDistractor: props.gameData.numDistractor,
            numRepetitions: props.gameData.numRepetitions,
            densityElements: props.gameData.densityElements,
            actionsTypesToBeCollected: props.gameData.enunciado.urlImageItem.map(item => item.split('-')[1]),
            map: props.gameData.map,
            solutionMap: props.gameData.solutionMap,
            positionPlayer: props.gameData.positionPlayer,
            theme: props.themeSelected
        }
    };
    this.scene.add('Avance', Avance, true, dataGame);
}

const config = {
    type: Phaser.CANVAS,
    audio: {
        disableWebAudio: true,
        noAudio: true
    },
    width: 495,
    height: 405,
    transparent: true,
    backgroundColor: '#FFFFFF',
    parent: 'phaser-content',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload,
        create
    }
};

onMounted(async () => {
    phaser = new Phaser.Game(config);
    event.emit('progress-bar-start', 'progressbar');
});
</script>

<style scoped></style>
