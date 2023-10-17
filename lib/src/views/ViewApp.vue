<template>
    <StatementPanel
        v-if="showPanelStatementInfo"
        initial-panel
        :title="titleTask"
        :level-task="levelTask"
        :data-statement="dataTask.enunciado"
        :theme-selected="selectTheme"
        @show-statement-info="clickBtn"
    />
    <div
        v-else
        id="container-compu"
        data-testid="container-compu"
        class="w-full h-full flex rounded-[30px]"
        :style="`background-color: ${backgroundApp}`"
    >
        <div
            id="phaser"
            class="w-7/12 h-full flex justify-center items-center"
        >
            <img
                class="absolute z-0 w-[512px]"
                :src="require(`@/assets/img/Mapas/backgrounds/${selectTheme}/bg-${selectTheme}.svg`)"
                alt="imagen de fondo"
            >
            <div
                id="zoneGame"
                class="flex justify-around items-center absolute z-10"
                style="width: 495px;"
            >
                <PhaserComponent
                    :solution-config="solutionConfig"
                    :game-data="dataTask"
                    :theme-selected="selectTheme"
                />
            </div>
        </div>
        <SidePanel
            :title-task="titleTask"
            :solution-config="solutionConfig"
            :show-full-solution-config="showFullSolutionConfig"
            :data-task="dataTask"
            :theme-selected="selectTheme"
        />
        <FeedbackTask
            v-show="onFeedback"
            data-testid="panel-feedback"
            :is-correct="isCorrect"
            :show-feedback-result="onFeedback"
            :data-task="dataTask"
            :background-app="backgroundApp"
            :theme-selected="selectTheme"
            @event-feedback="feedbackActions"
        />
    </div>
</template>

<script setup>
import {
    defineComponent,
    ref,
    computed,
    onMounted
} from 'vue';
import { event } from '@/events';
import { random } from 'lodash';
import { setThemeSelected } from '@/lib/phaser';
import StatementPanel from '@/components/StatementPanel';
import SidePanel from '@/components/SidePanel/SidePanel';
import FeedbackTask from '@/components/Feedback/FeedbackTask';
import PhaserComponent from '@/components/Phaser/PhaserComponent';

defineComponent({
    name: 'ViewApp'
});

const emit = defineEmits(['siguienteIteracion']);

const props = defineProps({
    dataTask: {
        type: Object,
        default: () => ({})
    }
});

const themes = {
    forests: '#D3ED9C',
    snowy: '#B9CEEB',
    oceans: '#A4E5EA',
    moon: '#B7B6B2'
};
const feedback = ref(false);
const isCorrect = ref(false);
const showPanelStatementInfo = ref(true);
const selectTheme = ref(props.dataTask.theme !== '' ? props.dataTask.theme : Object.keys(themes)[random(0, Object.keys(themes).length - 1)]);
const backgroundApp = computed(() => themes[selectTheme.value]);
const nextStep = ref(false);
const onFeedback = ref(false);
const showSolution = ref(false);
const nameEventsActive = [
    'btn-action',
    'feedback',
    'EndMovement',
    'btn-action-feedback',
    'folders',
    'test-task',
    'Responder',
    'load-config',
    'endTime',
    'progress-bar-start',
    'progress-bar-stop',
    'show-solution'
];

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
        img: `scene_${selectTheme.value}-B.svg`,
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'Y',
        direction: 'rotate-0',
        img: `scene_${selectTheme.value}-Y.svg`,
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'O',
        direction: 'rotate-0',
        img: `scene_${selectTheme.value}-O.svg`,
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'C',
        direction: 'rotate-0',
        img: `scene_${selectTheme.value}-C.svg`,
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
const configBtnSolution = [
    {
        name: 'U',
        direction: 'rotate-0',
        img: 'SolutionIcon/Black-U.svg',
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'L',
        direction: 'rotate-0',
        img: 'SolutionIcon/Black-L.svg',
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'R',
        direction: 'rotate-0',
        img: 'SolutionIcon/Black-R.svg',
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'B',
        direction: 'rotate-0',
        img: `scene_${selectTheme.value}-B.svg`,
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'Y',
        direction: 'rotate-0',
        img: `scene_${selectTheme.value}-Y.svg`,
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'O',
        direction: 'rotate-0',
        img: `scene_${selectTheme.value}-O.svg`,
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'C',
        direction: 'rotate-0',
        img: `scene_${selectTheme.value}-C.svg`,
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'F1',
        direction: 'rotate-0',
        img: 'SolutionIcon/Black-F1.svg',
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    },
    {
        name: 'F2',
        direction: 'rotate-0',
        img: 'SolutionIcon/Black-F2.svg',
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    }
];

