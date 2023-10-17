<template>
    <button
        :class="[
            configBtn.styleClass,
            shadowBtn ? 'shadow-md' : 'shadow-none opacity-60',
            disabledBtn ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'
        ]"
        :data-testid="configBtn.img.split('.svg')[0] || configBtn.name"
        :disabled="disabledBtn"
        @click.prevent="clickBtn"
        @mousedown="shadowBtn = false"
        @mouseup="shadowBtn = true"
    >
        <span
            v-if="configBtn.img"
        >
            <img
                v-if="configBtn.img === 'closed.svg'"
                :class="`w-4 h-4 transform ${configBtn.direction}`"
                :src="require(`@/assets/img/Icons/${configBtn.img}`)"
                alt="closed button"
            >
            <img
                v-else-if="libSpecialBtn.includes(configBtn.img)"
                :class="`w-10 h-10 transform ${configBtn.direction}`"
                :src="require(`@/assets/img/Icons/${configBtn.img}`)"
                :alt="`${configBtn.img.split('.svg')[0]}`"
            >
            <img
                v-else-if="nameAction === 'delBtn' && actionsIMG.includes(configBtn.img)"
                :class="`w-4 transform ${configBtn.direction}`"
                :src="require(`@/assets/img/Mapas/backgrounds/${themeSelected}/${configBtn.img}`)"
                :alt="`${configBtn.img.split('.svg')[0]}-delBtn`"
            >
            <img
                v-else-if="nameAction === 'delBtn'"
                :class="`w-4 transform ${configBtn.direction}`"
                :src="require(`@/assets/img/Icons/${configBtn.img}`)"
                :alt="`${configBtn.img.split('.svg')[0]}-delBtn`"
            >
            <img
                v-else-if="actionsIMG.includes(configBtn.img)"
                :class="`w-6 transform ${configBtn.direction}`"
                :src="require(`@/assets/img/Mapas/backgrounds/${themeSelected}/${configBtn.img}`)"
                :alt="`${configBtn.img.split('.svg')[0]}`"
            >
            <img
                v-else
                :class="`w-6 transform ${configBtn.direction}`"
                :src="require(`@/assets/img/Icons/${configBtn.img}`)"
                :alt="`${configBtn.img.split('.svg')[0]}`"
            >
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
    name: 'BtnActionComponent'
});

const props = defineProps({
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
    idxBtn: {
        type: Number,
        default: undefined
    },
    themeSelected: {
        type: String,
        default: 'forests'
    }
});

const shadowBtn = ref(true);
const disabledBtn = ref(false);
const libSpecialBtn = [
    'seeStatement.svg',
    'chevron-btn.svg',
    'borrar.svg',
    'play.svg',
    'onSolution.svg',
    'offSolution.svg'
];

const actionsIMG = [
    'scene_forests-B.svg',
    'scene_forests-Y.svg',
    'scene_forests-O.svg',
    'scene_forests-C.svg',
    'scene_snowy-B.svg',
    'scene_snowy-Y.svg',
    'scene_snowy-O.svg',
    'scene_snowy-C.svg',
    'scene_oceans-B.svg',
    'scene_oceans-Y.svg',
    'scene_oceans-O.svg',
    'scene_oceans-C.svg',
    'scene_moon-B.svg',
    'scene_moon-Y.svg',
    'scene_moon-O.svg',
    'scene_moon-C.svg'
];

const emit = defineEmits(['btn-action']);

function clickBtn() {
    emit('btn-action', { action: props.nameAction, configBtn: props.configBtn, idx: props.idxBtn });
}

event.on('feedback', () => {
    if (props.nameAction !== 'statement-text' && props.nameAction !== 'open-closed-side' && props.nameAction !== 'show-solution') {
        disabledBtn.value = true;
    }
});
</script>

<style scoped>

</style>
