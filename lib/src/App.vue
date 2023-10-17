<template>
    <div id="Actividad_Main">
        <div
            class="pantalla"
            id="pantallaActividad"
            v-if="pantalla_actual == 'pantallaActividad'"
        >
            <ViewApp :data-task="problema" @siguienteIteracion="handleChecked"/>
        </div>
        <div
            class="pantalla"
            id="pantallaPregunta"
            v-if="pantalla_actual == 'pantallaPregunta'"
        ></div>
    </div>
</template>

<script>
//import $ from "jquery";
import { shuffle } from "lodash";
import { event } from "@/events";
import ViewApp from './views/ViewApp.vue';
import dataTask from './assets/map.json';

export default {
    name: 'App',
    components: {
        ViewApp,
    },
    data: function () {
        return {
            /** AQUÍ DEBE CARGARSE LOS DATOS DE EN CADA ITERACIÓN */
            problema: dataTask[0],
            /**
             * La plantilla con la que inicial el ejercicio.
             * Almacenar en la instancia para evitar que se modifique durante la ejecucion.
             */
            /* global plantilla */
            plantilla_actual: plantilla,
            /**
             * Configuracion de la iteración
             */
            iteracion_config: {
                /**
                 * La iteracion actual
                 */
                iteracion_actual: 0,
                /**
                 * El maximo de iteraciones
                 */
                iteracion_max: 2,
                /**
                 * El total de respuestas correctas durante el ejercicio
                 */
                juego_respuestas_correctas: 0,
                /**
                 * El total de respuestas incorrectas durante el ejercicio
                 */
                juego_respuestas_incorrectas: 0
                /**
                 * Para modalidad 1 y 3, necesito saber si es mayor, menor o random
                 */
            },
            /**
             * La pantalla actual que debe activarse y mostrarse
             */
            pantalla_actual: null, //"pantallaActividad",
            /**
             * Tiempo para esperar antes de cambiar de iteración
             */
            pausa_siguiente_iteracion: 2 * 1000,
            /**
             * Bloquear o no el click
             */
            permitir_click: false,
            /**
             * El tiempo en ms cuando el usuario hace click en el boton iniciar de las instrucciones
             */
            tiempo_inicio: 0
        };
    },
    computed: {
        contenido: function () {
            /* global elementos_palabras */
            return shuffle(elementos_palabras);
        }
    },
    methods: {
        /**
         * Envia el resultado del ejercicio a la ConsolaEjercicios, se llama en `siguienteIteracion()`
         */
        finEjercicio: function () {
            const maxElementosCorrectos =
                this.iteracion_config.juego_respuestas_correctas +
                this.iteracion_config.juego_respuestas_incorrectas;
            const en_blanco = Math.max(
                0,
                maxElementosCorrectos -
                    (this.iteracion_config.juego_respuestas_correctas +
                        this.iteracion_config.juego_respuestas_incorrectas)
            );
            //var d = new Date();
            /* global jQuery */
            jQuery('#Actividad_Main').stop(true, true);
            return jQuery('body').trigger({
                type: 'Consola.Ejercicio.Terminado',
                resultado: {
                    correcto: this.iteracion_config.juego_respuestas_correctas,
                    incorrecto:
                    this.iteracion_config.juego_respuestas_incorrectas,
                    blanco: en_blanco,
                    tiempo: Math.round(
                        (new Date().getTime() - this.tiempo_inicio) / 1000
                    ),
                    total: maxElementosCorrectos,
                    nivel: Math.min(
                        this.iteracion_config.iteracion_actual,
                        this.iteracion_config.iteracion_max
                    )
                }
            });
        },
        handleChecked: function (isWinner) {
            if (isWinner) {
                this.iteracion_config.juego_respuestas_correctas++;
            } else {
                this.iteracion_config.juego_respuestas_incorrectas++;
            }
            this.siguiente_iteracion();
        },
        siguiente_iteracion: function () {
            this.iteracion_config.iteracion_actual++;
            if (
                this.iteracion_config.iteracion_actual >
                this.iteracion_config.iteracion_max
            ) {
                return this.finEjercicio();
            }
            this.pantalla_actual = '';
            /** DESCOMENTAR SOLO CUANDO HAYA COONTENIDO DE LA BBDD **/
            /** Revisar **/
            let tarea = ''
            let taskTarget = this.contenido[this.iteracion_config.iteracion_actual - 1];
            const lengthData = taskTarget.Bloques[0].Preguntas[0].Respuestas.length - 1;
            taskTarget.Bloques[0].Preguntas[0].Respuestas.forEach((fractionObject, idx) => {
                if (idx === 0) {
                    tarea += `${fractionObject.Texto.slice(0,fractionObject.Texto.length - 1)},`;
                } else if (idx === lengthData) {
                    tarea += `${fractionObject.Texto.slice(1,fractionObject.Texto.length - 1)}}`;
                } else {
                    tarea += `${fractionObject.Texto.slice(1,fractionObject.Texto.length - 1)},`;
                }
            });
            // tarea = dataTask[this.iteracion_config.iteracion_actual - 1];
            this.problema = JSON.parse(tarea);
            console.log(this.problema);
            // this.problema = dataTask[0];
            console.table({ id: taskTarget.IDContenido, name: taskTarget.Bloques[ 0 ].nombre });
            // Reinicia las variables de Phaser antes de la siguiente iteración
            event.emit('reset-task', true);
            return setTimeout(() => this.pantalla_actividad(), 500);
        },
        pantalla_actividad: function () {
            this.pantalla_actual = 'pantallaActividad';
        },
        pantalla_pregunta: function () {
            this.pantalla_actual = 'pantallaPregunta';
        }
    },
    mounted: function () {
        /** DESCOMENTAR CUANDO SE QUIERA PROBAR EL SIGUIENTE ITERACION (NO FUNCIONA JUNTO AL HOT REALOAD, HABRIA QUE HACER UN WATCH) **/
        /* global $ */
        $("body").on("Consola.Ejercicio.Iniciado", () => {
          this.tiempo_inicio = new Date().getTime();
          this.siguiente_iteracion();
        });
    }
};
</script>

<style lang='scss'>
.katex * {
    border-color: currentColor !important;
}

#Actividad_Warp {
    height: 100%;
}
#Actividad_Main{
    z-index: 1;
}

#Actividad_Main .pantalla {
    display: block;
    position: relative;
    font-family: 'Muli', sans-serif;
    font-size: 24px;
    color: black;
    width: 100%;
}

.wrapper-contenido:first-child div {
    min-height: 0;
}

.btn-maco {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    padding: 13px 22px;
    background: #FF5601;
    border-radius: 30px;
    text-transform: uppercase;
}

.btn:hover, .btn:focus {
    color: #333;
    text-decoration: none;
}

a.btn-maco:visited, a:link, .btn.btn-maco:hover, .btn.btn-maco:focus {
    color: #fff;
}
</style>