function clickBtn(value) {
    if (value.action === 'Iniciar') {
        showPanelStatementInfo.value = false;
    }
}

const openClosedFeedback = value => {
    onFeedback.value = value;
};

const nextIteration = () => {
    emit('siguienteIteracion', isCorrect.value);
    nameEventsActive.forEach(name => {
        event.off(name);
    });
};

const feedbackActions = value => {
    if (value === 'closed-feedback') {
        openClosedFeedback(false);
    }
    if (value === 'next-task') {
        nextIteration();
    }
};

const titleTask = computed(() => {
    const typesTitle = {
        hipotesis: 'Hipótesis'
    };
    return typesTitle[props.dataTask.type] ? typesTitle[props.dataTask.type] : 'Título no encontrado';
});

const showFullSolutionConfig = computed(() => {
    const foldersFeedback = [];
    let solutionConfig = props.dataTask.solutionMap.commands.map(btnConfig => {
        if (btnConfig === 'F1') {
            return props.dataTask.solutionMap.function1.map(btnConfigF1 => btnConfigF1);
        }
        if (btnConfig === 'F2') {
            return props.dataTask.solutionMap.function2.map(btnConfigF2 => btnConfigF2);
        }
        return btnConfig;
    });
    solutionConfig = solutionConfig.flat();
    solutionConfig.forEach(solution => {
        const btnItem = configBtnSolution.filter(item => item.name === solution);
        foldersFeedback.push({
            name: btnItem[0].name,
            direction: btnItem[0].direction,
            img: btnItem[0].img,
            styleClass: ['w-7 h-7 rounded-md bg-white flex justify-center items-center cursor-pointer m-0.5']
        });
    });
    return foldersFeedback;
});

const checkDrawnActions = name => {
    const excludeForDrawn = ['C', 'O', 'Y', 'B'];
    return !(excludeForDrawn.includes(name) && !props.dataTask.enunciado.drawn);
};

const solutionConfig = computed(() => {
    const folders = {};
    Object.keys(props.dataTask.solutionMap).forEach(nameBox => {
        folders[nameBox] = [];
        props.dataTask.solutionMap[nameBox].forEach(solution => {
            const btnItem = configBtnFeedback.filter(item => item.name === solution);
            folders[nameBox].push({
                name: btnItem[0].name,
                direction: btnItem[0].direction,
                img: checkDrawnActions(btnItem[0].name) ? btnItem[0].img : `scene_${selectTheme.value}-D.svg`,
                styleClass: ['w-7 h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
            });
        });
    });
    return folders;
});

event.on('check', action => {
    if (action === 'check') {
        feedback.value = true;
    }
});

event.on('btn-action', values => {
    if (values.action === 'Respuesta') {
        openClosedFeedback(true);
    }
    if (values.action === 'Siguientee') {
        if (!nextStep.value) {
            nextStep.value = true;
            nextIteration();
        }
    }
});

event.on('feedback', isCorrectTask => {
    isCorrect.value = isCorrectTask;
});

event.on('show-solution', () => {
    showSolution.value = !showSolution.value;
});

onMounted(() => {
    setThemeSelected(selectTheme.value);
});
</script>

<style>
.font-monserrat {
    font-family: 'Montserrat', sans-serif;
}
</style>
