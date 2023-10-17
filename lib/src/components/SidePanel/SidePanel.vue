<template>
    <div
        class="w-5/12 h-full bg-white flex rounded-r-[30px] relative z-10"
    >
        <div
            data-testid="panel-box"
            class="w-[50%] h-full flex flex-col justify-start items-center relative"
        >
            <div class="w-full flex justify-center items-center">
                <timer-progress
                    component-id="progressbar"
                    :is-progress-bar="dataTask.duration <= 60000"
                    :duration="dataTask.duration"
                    :simplify-seconds="dataTask.duration / 1000"
                    :is-test-active="disabledBtn"
                />
            </div>
            <div
                class="w-full h-full flex justify-center items-start mb-2"
            >
                <BoxZone
                    :type-task="dataTask.type"
                    :solution-task="solutionConfig"
                    :num-folders="dataTask.functionsAvailable"
                    :max-comandos="maxCommands"
                    :max-function1="maxFunction1"
                    :max-function2="maxFunction2"
                    :disabled-btn="disabledBtn"
                    :theme-selected="themeSelected"
                />
            </div>
        </div>
        <div
            class="w-[50%] h-full flex flex-col justify-between items-center"
        >
            <div
                class="w-full h-full flex flex-col justify-start items-center"
            >
                <div class="bg-[#FFF1BE] w-full text-sm rounded-l-[15px] flex justify-center items-center mt-3 mb-4 py-2">
                    <span class="w-11/12">{{ dataTask.enunciado.title }}</span>
                </div>
                <StatementQuestions
                    :questions="dataTask.enunciado.questions"
                    :show-order="dataTask.enunciado.showOrder"
                />
            </div>
            <!-- Zona de botones para la entrega de la tarea-->
            <div
                class="w-full flex flex-col justify-end items-center mb-4"
            >
                <BtnActionTask
                    v-if="feedback"
                    name-action="Siguiente"
                    :config-btn="nextTask"
                />
                <BtnActionTask
                    v-if="!feedback"
                    name-action="Responder"
                    :config-btn="checkTask"
                    :disabled-btn="disabledBtn"
                />
            </div>
        </div>
    </div>
    <StatementPanel
        v-if="showStatement"
        :title="titleTask"
        :data-statement="dataTask.enunciado"
        :theme-selected="themeSelected"
        @show-statement-info="clickBtn"
    />
</template>

<script setup>
import { defineComponent, ref, computed } from 'vue';
import { event } from '@/events';
import StatementPanel from '@/components/StatementPanel';
import BtnActionTask from '@/components/SidePanel/components/BtnActionTask';
import BoxZone from '@/components/SidePanel/components/BoxZone';
import TimerProgress from '@/components/TimerProgress';
import StatementQuestions from '@/components/StatementQuestions.vue';

defineComponent({
    name: 'SidePanel'
});

const props = defineProps({
    solutionConfig: {
        type: Object,
        required: true
    },
    showFullSolutionConfig: {
        type: Object,
        default: () => ({})
    },
    titleTask: {
        type: String,
        required: true
    },
    dataTask: {
        type: Object,
        required: true
    },
    themeSelected: {
        type: String,
        default: 'forests'
    }
});

const maxCommands = computed(() => {
    let max;
    if (props.dataTask.functionsAvailable === 0) {
        max = props.dataTask.maxComandos !== 0 ? props.dataTask.maxComandos : 48;
    }
    if (props.dataTask.functionsAvailable === 1) {
        max = props.dataTask.maxComandos !== 0 ? props.dataTask.maxComandos : 24;
    }
    if (props.dataTask.functionsAvailable === 2) {
        max = props.dataTask.maxComandos !== 0 ? props.dataTask.maxComandos : 12;
    }
    return Number(max);
});
const maxFunction1 = computed(() => {
    let max;
    if (props.dataTask.functionsAvailable === 0) {
        max = props.dataTask.maxFunction1 !== 0 ? props.dataTask.maxFunction1 : 0;
    }
    if (props.dataTask.functionsAvailable === 1) {
        max = props.dataTask.maxFunction1 !== 0 ? props.dataTask.maxFunction1 : 24;
    }
    if (props.dataTask.functionsAvailable === 2) {
        max = props.dataTask.maxFunction1 !== 0 ? props.dataTask.maxFunction1 : 12;
    }
    return Number(max);
});
const maxFunction2 = computed(() => {
    let max;
    if (props.dataTask.functionsAvailable === 0) {
        max = props.dataTask.maxFunction2 !== 0 ? props.dataTask.maxFunction2 : 0;
    }
    if (props.dataTask.functionsAvailable === 1) {
        max = props.dataTask.maxFunction2 !== 0 ? props.dataTask.maxFunction2 : 24;
    }
    if (props.dataTask.functionsAvailable === 2) {
        max = props.dataTask.maxFunction2 !== 0 ? props.dataTask.maxFunction2 : 12;
    }
    return Number(max);
});
const showBox = ref(false);
const showStatement = ref(false);
const showBtnSolution = ref(false);
const feedback = ref(false);
const isCorrect = ref(false);
const testActive = ref(false);

const checkTask = {
    name: 'check-task',
    direction: 'rotate-0',
    img: '',
    styleClass: ['w-10/12 rounded-full bg-[#FFAA01] text-white flex justify-center items-center cursor-pointer py-2 mt-2 text-[16px] font-semibold border-2 border-solid border-[#FFAA01]']
};
const nextTask = {
    name: 'next-task',
    direction: 'rotate-0',
    img: '',
    styleClass: ['w-10/12 rounded-full bg-[#FFAA01] text-white flex justify-center items-center cursor-pointer py-2 mt-2 text-[16px] font-semibold border-2 border-solid border-[#FFAA01]']
};

const disabledBtn = ref(false);

function clickBtn(value) {
    if (value.action === 'open-closed-side') {
        showBox.value = !showBox.value;
    }
    if (value.action === 'statement-text') {
        showStatement.value = !showStatement.value;
    }
    if (value.action === 'show-solution') {
        showBtnSolution.value = !showBtnSolution.value;
        event.emit('show-solution');
    }
}

event.on('endTime', () => {
    disabledBtn.value = true;
});

event.on('btn-action', btnAction => {
    if (btnAction.action === 'test-task' || btnAction.action === 'Responder') {
        disabledBtn.value = true;
    }
    if (btnAction.action === 'addBtn' && !showBox.value) {
        showBox.value = true;
    }
});

event.on('feedback', isCorrectFeedback => {
    feedback.value = true;
    isCorrect.value = isCorrectFeedback;
});

event.on('test-task', () => {
    testActive.value = true;
});

event.on('EndMovement', () => {
    testActive.value = false;
    disabledBtn.value = false;
});
</script>
