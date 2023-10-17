<template>
    <button
        :class="[
            `${configBtn.styleClass}
            ${clickBtnAction ? 'transition duration-75 ease-out transform scale-0' : 'transition transform-none'}`,
            disabledBtn ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'
        ]"
        :data-testid="nameAction"
        :disabled="disabledBtn"
        @click.prevent="clickBtn"
        @mousedown="shadowBtn = false"
        @mouseup="shadowBtn = true"
    >
        <span
            v-if="configBtn.img"
            class="w-full h-full flex justify-center items-center"
        >
            <img
                v-if="configBtn.img === 'closed.svg'"
                :class="`w-4 h-4 transform ${configBtn.direction}`"
                :src="require(`@/assets/img/Icons/${configBtn.img}`)"
                alt="closed button"
            >
            <img
                v-else-if="libSpecialBtn.includes(configBtn.img)"
                :class="`w-11 h-11 transform ${configBtn.direction}`"
                :src="require(`@/assets/img/Icons/${configBtn.img}`)"
                :alt="`${configBtn.img.split('.svg')[0]}`"
            >
            <img
                v-else-if="nameAction === 'delBtn' && actionsIMG.includes(configBtn.img)"
                :class="`w-3 transform ${configBtn.direction}`"
                :src="require(`@/assets/img/Mapas/backgrounds/${themeSelected}/${configBtn.img}`)"
                :alt="`${configBtn.img.split('.svg')[0]}-delBtn`"
            >
            <img
                v-else-if="nameAction === 'delBtn'"
                :class="`w-3 transform ${configBtn.direction}`"
                :src="require(`@/assets/img/Icons/${configBtn.img}`)"
                :alt="`${configBtn.img.split('.svg')[0]}-delBtn`"
            >
            <img
                v-else-if="nameAction === 'solBtn' && actionsIMG.includes(configBtn.img)"
                :class="`w-4 transform ${configBtn.direction}`"
                :src="require(`@/assets/img/Mapas/backgrounds/${themeSelected}/${configBtn.img}`)"
                :alt="`${configBtn.img.split('.svg')[0]}-delBtn`"
            >
            <img
                v-else-if="nameAction === 'solBtn'"
                :class="`w-4 transform ${configBtn.direction}`"
                :src="require(`@/assets/img/Icons/${configBtn.img}`)"
                :alt="`${configBtn.img.split('.svg')[0]}-delBtn`"
            >
            <img
                v-else-if="actionsIMG.includes(configBtn.img)"
                :class="`w-8 h-8 transform ${configBtn.direction}`"
                :src="require(`@/assets/img/Mapas/backgrounds/${themeSelected}/${configBtn.img}`)"
                :alt="`${configBtn.img.split('.svg')[0]}`"
            >
            <img
                v-else
                :class="`w-4 xl:w-5 transform ${configBtn.direction}`"
                :src="require(`@/assets/img/Icons/${configBtn.img}`)"
                :alt="`${configBtn.img.split('.svg')[0]}`"
            >
        </span>
        <span
            v-else-if="configBtn.name === 'test-task'"
        >
            Probar
        </span>
        <span
            v-else-if="configBtn.name === 'stop-test'"
        >
            Detener
        </span>
        <span
            v-else
        >
            {{ nameAction }}
        </span>
    </button>
</template>

<script setup>
import { defineComponent, ref } from 'vue';
import { event } from '@/events';

defineComponent({
    name: 'BtnActionTask'
});

const props = defineProps({
    typeTask: {
        type: String,
        default: ''
    },
    boxName: {
        type: String,
        default: ''
    },
    nameAction: {
        type: String,
        required: true
    },
    configBtn: {
        type: Object,
        default: () => ({
            name: 'U',
            direction: 'rotate-0',
            img: 'U.svg',
            styleClass: ['w-full h-full rounded-xl bg-black flex justify-center items-center cursor-pointer']
        })
    },
    disabledBtn: {
        type: Boolean,
        default: false
    },
    themeSelected: {
        type: String,
        default: 'forests'
    }
});

const shadowBtn = ref(true);
const clickBtnAction = ref(false);
const libSpecialBtn = [
    'seeStatement.svg',
    'chevron-btn.svg',
    'borrar.svg'
];

const actionsIMG = [
    'scene_forests-B.svg',
    'scene_forests-Y.svg',
    'scene_forests-O.svg',
    'scene_forests-C.svg',
    'scene_forests-D.svg',
    'scene_snowy-B.svg',
    'scene_snowy-Y.svg',
    'scene_snowy-O.svg',
    'scene_snowy-C.svg',
    'scene_snowy-D.svg',
    'scene_oceans-B.svg',
    'scene_oceans-Y.svg',
    'scene_oceans-O.svg',
    'scene_oceans-C.svg',
    'scene_oceans-D.svg',
    'scene_moon-B.svg',
    'scene_moon-Y.svg',
    'scene_moon-O.svg',
    'scene_moon-C.svg',
    'scene_moon-D.svg'
];

function clickBtn() {
    if (props.nameAction !== 'solBtn') {
        if (props.typeTask !== 'descomposicion') {
            clickBtnAction.value = true;
            event.emit('btn-action', { boxName: props.boxName, action: props.nameAction, configBtn: props.configBtn });
            setTimeout(() => { clickBtnAction.value = false; }, 60);
        } else if (props.boxName !== 'Comandos') {
            clickBtnAction.value = true;
            event.emit('btn-action', { boxName: props.boxName, action: props.nameAction, configBtn: props.configBtn });
            setTimeout(() => { clickBtnAction.value = false; }, 60);
        }
    }
}
</script>

<style scoped>

</style>
