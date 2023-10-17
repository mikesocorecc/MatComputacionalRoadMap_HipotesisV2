import { random } from 'lodash';

export const themeDefault = { key: 'forests' };

export const setThemeSelected = theme => {
    themeDefault.key = theme;
};

/**
 * Calcula la distancia euclídea entre dos coordenadas
 * @param a, una punto de coordenada x e y
 * @param b, una punto de coordenada x e y
 * @returns {number}
 */
function calcEuclideaDistance(a, b) {
    const result = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2).toFixed(0);
    return parseInt(result, 10);
}

/**
 * Revisa que la distancia minima entre la posición del jugador y la meta cumpla un mínimo proporcionado.
 * @param data, array de coordenadas de los puntos de los que debe distanciarse.
 * @param item, posición de un punto a con el que tomar la distancia.
 * @param min, Valor entero de la distancia minima.
 * @returns {*} Boolean (true)si se encuentra a la distancia minima de los elementos mandados en el array.
 */
function checkValuesDistanceMin(data, item, min) {
    return data.every(coordinates => calcEuclideaDistance(coordinates, item) > min);
}

/**
 * Sirve para calcular los centros de cada cuadro del grid para posicionar los elementos
 * como el resto de funciones.
 * @param CELL_SIZE, tamaño de la celda, expresada en píxeles.
 * @param NUM_ROWS_GRID, cantidad de filas que vamos a tener.
 * @param NUM_COLS_GRID, cantidad de columnas por fila a disponer.
 * @returns{*
 * [
 *      [{ x: 0, y: 0 },{ x: 0, y: 0 }],
 *      [{ x: 0, y: 0 },{ x: 0, y: 0 }]
 * ]
 * }, dos filas y dos columnas. ejemplo de 2 x 2
 */
export function loadCoordMap(CELL_SIZE, NUM_ROWS_GRID, NUM_COLS_GRID) {
    const matrizCoordMap = [];
    for (let row = 0; row < NUM_ROWS_GRID; row += 1) {
        matrizCoordMap.push([]);
        for (let col = 0; col < NUM_COLS_GRID; col += 1) {
            if (row === 0 && col === 0) {
                matrizCoordMap[row].push({
                    x: CELL_SIZE / 2,
                    y: CELL_SIZE / 2
                });
            } else if (row === 0) {
                matrizCoordMap[row].push({
                    x: matrizCoordMap[row][col - 1].x + CELL_SIZE,
                    y: CELL_SIZE / 2
                });
            } else if (col === 0) {
                matrizCoordMap[row].push({
                    x: CELL_SIZE / 2,
                    y: matrizCoordMap[row - 1][col].y + CELL_SIZE
                });
            } else {
                matrizCoordMap[row].push({
                    x: matrizCoordMap[row][col - 1].x + CELL_SIZE,
                    y: matrizCoordMap[row - 1][col].y + CELL_SIZE
                });
            }
        }
    }
    return matrizCoordMap;
}

/**
 * Carga un grupo de imágenes en el mapa.
 * @param nameImg, nombre de la imagen en phaser con la que se cargó.
 * @param numElements, cantidad de estos elementos. Número entero.
 * @param rangeMin, punto mínimo de este elemento, para calcular un random.
 * @param rangeMax, punto máximo de este elemento, para calcular un random.
 * @param distanceMin, distancia mínima entre puntos.
 * @param group, contexto del grupo, de imágenes.
 */
export function loadGroupImgStatic(nameImg, numElements, rangeMin, rangeMax, distanceMin, group) {
    const valuesUsed = [];
    let values = {
        x: random(rangeMin, rangeMax),
        y: random(rangeMin, rangeMax)
    };
    valuesUsed.push(values);

    for (let i = 1; i < numElements; i += 1) {
        do {
            values = {
                x: random(rangeMin, rangeMax),
                y: random(rangeMin, rangeMax)
            };
            const isCorrectDistance = checkValuesDistanceMin(valuesUsed, values, distanceMin);
            if (!valuesUsed.includes(values) && isCorrectDistance) {
                valuesUsed.push(values);
            }
        } while (!valuesUsed.includes(values));
    }

    valuesUsed.map(cord => group.create(cord.x, cord.y, nameImg));
}

/**
 * Carga imágenes dentro de las capas.
 * @param MAP, matriz 2d con la configuración del mapa que viene de la plataforma de contenido.
 * @param MAP_COORDINATE, matrix 2d con las posiciones(coordenadas {x: 0, y:0}), disponibles en el grid.
 * @param LIB_IMG, librería con los nombres de imágenes disponibles.
 * @param densityElements, valor para la cantidad de sobrecarga de imágenes en los espacios libres. low | medium | high
 * @param layerRoad, capa donde se pinta el camino.
 * @param layerAssets, capa donde se colocan los assets.
 * @param nameItem, contexto o capa para asociar las imágenes del mapa.
 * @param margin {{maxCol: number, min: number, maxRow: number}}, min y max para no ubicar assets en esta zona.
 * @param CELL_SIZE
 * @param ctx, contexto del juego phaser(this)
 * @returns {{posWinner, posInArray, mapSelect: *}}, devuelve posiciones libres del mapa o punto final,
 * como su posición en el array y la matriz seleccionada.
 */
