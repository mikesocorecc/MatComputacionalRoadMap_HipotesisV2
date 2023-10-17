<template>
    <div
        data-testid="feedback-task"
        class="w-full h-full flex flex-col justify-center items-center absolute top-0 left-0 z-30 object-cover bg-feedback"
    >
        <button
            class="w-8 h-8 rounded-full flex justify-center items-center shadow-lg text-lg text-white bg-red-600 absolute top-6 right-6"
            @click.prevent="btnFeedback('closed-feedback')"
        >
            X
        </button>
        <div
            class="w-full h-full flex justify-center items-center pt-2 pb-1"
        >
            <div
                class="w-1/2 h-full flex flex-col justify-center items-end"
            >
                <div
                    class="h-[400px] flex justify-center items-start title-box-left relative"
                >
                    <BoxZoneFeedback
                        color-border="#ED2A2F"
                        :num-folders="dataTask.functionsAvailable"
                        :folders="foldersUser"
                        :max-comandos="maxCommands"
                        :max-function1="maxFunction1"
                        :max-function2="maxFunction2"
                        :theme-selected="themeSelected"
                    />
                </div>
            </div>
            <div class="h-full border-l-4 border-solid border-[#e3e8eb] mx-16" />
            <div
                class="w-1/2 h-full flex flex-col justify-center items-start"
            >
                <div
                    class="h-[400px] flex justify-center items-start title-box-right relative"
                >
                    <BoxZoneFeedback
                        color-border="#00987E"
                        :num-folders="dataTask.functionsAvailable"
                        :folders="foldersFeedback"
                        :max-comandos="maxCommands"
                        :max-function1="maxFunction1"
                        :max-function2="maxFunction2"
                        :theme-selected="themeSelected"
                    />
                </div>
            </div>
        </div>
        <BtnActionTask
            name-action="Siguiente"
            :config-btn="nextTask"
        />
    </div>
</template>

<script setup>
import { computed, defineComponent, ref } from 'vue';
import BtnActionTask from '@/components/SidePanel/components/BtnActionTask';
import BoxZoneFeedback from '@/components/Feedback/BoxZoneFeedback';
import { event } from '@/events';

defineComponent({
    name: 'FeedbackTask'
});

const props = defineProps({
    isCorrect: {
        type: Boolean,
        required: true
    },
    showFeedbackResult: {
        type: Boolean,
        required: true
    },
    dataTask: {
        type: Object,
        required: true
    },
    backgroundApp: {
        type: String,
        default: ''
    },
    themeSelected: {
        type: String,
        default: 'forests'
    }
});

const emit = defineEmits(['event-feedback']);
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
const foldersUser = ref([]);
const foldersFeedback = ref([]);
const btnFeedback = action => {
    emit('event-feedback', action);
};

const nextTask = {
    name: 'next-task',
    direction: 'rotate-0',
    img: '',
    styleClass: ['w-2/12 rounded-full bg-[#FFAA01] text-white flex justify-center items-center cursor-pointer py-1 my-2 text-lg font-semibold']
};

const configBtnFeedback = [
    {
        name: 'U',
        direction: 'rotate-0',
        img: 'U.svg',
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'L',
        direction: 'rotate-0',
        img: 'L.svg',
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'R',
        direction: 'rotate-0',
        img: 'R.svg',
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'B',
        direction: 'rotate-0',
        img: `scene_${props.themeSelected}-B.svg`,
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'Y',
        direction: 'rotate-0',
        img: `scene_${props.themeSelected}-Y.svg`,
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'O',
        direction: 'rotate-0',
        img: `scene_${props.themeSelected}-O.svg`,
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'C',
        direction: 'rotate-0',
        img: `scene_${props.themeSelected}-C.svg`,
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'F1',
        direction: 'rotate-0',
        img: 'F1.svg',
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'F2',
        direction: 'rotate-0',
        img: 'F2.svg',
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    }
];

event.on('folders', foldersItems => {
    foldersUser.value = [...foldersItems];
});

event.on('btn-action-feedback', orderSolutionFeedback => {
    Object.keys(orderSolutionFeedback).forEach(data => {
        foldersFeedback.value.push({
            nameId: data,
            folderItems: []
        });
        orderSolutionFeedback[data].forEach(solution => {
            const btnItem = configBtnFeedback.filter(item => item.name === solution);
            if (data === 'commands') {
                foldersFeedback.value[0].folderItems.push({
                    name: btnItem[0].name,
                    direction: btnItem[0].direction,
                    img: btnItem[0].img,
                    styleClass: btnItem[0].styleClass
                });
            }
            if (data === 'function1') {
                foldersFeedback.value[1].folderItems.push({
                    name: btnItem[0].name,
                    direction: btnItem[0].direction,
                    img: btnItem[0].img,
                    styleClass: btnItem[0].styleClass
                });
            }
            if (data === 'function2') {
                foldersFeedback.value[2].folderItems.push({
                    name: btnItem[0].name,
                    direction: btnItem[0].direction,
                    img: btnItem[0].img,
                    styleClass: btnItem[0].styleClass
                });
            }
        });
    });
    event.emit('feedbackBtnSolution', foldersFeedback.value);
});
</script>

<style scoped>
.bg-feedback {
    background-image: url('@/assets/img/fondo-feedback.svg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    border-radius: 30px;
}
.title-box-left:before {
    content: 'Tu respuesta';
    display: flex;
    flex-flow: column wrap;
    justify-content: start;
    align-items: center;
    position: absolute;
    background-color: #ED2A2F;
    color: white;
    width: 120px;
    min-height: 95px;
    top: 1.25rem;
    left: -120px;
    font-family: 'Montserrat',serif;
    font-style: normal;
    font-weight: 700;
    font-size: 17px;
    line-height: 21px;
    text-align: right;
    border-radius: 15px 0 0 15px;
    padding: 1rem;
}

.title-box-right:before {
    content: 'Una respuesta correcta';
    display: flex;
    flex-flow: column wrap;
    justify-content: start;
    align-items: center;
    position: absolute;
    background-color: #00987E;
    color: white;
    width: 120px;
    min-height: 95px;
    top: 1.25rem;
    right: -120px;
    font-family: 'Montserrat',serif;
    font-style: normal;
    font-weight: 700;
    font-size: 17px;
    line-height: 21px;
    text-align: left;
    border-radius: 0px 15px 15px 0px;
    padding: 1rem;
}
</style>
