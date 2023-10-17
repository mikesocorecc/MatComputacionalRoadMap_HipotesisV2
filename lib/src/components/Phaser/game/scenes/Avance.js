/* eslint-disable */
import { Scene } from 'phaser';
import {
    loadCoordMap,
    mapImageLoader,
    mapActionLoader,
    itemsToBeCollected,
    initPlayer
} from '@/lib/phaser';
import { event } from '@/events';
import { cloneDeep, isEqual } from 'lodash';

const COLOR_PLAY = 0xFFCC0D;
const COLOR_GREEN_FEEDBACK = 0x00D3AE;
const COLOR_RED_FEEDBACK = 0xED2A2F;
const COLOR_DEFAULT = 0xF9F9F9;
const TIME_BETWEEN_TWEENS = 600;
let userActions = {};
let userFeedback = {...userActions};
let actionsToBeCollected = 0;
let dataBackend;
let coordinatesMap;
let zoneMap;
let zoneAssets;
let zoneGame;
let zoneFeedback;
let zonePlayer;
let playerCollision = false;
let feedbackCollision = false;
let player;
let playerFeedback;
let playerOrientation;
let playerOrientationFeedback;
let stopTweenTest = false;
let playerInAction = '';
let feedbackInAction = '';
let feedback;

export default class AvanceOld extends Scene {
    constructor() {
        super({ key: 'Avance' });
    }

    init(data) {
        // Obtenemos de la escena anterior, los datos para cargar esta.
        this.BootScene = this.scene.get('BootScene');
        dataBackend = data;
    }

