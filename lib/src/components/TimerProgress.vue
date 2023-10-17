<template>
    <div class="w-full flex justify-center items-center bg-[#EFF3FB] rounded-[15px] mt-3 mx-3 py-3.5 font-monserrat">
        <div
            v-if="isProgressBar"
            class="w-full flex flex-col justify-center items-center"
        >
            <span class="text-lg leading-5 font-semibold text-[#6A7680] pb-1">Tiempo</span>
            <div
                class="w-11/12 h-7 bg-[#FFF1BE] rounded-full relative z-0 overflow-hidden"
            >
                <div
                    class="absolute top-0 left-0 h-7 bg-gradient-to-r from-[#FF5601] to-[#FFAA01] z-10 rounded-r-full timer-progress"
                    :style="`width: ${progress}%`"
                />
            </div>
        </div>
        <div
            v-else
            class="w-full flex flex justify-center items-center"
        >
            <span class="w-5/12 text-lg leading-5 font-semibold text-[#6A7680] text-center">Tiempo</span>
            <span
                :key="timeActual"
                class="w-5/12 text-lg leading-5 font-bold text-black text-center"
            >{{ textTimer }}</span>
        </div>
    </div>
</template>

<script setup>
import {
    defineComponent, computed, ref, reactive, onMounted
} from 'vue';
import { event } from '@/events';

defineComponent({ name: 'TimerProgress' });

const props = defineProps({
    isProgressBar: {
        type: Boolean,
        default: false
    },
    simplifySeconds: {
        type: Number,
        default: 0
    },
    componentId: {
        type: String,
        default: 'TimerProgress'
    },
    duration: {
        type: Number,
        required: true
    },
    direction: {
        type: String,
        default: 'back'
    },
    isTestActive: {
        type: Boolean,
        default: false
    }
});

// Toda esta parte pertenece al modo reloj

let values = '';
const fromMinute = reactive({
    width: 0
});

const formatTime = time => {
    let str = '';
    if (time >= 60) {
        if (parseInt(`${time / 60}`, 10) > 9) str += `${parseInt(`${time / 60}`, 10)}:`;
        else str += `0${parseInt(`${time / 60}`, 10)}:`;

        if (time % 60 < 10) str += `0${time % 60}`;
        else str += time % 60;
    } else {
        str += '00:';
        if (time < 10) str += `0${time}`;
        else str += time;
    }
    return str;
};

const timeActual = computed(() => {
    if (props.direction === 'back') {
        return Math.abs(props.simplifySeconds - fromMinute.width);
    }
    return fromMinute.width;
});

const textTimer = computed(() => {
    const actual = Math.floor(Number(timeActual.value));
    return formatTime(actual);
});

const returnTime = () => {
    values = setInterval(() => {
        if (fromMinute.width === props.simplifySeconds && !props.isTestActive) {
            clearInterval(values);
            event.emit('endTime');
        } else if (fromMinute.width < props.simplifySeconds) {
            fromMinute.width += 1;
        }
    }, 1000);
};

// Toda esta parte pertenece al modo ProgressBar

const progress = ref(0);
const initProgress = ref(null);
const animationProgress = ref(null);
const isChecking = ref(false);

const returnProgress = timestamp => {
    if (isChecking.value) {
        cancelAnimationFrame(animationProgress.value);
        return;
    }
    if (!initProgress.value) initProgress.value = timestamp;
    const elapsedTime = timestamp - initProgress.value;
    const percentageCompleted = (elapsedTime / props.duration) * 100;
    if (percentageCompleted >= 100 && !props.isTestActive) {
        event.emit('endTime');
        cancelAnimationFrame(animationProgress.value);
    }
    if (percentageCompleted < 100) {
        progress.value = percentageCompleted;
        animationProgress.value = requestAnimationFrame(returnProgress);
    } else {
        animationProgress.value = requestAnimationFrame(returnProgress);
    }
};

// Toda esta parte es la inicialización del componente
const startTime = () => {
    if (props.isProgressBar) {
        animationProgress.value = requestAnimationFrame(returnProgress);
    } else {
        returnTime();
    }
};

event.on('btn-action', btnAction => {
    if (btnAction.action === 'Responder') {
        isChecking.value = true;
        cancelAnimationFrame(animationProgress.value);
        clearInterval(values);
    }
});

onMounted(() => {
    startTime();
});
</script>

<style scoped>
.timerProgress {
    width: 0;
    transition: width 1s;
}
</style>