export function mapImageLoader(MAP, MAP_COORDINATE, LIB_IMG, densityElements, layerRoad, layerAssets, nameItem, margin, CELL_SIZE, ctx) {
    const freePositionsForAssets = [];
    /**
     * 0 > Posición vacía se puede colocar un asset aleatorio de paisaje.
     * 1 > Es un camino viable, se puede usar de manera aleatoria entre los disponibles.
     */
    MAP_COORDINATE.forEach((row, idx) => {
        row.forEach((coordinates, ref) => {
            if (MAP[idx][ref] !== '0') {
                layerRoad.add(ctx.add.image(coordinates.x, coordinates.y, nameItem));
            } else if (MAP[idx][ref] === '0') {
                layerAssets.add(ctx.add.rectangle(
                    coordinates.x,
                    coordinates.y,
                    CELL_SIZE,
                    CELL_SIZE,
                    0xFFFFFF,
                    0
                ));
                const isMarginMin = coordinates.x === margin.min || coordinates.y === margin.min;
                const isMarginMaxCol = coordinates.x === margin.maxCol;
                const isMarginMAxRow = coordinates.y === margin.maxRow;
                if (!isMarginMin && !isMarginMaxCol && !isMarginMAxRow) {
                    freePositionsForAssets.push({
                        x: coordinates.x,
                        y: coordinates.y
                    });
                }
            }
        });
    });

    const numberFreePositions = freePositionsForAssets.length;
    const ratio = {
        low: 0.2,
        medium: 0.4,
        high: 0.6
    };

    const limitLoadImage = Math.floor(numberFreePositions * ratio[densityElements]);
    const positionsSelected = [];
    let count = 0;

    do {
        const posRandom = random(0, numberFreePositions - 1);
        if (!positionsSelected.includes(posRandom)) {
            const coordinates = freePositionsForAssets[posRandom];
            const imageSelected = LIB_IMG[random(0, LIB_IMG.length - 1)];
            layerAssets.add(ctx.add.image(coordinates.x, coordinates.y, imageSelected));
            positionsSelected.push(posRandom);
            count += 1;
        }
    } while (count <= limitLoadImage);
}

/**
 * Carga imágenes dentro de las capas.
 * @param MAP, matriz 2d con la configuración del mapa que viene de la plataforma de contenido.
 * @param MAP_COORDINATE, matrix 2d con las posiciones(coordenadas {x: 0, y:0}), disponibles en el grid.
 * @param staticGroup, grupo al que pertenece el elemento de acción.
 * @param ctx, el contexto de la scene de phaser(this)
 */
export function mapActionLoader(MAP, MAP_COORDINATE, staticGroup) {
    /**
     * C > Acción Roja.
     * Y > Acción Amarilla.
     * O > Acción Naranja.
     * B > Acción Azul.
     * Teletransportes, irá compuesto por 3 valores:
     *      S o T > Para indicar si es salida o entrada, de manera inicial.
     *      1, 2, 3, 4, etc.. > Para indicar el grupo al que pertenece.
     *      C, Y, O, B > Para indicar el color de la acción que le corresponde.
     */
    MAP_COORDINATE.forEach((row, idx) => {
        row.forEach((coordinates, ref) => {
            if (MAP[idx][ref] === 'Y') {
                staticGroup.create(coordinates.x, coordinates.y, 'Y').setOrigin(0.55, 0.6);
            }
            if (MAP[idx][ref] === 'O') {
                staticGroup.create(coordinates.x, coordinates.y, 'O').setOrigin(0.55, 0.6);
            }
            if (MAP[idx][ref] === 'B') {
                staticGroup.create(coordinates.x, coordinates.y, 'B').setOrigin(0.55, 0.6);
            }
        });
    });
}

/**
 * Extrae los valores a partir de las acciones que debe recoger para generar la
 * solución al ejercicio.
 * @param MAP, Matriz de dos dimensiones que alberga las posiciones de los elementos a buscar.
 * @param actionsToBeCollected, elementos que debe buscar.
 * @returns {{ key: Number }}
 */
export function itemsToBeCollected(MAP, actionsToBeCollected) {
    const count = {};

    MAP.forEach(row => row.forEach(item => {
        if (actionsToBeCollected.includes(item)) {
            count[item] = !count[item] ? 1 : count[item] += 1;
        }
    }));

    return count;
}

export function initPlayer(MAP_COORDINATE, playerConfig, nameImg, ctx) {
    const playerCoordinates = MAP_COORDINATE[playerConfig.col][playerConfig.row];
    // return ctx.physics.add.image(playerCoordinates.x, playerCoordinates.y, nameImg).setAngle(playerConfig.angle);
    return ctx.add.sprite(playerCoordinates.x, playerCoordinates.y, nameImg).setAngle(playerConfig.angle);
}