    create() {
        // Generamos las coordenadas para cargar los diferentes, accesorios y utilizar en la aplicación.
        coordinatesMap = loadCoordMap(
            dataBackend.CELL_SIZE,
            dataBackend.gameConfig.gridSize.row,
            dataBackend.gameConfig.gridSize.col
        );       // Añadimos las diferentes capas para superponer imágenes.
        zoneMap = this.add.layer();
        zoneAssets = this.physics.add.staticGroup();
        zoneGame = this.physics.add.staticGroup();
        zonePlayer = this.add.layer();
        zoneFeedback = this.add.layer();

        const widthGrid = Math.floor(dataBackend.gameConfig.gridSize.col * dataBackend.CELL_SIZE);
        const heightGrid = Math.floor(dataBackend.gameConfig.gridSize.row * dataBackend.CELL_SIZE);

        mapImageLoader(
            dataBackend.gameConfig.map,
            coordinatesMap,
            dataBackend.LIB_IMG,
            dataBackend.gameConfig.densityElements,
            zoneMap,
            zoneAssets,
            'calle',
            { min: dataBackend.CELL_SIZE / 2, maxCol: widthGrid - dataBackend.CELL_SIZE / 2, maxRow: heightGrid - dataBackend.CELL_SIZE / 2 },
            dataBackend.CELL_SIZE,
            this
        );

        this.add.grid(
            widthGrid / 2,
            heightGrid / 2,
            widthGrid,
            heightGrid,
            dataBackend.CELL_SIZE,
            dataBackend.CELL_SIZE,
            null,
            0,
            0xFFFFFF,
            1
        )

        mapActionLoader(
            dataBackend.gameConfig.map,
            coordinatesMap,
            zoneGame,
            this
        );

        actionsToBeCollected = itemsToBeCollected(
            dataBackend.gameConfig.map,
            dataBackend.gameConfig.actionsTypesToBeCollected
        );

        const createAnimations = (textures, animationName, configFrames, repeat) => {
            textures.forEach(texture => {
                this.anims.create({
                    key: animationName + texture,
                    frameRate: 6,
                    repeat: repeat,
                    frames: this.anims.generateFrameNumbers(texture, configFrames)
                })
            })
        }

        createAnimations(['B', 'C', 'Y', 'O'], "pulse", { start: 0, end: 1 }, -1);
        createAnimations(['B', 'C', 'Y', 'O'], "turnOn", { start: 1, end: 6 }, -1);
        createAnimations(['B', 'C', 'Y', 'O'], "turnOff", { start: 6, end: 1 }, 0);

        // Activa las animaciones de las acciones.
        zoneGame.getChildren().forEach(child => {
            this.physics.world.enable(child);
            if(child.texture.key === 'B') {
                child.anims.play('turnOnB');
            }
            if(child.texture.key === 'C') {
                child.anims.play('turnOnC');
            }
            if(child.texture.key === 'O') {
                child.anims.play('turnOnO');
            }
            if(child.texture.key === 'Y') {
                child.anims.play('turnOnY');
            }
        });

        const onWorldBounds = body => {
            const nameBody = body.gameObject.texture.key;
            if (nameBody === 'actor') {
                playerCollision = true;
            }
            if (nameBody === 'feedback') {
                feedbackCollision = true;
            }
        };

        const setAnglePlayer = angle => {
            switch (angle) {
                case 0:
                    playerOrientation = 'right';
                    break;
                case -90:
                    playerOrientation = 'top';
                    break;
                case 180:
                    playerOrientation = 'left';
                    break;
                case -180:
                    playerOrientation = 'left';
                    break;
                case 90:
                    playerOrientation = 'bottom';
                    break;
                default:
                    break;
            }
        };

        const setAngleFeedbackPlayer = angle => {
            switch (angle) {
                case 0:
                    playerOrientationFeedback = 'right';
                    break;
                case -90:
                    playerOrientationFeedback = 'top';
                    break;
                case 180:
                    playerOrientationFeedback = 'left';
                    break;
                case -180:
                    playerOrientationFeedback = 'left';
                    break;
                case 90:
                    playerOrientationFeedback = 'bottom';
                    break;
                default:
                    break;
            }
        };

        const arrowUp = (targetItem, orientationTarget) => {
            let cordMove;
            if (orientationTarget === 'right') {
                cordMove = targetItem.x + dataBackend.CELL_SIZE;
            }
            if (orientationTarget === 'top') {
                cordMove = targetItem.y - dataBackend.CELL_SIZE;
            }
            if (orientationTarget === 'left') {
                cordMove = targetItem.x - dataBackend.CELL_SIZE;
            }
            if (orientationTarget === 'bottom') {
                cordMove = targetItem.y + dataBackend.CELL_SIZE;
            }
            return cordMove;
        };

        const arrowLeft = targetItem => targetItem.angle + -90;

        const arrowRight = targetItem => targetItem.angle + 90;

        const resetMovePlayer = () => {
            setTimeout(() => {
                if(zoneGame.children !== undefined){
                    zoneGame.getChildren().forEach(child => {
                        this.physics.world.enable(child);
                        if(child.texture.key === 'B') {
                            child.anims.play('turnOnB');
                        }
                        if(child.texture.key === 'C') {
                            child.anims.play('turnOnC');
                        }
                        if(child.texture.key === 'O') {
                            child.anims.play('turnOnO');
                        }
                        if(child.texture.key === 'Y') {
                            child.anims.play('turnOnY');
                        }
                    });
                }
                if (zonePlayer.children !== undefined) {
                    zonePlayer.removeAll();
                }
                if (zoneFeedback.children !== undefined || zoneFeedback.list !== undefined) {
                    zoneFeedback.removeAll();
                }
                const posPlayer = coordinatesMap[dataBackend.gameConfig.positionPlayer.col][dataBackend.gameConfig.positionPlayer.row];
                player.setPosition(posPlayer.x, posPlayer.y);
                player.angle = dataBackend.gameConfig.positionPlayer.angle;
                playerCollision = false;
                stopTweenTest = false;
                setAnglePlayer(dataBackend.gameConfig.positionPlayer.angle);
                if (playerFeedback) {
                    playerFeedback.setPosition(posPlayer.x, posPlayer.y);
                    playerFeedback.angle = dataBackend.gameConfig.positionPlayer.angle;
                    setAngleFeedbackPlayer(dataBackend.gameConfig.positionPlayer.angle);
                }
                event.emit('EndMovement');
            }, 800);
        };

        const paintBox = (layer, color, targetItem, isFeedback) => {
            const target = layer.getChildren().filter(child => {
                const dataRelevant = {
                    position: {
                        x: child.x,
                        y: child.y
                    },
                    color: child.fillColor
                }
                const isEqualCoordinates = dataRelevant.position.x === targetItem.getCenter().x && dataRelevant.position.y === targetItem.getCenter().y;
                const isEqualColor = dataRelevant.color === color;
                if(isEqualCoordinates && isEqualColor) {
                    return child;
                }
            });
            if (!target[0]) {
                layer.add(
                    this.add.rectangle(
                        targetItem.getCenter().x,
                        targetItem.getCenter().y,
                        isFeedback ? dataBackend.CELL_SIZE * 0.85 : dataBackend.CELL_SIZE,
                        isFeedback ? dataBackend.CELL_SIZE * 0.85 : dataBackend.CELL_SIZE,
                        color,
                        isFeedback ? 1 : 0.65
                    )
                );
            }
        };

        const calcEjeX = (name, orientationTarget) => name === 'U' && (orientationTarget === 'right' || orientationTarget === 'left');

        const calcEjeY = (name, orientationTarget) => name === 'U' && (orientationTarget === 'top' || orientationTarget === 'bottom');

        const calcAnglePlayer = (name, targetItem, orientationTarget) => (name === 'L' ? arrowLeft(targetItem, orientationTarget) : arrowRight(targetItem, orientationTarget));

        const executeMovePlayer = (movement, layer, targetItem, color, isFeedback) => new Promise((resolve, reject) => {
            let anglePlayer;
            let ejeX;
            let ejeY;
            if (isFeedback) {
                ejeX = calcEjeX(movement.name, playerOrientationFeedback) ? arrowUp(targetItem, playerOrientationFeedback) : targetItem.x;
                ejeY = calcEjeY(movement.name, playerOrientationFeedback) ? arrowUp(targetItem, playerOrientationFeedback) : targetItem.y;
                if (movement.name === 'L' || movement.name === 'R') {
                    anglePlayer = calcAnglePlayer(movement.name, targetItem, playerOrientationFeedback);
                } else {
                    anglePlayer = targetItem.angle;
                }
            } else {
                ejeX = calcEjeX(movement.name, playerOrientation) ? arrowUp(targetItem, playerOrientation) : targetItem.x;
                ejeY = calcEjeY(movement.name, playerOrientation) ? arrowUp(targetItem, playerOrientation) : targetItem.y;
                if (movement.name === 'L' || movement.name === 'R') {
                    anglePlayer = calcAnglePlayer(movement.name, targetItem, playerOrientation);
                } else {
                    anglePlayer = targetItem.angle;
                }
            }
            const tweenPlayer = this.tweens.add({
                targets: targetItem,
                x: ejeX,
                y: ejeY,
                angle: anglePlayer,
                duration: TIME_BETWEEN_TWEENS,
                onStart: () => {
                    playerInAction = '';
                    if (color) {
                        paintBox(layer, color, targetItem, isFeedback);
                    }
                    if (playerCollision) {
                        tweenPlayer.stop();
                        reject();
                    }
                },
                onUpdate: () => {
                    if (playerCollision) {
                        tweenPlayer.stop();
                        reject();
                    }
                    if (stopTweenTest === true) {
                        tweenPlayer.stop();
                        reject();
                    }
                },
                onComplete: () => {
                    if (!isFeedback) {
                        if (movement.name === 'B'){
                            playerInAction = 'B'
                        }
                        if (movement.name === 'C'){
                            playerInAction = 'C'
                        }
                        if (movement.name === 'Y'){
                            playerInAction = 'Y'
                        }
                        if (movement.name === 'O'){
                            playerInAction = 'O'
                        }
                        setAnglePlayer(targetItem.angle);
                    } else {
                        if (movement.name === 'B'){
                            feedbackInAction = 'B'
                        }
                        if (movement.name === 'C'){
                            feedbackInAction = 'C'
                        }
                        if (movement.name === 'Y'){
                            feedbackInAction = 'Y'
                        }
                        if (movement.name === 'O'){
                            feedbackInAction = 'O'
                        }
                        setAngleFeedbackPlayer(targetItem.angle);
                    }
                    resolve({ x: ejeX, y: ejeY, name: movement.name });
                }
            });
        });

        const loadCommands = (datos, f1, f2) => {
            const values = cloneDeep(datos);
            const functionAvailable = values.filter(item => item.name === 'F1' || item.name === 'F2');
            if (functionAvailable.length === 0) {
                userActions = {};
                return values.flat();
            }
            if (values.length >= dataBackend.gameConfig.limitCommands) {
                userActions = {};
                return values.flat();
            }
            for (let idx = 0; idx < values.length; idx += 1) {
                if (values[idx].name === 'F1') {
                    values.splice(idx, 1);
                    values.splice(idx, 0, f1);
                }
                if (values[idx].name === 'F2') {
                    values.splice(idx, 1);
                    values.splice(idx, 0, f2);
                }
            }
            return loadCommands(values.flat(), f1, f2);
        };

        const readFolders = async folders => {
            const commands = cloneDeep(folders[0].folderItems);
            const function1 = folders[1] ? cloneDeep(folders[1].folderItems) : [];
            const function2 = folders[2] ? cloneDeep(folders[2].folderItems) : [];

            const newCommands = loadCommands(commands, function1, function2);
            newCommands.forEach((item, idxItem) => item.id = idxItem);
            return newCommands;
        };

        const testPlayer = async folders => {
            const newCommands = await readFolders(folders);
            for (let i = 1; i < newCommands.length; i += 1) {
                if (!playerCollision) {
                    await executeMovePlayer(newCommands[i], zoneFeedback, player, COLOR_PLAY, false).then(resolve => {
                        if (i === newCommands.length - 1) {
                            paintBox(zoneFeedback, COLOR_PLAY, player, false);
                            resolve();
                        }
                    }).catch(() => {
                        resetMovePlayer();
                    });
                }
            }
        };

        const playPlayer = async folders => {
            const newCommands = await readFolders(folders);
            for (let i = 0; i < newCommands.length; i += 1) {
                if (!playerCollision) {
                    await executeMovePlayer(newCommands[i], zonePlayer, player, COLOR_DEFAULT).then(() => {
                        if (i === newCommands.length - 1 ) {
                            paintBox(zonePlayer, COLOR_DEFAULT, player, false);
                        }
                    });
                }
            }
        };

        const feedbackMovePlayer = async folders => {
            const newCommands = await readFolders(folders);
            playerFeedback.setVisible(true);
            for (let i = 0; i < newCommands.length; i += 1) {
                if (!feedbackCollision && !isEqual(userFeedback, actionsToBeCollected) && feedback) {
                    await executeMovePlayer(newCommands[i], zoneFeedback, playerFeedback, COLOR_GREEN_FEEDBACK, true).then(() => {
                        if (i === newCommands.length - 1) {
                            paintBox(zoneFeedback, COLOR_GREEN_FEEDBACK, playerFeedback, true);
                            this.tweens.add({
                                targets: playerFeedback,
                                alpha: { from: 1, to: 0 },
                                ease: 'Sine.InOut',
                                duration: 1000,
                                repeat: -1,
                                yoyo: true
                            });
                        }
                    });
                }
                paintBox(zoneFeedback, COLOR_GREEN_FEEDBACK, playerFeedback, true);
            }
        };

        const initGame = () => {
            // Inicializamos al jugador y al feedback del jugador
            player = initPlayer(coordinatesMap, dataBackend.gameConfig.positionPlayer, 'actor', this);
            playerFeedback = initPlayer(coordinatesMap, dataBackend.gameConfig.positionPlayer, 'feedback', this);
            setAnglePlayer(dataBackend.gameConfig.positionPlayer.angle);
            setAngleFeedbackPlayer(dataBackend.gameConfig.positionPlayer.angle);

            // Ocultamos el feedback para que no se muestre en pantalla
            playerFeedback.setVisible(false);

            // Conectamos los sistemas de físicas del juego al jugador y al feedback
            this.physics.add.existing(player, false);
            this.physics.add.existing(playerFeedback, false);
            player.body.onWorldBounds = true;
            player.body.setCollideWorldBounds(true);
            playerFeedback.body.onWorldBounds = true;
        }

        initGame();

        // Controla las colisiones del jugador contra los bordes del mapa
        this.physics.world.on('worldbounds', onWorldBounds);

        // Controla que el jugador no salga del camino.
        this.physics.add.collider(player, zoneAssets, (player, asset) => {
            player.stop();
            onWorldBounds(player.body);
            switch ( playerOrientation ) {
                case 'top':
                    player.setPosition( player.x, player.y + 1 );
                    break;
                case 'right':
                    player.setPosition( player.x - 1, player.y );
                    break;
                case 'bottom':
                    player.setPosition( player.x, player.y - 1 );
                    break;
                case 'left':
                    player.setPosition( player.x + 1, player.y );
                    break;
                default:
                    player.setPosition( player.x, player.y );
            }
        });

        // Controla las superposiciones de las acciones con el jugador.
        this.physics.add.overlap(player, zoneGame, (player, action) => {
            if(action.texture.key === 'B' && playerInAction === 'B') {
                action.anims.play('turnOffB');
                userActions[action.texture.key] = !userActions[action.texture.key] ? 1 : userActions[action.texture.key] += 1;
                action.body.enable = false;
            }
            if(action.texture.key === 'C' && playerInAction === 'C') {
                action.anims.play('turnOffC');
                userActions[action.texture.key] = !userActions[action.texture.key] ? 1 : userActions[action.texture.key] += 1;
                action.body.enable = false;
            }
            if(action.texture.key === 'Y' && playerInAction === 'Y') {
                action.anims.play('turnOffY');
                userActions[action.texture.key] = !userActions[action.texture.key] ? 1 : userActions[action.texture.key] += 1;
                action.body.enable = false;
            }
            if(action.texture.key === 'O' && playerInAction === 'O') {
                action.anims.play('turnOffO');
                userActions[action.texture.key] = !userActions[action.texture.key] ? 1 : userActions[action.texture.key] += 1;
                action.body.enable = false;
            }
        }, () => {}, () => {});

        // Controla las superposiciones de las acciones con el feedback
        this.physics.add.overlap(playerFeedback, zoneGame, (player, action) => {
            if(action.texture.key === 'B' && feedbackInAction === 'B') {
                action.anims.play('turnOffB')
                action.anims.play('pulseB');
                userFeedback[action.texture.key] = !userFeedback[action.texture.key] ? 1 : userFeedback[action.texture.key] += 1;
                action.body.enable = false;
            }
            if(action.texture.key === 'C' && feedbackInAction === 'C') {
                action.anims.play('turnOffC');
                action.anims.play('pulseC');
                userFeedback[action.texture.key] = !userFeedback[action.texture.key] ? 1 : userFeedback[action.texture.key] += 1;
                action.body.enable = false;
            }
            if(action.texture.key === 'Y' && feedbackInAction === 'Y') {
                action.anims.play('turnOffY');
                action.anims.play('pulseY');
                userFeedback[action.texture.key] = !userFeedback[action.texture.key] ? 1 : userFeedback[action.texture.key] += 1;
                action.body.enable = false;
            }
            if(action.texture.key === 'O' && feedbackInAction === 'O') {
                action.anims.play('turnOffO');
                action.anims.play('pulseO');
                userFeedback[action.texture.key] = !userFeedback[action.texture.key] ? 1 : userFeedback[action.texture.key] += 1;
                action.body.enable = false;
            }
        });

        /** Zona de escuchas entre los paneles y phaser **/

        event.on('test-task', values => {
            if(values[0].folderItems.length > 0) {
                testPlayer(values).then(() => resetMovePlayer());
            } else {
                event.emit('EndMovement');
            }
        });

        event.on('Responder', values => {
            event.emit('progress-bar-stop', 'progressbar');
            playPlayer(values)
            .then(() => {
                zonePlayer.getChildren().forEach( child => child.setFillStyle( COLOR_GREEN_FEEDBACK, 1 ) );
            }).catch(() => {
                zonePlayer.getChildren().forEach( child => child.setFillStyle( COLOR_GREEN_FEEDBACK, 1 ) );
            })
        });

        event.on('btn-action', btnAction => {
            if (btnAction.action === 'stop-test' || btnAction.action === 'Siguiente') {
                stopTweenTest = true;
            }
        });

        event.on('feedbackBtnSolution', foldersFeedback => {
            feedbackMovePlayer( foldersFeedback ).then(() => console.log('Feedback is completed')).catch(() => console.log('Stop feedback'));
        });

        event.on('reset-task', () => {
            resetMovePlayer();
        });
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
